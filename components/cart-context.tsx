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
import type { MetodaDostawy } from "@/lib/dostawa";

export type PozycjaKoszyka = ProduktSkrot & { ilosc: number };

type KoszykContext = {
  pozycje: PozycjaKoszyka[];
  dodaj: (produkt: ProduktSkrot, ilosc?: number) => void;
  ustawIlosc: (slug: string, ilosc: number) => void;
  usun: (slug: string) => void;
  wyczysc: () => void;
  liczbaSztuk: number;
  suma: number;
  produktyZKoszyka: { produkt: ProduktSkrot; ilosc: number }[];
  metodaDostawy: MetodaDostawy;
  ustawMetodeDostawy: (metoda: MetodaDostawy) => void;
  gotowy: boolean;
};

const Context = createContext<KoszykContext | null>(null);
const STORAGE_KEY = "nawia-koszyk";
const STORAGE_KEY_DOSTAWA = "nawia-dostawa";

export function KoszykProvider({ children }: { children: React.ReactNode }) {
  const [pozycje, setPozycje] = useState<PozycjaKoszyka[]>([]);
  const [metodaDostawy, setMetodaDostawy] = useState<MetodaDostawy>("paczkomat");
  const [gotowy, setGotowy] = useState(false);

  // Wczytanie z localStorage po zamontowaniu (unika niezgodności SSR).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPozycje(JSON.parse(raw));
      const m = localStorage.getItem(STORAGE_KEY_DOSTAWA);
      if (m === "paczkomat" || m === "kurier") setMetodaDostawy(m);
    } catch {
      /* ignorujemy uszkodzone dane */
    }
    setGotowy(true);
  }, []);

  useEffect(() => {
    if (gotowy) localStorage.setItem(STORAGE_KEY, JSON.stringify(pozycje));
  }, [pozycje, gotowy]);

  useEffect(() => {
    if (gotowy) localStorage.setItem(STORAGE_KEY_DOSTAWA, metodaDostawy);
  }, [metodaDostawy, gotowy]);

  const ustawMetodeDostawy = useCallback(
    (metoda: MetodaDostawy) => setMetodaDostawy(metoda),
    []
  );

  const dodaj = useCallback((produkt: ProduktSkrot, ilosc = 1) => {
    setPozycje((prev) => {
      const istnieje = prev.find((p) => p.slug === produkt.slug);
      if (istnieje) {
        return prev.map((p) =>
          p.slug === produkt.slug ? { ...p, ilosc: p.ilosc + ilosc } : p
        );
      }
      return [...prev, { ...produkt, ilosc }];
    });
  }, []);

  const ustawIlosc = useCallback((slug: string, ilosc: number) => {
    setPozycje((prev) =>
      ilosc <= 0
        ? prev.filter((p) => p.slug !== slug)
        : prev.map((p) => (p.slug === slug ? { ...p, ilosc } : p))
    );
  }, []);

  const usun = useCallback((slug: string) => {
    setPozycje((prev) => prev.filter((p) => p.slug !== slug));
  }, []);

  const wyczysc = useCallback(() => setPozycje([]), []);

  const produktyZKoszyka = useMemo(
    () => pozycje.map(({ ilosc, ...produkt }) => ({ produkt, ilosc })),
    [pozycje]
  );

  const liczbaSztuk = useMemo(
    () => pozycje.reduce((s, p) => s + p.ilosc, 0),
    [pozycje]
  );

  const suma = useMemo(
    () => pozycje.reduce((s, p) => s + p.cena * p.ilosc, 0),
    [pozycje]
  );

  const value: KoszykContext = {
    pozycje,
    dodaj,
    ustawIlosc,
    usun,
    wyczysc,
    liczbaSztuk,
    suma,
    produktyZKoszyka,
    metodaDostawy,
    ustawMetodeDostawy,
    gotowy,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useKoszyk() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useKoszyk musi być użyty wewnątrz KoszykProvider");
  return ctx;
}
