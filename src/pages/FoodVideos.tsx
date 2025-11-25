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
import type { IFood, IFoodVideo } from "../types/food";
import type { IInfluencers } from "../types/influencers";

const FoodVideos = () => {
  const [isVideoPlayeropen, setIsVideoPlayeropen] = useState<boolean>(false);
  const [isInfluencerModalOpen, setIsInfluencerModalOpen] =
    useState<boolean>(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<string>("");
  const [foodVideos, setFoodVideos] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/foods/${id}`,
      );
      if (!response.ok) {
        setLoading(false);
        setError(true);
        return;
      }
      const data = await response.json();
      setFetchedFood(data);
      setLoading(false);
    };
    fetchFood();
  }, [id]);

  // Get foods from API
  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/foods/${id}/influencers?${queryParams.toString()}`,
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
      const influencers = data.map((influencer: IInfluencers) => {
        return { _id: influencer._id, name: influencer.name };
      });
      setFoodInfluencers([
        {
          _id: "",
          name: "all influencers",
        },
        ...influencers,
      ]);
    };
    fetchInfluencers();
  }, []);

  console.log(foodInfluencers);

  useEffect(() => {
    if (!foodInfluencers.length) return;

    const influencerId = queryParams.get("influencerId");
    const urlInfluencer = foodInfluencers.find((fi) => fi._id === influencerId);

    if (!urlInfluencer) return;

    setSelectedInfluencer(urlInfluencer?.name || "");
  }, [foodInfluencers, queryParams]);

  // const creators = [
  //   "All creators",
  //   "Chef Abby",
  //   "Chef John",
  //   "Chef Jane",
  //   "Chef Jim",
  //   "Chef Jill",
  //   "Chef Jack",
  // ];

  const onCreatorChange = (creator: string) => {
    if (creator === "all creators") {
      newSearchParams.delete("influencerId");
      setSearchParams(newSearchParams);
    }
    const chosenInfluencer = foodInfluencers.find(
      (fi) => fi.name.toLocaleLowerCase() === creator.toLocaleLowerCase(),
    );
    newSearchParams.set("influencerId", chosenInfluencer?._id as string);
    setSearchParams(newSearchParams);
    setSelectedInfluencer(creator);
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
        tl.from(selectInfluencerModalRef.current, {
          y: -40,
          opacity: 0,
        });
        tl.from(selectInfluencerModalBackgroundRef.current, {
          opacity: 0,
          duration: 0.5,
        });
      }
    },
    {
      dependencies: [isInfluencerModalOpen],
    },
  );

  const toggleVideoPlayer = (value: boolean) => {
    setIsVideoPlayeropen(value);
  };

  useGSAP(
    () => {
      gsap.set("#noVideoText1", {
        x: -2000,
        opacity: 0,
      });
      gsap.set("#noVideoText2", {
        x: 2000,
        opacity: 0,
      });
      gsap.set("#noVideoText3", {
        x: -2000,
        opacity: 0,
      });

      const noVideoTextTl = gsap.timeline();
      noVideoTextTl.to("#noVideoText1", {
        x: 0,
        opacity: 1,
        duration: 0.2,
        ease: "bounce.out",
      });

      noVideoTextTl.to("#noVideoText2", {
        x: 0,
        opacity: 1,
        duration: 0.2,
        ease: "bounce.out",
      });

      noVideoTextTl.to("#noVideoText3", {
        x: 0,
        opacity: 1,
        duration: 0.2,
        ease: "bounce.out",
      });
    },
    { dependencies: [foodVideos], scope: noVideoTextRef },
  );

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
      <h1 className="mb-5 text-center text-3xl font-bold">
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
            elements={foodInfluencers.map((foodInfluencer) =>
              foodInfluencer.name.toLocaleLowerCase(),
            )}
            onChangeElement={onCreatorChange}
            selectModalBackgroundRef={selectInfluencerModalBackgroundRef}
            selectModalRef={selectInfluencerModalRef}
            selectedElement={selectedInfluencer}
            setIsModalOpen={setIsInfluencerModalOpen}
            type={"Creator"}
          />
        )}
      </div>
      <div className="flex w-full flex-wrap items-start justify-center gap-7 mb-20">
        {!foodVideos.length && (
          <div
            className="mt-30 min-h-screen text-center"
            ref={noVideoTextRef}
          >
            <p className="my-7 text-5xl font-black" id="noVideoText1">
              No videos
            </p>
            <p className="my-7 text-5xl font-black" id="noVideoText2">
              for this
            </p>
            <p className="my-7 text-5xl font-black" id="noVideoText3">
              food / influencer
            </p>
          </div>
        )}
        {foodVideos.map((foodVideo: IFoodVideo) => (
          <div onClick={() => setSelectedVideoId(foodVideo.videoId)}>
            <FoodVideoCard
              key={foodVideo.videoId}
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
