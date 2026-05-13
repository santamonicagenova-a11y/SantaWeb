# HANDOVER — Sito Santamonica + Admin SantaWeb
**Data:** 2026-05-09 · **Sessione:** 9 Maggio 2026

---

## 1. STATO ATTUALE

Sessione conclusa con 4 file prodotti, pronti per il deploy. Stato del codice consolidato; manca solo l'esecuzione operativa lato utente (deploy + chiave DeepL + ricaricare foto).

| File prodotto | Versione | Destinazione | Status |
|---|---|---|---|
| `index.html` | **v2026.05.09.02** | GitHub Pages (root SantaWeb) | ✅ pronto |
| `translations.json` | — | GitHub Pages (root SantaWeb) | ✅ pronto |
| `menu-admin.html` | **v 2026.05.09.03** | Vercel | ✅ pronto |
| `foto-optimizer.js` | **v 2026.05.09.02** | Vercel (root admin) | ✅ pronto |

> ⚠️ `site-images.json` è stato generato come template ma **NON va deployato**: viene creato automaticamente dal form admin "🏛️ Foto sito" al primo upload.

---

## 2. DATI CHIAVE

### 2.1 Modifiche consolidate in `index.html` v2026.05.09.02

| # | Modifica | Dettaglio |
|---|---|---|
| 1 | Quote homepage | `"Be nice to people..."` → `"Un ristorante dovrebbe farti stare meglio di quando sei entrato. Tutto il resto viene dopo."` — rimosso `data-i18n` (non si traduce) |
| 2 | Popup 5s eliminato | Rimossi 31 righe: CSS `#booking-overlay/#booking-popup`, HTML overlay, JS setTimeout |
| 3 | TheFork rimosso | 3 link `widget.thefork.com` → `href="#prenota"` (sezione interna form occasioni speciali); rimosso `target="_blank"` |
| 4 | Immagini dinamiche | 4 `<img>` (hero / cucina_piatto / cucina_ingredienti / cantina) ora con `data-img-key="..."`; src locale `img/*.jpg` come fallback; script fetch `site-images.json` sovrascrive src+alt al runtime |
| 5 | Performance immagini | Galleria: griglia usa `srcThumb` (thumbnail 800px), lightbox usa `src` (full 2400px). `loading="lazy"` + `decoding="async"` ovunque tranne hero (eager+async) |

### 2.2 `translations.json`

7 chiavi obsolete rimosse da tutte le 5 lingue (IT/EN/FR/DE/ES): `quote_text`, `quote_attr`, `popup_label`, `popup_title`, `popup_text`, `popup_btn`, `popup_skip`. Conteggio finale: 92 chiavi per lingua, simmetria mantenuta.

### 2.3 `menu-admin.html` v 2026.05.09.03

Aggiunti rispetto allo stato precedente (v 2026.04.25.02):

- **Sezione "🏛️ Foto sito"** (voce dropdown + sezione `#foto-sito-section`): gestione 4 foto sito (hero, cucina_piatto, cucina_ingredienti, cantina). Upload `img/sito/{file}.webp` + merge in `site-images.json` (preserva chiavi non toccate).
- **Sezione "📷 Foto cucina" rifattorizzata**: ora genera **due versioni** per foto via `ottimizzaImmagineDoppia` → upload `img/galleria/foto{N}.webp` (full 2400px) + `img/galleria/thumb/foto{N}.webp` (thumb 800px). Schema `gallery-photos.json` esteso: `[{ src, srcThumb, alt }]`.
- **Modal `#modal-deepl`** + bottone **🔐 in top bar** (gemello al 🔑 GitHub): consente input/cambio chiave DeepL via UI invece del `prompt()` browser. Le funzioni `resetDeepLKey/confermaDeepLKey/chiudiModalDeepL` erano già definite in `admin-core.js v 2026.05.02` ma cercavano un markup mancante.

### 2.4 `foto-optimizer.js` v 2026.05.09.02 (riscritto)

Esposte su `window.*`:

