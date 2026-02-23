const readingProfileOptions = [
  { value: "child", label: "Child (Grade 3-5)" },
  { value: "standard", label: "Standard" },
  { value: "neurodivergent", label: "Neurodivergent" },
  { value: "elderly", label: "Elderly" },
  { value: "academic", label: "Academic" },
];

const TextInputSection = ({
  text,
  readingProfile,
  onReadingProfileChange,
  onChange,
  onClear,
  onSimplify,
  loading,
  error,
}) => {
  const remainingChars = 5000 - text.length;
  const isLimitReached = remainingChars < 0;

  return (
    <section className="card" aria-label="Text input">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Input Text</h2>
        <span className={`text-sm ${isLimitReached ? "text-red-700" : "text-slate-600"}`}>
          {text.length}/5000
        </span>
      </div>

      <label htmlFor="source-text" className="mb-2 block text-sm font-medium">
        Paste legal, medical, or government text
      </label>
      <label htmlFor="reading-profile" className="mb-2 block text-sm font-medium">
        Reading profile
      </label>
      <select
        id="reading-profile"
        value={readingProfile}
        onChange={(event) => onReadingProfileChange(event.target.value)}
        className="focus-ring mb-3 w-full rounded-lg border border-[#4015eb] px-3 py-2 text-sm"
      >
        {readingProfileOptions.map((profile) => (
          <option key={profile.value} value={profile.value}>
            {profile.label}
          </option>
        ))}
      </select>

      <textarea
        id="source-text"
        value={text}
        maxLength={5000}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Paste or type your text here..."
        className="focus-ring min-h-52 w-full rounded-xl border border-[#4015eb] p-3 leading-relaxed"
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSimplify}
          disabled={loading || !text.trim()}
          className="focus-ring rounded-lg bg-[#594491] px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Simplifying..." : "Simplify"}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="focus-ring rounded-lg border border-[#4015eb] px-4 py-2 font-medium hover:bg-slate-100"
        >
          Clear
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </section>
  );
};

export default TextInputSection;


