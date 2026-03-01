"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LoadingContextType {
  isSplashFinished: boolean;
  setIsSplashFinished: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isSplashFinished: false,
  setIsSplashFinished: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  useEffect(() => {
    // Determine on mount if splash screen is already finished for this session
    // If hasVisited is true, we immediately set splash finished to true so animations play instantly
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (hasVisited) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSplashFinished(true);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ isSplashFinished, setIsSplashFinished }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
