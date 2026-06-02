import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Flame } from "lucide-react";
import { getTrending } from "../utils/helpers/apiCalls";

interface TrendingIngredient {
  name: string;
  count: number;
}

const TrendingSection = () => {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<TrendingIngredient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrending()
      .then((data) => setIngredients(data.ingredients))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Don't render at all until we have at least 3 ingredients
  if (loading || ingredients.length < 3) return null;

  const handleTryCombo = (selected: string[]) => {
    const params = new URLSearchParams({ ingredients: selected.join(",") });
    navigate(`/ai?${params.toString()}`);
  };

  // Top 3 as a suggested combo, full list as individual chips
  const topCombo = ingredients.slice(0, 3).map((i) => i.name);
  const rest = ingredients.slice(3);

  return (
    <section className="mt-10 border-t border-orange-100 px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <Flame size={20} className="text-orange-400" />
        <h2 className="text-lg font-black text-gray-900">Trending This Week</h2>
        <span className="ml-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-600">
          {ingredients.length} ingredients
        </span>
      </div>

      {/* Top combo suggestion */}
      <div className="mb-5 rounded-2xl border border-orange-100 bg-orange-50 p-4">
        <div className="mb-3 flex items-center gap-1.5">
          <TrendingUp size={14} className="text-orange-500" />
          <p className="text-xs font-bold uppercase tracking-wide text-orange-500">
            Popular combo right now
          </p>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {topCombo.map((name) => (
            <span
              key={name}
              className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold capitalize text-gray-800 shadow-sm"
            >
              {name}
            </span>
          ))}
        </div>
        <button
          onClick={() => handleTryCombo(topCombo)}
          className="flex items-center gap-1.5 rounded-xl bg-orange-400 px-4 py-2 text-xs font-bold text-white transition hover:cursor-pointer hover:bg-orange-500"
        >
          ✦ Try this combo in AI Chef →
        </button>
      </div>

      {/* Individual trending chips */}
      {rest.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Also trending
          </p>
          <div className="flex flex-wrap gap-2">
            {rest.map((item) => (
              <button
                key={item.name}
                onClick={() => handleTryCombo([item.name])}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium capitalize text-gray-600 shadow-sm transition hover:cursor-pointer hover:border-orange-300 hover:text-orange-600"
                title={`${item.count} searches this week`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TrendingSection;
