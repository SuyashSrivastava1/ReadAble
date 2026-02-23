import useSpeechSynthesis from "../hooks/useSpeechSynthesis.js";

const SpeechControls = ({ text }) => {
  const { supported, rate, setRate, speak, pause, resume, stop, isSpeaking, isPaused } =
    useSpeechSynthesis();

  if (!supported) {
    return (
      <p className="rounded-lg bg-amber-100 px-3 py-2 text-sm text-amber-900">
        Speech is not supported in this browser.
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-[#4015eb] p-3">
      <p className="mb-2 text-sm font-medium">Text-to-Speech</p>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => speak(text)}
          disabled={!text?.trim()}
          className="focus-ring rounded-lg bg-[#594491] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          🔊 Listen
        </button>
        <button
          type="button"
          onClick={pause}
          disabled={!isSpeaking || isPaused}
          className="focus-ring rounded-lg border border-[#4015eb] px-3 py-2 text-sm disabled:opacity-50"
        >
          Pause
        </button>
        <button
          type="button"
          onClick={resume}
          disabled={!isPaused}
          className="focus-ring rounded-lg border border-[#4015eb] px-3 py-2 text-sm disabled:opacity-50"
        >
          Resume
        </button>
        <button
          type="button"
          onClick={stop}
          disabled={!isSpeaking && !isPaused}
          className="focus-ring rounded-lg border border-[#4015eb] px-3 py-2 text-sm disabled:opacity-50"
        >
          Stop
        </button>
      </div>

      <label htmlFor="speech-rate" className="mb-1 block text-sm">
        Speed: {rate.toFixed(1)}x
      </label>
      <input
        id="speech-rate"
        type="range"
        min="0.5"
        max="1.8"
        step="0.1"
        value={rate}
        onChange={(event) => setRate(Number(event.target.value))}
        className="focus-ring w-full"
      />
    </div>
  );
};

export default SpeechControls;


