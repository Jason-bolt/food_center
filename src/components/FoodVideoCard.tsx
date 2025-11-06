import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useRef } from "react";

const FoodVideoCard = ({ className }: { className: string }) => {
  gsap.registerPlugin(Observer);
  const foodVideoCard = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    Observer.create({
      target: foodVideoCard.current,
      type: "pointer",
      onHover: () => {
        gsap.to(foodVideoCard.current, {
          scale: 1.04,
          duration: 0.3,
          ease: "power2.out",
          rotate: 1,
        });
      },
      onHoverEnd: () => {
        gsap.to(foodVideoCard.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          rotate: 0,
        });
      },
    });
  });

  return (
    <div
      className={`${className} mb-2 flex w-full flex-col hover:cursor-pointer md:w-fit`}
      ref={foodVideoCard}
    >
      <img
        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1081"
        alt="thumbnail"
        className="h-72 w-full rounded-xl object-cover object-center md:w-96"
      />
      <div className="pt-1">
        <h2 className="font-semibold">How to prepare jollof: Ghana style!</h2>
        <div className="flex flex-col">
          <h1 className="text-xs underline">Creator:</h1>
          <p className="text-xs">Chef Abby</p>
        </div>
      </div>
    </div>
  );
};

export default FoodVideoCard;
