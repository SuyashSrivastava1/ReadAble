import History from "../models/History.js";
import mongoose from "mongoose";

export const getHistory = async (req, res, next) => {
  try {
    const entries = await History.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.status(200).json({ history: entries });
  } catch (error) {
    return next(error);
  }
};

export const deleteHistoryItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("Invalid history id");
      error.statusCode = 400;
      return next(error);
    }

    const deleted = await History.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deleted) {
      const error = new Error("History item not found");
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      message: "History item deleted",
      id,
    });
  } catch (error) {
    return next(error);
  }
};
