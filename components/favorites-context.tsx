"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ProduktSkrot } from "@/lib/products";

type FavContext = {
  ulubione: ProduktSkrot[];
  przelacz: (produkt: ProduktSkrot) => boolean; // zwraca nowy stan (czy w ulubionych)
  czyUlubiony: (slug: string) => boolean;
  usun: (slug: string) => void;
  liczba: number;
  gotowy: boolean;
};

const Context = createContext<FavContext | null>(null);
const STORAGE_KEY = "nawia-ulubione";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ulubione, setUlubione] = useState<ProduktSkrot[]>([]);
  const [gotowy, setGotowy] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUlubione(JSON.parse(raw));
    } catch {
      /* ignorujemy uszkodzone dane */
    }
    setGotowy(true);
  }, []);

  useEffect(() => {
    if (gotowy) localStorage.setItem(STORAGE_KEY, JSON.stringify(ulubione));
  }, [ulubione, gotowy]);

  const przelacz = useCallback((produkt: ProduktSkrot) => {
    let nowyStan = false;
    setUlubione((prev) => {
      if (prev.some((p) => p.slug === produkt.slug)) {
        nowyStan = false;
        return prev.filter((p) => p.slug !== produkt.slug);
      }
      nowyStan = true;
      return [...prev, produkt];
    });
    return nowyStan;
  }, []);

  const czyUlubiony = useCallback(
    (slug: string) => ulubione.some((p) => p.slug === slug),
    [ulubione]
  );

  const usun = useCallback((slug: string) => {
    setUlubione((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const value = useMemo(
    () => ({
      ulubione,
      przelacz,
      czyUlubiony,
      usun,
      liczba: ulubione.length,
      gotowy,
    }),
    [ulubione, przelacz, czyUlubiony, usun, gotowy]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useUlubione() {
  const ctx = useContext(Context);
  if (!ctx)
    throw new Error("useUlubione musi być użyty wewnątrz FavoritesProvider");
  return ctx;
}
