import { Link } from "react-router-dom";
import FoodVideoCard from "../components/FoodVideoCard";
import { ArrowLeft } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FoodVideoPlayer from "../components/FoodVideoPlayer";
import { useState } from "react";

const FoodVideos = () => {
  const [isVideoPlayeropen, setIsVideoPlayeropen] = useState<boolean>(false);
  useGSAP(() => {
    gsap.from(".foodVideoCard", {
      y: 300,
      ease: "power3.out",
      duration: 1,
      opacity: 0,
      stagger: 0.1,
    });
  });

  const toggleVideoPlayer = (value: boolean) => {
    setIsVideoPlayeropen(value);
  };

  return (
    <section className="min-h-screen pt-2">
      <Link
        to={"/foods/3"}
        className="my-5 flex max-w-28 items-center justify-start gap-2 lg:ms-20"
      >
        <ArrowLeft width={20} />
        Back
      </Link>
      <h1 className="mb-5 text-center text-3xl font-bold">Food Name</h1>
      <div className="flex w-full flex-wrap items-center justify-center gap-5">
        <FoodVideoCard
          toggleVideoPlayer={toggleVideoPlayer}
          className="foodVideoCard"
        />
        <FoodVideoCard
          toggleVideoPlayer={toggleVideoPlayer}
          className="foodVideoCard"
        />
        <FoodVideoCard
          toggleVideoPlayer={toggleVideoPlayer}
          className="foodVideoCard"
        />
        <FoodVideoCard
          toggleVideoPlayer={toggleVideoPlayer}
          className="foodVideoCard"
        />
        <FoodVideoCard
          toggleVideoPlayer={toggleVideoPlayer}
          className="foodVideoCard"
        />
        <FoodVideoCard
          toggleVideoPlayer={toggleVideoPlayer}
          className="foodVideoCard"
        />
      </div>
      {isVideoPlayeropen && (
        <FoodVideoPlayer toggleVideoPlayer={toggleVideoPlayer} />
      )}
    </section>
  );
};

export default FoodVideos;
