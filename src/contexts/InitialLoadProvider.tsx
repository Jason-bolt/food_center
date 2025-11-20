import { type ReactNode, useRef, useEffect } from "react";
import { InitialLoadContext } from "./InitialLoadContext";
import { getWithExpiry, setWithExpiry } from "../utils/helpers/general";

const InitialLoadProvider = ({ children }: { children: ReactNode }) => {
  const initialLoadAlreadyHappened = useRef<boolean>(false);
  const initialLoad = getWithExpiry("isLoaded");

  useEffect(() => {
    const oneHour = 1000 * 60 * 60 * 1;
    if (initialLoad) {
      initialLoadAlreadyHappened.current = true;
      setWithExpiry("isLoaded", "true", oneHour);
    } else {
      setWithExpiry("isLoaded", "true", oneHour);
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
