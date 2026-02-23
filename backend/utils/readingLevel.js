const countSyllables = (word) => {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!cleaned) {
    return 1;
  }
  if (cleaned.length <= 3) {
    return 1;
  }

  const withoutSilentE = cleaned.replace(/e$/, "");
  const groups = withoutSilentE.match(/[aeiouy]{1,2}/g);
  return Math.max(groups ? groups.length : 1, 1);
};

export const estimateReadingGrade = (text) => {
  const sentences = Math.max((text.match(/[.!?]+/g) || []).length, 1);
  const words = (text.match(/\b[\w'-]+\b/g) || []).length;
  if (!words) {
    return 1;
  }
  const syllables = (text.match(/\b[\w'-]+\b/g) || []).reduce(
    (sum, word) => sum + countSyllables(word),
    0,
  );

  const grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59;
  return Math.max(1, Math.round(grade * 10) / 10);
};

export const formatReadingLevel = (grade) => {
  const normalizedGrade = Math.max(1, Math.round(Number(grade || 1) * 10) / 10);

  if (normalizedGrade <= 3) {
    return `Very easy (Grade ${normalizedGrade})`;
  }
  if (normalizedGrade <= 6) {
    return `Easy (Grade ${normalizedGrade})`;
  }
  if (normalizedGrade <= 8) {
    return `Moderate (Grade ${normalizedGrade})`;
  }
  if (normalizedGrade <= 12) {
    return `Advanced (Grade ${normalizedGrade})`;
  }
  return `Complex (Grade ${normalizedGrade})`;
};

export const estimateReadingLevel = (text) => {
  const grade = estimateReadingGrade(text);
  return formatReadingLevel(grade);
};

export const calculateReadingImprovementPercent = (originalGrade, simplifiedGrade) => {
  const safeOriginal = Math.max(Number(originalGrade || 1), 0.1);
  const safeSimplified = Math.max(Number(simplifiedGrade || 1), 0.1);
  const percent = ((safeOriginal - safeSimplified) / safeOriginal) * 100;
  return Math.round(percent * 10) / 10;
};
