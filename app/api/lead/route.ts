import { NextRequest, NextResponse } from "next/server";

/**
 * Lead capture endpoint — riceve risposte quiz + dati lead.
 *
 * Schema 2026-05-17 (post Aldo call): non più 6 LoopType geo, ma:
 *   - problem_area: "relational" | "performative"
 *   - intensity_bucket: "low" | "mid" | "high"
 *   - intensity_score: 1-10
 *   - body_zone_hint: zona corpo dominante (metadata per setter, non determina result)
 *
 * Env richiesti:
 *   GHL_PIT_TOKEN, GHL_LOCATION_ID (PIT con scope contacts.write)
 *
 * Per ora salva su console + risponde 200 (non blocca il flow utente).
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
  try {
    const data = (await req.json()) as LeadPayload;

    // TODO: enable when PIT token has contacts.write scope
    // const ghlPit = process.env.GHL_PIT_TOKEN;
    // const locationId = process.env.GHL_LOCATION_ID;
    // if (ghlPit && locationId) {
    //   const tags = [
    //     "mindreset-quiz",
    //     `quiz-area-${data.problem_area}`,
    //     `quiz-intensity-${data.intensity_bucket}`,
    //   ];
    //   if (data.body_zone_hint) tags.push(`quiz-zone-${data.body_zone_hint}`);
    //
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
    //       phone: data.phone,
    //       locationId,
    //       customFields: [
    //         { key: "quiz_problem_area", value: data.problem_area },
    //         { key: "quiz_intensity_bucket", value: data.intensity_bucket },
    //         { key: "quiz_intensity_score", value: String(data.intensity_score ?? "") },
    //         { key: "quiz_body_zone_hint", value: data.body_zone_hint ?? "" },
    //         { key: "quiz_source", value: data.source },
    //       ],
    //       tags,
    //     }),
    //   });
    // }

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

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[lead] error", e);
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }
}
