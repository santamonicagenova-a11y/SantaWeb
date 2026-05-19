# CHANGELOG — Santamonica Web

**Versione documento:** v 2026.05.19.04
**Aggiornato:** 2026-05-19 (sera tardi)

> Voci ordinate dal più recente al più vecchio. Appendere in cima a ogni sessione.

---

### 2026-05-19 (sera tardi) — F0.9 CHIUSO 100% definitivo · F0.10 + F0.11 chiusi 100% tecnico · 6 file deploy in 3 batch (.02/.03/.04) · dec. #22-#25 · memoria operativa #5 nuova

**Versioni rilasciate:**
- `cookieconsent-config.js` v 2026.05.19.02 (target=_blank 15 link policy + hideFromBots: true + autoShow !isPolicyPage)
- `privacy.html` v 2026.05.19.02 (bottone .cc-manage §12 + CSS coerente con cookies.html — P3.23 nuovo bloccante risolto)
- `cookies.html` v 2026.05.19.02 (bump coordinato — no modifiche funzionali)
- `regala.html` v 2026.05.19.03 (NUOVO · 3 tagli voucher 100/150/200€ · validità 6 mesi · form Formspree con T5 opt-in)
- `index.html` v 2026.05.19.04 (refactor Schema.org JSON-LD da Restaurant a ItalianRestaurant + @id + dati TARGET + #info aggiornamenti)
- `dove-siamo.html` v 2026.05.19.04 (NUOVO · mobile-first · Schema.org ItalianRestaurant duplicato · OSM iframe transitorio fino a F0.12 · click-to-action + highlight giorno corrente)
- `HANDOVER_Santamonica_Web_v2026.05.19.04.md`
- `CHANGELOG_Santamonica_Web_v2026.05.19.04.md` (questo)
- `ROADMAP_Santamonica_Web_v2026.05.19.04.md` (bump v.13 → v.14)

**File deploy modificati/creati:** 6 (1 JS config + 5 HTML — di cui 2 NUOVI)

**Sintesi:**
- **Sessione lunga**: 3 release deploy coordinate in stessa giornata (batch .02 → .03 → .04). Documenti di continuità adottano NN più alto della giornata (.04) come release coordinata complessiva (eccezione operativa accettata, vedi convenzione ROADMAP §12).

- **Batch 1/3 · v 2026.05.19.02 (F0.9-post chiusura)**: Verifica funzionale F0.9 utente eseguita con metodo strutturato (Blocco 1 404+console · Blocco 2 funzionale banner · Blocco 3 lingue IT/EN/FR · Blocco 4 versioning UI). Esito OK su CF Pages staging incognito. Scoperti 2 difetti residui durante verifica:
  - **Bug fix UX (P3 emergente)**: 15 link policy nelle traduzioni IT/EN/FR del cookieconsent-config (5 link × 3 lingue) non avevano `target="_blank" rel="noopener noreferrer"`. Click dal banner spostava l'utente dal modale. Coerenza convenzione index.html già adottata da v 2026.05.17.08. Corretti tutti 15.
  - **P3.23 nuovo bloccante**: dopo applicazione P3.8 opzione b (autoShow: false su /privacy.html), privacy.html non aveva alcun trigger visibile per gestire preferenze cookie (cookies.html lo aveva già da v 2026.05.17.02 §3). Aggiunto bottone `.cc-manage` in §12 con CSS coerente.
  - Applicate anche P3.5 (hideFromBots: true esplicito) e P3.8 (opzione b confermata utente) dal backlog F0.9-post.
  - cookies.html bump coordinato (no modifiche funzionali) per convenzione "stesso NN per release di sessione".

- **Batch 2/3 · v 2026.05.19.03 (F0.10)**: Prima emissione `regala.html` informativa voucher. Elicitazione utente 10 punti A/B/C/D → confermati: tagli 100/150/200€ · validità 6 mesi · CTA form Formspree (6 campi + honeypot + _subject hidden) · T5 checkbox opt-in marketing NON pre-spuntato · solo IT · palette legal pages · link a /voucher-termini.html con 404 temporaneo accettato fino a F0.14 · banner cookie auto-show abilitato. Endpoint Formspree placeholder `REPLACE_ME_VOUCHER` con TODO commentato. Testi descrittivi placeholder `[TESTO DA COMPLETARE]` (4 occorrenze: intro + 3 card desc). Schema.org Product/Offer rinviato a F0.13.

- **Batch 3/3 · v 2026.05.19.04 (F0.11)**: Schema.org Restaurant + pagina Dove siamo. Elicitazione utente 11 punti M/N/D → confermati: indirizzo · telefono · email info@ (precisazione utente: GIÀ ATTIVA) · orari TARGET in vigore da giugno 2026 · tipo ItalianRestaurant · prezzi €€€ · Place ID `ChIJGzMzZqlD0xIRKRomfkk1F2c` · social IG/FB · pagina dedicata mobile-first + sezione index #info aggiornata · iframe OSM transitorio. Coordinate GPS estratte da Google Maps URL via web search: `44.3913353, 8.9646575`. Scoperta in upload: index.html aveva già blocco Schema.org più antico (@type: Restaurant, email Gmail, orari "vecchi" Wix-style). Refactor completo: @type → ItalianRestaurant, @id per linking semantico con dove-siamo.html, dati TARGET, mantenendo i campi ricchi pre-esistenti (employee Chef Nicolò Lazzaroni + Sommelier Monica Capurro, award Michelin Good Cooking, currenciesAccepted, paymentAccepted, menu). dove-siamo.html: 505 righe mobile-first con default mobile + breakpoint min-width: 640px desktop · click-to-action contatti (tel/mailto/maps/geo:) · JS evidenzia giorno corrente nella tabella orari · OSM iframe lazy-load · 2 bottoni Google Maps + OpenStreetMap · 3 sotto-sezioni "Come arrivare".

- **3 discrepanze info rilevate** tra live Wix (orari/email/IG handle "vecchi"), info dichiarate utente in chat (TARGET), e info nel repo SantaWeb pre-modifica. L'utente ha esplicitato che il sito in costruzione (CF Pages staging) NON è quello live (Wix) e che le discrepanze sono attese durante staging. **Convenzione nuova consolidata (dec. #25)**: inserire dati TARGET pre-go-live (orari da giugno 2026 · email info@). FINAL CHECK obbligatorio pre-F0.21 su tutte le info: orari, email, telefono, indirizzo, voucher, prezzi. **Memoria persistente Claude #5 salvata**.

- **Test V5 Rich Results Test "URL mode"**: errore atteso `noindex,nofollow` (X-Robots-Tag in `_headers` blocca crawl Googlebot per design F0.3). Test alternativo "Codice mode" eseguibile ora; test "URL mode" rinviato a F0.21 post-rimozione noindex.

- **Errore di str_replace recuperato in sessione**: durante modifica index.html (aggiunta link "Dettagli completi"), un str_replace ha rimosso accidentalmente l'apertura della section `#newsletter`. Errore rilevato immediatamente con `view`, ripristinato con secondo str_replace. Nessun impatto su output finale. Lesson learned: validare struttura sezioni con `grep "^<section"` dopo modifiche multi-sezione.

- **Nessuna nuova "sessione fantasma"** (pattern KB↔deploy disallineamento) in questa sessione.

- **4 decisioni operative nuove (cumulative #22-#25)**:
  - **#22**: F0.9-post chiusura · pacchetto release coordinato v.02 — target=_blank 15 link policy + hideFromBots + autoShow conditional + bottone .cc-manage in privacy.html (P3.23 risolto)
  - **#23**: F0.10 specs — tagli 100/150/200€ · validità 6 mesi · CTA Formspree · T5 opt-in marketing · IT only · palette legal pages · link a voucher-termini accettato 404 temp · banner auto-show abilitato
  - **#24**: F0.11 architettura — Schema.org @type ItalianRestaurant con @id linking semantico tra index e dove-siamo · range €€€ · coordinate 44.3913353/8.9646575 · iframe OSM transitorio · pagina dedicata mobile-first + sezione index aggiornata · servesCuisine ["Italian","Seafood","Ligurian"] · campi ricchi pre-esistenti mantenuti
  - **#25**: Convenzione TARGET vs operative durante staging + FINAL CHECK pre-F0.21 obbligatorio (orari, email, telefono, indirizzo, voucher, prezzi)

- **Loop 3 passate F0.9 totali consolidati**: 45 punti rilevati (P1=12, P2=10, P3=20+3 emergenti) · 20 applicati in 2 sessioni · 25 archiviati o promossi a backlog distribuito (F0.12, F0.15, F0.18, F0.21, backlog interpretativo).

- **F0.9 + F0.10 + F0.11 tutti chiusi**. TODO operativi non bloccanti (memoria #5):
  - Endpoint Formspree reale per voucher (F0.10 operativo)
  - Testi descrittivi placeholder regala.html (F0.10 operativo)
  - Logo URL + foto hero JPG (F1.5 / sessione asset)
  - Chiave `info_dettagli_link` in translations.json IT/EN/FR (check pre-F0.21)
  - Allineamento orari + email visibili sezione #info index.html ai TARGET (check pre-F0.21)

**Stato upload utente:** ✅ tutti i 6 file uploadati e verificati V1-V4 OK. F0.9 + F0.10 + F0.11 chiusi al 100% tecnico.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.19.04.md`

---

### 2026-05-19 (mattina) — F0.9 chiusura al 100% pendente verifica · Passata 2 + Passata 3 loop · 4 file deploy · dec. #18-#21 · convenzione consegna file interi

**Versioni rilasciate:**
- `cookieconsent-config.js` v 2026.05.19.01 (P2#8 mode opt-in + P2#4 regex strict + P2#1 rewording IT/EN/FR)
- `index.html` v 2026.05.19.01 (P3.21 fix path duplicati 404)
- `privacy.html` v 2026.05.19.01 (P3.21 + P3.22c disclaimer §12 + fix UI legal-meta)
- `cookies.html` v 2026.05.19.01 (P3.21 + P3.22c disclaimer §4 + fix UI legal-meta)
- `HANDOVER_Santamonica_Web_v2026.05.19.01.md`
- `CHANGELOG_Santamonica_Web_v2026.05.19.01.md`
- `ROADMAP_Santamonica_Web_v2026.05.19.01.md` (bump v.12 → v.13)

**Sintesi:**
- Passata 2 (sostanziale GDPR/cookie law) completata: 3 correzioni applicate (regex strict, rewording, mode opt-in esplicito), 1 declassamento a F0.21 (#6 → dec. #19), 6 archiviati.
- Passata 3 (autocritica + adversarial) completata: 20 punti rilevati + 2 difetti gravi nuovi emersi durante ispezione (P3.21 path duplicati 404, P3.22 disclaimer Stripe+Maps). 3 correzioni applicate in sessione + fix UI bonus discrepanza legal-meta.
- 5ª discrepanza KB↔deploy risolta. 14 punti P3 promossi a backlog ROADMAP.
- Dec. #18-#21 nuove + convenzione consegna file interi memorizzata.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.19.01.md`

---

### 2026-05-17 (tarda sera) — F0.9 al 90% · banner vanilla-cookieconsent v3.1.0 bundle locale · dec. #17 · 4ª discrepanza KB↔deploy

**Versioni rilasciate:**
- `index.html` v 2026.05.17.08, `privacy.html` v 2026.05.17.02, `cookies.html` v 2026.05.17.02
- `cookieconsent-config.js` v 2026.05.17.01 (NUOVO)
- `lib/cookieconsent/cookieconsent.umd.js` + `cookieconsent.css` v3.1.0 upstream (NUOVI)
- `HANDOVER_Santamonica_Web_v2026.05.17.06.md`, `CHANGELOG_Santamonica_Web_v2026.05.17.06.md`, `ROADMAP_Santamonica_Web_v2026.05.17.06.md` (bump v.12)

**Sintesi:**
- F0.9 al 90%: vanilla-cookieconsent v3.1.0 bundle locale, 2 categorie, 3 lingue, parità accept/reject.
- Decisione #17: admin-templates-shared.js SKIP da F0.9.
- 4ª discrepanza KB ↔ deploy risolta. Loop P1 ✅ · P2/P3 ⏳ rimandati a sessione successiva.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.06.md`

---

### 2026-05-17 (notte +2) — F0.3 chiusa al 100% (DNS via Wix) · F0.6bis chiusa · dec. #16 NUOVA

**Versioni rilasciate:** `admin-core.js` v 2026.05.17.04, `menu-admin.html` v 2026.05.17.03, HANDOVER+CHANGELOG+ROADMAP v.11

**Sintesi:** F0.3 chiusa 100% (DNS authoritative = Wix scoperto), F0.6bis chiusa (8 occorrenze fetch admin migrate), dec. #12 #16.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.05.md`

---

### 2026-05-17 (notte +1) — Cleanup repo: rimossi 2 file legacy + audit post-push

**Versioni rilasciate:** HANDOVER+CHANGELOG+ROADMAP v.10

**Sintesi:** Cleanup admin-templates.js legacy + admin-core-FIXED.js residuo. Dec. #15: file con suffisso -FIXED/-OLD/-BACKUP/-COPY vietati in repo.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.04.md`

---

### 2026-05-17 (notte) — F0.4 chiuso (taglio DE/ES) · F0.6 chiuso · F0.3 ancora 80%

**Versioni rilasciate:** `translations.json` v 2026.05.17.01, `admin-core.js` v 2026.05.17.03, `index.html` v 2026.05.17.02, `menu-admin.html` v 2026.05.17.02, `_redirects` v 2026.05.17.01 (NUOVO)

**Sintesi:** F0.4 chiuso (loop 3 passate · 5 file · -40% size translations.json), F0.6 chiuso, dec. #13 #14 nuove.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.03.md`

---

### 2026-05-17 (sera) — F0.3 80% + F0.7 chiusa · hotfix stampa orario

**Versioni rilasciate:** `_headers` v 2026.05.17.01 (NUOVO), `admin-templates-shared.js` v 2026.05.17.02

**Sintesi:** F0.3 al 80% (DNS propagation pending), F0.7 chiusa (fine-grained PAT), hotfix stampa orario, 1ª discrepanza KB rilevata, 3 dec. operative consolidate.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.02.md`

---

### 2026-05-17 (mattina) — F0.0 + F0.1 + F0.2 chiuse · Cloudflare Pages live · F0.8 sospesa

**Versioni rilasciate:** `functions/api/translate.js` v 2026.05.17.02 (NUOVO), `.gitignore` aggiornato

**Sintesi:** F0.0 parziale, F0.1 (Cloudflare account + Pages), F0.2 (porting translate.js), F0.8 sospesa.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.17.01.md`

---

### 2026-05-16 — F0.7bis chiusa · stesura privacy.html + cookies.html IT (DIY)

**Versioni rilasciate:** `privacy.html` v 2026.05.16.02, `cookies.html` v 2026.05.16.02

**Sintesi:** Stesura DIY privacy IT (14 sezioni) + cookie IT (7 sezioni). Metodologia "3 passate critiche" applicata · 21 correzioni totali.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.16.01.md`

---

### 2026-05-15 (sera) — bozze privacy v3 + ROADMAP v.06 + dati titolare

**Versioni rilasciate:** `ROADMAP_Santamonica_Web_v2026.05.15.06.md` (superseded)

**Sintesi:** Schema bozza privacy v3, ROADMAP v.06 (switch hosting, gift cards Stripe Payment Links, Iubenda Pro→Advanced→DIY), costi 12 mesi consolidati.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.15.06.md`

---

### 2026-05-15 (pomeriggio) — feature "Documento generico" admin

**Versioni rilasciate:** `menu-admin.html` v 2026.05.15.01, `admin-core.js` v 2026.05.15.04 (NON pushate)

**Sintesi:** Nuova feature admin caricamento PDF/DOCX/TXT, 9 funzioni JS, lazy load PDF.js + Mammoth.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.15.02.md`

---

### 2026-05-15 (mattina) — pianificazione strategica + revisione metodo continuità

**Versioni rilasciate:** ROADMAP + METODO continuità (regola versioning v2)

**Sintesi:** Pianificazione strategica completa · 40 decisioni. Regola versioning v2: estesa a documenti continuità con naming file.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.15.01.md`

---

### 2026-05-14 — Proxy DeepL Vercel + fix link menu + inversione menu.html/menu-it.html

**Versioni rilasciate:** `api/translate.js` v 2026.05.14.01 (NUOVO) + 4 altri

**Sintesi:** Proxy Vercel Serverless Function per DeepL, fix link menu lingua, inversione menu.html/menu-it.html.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.14.01.md`

---

### 2026-05-13 — Font +50% in stampa preview menù

**Versioni rilasciate:** `admin-templates-shared.js` v 2026.05.13.01

**Sintesi:** html { font-size: 24px; } nel @media print, poi ridotto a 20px e gestito con override #layout-orario.

**Handover dettagliato:** `HANDOVER_Santamonica_Web_v2026.05.13.01.md`

---

## STATO PROGETTO CONSOLIDATO (post 2026-05-19 sera tardi)

### File deploy correnti

| File | Versione | Hosting |
|---|---|---|
| **`index.html`** | **v 2026.05.19.04** ⭐ | GH Pages + CF Pages |
| **`dove-siamo.html`** | **v 2026.05.19.04** ⭐ NUOVO | GH Pages + CF Pages |
| **`regala.html`** | **v 2026.05.19.03** ⭐ NUOVO | GH Pages + CF Pages |
| **`privacy.html`** | **v 2026.05.19.02** ⭐ | GH Pages + CF Pages |
| **`cookies.html`** | **v 2026.05.19.02** ⭐ | GH Pages + CF Pages |
| **`cookieconsent-config.js`** | **v 2026.05.19.02** ⭐ | GH Pages + CF Pages |
| `lib/cookieconsent/cookieconsent.umd.js` | v3.1.0 upstream | GH Pages + CF Pages |
| `lib/cookieconsent/cookieconsent.css` | v3.1.0 upstream | GH Pages + CF Pages |
| `translations.json` | v 2026.05.17.02 (chiave `info_dettagli_link` mancante — check pre-F0.21) | GH Pages |
| `menu-admin.html` | v 2026.05.17.03 | Vercel |
| `admin-core.js` | v 2026.05.17.04 | Vercel |
| `admin-templates-shared.js` | v 2026.05.17.02 | Vercel |
| `foto-optimizer.js` | v 2026.05.09.02 | Vercel |
| `api/translate.js` (legacy) | v 2026.05.14.01 | Vercel |
| `functions/api/translate.js` | v 2026.05.17.02 | Cloudflare Pages |
| `_headers` | v 2026.05.17.01 | Cloudflare Pages |
| `_redirects` | v 2026.05.17.01 | Cloudflare Pages |

⭐ = rilasciato/aggiornato in questa sessione

### Sistema auth/credenziali

| Servizio | Stato | Env var/storage |
|---|---|---|
| GitHub PAT fine-grained | ✅ attivo (scope Contents R/W solo SantaWeb, scadenza 2027-05-17) | `localStorage['gh_token']` admin |
| Vercel admin | ✅ attivo | localStorage admin |
| HMAC salt | ✅ generato 2026-05-17 (Bitwarden) · injection F0.15 | `CONSENT_HMAC_SALT` |
| Cloudflare account | ✅ attivo + 2FA TOTP | — |
| DeepL Free | ✅ API key (CF + Vercel) | `DEEPL_KEY` |
| Wix account | ⚠️ pannello DNS authoritative | — |
| Formspree | ✅ account attivo (prenotazioni + voucher F0.10) · endpoint voucher dedicato da configurare | — |
| Email `info@santamonicagenova.it` | ✅ GIÀ ATTIVA (precisazione utente 19-05) · altre @ alias a F0.21 con Email Routing | — |

### Convenzioni progetto (aggiornate 19-05 sera tardi)

| Aspetto | Convenzione |
|---|---|
| Versioning file | `v YYYY.MM.DD.NN` (header + footer/UI visibile dove applicabile) |
| Naming continuità | `NOMEFILE_vYYYY.MM.DD.NN.ext` |
| Naming deploy | NO versione nel nome |
| Release | Sostituzione completa · vecchio rimosso da KB · storico in Git |
| File con suffisso `-FIXED`/`-OLD`/`-BACKUP`/`-COPY` | VIETATI in repo (dec. #15) |
| DNS authoritative `santamonicagenova.it` | Wix (`ns14/15.wixdns.net`) fino a F0.21 (dec. #16) |
| Banner cookie su pagine pubbliche | Solo navigazionali (index/privacy/cookies/regala/dove-siamo). NON su pagine menu (dec. #17) |
| Banner cookie auto-show | Abilitato di default · disabilitato condizionalmente solo su `/privacy.html` e `/cookies.html` via `autoShow: !isPolicyPage` (dec. #22) |
| Bottone "Gestisci preferenze cookie" (.cc-manage) | Obbligatorio in pagine con autoShow disabilitato. Su altre pagine opzionale |
| Link interni alle policy nei banner cookie | `target=_blank rel=noopener noreferrer` su tutti i 15 link policy traduzioni (dec. #22) |
| Link footer Privacy/Cookies in pagine | `target=_blank rel=noopener noreferrer` (già consolidato) |
| Bundle JS terze parti | Sempre bundle locale in `/lib/<nome>/`, mai CDN |
| Bump `revision` cookieconsent | Solo per modifiche sostanziali policy (dec. #20) |
| Embed di terze parti | Sempre JS+callback `onConsent`, mai iframe hardcoded (dec. #21) — eccezione transitoria OSM iframe in dove-siamo + index #info fino a F0.12 (dec. #24) |
| Consegna file modificati da Claude | Sempre file interi in outputs + present_files (memoria #4) |
| Convenzione TARGET vs operative durante staging | Inserire dati TARGET pre-go-live · FINAL CHECK obbligatorio pre-F0.21 su orari, email, telefono, indirizzo, voucher, prezzi (dec. #25, memoria #5) |
| Lingue | IT/FR/EN (DE/ES ritirate via F0.4) |
| Schema.org Restaurant | `@type: ItalianRestaurant` · `@id: https://santamonicagenova.it/#restaurant` duplicato in index.html + dove-siamo.html per SEO (dec. #24) |
| Pagine mobile-first | dove-siamo.html prima pagina con approccio mobile-first esplicito (default mobile + breakpoint min-width: 640px). Pattern riusabile per future pagine |
| `_meta` in JSON | chiave `_meta` come prima entry |
| URL fetch admin | costante `BASE_FETCH_URL` in `admin-core.js` |
| Stampa carta | html font-size 20px in @media print |
| Stampa orario | scoped override `#layout-orario` (font −22%) |
| Coordinate GPS canoniche progetto | `44.3913353, 8.9646575` (estratte da Google Maps Place ID URL via web search 19-05) |
| Place ID Google canonico | `ChIJGzMzZqlD0xIRKRomfkk1F2c` (dec. #8) |

### REGOLA OPERATIVA FISSA (versionamento)

> Ogni file prodotto per il progetto Santamonica/SantaWeb deve avere la versione aggiornata in formato `v YYYY.MM.DD.NN`, sia in header sia in footer/UI quando applicabile. La nuova versione va **comunicata esplicitamente** all'utente quando si presenta il file.
>
> La regola si applica a tutti i file: deploy (HTML/JS/CSS/JSON) e documenti di continuità (handover/changelog/roadmap/manuali).
>
> **Versione anche nel nome** (solo documenti di continuità): `NOMEFILE_vYYYY.MM.DD.NN.ext`. File di deploy NON portano versione nel nome.
>
> **Sostituzione ad ogni release**: file con versione precedente rimosso dalla KB, sostituito dalla nuova versione. Storico in Git.
>
> **Coordinamento `NN` multi-documento**: per release di sessione (HANDOVER + CHANGELOG + ROADMAP + file deploy della sessione) usare lo stesso `NN`. Per release autonome di un singolo documento, `NN` per-documento.
>
> **Eccezione operativa accettata sessione 19-05 sera tardi**: se nella stessa sessione si rilasciano più batch separati di file deploy a NN incrementali (.02, .03, .04), i documenti di continuità prodotti a fine sessione adottano l'`NN` più alto della giornata (.04 nel caso 19-05) come release coordinata complessiva, citando esplicitamente i NN intermedi.
>
> **Questa regola va riportata in ogni documento di continuità per propagarla.**

---

**Fine CHANGELOG · v 2026.05.19.04**
