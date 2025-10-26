import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./components/Home";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    console.log("Search query:", query);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    console.log("Selected country:", country);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    console.log("Selected region:", region);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchQuery={searchQuery}
              selectedCountry={selectedCountry}
              selectedRegion={selectedRegion}
              onSearchChange={handleSearchChange}
              onCountryChange={handleCountryChange}
              onRegionChange={handleRegionChange}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
