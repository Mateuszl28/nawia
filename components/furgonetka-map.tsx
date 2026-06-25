"use client";

import { useCallback, useState } from "react";

const MAP_SCRIPT = "https://furgonetka.pl/js/dist/map/map.js";

export type PunktOdbioru = {
  kod: string;
  nazwa: string;
  typ: string;
};

type FurgonetkaMapOpts = {
  apiKey?: string;
  courierServices?: string[];
  city?: string;
  callback: (params: {
    point: { code: string; name: string; type: string };
  }) => void;
};

declare global {
  interface Window {
    Furgonetka?: {
      Map: new (opts: FurgonetkaMapOpts) => { show: () => void };
    };
  }
}

let skryptPromise: Promise<void> | null = null;

/** Ładuje skrypt mapy Furgonetki raz na sesję strony. */
function zaladujSkrypt(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject();
  if (window.Furgonetka) return Promise.resolve();
  if (skryptPromise) return skryptPromise;
  skryptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = MAP_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      skryptPromise = null;
      reject(new Error("Nie udało się załadować mapy Furgonetki"));
    };
    document.body.appendChild(s);
  });
  return skryptPromise;
}

/**
 * Przycisk otwierający widget mapy Furgonetki do wyboru paczkomatu / punktu odbioru.
 * Po wybraniu punktu wywołuje `onWybor` z kodem i nazwą punktu.
 */
export function FurgonetkaMapa({
  onWybor,
  courierServices = ["inpost"],
  etykieta = "Wybierz punkt na mapie",
}: {
  onWybor: (punkt: PunktOdbioru) => void;
  courierServices?: string[];
  etykieta?: string;
}) {
  const [ladowanie, setLadowanie] = useState(false);
  const [blad, setBlad] = useState<string | null>(null);

  const otworz = useCallback(async () => {
    setBlad(null);
    setLadowanie(true);
    try {
      await zaladujSkrypt();
      if (!window.Furgonetka) throw new Error("Mapa niedostępna");
      const apiKey = process.env.NEXT_PUBLIC_FURGONETKA_MAP_KEY || undefined;
      new window.Furgonetka.Map({
        ...(apiKey ? { apiKey } : {}),
        courierServices,
        callback: ({ point }) => {
          onWybor({ kod: point.code, nazwa: point.name, typ: point.type });
        },
      }).show();
    } catch {
      setBlad("Nie udało się otworzyć mapy. Wpisz kod punktu ręcznie poniżej.");
    } finally {
      setLadowanie(false);
    }
  }, [courierServices, onWybor]);

  return (
    <div>
      <button
        type="button"
        onClick={otworz}
        disabled={ladowanie}
        className="rounded-full border border-gold px-5 py-2.5 text-sm text-gold-deep transition-colors hover:bg-sand/50 disabled:opacity-60"
      >
        {ladowanie ? "Otwieranie mapy…" : etykieta}
      </button>
      {blad && <p className="mt-2 text-xs text-red-500">{blad}</p>}
    </div>
  );
}
