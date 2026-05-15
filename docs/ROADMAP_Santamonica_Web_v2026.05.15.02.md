# ROADMAP — Santamonica Web (consolidata)
**Versione:** v 2026.05.15.02
**Repo:** `github.com/santamonicagenova-a11y/SantaWeb`
**Ultimo aggiornamento:** 2026-05-15 (sessione di pianificazione strategica)
**Sostituisce:** versione precedente del 2026-05-14 (senza versioning interno)
**Continuità:** vedi `METODO_Continuita_Progetti.md` v1.0 + `CHANGELOG_Santamonica_Web.md`

---

## 0. CONTESTO STRATEGICO

### Obiettivo della roadmap
Rilanciare il sito Santamonica con un'identità digitale coerente con la fascia di posizionamento del ristorante (cucina di pesce, vista mare, fine dining), dismettere progressivamente lo stack Wix legacy, e abilitare 3 leve di business mancanti: prenotazione moderna, raccolta clienti (newsletter/CRM), vendita gift card per il Natale.

### Filosofia di esecuzione
- **Stack:** custom con assistenza AI continuativa (decisione D1)
- **Ritmo:** sprint serrato/aggressivo, flessibile sessione per sessione (D2.1)
- **Switch DNS:** graduale via `nuovo.santamonicagenova.it` (D2.2), DNS su Aruba
- **Budget:** 0€/mese ricorrenti (escluso Iubenda ~1.25€/mese), revisione FR+EN una tantum ~300€, commissioni Stripe variabili (D3)
- **Gestione a regime:** solo utente + assistenza AI, con manuale operativo per uso personale (D4)
- **Rivalutazione strategica filosofia stack:** primavera 2027

### Lingue scelte
IT + FR + EN (decisione A1, taglio DE + ES).

### Timeline globale
Maggio 2026 → Maggio 2027 · 12 mesi · 5 fasi.

---

## 1. FASE 0 — MVP switch DNS (oggi → inizio giugno 2026)

**Obiettivo:** portare il nuovo sito live su `santamonicagenova.it` sostituendo Wix, con copertura legale, SEO base, e contenuti minimi paritari al sito esistente.

**Tempo stimato:** 2-3 settimane a ritmo sprint serrato.

### Task FASE 0 (in ordine logico di esecuzione)

