# HANDOVER — Sito Santamonica + Admin SantaWeb
**Versione:** v 2026.05.13.01 *(retroattiva, applicata 2026-05-15)*
**Data:** 2026-05-13 · **Continuazione di:** `HANDOVER_Santamonica_Web_2026-05-09_v2.md`

---

## 1. STATO ATTUALE

Sessione breve dedicata a un'unica modifica mirata: **ingrandimento del 50% del carattere nella stampa della preview menù** (richiesta utente: testo troppo piccolo in stampa fisica).

| File prodotto | Versione | Destinazione | Status |
|---|---|---|---|
| `admin-templates-shared.js` | **v 2026.05.13.01** | repo GitHub → auto-deploy Vercel (root admin SantaWeb) | ✅ pronto, da pushare |

> ℹ️ `index.html` v2026.05.09.07 e `translations.json` (96 chiavi/lingua) prodotti nella sessione precedente: **status di deploy da verificare con l'utente** — non sono stati toccati in questa sessione.
>
> Tutti gli altri file (`menu-admin.html`, `admin-core.js`, `admin-translations.js`, `admin-templates.js` legacy, `foto-optimizer.js`, tutti i `menu-*.html`, `orario.html`, JSON dati, foto) → **NON TOCCATI**.

---

## 2. DATI CHIAVE — modifica consolidata

### 2.1 Stampa preview menù — font +50%

**Contesto.** Il bottone `⧉ Preview ▾` in `menu-admin.html` (righe 96-100) chiama `apriPreview('it'|'en'|'fr'|'de'|'es')`, definita in `admin-core.js:370`. Per il menù alla carta e il foglio orario, questa funzione genera un documento HTML completo basato sul template stringa **`CARTA_TPL_B`** definito in `admin-templates-shared.js`. Il template include il proprio `<style>` con un blocco `@media print` che governa l'aspetto stampato. L'utente stampa via Ctrl/Cmd+P dalla finestra di preview.

**Modifica.** Aggiunta una singola regola CSS nel blocco `@media print` del template carta:

```css
@media print {
  @page { size: A4 portrait; margin: 0; }
  html { font-size: 24px; }   /* ← NUOVO: 16px × 1.5 = +50% */
  body { background: white; }
  .ctrl-bar { display: none; }
  /* ...resto invariato... */
}
```

**Perché funziona.** Tutte le dimensioni testo del template (`.logo`, `.degu-titolo`, `.percorso-piatto`, `.piatto`, `.piatto-desc`, `.sezione-titolo`, `.orario-piatto`, `.orario-links`, `.note-ospite` ecc.) usano `rem`, che è relativo al `font-size` di `<html>`. Cambiando solo la base in `@media print`:
- Scala uniformemente **tutti** i testi della stampa del +50%
- **Non altera** le dimensioni layout in `mm` (page width, padding, gap) → l'A4 resta A4
- **Non altera** la preview a schermo (visualizzazione invariata)
- Vale sia per **menù alla carta** (3 pagine) sia per **foglio orario** (1 pagina), che condividono lo stesso template

**Ambito.** La modifica tocca **solo** `CARTA_TPL_B` (menù carta + orario). Template separati NON modificati:
- `_VINI_TPL` (lista vini) in `admin-core.js:1182` — stampa vini invariata
- `apriPreviewAllergeni()` in `admin-core.js:984` — stampa allergeni invariata
- `apriPreviewDolci` (se presente) — invariata

Se l'utente in futuro segnala che anche la lista vini e/o allergeni vanno ingranditi, applicare la stessa regola `html { font-size: 24px; }` ai rispettivi blocchi `@media print`.

### 2.2 Versione header `admin-templates-shared.js`

Il file in origine non aveva header di versione. Aggiunto in cima:

```js
// admin-templates-shared.js — v 2026.05.13.01
// Template CARTA (globali, embedded) — usati da preview/pubblicazione IT e lingue
```

Da questo momento il file segue la convenzione di versionamento del progetto (vedi §3.2).

