import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useMemo, useRef } from "react";

const FoodVideoCard = ({
  className,
  imageUrl,
  title,
  influencerName,
  publishedAt,
  toggleVideoPlayer,
}: {
  className: string;
  imageUrl: string;
  title: string;
  influencerId?: string;
  influencerName: string;
  publishedAt: string;
  toggleVideoPlayer: (value: boolean) => void;
}) => {
  gsap.registerPlugin(Observer);
  const foodVideoCard = useRef<HTMLDivElement>(null);

  const processedDate = useMemo(() => {
    const dateObject = new Date(publishedAt);
    return dateObject.toDateString();
  }, [publishedAt]);

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
      onClick={() => toggleVideoPlayer(true)}
    >
      <img
        src={imageUrl}
        alt={title}
        className="h-72 w-full rounded-xl object-cover object-center md:w-96"
      />
      <div className="max-w-96 pt-1">
        <h2 className="leading-5 font-semibold">{title}</h2>
        <p className="mb-1 text-xs font-extralight text-gray-500">
          {processedDate}
        </p>
        <div className="flex flex-col">
          <h1 className="text-xs underline">Creator:</h1>
          <p className="text-xs">{influencerName}</p>
        </div>
      </div>
    </div>
  );
};

export default FoodVideoCard;