| # | Task | Sforzo | Dipendenze | Note |
|---|---|---|---|---|
| F0.1 | Setup `nuovo.santamonicagenova.it` (subdomain) su Aruba + GitHub Pages | S | DNS Aruba | CNAME `nuovo` → `santamonicagenova-a11y.github.io` · file CNAME nel repo · SSL automatico · `<meta robots noindex>` su tutte le pagine di staging |
| F0.2 | Taglio lingue DE + ES (decisione A1) | M | — | Rimuovere chiavi DE/ES da `translations.json` · rimuovere `menu-de.html` + `menu-es.html` (+ eventuali dolci-de/dolci-es) · aggiornare `admin-core.js` array `files[]` e map DeepL · aggiornare `admin-translations.js` · rimuovere `<option>` da language switcher · backup git pre-cancellazione |
| F0.3 | Rimozione `admin-templates.js` legacy + footer versione visibile (decisioni B2 + C4) | XS | — | Task fill rapida · rimuovere `<script src="admin-templates.js">` da `menu-admin.html` riga 175 · spostare stringa versione footer in commento HTML |
| F0.4 | Fine-grained PAT GitHub (decisione B8) | XS | — | Generare token con scope solo SantaWeb + Contents Read/Write · sostituire in admin · revocare PAT classic · calendar reminder rinnovo annuale |
| F0.5 | Pagine legali: Privacy + Cookie Policy IT (decisione Privacy) | M | — | Riuso testo Wix corretto · correzione errori E1+E2 (mailto `davittorio.com` → `santamonicagenova@gmail.com`) · aggiornamento sezione fornitori terzi (Formspree, Brevo, Vercel, GitHub, DeepL, Google Places, Stripe, Iubenda) · **rimossa sezione Candidature** · solo IT (FR/EN linkano IT) |
| F0.6 | Setup Iubenda Cookie Solution (~15€/anno) | S | account Iubenda | Account standalone Cookie Solution · banner multilingua automatico IT/FR/EN · scan iniziale del sito · script integration |
| F0.7 | Schema.org Restaurant completo (decisione A4.1) | M | dati ristorante | JSON-LD su `index.html` con Restaurant type · address, geo (lat/lng), telephone formato internazionale, priceRange, servesCuisine, openingHoursSpecification, hasMenu, sameAs (Instagram/Facebook URL), acceptsReservations · validazione Google Rich Results Test |
| F0.8 | Sezione "Dove siamo" + mappa Google embed (decisione C3) | M | dati indirizzo | Sezione dedicata in `index.html` · indirizzo completo · telefono `tel:+...` cliccabile · iframe Google Maps embed pin Santamonica · bottone "Indicazioni" · parcheggio testuale · trasporti pubblici testuali · Iubenda blocco fino consenso |
| F0.9 | Pagina cantina narrativa essenziale `cantina.html` (decisione A9 c1) | M | testo + 4-6 foto | Da zero · filosofia 2-3 paragrafi · 4-6 foto ambiente cantina · numeri sintetici · link a `menu-vini.html` · i18n IT/FR/EN |
| F0.10 | Pagina `regala.html` informativa minima (decisione A7, fase pre-sistema) | S | testo voucher rivisto | Informativa: descrizione voucher, termini rivisti (12 mesi validità, esclusi sab sera + festivi grandi), CTA "Per acquistare contatta il ristorante" + link `mailto:` o form `#prenota?tipo=voucher` · sistema Stripe arriva in FASE 2 |
| F0.11 | Newsletter Brevo opt-in nel form `#prenota` (decisione A3) | M | account Brevo (già esistente) | Rimuovere form newsletter standalone dal footer index · aggiungere checkbox "Iscrivimi alla newsletter" nel form `#prenota` · Vercel function `api/newsletter.js` (proxy creazione contatto Brevo, API key in env var) · doppia chiamata da submit: Formspree + Brevo · nuova chiave i18n `prenota_f_newsletter` × IT/FR/EN · tag lista "sito-web" Brevo · doppio opt-in confermato lato Brevo |
| F0.12 | Redirect 301 da URL Wix → URL nuovi | S | scelta hosting target | Da configurare dopo decisione hosting finale switch (GitHub Pages al primo lancio, Vercel successivamente) · URL Wix noti: `/menù`, `/cantina`, `/regala`, `/contatti`, `/filosofiadicucina`, `/privacy-policy`, `/copia-di-cookies` |
| F0.13 | Submit sitemap nuovo a Google Search Console | XS | sitemap aggiornata | Generare `sitemap.xml` con URL nuovo dominio · submit a GSC · rimozione sitemap Wix vecchio |
| F0.14 | Test E2E completo + correzioni | M | F0.1-F0.11 complete | Test su mobile, desktop, 3 lingue, tutti i form, mappa, Iubenda banner, opt-in newsletter, link footer |
| F0.15 | **Switch DNS finale: santamonicagenova.it → sito nuovo** | S | F0.14 ok | Modifica DNS Aruba (A record apex + eventuale CNAME www) · rimozione `noindex` da pagine · canonical aggiornato · redirect 301 attivi · Wix tenuto come backup 30 giorni · 🚀 SITO NUOVO LIVE |

### Sforzo FASE 0
~8-10 sessioni dense.

### Decisioni operative dopo MVP

| Item | Stato |
|---|---|
| Eventi: la sezione esiste già nei piani ma con calendario settembre-maggio, **nella FASE 0 non viene mostrato link nel nav** se non ci sono eventi. La pagina può essere live ma `<meta robots noindex>` finché ci sono eventi reali |
| Reviews custom: rinviato FASE 1 (no urgenza per switch) |
| Video hero: rinviato FASE 1 |
| Gallery masonry: rinviato FASE 1 (galleria attuale 6 foto fissa funziona) |
| OG dedicate: rinviato FASE 1 (per ora OG generica = hero ok) |
| Umami: rinviato FASE 1 |

---

## 2. FASE 1 — Build feature non-Stripe (giugno → agosto 2026)

