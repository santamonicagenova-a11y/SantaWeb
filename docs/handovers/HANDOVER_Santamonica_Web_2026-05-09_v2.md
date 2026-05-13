# HANDOVER — Sito Santamonica + Admin SantaWeb
**Data:** 2026-05-09 (sessione pomeridiana, v2) · **Continuazione di:** `HANDOVER_Santamonica_Web_2026-05-09.md`

---

## 1. STATO ATTUALE

Sessione dedicata a refactor del form prenotazione (`#prenota`) e ad aggiustamenti footer. Tutte le modifiche del precedente handover (deploy iniziale v2026.05.09.02, foto sito, foto galleria, chiave DeepL) sono state completate dall'utente prima di iniziare questa sessione.

| File prodotto | Versione | Destinazione | Status |
|---|---|---|---|
| `index.html` | **v2026.05.09.07** | GitHub Pages (root SantaWeb) | ✅ pronto, da deployare |
| `translations.json` | — (96 chiavi/lingua) | GitHub Pages (root SantaWeb) | ✅ pronto, da deployare |

> ℹ️ `menu-admin.html` (v 2026.05.09.03), `foto-optimizer.js` (v 2026.05.09.02), `admin-core.js` (v 2026.05.02), `admin-templates-shared.js`, `admin-translations.js`, tutti i `menu-*.html`, `orario.html` → **NON TOCCATI** in questa sessione.

---

## 2. DATI CHIAVE — modifiche consolidate

### 2.1 Form prenotazione `#prenota` — refactor completo

Da "form occasioni speciali" a **form unico unificato** (Opzione A: occasione opzionale, stesso endpoint Formspree con discriminator `tipo`).

#### Layout finale

```
Riga 1: Nome (full width, required)
Riga 2: Telefono | Email
        ↓ hint: "Almeno uno tra telefono ed email è obbligatorio"
Riga 3: Data desiderata | Numero di persone (entrambi required)
Riga 4: Occasione (opzionale, full width — include "Cena standard" + 6 occasioni speciali)
Riga 5: Intolleranze o allergie (full width, REQUIRED, placeholder "Scrivi 'nessuna'...")
Riga 6: Richieste particolari (full width, opzionale)
Pulsante: "Invia la richiesta"
```

#### Campi obbligatori (con asterisco rosso terracotta automatico)

| Campo | Required | Note |
|---|---|---|
| Nome | ✅ | HTML5 `required` |
| Telefono | ❌ singolarmente | Validazione JS: tel \|\| email |
| Email | ❌ singolarmente | Validazione JS: tel \|\| email |
| Data | ✅ | HTML5 `required` |
| Persone | ✅ | HTML5 `required` |
| Occasione | ❌ | Default vuoto o "Cena standard" |
| Intolleranze | ✅ | HTML5 `required` + placeholder "Scrivi 'nessuna' se non hai allergie" |
| Richieste | ❌ | textarea libera |

#### Asterisco automatico

CSS `:has()` selector applica `' *'` color terracotta a `label` di qualunque `.pf-group` contenga `input/select/textarea[required]`. Nessuna manutenzione manuale richiesta su translations.json — funziona per qualsiasi futuro campo required. Browser support: Chrome 105+, Safari 15.4+, Firefox 121+.

#### Logica `tipo` runtime (campo nascosto)

Pre-fetch nel submit handler:
- `occasione` vuota OR = "Cena standard" → `tipo=standard`, subject email `Prenotazione tavolo - Santamonica`
- `occasione` valorizzata altrimenti → `tipo=speciale`, subject email `Prenotazione speciale - Santamonica`

`<select>` ha attributo `value="..."` canonico in italiano su ogni `<option>` (anche se le label sono i18n: i value POSTati restano IT per coerenza lato Formspree).

#### Validazione tel || email

Pre-fetch: se `telVal.trim() === '' && emailVal.trim() === ''` → blocca submit, mostra `prenota_err_contatto` localizzato in `.pf-status.error`, `pBtn.disabled = false`, return.

#### Endpoint Formspree

Invariato: `https://formspree.io/f/mkopjnvq`. Campo nascosto `_subject` aggiornato dinamicamente via JS prima del fetch.

### 2.2 Estensione sistema i18n

`applyLang()` ora gestisce anche attributo `data-i18n-placeholder`:
```js
document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
  var key = el.getAttribute('data-i18n-placeholder');
  if (t[key] !== undefined) el.setAttribute('placeholder', t[key]);
});
```

Usato per il placeholder del campo intolleranze (chiave `prenota_f_intolleranze_ph`). Pattern riutilizzabile per qualsiasi futuro placeholder traducibile.

### 2.3 Footer — layout grid 3 colonne

