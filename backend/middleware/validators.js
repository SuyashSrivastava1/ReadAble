import { body } from "express-validator";

const supportedLanguages = ["english", "spanish", "hindi", "french"];
const supportedReadingProfiles = [
  "child",
  "standard",
  "neurodivergent",
  "elderly",
  "academic",
];

export const simplifyValidation = [
  body("text")
    .isString()
    .withMessage("Text must be a string")
    .trim()
    .notEmpty()
    .withMessage("Text cannot be empty")
    .isLength({ max: 5000 })
    .withMessage("Text must be 5000 characters or fewer"),
  body("readingProfile")
    .optional()
    .isString()
    .withMessage("Reading profile must be a string")
    .trim()
    .toLowerCase()
    .isIn(supportedReadingProfiles)
    .withMessage(
      `Reading profile must be one of: ${supportedReadingProfiles.join(", ")}`,
    ),
];

export const translateValidation = [
  body("text")
    .isString()
    .withMessage("Text must be a string")
    .trim()
    .notEmpty()
    .withMessage("Text cannot be empty")
    .isLength({ max: 5000 })
    .withMessage("Text must be 5000 characters or fewer"),
  body("targetLanguage")
    .isString()
    .withMessage("Target language is required")
    .trim()
    .toLowerCase()
    .isIn(supportedLanguages)
    .withMessage(`Target language must be one of: ${supportedLanguages.join(", ")}`),
  body("historyId")
    .optional()
    .isMongoId()
    .withMessage("historyId must be a valid id"),
];

export const registerValidation = [
  body("name")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be 2-60 characters"),
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("password")
    .isString()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be 8-128 characters"),
];

export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("password").isString().withMessage("Password is required"),
];
