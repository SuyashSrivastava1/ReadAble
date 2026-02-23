import { useMemo, useState } from "react";
import SpeechControls from "./SpeechControls.jsx";

const tabs = [
  { id: "simplified", label: "Simplified" },
  { id: "summary", label: "Summary" },
  { id: "translation", label: "Translation" },
];

const languages = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "hindi", label: "Hindi" },
  { value: "french", label: "French" },
];

const parseSummary = (summary) =>
  summary
    .split("\n")
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

const OutputTabs = ({
  simplified,
  summary,
  readingStats,
  highContrast,
  translation,
  targetLanguage,
  onTargetLanguageChange,
  onTranslate,
  translationLoading,
}) => {
  const [activeTab, setActiveTab] = useState("simplified");
  const summaryItems = useMemo(() => parseSummary(summary), [summary]);
  const originalLevel = readingStats?.originalReadingLevel || "N/A";
  const simplifiedLevel = readingStats?.simplifiedReadingLevel || "N/A";
  const improvement =
    typeof readingStats?.improvementPercent === "number"
      ? `${readingStats.improvementPercent > 0 ? "+" : ""}${readingStats.improvementPercent}%`
      : "N/A";
  const statsContainerClass = highContrast
    ? "mb-3 rounded-lg border border-[#4015eb] bg-neutral-950 px-3 py-2 text-sm text-yellow-100"
    : "mb-3 rounded-lg border border-[#4015eb] bg-slate-50 px-3 py-2 text-sm";
  const improvementColor =
    typeof readingStats?.improvementPercent !== "number"
      ? ""
      : highContrast
        ? readingStats.improvementPercent > 0
          ? "text-lime-300"
          : readingStats.improvementPercent < 0
            ? "text-rose-300"
            : "text-yellow-100"
        : readingStats.improvementPercent > 0
          ? "text-emerald-700"
          : readingStats.improvementPercent < 0
            ? "text-red-700"
            : "text-slate-700";

  return (
    <section className="card" aria-label="Output">
      <h2 className="mb-4 text-lg font-semibold">Output</h2>
      <div role="tablist" aria-label="Output tabs" className="mb-4 flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`focus-ring rounded-lg px-3 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "bg-[#594491] text-white"
                : "border border-[#4015eb] hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id="panel-simplified"
        role="tabpanel"
        aria-labelledby="tab-simplified"
        hidden={activeTab !== "simplified"}
      >
        <div className={statsContainerClass}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Original reading level</span>
            <span>{originalLevel}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-medium">Simplified reading level</span>
            <span>{simplifiedLevel}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="font-medium">Improvement</span>
            <span className={improvementColor}>{improvement}</span>
          </div>
        </div>
        <div aria-live="polite" className="mb-4 whitespace-pre-wrap rounded-lg border border-[#4015eb] p-3">
          {simplified || "Your simplified text will appear here after processing."}
        </div>
        <SpeechControls text={simplified} />
      </div>

      <div
        id="panel-summary"
        role="tabpanel"
        aria-labelledby="tab-summary"
        hidden={activeTab !== "summary"}
      >
        {summaryItems.length ? (
          <ul className="list-disc space-y-2 pl-5">
            {summaryItems.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-[#4015eb] p-3">
            A 5-bullet summary will appear here.
          </p>
        )}
      </div>

      <div
        id="panel-translation"
        role="tabpanel"
        aria-labelledby="tab-translation"
        hidden={activeTab !== "translation"}
      >
        <div className="mb-3 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Target language</span>
            <select
              aria-label="Choose target language"
              value={targetLanguage}
              onChange={(event) => onTargetLanguageChange(event.target.value)}
              className="focus-ring rounded-lg border border-[#4015eb] px-3 py-2 text-sm"
            >
              {languages.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={onTranslate}
            disabled={translationLoading || !simplified}
            className="focus-ring rounded-lg bg-[#594491] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {translationLoading ? "Translating..." : "Translate"}
          </button>
        </div>

        <div aria-live="polite" className="whitespace-pre-wrap rounded-lg border border-[#4015eb] p-3">
          {translation || "Translated output will appear here."}
        </div>
      </div>
    </section>
  );
};

export default OutputTabs;


