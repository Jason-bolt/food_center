import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  ShoppingCart,
  Printer,
  Sparkles,
  CalendarDays,
  ImageIcon,
  Check,
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import {
  getMealPlan,
  setMealPlanSlot,
  clearMealPlanSlot,
  getSavedRecipes,
} from "../utils/helpers/apiCalls";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Slot {
  day: number;
  savedRecipeId: string | null;
  title: string;
  region: string;
  imageUrl: string | null;
  ingredients: string[];
}

interface MealPlan {
  _id: string;
  weekStart: string;
  slots: Slot[];
}

interface SavedRecipe {
  _id: string;
  title: string;
  region: string;
  imageUrl: string | null;
  markdown: string;
  collectionId: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Returns the Monday of a given date (local midnight). */
const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const weekLabel = (start: Date): string => {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}, ${start.getFullYear()}`;
};

/** Pull ingredients out of the AI markdown format. */
const extractIngredients = (markdown: string): string[] => {
  const usedMatch = markdown.match(/\*\*Your ingredients used:\*\*\s*([^\n]+)/);
  const pantryMatch = markdown.match(/\*\*Additional pantry staples needed:\*\*\s*([^\n]+)/);
  return [
    ...(usedMatch?.[1]?.split(",") ?? []),
    ...(pantryMatch?.[1]?.split(",") ?? []),
  ]
    .map((s) => s.trim())
    .filter(Boolean);
};

const toISODate = (d: Date) => d.toISOString().slice(0, 10);

// ─── Component ───────────────────────────────────────────────────────────────
const MealPlanner = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [weekStart, setWeekStart] = useState<Date>(getWeekStart());
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // Picker modal — which day we're adding to
  const [pickerDay, setPickerDay] = useState<number | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");

  // Shopping list modal
  const [showShopping, setShowShopping] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user || !token) navigate("/login", { state: { from: "/meal-planner" } });
  }, [user, token, navigate]);

  // Fetch plan whenever week changes
  useEffect(() => {
    if (!token) return;
    setLoadingPlan(true);
    getMealPlan(token, toISODate(weekStart))
      .then(setPlan)
      .catch(() => {})
      .finally(() => setLoadingPlan(false));
  }, [token, weekStart]);

  // Fetch saved recipes once
  useEffect(() => {
    if (!token) return;
    getSavedRecipes(token).then(setSavedRecipes).catch(() => {});
  }, [token]);

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };

  const slotForDay = (day: number): Slot | undefined =>
    plan?.slots.find((s) => s.day === day);

  const handleAdd = async (recipe: SavedRecipe, day: number) => {
    if (!token) return;
    const ingredients = extractIngredients(recipe.markdown);
    const updated = await setMealPlanSlot(token, {
      weekStart: toISODate(weekStart),
      day,
      savedRecipeId: recipe._id,
      title: recipe.title,
      region: recipe.region,
      imageUrl: recipe.imageUrl,
      ingredients,
    });
    setPlan(updated);
    setPickerDay(null);
    setPickerSearch("");
  };

  const handleClear = async (day: number) => {
    if (!token) return;
    const updated = await clearMealPlanSlot(token, toISODate(weekStart), day);
    setPlan(updated);
  };

  // Shopping list: all ingredients deduplicated
  const allIngredients = () => {
    const all: string[] = [];
    plan?.slots.forEach((s) => all.push(...s.ingredients));
    return [...new Set(all.map((i) => i.toLowerCase()))].sort();
  };

  const toggleCheck = (ing: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(ing) ? next.delete(ing) : next.add(ing);
      return next;
    });
  };

  const filledSlots = plan?.slots.length ?? 0;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="border-b border-gray-100 bg-white px-4 py-5 sm:px-6 md:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={22} className="text-orange-400" />
            <h1 className="text-xl font-black text-gray-900 sm:text-2xl">Meal Planner</h1>
          </div>
          {/* Week navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevWeek}
              className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:cursor-pointer hover:bg-gray-50"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <p className="text-sm font-semibold text-gray-700 sm:text-base">{weekLabel(weekStart)}</p>
            <button
              onClick={nextWeek}
              className="flex items-center gap-1 rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 hover:cursor-pointer hover:bg-gray-50"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Week grid ── */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:px-10">
        {loadingPlan ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {DAYS.map((_, i) => (
              <div key={i} className="h-44 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {DAYS.map((dayName, dayIndex) => {
              const slot = slotForDay(dayIndex);
              const dayDate = new Date(weekStart);
              dayDate.setDate(dayDate.getDate() + dayIndex);

              return (
                <div
                  key={dayIndex}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  {/* Day header */}
                  <div className="border-b border-gray-50 bg-gray-50 px-3 py-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      <span className="hidden lg:block">{dayName}</span>
                      <span className="lg:hidden">{DAYS_SHORT[dayIndex]}</span>
                    </p>
                    <p className="text-xs text-gray-400">
                      {dayDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>

                  {/* Slot */}
                  <div className="flex flex-1 flex-col p-2">
                    {slot ? (
                      <div className="relative flex-1">
                        {slot.imageUrl ? (
                          <img
                            src={slot.imageUrl}
                            alt={slot.title}
                            className="mb-2 aspect-square w-full rounded-xl object-cover"
                          />
                        ) : (
                          <div className="mb-2 flex aspect-square w-full items-center justify-center rounded-xl bg-orange-50">
                            <ImageIcon size={24} className="text-orange-200" />
                          </div>
                        )}
                        <p className="line-clamp-2 text-xs font-semibold leading-snug text-gray-800">
                          {slot.title}
                        </p>
                        {slot.region && (
                          <span className="mt-1 inline-block rounded-full bg-orange-50 px-2 py-0.5 text-xs text-orange-500">
                            {slot.region}
                          </span>
                        )}
                        <button
                          onClick={() => handleClear(dayIndex)}
                          className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-gray-400 shadow hover:cursor-pointer hover:bg-red-50 hover:text-red-500"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setPickerDay(dayIndex); setPickerSearch(""); }}
                        className="flex flex-1 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 py-4 text-gray-400 transition hover:cursor-pointer hover:border-orange-300 hover:text-orange-400"
                      >
                        <Plus size={18} />
                        <span className="text-xs font-medium">Add recipe</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Shopping list button ── */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => { setShowShopping(true); setChecked(new Set()); }}
            disabled={filledSlots === 0}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:cursor-pointer hover:from-orange-500 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart size={17} />
            Generate Shopping List
            {filledSlots > 0 && (
              <span className="ml-1 rounded-full bg-white/30 px-2 py-0.5 text-xs">
                {filledSlots} {filledSlots === 1 ? "meal" : "meals"}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Recipe Picker Modal ── */}
      {pickerDay !== null && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPickerDay(null)} />
          <div className="relative z-10 w-full max-w-md rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="font-black text-gray-900">
                Add to {DAYS[pickerDay]}
              </h3>
              <button onClick={() => setPickerDay(null)} className="text-gray-400 hover:cursor-pointer hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="px-5 pt-3 pb-2">
              <input
                autoFocus
                type="text"
                placeholder="Search saved recipes…"
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none"
              />
            </div>

            <div className="max-h-72 overflow-y-auto px-5 pb-5">
              {savedRecipes.length === 0 ? (
                <div className="py-10 text-center">
                  <Sparkles size={28} className="mx-auto mb-2 text-orange-300" />
                  <p className="text-sm font-semibold text-gray-600">No saved recipes yet</p>
                  <p className="mt-1 text-xs text-gray-400">Generate recipes with AI Chef and save them first.</p>
                  <button
                    onClick={() => navigate("/ai")}
                    className="mt-4 rounded-xl bg-orange-400 px-4 py-2 text-sm font-bold text-white hover:cursor-pointer hover:bg-orange-500"
                  >
                    Open AI Chef
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  {savedRecipes
                    .filter((r) =>
                      pickerSearch === "" ||
                      r.title.toLowerCase().includes(pickerSearch.toLowerCase()),
                    )
                    .map((recipe) => (
                      <button
                        key={recipe._id}
                        onClick={() => handleAdd(recipe, pickerDay!)}
                        className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 text-left transition hover:cursor-pointer hover:border-orange-200 hover:bg-orange-50"
                      >
                        {recipe.imageUrl ? (
                          <img src={recipe.imageUrl} alt={recipe.title} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                            <ImageIcon size={18} className="text-orange-300" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">{recipe.title}</p>
                          {recipe.region && <p className="text-xs text-orange-500">{recipe.region}</p>}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Shopping List Modal ── */}
      {showShopping && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowShopping(false)} />
          <div className="relative z-10 flex w-full max-w-md flex-col rounded-t-3xl bg-white shadow-2xl sm:max-h-[85vh] sm:rounded-3xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-orange-400" />
                <h3 className="font-black text-gray-900">Shopping List</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:cursor-pointer hover:bg-gray-50"
                >
                  <Printer size={13} /> Print
                </button>
                <button onClick={() => setShowShopping(false)} className="text-gray-400 hover:cursor-pointer hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* By-day summary */}
            <div className="border-b border-gray-50 px-5 py-3">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-400">This week's meals</p>
              <div className="flex flex-wrap gap-1.5">
                {plan?.slots
                  .sort((a, b) => a.day - b.day)
                  .map((slot) => (
                    <span key={slot.day} className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-700">
                      {DAYS_SHORT[slot.day]}: {slot.title}
                    </span>
                  ))}
              </div>
            </div>

            {/* Ingredient checklist */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-400">
                All ingredients ({allIngredients().length})
              </p>
              <div className="space-y-1.5">
                {allIngredients().map((ing) => (
                  <label
                    key={ing}
                    className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-gray-50"
                  >
                    <div
                      onClick={() => toggleCheck(ing)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                        checked.has(ing)
                          ? "border-orange-400 bg-orange-400"
                          : "border-gray-300"
                      }`}
                    >
                      {checked.has(ing) && <Check size={12} className="text-white" />}
                    </div>
                    <span
                      className={`text-sm capitalize transition ${
                        checked.has(ing) ? "text-gray-300 line-through" : "text-gray-700"
                      }`}
                    >
                      {ing}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 px-5 py-3 text-center text-xs text-gray-400">
              {checked.size} of {allIngredients().length} items checked
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Suppress unused import warning from ReactMarkdown (used via type)
void (ReactMarkdown as unknown);

export default MealPlanner;
