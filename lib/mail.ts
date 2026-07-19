// Wysyłka maili transakcyjnych (noreply) przez SMTP home.pl — tylko po stronie
// serwera. Konfiguracja w .env: SMTP_HOST/PORT/SECURE/USER/PASS/FROM.
import nodemailer from "nodemailer";

let transport: nodemailer.Transporter | null = null;

function pobierzTransport(): nodemailer.Transporter {
  if (transport) return transport;
  const host = process.env.SMTP_HOST || "poczta.home.pl";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    throw new Error("Brak konfiguracji SMTP w .env (SMTP_USER / SMTP_PASS).");
  }
  transport = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE === "true"
      : port === 465,
    auth: { user, pass },
  });
  return transport;
}

const NADAWCA = process.env.SMTP_FROM || "NAWIA <noreply@nawiabizuteria.pl>";

/**
 * Wysyła maila transakcyjnego.
 * Jeśli ustawiony jest `RESEND_API_KEY` — wysyłka przez API Resend po HTTPS
 * (port 443, omija blokadę portów SMTP na VPS). W przeciwnym razie SMTP.
 */
export async function wyslijMail({
  do: odbiorca,
  temat,
  html,
  tekst,
}: {
  do: string;
  temat: string;
  html: string;
  tekst?: string;
}): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NADAWCA,
        to: [odbiorca],
        subject: temat,
        html,
        text: tekst,
        ...(process.env.SMTP_REPLY_TO
          ? { reply_to: process.env.SMTP_REPLY_TO }
          : {}),
      }),
    });
    if (!res.ok) {
      throw new Error(`Resend ${res.status}: ${await res.text()}`);
    }
    return;
  }

  await pobierzTransport().sendMail({
    from: NADAWCA,
    to: odbiorca,
    subject: temat,
    html,
    text: tekst,
    replyTo: process.env.SMTP_REPLY_TO || undefined,
  });
}
