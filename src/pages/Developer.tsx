import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { Copy, Check, Plus, Trash2, Zap, Code2, BarChart2 } from "lucide-react";

const BASE = import.meta.env.VITE_SERVER_BASE_URL;
const TOKEN_KEY = "fc_user_token";

const PLANS = [
  { id: "free",    label: "Free",    price: "$0",     limit: "50 req / month",    colour: "text-gray-500 bg-gray-100" },
  { id: "starter", label: "Starter", price: "$9.99",  limit: "1,000 req / month", colour: "text-blue-600 bg-blue-50"  },
  { id: "growth",  label: "Growth",  price: "$29.99", limit: "10,000 req / month",colour: "text-purple-600 bg-purple-50" },
];

interface KeyUsage {
  id: string;
  key: string;
  plan: string;
  label: string;
  monthlyLimit: number;
  usedThisMonth: number;
  resetAt: string;
  percentUsed: number;
}

interface ApiKey {
  _id: string;
  key: string;
  plan: string;
  monthlyLimit: number;
  usedThisMonth: number;
  createdAt: string;
}

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY) ?? ""}` });

const Developer = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<KeyUsage[]>([]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchKeys(); fetchUsage();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchKeys = async () => {
    const r = await fetch(`${BASE}/developer/keys`, { headers: authHeader() });
    if (r.ok) setKeys(await r.json());
  };

  const fetchUsage = async () => {
    const r = await fetch(`${BASE}/developer/keys/usage`, { headers: authHeader() });
    if (r.ok) setUsage(await r.json());
  };

  const createKey = async () => {
    setCreating(true); setError("");
    try {
      const r = await fetch(`${BASE}/developer/keys`, { method: "POST", headers: authHeader() });
      const data = await r.json();
      if (!r.ok) { setError(data.error === "max_keys_reached" ? "Maximum of 3 API keys allowed." : data.message ?? "Failed"); return; }
      await fetchKeys(); await fetchUsage();
    } catch { setError("Something went wrong."); }
    finally { setCreating(false); }
  };

  const revokeKey = async (id: string) => {
    if (!confirm("Revoke this API key? Any apps using it will stop working.")) return;
    await fetch(`${BASE}/developer/keys/${id}`, { method: "DELETE", headers: authHeader() });
    fetchKeys(); fetchUsage();
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white">
            <Code2 size={14} /> Developer API
          </div>
          <h1 className="text-3xl font-black text-gray-900">API Access</h1>
          <p className="mt-2 text-gray-500">
            Integrate Food Center's AI recipe generation into your own apps using your API key.
          </p>
        </div>

        {/* Quick start */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-3 text-sm font-bold text-gray-700 uppercase tracking-wide">Quick Start</h2>
          <div className="rounded-xl bg-gray-950 p-4 text-sm font-mono text-gray-300 overflow-x-auto">
            <span className="text-gray-500"># Generate recipes via API</span>
            {"\n"}
            curl -X POST {BASE}/recipes/suggest \{"\n"}
            {"  "}-H <span className="text-green-400">"x-fc-api-key: YOUR_KEY"</span> \{"\n"}
            {"  "}-H <span className="text-green-400">"Content-Type: application/json"</span> \{"\n"}
            {"  "}-d <span className="text-yellow-400">'{`{"ingredients":["tomatoes","onions","chicken"]}`}'</span>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Responses are streamed as Server-Sent Events. Each <code className="rounded bg-gray-100 px-1">data:</code> line is a JSON chunk with a <code className="rounded bg-gray-100 px-1">text</code> field.
          </p>
        </div>

        {/* API Keys */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Your API Keys</h2>
            <button
              onClick={createKey}
              disabled={creating || keys.length >= 3}
              className="flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-700 disabled:opacity-50"
            >
              <Plus size={14} />
              {creating ? "Creating…" : "Generate key"}
            </button>
          </div>

          {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

          {keys.length === 0 ? (
            <p className="text-sm text-gray-400">No API keys yet. Generate one to get started.</p>
          ) : (
            <div className="space-y-3">
              {keys.map((k) => (
                <div key={k._id} className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="truncate text-sm font-mono text-gray-800">{k.key}</code>
                      <button onClick={() => copyKey(k.key)} className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                        {copied === k.key ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {PLANS.find((p) => p.id === k.plan)?.limit ?? k.plan} ·
                      Created {new Date(k.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button onClick={() => revokeKey(k._id)} className="shrink-0 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-xs text-gray-400">Maximum 3 keys per account.</p>
        </div>

        {/* Usage dashboard */}
        {usage.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wide">
              <BarChart2 size={14} /> Usage This Month
            </h2>
            <div className="space-y-4">
              {usage.map((u) => (
                <div key={u.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-gray-500">{u.key}</code>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${PLANS.find((p) => p.id === u.plan)?.colour ?? ""}`}>
                        {u.label}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {u.usedThisMonth.toLocaleString()} / {u.monthlyLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all ${u.percentUsed >= 90 ? "bg-red-400" : u.percentUsed >= 70 ? "bg-amber-400" : "bg-green-400"}`}
                      style={{ width: `${u.percentUsed}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    Resets {new Date(u.resetAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Plan comparison */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-bold text-gray-700 uppercase tracking-wide">API Plans</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {PLANS.map((plan) => (
              <div key={plan.id} className={`rounded-xl border p-4 ${plan.id === "growth" ? "border-purple-200 bg-purple-50" : "border-gray-100 bg-gray-50"}`}>
                <span className={`mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-bold ${plan.colour}`}>
                  {plan.label}
                </span>
                <p className="text-2xl font-black text-gray-900">{plan.price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <p className="mt-1 text-sm text-gray-600">{plan.limit}</p>
                {plan.id !== "free" && (
                  <a
                    href="/pricing"
                    className="mt-3 flex items-center gap-1 text-xs font-semibold text-orange-500 hover:underline"
                  >
                    <Zap size={11} /> Upgrade via Pricing →
                  </a>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-400">
            API plan upgrades use the same Stripe billing as the Pro subscription. Contact us for custom enterprise limits.
          </p>
        </div>

      </div>
    </main>
  );
};

export default Developer;
