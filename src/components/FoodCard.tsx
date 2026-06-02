import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import woodenSpoonCursor from "/wooden_spoon_cursor.png";
import type { IFood } from "../types/food";
import { summarizeCulturalStory } from "../utils/helpers/general";

const FoodCard = ({
  food,
  isAdminView,
  updateSelectedFood,
}: {
  food: IFood;
  isAdminView?: boolean;
  updateSelectedFood?: (foodId: string) => void;
}) => {
  const foodBoxScopeRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const foodDetailsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set(foodDetailsRef.current, { opacity: 0, y: -10 });
      gsap.set(darkOverlayRef.current, { opacity: 0.7 });
      gsap.to(darkOverlayRef.current, { opacity: 0.4, duration: 0.5 });

      const darkOverlayAnimation = gsap.to(darkOverlayRef.current, {
        paused: true,
        opacity: 0,
        duration: 0.5,
      });

      const overlayTextAnimation = gsap.to(foodDetailsRef.current, {
        paused: true,
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // Store named handlers so removeEventListener receives the same reference
      const onMouseEnter = () => {
        darkOverlayAnimation.play();
        overlayTextAnimation.play();
      };
      const onMouseLeave = () => {
        darkOverlayAnimation.reverse();
        overlayTextAnimation.reverse();
      };

      foodBoxScopeRef.current?.addEventListener("mouseenter", onMouseEnter);
      foodBoxScopeRef.current?.addEventListener("mouseleave", onMouseLeave);

      return () => {
        foodBoxScopeRef.current?.removeEventListener("mouseenter", onMouseEnter);
        foodBoxScopeRef.current?.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    { scope: foodBoxScopeRef },
  );

  return (
    <div
      ref={foodBoxScopeRef}
      className="relative h-96 rounded-xl bg-gray-400"
      style={{ cursor: `url(${woodenSpoonCursor}), auto` }}
    >
      {isAdminView && (
        <div className="absolute top-0 z-20 right-0">
          <button
            onClick={() => updateSelectedFood?.(food._id)}
            className="rounded-md rounded-tr-xl rounded-tl-none rounded-br-none bg-orange-400 px-5 py-2 text-white hover:cursor-pointer hover:bg-orange-500"
          >
            Edit
          </button>
        </div>
      )}
      <img
        src={food.imageUrl}
        alt={food.name}
        className="h-full w-full rounded-xl object-cover object-center"
      />
      <div
        ref={darkOverlayRef}
        className="food_components absolute top-0 h-full w-full rounded-xl bg-black"
      ></div>
      <div
        ref={foodDetailsRef}
        className="food_components absolute bottom-0 w-full rounded-b-xl bg-black/70"
      >
        <div className="items-top flex flex-col justify-start px-4 py-5">
          <h1 className="mb-2 text-2xl font-black text-white capitalize">
            {food.name}
          </h1>
          <p className="text-xs">
            <span className="font-bold text-orange-400">Countries:</span>{" "}
            <span className="text-white capitalize">
              {food.countries.join(", ")}
            </span>
          </p>
          <p className="text-xs">
            <span className="font-bold text-orange-400">Region:</span>{" "}
            <span className="text-white">{food.region}</span>
          </p>
          <p className="text-xs">
            <span className="font-bold text-orange-400">Ingredients:</span>{" "}
            <span className="line-clamp-2 text-white capitalize">
              {food?.ingredients?.join(", ")}
            </span>
          </p>
          <div className="mt-5 flex flex-col items-start justify-center">
            <h1 className="text-sm font-bold text-white underline">
              Cultural Story:
            </h1>
            <p className="text-sm text-gray-300">
              {summarizeCulturalStory(food.culturalStory, 200, 280)}{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
