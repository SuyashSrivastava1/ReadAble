const Navbar = ({ user, onOpenAuth, onLogout, highContrast }) => {
  const navClass = highContrast
    ? "border-b border-[#4015eb] bg-black"
    : "border-b border-[#4015eb] bg-white/80 backdrop-blur";

  return (
    <header className={navClass}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ReadAble</h1>
          <p className="text-sm opacity-80">Accessibility-first reading assistant</p>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm sm:inline">Signed in as {user.name}</span>
              <button
                type="button"
                onClick={onLogout}
                className="focus-ring rounded-lg border border-[#4015eb] px-3 py-2 text-sm hover:bg-slate-100"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="focus-ring rounded-lg bg-[#594491] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;


