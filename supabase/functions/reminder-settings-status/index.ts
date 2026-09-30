// reminder-settings-status — config del reminder + prenotazioni in arrivo per il pannello
// "Reminder prenotazioni" di menu-admin.
//
// v3 (2026-09-30): PRIVACY — prima era un GET pubblico che restituiva a chiunque nome, telefono,
// data e persone delle prenotazioni (anche passate con ?show_past=1). Ora:
//   - GET (anonimo): solo le impostazioni del messaggio, senza digest_email e SENZA prenotazioni
//     (usato da gestionale.html per leggere message_template: invariato per lui);
//   - POST { github_token, show_past }: verifica il token GitHub (permesso push su SantaWeb, stesso
//     schema di set-reminder-settings/foodcost-admin) e restituisce anche le prenotazioni.
// v2 (2026-07-05): default = SOLO prenotazioni davvero future (da domani in poi,
// fuso Europe/Rome), non piu' "da oggi" (oggi puo' gia' essere passato a meta'
// giornata). Nuovo query param opzionale ?show_past=1: include anche le date
// passate (nessun limite inferiore), per chi vuole rivedere lo storico.
// v1 (2026-07-04): creazione (gate = data >= oggi UTC).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const TZ = "Europe/Rome";
const REPO = "santamonicagenova-a11y/SantaWeb";

function json(payload: any, status = 200) {
  return new Response(JSON.stringify(payload), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

async function verifyGithubToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        "Authorization": "token " + token,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "santamonica-reminder-settings-status",
      },
    });
    if (!r.ok) return false;
    const data = await r.json();
    return !!(data && data.permissions && data.permissions.push === true);
  } catch (_e) {
    return false;
  }
}

function todayInRome(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    let autenticato = false;
    let showPast = false;
    if (req.method === "POST") {
      let body: any = {};
      try { body = await req.json(); } catch { return json({ error: "JSON non valido" }, 400); }
      autenticato = await verifyGithubToken(String(body.github_token || "").trim());
      if (!autenticato) return json({ error: "Token GitHub non valido o senza permessi di scrittura sul repo." }, 401);
      showPast = body.show_past === true || body.show_past === 1 || body.show_past === "1";
    }

    const settRes = await supabase.from("reservation_reminder_settings").select("*").eq("id", 1).maybeSingle();
    const s = settRes.data || {};
    const settings: any = {
      enabled: s.enabled !== false,
      days_before: s.days_before ?? 1,
      send_time: s.send_time ?? "11:00",
      subject_template: s.subject_template ?? "",
      message_template: s.message_template ?? "",
      digest_enabled: s.digest_enabled !== false,
    };

    // Anonimo: solo il testo/impostazioni del messaggio, niente dati di clienti né email interna.
    if (!autenticato) return json({ settings, pending: [], confirmed: [], autenticato: false });

    settings.digest_email = s.digest_email ?? "prenotazioni@santamonicagenova.it";
    const todayRome = todayInRome();
    const tomorrowRome = addDays(todayRome, 1);

    let pendingQuery = supabase
      .from("reservations")
      .select("id, nome, telefono, data, orario, persone, status")
      .is("confermata_at", null)
      .not("status", "in", "(rejected,cancelled)");
    let confirmedQuery = supabase
      .from("reservations")
      .select("id, nome, telefono, data, orario, persone, reminder_sent_at")
      .not("confermata_at", "is", null)
      .not("status", "in", "(rejected,cancelled)");

    if (!showPast) {
      pendingQuery = pendingQuery.gte("data", tomorrowRome);
      confirmedQuery = confirmedQuery.gte("data", tomorrowRome);
    }

    const [pendingRes, confirmedRes] = await Promise.all([
      pendingQuery.order("data", { ascending: true }).order("orario", { ascending: true }).limit(200),
      confirmedQuery.order("data", { ascending: true }).order("orario", { ascending: true }).limit(200),
    ]);

    return json({
      settings,
      pending: pendingRes.data || [],
      confirmed: confirmedRes.data || [],
      show_past: showPast,
      cutoff_date: tomorrowRome,
      autenticato: true,
    });
  } catch (err) {
    console.error("reminder-settings-status error:", err);
    return json({ error: "Errore interno" }, 500);
  }
});
