import { Link } from "react-router-dom";
import potOfFood from "../assets/utensils/pot-of-food.svg";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
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
import type { HomeIngredientAnimation } from "../types/homeScreen";

const NotFound = () => {
  const potOfFoodRef = useRef<HTMLImageElement>(null);
  const leftFour = useRef<HTMLSpanElement>(null);
  const rightFour = useRef<HTMLSpanElement>(null);
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

  useGSAP(() => {
    const spinningPot = gsap.timeline();
    spinningPot
      .from(potOfFoodRef.current, {
        opacity: 0,
        duration: 0.5,
      })
      .to(potOfFoodRef.current, {
        rotate: 360,
        duration: 2,
        ease: "linear",
        repeat: -1,
      });

    potOfFoodRef.current?.addEventListener("mouseenter", () => {
      spinningPot.pause();
    });

    potOfFoodRef.current?.addEventListener("mouseleave", () => {
      spinningPot.play();
    });

    leftFour.current?.addEventListener("click", () => {
      gsap.to(leftFour.current, {
        y: -20,
        repeat: 1,
        yoyo: true,
        duration: 0.2,
        ease: "power1.out",
      });
    });
    rightFour.current?.addEventListener("click", () => {
      gsap.to(rightFour.current, {
        y: -20,
        repeat: 1,
        yoyo: true,
        duration: 0.2,
        ease: "power1.out",
      });
    });

    return () => {
      potOfFoodRef.current?.removeEventListener("mouseenter", () => {
        spinningPot.pause();
      });

      potOfFoodRef.current?.removeEventListener("mouseleave", () => {
        spinningPot.play();
      });

      leftFour.current?.removeEventListener("click", () => {
        gsap.to(leftFour.current, {
          y: -20,
          repeat: 1,
          yoyo: true,
          duration: 0.2,
          ease: "power1.out",
        });
      });
      rightFour.current?.removeEventListener("click", () => {
        gsap.to(rightFour.current, {
          y: -20,
          repeat: 1,
          yoyo: true,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };
  });

  useGSAP(
    () => {
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
              repeat: -1,
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
    {
      dependencies: [droppingIngredients],
    },
  );

  return (
    <section className="min-h-screen pt-2 lg:px-72">
      <section className="fixed inset-0 -z-10 mt-30">
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
        </div>
      </section>
      <div className="-mt-20 flex h-screen flex-col items-center justify-center gap-5">
        <h1 className="flex items-center justify-center text-9xl font-bold">
          <span className="text-red-400 hover:cursor-pointer" ref={leftFour}>
            4
          </span>
          <img
            ref={potOfFoodRef}
            src={potOfFood}
            alt="pot-of-food"
            className="h-50 w-50"
          />
          <span
            className="text-purple-400 hover:cursor-pointer"
            ref={rightFour}
          >
            4
          </span>
        </h1>
        <p className="text-lg">Page not found</p>
        <Link to={"/"} className="text-blue-500">
          Go back to home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
