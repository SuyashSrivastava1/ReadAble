import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    inputText: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    simplified: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    readingLevel: {
      type: String,
      required: true,
    },
    originalReadingLevel: {
      type: String,
      default: "",
    },
    simplifiedReadingLevel: {
      type: String,
      default: "",
    },
    improvementPercent: {
      type: Number,
      default: 0,
    },
    readingProfile: {
      type: String,
      enum: ["child", "standard", "neurodivergent", "elderly", "academic"],
      default: "standard",
    },
    translations: {
      type: Map,
      of: String,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

const History = mongoose.model("History", historySchema);

export default History;
