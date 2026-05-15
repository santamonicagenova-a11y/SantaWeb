# HANDOVER — Santamonica Web · Sessione di pianificazione strategica
**Versione:** v 2026.05.15.01
**Data:** 2026-05-15
**Tipo:** Pianificazione + revisione metodologica (non deploy codice)
**Continuazione di:** `HANDOVER_Santamonica_Web_v2026.05.14.01.md`

---

## 1. STATO ATTUALE

Sessione di **pianificazione strategica completa**. Zero deploy codice sito/admin. Output: piano operativo 12 mesi (maggio 2026 → maggio 2027) + revisione regola versioning + KB normalizzata.

### File prodotti questa sessione

| File | Tipo | Status |
|---|---|---|
| `ROADMAP_Santamonica_Web_v2026.05.15.02.md` | Roadmap consolidata (sostituisce versione 14-05) | ✅ consegnato |
| `METODO_Continuita_Progetti_v2026.05.15.01.md` | §6 riscritta con regola versioning v2 (sostituisce v 2026.05.13.01) | ✅ consegnato |
| 7 documenti continuità storici rinominati con versione | Propagazione retroattiva naming | ✅ consegnato |
| Memoria persistente Claude | Regola versioning v2 (estesa con naming file documenti di continuità) | ✅ aggiornata |

### Codice sito/admin: invariato dal 14-05

| File | Versione | Stato |
|---|---|---|
| `index.html` | v2026.05.09.07 | live GitHub Pages |
| `menu-admin.html` | v 2026.05.14.01 | live Vercel |
| `admin-core.js` | v 2026.05.14.02 | live Vercel |
| `admin-templates-shared.js` | v 2026.05.14.02 | live Vercel |
| `foto-optimizer.js` | v 2026.05.09.02 | live Vercel |
| `api/translate.js` | v 2026.05.14.01 | live Vercel |
| `translations.json` | 96 chiavi × 5 lingue | live GitHub Pages |
| `menu.html` / `menu-it.html` / `menu-{en,fr,de,es}.html` | rigenerati 14-05 | live GitHub Pages |

Nessuna modifica codice prevista entro fine sessione corrente.

---

## 2. DATI CHIAVE

### 2.1 Decisioni strategiche (40 punti)

