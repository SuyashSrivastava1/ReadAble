import { useMemo, useRef, useState } from "react";

const useSpeechSynthesis = () => {
  const synth = useMemo(
    () => (typeof window !== "undefined" ? window.speechSynthesis : null),
    [],
  );
  const utteranceRef = useRef(null);

  const [rate, setRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const supported = Boolean(synth && window.SpeechSynthesisUtterance);

  const stop = () => {
    if (!supported) {
      return;
    }
    synth.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const speak = (text) => {
    if (!supported || !text?.trim()) {
      return;
    }

    stop();

    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onpause = () => {
      setIsPaused(true);
    };
    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const pause = () => {
    if (!supported || !isSpeaking) {
      return;
    }
    synth.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (!supported || !isPaused) {
      return;
    }
    synth.resume();
    setIsPaused(false);
  };

  return {
    supported,
    rate,
    setRate,
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
  };
};

export default useSpeechSynthesis;
