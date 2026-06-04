import { useEffect, useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { authHeaders } from "../../utils/auth";

const BASE = import.meta.env.VITE_SERVER_BASE_URL;

interface Influencer { _id: string; name: string; imageUrl?: string; }
interface Slot {
  _id: string;
  influencerId: { _id: string; name: string; imageUrl?: string };
  startDate: string;
  endDate: string;
  position: "hero" | "sidebar";
  price: number;
  note: string;
}

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const isActive = (s: Slot) => {
  const now = Date.now();
  return new Date(s.startDate).getTime() <= now && new Date(s.endDate).getTime() >= now;
};

const FeaturedSlotsPanel = () => {
  const [open, setOpen] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    influencerId: "", startDate: "", endDate: "",
    position: "hero" as "hero" | "sidebar", price: "", note: "",
  });

  const fetchSlots = async () => {
    const r = await fetch(`${BASE}/influencers/featured-slots`, { headers: authHeaders() });
    if (r.ok) setSlots(await r.json());
  };

  const fetchInfluencers = async () => {
    const r = await fetch(`${BASE}/influencers`);
    if (r.ok) setInfluencers(await r.json());
  };

  useEffect(() => {
    if (open) { fetchSlots(); fetchInfluencers(); }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setError("");
    try {
      const r = await fetch(`${BASE}/influencers/featured-slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      if (!r.ok) { const b = await r.json(); throw new Error(b.error ?? "Failed to create slot"); }
      setShowForm(false);
      setForm({ influencerId: "", startDate: "", endDate: "", position: "hero", price: "", note: "" });
      fetchSlots();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this featured slot?")) return;
    await fetch(`${BASE}/influencers/featured-slots/${id}`, { method: "DELETE", headers: authHeaders() });
    fetchSlots();
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header toggle */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors rounded-2xl"
      >
        <div>
          <p className="text-sm font-bold text-gray-900">Featured Creator Slots</p>
          <p className="text-xs text-gray-400">Manage sponsored influencer placements on the home page</p>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-gray-100 px-6 pb-6 pt-4 space-y-4">
          {/* Slot list */}
          {slots.length === 0 ? (
            <p className="text-sm text-gray-400">No featured slots yet.</p>
          ) : (
            <div className="space-y-2">
              {slots.map((s) => (
                <div key={s._id} className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 ${isActive(s) ? "border-orange-200 bg-orange-50" : "border-gray-100 bg-gray-50"}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    {s.influencerId.imageUrl && (
                      <img src={s.influencerId.imageUrl} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">{s.influencerId.name}</p>
                      <p className="text-xs text-gray-400">
                        {fmt(s.startDate)} → {fmt(s.endDate)} · {s.position} · ${s.price}
                        {isActive(s) && <span className="ml-2 font-semibold text-orange-500">● Live</span>}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(s._id)} className="shrink-0 text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Create form */}
          {showForm ? (
            <form onSubmit={handleCreate} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Influencer</label>
                  <select
                    value={form.influencerId}
                    onChange={(e) => setForm((p) => ({ ...p, influencerId: e.target.value }))}
                    required
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Select influencer…</option>
                    {influencers.map((inf) => (
                      <option key={inf._id} value={inf._id}>{inf.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Position</label>
                  <select
                    value={form.position}
                    onChange={(e) => setForm((p) => ({ ...p, position: e.target.value as "hero" | "sidebar" }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="hero">Hero (home page banner)</option>
                    <option value="sidebar">Sidebar</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Start Date</label>
                  <input type="date" required value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">End Date</label>
                  <input type="date" required value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Price (USD)</label>
                  <input type="number" min="0" step="0.01" required value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    placeholder="e.g. 299" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-gray-600">Internal Note</label>
                  <input type="text" value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                    placeholder="Optional…" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm" />
                </div>
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={saving}
                  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60">
                  {saving ? "Saving…" : "Create slot"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100">
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-colors">
              <Plus size={15} /> New featured slot
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FeaturedSlotsPanel;
