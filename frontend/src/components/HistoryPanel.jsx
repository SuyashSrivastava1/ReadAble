const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const HistoryPanel = ({ history, loading, onRefresh, onSelect, onDelete, deletingId }) => (
  <section className="card" aria-label="Saved history">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">History</h2>
      <button
        type="button"
        onClick={onRefresh}
        className="focus-ring rounded-lg border border-[#4015eb] px-3 py-2 text-sm hover:bg-slate-100"
      >
        Refresh
      </button>
    </div>

    {loading ? <p className="text-sm text-slate-600">Loading history...</p> : null}

    {!loading && history.length === 0 ? (
      <p className="rounded-lg border border-[#4015eb] p-3 text-sm text-slate-700">
        No saved simplifications yet.
      </p>
    ) : null}

    <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
      {history.map((entry) => (
        <div
          key={entry._id}
          className="rounded-lg border border-[#4015eb] p-3 hover:bg-slate-50"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-xs text-slate-500">{formatDate(entry.createdAt)}</p>
            <button
              type="button"
              onClick={() => onDelete(entry)}
              disabled={deletingId === entry._id}
              className="focus-ring rounded-md border border-[#4015eb] px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
              aria-label={`Delete history item from ${formatDate(entry.createdAt)}`}
            >
              {deletingId === entry._id ? "Deleting..." : "Delete"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => onSelect(entry)}
            className="focus-ring block w-full text-left"
            aria-label={`Load history item from ${formatDate(entry.createdAt)}`}
          >
            <p className="text-sm font-medium">
              {entry.inputText.slice(0, 130)}
              {entry.inputText.length > 130 ? "..." : ""}
            </p>
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default HistoryPanel;

