import express from "express";
import { sendMessage } from "../controllers/contactControllers.js"

const router = express.Router();

// Route for contact form message
router.post("/send", sendMessage);

export default router;
