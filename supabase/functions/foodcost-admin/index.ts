// foodcost-admin — CRUD + calcoli protetti (auth via token GitHub) per il modulo
// "Food Cost giornaliero" di menu-admin: spese/incassi giornalieri per reparto,
// inventario fisico di periodo, schede costo piatto (agganciate a piatti_dettagli),
// vendite di periodo, tracciabilità carichi pesce/materie prime, e i 3 calcoli del
// template Excel di riferimento (Food Cost Reale, Teorico vs Reale/GAP, Menu
// Engineering STAR/PLOWHORSE/PUZZLE/DOG).
// Stesso schema di sicurezza di piatti-dettagli-admin/rubrica-professionisti: sia
// lettura sia scrittura richiedono github_token con permesso push sul repo SantaWeb.
// v1 (2026-09-11) — prima versione. v2 (2026-09-13) — "periodo" mensile fisso
// sostituito da un intervallo libero "da/a" su richiesta di Andrea (vedi
// rangeValido/calcolaRange/shiftRangeIndietro); fc_inventario_periodi e
// fc_vendite_periodo agganciati a (data_da, data_a) invece che a "periodo"
// (tabelle vuote alla migrazione, nessuna conversione dati necessaria).
// v3 (2026-09-13, stessa giornata) — aggiunta la parte Beverage, speculare al
// Food: fc_reparti ha ora una colonna "tipo" ('food'|'beverage', default
// 'food' per non toccare i 7 reparti già creati da Andrea); fc_incassi_
// giornalieri idem + chiave unica (data, tipo) invece di (data). Le spese e
// l'inventario ereditano il tipo dal reparto collegato (nessuna colonna
// duplicata). Il Beverage ha solo un calcolo "Reale" (spese+inventario vs
// incasso) — niente "Teorico"/Menu Engineering, perché non esiste un costo
// per bottiglia/drink in piatti_dettagli (fuori scope per ora). calcolaRange
// ritorna anche i totali combinati food+beverage (incasso_totale, cost_pct_
// combinato, incidenza_beverage_pct).
// v4 (2026-09-13, stessa giornata) — fc_inventario_periodi (iniziale+finale
// insieme su una riga per range "da/a", costringeva a ridigitare lo stesso
// conteggio due volte tra periodi consecutivi — bug di design segnalato da
// Andrea) sostituita da fc_inventario_conteggi: un solo valore per (data,
// reparto_id). L'iniziale di un periodo [da,a] è il conteggio alla data
// "da", il finale è il conteggio alla data "a+1" — che coincide con
// l'iniziale del periodo successivo se questo parte il giorno dopo "a"
// (nessuna doppia digitazione, nessun rischio di disallineamento). Azione
// inventario_upsert (su tutta la riga periodo) sostituita da
// inventario_conteggio_upsert (un valore, una data, un reparto). Tabella
// fc_inventario_periodi vuota alla migrazione, nessuna conversione dati.
// v5 (2026-09-13, stessa giornata) — segnalato da Andrea: un reparto mai contato
// (nessuna riga in fc_inventario_conteggi per quella data) veniva trattato come
// "inventario zero", indistinguibile da un vero zero — il Food/Beverage Cost
// Reale risultava quindi silenziosamente falsato senza alcun avviso. Aggiunto
// inventario_iniziale_mancante/inventario_finale_mancante per reparto e i flag
// aggregati inventario_incompleto / inventario_incompleto_beverage, usati dal
// frontend per mostrare un badge di avviso sulle KPI derivate da inventario.
// v6 (2026-09-13, stessa giornata) — richiesto da Andrea: segnalare in anticipo,
// senza dover prima scegliere un range e vedere il badge "incompleto", quali
// periodi hanno GIA' sia il conteggio iniziale sia quello finale per TUTTI i
// reparti del tipo (food o beverage) — cioè quali periodi sono "chiusi" e
// quindi affidabili per il Food/Beverage Cost Reale. Nuova azione
// inventario_periodi_disponibili: elenca le date con conteggio completo (ogni
// reparto attivo del tipo ha una riga in fc_inventario_conteggi per quella
// data) e le coppie di date consecutive come periodi pronti (da/a, con
// a = data_successiva - 1 giorno, coerente con la convenzione finale=a+1).
// v7 (2026-09-13, stessa giornata) — richiesto da Andrea, che prevede una cadenza di
// conteggio irregolare (non a scadenza fissa): 1) nuova azione inventario_conteggio_data
// per leggere/scrivere il conteggio di UNA data (non più legato a un range "Dal/Al" —
// il frontend passa così da "iniziale+finale della stessa schermata" a un conteggio
// puntuale, che è poi il gesto fisico reale); 2) inventario_periodi_disponibili ora
// ritorna anche date_dettaglio (ogni data con almeno un conteggio, con quanti reparti
// su quanti totali sono stati contati) per una vista "calendario/heatmap" dei buchi,
// non solo l'elenco dei periodi già chiusi.
// v8 (2026-09-16) — nuovo sotto-modulo Tracciabilità: al carico di una fornitura
// (soprattutto pesce/crostacei) un unico inserimento (una riga per prodotto di
// fattura) popola sia fc_spese_giornaliere sia fc_tracciabilita_prodotti, generando
// per ogni riga un codice progressivo univoco "NN-MMAA" (progressivo mensile-MMAA,
// come da procedura cartacea in uso) e calcolando la data di scadenza dai giorni
// configurati per categoria (es. "Pesce abbattuto" = 30gg), editabile a mano.
// L'anagrafica fornitori resta quella di Cantina (tabelle cantina_* nello stesso
// progetto Supabase) — qui arriva solo come testo libero scelto dal frontend
// (nessuna FK cross-tabella), letta dal frontend via cantina-anagrafiche (GET
// pubblico).
// v9 (2026-09-18) — nuova azione incassi_bulk_upsert per l'import massivo di Incassi
// dal foglio Excel "Budget" (uno per mese, aggiornato giorno per giorno dall'utente):
// il frontend legge il file con SheetJS, individua le colonne FOOD/BEVERG (disponibili
// da ottobre 2026 in poi al posto delle vecchie FT/POS), scorpora l'IVA al 10% e manda
// qui un array di righe {data, tipo, importo} già pronte per l'upsert. Nessuna lettura
// di file lato edge function: il parsing xlsx resta tutto client-side.
// v10 (2026-09-25) — richiesto da Andrea: poter far ripartire la numerazione del
// codice tracciabilità (NN-MMAA) da un valore diverso da 1 per un mese/anno
// specifico — utile per non sovrapporsi a codici già assegnati a mano su carta
// prima di passare al sistema digitale. Nuova tabella singleton
// fc_tracciabilita_config (anno, mese, numero_iniziale) + nuove azioni
// tracciabilita_config_get/tracciabilita_config_set. nextProgressivoMese ora
// applica questo valore come "floor": se la config è impostata per lo stesso
// anno/mese del carico, il progressivo assegnato è il massimo tra (ultimo
// progressivo già usato + 1) e (numero_iniziale configurato) — così un valore
// già superato dall'uso reale non fa mai tornare indietro la numerazione, e la
// config resta innocua per qualunque altro mese/anno. UI: nuovo pulsante
// "Apri anagrafica fornitori" (link a cantina.html?tab=anagrafiche&ent=fornitori,
// deep-link aggiunto in quel file) + campo numerazione nel tab Food Cost
// rinominato da "Reparti" a "Setup" (solo etichetta, id/azioni interni invariati).
// v11 (2026-09-26) — richiesto da Andrea: modifica di una riga di tracciabilità già
// inserita. Nuova azione tracciabilita_update: tutti i campi modificabili tranne il
// codice NN-MMAA (rif_interno/progressivo/mese/anno restano fissi — il codice può
// già essere su etichette/registro cartaceo); per coerenza la data di ricezione può
// cambiare solo dentro lo stesso mese/anno del codice. La spesa collegata
// (spesa_id) viene riallineata nello stesso colpo: data, reparto, importo
// (peso × prezzo, stessa formula del carico) e note. Compensazione applicativa come
// in tracciabilita_carico_create: se l'aggiornamento della riga di tracciabilità
// fallisce dopo quello della spesa, la spesa viene riportata ai valori precedenti.
// Note della spesa ora costruite da noteSpesaCarico (condivisa tra create e update).
// v12 (2026-09-26, stessa giornata) — richiesto da Andrea: le spese nate da Tracciabilità
// non si modificano dal tab Spese (si modificano solo da Tracciabilità, dove
// tracciabilita_update le riallinea). spese_list include ora la riga di tracciabilità
// collegata (fc_tracciabilita_prodotti(id, rif_interno), relazione inversa via
// spesa_id), così il frontend sa quali spese mostrare in sola lettura; spese_update
// rifiuta con 409 una spesa collegata (blocco anche lato server, non solo in UI).
// Riferimento di progettazione: DESIGN_foodcost-giornaliero_v2026.09.11.01.md
// (progetto-sito).

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

