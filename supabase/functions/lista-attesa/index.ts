// lista-attesa — lista d'attesa delle prenotazioni (v1, 2026-09-30, idea 10 approvata da Andrea).
//
// Azioni (POST, JSON):
//   - join (pubblica, dal wizard /prenota.html): iscrizione per data + servizio. Honeypot, limiti
//     anti-abuso (max 1 iscrizione attiva per telefono e data; max 5 iscrizioni al giorno per IP).
//   - list / set_stato (admin, menu-admin): richiedono github_token con permesso push su SantaWeb
//     (stesso schema di foodcost-admin e degli altri pannelli).
//   - tick (pg_cron ogni 15 min, job "waitlist-tick"): cerca le prenotazioni DISDETTE dopo l'ultimo
//     controllo (reservations.cancelled_at) per date da oggi in poi; se per quel giorno ci sono
//     persone in lista (stato 'attesa') manda UNA mail ad Andrea con la disdetta e l'elenco (nome,
//     telefono, persone, note) — lo sceglie lui chi chiamare (scelta di Andrea: niente mail
//     automatiche agli ospiti). Nessun segreto: l'azione è idempotente (avanza last_check) e al
//     massimo avvisa Andrea di disdette vere; non restituisce dati personali.
//     Pulizia GDPR: le iscrizioni con data passata da più di 30 giorni vengono cancellate.

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
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM = "Ristorante Santamonica <prenotazioni@santamonicagenova.it>";
const ADMIN_FALLBACK = "prenotazioni@santamonicagenova.it";
const TZ = "Europe/Rome";

function json(payload: any, status = 200) {
  return new Response(JSON.stringify(payload), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

function s(v: any, max = 500): string | null {
  const t = String(v == null ? "" : v).trim().slice(0, max);
  return t || null;
}

function isDate(v: any): boolean {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function todayInRome(): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

function formatDateItLong(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  const giorni = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  const mesi = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  return `${giorni[d.getDay()]} ${d.getDate()} ${mesi[d.getMonth()]}`;
}

function escapeHtml(t: string): string {
  return String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function servizioDaOrario(orario: string | null): "pranzo" | "cena" {
  const h = parseInt(String(orario || "20").split(":")[0], 10);
  return h < 17 ? "pranzo" : "cena";
}

async function sha256(t: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyGithubToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: { "Authorization": "token " + token, "Accept": "application/vnd.github.v3+json", "User-Agent": "santamonica-lista-attesa" },
    });
    if (!r.ok) return false;
    const data = await r.json();
    return !!(data && data.permissions && data.permissions.push === true);
  } catch (_e) {
    return false;
  }
}

async function sendMail(to: string, subject: string, html: string, text: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
    });
    return r.ok;
  } catch (_e) {
    return false;
  }
}