**Obiettivo:** completare tutte le funzionalità del nuovo sito che NON dipendono dal sistema Stripe, in vista del lancio gift cards autunnale.

**Tempo stimato:** 8-10 sessioni distribuite in 2-3 mesi.

### Task FASE 1 (priorità ordinata)

| # | Task | Sforzo | Dipendenze | Note |
|---|---|---|---|---|
| F1.1 | Sistema eventi: pagina `eventi.html` + admin CRUD (decisione A6 e2) | M | — | Pagina `eventi.html` con sezione "Prossimi eventi" + "Archivio" sempre visibile (decisione A6 c) · schema `events.json` con id, titolo/descrizione {IT/FR/EN}, data, prezzo, foto, capacità note, stato (bozza/save-the-date/prenotabile/sold-out/passato) · sezione admin "📅 Eventi" CRUD · Schema.org `FoodEvent` solo eventi futuri · auto-stato `passato` quando data < oggi · link "Eventi" sempre visibile nel nav · pre-popolazione form `#prenota` con `evento_id` |
| F1.2 | Google Reviews custom via Vercel function (decisione A4.2 r3) | M | API key Google Places | Setup Google Cloud Console Places API + restriction · Vercel function `api/reviews.js` · Vercel KV cache 24h · cron refresh giornaliero · sezione "Recensioni" in `index.html` · `aggregateRating` aggiornato nello Schema · privacy policy aggiornata (Google Places nei fornitori) |
| F1.3 | Video hero loop + poster (decisione C1c) | M | video del genero videomaker | Brief dettagliato al genero (golden hour, 10-15s, loop seamless, 16:9 o 21:9, no audio, no testo overlay, MP4+WebM, target <3MB) · implementazione `<video autoplay muted loop playsinline poster>` · media query `prefers-reduced-motion` · fallback connection-aware `navigator.connection.saveData` · test iOS Safari/Android Chrome |
| F1.4 | srcset/picture + AVIF+WebP per foto sito + poster video (decisione C5 graduale) | M | foto-optimizer esteso | Estensione `foto-optimizer.js` v3: 4 size (mobile 768w, tablet 1280w, desktop 1920w, thumb 400w) × 2 format (AVIF + WebP) = 8 file per foto · applicato solo a foto sito (hero, cucina_piatto, cucina_ingredienti, cantina) + poster video · galleria/eventi/altri in FASE 4 |
| F1.5 | Galleria masonry array flessibile 10 foto (decisione B5) | M | — | Schema `gallery-photos.json` array `{src, srcThumb, alt, position}` · 10 slot iniziali (estensibile) · refactor admin "📷 Foto cucina" CRUD + drag-drop con Sortable.js · refactor renderer `index.html` masonry con column-count CSS o Macy.js · lightbox prev/next + swipe mobile · lazy loading nativo |
| F1.6 | Multiple OG images per sezione + OG dinamici eventi (decisione C2 c2d + C2.2 a) | M | foto OG curate | 5 asset OG fissi 1200×630: og-home.jpg (piatto signature), og-regala.jpg, og-eventi.jpg, og-cantina.jpg, og-menu.jpg · estensione foto-optimizer per generare automaticamente versione 1200×630 in upload eventi · per ogni evento singolo `og:image` auto-generata da foto evento |
| F1.7 | Umami Analytics self-hosted su Vercel + Postgres free (decisione C6 b) | M | provisioning Vercel Postgres + sub-dominio | Deploy Umami da template GitHub · env vars setup · sub-dominio raccomandato `analytics.santamonicagenova.it` (evita ad-blocker su `*.vercel.app`) · DNS CNAME su Aruba · creazione admin user · tracking ID per `santamonicagenova.it` · script in `index.html` async defer · IP anonymization native · calendar reminder update Umami ogni 3-4 mesi |
| F1.8 | Eventi custom Umami: tutti i 9 (decisione C6.2 a) | S | F1.7 completa | Setup goals dashboard Umami · trigger JS in front-end per: `prenota_submit`, `newsletter_signup`, `gift_card_view`, `gift_card_checkout_start` (placeholder finché FASE 2), `gift_card_purchase` (placeholder), `event_view`, `event_prenota_click`, `menu_view`, `lingua_switch` |
| F1.9 | Manuale operativo per uso personale (decisione D4) | M | sistema admin stabilizzato | `MANUALE_UTENTE_admin.md` (privato, fuori sito): workflow pubblicazione menu · workflow aggiunta evento · gestione foto sito + galleria · gestione traduzioni + override layer · recovery errori comuni (token scaduto, propagation lenta, video non parte) · backup Git · scadenze ricorrenti (PAT GitHub annuale, Iubenda annuale, monitor quota DeepL mensile, monitor Vercel free tier, monitor Umami update) |

