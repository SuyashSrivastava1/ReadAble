import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "readable-accessibility-modes";

const defaultModes = {
  highContrast: false,
  largeText: false,
  dyslexiaFont: false,
  lowStimulation: false,
};

const safeParseModes = (raw) => {
  if (!raw) {
    return defaultModes;
  }
  try {
    const parsed = JSON.parse(raw);
    return { ...defaultModes, ...parsed };
  } catch (_error) {
    return defaultModes;
  }
};

const useAccessibility = () => {
  const [modes, setModes] = useState(() => {
    if (typeof window === "undefined") {
      return defaultModes;
    }
    return safeParseModes(window.localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(modes));
  }, [modes]);

  const toggleMode = (key) => {
    setModes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const rootClassName = useMemo(() => {
    const classes = [
      "min-h-screen transition-colors duration-300",
      modes.highContrast ? "bg-black text-yellow-100" : "bg-[#d9dbff] text-readable-ink",
      modes.largeText ? "text-lg" : "text-base",
      modes.dyslexiaFont ? "font-dyslexic" : "font-sans",
      modes.lowStimulation ? "low-stimulation" : "",
    ];
    return classes.filter(Boolean).join(" ");
  }, [modes]);

  return {
    modes,
    toggleMode,
    rootClassName,
  };
};

export default useAccessibility;
