# CHANGELOG — Santamonica Web (sito pubblico + admin SantaWeb)
**Repo:** `github.com/santamonicagenova-a11y/SantaWeb`
**Produzione (sito):** https://santamonicagenova-a11y.github.io/SantaWeb/
**Admin:** https://santa-web-peach.vercel.app/menu-admin.html
**Metodo continuità:** vedi `METODO_Continuita_Progetti.md` v1.0
**Documento creato:** 2026-05-13 (retrospettivo a partire dalle 4 sessioni esistenti)

---

## STATO CORRENTE

> Aggiornare ad **ogni sessione** sostituendo (non appendendo) le righe modificate.

### File admin (Vercel via repo GitHub)

| Componente | Versione | Ultimo aggiornamento | Note |
|---|---|---|---|
| `menu-admin.html` | v 2026.05.09.03 | 2026-05-09 | sezione "🏛️ Foto sito" + doppia ottimizzazione galleria + modal DeepL |
| `admin-core.js` | v 2026.05.02 | 2026-05-02 | DeepL integrato (sostituisce Google Translate); BUG 2 + BUG 4 fixati |
| `admin-templates-shared.js` | v 2026.05.13.01 | 2026-05-13 | regola `html { font-size: 24px; }` in `@media print` del template carta |
| `admin-translations.js` | — (no versione) | < 2026-05-02 | 5 lingue IT/EN/FR/DE/ES |
| `admin-templates.js` | — (legacy) | — | ancora referenziato in `menu-admin.html` riga 175 — da rimuovere |
| `foto-optimizer.js` | v 2026.05.09.02 | 2026-05-09 | quality 0.90 full / 0.82 thumb · max 1920px · doppia uscita |

### File sito pubblico (GitHub Pages)

| Componente | Versione | Ultimo aggiornamento | Note |
|---|---|---|---|
| `index.html` | v2026.05.09.07 | 2026-05-09 | form `#prenota` unificato · footer grid · immagini dinamiche · lazy loading |
| `translations.json` | — (96 chiavi/lingua) | 2026-05-09 | nessun versionamento interno per convenzione |
| `site-images.json` | — | generato da admin | 4 chiavi: hero, cucina_piatto, cucina_ingredienti, cantina |
| `gallery-photos.json` | — | generato da admin | array `{src, srcThumb, alt}`, 6 slot |
| `menu-it.html` | v 2026.05.02 | 2026-05-02 | zero simboli € · nota orario · border sezioni rimosso |
| `menu-en/fr/de/es.html` | — (rigenerati) | 2026-05-02 | tradotti via DeepL dall'admin |
| `menu-allergeni.html` | — | < 2026-05-02 | sincronizzato dall'admin |
| `menu-vini.html` | — | < 2026-05-02 | rigenerato da PDF via admin |
| `menu-dolci-it.html` | — | < 2026-05-02 | gestito da admin |
| `orario.html` | — | < 2026-05-02 | foglio orario, stampa A4 |

### Stato deploy (da verificare al prossimo riallineamento)

- ⚠️ `index.html` v2026.05.09.07 + `translations.json` (96 chiavi): prodotti il 2026-05-09 v2 — **deploy GitHub Pages da confermare**
- ⚠️ `admin-templates-shared.js` v 2026.05.13.01: prodotto il 2026-05-13 — **push GitHub (auto-deploy Vercel) da confermare**

### Convenzioni progetto (riferimento rapido)

| Aspetto | Convenzione |
|---|---|
| Versioning file | `v YYYY.MM.DD.NN` (header + footer/UI visibile) |
| Foto WebP | quality 0.90 full (1920-2400px) / 0.82 thumb (800px) |
| Galleria | 6 slot, schema `{src, srcThumb, alt}` |
| Foto sito | 4 chiavi fisse: hero · cucina_piatto · cucina_ingredienti · cantina |
| Lazy loading | `loading="lazy"` + `decoding="async"` ovunque tranne hero |
| `<option value="">` | canonico in italiano (label tradotte via `data-i18n`) |
| Endpoint Formspree | `mkopjnvq` (discriminator `tipo` = standard\|speciale) |
| Motore traduzione | DeepL API Free (chiave `localStorage['deepl_key']`, formato `...:fx`) |
| GitHub auth admin | token `localStorage['gh_token']`, permesso `repo` |
| Propagazione GitHub Pages | 60-90 sec |
| Propagazione Vercel | 30-60 sec |