### Sforzo FASE 1
~8-10 sessioni distribuite giugno-agosto.

---

## 3. FASE 2 — Coordinamento traduttore + build Stripe gift cards (settembre → ottobre 2026)

**Obiettivo:** preparare tutto per il lancio Natale: traduzioni professionali FR + EN finalizzate, sistema gift cards completo, eventuale migrazione hosting a Vercel.

**Tempo stimato:** 8-10 sessioni distribuite in 2 mesi.

### Task FASE 2

| # | Task | Sforzo | Dipendenze | Note |
|---|---|---|---|---|
| F2.1 | Override layer FR + EN tecnico (decisione B10.3 a) | M | — | File `translations-override-fr.json` + `translations-override-en.json` su GitHub Pages · modifica `admin-core.js` priorità override → DeepL fallback · admin UI per visualizzare quali stringhe sono "override manuale" vs "DeepL automatico" |
| F2.2 | Coordinamento traduttore professionale FR + EN (decisioni B10.1+B10.2 c + B10.4 a) | tempo coordinamento + ~250-400€ una tantum | F2.1 + content stabilizzato | Trovare traduttore gastronomico FR + EN (Proz, Upwork, contatti locali Genova) · preparare brief con esempi di carte ristoranti francesi/inglesi di riferimento · esportare ~400 stringhe critiche (menu carta, degustazione, UI homepage, pagina cantina, pagina /regala, pagina eventi, email Brevo transactional) in CSV/XLSX · import revisione tradotta in file override · test pubblicazione |
| F2.3 | Sistema gift cards Stripe completo (decisione A7 g3) | L (4 sessioni dense) | Stripe + Vercel KV + Brevo Transactional + pdfkit | **Vedi sezione 3.1 dettaglio sotto** |
| F2.4 | Migrazione sito GitHub Pages → Vercel + switch DNS finale (decisione B3 c) | M | F0.15 già fatto, ora consolidamento | Provisioning sito su Vercel · import repo + build config · test su `santamonicagenova-prod.vercel.app` intermedio · rimozione CORS allowlist Vercel functions (same-origin) · path API relativi (`/api/translate` invece di assoluto) · configurazione `santamonicagenova.it` su Vercel · DNS Aruba aggiornato (A apex o CNAME) · disattivazione GitHub Pages backup · canonical aggiornato · Schema.org URL update · monitoring 14gg post-switch |
| F2.5 | Pannello mobile riscatto voucher (decisione B7 c — opzionale) | M | A7 completa | NUOVO file `admin-mobile.html` su Vercel · auth condivisa `localStorage['gh_token']` · pagina 1 riscatto voucher (input codice, verifica, conferma) · pagina 2 toggle stato eventi (sold-out / annullato) · scope ridotto, UI mobile-first · accoppiato a F2.3 |

### 3.1 Dettaglio sistema gift cards (F2.3)