| # | Tema | Decisione |
|---|---|---|
| **A1** | Lingue | IT + FR + EN (taglio DE + ES) |
| **A2** | Booking | Form Formspree attuale · TheFork in futuro · custom in backlog P4 (Quandoo chiude set 2026, opzione persa) |
| **A3** | Newsletter | Brevo · opt-in checkbox in form `#prenota` · form newsletter standalone rimosso |
| **Privacy/Cookie** | Compliance | Iubenda Cookie Solution standalone ~15€/anno · banner multilingua automatico · privacy testo riusato Wix corretto · solo IT (FR/EN linkano IT) · pagine `privacy.html` + `cookies.html` · sezione Candidature rimossa |
| **A4.1** | Schema | Schema.org Restaurant completo (address, geo, telephone, priceRange, servesCuisine, openingHours, hasMenu, sameAs, aggregateRating) |
| **A4.2** | Reviews | Custom via Vercel function `api/reviews.js` + Google Places API + Vercel KV cache 24h + cron refresh giornaliero |
| **A5** | Pesce del giorno | Rinviato in backlog P3/P4. Modello editoriale + implementazione (Telegram bot o Instagram source) da definire in attivazione |
| **A6** | Eventi | Pagina `eventi.html` + admin CRUD + `events.json` · archivio sempre visibile · Schema FoodEvent solo eventi futuri · link "Eventi" sempre nel nav · calendario set-mag, ogni 2-3 settimane (~18-25 eventi/anno) |
| **A7** | Gift cards | Sistema Stripe custom completo · lancio Natale 2026 · sviluppo set-ott · pagina `/regala.html` + `/voucher-termini.html` · Vercel function checkout + webhook · Vercel KV state · PDF auto · Brevo Transactional · admin desktop riscatto + opzionale mobile (b7c) |
| **A8** | Take-away | NO · escluso definitivamente |
| **A9.1** | Cantina | Pagina narrativa essenziale c1 (filosofia 2-3 paragrafi + 4-6 foto + numeri + link a `menu-vini.html`) · da zero, no import Wix |
| **A9.2** | Wine pairing | wp5 niente ora · wp4 (solo degustazione, 6 piatti × 1 vino) in backlog |
| **B1** | menu.html dup | Refactor JSON unica fonte di verità → fase 3 post-Natale 2026 |
| **B2** | Admin JS | Rimozione `admin-templates.js` legacy subito · consolidamento `admin-vendor.js` accoppiato a B1 |
| **B3** | Hosting sito | Migrazione GitHub Pages → Vercel contestuale switch DNS finale (FASE 2 ottobre 2026) |
| **B4** | Foto sito | Status quo 4 chiavi semantiche (hero, cucina_piatto, cucina_ingredienti, cantina) |
| **B5** | Galleria | Array flessibile 10 foto · masonry · drag-drop reorder · `gallery-photos.json` schema esteso `{src, srcThumb, alt, position}` |
| **B6** | Cache traduzioni | Vercel KV server-side → fase 3 post-Natale 2026 |
| **B7** | Mobile admin | Status quo desktop · pannello dedicato `admin-mobile.html` in backlog priorità minore (b7c accoppiabile a A7 ott 2026 se necessario) |
| **B8** | GitHub token | Fine-grained PAT subito (task fill 30 min) · scope Contents R/W solo repo SantaWeb · scadenza max 1 anno · calendar reminder |
| **B9** | Versioning automatico | Manuale come oggi · rivalutare in fase 3 se introduco build step |
| **B10.1-2** | Revisione traduzione | Professionale FR + EN (~250-400€ una tantum) |
| **B10.3** | Override layer | Sì costruirlo (`translations-override-fr.json` + `translations-override-en.json`) |
| **B10.4** | Timing revisione | Settembre-ottobre 2026 prima del lancio Natale |
| **C1** | Hero | Video loop (c1c) · risorsa interna genero videomaker · costo zero · 10-15s · MP4+WebM · poster fallback |
| **C2.1** | OG images | Multiple per sezione (homepage, /regala, /eventi, /cantina, /menu) |
| **C2.2** | OG eventi dinamici | Sì · foto evento → og:image auto-generata |
| **C3.1-2** | Mappa | Google Maps embed iframe semplice (no JS API custom) |
| **C3.3** | Posizionamento mappa | Sezione "Dove siamo" completa (indirizzo + tel cliccabile + mappa + indicazioni + parcheggio + trasporti) |
| **C4** | Footer versione | Rimossa dal pubblico, in commento HTML |
| **C5.1** | srcset/picture | Accoppiato a C1c (ott 2026) |
| **C5.2** | Formato img | AVIF + WebP fallback · 4 size (mobile 768w · tablet 1280w · desktop 1920w · thumb 400w) |
| **C5.3** | Estensione srcset | Graduale: foto sito + hero ott 2026 · galleria/eventi/altri in fase 3 (gen-feb 2027) |
| **C6.1** | Analytics | Umami self-hosted Vercel + Postgres free · sub-dominio `analytics.santamonicagenova.it` raccomandato |
| **C6.2** | Eventi custom | Tutti 9: `prenota_submit`, `newsletter_signup`, `gift_card_view`, `gift_card_checkout_start`, `gift_card_purchase`, `event_view`, `event_prenota_click`, `menu_view`, `lingua_switch` |
| **D1** | Filosofia stack | Custom continuo · utente + AI assistance · rivalutazione strategica primavera 2027 |
| **D2.1** | Ritmo esecuzione | Sprint serrato/aggressivo · flessibile sessione per sessione |
| **D2.2** | Switch DNS | Graduale via `nuovo.santamonicagenova.it` (sub-domain) + noindex test 1-2 settimane → switch finale |
| **D3** | Budget | 0€/mese ricorrenti (escluso Iubenda 15€/anno) · rivalutabile su richiesta |
| **D4** | Gestione regime | Solo utente + AI + manuale operativo da produrre in fase 1 |

