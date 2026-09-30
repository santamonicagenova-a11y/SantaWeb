// set-reservations-config — POST protetto (auth via token GitHub).
// Apre/chiude prenotazioni online; gestisce chiusure e aperture straordinarie.
// v2 (2026-05-30): aggiunte azioni add_opening/remove_opening + openings nello stato.
// v3 (2026-05-30): aggiunte azioni add/remove_slot_closure e add/remove_slot_opening
//   (chiusura/apertura di un SINGOLO orario) + slot_closures/slot_openings nello stato.
// v4 (2026-07-10): aggiunte azioni set_slot_cap/remove_slot_cap — limite massimo di
//   COPERTI (somma persone) prenotabili su un singolo orario già aperto (data+ora),
//   in aggiunta a chiusure/aperture. Tabella reservation_slot_caps (slot_date,
//   slot_time, max_covers), stesso pattern delle altre tabelle slot_*. Il controllo
//   vero e proprio (rifiuto se il limite verrebbe superato) sta in submit-reservation;
//   qui solo CRUD del limite + stato per l'admin. slot_caps nello stato ora include
//   anche i coperti già prenotati per quello slot (current_covers), utile per l'UI.
// v5 (2026-07-23): aggiunta azione set_card_required_days — imposta quali giorni della
//   settimana (0=domenica..6=sabato, convenzione JS getDay) il wizard /prenota.html chiede la
//   carta a garanzia. Colonna reservation_settings.card_required_days (int[], default tutti i
//   7 giorni = comportamento invariato). Letta anche da reservations-status e da
//   create-reservation-checkout per decidere il ramo Stripe vs pending_review.
// v6 (2026-07-25): aggiunta azione set_guarantee_defaults — imposta la penale (€/persona) e le
//   ore di disdetta gratuita usate come default quando si genera la garanzia.
// v7 (2026-08-14): aggiunta azione set_mail_texts — imposta oggetto/apertura/chiusura delle due
//   mail automatiche al cliente: M1 "richiesta ricevuta" e conferma automatica del wizard.
// v8 (2026-08-14): l'azione set_mail_texts ora copre anche la TUA risposta manuale di conferma
//   (il testo precompilato dietro "✉ Rispondi al cliente" nella M1bis).
// v9 (2026-09-02): NUOVO — testi mail di RINGRAZIAMENTO post-visita (richiesta Andrea: mandare
//   una mail di ringraziamento quando un cliente che ha prenotato dal SITO viene marcato
//   "Arrivato" dal gestionale, mai per cancellati/no-show). L'invio vero e proprio è in
//   set-reminder-settings (dove sta già set_arrivo_status); qui solo il CRUD dei testi +
//   l'interruttore on/off. set_mail_texts esteso con thankyou_subject/.thankyou_intro/
//   .thankyou_closing (stesso pattern: campo vuoto = torna al default hardcoded, condiviso col
//   default in set-reminder-settings). Nuova azione set_thankyou_enabled (bool) — permette ad
//   Andrea di disattivare l'invio senza cancellare i testi configurati. Nuove colonne
//   reservation_settings.thankyou_enabled (default true) / .thankyou_subject / .thankyou_intro /
//   .thankyou_closing.
// v10 (2026-09-12): NUOVO — azione set_periods, per il pannello unificato "Orari di Apertura"
//   (menu-admin.html, tab Setup). Sostituisce l'intero array reservation_settings.opening_periods
//   con validazione strutturale completa (date, orari, day_services, non-overlap dopo
//   riordino). Stessa colonna letta da _shared/periods.ts (submit-reservation,
//   create-reservation-checkout) e da get-opening-hours (display pubblico) — questa è l'UNICA
//   scrittura, tutti gli altri consumer sono sola lettura. KNOWN_SLOTS non è più una costante
//   fissa: getKnownSlots() lo deriva ora dall'unione di tutti gli slot di tutti i periodi
//   (fallback sulla vecchia lista fissa se i periodi non sono leggibili) — corregge
//   incidentalmente un bug preesistente: "22:30" non era mai stato aggiunto alla vecchia
//   costante pur essendo uno slot cena valido nell'orario estivo (CENA_ESTATE), quindi
//   chiudere/aprire/limitare quello slot falliva con "Orario non valido".
// v11 (2026-09-30): NUOVO — azione set_card_rules (garanzia carta mirata, idea 11 approvata da
//   Andrea). card_min_persone (intero 1-20, null = regola spenta): la carta è chiesta anche
//   quando i coperti sono >= soglia. card_special_dates (array di YYYY-MM-DD): date speciali in
//   cui la carta è sempre chiesta. Entrambe nello stato. Lette da create-reservation-checkout
//   (v10) e reservations-status (v10). Primo sorgente di questa funzione messo nel repo.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const REPO = "santamonicagenova-a11y/SantaWeb";

