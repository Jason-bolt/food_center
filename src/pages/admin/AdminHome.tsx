import { useEffect, useMemo, useRef, useState } from "react";
import CountryRegionFilter from "../../components/CountryRegionFilter";
import type { IPaginatedResponse } from "../../types/general";
import type { IFood, IFoodRequest } from "../../types/food";
import { useLocation, useSearchParams } from "react-router-dom";
import AdminFoodCardSection from "../../components/admin/AdminFoodCardSection";
import EditorialPanel from "../../components/admin/EditorialPanel";
import FoodModal from "./FoodModal";
import { uploadImage } from "../../utils/helpers/general";
import {
  createFoodRequest,
  deleteFoodRequest,
  updateFoodRequest,
} from "../../utils/helpers/apiCalls";

const AdminHome = () => {
  const [fetchedFoods, setFetchedFoods] = useState<IPaginatedResponse<IFood[]>>({
    data: [],
    totalpages: 0,
    page: 0,
    totalItems: 0,
  });
  const [selectedFoodId, setSelectedFoodId] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const selectModalBackgroundRef = useRef<HTMLDivElement>(null);
  const [createFoodData, setCreateFoodData] = useState<IFoodRequest>();
  const [updateFoodData, setUpdateFoodData] = useState<IFoodRequest>();
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [operationError, setOperationError] = useState<string>("");
  const [selectedFood, setSelectedFood] = useState<IFood | undefined>(undefined);
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  // Derived from URL — no need for separate state
  const searchQuery = queryParams.get("search") || "";
  const pageQuery = Number(queryParams.get("page")) || 1;

  const updateSelectedFood = (foodId: string) => {
    setSelectedFoodId(foodId);
    const clickedFood = fetchedFoods.data.find((f) => f._id === foodId);
    setSelectedFood(clickedFood);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/foods?${queryParams.toString()}`,
        );
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        const data = await response.json();
        setFetchedFoods(data);
      } catch {
        setOperationError("Failed to load foods. Please refresh the page.");
      }
    };
    fetchFoods();
  }, [location.search, refetchTrigger]);

  useEffect(() => {
    if (!createFoodData) return;
    let isCancelled = false;

    const createFood = async () => {
      try {
        if (!createFoodData.image || !createFoodData.countries || !createFoodData.ingredients) {
          throw new Error("Missing required fields");
        }

        const imageResult = await uploadImage(createFoodData.image);
        if (isCancelled) return;
        if (!imageResult?.image) throw new Error("Image upload returned no URL");

        const preparedData = {
          ...createFoodData,
          imageUrl: imageResult.image,
          countries: createFoodData.countries.split(",").map((c) => c.trim()),
          ingredients: createFoodData.ingredients.split(",").map((i) => i.trim()),
        };

        const response = await createFoodRequest(preparedData);
        if (isCancelled) return;
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create food: ${response.status} — ${errorText}`);
        }

        setRefetchTrigger((prev) => prev + 1);
        setIsLoading(false);
        setOperationError("");
      } catch (error) {
        if (isCancelled) return;
        setIsLoading(false);
        setOperationError(error instanceof Error ? error.message : "Failed to create food");
      } finally {
        if (!isCancelled) setCreateFoodData(undefined);
        setIsModalOpen(false);
        setSelectedFood(undefined);
      }
    };

    createFood();
    return () => { isCancelled = true; };
  }, [createFoodData]);

  useEffect(() => {
    if (!updateFoodData) return;
    let isCancelled = false;

    const updateFood = async () => {
      try {
        let imageUrl = selectedFood?.imageUrl ?? "";

        if (updateFoodData.image) {
          const imageResult = await uploadImage(updateFoodData.image);
          if (isCancelled) return;
          if (!imageResult?.image) throw new Error("Image upload returned no URL");
          imageUrl = imageResult.image;
        }

        const preparedData = {
          ...updateFoodData,
          imageUrl,
          countries: (updateFoodData.countries as string).split(",").map((c) => c.trim()),
          ingredients: (updateFoodData.ingredients as string).split(",").map((i) => i.trim()),
        };

        const response = await updateFoodRequest(preparedData, selectedFoodId);
        if (isCancelled) return;
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update food: ${response.status} — ${errorText}`);
        }

        setRefetchTrigger((prev) => prev + 1);
        setIsLoading(false);
        setOperationError("");
      } catch (error) {
        if (isCancelled) return;
        setIsLoading(false);
        setOperationError(error instanceof Error ? error.message : "Failed to update food");
      } finally {
        if (!isCancelled) setUpdateFoodData(undefined);
        setIsModalOpen(false);
        setSelectedFood(undefined);
      }
    };

    updateFood();
    return () => { isCancelled = true; };
  }, [updateFoodData, selectedFoodId, selectedFood]);

  async function deleteFood() {
    const confirmDeletion = confirm("You are deleting this food item!");
    if (!confirmDeletion) return;

    try {
      const response = await deleteFoodRequest(selectedFood?._id);
      if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
      if (fetchedFoods.data.length === 1 && pageQuery > 1) {
        // Snapshot searchParams at call time, not at render time
        const freshParams = new URLSearchParams(searchParams);
        freshParams.set("page", (pageQuery - 1).toString());
        setSearchParams(freshParams);
      }
      setRefetchTrigger((prev) => prev + 1);
      setOperationError("");
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : "Failed to delete food");
    } finally {
      setIsModalOpen(false);
    }
  }

  return (
    <section className="min-h-screen pt-2">
      <EditorialPanel />
      <CountryRegionFilter className="countryRegionFilter" />

      {operationError && (
        <div className="mx-auto my-3 max-w-xl rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {operationError}
          <button
            onClick={() => setOperationError("")}
            className="ml-3 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {searchQuery && (
        <div className="my-5">
          Search Results for:{" "}
          <span className="text-xl font-semibold">{searchQuery}</span>
        </div>
      )}
      <div className="mb-5 flex items-center justify-center">
        <button
          className="rounded-lg bg-orange-200 px-6 py-2 font-bold text-orange-800 hover:cursor-pointer hover:bg-orange-300"
          onClick={() => {
            setSelectedFood(undefined);
            setOperationError("");
            setIsModalOpen(true);
          }}
        >
          Add Food
        </button>

        {isModalOpen && (
          <FoodModal
            selectModalBackgroundRef={selectModalBackgroundRef}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setIsModalOpen={setIsModalOpen}
            setCreateFoodData={setCreateFoodData}
            setUpdateFoodData={setUpdateFoodData}
            selectedFood={selectedFood}
            deleteFood={deleteFood}
          />
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
