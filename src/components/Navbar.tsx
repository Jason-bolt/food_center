import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Search, X } from "lucide-react";
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setLocalSearchQuery(params.get("search") || "");
  }, [location.search]);

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
        gsap.to(foodSectionRef!.current, {
          y: 30,
          autoAlpha: 0,
          duration: 0.5,
          onComplete: () => {
            if (localSearchQuery === "") {
              newSearchParams.delete("search");
              setSearchParams(newSearchParams);
              setIsSearchModalOpen(false);
            }

            if (currentPath === basePath) {
              newSearchParams.set("search", localSearchQuery);
              setSearchParams(newSearchParams);
              setIsSearchModalOpen(false);
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

  return (
    <nav
      ref={navSection}
      className="relative z-10 flex flex-col border-b border-orange-200 bg-gray-50"
    >
      <section className="flex items-center justify-between px-10 py-5">
        <Link
          to={basePath}
          className="text-xl font-bold uppercase italic transition-all duration-200 hover:scale-105 hover:cursor-pointer hover:opacity-80"
        >
          <span className="text-orange-500">FOOD CENTER</span>
          {isAdmin ? (
            <span className="text-orange-600"> - ADMIN</span>
          ) : (
            <>&nbsp;<span className="text-sm text-orange-600">(AFRICA)</span></>
          )}
        </Link>

        <div
          ref={searchButtonRef}
          className="flex items-center justify-center gap-1 rounded-lg p-1 text-gray-700 hover:cursor-pointer hover:text-gray-500 hover:underline"
          onClick={() => setIsSearchModalOpen(true)}
        >
          <p className="text-sm">Search</p>
          <Search className="right-2 text-gray-700" height={15} width={15} />
        </div>
      </section>

      {isSearchModalOpen && (
        <div
          ref={searchModalRef}
          className="fixed inset-0 z-50 flex items-start justify-center pt-28"
        >
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-md"
            onClick={() => setIsSearchModalOpen(false)}
            ref={searchModalBackgroundRef}
          />
          <div className="relative mx-4 w-full max-w-md">
            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 shadow-2xl backdrop-blur-xl">
              <div className="absolute inset-0 bg-gray-200 opacity-90" />
              <div className="relative p-8">
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-all duration-200 hover:cursor-pointer hover:bg-white/10 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
                <div className="mb-6 text-center">
                  <h2 className="mb-2 text-2xl font-bold text-gray-800">Search Food</h2>
                  <p className="text-gray-600">Discover amazing recipes and ingredients</p>
                </div>
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for recipes, ingredients..."
                      value={localSearchQuery}
                      onChange={(e) => setLocalSearchQuery(e.target.value)}
                      className="w-full rounded-2xl border border-white/50 bg-white/30 px-4 py-3 pr-12 text-gray-800 placeholder-gray-500 backdrop-blur-sm focus:border-white/70 focus:ring-2 focus:ring-white/40 focus:outline-none"
                    />
                    <Search
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    ref={searchButtonSubmitRef}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-blue-500/80 to-purple-500/80 px-6 py-3 font-medium text-white transition-all duration-200 hover:cursor-pointer hover:from-blue-600/90 hover:to-purple-600/90 hover:shadow-lg"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;
