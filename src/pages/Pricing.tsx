import { Check, Sparkles, Zap, BookMarked, FileText, Infinity, Shield, Coins } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { createCheckoutSession, createPortalSession, createCreditsCheckout } from "../utils/helpers/apiCalls";

const FREE_FEATURES = [
  "3 recipe generations per day",
  "Save recipes to collections",
  "Meal planner (7-day)",
  "Ingredient pantry",
  "Trending feed",
];

const PRO_FEATURES = [
  { icon: Infinity,   label: "Unlimited recipe generations" },
  { icon: Zap,        label: "AI image generation for every recipe" },
  { icon: FileText,   label: "Clean PDF downloads (no watermark)" },
  { icon: BookMarked, label: "Unlimited saved collections" },
  { icon: Shield,     label: "Priority support" },
];

const Pricing = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<"pro" | "credits" | "portal" | null>(null);
  const [error, setError] = useState("");

  const isPro = user?.plan === "pro";

  const handleAction = async (type: "pro" | "credits" | "portal") => {
    if (!token) { navigate("/login"); return; }
    setLoading(type);
    setError("");
    try {
      let url: string;
      if (type === "portal") {
        ({ url } = await createPortalSession(token));
      } else if (type === "credits") {
        ({ url } = await createCreditsCheckout(token));
      } else {
        ({ url } = await createCheckoutSession(token));
      }
      window.location.href = url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-semibold text-orange-600">
            <Sparkles size={14} />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl font-black text-gray-900">Choose your plan</h1>
          <p className="mt-3 text-gray-500">Start free. Upgrade when you're ready to cook more.</p>
        </div>

        {/* Plans grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free plan */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8">
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Free</p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-black text-gray-900">$0</span>
                <span className="text-gray-400">/ month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-600">
                  <Check size={16} className="text-gray-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="rounded-2xl border border-gray-200 py-3 text-center text-sm font-medium text-gray-400">
              {user && !isPro ? "Your current plan" : "Get started for free"}
            </div>
          </div>

          {/* Pro plan */}
          <div className="relative rounded-3xl bg-gradient-to-br from-orange-500 to-amber-400 p-[2px] shadow-xl shadow-orange-200">
            <div className="rounded-[22px] bg-white p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-orange-500 uppercase tracking-wide">Pro</p>
                  {isPro && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-bold text-orange-600">
                      Active
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">$4.99</span>
                  <span className="text-gray-400">/ month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {PRO_FEATURES.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                      <Icon size={13} />
                    </div>
                    {label}
                  </li>
                ))}
              </ul>

              {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

              <button
                onClick={() => handleAction(isPro ? "portal" : "pro")}
                disabled={!!loading}
                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 py-3.5 font-bold text-white shadow-lg shadow-orange-200 transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading === "pro" || loading === "portal"
                  ? "Redirecting…"
                  : isPro
                    ? "Manage subscription"
                    : user
                      ? "Upgrade to Pro"
                      : "Get started"}
              </button>

              {!user && (
                <p className="mt-3 text-center text-xs text-gray-400">
                  No account?{" "}
                  <button onClick={() => navigate("/register")} className="font-medium text-orange-500 hover:underline">
                    Sign up first
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Credits pack */}
        {!isPro && (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <Coins size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Credit Pack — $1.99</p>
                  <p className="mt-0.5 text-sm text-gray-600">
                    10 one-time credits. Each recipe generation spends 1 credit.
                    {user && (user.credits ?? 0) > 0 && (
                      <span className="ml-1 font-semibold text-amber-700">
                        You have {user.credits} credit{user.credits !== 1 ? "s" : ""} remaining.
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">Credits never expire. No subscription needed.</p>
                </div>
              </div>
              <button
                onClick={() => handleAction("credits")}
                disabled={!!loading}
                className="shrink-0 rounded-2xl bg-amber-500 px-6 py-3 font-bold text-white shadow-md shadow-amber-200 transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {loading === "credits" ? "Redirecting…" : "Buy credits"}
              </button>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-gray-400">
          Cancel anytime. Billed monthly via Stripe. Secure checkout.
        </p>
      </div>
    </main>
  );
};

export default Pricing;
