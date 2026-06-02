import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Flame, Star, BookMarked, CalendarDays, Trophy, TrendingUp } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

const LEVEL_LABELS = [
  { min: 0,    label: "Novice Cook" },
  { min: 200,  label: "Home Chef" },
  { min: 500,  label: "Sous Chef" },
  { min: 1000, label: "Head Chef" },
  { min: 2000, label: "Master Chef" },
];

const getLevel = (xp: number) => {
  for (let i = LEVEL_LABELS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_LABELS[i].min) return { ...LEVEL_LABELS[i], index: i + 1 };
  }
  return { ...LEVEL_LABELS[0], index: 1 };
};

const nextThreshold = (xp: number): number => {
  for (const tier of LEVEL_LABELS) {
    if (xp < tier.min) return tier.min;
  }
  return LEVEL_LABELS[LEVEL_LABELS.length - 1].min;
};

const Profile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const stats = user.stats;
  const level = getLevel(stats.xp);
  const next = nextThreshold(stats.xp);
  const prevThreshold = LEVEL_LABELS[level.index - 1]?.min ?? 0;
  const progressPct = next > prevThreshold
    ? Math.min(100, Math.round(((stats.xp - prevThreshold) / (next - prevThreshold)) * 100))
    : 100;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange-400 text-2xl font-black text-white">
          {user.name[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>

      {/* Level card */}
      <div className="mb-6 rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-500" fill="currentColor" />
            <span className="text-sm font-bold text-gray-700">Level {level.index} · {level.label}</span>
          </div>
          <span className="text-xs text-gray-400">
            {level.index < LEVEL_LABELS.length ? `${stats.xp} / ${next} XP` : `${stats.xp} XP`}
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-orange-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          {level.index < LEVEL_LABELS.length
            ? `${next - stats.xp} XP to next level`
            : "Max level reached 🏆"}
        </p>
      </div>

      {/* Stats grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Flame size={20} className="text-orange-400" fill="currentColor" />}
          label="Current streak"
          value={`${stats.currentStreak}d`}
          bg="bg-orange-50"
        />
        <StatCard
          icon={<Trophy size={20} className="text-yellow-500" fill="currentColor" />}
          label="Longest streak"
          value={`${stats.longestStreak}d`}
          bg="bg-yellow-50"
        />
        <StatCard
          icon={<Star size={20} className="text-purple-400" fill="currentColor" />}
          label="Total XP"
          value={stats.xp.toString()}
          bg="bg-purple-50"
        />
        <StatCard
          icon={<TrendingUp size={20} className="text-blue-400" />}
          label="Recipes generated"
          value={stats.totalRecipesGenerated.toString()}
          bg="bg-blue-50"
        />
        <StatCard
          icon={<BookMarked size={20} className="text-green-500" />}
          label="Recipes saved"
          value={stats.totalRecipesSaved.toString()}
          bg="bg-green-50"
        />
        <StatCard
          icon={<CalendarDays size={20} className="text-indigo-400" />}
          label="Plan"
          value={user.plan === "pro" ? "Pro" : "Free"}
          bg="bg-indigo-50"
        />
      </div>

      {/* XP guide */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6">
        <h2 className="mb-4 text-sm font-bold text-gray-700">How to earn XP</h2>
        <ul className="space-y-2.5">
          {[
            { label: "Generate recipes with AI Chef", xp: "+10 XP" },
            { label: "Save a recipe to your collection", xp: "+20 XP" },
            { label: "Complete a full week meal plan", xp: "+50 XP" },
          ].map(({ label, xp }) => (
            <li key={label} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{label}</span>
              <span className="font-bold text-orange-500">{xp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const StatCard = ({
  icon, label, value, bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bg: string;
}) => (
  <div className={`rounded-2xl ${bg} p-4`}>
    <div className="mb-2">{icon}</div>
    <p className="text-xl font-black text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

export default Profile;