### 2.2 Termini gift card (T1-T9, decisione A7)

| # | Termine | Scelta operativa |
|---|---|---|
| T1 | Validità | 12 mesi |
| T2 | Esclusioni temporali | Sabato sera + festivi grandi (24-25-26 dic, 1 gen, S.Valentino, Pasqua, Pasquetta, Ferragosto) |
| T3 | Importi | Fissi 50·80·100·150·200·300€ + custom 30-500€ |
| T4 | Resto se conto < voucher | Perso (no cambio) |
| T5 | Differenza se conto > voucher | Scelta acquirente in checkout via checkbox (dettagli UX da definire) |
| T6 | Trasferibilità | Al portatore (chi presenta il codice riscatta) |
| T7 | Cumulabilità | Non cumulabile con altre offerte |
| T8 | Rimborso | Sì entro 14gg (diritto recesso UE attivo, no consenso rinuncia esplicito) |
| T9 | Pre-scadenza | No email automatica |

### 2.3 Costi consolidati 12 mesi

| Voce | Tipo | Importo |
|---|---|---|
| Revisione traduzione professionale FR + EN | Una tantum | ~250-400€ |
| Iubenda Cookie Solution | Ricorrente annuo | ~15€ |
| Dominio santamonicagenova.it (Aruba) | Ricorrente annuo | ~15€ |
| Stripe gift cards | Variabile commissione | 1.5% + 0.25€/transazione |
| Tutto il resto (Vercel, GitHub, Brevo, DeepL, Google Places, Umami) | Free tier | 0€ |

### 2.4 Stack architetturale a regime

```
GitHub repo SantaWeb
  ├──► auto-deploy Vercel
  │     ├─ menu-admin.html (admin desktop)
  │     ├─ admin-mobile.html (futura, FASE 2)
  │     ├─ admin-core.js · admin-templates-shared.js · admin-translations.js · foto-optimizer.js
  │     └─ api/
  │         ├─ translate.js (proxy DeepL, env DEEPL_KEY)
  │         ├─ reviews.js (Google Places + KV cache 24h)
  │         ├─ newsletter.js (proxy Brevo, env BREVO_API_KEY)
  │         ├─ giftcard-checkout.js (Stripe Checkout)
  │         └─ giftcard-webhook.js (PDF + KV + Brevo email)
  │
  └──► GitHub Pages (fino a FASE 2) → poi Vercel
        ├─ index.html (homepage + form prenota + newsletter opt-in + recensioni + mappa + cantina link + eventi link + regala link)
        ├─ menu.html · menu-it.html · menu-fr.html · menu-en.html · menu-allergeni.html · menu-vini.html · menu-dolci-it.html · orario.html
        ├─ eventi.html (FASE 1)
        ├─ cantina.html (FASE 0)
        ├─ regala.html (FASE 0 informativo · FASE 2 checkout Stripe)
        ├─ voucher-termini.html (FASE 2)
        ├─ privacy.html · cookies.html (FASE 0)
        ├─ translations.json · translations-override-fr.json · translations-override-en.json
        ├─ site-images.json · gallery-photos.json · events.json
        ├─ sitemap.xml
        └─ img/ + img/sito/ + img/galleria/ + img/eventi/ + img/og/
```

### 2.5 Servizi esterni e credenziali richieste

