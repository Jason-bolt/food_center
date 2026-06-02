import { createContext } from "react";

export interface UserStats {
  currentStreak:         number;
  longestStreak:         number;
  lastActiveDate:        string | null;
  totalRecipesGenerated: number;
  totalRecipesSaved:     number;
  xp:                    number;
}

export interface AuthUser {
  _id:   string;
  name:  string;
  email: string;
  plan:  "free" | "pro";
  stats: UserStats;
}

export interface StreakToast {
  streak: number;
  xp:     number;
}

export interface AuthContextType {
  user:              AuthUser | null;
  token:             string | null;
  login:             (email: string, password: string) => Promise<void>;
  register:          (name: string, email: string, password: string) => Promise<void>;
  logout:            () => void;
  loading:           boolean;
  streakToast:       StreakToast | null;
  clearStreakToast:  () => void;
  refreshUser:       () => Promise<void>;
}

const defaultStats: UserStats = {
  currentStreak:         0,
  longestStreak:         0,
  lastActiveDate:        null,
  totalRecipesGenerated: 0,
  totalRecipesSaved:     0,
  xp:                    0,
};

export { defaultStats };

export const AuthContext = createContext<AuthContextType>({
  user:             null,
  token:            null,
  login:            async () => {},
  register:         async () => {},
  logout:           () => {},
  loading:          true,
  streakToast:      null,
  clearStreakToast:  () => {},
  refreshUser:      async () => {},
});
