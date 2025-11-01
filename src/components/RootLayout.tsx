import { useState } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const onSearchChange = (query: string) => {
    setSearchQuery(query);
    console.log("Search query:", query);
  };

  const onCountryChange = (country: string) => {
    setSelectedCountry(country);
    console.log("Selected country:", country);
  };

  const onRegionChange = (region: string) => {
    setSelectedRegion(region);
    console.log("Selected region:", region);
  };
  return (
    <section className="">
      <Navbar
        searchQuery={searchQuery}
        selectedCountry={selectedCountry}
        selectedRegion={selectedRegion}
        onSearchChange={onSearchChange}
        onCountryChange={onCountryChange}
        onRegionChange={onRegionChange}
      />
      <section className="fixed">
        <div
          className="relative flex h-screen w-screen items-center justify-center gap-3 overflow-hidden"
        >
          {/* Display search and filter values */}
          {(searchQuery || selectedCountry || selectedRegion) && (
            <div className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 transform rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-sm">
              <div className="text-center text-gray-800">
                {searchQuery && (
                  <p className="mb-1 text-sm">
                    🔍 Search:{" "}
                    <span className="font-semibold">{searchQuery}</span>
                  </p>
                )}
                {selectedCountry && (
                  <p className="mb-1 text-sm">
                    🌍 Country:{" "}
                    <span className="font-semibold">{selectedCountry}</span>
                  </p>
                )}
                {selectedRegion && (
                  <p className="text-sm">
                    🗺️ Region:{" "}
                    <span className="font-semibold">{selectedRegion}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      <main className="mx-auto w-full px-4">
        <Outlet />
      </main>
      <footer className="flex items-center justify-center bg-gray-50 py-5">
        <p>&copy; 2025 My Application</p>{" "}
      </footer>
    </section>
  );
};

export default RootLayout;