### 2.3 Rischio noto

Con +50% il testo è notevolmente più grande. Pagine dense (in particolare il **foglio orario**, a 2 colonne fitte) potrebbero **traboccare** o richiedere un secondo foglio. Verifica raccomandata in anteprima browser (Ctrl/Cmd+P) o stampa fisica subito dopo il push.

Se trabocca, opzioni di fallback:
| Opzione | Modifica | Effetto |
|---|---|---|
| Ridurre incremento | `html { font-size: 21px; }` (+31%) | meno aggressivo, più sicuro su layout |
| Ridurre ulteriormente | `html { font-size: 19px; }` (+19%) | minimo percepibile |
| Scaling selettivo | rimuovere regola html, ingrandire solo `.piatto`, `.percorso-piatto`, `.orario-piatto` (es. `font-size: 1.5em !important`) | titoli/header restano nelle dimensioni originali, solo il corpo cresce |

---

## 3. CONTESTO ESSENZIALE

### 3.1 Architettura repo / deploy (chiarita in questa sessione)

```
GitHub repo SantaWeb (sorgente unica)
  │
  ├──► auto-deploy Vercel ──► https://santa-web-peach.vercel.app/
  │      ADMIN UI (menu-admin.html + JS admin)
  │      ├─ admin-templates-shared.js v 2026.05.13.01 ⬅ push questa sessione
  │      ├─ admin-translations.js
  │      ├─ admin-templates.js (legacy, ancora referenziato in menu-admin.html riga 175)
  │      ├─ admin-core.js v 2026.05.02
  │      └─ foto-optimizer.js v 2026.05.09.02
  │
  └──► GitHub Pages ──► https://santamonicagenova-a11y.github.io/SantaWeb/
         PRODUZIONE (sito pubblico)
         ├─ index.html v2026.05.09.07
         ├─ translations.json (96 chiavi/lingua)
         ├─ site-images.json, gallery-photos.json
         ├─ img/sito/*.webp, img/galleria/*.webp
         └─ menu-it.html, menu-en/fr/de/es.html, menu-allergeni.html,
            menu-vini.html, menu-dolci-it.html, orario.html
```

**Workflow di deploy admin:** commit + push su GitHub → Vercel rileva il push → rebuild automatico → file live in ~30-60s. Nessuna azione manuale su Vercel richiesta.

### 3.2 ⚠️ REGOLA OPERATIVA FISSA (memorizzata, valida per tutte le sessioni future)

**Ogni file consegnato per il deploy in repo deve avere la versione aggiornata** (formato `v YYYY.MM.DD.NN`, sia in header sia in footer/UI quando applicabile). **La nuova versione va comunicata esplicitamente all'utente quando si presenta il file.** Questa regola va riportata in ogni futuro documento di continuità/handover.

### 3.3 Convenzioni progetto (invariate)

| Aspetto | Convenzione |
|---|---|
| Versioni file | `v YYYY.MM.DD.NN` (header + footer/UI visibile dove applicabile) |
| `translations.json` | NESSUN versionamento interno (solo conteggio chiavi tracciato in handover) |
| Foto WebP | quality 0.90 full (1920–2400px), 0.82 thumb (800px) |
| Lazy loading | `loading="lazy"` + `decoding="async"` ovunque tranne hero |
| Galleria | 6 slot, schema `{src, srcThumb, alt}` |
| Foto sito | 4 chiavi: hero, cucina_piatto, cucina_ingredienti, cantina |
| Endpoint Formspree | `mkopjnvq` (unico, discriminator `tipo` per routing logico email) |
| `value=` `<option>` | canonico in italiano (label visibili tradotte via `data-i18n`) |
| Propagazione GitHub Pages | 60–90 sec |
| Propagazione Vercel (admin) | 30–60 sec |

### 3.4 Sistema traduzione (invariato)

DeepL API Free, chiave in `localStorage['deepl_key']`, formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx`. Modal `#modal-deepl` in admin top-bar (🔐).

