import { type ReactNode, useRef, useEffect } from "react";
import { InitialLoadContext } from "./InitialLoadContext";

const InitialLoadProvider = ({ children }: { children: ReactNode }) => {
  const initialLoadAlreadyHappened = useRef<boolean>(false);
  const initialLoad = localStorage.getItem("isLoaded");

  useEffect(() => {
    if (initialLoad) {
      initialLoadAlreadyHappened.current = true;
    } else {
      localStorage.setItem("isLoaded", "true");
    }
  }, []);

  const toggleInitialRenderHasOccured = () => {
    initialLoadAlreadyHappened.current = true;
  };

  // setTimeout(() => {
  //   toggleInitialRenderHasOccured();
  // }, 1000 * 3);

  return (
    <InitialLoadContext.Provider
      value={{ initialLoadAlreadyHappened, toggleInitialRenderHasOccured }}
    >
      {children}
    </InitialLoadContext.Provider>
  );
};

export default InitialLoadProvider;