| Sub-task | Sforzo | Note |
|---|---|---|
| Setup account Stripe + abilitazione metodi pagamento UE | S | Verifica entità legale, IBAN per payout |
| Provisioning Vercel KV (free tier sufficiente) | S | DB key-value voucher state |
| Setup template Brevo Transactional | S | Template HTML email: ricevuta acquirente, voucher destinatario con PDF allegato e dedica, conferma riscatto |
| Pagina `/regala.html` form completo | M | Form: importi fissi 50·80·100·150·200·300€ + custom 30-500€ (decisione T3 b) · nome destinatario, nome mittente, dedica, email destinatario, email acquirente · checkbox T5 "Il destinatario può aggiungere extra al ristorante" (decisione T5 b - opt-in al checkout) · termini abbreviati visibili + link `/voucher-termini.html` · pulsante "Acquista" → Stripe Checkout |
| Pagina `/voucher-termini.html` | S | Testo legale completo 9 punti T1-T9 con diritto recesso 14gg UE (decisione T8 b) |
| Vercel function `api/giftcard-checkout.js` | M | Crea Stripe Checkout Session · metadata: nome destinatario, importo, dedica, T5 flag · success URL + cancel URL |
| Vercel function `api/giftcard-webhook.js` | M | Riceve evento Stripe `payment_succeeded` · genera codice univoco `SM-YYYY-XXXX` · genera PDF voucher (pdfkit, design curato con logo Santamonica, vista mare, codice grande, termini abbreviati) · salva su Vercel KV `voucher:{codice}` · invia email destinatario (Brevo) con PDF · invia email acquirente con ricevuta |
| Sezione admin "🎁 Buoni regalo" desktop | M | Lista voucher · filtri stato (valido/riscattato/scaduto/cancellato/rimborsato) · ricerca codice · azione "Riscatta" + nota libera · azione "Annulla con rimborso" Stripe API · stat sintetiche (venduti, riscattati, valore in cassa, % redemption) |
| Test E2E: 10 voucher reali (tu/amici/familiari) | S | Beta test pre-Natale |
| Privacy policy update: Stripe + Brevo Transactional nei fornitori | XS | Coordinato con Iubenda |
| Strategie marketing pre-lancio | S (extra-tecnico) | Bozza email Brevo per newsletter · post Instagram · banner homepage temporaneo "Regala il Santamonica" · target lancio campagna 15 novembre |

### Sforzo FASE 2
~10-12 sessioni distribuite settembre-ottobre.

---

## 4. FASE 3 — Lancio Natale + campagna (novembre → dicembre 2026)

**Obiettivo:** lanciare la campagna gift card, monitorare l'attivazione del sistema, gestire i riscatti, raccogliere feedback per FASE 4.

**Tempo stimato:** 2-3 sessioni di monitoring/fix + tempo extra-tecnico.

### Task FASE 3

| # | Task | Sforzo | Note |
|---|---|---|---|
| F3.1 | Beta test gift cards completo (10 voucher reali) | S | Verifica E2E con dati reali · iter su issue emerse |
| F3.2 | Push campagna pre-Natale (15 novembre - 24 dicembre) | extra-tecnico | Email Brevo a lista contatti raccolti · post Instagram · banner homepage · eventuali Google Ads (decisione fuori roadmap) |
| F3.3 | Monitoring quotidiano: Stripe dashboard + Umami + eventuali errori | XS/giorno | Voucher venduti, transazioni fallite, eventuali bug live |
| F3.4 | Gestione riscatti al ristorante (con o senza pannello mobile F2.5) | extra-tecnico | Workflow: cliente presenta codice · admin verifica e riscatta · email conferma riscatto al cliente |
| F3.5 | Eventuali hotfix critici durante campagna | variabile | Bug-only, no feature aggiunte |
| F3.6 | Post-mortem campagna (gennaio) | S | Numeri venduti vs aspettative · % redemption · feedback clienti · decisioni FASE 4 |

---

## 5. FASE 4 — Refactor consolidamento (gennaio → febbraio 2027)

**Obiettivo:** consolidare il debito tecnico accumulato, sostituire architetture provvisorie con design pulito, rendere lo stack manutenibile a lungo termine.

**Tempo stimato:** 4-5 sessioni dense.

### Task FASE 4

