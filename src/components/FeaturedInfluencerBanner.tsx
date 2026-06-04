import { useEffect, useState } from "react";
import { ExternalLink, Instagram, Youtube } from "lucide-react";

interface FeaturedSlot {
  _id: string;
  position: "hero" | "sidebar";
  influencerId: {
    _id: string;
    name: string;
    description: string;
    imageUrl?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}

const BASE = import.meta.env.VITE_SERVER_BASE_URL;

const FeaturedInfluencerBanner = () => {
  const [slot, setSlot] = useState<FeaturedSlot | null>(null);

  useEffect(() => {
    fetch(`${BASE}/influencers/featured-slots/active`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setSlot(data))
      .catch(() => {});
  }, []);

  if (!slot) return null;

  const { influencerId: inf } = slot;

  return (
    <div className="mx-auto mb-6 max-w-5xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-xl sm:flex sm:items-center sm:gap-6">
        {/* Sponsored badge */}
        <span className="absolute right-4 top-4 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/60 backdrop-blur-sm">
          Sponsored
        </span>

        {/* Avatar */}
        {inf.imageUrl && (
          <div className="mb-4 shrink-0 sm:mb-0">
            <img
              src={inf.imageUrl}
              alt={inf.name}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-orange-400/40"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-orange-400">
            Featured Creator
          </p>
          <h3 className="text-lg font-black text-white">{inf.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-gray-400">{inf.description}</p>

          {/* Social links */}
          <div className="mt-3 flex items-center gap-3">
            {inf.instagram && (
              <a
                href={`https://instagram.com/${inf.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                <Instagram size={12} /> Instagram
              </a>
            )}
            {inf.youtube && (
              <a
                href={inf.youtube.startsWith("http") ? inf.youtube : `https://youtube.com/@${inf.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                <Youtube size={12} /> YouTube
              </a>
            )}
            {inf.tiktok && (
              <a
                href={`https://tiktok.com/@${inf.tiktok.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                <ExternalLink size={12} /> TikTok
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInfluencerBanner;
