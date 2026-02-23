import OpenAI from "openai";
import { estimateReadingLevel } from "../utils/readingLevel.js";

const SYSTEM_PROMPT =
  "You are an accessibility assistant. Rewrite complex text into clearer language for the selected reading profile while keeping the original meaning, legal duties, dates, names, and numbers accurate.";

const LANGUAGE_MAP = {
  english: "English",
  spanish: "Spanish",
  hindi: "Hindi",
  french: "French",
};

const READING_PROFILE_CONFIG = {
  child: {
    id: "child",
    label: "Child (Grade 3-5)",
    tone: "Warm, friendly, and encouraging",
    sentenceLength: "Very short, around 8-12 words",
    vocabulary: "Grade 3-5 everyday words with no jargon",
    structureStyle: "Simple short paragraphs with concrete examples",
    maxWordsPerSentence: 10,
    maxAcceptedWordsPerSentence: 14,
    similarityThreshold: 0.9,
    structureMode: "paragraph",
  },
  standard: {
    id: "standard",
    label: "Standard adult simplified",
    tone: "Neutral, direct, and practical",
    sentenceLength: "Short, around 10-16 words",
    vocabulary: "Plain modern words with light simplification",
    structureStyle: "Concise paragraphs with clear flow",
    maxWordsPerSentence: 14,
    maxAcceptedWordsPerSentence: 20,
    similarityThreshold: 0.93,
    structureMode: "paragraph",
  },
  neurodivergent: {
    id: "neurodivergent",
    label: "Neurodivergent",
    tone: "Calm, literal, and predictable",
    sentenceLength: "Very short, around 6-10 words",
    vocabulary: "Concrete literal words, avoid idioms",
    structureStyle: "One idea per line with explicit phrasing",
    maxWordsPerSentence: 9,
    maxAcceptedWordsPerSentence: 13,
    similarityThreshold: 0.9,
    structureMode: "line-break",
  },
  elderly: {
    id: "elderly",
    label: "Elderly",
    tone: "Respectful, patient, and reassuring",
    sentenceLength: "Short, around 10-14 words",
    vocabulary: "Familiar words with clear transitions",
    structureStyle: "Short paragraphs with clear key points",
    maxWordsPerSentence: 12,
    maxAcceptedWordsPerSentence: 17,
    similarityThreshold: 0.92,
    structureMode: "paragraph",
  },
  academic: {
    id: "academic",
    label: "Academic",
    tone: "Formal but clear",
    sentenceLength: "Moderate, around 14-20 words",
    vocabulary: "Keep technical terms but clarify dense phrases",
    structureStyle: "Structured paragraphs with explicit connectors",
    maxWordsPerSentence: 18,
    maxAcceptedWordsPerSentence: 24,
    similarityThreshold: 0.96,
    structureMode: "paragraph",
  },
};

const getReadingProfileConfig = (readingProfile) =>
  READING_PROFILE_CONFIG[readingProfile] || READING_PROFILE_CONFIG.standard;

const STANDARD_REPLACEMENTS = [
  [
    /\bnotwithstanding the provisions set forth (?:herein|in this document)\b/gi,
    "even if this document says otherwise",
  ],
  [/\bnotwithstanding\b/gi, "even if"],
  [/\bherein\b/gi, "in this document"],
  [/\bhereby\b/gi, "by this"],
  [/\bthereof\b/gi, "of that"],
  [/\btherein\b/gi, "in that"],
  [/\bpursuant to\b/gi, "under"],
  [/\baforementioned\b/gi, "mentioned earlier"],
  [/\bshall\b/gi, "must"],
  [/\bremit payment\b/gi, "pay"],
  [/\bin the event that\b/gi, "if"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bfor the purpose of\b/gi, "to"],
  [/\bnull and void\b/gi, "not valid"],
  [/\bcommence\b/gi, "start"],
  [/\bterminate\b/gi, "end"],
  [/\butilize\b/gi, "use"],
  [/\bapproximately\b/gi, "about"],
  [/\bsubsequent to\b/gi, "after"],
  [/\bprior to\b/gi, "before"],
  [/\bassist(?:ance)?\b/gi, "help"],
  [/\bindividuals\b/gi, "people"],
  [/\bpurchase\b/gi, "buy"],
  [/\bmodification\b/gi, "change"],
  [/\bfacilitate\b/gi, "help"],
  [/\bnotify\b/gi, "tell"],
  [/\binform\b/gi, "tell"],
  [/\bcommencement date\b/gi, "start date"],
  [/\bcease\b/gi, "stop"],
  [/\bobtain\b/gi, "get"],
  [/\binitiate\b/gi, "start"],
  [/\blessee\b/gi, "renter"],
  [/\blessor\b/gi, "owner"],
  [/\bfailing which\b/gi, "if this does not happen"],
  [/\bnumerous\b/gi, "many"],
  [/\btherefore\b/gi, "so"],
  [/\bconsequently\b/gi, "so"],
  [/\bdiagnosis\b/gi, "health problem"],
  [/\bmedication\b/gi, "medicine"],
  [/\badverse effects\b/gi, "side effects"],
  [/\bcontraindicated\b/gi, "not safe to use"],
  [/\bhypertension\b/gi, "high blood pressure"],
  [/\bmyocardial infarction\b/gi, "heart attack"],
  [/\bstatute\b/gi, "law"],
  [/\bordinance\b/gi, "local law"],
  [/\bjurisdiction\b/gi, "legal area"],
];

