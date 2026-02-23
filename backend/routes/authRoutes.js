import express from "express";
import { login, register } from "../controllers/authController.js";
import validateRequest from "../middleware/validateRequest.js";
import { loginValidation, registerValidation } from "../middleware/validators.js";

const router = express.Router();

router.post("/register", registerValidation, validateRequest, register);
router.post("/login", loginValidation, validateRequest, login);

export default router;
