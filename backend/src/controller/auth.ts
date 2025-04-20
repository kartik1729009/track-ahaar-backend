import { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/models"; 


export const createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, password } = req.body;
        
        // Validate required fields
        if (!fullName || !email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields (fullName, email, password) are required",
            });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists, please login",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const userInfo = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        res.status(200).json({
            success: true,
            message: "User created successfully",
            data: userInfo
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: err
        });
    }
}


export const login: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Both email and password are required",
            });
            return;
        }
        
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found, please register",
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: "Incorrect password",
            });
            return;
        }

        const payload = {
            email: user.email,
            id: user._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "2h" });
        
        const options = {
            expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // Fixed: added milliseconds
            httpOnly: true,
        };

        res.cookie("token1", token, options);
        res.status(200).json({ 
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName
            },
            message: "Login successful", 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err
        });
    }
}