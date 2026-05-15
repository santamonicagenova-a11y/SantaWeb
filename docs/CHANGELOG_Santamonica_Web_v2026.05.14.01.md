# CHANGELOG — Santamonica Web (sito pubblico + admin SantaWeb)
**Versione:** v 2026.05.14.01 *(retroattiva, applicata 2026-05-15)*
**Repo:** `github.com/santamonicagenova-a11y/SantaWeb`
**Produzione (sito):** https://santamonicagenova-a11y.github.io/SantaWeb/
**Admin:** https://santa-web-peach.vercel.app/menu-admin.html
**Metodo continuità:** vedi `METODO_Continuita_Progetti.md` v1.0
**Documento creato:** 2026-05-13 · **Ultimo aggiornamento:** 2026-05-14

---

## STATO CORRENTE

> Aggiornare ad **ogni sessione** sostituendo (non appendendo) le righe modificate.

### File admin (Vercel via repo GitHub)

| Componente | Versione | Ultimo aggiornamento | Note |
|---|---|---|---|
| `menu-admin.html` | v 2026.05.14.01 | 2026-05-14 | rimosso bottone 🔐 e modal #modal-deepl (chiave DeepL ora server-side via env var) |
| `admin-core.js` | v 2026.05.14.02 | 2026-05-14 | proxy DeepL via Vercel function · counter falliti · inversione menu.html/menu-it.html · helper SEO |
| `admin-templates-shared.js` | v 2026.05.14.02 | 2026-05-14 | `.piatto-desc` 70% + `.percorso-desc` nuova · `buildDegu` rende descrizione percorso |
| `admin-translations.js` | — (no versione) | < 2026-05-02 | 5 lingue IT/EN/FR/DE/ES |
| `admin-templates.js` | — (legacy) | — | ancora referenziato in `menu-admin.html` riga 175 — da rimuovere |
| `foto-optimizer.js` | v 2026.05.09.02 | 2026-05-09 | quality 0.90 full / 0.82 thumb · max 1920px · doppia uscita |
| **`api/translate.js`** | **v 2026.05.14.01 (NUOVO)** | 2026-05-14 | **Vercel Serverless Function: proxy DeepL (bypass CORS browser)** |

### File sito pubblico (GitHub Pages)

| Componente | Versione | Ultimo aggiornamento | Note |
|---|---|---|---|
| `index.html` | v2026.05.09.07 | 2026-05-09 | form `#prenota` unificato · footer grid · immagini dinamiche · lazy loading |
| `translations.json` | — (96 chiavi/lingua) | 2026-05-14 | link `cucina_btn_link`/`dolci_btn_link` ora puntano a `menu-<lang>.html` per EN/FR/DE/ES |
| `site-images.json` | — | generato da admin | 4 chiavi: hero, cucina_piatto, cucina_ingredienti, cantina |
| `gallery-photos.json` | — | generato da admin | array `{src, srcThumb, alt}`, 6 slot |
| **`menu.html`** | rigenerato 2026-05-14 | 2026-05-14 | **PUBBLICO**: IT, NO ctrl-bar, SEO completo (title, description, robots index, canonical, og:, ld+json) |
| **`menu-it.html`** | rigenerato 2026-05-14 | 2026-05-14 | **ADMIN/preview**: IT, CON ctrl-bar, noindex |
| `menu-en/fr/de/es.html` | rigenerati 2026-05-14 | 2026-05-14 | tradotti via proxy DeepL · index · canonical per lingua |
| `menu-allergeni.html` | — | < 2026-05-02 | sincronizzato dall'admin |
| `menu-vini.html` | — | < 2026-05-02 | rigenerato da PDF via admin |
| `menu-dolci-it.html` | — | < 2026-05-02 | gestito da admin |
| `orario.html` | — | < 2026-05-02 | foglio orario, stampa A4 |

### Setup esterno richiesto (una tantum)

