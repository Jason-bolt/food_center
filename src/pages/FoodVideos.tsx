import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import FoodVideoCard from "../components/FoodVideoCard";
import { ArrowLeft } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FoodVideoPlayer from "../components/FoodVideoPlayer";
import { useEffect, useMemo, useRef, useState } from "react";
import PopUpModal from "../components/PopUpModal";
import NotFound from "./NotFound";
import SingleFoodLoading from "../components/loadings/SingleFoodLoading";
import type { IFood, IFoodVideo } from "../types/food";
import type { IInfluencers } from "../types/influencers";

const FoodVideos = () => {
  const [isVideoPlayeropen, setIsVideoPlayeropen] = useState<boolean>(false);
  const [isInfluencerModalOpen, setIsInfluencerModalOpen] = useState<boolean>(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>("");
  const [foodVideos, setFoodVideos] = useState<IFoodVideo[]>([]);
  const [isFoodLoading, setIsFoodLoading] = useState(true);
  const [isVideosLoading, setIsVideosLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string>("");
  const [foodInfluencers, setFoodInfluencers] = useState<
    { _id: string; name: string }[]
  >([]);
  const [fetchedFood, setFetchedFood] = useState<IFood>();
  const [searchParams, setSearchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);
  const selectInfluencerModalBackgroundRef = useRef<HTMLDivElement>(null);
  const selectInfluencerModalRef = useRef<HTMLDivElement>(null);
  const selectInfluencerButtonRef = useRef<HTMLButtonElement>(null);
  const noVideoTextRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const location = useLocation();

  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  useEffect(() => {
    const fetchFood = async () => {
      setIsFoodLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/foods/${id}`,
      );
      if (!response.ok) {
        setError(true);
      } else {
        const data = await response.json();
        setFetchedFood(data);
      }
      setIsFoodLoading(false);
    };
    fetchFood();
  }, [id]);

  useEffect(() => {
    const fetchFoodVideos = async () => {
      setIsVideosLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/foods/${id}/influencers?${queryParams.toString()}`,
      );
      if (!response.ok) {
        setError(true);
      } else {
        const data = await response.json();
        setFoodVideos(data);
      }
      setIsVideosLoading(false);
    };
    fetchFoodVideos();
  }, [id, queryParams]);

  useEffect(() => {
    const fetchInfluencers = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/influencers`,
      );
      if (!response.ok) {
        setError(true);
        return;
      }
      const data = await response.json();
      const influencers = data.map((influencer: IInfluencers) => ({
        _id: influencer._id,
        name: influencer.name,
      }));
      setFoodInfluencers([{ _id: "", name: "all influencers" }, ...influencers]);
    };
    fetchInfluencers();
  }, []);

  useEffect(() => {
    if (!foodInfluencers.length) return;
    const influencerId = queryParams.get("influencerId");
    const urlInfluencer = foodInfluencers.find((fi) => fi._id === influencerId);
    if (urlInfluencer) setSelectedInfluencer(urlInfluencer.name);
  }, [foodInfluencers, queryParams]);

  const onCreatorChange = (creator: string) => {
    setSelectedInfluencer(creator);

    if (creator === "all influencers") {
      newSearchParams.delete("influencerId");
      setSearchParams(newSearchParams);
      return;
    }

    const chosenInfluencer = foodInfluencers.find(
      (fi) => fi.name.toLocaleLowerCase() === creator.toLocaleLowerCase(),
    );
    if (chosenInfluencer) {
      newSearchParams.set("influencerId", chosenInfluencer._id);
      setSearchParams(newSearchParams);
    }
  };

  useGSAP(
    () => {
      if (!foodVideos.length) return;
      gsap.from(".foodVideoCard", {
        y: 300,
        ease: "power3.out",
        duration: 1,
        opacity: 0,
        stagger: 0.1,
      });
    },
    { dependencies: [foodVideos.length] },
  );

  useGSAP(
    () => {
      if (isInfluencerModalOpen && selectInfluencerButtonRef.current) {
        const tl = gsap.timeline();
        tl.from(selectInfluencerModalRef.current, { y: -40, opacity: 0 });
        tl.from(selectInfluencerModalBackgroundRef.current, {
          opacity: 0,
          duration: 0.5,
        });
      }
    },
    { dependencies: [isInfluencerModalOpen] },
  );

  const toggleVideoPlayer = (value: boolean) => setIsVideoPlayeropen(value);

  useGSAP(
    () => {
      gsap.set("#noVideoText1", { x: -2000, opacity: 0 });
      gsap.set("#noVideoText2", { x: 2000, opacity: 0 });
      gsap.set("#noVideoText3", { x: -2000, opacity: 0 });

      const tl = gsap.timeline();
      tl.to("#noVideoText1", { x: 0, opacity: 1, duration: 0.2, ease: "bounce.out" });
      tl.to("#noVideoText2", { x: 0, opacity: 1, duration: 0.2, ease: "bounce.out" });
      tl.to("#noVideoText3", { x: 0, opacity: 1, duration: 0.2, ease: "bounce.out" });
    },
    { dependencies: [foodVideos], scope: noVideoTextRef },
  );

  if (isFoodLoading || isVideosLoading) {
    return <SingleFoodLoading />;
  }

  if (error) {
    return <NotFound />;
  }

  return (
    <section className="min-h-screen pt-2">
      <div className="px-4 sm:px-6 lg:px-8">
      <Link
        to={`/foods/${id}`}
        className="my-5 inline-flex max-w-28 items-center justify-start gap-2"
      >
        <ArrowLeft width={20} />
        Back
      </Link>
      </div>
      <h1 className="mb-3 px-4 text-center text-2xl font-bold sm:text-3xl">
        {fetchedFood?.name}
      </h1>
      <div className="flex items-center justify-center">
        <button
          className="px-4 pb-5 text-sm text-gray-500 capitalize hover:cursor-pointer hover:text-gray-700 hover:underline"
          ref={selectInfluencerButtonRef}
          onClick={() => setIsInfluencerModalOpen(true)}
          title="Select creator"
        >
          {selectedInfluencer || "All creators"}
        </button>
        {isInfluencerModalOpen && (
          <PopUpModal
            elements={foodInfluencers.map((fi) => fi.name.toLocaleLowerCase())}
            onChangeElement={onCreatorChange}
            selectModalBackgroundRef={selectInfluencerModalBackgroundRef}
            selectModalRef={selectInfluencerModalRef}
            selectedElement={selectedInfluencer}
            setIsModalOpen={setIsInfluencerModalOpen}
            type={"Creator"}
          />
        )}
      </div>
      <div className="mb-20 grid w-full grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {!foodVideos.length && (
          <div className="col-span-full mt-20 text-center" ref={noVideoTextRef}>
            <p className="my-5 text-4xl font-black sm:text-5xl" id="noVideoText1">No videos</p>
            <p className="my-5 text-4xl font-black sm:text-5xl" id="noVideoText2">for this</p>
            <p className="my-5 text-4xl font-black sm:text-5xl" id="noVideoText3">food / influencer</p>
          </div>
        )}
        {foodVideos.map((foodVideo: IFoodVideo) => (
          <div
            key={foodVideo.videoId}
            onClick={() => setSelectedVideoId(foodVideo.videoId)}
          >
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
