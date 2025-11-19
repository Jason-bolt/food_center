import { X } from "lucide-react";

const FoodVideoPlayer = ({
  videoId,
  toggleVideoPlayer,
}: {
  videoId: string;
  toggleVideoPlayer: (value: boolean) => void;
}) => {
  console.log(videoId);
  return (
    <section
      className="fixed inset-0 flex items-center justify-center bg-black/10 backdrop-blur-md"
      onClick={() => toggleVideoPlayer(false)}
    >
      <div
        className="relative z-10 mx-4 w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 shadow-2xl backdrop-blur-xl">
          <div className="relative py-8 md:p-8">
            <button
              onClick={() => toggleVideoPlayer(false)}
              className="absolute top-2 right-2 rounded-full p-2 text-gray-800 transition-all duration-200 hover:cursor-pointer hover:bg-white/30 hover:text-gray-900"
            >
              <X size={20} />
            </button>

            <div className="mt-3 mb-3 w-full text-center">
              <iframe
                className="h-96 w-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodVideoPlayer;