| Servizio | Configurazione | Status |
|---|---|---|
| **Vercel env variable** | `DEEPL_KEY` = chiave DeepL Free formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx` | ✅ configurata 2026-05-14 |

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
| **Motore traduzione** | **DeepL via Vercel proxy** (`api/translate.js`); chiave in env var server-side |
| **menu.html** | IT pubblico, NO ctrl-bar, SEO index — linkato da index.html |
| **menu-it.html** | IT admin/preview, CON ctrl-bar, noindex — URL che l'admin rilegge |
| **menu-{lang}.html** | tradotti, index, canonical per lingua |
| GitHub auth admin | token `localStorage['gh_token']`, permesso `repo` |
| Propagazione GitHub Pages | 60-90 sec |
| Propagazione Vercel | 30-60 sec |

---

## STORICO SESSIONI

> Voci ordinate dal più recente al più vecchio. Appendere in cima a ogni sessione.

---

### 2026-05-14 — Proxy DeepL + fix link menu + inversione menu.html/menu-it.html + descrizioni piatti
**Versioni rilasciate:** `api/translate.js` v 2026.05.14.01 (NUOVO), `admin-core.js` v 2026.05.14.02, `admin-templates-shared.js` v 2026.05.14.02, `menu-admin.html` v 2026.05.14.01, `translations.json` (8 righe modificate)

**Sintesi (sessione corposa, 4 problemi risolti):**
- **Problema 1 (traduzioni parziali)**: causa root CORS — DeepL API non accetta chiamate da browser. Diagnosi confermata da test console utente. Soluzione: nuova Vercel Serverless Function `api/translate.js` come proxy, chiave DeepL spostata da `localStorage` a env var `DEEPL_KEY`. Aggiunto counter `falliti[]` con report dettagliato + confirm pre-pubblicazione in caso di errori.
- **Problema 2 (link menu lingua)**: in `translations.json` tutte le 5 lingue avevano `cucina_btn_link = "menu.html"`. Fix con 8 righe (EN/FR/DE/ES ora puntano a `menu-{lang}.html` e `menu-dolci-{lang}.html`).
- **Problema 3 (menu.html / menu-it.html invertiti)**: chiarito dall'utente, `menu.html` deve essere pubblico (no ctrl-bar, SEO), `menu-it.html` deve essere admin/preview (con ctrl-bar, noindex). Invertito `content` in `eseguiPubblicazione`. Aggiunti 3 helper SEO (`iniettaSeoITPubblico`, `iniettaNoIndexIT`, `iniettaSeoLingua`) per non perdere il SEO storico al primo deploy.
- **Problema 4 (descrizioni piatti)**: descrizione a capo, italic, 70% del parent, sia carta sia degustazione. CSS `.piatto-desc` aggiornata + nuova `.percorso-desc` + `buildDegu` ora renderizza descrizione percorso (prima la ignorava).

**Setup operativo aggiuntivo:** env variable `DEEPL_KEY` configurata su Vercel.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_2026-05-14.md`

---

### 2026-05-13 — Font +50% in stampa preview menù
**Versioni rilasciate:** `admin-templates-shared.js` v 2026.05.13.01

