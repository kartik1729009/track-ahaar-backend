"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = __importDefault(require("../models/models"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const existingUser = yield models_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists, please login",
            });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const userInfo = yield models_1.default.create({
            fullName,
            email,
            password: hashedPassword,
        });
        res.status(200).json({
            success: true,
            message: "User created successfully",
            data: userInfo
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: err
        });
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Both email and password are required",
            });
            return;
        }
        const user = yield models_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found, please register",
            });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
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
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" });
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err
        });
    }
});
exports.login = login;
