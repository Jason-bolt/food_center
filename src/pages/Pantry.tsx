import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, UtensilsCrossed, Sparkles, Trash2 } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { getPantry, setPantry, addPantryIngredient, removePantryIngredient } from "../utils/helpers/apiCalls";

const MAX_PANTRY = 100;

const Pantry = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user || !token) { navigate("/login", { state: { from: "/pantry" } }); return; }
    getPantry(token)
      .then((p) => setIngredients(p.ingredients))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, token, navigate]);

  const add = async (raw: string) => {
    const val = raw.trim().toLowerCase();
    if (!val || !token || ingredients.includes(val) || ingredients.length >= MAX_PANTRY) return;
    setInputValue("");
    const updated = await addPantryIngredient(token, val);
    setIngredients(updated.ingredients);
  };

  const remove = async (ingredient: string) => {
    if (!token) return;
    const updated = await removePantryIngredient(token, ingredient);
    setIngredients(updated.ingredients);
  };

  const clearAll = async () => {
    if (!token || !ingredients.length) return;
    if (!confirm("Clear your entire pantry?")) return;
    setSaving(true);
    const updated = await setPantry(token, []);
    setIngredients(updated.ingredients);
    setSaving(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && ingredients.length > 0) {
      remove(ingredients[ingredients.length - 1]);
    }
  };

  const cookWithPantry = () => {
    if (!ingredients.length) return;
    const params = new URLSearchParams({ ingredients: ingredients.join(",") });
    navigate(`/ai?${params.toString()}`);
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <UtensilsCrossed size={22} className="text-orange-400" />
          <h1 className="text-2xl font-black text-gray-900">My Pantry</h1>
        </div>
        <p className="text-sm text-gray-500">
          Save the ingredients you always have on hand. Use them instantly in AI Chef.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <>
          {/* Input area */}
          <div
            className="mb-4 min-h-32 w-full cursor-text rounded-2xl border border-gray-200 bg-gray-50 p-4 transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing) => (
                <span
                  key={ing}
                  className="flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-medium text-orange-800"
                >
                  {ing}
                  <button
                    onClick={(e) => { e.stopPropagation(); remove(ing); }}
                    className="ml-0.5 hover:cursor-pointer hover:text-orange-600"
                    aria-label={`Remove ${ing}`}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
              {ingredients.length < MAX_PANTRY && (
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => add(inputValue)}
                  placeholder={ingredients.length === 0 ? "e.g. rice, olive oil, garlic…" : "Add another…"}
                  className="min-w-40 flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                />
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="mb-6 flex items-center justify-between text-xs text-gray-400">
            <span>{ingredients.length} / {MAX_PANTRY} ingredients</span>
            <div className="flex items-center gap-3">
              {inputValue && (
                <button
                  onClick={() => add(inputValue)}
                  className="flex items-center gap-1 font-semibold text-orange-500 hover:cursor-pointer hover:underline"
                >
                  <Plus size={12} /> Add
                </button>
              )}
              {ingredients.length > 0 && (
                <button
                  onClick={clearAll}
                  disabled={saving}
                  className="flex items-center gap-1 text-red-400 transition hover:cursor-pointer hover:text-red-500"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              )}
            </div>
          </div>

          {/* Keyboard hint */}
          <p className="mb-8 text-center text-xs text-gray-400">
            Press{" "}
            <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">Enter</kbd>
            {" "}or{" "}
            <kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono">,</kbd>
            {" "}after each ingredient
          </p>

          {/* CTA */}
          <button
            onClick={cookWithPantry}
            disabled={ingredients.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-400 to-orange-500 py-4 text-base font-bold text-white shadow-md transition hover:cursor-pointer hover:from-orange-500 hover:to-orange-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Sparkles size={20} />
            Cook with my pantry
          </button>

          {ingredients.length === 0 && (
            <div className="mt-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
                <UtensilsCrossed size={28} className="text-orange-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500">Your pantry is empty</p>
              <p className="mt-1 text-xs text-gray-400">
                Add the ingredients you always have — rice, olive oil, garlic, eggs…
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Pantry;