// Fallback SOLO se reservation_settings.opening_periods non è leggibile — v10: prima era la
// fonte unica, ora è solo il paracadute. Vedi getKnownSlots().
const KNOWN_SLOTS_FALLBACK = ["12:30", "13:00", "13:30", "14:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"];
const TIME_RE = /^\d{2}:\d{2}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Slot noti (v10): unione di pranzo_slots+cena_slots su TUTTI i periodi configurati, invece di
// una lista fissa nel codice — così un nuovo periodo con nuovi orari (es. un cena_slots diverso)
// non richiede più un deploy di codice per essere "conosciuto" dalle azioni slot_*/set_slot_cap.
async function getKnownSlots(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("reservation_settings").select("opening_periods").eq("id", 1).single();
    if (error || !data?.opening_periods || !Array.isArray(data.opening_periods) || data.opening_periods.length === 0) {
      return KNOWN_SLOTS_FALLBACK;
    }
    const set = new Set<string>();
    for (const p of data.opening_periods as any[]) {
      for (const t of p.pranzo_slots || []) set.add(t);
      for (const t of p.cena_slots || []) set.add(t);
    }
    return set.size > 0 ? Array.from(set) : KNOWN_SLOTS_FALLBACK;
  } catch {
    return KNOWN_SLOTS_FALLBACK;
  }
}

// Default identici a quelli hardcoded in submit-reservation (M1), stripe-webhook (conferma
// wizard) e set-reminder-settings (ringraziamento) — usati solo per mostrare all'admin il
// testo attuale quando la colonna è vuota.
const MAIL_TEXT_DEFAULTS = {
  m1_subject: "Richiesta ricevuta — Ristorante Santamonica",
  m1_intro: "grazie per la sua richiesta di prenotazione:",
  m1_closing: "Abbiamo ricevuto la sua richiesta e la contatteremo a breve per conferma.",
  confirm_subject: "La sua prenotazione è confermata — Ristorante Santamonica",
  confirm_intro: "la sua prenotazione è confermata:",
  confirm_closing: "",
  reply_subject: "La sua prenotazione al Ristorante Santamonica — {data}",
  reply_intro: "grazie per la sua richiesta di prenotazione:",
  reply_closing: "Prenotazione confermata, vi aspettiamo\n\nAndrea Giachino",
  thankyou_subject: "Grazie per essere stati nostri ospiti — Ristorante Santamonica",
  thankyou_intro: "grazie per aver scelto il Ristorante Santamonica.",
  thankyou_closing: "È stato un piacere avervi con noi: speriamo di potervi accogliere di nuovo presto.",
};
const MAIL_TEXT_MAX_LEN = 1000;

async function verifyGithubToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        "Authorization": "token " + token,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "santamonica-reservations-admin",
      },
    });
    if (!r.ok) return false;
    const data = await r.json();
    return !!(data && data.permissions && data.permissions.push === true);
  } catch (_e) {
    return false;
  }
}

