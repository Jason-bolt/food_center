import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const SingleFoodLoading = () => {
  return (
    <section className="min-h-screen animate-pulse pt-2 lg:px-72">
      <Link
        to={"/"}
        className="my-5 flex max-w-28 items-center justify-start gap-2"
      >
        <ArrowLeft width={20} />
        Back
      </Link>
      <div className="ball pointer-events-none fixed top-0 left-0 -z-10 h-15 w-15 rounded-full bg-purple-300"></div>
      <div className="flex flex-col items-center justify-center gap-5">
        <div className="h-[730px] w-full rounded-xl bg-gray-200"></div>
        <div className="flex w-full flex-col items-start justify-center">
          <div className="flex w-full flex-col items-start">
            <h1 className="my-2 w-full" id="foodName">
              <div className="h-10 w-full bg-gray-200 lg:w-1/2"></div>
            </h1>
            <p className="mt-2 w-full" id="foodIngredients">
              <div className="h-3 w-full bg-gray-200 lg:w-1/2"></div>
            </p>
            <p className="my-4 w-36" id="foodLocation">
              <div className="h-3 w-full bg-gray-200"></div>
            </p>
            <div
              className="my-3 flex w-full flex-col items-start justify-center"
              id="foodCulturalStory"
            >
              <h1 className="mt-1 text-xl font-bold">Cultural Story:</h1>
              <p className="w-full">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="my-3 h-4 w-full bg-gray-200"
                  ></div>
                ))}
              </p>
            </div>
            <div
              className="my-3 flex w-full flex-col items-start justify-center"
              id="foodDescription"
            >
              <h1 className="text-xl font-bold">Description:</h1>
              <p className="w-full">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="my-3 h-4 w-full bg-gray-200"
                  ></div>
                ))}
              </p>
            </div>
            <div className="mt-4 h-10 w-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleFoodLoading;
