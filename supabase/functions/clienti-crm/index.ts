// clienti-crm — CRM ospiti (Gestionale Fase 2, pianificato 5/7/2026, costruito 1/9/2026).
// Lo storico visite NON e' duplicato: si calcola al volo raggruppando `reservations` per
// telefono normalizzato (ultime 9 cifre, stessa convenzione gia' in uso per il matching dei
// pacchi No-show). La tabella `clienti` contiene solo l'arricchimento manuale (nome override,
// note, tag, ricorrenze) e i clienti puramente manuali (mai passati da una prenotazione web).
// Auth via token GitHub (stesso schema di set-reservations-config/rubrica-professionisti).
// v6 (2026-09-30): azione `notes_for` (idea 12 approvata da Andrea) — dato un elenco di telefoni
//   normalizzati (le prenotazioni della vista giorno del gestionale), ritorna per ciascuno
//   note/tag/compleanno/anniversario dell'anagrafica. Il gestionale la chiama col token dopo aver
//   caricato il giorno: le note private NON passano da gestionale-day (che e' pubblico).
//   Primo sorgente di questa funzione messo nel repo.
// v5 (2026-09-02): campi `data_nascita`/`data_anniversario` (date, opzionali) — richiesta
//   Andrea dopo ricerca su CRM di settore (SevenRooms/OpenTable/Resy trattano le "occasioni
//   speciali" come dato di base del profilo cliente). `upsert` ora li accetta e salva;
//   `buildClientList` (azione list) li espone per entrambi i rami (cliente con storico
//   prenotazioni + cliente puramente manuale) così clienti.html puo' calcolare le "prossime
//   ricorrenze" senza un'altra chiamata. `clientDetail` (azione detail) li espone gia' in
//   automatico via select("*") sulla tabella clienti, nessuna modifica li' necessaria.
// v4 (2026-09-02): `clientDetail` (azione detail) ora seleziona anche `source` e
//   `thankyou_sent_at` per ogni riga dello storico — richiesta Andrea: sapere dall'anagrafica
//   cliente (gestionale.html) se/quando la mail di ringraziamento post-visita (M4) e' partita
//   per ciascuna visita passata.
// v2 (1/9/2026): aggregazione del consenso marketing (per uso newsletter/campagne) — un
// cliente risulta consenziente se ALMENO UNA delle sue prenotazioni ha marketing_consent=true.
// v3 (1/9/2026): azione check_brevo — verifica REALE dell'iscrizione (non solo "richiesta
// inviata"), stesso pattern gia' usato da submit-reservation.startBrevoDoi: GET
// /v3/contacts/{email}, un contatto risulta iscritto CONFERMATO se listIds include la lista
// Newsletter (ID 2) — con Double Opt-in Brevo aggiunge il contatto alla lista SOLO dopo il
// click di conferma, quindi questo e' il controllo vero. Stessa BREVO_API_KEY gia' presente
// come secret su questo progetto (usata da submit-reservation). Chiamata solo su richiesta
// esplicita (bottone nella scheda cliente), mai in automatico su tutta la lista.

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
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") || "";
const BREVO_LIST_ID = 2;

async function verifyGithubToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        "Authorization": "token " + token,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "santamonica-clienti-crm",
      },
    });
    if (!r.ok) return false;
    const data = await r.json();
    return !!(data && data.permissions && data.permissions.push === true);
  } catch (_e) {
    return false;
  }
}

