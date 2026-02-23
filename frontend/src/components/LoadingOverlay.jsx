const LoadingOverlay = ({ show, message = "Processing..." }) => {
  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/20"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="rounded-xl bg-white px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#4015eb] border-t-transparent" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;


