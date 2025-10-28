import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Search, X } from "lucide-react";
import { useRef, useState } from "react";

interface NavbarProps {
  searchQuery?: string;
  selectedCountry?: string;
  selectedRegion?: string;
  onSearchChange?: (query: string) => void;
  onCountryChange?: (country: string) => void;
  onRegionChange?: (region: string) => void;
}

const Navbar = ({
  searchQuery = "",
  selectedCountry = "",
  selectedRegion = "",
  onSearchChange,
  onCountryChange,
  onRegionChange,
}: NavbarProps) => {
  const navSection = useRef<HTMLBaseElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);
  const selectCountryModalRef = useRef<HTMLDivElement>(null);
  const selectCountryModalBackgroundRef = useRef<HTMLDivElement>(null);
  const selectRegionModalBackgroundRef = useRef<HTMLDivElement>(null);
  const selectRegionModalRef = useRef<HTMLDivElement>(null);
  const searchModalBackgroundRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLDivElement>(null);
  const selectCountryButtonRef = useRef<HTMLButtonElement>(null);
  const selectRegionButtonRef = useRef<HTMLButtonElement>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Countries list
  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "France",
    "Germany",
    "Spain",
    "Italy",
    "Japan",
    "China",
    "India",
    "Australia",
    "Mexico",
    "Brazil",
    "Argentina",
    "South Korea",
    "Thailand",
    "Greece",
    "Turkey",
  ];

  // Regions list
  const regions = [
    "North America",
    "South America",
    "Europe",
    "Asia",
    "Africa",
    "Oceania",
    "Middle East",
    "Mediterranean",
    "Scandinavia",
    "Caribbean",
  ];

  useGSAP(
    () => {
      //   Navbar animation
      gsap.fromTo(
        navSection.current,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
          delay: 2,
        },
      );
    },
    { dependencies: [] },
  );

  // Animate modal when it opens
  useGSAP(
    () => {
      if (isSearchModalOpen && searchModalRef.current) {
        const tl = gsap.timeline();
        tl.from(searchModalRef.current, {
          y: -40,
          opacity: 0,
        });
        tl.from(searchModalBackgroundRef.current, {
          opacity: 0,
          duration: 0.5,
        });
      }
    },
    {
      dependencies: [isSearchModalOpen],
    },
  );

  useGSAP(
    () => {
      if (isCountryModalOpen && selectCountryButtonRef.current) {
        const tl = gsap.timeline();
        tl.from(selectCountryModalRef.current, {
          y: -40,
          opacity: 0,
        });
        tl.from(selectCountryModalBackgroundRef.current, {
          opacity: 0,
          duration: 0.5,
        });
      }
    },
    {
      dependencies: [isCountryModalOpen],
    },
  );

  useGSAP(
    () => {
      if (isRegionModalOpen && selectRegionButtonRef.current) {
        const tl = gsap.timeline();
        tl.from(selectRegionModalRef.current, {
          y: -40,
          opacity: 0,
        });
        tl.from(selectRegionModalBackgroundRef.current, {
          opacity: 0,
          duration: 0.5,
        });
      }
    },
    {
      dependencies: [isRegionModalOpen],
    },
  );

  return (
    <nav
      ref={navSection}
      className="relative flex flex-col border-b border-gray-100 bg-gray-50"
    >
      <section className="flex items-center justify-between px-10 py-5">
        <h1 className="text-xl font-bold uppercase italic">
          <span className="text-red-500">FO</span>
          <span className="text-orange-500">OD</span>
          <span className="text-yellow-500"> C</span>
          <span className="text-green-500">EN</span>
          <span className="text-blue-500">TE</span>
          <span className="text-purple-500">R</span>
        </h1>
        <div className="hidden items-center justify-center gap-10 md:flex">
          <button
            ref={selectCountryButtonRef}
            className="p-1 text-sm text-gray-500 hover:cursor-pointer hover:text-gray-700 hover:underline"
            onClick={() => setIsCountryModalOpen(true)}
          >
            {selectedCountry || "Country"}
          </button>
          <button
            ref={selectRegionButtonRef}
            className="text-sm text-gray-500 hover:cursor-pointer hover:text-gray-700 hover:underline"
            onClick={() => setIsRegionModalOpen(true)}
          >
            {selectedRegion || "Region"}
          </button>
        </div>
        <div
          ref={searchButtonRef}
          className="flex items-center justify-center gap-1 rounded-lg p-1 text-gray-700 hover:cursor-pointer hover:text-gray-500 hover:underline"
          onClick={() => setIsSearchModalOpen(true)}
        >
          <p className="text-sm">Search</p>
          <Search className="right-2 text-gray-700" height={15} width={15} />
        </div>
      </section>
      <div className="flex items-center justify-center gap-10 pb-3 md:hidden">
        <button
          className="text-sm text-gray-500 hover:cursor-pointer hover:text-gray-700 hover:underline"
          onClick={() => setIsCountryModalOpen(true)}
        >
          {selectedCountry || "Country"}
        </button>
        <button
          className="text-sm text-gray-500 hover:cursor-pointer hover:text-gray-700 hover:underline"
          onClick={() => setIsRegionModalOpen(true)}
        >
          {selectedRegion || "Region"}
        </button>
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div
          ref={searchModalRef}
          className="fixed inset-0 z-50 flex items-start justify-center pt-28"
        >
          {/* Backdrop with blur effect */}
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-md"
            onClick={() => setIsSearchModalOpen(false)}
            ref={searchModalBackgroundRef}
          />

          {/* Modal Container */}
          <div className="relative mx-4 w-full max-w-md transform transition-all duration-300 ease-out">
            {/* Glass Container */}
            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 shadow-2xl backdrop-blur-xl">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/40 to-transparent opacity-50" />

              {/* Liquid glass effect overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60"
                style={{
                  background:
                    "linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%)",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />

              {/* Content */}
              <div className="relative p-8">
                {/* Close button */}
                <button
                  onClick={() => setIsSearchModalOpen(false)}
                  className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-gray-600"
                >
                  <X size={20} />
                </button>

                {/* Modal Header */}
                <div className="mb-6 text-center">
                  <h2 className="mb-2 text-2xl font-bold text-gray-800">
                    Search Food
                  </h2>
                  <p className="text-gray-600">
                    Discover amazing recipes and ingredients
                  </p>
                </div>

                {/* Search Input */}
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

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      onSearchChange?.(localSearchQuery);
                      setIsSearchModalOpen(false);
                    }}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-blue-500/80 to-purple-500/80 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-blue-600/90 hover:to-purple-600/90 hover:shadow-lg"
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Country Selection Modal */}
      {isCountryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-28"
          ref={selectCountryModalRef}
        >
          <div
            ref={selectCountryModalBackgroundRef}
            className="absolute inset-0 bg-black/10 backdrop-blur-md"
            onClick={() => setIsCountryModalOpen(false)}
          />

          <div className="relative mx-4 w-full max-w-md transform transition-all duration-300 ease-out">
            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 shadow-2xl backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/40 to-transparent opacity-50" />

              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60"
                style={{
                  background:
                    "linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%)",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />

              <div className="relative p-8">
                <button
                  onClick={() => setIsCountryModalOpen(false)}
                  className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-gray-600"
                >
                  <X size={20} />
                </button>

                <div className="mb-6 text-center">
                  <h2 className="mb-2 text-2xl font-bold text-gray-800">
                    Select Country
                  </h2>
                  <p className="text-gray-600">Choose your preferred country</p>
                </div>

                <div className="mb-6 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {countries.map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          onCountryChange?.(country);
                          setIsCountryModalOpen(false);
                        }}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                          selectedCountry === country
                            ? "border-blue-500/50 bg-blue-500/20 text-blue-700"
                            : "border-white/30 bg-white/10 text-gray-700 hover:border-white/50 hover:bg-white/50"
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Region Selection Modal */}
      {isRegionModalOpen && (
        <div
          ref={selectRegionModalRef}
          className="fixed inset-0 z-50 flex items-start justify-center pt-28"
        >
          <div
            ref={selectRegionModalBackgroundRef}
            className="absolute inset-0 bg-black/10 backdrop-blur-md"
            onClick={() => setIsRegionModalOpen(false)}
          />

          <div className="relative mx-4 w-full max-w-md transform transition-all duration-300 ease-out">
            <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 shadow-2xl backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/40 to-transparent opacity-50" />

              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60"
                style={{
                  background:
                    "linear-gradient(45deg, transparent 20%, rgba(255,255,255,0.3) 50%, transparent 80%)",
                  animation: "shimmer 2s ease-in-out infinite",
                }}
              />

              <div className="relative p-8">
                <button
                  onClick={() => setIsRegionModalOpen(false)}
                  className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-gray-600"
                >
                  <X size={20} />
                </button>

                <div className="mb-6 text-center">
                  <h2 className="mb-2 text-2xl font-bold text-gray-800">
                    Select Region
                  </h2>
                  <p className="text-gray-600">Choose your preferred region</p>
                </div>

                <div className="mb-6 max-h-64 overflow-y-auto">
                  <div className="space-y-2">
                    {regions.map((region) => (
                      <button
                        key={region}
                        onClick={() => {
                          onRegionChange?.(region);
                          setIsRegionModalOpen(false);
                        }}
                        className={`w-full rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                          selectedRegion === region
                            ? "border-green-500/50 bg-green-500/20 text-green-700"
                            : "border-white/30 bg-white/10 text-gray-700 hover:border-white/50 hover:bg-white/50"
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute z-20"></div>
    </nav>
  );
};

export default Navbar;
