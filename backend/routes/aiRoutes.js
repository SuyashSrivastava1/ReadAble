import express from "express";
import rateLimit from "express-rate-limit";
import { simplifyText, translateText } from "../controllers/aiController.js";
import { optionalAuth } from "../middleware/auth.js";
import validateRequest from "../middleware/validateRequest.js";
import { simplifyValidation, translateValidation } from "../middleware/validators.js";

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Try again in one minute." },
});

router.post("/simplify", aiLimiter, optionalAuth, simplifyValidation, validateRequest, simplifyText);
router.post("/translate", aiLimiter, optionalAuth, translateValidation, validateRequest, translateText);

export default router;
