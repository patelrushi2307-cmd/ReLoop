"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type RevealApi = { revealed: boolean; reveal: () => void };

const RevealContext = createContext<RevealApi>({
  revealed: true,
  reveal: () => {},
});

export const useReveal = () => useContext(RevealContext);

export function RevealProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const value = useMemo(
    () => ({ revealed, reveal: () => setRevealed(true) }),
    [revealed],
  );
  return (
    <RevealContext.Provider value={value}>{children}</RevealContext.Provider>
  );
}