| Funzione | Max width | Quality | Uso |
|---|---|---|---|
| `ottimizzaImmagine(d, cb)` | 1920px | 0.90 | Foto sito (hero/cucina/cantina) |
| `ottimizzaImmagineFullGalleria(d, cb)` | 2400px | 0.90 | Galleria full (lightbox) |
| `ottimizzaImmagineThumb(d, cb)` | 800px | 0.82 | Galleria thumb (griglia) |
| `ottimizzaImmagineDoppia(d, cb)` | — | — | Genera full+thumb in parallelo, callback `{full, thumb}` |

Cambiamento chiave vs versione precedente: quality 0.75 → 0.90, smoothing alta qualità in resize. Tutte le callback ricevono SOLO la parte base64 (senza prefisso `data:image/webp;base64,`).

### 2.5 Decisioni prese ma NON implementate (rimandate)

| Item | Stato |
|---|---|
| Form prenotazione standard in `#prenota` | Rimandato — sezione attualmente ha solo form occasioni speciali |
| Taglio lingue DE/ES | Rimandato — sito ancora multilingua a 5 |
| Download immagini Wix locali | Obsoleto — sostituito dalla gestione via form admin |

---

## 3. CONTESTO ESSENZIALE

### 3.1 Architettura

```
ADMIN (Vercel)
  https://santa-web-peach.vercel.app/menu-admin.html
  ├─ admin-translations.js    [1° script]
  ├─ admin-templates-shared.js [2° script]
  ├─ admin-core.js v 2026.05.02 (DeepL integration)
  └─ foto-optimizer.js v 2026.05.09.02

PRODUZIONE (GitHub Pages)
  https://santamonicagenova-a11y.github.io/SantaWeb/
  ├─ index.html (sito vetrina)
  ├─ translations.json (UI sito vetrina, 5 lingue, 92 chiavi/lingua)
  ├─ site-images.json (4 chiavi: hero/cucina_piatto/cucina_ingredienti/cantina)
  ├─ gallery-photos.json (array {src, srcThumb, alt})
  ├─ img/hero.jpg ecc. (fallback locali sito)
  ├─ img/sito/{key}.webp (foto sito caricate da admin)
  ├─ img/galleria/foto{1-6}.webp (full 2400px)
  ├─ img/galleria/thumb/foto{1-6}.webp (thumb 800px)
  └─ menu-it.html, menu-en/fr/de/es.html, menu-allergeni.html, menu-vini.html, orario.html
```

### 3.2 Sistema di traduzione

Dal 2 maggio 2026: **DeepL API Free** (sostituisce Google Translate).
- Endpoint: `https://api-free.deepl.com/v2/translate`
- Map lingue: `en→EN-GB, fr→FR, de→DE, es→ES`
- Chiave salvata in `localStorage['deepl_key']`, header `Authorization: DeepL-Auth-Key <key>`
- Free tier: 500.000 char/mese, registrazione su https://www.deepl.com/pro-api
- Formato chiave: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx` (il `:fx` finale identifica il free tier ed è obbligatorio)

### 3.3 GitHub auth

Token in `localStorage['gh_token']`. Reset con bottone 🔑 in top bar admin. Permesso richiesto: `repo`.

### 3.4 Convenzioni

| Aspetto | Convenzione |
|---|---|
| Versioni | `v YYYY.MM.DD.NN` (sia commento header sia footer/UI visibile) |
| Foto WebP | Quality 0.90 full (1920–2400px), 0.82 thumb (800px) |
| Lazy loading | `loading="lazy"` + `decoding="async"` ovunque tranne hero |
| Galleria | 6 slot fissi, schema `{src, srcThumb, alt}` |
| Foto sito | 4 chiavi fisse semantiche (hero, cucina_piatto, cucina_ingredienti, cantina) |
| Propagazione GitHub Pages | 60–90 sec |
| Browser fallback site-images.json | Se manca, restano `src` locali statici (`img/hero.jpg` ecc.) |

### 3.5 ⚠️ REGOLA OPERATIVA FISSA (memorizzata, valida per tutte le sessioni future)

**Ogni file consegnato per il deploy in repo deve avere la versione aggiornata** (formato `v YYYY.MM.DD.NN`, sia in header sia in footer/UI). **La nuova versione va comunicata esplicitamente all'utente quando si presenta il file.** Questa regola va riportata in ogni futuro documento di continuità/handover.

---

## 4. PROSSIMI PASSI (in ordine)

### 4.1 Deploy immediato

1. **Vercel** — caricare:
   - `menu-admin.html` v 2026.05.09.03
   - `foto-optimizer.js` v 2026.05.09.02
2. **DeepL** — registrazione free + API Key:
   - https://www.deepl.com/pro-api → registrati (basta email)
   - https://www.deepl.com/account/summary → tab "API Keys" → copia chiave (`...:fx`)
3. **Admin** — al click "Traduci e Pubblica" comparirà il modal `#modal-deepl`: incolla la chiave → resta in `localStorage` del browser
4. **Admin → "🏛️ Foto sito"** → carica le 4 foto HD (hero, cucina_piatto, cucina_ingredienti, cantina) → Pubblica
   → genera `img/sito/*.webp` + `site-images.json` su GitHub
