"use client";

import { useState } from "react";

const EMAIL = "kontakt@nawiabizuteria.pl";

/**
 * Formularz kontaktowy bez backendu — po wysłaniu otwiera klienta poczty
 * z gotowym tematem i treścią (mailto). Prosty i niezawodny.
 */
export function ContactForm() {
  const [imie, setImie] = useState("");
  const [email, setEmail] = useState("");
  const [tresc, setTresc] = useState("");

  function wyslij(e: React.FormEvent) {
    e.preventDefault();
    const temat = encodeURIComponent(`Wiadomość ze sklepu NAWIA — ${imie || "kontakt"}`);
    const body = encodeURIComponent(
      `${tresc}\n\n—\n${imie}${email ? ` (${email})` : ""}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${temat}&body=${body}`;
  }

  const pole =
    "w-full rounded-lg border border-line bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-gold";

  return (
    <form onSubmit={wyslij} className="space-y-4">
      <div>
        <label htmlFor="imie" className="mb-1.5 block text-sm text-ink">
          Imię
        </label>
        <input
          id="imie"
          value={imie}
          onChange={(e) => setImie(e.target.value)}
          required
          placeholder="Jak się do Ciebie zwracać?"
          className={pole}
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-ink">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="twoj@email.pl"
          className={pole}
        />
      </div>
      <div>
        <label htmlFor="tresc" className="mb-1.5 block text-sm text-ink">
          Wiadomość
        </label>
        <textarea
          id="tresc"
          value={tresc}
          onChange={(e) => setTresc(e.target.value)}
          required
          rows={5}
          placeholder="W czym możemy pomóc?"
          className={`${pole} resize-y`}
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-ink px-8 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-deep sm:w-auto"
      >
        Wyślij wiadomość
      </button>
      <p className="text-xs leading-relaxed text-muted">
        Formularz otworzy Twój program pocztowy z gotową wiadomością. Wolisz
        napisać bezpośrednio? Pisz na{" "}
        <a
          href={`mailto:${EMAIL}`}
          className="text-gold-deep underline-offset-4 hover:underline"
        >
          {EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