const ACADEMIC_REPLACEMENTS = [
  [/\bnotwithstanding\b/gi, "despite this"],
  [/\bpursuant to\b/gi, "under"],
  [/\bin the event that\b/gi, "if"],
  [/\bdue to the fact that\b/gi, "because"],
  [/\bfor the purpose of\b/gi, "to"],
  [/\bcommence\b/gi, "begin"],
  [/\bterminate\b/gi, "end"],
  [/\bsubsequent to\b/gi, "after"],
  [/\bprior to\b/gi, "before"],
];

const EXTRA_SIMPLE_REPLACEMENTS = [
  [/\bcommence\b/gi, "start"],
  [/\bapproximately\b/gi, "about"],
  [/\bindividuals\b/gi, "people"],
  [/\bassist(?:ance)?\b/gi, "help"],
  [/\bregarding\b/gi, "about"],
  [/\btherefore\b/gi, "so"],
];

const MODEL_FALLBACKS = ["gpt-4o-mini", "gpt-4.1-mini"];

const normalizeWhitespace = (text) =>
  text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const normalizeForCompare = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const DOT_PLACEHOLDER = "__READABLE_DOT__";

const protectNumericDots = (text) => text.replace(/(\d)\.(\d)/g, `$1${DOT_PLACEHOLDER}$2`);
const restoreNumericDots = (text) => text.replaceAll(DOT_PLACEHOLDER, ".");

const sentenceList = (text) =>
  protectNumericDots(text)
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => restoreNumericDots(sentence).trim())
    .filter(Boolean);

const unique = (list) => [...new Set(list.filter(Boolean))];

const simplifyVocabulary = (text, readingProfile = "standard") => {
  const profile = getReadingProfileConfig(readingProfile);
  let replacements =
    profile.id === "academic" ? [...ACADEMIC_REPLACEMENTS] : [...STANDARD_REPLACEMENTS];

  if (["child", "neurodivergent", "elderly"].includes(profile.id)) {
    replacements = [...replacements, ...EXTRA_SIMPLE_REPLACEMENTS];
  }

  return replacements.reduce(
    (output, [pattern, replacement]) => output.replace(pattern, replacement),
    text,
  );
};

const ensureSentenceEnding = (text) => {
  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }
  if (/[.!?]$/.test(trimmed)) {
    return trimmed;
  }
  return `${trimmed}.`;
};

const capitalizeFirst = (text) => {
  if (!text) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const splitByWordLimit = (text, limit = 14) => {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= limit) {
    return [text];
  }

  const chunks = [];
  for (let i = 0; i < words.length; i += limit) {
    chunks.push(words.slice(i, i + limit).join(" "));
  }
  return chunks;
};

