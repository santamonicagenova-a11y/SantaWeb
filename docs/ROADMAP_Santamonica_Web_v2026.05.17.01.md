# ROADMAP — Santamonica Web

**Versione documento:** v 2026.05.17.01 (v.07)
**Sostituisce:** v 2026.05.15.06 (v.06)
**Periodo coperto:** maggio 2026 → maggio 2027

---

## NOVITÀ v.07 vs v.06

| Cambio | Dettaglio |
|---|---|
| Item chiusi recentemente | F0.0 (parziale), F0.1, F0.2 spostati in "chiusi" |
| F0.8 | **Declassata a backlog "sospeso"** per decisione utente · ripresa eventuale futura non datata |
| F0.9 | **Decisione operativa aperta**: procede su DIY senza attendere F0.8 (proposta in attesa di conferma) |
| F2.2 | **Decisione operativa aperta**: traduzione FR/EN privacy/cookies su DIY oppure rimandata · proposta su DIY |
| F2.6 | **Decisione operativa aperta**: aggiornamento fornitori su DIY · proposta procedere |
| F0.0 chiusura definitiva (repo privato) | Rimandata post-F0.21 (GitHub Pages free tier richiede repo pubblico) |
| Stack | Cloudflare Pages live in staging (`santamonica-web.pages.dev`) post-F0.1b · 1° function deployata |

---

## CONTESTO STRATEGICO

### Obiettivo
Sostituire Wix con sito statico self-hosted su Cloudflare Pages + Functions, abilitare gift cards Stripe per Natale 2026, mantenere zero costi ricorrenti significativi.

### Lingue scelte
IT + FR + EN (decisione A1, taglio DE+ES in F0.4). Privacy/Cookie policy multilingua IT base, traduzione FR/EN in F2.2.

### Timeline globale
Maggio 2026 → Maggio 2027 · 12 mesi · 5 fasi.

### Decisioni strategiche invariate
A1-A9, T1-T9, D1-D4 (riferimento ROADMAP v.06 §0). A7 implementation = Stripe Payment Links manuali.

### Dati operativi titolare

| Aspetto | Valore |
|---|---|
| Denominazione | Il Giuliano di Andrea Giachino e C. S.a.s. (gestisce ristorante Santamonica) |
| P.IVA / C.F. | 02395420991 |
| Sede legale | Lungomare Lombardo 27, 16145 Genova (GE) |
| PEC | ilgiulianosas@legalmail.it |
| Email contatto privacy | privacy@santamonicagenova.it (da configurare F0.3bis) |
| Email generale | santamonicagenova@gmail.com |

---

## ITEM CHIUSI RECENTEMENTE

| # | Item | Chiusura | Output |
|---|---|---|---|
| F0.7bis | Stesura privacy.html + cookies.html IT (DIY) | 2026-05-16 | `privacy.html` v 2026.05.16.02 + `cookies.html` v 2026.05.16.02 (pronti, non pubblicati) |
| F0.0 (parziale) | HMAC salt + .gitignore | 2026-05-17 | salt 256-bit in Bitwarden · `.gitignore` aggiornato · repo privato rimandato post-F0.21 |
| F0.1 | Setup Cloudflare account + Pages project | 2026-05-17 | account + 2FA · progetto `santamonica-web.pages.dev` live |
| F0.2 | Porting Vercel function → Cloudflare Pages Function | 2026-05-17 | `functions/api/translate.js` v 2026.05.17.02 deployato e testato |

---

## 1. FASE 0 — Switch hosting Cloudflare + foundation tecnica + compliance DIY (oggi → fine giugno 2026)

**Obiettivo:** portare il nuovo sito live su `santamonicagenova.it` (Cloudflare Pages) sostituendo Wix, con stack consolidato.

**Tempo stimato residuo:** ~10-12 sessioni (4 chiuse delle 12-14 originali).

### Task FASE 0 — residui

