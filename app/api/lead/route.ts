import { NextRequest, NextResponse } from "next/server";

/**
 * Lead capture endpoint — riceve risposte quiz + dati lead e forwarda
 * a un webhook n8n (gestito dal team Aldo / Claudio) che si occupa
 * dell'upsert su GoHighLevel.
 *
 * Env richieste (configurate su Netlify → Site settings → Environment):
 *   N8N_WEBHOOK_URL      — URL del webhook n8n (REST/POST, JSON)
 *   N8N_WEBHOOK_SECRET   — (opzionale) shared secret. Inviato come header
 *                          `x-webhook-secret`. n8n lo verifica per rifiutare
 *                          chiamate non autorizzate.
 *
 * Se N8N_WEBHOOK_URL non è settato, il payload viene solo loggato
 * (modalità sviluppo / demo).
 *
 * Schema payload (vedi 09-ops/automation/workflows/2026-05-18-n8n-quiz-webhook-spec.md
 * per il contratto completo + esempio mapping GHL).
 */

type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  problem_area: "relational" | "performative";
  intensity_bucket: "low" | "mid" | "high";
  intensity_score: number | null;
  body_zone_hint: string | null;
  answers: Record<string, string | number>;
  timestamp: string;
  source: string;
};

export async function POST(req: NextRequest) {
  let data: LeadPayload;
  try {
    data = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Basic shape validation — minimal, the webhook upstream does the real one.
  if (!data?.email || !data?.name || !data?.problem_area) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  // Log per dev visibility (Netlify function logs).
  console.log("[lead]", JSON.stringify({
    name: data.name,
    email: data.email,
    phone: data.phone,
    problem_area: data.problem_area,
    intensity_bucket: data.intensity_bucket,
    intensity_score: data.intensity_score,
    body_zone_hint: data.body_zone_hint,
    timestamp: data.timestamp,
  }));

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (!webhookUrl) {
    // Modalità demo / dev — non bloccare il flow utente.
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (webhookSecret) headers["x-webhook-secret"] = webhookSecret;

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
      // n8n può prendere qualche secondo, ma non blocchiamo l'utente più di 8s.
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error("[lead] webhook non-2xx", res.status, await res.text().catch(() => ""));
      // Restituisci comunque 200 al client: il lead è ricevuto, retry lato webhook.
      return NextResponse.json({ ok: true, forwarded: false, webhook_status: res.status });
    }

    return NextResponse.json({ ok: true, forwarded: true });
  } catch (e) {
    console.error("[lead] webhook error", e);
    // Fail-soft: non rompere l'UX se n8n è down. Logghiamo per recovery manuale.
    return NextResponse.json({ ok: true, forwarded: false, error: "webhook_unreachable" });
  }
}
