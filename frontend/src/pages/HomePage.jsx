import { useCallback, useEffect, useMemo, useState } from "react";
import AccessibilityControls from "../components/AccessibilityControls.jsx";
import AuthModal from "../components/AuthModal.jsx";
import HistoryPanel from "../components/HistoryPanel.jsx";
import LoadingOverlay from "../components/LoadingOverlay.jsx";
import Navbar from "../components/Navbar.jsx";
import OutputTabs from "../components/OutputTabs.jsx";
import TextInputSection from "../components/TextInputSection.jsx";
import useAccessibility from "../hooks/useAccessibility.js";
import {
  deleteHistoryItem,
  fetchHistory,
  simplifyText,
  translateText,
} from "../services/api.js";

const AUTH_STORAGE_KEY = "readable-auth";

const readStoredAuth = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.token || !parsed?.user) {
      return null;
    }
    return parsed;
  } catch (_error) {
    return null;
  }
};

const getTranslationFromEntry = (entry, language) => {
  const translations = entry?.translations || {};
  if (translations instanceof Map) {
    return translations.get(language) || "";
  }
  return translations[language] || "";
};

const HomePage = () => {
  const { modes, toggleMode, rootClassName } = useAccessibility();

  const [auth, setAuth] = useState(() => readStoredAuth());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [text, setText] = useState("");
  const [readingProfile, setReadingProfile] = useState("standard");
  const [simplified, setSimplified] = useState("");
  const [summary, setSummary] = useState("");
  const [originalReadingLevel, setOriginalReadingLevel] = useState("");
  const [simplifiedReadingLevel, setSimplifiedReadingLevel] = useState("");
  const [improvementPercent, setImprovementPercent] = useState(null);
  const [historyId, setHistoryId] = useState(null);

  const [targetLanguage, setTargetLanguage] = useState("english");
  const [translation, setTranslation] = useState("");

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [deletingHistoryId, setDeletingHistoryId] = useState(null);

  const [isSimplifying, setIsSimplifying] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");

  const token = auth?.token || null;
  const user = auth?.user || null;

  const persistAuth = (payload) => {
    const nextAuth = { token: payload.token, user: payload.user };
    setAuth(nextAuth);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
    }
  };

  const logout = () => {
    setAuth(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setHistory([]);
  };

  const loadHistory = useCallback(async () => {
    if (!token) {
      setHistory([]);
      return;
    }

    setHistoryLoading(true);
    try {
      const entries = await fetchHistory(token);
      setHistory(entries);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setHistoryLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleClear = () => {
    setText("");
    setSimplified("");
    setSummary("");
    setOriginalReadingLevel("");
    setSimplifiedReadingLevel("");
    setImprovementPercent(null);
    setTranslation("");
    setHistoryId(null);
    setError("");
  };

  const handleSimplify = async () => {
    if (!text.trim()) {
      setError("Please enter text before simplifying.");
      return;
    }

    setError("");
    setIsSimplifying(true);

    try {
      const response = await simplifyText({ text, readingProfile, token });
      setSimplified(response.simplified || "");
      setSummary(response.summary || "");
      setOriginalReadingLevel(response.originalReadingLevel || "");
      setSimplifiedReadingLevel(response.simplifiedReadingLevel || response.readingLevel || "");
      setReadingProfile(response.readingProfile || readingProfile);
      setImprovementPercent(
        typeof response.improvementPercent === "number" ? response.improvementPercent : null,
      );
      setHistoryId(response.historyId || null);
      setTranslation("");
      if (token) {
        await loadHistory();
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSimplifying(false);
    }
  };

  const handleTranslate = async () => {
    if (!simplified.trim()) {
      setError("Simplify text first, then translate.");
      return;
    }

    setError("");
    setIsTranslating(true);

    try {
      const response = await translateText({
        text: simplified,
        targetLanguage,
        historyId,
        token,
      });
      setTranslation(response.translated || "");
      if (token && historyId) {
        await loadHistory();
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleHistorySelect = (entry) => {
    setText(entry.inputText);
    setReadingProfile(entry.readingProfile || "standard");
    setSimplified(entry.simplified);
    setSummary(entry.summary);
    setOriginalReadingLevel(entry.originalReadingLevel || entry.readingLevel || "");
    setSimplifiedReadingLevel(entry.simplifiedReadingLevel || entry.readingLevel || "");
    setImprovementPercent(
      typeof entry.improvementPercent === "number" ? entry.improvementPercent : null,
    );
    setHistoryId(entry._id);
    setTranslation(getTranslationFromEntry(entry, targetLanguage));
    setError("");
  };

  const handleDeleteHistory = async (entry) => {
    if (!token) {
      return;
    }

    const confirmed = window.confirm("Delete this history item?");
    if (!confirmed) {
      return;
    }

    setError("");
    setDeletingHistoryId(entry._id);

    try {
      await deleteHistoryItem({ id: entry._id, token });
      setHistory((prev) => prev.filter((item) => item._id !== entry._id));
      if (historyId === entry._id) {
        setHistoryId(null);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setDeletingHistoryId(null);
    }
  };

  const statusMessage = useMemo(() => {
    if (isSimplifying) {
      return "Simplifying text...";
    }
    if (isTranslating) {
      return "Translating text...";
    }
    return "Processing...";
  }, [isSimplifying, isTranslating]);

  return (
    <div className={rootClassName}>
      <Navbar
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={logout}
        highContrast={modes.highContrast}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
            <TextInputSection
              text={text}
              readingProfile={readingProfile}
              onReadingProfileChange={setReadingProfile}
              onChange={setText}
              onClear={handleClear}
              onSimplify={handleSimplify}
              loading={isSimplifying}
              error={error}
            />

            <AccessibilityControls modes={modes} onToggle={toggleMode} />

            <OutputTabs
              simplified={simplified}
              summary={summary}
              readingStats={{
                originalReadingLevel,
                simplifiedReadingLevel,
                improvementPercent,
              }}
              highContrast={modes.highContrast}
              translation={translation}
              targetLanguage={targetLanguage}
              onTargetLanguageChange={(language) => {
                setTargetLanguage(language);
                setTranslation("");
              }}
              onTranslate={handleTranslate}
              translationLoading={isTranslating}
            />
          </section>

          <aside className="space-y-6">
            {user ? (
              <HistoryPanel
                history={history}
                loading={historyLoading}
                onRefresh={loadHistory}
                onSelect={handleHistorySelect}
                onDelete={handleDeleteHistory}
                deletingId={deletingHistoryId}
              />
            ) : (
              <section className="card">
                <h2 className="mb-2 text-lg font-semibold">Save your history</h2>
                <p className="mb-4 text-sm text-slate-700">
                  Create an account to keep previous simplifications and translations.
                </p>
                <button
                  type="button"
                  onClick={() => setAuthModalOpen(true)}
                  className="focus-ring rounded-lg bg-[#594491] px-4 py-2 text-sm font-semibold text-white"
                >
                  Login / Register
                </button>
              </section>
            )}
          </aside>
        </div>
      </main>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={(payload) => {
          persistAuth(payload);
          setAuthModalOpen(false);
        }}
        highContrast={modes.highContrast}
      />

      <LoadingOverlay show={isSimplifying || isTranslating} message={statusMessage} />
    </div>
  );
};

export default HomePage;