async function verifyGithubToken(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}`, {
      headers: {
        "Authorization": "token " + token,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "santamonica-foodcost-admin",
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

function s(v: any): string | null {
  const t = String(v == null ? "" : v).trim();
  return t || null;
}

function n(v: any): number {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

function isDate(v: any): boolean {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

// Intervallo libero "da/a" (sostituisce il vecchio "periodo" mensile fisso, v2 2026-09-13).
function rangeValido(da: any, a: any): { da: string; a: string } | null {
  if (!isDate(da) || !isDate(a)) return null;
  if (a < da) return null;
  return { da: String(da), a: String(a) };
}

function addGiorni(iso: string, delta: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

function lunghezzaGiorni(da: string, a: string): number {
  const dDa = new Date(da + "T00:00:00Z").getTime();
  const dA = new Date(a + "T00:00:00Z").getTime();
  return Math.round((dA - dDa) / 86400000) + 1;
}

// Intervallo precedente di pari durata (per il trend dashboard, "N blocchi indietro"):
// ogni blocco termina il giorno prima dell'inizio del precedente e ha la stessa
// lunghezza in giorni di (da, a). blocchi=0 ritorna (da, a) invariato.
function shiftRangeIndietro(da: string, a: string, blocchi: number): { da: string; a: string } {
  if (blocchi <= 0) return { da, a };
  const len = lunghezzaGiorni(da, a);
  let curDa = da, curA = a;
  for (let i = 0; i < blocchi; i++) {
    const nuovaA = addGiorni(curDa, -1);
    const nuovaDa = addGiorni(nuovaA, -(len - 1));
    curDa = nuovaDa; curA = nuovaA;
  }
  return { da: curDa, a: curA };
}

// ---------- Reparti ----------

async function repartiList() {
  const { data, error } = await supabase.from("fc_reparti").select("*").order("ordine", { ascending: true });
  if (error) throw error;
  return data || [];
}

async function nextOrdineReparti(): Promise<number> {
  const { data, error } = await supabase.from("fc_reparti").select("ordine").order("ordine", { ascending: false }).limit(1);
  if (error) throw error;
  return data && data.length ? data[0].ordine + 10 : 10;
}

// ---------- Tracciabilità carichi (v8, 2026-09-16) ----------
// Un "carico" = una fattura del fornitore, una riga per prodotto. Ogni riga genera
// un codice progressivo "NN-MMAA" (progressivo mensile che riparte da 01 a ogni
// mese solare + mese/anno di ricezione a 2 cifre, stessa convenzione della
// procedura cartacea già in uso) e popola in un solo inserimento sia
// fc_spese_giornaliere (per il Food Cost) sia fc_tracciabilita_prodotti (per la
// rintracciabilità). Cancellare una riga di tracciabilità cancella anche la spesa
// collegata (fc_tracciabilita_prodotti.spesa_id → fc_spese_giornaliere.id ON DELETE
// CASCADE): si cancella sempre la spesa, che trascina con sé la riga tracciabilità.

async function categorieTracciabilitaList() {
  const { data, error } = await supabase.from("fc_categorie_tracciabilita").select("*").order("ordine", { ascending: true });
  if (error) throw error;
  return data || [];
}

async function nextOrdineCategorieTracciabilita(): Promise<number> {
  const { data, error } = await supabase.from("fc_categorie_tracciabilita").select("ordine").order("ordine", { ascending: false }).limit(1);
  if (error) throw error;
  return data && data.length ? data[0].ordine + 10 : 10;
}

function pad2(x: number): string {
  return String(x).padStart(2, "0");
}

// Note della spesa generata da una riga di tracciabilità (v11: condivisa tra
// tracciabilita_carico_create e tracciabilita_update, stesso formato di prima).
function noteSpesaCarico(numero_fattura: string | null, prodotto: string, lotto: string | null, fornitore_nome: string | null): string {
  const noteParti = ["Carico " + (numero_fattura || "s/n") + " — " + prodotto];
  if (lotto) noteParti.push("lotto " + lotto);
  if (fornitore_nome) noteParti.push(fornitore_nome);
  return noteParti.join(" · ");
}

// Peso/prezzo facoltativi: stringa vuota/null → null (non 0).
function numOpt(v: any): number | null {
  return v === undefined || v === null || v === "" ? null : n(v);
}

// ---------- Tracciabilità: config numerazione (v10, 2026-09-25) ----------
// Singleton (id=1): se anno/mese coincidono col carico in corso, numero_iniziale
// fa da "floor" al progressivo assegnato — vedi nextProgressivoMese.

async function tracciabilitaConfigGet() {
  const { data, error } = await supabase.from("fc_tracciabilita_config").select("anno, mese, numero_iniziale, updated_at").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data || { anno: null, mese: null, numero_iniziale: null, updated_at: null };
}

// Codice "NN-MMAA": NN = progressivo del mese/anno di ricezione (riparte da 01 ogni
// mese), MM = mese a 2 cifre, AA = ultime 2 cifre dell'anno. Il progressivo massimo
// già assegnato per quel mese/anno viene letto una volta per l'intero carico e poi
// incrementato in memoria riga per riga (righe di uno stesso carico condividono di
// norma la stessa data di ricezione): in caso di due carichi inseriti nello stesso
// istante l'indice unico (anno, mese, progressivo) in DB fa comunque fallire un
// eventuale duplicato, invece di generare due righe con lo stesso codice.
// v10: se fc_tracciabilita_config ha un valore impostato per questo stesso anno/mese,
// il progressivo non scende mai sotto quel valore (floor) — utile per continuare da
// dove si era arrivati a mano su carta, senza rischiare di tornare indietro rispetto
// a righe già inserite digitalmente in questo mese.
async function nextProgressivoMese(anno: number, mese: number): Promise<number> {
  const [maxRes, cfg] = await Promise.all([
    supabase
      .from("fc_tracciabilita_prodotti")
      .select("progressivo")
      .eq("anno", anno).eq("mese", mese)
      .order("progressivo", { ascending: false })
      .limit(1),
    tracciabilitaConfigGet(),
  ]);
  if (maxRes.error) throw maxRes.error;
  const daUltimo = maxRes.data && maxRes.data.length ? maxRes.data[0].progressivo + 1 : 1;
  const floor = (cfg.anno === anno && cfg.mese === mese && cfg.numero_iniziale) ? Math.round(cfg.numero_iniziale) : 1;
  return Math.max(daUltimo, floor);
}

// ---------- Calcolo aggregato di un periodo (riusato da dashboard e trend) ----------

async function calcolaRange(da: string, a: string) {
  const dataFinale = addGiorni(a, 1); // conteggio "a fine periodo" = conteggio al giorno dopo "a"
  const [repartiRes, speseRes, incassiRes, invRes, costiRes, venditeRes] = await Promise.all([
    supabase.from("fc_reparti").select("*").eq("attivo", true).order("ordine", { ascending: true }),
    supabase.from("fc_spese_giornaliere").select("reparto_id, importo").gte("data", da).lte("data", a),
    supabase.from("fc_incassi_giornalieri").select("importo, tipo").gte("data", da).lte("data", a),
    supabase.from("fc_inventario_conteggi").select("data, reparto_id, valore").in("data", [da, dataFinale]),
    supabase.from("fc_piatti_costo").select("*, piatti_dettagli(piatto, sezione)").eq("attivo", true),
    supabase.from("fc_vendite_periodo").select("piatto_costo_id, quantita_venduta").eq("data_da", da).eq("data_a", a),
  ]);
  for (const r of [repartiRes, speseRes, incassiRes, invRes, costiRes, venditeRes]) {
    if (r.error) throw r.error;
  }

  const repartiTutti = repartiRes.data || [];
  const reparti = repartiTutti.filter((r: any) => r.tipo !== "beverage");
  const repartiBev = repartiTutti.filter((r: any) => r.tipo === "beverage");

  const speseByReparto = new Map<string, number>();
  for (const row of speseRes.data || []) {
    speseByReparto.set(row.reparto_id, (speseByReparto.get(row.reparto_id) || 0) + n(row.importo));
  }
  const totaleSpese = reparti.reduce((a: number, r: any) => a + (speseByReparto.get(r.id) || 0), 0);
  const totaleSpeseBev = repartiBev.reduce((a: number, r: any) => a + (speseByReparto.get(r.id) || 0), 0);
  const totaleIncassi = (incassiRes.data || []).filter((r: any) => r.tipo !== "beverage").reduce((a: number, r: any) => a + n(r.importo), 0);
  const totaleIncassiBev = (incassiRes.data || []).filter((r: any) => r.tipo === "beverage").reduce((a: number, r: any) => a + n(r.importo), 0);

  // Conteggio inventario per data (v4, 2026-09-13): l'inventario "iniziale" di un
  // periodo è il conteggio fisico alla data "da", il "finale" è il conteggio alla
  // data "a + 1 giorno" — così il finale di un periodo È lo stesso conteggio
  // dell'iniziale del periodo successivo, quando i due periodi sono consecutivi
  // (niente doppia digitazione, niente rischio di disallineamento — vedi commento
  // di Andrea su questo punto).
  const inizialeByReparto = new Map<string, number>();
  const finaleByReparto = new Map<string, number>();
  for (const row of invRes.data || []) {
    if (row.data === da) inizialeByReparto.set(row.reparto_id, n(row.valore));
    else if (row.data === dataFinale) finaleByReparto.set(row.reparto_id, n(row.valore));
  }
  const totaleInvIniziale = reparti.reduce((a: number, r: any) => a + (inizialeByReparto.get(r.id) || 0), 0);
  const totaleInvFinale = reparti.reduce((a: number, r: any) => a + (finaleByReparto.get(r.id) || 0), 0);
  const totaleInvInizialeBev = repartiBev.reduce((a: number, r: any) => a + (inizialeByReparto.get(r.id) || 0), 0);
  const totaleInvFinaleBev = repartiBev.reduce((a: number, r: any) => a + (finaleByReparto.get(r.id) || 0), 0);

  // Distingue "conteggio mancante" da "conteggio a zero" (segnalato da Andrea: senza
  // questo, un reparto mai contato appariva identico a uno con inventario zero, e il
  // Food/Beverage Cost Reale risultava silenziosamente falsato senza alcun avviso).
  function dettaglioReparti(lista: any[]) {
    return lista.map((r: any) => {
      const inizialeMancante = !inizialeByReparto.has(r.id);
      const finaleMancante = !finaleByReparto.has(r.id);
      const iniziale = inizialeByReparto.get(r.id) || 0;
      const finale = finaleByReparto.get(r.id) || 0;
      const speseR = speseByReparto.get(r.id) || 0;
      return {
        reparto_id: r.id, nome: r.nome,
        inventario_iniziale: iniziale, inventario_finale: finale,
        inventario_iniziale_mancante: inizialeMancante,
        inventario_finale_mancante: finaleMancante,
        spese_periodo: speseR,
        consumi: iniziale + speseR - finale,
      };
    });
  }
  const repartiDettaglio = dettaglioReparti(reparti);
  const repartiDettaglioBev = dettaglioReparti(repartiBev);
  const inventarioIncompleto = repartiDettaglio.some((r) => r.inventario_iniziale_mancante || r.inventario_finale_mancante);
  const inventarioIncompletoBev = repartiDettaglioBev.some((r) => r.inventario_iniziale_mancante || r.inventario_finale_mancante);

  const costoMateriePrimeConsumate = totaleInvIniziale + totaleSpese - totaleInvFinale;
  const foodCostRealePct = totaleIncassi > 0 ? costoMateriePrimeConsumate / totaleIncassi : 0;

  const costoMateriePrimeConsumateBev = totaleInvInizialeBev + totaleSpeseBev - totaleInvFinaleBev;
  const beverageCostRealePct = totaleIncassiBev > 0 ? costoMateriePrimeConsumateBev / totaleIncassiBev : 0;

  const incassoTotale = totaleIncassi + totaleIncassiBev;
  const costoTotaleCombinato = costoMateriePrimeConsumate + costoMateriePrimeConsumateBev;
  const costPctCombinato = incassoTotale > 0 ? costoTotaleCombinato / incassoTotale : 0;
  const incidenzaBeveragePct = incassoTotale > 0 ? totaleIncassiBev / incassoTotale : 0;

  const venditeByPiatto = new Map<string, number>();
  for (const row of venditeRes.data || []) {
    venditeByPiatto.set(row.piatto_costo_id, n(row.quantita_venduta));
  }
  const piatti = (costiRes.data || []).map((c: any) => {
    const qty = venditeByPiatto.get(c.id) || 0;
    const costo = n(c.costo_piatto), prezzo = n(c.prezzo_vendita);
    return {
      piatto_costo_id: c.id,
      nome: c.piatti_dettagli ? c.piatti_dettagli.piatto : "(piatto rimosso)",
      sezione: c.piatti_dettagli ? c.piatti_dettagli.sezione : null,
      qty_venduta: qty, costo_piatto: costo, prezzo_vendita: prezzo,
      margine_unitario: prezzo - costo,
      costo_teorico: qty * costo,
      ricavo: qty * prezzo,
      margine_totale: qty * (prezzo - costo),
    };
  });

  const costoTeoricoTotale = piatti.reduce((a, p) => a + p.costo_teorico, 0);
  const foodCostTeoricoPct = totaleIncassi > 0 ? costoTeoricoTotale / totaleIncassi : 0;
  const gapPct = foodCostRealePct - foodCostTeoricoPct;

  const qtyTot = piatti.reduce((a, p) => a + p.qty_venduta, 0);
  const sogliaPopolarita = piatti.length ? piatti.reduce((a, p) => a + p.qty_venduta, 0) / piatti.length : 0;
  const sogliaMargine = piatti.length ? piatti.reduce((a, p) => a + p.margine_unitario, 0) / piatti.length : 0;
  const menuEngineering = piatti.map((p) => {
    const altaPop = p.qty_venduta >= sogliaPopolarita;
    const altoMargine = p.margine_unitario >= sogliaMargine;
    const classificazione = altaPop && altoMargine ? "STAR" : altaPop && !altoMargine ? "PLOWHORSE" : !altaPop && altoMargine ? "PUZZLE" : "DOG";
    return {
      ...p,
      mix_pct: qtyTot > 0 ? p.qty_venduta / qtyTot : 0,
      classificazione,
    };
  });

  return {
    da, a,
    reparti: repartiDettaglio,
    totale_spese: totaleSpese,
    totale_incassi: totaleIncassi,
    totale_inventario_iniziale: totaleInvIniziale,
    totale_inventario_finale: totaleInvFinale,
    costo_materie_prime_consumate: costoMateriePrimeConsumate,
    food_cost_reale_pct: foodCostRealePct,
    costo_teorico_totale: costoTeoricoTotale,
    food_cost_teorico_pct: foodCostTeoricoPct,
    gap_pct: gapPct,
    inventario_incompleto: inventarioIncompleto,
    menu_engineering: menuEngineering,
    soglia_popolarita: sogliaPopolarita,
    soglia_margine: sogliaMargine,
    reparti_beverage: repartiDettaglioBev,
    totale_spese_beverage: totaleSpeseBev,
    totale_incassi_beverage: totaleIncassiBev,
    totale_inventario_iniziale_beverage: totaleInvInizialeBev,
    totale_inventario_finale_beverage: totaleInvFinaleBev,
    costo_materie_prime_consumate_beverage: costoMateriePrimeConsumateBev,
    beverage_cost_reale_pct: beverageCostRealePct,
    incasso_totale: incassoTotale,
    costo_totale_combinato: costoTotaleCombinato,
    cost_pct_combinato: costPctCombinato,
    incidenza_beverage_pct: incidenzaBeveragePct,
    inventario_incompleto_beverage: inventarioIncompletoBev,
  };
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
    // ---- Reparti ----
    if (action === "reparti_list") {
      return json({ ok: true, reparti: await repartiList() });

    } else if (action === "reparti_create") {
      const nome = s(body.nome);
      const tipo = body.tipo === "beverage" ? "beverage" : "food";
      if (!nome) return json({ error: "Nome reparto obbligatorio" }, 400);
      const { error } = await supabase.from("fc_reparti").insert({ nome, tipo, ordine: await nextOrdineReparti(), attivo: true });
      if (error) throw error;
      return json({ ok: true, reparti: await repartiList() });

    } else if (action === "reparti_update") {
      const id = s(body.id);
      if (!id) return json({ error: "ID mancante" }, 400);
      const patch: any = {};
      if (body.nome !== undefined) {
        const nome = s(body.nome);
        if (!nome) return json({ error: "Nome reparto obbligatorio" }, 400);
        patch.nome = nome;
      }
      if (body.ordine !== undefined) patch.ordine = n(body.ordine);
      if (body.attivo !== undefined) patch.attivo = !!body.attivo;
      if (body.tipo !== undefined) patch.tipo = body.tipo === "beverage" ? "beverage" : "food";
      const { error } = await supabase.from("fc_reparti").update(patch).eq("id", id);
      if (error) throw error;
      return json({ ok: true, reparti: await repartiList() });

    // ---- Tracciabilità: categorie/giorni scadenza ----
    } else if (action === "tracciabilita_categorie_list") {
      return json({ ok: true, categorie: await categorieTracciabilitaList() });

    } else if (action === "tracciabilita_categorie_create") {
      const nome = s(body.nome);
      const giorni_scadenza = Math.round(n(body.giorni_scadenza));
      if (!nome) return json({ error: "Nome categoria obbligatorio" }, 400);
      if (giorni_scadenza <= 0) return json({ error: "Giorni scadenza non validi" }, 400);
      const { error } = await supabase.from("fc_categorie_tracciabilita")
        .insert({ nome, giorni_scadenza, ordine: await nextOrdineCategorieTracciabilita(), attivo: true });
      if (error) throw error;
      return json({ ok: true, categorie: await categorieTracciabilitaList() });

    } else if (action === "tracciabilita_categorie_update") {
      const id = s(body.id);
      if (!id) return json({ error: "ID mancante" }, 400);
      const patch: any = {};
      if (body.nome !== undefined) {
        const nome = s(body.nome);
        if (!nome) return json({ error: "Nome categoria obbligatorio" }, 400);
        patch.nome = nome;
      }
      if (body.giorni_scadenza !== undefined) {
        const gs = Math.round(n(body.giorni_scadenza));
        if (gs <= 0) return json({ error: "Giorni scadenza non validi" }, 400);
        patch.giorni_scadenza = gs;
      }
      if (body.attivo !== undefined) patch.attivo = !!body.attivo;
      const { error } = await supabase.from("fc_categorie_tracciabilita").update(patch).eq("id", id);
      if (error) throw error;
      return json({ ok: true, categorie: await categorieTracciabilitaList() });

    // ---- Tracciabilità: config numerazione (v10, 2026-09-25) ----
    } else if (action === "tracciabilita_config_get") {
      return json({ ok: true, config: await tracciabilitaConfigGet() });

    } else if (action === "tracciabilita_config_set") {
      const anno = Math.round(n(body.anno));
      const mese = Math.round(n(body.mese));
      const numero_iniziale = Math.round(n(body.numero_iniziale));
      if (anno < 2000 || anno > 2100) return json({ error: "Anno non valido" }, 400);
      if (mese < 1 || mese > 12) return json({ error: "Mese non valido" }, 400);
      if (numero_iniziale <= 0) return json({ error: "Numero iniziale non valido" }, 400);
      const { error } = await supabase.from("fc_tracciabilita_config")
        .upsert({ id: 1, anno, mese, numero_iniziale, updated_at: new Date().toISOString() }, { onConflict: "id" });
      if (error) throw error;
      return json({ ok: true, config: await tracciabilitaConfigGet() });

    // ---- Tracciabilità: elenco carichi ----
    } else if (action === "tracciabilita_list") {
      const r = rangeValido(body.da, body.a);
      if (!r) return json({ error: "Intervallo non valido" }, 400);
      const { data, error } = await supabase
        .from("fc_tracciabilita_prodotti")
        .select("*, fc_reparti(nome)")
        .gte("data_ricezione", r.da).lte("data_ricezione", r.a)
        .order("rif_interno", { ascending: false });
      if (error) throw error;
      return json({ ok: true, righe: data || [] });

    // ---- Tracciabilità: nuovo carico (1 fattura, N righe prodotto) ----
    // Un unico inserimento per riga di fattura popola fc_spese_giornaliere (Food
    // Cost) e fc_tracciabilita_prodotti (rintracciabilità), collegate da spesa_id.
    // In caso di errore a metà carico, le righe già inserite in QUESTA chiamata
    // vengono rimosse (compensazione applicativa: niente transazione multi-tabella
    // nel client supabase-js) per non lasciare un carico a metà.
    } else if (action === "tracciabilita_carico_create") {
      const numero_fattura = s(body.numero_fattura);
      const fornitore_nome = s(body.fornitore_nome);
      const data_ricezione = s(body.data_ricezione);
      const reparto_id = s(body.reparto_id);
      const righeIn = Array.isArray(body.righe) ? body.righe : [];
      if (!isDate(data_ricezione)) return json({ error: "Data ricezione non valida" }, 400);
      if (!reparto_id) return json({ error: "Reparto obbligatorio" }, 400);
      if (!righeIn.length) return json({ error: "Nessuna riga da inserire" }, 400);

      const dataObj = new Date(data_ricezione + "T00:00:00Z");
      const anno = dataObj.getUTCFullYear();
      const mese = dataObj.getUTCMonth() + 1;
      let progressivo = await nextProgressivoMese(anno, mese);

      const categorie = await categorieTracciabilitaList();
      const categorieById = new Map(categorie.map((c: any) => [c.id, c]));

      const inseriteSpesa: string[] = [];
      const inseriteTracc: string[] = [];

      async function rollback() {
        if (inseriteTracc.length) await supabase.from("fc_tracciabilita_prodotti").delete().in("id", inseriteTracc);
        if (inseriteSpesa.length) await supabase.from("fc_spese_giornaliere").delete().in("id", inseriteSpesa);
      }

      try {
        for (const riga of righeIn) {
          const prodotto = s(riga.prodotto);
          if (!prodotto) throw new Error("Prodotto obbligatorio in ogni riga");
          const peso = numOpt(riga.peso);
          const prezzo_unitario = numOpt(riga.prezzo_unitario);
          if (peso != null && peso < 0) throw new Error(`Peso non valido per "${prodotto}"`);
          if (prezzo_unitario != null && prezzo_unitario < 0) throw new Error(`Prezzo non valido per "${prodotto}"`);
          const unita_misura = s(riga.unita_misura) || "kg";
          const lotto = s(riga.lotto);
          const categoria_id = s(riga.categoria_id);
          const categoria = categoria_id ? categorieById.get(categoria_id) : null;

          let data_scadenza = s(riga.data_scadenza);
          if (!data_scadenza && categoria) data_scadenza = addGiorni(data_ricezione, categoria.giorni_scadenza);
          if (data_scadenza && !isDate(data_scadenza)) throw new Error(`Data scadenza non valida per "${prodotto}"`);

          const importo = peso != null && prezzo_unitario != null ? Math.round(peso * prezzo_unitario * 100) / 100 : 0;

          const speseIns = await supabase.from("fc_spese_giornaliere").insert({
            data: data_ricezione, reparto_id, importo, note: noteSpesaCarico(numero_fattura, prodotto, lotto, fornitore_nome),
          }).select("id").single();
          if (speseIns.error) throw speseIns.error;
          inseriteSpesa.push(speseIns.data.id);

          const rif_interno = pad2(progressivo) + "-" + pad2(mese) + pad2(anno % 100);

          const traccIns = await supabase.from("fc_tracciabilita_prodotti").insert({
            rif_interno, progressivo, mese, anno,
            prodotto, categoria_id, categoria_nome: categoria ? categoria.nome : null,
            peso, unita_misura, prezzo_unitario,
            numero_fattura, lotto, fornitore_nome,
            reparto_id, spesa_id: speseIns.data.id,
            data_ricezione, data_scadenza, note: s(riga.note),
          }).select("id").single();
          if (traccIns.error) throw traccIns.error;
          inseriteTracc.push(traccIns.data.id);

          progressivo += 1;
        }
      } catch (errRiga) {
        await rollback();
        throw errRiga;
      }

      return json({ ok: true, inserite: inseriteTracc.length });

    // ---- Tracciabilità: modifica di una riga già inserita (v11, 2026-09-26) ----
    // Il codice NN-MMAA non cambia mai; la data di ricezione può spostarsi solo
    // dentro lo stesso mese/anno del codice. La spesa collegata viene riallineata
    // (data, reparto, importo = peso × prezzo, note) e, se poi fallisce
    // l'aggiornamento della riga di tracciabilità, riportata ai valori precedenti.
    } else if (action === "tracciabilita_update") {
      const id = s(body.id);
      if (!id) return json({ error: "ID mancante" }, 400);
      const curRes = await supabase.from("fc_tracciabilita_prodotti")
        .select("id, anno, mese, reparto_id, spesa_id").eq("id", id).maybeSingle();
      if (curRes.error) throw curRes.error;
      const cur = curRes.data;
      if (!cur) return json({ error: "Riga non trovata" }, 404);

      const prodotto = s(body.prodotto);
      if (!prodotto) return json({ error: "Prodotto obbligatorio" }, 400);
      const data_ricezione = s(body.data_ricezione);
      if (!isDate(data_ricezione)) return json({ error: "Data ricezione non valida" }, 400);
      const dataObj = new Date(data_ricezione + "T00:00:00Z");
      if (dataObj.getUTCFullYear() !== cur.anno || dataObj.getUTCMonth() + 1 !== cur.mese) {
        return json({ error: `La data di ricezione deve restare in ${pad2(cur.mese)}/${cur.anno}: il codice di tracciabilità non cambia.` }, 400);
      }
      const reparto_id = s(body.reparto_id) || cur.reparto_id;
      if (!reparto_id) return json({ error: "Reparto obbligatorio" }, 400);
      const peso = numOpt(body.peso);
      const prezzo_unitario = numOpt(body.prezzo_unitario);
      if (peso != null && peso < 0) return json({ error: "Peso non valido" }, 400);
      if (prezzo_unitario != null && prezzo_unitario < 0) return json({ error: "Prezzo non valido" }, 400);
      const unita_misura = s(body.unita_misura) || "kg";
      const lotto = s(body.lotto);
      const numero_fattura = s(body.numero_fattura);
      const fornitore_nome = s(body.fornitore_nome);
      const data_scadenza = s(body.data_scadenza);
      if (data_scadenza && !isDate(data_scadenza)) return json({ error: "Data scadenza non valida" }, 400);

      let spesaPrima: any = null;
      if (cur.spesa_id) {
        const prevRes = await supabase.from("fc_spese_giornaliere")
          .select("data, reparto_id, importo, note, updated_at").eq("id", cur.spesa_id).maybeSingle();
        if (prevRes.error) throw prevRes.error;
        spesaPrima = prevRes.data;
      }
      if (spesaPrima) {
        const importo = peso != null && prezzo_unitario != null ? Math.round(peso * prezzo_unitario * 100) / 100 : 0;
        const upSpesa = await supabase.from("fc_spese_giornaliere").update({
          data: data_ricezione, reparto_id, importo,
          note: noteSpesaCarico(numero_fattura, prodotto, lotto, fornitore_nome),
          updated_at: new Date().toISOString(),
        }).eq("id", cur.spesa_id);
        if (upSpesa.error) throw upSpesa.error;
      }

      const upTracc = await supabase.from("fc_tracciabilita_prodotti").update({
        prodotto, peso, unita_misura, prezzo_unitario,
        numero_fattura, lotto, fornitore_nome,
        reparto_id, data_ricezione, data_scadenza,
        updated_at: new Date().toISOString(),
      }).eq("id", id);
      if (upTracc.error) {
        if (spesaPrima) await supabase.from("fc_spese_giornaliere").update(spesaPrima).eq("id", cur.spesa_id);
        throw upTracc.error;
      }
      return json({ ok: true });

    } else if (action === "tracciabilita_delete") {
      const id = s(body.id);
      if (!id) return json({ error: "ID mancante" }, 400);
      const { data, error } = await supabase.from("fc_tracciabilita_prodotti").select("spesa_id").eq("id", id).single();
      if (error) throw error;
      if (data && data.spesa_id) {
        // Cancella la spesa collegata: fc_tracciabilita_prodotti.spesa_id ha ON DELETE
        // CASCADE, quindi la riga di tracciabilità viene rimossa di conseguenza.
        const del = await supabase.from("fc_spese_giornaliere").delete().eq("id", data.spesa_id);
        if (del.error) throw del.error;
      } else {
        const del = await supabase.from("fc_tracciabilita_prodotti").delete().eq("id", id);
        if (del.error) throw del.error;
      }
      return json({ ok: true });

    // ---- Spese giornaliere ----
    } else if (action === "spese_list") {
      const r = rangeValido(body.da, body.a);
      if (!r) return json({ error: "Intervallo non valido" }, 400);
      const tipo = body.tipo === "beverage" ? "beverage" : "food";
      const { data, error } = await supabase
        .from("fc_spese_giornaliere")
        .select("*, fc_reparti!inner(nome, tipo), fc_tracciabilita_prodotti(id, rif_interno)")
        .eq("fc_reparti.tipo", tipo)
        .gte("data", r.da).lte("data", r.a)
        .order("data", { ascending: false });
      if (error) throw error;
      return json({ ok: true, spese: data || [] });

    } else if (action === "spese_create" || action === "spese_update") {
      const id = s(body.id);
      const data_ = s(body.data);
      const reparto_id = s(body.reparto_id);
      const importo = n(body.importo);
      if (!isDate(data_)) return json({ error: "Data non valida" }, 400);
      if (!reparto_id) return json({ error: "Reparto obbligatorio" }, 400);
      if (importo < 0) return json({ error: "Importo non valido" }, 400);
      const row = { data: data_, reparto_id, importo, note: s(body.note), updated_at: new Date().toISOString() };
      if (action === "spese_create") {
        const { error } = await supabase.from("fc_spese_giornaliere").insert(row);
        if (error) throw error;
      } else {
        if (!id) return json({ error: "ID mancante" }, 400);
        // v12: una spesa generata da Tracciabilità si modifica solo da lì.
        const linkRes = await supabase.from("fc_tracciabilita_prodotti").select("rif_interno").eq("spesa_id", id).limit(1);
        if (linkRes.error) throw linkRes.error;
        if (linkRes.data && linkRes.data.length) {
          return json({ error: `Spesa collegata alla tracciabilità ${linkRes.data[0].rif_interno}: modificala dal tab Tracciabilità.` }, 409);
        }
        const { error } = await supabase.from("fc_spese_giornaliere").update(row).eq("id", id);
        if (error) throw error;
      }
      return json({ ok: true });

    } else if (action === "spese_delete") {
      const id = s(body.id);
      if (!id) return json({ error: "ID mancante" }, 400);
      const { error } = await supabase.from("fc_spese_giornaliere").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });

    // ---- Incassi giornalieri (un solo record per data+tipo: upsert) ----
    } else if (action === "incassi_list") {
      const r = rangeValido(body.da, body.a);
      if (!r) return json({ error: "Intervallo non valido" }, 400);
      const tipo = body.tipo === "beverage" ? "beverage" : "food";
      const { data, error } = await supabase
        .from("fc_incassi_giornalieri").select("*")
        .eq("tipo", tipo)
        .gte("data", r.da).lte("data", r.a)
        .order("data", { ascending: false });
      if (error) throw error;
      return json({ ok: true, incassi: data || [] });

    } else if (action === "incassi_upsert") {
      const data_ = s(body.data);
      const importo = n(body.importo);
      const tipo = body.tipo === "beverage" ? "beverage" : "food";
      if (!isDate(data_)) return json({ error: "Data non valida" }, 400);
      if (importo < 0) return json({ error: "Importo non valido" }, 400);
      const { error } = await supabase.from("fc_incassi_giornalieri")
        .upsert({ data: data_, tipo, importo, note: s(body.note), updated_at: new Date().toISOString() }, { onConflict: "data,tipo" });
      if (error) throw error;
      return json({ ok: true });

    } else if (action === "incassi_delete") {
      const id = s(body.id);
      if (!id) return json({ error: "ID mancante" }, 400);
      const { error } = await supabase.from("fc_incassi_giornalieri").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });

    // ---- Incassi: bulk upsert (v9, 2026-09-18) — import da Excel (Budget giornaliero),
    // una chiamata sola per N righe {data, tipo, importo} invece di N chiamate separate.
    // Lo scorporo IVA e il parsing del file avvengono lato frontend (JS); qui arrivano
    // già importi netti pronti per l'upsert, stessa validazione di incassi_upsert.
    } else if (action === "incassi_bulk_upsert") {
      const righe = Array.isArray(body.righe) ? body.righe : [];
      let inserite = 0;
      for (const riga of righe) {
        const data_ = s(riga.data);
        const tipo = riga.tipo === "beverage" ? "beverage" : "food";
        const importo = n(riga.importo);
        if (!isDate(data_) || importo < 0) continue;
        const { error } = await supabase.from("fc_incassi_giornalieri")
          .upsert({ data: data_, tipo, importo, note: s(riga.note), updated_at: new Date().toISOString() }, { onConflict: "data,tipo" });
        if (error) throw error;
        inserite++;
      }
      return json({ ok: true, inserite });

    // ---- Inventario: conteggio fisico per (data, reparto) — v4 2026-09-13.
    // Sostituisce il vecchio "inventario di periodo" (una riga per range "da/a" con
    // iniziale+finale insieme, che costringeva a ridigitare lo stesso conteggio due
    // volte tra periodi consecutivi). Ora: un solo valore per (data, reparto);
    // l'iniziale di un periodo [da,a] è il conteggio alla data "da", il finale è il
    // conteggio alla data "a+1" — che diventa automaticamente l'iniziale del periodo
    // successivo se questo inizia il giorno dopo "a" (nessuna doppia digitazione).
    } else if (action === "inventario_get") {
      const r = rangeValido(body.da, body.a);
      if (!r) return json({ error: "Intervallo non valido" }, 400);
      const tipo = body.tipo === "beverage" ? "beverage" : "food";
      const dataFinale = addGiorni(r.a, 1);
      const [repartiRes, invRes] = await Promise.all([
        supabase.from("fc_reparti").select("*").eq("attivo", true).eq("tipo", tipo).order("ordine", { ascending: true }),
        supabase.from("fc_inventario_conteggi").select("data, reparto_id, valore").in("data", [r.da, dataFinale]),
      ]);
      if (repartiRes.error) throw repartiRes.error;
      if (invRes.error) throw invRes.error;
      const inizialeByReparto = new Map<string, number>();
      const finaleByReparto = new Map<string, number>();
      for (const row of invRes.data || []) {
        if (row.data === r.da) inizialeByReparto.set(row.reparto_id, n(row.valore));
        else if (row.data === dataFinale) finaleByReparto.set(row.reparto_id, n(row.valore));
      }
      const righe = (repartiRes.data || []).map((row: any) => ({
        reparto_id: row.id, nome: row.nome,
        inventario_iniziale: inizialeByReparto.has(row.id) ? inizialeByReparto.get(row.id) : null,
        inventario_finale: finaleByReparto.has(row.id) ? finaleByReparto.get(row.id) : null,
      }));
      return json({ ok: true, da: r.da, a: r.a, righe });

    } else if (action === "inventario_conteggio_upsert") {
      const data_ = s(body.data);
      const reparto_id = s(body.reparto_id);
      const valore = n(body.valore);
      if (!isDate(data_)) return json({ error: "Data non valida" }, 400);
      if (!reparto_id) return json({ error: "Reparto obbligatorio" }, 400);
      if (valore < 0) return json({ error: "Valore non valido" }, 400);
      const { error } = await supabase.from("fc_inventario_conteggi")
        .upsert({ data: data_, reparto_id, valore, note: s(body.note), updated_at: new Date().toISOString() }, { onConflict: "data,reparto_id" });
      if (error) throw error;
      return json({ ok: true });

    // ---- Conteggio di UNA data (non un range) — v7 2026-09-13. Il tab Inventario del
    // frontend usa questa azione per l'inserimento: un conteggio è sempre puntuale
    // (un valore per reparto in una data), il range "da/a" serve solo alla Dashboard
    // per scegliere quali due conteggi confrontare.
    } else if (action === "inventario_conteggio_data") {
      const data_ = s(body.data);
      if (!isDate(data_)) return json({ error: "Data non valida" }, 400);
      const tipo = body.tipo === "beverage" ? "beverage" : "food";
      const [repartiRes, invRes] = await Promise.all([
        supabase.from("fc_reparti").select("*").eq("attivo", true).eq("tipo", tipo).order("ordine", { ascending: true }),
        supabase.from("fc_inventario_conteggi").select("reparto_id, valore").eq("data", data_),
      ]);
      if (repartiRes.error) throw repartiRes.error;
      if (invRes.error) throw invRes.error;
      const valoreByReparto = new Map<string, number>();
      for (const row of invRes.data || []) valoreByReparto.set(row.reparto_id, n(row.valore));
      const righe = (repartiRes.data || []).map((row: any) => ({
        reparto_id: row.id, nome: row.nome,
        valore: valoreByReparto.has(row.id) ? valoreByReparto.get(row.id) : null,
      }));
      return json({ ok: true, data: data_, righe });

    // ---- Periodi con inventario completo (iniziale+finale per tutti i reparti
    // del tipo) — v6 2026-09-13, per segnalare in anticipo quali periodi sono
    // "chiusi" e affidabili, senza dover prima tentare un range dalla dashboard.
    // v7: aggiunto date_dettaglio (ogni data con almeno un conteggio + copertura
    // reparti/totale) per la vista calendario/heatmap richiesta da Andrea, utile
    // con una cadenza di conteggio irregolare per individuare a colpo d'occhio i buchi.
    } else if (action === "inventario_periodi_disponibili") {
      const tipo = body.tipo === "beverage" ? "beverage" : "food";
      const repartiRes = await supabase.from("fc_reparti").select("id").eq("attivo", true).eq("tipo", tipo);
      if (repartiRes.error) throw repartiRes.error;
      const repartiIds = (repartiRes.data || []).map((r: any) => r.id);
      if (!repartiIds.length) return json({ ok: true, tipo, date_complete: [], periodi: [], date_dettaglio: [] });
      const conteggiRes = await supabase.from("fc_inventario_conteggi").select("data, reparto_id").in("reparto_id", repartiIds);
      if (conteggiRes.error) throw conteggiRes.error;
      const repartiPerData = new Map<string, Set<string>>();
      for (const row of conteggiRes.data || []) {
        if (!repartiPerData.has(row.data)) repartiPerData.set(row.data, new Set());
        repartiPerData.get(row.data)!.add(row.reparto_id);
      }
      const totaleReparti = repartiIds.length;
      const dateDettaglio = Array.from(repartiPerData.entries())
        .map(([data, set]) => ({ data, contati: set.size, totale: totaleReparti }))
        .sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));
      const dateComplete = dateDettaglio.filter((d) => d.contati === d.totale).map((d) => d.data);
      const periodi = [];
      for (let i = 0; i < dateComplete.length - 1; i++) {
        periodi.push({ da: dateComplete[i], a: addGiorni(dateComplete[i + 1], -1) });
      }
      return json({ ok: true, tipo, date_complete: dateComplete, periodi, date_dettaglio: dateDettaglio });

    // ---- Schede Costo Piatto (agganciate a piatti_dettagli) ----
    } else if (action === "piatti_costo_list") {
      const [pdRes, fcRes] = await Promise.all([
        supabase.from("piatti_dettagli").select("id, sezione, piatto, ordine").order("ordine", { ascending: true }),
        supabase.from("fc_piatti_costo").select("*"),
      ]);
      if (pdRes.error) throw pdRes.error;
      if (fcRes.error) throw fcRes.error;
      const byId = new Map((fcRes.data || []).map((r: any) => [r.piatto_id, r]));
      const righe = (pdRes.data || []).map((p: any) => {
        const c = byId.get(p.id);
        return {
          piatto_id: p.id, piatto: p.piatto, sezione: p.sezione,
          piatto_costo_id: c ? c.id : null,
          costo_piatto: c ? c.costo_piatto : null,
          prezzo_vendita: c ? c.prezzo_vendita : null,
          attivo: c ? c.attivo : true,
        };
      });
      return json({ ok: true, righe });

    } else if (action === "piatti_costo_upsert") {
      const piatto_id = s(body.piatto_id);
      if (!piatto_id) return json({ error: "Piatto obbligatorio" }, 400);
      const costo_piatto = n(body.costo_piatto);
      const prezzo_vendita = n(body.prezzo_vendita);
      if (costo_piatto < 0 || prezzo_vendita < 0) return json({ error: "Valori non validi" }, 400);
      const { error } = await supabase.from("fc_piatti_costo")
        .upsert({
          piatto_id, costo_piatto, prezzo_vendita,
          attivo: body.attivo === undefined ? true : !!body.attivo,
          updated_at: new Date().toISOString(),
        }, { onConflict: "piatto_id" });
      if (error) throw error;
      return json({ ok: true });

    // ---- Vendite di periodo (bulk, a fine mese) ----
    } else if (action === "vendite_get") {
      const r = rangeValido(body.da, body.a);
      if (!r) return json({ error: "Intervallo non valido" }, 400);
      const [costiRes, vendRes] = await Promise.all([
        supabase.from("fc_piatti_costo").select("*, piatti_dettagli(piatto, sezione)").eq("attivo", true),
        supabase.from("fc_vendite_periodo").select("*").eq("data_da", r.da).eq("data_a", r.a),
      ]);
      if (costiRes.error) throw costiRes.error;
      if (vendRes.error) throw vendRes.error;
      const byPiatto = new Map((vendRes.data || []).map((row: any) => [row.piatto_costo_id, row]));
      const righe = (costiRes.data || []).map((c: any) => {
        const v = byPiatto.get(c.id);
        return {
          piatto_costo_id: c.id,
          piatto: c.piatti_dettagli ? c.piatti_dettagli.piatto : "(piatto rimosso)",
          sezione: c.piatti_dettagli ? c.piatti_dettagli.sezione : null,
          costo_piatto: c.costo_piatto, prezzo_vendita: c.prezzo_vendita,
          quantita_venduta: v ? v.quantita_venduta : 0,
        };
      });
      return json({ ok: true, da: r.da, a: r.a, righe });

    } else if (action === "vendite_bulk_upsert") {
      const r = rangeValido(body.da, body.a);
      if (!r) return json({ error: "Intervallo non valido" }, 400);
      const righe = Array.isArray(body.righe) ? body.righe : [];
      for (const riga of righe) {
        const piatto_costo_id = s(riga.piatto_costo_id);
        if (!piatto_costo_id) continue;
        const { error } = await supabase.from("fc_vendite_periodo")
          .upsert({
            data_da: r.da, data_a: r.a, piatto_costo_id,
            quantita_venduta: Math.max(0, Math.round(n(riga.quantita_venduta))),
            updated_at: new Date().toISOString(),
          }, { onConflict: "data_da,data_a,piatto_costo_id" });
        if (error) throw error;
      }
      return json({ ok: true });

    // ---- Dashboard: i 3 calcoli + trend N intervalli precedenti (stessa durata) ----
    } else if (action === "dashboard") {
      const r = rangeValido(body.da, body.a);
      if (!r) return json({ error: "Intervallo non valido" }, 400);
      const corrente = await calcolaRange(r.da, r.a);
      const trend = [];
      for (let i = 5; i >= 0; i--) {
        const blocco = shiftRangeIndietro(r.da, r.a, i);
        const c = await calcolaRange(blocco.da, blocco.a);
        trend.push({ da: blocco.da, a: blocco.a, food_cost_reale_pct: c.food_cost_reale_pct, food_cost_teorico_pct: c.food_cost_teorico_pct });
      }
      return json({ ok: true, ...corrente, trend });

    } else {
      return json({ error: "Azione non riconosciuta" }, 400);
    }
  } catch (err) {
    console.error("foodcost-admin error:", err);
    return json({ error: "Errore interno" }, 500);
  }
});