async function currentState() {
  const today = new Date().toISOString().slice(0, 10);
  const [s, c, o, sc, so, caps] = await Promise.all([
    supabase.from("reservation_settings").select("online_open, card_required_days, card_min_persone, card_special_dates, penale_eur, ore_disdetta_default, m1_subject, m1_intro, m1_closing, confirm_subject, confirm_intro, confirm_closing, reply_subject, reply_intro, reply_closing, thankyou_enabled, thankyou_subject, thankyou_intro, thankyou_closing, opening_periods").eq("id", 1).single(),
    supabase.from("reservation_closures").select("closure_date, service").gte("closure_date", today).order("closure_date"),
    supabase.from("reservation_openings").select("opening_date, service").gte("opening_date", today).order("opening_date"),
    supabase.from("reservation_slot_closures").select("slot_date, slot_time").gte("slot_date", today).order("slot_date"),
    supabase.from("reservation_slot_openings").select("slot_date, slot_time").gte("slot_date", today).order("slot_date"),
    supabase.from("reservation_slot_caps").select("slot_date, slot_time, max_covers").gte("slot_date", today).order("slot_date"),
  ]);

  const capsRows = caps.data || [];
  let slot_caps: any[] = capsRows.map((x: any) => ({ date: x.slot_date, time: x.slot_time, max_covers: x.max_covers, current_covers: 0 }));

  if (capsRows.length > 0) {
    const dates = Array.from(new Set(capsRows.map((x: any) => x.slot_date)));
    const { data: resRows } = await supabase
      .from("reservations")
      .select("data, orario, persone")
      .in("data", dates)
      .not("status", "in", "(rejected,cancelled)");
    const coversByKey: Record<string, number> = {};
    for (const r of resRows || []) {
      const key = `${r.data}|${r.orario}`;
      coversByKey[key] = (coversByKey[key] || 0) + (r.persone || 0);
    }
    slot_caps = slot_caps.map((cap) => ({ ...cap, current_covers: coversByKey[`${cap.date}|${cap.time}`] || 0 }));
  }

  return {
    online_open: s.data ? s.data.online_open : true,
    card_required_days: s.data && Array.isArray(s.data.card_required_days) ? s.data.card_required_days : [0, 1, 2, 3, 4, 5, 6],
    card_min_persone: s.data && s.data.card_min_persone != null ? Number(s.data.card_min_persone) : null,
    card_special_dates: s.data && Array.isArray(s.data.card_special_dates) ? s.data.card_special_dates.map((x: any) => String(x).slice(0, 10)).sort() : [],
    penale_eur: s.data && s.data.penale_eur != null ? Number(s.data.penale_eur) : 25,
    ore_disdetta_default: s.data && s.data.ore_disdetta_default != null ? Number(s.data.ore_disdetta_default) : 24,
    m1_subject: (s.data && s.data.m1_subject) || MAIL_TEXT_DEFAULTS.m1_subject,
    m1_intro: (s.data && s.data.m1_intro) || MAIL_TEXT_DEFAULTS.m1_intro,
    m1_closing: (s.data && s.data.m1_closing) || MAIL_TEXT_DEFAULTS.m1_closing,
    confirm_subject: (s.data && s.data.confirm_subject) || MAIL_TEXT_DEFAULTS.confirm_subject,
    confirm_intro: (s.data && s.data.confirm_intro) || MAIL_TEXT_DEFAULTS.confirm_intro,
    confirm_closing: (s.data && s.data.confirm_closing) || MAIL_TEXT_DEFAULTS.confirm_closing,
    reply_subject: (s.data && s.data.reply_subject) || MAIL_TEXT_DEFAULTS.reply_subject,
    reply_intro: (s.data && s.data.reply_intro) || MAIL_TEXT_DEFAULTS.reply_intro,
    reply_closing: (s.data && s.data.reply_closing) || MAIL_TEXT_DEFAULTS.reply_closing,
    thankyou_enabled: s.data ? s.data.thankyou_enabled !== false : true,
    thankyou_subject: (s.data && s.data.thankyou_subject) || MAIL_TEXT_DEFAULTS.thankyou_subject,
    thankyou_intro: (s.data && s.data.thankyou_intro) || MAIL_TEXT_DEFAULTS.thankyou_intro,
    thankyou_closing: (s.data && s.data.thankyou_closing) || MAIL_TEXT_DEFAULTS.thankyou_closing,
    opening_periods: (s.data && s.data.opening_periods) || [],
    closures: (c.data || []).map((x: any) => ({ date: x.closure_date, service: x.service })),
    openings: (o.data || []).map((x: any) => ({ date: x.opening_date, service: x.service })),
    slot_closures: (sc.data || []).map((x: any) => ({ date: x.slot_date, time: x.slot_time })),
    slot_openings: (so.data || []).map((x: any) => ({ date: x.slot_date, time: x.slot_time })),
    slot_caps,
  };
}

