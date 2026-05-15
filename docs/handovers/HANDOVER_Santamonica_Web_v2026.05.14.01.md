# HANDOVER — Sito Santamonica + Admin SantaWeb
**Versione:** v 2026.05.14.01 *(retroattiva, applicata 2026-05-15)*
**Data:** 2026-05-14 · **Continuazione di:** `HANDOVER_Santamonica_Web_2026-05-13.md`

---

## 1. STATO ATTUALE

Sessione corposa, divisa in **3 problemi risolti** affrontati in cascata. Tutti i file consegnati e deployati con successo, conferma operativa ricevuta dall'utente.

| File prodotto | Versione | Destinazione | Status |
|---|---|---|---|
| `api/translate.js` | **v 2026.05.14.01** | repo GitHub `api/` → auto-deploy Vercel Serverless | ✅ deployato |
| `admin-core.js` | **v 2026.05.14.02** | repo GitHub root → auto-deploy Vercel | ✅ deployato |
| `admin-templates-shared.js` | **v 2026.05.14.02** | repo GitHub root → auto-deploy Vercel | ✅ deployato |
| `menu-admin.html` | **v 2026.05.14.01** | repo GitHub root → auto-deploy Vercel | ✅ deployato |
| `translations.json` | — (96 chiavi/lingua) | GitHub Pages root | ✅ deployato |

> ℹ️ Setup richiesto: env variable `DEEPL_KEY` configurata su Vercel (dashboard del progetto SantaWeb → Settings → Environment Variables). Senza questa, il proxy ritorna 500.

---

## 2. DATI CHIAVE — modifiche consolidate

### 2.1 Problema 1 — Traduzioni parziali (DeepL non funzionava da browser)

**Sintomi:** dopo "Traduci e Pubblica", solo alcune voci dei menu lingua risultavano tradotte; le voci nuove o modificate restavano in italiano. Quota DeepL utilizzo = 0 (nessuna chiamata arrivava al server).