| # | Task | Sforzo | Dipendenze | Note |
|---|---|---|---|---|
| F4.1 | Refactor JSON unica sorgente di verità menu (decisione B1 c — b1b post-Natale) | L (2 sessioni) | — | Estrazione struttura menu in `menu-data.json` · refactor `admin-core.js` per lavorare nativamente su JSON · template `admin-templates-shared.js` come pure renderer JSON → HTML · preview admin client-side dal JSON · rimozione duplicazione `menu.html` / `menu-it.html` · test multilingua |
| F4.2 | Consolidamento admin JS (decisione B2 c — accoppiato a F4.1) | M | F4.1 | Merge `admin-translations.js` + `admin-templates-shared.js` → `admin-vendor.js` · stesso `admin-core.js` · 2 file invece di 3 (+ `foto-optimizer.js` separato) |
| F4.3 | Cache traduzioni server-side Vercel KV (decisione B6 c) | S | — | Modifica `api/translate.js`: check Vercel KV prima di DeepL · scrittura cache no-TTL · header `X-Cache: HIT/MISS` · stima riduzione tempo pubblicazione ~10× post-cache · stima riduzione quota DeepL ~85-90% pubblicazioni successive |
| F4.4 | srcset/picture + AVIF estensione a galleria + eventi + cantina + foto regala (decisione C5.3 c — graduale) | M | F4.1-2 completo | Estensione foto-optimizer applicata a tutte le foto residue · refactor renderer galleria/eventi · benefit Lighthouse Score complessivo |
| F4.5 | Eventuale build step Node con bump version automatico (rivalutazione B9 in fase 3) | M | scelta opzionale | Se senso del refactor consolidato è "stabilità a lungo termine", introdurre `package.json` minimo + script `npm run bump` + eventuale husky pre-commit hook · decisione opzionale fase 4 |

### Sforzo FASE 4
~5-6 sessioni distribuite gennaio-febbraio 2027.

---

## 6. FASE 5 — Rivalutazione strategica + nice-to-have (primavera 2027 in poi)

**Obiettivo:** rivalutare filosofia stack (decisione D1, memo strategico), affrontare backlog priorità minore, identificare nuove opportunità.

### Item da rivalutare in fase 5

| Item | Tipo | Note |
|---|---|---|
| **Filosofia stack** (decisione D1) | rivalutazione | Stack custom sostenibile? · CMS headless modulare per parti specifiche utile? · contesto cambiato? (nuovo dipendente, espansione contenuti, abbandono AI assistance) |
| **Sistema booking custom** (decisione A2) | rivalutazione | Solo dopo 6+ mesi di dati TheFork · ROI commissione vs sviluppo custom |
| **TheFork ritorno** (decisione A2) | task | Reintegrare quando il volume prenotazioni giustifica · 80-150€/mese + commissione coperto |
| **Pannello mobile completo** (B7 c, oltre voucher di F2.5) | feature | Estendere admin mobile per pesce del giorno, modifica prezzi al volo, ecc. |
| **Pesce del giorno / cosa c'è oggi** (A5) | feature | Decidere modello editoriale (quotidiano, lista, settimanale, stagionale) · scelta implementazione (Telegram bot, Instagram source, admin mobile) |
| **Wine pairing menu degustazione** (A9 wp4) | feature | Mappatura 6 piatti × 1 vino abbinato · upgrade percepito menu degustazione |
| **SEO multilingua per /menu-{fr,en}.html** | feature | Description, og:, ld+json localizzati per le lingue (oggi solo robots+canonical) |
| **Push del menu vini e allergeni con stampa font +50%** (replica modifica 13-05 ai template separati) | feature condizionale | Solo se segnalato come problema |
| **Eventbrite o sistema avanzato eventi** (A6 evoluzione) | feature | Solo se volume eventi cresce significativamente o se serve gestione capacità automatica |
| **Iubenda Pro multilingua** (rivedere decisione Privacy/Cookie) | feature | Solo se vuoi privacy/cookie tradotti professionalmente FR+EN |
| **Plausible cloud** (alternativa Umami) | rivalutazione | Solo se Umami self-hosted diventa problematico |
| **GiftCards lessons learned** | rivalutazione | Cosa funziona, cosa no, cosa estendere (es. esperienze cucina, abbonamenti) |

---

## 7. COSTI CONSOLIDATI

### Costi una tantum (entro maggio 2027)

| Voce | Importo | Quando |
|---|---|---|
| Revisione traduzione professionale FR + EN | ~250-400€ | settembre-ottobre 2026 |
| Eventuale shooting fotografico professionale (se serve) | 0€ (genero videomaker) | giugno-agosto 2026 |

### Costi ricorrenti annui

