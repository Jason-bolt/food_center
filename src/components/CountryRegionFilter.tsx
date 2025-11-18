import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import PopUpModal from "./PopUpModal";
import { useSearchParams } from "react-router-dom";
// import constants from "../utils/constants";

const CountryRegionFilter = ({ className }: { className: string }) => {
  const queryParams = new URLSearchParams(location.search);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    queryParams.get("country") || "",
  );
  const [selectedRegion, setSelectedRegion] = useState("");
  // const [countries, setCountries] = useState([]);
  const selectCountryButtonRef = useRef<HTMLButtonElement>(null);
  const selectRegionButtonRef = useRef<HTMLButtonElement>(null);
  const selectCountryModalRef = useRef<HTMLDivElement>(null);
  const selectCountryModalBackgroundRef = useRef<HTMLDivElement>(null);
  const selectRegionModalBackgroundRef = useRef<HTMLDivElement>(null);
  const selectRegionModalRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  // Countries list
  const countries = [
    "all",
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
    "ghana",
  ];

  // useEffect(() => {
  //   const storedCouintries = localStorage.getItem("countries");
  //   const getCountries = async () => {
  //     const response = await fetch(constants.COUNTRIES_URL);
  //     const data = await response.json();
  //     console.log(data);
  //     const processedCountries = data?.map((c: { name: string }) =>
  //       c.name.toLocaleLowerCase(),
  //     );
  //     localStorage.setItem("countries", JSON.stringify(processedCountries));
  //     setCountries(processedCountries);
  //   };

  //   if (storedCouintries) {
  //     const parsedStoredCountries = JSON.parse(storedCouintries);
  //     setCountries(parsedStoredCountries);
  //   } else {
  //     getCountries();
  //   }
  // }, []);

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
    if (country === "all") {
      setSelectedCountry("");
      newSearchParams.delete("country");
      setSearchParams(newSearchParams);
    } else {
      setSelectedCountry(country);
      newSearchParams.set("country", country);
      setSearchParams(newSearchParams);
      console.log("Selected country:", country);
    }
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
      <div className="flex items-center justify-center gap-10">
        <button
          ref={selectCountryButtonRef}
          className={
            "px-2 py-1 text-sm text-gray-500 capitalize hover:cursor-pointer hover:text-gray-700 hover:underline"
          }
          onClick={() => setIsCountryModalOpen(true)}
        >
          {selectedCountry || "All Countries"}
        </button>
        {/* <button
          ref={selectRegionButtonRef}
          className="text-sm text-gray-500 py-1 px-2 hover:text-gray-700 hover:underline hover:cursor-pointer"
          onClick={() => setIsRegionModalOpen(true)}
        >
          {selectedRegion || "Region"}
        </button> */}
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
