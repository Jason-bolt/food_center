import { useEffect, useMemo, useRef, useState } from "react";
import CountryRegionFilter from "../../components/CountryRegionFilter";
import type { IPaginatedResponse } from "../../types/general";
import type { IFood } from "../../types/food";
import { useLocation } from "react-router-dom";
import AdminFoodCardSection from "../../components/admin/AdminFoodCardSection";
import { X } from "lucide-react";

const AdminHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedFoods, setFetchedFoods] = useState<IPaginatedResponse<IFood[]>>(
    {
      data: [],
      totalpages: 0,
      page: 0,
      totalItems: 0,
    },
  );
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const selectModalRef = useRef<HTMLDivElement>(null);
  const selectModalBackgroundRef = useRef<HTMLDivElement>(null);

  const updateSelectedFood = (foodId: string) => {
    setSelectedFoodId(foodId);
  };

  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  // Get foods from API
  useEffect(() => {
    setSearchQuery(queryParams.get("search") || "");
    const fetchFoods = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_BASE_URL}/foods?${queryParams.toString()}`,
      );
      const data = await response.json();
      setFetchedFoods(data);
    };
    fetchFoods();
  }, [location.search, queryParams]);

  return (
    <section className="min-h-screen pt-2">
      <CountryRegionFilter className="countryRegionFilter" />
      {searchQuery && (
        <div className="my-5">
          Search Results for:{" "}
          <span className="text-xl font-semibold">{searchQuery}</span>
        </div>
      )}
      <div className="mb-5 flex items-center justify-center">
        <button
          className="rounded-lg bg-orange-200 px-6 py-2 font-bold text-orange-800 hover:cursor-pointer hover:bg-orange-300"
          onClick={() => setIsModalOpen(true)}
        >
          Add Food
        </button>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center pt-16"
            ref={selectModalRef}
          >
            <div
              ref={selectModalBackgroundRef}
              className="absolute inset-0 bg-black/10 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />

            <div className="relative mx-4 w-full max-w-xl">
              <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/20 shadow-2xl backdrop-blur-xl">
                <div className="absolute inset-0 bg-gray-100 opacity-90" />

                <div className="relative max-h-[650px] overflow-y-scroll p-8 my-5">
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
                    <form className="form">
                      <div className="my-3 flex flex-col items-start justify-center gap-2">
                        <label htmlFor="foodName" className="font-semibold">
                          Food name
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border border-orange-400 p-2"
                        />
                      </div>
                      <div className="my-3 flex flex-col items-start justify-center gap-2">
                        <label htmlFor="foodName" className="font-semibold">
                          Food description
                        </label>
                        <textarea
                          name="food_description"
                          id="food_description"
                          className="w-full rounded-lg border border-orange-400 p-2"
                        ></textarea>
                      </div>
                      <div className="my-3 flex flex-col items-start justify-center gap-2">
                        <label htmlFor="foodName" className="font-semibold">
                          Cultural story
                        </label>
                        <textarea
                          name="cultural_story"
                          id="cultural_story"
                          className="w-full rounded-lg border border-orange-400 p-2"
                        ></textarea>
                      </div>
                      <div className="my-3 flex flex-col items-start justify-center gap-2">
                        <label htmlFor="foodImage" className="font-semibold">
                          Food image
                        </label>
                        <label htmlFor="food_image">
                          <span>Upload file</span>
                          <input
                            type="file"
                            name="food_image"
                            id="food_image"
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <div className="my-3 flex flex-col items-start justify-center gap-2">
                        <label htmlFor="countries" className="font-semibold">
                          Countries
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border border-orange-400 px-2 py-3"
                          placeholder="ghana,nigeria,togo"
                        />
                      </div>
                      <div className="my-3 flex flex-col items-start justify-center gap-2">
                        <label htmlFor="regions" className="font-semibold">
                          Region
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border border-orange-400 px-2 py-3"
                          placeholder="region"
                        />
                      </div>
                      <div className="my-3 flex flex-col items-start justify-center gap-2">
                        <label htmlFor="ingredients" className="font-semibold">
                          Ingredients
                        </label>
                        <input
                          type="text"
                          className="w-full rounded-lg border border-orange-400 px-2 py-3"
                          placeholder="rice,oil,beans"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded-lg bg-orange-400 text-center text-white py-4 mt-3 hover:bg-orange-500"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <AdminFoodCardSection
        updateSelectedFood={updateSelectedFood}
        foods={fetchedFoods}
      />
    </section>
  );
};

export default AdminHome;
