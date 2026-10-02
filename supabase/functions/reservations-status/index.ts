// reservations-status — stato prenotazioni online + chiusure + aperture (GET pubblico)
// v10 (2026-09-30): aggiunti card_min_persone (soglia coperti oltre cui serve la carta, null =
//   regola spenta) e card_special_dates (date in cui la carta è sempre chiesta) — garanzia
//   carta mirata, letti da /prenota.html e dal pannello admin. Stessa regola lato server in
//   create-reservation-checkout v10.
// v11 (2026-10-02): aggiunto special_evenings ([{date,time,title,url,card}], solo date future) —
//   serate speciali/cene a tema: il wizard /prenota.html mostra l'avviso con link alla pagina
//   dedicata. Impostate da menu-admin (set-reservations-config v12).
// v9 (2026-09-30): aggiunti thankyou_enabled/subject/intro/closing (mail di ringraziamento
//   post-visita). menu-admin.html li leggeva già da qui ma non c'erano: il pannello
//   "Prenotazioni — Setup" mostrava i campi vuoti e "Salva testi mail" rischiava di
//   sovrascrivere i testi veri con testi vuoti. Stesso pattern non sensibile degli altri testi
//   mail. Il ramo di errore (fail-open) ora risponde anche con fallback:true, così il pannello
//   admin non tratta i valori di ripiego come quelli salvati.
// v2 (2026-05-30): aggiunte le aperture straordinarie (campo openings).
// v3 (2026-05-30): aggiunte chiusure/aperture di SINGOLI orari (slot_closures, slot_openings).
// v4 (2026-07-10): aggiunti i limiti posti per singolo orario (slot_caps, con
//   current_covers = coperti già prenotati per quello slot, non rifiutati/annullati)
//   — usati dal pannello admin (menu-admin.html) per mostrare quanto resta libero.
// v5 (2026-07-23): aggiunto card_required_days (int[] 0=domenica..6=sabato) — giorni della
//   settimana in cui il wizard /prenota.html chiede la carta a garanzia. Letto dal wizard per
//   decidere se mostrare il passo carta o il flusso senza carta (pending_review). Default tutti
//   i 7 giorni se la colonna è vuota/mancante.
// v6 (2026-07-25): aggiunti penale_eur e ore_disdetta_default — penale (€/persona) e ore di
//   disdetta gratuita configurabili da menu-admin.html (pannello "Garanzia — penale e
//   disdetta"), letti dal wizard /prenota.html per mostrare il testo corretto al passo 5 invece
//   dei valori fissi 25€/24h.
// v7 (2026-08-14): aggiunti i testi delle mail cliente (m1_subject/intro/closing,
//   confirm_subject/intro/closing) — letti da menu-admin.html per popolare il pannello "Testi
//   delle mail ai clienti" all'apertura, stesso pattern di penale_eur/ore_disdetta_default.
//   Non sensibili (solo testo di email pubbliche), coerente con l'esposizione già pubblica
//   degli altri campi di reservation_settings.
// v8 (2026-08-14): aggiunti anche reply_subject/intro/closing — testo della risposta manuale di
//   conferma (bottone "✉ Rispondi al cliente" nella M1bis), stesso pattern.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const [settingsRes, closuresRes, openingsRes, slotClosRes, slotOpenRes, slotCapsRes] = await Promise.all([
      supabase.from("reservation_settings").select("online_open, card_required_days, card_min_persone, card_special_dates, penale_eur, ore_disdetta_default, m1_subject, m1_intro, m1_closing, confirm_subject, confirm_intro, confirm_closing, reply_subject, reply_intro, reply_closing, thankyou_enabled, thankyou_subject, thankyou_intro, thankyou_closing, special_evenings").eq("id", 1).single(),
      supabase.from("reservation_closures").select("closure_date, service").gte("closure_date", today).order("closure_date"),
      supabase.from("reservation_openings").select("opening_date, service").gte("opening_date", today).order("opening_date"),
      supabase.from("reservation_slot_closures").select("slot_date, slot_time").gte("slot_date", today).order("slot_date"),
      supabase.from("reservation_slot_openings").select("slot_date, slot_time").gte("slot_date", today).order("slot_date"),
      supabase.from("reservation_slot_caps").select("slot_date, slot_time, max_covers").gte("slot_date", today).order("slot_date"),
    ]);
    if (settingsRes.error) throw settingsRes.error;

    const online_open = settingsRes.data ? settingsRes.data.online_open : true;
    const card_required_days = settingsRes.data && Array.isArray(settingsRes.data.card_required_days)
      ? settingsRes.data.card_required_days
      : [0, 1, 2, 3, 4, 5, 6];
    const card_min_persone = settingsRes.data && settingsRes.data.card_min_persone != null ? Number(settingsRes.data.card_min_persone) : null;
    const card_special_dates = settingsRes.data && Array.isArray(settingsRes.data.card_special_dates)
      ? settingsRes.data.card_special_dates.map((x: any) => String(x).slice(0, 10)).sort()
      : [];
    const special_evenings = (settingsRes.data && Array.isArray(settingsRes.data.special_evenings) ? settingsRes.data.special_evenings : [])
      .filter((e: any) => e && String(e.date) >= today)
      .map((e: any) => ({ date: String(e.date).slice(0, 10), time: e.time, title: e.title, url: e.url, card: e.card === true }));
    const penale_eur = settingsRes.data && settingsRes.data.penale_eur != null ? Number(settingsRes.data.penale_eur) : 25;
    const ore_disdetta_default = settingsRes.data && settingsRes.data.ore_disdetta_default != null ? Number(settingsRes.data.ore_disdetta_default) : 24;
    const sd = settingsRes.data || {};
    const m1_subject = sd.m1_subject || "Richiesta ricevuta — Ristorante Santamonica";
    const m1_intro = sd.m1_intro || "grazie per la sua richiesta di prenotazione:";
    const m1_closing = sd.m1_closing || "Abbiamo ricevuto la sua richiesta e la contatteremo a breve per conferma.";
    const confirm_subject = sd.confirm_subject || "La sua prenotazione è confermata — Ristorante Santamonica";
    const confirm_intro = sd.confirm_intro || "la sua prenotazione è confermata:";
    const confirm_closing = sd.confirm_closing || "";
    const reply_subject = sd.reply_subject || "La sua prenotazione al Ristorante Santamonica — {data}";
    const reply_intro = sd.reply_intro || "grazie per la sua richiesta di prenotazione:";
    const reply_closing = sd.reply_closing || "Prenotazione confermata, vi aspettiamo\n\nAndrea Giachino";
    const thankyou_enabled = sd.thankyou_enabled !== false;
    const thankyou_subject = sd.thankyou_subject || "";
    const thankyou_intro = sd.thankyou_intro || "";
    const thankyou_closing = sd.thankyou_closing || "";
    const closures = (closuresRes.data || []).map((c: any) => ({ date: c.closure_date, service: c.service }));
    const openings = (openingsRes.data || []).map((o: any) => ({ date: o.opening_date, service: o.service }));
    const slot_closures = (slotClosRes.data || []).map((s: any) => ({ date: s.slot_date, time: s.slot_time }));
    const slot_openings = (slotOpenRes.data || []).map((s: any) => ({ date: s.slot_date, time: s.slot_time }));

    const capsRows = slotCapsRes.data || [];
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

    return new Response(JSON.stringify({
      online_open, card_required_days, card_min_persone, card_special_dates, special_evenings, penale_eur, ore_disdetta_default,
      m1_subject, m1_intro, m1_closing, confirm_subject, confirm_intro, confirm_closing,
      reply_subject, reply_intro, reply_closing,
      thankyou_enabled, thankyou_subject, thankyou_intro, thankyou_closing,
      closures, openings, slot_closures, slot_openings, slot_caps,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("reservations-status error (fail-open):", err);
    return new Response(JSON.stringify({ fallback: true, online_open: true, card_required_days: [0,1,2,3,4,5,6], card_min_persone: null, card_special_dates: [], special_evenings: [], penale_eur: 25, ore_disdetta_default: 24, closures: [], openings: [], slot_closures: [], slot_openings: [], slot_caps: [] }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
});