| Voce | Importo | Note |
|---|---|---|
| Iubenda Cookie Solution | ~15€/anno | obbligo legale |
| Dominio `santamonicagenova.it` (Aruba) | ~15€/anno | già attivo |
| Tutti gli altri servizi | 0€ | free tier (Vercel, GitHub, Brevo, DeepL, Google Places, Umami self-hosted) |
| **Totale ricorrente** | **~30€/anno** | |

### Costi variabili

| Voce | Costo unitario | Stima annua |
|---|---|---|
| Commissione Stripe gift cards | 1.5% + 0.25€/transazione | ~2% del fatturato voucher |
| Eventuali costi superamento free tier (Brevo, DeepL, Vercel KV, ecc.) | da 0 a marginale | praticamente trascurabili nei volumi previsti |

### Budget di sicurezza extra (D3 a 0€, ma se necessario)

| Voce eventuale | Costo | Trigger |
|---|---|---|
| Plausible cloud (alternativa Umami) | 9€/mese | se Umami self-hosted problematico |
| DeepL Pro | 5€/mese | se quota Free esaurita |
| Vercel Pro | 20$/mese | se free tier compute non basta |
| TheFork (ripresa booking) | 80-150€/mese + commissione | quando deciso |
| Iubenda upgrade Pro multilingua | +44€/anno | se cambio idea su pagine legali tradotte |

---

## 8. DECISIONI STRATEGICHE PRESE — riepilogo a colpo d'occhio

| # | Decisione | Output |
|---|---|---|
| **A1** Lingue | IT + FR + EN |
| **A2** Booking | Formspree attuale · TheFork in futuro · custom backlog P4 |
| **A3** Newsletter | Brevo · opt-in `#prenota` · rimosso form dedicato |
| **Privacy/Cookie** | Riuso Wix corretto · solo IT · Iubenda Cookie Solution |
| **Candidature** | Sezione rimossa |
| **A4** Schema + Reviews | Schema Restaurant completo · Reviews custom via Vercel function |
| **A5** Pesce del giorno | Backlog (FASE 5+) |
| **A6** Eventi | Pagina e2 + archivio sempre visibile + Schema FoodEvent · calendario set-mag |
| **A7** Gift cards | Sistema Stripe custom · termini T1-T9 definiti · lancio Natale 2026 |
| **A8** Take-away | NO |
| **A9** Cantina | Pagina narrativa c1 da zero · niente wine pairing (wp4 backlog) |
| **B1** menu.html vs menu-it.html | Refactor JSON post-Natale (FASE 4) |
| **B2** Admin JS consolidamento | Cleanup legacy ora · merge `admin-vendor.js` con B1 |
| **B3** GitHub Pages → Vercel | Migrazione contestuale switch DNS finale (FASE 2) |
| **B4** Foto sito | Status quo 4 chiavi semantiche |
| **B5** Galleria | Array 10 foto · masonry |
| **B6** Cache traduzioni | Post-Natale (FASE 4) |
| **B7** Mobile admin | Status quo desktop · pannello mobile dedicato in backlog · pannello riscatto voucher minimal in FASE 2 |
| **B8** GitHub token | Fine-grained PAT subito |
| **B9** Versioning | Manuale come oggi |
| **B10** Revisione traduzione | Professionale FR+EN + override layer · set-ott 2026 |
| **C1** Hero | Video loop (risorsa interna) |
| **C2** OG images | Multiple per sezione + dinamiche per eventi |
| **C3** Mappa | Google Maps embed iframe + sezione "Dove siamo" completa |
| **C4** Footer versione | Rimosso dal pubblico (commento HTML) |
| **C5** srcset/AVIF | Accoppiato a C1c · estensione graduale |
| **C6** Analytics | Umami self-hosted Vercel · tutti 9 eventi |
| **D1** Filosofia stack | Custom · rivalutazione primavera 2027 |
| **D2** Ritmo | Sprint serrato · flessibile · switch DNS graduale via subdomain |
| **D3** Budget | 0€/mese · rivedibile |
| **D4** Gestione | Solo utente + AI + manuale operativo |

---

## 9. ITEM CHIUSI RECENTEMENTE (preservati per memoria)

(stessa lista del precedente ROADMAP, mantenuta)