| Servizio | Setup necessario | Env var (Vercel) |
|---|---|---|
| DeepL Free | Account · API key (già attivo) | `DEEPL_KEY` (già configurato) |
| Brevo | Account (già esistente) · API key · lista contatti tag "sito-web" | `BREVO_API_KEY` (da configurare FASE 0) |
| Iubenda Cookie Solution | Account ~15€/anno · scan sito | nessuna env (script integrato) |
| Google Cloud Places API | Project · enable Places API · API key restricted by referer | `GOOGLE_PLACES_API_KEY` (da configurare FASE 1) |
| Vercel KV | Provisioning gratuito | `KV_URL`, `KV_REST_API_*` auto-injected |
| Vercel Postgres (per Umami) | Provisioning gratuito | `POSTGRES_URL` auto-injected |
| Stripe | Account · payment methods UE · IBAN payout · webhook endpoint | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (FASE 2) |
| GitHub fine-grained PAT | Generazione token scope Contents R/W solo SantaWeb · scadenza max 1 anno | localStorage `gh_token` (browser, non env) |
| DNS Aruba | Pannello Gestione DNS dominio | n/a (record CNAME `nuovo.` + futuro A apex switch) |

---

## 3. CONTESTO ESSENZIALE

### 3.1 Architettura attuale operativa