**Sintesi:**
- Aggiunta regola `html { font-size: 24px; }` nel blocco `@media print` del template `CARTA_TPL_B`
- Scala uniformemente del 50% tutti i testi della stampa (carta + orario) sfruttando i `rem` relativi al root
- Layout in `mm` invariato (l'A4 resta A4); preview a schermo inalterata
- Modifica circoscritta: NON tocca `_VINI_TPL`, `apriPreviewAllergeni`, né `apriPreviewDolci`
- Aggiunto header versione al file (prima era senza)

**Rischio chiuso:** verificato che il foglio orario non vada in overflow con +50% (test fatto nel deploy del 14-05).

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
- `menu-admin.html`: nuova sezione UI "🏛️ Foto sito" (4 slot fissi); sezione "📷 Foto cucina" genera 2 file/foto; modal `#modal-deepl` per inserimento chiave (in seguito rimosso il 14-05)
- Galleria a 6 foto: carico iniziale ~300 KB (solo thumb) + ~300 KB on-demand al click

> 🔧 L'handover di questa sessione è stato **ricostruito il 2026-05-13** dai log delle chat originali (fedeltà ~95%) perché l'originale era andato perso dalla KB.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_2026-05-09.md`

---

### 2026-05-02 — Deploy iniziale + bug fix + rimozione € + grafica menu-it
**Versioni rilasciate:** `admin-core.js` v 2026.04.26.01 (28 apr); `menu-it.html` v 2026.05.02; `admin-templates-shared.js` (no versione interna a questo punto)

**Sintesi:**
- Deploy completo admin SantaWeb (28 apr): risolti BUG 2 (defensive check su `percorsi` in `traduci()` e `traduciEPubblica()`) e BUG 4 (link QR mancanti nelle pagine tradotte, ora generati dinamicamente)
- Follow-up 1 mag: eliminati tutti i simboli € dai prezzi (admin-core.js label UI + admin-templates-shared.js template degustazione/orario + menu-it.html rigenerato)
- Follow-up 2 mag: aggiunta nota "menù disponibili fino alle 13:30/21:30"; rimosso `border-bottom` da `.sezione-titolo` (mantenuto su `.note-ospite`); fix virgolette tipografiche "Non formaggi" via escape Unicode
- Switch motore traduzione da Google Translate → **DeepL API Free direct** (chiave in `localStorage['deepl_key']`). **NB: questo approccio non ha mai funzionato per il blocco CORS — vedi sessione 2026-05-14 per la soluzione definitiva via proxy Vercel.**

**Handover dettagliato:** `HANDOVER_FINALE_SantaWeb_2026-05-02.md`

---

## LAVORI ARRETRATI / DECISIONI RIMANDATE

Item attivi attraverso più sessioni. Rimuovere quando completati.

- [ ] Valutare taglio lingue DE/ES (target reale: IT, francesi, nord-italiani)
- [ ] Pulire `gallery-photos.json` legacy o uniformare schema
- [ ] Eventuale ridimensionamento `img/galleria/` con file legacy non più referenziati
- [ ] Rimuovere `admin-templates.js` legacy da `menu-admin.html` riga 175
- [ ] Considerare ingrandimento font stampa anche su menu-vini e menu-allergeni
- [ ] SEO per lingue: description, og:, ld+json localizzati (oggi solo robots+canonical)

## ROADMAP

**Q2/Q3 2026:** consolidare traduzioni · eliminare `admin-templates.js` legacy · version history menu · dark mode admin
**Q3/Q4 2026:** mobile admin responsive · drag-drop sezioni · preview real-time · analytics

Per dettagli operativi e priorità vedi `ROADMAP_Santamonica_Web.md`.

---

## CATENA DOCUMENTI DI CONTINUITÀ (riepilogo)

1. `HANDOVER_FINALE_SantaWeb_2026-05-02.md` — deploy iniziale + bug fix + € rimossi + grafica menu
2. `HANDOVER_Santamonica_Web_2026-05-09.md` — 4 file deploy + foto sito/galleria + DeepL *(ricostruito)*
3. `HANDOVER_Santamonica_Web_2026-05-09_v2.md` — refactor form prenotazione + footer grid
4. `HANDOVER_Santamonica_Web_2026-05-13.md` — font +50% in stampa preview menù
5. **`HANDOVER_Santamonica_Web_2026-05-14.md`** — proxy DeepL Vercel + fix link menu + inversione menu.html/menu-it.html + descrizioni piatti

---

**Fine CHANGELOG. Aggiornare in cima ad ogni nuova sessione.**

---

*Versione documento: v 2026.05.14.01 — applicata retroattivamente il 2026-05-15.*
