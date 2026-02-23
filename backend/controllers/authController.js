import jwt from "jsonwebtoken";
import User, { hashPassword } from "../models/User.js";

const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      const error = new Error("Email is already in use");
      error.statusCode = 409;
      return next(error);
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name: name || "ReadAble User",
      email,
      password: passwordHash,
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    const passwordValid = await user.comparePassword(password);
    if (!passwordValid) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    const token = signToken(user);
    return res.status(200).json({
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};