function json(payload: any, status = 200) {
  return new Response(JSON.stringify(payload), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ── Validazione azione set_periods (v10) ──
// Ogni periodo: from (obbligatoria), to (nullable), pranzo_slots/cena_slots (array di "HH:MM"),
// pranzo_opens/pranzo_closes/cena_opens/cena_closes (nullable "HH:MM", solo display), day_services
// (chiavi "0".."6", valori sottoinsieme di ["pranzo","cena"]), note (opzionale, testo libero per
// l'admin — non mostrato al pubblico). Dopo la validazione i periodi sono riordinati per `from`
// crescente (resolvePeriodFrom in _shared/periods.ts/orari.js assume questo ordine) e si
// controlla che non si sovrappongano.
function validatePeriods(input: any): { ok: true; cleaned: any[] } | { ok: false; error: string } {
  if (!Array.isArray(input) || input.length === 0) return { ok: false, error: "Serve almeno un periodo" };
  const cleaned: any[] = [];
  for (let idx = 0; idx < input.length; idx++) {
    const p = input[idx];
    const tag = `Periodo ${idx + 1}`;
    if (!p || typeof p !== "object") return { ok: false, error: `${tag}: oggetto non valido` };
    const from = String(p.from || "").trim();
    if (!DATE_RE.test(from)) return { ok: false, error: `${tag}: data di inizio non valida (atteso YYYY-MM-DD)` };
    let to: string | null = null;
    if (p.to !== null && p.to !== undefined && String(p.to).trim() !== "") {
      to = String(p.to).trim();
      if (!DATE_RE.test(to)) return { ok: false, error: `${tag}: data di fine non valida (atteso YYYY-MM-DD o vuota)` };
      if (to < from) return { ok: false, error: `${tag}: la data di fine è precedente alla data di inizio` };
    }
    const pranzoSlots = Array.isArray(p.pranzo_slots) ? p.pranzo_slots.map((t: any) => String(t).trim()) : [];
    const cenaSlots = Array.isArray(p.cena_slots) ? p.cena_slots.map((t: any) => String(t).trim()) : [];
    for (const t of [...pranzoSlots, ...cenaSlots]) {
      if (!TIME_RE.test(t)) return { ok: false, error: `${tag}: orario slot non valido "${t}" (atteso HH:MM)` };
    }
    const optTime = (v: any): string | null => {
      if (v === null || v === undefined || String(v).trim() === "") return null;
      return String(v).trim();
    };
    const pranzoOpens = optTime(p.pranzo_opens), pranzoCloses = optTime(p.pranzo_closes);
    const cenaOpens = optTime(p.cena_opens), cenaCloses = optTime(p.cena_closes);
    for (const t of [pranzoOpens, pranzoCloses, cenaOpens, cenaCloses]) {
      if (t !== null && !TIME_RE.test(t)) return { ok: false, error: `${tag}: orario vetrina non valido "${t}" (atteso HH:MM)` };
    }
    if (!p.day_services || typeof p.day_services !== "object") return { ok: false, error: `${tag}: day_services mancante` };
    const dayServices: Record<string, string[]> = {};
    for (let d = 0; d <= 6; d++) {
      const raw = p.day_services[String(d)];
      const arr = Array.isArray(raw) ? raw.map((x: any) => String(x).trim()) : [];
      for (const s of arr) {
        if (s !== "pranzo" && s !== "cena") return { ok: false, error: `${tag}: servizio non valido "${s}" nel giorno ${d} (solo pranzo/cena)` };
      }
      dayServices[String(d)] = Array.from(new Set(arr));
    }
    const note = p.note !== undefined && p.note !== null ? String(p.note).trim().slice(0, 500) : undefined;
    const cleanedPeriod: any = {
      from, to,
      pranzo_slots: pranzoSlots, cena_slots: cenaSlots,
      pranzo_opens: pranzoOpens, pranzo_closes: pranzoCloses,
      cena_opens: cenaOpens, cena_closes: cenaCloses,
      day_services: dayServices,
    };
    if (note) cleanedPeriod.note = note;
    cleaned.push(cleanedPeriod);
  }
  cleaned.sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0));
  for (let i = 0; i < cleaned.length - 1; i++) {
    const cur = cleaned[i], next = cleaned[i + 1];
    if (cur.to === null) return { ok: false, error: `Il periodo che inizia il ${cur.from} non ha una data di fine, ma c'è un periodo successivo (dal ${next.from}): dagli una data di fine` };
    if (cur.to >= next.from) return { ok: false, error: `Il periodo che inizia il ${cur.from} si sovrappone con quello che inizia il ${next.from}` };
  }
  return { ok: true, cleaned };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "JSON non valido" }, 400);
  }

  const token = (body.github_token || "").trim();
  const authorized = await verifyGithubToken(token);
  if (!authorized) {
    return json({ error: "Token GitHub non valido o senza permessi di scrittura sul repo." }, 401);
  }

  const action = body.action;

  try {
    if (action === "set_open") {
      const open = body.open === true;
      const { error } = await supabase
        .from("reservation_settings")
        .update({ online_open: open, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (error) throw error;

    } else if (action === "set_card_required_days") {
      const days = Array.isArray(body.days) ? body.days : null;
      if (!days) return json({ error: "Elenco giorni non valido" }, 400);
      const clean = Array.from(new Set(days.map((d: any) => Number(d))));
      if (clean.some((d) => !Number.isInteger(d) || d < 0 || d > 6)) {
        return json({ error: "Ogni giorno deve essere un numero tra 0 (domenica) e 6 (sabato)" }, 400);
      }
      const { error } = await supabase
        .from("reservation_settings")
        .update({ card_required_days: clean, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (error) throw error;

    } else if (action === "set_card_rules") {
      let minPersone: number | null = null;
      if (body.card_min_persone !== null && body.card_min_persone !== undefined && String(body.card_min_persone).trim() !== "") {
        minPersone = Number(body.card_min_persone);
        if (!Number.isInteger(minPersone) || minPersone < 1 || minPersone > 20) {
          return json({ error: "Soglia persone non valida (numero intero tra 1 e 20, o vuota per spegnere la regola)" }, 400);
        }
      }
      const rawDates = Array.isArray(body.card_special_dates) ? body.card_special_dates : [];
      const dates = Array.from(new Set(rawDates.map((d: any) => String(d).trim()))).sort() as string[];
      if (dates.length > 100) return json({ error: "Troppe date speciali (max 100)" }, 400);
      for (const d of dates) {
        if (!DATE_RE.test(d)) return json({ error: `Data speciale non valida "${d}" (atteso YYYY-MM-DD)` }, 400);
      }
      const { error } = await supabase
        .from("reservation_settings")
        .update({ card_min_persone: minPersone, card_special_dates: dates, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (error) throw error;

    } else if (action === "set_guarantee_defaults") {
      const penale = Number(body.penale_eur);
      const oreDisdetta = Number(body.ore_disdetta);
      if (!Number.isFinite(penale) || penale <= 0 || penale > 500) {
        return json({ error: "Penale non valida (deve essere tra 1 e 500 €)" }, 400);
      }
      if (!Number.isInteger(oreDisdetta) || oreDisdetta < 1 || oreDisdetta > 168) {
        return json({ error: "Ore disdetta non valide (deve essere un numero intero tra 1 e 168)" }, 400);
      }
      const { error } = await supabase
        .from("reservation_settings")
        .update({ penale_eur: penale, ore_disdetta_default: oreDisdetta, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (error) throw error;

    } else if (action === "set_mail_texts") {
      const fields = ["m1_subject", "m1_intro", "m1_closing", "confirm_subject", "confirm_intro", "confirm_closing", "reply_subject", "reply_intro", "reply_closing", "thankyou_subject", "thankyou_intro", "thankyou_closing"];
      const update: Record<string, string> = {};
      for (const f of fields) {
        if (body[f] === undefined) continue;
        const v = String(body[f] || "").trim();
        if (v.length > MAIL_TEXT_MAX_LEN) return json({ error: `Campo "${f}" troppo lungo (max ${MAIL_TEXT_MAX_LEN} caratteri)` }, 400);
        update[f] = v; // stringa vuota = torna al default hardcoded (letto come NULL/"" a runtime)
      }
      if (Object.keys(update).length === 0) return json({ error: "Nessun campo da salvare" }, 400);
      const { error } = await supabase
        .from("reservation_settings")
        .update({ ...update, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (error) throw error;

    } else if (action === "set_thankyou_enabled") {
      const enabled = body.enabled === true;
      const { error } = await supabase
        .from("reservation_settings")
        .update({ thankyou_enabled: enabled, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (error) throw error;

    } else if (action === "set_periods") {
      const result = validatePeriods(body.periods);
      if (!result.ok) return json({ error: result.error }, 400);
      const { error } = await supabase
        .from("reservation_settings")
        .update({ opening_periods: result.cleaned, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (error) throw error;

    } else if (action === "add_closure") {
      const date = (body.date || "").trim();
      const service = (body.service || "").trim();
      if (!DATE_RE.test(date)) return json({ error: "Data non valida (atteso YYYY-MM-DD)" }, 400);
      if (!["pranzo", "cena", "tutto"].includes(service)) return json({ error: "Servizio non valido" }, 400);
      if (service === "tutto") {
        await supabase.from("reservation_closures").delete().eq("closure_date", date).in("service", ["pranzo", "cena"]);
      } else {
        const { data: tuttoRow } = await supabase.from("reservation_closures").select("id").eq("closure_date", date).eq("service", "tutto").maybeSingle();
        if (tuttoRow) return json({ ok: true, ...(await currentState()) });
      }
      const { error } = await supabase
        .from("reservation_closures")
        .upsert({ closure_date: date, service }, { onConflict: "closure_date,service" });
      if (error) throw error;

    } else if (action === "remove_closure") {
      const date = (body.date || "").trim();
      const service = (body.service || "").trim();
      const { error } = await supabase
        .from("reservation_closures")
        .delete()
        .eq("closure_date", date)
        .eq("service", service);
      if (error) throw error;

    } else if (action === "add_opening") {
      const date = (body.date || "").trim();
      const service = (body.service || "").trim();
      if (!DATE_RE.test(date)) return json({ error: "Data non valida (atteso YYYY-MM-DD)" }, 400);
      if (!["pranzo", "cena", "tutto"].includes(service)) return json({ error: "Servizio non valido" }, 400);
      if (service === "tutto") {
        await supabase.from("reservation_openings").delete().eq("opening_date", date).in("service", ["pranzo", "cena"]);
      } else {
        const { data: tuttoRow } = await supabase.from("reservation_openings").select("id").eq("opening_date", date).eq("service", "tutto").maybeSingle();
        if (tuttoRow) return json({ ok: true, ...(await currentState()) });
      }
      const { error } = await supabase
        .from("reservation_openings")
        .upsert({ opening_date: date, service }, { onConflict: "opening_date,service" });
      if (error) throw error;

    } else if (action === "remove_opening") {
      const date = (body.date || "").trim();
      const service = (body.service || "").trim();
      const { error } = await supabase
        .from("reservation_openings")
        .delete()
        .eq("opening_date", date)
        .eq("service", service);
      if (error) throw error;

    } else if (action === "add_slot_closure") {
      const date = (body.date || "").trim();
      const time = (body.time || "").trim();
      if (!DATE_RE.test(date)) return json({ error: "Data non valida (atteso YYYY-MM-DD)" }, 400);
      const knownSlots = await getKnownSlots();
      if (!knownSlots.includes(time)) return json({ error: "Orario non valido" }, 400);
      const { error } = await supabase
        .from("reservation_slot_closures")
        .upsert({ slot_date: date, slot_time: time }, { onConflict: "slot_date,slot_time" });
      if (error) throw error;

    } else if (action === "remove_slot_closure") {
      const date = (body.date || "").trim();
      const time = (body.time || "").trim();
      const { error } = await supabase
        .from("reservation_slot_closures")
        .delete()
        .eq("slot_date", date)
        .eq("slot_time", time);
      if (error) throw error;

    } else if (action === "add_slot_opening") {
      const date = (body.date || "").trim();
      const time = (body.time || "").trim();
      if (!DATE_RE.test(date)) return json({ error: "Data non valida (atteso YYYY-MM-DD)" }, 400);
      const knownSlots = await getKnownSlots();
      if (!knownSlots.includes(time)) return json({ error: "Orario non valido" }, 400);
      const { error } = await supabase
        .from("reservation_slot_openings")
        .upsert({ slot_date: date, slot_time: time }, { onConflict: "slot_date,slot_time" });
      if (error) throw error;

    } else if (action === "remove_slot_opening") {
      const date = (body.date || "").trim();
      const time = (body.time || "").trim();
      const { error } = await supabase
        .from("reservation_slot_openings")
        .delete()
        .eq("slot_date", date)
        .eq("slot_time", time);
      if (error) throw error;

    } else if (action === "set_slot_cap") {
      const date = (body.date || "").trim();
      const time = (body.time || "").trim();
      const maxCovers = Number(body.max_covers);
      if (!DATE_RE.test(date)) return json({ error: "Data non valida (atteso YYYY-MM-DD)" }, 400);
      const knownSlots = await getKnownSlots();
      if (!knownSlots.includes(time)) return json({ error: "Orario non valido" }, 400);
      if (!Number.isInteger(maxCovers) || maxCovers < 1 || maxCovers > 500) {
        return json({ error: "Numero massimo di posti non valido" }, 400);
      }
      const { error } = await supabase
        .from("reservation_slot_caps")
        .upsert({ slot_date: date, slot_time: time, max_covers: maxCovers }, { onConflict: "slot_date,slot_time" });
      if (error) throw error;

    } else if (action === "remove_slot_cap") {
      const date = (body.date || "").trim();
      const time = (body.time || "").trim();
      const { error } = await supabase
        .from("reservation_slot_caps")
        .delete()
        .eq("slot_date", date)
        .eq("slot_time", time);
      if (error) throw error;

    } else {
      return json({ error: "Azione non riconosciuta" }, 400);
    }

    return json({ ok: true, ...(await currentState()) });
  } catch (err) {
    console.error("set-reservations-config error:", err);
    return json({ error: "Errore interno" }, 500);
  }
});
