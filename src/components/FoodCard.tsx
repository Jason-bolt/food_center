import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const FoodCard = () => {
  const foodBoxScopeRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);
  const foodDetailsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Set initial states
      gsap.set(foodDetailsRef.current, { opacity: 0, y: -10 });
      gsap.set(darkOverlayRef.current, { opacity: 0.7 });

      // Initial subtle fade-in for dark overlay
      gsap.to(darkOverlayRef.current, {
        opacity: 0.4,
        duration: 0.5,
      });

      // Hover animations
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

      foodBoxScopeRef.current?.addEventListener("mouseenter", () => {
        darkOverlayAnimation.play();
        overlayTextAnimation.play();
      });

      foodBoxScopeRef.current?.addEventListener("mouseleave", () => {
        darkOverlayAnimation.reverse();
        overlayTextAnimation.reverse();
      });
    },
    { scope: foodBoxScopeRef },
  );

  return (
    <div
      ref={foodBoxScopeRef}
      className="relative h-96 rounded-xl bg-gray-400 hover:cursor-pointer"
    >
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070"
        alt="thumbnail"
        className="h-full w-full rounded-xl object-cover object-center"
      />
      <div
        ref={darkOverlayRef}
        className="absolute top-0 z-10 h-full w-full rounded-xl bg-black"
      ></div>
      <div
        ref={foodDetailsRef}
        className="absolute bottom-0 w-full rounded-b-xl bg-black/70"
      >
        <div className="items-top flex flex-col justify-start px-4 py-5">
          <h1 className="text-xl font-black text-white">Food name</h1>
          <p className="text-xs text-white">
            <span>Country:</span> Ghana
          </p>
          <p className="text-xs text-white">
            <span>Region:</span> Central region
          </p>
          <div className="mt-5 flex flex-col items-start justify-center">
            <h1 className="text-sm font-bold text-white underline">
              Cultural Story:
            </h1>
            <p className="text-sm text-gray-200">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Dignissimos ipsa iure, culpa inventore repellat libero praesentium
              nostrum architecto dolores doloribus unde eveniet alias ullam
              exercitationem recusandae laboriosam hic atque quaerat. Harum sint
              officiis et, consectetur quo quas illo! Nostrum, exercitationem
              enim quaerat quidem quia ad nihil qui pariatur temporibus nulla!
              Eligendi corrupti eius, quis cupiditate recusandae illum amet
              ducimus, voluptas reprehenderit ipsum eos quasi molestias
              laudantium eveniet voluptatem itaque. Numquam?...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
