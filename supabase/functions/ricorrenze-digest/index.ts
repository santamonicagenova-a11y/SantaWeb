// ricorrenze-digest — promemoria settimanale di compleanni e anniversari degli ospiti
// (v1, 2026-09-30, idea 12 approvata da Andrea: "promemoria a me", nessun invio automatico agli
// ospiti).
//
// Chiamata dal job pg_cron "ricorrenze-digest" ogni lunedì mattina. Legge dall'anagrafica
// (`clienti.data_nascita` / `.data_anniversario`, compilate da gestionale.html e clienti.html) le
// ricorrenze che cadono nei prossimi 15 giorni (oggi compreso) e manda UNA mail ad Andrea
// (reservation_reminder_settings.digest_email, stessa casella del riepilogo reminder e della lista
// d'attesa) con nome, data, telefono, visite fatte e un'eventuale prenotazione già presente in quei
// giorni. Se non ci sono ricorrenze non parte nessuna mail.
// Nessun segreto: al massimo una mail ogni 6 giorni (ricorrenze_digest_state.last_sent), non
// restituisce dati personali. verify_jwt = false.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";
const FROM = "Ristorante Santamonica <prenotazioni@santamonicagenova.it>";
const ADMIN_FALLBACK = "prenotazioni@santamonicagenova.it";
const TZ = "Europe/Rome";
const GIORNI_AVANTI = 14; // oggi + 14 = 15 giorni
const GESTIONALE_URL = "https://santamonicagenova.it/clienti.html";

function json(payload: any, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { "Content-Type": "application/json" } });
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

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

// Prossima ricorrenza (>= oggi) di una data YYYY-MM-DD, in formato YYYY-MM-DD. Il 29/2 negli
// anni non bisestili cade il 28/2.
function prossimaRicorrenza(dataOrig: string, oggi: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataOrig || "")) return null;
  const [, mm, dd] = dataOrig.split("-");
  const anno = Number(oggi.slice(0, 4));
  for (const y of [anno, anno + 1]) {
    const giorno = mm === "02" && dd === "29" && !isLeap(y) ? "28" : dd;
    const cand = `${y}-${mm}-${giorno}`;
    if (cand >= oggi) return cand;
  }
  return null;
}

function normPhone(s: any): string {
  const digits = String(s || "").replace(/\D/g, "");
  return digits.length > 9 ? digits.slice(-9) : digits;
}

function formatDateIt(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const giorni = ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  const mesi = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
  return `${giorni[d.getDay()]} ${d.getDate()} ${mesi[d.getMonth()]}`;
}

