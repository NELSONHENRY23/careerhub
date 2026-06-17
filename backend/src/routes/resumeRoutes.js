import express from "express";
import {
  createMyResume,
  getMyResume,
  deleteMyResume,
  updateMyResume,
} from "../controllers/resumeControllers.js";
import { authMiddleware } from "../middleware/authmiddleware.js";


const router = express.Router();

router.post("/", authMiddleware, createMyResume)
router.get("/me", authMiddleware, getMyResume);
router.put("/me",authMiddleware, updateMyResume);
router.delete("/me", authMiddleware, deleteMyResume);

export default router;