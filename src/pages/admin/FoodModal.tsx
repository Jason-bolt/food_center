import { useForm } from "react-hook-form";
import type { IFood, IFoodRequest } from "../../types/food";
import { LoaderPinwheel, Trash, X } from "lucide-react";
import {
  useEffect,
  useRef,
  type RefObject,
  type Dispatch,
  type SetStateAction,
} from "react";

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
  type FoodFormValues = {
    name: string;
    description: string;
    culturalStory: string;
    countries: string;
    region: string;
    ingredients: string;
    image: FileList;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FoodFormValues>({
    defaultValues: selectedFood
      ? {
          name: selectedFood.name,
          description: selectedFood.description,
          culturalStory: selectedFood.culturalStory,
          countries: selectedFood.countries.join(","),
          region: selectedFood.region,
          ingredients: selectedFood.ingredients.join(","),
        }
      : {},
  });

  const previewRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Destructure register's ref so we can merge it with our local inputRef.
  const { ref: rhfImageRef, ...imageProps } = register("image");

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleChange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      const preview = previewRef.current;
      if (!preview) return;

      if (file) {
        const fileURL = URL.createObjectURL(file);
        preview.src = fileURL;
        preview.style.display = "block";
        preview.onload = () => URL.revokeObjectURL(fileURL);
      } else {
        preview.style.display = "none";
        preview.src = "#";
      }
    };

    input.addEventListener("change", handleChange);
    return () => input.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div
        ref={selectModalBackgroundRef}
        className="absolute inset-0 bg-black/10 backdrop-blur-md"
        onClick={() => setIsModalOpen(false)}
      />

      <div className="relative mx-4 -mt-5 w-full max-w-xl">
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
                Add/Edit Food
              </h2>
              {selectedFood ? (
                <p className="text-sm text-gray-600">
                  Editing food: {selectedFood.name}
                </p>
              ) : (
                <p className="text-sm text-gray-600">Adding new food</p>
              )}
              <form
                className="form"
                onSubmit={handleSubmit((data) => {
                  const fileList = data.image as FileList;
                  const hasNewImage = fileList && fileList.length > 0;

                  // On create, an image is required
                  if (!selectedFood && !hasNewImage) return;

                  setIsLoading(true);

                  const formData = {
                    ...data,
                    image: hasNewImage ? fileList[0] : undefined,
                  } as IFoodRequest;

                  if (selectedFood) {
                    setUpdateFoodData(formData);
                  } else {
                    setCreateFoodData(formData);
                  }
                })}
              >
                <div className="my-3 flex flex-col items-start justify-center gap-2">
                  <label htmlFor="name" className="font-semibold">
                    Food name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", { required: "Name is required" })}
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
                    rows={5}
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className="w-full rounded-lg border border-orange-400 p-2"
                  />
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
                    rows={5}
                    {...register("culturalStory", {
                      required: "Cultural story is required",
                    })}
                    className="w-full rounded-lg border border-orange-400 p-2"
                  />
                  {errors.culturalStory && (
                    <p className="text-sm text-red-600">
                      {errors.culturalStory.message as string}
                    </p>
                  )}
                </div>

                <div className="my-3 flex flex-col items-start justify-center gap-2">
                  <label htmlFor="image" className="font-semibold">
                    Food image{selectedFood ? " (leave blank to keep current)" : ""}
                  </label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    className="w-full rounded-lg border border-orange-400 p-2"
                    {...imageProps}
                    ref={(el) => {
                      rhfImageRef(el);
                      inputRef.current = el;
                    }}
                  />
                  <img
                    ref={previewRef}
                    alt="Preview"
                    className="max-w-40"
                    src={selectedFood?.imageUrl}
                    style={{ display: selectedFood?.imageUrl ? "block" : "none" }}
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
                    {...register("countries", {
                      required: "At least one country is required",
                    })}
                  />
                  {errors.countries && (
                    <p className="text-sm text-red-600">
                      {errors.countries.message as string}
                    </p>
                  )}
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
                    {...register("region", { required: "Region is required" })}
                  />
                  {errors.region && (
                    <p className="text-sm text-red-600">
                      {errors.region.message as string}
                    </p>
                  )}
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
                    {...register("ingredients", {
                      required: "At least one ingredient is required",
                    })}
                  />
                  {errors.ingredients && (
                    <p className="text-sm text-red-600">
                      {errors.ingredients.message as string}
                    </p>
                  )}
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
