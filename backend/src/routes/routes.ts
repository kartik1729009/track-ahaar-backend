import express, { RequestHandler } from 'express'
const router = express.Router();
import {login, createUser} from '../controller/auth'
import { postfoood, getfood } from "../controller/foodauth";
import { postMessage, getMessages } from "../controller/message";
router.post("/message", postMessage);
router.get("/message", getMessages);
router.post("/food", postfoood);
router.get("/food", getfood);
router.post("/createuser", createUser);
router.post("/login", login);

export default router;