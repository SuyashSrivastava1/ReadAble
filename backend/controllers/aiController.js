import History from "../models/History.js";
import { simplifyTextWithAI, translateTextWithAI } from "../services/aiService.js";
import {
  calculateReadingImprovementPercent,
  estimateReadingGrade,
  formatReadingLevel,
} from "../utils/readingLevel.js";

export const simplifyText = async (req, res, next) => {
  try {
    const { text, readingProfile = "standard" } = req.body;

    const result = await simplifyTextWithAI(text, readingProfile);
    const originalReadingGrade = estimateReadingGrade(text);
    const simplifiedReadingGrade = estimateReadingGrade(result.simplified);
    const originalReadingLevel = formatReadingLevel(originalReadingGrade);
    const simplifiedReadingLevel = formatReadingLevel(simplifiedReadingGrade);
    const improvementPercent = calculateReadingImprovementPercent(
      originalReadingGrade,
      simplifiedReadingGrade,
    );

    let historyId = null;

    if (req.user?.id) {
      const entry = await History.create({
        user: req.user.id,
        inputText: text,
        simplified: result.simplified,
        summary: result.summary,
        readingLevel: simplifiedReadingLevel,
        originalReadingLevel,
        simplifiedReadingLevel,
        improvementPercent,
        readingProfile,
      });
      historyId = entry._id;
    }

    return res.status(200).json({
      simplified: result.simplified,
      summary: result.summary,
      readingLevel: simplifiedReadingLevel,
      originalReadingLevel,
      simplifiedReadingLevel,
      improvementPercent,
      readingProfile,
      historyId,
    });
  } catch (error) {
    return next(error);
  }
};

export const translateText = async (req, res, next) => {
  try {
    const { text, targetLanguage, historyId } = req.body;
    const translated = await translateTextWithAI(text, targetLanguage);

    if (req.user?.id && historyId) {
      const history = await History.findOne({ _id: historyId, user: req.user.id });
      if (history) {
        history.translations.set(targetLanguage, translated);
        await history.save();
      }
    }

    return res.status(200).json({
      translated,
      targetLanguage,
    });
  } catch (error) {
    return next(error);
  }
};