- **Workflow admin**: utente accede `https://santa-web-peach.vercel.app/menu-admin.html` con token GitHub in `localStorage['gh_token']` · modifica menu/foto/eventi · click "Pubblica" → admin PUT contents API su repo GitHub → propagazione GitHub Pages 60-90s
- **Workflow traduzione**: admin invoca `chiamaDeepL()` per ogni voce IT × ogni lingua target · proxy via `api/translate.js` Vercel function · response cached in browser `TRANSLATIONS[lang]` · file lingua pubblicati con voci tradotte · gestione `falliti[]` con report + confirm
- **Workflow form prenotazione**: utente compila in `index.html`, validazione tel||email, submit POST a Formspree `mkopjnvq` con campo `tipo=standard|speciale|evento|voucher` come discriminator subject email
- **menu.html vs menu-it.html**: menu.html = IT pubblico SEO senza ctrl-bar (linkato da index.html), menu-it.html = IT admin/preview CON ctrl-bar noindex (URL che l'admin rilegge per editing). Iniezione SEO via helper `iniettaSeoITPubblico()` in admin-core.js

### 3.2 Convenzioni progetto

| Aspetto | Convenzione |
|---|---|
| Versioning file deploy | `v YYYY.MM.DD.NN` header + footer/UI · MAI nel nome file |
| Versioning documenti continuità | `v YYYY.MM.DD.NN` header + footer + **nel nome file** `NOMEFILE_vYYYY.MM.DD.NN.ext` |
| Foto WebP (oggi) | quality 0.90 full (1920-2400px) / 0.82 thumb (800px) |
| Foto da FASE 1 | AVIF + WebP fallback · 4 size (768w/1280w/1920w/400w) |
| Galleria (oggi) | 6 slot, schema `{src, srcThumb, alt}` |
| Galleria (da FASE 1) | 10 slot estendibili, schema `{src, srcThumb, alt, position}`, masonry |
| Foto sito | 4 chiavi fisse: hero · cucina_piatto · cucina_ingredienti · cantina |
| Endpoint Formspree | `mkopjnvq` (discriminator `tipo`) |
| Motore traduzione | DeepL via Vercel proxy (chiave env server-side) |
| Lingue (post-FASE 0) | IT (default) + FR + EN |
| GitHub auth admin | Token in `localStorage['gh_token']` · fine-grained PAT scope Contents R/W |
| Propagazione GitHub Pages | 60-90 sec |
| Propagazione Vercel | 30-60 sec |
| `<option value="">` form | Canonico in italiano (label tradotte via `data-i18n`) |
| Lazy loading | `loading="lazy"` + `decoding="async"` ovunque tranne hero |
| Schema.org | Restaurant (homepage) + FoodEvent (eventi futuri) + Menu (menu.html, già esistente) |
| Open Graph | Multiple immagini 1200×630 per sezione · dinamiche per eventi |

### 3.3 ⚠️ Regola operativa fissa (versioning)

Ogni file prodotto deve avere la versione aggiornata `v YYYY.MM.DD.NN`:
- **File deploy** (HTML/JS/CSS/JSON): versione in header + footer/UI · MAI nel nome file
- **Documenti di continuità** (handover, changelog, roadmap, manuali, metodologie): versione in header + footer + **nel nome file** `NOMEFILE_vYYYY.MM.DD.NN.ext`
- **Comportamento ad ogni release di documenti di continuità**: sostituzione (file vecchio rimosso dalla KB, sostituito dal nuovo)
- **Comunicare esplicitamente** la nuova versione quando si presenta un file
- **Propagare questa regola** in ogni futuro documento di continuità per garantirne la persistenza nelle sessioni future

Fonte canonical regola: `METODO_Continuita_Progetti_v2026.05.15.01.md` §6.

### 3.4 Catena documenti di continuità (KB pulita)

| File KB attuale | Tipo | Versione |
|---|---|---|
| `ROADMAP_Santamonica_Web_v2026.05.15.02.md` | Roadmap operativa 12 mesi | v 2026.05.15.02 |
| `METODO_Continuita_Progetti_v2026.05.15.01.md` | Metodologia continuità canonical | v 2026.05.15.01 |
| `CHANGELOG_Santamonica_Web_v2026.05.14.01.md` | Storico sessioni | v 2026.05.14.01 |
| `HANDOVER_FINALE_SantaWeb_v2026.05.02.01.md` | Sessione deploy iniziale | v 2026.05.02.01 |
| `HANDOVER_Santamonica_Web_v2026.05.09.01.md` | Sessione mattutina 09-05 | v 2026.05.09.01 |
| `HANDOVER_Santamonica_Web_v2026.05.09.02.md` | Sessione pomeridiana 09-05 (form prenotazione) | v 2026.05.09.02 |
| `HANDOVER_Santamonica_Web_v2026.05.13.01.md` | Sessione font stampa | v 2026.05.13.01 |
| `HANDOVER_Santamonica_Web_v2026.05.14.01.md` | Sessione proxy DeepL + SEO | v 2026.05.14.01 |
| **`HANDOVER_Santamonica_Web_v2026.05.15.01.md`** (questo) | Sessione pianificazione strategica | v 2026.05.15.01 |

### 3.5 Errori noti pre-FASE 0 (da correggere come task F0.5)

| ID | Posizione | Errore |
|---|---|---|
| E1 | Privacy Wix sezione G (Newsletter) | mailto: `privacy@davittorio.com` → corretto: `santamonicagenova@gmail.com` |
| E2 | Privacy Wix sezione A | Stesso mailto sbagliato |
| Cookie Wix C1 | Cookie Policy attuale Wix | Cita `joomla_user_state` (Wix non usa Joomla, template copia-incolla errato). Da scartare totalmente; Iubenda genererà nuova cookie policy auto dopo scan |

### 3.6 Dati operativi da raccogliere (chiedere all'utente in FASE 0)

- Indirizzo postale completo (via, numero civico, CAP) per Schema + sezione "Dove siamo"
- Coordinate GPS latitudine/longitudine
- Numero di telefono formato internazionale (es. `+39 010 ...`)
- Orari di apertura per ogni giorno (lunedì chiuso? cucina mezzogiorno + sera?)
- Cucine servite (Italian, Seafood, Ligurian, Mediterranean)
- Price range (€/€€/€€€/€€€€)
- URL Instagram + Facebook
- Place ID Google Maps di Santamonica (per `api/reviews.js`)
- Credenziali pannello Aruba per gestione DNS
- Account Iubenda da creare (~15€/anno)
- Account Google Cloud Console (per Places API)
- Account Stripe da creare (in fase 2)

---

## 4. PROSSIMI PASSI

### 4.1 KB cleanup (azione immediata utente, prima della prossima sessione)

Sostituire nella Knowledge Base del Progetto Claude:

| Rimuovere | Aggiungere |
|---|---|
| `ROADMAP_Santamonica_Web.md` (vecchia, senza versione) | `ROADMAP_Santamonica_Web_v2026.05.15.02.md` |
| `METODO_Continuita_Progetti.md` | `METODO_Continuita_Progetti_v2026.05.15.01.md` |
| `CHANGELOG_Santamonica_Web.md` | `CHANGELOG_Santamonica_Web_v2026.05.14.01.md` |
| `HANDOVER_FINALE_SantaWeb_2026-05-02.md` | `HANDOVER_FINALE_SantaWeb_v2026.05.02.01.md` |
| `HANDOVER_Santamonica_Web_2026-05-09.md` | `HANDOVER_Santamonica_Web_v2026.05.09.01.md` |
| `HANDOVER_Santamonica_Web_2026-05-09_v2.md` | `HANDOVER_Santamonica_Web_v2026.05.09.02.md` |
| `HANDOVER_Santamonica_Web_2026-05-13.md` | `HANDOVER_Santamonica_Web_v2026.05.13.01.md` |
| `HANDOVER_Santamonica_Web_2026-05-14.md` | `HANDOVER_Santamonica_Web_v2026.05.14.01.md` |
| — | **`HANDOVER_Santamonica_Web_v2026.05.15.01.md`** (questo file, nuovo) |

### 4.2 FASE 0 — MVP switch DNS (target: 2-3 settimane, inizio giugno 2026)

Sequenza task ordinata. Riferimento dettaglio: `ROADMAP_Santamonica_Web_v2026.05.15.02.md` §1.

| Task | Sforzo | Dipendenze |
|---|---|---|
| **F0.1** Setup `nuovo.santamonicagenova.it` su Aruba + GitHub Pages (CNAME, file CNAME repo, SSL, noindex meta) | S | DNS Aruba |
| **F0.2** Taglio lingue DE + ES (chiavi translations.json, file menu, admin-core.js, admin-translations.js, language switcher) | M | — |
| **F0.3** Rimozione `admin-templates.js` legacy + footer versione in commento HTML | XS | — |
| **F0.4** Fine-grained PAT GitHub (scope Contents R/W repo SantaWeb · scadenza max 1 anno) | XS | — |
| **F0.5** Pagine legali Privacy + Cookie IT (riuso testo Wix corretto, errori E1+E2 fix, fornitori terzi aggiornati, candidature rimossa) | M | — |
| **F0.6** Setup Iubenda Cookie Solution (account, scan, script integration) | S | account Iubenda |
| **F0.7** Schema.org Restaurant in `index.html` (JSON-LD completo, validazione Rich Results Test) | M | dati ristorante da utente |
| **F0.8** Sezione "Dove siamo" + Google Maps embed (iframe + indirizzo + tel + indicazioni + parcheggio + trasporti + Iubenda blocco) | M | dati indirizzo + GPS |
| **F0.9** Pagina `cantina.html` narrativa essenziale (2-3 paragrafi + 4-6 foto + numeri + link `menu-vini.html`) | M | testo + foto |
| **F0.10** Pagina `regala.html` informativa minima (descrizione voucher + termini abbreviati + CTA "contatta il ristorante") | S | testo voucher |
| **F0.11** Newsletter Brevo opt-in nel form `#prenota` (rimozione form standalone, Vercel function `api/newsletter.js`, chiave i18n `prenota_f_newsletter`) | M | API Brevo |
| **F0.12** Redirect 301 da URL Wix → URL nuovi (`/menù`, `/cantina`, `/regala`, `/contatti`, `/filosofiadicucina`, `/privacy-policy`, `/copia-di-cookies`) | S | scelta hosting |
| **F0.13** Submit sitemap nuovo a Google Search Console | XS | sitemap aggiornata |
| **F0.14** Test E2E (mobile + desktop + 3 lingue + tutti i form + mappa + banner + opt-in) | M | F0.1-F0.11 complete |
| **F0.15** 🚀 **Switch DNS finale** (Aruba A record apex + rimozione noindex + canonical + redirect 301 + Wix backup 30gg) | S | F0.14 ok |

**Sforzo totale FASE 0**: ~8-10 sessioni dense.

### 4.3 Sequenza prossime fasi (riferimento solo, dettaglio in ROADMAP)

| Fase | Periodo | Output principale |
|---|---|---|
| F1 — Build feature non-Stripe | giu-ago 2026 | Eventi · Reviews · video hero · galleria masonry · OG · Umami · srcset foto sito · manuale operativo |
| F2 — Traduttori + Stripe | set-ott 2026 | Revisione FR+EN · override layer · sistema gift cards Stripe completo · migrazione Vercel · switch DNS finale → Vercel |
| F3 — Lancio Natale | nov-dic 2026 | Campagna gift cards attiva · monitoring · gestione riscatti |
| F4 — Refactor consolidamento | gen-feb 2027 | JSON unica fonte di verità menu · cache traduzioni · admin-vendor.js · srcset esteso |
| F5 — Rivalutazione | primavera 2027+ | Filosofia stack · TheFork return · pesce del giorno · wine pairing · altre opzioni backlog |

### 4.4 Decisioni operative ancora aperte (chiarire all'inizio FASE 0)

| # | Decisione | Note |
|---|---|---|
| 1 | T5 UX exact: checkbox "Il destinatario può aggiungere extra al ristorante" (opt-in) vs voucher all-inclusive with cap | Definire in sessione design pagina `/regala.html` (FASE 2) · prima interpretazione raccomandata |
| 2 | Frequenza pubblicazione newsletter Brevo | Decisione editoriale tua (1-2 email/mese suggerito) · non bloccante |
| 3 | Foto OG signature per homepage (`og-home.jpg`) | Da scegliere/scattare · può attendere FASE 1 |
| 4 | Eventuale partner traduttore FR + EN (Proz, Upwork, contatti locali Genova) | Cercare in agosto 2026 prima di FASE 2 |
| 5 | Place ID Google Maps Santamonica | Necessario per F0.8 e F1.2 · ottenibile da Google Maps URL |
| 6 | Eventuale futuro pannello mobile riscatto voucher | Decisione automatica: accoppiato a A7 se senti che il riscatto da PC è troppo scomodo (decidere in nov-dic 2026) |

---

## 5. ALLEGATI / RIFERIMENTI

### File chiave per riprendere il lavoro

| File | Scopo |
|---|---|
| `ROADMAP_Santamonica_Web_v2026.05.15.02.md` | Piano dettagliato 12 mesi · sequenza task fase per fase · costi · backlog |
| `METODO_Continuita_Progetti_v2026.05.15.01.md` | Metodologia handover/CHANGELOG/regola versioning |
| `HANDOVER_Santamonica_Web_v2026.05.14.01.md` | Ultimo stato tecnico codice deploy (proxy DeepL, SEO inversione, ecc.) |
| `CHANGELOG_Santamonica_Web_v2026.05.14.01.md` | Storico sessioni precedenti |
| `HANDOVER_Santamonica_Web_v2026.05.15.01.md` | Questo file · stato sessione strategia + decisioni A/B/C/D + prossimi passi |

### Repo e ambienti

- **GitHub repo**: `github.com/santamonicagenova-a11y/SantaWeb`
- **Admin live**: `https://santa-web-peach.vercel.app/menu-admin.html`
- **Sito staging** (post-F0.1): `https://nuovo.santamonicagenova.it`
- **Sito live attuale** (Wix, da dismettere): `https://www.santamonicagenova.it`
- **Sito live finale** (post-F0.15): `https://santamonicagenova.it`

---

**Fine handover · v 2026.05.15.01**
