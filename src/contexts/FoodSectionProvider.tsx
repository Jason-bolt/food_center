import { useRef, type ReactNode } from "react";
import { FoodSectionContext } from "./FoodSectionContext";

const FoodSectionProvider = ({ children }: { children: ReactNode }) => {
  const foodSectionRef = useRef<HTMLDivElement>(null);
  return (
    <FoodSectionContext.Provider value={{ foodSectionRef }}>
      {children}
    </FoodSectionContext.Provider>
  );
};

export default FoodSectionProvider;