| # | Task | Sforzo | Dipendenze | Note |
|---|---|---|---|---|
| F0.3 | Setup `nuovo.santamonicagenova.it` (staging dominio custom) | S | F0.1 ✅ + DNS Aruba | CNAME `nuovo` → `santamonica-web.pages.dev` su Aruba · SSL auto Cloudflare · meta `robots noindex` + `_headers` `X-Robots-Tag: noindex` |
| F0.3bis | Cloudflare Email Routing | XS (~10 min) | F0.3 | Aggiungere `santamonicagenova.it` a Cloudflare DNS (se non già) · attivare Email Routing free · alias `privacy@santamonicagenova.it` → forward `santamonicagenova@gmail.com` · opzionali: `prenotazioni@`, `voucher@`, `info@` |
| F0.4 | Taglio lingue DE + ES | M | F0.2 ✅ | Rimuovere chiavi DE/ES da `translations.json` (96 → ~58/lingua) · rimuovere `menu-de.html` + `menu-es.html` · archivio branch `legacy/de-es` + tag git `v-pre-language-cut-2026.05` · aggiornare `admin-core.js`, `admin-translations.js` · rimuovere `<option>` da language switcher |
| F0.5 | Refactor JSON menu | **POSTPOSTO a F1.0** | — | Spostato a F1.0 |
| F0.6 | Rimozione `admin-templates.js` legacy + footer versione commento HTML | XS | F0.2 ✅ | Rimuovere `<script src="admin-templates.js">` da `menu-admin.html` · stringa versione footer in commento HTML |
| F0.7 | Fine-grained PAT GitHub | XS | F0.0 chiusura definitiva (repo privato post-F0.21) | Token scope `Contents R/W` solo SantaWeb · scadenza max 1 anno · sostituzione in admin · revoca PAT classic · calendar reminder rinnovo. **Nota:** finché repo pubblico, PAT classic resta accettabile come temporaneo |
| **F0.8** | **🟡 SOSPESA** — Revisione legale privacy+cookies IT esterna | tempo coord. + ~200-400€ | — | Decisione utente 2026-05-17: rimandata a tempo indeterminato. File `privacy.html` + `cookies.html` v 2026.05.16.02 restano in stato DIY |
| F0.9 | Setup vanilla-cookieconsent v3 (bundle locale) | M | 🟡 decisione aperta: procede su DIY senza attendere F0.8? | Config riflette dichiarati in `cookies.html` v 2026.05.16.02: 3 categorie (tecnici, terze parti Stripe, terze parti Maps) · durata `cc_cookie` 6 mesi · categoria dedicata per Maps · callback per audit (no salvataggio esterno) · pulsante footer `data-cc="show-preferencesModal"` |
| F0.10 | Pagina `regala.html` informativa minima | S | testo voucher | Descrizione voucher + termini abbreviati + CTA "contatta il ristorante" (Stripe Payment Links arriveranno post-F0.13) |
| F0.11 | Schema.org Restaurant in `index.html` (JSON-LD completo) | M | dati ristorante + Place ID Google Maps | address, geo, telephone, priceRange, servesCuisine, openingHours, hasMenu, sameAs, aggregateRating · validazione Rich Results Test |
| F0.12 | Sezione "Dove siamo" + Google Maps embed | M | dati indirizzo + GPS + F0.9 (banner Maps) | iframe + indirizzo + tel + indicazioni + parcheggio + trasporti + placeholder pre-consenso Maps |
| F0.13 | Stripe setup + 6 Payment Links | S | account Stripe IT | Account · payment methods UE · IBAN payout · 6 Payment Links (50·80·100·150·200·300€) · email ricevuta IT |
| F0.14 | Pagina `voucher-termini.html` | S | T1-T9 confermati | Termini espliciti voucher: validità 12 mesi, esclusioni temporali, importi, resto perso, recesso 14gg, no cumulabilità, ecc. |
| F0.15 | Newsletter Brevo opt-in nel form `#prenota` + audit log HMAC consensi | L | API Brevo + `CONSENT_HMAC_SALT` (✅ generato F0.0) | Rimozione form newsletter standalone · Pages Function `functions/api/newsletter.js` proxy Brevo · audit log `consents.json` HMAC-SHA-256 (email + IP hashate, timestamp/lingua/fonte/tipologia in chiaro, retention 5 anni) · chiave i18n `prenota_f_newsletter` · doppio opt-in Brevo · informativa esplicita Art. 9 GDPR per allergie |
| F0.16 | Redirect 301 nativi via `_redirects` | S | F0.1 ✅ | File `_redirects` Cloudflare: `/menù` → `/menu.html`, `/cantina` → `/cantina.html`, `/regala` → `/regala.html`, `/contatti` → `/#prenota`, `/filosofiadicucina` → `/`, `/privacy-policy` → `/privacy.html`, `/copia-di-cookies` → `/cookies.html` |
| F0.17 | Sitemap.xml + hreflang multilingua | XS | URL stabilizzati | Sitemap con `xhtml:link rel="alternate" hreflang="it/fr/en/x-default"` per ogni URL · canonical self-referente · submit Search Console · rimozione sitemap Wix · validazione hreflang.org |
| F0.18 | CSP + security headers via `_headers` | S | F0.1 ✅ | CSP Report-Only 2 settimane prima di enforcing · `X-Frame-Options: DENY` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy` minimo · whitelist origin: self + Stripe + Google Maps + Brevo widget |
| F0.19 | TTL DNS Aruba ridotto a 300s | XS | accesso Aruba | 48h prima dello switch finale, ridurre TTL record A/CNAME a 300s |
| F0.20 | Test E2E completo + correzioni | M | F0.3-F0.19 | Test mobile + desktop · 3 lingue · tutti i form (con allergie + consensi separati) · mappa · vanilla-cookieconsent banner Garante-conforme · opt-in newsletter audit log HMAC · redirect 301 · hreflang validato · CSP Report-Only senza violazioni · checkout Stripe Payment Link test reale |
| F0.21 | 🚀 Switch DNS finale: santamonicagenova.it → Cloudflare | S | F0.20 ok + TTL 300s attivo da 48h | Aruba: CNAME `www` → `santamonica-web.pages.dev` · ALIAS/ANAME apex → Cloudflare (o trasferire DNS a Cloudflare) · rimozione `noindex` · canonical aggiornato · redirect 301 attivi · Wix backup 30gg · monitoring 14gg · procedura rollback documentata · mantenere Vercel admin attivo fino a F0.20 OK, poi `vercel rm` |
| F0.0** | 🔒 Chiusura F0.0: rendere repo `SantaWeb` privato | XS | post-F0.21 | Settings → Danger Zone → Change visibility → Private. Bloccante per F4.4 (eliminazione PAT da localStorage) |

**Sforzo totale residuo FASE 0:** ~10-12 sessioni.

---

## 2. FASE 1 — Build feature non-Stripe + refactor JSON (luglio → agosto 2026)

**Obiettivo:** completare funzionalità del nuovo sito e consolidare debito tecnico JSON menu prima della finestra Natale.

**Tempo stimato:** 8-10 sessioni distribuite in 2 mesi.

### Task FASE 1 (riferimento dettaglio: ROADMAP v.06 §2)

| # | Task | Sforzo |
|---|---|---|
| F1.0 | Refactor JSON menu unica fonte verità | L |
| F1.1 | Pagina `eventi.html` + `events.json` | M |
| F1.2 | Reviews custom via Pages Function + Google Places API + KV cache + Worker cron daily | L |
| F1.3 | Video hero homepage | S |
| F1.4 | Gallery masonry refactor | M |
| F1.5 | OG dedicate per pagina | S |
| F1.6 | Cloudflare Web Analytics → eventuale upgrade Umami self-hosted | S |
| F1.7 | srcset esteso foto sito | M |
| F1.8 | Manuale operativo voucher PDF | M (extra-tecnico) |

---

## 3. FASE 2 — Coordinamento traduttore + finalizzazione gift cards (settembre → ottobre 2026)

**Obiettivo:** lanciare campagna Natale: traduzioni FR + EN finalizzate, sistema gift cards Payment Links rifinito.

**Tempo stimato:** 4-5 sessioni in 2 mesi.

### Task FASE 2

| # | Task | Sforzo | Dipendenze | Note |
|---|---|---|---|---|
| F2.1 | Override layer FR + EN tecnico | M | — | File `translations-override-fr.json` + `translations-override-en.json` · priorità override → DeepL fallback |
| F2.2 | 🟡 Coordinamento traduttore professionale FR + EN | tempo coord. + ~300-450€ | F2.1 + content stabilizzato | **Decisione aperta:** include privacy/cookies su versione DIY (F0.8 sospesa) oppure solo menu/UI. **Proposta:** tradurre anche privacy/cookies DIY · brief con esempi · esportare ~400-500 stringhe critiche in CSV/XLSX · import in override · test · terminologia GDPR ufficiale UE per ogni lingua |
| F2.3 | Finalizzazione gift cards Stripe Payment Links | S | F0.13 + F2.2 | Stripe Dashboard: branding logo+colori · email ricevuta IT · 6 Payment Links definitivi · test acquisto live |
| F2.4 | Template voucher PDF (Canva/Word riusabile) | XS | logo + foto vista mare | A4 portrait elegante con codice univoco + dedica + termini IT |
| F2.5 | Registro voucher Google Sheets (2FA obbligatorio) | XS | template registro | Foglio: codice, data emissione, importo, acquirente_email, destinatario_email, stato, data riscatto · export CSV commercialista · 2FA Google Art. 32 GDPR |
| F2.6 | 🟡 Privacy policy update fornitori finalizzati | XS | privacy DIY (F0.8 sospesa) | **Decisione aperta:** procedere su DIY · verifica elenco fornitori coerente con stato finale F0 · eventuale aggiornamento §7 destinatari |
| F2.7 | Strategie marketing pre-lancio | S (extra-tecnico) | — | Email Brevo · post Instagram · banner homepage temporaneo · target 15 novembre |

---

## 4. FASE 3 — Lancio Natale + campagna (novembre → dicembre 2026)

**Obiettivo:** lanciare campagna gift card, gestire workflow operativo voucher manuale, monitorare.

**Tempo stimato:** 2-3 sessioni monitoring/fix + tempo extra-tecnico.

| # | Task | Sforzo |
|---|---|---|
| F3.1 | Push campagna pre-Natale (15 nov - 24 dic) | extra-tecnico |
| F3.2 | Monitoring quotidiano Stripe + Cloudflare Analytics | XS/giorno |
| F3.3 | Workflow operativo voucher (manuale F1.8) | extra-tecnico |
| F3.4 | Gestione riscatti al ristorante (marca `redeemed` immediato per race recesso) | extra-tecnico |
| F3.5 | Eventuali hotfix critici durante campagna | variabile (bug-only) |
| F3.6 | Post-mortem campagna gennaio | S |

---

## 5. FASE 4 — Refactor consolidamento (gennaio → febbraio 2027)

**Obiettivo:** consolidare debito tecnico residuo.

**Tempo stimato:** 4-5 sessioni.

| # | Task | Sforzo |
|---|---|---|
| F4.1 | Consolidamento admin JS → `admin-vendor.js` | M |
| F4.2 | Cache traduzioni server-side hash content-addressable (Cloudflare KV) | S |
| F4.3 | srcset/picture + AVIF estensione galleria + eventi + cantina + foto regala | M |
| F4.4 | Migrazione PAT GitHub da `localStorage` a env Cloudflare Pages Function | M (bloccato da F0.0** repo privato) |
| F4.5 | Trigger cancellazione automatica prenotazioni Formspree > 90 giorni | S |

---

## 6. FASE 5 — Rivalutazione strategica + nice-to-have (primavera 2027+)

**Obiettivo:** rivalutare filosofia stack (D1), backlog priorità minore.

| Item | Tipo |
|---|---|
| Filosofia stack (D1) | rivalutazione |
| Sistema booking custom (A2) | rivalutazione |
| TheFork ritorno (A2) | task condizionale |
| Sistema voucher automatizzato (volume > 100/anno) | feature (Gift Up! o custom) |
| Wine pairing dinamico (A5-A9) | feature backlog |
| Pesce del giorno (A5) | feature backlog |
| 🟡 Ripresa F0.8 revisione legale privacy/cookies | task condizionale (decisione utente) |

---

## 7. COSTI CONSOLIDATI 12 MESI (revisione v.07)

| Voce | Tipo | Importo | Note |
|---|---|---|---|
| ~~Revisione legale privacy + cookies IT~~ | ~~Una tantum~~ | ~~~200-400€~~ | **🟡 SOSPESO** — F0.8 rimandata indefinitamente |
| Dominio santamonicagenova.it (Aruba) | Ricorrente annuo | ~15€ | Esistente |
| Revisione traduzione professionale FR + EN | Una tantum anno 1 | ~300-450€ | F2.2 (include privacy/cookies DIY se decisione SI) |
| Stripe commissioni | Variabile | 1.5% + 0.25€/transazione EEA | ~50€/anno su 30 voucher × ~100€ |
| Tutto il resto: 0€ | — | — | Cloudflare Pages+Functions+Workers+KV+Analytics+Email Routing, Brevo Free, DeepL Free, Google Places, Formspree, GitHub, vanilla-cookieconsent open source |

**Anno 1 v.07:** ~365-515€ totali (sconto ~200-400€ vs v.06 per sospensione F0.8)
**Anni successivi:** ~65€ ricorrenti (Aruba + Stripe commissioni)

**Risparmio vs v.05 Iubenda Advanced:** ~225€/anno ricorrente confermato.

### Budget di sicurezza extra (se necessario)

| Voce eventuale | Costo | Trigger |
|---|---|---|
| Ripresa F0.8 revisione legale | ~200-400€ | Se utente cambia idea o se Garante/normative impongono |
| Aggiornamento privacy post-cambi normativi | ~100-200€ | Cambi GDPR/Garante (~ogni 2-3 anni) |
| Cloudflare Workers Paid | $5/mese | Quota Workers free saturata |
| Cloudflare KV Paid | $5/mese | Quota KV free saturata (F4.2) |
| DeepL Pro | 5€/mese | Quota Free 500k char/mese esaurita |
| Umami Cloud / Plausible | 9-19$/mese | Cloudflare Analytics insufficiente |
| Sistema voucher SaaS (Gift Up!) | ~$45/mese | Voucher > 100/anno |
| TheFork (ripresa booking) | 80-150€/mese + commissione | Quando deciso |

---

## 8. STACK ARCHITETTURALE A REGIME

```
GitHub repo SantaWeb (PUBBLICO durante F0, PRIVATO post-F0.21)
  ├──► auto-deploy Cloudflare Pages
  │     ├─ index.html · menu*.html · cantina.html · regala.html · voucher-termini.html
  │     ├─ privacy.html · cookies.html (v 2026.05.16.02 DIY)
  │     ├─ events.json · site-images.json · gallery-photos.json
  │     ├─ translations.json · translations-override-{fr,en}.json
  │     ├─ cookieconsent/ (bundle vanilla-cookieconsent v3 locale, F0.9)
  │     ├─ consents.json (audit log HMAC F0.15, retention 5 anni)
  │     ├─ sitemap.xml
  │     ├─ _redirects (301 Wix legacy URLs)
  │     ├─ _headers (cache control + CSP + security)
  │     └─ img/ + img/sito/ + img/galleria/ + img/eventi/ + img/og/
  │
  ├──► Cloudflare Pages Functions (`/functions/api/*`)
  │   ├─ functions/api/translate.js ✅ live v 2026.05.17.02 (proxy DeepL, env DEEPL_KEY)
  │   ├─ functions/api/newsletter.js (F0.15, proxy Brevo + audit HMAC newsletter)
  │   ├─ functions/api/allergie-consent.js (F0.15, audit HMAC allergie)
  │   └─ (F4.4) functions/api/github-write.js (proxy GitHub API, PAT lato server)
  │
  ├──► Cloudflare Workers standalone (Cron Triggers)
  │   ├─ reviews-cron-worker (F1.2, daily 04:00 UTC, scrive reviews.json)
  │   └─ formspree-cleanup-worker (F4.5, daily, cancella prenotazioni > 90gg)
  │
  ├──► Cloudflare Email Routing (F0.3bis)
  │   ├─ privacy@santamonicagenova.it → santamonicagenova@gmail.com
  │   └─ [eventuali alias: prenotazioni@, voucher@, info@]
  │
  └─ Cloudflare KV namespaces
      └─ TRANSLATIONS_CACHE (F4.2)

