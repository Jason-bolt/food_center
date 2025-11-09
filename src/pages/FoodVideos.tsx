import { Link } from "react-router-dom";
import FoodVideoCard from "../components/FoodVideoCard";
import { ArrowLeft } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FoodVideoPlayer from "../components/FoodVideoPlayer";
import { useRef, useState } from "react";
import PopUpModal from "../components/PopUpModal";

const FoodVideos = () => {
  const [isVideoPlayeropen, setIsVideoPlayeropen] = useState<boolean>(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState<boolean>(false);
  const [selectedCreator, setSelectedCreator] = useState<string>("");
  const selectCreatorModalBackgroundRef = useRef<HTMLDivElement>(null);
  const selectCreatorModalRef = useRef<HTMLDivElement>(null);
  const selectCreatorButtonRef = useRef<HTMLButtonElement>(null);

  const creators = [
    "All creators",
    "Chef Abby",
    "Chef John",
    "Chef Jane",
    "Chef Jim",
    "Chef Jill",
    "Chef Jack",
  ];

  const onCreatorChange = (creator: string) => {
    setSelectedCreator(creator);
  };

  useGSAP(() => {
    gsap.from(".foodVideoCard", {
      y: 300,
      ease: "power3.out",
      duration: 1,
      opacity: 0,
      stagger: 0.1,
    });
  });

  useGSAP(
    () => {
      if (isCreatorModalOpen && selectCreatorButtonRef.current) {
        const tl = gsap.timeline();
        tl.from(selectCreatorModalRef.current, {
          y: -40,
          opacity: 0,
        });
        tl.from(selectCreatorModalBackgroundRef.current, {
          opacity: 0,
          duration: 0.5,
        });
      }
    },
    {
      dependencies: [isCreatorModalOpen],
    },
  );

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
      <div className="flex items-center justify-center">
        <button
          className="px-4 pb-5 text-sm text-gray-500 hover:cursor-pointer hover:text-gray-700 hover:underline"
          ref={selectCreatorButtonRef}
          onClick={() => setIsCreatorModalOpen(true)}
        >
          {selectedCreator || "All creators"}
        </button>
        {isCreatorModalOpen && (
          <PopUpModal
            elements={creators}
            onChangeElement={onCreatorChange}
            selectModalBackgroundRef={selectCreatorModalBackgroundRef}
            selectModalRef={selectCreatorModalRef}
            selectedElement={selectedCreator}
            setIsModalOpen={setIsCreatorModalOpen}
            type={"Creator"}
          />
        )}
      </div>
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
