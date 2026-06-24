"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type Toast = { id: number; tekst: string };

const Context = createContext<{ pokaz: (tekst: string) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasty, setToasty] = useState<Toast[]>([]);
  const licznik = useRef(0);

  const pokaz = useCallback((tekst: string) => {
    const id = ++licznik.current;
    setToasty((t) => [...t, { id, tekst }]);
    setTimeout(() => {
      setToasty((t) => t.filter((x) => x.id !== id));
    }, 2600);
  }, []);

  return (
    <Context.Provider value={{ pokaz }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasty.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto animate-[toast_0.25s_ease-out] rounded-full border border-line/60 bg-ink px-5 py-2.5 text-sm text-paper shadow-lg"
          >
            {t.tekst}
          </div>
        ))}
      </div>
    </Context.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("useToast musi być użyty wewnątrz ToastProvider");
  return ctx;
}