External services
  ├─ vanilla-cookieconsent v3 (lib open source, bundlato locale)
  ├─ Brevo (newsletter + audit consensi)
  ├─ Stripe (gift card Payment Links manuali + refund dashboard)
  ├─ DeepL Free (proxy via translate)
  ├─ Google Places New (reviews, daily cron)
  └─ Formspree (form prenotazioni, endpoint esistente mkopjnvq)

Asset offline (no codice)
  ├─ voucher-template.docx / Canva (template PDF voucher)
  ├─ Google Sheet "Registro Voucher Santamonica" (2FA obbligatorio)
  └─ Stripe Dashboard (gestione voucher)
```

### Servizi esterni e credenziali

| Servizio | Setup | Env var Cloudflare | Fase |
|---|---|---|---|
| Cloudflare account | ✅ attivo + 2FA TOTP | — | ✅ F0.1 |
| DeepL Free | ✅ API key (migrato da Vercel) | `DEEPL_KEY` ✅ | ✅ F0.2 |
| HMAC salt | ✅ generato Bitwarden | `CONSENT_HMAC_SALT` (injection F0.15) | ✅ F0.0 |
| Aruba DNS | Pannello esistente | — | F0.3 · F0.21 |
| Cloudflare Email Routing | Attivazione free | — | F0.3bis |
| Brevo | API key + lista "sito-web" + template double opt-in | `BREVO_API_KEY` | F0.15 |
| Google Places API New | Project + enable Places + key restricted referer | `GOOGLE_PLACES_API_KEY` | F1.2 |
| Stripe | Account IT + payment methods UE + IBAN + 6 Payment Links | nessuna env | F0.13 |
| GitHub fine-grained PAT | Scope Contents R/W solo SantaWeb + max 1 anno | localStorage `gh_token` (F0-F3) → env Function (F4.4) | F0.7 (post-F0.21) |
| ~~Avvocato revisione privacy~~ | — | — | 🟡 F0.8 sospesa |

---

## 9. SEQUENZA OPERATIVA CONSIGLIATA PROSSIME 4 SESSIONI

| Sessione | Item | Sforzo | Note |
|---|---|---|---|
| Prossima | F0.3 + F0.3bis | S + XS | DNS Aruba CNAME + Email Routing alias (richiede accesso Aruba) |
| +1 | F0.4 + F0.6 | M + XS | Taglio DE/ES + rimozione admin-templates.js legacy |
| +2 | F0.9 (DIY) + F0.10 | M + S | Banner cookieconsent + pagina regala informativa (richiede conferma decisione operativa) |
| +3 | F0.11 + F0.12 | M + M | Schema.org + sezione "Dove siamo" Maps (richiede Place ID + GPS) |

---

## 10. DECISIONI OPERATIVE APERTE (da chiarire prima di F0.9)

| # | Decisione | Default proposto | Note |
|---|---|---|---|
| 1 | F0.9 banner cookieconsent procede su DIY senza F0.8? | SÌ (tecnico, indipendente da testo legale) | Sblocco F0.9, F0.12 (Maps), F0.18 (CSP) |
| 2 | Go-live `privacy.html` + `cookies.html` su DIY con nota interna "non revisionata"? | SÌ (DIY già conforme GDPR/Garante) | Sblocco F0.21 |
| 3 | F2.2 traduzione privacy/cookies FR/EN su DIY? | SÌ (necessario per turisti FR/EN) | Aumenta sforzo F2.2 di ~50-100€ vs sola menu/UI |
| 4 | F0.8 declassata a backlog "sospeso" formalmente? | SÌ | Già formalizzato in questa ROADMAP |
| 5 | T5 UX exact (checkbox extra ristorante vs voucher cap) | checkbox opt-in | Da rifinire in F0.10/F0.14 |
| 6 | Frequenza pubblicazione newsletter Brevo | 1-2 email/mese | Editoriale, non bloccante |
| 7 | Foto OG signature per homepage (`og-home.jpg`) | — | F1.5 |
| 8 | Place ID Google Maps Santamonica | — | F0.11, ottenibile da URL Google Maps |

---

## 11. REGOLE DI MANUTENZIONE ROADMAP

1. **Aggiornare a fine ogni sessione**: spostare item completati in "Item chiusi recentemente"
2. **Promuovere item** quando condizioni cambiano
3. **Aggiungere nuovi item** se emergono in sessione
4. **Non rimuovere item FASE 5/backlog senza motivo**
5. **Versione documento**: aggiornare riga `Versione documento` + bump in CHANGELOG

---

## 12. REGOLA OPERATIVA FISSA (ricorrente in ogni documento di continuità)

**Ogni file prodotto per il progetto Santamonica/SantaWeb deve avere la versione aggiornata** in formato `v YYYY.MM.DD.NN`, sia in header sia in footer/UI quando applicabile. **La nuova versione va comunicata esplicitamente all'utente quando si presenta il file.**

La regola si applica a tutti i file: file di deploy (HTML, JS, CSS, JSON), documenti di continuità (handover, changelog, roadmap, manuali), documenti tecnici.

**Versione anche nel nome file** (solo documenti di continuità): `NOMEFILE_vYYYY.MM.DD.NN.ext`
File di deploy NON portano versione nel nome (rompe URL). Versione solo in header + footer/UI.

**Sostituzione ad ogni release**: file con versione precedente rimosso dalla KB, sostituito dalla nuova versione. Storico in Git.

---

## APPENDICE — Storico modifiche ROADMAP

| Versione | Data | Cambi principali |
|---|---|---|
| v.03 → v.04 | < 2026-05-15 | Hosting Vercel → Cloudflare · gift cards complete → Payment Links manuali · Iubenda Pro → Advanced |
| v.04 → v.05 | 2026-05-15 (interim) | Dettaglio interim |
| v.05 → v.06 | 2026-05-15 (sera) | Iubenda Advanced → privacy DIY · F0.0 HMAC salt · F0.3bis Email Routing · F0.7bis stesura DIY · F0.8 revisione legale · costi -225€/anno |
| **v.06 → v.07** | **2026-05-17** | **F0.0/F0.1/F0.2 chiusi · F0.8 sospesa (decisione utente) · F0.9/F2.2/F2.6 decisione operativa aperta · F0.0 chiusura definitiva post-F0.21 · costi -200-400€ una tantum** |

---

**Fine ROADMAP · v 2026.05.17.01 (v.07)**
