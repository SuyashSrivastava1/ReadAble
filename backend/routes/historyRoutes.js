import express from "express";
import { deleteHistoryItem, getHistory } from "../controllers/historyController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", requireAuth, getHistory);
router.delete("/:id", requireAuth, deleteHistoryItem);

export default router;
