# ROADMAP — Santamonica Web

**Versione documento:** v 2026.05.19.04
**Versione roadmap (interna):** v.14
**Aggiornato:** 2026-05-19
**Continuazione di:** ROADMAP v.13 (`ROADMAP_Santamonica_Web_v2026.05.19.01.md`)

---

## 1. FASE 0 — Switch hosting Cloudflare + foundation tecnica + compliance DIY (oggi → fine giugno 2026)

**Obiettivo:** portare il nuovo sito live su `santamonicagenova.it` (Cloudflare Pages) sostituendo Wix.

**Tempo stimato residuo:** ~5-7 sessioni.

### Stato FASE 0 — aggiornamento 2026-05-19 (sera tardi, post-chiusura F0.9 + F0.10 + F0.11)

| # | Task | Status | Sforzo residuo | Note |
|---|---|---|---|---|
| F0.0 | HMAC salt generato | ✅ chiuso 17-05 mattina | — | Salvato in Bitwarden |
| F0.0** | Repo `SantaWeb` privato | ⏳ post-F0.21 | XS | Solo dopo switch DNS |
| F0.1 | Cloudflare account + Pages | ✅ chiuso 17-05 mattina | — | 2FA TOTP attivo |
| F0.2 | Porting `functions/api/translate.js` | ✅ chiuso 17-05 mattina | — | Live |
| F0.3 | Setup `nuovo.santamonicagenova.it` staging | ✅ chiuso 17-05 notte+2 | — | DNS via Wix (dec. #16) · `X-Robots-Tag` ✅ |
| F0.3bis | Cloudflare Email Routing | ⏳ rimandata a F0.21 (dec. #19) | XS (~10 min) | Da fare via Wix DNS — include alias `privacy@santamonicagenova.it`. **Nota 19-05**: `info@santamonicagenova.it` risulta GIÀ attiva (precisazione utente). Altre @santamonicagenova.it da attivare con Email Routing |
| F0.4 | Taglio lingue DE + ES | ✅ chiuso 17-05 notte | — | Loop 3 passate · 5 file |
| F0.5 | Refactor JSON menu | ⏳ posticipato F1.0 | — | — |
| F0.6 | Rimozione `admin-templates.js` legacy + footer versione | ✅ chiuso 17-05 notte+1 | — | Cleanup completo |
| F0.6bis | Migrazione fetch admin GH Pages → CF Pages | ✅ chiuso 17-05 notte+2 | — | Refactor `BASE_FETCH_URL` · 8 occorrenze · test OK |
| F0.7 | Fine-grained PAT GitHub | ✅ chiuso 17-05 sera | — | Token scope `Contents R/W` solo SantaWeb, scadenza 2027-05-17 |
| F0.8 | 🟡 SOSPESA — Revisione legale privacy+cookies | ⏳ indefinita | — | Decisione utente |
| **F0.9** | **Setup vanilla-cookieconsent v3 (bundle locale) + integrazione + chiusura post-verifica** | **✅ CHIUSO al 100% definitivo (19-05 sera tardi)** | — | **Verifica funzionale utente OK. F0.9-post in unica release coordinata: cookieconsent-config.js v 2026.05.19.02 (target=_blank 15 link policy + hideFromBots + autoShow !isPolicyPage), privacy.html v 2026.05.19.02 (bottone cc-manage §12), cookies.html v 2026.05.19.02 (bump coordinato). Dec. #22 nuova** |
| F0.9-post (residui) | Tweak rimanenti P3 backlog | 🟡 backlog, parziali integrati a F0.12/F0.18 | XS-S | P3.1 closeIconLabel test, P3.6 disablePageInteraction, P3.11 flipButtons, P3.12 cross-tab cookie, P3.19 wording — vedi §10 |
| **F0.10** | **Pagina `regala.html` informativa minima** | **✅ CHIUSO al 100% tecnico (19-05 sera tardi)** | — | **regala.html v 2026.05.19.03 prima emissione: 3 tagli (100/150/200€), validità 6 mesi, form Formspree, T5 opt-in marketing presente. Dec. #23 nuova. TODO operativi non bloccanti: endpoint Formspree reale + testi descrittivi placeholder (memoria #5 final check)** |
| **F0.11** | **Schema.org Restaurant + sezione Dove siamo** | **✅ CHIUSO al 100% tecnico (19-05 sera tardi)** | — | **index.html v 2026.05.19.04 (Schema.org JSON-LD refactor a ItalianRestaurant con @id + dati TARGET + link "Dettagli completi" in #info + coordinate OSM allineate), dove-siamo.html v 2026.05.19.04 NUOVO (mobile-first, OSM iframe D13b, click-to-action, orari highlight giorno corrente). Dec. #24 nuova. TODO non bloccanti: logo URL + foto hero (placeholder), allineamento orari/email #info al check pre-F0.21** |
| F0.12 | Embed Google Maps + Iubenda block / iframemanager | ⏳ aperto | M+ | F0.9 ✅ prerequisito (categoria `embeds` predisposta). **Include**: P3.3 audit regex cookie Maps · P3.9 tabella durata cookie cookies.html · P3.10 trasferimento extra-UE in preferencesModal · P3.14 implementazione no-iframe-hardcoded · P3.16 decisione label "Google Maps" service · rimozione disclaimer P3.22c · bump `revision: 2` (dec. #20) · sostituzione iframe OSM in dove-siamo.html + index.html con Google Maps gestito da consent |
| F0.13 | Stripe Payment Links account + 6 link | ⏳ aperto | S+ | account Stripe IT + IBAN. **Include**: rimozione disclaimer P3.22c dalle policy. **F0.10 dipendenza inversa**: dopo F0.13, il form Formspree di regala.html va sostituito con 3 bottoni acquisto diretto Stripe Payment Links |
| F0.14 | voucher-termini.html | ⏳ aperto | S | testo termini DIY · F0.10 ✅ link target già attivo da regala.html (404 temporaneo accettato dec. #23) |
| F0.15 | Newsletter Brevo opt-in + audit log HMAC | ⏳ aperto | L | API Brevo + `CONSENT_HMAC_SALT` (✅ generato F0.0). **Include**: P3.7 audit log consenso server-side · P3.18 auditabilità reversa |
| F0.16 | Redirect 301 nativi via `_redirects` | ⏳ aperto | S | F0.1 ✅ · estendere `_redirects` esistente |
| F0.17 | Sitemap.xml + hreflang multilingua | ⏳ aperto | XS | URL stabilizzati · ora include anche `/regala.html` (F0.10) e `/dove-siamo.html` (F0.11) e `/voucher-termini.html` (F0.14) |
| F0.18 | CSP + security headers via `_headers` | ⏳ aperto | S | F0.1 ✅ · **anticipo possibile**: P3.4 CSP minima · include P3.20 mitigazione cookie injection |
| F0.19 | TTL DNS ridotto a 300s | ⏳ aperto | XS | 48h pre-switch · via Wix DNS (dec. #16) |
| F0.20 | Test E2E completo + correzioni | ⏳ aperto | M | F0.3-F0.19 ✅ |
| F0.21 | 🚀 Switch DNS finale + Email Routing + FINAL CHECK info | ⏳ aperto | M | F0.20 ✅ + TTL 300s 48h · include F0.3bis attivazione · switch NS Wix→Cloudflare. **Pre-go-live checklist obbligatorio**: (1) P3.15 verifica `mailto:privacy@...` con 3 invii prova (dec. #19), (2) **FINAL CHECK INFO (dec. #25)** — allineare orari/email/telefono/indirizzo/voucher/prezzi su tutte le pagine del sito (index.html sezione #info + translations.json + dove-siamo.html + regala.html + privacy.html + cookies.html). Dati TARGET inseriti durante staging vs realtà al momento del go-live. (3) Rich Results Test su URL live una volta rimosso noindex (V5 differito) |

**Sforzo totale residuo FASE 0:** ~5-7 sessioni.

### Sequenza ottimale prossime 4 sessioni (aggiornata 19-05 sera tardi)

| Sessione | Item | Sforzo | Note |
|---|---|---|---|
| Prossima | **F0.12 (Maps + iframemanager)** — pacchetto P3.3/P3.9/P3.10/P3.14/P3.16 + bump `revision: 2` + sostituzione iframe OSM con Google Maps gestito da consent | M+ (~3h) | F0.9 ✅ prerequisito · embed in index.html + dove-siamo.html · disclaimer P3.22c da rimuovere |
| +1 | **F0.13 (Stripe Payment Links)** + **F0.14 (voucher-termini.html)** — rimozione disclaimer P3.22c dalle policy + sostituzione form Formspree con bottoni Stripe in regala.html | S+ + S | account Stripe IT + IBAN · termini DIY |
| +2 | **F0.16 (redirect 301)** + **F0.17 (sitemap + hreflang)** | S + XS | URL stabili, mapping Wix → CF Pages |
| +3 | **F0.18 (CSP + security headers)** + **F0.15 (newsletter Brevo + audit log)** | S + L | scudo prima del go-live · F0.15 può anche essere isolata in propria sessione se troppo |

In alternativa, **P3.4 CSP minima anticipato** può essere inserito nella prossima sessione come pre-task di F0.12 (1h aggiuntiva, scudo prima dell'apertura embeds esterni).

---

## 2. FASE 1 — Build feature non-Stripe + refactor JSON (luglio → agosto 2026)

**Obiettivo:** completare funzionalità del nuovo sito e consolidare debito tecnico JSON menu.

**Tempo stimato:** 8-10 sessioni in 2 mesi.

### Task FASE 1

| # | Task | Sforzo |
|---|---|---|
| F1.0 | Refactor JSON menu unica fonte verità | L |
| F1.1 | Pagina `eventi.html` + `events.json` | M |
| F1.2 | Reviews custom via Pages Function + Google Places API + KV cache + Worker cron daily | L |
| F1.3 | Video hero homepage | S |
| F1.4 | Gallery masonry refactor | M |
| F1.5 | OG dedicate per pagina | S (include foto signature `og-home.jpg` — dec. aperta #7) |
| F1.6 | Cloudflare Web Analytics → eventuale upgrade Umami self-hosted (bump `revision: 3` + categoria `analytics` attivata, dec. #20) | S |
| F1.7 | srcset esteso foto sito | M |
| F1.8 | Manuale operativo voucher PDF | M (extra-tecnico) |

---

## 3. FASE 2 — Coordinamento traduttore + finalizzazione gift cards (settembre → ottobre 2026)

**Obiettivo:** lanciare campagna Natale.

**Tempo stimato:** 4-5 sessioni in 2 mesi.

### Task FASE 2

| # | Task | Sforzo | Dipendenze |
|---|---|---|---|
| F2.1 | Override layer FR + EN tecnico | M | — |
| F2.2 | 🟡 Coordinamento traduttore professionale FR + EN. **Include**: privacy.html · cookies.html · banner cookie (3 lingue già in cookieconsent-config.js da revisionare) · disclaimer P3.22c residui · regala.html (F0.10) · dove-siamo.html (F0.11) · voucher-termini.html (F0.14) | tempo coord. + ~300-450€ | F2.1 + content stabilizzato |
| F2.3 | Finalizzazione gift cards Stripe Payment Links | S | F0.13 + F2.2 |
| F2.4 | Template voucher PDF | XS | logo + foto |
| F2.5 | Registro voucher Google Sheets (2FA obbligatorio) | XS | template |
| F2.6 | 🟡 Privacy policy update fornitori finalizzati | XS | privacy DIY |
| F2.7 | Strategie marketing pre-lancio | S (extra-tecnico) | — |

---

## 4. FASE 3 — Lancio Natale + campagna (novembre → dicembre 2026)

**Obiettivo:** lanciare campagna gift card.

**Tempo stimato:** 2-3 sessioni monitoring/fix.

| # | Task | Sforzo |
|---|---|---|
| F3.1 | Push campagna pre-Natale | extra-tecnico |
| F3.2 | Monitoring quotidiano Stripe + CF Analytics | XS/giorno |
| F3.3 | Workflow operativo voucher | extra-tecnico |
| F3.4 | Gestione riscatti al ristorante | extra-tecnico |
| F3.5 | Hotfix critici | variabile |
| F3.6 | Post-mortem campagna gennaio | S |

---

## 5. FASE 4 — Refactor consolidamento (gennaio → febbraio 2027)

| # | Task | Sforzo |
|---|---|---|
| F4.1 | Consolidamento admin JS → `admin-vendor.js` | M |
| F4.2 | Cache traduzioni server-side hash content-addressable (CF KV) | S |
| F4.3 | srcset/picture + AVIF estensione | M |
| F4.4 | Migrazione PAT GitHub da `localStorage` a env CF Pages Function | M (bloccato F0.0** repo privato) |
| F4.5 | Trigger cancellazione automatica prenotazioni Formspree > 90 giorni | S (include anche form voucher da F0.10) |

---

## 6. FASE 5 — Rivalutazione strategica + nice-to-have (primavera 2027+)

| Item | Tipo |
|---|---|
| Filosofia stack (D1) | rivalutazione |
| Sistema booking custom (A2) | rivalutazione |
| TheFork ritorno (A2) | task condizionale |
| Sistema voucher automatizzato (volume > 100/anno) | feature |
| Wine pairing dinamico (A5-A9) | feature backlog |
| Pesce del giorno (A5) | feature backlog |
| 🟡 Ripresa F0.8 revisione legale privacy/cookies | task condizionale |
| Investigazione causa root scollegamento GH Pages source 17-05 | task condizionale (solo se si ripete) |
| Investigazione causa root "sessioni fantasma" (5 episodi storici) | task metodologico (no nuovi episodi nella sessione 19-05 sera tardi) |
| **Decisioni interpretative cookie banner** (P3.6 `disablePageInteraction`, P3.11 `flipButtons`, P3.19 neutralizzazione wording) | backlog interpretativo / cosmetico |

---

## 7. ARCHITETTURA TARGET (post-F0.21)

```
santamonicagenova.it  (Cloudflare Pages — DNS via Cloudflare nameserver)
  ├─ sito statico tutto:
  │   ├─ index.html (homepage + Schema.org ItalianRestaurant JSON-LD)
  │   ├─ menu pubbliche (IT/EN/FR + dolci/allergeni/vini)
  │   ├─ cantina (sezione integrata in index.html)
  │   ├─ regala.html (voucher informativa F0.10)
  │   ├─ voucher-termini.html (F0.14)
  │   ├─ dove-siamo.html (mappa + contatti F0.11)
  │   ├─ eventi.html (F1.1)
  │   ├─ privacy.html · cookies.html
  │   └─ (post F2.2) layer override EN/FR su tutte le pagine
  ├─ lib/cookieconsent/  (bundle locale vanilla-cookieconsent v3)
  ├─ cookieconsent-config.js  (config IT/EN/FR · 2-3 categorie a seconda fase · F1.6 → analytics)
  ├─ functions/api/translate.js  → /api/translate (DeepL proxy)
  ├─ functions/api/reviews.js    → /api/reviews   (Google Places + KV cache)
  ├─ functions/api/newsletter.js → /api/newsletter (Brevo proxy + HMAC audit log)
  ├─ functions/api/voucher.js    → /api/voucher (post F0.13, alternativa a Formspree)
  ├─ functions/api/consent.js    → /api/consent (audit log server-side cookie consensi · P3.7/P3.18, F0.15)
  ├─ _headers (CSP + security + X-Robots-Tag rimosso post-F0.21 · include P3.4 anticipato)
  ├─ _redirects (301 da URL Wix)
  └─ sitemap.xml + hreflang IT/FR/EN (include regala, dove-siamo, voucher-termini, eventi)

CONVENZIONI ARCHITETTURALI (dec. #20-#25):
  - Bump `revision` cookieconsent solo per modifiche sostanziali policy (no refactor formale)
  - Embed terze parti SEMPRE iniettati via JS condizionato dal callback `onConsent`
    (mai <iframe> hardcoded in HTML statico) — applicabile da F0.12
  - Convenzione TARGET vs operative: durante staging si inseriscono i dati che
    saranno effettivi al go-live (orari, email, prezzi). FINAL CHECK pre-F0.21
    obbligatorio (dec. #25, memoria operativa #5)

Servizi terzi:
  ├─ Brevo (newsletter)
  ├─ Stripe (gift cards Payment Links)
  ├─ Google Places API (recensioni)
  ├─ DeepL Free (traduzioni admin)
  ├─ Formspree (prenotazioni form + voucher form pre-F0.13)
  └─ Google Drive (registro voucher S.r.l. "2FA obbligatorio")
```

### Servizi esterni e credenziali

| Servizio | Setup | Env var Cloudflare | Fase |
|---|---|---|---|
| Cloudflare account | ✅ attivo + 2FA TOTP | — | ✅ F0.1 |
| DeepL Free | ✅ API key (migrato da Vercel) | `DEEPL_KEY` ✅ | ✅ F0.2 |
| HMAC salt | ✅ generato Bitwarden | `CONSENT_HMAC_SALT` (injection F0.15) | ✅ F0.0 |
| Wix DNS | Pannello esistente | — | F0.3 ✅ · F0.21 (switch NS) |
| Cloudflare Email Routing | Attivazione free + alias `privacy@`, ecc. (`info@` già attiva) | — | F0.3bis (rimandata a F0.21) · checklist dec. #19 + #25 |
| Brevo | API key + lista + template | `BREVO_API_KEY` | F0.15 |
| Google Places API New | Project + key restricted | `GOOGLE_PLACES_API_KEY` | F1.2 |
| Stripe | Account IT + payment methods UE + IBAN + 6 Payment Links | nessuna env | F0.13 |
| Formspree | Account già attivo (`F4.5` riferimento prenotazioni); endpoint dedicato voucher da configurare | — | F0.10 ✅ (endpoint placeholder) · F4.5 |
| GitHub fine-grained PAT | ✅ Scope `Contents R/W` solo SantaWeb · scadenza 2027-05-17 | localStorage `gh_token` (F0-F3) → env Function (F4.4) | ✅ F0.7 |
| ~~Avvocato revisione privacy~~ | — | — | 🟡 F0.8 sospesa |

---

## 8. DECISIONI OPERATIVE APERTE (cumulative)

| # | Decisione | Default/Esito | Stato |
|---|---|---|---|
| 1 | F0.9 banner cookieconsent DIY senza F0.8 | SÌ | ✅ confermato |
| 2 | Go-live `privacy.html` + `cookies.html` DIY | SÌ | ✅ confermato (effettivo post-upload F0.21) |
| 3 | F2.2 traduzione privacy/cookies + nuove pagine (regala, dove-siamo, voucher-termini) FR/EN su DIY | SÌ | ⏳ da confermare prima di F2.2 |
| 4 | F0.8 declassata a backlog "sospeso" | SÌ | ✅ formalizzato |
| 5 | T5 UX exact (checkbox extra ristorante vs voucher cap) | checkbox opt-in | ✅ confermato e applicato in F0.10 (dec. #23) |
| 6 | Frequenza pubblicazione newsletter Brevo | 1-2 email/mese | ⏳ editoriale |
| 7 | Foto OG signature homepage (`og-home.jpg`) | — | ⏳ F1.5 (Schema.org index.html attualmente usa placeholder URL) |
| 8 | Place ID Google Maps Santamonica | `ChIJGzMzZqlD0xIRKRomfkk1F2c` | ✅ confermato e applicato in F0.11 (dec. #24) |
| 9 | F0.3bis Email Routing — anticipare o attendere F0.21? | Attendere F0.21 | ✅ confermato (`info@` già attiva — precisazione utente 19-05) |
| 10 | F0.6bis (URL fetch admin) | inserire dopo F0.6 | ✅ chiuso 17-05 notte+2 |
| 11 | Issue GH Pages source scollegamento — investigare causa root? | No, nota in CHANGELOG | ✅ confermato |
| 12 | URL target F0.6bis: `pages.dev` o custom domain? | `santamonica-web.pages.dev` | ✅ confermato |
| 13 | File fisici `menu-de.html`/`menu-es.html`/etc rimozione | lasciare fino F0.21 | ✅ confermato |
| 14 | `_redirects` estensione con redirect da URL Wix | in F0.16 | ✅ confermato |
| 15 | File con suffisso `-FIXED`/`-OLD`/`-BACKUP`/`-COPY` | vietati in repo | ✅ confermato |
| 16 | DNS authoritative dominio | Wix (`ns14/15.wixdns.net`) | ✅ confermato |
| 17 | `admin-templates-shared.js` (template pagine menu) banner cookie F0.9 | SKIP | ✅ confermato |
| 18 | Mantenere `revision: 1` o partire da `0`? | `1` come start (scelta cosmetica, bumpare a `2` con F0.12/F1.6) | ✅ confermato P2#2 |
| 19 | Email `privacy@santamonicagenova.it` non ancora attiva (F0.21 Email Routing) | Declassata a checklist pre-go-live F0.21 | ✅ confermato P2#6 |
| 20 | Convenzione bump `revision` cookieconsent | Solo per modifiche sostanziali policy (nuove categorie, nuovi trattamenti, nuovi soggetti terzi). Refactor formale = no bump | ✅ confermato P3.13 |
| 21 | Convenzione embed di terze parti F0.12+ | Sempre JS+callback `onConsent`, mai `<iframe>` hardcoded in HTML | ✅ confermato P3.14 |
| Convenzione operativa | **Consegna file da Claude** | Sempre file interi (outputs + present_files), MAI patch o frammenti before-after. Memoria persistente Claude aggiornata | ✅ memorizzato 19-05 (#4) |
| P3.22 | Stripe + Google Maps nelle policy mentre F0.12/F0.13 non attivi | Opzione (c) — disclaimer "stato attuale di sviluppo" in privacy.html §12 + cookies.html §4. Rimozione disclaimer a F0.12/F0.13 | ✅ confermato e applicato 19-05 |
| **22 (nuova)** | **F0.9-post chiusura · pacchetto release coordinato v 2026.05.19.02** | **target=_blank rel=noopener noreferrer su tutti i 15 link policy (5 IT + 5 EN + 5 FR) del cookieconsent-config (bug fix UX scoperto in verifica funzionale, coerenza convenzione index.html) + P3.5 `hideFromBots: true` esplicito (default v3 dichiarato per robustezza) + P3.8 `autoShow: !isPolicyPage` con detection regex `/privacy.html` o `/cookies.html` (opzione b: paradosso UX evitato) + bottone `.cc-manage` con `data-cc="show-preferencesModal"` aggiunto in privacy.html §12 (cookies.html lo aveva già da v 2026.05.17.02)** | **✅ applicato e in produzione 19-05** |
| **23 (nuova)** | **F0.10 — specifiche regala.html informativa voucher** | **Tagli: 100/150/200 € (A1 opt-c modificata) · validità: 6 mesi (A3 opt-b) · CTA pre-F0.13: form Formspree richiesta nome+email+phone+taglio+occasione+marketing_consent+honeypot (B1 opt-b) · T5 checkbox opt-in marketing presente nel form NON pre-spuntato (B2 opt-a) · solo italiano per ora (C1 opt-a) · stessa palette legal pages privacy/cookies (C2 opt-a) · link a /voucher-termini.html anche con 404 temporaneo accettato fino a F0.14 (D1 opt-a) · banner cookie integrato con auto-show abilitato (non è policy page) (D2 opt-a)** | **✅ applicato regala.html v 2026.05.19.03** |
| **24 (nuova)** | **F0.11 — architettura Schema.org Restaurant + Dove siamo** | **Schema.org `@type: ItalianRestaurant` (M5 opt-b) duplicato in index.html `<head>` + dove-siamo.html `<head>` con `@id: https://santamonicagenova.it/#restaurant` per linking semantico tra le due. Range prezzi €€€ (M6 opt-c). Coordinate GPS estratte dal Google Maps URL: 44.3913353, 8.9646575. Mappa pre-F0.12: iframe OpenStreetMap (D13 opt-b) – no cookie tracker. Pagina dedicata `/dove-siamo.html` mobile-first + sezione homepage `#info` con link "Dettagli completi" (D12 opt-c interpretato come "fai responsive ottimizzata mobile"). Place ID Google: `ChIJGzMzZqlD0xIRKRomfkk1F2c` (dec. #8). servesCuisine array `["Italian","Seafood","Ligurian"]`. acceptsReservations true. Mantenuti campi ricchi pre-esistenti (employee Chef+Sommelier, award Michelin, currenciesAccepted, paymentAccepted, menu)** | **✅ applicato index.html + dove-siamo.html v 2026.05.19.04** |
| **25 (nuova)** | **Convenzione TARGET vs operative durante staging** | **Il sito in costruzione (CF Pages staging) NON è quello live (Wix). Convenzione: inserire i dati TARGET pre-go-live (orari in vigore da giugno 2026 = Mar-Ven solo cena 19:30-22:30 + Sab-Dom pranzo+cena · email info@santamonicagenova.it = già attiva, altre @santamonicagenova.it da attivare con Email Routing F0.21). Discrepanze con info live attuali su Wix sono attese e accettabili durante staging. **FINAL CHECK obbligatorio pre-F0.21 go-live** su tutte le info "operative" del sito vs realtà al momento: orari ristorante, email, telefono, indirizzo, voucher tagli/validità, prezzi. Aggiungere voce dedicata a checklist F0.21 (vedi §1 F0.21 punto 2). Memoria persistente #5 salvata in Claude per propagazione cross-sessione** | **✅ memorizzato e applicato 19-05** |

---

## 9. SEQUENZA OPERATIVA CONSIGLIATA PROSSIME 4 SESSIONI

| Sessione | Item | Sforzo | Note |
|---|---|---|---|
| Prossima | F0.12 (Maps + iframemanager) — pacchetto P3.3/P3.9/P3.10/P3.14/P3.16 + bump `revision: 2` + sostituzione iframe OSM con Google Maps gestito da consent in index.html + dove-siamo.html + rimozione disclaimer P3.22c | M+ | F0.9 ✅ prerequisito · valutare anticipo P3.4 CSP minima come pre-task (1h aggiuntiva) |
| +1 | F0.13 (Stripe Payment Links) + F0.14 (voucher-termini.html) — rimozione disclaimer P3.22c residui · sostituzione form Formspree con bottoni Stripe in regala.html | S+ + S | account Stripe IT |
| +2 | F0.16 (redirect 301) + F0.17 (sitemap + hreflang) | S + XS | URL stabili · include `/regala.html`, `/dove-siamo.html`, `/voucher-termini.html` in sitemap |
| +3 | F0.18 (CSP + security headers) + inizio F0.15 (newsletter Brevo) | S + L | scudo finale · F0.15 può sforare in propria sessione |

---

## 10. BACKLOG PUNTI LOOP 3 PASSATE F0.9 (aggiornato post-chiusura)

### 10.1 Punti P3 ancora in backlog (~12 punti residui)

| Punto | Descrizione sintetica | Severità originaria | Fase target | Status post 19-05.04 |
|---|---|---|---|---|
| P3.1 | Test funzionale `closeIconLabel` su preferencesModal (v3.1.0 chiude senza salvare?) | Importante | F0.9-post / Q1 2026 | ⏳ test rimandato |
| P3.3 | Audit periodico cookie Maps Embed con DevTools per aggiornare regex se Google introduce nuovi cookie | Medio | F0.12 | ⏳ aperto |
| P3.4 | CSP minima in `_headers`: `default-src 'self'; script-src 'self'; ...` | Medio | F0.9-post / F0.12 anticipo / F0.18 | ⏳ valutare anticipo come pre-task F0.12 |
| P3.5 | `hideFromBots: true` esplicito nel config (1 riga) | Medio | F0.9-post | ✅ **applicato in v 2026.05.19.02 (dec. #22)** |
| P3.6 | Decisione `disablePageInteraction: true/false` (interpretativo Garante) | Medio | Backlog interpretativo | ⏳ aperto |
| P3.7 | Audit log consenso server-side (Pages Function + HMAC) per dimostrabilità GDPR Art. 7.1 | Importante | F0.15 | ⏳ aperto |
| P3.8 | Decisione `autoShow: true/false` quando atterro direttamente su privacy/cookies | Importante | F0.9-post | ✅ **applicato opzione b in v 2026.05.19.02 (dec. #22)** |
| P3.9 | Aggiornare cookies.html con tabella durata NID/SOCS/OGPC + finalità + trasferimento extra-UE | Importante | F0.12 | ⏳ aperto |
| P3.10 | preferencesModal sezione embeds menzionare trasferimento Google LLC USA (DPF UE-USA 2023) | Importante | F0.12 | ⏳ aperto |
| P3.11 | Decisione `flipButtons: true` per "Rifiuta" prima (interpretativo Garante) | Medio | Backlog interpretativo | ⏳ aperto |
| P3.12 | Test cross-tab cookie sameSite Lax con `target=_blank` da footer Privacy/Cookies | Medio | F0.9-post test | ⏳ test rimandato (con target=_blank ora applicato anche nel banner, valutare se ripetere) |
| P3.15 | Verifica `mailto:privacy@...` con 3 invii prova staging (= dec. #19) | Pre-go-live | F0.21 checklist | ⏳ aperto |
| P3.16 | Decisione tenere/rimuovere/rinominare label "Google Maps" del service predisposto | Minore | F0.12 | ⏳ aperto |
| P3.18 | Auditabilità reversa consenso cookie via Pages Function | Importante | F0.15 | ⏳ aperto |
| P3.19 | Neutralizzare wording marketing "arricchire l'esperienza" | Minore | Backlog cosmetico | ⏳ aperto |
| P3.20 | Mitigazione cookie injection cross-site (già coperto parz. da sameSite Lax) | Minore | F0.18 con CSP | ⏳ aperto |
| P3.21 | Rimozione blocco path duplicati 404 in index/privacy/cookies | Bloccante | risolto in v 2026.05.19.01 | ✅ **risolto** |
| P3.22 | Disclaimer "stato attuale di sviluppo" su Stripe + Maps nelle policy | Importante | F0.12+F0.13 (rimozione) | ✅ **applicato** (rimozione in F0.12/F0.13) |

### 10.2 Nuovo punto P3 emerso F0.9-post (dec. #22)

| Punto | Descrizione sintetica | Severità | Esito |
|---|---|---|---|
| P3.23 (nuovo) | Mancanza bottone "Gestisci preferenze cookie" in privacy.html dopo applicazione `autoShow: false` (opzione b P3.8) | Bloccante (scoperto durante verifica F0.9) | ✅ **risolto in privacy.html v 2026.05.19.02** (aggiunto bottone .cc-manage in §12 con classe CSS coerente con quello in cookies.html §3) |

### 10.3 Test V5 Rich Results Test differito a F0.21

Schema.org JSON-LD validation:
- Eseguibile ORA solo in "Codice" mode su Rich Results Test (incollando markup direttamente) o via validator.schema.org
- NON eseguibile in "URL" mode su `santamonica-web.pages.dev/*` perché `X-Robots-Tag: noindex,nofollow` blocca crawl del Googlebot (dec. F0.3) → comportamento atteso, NON è un bug
- Test in "URL" mode su dominio reale `santamonicagenova.it/*` solo post-F0.21 quando il noindex sarà rimosso

---

## 11. REGOLE DI MANUTENZIONE ROADMAP

1. Aggiornare a fine ogni sessione
2. Promuovere item quando condizioni cambiano
3. Aggiungere nuovi item se emergono in sessione
4. Non rimuovere item FASE 5/backlog senza motivo
5. Versione documento: aggiornare riga `Versione documento` + bump in CHANGELOG
6. Backlog loop 3 passate (§10) mantenuto come tracciamento decisioni non immediate

---

## 12. REGOLA OPERATIVA FISSA (ricorrente in ogni documento di continuità)

> Ogni file prodotto per il progetto Santamonica/SantaWeb deve avere la versione aggiornata in formato `v YYYY.MM.DD.NN`, sia in header sia in footer/UI quando applicabile. La nuova versione va **comunicata esplicitamente** all'utente quando si presenta il file.
>
> La regola si applica a tutti i file: deploy (HTML/JS/CSS/JSON) e documenti di continuità (handover/changelog/roadmap/manuali).
>
> **Versione anche nel nome** (solo documenti di continuità): `NOMEFILE_vYYYY.MM.DD.NN.ext`. File di deploy NON portano versione nel nome.
>
> **Sostituzione ad ogni release**: file con versione precedente rimosso dalla KB, sostituito dalla nuova versione. Storico in Git.
>
> **Coordinamento `NN` multi-documento**: per release di sessione (HANDOVER + CHANGELOG + ROADMAP + file deploy della sessione) usare lo stesso `NN`. Per release autonome di un singolo documento, `NN` per-documento. **Eccezione operativa accettata** (sessione 19-05): se nella stessa sessione si rilasciano più batch separati di file deploy a NN incrementali (.02, .03, .04), i documenti di continuità prodotti a fine sessione adottano l'`NN` più alto della giornata (.04 nel caso 19-05) come release coordinata complessiva, citando esplicitamente i NN intermedi.
>
> **Questa regola va riportata in ogni documento di continuità per propagarla.**

---

## APPENDICE — Storico modifiche ROADMAP

| Versione | Data | Cambi principali |
|---|---|---|
| v.03 → v.04 | < 2026-05-15 | Hosting Vercel → Cloudflare |
| v.04 → v.05 | 2026-05-15 (interim) | Dettaglio interim |
| v.05 → v.06 | 2026-05-15 (sera) | Privacy DIY · F0.0 HMAC · F0.3bis · F0.7bis · F0.8 |
| v.06 → v.07 | 2026-05-17 (mattina) | F0.0/F0.1/F0.2 chiusi · F0.8 sospesa |
| v.07 → v.08 | 2026-05-17 (sera) | F0.3 80% · F0.7 chiuso · F0.6bis NUOVO · dec. #9 #10 #11 |
| v.08 → v.09 | 2026-05-17 (notte) | F0.4 + F0.6 chiusi · _redirects NUOVO · dec. #13 #14 |
| v.09 → v.10 | 2026-05-17 (notte+1) | Cleanup repo · dec. #15 |
| v.10 → v.11 | 2026-05-17 (notte+2) | F0.3 + F0.6bis chiusi · dec. #12 #16 · impatti DNS Wix |
| v.11 → v.12 | 2026-05-17 (tarda sera) | F0.9 al 90% · banner vanilla-cookieconsent v3 bundle locale · dec. #17 NUOVA · #18 #19 candidate · 4ª discrepanza KB↔deploy · loop P1 ✅ P2/P3 ⏳ |
| v.12 → v.13 | 2026-05-19 (mattina) | F0.9 al 100% pendente verifica · loop P2+P3 completati (42 punti totali, 18 applicati) · dec. #18 #19 #20 #21 NUOVE · convenzione consegna file interi memorizzata · P3.22 disclaimer "stato sviluppo" applicato · 5ª discrepanza KB↔deploy risolta (path duplicati 404) · 14 punti P3 promossi a backlog F0.9-post/F0.12/F0.15/F0.18/F0.21 |
| **v.13 → v.14** | **2026-05-19 (sera tardi)** | **F0.9 CHIUSO 100% definitivo dopo verifica funzionale utente OK + applicazione P3.5/P3.8 in release F0.9-post coordinata v 2026.05.19.02 (cookieconsent-config + privacy + cookies) · F0.10 CHIUSO 100% tecnico con regala.html v 2026.05.19.03 prima emissione · F0.11 CHIUSO 100% tecnico con index.html v 2026.05.19.04 (Schema.org refactor a ItalianRestaurant) + dove-siamo.html v 2026.05.19.04 prima emissione (mobile-first OSM map) · dec. #22 #23 #24 #25 NUOVE · memoria operativa #5 salvata (TARGET vs operative + FINAL CHECK pre-F0.21) · 6 file deploy rilasciati in 3 batch (.02, .03, .04) · Backlog P3 ridotto a 12 punti residui (3 risolti: P3.5, P3.8, P3.21, P3.22; 1 nuovo P3.23 emerso e risolto in stessa sessione) · sequenza prossime sessioni aggiornata: F0.12 prima, P3.4 valutare anticipo come pre-task** |

---

**Fine ROADMAP · v 2026.05.19.04 (v.14)**
