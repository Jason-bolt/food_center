import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState, useMemo } from "react";
import type { HomeIngredientAnimation } from "../types/homeScreen";
import apple from "../assets/ingredients/apple-svgrepo-com.svg";
import banana from "../assets/ingredients/banana-svgrepo-com.svg";
import carrot from "../assets/ingredients/carrot-svgrepo-com.svg";
import chicken1 from "../assets/ingredients/chicken-leg-chicken1-svgrepo-com.svg";
import chicken from "../assets/ingredients/chicken-leg-chicken-svgrepo-com.svg";
import corn from "../assets/ingredients/corn-svgrepo-com.svg";
import friedEgg from "../assets/ingredients/fried-egg-svgrepo-com.svg";
import grapes from "../assets/ingredients/grapes-grape-svgrepo-com.svg";
import hamburger from "../assets/ingredients/hamburger-food-svgrepo-com.svg";
import honey from "../assets/ingredients/honey-svgrepo-com.svg";
import lemon from "../assets/ingredients/lemon-svgrepo-com.svg";
import peach from "../assets/ingredients/peach-svgrepo-com.svg";
import pear from "../assets/ingredients/pear-svgrepo-com.svg";
import potato from "../assets/ingredients/potato-svgrepo-com.svg";
import pumpkin from "../assets/ingredients/pumpkin-svgrepo-com.svg";
import roast from "../assets/ingredients/roast-chicken-chicken-svgrepo-com.svg";
import strawberry from "../assets/ingredients/strawberry-svgrepo-com.svg";
import watermelon from "../assets/ingredients/watermelon-diet-svgrepo-com.svg";
import Navbar from "./Navbar";

interface HomeProps {
  searchQuery?: string;
  selectedCountry?: string;
  selectedRegion?: string;
  onSearchChange?: (query: string) => void;
  onCountryChange?: (country: string) => void;
  onRegionChange?: (region: string) => void;
}

const Home = ({
  searchQuery = "",
  selectedCountry = "",
  selectedRegion = "",
  onSearchChange,
  onCountryChange,
  onRegionChange,
}: HomeProps) => {
  const brandName = useRef<HTMLHeadingElement>(null);
  const initialAnimationContainer = useRef<HTMLDivElement>(null);
  const [droppingIngredients, setDroppingIngredients] =
    useState<HomeIngredientAnimation[]>();

  const ingredients = useMemo(
    () => [
      apple,
      banana,
      carrot,
      chicken,
      chicken1,
      corn,
      friedEgg,
      grapes,
      hamburger,
      honey,
      lemon,
      peach,
      pear,
      potato,
      pumpkin,
      roast,
      strawberry,
      watermelon,
    ],
    [],
  );
  gsap.registerPlugin(useGSAP);

  useEffect(() => {
    const fruitDroppings: HomeIngredientAnimation[] = [];
    for (let i = 0; i < ingredients.length; i++) {
      fruitDroppings.push({
        id: i,
        image: ingredients[i],
        x: Math.random() * 100, // Random horizontal position (0-100%)
        delay: Math.random() * 3, // Random delay (0-3 seconds)
        duration: 2 + Math.random() * 3, // Random duration (2-5 seconds)
      });
    }

    setDroppingIngredients(fruitDroppings);
  }, [ingredients]);

  useGSAP(
    () => {
      // Brand name animation
      gsap.fromTo(
        brandName.current,
        {
          autoAlpha: 0,
          scale: 0,
        },
        {
          y: -90,
          delay: 1,
          autoAlpha: 1,
          duration: 2,
          ease: "bounce",
          scale: 1,
          onComplete: () => {
            gsap.to(brandName.current, {
              delay: 1,
              rotation: 5,
              scale: 1.2,
              yoyo: true,
              repeat: 1,
              duration: 0.2,
              onComplete: () => {
                gsap.to(brandName.current, {
                  delay: 1,
                  duration: 2.5,
                  ease: "power1",
                  autoAlpha: 0,
                });
              },
            });
          },
        },
      );

      droppingIngredients?.forEach((fruit) => {
        const dropElement = document.getElementById(`fruit-${fruit.id}`);
        if (dropElement) {
          gsap.fromTo(
            dropElement,
            {
              y: -100,
              opacity: 0,
            },
            {
              y: "100vh",
              opacity: 1,
              duration: fruit.duration,
              delay: fruit.delay,
              ease: "power2.out",
              //   repeat: 2,
              //   repeatDelay: Math.random() * 2,
              onComplete: () => {
                gsap.to(dropElement, {
                  autoAlpha: 0,
                  duration: 0.8,
                  ease: "power1.out",
                });
              },
            },
          );
        }
      });
    },
    { dependencies: [droppingIngredients], scope: initialAnimationContainer },
  );

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
      <div
        ref={initialAnimationContainer}
        className="relative flex h-screen w-screen items-center justify-center gap-3 overflow-hidden"
      >
        {droppingIngredients?.map((fruit) => (
          <img
            key={fruit.id}
            id={`fruit-${fruit.id}`}
            className="absolute"
            src={fruit.image}
            alt={fruit.image}
            style={{
              left: `${fruit.x}%`,
              top: -50,
            }}
            height={50}
            width={50}
          />
        ))}
        <h1 className="z-10 text-5xl lg:text-7xl font-black uppercase" ref={brandName}>
          <span className="text-red-500">FO</span>
          <span className="text-orange-500">OD</span>
          <span className="text-yellow-500"> C</span>
          <span className="text-green-500">EN</span>
          <span className="text-blue-500">TE</span>
          <span className="text-purple-500">R</span>
        </h1>

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
  );
};

export default Home;
