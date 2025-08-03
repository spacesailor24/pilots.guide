"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ShipWithBuilds {
  id: string;
  shipId: string;
  name: string;
  category: string;
  _count: {
    builds: number;
  };
}

interface ShipsContextType {
  shipsWithBuilds: ShipWithBuilds[];
  isLoading: boolean;
}

const ShipsContext = createContext<ShipsContextType>({
  shipsWithBuilds: [],
  isLoading: true,
});

export function useShips() {
  return useContext(ShipsContext);
}

export function ShipsProvider({ children }: { children: ReactNode }) {
  const [shipsWithBuilds, setShipsWithBuilds] = useState<ShipWithBuilds[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch only once when the provider mounts
    let cancelled = false;

    fetch("/api/ships-with-builds")
      .then((res) => res.json())
      .then((ships) => {
        if (!cancelled) {
          setShipsWithBuilds(ships);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch ships:", err);
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []); // Empty deps array = fetch only once

  return (
    <ShipsContext.Provider value={{ shipsWithBuilds, isLoading }}>
      {children}
    </ShipsContext.Provider>
  );
}