function json(payload: any, status = 200) {
  return new Response(JSON.stringify(payload), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Ultime 9 cifre del numero, stessa normalizzazione del matching pacchi No-show
// (formati storici incoerenti: +39..., 0039..., spazi, ecc.)
function normPhone(s: any): string {
  const digits = String(s || "").replace(/\D/g, "");
  return digits.length > 9 ? digits.slice(-9) : digits;
}

// Valida una data YYYY-MM-DD o stringa vuota/assente (opzionale). Ritorna null per "cancella",
// undefined per "non toccare", altrimenti la stringa validata.
function cleanOptionalDate(v: any): string | null | undefined {
  if (v === undefined) return undefined;
  const s = String(v || "").trim();
  if (!s) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return undefined; // formato non valido: ignora, non tocca
  return s;
}

async function checkBrevoSubscription(email: string): Promise<{ ok: boolean; found: boolean; subscribed: boolean; error?: string }> {
  if (!BREVO_API_KEY) return { ok: false, found: false, subscribed: false, error: "BREVO_API_KEY non configurata" };
  if (!email) return { ok: false, found: false, subscribed: false, error: "Email mancante" };
  try {
    const r = await fetch("https://api.brevo.com/v3/contacts/" + encodeURIComponent(email), {
      headers: { "api-key": BREVO_API_KEY, "accept": "application/json" },
    });
    if (r.status === 404) return { ok: true, found: false, subscribed: false };
    if (!r.ok) return { ok: false, found: false, subscribed: false, error: "Brevo HTTP " + r.status };
    const c = await r.json();
    const subscribed = Array.isArray(c?.listIds) && c.listIds.includes(BREVO_LIST_ID);
    return { ok: true, found: true, subscribed };
  } catch (e) {
    return { ok: false, found: false, subscribed: false, error: (e as Error).message };
  }
}

async function buildClientList() {
  const { data: res, error: eRes } = await supabase
    .from("reservations")
    .select("nome, email, telefono, data, orario, persone, intolleranze, occasione, note, status, arrivo_status, created_at, marketing_consent, marketing_consent_at, brevo_doi_requested_at")
    .order("data", { ascending: false });
  if (eRes) throw eRes;

  const { data: clienti, error: eCli } = await supabase.from("clienti").select("*");
  if (eCli) throw eCli;
  const clientiByPhone: Record<string, any> = {};
  (clienti || []).forEach((c: any) => {
    if (c.telefono_norm) clientiByPhone[c.telefono_norm] = c;
  });

  const groups: Record<string, any> = {};
  for (const r of (res || [])) {
    const key = normPhone(r.telefono);
    if (!key) continue; // prenotazioni senza telefono valido non aggregabili
    if (!groups[key]) {
      groups[key] = {
        telefono_norm: key, nome: r.nome, telefono: r.telefono, email: r.email,
        n_prenotazioni: 0, n_arrivato: 0, n_no_show: 0, n_annullate: 0,
        prima_prenotazione: r.data, ultima_prenotazione: r.data,
        occasioni: new Set<string>(), intolleranze_recenti: r.intolleranze || null,
        consenso_marketing: false, consenso_marketing_at: null, brevo_doi_requested_at: null,
      };
    }
    const g = groups[key];
    g.n_prenotazioni++;
    if (r.arrivo_status === "arrivato") g.n_arrivato++;
    if (r.arrivo_status === "no_show") g.n_no_show++;
    if (r.status === "cancelled" || r.status === "rejected") g.n_annullate++;
    if (r.occasione) g.occasioni.add(r.occasione);
    if (r.marketing_consent) {
      g.consenso_marketing = true;
      if (!g.consenso_marketing_at || r.marketing_consent_at > g.consenso_marketing_at) g.consenso_marketing_at = r.marketing_consent_at;
    }
    if (r.brevo_doi_requested_at && (!g.brevo_doi_requested_at || r.brevo_doi_requested_at > g.brevo_doi_requested_at)) g.brevo_doi_requested_at = r.brevo_doi_requested_at;
    if (r.data > g.ultima_prenotazione) { g.ultima_prenotazione = r.data; g.nome = r.nome; g.email = r.email; g.telefono = r.telefono; g.intolleranze_recenti = r.intolleranze || g.intolleranze_recenti; }
    if (r.data < g.prima_prenotazione) g.prima_prenotazione = r.data;
  }

  const list = Object.values(groups).map((g: any) => {
    const c = clientiByPhone[g.telefono_norm];
    return {
      id: c ? c.id : null,
      telefono_norm: g.telefono_norm,
      nome: (c && c.nome) || g.nome,
      telefono: g.telefono,
      email: (c && c.email) || g.email,
      n_prenotazioni: g.n_prenotazioni, n_arrivato: g.n_arrivato, n_no_show: g.n_no_show, n_annullate: g.n_annullate,
      prima_prenotazione: g.prima_prenotazione, ultima_prenotazione: g.ultima_prenotazione,
      occasioni: Array.from(g.occasioni), intolleranze_recenti: g.intolleranze_recenti,
      consenso_marketing: g.consenso_marketing, consenso_marketing_at: g.consenso_marketing_at,
      brevo_doi_requested_at: g.brevo_doi_requested_at,
      note: (c && c.note) || "", tags: (c && c.tags) || [], manuale: false,
      data_nascita: (c && c.data_nascita) || null, data_anniversario: (c && c.data_anniversario) || null,
    };
  });

  // Clienti manuali senza alcuna prenotazione collegata (telefono_norm nullo, o presente ma
  // senza corrispondenza tra le prenotazioni reali) — nessun consenso marketing possibile,
  // non sono mai passati dal form di prenotazione con quel checkbox.
  (clienti || []).forEach((c: any) => {
    const hasGroup = c.telefono_norm && groups[c.telefono_norm];
    if (!hasGroup) {
      list.push({
        id: c.id, telefono_norm: c.telefono_norm || null, nome: c.nome, telefono: c.telefono, email: c.email,
        n_prenotazioni: 0, n_arrivato: 0, n_no_show: 0, n_annullate: 0,
        prima_prenotazione: null, ultima_prenotazione: null,
        occasioni: [], intolleranze_recenti: null,
        consenso_marketing: false, consenso_marketing_at: null, brevo_doi_requested_at: null,
        note: c.note || "", tags: c.tags || [], manuale: true,
        data_nascita: c.data_nascita || null, data_anniversario: c.data_anniversario || null,
      });
    }
  });

  list.sort((a: any, b: any) => (b.ultima_prenotazione || "").localeCompare(a.ultima_prenotazione || ""));
  return list;
}

async function clientDetail(telefonoNorm: string) {
  const { data: res, error } = await supabase
    .from("reservations")
    .select("id, nome, email, telefono, data, orario, persone, intolleranze, occasione, note, status, arrivo_status, created_at, marketing_consent, source, thankyou_sent_at")
    .order("data", { ascending: false });
  if (error) throw error;
  const storia = (res || []).filter((r: any) => normPhone(r.telefono) === telefonoNorm);
  const { data: cliente } = await supabase.from("clienti").select("*").eq("telefono_norm", telefonoNorm).maybeSingle();
  return { storia, cliente: cliente || null };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "JSON non valido" }, 400); }

  const token = (body.github_token || "").trim();
  const authorized = await verifyGithubToken(token);
  if (!authorized) return json({ error: "Token GitHub non valido o senza permessi di scrittura sul repo." }, 401);

  const action = body.action;

  try {
    if (action === "list") {
      const list = await buildClientList();
      return json({ ok: true, clienti: list });

    } else if (action === "detail") {
      const telefonoNorm = normPhone(body.telefono_norm || body.telefono);
      if (!telefonoNorm) return json({ error: "Telefono mancante" }, 400);
      const detail = await clientDetail(telefonoNorm);
      return json({ ok: true, ...detail });

    } else if (action === "notes_for") {
      const raw = Array.isArray(body.telefoni) ? body.telefoni : [];
      const tels = Array.from(new Set(raw.map((t: any) => normPhone(t)).filter((t: string) => t.length >= 6))).slice(0, 200) as string[];
      const out: Record<string, any> = {};
      if (tels.length) {
        const { data, error } = await supabase
          .from("clienti")
          .select("telefono_norm, note, tags, data_nascita, data_anniversario")
          .in("telefono_norm", tels);
        if (error) throw error;
        for (const c of data || []) {
          out[c.telefono_norm] = { note: c.note || "", tags: c.tags || [], data_nascita: c.data_nascita || null, data_anniversario: c.data_anniversario || null };
        }
      }
      return json({ ok: true, clienti: out });

    } else if (action === "check_brevo") {
      const email = (body.email || "").trim().toLowerCase();
      const r = await checkBrevoSubscription(email);
      if (!r.ok) return json({ error: r.error || "Verifica Brevo fallita" }, 502);
      return json({ ok: true, found: r.found, subscribed: r.subscribed });

    } else if (action === "upsert") {
      // Crea/aggiorna l'arricchimento (nome override, note, tag, ricorrenze) per un cliente
      // identificato per telefono, oppure crea un cliente puramente manuale.
      const telefono = (body.telefono || "").trim();
      const telefonoNorm = telefono ? normPhone(telefono) : null;
      const nome = (body.nome || "").trim() || null;
      const email = (body.email || "").trim() || null;
      const note = (body.note || "").trim() || null;
      const tags = Array.isArray(body.tags) ? body.tags.map((t: any) => String(t).trim()).filter(Boolean) : [];
      const manuale = !!body.manuale;
      const dataNascita = cleanOptionalDate(body.data_nascita);
      const dataAnniversario = cleanOptionalDate(body.data_anniversario);

      if (body.id) {
        const update: Record<string, unknown> = {
          nome, telefono: telefono || null, email, note, tags, updated_at: new Date().toISOString(),
        };
        if (dataNascita !== undefined) update.data_nascita = dataNascita;
        if (dataAnniversario !== undefined) update.data_anniversario = dataAnniversario;
        const { error } = await supabase.from("clienti").update(update).eq("id", body.id);
        if (error) throw error;
      } else if (telefonoNorm) {
        const row: Record<string, unknown> = { telefono_norm: telefonoNorm, nome, telefono, email, note, tags, manuale };
        if (dataNascita !== undefined) row.data_nascita = dataNascita;
        if (dataAnniversario !== undefined) row.data_anniversario = dataAnniversario;
        const { error } = await supabase.from("clienti").upsert(row, { onConflict: "telefono_norm" });
        if (error) throw error;
      } else {
        if (!nome) return json({ error: "Nome obbligatorio per un cliente manuale senza telefono" }, 400);
        const row: Record<string, unknown> = { telefono_norm: null, nome, telefono: null, email, note, tags, manuale: true };
        if (dataNascita !== undefined) row.data_nascita = dataNascita;
        if (dataAnniversario !== undefined) row.data_anniversario = dataAnniversario;
        const { error } = await supabase.from("clienti").insert(row);
        if (error) throw error;
      }
      const list = await buildClientList();
      return json({ ok: true, clienti: list });

    } else if (action === "delete") {
      const id = (body.id || "").trim();
      if (!id) return json({ error: "ID mancante" }, 400);
      const { error } = await supabase.from("clienti").delete().eq("id", id);
      if (error) throw error;
      const list = await buildClientList();
      return json({ ok: true, clienti: list });

    } else {
      return json({ error: "Azione non riconosciuta" }, 400);
    }
  } catch (err) {
    console.error("clienti-crm error:", err);
    return json({ error: "Errore interno" }, 500);
  }
});
