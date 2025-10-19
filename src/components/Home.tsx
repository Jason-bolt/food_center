import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import type { HomeIngredientAnimation } from "../types/homeScreen";
import { Search } from "lucide-react";
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

const Home = () => {
  const brandName = useRef<HTMLHeadingElement>(null);
  const initialAnimationContainer = useRef<HTMLDivElement>(null);
  const navSection = useRef<HTMLBaseElement>(null);
  const [droppingIngredients, setDroppingIngredients] =
    useState<HomeIngredientAnimation[]>();

  const ingredients = [
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
  ];
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
  }, []);

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

      //   Navbar animation
      gsap.from(navSection.current, {
        autoAlpha: 1,
        delay: 2,
      });

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
      <nav
        ref={navSection}
        className="relative flex items-center justify-between border-b border-gray-100 bg-gray-50 px-10 py-5"
      >
        <h1 className="text-xl font-bold uppercase italic">
          <span className="text-red-500">FO</span>
          <span className="text-orange-500">OD</span>
          <span className="text-yellow-500"> C</span>
          <span className="text-green-500">EN</span>
          <span className="text-blue-500">TE</span>
          <span className="text-purple-500">R</span>
        </h1>
        <div className="flex items-center justify-center gap-10">
          <button className="text-gray-500 hover:cursor-pointer hover:text-gray-700 hover:underline">
            Country
          </button>
          <button className="text-gray-500 hover:cursor-pointer hover:text-gray-700 hover:underline">
            Region
          </button>
        </div>
        <div className="flex items-center justify-center gap-1 rounded-lg text-gray-700 hover:cursor-pointer hover:text-gray-500 hover:underline">
          <p>Search</p>
          <Search className="right-2 text-gray-700" height={20} width={20} />
        </div>

        {/* Search Modal */}
        <form action=""></form>
      </nav>
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
        <h1 className="z-10 text-7xl font-black uppercase" ref={brandName}>
          <span className="text-red-500">FO</span>
          <span className="text-orange-500">OD</span>
          <span className="text-yellow-500"> C</span>
          <span className="text-green-500">EN</span>
          <span className="text-blue-500">TE</span>
          <span className="text-purple-500">R</span>
        </h1>
      </div>
    </section>
  );
};

export default Home;
