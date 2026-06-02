import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Search, X, LogOut, BookMarked, ChevronDown, User, Menu, CalendarDays, Flame, Star, UtensilsCrossed, BarChart2 } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Link,
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FoodSectionContext } from "../contexts/FoodSectionContext";
import { InitialLoadContext } from "../contexts/InitialLoadContext";
import { AuthContext } from "../contexts/AuthContext";

interface NavbarProps {
  basePath?: string;
}

const Navbar = ({ basePath = "/" }: NavbarProps) => {
  const isAdmin = basePath !== "/";
  const navSection = useRef<HTMLElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);
  const searchModalBackgroundRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLDivElement>(null);
  const searchButtonSubmitRef = useRef<HTMLButtonElement>(null);
  const foodSectionContext = useContext(FoodSectionContext);
  const foodSectionRef = foodSectionContext.foodSectionRef;
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const currentPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const initialLoadContext = useContext(InitialLoadContext);
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setLocalSearchQuery(params.get("search") || "");
  }, [location.search]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useGSAP(
    () => {
      if (
        !isAdmin &&
        currentPath === "/" &&
        queryParams.toString() === "" &&
        !initialLoadContext.initialLoadAlreadyHappened?.current
      ) {
        gsap.fromTo(navSection.current, { autoAlpha: 0 }, { autoAlpha: 1, delay: 2 });
      }
    },
    { dependencies: [currentPath] },
  );

  useGSAP(
    () => {
      if (isSearchModalOpen && searchModalRef.current) {
        const tl = gsap.timeline();
        tl.from(searchModalRef.current, { y: -40, opacity: 0 });
        tl.from(searchModalBackgroundRef.current, { opacity: 0, duration: 0.5 });
      }
    },
    { dependencies: [isSearchModalOpen] },
  );

  useGSAP(
    () => {
      const submitSearchForm = () => {
        setIsSearchModalOpen(false);
        setMobileMenuOpen(false);

        if (!foodSectionRef?.current) {
          const queryString = createSearchParams({ search: localSearchQuery }).toString();
          navigate({ pathname: basePath, search: `?${queryString}` });
          return;
        }

        gsap.to(foodSectionRef.current, {
          y: 30,
          autoAlpha: 0,
          duration: 0.5,
          onComplete: () => {
            if (localSearchQuery === "") {
              newSearchParams.delete("search");
              setSearchParams(newSearchParams);
            } else if (currentPath === basePath) {
              newSearchParams.set("search", localSearchQuery);
              setSearchParams(newSearchParams);
            } else {
              const queryString = createSearchParams({ search: localSearchQuery }).toString();
              navigate({ pathname: basePath, search: `?${queryString}` }, { replace: true });
            }
          },
        });
      };

      searchButtonSubmitRef.current?.addEventListener("click", submitSearchForm);
      return () => {
        searchButtonSubmitRef.current?.removeEventListener("click", submitSearchForm);
      };
    },
    { dependencies: [isSearchModalOpen, localSearchQuery, searchParams] },
  );

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      ref={navSection}
      className="relative z-10 flex flex-col border-b border-orange-200 bg-gray-50"
    >
      {/* ── Main bar ── */}
      <section className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-10 md:py-5">
        {/* Logo */}
        <Link
          to={basePath}
          className="text-lg font-bold uppercase italic transition-all duration-200 hover:scale-105 hover:cursor-pointer hover:opacity-80 md:text-xl"
        >
          <span className="text-orange-500">FOOD CENTER</span>
          {isAdmin ? (
            <span className="text-orange-600"> - ADMIN</span>
          ) : (
            <span className="hidden text-sm text-orange-600 sm:inline">&nbsp;(AFRICA)</span>
          )}
        </Link>

        {/* ── Desktop right side (md+) ── */}
        <div className="hidden items-center gap-3 md:flex">
          {!isAdmin && (
            <Link
              to="/ai"
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-orange-600 transition hover:cursor-pointer hover:bg-orange-50"
            >
              ✦ AI Chef
            </Link>
          )}

          <div
            ref={searchButtonRef}
            className="flex cursor-pointer items-center gap-1 rounded-lg p-1 text-gray-700 hover:text-gray-500 hover:underline"
            onClick={() => setIsSearchModalOpen(true)}
          >
            <p className="text-sm">Search</p>
            <Search height={15} width={15} />
          </div>

          {/* Auth UI */}
          {!isAdmin && !authLoading && (
            <>
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 transition hover:cursor-pointer hover:border-orange-200 hover:bg-orange-50"
                  >
                    <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-orange-400 text-xs font-bold text-white">
                      {user.name[0].toUpperCase()}
                      {(user.stats?.currentStreak ?? 0) >= 2 && (
                        <span className="absolute -top-2 -right-2 flex items-center gap-0.5 rounded-full bg-orange-500 px-1 py-0.5 text-[9px] font-black text-white leading-none">
                          <Flame size={8} fill="currentColor" />{user.stats.currentStreak}
                        </span>
                      )}
                    </span>
                    <span className="max-w-24 truncate">{user.name.split(" ")[0]}</span>
                    <ChevronDown size={13} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl border border-gray-100 bg-white py-1.5 shadow-xl">
                      <div className="border-b border-gray-50 px-4 py-2">
                        <p className="truncate text-xs font-semibold text-gray-800">{user.name}</p>
                        <p className="truncate text-xs text-gray-400">{user.email}</p>
                        <div className="mt-1.5 flex items-center gap-2">
                          {(user.stats?.currentStreak ?? 0) > 0 && (
                            <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-500">
                              <Flame size={10} fill="currentColor" /> {user.stats.currentStreak}d streak
                            </span>
                          )}
                          <span className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-semibold text-yellow-600">
                            <Star size={10} fill="currentColor" /> {user.stats?.xp ?? 0} XP
                          </span>
                        </div>
                      </div>
                      <Link
                        to="/my-recipes"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-50"
                      >
                        <BookMarked size={14} /> My Recipes
                      </Link>
                      <Link
                        to="/meal-planner"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-50"
                      >
                        <CalendarDays size={14} /> Meal Planner
                      </Link>
                      <Link
                        to="/pantry"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-50"
                      >
                        <UtensilsCrossed size={14} /> My Pantry
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-50"
                      >
                        <BarChart2 size={14} /> My Stats
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:cursor-pointer hover:bg-red-50"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-600 transition hover:cursor-pointer hover:bg-gray-100">
                    Sign In
                  </Link>
                  <Link to="/register" className="rounded-lg bg-orange-400 px-3 py-1.5 text-sm font-bold text-white transition hover:cursor-pointer hover:bg-orange-500">
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}

          {isAdmin && !authLoading && user && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User size={14} />
              <span>{user.name}</span>
            </div>
          )}
        </div>

        {/* ── Mobile right side (< md) ── */}
        {!isAdmin && (
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => { setIsSearchModalOpen(true); setMobileMenuOpen(false); }}
              className="rounded-lg p-2 text-gray-600 hover:cursor-pointer hover:bg-gray-100"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="rounded-lg p-2 text-gray-600 hover:cursor-pointer hover:bg-gray-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        )}
      </section>

      {/* ── Mobile slide-down menu ── */}
      {mobileMenuOpen && !isAdmin && (
        <div className="border-t border-orange-100 bg-gray-50 px-4 pb-4 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              to="/ai"
              className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50"
            >
              ✦ AI Chef
            </Link>

            {user && (
              <>
                <Link
                  to="/my-recipes"
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <BookMarked size={15} /> My Recipes
                </Link>
                <Link
                  to="/meal-planner"
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <CalendarDays size={15} /> Meal Planner
                </Link>
                <Link
                  to="/pantry"
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <UtensilsCrossed size={15} /> My Pantry
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  <BarChart2 size={15} /> My Stats
                </Link>
              </>
            )}

            <div className="my-2 border-t border-gray-100" />

            {!authLoading && (
              user ? (
                <div>
                  <div className="mb-2 flex items-center gap-3 rounded-xl bg-orange-50 px-3 py-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-400 text-sm font-bold text-white">
                      {user.name[0].toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="truncate text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 hover:cursor-pointer"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="rounded-xl border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl bg-orange-400 px-3 py-3 text-center text-sm font-bold text-white hover:bg-orange-500"
                  >
                    Sign Up
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ── Search modal (shared mobile/desktop) ── */}
      {isSearchModalOpen && (
        <div ref={searchModalRef} className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28">
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-md"
            onClick={() => setIsSearchModalOpen(false)}
            ref={searchModalBackgroundRef}
          />
          <div className="relative mx-4 w-full max-w-md">
            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 shadow-2xl backdrop-blur-xl">
              <div className="absolute inset-0 bg-gray-200 opacity-90" />
              <div className="relative p-6 sm:p-8">
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-all hover:cursor-pointer hover:bg-white/10 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
                <div className="mb-5 text-center sm:mb-6">
                  <h2 className="mb-1 text-xl font-bold text-gray-800 sm:text-2xl">Search Food</h2>
                  <p className="text-sm text-gray-600">Discover amazing recipes and ingredients</p>
                </div>
                <div className="mb-5 sm:mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for recipes, ingredients..."
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full rounded-2xl border border-white/50 bg-white/30 px-4 py-3 pr-12 text-gray-800 placeholder-gray-500 backdrop-blur-sm focus:border-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                    />
                    <Search className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500" size={20} />
                  </div>
                </div>
                <button
                  ref={searchButtonSubmitRef}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-500/80 to-purple-500/80 px-6 py-3 font-medium text-white transition hover:cursor-pointer hover:from-blue-600/90 hover:to-purple-600/90 hover:shadow-lg"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
