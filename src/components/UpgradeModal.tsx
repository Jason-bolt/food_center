import { X, Sparkles, Zap, BookMarked, FileText, Infinity, Coins } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { createCheckoutSession, createCreditsCheckout } from "../utils/helpers/apiCalls";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
}

const PERKS = [
  { icon: Infinity,   label: "Unlimited recipe generations" },
  { icon: Zap,        label: "AI image generation for every recipe" },
  { icon: FileText,   label: "Clean PDF downloads (no watermark)" },
  { icon: BookMarked, label: "Unlimited saved recipe collections" },
];

const UpgradeModal = ({ onClose }: Props) => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<"pro" | "credits" | null>(null);
  const [error, setError] = useState("");

  const redirect = async (type: "pro" | "credits") => {
    if (!token) { navigate("/login"); return; }
    setLoading(type);
    setError("");
    try {
      const { url } = type === "pro"
        ? await createCheckoutSession(token)
        : await createCreditsCheckout(token);
      window.location.href = url;
    } catch {
      setError("Could not start checkout. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="rounded-t-3xl bg-gradient-to-br from-orange-500 to-amber-400 px-8 pt-8 pb-6 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1.5 text-white/80 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={22} />
            <span className="text-sm font-semibold tracking-wide uppercase opacity-90">Food Center Pro</span>
          </div>
          <p className="text-2xl font-black leading-tight">
            You've used your<br />3 free recipes today.
          </p>
          <p className="mt-2 text-sm opacity-80">Upgrade to Pro or buy credits to keep cooking.</p>
        </div>

        {/* Perks */}
        <div className="px-8 pt-6 space-y-3">
          {PERKS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-sm text-gray-700">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <Icon size={16} />
              </div>
              {label}
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="px-8 pb-8 pt-5 space-y-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-gray-900">$4.99</span>
            <span className="text-sm text-gray-500">/ month</span>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={() => redirect("pro")}
            disabled={!!loading}
            className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-3.5 font-bold text-white shadow-lg shadow-orange-200 transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading === "pro" ? "Redirecting…" : user ? "Upgrade to Pro" : "Sign up & Upgrade"}
          </button>

          {/* Credits option */}
          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>

          <button
            onClick={() => redirect("credits")}
            disabled={!!loading}
            className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-5 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            <span className="flex items-center gap-2">
              <Coins size={16} className="text-amber-500" />
              Buy 10 credits — $1.99
            </span>
            <span className="text-xs text-gray-400 font-normal">Never expire</span>
          </button>

          {user && (user.credits ?? 0) > 0 && (
            <p className="text-center text-xs text-gray-400">
              You have <span className="font-semibold text-amber-600">{user.credits} credit{user.credits !== 1 ? "s" : ""}</span> remaining today.
            </p>
          )}

          <button
            onClick={onClose}
            className="w-full rounded-2xl py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
