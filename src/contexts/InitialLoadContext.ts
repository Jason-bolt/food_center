import { createContext, type RefObject } from "react";

export const InitialLoadContext = createContext<{
  initialLoadAlreadyHappened: RefObject<boolean> | null;
  toggleInitialRenderHasOccured: () => void;
}>({
  initialLoadAlreadyHappened: null,
  toggleInitialRenderHasOccured: () => {},
});
