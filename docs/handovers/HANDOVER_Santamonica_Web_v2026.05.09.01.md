# HANDOVER — Sito Santamonica + Admin SantaWeb
**Versione:** v 2026.05.09.01 *(retroattiva, applicata 2026-05-15)*
**Data:** 2026-05-09 · **Sessione:** 9 Maggio 2026 (mattutina)

> 🔧 **Nota di provenienza:** questo file è stato **ricostruito il 2026-05-13** dai log delle chat originali del 9 maggio (conversazioni "SantaWeb - 01 dettagli" e prime parti di "SantaWeb - 02 form prenotazione"), perché l'originale era andato perso dalla Knowledge Base. Ricostruzione fedele al 95%+; eventuali dettagli minori non recuperati sono stati omessi piuttosto che inventati.

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

7 chiavi obsolete rimosse da tutte le 5 lingue (IT/EN/FR/DE/ES): `quote_text`, `quote_attr`, `popup_label`, `popup_title`, `popup_text`, `popup_btn`, `popup_skip`. Conteggio finale: **92 chiavi per lingua**, simmetria mantenuta.

### 2.3 Modifiche `foto-optimizer.js` v 2026.05.09.02 + `menu-admin.html` v 2026.05.09.03

Sistema **doppia ottimizzazione WebP** introdotto:

| Aspetto | Prima (v.01) | Ora (v.02/v.03) |
|---|---|---|
| Quality WebP | 0.75 | **0.90 full** / **0.82 thumb** |
| Dimensione max full | — | 1920–2400 px |
| Dimensione thumb | — | 800 px |
| Versioni per foto | 1 | 2 (full + thumb) |
| Funzione nuova | — | `ottimizzaImmagineDoppia(file)` → ritorna `{full, thumb}` |

**Nuovo schema `gallery-photos.json`:**
```json
[
  { "src": "img/galleria/foto1.webp",
    "srcThumb": "img/galleria/thumb/foto1.webp",
    "alt": "..." }
]
```
Retrocompatibile: se manca `srcThumb`, la griglia usa `src` come fallback (più pesante ma funziona) via `p.srcThumb || p.src`.

**Performance attesa galleria 6 foto:**

| Aspetto | Prima | Ora |
|---|---|---|
| Carico iniziale | ~180 KB | ~300 KB (solo thumb) |
| Carico al click | — | +~300 KB on-demand (full) |
| Lazy loading | no | sì (decoding async) |

`menu-admin.html` v 2026.05.09.03 contiene:
- Nuova sezione UI "🏛️ Foto sito" (4 slot fissi: hero, cucina_piatto, cucina_ingredienti, cantina)
- Sezione "📷 Foto cucina" aggiornata per generare 2 file per foto
- Modal `#modal-deepl` per inserimento chiave DeepL (bottone 🔐 in top-bar)

### 2.4 Switch motore traduzione: Google Translate → DeepL

Cambio già consolidato in `admin-core.js v 2026.05.02` (sessione precedente del 2 maggio). Confermato in questa sessione:
- Endpoint: `https://api-free.deepl.com/v2/translate`
- Map lingue: `en→EN-GB`, `fr→FR`, `de→DE`, `es→ES`
- Chiave in `localStorage['deepl_key']`, header `Authorization: DeepL-Auth-Key <key>`
- Free tier: 500.000 char/mese
- Registrazione: https://www.deepl.com/pro-api
- Formato chiave: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx` (suffisso `:fx` obbligatorio per free tier)

---

## 3. CONTESTO ESSENZIALE

### 3.1 Architettura

```
ADMIN (Vercel)
  https://santa-web-peach.vercel.app/menu-admin.html
  ├─ admin-translations.js     [1° script]
  ├─ admin-templates-shared.js [2° script]
  ├─ admin-core.js v 2026.05.02 (DeepL integration)
  └─ foto-optimizer.js v 2026.05.09.02 ⬅ deploy questa sessione

