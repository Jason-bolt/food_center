import { createContext, type RefObject } from "react";

export const FoodSectionContext = createContext<{
  foodSectionRef: RefObject<HTMLDivElement | null> | null;
}>({
  foodSectionRef: null,
});