const simplifySentence = (sentence, readingProfile = "standard", wordLimit = 14) => {
  let simplified = sentence
    .replace(/\b[A-Za-z-]+\s+\((\d+)\)/g, "$1")
    .replace(/\((.*?)\)/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();

  simplified = simplifyVocabulary(simplified, readingProfile);

  const clauseParts = simplified
    .split(/[;:]/)
    .map((part) => part.trim())
    .filter(Boolean);
  const chunks = clauseParts.length > 1 ? clauseParts : [simplified];

  const subParts = chunks.flatMap((chunk) =>
    chunk
      .split(/,\s+/)
      .map((part) => part.trim())
      .filter(Boolean),
  );
  const units = subParts.length > 1 ? subParts : chunks;

  return units
    .flatMap((unit) => splitByWordLimit(unit, wordLimit))
    .map((unit) => capitalizeFirst(unit.trim()))
    .filter(Boolean)
    .map((unit) => ensureSentenceEnding(unit));
};

const similarityRatio = (a, b) => {
  const aWords = normalizeForCompare(a).split(" ").filter(Boolean);
  const bWords = normalizeForCompare(b).split(" ").filter(Boolean);

  if (!aWords.length || !bWords.length) {
    return 0;
  }

  const countWords = (words) =>
    words.reduce((counts, word) => {
      counts.set(word, (counts.get(word) || 0) + 1);
      return counts;
    }, new Map());

  const aCounts = countWords(aWords);
  const bCounts = countWords(bWords);
  let common = 0;

  aCounts.forEach((count, word) => {
    common += Math.min(count, bCounts.get(word) || 0);
  });

  return common / Math.max(aWords.length, bWords.length);
};

const averageWordsPerSentence = (text) => {
  const sentences = sentenceList(text);
  if (!sentences.length) {
    return 0;
  }
  const totalWords = sentences.reduce(
    (sum, sentence) => sum + sentence.split(/\s+/).filter(Boolean).length,
    0,
  );
  return totalWords / sentences.length;
};

const needsStrongerSimplification = (
  originalText,
  candidateText,
  readingProfile = "standard",
) => {
  if (!candidateText?.trim()) {
    return true;
  }

  const profile = getReadingProfileConfig(readingProfile);
  const similarity = similarityRatio(originalText, candidateText);
  const avgWords = averageWordsPerSentence(candidateText);

  return (
    similarity > profile.similarityThreshold ||
    avgWords > profile.maxAcceptedWordsPerSentence
  );
};

const buildSummaryBullets = (text) => {
  const sentences = sentenceList(text);
  const bullets = [];

  for (let i = 0; i < Math.min(5, sentences.length); i += 1) {
    const line = sentences[i]
      .replace(/[.!?]$/, "")
      .replace(/\s+/g, " ")
      .trim();
    if (line) {
      bullets.push(line);
    }
  }

  while (bullets.length < 5) {
    bullets.push("No additional key point.");
  }

  return bullets;
};

const toBulletString = (bullets) => bullets.map((bullet) => `- ${bullet}`).join("\n");

const heuristicSimplify = (text, readingProfile = "standard") => {
  const profile = getReadingProfileConfig(readingProfile);
  const normalized = normalizeWhitespace(text);
  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const rewrittenParagraphs = paragraphs.map((paragraph) => {
    const sentences = sentenceList(paragraph);
    const rewrittenSentences = sentences.flatMap((sentence) =>
      simplifySentence(sentence, profile.id, profile.maxWordsPerSentence),
    );
    return rewrittenSentences.join(" ");
  });

  let simplified = rewrittenParagraphs.join("\n\n").trim() || normalized;
  if (profile.structureMode === "line-break") {
    simplified = sentenceList(simplified).join("\n");
  }

  const bullets = buildSummaryBullets(simplified);

  return {
    simplified,
    summary: toBulletString(bullets),
    readingLevel: estimateReadingLevel(simplified),
  };
};

const mockSimplify = (text, readingProfile = "standard") =>
  heuristicSimplify(text, readingProfile);

const mockTranslate = (text, targetLanguage) => {
  if (targetLanguage === "english") {
    return text;
  }
  return `[Mock ${LANGUAGE_MAP[targetLanguage]} translation]\n${text}`;
};

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_MOCK === "true") {
    return null;
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const getModelCandidates = () => unique([process.env.OPENAI_MODEL, ...MODEL_FALLBACKS]);

const isModelSelectionError = (error) => {
  const text = String(error?.message || "").toLowerCase();
  return text.includes("model") && (text.includes("not found") || text.includes("access"));
};

const createChatCompletion = async ({ client, messages, temperature = 0.2 }) => {
  const models = getModelCandidates();
  let lastError = null;

  for (const model of models) {
    try {
      const completion = await client.chat.completions.create({
        model,
        temperature,
        messages,
      });
      return { completion, model };
    } catch (error) {
      lastError = error;
      if (isModelSelectionError(error)) {
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error("No available OpenAI model succeeded");
};

const parseJsonSafely = (content) => {
  const fencedJson = content.match(/```json\s*([\s\S]*?)```/i);
  if (fencedJson?.[1]) {
    content = fencedJson[1].trim();
  }

  try {
    return JSON.parse(content);
  } catch (_error) {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (__error) {
      return null;
    }
  }
};

const normalizeBullets = (rawBullets, fallbackText) => {
  let bullets = [];

  if (Array.isArray(rawBullets)) {
    bullets = rawBullets.map((item) => String(item || "").trim());
  } else if (typeof rawBullets === "string") {
    bullets = rawBullets
      .split("\n")
      .map((line) => line.replace(/^[-*•]\s*/, "").trim())
      .filter(Boolean);
  }

  if (!bullets.length) {
    bullets = buildSummaryBullets(fallbackText);
  }

  bullets = bullets
    .map((bullet) => bullet.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 5);

  while (bullets.length < 5) {
    bullets.push("No additional key point.");
  }

  return bullets;
};

const requestSimplification = async (
  client,
  text,
  readingProfile = "standard",
  { strict = false } = {},
) => {
  const profile = getReadingProfileConfig(readingProfile);
  const strictInstruction = strict
    ? `Your rewrite must be much clearer than the original. Keep each sentence under ${profile.maxWordsPerSentence} words and strictly follow the selected profile style.`
    : "Follow the selected profile exactly.";

  const { completion, model } = await createChatCompletion({
    client,
    temperature: 0.2,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content:
          `Reading profile: ${profile.id} (${profile.label})\n` +
          `Tone: ${profile.tone}\n` +
          `Sentence length: ${profile.sentenceLength}\n` +
          `Vocabulary level: ${profile.vocabulary}\n` +
          `Structure style: ${profile.structureStyle}\n\n` +
          `Original text:\n${text}\n\n` +
          `${strictInstruction}\n` +
          "Return JSON only with keys:\n" +
          "simplified: string\n" +
          "summaryBullets: array of exactly 5 short bullets\n" +
          "readingLevel: string",
      },
    ],
  });

  const content = completion.choices?.[0]?.message?.content || "";
  const parsed = parseJsonSafely(content);
  return { parsed, model };
};

export const simplifyTextWithAI = async (text, readingProfile = "standard") => {
  const profile = getReadingProfileConfig(readingProfile);
  const client = getOpenAIClient();
  if (!client) {
    return mockSimplify(text, profile.id);
  }

  try {
    let { parsed, model } = await requestSimplification(client, text, profile.id);

    if (needsStrongerSimplification(text, String(parsed?.simplified || ""), profile.id)) {
      const retry = await requestSimplification(client, text, profile.id, {
        strict: true,
      });
      if (retry.parsed && typeof retry.parsed === "object") {
        parsed = retry.parsed;
        model = retry.model;
      }
    }

    if (!parsed || typeof parsed !== "object") {
      return mockSimplify(text, profile.id);
    }

    const simplified = normalizeWhitespace(String(parsed.simplified || ""));
    if (needsStrongerSimplification(text, simplified, profile.id)) {
      return mockSimplify(text, profile.id);
    }

    const summaryBullets = normalizeBullets(parsed.summaryBullets || parsed.summary, simplified || text);
    const readingLevel = String(parsed.readingLevel || estimateReadingLevel(simplified || text));

    return {
      simplified: simplified || mockSimplify(text, profile.id).simplified,
      summary: toBulletString(summaryBullets),
      readingLevel,
      modelUsed: model,
    };
  } catch (error) {
    console.error("OpenAI simplify failed. Falling back to mock:", error.message);
    return mockSimplify(text, profile.id);
  }
};

export const translateTextWithAI = async (text, targetLanguage) => {
  const client = getOpenAIClient();
  if (!client) {
    return mockTranslate(text, targetLanguage);
  }

  if (targetLanguage === "english") {
    return text;
  }

  try {
    const { completion } = await createChatCompletion({
      client,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You translate content for accessibility users. Keep language simple, clear, and faithful.",
        },
        {
          role: "user",
          content: `Translate this text into ${LANGUAGE_MAP[targetLanguage]} and return plain text only:\n\n${text}`,
        },
      ],
    });

    const output = completion.choices?.[0]?.message?.content?.trim();
    if (!output) {
      return mockTranslate(text, targetLanguage);
    }
    return output;
  } catch (error) {
    console.error("OpenAI translation failed. Falling back to mock:", error.message);
    return mockTranslate(text, targetLanguage);
  }
};
