import express from "express";
import { upload } from "../utils/upload.js";
import {
uploadExcel,
getQueuedEmails,
sendBulkEmails,
} from "../controllers/mailcontroller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Upload Excel
router.post(
"/upload",
protect,
upload.single("file"), // field name must be "file"
uploadExcel
);

// Get queued emails
router.get("/queue", protect, getQueuedEmails);

// Send emails
router.post("/send", protect, sendBulkEmails);

export default router;