---

## STORICO SESSIONI

> Voci ordinate dal più recente al più vecchio. Appendere in cima a ogni sessione.

---

### 2026-05-13 — Font +50% in stampa preview menù
**Versioni rilasciate:** `admin-templates-shared.js` v 2026.05.13.01

**Sintesi:**
- Aggiunta regola `html { font-size: 24px; }` nel blocco `@media print` del template `CARTA_TPL_B`
- Scala uniformemente del 50% tutti i testi della stampa (carta + orario) sfruttando i `rem` relativi al root
- Layout in `mm` invariato (l'A4 resta A4); preview a schermo inalterata
- Modifica circoscritta: NON tocca `_VINI_TPL`, `apriPreviewAllergeni`, né `apriPreviewDolci`
- Aggiunto header versione al file (prima era senza)

**Rischio aperto:** il foglio orario denso a 2 colonne potrebbe traboccare in stampa con +50%; fallback documentati nell'handover (riduzione a 21px o 19px, oppure scaling selettivo solo su `.piatto`/`.percorso-piatto`).

**Handover dettagliato:** `HANDOVER_Santamonica_Web_2026-05-13.md`

---

### 2026-05-09 (sessione pomeridiana, v2) — Refactor form prenotazione + footer grid
**Versioni rilasciate:** `index.html` v2026.05.09.03 → v2026.05.09.07 (6 iterazioni nella stessa sessione); `translations.json` (92 → 96 chiavi/lingua)

**Sintesi:**
- Form `#prenota` rifatto da "occasioni speciali" a **unificato** (Opzione A: campo `occasione` opzionale, stesso endpoint Formspree con discriminator `tipo=standard|speciale`)
- Layout finale: Nome → Tel|Email (+ hint, almeno uno obbligatorio) → Data|Persone → Occasione → Intolleranze (required) → Richieste
- Asterisco rosso terracotta automatico via CSS `:has()` selector su qualunque `.pf-group` contenente `[required]`
- Esteso sistema i18n a `data-i18n-placeholder` (riusabile per qualunque placeholder futuro)
- Footer riscritto con `display: grid` 3 colonne (brand sx / social CENTRATI sulla pagina / copyright dx); mobile stack verticale
- `translations.json`: 7 chiavi modificate + 4 nuove × 5 lingue (`prenota_f_occ_standard`, `prenota_f_email`, `prenota_contatto_hint`, `prenota_f_intolleranze_ph`, `prenota_err_contatto`)

**Handover dettagliato:** `HANDOVER_Santamonica_Web_2026-05-09_v2.md`

---

### 2026-05-09 (sessione mattutina) — Deploy 4 file + foto sito/galleria HD + conferma DeepL
**Versioni rilasciate:** `index.html` v2026.05.09.02, `menu-admin.html` v 2026.05.09.03, `foto-optimizer.js` v 2026.05.09.02, `translations.json` (92 chiavi/lingua)

**Sintesi:**
- `index.html`: rimosso popup 5s (31 righe), rimossi 3 link TheFork esterni (→ ancora `#prenota` interno), nuova quote IT, 4 immagini con `data-img-key` + fetch `site-images.json`, galleria con `srcThumb` (griglia) + `src` (lightbox), lazy loading ovunque tranne hero
- `translations.json`: rimosse 7 chiavi obsolete relative a quote/popup (5 lingue, totale 92/lingua)
- `foto-optimizer.js`: introdotta `ottimizzaImmagineDoppia()` → quality 0.90 full (1920-2400px) + 0.82 thumb (800px)
- `menu-admin.html`: nuova sezione UI "🏛️ Foto sito" (4 slot fissi); sezione "📷 Foto cucina" genera 2 file/foto; modal `#modal-deepl` per inserimento chiave
- Galleria a 6 foto: carico iniziale ~300 KB (solo thumb) + ~300 KB on-demand al click

**Note operative chiuse:** chiave DeepL inserita dall'utente; foto sito + galleria HD ricaricate via admin; tutti i 4 file deployati.

> 🔧 L'handover di questa sessione è stato **ricostruito il 2026-05-13** dai log delle chat originali (fedeltà ~95%) perché l'originale era andato perso dalla KB.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_2026-05-09.md`

---

### 2026-05-02 — Deploy iniziale + bug fix + rimozione € + grafica menu-it
**Versioni rilasciate:** `admin-core.js` v 2026.04.26.01 (28 apr); `menu-it.html` v 2026.05.02; `admin-templates-shared.js` (no versione interna a questo punto)

**Sintesi:**
- Deploy completo admin SantaWeb (28 apr): risolti BUG 2 (defensive check su `percorsi` in `traduci()` e `traduciEPubblica()`) e BUG 4 (link QR mancanti nelle pagine tradotte, ora generati dinamicamente)
- Follow-up 1 mag: eliminati tutti i simboli € dai prezzi (admin-core.js label UI + admin-templates-shared.js template degustazione/orario + menu-it.html rigenerato)
- Follow-up 2 mag: aggiunta nota "menù disponibili fino alle 13:30/21:30"; rimosso `border-bottom` da `.sezione-titolo` (mantenuto su `.note-ospite`); fix virgolette tipografiche "Non formaggi" via escape Unicode
- Switch motore traduzione da Google Translate → DeepL API Free (chiave in `localStorage['deepl_key']`, formato `...:fx`)
- Regola operativa **da memorizzare**: quando si copiano HTML originali, attenzione a virgolette tipografiche → usare `\u201c` `\u201d` nei JSON inline

**Handover dettagliato:** `HANDOVER_FINALE_SantaWeb_2026-05-02.md`

---

## LAVORI ARRETRATI / DECISIONI RIMANDATE

Item attivi attraverso più sessioni. Rimuovere quando completati.

- [ ] Valutare taglio lingue DE/ES (target reale: IT, francesi, nord-italiani)
- [ ] Pulire `gallery-photos.json` legacy o uniformare schema
- [ ] Eventuale ridimensionamento `img/galleria/` con file legacy non più referenziati
- [ ] Rimuovere `admin-templates.js` legacy da `menu-admin.html` riga 175
- [ ] Verificare deploy effettivo di `index.html` v2026.05.09.07 + `translations.json` (96 chiavi) — prodotti il 09-05 v2 ma stato deploy non confermato in sessioni successive
- [ ] Verificare push di `admin-templates-shared.js` v 2026.05.13.01

## ROADMAP

**Q2/Q3 2026:** consolidare traduzioni · eliminare `admin-templates.js` legacy · version history menu · dark mode admin
**Q3/Q4 2026:** mobile admin responsive · drag-drop sezioni · preview real-time · analytics

---

## CATENA DOCUMENTI DI CONTINUITÀ (riepilogo)

1. `HANDOVER_FINALE_SantaWeb_2026-05-02.md` — deploy iniziale + bug fix + € rimossi + grafica menu
2. `HANDOVER_Santamonica_Web_2026-05-09.md` — 4 file deploy + foto sito/galleria + DeepL *(ricostruito)*
3. `HANDOVER_Santamonica_Web_2026-05-09_v2.md` — refactor form prenotazione + footer grid
4. `HANDOVER_Santamonica_Web_2026-05-13.md` — font +50% in stampa preview menù

---

**Fine CHANGELOG. Aggiornare in cima ad ogni nuova sessione.**
