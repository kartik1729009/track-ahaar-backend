import { Request, Response } from "express";
import messages from "../models/message";
import dotenv from 'dotenv'
import { Document } from 'mongoose';
dotenv.config();
export const postMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { message } = req.body;

        if (!message) {
            res.status(400).json({
                success: false,
                message: "Message is required",
            });
            return;
        }

        const savedMessage = await messages.create({ message });

        res.status(201).json({
            success: true,
            message: "Message saved successfully",
            data: savedMessage,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong while saving the message",
        });
    }
};
export const getMessages = async (req: Request, res: Response) => {
    try {
        const allMessages = await messages.find().select('message');

        res.status(200).json({
            success: true,
            message: "Fetched all messages",
            data: allMessages,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong while fetching messages",
        });
    }
};