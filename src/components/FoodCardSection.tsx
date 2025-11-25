import { useGSAP } from "@gsap/react";
import type { IFood } from "../types/food";
import FoodCard from "./FoodCard";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import type { IPaginatedResponse } from "../types/general";

const FoodCardSection = ({ foods }: { foods: IPaginatedResponse<IFood[]> }) => {
  const navigate = useNavigate();
  const { data, totalpages, page } = foods;
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const noFoodTextRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const gsapTimeline = gsap.timeline();

      const currentFoodCard = document.getElementById(selectedFoodId);
      const pagination = document.getElementById("pagination");

      if (currentFoodCard) {
        const otherFoodCards: (HTMLElement | null)[] = [];
        data.forEach((food) => {
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

        gsap.to(pagination, {
          autoAlpha: 0,
          duration: 0.2,
        });

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
          .to(".countryRegionFilter", {
            autoAlpha: 0,
            duration: 0.4,
          })
          .to(".food_components", {
            autoAlpha: 0,
            duration: 0.4,
          })
          .to(currentFoodCard, {
            rotateZ: 5,
            repeat: 1,
            yoyo: true,
            duration: 0.3,
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
        data.forEach((food) => {
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

  useGSAP(
    () => {
      gsap.set("#noFoodText1", {
        x: -2000,
        opacity: 0,
      });
      gsap.set("#noFoodText2", {
        x: 2000,
        opacity: 0,
      });
      gsap.set("#noFoodText3", {
        x: -2000,
        opacity: 0,
      });

      const noFoodTextTl = gsap.timeline();
      noFoodTextTl.to("#noFoodText1", {
        x: 0,
        opacity: 1,
        duration: 0.2,
        ease: "bounce.out",
      });

      noFoodTextTl.to("#noFoodText2", {
        x: 0,
        opacity: 1,
        duration: 0.2,
        ease: "bounce.out",
      });

      noFoodTextTl.to("#noFoodText3", {
        x: 0,
        opacity: 1,
        duration: 0.2,
        ease: "bounce.out",
      });
    },
    { dependencies: [data], scope: noFoodTextRef },
  );

  return (
    <section className="flex flex-col gap-4">
      {!data.length! && (
        <div className="min-h-screen pt-30 text-center" ref={noFoodTextRef}>
          <p className="my-7 text-5xl font-black" id="noFoodText1">
            No foods
          </p>
          <p className="my-7 text-5xl font-black" id="noFoodText2">
            currently
          </p>
          <p className="my-7 text-5xl font-black" id="noFoodText3">
            loaded currently!
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {data.map((food) => (
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
      <Pagination totalPages={totalpages} page={page} />
    </section>
  );
};

export default FoodCardSection;
