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
exports.checkDbConnection = exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables
// Cache the connection to prevent multiple connections in dev mode
let cachedConnection = null;
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    // Return cached connection if available
    if (cachedConnection) {
        console.log('Using existing database connection');
        return cachedConnection;
    }
    // Validate environment variable
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
        console.error('MongoDB connection URL not found in environment variables');
        throw new Error('Database configuration error');
    }
    try {
        // Establish new connection
        const connection = yield mongoose_1.default.connect(mongoUrl);
        console.log('MongoDB connected successfully');
        // Cache the connection
        cachedConnection = connection;
        // Handle connection events
        mongoose_1.default.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });
        mongoose_1.default.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });
        // Graceful shutdown
        process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
            yield mongoose_1.default.connection.close();
            console.log('Mongoose connection closed through app termination');
            process.exit(0);
        }));
        return connection;
    }
    catch (err) {
        console.error('MongoDB connection error:', err);
        if (process.env.NODE_ENV === 'production') {
            process.exit(1); // Exit the process if we're in production and MongoDB fails to connect
        }
        throw err; // Re-throw the error to be handled by the calling function
    }
});
exports.dbConnect = dbConnect;
// Helper function to check if MongoDB is connected
const checkDbConnection = () => {
    return mongoose_1.default.connection.readyState === 1;
};
exports.checkDbConnection = checkDbConnection;
