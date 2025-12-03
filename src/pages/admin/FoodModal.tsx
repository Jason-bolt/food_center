import { useForm } from "react-hook-form";
import type { IFood, IFoodRequest } from "../../types/food";
import { LoaderPinwheel, Trash, X } from "lucide-react";
import type { RefObject, Dispatch, SetStateAction } from "react";

interface FoodModalProps {
  selectModalBackgroundRef: RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setCreateFoodData: Dispatch<SetStateAction<IFoodRequest | undefined>>;
  setUpdateFoodData: Dispatch<SetStateAction<IFoodRequest | undefined>>;
  selectedFood: IFood | undefined;
  deleteFood: () => void;
}

const FoodModal = ({
  selectModalBackgroundRef,
  isLoading,
  setIsLoading,
  setIsModalOpen,
  setCreateFoodData,
  setUpdateFoodData,
  selectedFood,
  deleteFood,
}: FoodModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div
        ref={selectModalBackgroundRef}
        className="absolute inset-0 bg-black/10 backdrop-blur-md"
        onClick={() => setIsModalOpen(false)}
      />

      <div className="relative mx-4 w-full max-w-xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 bg-gray-100 opacity-90" />

          <div className="relative my-5 max-h-[650px] overflow-y-scroll p-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-all duration-200 hover:cursor-pointer hover:bg-white/10 hover:text-gray-600"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-gray-800">
                Add Food
              </h2>

              <form
                className="form"
                onSubmit={handleSubmit((data) => {
                  setIsLoading(true);
                  // Extract the File from FileList for file inputs
                  const fileList = data.image as FileList;
                  if (!fileList || fileList.length === 0) {
                    console.error("No image file selected");
                    return;
                  }
                  const formData = {
                    ...data,
                    image: fileList[0],
                  } as IFoodRequest;

                  if (selectedFood) {
                    setUpdateFoodData(formData);
                  } else {
                    setCreateFoodData(formData);
                  }
                  console.log(formData);
                })}
              >
                <div className="my-3 flex flex-col items-start justify-center gap-2">
                  <label htmlFor="name" className="font-semibold">
                    Food name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", {
                      required: "Name is required",
                    })}
                    value={selectedFood?.name}
                    className="w-full rounded-lg border border-orange-400 p-2"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">
                      {errors.name.message as string}
                    </p>
                  )}
                </div>
                <div className="my-3 flex flex-col items-start justify-center gap-2">
                  <label htmlFor="description" className="font-semibold">
                    Food description
                  </label>
                  <textarea
                    id="description"
                    {...register("description", {
                      required: "Description is required",
                    })}
                    value={selectedFood?.description}
                    className="w-full rounded-lg border border-orange-400 p-2"
                  ></textarea>
                  {errors.description && (
                    <p className="text-sm text-red-600">
                      {errors.description.message as string}
                    </p>
                  )}
                </div>
                <div className="my-3 flex flex-col items-start justify-center gap-2">
                  <label htmlFor="culturalStory" className="font-semibold">
                    Cultural story
                  </label>
                  <textarea
                    id="culturalStory"
                    {...register("culturalStory")}
                    className="w-full rounded-lg border border-orange-400 p-2"
                    value={selectedFood?.culturalStory}
                  ></textarea>
                </div>
                <div className="my-3 flex flex-col items-start justify-center gap-2">
                  <label htmlFor="image" className="font-semibold">
                    Food image URL
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="w-full rounded-lg border border-orange-400 p-2"
                    {...register("image")}
                  />
                </div>
                <div className="my-3 flex flex-col items-start justify-center gap-2">
                  <label htmlFor="countries" className="font-semibold">
                    Countries
                  </label>
                  <input
                    type="text"
                    id="countries"
                    className="w-full rounded-lg border border-orange-400 px-2 py-3"
                    placeholder="ghana,nigeria,togo"
                    value={selectedFood?.countries.join(",")}
                    {...register("countries")}
                  />
                </div>
                <div className="my-3 flex flex-col items-start justify-center gap-2">
                  <label htmlFor="region" className="font-semibold">
                    Region
                  </label>
                  <input
                    type="text"
                    id="region"
                    className="w-full rounded-lg border border-orange-400 px-2 py-3"
                    placeholder="region"
                    value={selectedFood?.region}
                    {...register("region")}
                  />
                </div>
                <div className="my-3 flex flex-col items-start justify-center gap-2">
                  <label htmlFor="ingredients" className="font-semibold">
                    Ingredients
                  </label>
                  <input
                    type="text"
                    id="ingredients"
                    className="w-full rounded-lg border border-orange-400 px-2 py-3"
                    placeholder="rice,oil,beans"
                    value={selectedFood?.ingredients.join(",")}
                    {...register("ingredients")}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-3 w-full rounded-lg bg-orange-400 py-4 text-center text-white hover:cursor-pointer hover:bg-orange-500 hover:shadow-md"
                >
                  {!isLoading ? (
                    "Save"
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Saving... <LoaderPinwheel className="animate-spin" />
                    </span>
                  )}
                </button>

                {selectedFood && (
                  <div
                    onClick={deleteFood}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-400 py-4 text-white hover:cursor-pointer hover:bg-red-500 hover:shadow-md"
                  >
                    Delete <Trash className="w-5" />
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;
