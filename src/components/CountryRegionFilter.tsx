import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState } from "react";
import PopUpModal from "./PopUpModal";
import { useSearchParams } from "react-router-dom";

const CountryRegionFilter = ({ className }: { className: string }) => {
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const selectCountryButtonRef = useRef<HTMLButtonElement>(null);
  const selectCountryModalRef = useRef<HTMLDivElement>(null);
  const selectCountryModalBackgroundRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Derived from URL — stays in sync with browser back/forward without a separate state
  const selectedCountry = searchParams.get("country") || "";

  const countries = [
    "All Countries",
    "Algeria",
    "Angola",
    "Benin",
    "Botswana",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cameroon",
    "Central African Republic",
    "Chad",
    "Comoros",
    "Congo (Brazzaville)",
    "Congo (Kinshasa)",
    "Côte d'Ivoire",
    "Djibouti",
    "Egypt",
    "Equatorial Guinea",
    "Eritrea",
    "Eswatini",
    "Ethiopia",
    "Gabon",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Kenya",
    "Lesotho",
    "Liberia",
    "Libya",
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritania",
    "Mauritius",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Niger",
    "Nigeria",
    "Rwanda",
    "Sao Tome and Principe",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Sudan",
    "Tanzania",
    "Togo",
    "Tunisia",
    "Uganda",
    "Zambia",
    "Zimbabwe",
  ];

  const onCountryChange = (country: string) => {
    const params = new URLSearchParams(searchParams);
    if (country === "All Countries") {
      params.delete("country");
    } else {
      params.set("country", country.toLocaleLowerCase());
    }
    setSearchParams(params);
  };

  useGSAP(
    () => {
      if (isCountryModalOpen && selectCountryButtonRef.current) {
        const tl = gsap.timeline();
        tl.from(selectCountryModalRef.current, { y: -40, opacity: 0 });
        tl.from(selectCountryModalBackgroundRef.current, { opacity: 0, duration: 0.5 });
      }
    },
    { dependencies: [isCountryModalOpen] },
  );

  return (
    <section className={`${className} my-5`}>
      <div className="flex items-center justify-center gap-10">
        <button
          ref={selectCountryButtonRef}
          className="px-2 py-1 text-sm text-gray-500 capitalize hover:cursor-pointer hover:text-gray-700 hover:underline"
          onClick={() => setIsCountryModalOpen(true)}
        >
          {selectedCountry || "All Countries"}
        </button>
      </div>
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
    </section>
  );
};

export default CountryRegionFilter;
