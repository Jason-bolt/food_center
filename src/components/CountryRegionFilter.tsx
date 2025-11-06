import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import PopUpModal from "./PopUpModal";

const CountryRegionFilter = ({ className }: { className: string }) => {
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const selectCountryButtonRef = useRef<HTMLButtonElement>(null);
  const selectRegionButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const selectCountryModalRef = useRef<HTMLDivElement>(null);
  const selectCountryModalBackgroundRef = useRef<HTMLDivElement>(null);
  const selectRegionModalBackgroundRef = useRef<HTMLDivElement>(null);
  const selectRegionModalRef = useRef<HTMLDivElement>(null);

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

  const onCountryChange = (country: string) => {
    setSelectedCountry(country);
    console.log("Selected country:", country);
  };

  const onRegionChange = (region: string) => {
    setSelectedRegion(region);
    console.log("Selected region:", region);
  };

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
    <section className={`${className} my-5`}>
      <div className="hidden items-center justify-center gap-10 md:flex">
        <button
          ref={selectCountryButtonRef}
          className={
            "text-sm text-gray-500 hover:text-gray-700 hover:underline"
          }
          onClick={() => setIsCountryModalOpen(true)}
        >
          {selectedCountry || "Country"}
        </button>
        <button
          ref={selectRegionButtonRef}
          className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          onClick={() => setIsRegionModalOpen(true)}
        >
          {selectedRegion || "Region"}
        </button>
      </div>
      {/* Country Selection Modal */}
      {isCountryModalOpen && (
        <PopUpModal
          elements={countries}
          onChangeElement={onCountryChange}
          selectModalBackgroundRef={selectCountryModalBackgroundRef}
          selectModalRef={selectCountryModalRef}
          selectedElement={selectedCountry}
          setIsModalOpen={setIsCountryModalOpen}
          type={"Country"}
        />
      )}

      {/* Region Selection Modal */}
      {isRegionModalOpen && (
        <PopUpModal
          elements={regions}
          onChangeElement={onRegionChange}
          selectModalBackgroundRef={selectRegionModalBackgroundRef}
          selectModalRef={selectRegionModalRef}
          selectedElement={selectedRegion}
          setIsModalOpen={setIsRegionModalOpen}
          type={"Region"}
        />
      )}
    </section>
  );
};

export default CountryRegionFilter;