Sostituito `display: flex; justify-content: space-between` con `display: grid; grid-template-columns: 1fr auto 1fr`:

| Colonna | Contenuto | Allineamento |
|---|---|---|
| 1 (1fr) | `Santamonica` (brand) | `justify-self: start` |
| 2 (auto) | Instagram · Facebook | `justify-self: center` (centro geometrico reale della pagina) |
| 3 (1fr) | © 2026 ... v2026.05.09.07 | `justify-self: end; text-align: right` |

Mobile (≤768px): `grid-template-columns: 1fr` con tutti gli elementi `justify-self: center`.

### 2.4 `translations.json` — chiavi nuove e modificate

#### Conteggio: 92 (start) → 93 → 96 (finale)

| Chiave | Stato | Posizione | Note |
|---|---|---|---|
| `prenota_label` | modificata | — | "Prenota un tavolo" |
| `prenota_title` | modificata | — | "Riserva la tua *serata*" |
| `prenota_p1` | modificata | — | "Compila il modulo... Ti contatteremo per la conferma." |
| `prenota_p2` | modificata | — | "Se è un'occasione speciale..." |
| `prenota_h1_title` | modificata | — | "Occasione speciale?" |
| `prenota_h1_text` | modificata | — | "Compleanni... selezionala nel form..." |
| `prenota_f_occasione` | modificata | — | "Occasione (opzionale)" |
| `prenota_f_occ_standard` | **NUOVA** | dopo `prenota_f_occasione_sel` | "Cena standard" |
| `prenota_f_email` | **NUOVA** | dopo `prenota_f_tel` | "Email" |
| `prenota_contatto_hint` | **NUOVA** | dopo `prenota_f_email` | hint sotto riga tel/email |
| `prenota_f_intolleranze_ph` | **NUOVA** | dopo `prenota_f_intolleranze` | placeholder "Scrivi 'nessuna'..." |
| `prenota_err_contatto` | **NUOVA** | dopo `prenota_err` | errore se tel + email entrambi vuoti |

Tutte le 5 lingue (IT/EN/FR/DE/ES) allineate, simmetria mantenuta.

### 2.5 Cronologia versioni `index.html` in questa sessione

```
v2026.05.09.02  → start sessione (deployato)
v2026.05.09.03  → form unico, copy aggiornata, campo tipo+subject dinamico
v2026.05.09.04  → email field, validazione tel||email, intolleranze required, applyLang+placeholder
v2026.05.09.05  → asterisco automatico via CSS :has()
v2026.05.09.06  → cambio frase "Ti contatteremo per la conferma"
v2026.05.09.07  → footer grid 3 colonne (FINALE)
```

---

## 3. CONTESTO ESSENZIALE

### 3.1 Architettura (invariata)

```
ADMIN (Vercel)
  https://santa-web-peach.vercel.app/menu-admin.html
  ├─ admin-translations.js     [1° script]
  ├─ admin-templates-shared.js [2° script]
  ├─ admin-core.js v 2026.05.02 (DeepL integration)
  └─ foto-optimizer.js v 2026.05.09.02

PRODUZIONE (GitHub Pages)
  https://santamonicagenova-a11y.github.io/SantaWeb/
  ├─ index.html v2026.05.09.07 ⬅ deploy questa sessione
  ├─ translations.json (96 chiavi/lingua) ⬅ deploy questa sessione
  ├─ site-images.json (4 chiavi: hero/cucina_piatto/cucina_ingredienti/cantina)
  ├─ gallery-photos.json (array {src, srcThumb, alt})
  ├─ img/sito/{key}.webp
  ├─ img/galleria/foto{1-6}.webp + thumb/foto{1-6}.webp
  └─ menu-it.html, menu-en/fr/de/es.html, menu-allergeni.html, menu-vini.html, menu-dolci-it.html, orario.html
```

### 3.2 Sistema traduzione (invariato)

DeepL API Free integrata dal 2 maggio 2026. Chiave in `localStorage['deepl_key']`, formato `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:fx`. Modal `#modal-deepl` in admin top-bar (bottone 🔐).

### 3.3 GitHub auth (invariato)

Token in `localStorage['gh_token']`, reset bottone 🔑 in admin top-bar. Permesso: `repo`.

### 3.4 Convenzioni progetto

