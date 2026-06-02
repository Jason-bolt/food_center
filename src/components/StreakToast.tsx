import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Flame, Star } from "lucide-react";

/** XP level label */
const levelLabel = (xp: number): string => {
  const level = Math.floor(xp / 100) + 1;
  if (level <= 2)  return "Novice Cook";
  if (level <= 5)  return "Home Chef";
  if (level <= 10) return "Sous Chef";
  if (level <= 20) return "Head Chef";
  return "Master Chef";
};

const StreakToast = () => {
  const { streakToast, clearStreakToast } = useContext(AuthContext);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!streakToast) return;

    // Auto-dismiss after 4.5 seconds
    timerRef.current = setTimeout(clearStreakToast, 4500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [streakToast, clearStreakToast]);

  if (!streakToast) return null;

  const { streak, xp } = streakToast;
  const level = Math.floor(xp / 100) + 1;

  return (
    <div
      className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white px-5 py-3.5 shadow-xl">
        {/* Flame + streak */}
        <div className="flex items-center gap-1.5 rounded-xl bg-orange-50 px-3 py-1.5">
          <Flame size={18} className="text-orange-400" fill="currentColor" />
          <span className="text-base font-black text-orange-500">{streak}</span>
          <span className="text-xs font-semibold text-orange-400">
            {streak === 1 ? "day" : "days"}
          </span>
        </div>

        {/* Message */}
        <div>
          <p className="text-sm font-bold text-gray-900">
            {streak === 1
              ? "Streak started! Come back tomorrow 🍳"
              : `${streak}-day streak! Keep it up!`}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Star size={11} className="text-yellow-400" fill="currentColor" />
            <span className="text-xs text-gray-400">
              {xp} XP · {levelLabel(xp)} (Level {level})
            </span>
          </div>
        </div>

        {/* Close */}
        <button
          onClick={clearStreakToast}
          className="ml-1 text-gray-300 hover:cursor-pointer hover:text-gray-500"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default StreakToast;
