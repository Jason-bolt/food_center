import { useGSAP } from "@gsap/react";
import FoodCardSection from "../components/FoodCardSection";
import gsap from "gsap";
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
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import type { HomeIngredientAnimation } from "../types/homeScreen";
import CountryRegionFilter from "../components/CountryRegionFilter";
import type { IFood } from "../types/food";
import type { IPaginatedResponse } from "../types/general";
import { useLocation } from "react-router-dom";
import { FoodSectionContext } from "../contexts/FoodSectionContext";
import { InitialLoadContext } from "../contexts/InitialLoadContext";

const Home = () => {
  const location = useLocation();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

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
  const [fetchedFoods, setFetchedFoods] = useState<IPaginatedResponse<IFood[]>>(
    {
      data: [],
      totalpages: 0,
      page: 0,
      totalItems: 0,
    },
  );
  const [searchQuery, setSearchQuery] = useState("");
  const foodSectionContext = useContext(FoodSectionContext);
  const initialLoadContext = useContext(InitialLoadContext);

  // Get foods from API
  useEffect(() => {
    setSearchQuery(queryParams.get("search") || "");
    const fetchFoods = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/foods?${queryParams.toString()}`,
      );
      const data = await response.json();
      setFetchedFoods(data);
    };
    fetchFoods();
  }, [location.search, queryParams]);

  const foodSectionRef = foodSectionContext.foodSectionRef!;
  const [droppingIngredients, setDroppingIngredients] =
    useState<HomeIngredientAnimation[]>();

  const brandName = useRef<HTMLHeadingElement>(null);
  const initialAnimationContainer = useRef<HTMLElement>(null);

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
      if (!foodSectionRef.current) return;

      const queryParams = new URLSearchParams(location.search);
      const isHomePage = queryParams.toString() === "";

      if (
        isHomePage &&
        !initialLoadContext.initialLoadAlreadyHappened?.current
      ) {
        gsap.fromTo(
          foodSectionRef.current,
          {
            autoAlpha: 0,
            y: 50,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            delay: 5,
            ease: "power2.out",
          },
        );
      } else {
        gsap.fromTo(
          foodSectionRef.current,
          {
            autoAlpha: 0,
            y: 50,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
        );
      }
    },
    { dependencies: [fetchedFoods.data.length] },
  );

  useGSAP(
    () => {
      if (
        queryParams.toString() === "" &&
        !initialLoadContext.initialLoadAlreadyHappened?.current
      ) {
        gsap.set(".countryRegionFilter", {
          autoAlpha: 0,
        });
        // Brand name animation
        const brandTl = gsap.timeline();
        brandTl
          .fromTo(
            brandName.current,
            {
              autoAlpha: 0,
              scale: 0,
            },
            {
              y: -90,
              delay: 1,
              autoAlpha: 1,
              duration: 1,
              ease: "bounce",
              scale: 1,
            },
          )
          .to(brandName.current, {
            delay: 1,
            rotation: 5,
            scale: 1.2,
            yoyo: true,
            repeat: 1,
            duration: 0.2,
          })
          .to(brandName.current, {
            delay: 1,
            duration: 1,
            ease: "power1",
            autoAlpha: 0,
          })
          .to(".countryRegionFilter", {
            autoAlpha: 1,
          });

        // Dropping ingredients animation
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
      } else {
        gsap.set(brandName.current, {
          autoAlpha: 0,
        });
        droppingIngredients?.forEach((fruit) => {
          const dropElement = document.getElementById(`fruit-${fruit.id}`);
          if (dropElement) {
            gsap.set(dropElement, {
              autoAlpha: 0,
            });
          }
        });
      }
    },
    {
      dependencies: [droppingIngredients, location.search],
      scope: initialAnimationContainer,
    },
  );

  return (
    <section className="min-h-screen pt-2" ref={initialAnimationContainer}>
      <CountryRegionFilter className="countryRegionFilter" />
      {searchQuery && (
        <div className="my-5">
          Search Results for:{" "}
          <span className="text-xl font-semibold">{searchQuery}</span>
        </div>
      )}
      <section className="fixed inset-0 mt-30">
        <div className="relative flex h-screen w-screen items-center justify-center gap-3 overflow-hidden">
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
          <h1
            className="z-10 mx-auto text-center text-5xl font-black uppercase lg:text-7xl"
            ref={brandName}
          >
            <span className="text-red-500">FO</span>
            <span className="text-orange-500">OD</span>
            <span className="text-yellow-500"> C</span>
            <span className="text-green-500">EN</span>
            <span className="text-blue-500">TE</span>
            <span className="text-purple-500">R</span>
          </h1>
        </div>
      </section>
      <div ref={foodSectionRef}>
        <FoodCardSection foods={fetchedFoods} />
      </div>
    </section>
  );
};

export default Home;
