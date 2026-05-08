import type { IFood } from "../../types/food";
import FoodCard from "../FoodCard";
import { useRef } from "react";
import Pagination from "../Pagination";
import type { IPaginatedResponse } from "../../types/general";

const AdminFoodCardSection = ({
  foods,
  updateSelectedFood,
}: {
  foods: IPaginatedResponse<IFood[]>;
  updateSelectedFood: (foodId: string) => void;
}) => {
  const { data, totalpages, page } = foods;
  const noFoodTextRef = useRef<HTMLDivElement>(null);

  return (
    <section className="flex flex-col gap-4">
      {!data.length! && (
        <div className="min-h-screen pt-30 text-center" ref={noFoodTextRef}>
          <p className="my-7 text-5xl font-black" id="noFoodText1">
            No foods
          </p>
          <p className="my-7 text-5xl font-black" id="noFoodText2">
            currently
          </p>
          <p className="my-7 text-5xl font-black" id="noFoodText3">
            loaded currently!
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {data.map((food) => (
          <div
            // onClick={() => updateSelectedFood(food._id)}
            id={food._id}
            key={food._id}
            className=""
          >
            <FoodCard
              food={food}
              isAdminView={true}
              updateSelectedFood={updateSelectedFood}
            />
          </div>
        ))}
      </div>
      <Pagination totalPages={totalpages} page={page} />
    </section>
  );
};

export default AdminFoodCardSection;
