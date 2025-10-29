import type { IFood } from "../types/food";
import FoodCard from "./FoodCard";

const FoodCardSection = ({ foods }: { foods: IFood[] }) => {
  return (
    <section className="grid grid-cols-1 gap-2 lg:grid-cols-2">
      {foods.map((food) => (
        <FoodCard food={food} />
      ))}
    </section>
  );
};

export default FoodCardSection;
