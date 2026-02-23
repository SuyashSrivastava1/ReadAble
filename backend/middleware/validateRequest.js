import { validationResult } from "express-validator";

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const error = new Error(
    errors
      .array()
      .map((item) => item.msg)
      .join(", "),
  );
  error.statusCode = 400;
  return next(error);
};

export default validateRequest;
