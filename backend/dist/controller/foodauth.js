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
exports.getfood = exports.postfoood = void 0;
const food_1 = __importDefault(require("../models/food"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const postfoood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { foodorder } = req.body;
        if (!foodorder) {
            res.status(400).json({
                success: false,
                message: "No food in input, can't call this function",
            });
            return;
        }
        const foods = yield food_1.default.create({ order: foodorder });
        res.status(201).json({
            success: true,
            message: "Order saved successfully",
            data: foods,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Some error occurred",
        });
    }
});
exports.postfoood = postfoood;
const getfood = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all food items from the Food collection
        const allFoods = yield food_1.default.find();
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
            data: allFoods, // This contains the list of food items
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Some error occurred while fetching food items",
        });
    }
});
exports.getfood = getfood;