function escapeHtml(t: string): string {
  return String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function adminEmail(): Promise<string> {
  const { data } = await supabase.from("reservation_reminder_settings").select("digest_email").eq("id", 1).maybeSingle();
  return (data && data.digest_email) || ADMIN_FALLBACK;
}

Deno.serve(async (_req) => {
  try {
    const oggi = todayInRome();
    const { data: st } = await supabase.from("ricorrenze_digest_state").select("last_sent").eq("id", 1).maybeSingle();
    if (st && st.last_sent && st.last_sent > addDays(oggi, -6)) return json({ ok: true, skipped: "già inviato questa settimana" });

    const fine = addDays(oggi, GIORNI_AVANTI);
    const { data: clienti, error } = await supabase
      .from("clienti")
      .select("telefono_norm, nome, telefono, email, tags, note, data_nascita, data_anniversario")
      .or("data_nascita.not.is.null,data_anniversario.not.is.null");
    if (error) throw error;

    type Voce = { quando: string; tipo: string; anni: number | null; c: any };
    const voci: Voce[] = [];
    for (const c of clienti || []) {
      for (const [campo, tipo] of [["data_nascita", "Compleanno"], ["data_anniversario", "Anniversario"]] as const) {
        const orig = c[campo];
        const quando = orig ? prossimaRicorrenza(orig, oggi) : null;
        if (!quando || quando > fine) continue;
        const annoOrig = Number(String(orig).slice(0, 4));
        const anni = tipo === "Anniversario" && annoOrig > 1900 ? Number(quando.slice(0, 4)) - annoOrig : null;
        voci.push({ quando, tipo, anni: anni && anni > 0 ? anni : null, c });
      }
    }

    await supabase.from("ricorrenze_digest_state").upsert({ id: 1, last_sent: oggi });
    if (!voci.length) return json({ ok: true, inviate: 0 });
    voci.sort((a, b) => a.quando.localeCompare(b.quando));

    // Visite fatte e prenotazioni già presenti nella finestra, per telefono normalizzato.
    const { data: res } = await supabase
      .from("reservations")
      .select("telefono, data, orario, persone, arrivo_status, status")
      .or(`arrivo_status.eq.arrivato,and(data.gte.${oggi},data.lte.${fine})`);
    const visite: Record<string, { n: number; ultima: string }> = {};
    const prenotate: Record<string, string> = {};
    for (const r of res || []) {
      const k = normPhone(r.telefono);
      if (k.length < 6) continue;
      if (r.arrivo_status === "arrivato") {
        visite[k] = visite[k] || { n: 0, ultima: "" };
        visite[k].n++;
        if (r.data > visite[k].ultima) visite[k].ultima = r.data;
      }
      if (r.data >= oggi && r.data <= fine && r.status !== "cancelled" && r.status !== "rejected" && !prenotate[k]) {
        prenotate[k] = `${formatDateIt(r.data)} alle ${r.orario}, ${r.persone} pers.`;
      }
    }

    const righeHtml: string[] = [];
    const righeTxt: string[] = [];
    for (const v of voci) {
      const c = v.c;
      const k = c.telefono_norm || "";
      const vis = visite[k];
      const etichetta = v.tipo + (v.anni ? ` (${v.anni}°)` : "");
      const visTxt = vis ? `${vis.n} ${vis.n === 1 ? "visita" : "visite"}, ultima il ${formatDateIt(vis.ultima)}` : "nessuna visita registrata";
      const pren = prenotate[k] ? `Ha già prenotato: ${prenotate[k]}` : "";
      const tags = Array.isArray(c.tags) && c.tags.length ? c.tags.join(", ") : "";
      righeHtml.push(`<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e0dcd0;vertical-align:top;white-space:nowrap;"><strong>${escapeHtml(formatDateIt(v.quando))}</strong><br><span style="color:#8a6d2f;font-size:13px;">${escapeHtml(etichetta)}</span></td>
        <td style="padding:10px 12px;border-bottom:1px solid #e0dcd0;vertical-align:top;">
          <strong>${escapeHtml(c.nome || "—")}</strong>
          ${c.telefono ? ` · <a href="tel:${escapeHtml(c.telefono)}" style="color:#0066cc;">${escapeHtml(c.telefono)}</a>` : ""}
          ${c.email ? ` · <a href="mailto:${escapeHtml(c.email)}" style="color:#0066cc;">${escapeHtml(c.email)}</a>` : ""}
          <div style="font-size:13px;color:#555;margin-top:3px;">${escapeHtml(visTxt)}${tags ? " · " + escapeHtml(tags) : ""}</div>
          ${c.note ? `<div style="font-size:13px;color:#555;font-style:italic;margin-top:3px;">${escapeHtml(c.note)}</div>` : ""}
          ${pren ? `<div style="font-size:13px;color:#2c6e49;margin-top:3px;">${escapeHtml(pren)}</div>` : ""}
        </td></tr>`);
      righeTxt.push(`- ${formatDateIt(v.quando)} — ${etichetta}: ${c.nome || "—"}${c.telefono ? " · " + c.telefono : ""}${c.email ? " · " + c.email : ""}\n  ${visTxt}${tags ? " · " + tags : ""}${c.note ? "\n  Note: " + c.note : ""}${pren ? "\n  " + pren : ""}`);
    }

    const subject = `🎂 Ricorrenze dei prossimi 15 giorni — ${voci.length} ${voci.length === 1 ? "ospite" : "ospiti"}`;
    const html = `<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:20px 0;background:#f0f0f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#2c2c2c;">
  <table role="presentation" width="700" align="center" cellspacing="0" cellpadding="0" border="0" style="max-width:700px;background:#fff;border:1px solid #d0d0d0;">
    <tr><td style="padding:20px 30px;background:#2c2c2c;color:#fff;">
      <h1 style="margin:0;font-size:19px;font-weight:600;">Compleanni e anniversari — prossimi 15 giorni</h1>
      <p style="margin:5px 0 0;font-size:13px;color:#c9a961;">Da ${escapeHtml(formatDateIt(oggi))} a ${escapeHtml(formatDateIt(fine))} · dall'anagrafica clienti</p>
    </td></tr>
    <tr><td style="padding:10px 18px 20px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size:14px;border-collapse:collapse;">${righeHtml.join("")}</table>
      <p style="margin:18px 12px 0;font-size:13px;color:#666;line-height:1.5;">Promemoria solo per te: nessuna mail parte da sola agli ospiti. Le date si modificano dall'anagrafica (👤 nel gestionale o <a href="${GESTIONALE_URL}" style="color:#0066cc;">clienti</a>).</p>
    </td></tr>
  </table>
</body></html>`;
    const text = `Compleanni e anniversari — prossimi 15 giorni (da ${formatDateIt(oggi)} a ${formatDateIt(fine)})\n\n${righeTxt.join("\n\n")}\n\nPromemoria solo per te: nessuna mail parte da sola agli ospiti.`;

    if (!RESEND_API_KEY) return json({ ok: false, error: "RESEND_API_KEY mancante" }, 500);
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [await adminEmail()], subject, html, text }),
    });
    if (!r.ok) {
      await supabase.from("ricorrenze_digest_state").upsert({ id: 1, last_sent: st?.last_sent ?? null });
      return json({ ok: false, error: "Invio mail fallito" }, 502);
    }
    return json({ ok: true, inviate: voci.length });
  } catch (err) {
    console.error("ricorrenze-digest error:", err);
    return json({ ok: false, error: "Errore interno" }, 500);
  }
});
