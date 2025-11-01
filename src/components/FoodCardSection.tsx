import { Link } from "react-router-dom";
import type { IFood } from "../types/food";
import FoodCard from "./FoodCard";

const FoodCardSection = ({ foods }: { foods: IFood[] }) => {
  return (
    <section className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {foods.map((food) => (
          <Link to={`/food/${food._id}`}>
            <FoodCard food={food} />
          </Link>
        ))}
      </div>
      <div className="flex items-center justify-center gap-5">
        <button className="px-4 py-2 font-semibold text-green-500 hover:cursor-pointer hover:underline">
          Prev
        </button>
        <div className="flex items-center justify-center gap-2">
          <p>1</p>
          <p className="text-xs">of</p>
          <p>10</p>
        </div>
        <button className="px-4 py-2 font-semibold text-blue-500 hover:cursor-pointer hover:underline">
          Next
        </button>
      </div>
    </section>
  );
};

export default FoodCardSection;
