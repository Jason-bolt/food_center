import { useEffect, useRef, useState } from "react";
import { Sparkles, Pencil, Trash2, X, Plus, ChevronDown, ChevronUp } from "lucide-react";
import type { IEditorial } from "../../types/food";
import {
  getAllEditorials,
  createEditorial,
  updateEditorial,
  deleteEditorial,
} from "../../utils/helpers/apiCalls";
import { uploadImage } from "../../utils/helpers/general";

// Convert "YYYY-Www" (HTML week input value) → ISO date string of that Monday
const weekInputToMonday = (value: string): string => {
  // value is like "2025-W23"
  const [yearStr, weekStr] = value.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);
  // Jan 4 is always in week 1 of the ISO year
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const dayOfWeek = jan4.getUTCDay() || 7; // Mon=1 … Sun=7
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - (dayOfWeek - 1) + (week - 1) * 7);
  return monday.toISOString().slice(0, 10);
};

// Convert a Date/string → "YYYY-Www" for the week input
const dateToWeekInput = (date: string): string => {
  const d = new Date(date);
  // ISO week number
  const tmp = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  tmp.setUTCDate(tmp.getUTCDate() + 4 - (tmp.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
};

const BLANK_FORM = {
  title: "",
  region: "",
  description: "",
  activeWeek: "",  // "YYYY-Www"
  imageUrl: "",
};

interface FormState {
  title: string;
  region: string;
  description: string;
  activeWeek: string;
  imageUrl: string;
}

const EditorialPanel = () => {
  const [editorials, setEditorials]   = useState<IEditorial[]>([]);
  const [open, setOpen]               = useState(false);
  const [modalOpen, setModalOpen]     = useState(false);
  const [editing, setEditing]         = useState<IEditorial | null>(null);
  const [form, setForm]               = useState<FormState>(BLANK_FORM);
  const [imageFile, setImageFile]     = useState<File | null>(null);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");
  const fileRef                       = useRef<HTMLInputElement>(null);

  const load = () =>
    getAllEditorials()
      .then(setEditorials)
      .catch(() => {});

  useEffect(() => { if (open) load(); }, [open]);

  const openCreate = () => {
    setEditing(null);
    setForm(BLANK_FORM);
    setImageFile(null);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (ed: IEditorial) => {
    setEditing(ed);
    setForm({
      title:       ed.title,
      region:      ed.region,
      description: ed.description,
      activeWeek:  dateToWeekInput(ed.activeWeek),
      imageUrl:    ed.imageUrl ?? "",
    });
    setImageFile(null);
    setError("");
    setModalOpen(true);
  };

  const handleDelete = async (ed: IEditorial) => {
    if (!confirm(`Delete "${ed.title}"?`)) return;
    try {
      await deleteEditorial(ed._id);
      setEditorials((prev) => prev.filter((e) => e._id !== ed._id));
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.region || !form.description || !form.activeWeek) {
      setError("Title, region, description, and week are required.");
      return;
    }

    setSaving(true);
    try {
      let imageUrl = form.imageUrl || null;

      if (imageFile) {
        const result = await uploadImage(imageFile);
        if (!result?.image) throw new Error("Image upload failed");
        imageUrl = result.image;
      }

      const payload = {
        title:       form.title,
        region:      form.region,
        description: form.description,
        activeWeek:  weekInputToMonday(form.activeWeek),
        imageUrl,
      };

      if (editing) {
        const updated = await updateEditorial(editing._id, payload);
        setEditorials((prev) => prev.map((e) => (e._id === editing._id ? updated : e)));
      } else {
        const created = await createEditorial(payload);
        setEditorials((prev) => [created, ...prev]);
      }

      setModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const field = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="mx-auto mb-6 max-w-5xl px-4 sm:px-6">
      {/* Collapsible header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 text-left transition hover:bg-orange-100 hover:cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-orange-500" />
          <span className="font-bold text-gray-800">Dishes of the Week — Editorials</span>
          {editorials.length > 0 && (
            <span className="ml-1 rounded-full bg-orange-200 px-2 py-0.5 text-xs font-semibold text-orange-700">
              {editorials.length}
            </span>
          )}
        </div>
        {open ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>

      {open && (
        <div className="mt-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          {/* New editorial button */}
          <div className="mb-4 flex justify-end">
            <button
              onClick={openCreate}
              className="flex items-center gap-1.5 rounded-xl bg-orange-400 px-4 py-2 text-sm font-bold text-white hover:cursor-pointer hover:bg-orange-500"
            >
              <Plus size={14} /> New Editorial
            </button>
          </div>

          {editorials.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              No editorials yet. Create one to spotlight a region this week.
            </p>
          ) : (
            <div className="space-y-3">
              {editorials.map((ed) => {
                const weekLabel = dateToWeekInput(ed.activeWeek);
                return (
                  <div
                    key={ed._id}
                    className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4"
                  >
                    {/* Thumbnail */}
                    {ed.imageUrl ? (
                      <img
                        src={ed.imageUrl}
                        alt={ed.title}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                        <Sparkles size={20} className="text-orange-400" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-gray-900">{ed.title}</span>
                        <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                          {ed.region}
                        </span>
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                          {weekLabel}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">{ed.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => openEdit(ed)}
                        className="rounded-lg p-2 text-gray-400 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(ed)}
                        className="rounded-lg p-2 text-red-300 hover:cursor-pointer hover:bg-red-50 hover:text-red-500"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-7 shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-gray-400 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-600"
            >
              <X size={18} />
            </button>

            <h2 className="mb-5 text-lg font-black text-gray-900">
              {editing ? "Edit Editorial" : "New Editorial"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => field("title", e.target.value)}
                  placeholder="e.g. A Taste of West Africa"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Region */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Region *</label>
                <input
                  value={form.region}
                  onChange={(e) => field("region", e.target.value)}
                  placeholder="e.g. West Africa"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => field("description", e.target.value)}
                  placeholder="A short description shown on the home page banner…"
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Active week */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Active week *</label>
                <input
                  type="week"
                  value={form.activeWeek}
                  onChange={(e) => field("activeWeek", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                />
                <p className="mt-1 text-xs text-gray-400">Only one editorial can be active per week.</p>
              </div>

              {/* Image */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Banner image (optional)</label>
                <div className="flex gap-2">
                  <input
                    value={form.imageUrl}
                    onChange={(e) => { field("imageUrl", e.target.value); setImageFile(null); }}
                    placeholder="https://… or upload below"
                    className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="shrink-0 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-semibold text-gray-600 hover:cursor-pointer hover:bg-gray-50"
                  >
                    Upload
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setImageFile(f);
                      // Always clear the URL field when a file is selected so the
                      // stub never leaks into the payload if imageFile is later nulled.
                      if (f) field("imageUrl", "");
                    }}
                  />
                </div>
                {imageFile && (
                  <p className="mt-1 text-xs text-orange-500">Will upload: {imageFile.name}</p>
                )}
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-orange-400 py-2.5 text-sm font-bold text-white hover:cursor-pointer hover:bg-orange-500 disabled:opacity-50"
                >
                  {saving ? "Saving…" : editing ? "Save changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorialPanel;
