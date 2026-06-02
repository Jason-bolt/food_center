import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { getActiveEditorial } from "../utils/helpers/apiCalls";
import type { IEditorial } from "../types/food";

const EditorialBanner = () => {
  const navigate = useNavigate();
  const [editorial, setEditorial] = useState<IEditorial | null>(null);
  const [loaded, setLoaded]       = useState(false);

  useEffect(() => {
    getActiveEditorial()
      .then((data) => setEditorial(data))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || !editorial) return null;

  const handleExplore = () => {
    const params = new URLSearchParams({ region: editorial.region });
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="px-4 pt-4 pb-2 sm:px-6">
      <div
        className="relative overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm"
        style={
          editorial.imageUrl
            ? {
                backgroundImage: `linear-gradient(to right, rgba(255,247,237,0.97) 45%, rgba(255,247,237,0.6) 100%), url(${editorial.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center right",
              }
            : undefined
        }
      >
        {/* Decorative ring */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-orange-200/30" />

        <div className="relative flex flex-col gap-3 p-5 sm:p-7 md:max-w-[65%]">
          {/* Label */}
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
              Dishes of the Week
            </span>
          </div>

          {/* Region badge */}
          <div>
            <span className="inline-block rounded-full bg-orange-400 px-3 py-0.5 text-xs font-black text-white">
              {editorial.region}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-black leading-tight text-gray-900 sm:text-2xl">
            {editorial.title}
          </h2>

          {/* Description */}
          <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
            {editorial.description}
          </p>

          {/* CTA */}
          <button
            onClick={handleExplore}
            className="mt-1 flex w-fit items-center gap-2 rounded-xl bg-orange-400 px-4 py-2.5 text-sm font-bold text-white transition hover:cursor-pointer hover:bg-orange-500 active:scale-95"
          >
            Explore {editorial.region} dishes
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorialBanner;
