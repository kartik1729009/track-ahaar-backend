import orders from "../models/food";
import { Request, Response } from "express";
import dotenv from 'dotenv'
import { Document } from 'mongoose';
dotenv.config();
export const postfoood = async (req: Request, res: Response): Promise<void> => {
    try {
        const { foodorder } = req.body;

        if (!foodorder) {
            res.status(400).json({
                success: false,
                message: "No food in input, can't call this function",
            });
            return;
        }

        const foods = await orders.create({ order: foodorder });

        res.status(201).json({
            success: true,
            message: "Order saved successfully",
            data: foods,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Some error occurred",
        });
    }
};


export const getfood = async (req: Request, res: Response) => {
    try {
        // Fetch all food items from the Food collection
        const allFoods = await orders.find();

        // Check if no food items are found
        if (allFoods.length === 0) {
            res.status(404).json({
                success: false,
                message: "No food items found",
            });
            return;
        }

        // Respond with all food items
        res.status(200).json({
            success: true,
            message: "Fetched all food items successfully",
            data: allFoods,  // This contains the list of food items
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Some error occurred while fetching food items",
        });
    }
};