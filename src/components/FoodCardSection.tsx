import { useGSAP } from "@gsap/react";
import type { IFood } from "../types/food";
import FoodCard from "./FoodCard";
import { useState } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

const FoodCardSection = ({ foods }: { foods: IFood[] }) => {
  const navigate = useNavigate();
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  useGSAP(
    () => {
      const gsapTimeline = gsap.timeline();

      const currentFoodCard = document.getElementById(selectedFoodId);
      const pagination = document.getElementById("pagination");

      if (currentFoodCard) {
        const otherFoodCards: (HTMLElement | null)[] = [];
        foods.forEach((food) => {
          if (food._id != selectedFoodId) {
            otherFoodCards.push(document.getElementById(food._id));
          }
        });

        gsap.to(otherFoodCards, {
          autoAlpha: 0,
          duration: 0.4,
          scale: 0.9,
        });

        // Get viewport center
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const cardRect = currentFoodCard.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;

        // Calculate center position
        const centerX = viewportWidth / 2 - cardWidth / 2 - cardRect.left;
        const centerY = viewportHeight / 2 - cardHeight / 2 - cardRect.top;

        // Set z-index for layering
        gsap.set(currentFoodCard, { zIndex: 1000 });

        gsapTimeline
          .to(currentFoodCard, {
            scale: 1.25,
            duration: 1.5,
            ease: "power2.out",
            x: centerX,
            y: centerY - 20,
            z: 200,
            rotateY: -8,
            autoAlpha: 1,
          })
          .to(".food_components", {
            autoAlpha: 0,
            duration: 0.7,
          })
          .to(pagination, {
            autoAlpha: 0,
            duration: 0.2,
          })
          .to(currentFoodCard, {
            opacity: 0,
            duration: 0.5,
            scale: 2,
            onComplete: () => {
              navigate(`/foods/${selectedFoodId}`);
            },
          });
      } else {
        // Reset all cards when nothing is selected
        foods.forEach((food) => {
          const card = document.getElementById(food._id);
          if (card) {
            gsap.to(card, {
              x: 0,
              y: 0,
              scale: 1,
              rotateY: 0,
              z: 0,
              autoAlpha: 1,
              duration: 0.5,
            });
            gsap.set(card, { zIndex: "auto" });
          }
        });
      }
    },
    { dependencies: [selectedFoodId] },
  );

  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {foods.map((food) => (
          <div
            onClick={() =>
              setSelectedFoodId(selectedFoodId === food._id ? "" : food._id)
            }
            id={food._id}
            key={food._id}
            className=""
          >
            <FoodCard food={food} />
          </div>
        ))}
      </div>
      <div id={"pagination"} className="flex items-center justify-center gap-5">
        <button className="px-4 py-2 font-semibold text-green-500 hover:underline">
          Prev
        </button>
        <div className="flex items-center justify-center gap-2">
          <p>1</p>
          <p className="text-xs">of</p>
          <p>10</p>
        </div>
        <button className="px-4 py-2 font-semibold text-blue-500 hover:underline">
          Next
        </button>
      </div>
    </section>
  );
};

export default FoodCardSection;