async function adminEmail(): Promise<string> {
  const { data } = await supabase.from("reservation_reminder_settings").select("digest_email").eq("id", 1).maybeSingle();
  return (data && data.digest_email) || ADMIN_FALLBACK;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "JSON non valido" }, 400); }
  const action = body.action;

  try {
    // ---- Iscrizione pubblica dal sito ----
    if (action === "join") {
      if (s(body._hp)) return json({ ok: true }); // honeypot: finto successo
      const data = s(body.data, 10);
      const servizio = body.servizio === "pranzo" ? "pranzo" : body.servizio === "cena" ? "cena" : null;
      const persone = Math.round(Number(body.persone));
      const nome = s(body.nome, 120), telefono = s(body.telefono, 40), email = s(body.email, 160);
      const orario = s(body.orario, 5), note = s(body.note, 500);
      const oggi = todayInRome();
      if (!isDate(data) || data! < oggi || data! > addDays(oggi, 190)) return json({ error: "Data non valida" }, 400);
      if (!servizio) return json({ error: "Scegli pranzo o cena" }, 400);
      if (!(persone >= 1 && persone <= 20)) return json({ error: "Numero di persone non valido" }, 400);
      if (!nome || !telefono || telefono.replace(/\D/g, "").length < 6) return json({ error: "Nome e telefono sono obbligatori" }, 400);
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Email non valida" }, 400);
      if (orario && !/^\d{2}:\d{2}$/.test(orario)) return json({ error: "Orario non valido" }, 400);

      const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
      const ipHash = ip ? await sha256("sm-wl|" + ip) : null;
      if (ipHash) {
        const { count } = await supabase.from("reservation_waitlist").select("id", { count: "exact", head: true })
          .eq("ip_hash", ipHash).gte("created_at", new Date(Date.now() - 86400000).toISOString());
        if ((count || 0) >= 5) return json({ error: "Troppe richieste: chiamaci al 010 5533155." }, 429);
      }
      const telNorm = telefono.replace(/\D/g, "");
      const { data: esistenti } = await supabase.from("reservation_waitlist").select("id, telefono")
        .eq("data", data).eq("servizio", servizio).eq("stato", "attesa");
      if ((esistenti || []).some((r: any) => String(r.telefono || "").replace(/\D/g, "") === telNorm)) {
        return json({ ok: true, gia_iscritto: true });
      }
      const { error } = await supabase.from("reservation_waitlist").insert({
        data, servizio, orario, persone, nome, telefono, email, note, ip_hash: ipHash,
      });
      if (error) throw error;
      return json({ ok: true });
    }

    // ---- Controllo disdette (pg_cron) ----
    if (action === "tick") {
      const oggi = todayInRome();
      // pulizia GDPR
      await supabase.from("reservation_waitlist").delete().lt("data", addDays(oggi, -30));
      const { data: st } = await supabase.from("reservation_waitlist_state").select("last_check").eq("id", 1).maybeSingle();
      const lastCheck = (st && st.last_check) || new Date().toISOString();
      const { data: disdette, error: dErr } = await supabase.from("reservations")
        .select("id, nome, data, orario, persone, cancelled_at")
        .eq("status", "cancelled").gt("cancelled_at", lastCheck).gte("data", oggi)
        .order("cancelled_at", { ascending: true });
      if (dErr) throw dErr;
      let nuovoCheck = lastCheck;
      let avvisi = 0;
      for (const d of disdette || []) {
        if (d.cancelled_at > nuovoCheck) nuovoCheck = d.cancelled_at;
        const servizio = servizioDaOrario(d.orario);
        const { data: lista } = await supabase.from("reservation_waitlist").select("*")
          .eq("data", d.data).eq("servizio", servizio).eq("stato", "attesa").order("created_at", { ascending: true });
        if (!lista || !lista.length) continue;
        const righeTxt = lista.map((w: any, i: number) => `${i + 1}. ${w.nome} — ${w.persone} pers. — tel ${w.telefono}${w.orario ? " — preferisce le " + w.orario : ""}${w.email ? " — " + w.email : ""}${w.note ? " — note: " + w.note : ""}`);
        const righeHtml = lista.map((w: any) => `<li style="margin:0 0 6px;"><strong>${escapeHtml(w.nome)}</strong> — ${w.persone} pers. — <a href="tel:${escapeHtml(w.telefono)}">${escapeHtml(w.telefono)}</a>${w.orario ? " — preferisce le " + escapeHtml(w.orario) : ""}${w.email ? " — " + escapeHtml(w.email) : ""}${w.note ? "<br><em>" + escapeHtml(w.note) + "</em>" : ""}</li>`).join("");
        const quando = `${formatDateItLong(d.data)} ${servizio === "pranzo" ? "a pranzo" : "a cena"}`;
        const subject = `Si è liberato un tavolo ${quando} — ${lista.length} in lista d'attesa`;
        const text = `Disdetta: ${d.nome || "cliente"}, ${d.persone} pers., ore ${d.orario} di ${formatDateItLong(d.data)}.\n\nIn lista d'attesa per ${quando} (in ordine di iscrizione):\n${righeTxt.join("\n")}\n\nDopo averli sentiti, aggiorna lo stato in menu-admin → Lista d'attesa.`;
        const html = `<div style="font-family:Georgia,serif;color:#2c2c2c;font-size:15px;line-height:1.5;"><p><strong>Disdetta:</strong> ${escapeHtml(d.nome || "cliente")}, ${d.persone} pers., ore ${escapeHtml(d.orario || "")} di ${formatDateItLong(d.data)}.</p><p>In lista d'attesa per <strong>${quando}</strong> (in ordine di iscrizione):</p><ol>${righeHtml}</ol><p style="color:#888;font-size:13px;">Dopo averli sentiti, aggiorna lo stato in menu-admin → Lista d'attesa.</p></div>`;
        const ok = await sendMail(await adminEmail(), subject, html, text);
        if (ok) {
          avvisi++;
          await supabase.from("reservation_waitlist").update({ notificato_at: new Date().toISOString() }).in("id", lista.map((w: any) => w.id));
        }
      }
      await supabase.from("reservation_waitlist_state").update({ last_check: nuovoCheck }).eq("id", 1);
      return json({ ok: true, disdette: (disdette || []).length, avvisi });
    }

    // ---- Admin ----
    const authorized = await verifyGithubToken(String(body.github_token || "").trim());
    if (!authorized) return json({ error: "Token GitHub non valido o senza permessi di scrittura sul repo." }, 401);

    if (action === "list") {
      const oggi = todayInRome();
      const { data, error } = await supabase.from("reservation_waitlist").select("*")
        .gte("data", addDays(oggi, -1)).order("data", { ascending: true }).order("created_at", { ascending: true });
      if (error) throw error;
      return json({ ok: true, righe: data || [] });
    }

    if (action === "set_stato") {
      const id = s(body.id, 60);
      const stato = ["attesa", "contattato", "prenotato", "annullato"].includes(body.stato) ? body.stato : null;
      if (!id || !stato) return json({ error: "Dati mancanti" }, 400);
      const { error } = await supabase.from("reservation_waitlist").update({ stato, stato_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: "Azione non riconosciuta" }, 400);
  } catch (err) {
    console.error("lista-attesa error:", err);
    return json({ error: "Errore interno" }, 500);
  }
});