**Causa root:** dalla [documentazione DeepL](https://support.deepl.com/hc/en-us/articles/9773914250012-About-DeepL-API), DeepL API **non permette chiamate dirette da browser**: tutte le richieste falliscono con CORS error (`Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header`). Confermato dall'utente con test diagnostico in console.

Il `.catch` di `fetch` in `chiamaDeepL()` zittiva silenziosamente l'errore di rete. Le voci "vecchie tradotte" che si vedevano erano artefatti di pubblicazioni storiche (probabilmente da quando si usava Google Translate, che aveva CORS abilitato fino al 2 maggio 2026 — vedi handover 02-05).

**Conclusione storica:** l'integrazione DeepL fatta il 2 maggio non ha mai funzionato. Per ~12 giorni le pubblicazioni hanno mantenuto le traduzioni residue del 2 maggio, sovrascrivendo le voci nuove con i testi italiani originali.

**Soluzione: proxy Vercel Serverless Function**

DeepL stessa raccomanda di [routare le richieste attraverso un backend](https://developers.deepl.com/docs/best-practices/cors-requests). Implementato come Serverless Function su Vercel (già infrastruttura esistente per l'admin).

**Nuovo file `api/translate.js` v 2026.05.14.01:**
```javascript
export default async function handler(req, res) {
  // CORS aperti a github.io, vercel.app, dominio custom
  const allowedOrigins = [
    'https://santamonicagenova-a11y.github.io',
    'https://santa-web-peach.vercel.app',
    'https://santamonicagenova.it'
  ];
  const origin = req.headers.origin || '';
  if (allowedOrigins.some(o => origin === o || origin.startsWith(o + '/'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const key = process.env.DEEPL_KEY;
  if (!key) return res.status(500).json({ error: 'DEEPL_KEY env variable non configurata' });
  
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const { text, target_lang } = body || {};
  if (!text || !target_lang) return res.status(400).json({ error: 'text e target_lang richiesti' });
  
  // Chiama DeepL con la chiave server-side, propaga risposta
  const params = new URLSearchParams({ text, source_lang: 'IT', target_lang, tag_handling: 'html', preserve_formatting: '1' });
  const r = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: { 'Authorization': 'DeepL-Auth-Key ' + key, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
  if (!r.ok) {
    const errText = await r.text().catch(() => '');
    return res.status(r.status).json({ error: 'DeepL ' + r.status, detail: errText.slice(0, 300) });
  }
  const data = await r.json();
  return res.status(200).json(data);
}
```

**Modifiche a `admin-core.js` (parte 1 → v 2026.05.14.01):**
- `chiamaDeepL` ora punta a `https://santa-web-peach.vercel.app/api/translate` invece che a `api-free.deepl.com`
- Body JSON `{text, target_lang}` invece di form-urlencoded
- Distinzione errori: 401/403 = auth (chiave invalida server-side), altro non-ok = generic con `errorMsg` propagato
- Rimosse funzioni-chiave (`getDeepLKey`/`resetDeepLKey`/`confermaDeepLKey`/`chiudiModalDeepL`/`_assicuraDeepLKey`) ridotte a no-op stub per non rompere onclick HTML esistenti
- Aggiunto array `falliti[]` in `traduciEPubblica`: a fine ciclo, se >0 fallimenti, alert dettagliato con prime 5 voci fallite + `confirm()` per pubblicare comunque o annullare
- Stesso pattern di reporting in `traduci()` (toast con "X/Y voci tradotte, Z fallite")

**Modifiche a `menu-admin.html` v 2026.05.14.01:**
- Rimosso bottone 🔐 (riga 105 originale)
- Rimosso intero modal `#modal-deepl` (righe 608-622 originali)
- Footer versione aggiornato

**Setup operativo:** la chiave DeepL ora vive **solo** nell'env variable `DEEPL_KEY` su Vercel — più sicura (non in localStorage, non più esposta in browser).

### 2.2 Problema 2 — Switch lingua sul sito non cambiava link al menu

**Sintomi:** in `index.html`, cambiando lingua il bottone "Guarda il menu" continuava a portare al menu italiano.

**Causa root:** in `translations.json`, le 5 lingue avevano **tutte** `cucina_btn_link = "menu.html"` e `dolci_btn_link = "menu-dolci.html"`. La funzione `applyLang()` in `index.html` riga 648-651 leggeva correttamente la chiave ma il valore era identico per tutte le lingue.

**Fix in `translations.json`** (8 righe modificate):

| Lingua | `cucina_btn_link` | `dolci_btn_link` |
|---|---|---|
| IT | `menu.html` (invariato) | `menu-dolci.html` (invariato) |
| EN | `menu.html` → **`menu-en.html`** | → **`menu-dolci-en.html`** |
| FR | `menu.html` → **`menu-fr.html`** | → **`menu-dolci-fr.html`** |
| DE | `menu.html` → **`menu-de.html`** | → **`menu-dolci-de.html`** |
| ES | `menu.html` → **`menu-es.html`** | → **`menu-dolci-es.html`** |

### 2.3 Problema 3 — menu.html / menu-it.html invertiti + modifica grafica descrizioni

**Chiarimento dall'utente:**
- `menu.html` deve essere la versione **pubblica** linkata dal sito → senza ctrl-bar, indicizzato SEO
- `menu-it.html` è la versione **admin/preview** con ctrl-bar (pulsanti stampa/switch carta-orario), `noindex`

**Stato precedente errato** in `admin-core.js` riga 564-565 (sessione 02-05):
```js
files = [
  { path: 'menu.html', content: outputCorrente, label: 'Italiano (admin)' },         // ERRATO: con ctrl-bar
  { path: 'menu-it.html', content: costruisciMenuItPub(), label: 'Italiano (pub)' }  // ERRATO: senza ctrl-bar
];
```

**Fix in `admin-core.js` v 2026.05.14.02** — inversione `content` + iniezione meta SEO:

```js
files = [
  { path: 'menu.html',    content: iniettaSeoITPubblico(costruisciMenuItPub()), label: 'Italiano (pubblico, SEO)' },
  { path: 'menu-it.html', content: iniettaNoIndexIT(outputCorrente),            label: 'Italiano (admin/preview)' }
];
```

**3 helper SEO aggiunti:**

| Helper | Si applica a | Cosa inietta |
|---|---|---|
| `iniettaSeoITPubblico(html)` | `menu.html` | title SEO-friendly + description + robots:index + canonical menu.html + og:type/title/description/url/image + ld+json Schema.org Menu (4 MenuSection) |
| `iniettaNoIndexIT(html)` | `menu-it.html` | `robots:noindex, nofollow` + canonical menu-it.html |
| `iniettaSeoLingua(html, lang)` | `menu-en/fr/de/es.html` | `robots:index, follow` + canonical lingua-specifico |

**Motivazione tecnica della preservazione SEO:** il template embedded `CARTA_TPL_B` (in `admin-templates-shared.js`) genera un HTML scarno con solo `<title>Menù — Santamonica</title>` e cache-control headers. Il `menu.html` storicamente sul sito aveva invece SEO completo (title ottimizzato, meta description, og:, ld+json) curato manualmente. Senza iniezione, ogni "Traduci e Pubblica" avrebbe **perso** il SEO. I valori SEO sono hardcoded in `eseguiPubblicazione` come stringhe — copia fedele del menu.html pre-esistente.

### 2.4 Problema 3-bis — Descrizioni piatti (modifica grafica)

**Richiesta utente:** descrizione del piatto a capo, in italic, font 70% del normale, anche nel menu degustazione.

**Modifiche a `admin-templates-shared.js` v 2026.05.14.02:**

1. **CSS `.piatto-desc`** (esistente, usato dal rendering carta):
   ```css
   /* prima */
   .piatto-desc { font-style: italic; font-size: .82rem; color: var(--stone); display: block; }
   /* dopo */
   .piatto-desc {
     font-style: italic;
     font-size: 0.7em;     /* 70% del parent .piatto */
     line-height: 1.25;
     color: var(--stone);
     display: block;
     margin-top: 0.3mm;
   }
   ```

2. **CSS `.percorso-desc`** (nuovo, per percorso 6 piatti degustazione): stesso stile di `.piatto-desc`.

3. **Rendering `buildDegu` percorso 6 piatti** — la descrizione era **completamente ignorata** anche se presente nel JSON. Modifica:
   ```js
   // prima
   const righe = piatti.map(p =>
     `<div class="percorso-piatto${p.sostenibile ? ' eco' : ''}">${p.nome}</div>`
   ).join('');
   // dopo
   const righe = piatti.map(p => {
     const descHtml = p.descrizione ? `<span class="percorso-desc">${p.descrizione}</span>` : '';
     return `<div class="percorso-piatto${p.sostenibile ? ' eco' : ''}">${p.nome}${descHtml}</div>`;
   }).join('');
   ```

**Nota interpretativa "70% più piccolo":** ho interpretato come "70% del parent" (cioè -30%), non "30% del parent" (-70%) che sarebbe stato illeggibile. L'utente ha confermato l'effetto come desiderato.

### 2.5 Riepilogo file e versioni

| File | Versione finale | Sessione precedente | Cambiamenti totali |
|---|---|---|---|
| `api/translate.js` | v 2026.05.14.01 (NUOVO) | non esisteva | Vercel function proxy DeepL |
| `admin-core.js` | v 2026.05.14.02 | v 2026.05.02 | proxy DeepL + counter falliti + inversione menu.html/menu-it.html + iniezione SEO |
| `admin-templates-shared.js` | v 2026.05.14.02 | v 2026.05.13.01 | descrizioni 70%/italic + percorso-desc + buildDegu con descrizione |
| `menu-admin.html` | v 2026.05.14.01 | v 2026.05.09.03 | rimosso bottone 🔐 + modal #modal-deepl |
| `translations.json` | — (96 chiavi) | — (96 chiavi) | 8 righe modificate (link menu lingua) |

---

## 3. CONTESTO ESSENZIALE

### 3.1 Architettura aggiornata

```
GitHub repo SantaWeb (sorgente unica)
  │
  ├──► auto-deploy Vercel ──► https://santa-web-peach.vercel.app/
  │      ADMIN UI + Serverless Functions
  │      ├─ menu-admin.html v 2026.05.14.01
  │      ├─ admin-templates-shared.js v 2026.05.14.02
  │      ├─ admin-translations.js
  │      ├─ admin-templates.js (legacy, ancora referenziato)
  │      ├─ admin-core.js v 2026.05.14.02
  │      ├─ foto-optimizer.js v 2026.05.09.02
  │      └─ api/
  │          └─ translate.js v 2026.05.14.01 ← Serverless Function proxy DeepL
  │          (richiede env variable DEEPL_KEY su Vercel)
  │
  └──► GitHub Pages ──► https://santamonicagenova-a11y.github.io/SantaWeb/
         PRODUZIONE (sito pubblico)
         ├─ index.html v2026.05.09.07
         ├─ translations.json (96 chiavi/lingua, link menu fixati)
         ├─ site-images.json, gallery-photos.json
         ├─ img/sito/*.webp, img/galleria/*.webp
         └─ menu.html (IT pubblico, SEO completo, NO ctrl-bar)        ← rigenerato da admin
            menu-it.html (IT admin/preview, ctrl-bar, noindex)         ← rigenerato da admin
            menu-en/fr/de/es.html (lingue, index, canonical per lingua) ← rigenerati da admin
            menu-allergeni.html, menu-vini.html, menu-dolci-it.html, orario.html
```

**Workflow di pubblicazione dopo questa sessione:**
1. Admin carica menu da `menu-it.html` (versione admin con ctrl-bar)
2. Utente modifica nel form
3. Click "Traduci e Pubblica"
4. Admin chiama proxy Vercel `api/translate` per ogni voce × 4 lingue
5. Proxy chiama DeepL con chiave server-side, ritorna traduzione
6. Counter `falliti[]` traccia eventuali errori
7. A fine ciclo, se >0 errori → alert + conferma utente
8. Pubblicazione di 6 file: `menu.html`, `menu-it.html`, `menu-{en,fr,de,es}.html`, ognuno con SEO appropriato

### 3.2 ⚠️ REGOLA OPERATIVA FISSA (memorizzata, valida per tutte le sessioni future)

**Ogni file consegnato per il deploy in repo deve avere la versione aggiornata** (formato `v YYYY.MM.DD.NN`, sia in header sia in footer/UI quando applicabile). **La nuova versione va comunicata esplicitamente all'utente quando si presenta il file.** Questa regola va riportata in ogni futuro documento di continuità/handover.

### 3.3 Convenzioni progetto (aggiornate)

| Aspetto | Convenzione |
|---|---|
| Versioning file | `v YYYY.MM.DD.NN` (header + footer/UI visibile dove applicabile) |
| `translations.json` | NESSUN versionamento interno (solo conteggio chiavi tracciato in handover) |
| Foto WebP | quality 0.90 full (1920-2400px) / 0.82 thumb (800px) |
| Galleria | 6 slot, schema `{src, srcThumb, alt}` |
| Foto sito | 4 chiavi: hero, cucina_piatto, cucina_ingredienti, cantina |
| Lazy loading | `loading="lazy"` + `decoding="async"` ovunque tranne hero |
| Endpoint Formspree | `mkopjnvq` (discriminator `tipo` = standard\|speciale) |
| `<option value="">` | canonico in italiano (label tradotte via `data-i18n`) |
| **Motore traduzione** | **DeepL via Vercel proxy** (`api/translate.js`), chiave in env var `DEEPL_KEY` server-side |
| **menu.html** | **IT pubblico, SEO index, no ctrl-bar** (linkato da index.html) |
| **menu-it.html** | **IT admin/preview, noindex, con ctrl-bar** (URL che l'admin rilegge per editing) |
| **menu-{en,fr,de,es}.html** | tradotti, index, canonical specifico per lingua |
| GitHub auth admin | token `localStorage['gh_token']`, permesso `repo` |
| Propagazione GitHub Pages | 60-90 sec |
| Propagazione Vercel | 30-60 sec |

### 3.4 Sistema traduzione — workflow operativo dettagliato

| Passaggio | Cosa avviene |
|---|---|
| 1. Setup una tantum | Su Vercel: Settings → Environment Variables → `DEEPL_KEY` = `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx` |
| 2. Browser → Vercel | POST `https://santa-web-peach.vercel.app/api/translate` body JSON `{text, target_lang}` |
| 3. Vercel → DeepL | Authorization header con chiave env, body form-urlencoded |
| 4. DeepL → Vercel | risposta JSON con `translations[0].text` |
| 5. Vercel → Browser | JSON propagato (header CORS appropriato per origine) |
| 6. Browser admin | `TRANSLATIONS[lang]['piatti'][testo_it] = res.trad` |
| 7. Pubblicazione | `costruisciMenuTradotto` usa `TRANSLATIONS` per ogni voce; voci senza traduzione → `tr(n)` ritorna `n` (italiano) → finiscono nel file lingua |

Quota DeepL Free: 500.000 caratteri/mese. Monitorabile su https://www.deepl.com/account/usage.

### 3.5 SEO — gestione attuale

I meta tag SEO del `menu.html` pubblico sono **hardcoded come stringa** in `admin-core.js` `iniettaSeoITPubblico()`. Se in futuro vuoi modificare description, og: image, ld+json schema → editare quella stringa direttamente.

I tag iniettati:
- `<title>Menu Pesce Fresco e Cucina Ligure | Ristorante Santamonica Genova</title>`
- `<meta name="description" content="Scopri il menu... pesce fresco di Camogli...">`
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical" href="https://santamonicagenova.it/menu.html">`
- og:type, og:title, og:description, og:url, og:image (santamonica.it/img/hero.jpg)
- ld+json: `{ "@context": "https://schema.org", "@type": "Menu", ... "hasMenuSection": [...] }` con 4 sezioni hardcoded (Antipasti, Primi, Secondi di Mare, Contorni)

Per le lingue (menu-en/fr/de/es.html): solo `<meta name="robots" content="index, follow">` + canonical specifico, senza description/og: (scope rimandato).

### 3.6 GitHub auth (invariato)

Token in `localStorage['gh_token']`, reset bottone 🔑 in admin top-bar. Permesso: `repo`.

---

## 4. PROSSIMI PASSI

### 4.1 Deploy: COMPLETATO in questa sessione

Tutti i 5 file sono stati deployati e testati operativamente dall'utente. Niente da fare immediatamente.

### 4.2 Verifiche di routine (manutenzione)

| Verifica | Frequenza | Dove |
|---|---|---|
| Quota DeepL mensile | mensile | https://www.deepl.com/account/usage |
| Funzionalità proxy `api/translate` | dopo ogni rebuild Vercel | test in console: fetch al proxy con `{text: 'ciao', target_lang: 'EN-GB'}` |
| SEO menu.html | dopo ogni "Traduci e Pubblica" | F12 → Elements → `<head>` deve contenere robots/canonical/og:/ld+json |

### 4.3 Lavori arretrati / decisioni rimandate

- [ ] Valutare taglio lingue DE/ES (target: IT + francesi + nord-italiani)
- [ ] Pulire `gallery-photos.json` legacy o uniformare schema
- [ ] Eventuale ridimensionamento `img/galleria/` con file legacy non più referenziati
- [ ] Rimuovere `admin-templates.js` legacy da `menu-admin.html` riga 175
- [ ] **NUOVO:** considerare ingrandimento font stampa anche su menu-vini e menu-allergeni (replica del fix del 13-05 sul template carta)
- [ ] **NUOVO:** SEO per lingue (description, og:, ld+json localizzati) — attualmente solo robots+canonical

### 4.4 Roadmap esistente (Q2/Q3 e Q3/Q4 2026)

Invariata. Vedi `ROADMAP_Santamonica_Web.md` per dettaglio.

---

## 5. ALLEGATI / RIFERIMENTI

### Catena documenti di continuità

1. `HANDOVER_FINALE_SantaWeb_2026-05-02.md`
2. `HANDOVER_Santamonica_Web_2026-05-09.md` (sessione mattutina, ricostruito)
3. `HANDOVER_Santamonica_Web_2026-05-09_v2.md` (sessione pomeridiana)
4. `HANDOVER_Santamonica_Web_2026-05-13.md` (font +50% stampa)
5. **`HANDOVER_Santamonica_Web_2026-05-14.md` (questo)** — proxy DeepL + fix link menu + inversione menu.html/menu-it.html + descrizioni piatti

### File toccati questa sessione

| File | Versione | Cambiamenti chiave |
|---|---|---|
| `api/translate.js` | v 2026.05.14.01 (NUOVO) | Vercel Serverless Function proxy DeepL · CORS allowlist · gestione errori |
| `admin-core.js` | v 2026.05.14.02 | `chiamaDeepL` punta al proxy · counter falliti + report · helper SEO · inversione menu.html/menu-it.html · stub funzioni-chiave legacy |
| `admin-templates-shared.js` | v 2026.05.14.02 | `.piatto-desc` 70% + margin · `.percorso-desc` nuova · `buildDegu` renderizza descrizione percorso |
| `menu-admin.html` | v 2026.05.14.01 | rimosso bottone 🔐 · rimosso modal #modal-deepl · footer versione |
| `translations.json` | — | 8 righe modificate (link menu EN/FR/DE/ES) |

### File NON modificati (intatti)

- `admin-translations.js`
- `admin-templates.js` (legacy)
- `foto-optimizer.js` v 2026.05.09.02
- `index.html` v2026.05.09.07
- `menu-allergeni.html`, `menu-vini.html`, `menu-dolci-it.html`, `orario.html`
- `site-images.json`, `gallery-photos.json`

### Setup esterno richiesto (una tantum)

| Servizio | Cosa configurare | Dove |
|---|---|---|
| **Vercel** | Env variable `DEEPL_KEY` = chiave DeepL completa (`...:fx`) | Vercel Dashboard → progetto SantaWeb → Settings → Environment Variables → tutti gli env (Production/Preview/Development) |

---

**Fine handover.**

---

*Versione documento: v 2026.05.14.01 — applicata retroattivamente il 2026-05-15.*
