import { CheckCircle, Sparkles, Coins } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const UpgradeSuccess = () => {
  const { refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isCredits = params.get("credits") === "true";

  useEffect(() => {
    refreshUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16 bg-gray-50">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl text-center">
        <div className="mb-6 flex justify-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isCredits ? "bg-amber-100" : "bg-green-100"}`}>
            {isCredits
              ? <Coins size={36} className="text-amber-500" />
              : <CheckCircle size={36} className="text-green-500" />}
          </div>
        </div>

        {isCredits ? (
          <>
            <div className="mb-2 flex items-center justify-center gap-2 text-amber-500">
              <Coins size={18} />
              <span className="font-bold tracking-wide uppercase text-sm">10 Credits Added</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Credits added!</h1>
            <p className="text-gray-500 mb-8">
              10 credits have been added to your account. Each recipe generation spends 1 credit — they never expire.
            </p>
          </>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-center gap-2 text-orange-500">
              <Sparkles size={18} />
              <span className="font-bold tracking-wide uppercase text-sm">Food Center Pro</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">You're all set!</h1>
            <p className="text-gray-500 mb-8">
              Your Pro plan is now active. Enjoy unlimited recipe generations and all Pro features.
            </p>
          </>
        )}

        <button
          onClick={() => navigate("/ai")}
          className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-3.5 font-bold text-white shadow-lg shadow-orange-200 transition-opacity hover:opacity-90"
        >
          Start cooking
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="mt-3 w-full rounded-2xl py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          View profile
        </button>
      </div>
    </main>
  );
};

export default UpgradeSuccess;