| Aspetto | Convenzione |
|---|---|
| Versioni file | `v YYYY.MM.DD.NN` (header + footer/UI visibile) |
| `translations.json` | NESSUN versionamento interno (solo conteggio chiavi tracciato in handover) |
| Foto WebP | quality 0.90 full (1920–2400px), 0.82 thumb (800px) |
| Lazy loading | `loading="lazy"` + `decoding="async"` ovunque tranne hero |
| Galleria | 6 slot, schema `{src, srcThumb, alt}` |
| Foto sito | 4 chiavi: hero, cucina_piatto, cucina_ingredienti, cantina |
| Endpoint Formspree | `mkopjnvq` (unico, discriminator `tipo` per routing logico email) |
| `value=` `<option>` | canonico in italiano (label visibili tradotte via `data-i18n`) |
| Propagazione GitHub Pages | 60–90 sec |

### 3.5 ⚠️ REGOLA OPERATIVA FISSA (memorizzata, valida per tutte le sessioni future)

**Ogni file consegnato per il deploy in repo deve avere la versione aggiornata** (formato `v YYYY.MM.DD.NN`, sia in header sia in footer/UI). **La nuova versione va comunicata esplicitamente all'utente quando si presenta il file.** Questa regola va riportata in ogni futuro documento di continuità/handover.

---

## 4. PROSSIMI PASSI

### 4.1 Deploy immediato (2 file)

1. **GitHub** → repo SantaWeb root, sostituire:
   - `index.html` v2026.05.09.07
   - `translations.json` (96 chiavi/lingua)
2. Attendi 60–90s propagation
3. Hard refresh browser (Cmd+Shift+R / Ctrl+F5) per evitare cache CSS/JS

### 4.2 Verifiche post-deploy

| Verifica | Atteso |
|---|---|
| Sezione `#prenota` label | "Prenota un tavolo" / "Riserva la tua serata" |
| Campi visibili in ordine | Nome → Tel \| Email + hint → Data \| Persone → Occasione → Intolleranze → Richieste |
| Asterisco rosso terracotta | Su Nome, Data, Persone, Intolleranze (NON su Telefono, Email, Occasione, Richieste) |
| Placeholder intolleranze | "Scrivi 'nessuna' se non hai allergie" (cambia con la lingua) |
| Submit con tel + email entrambi vuoti | Errore inline `prenota_err_contatto`, no fetch a Formspree |
| Submit con solo telefono compilato | OK, mail subject `Prenotazione tavolo - Santamonica`, campo `tipo: standard` |
| Submit con occasione "Compleanno" | Mail subject `Prenotazione speciale - Santamonica`, campo `tipo: speciale` |
| Submit senza intolleranze | Browser HTML5 nativo blocca con tooltip |
| Footer desktop | Brand sx, social CENTRATI esattamente, copyright+versione dx |
| Footer mobile (<768px) | Stack verticale centrato |
| Switch lingua (5 lingue) | Tutte le label, placeholder, hint, errori si traducono |

### 4.3 Lavori arretrati / decisioni rimandate

- [ ] Valutare taglio lingue DE/ES (target reale: IT, francesi, nord-italiani) — già rimandato dalla sessione precedente
- [ ] Pulire `gallery-photos.json` legacy o uniformare schema (se non già fatto durante reupload foto)
- [ ] Eventuale ridimensionamento `img/galleria/` con file legacy non più referenziati

### 4.4 Roadmap esistente (da HANDOVER 2026-05-02, non in discussione qui)

- Q2/Q3 2026: consolidare traduzioni, eliminare admin-templates.js legacy, version history menu, dark mode admin
- Q3/Q4 2026: mobile admin responsive, drag-drop sezioni, preview real-time, analytics

---

## 5. ALLEGATI / RIFERIMENTI

### Catena documenti di continuità

1. `HANDOVER_FINALE_SantaWeb_2026-05-02.md` (deploy 28 apr, fix BUG, rimozione € prezzi, modifiche menu-it.html)
2. `HANDOVER_Santamonica_Web_2026-05-09.md` (sessione mattutina: 4 file deploy, foto sito/galleria, DeepL)
3. **`HANDOVER_Santamonica_Web_2026-05-09_v2.md` (questo)** — refactor form prenotazione + footer

### File toccati questa sessione

| File | Cambiamenti chiave |
|---|---|
| `index.html` | form unico · campo email · validazione tel\|\|email · intolleranze required · asterisco auto · footer grid · placeholder i18n · copy "Ti contatteremo" |
| `translations.json` | 7 chiavi modificate + 4 nuove × 5 lingue (totale 96/lingua) |

### File NON modificati (intatti)

- `menu-admin.html` v 2026.05.09.03
- `foto-optimizer.js` v 2026.05.09.02
- `admin-core.js` v 2026.05.02
- `admin-templates-shared.js`
- `admin-translations.js`
- `menu-it.html`, `menu-en/fr/de/es.html`, `menu-dolci-it.html`, `menu-allergeni.html`, `menu-vini.html`, `orario.html`
- `site-images.json`, `gallery-photos.json` (in produzione)

---

**Fine handover.**
