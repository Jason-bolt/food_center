import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY_HEADER, setAdminToken } from "../../utils/auth";

const AdminLogin = () => {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!secret.trim()) {
      setError("Please enter the admin secret.");
      return;
    }

    setIsLoading(true);

    try {
      // Verify the secret against a protected endpoint before storing it
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/foods`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            [API_KEY_HEADER]: secret,
          },
          // Send intentionally invalid body — we only care about 401/403 vs anything else
          body: JSON.stringify({}),
        },
      );

      // 401/403 means wrong key; anything else (400 validation, 500) means the key was accepted
      if (response.status === 401 || response.status === 403) {
        setError("Invalid secret. Please try again.");
        return;
      }

      setAdminToken(secret);
      navigate("/admin");
    } catch {
      setError("Could not reach the server. Check that the API is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="secret" className="text-sm font-semibold text-gray-700">
              Admin Secret
            </label>
            <input
              id="secret"
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="rounded-lg border border-orange-400 p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter the admin secret"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 rounded-lg bg-orange-400 py-3 font-semibold text-white hover:bg-orange-500 disabled:opacity-60 hover:cursor-pointer"
          >
            {isLoading ? "Verifying…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