- ✅ 2026-05-14 — Proxy DeepL via Vercel Serverless Function
- ✅ 2026-05-14 — Counter falliti + report errori traduzione
- ✅ 2026-05-14 — Fix link menu per lingua
- ✅ 2026-05-14 — Inversione menu.html ↔ menu-it.html + iniezione SEO
- ✅ 2026-05-14 — Descrizioni piatti italic 70% del parent
- ✅ 2026-05-14 — Rendering descrizione in `buildDegu`
- ✅ 2026-05-13 — Font +50% in stampa preview menù carta + orario
- ✅ 2026-05-09 v2 — Form prenotazione unificato + footer grid + asterisco automatico
- ✅ 2026-05-09 mattutina — Doppia ottimizzazione WebP + foto sito dinamiche + no popup TheFork
- ✅ 2026-05-02 — Switch motore traduzione Google → DeepL (poi proxy 14-05)
- ✅ 2026-05-02 — Rimozione simboli € da prezzi
- ✅ 2026-04-28 — Fix BUG 2 (defensive check percorsi) + BUG 4 (link QR mancanti)

---

## 10. REGOLE DI MANUTENZIONE ROADMAP

1. **Aggiornare a fine ogni sessione**: spostare gli item completati in "Item chiusi recentemente" (vivono qui ~2-3 sessioni, poi solo in CHANGELOG).
2. **Promuovere item** quando le condizioni cambiano (es. utente decide taglio lingue → A1 chiuso, taglio diventa task F0.2).
3. **Aggiungere nuovi item** se emergono in sessione.
4. **Non rimuovere item FASE 5/backlog senza motivo**: i nice-to-have restano in lista come opzioni future.
5. **Versione documento**: aggiornare riga "Ultimo aggiornamento" + segnare modifiche sostanziali in CHANGELOG.

---

## 11. REGOLA OPERATIVA FISSA (ricorrente in ogni handover)

**Ogni file prodotto per il progetto Santamonica/SantaWeb deve avere la versione aggiornata** in formato `v YYYY.MM.DD.NN`, sia in header sia in footer/UI quando applicabile. **La nuova versione va comunicata esplicitamente all'utente quando si presenta il file.**

La regola si applica a **tutti i file**, senza eccezioni:
- File di deploy (HTML, JS, CSS, JSON dati, asset configurazione)
- **Documenti di continuità** (handover, changelog, roadmap, manuali utente, metodologie)
- Documenti tecnici accessori (specifiche, brief traduttori, schemi, README)

### Versione anche nel nome file (solo documenti di continuità)

Per i **documenti di continuità** (non per file di deploy), la versione va riportata **anche nel nome del file**:

`NOMEFILE_vYYYY.MM.DD.NN.ext`

Esempi:
- `ROADMAP_Santamonica_Web_v2026.05.15.02.md`
- `HANDOVER_Santamonica_Web_v2026.05.16.01.md`
- `CHANGELOG_Santamonica_Web_v2026.05.20.01.md`
- `MANUALE_UTENTE_admin_v2026.06.15.01.md`

I **file di deploy** (HTML/JS/CSS/JSON renderizzati nel sito) **NON** portano la versione nel nome (rompe URL e riferimenti cross-page). La versione resta solo in header + footer/UI.

### Comportamento ad ogni release di documenti di continuità

**Sostituzione**: il file con versione precedente viene rimosso dalla KB, sostituito dal nuovo con versione aggiornata. Lo storico è preservato tramite Git. La KB mantiene solo la versione vigente di ogni documento.

### Propagazione regola

Questa regola va **riportata in ogni futuro documento di continuità/handover** generato per il progetto, così da garantirne la propagazione attraverso le sessioni Claude future indipendentemente da quale memoria persistente venga caricata.

### Formato versione

- `YYYY` = anno (4 cifre)
- `MM` = mese (2 cifre)
- `DD` = giorno (2 cifre)
- `NN` = progressivo nella giornata (2 cifre, da `01`)

Esempi: `v 2026.05.15.01`, `v 2026.05.15.02`, `v 2026.05.16.01`.

---

**Fine roadmap consolidata · v 2026.05.15.02**
