"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../controller/auth");
const foodauth_1 = require("../controller/foodauth");
const message_1 = require("../controller/message");
router.post("/message", message_1.postMessage);
router.get("/message", message_1.getMessages);
router.post("/food", foodauth_1.postfoood);
router.get("/food", foodauth_1.getfood);
router.post("/createuser", auth_1.createUser);
router.post("/login", auth_1.login);
exports.default = router;
