import { NextRequest, NextResponse } from "next/server";

/**
 * Lead capture endpoint, riceve le risposte quiz + dati lead.
 *
 * Da configurare con:
 * - GHL_PIT_TOKEN (Private Integration Token)
 * - GHL_LOCATION_ID
 * - GHL_API_BASE = "https://services.leadconnectorhq.com"
 *
 * Per ora salva su console + risponde 200 (non blocca il flow utente).
 * In production: webhook → GHL contact create con custom field loop_type.
 */

type LeadPayload = {
  name: string;
  email: string;
  loop_type: string;
  answers: Record<string, string>;
  timestamp: string;
  source: string;
};

export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as LeadPayload;

    // TODO: enable when PIT token has contacts.write scope
    // const ghlPit = process.env.GHL_PIT_TOKEN;
    // const locationId = process.env.GHL_LOCATION_ID;
    // if (ghlPit && locationId) {
    //   await fetch("https://services.leadconnectorhq.com/contacts/", {
    //     method: "POST",
    //     headers: {
    //       Authorization: `Bearer ${ghlPit}`,
    //       Version: "2021-07-28",
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       firstName: data.name,
    //       email: data.email,
    //       locationId,
    //       customFields: [
    //         { key: "quiz_loop_type", value: data.loop_type },
    //         { key: "quiz_source", value: data.source },
    //       ],
    //       tags: [`quiz-loop-${data.loop_type}`, "mindreset-quiz"],
    //     }),
    //   });
    // }

    // Log per dev (visible in dev server console)
    console.log("[lead]", JSON.stringify({
      name: data.name,
      email: data.email,
      loop_type: data.loop_type,
      timestamp: data.timestamp,
    }));

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[lead] error", e);
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }
}
