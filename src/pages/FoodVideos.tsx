import { Link, useParams } from "react-router-dom";
import FoodVideoCard from "../components/FoodVideoCard";
import { ArrowLeft } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FoodVideoPlayer from "../components/FoodVideoPlayer";
import { useEffect, useRef, useState } from "react";
import PopUpModal from "../components/PopUpModal";
import NotFound from "./NotFound";
import type { IFoodVideo } from "../types/food";

const FoodVideos = () => {
  const [isVideoPlayeropen, setIsVideoPlayeropen] = useState<boolean>(false);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState<boolean>(false);
  const [selectedCreator, setSelectedCreator] = useState<string>("");
  const [foodVideos, setFoodVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const selectCreatorModalBackgroundRef = useRef<HTMLDivElement>(null);
  const selectCreatorModalRef = useRef<HTMLDivElement>(null);
  const selectCreatorButtonRef = useRef<HTMLButtonElement>(null);

  const { id } = useParams();

  // Get foods from API
  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/foods/${id}/influencers`,
      );
      if (!response.ok) {
        setLoading(false);
        setError(true);
        return;
      }
      const data = await response.json();
      setFoodVideos(data);
      setLoading(false);
    };
    fetchFood();
  }, [id]);

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

  useGSAP(
    () => {
      if (loading || error) return;
      gsap.from(".foodVideoCard", {
        y: 300,
        ease: "power3.out",
        duration: 1,
        opacity: 0,
        stagger: 0.1,
      });
    },
    { dependencies: [loading, error] },
  );

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

  if (loading) {
    // return <SingleFoodLoading />;
    return "Loading";
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <section className="min-h-screen pt-2">
      <Link
        to={`/foods/${id}`}
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
        {foodVideos.map((foodVideo: IFoodVideo) => (
          <div onClick={() => setSelectedVideoId(foodVideo.videoId)}>
            <FoodVideoCard
              imageUrl={foodVideo.videoThumbnailUrl}
              title={foodVideo.videoTitle}
              influencerId={foodVideo.influencer._id}
              influencerName={foodVideo.influencer.name}
              publishedAt={foodVideo.videoPublishedAt}
              toggleVideoPlayer={toggleVideoPlayer}
              className="foodVideoCard"
            />
          </div>
        ))}
      </div>
      {isVideoPlayeropen && (
        <FoodVideoPlayer
          videoId={selectedVideoId}
          toggleVideoPlayer={toggleVideoPlayer}
        />
      )}
    </section>
  );
};

export default FoodVideos;
