import { useEffect, useMemo, useRef, useState } from "react";
import CountryRegionFilter from "../../components/CountryRegionFilter";
import type { IPaginatedResponse } from "../../types/general";
import type { IFood, IFoodRequest } from "../../types/food";
import { useLocation, useSearchParams } from "react-router-dom";
import AdminFoodCardSection from "../../components/admin/AdminFoodCardSection";
import FoodModal from "./FoodModal";
import { uploadImage } from "../../utils/helpers/general";
import {
  createFoodRequest,
  deleteFoodRequest,
  updateFoodRequest,
} from "../../utils/helpers/apiCalls";

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
  const [selectedFoodId, setSelectedFoodId] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const selectModalBackgroundRef = useRef<HTMLDivElement>(null);
  const [createFoodData, setCreateFoodData] = useState<IFoodRequest>();
  const [updateFoodData, setUpdateFoodData] = useState<IFoodRequest>();
  const [refetchTrigger, setRefetchTrigger] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<IFood | undefined>(
    undefined,
  );
  const [pageQuery, setPageQuery] = useState<number>(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams);

  const updateSelectedFood = (foodId: string) => {
    setSelectedFoodId(foodId);
    const clickedFood = fetchedFoods.data.find((f) => f._id === foodId);
    setSelectedFood(clickedFood);
    setIsModalOpen(true);
  };

  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  // Get foods from API
  useEffect(() => {
    setSearchQuery(queryParams.get("search") || "");
    setPageQuery(Number(queryParams.get("page")) || 1);
    const fetchFoods = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_BASE_URL}/foods?${queryParams.toString()}`,
        );
        const data = await response.json();
        setFetchedFoods(data);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };
    fetchFoods();
  }, [location.search, queryParams, refetchTrigger]);

  // Create food when createFoodData is set
  useEffect(() => {
    if (!createFoodData) return;
    console.log(createFoodData);

    // Prevent race conditions
    let isCancelled = false;

    const createFood = async () => {
      try {
        // Validate required data
        if (
          !createFoodData.image ||
          !createFoodData.countries ||
          !createFoodData.ingredients
        ) {
          throw new Error("Missing required fields");
        }

        const imageUrl = await uploadImage(createFoodData.image);

        if (isCancelled) return; // Check after async operation

        if (!imageUrl?.image) {
          throw new Error("Image upload returned invalid response");
        }

        const preparedData = {
          ...createFoodData,
          imageUrl: imageUrl.image,
          countries: createFoodData.countries.split(",").map((c) => c.trim()),
          ingredients: createFoodData.ingredients
            .split(",")
            .map((i) => i.trim()),
        };

        console.log(preparedData);
        const response = await createFoodRequest(preparedData);

        if (isCancelled) return; // Check after async operation

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to create food: ${response.status} - ${errorText}`,
          );
        }
        await response.json();

        // Success
        setRefetchTrigger((prev) => prev + 1);
        setIsLoading(false);
        // Consider adding success toast/notification here
      } catch (error) {
        if (isCancelled) return;

        console.error("Error creating food:", error);
        // TODO: Show error to user (toast, alert, error state, etc.)
        // Example: setError(error instanceof Error ? error.message : "Failed to create food");
      } finally {
        if (!isCancelled) {
          setCreateFoodData(undefined);
        }
        setIsModalOpen(false);
        setSelectedFood(undefined);
      }
    };

    createFood();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [createFoodData, setRefetchTrigger]); // Add all dependencies

  // Create food when createFoodData is set
  useEffect(() => {
    if (!updateFoodData) return;
    console.log(updateFoodData);

    // Prevent race conditions
    let isCancelled = false;

    const updateFood = async () => {
      try {
        // Validate required data
        if (
          !updateFoodData.image ||
          !updateFoodData.countries ||
          !updateFoodData.ingredients
        ) {
          throw new Error("Missing required fields");
        }

        const imageUrl = await uploadImage(updateFoodData.image);

        if (isCancelled) return; // Check after async operation

        if (!imageUrl?.image) {
          throw new Error("Image upload returned invalid response");
        }

        const preparedData = {
          ...updateFoodData,
          imageUrl: imageUrl.image,
          countries: updateFoodData.countries.split(",").map((c) => c.trim()),
          ingredients: updateFoodData.ingredients
            .split(",")
            .map((i) => i.trim()),
        };

        console.log(preparedData);

        const response = await updateFoodRequest(preparedData, selectedFoodId);

        if (isCancelled) return; // Check after async operation

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to create food: ${response.status} - ${errorText}`,
          );
        }
        await response.json();

        // Success
        setRefetchTrigger((prev) => prev + 1);
        setIsLoading(false);
        // Consider adding success toast/notification here
      } catch (error) {
        if (isCancelled) return;

        console.error("Error creating food:", error);
        // TODO: Show error to user (toast, alert, error state, etc.)
        // Example: setError(error instanceof Error ? error.message : "Failed to create food");
      } finally {
        if (!isCancelled) {
          setUpdateFoodData(undefined);
        }
        setIsModalOpen(false);
        setSelectedFood(undefined);
      }
    };

    updateFood();

    // Cleanup function
    return () => {
      isCancelled = true;
    };
  }, [updateFoodData, setRefetchTrigger]); // Add all dependencies

  async function deleteFood() {
    const confirmDeletion = confirm("You are deleting this food item!");
    if (!confirmDeletion) return;

    const response = await deleteFoodRequest(selectedFood?._id);
    if (response.ok) {
      console.log("Deleting...");
      if (fetchedFoods.data.length % 10 < pageQuery && pageQuery > 1) {
        newSearchParams.set("page", (pageQuery - 1).toString());
        setSearchParams(newSearchParams);
      }
      setRefetchTrigger((prev) => prev + 1);
    } else {
      console.log("An error occured");
    }
    setIsModalOpen(false);
  }

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
          onClick={() => {
            setSelectedFood(undefined);
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
