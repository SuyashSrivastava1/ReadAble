const toggles = [
  { key: "highContrast", label: "High contrast mode" },
  { key: "largeText", label: "Large text mode" },
  { key: "dyslexiaFont", label: "Dyslexia-friendly font" },
  { key: "lowStimulation", label: "Low stimulation mode" },
];

const AccessibilityControls = ({ modes, onToggle }) => (
  <section className="card" aria-label="Accessibility controls">
    <h2 className="mb-4 text-lg font-semibold">Accessibility Modes</h2>
    <div className="grid gap-3 sm:grid-cols-2">
      {toggles.map((toggle) => (
        <label
          key={toggle.key}
          className="flex items-center justify-between rounded-lg border border-[#4015eb] p-3"
        >
          <span className="text-sm font-medium">{toggle.label}</span>
          <input
            type="checkbox"
            checked={modes[toggle.key]}
            onChange={() => onToggle(toggle.key)}
            className="focus-ring h-5 w-5 rounded border-[#4015eb] text-[#594491]"
            aria-label={toggle.label}
          />
        </label>
      ))}
    </div>
  </section>
);

export default AccessibilityControls;