### 3.5 GitHub auth (invariato)

Token in `localStorage['gh_token']`, reset bottone 🔑 in admin top-bar. Permesso: `repo`.

---

## 4. PROSSIMI PASSI

### 4.1 Deploy immediato (1 file)

1. Commit + push su repo GitHub `SantaWeb`, root admin:
   - `admin-templates-shared.js` v 2026.05.13.01
2. Attendere ~30-60s rebuild Vercel
3. Hard refresh `https://santa-web-peach.vercel.app/menu-admin.html` (Cmd+Shift+R / Ctrl+F5)

### 4.2 Verifiche post-deploy

| Verifica | Atteso |
|---|---|
| Preview menù alla carta (IT/EN/FR/DE/ES) a schermo | **Identica a prima** (nessuna scala visibile) |
| Preview foglio orario a schermo | **Identica a prima** |
| Ctrl/Cmd+P da preview menù carta → anteprima stampa | Testo visibilmente più grande (~+50%), 3 pagine A4, layout integro |
| Ctrl/Cmd+P da preview foglio orario → anteprima stampa | Testo più grande, **verificare assenza overflow** (sezione critica) |
| Preview lista vini (se accessibile) | Stampa **invariata** (modifica non tocca `_VINI_TPL`) |
| Preview allergeni | Stampa **invariata** |

### 4.3 Da verificare con l'utente

- [ ] `index.html` v2026.05.09.07 e `translations.json` (96 chiavi) della sessione 2026-05-09 v2: **stato deploy** su GitHub Pages — non confermato in questa sessione

### 4.4 Lavori arretrati / decisioni rimandate (dalle sessioni precedenti)

- [ ] Valutare taglio lingue DE/ES (target reale: IT, francesi, nord-italiani)
- [ ] Pulire `gallery-photos.json` legacy o uniformare schema
- [ ] Eventuale ridimensionamento `img/galleria/` con file legacy non più referenziati
- [ ] Rimuovere `admin-templates.js` legacy da `menu-admin.html` riga 175 (se non più necessario)

### 4.5 Roadmap esistente (invariata, da HANDOVER 2026-05-02)

- Q2/Q3 2026: consolidare traduzioni, eliminare admin-templates.js legacy, version history menu, dark mode admin
- Q3/Q4 2026: mobile admin responsive, drag-drop sezioni, preview real-time, analytics

---

## 5. ALLEGATI / RIFERIMENTI

### Catena documenti di continuità

1. `HANDOVER_FINALE_SantaWeb_2026-05-02.md`
2. `HANDOVER_Santamonica_Web_2026-05-09.md` (sessione mattutina: 4 file deploy, foto sito/galleria, DeepL)
3. `HANDOVER_Santamonica_Web_2026-05-09_v2.md` (refactor form prenotazione + footer grid)
4. **`HANDOVER_Santamonica_Web_2026-05-13.md` (questo)** — font +50% in stampa preview menù

### File toccati questa sessione

| File | Versione | Cambiamenti chiave |
|---|---|---|
| `admin-templates-shared.js` | v 2026.05.13.01 | header versione aggiunto · regola `html { font-size: 24px; }` nel `@media print` del template `CARTA_TPL_B` |

### File NON modificati (intatti)

- `menu-admin.html` v 2026.05.09.03
- `admin-core.js` v 2026.05.02
- `admin-templates.js` (legacy)
- `admin-translations.js`
- `foto-optimizer.js` v 2026.05.09.02
- `index.html` v2026.05.09.07 (prodotto sessione precedente)
- `translations.json` (prodotto sessione precedente, 96 chiavi)
- `menu-it.html`, `menu-en/fr/de/es.html`, `menu-dolci-it.html`, `menu-allergeni.html`, `menu-vini.html`, `orario.html`
- `site-images.json`, `gallery-photos.json`

---

**Fine handover.**

---

*Versione documento: v 2026.05.13.01 — applicata retroattivamente il 2026-05-15.*
