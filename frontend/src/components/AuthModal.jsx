import { useState } from "react";
import { loginUser, registerUser } from "../services/api.js";

const initialLogin = { email: "", password: "" };
const initialRegister = { name: "", email: "", password: "" };

const AuthModal = ({ open, onClose, onAuthSuccess, highContrast }) => {
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const reset = () => {
    setError("");
    setLoading(false);
  };

  const closeModal = () => {
    reset();
    onClose();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = await loginUser(loginForm);
      onAuthSuccess(payload);
      closeModal();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = await registerUser(registerForm);
      onAuthSuccess(payload);
      closeModal();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const panelClass = highContrast ? "bg-black border-[#4015eb]" : "bg-white border-[#4015eb]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`w-full max-w-md rounded-2xl border p-5 shadow-lg ${panelClass}`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{mode === "login" ? "Login" : "Create account"}</h2>
          <button type="button" onClick={closeModal} className="focus-ring rounded p-2">
            <span className="sr-only">Close authentication modal</span>
            ✕
          </button>
        </div>

        <div className="mb-4 flex rounded-lg border border-[#4015eb] p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`focus-ring w-1/2 rounded-md px-3 py-2 text-sm ${
              mode === "login" ? "bg-[#594491] text-white" : ""
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`focus-ring w-1/2 rounded-md px-3 py-2 text-sm ${
              mode === "register" ? "bg-[#594491] text-white" : ""
            }`}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-3" aria-label="Login form">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                className="focus-ring w-full rounded-lg border border-[#4015eb] px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Password</span>
              <input
                type="password"
                required
                minLength={8}
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                className="focus-ring w-full rounded-lg border border-[#4015eb] px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="focus-ring w-full rounded-lg bg-[#594491] px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3" aria-label="Register form">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Name</span>
              <input
                type="text"
                required
                minLength={2}
                maxLength={60}
                value={registerForm.name}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                className="focus-ring w-full rounded-lg border border-[#4015eb] px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Email</span>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                className="focus-ring w-full rounded-lg border border-[#4015eb] px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Password</span>
              <input
                type="password"
                required
                minLength={8}
                maxLength={128}
                value={registerForm.password}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                className="focus-ring w-full rounded-lg border border-[#4015eb] px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="focus-ring w-full rounded-lg bg-[#594491] px-4 py-2 font-semibold text-white disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
        )}

        {error ? (
          <p role="alert" className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default AuthModal;