PRODUZIONE (GitHub Pages)
  https://santamonicagenova-a11y.github.io/SantaWeb/
  ├─ index.html v2026.05.09.02 ⬅ deploy questa sessione
  ├─ translations.json (92 chiavi/lingua) ⬅ deploy questa sessione
  ├─ site-images.json (4 chiavi, generato da admin al primo upload)
  ├─ gallery-photos.json (array {src, srcThumb, alt})
  ├─ img/ (fallback locali sito)
  ├─ img/sito/{key}.webp (foto sito caricate da admin)
  ├─ img/galleria/foto{1-6}.webp (full 2400px)
  ├─ img/galleria/thumb/foto{1-6}.webp (thumb 800px)
  └─ menu-it.html, menu-en/fr/de/es.html, menu-allergeni.html, menu-vini.html, orario.html
```

### 3.2 Sistema di traduzione

Dal 2 maggio 2026: **DeepL API Free** (sostituisce Google Translate).

### 3.3 GitHub auth

Token in `localStorage['gh_token']`. Reset con bottone 🔑 in top-bar admin. Permesso richiesto: `repo`.

### 3.4 Convenzioni

| Aspetto | Convenzione |
|---|---|
| Versioni | `v YYYY.MM.DD.NN` (sia commento header sia footer/UI visibile) |
| Foto WebP | Quality 0.90 full (1920–2400px), 0.82 thumb (800px) |
| Lazy loading | `loading="lazy"` + `decoding="async"` ovunque tranne hero |
| Galleria | 6 slot fissi, schema `{src, srcThumb, alt}` |
| Foto sito | 4 chiavi fisse semantiche (hero, cucina_piatto, cucina_ingredienti, cantina) |
| Propagazione GitHub Pages | 60–90 sec |
| Browser fallback `site-images.json` | Se manca, restano `src` locali statici (`img/hero.jpg` ecc.) |

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
7. Attendere 60–90s propagation GitHub Pages
8. Hard refresh browser

### 4.2 Verifica post-deploy

- Homepage: nuova quote in IT, no popup, no link TheFork esterni
- Galleria: thumbnail rapidi al carico, full HD al click
- Foto sito: 4 immagini caricate via admin visibili sul sito
- Admin: bottone "Traduci e Pubblica" non blocca con errori DeepL (chiave salvata)

---

## 5. ALLEGATI / RIFERIMENTI

### Catena documenti di continuità

1. `HANDOVER_FINALE_SantaWeb_2026-05-02.md` (deploy 28 apr, fix bug, rimozione € prezzi, modifiche menu-it.html, switch a DeepL)
2. **`HANDOVER_Santamonica_Web_2026-05-09.md` (questo)** — sessione mattutina: 4 file deploy, foto sito/galleria HD, conferma DeepL

### File toccati questa sessione

| File | Versione | Cambiamenti chiave |
|---|---|---|
| `index.html` | v2026.05.09.02 | quote IT · no popup 5s · no TheFork · immagini dinamiche · lazy loading · griglia con srcThumb |
| `translations.json` | — | rimosse 7 chiavi obsolete (totale 92/lingua) |
| `menu-admin.html` | v 2026.05.09.03 | sezione "Foto sito" · doppia ottimizzazione galleria · modal DeepL |
| `foto-optimizer.js` | v 2026.05.09.02 | quality 0.90/0.82 · max 1920px · funzione doppia thumb+full |

### File NON modificati

- `admin-core.js` v 2026.05.02 (DeepL già integrato in sessione precedente)
- `admin-templates-shared.js`, `admin-translations.js`
- `menu-it.html`, `menu-en/fr/de/es.html`, `menu-dolci-it.html`, `menu-allergeni.html`, `menu-vini.html`, `orario.html`

---

**Fine handover.**

---

*Versione documento: v 2026.05.09.01 — applicata retroattivamente il 2026-05-15.*