5. **Admin → "📷 Foto cucina"** → ricarica le 6 foto galleria (per beneficiare del nuovo schema thumb+full HD a 90% quality)
   → genera `img/galleria/foto{N}.webp` + `img/galleria/thumb/foto{N}.webp` + nuovo `gallery-photos.json`
6. **GitHub** — caricare:
   - `index.html` v2026.05.09.02
   - `translations.json` (no versione interna)
7. Attendi 60–90s propagation → verifica sito

### 4.2 Verifiche post-deploy

| Verifica | Atteso |
|---|---|
| Quote homepage | "Un ristorante dovrebbe farti stare meglio..." |
| Popup 5s | Non compare |
| Click "Prenota" (3 punti: nav, mobile menu, hero) | Scroll a sezione `#prenota` |
| Hero/Cucina/Cantina visibili | Da `site-images.json`, non da Wix CDN |
| Galleria | Thumb in griglia (~50 KB cad.), full HD nel lightbox |
| Console F12 | No errori 404 sulle immagini, no riferimenti `wixstatic.com` |
| "Traduci e Pubblica" | Apre modal carino DeepL (non `prompt()` browser) |

### 4.3 Lavori arretrati / decisioni rimandate

- [ ] Form prenotazione standard in `#prenota` (oggi solo "occasioni speciali" → utente cliccando "Prenota" trova solo eventi)
- [ ] Valutare taglio lingue DE/ES (target reale: IT, francesi, nord-italiani)
- [ ] Pulire `gallery-photos.json` esistente o ricaricare tutte le 6 foto per uniformare a schema `{src, srcThumb, alt}`
- [ ] Eventuale ridimensionamento ulteriore della cartella `img/galleria/` con file legacy non più referenziati

### 4.4 Roadmap esistente (da HANDOVER 2026-05-02, non in discussione qui)

- Q2/Q3 2026: consolidare traduzioni, eliminare admin-templates.js legacy, version history menu, dark mode admin
- Q3/Q4 2026: mobile admin responsive, drag-drop sezioni, preview real-time, analytics

---

## 5. ALLEGATI / RIFERIMENTI

- **HANDOVER precedente:** `HANDOVER_FINALE_SantaWeb_2026-05-02.md` (deploy 28 apr, fix BUG 2/4, rimozione € da prezzi, modifiche grafiche menu-it.html)
- **Note di contesto:** `Note_Sito_Santamonica.md` (piano awareness Fase 3 — audit digitale)

### File toccati questa sessione

| File | Cambiamenti chiave |
|---|---|
| `index.html` | quote · popup · TheFork · img dinamiche · lazy/async · srcThumb |
| `translations.json` | -7 chiavi × 5 lingue |
| `menu-admin.html` | sezione Foto sito · galleria thumb+full · modal DeepL + 🔐 |
| `foto-optimizer.js` | riscritto: q=0.90, doppia esportazione |

### File NON modificati (intatti)

- `admin-core.js` v 2026.05.02 (DeepL integration già presente)
- `admin-templates-shared.js`
- `admin-translations.js` (dizionario menu carta)
- `menu-it.html`, `menu-en/fr/de/es.html`, `menu-allergeni.html`, `menu-vini.html`, `orario.html`
- `gallery-photos.json` esistente in produzione (serve ricarico foto via admin per allineare schema)

---

**Fine handover.**
