/* ═══════════════════════════════════════════════════════════════════════
   cookieconsent-config.js
   Santamonica · Il Giuliano di Andrea Giachino e C. S.a.s.
   v 2026.05.23.01
   F0.23 — Categorie tracking (analytics GA4 + advertising Meta Pixel) · revision: 3
   ───────────────────────────────────────────────────────────────────────
   Dipendenze:  /lib/cookieconsent/cookieconsent.umd.js (caricato prima)
                /lib/iframemanager/iframemanager.umd.js (caricato prima · F0.12)
   Espone:      window.CookieConsent (globale, già attivo dopo run)
                window.iframemanager (globale dell'istanza, dopo init)
   Lingue:      IT (default) · EN · FR  — auto-detect via <html lang> del documento (default IT)
   Categorie:   necessary (always on) · embeds (opt-in) · analytics (opt-in) · advertising (opt-in)
   Servizi:     embeds → googleMaps · analytics → ga4 · advertising → metaPixel
   Conformità:  GDPR Reg. UE 2016/679 · D.Lgs. 196/2003 art. 122
                Linee guida Garante 10-06-2021 (no cookie wall · parità accept/reject · granularità finalità)
                Art. 13 GDPR (informativa specifica per servizio) · Art. 22 (no profilazione senza consenso)
                Art. 44+ GDPR (trasferimento extra-UE) → Google LLC USA · Meta Platforms Inc. USA
                EU-U.S. Data Privacy Framework (decisione adeguatezza 10-07-2023; Google e Meta auto-certificati)
   ───────────────────────────────────────────────────────────────────────
   STORICO MODIFICHE
   - v 2026.05.23.01 (F0.23 — categorie tracking per campagna anniversario / funnel invernale):
       · [nuove categorie] Aggiunte 'analytics' (servizio ga4) e 'advertising'
                 (servizio metaPixel), entrambe opt-in (enabled:false, readOnly:false).
                 DECISIONE D-F0.23-1: due categorie GRANULARI separate (statistica vs
                 marketing) invece di una combinata — finalità distinte, scelta separata
                 (best-practice Garante). Accorpabili in futuro se richiesto.
       · [gating] onFirstConsent/onConsent/onChange estesi: 'analytics' → loadGA4(),
                 'advertising' → loadMetaPixel(); revoca → disableGA4() / cookie ripuliti
                 da autoClear. Stesso pattern del gate Maps F0.12.
       · [loader STUB] GA4_MEASUREMENT_ID e META_PIXEL_ID inizializzati VUOTI:
                 i loader sono INERTI finché gli ID non sono compilati (TODO).
                 → deploy sicuro anche senza ID (nessuno script di tracking parte).
       · [autoClear] analytics: _ga, _ga_*, _gid, _gat* · advertising: _fbp, _fbc, fr.
       · [testi] consentModal description IT/EN/FR riscritta: ora il sito USA (su consenso)
                 cookie di statistica e marketing → la vecchia dicitura "solo cookie tecnici"
                 era diventata fuorviante (rischio violazione informativa). preferencesModal:
                 due nuove sezioni IT/EN/FR con vendor (Google LLC / Meta Platforms), trasferimento
                 USA e base DPF.
       · [revision] 2 → 3: nuovo trattamento (statistica + marketing/profilazione) e nuovi
                 trasferimenti extra-UE → consenso richiesto nuovamente a tutti.
       · [DIPENDENZA #7] Pixel/GA4, anche con ID compilati, restano BLOCCATI dalla CSP
                 finché _headers non include i domini Meta/Google in script-src/img-src/
                 connect-src (vedi handover MetaAds v2026.05.23.01, prerequisito #7).
   - v 2026.05.21.01 (F0.20 — finding C3): language.autoDetect 'browser' -> 'document'.
       Il banner seguiva la lingua del BROWSER (es. utente con browser EN su sito IT
       vedeva il banner in inglese al primo load). Ora segue <html lang> del documento
       (default 'it'), coerente con "IT default" e con lo switch lingua del sito.
   - v 2026.05.19.05 (F0.12 — introduzione Google Maps con consent gate):
       · [F0.12 core] Inizializzazione iframemanager prima di CookieConsent.run().
                 Servizio "google-maps" registrato con embedUrl share-link Google
                 (nessuna API key richiesta · D-F0.12-1 opt-a iframemanager
                 + m1 share-embed Google senza Maps Embed API key).
       · [F0.12 core] Callback onFirstConsent + onConsent + onChange aggiunte:
                 · onConsent: se 'embeds' nei cookie.categories → im.acceptService('google-maps')
                 · onChange: se 'embeds' rimosso → im.rejectService('google-maps')
                 → caricamento condizionato del frame Google Maps al consenso
                 → revoca consenso = iframe immediatamente smontato + cookies puliti
       · [P3 in-session F0.12 · bug fix critico] iframemanager reso OPZIONALE.
                 Bozza iniziale faceva `return` se iframemanager mancava: avrebbe
                 spento il banner cookie sulle pagine senza embed (privacy/cookies/
                 index/regala) → tutte le pagine policy senza banner = violazione
                 totale GDPR. Refactor: rilevamento via hasIframemanager flag,
                 init im.run() solo se presente, callback già guardati da
                 `if (window.im && typeof ...acceptService === 'function')`
                 quindi sicuri su pagine senza iframemanager.
       · [P3 in-session F0.12 · embedUrl pattern] Cambiato pattern embedUrl
                 Google Maps da `?q=place_id:{data-id}` a
                 `?q={data-id}&hl=it&z=16` con data-id = coordinate "lat,lng".
                 Motivo: pattern place_id può restituire pagina interstiziale
                 Google "click to view full map" anziché iframe diretto. Pattern
                 coordinate è documentato pubblicamente da Google, restituisce
                 sempre iframe embeddabile senza API key. Place ID resta in
                 Schema.org @id e nei link map-actions (Directions API).
       · [dec. #20 propagation] revision: 1 → 2 (modifica sostanziale policy:
                 nuovo trattamento Maps effettivamente attivo · nuovo trasferimento
                 extra-UE verso Google LLC USA · nuovi cookie posati su consenso).
                 Tutti gli utenti che avevano consenso precedente vengono richiesti
                 nuovamente.
       · [P3.10 chiuso] preferencesModal IT/EN/FR sezione "embeds" / "Contenuti
                 incorporati" arricchita: menzione esplicita di Google LLC, USA,
                 base giuridica EU-U.S. Data Privacy Framework (decisione
                 adeguatezza Commissione UE 10 luglio 2023), link alla
                 Cookie Policy per dettaglio cookie posati.
       · [P3.16 chiuso · D-F0.12-2 opt-a] Label service "Google Maps" mantenuta
                 (massima trasparenza GDPR Art. 13 · dichiarare il vendor specifico).
       · [autoClear ampliato] regex aggiornata a /^(NID|SOCS|OGPC|CONSENT)$/.
                 Aggiunto CONSENT (cross-Google, 2 anni). NID/SOCS/OGPC erano
                 già presenti. _Secure-ENID (browser ESS, 13m) intenzionalmente
                 NON in regex perché è cookie Google Search/account più generale,
                 non specifico Maps Embed: il rischio di cancellare cookie utili
                 a un utente loggato Google supera il beneficio (vedi P2#4 nota
                 v 2026.05.19.01). Resta documentato in cookies.html §4.
       · [consentModal description] testo invariato (riferimento generico
                 "mappe interattive"). Dettaglio Google + DPF è nel
                 preferencesModal embeds e in cookies.html §4.
       · [m4 opt-a] Auto-mostra Google Maps appena l'utente accetta "embeds"
                 dal banner: pattern standard iframemanager + cookieconsent v3.
   - v 2026.05.19.02 (verifica funzionale F0.9 — 3 modifiche):
       · [bug fix UX] target="_blank" rel="noopener noreferrer" a 15 link policy
                 nelle traduzioni IT/EN/FR
       · [P3.5] hideFromBots: true esplicito
       · [P3.8 opzione b] autoShow: !isPolicyPage con detection regex
                 /\/(privacy|cookies)\.html$/ → no banner auto-show su policy pages
   - v 2026.05.19.01 (Passata 2 sostanziale F0.9):
       · [#8 P2] mode: 'opt-in' esplicito
       · [#4 P2] regex autoClear googleMaps stretta /^(NID|SOCS|OGPC)$/
                 (rimosso __Secure-* per evitare falsi positivi su Google account)
       · [#1 P2] rewording IT/EN/FR senza menzione "Google Maps" prematura
   - v 2026.05.17.01: prima emissione · IT/EN/FR · 2 categorie · revision 1
   ─────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ─── Pre-flight: dipendenze ─── */
  if (typeof window.CookieConsent === 'undefined') {
    console.error('[cookieconsent-config] CookieConsent UMD non caricato. Verifica /lib/cookieconsent/cookieconsent.umd.js');
    return;
  }

  /* [v 2026.05.19.05 F0.12] iframemanager è OPZIONALE: caricato solo su pagine
     con embed di terze parti (attualmente solo /dove-siamo.html). Sulle altre
     pagine (privacy, cookies, index, regala) il banner deve continuare a
     funzionare anche senza iframemanager. Il gate Google Maps si attiva solo
     dove iframemanager è presente. */
  const hasIframemanager = typeof window.iframemanager !== 'undefined';
  if (!hasIframemanager) {
    // Log silente solo in dev: in produzione questo è atteso sulle pagine senza embed
    if (typeof console !== 'undefined' && console.debug) {
      console.debug('[cookieconsent-config v 2026.05.19.05] iframemanager non presente in questa pagina: gate Google Maps disattivato (atteso su pagine senza embed).');
    }
  }

  /* [v 2026.05.19.02 P3.8] Rileva pagine policy per disabilitare auto-show del banner.
     Su /privacy.html e /cookies.html l'utente può leggere la policy senza che il banner
     interrompa la lettura. Il bottone "Gestisci preferenze cookie" del footer rimane
     operativo (azionato da data-cc="show-preferencesModal" nel markup). */
  const isPolicyPage = /\/(privacy|cookies)\.html$/.test(window.location.pathname);

  /* [v 2026.05.19.02 P3.8] Rileva lingua per i18n iframemanager.
     iframemanager ha proprie traduzioni separate da cookieconsent: ci assicuriamo
     che siano allineate alla lingua del browser. */
  const browserLang = (navigator.language || 'it').slice(0, 2).toLowerCase();
  const imLang = ['it', 'en', 'fr'].includes(browserLang) ? browserLang : 'it';

  /* ═══════════════════════════════════════════════════════════════════════
     [v 2026.05.23.01 F0.23] LOADER TRACKING — GA4 + Meta Pixel (gated)
     ═══════════════════════════════════════════════════════════════════════
     I loader sono INERTI finché gli ID restano vuoti: deploy sicuro senza ID.
     Quando arrivano gli ID (lato committente: account Meta / proprietà GA4):
       1) compilare le due costanti qui sotto;
       2) estendere la CSP in _headers (prerequisito #7 handover MetaAds) coi
          domini Meta/Google, altrimenti gli script vengono BLOCCATI a runtime
          (stesso meccanismo del bug C2 su Formspree).
     I loader vengono chiamati SOLO dai callback di consenso (onConsent/onChange/
     onFirstConsent): nulla parte prima del consenso esplicito.
     ─────────────────────────────────────────────────────────────────────── */
  var GA4_MEASUREMENT_ID = '';   // TODO F0.23 → inserire 'G-XXXXXXXXXX' (proprietà GA4)
  var META_PIXEL_ID      = '';   // TODO F0.23 → inserire l'ID Pixel (solo cifre)

  var ga4Loaded = false, pixelLoaded = false;

  function loadGA4() {
    if (ga4Loaded || !GA4_MEASUREMENT_ID) return;
    ga4Loaded = true;
    window['ga-disable-' + GA4_MEASUREMENT_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // anonymize_ip: minimizzazione · consent già acquisito (load solo su opt-in)
    window.gtag('config', GA4_MEASUREMENT_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_MEASUREMENT_ID);
    document.head.appendChild(s);
  }

  function disableGA4() {
    // Non è possibile "scaricare" gtag.js già iniettato in-sessione: lo neutralizziamo
    // col flag ufficiale Google (blocca ulteriori hit) + autoClear rimuove i cookie _ga*.
    if (GA4_MEASUREMENT_ID) window['ga-disable-' + GA4_MEASUREMENT_ID] = true;
  }

  function loadMetaPixel() {
    if (pixelLoaded || !META_PIXEL_ID) return;
    pixelLoaded = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
    // NB: il Pixel non si "scarica" in-sessione dopo revoca. Mitigazione: non si
    // re-inizializza (guardia pixelLoaded) e autoClear rimuove _fbp/_fbc/fr. Lo
    // smontaggio reale avviene al ricaricamento pagina senza consenso.
  }

  /* ═══════════════════════════════════════════════════════════════════════
     INIZIALIZZAZIONE IFRAMEMANAGER (PRIMA di CookieConsent.run)
     ═══════════════════════════════════════════════════════════════════════
     Pattern: registriamo il servizio 'google-maps' ma NON lo accettiamo qui.
     L'accettazione effettiva (im.acceptService) avviene nei callback
     onConsent/onChange di CookieConsent quando la categoria 'embeds' viene
     concessa. Senza consenso, iframemanager mostra solo il placeholder con
     thumbnail e bottone "Carica mappa".

     L'init avviene SOLO se iframemanager è stato caricato in questa pagina:
     su privacy/cookies/index/regala è atteso che non lo sia (no embed in pagina).
     ─────────────────────────────────────────────────────────────────────── */

  if (hasIframemanager) {

    const im = window.iframemanager();
    // Esponi globalmente per debug e per chiamate dai callback CookieConsent
    window.im = im;

    im.run({

      currLang: imLang,

      services: {

        'google-maps': {

          /* embedUrl: pattern share-embed Google Maps basato su coordinate lat,lng.
             m1 opt-a confermato: NO Maps Embed API, NO API key, NO billing, NO quota.
             {data-id} viene interpolato a runtime con il valore dell'attributo
             data-id del <div> placeholder. Per Santamonica il data-id contiene
             "lat,lng" (es. "44.3913353,8.9646575") — pattern robusto e
             documentato pubblicamente da Google.
             [P3 in-session loop F0.12] Cambiato da pattern place_id (che può
             restituire pagina interstiziale "click to view") a pattern coordinate
             che restituisce direttamente l'iframe embeddabile. */
          embedUrl: 'https://maps.google.com/maps?q={data-id}&hl=it&z=16&output=embed',

          /* thumbnailUrl: SVG segnaposto locale (zero rete, zero cookie).
             m3 opt-a: stesso asset usato anche dalla homepage come CTA statico. */
          thumbnailUrl: '/img/map-placeholder.svg',

          iframe: {
            allow: 'fullscreen; geolocation;',
            referrerpolicy: 'no-referrer-when-downgrade'
          },

          cookie: {
            name: 'cc_google-maps'  // cookie locale iframemanager per "ricorda scelta"
          },

          languages: {

            it: {
              notice: 'Questo contenuto è ospitato da <strong>Google LLC</strong> (USA). Visualizzando la mappa, dati di navigazione (incluso il tuo indirizzo IP) saranno trasmessi a Google e potrebbero essere utilizzati per finalità proprie di Google. Il trasferimento avviene sulla base della decisione di adeguatezza UE-USA (Data Privacy Framework, 10 luglio 2023). Maggiori dettagli sui cookie posati in <a rel="noopener noreferrer" href="/cookies.html" target="_blank">Cookie Policy</a>.',
              loadBtn: 'Carica la mappa',
              loadAllBtn: 'Non chiedermelo più (accetta sempre)'
            },

            en: {
              notice: 'This content is hosted by <strong>Google LLC</strong> (USA). By loading the map, browsing data (including your IP address) will be sent to Google and may be used for Google\'s own purposes. The transfer relies on the EU-U.S. Data Privacy Framework adequacy decision (10 July 2023). More details about the cookies set in our <a rel="noopener noreferrer" href="/cookies.html" target="_blank">Cookie Policy</a>.',
              loadBtn: 'Load map',
              loadAllBtn: 'Don\'t ask again (always accept)'
            },

            fr: {
              notice: 'Ce contenu est hébergé par <strong>Google LLC</strong> (USA). En affichant la carte, des données de navigation (y compris votre adresse IP) seront transmises à Google et pourront être utilisées par Google à ses propres fins. Le transfert se fonde sur la décision d\'adéquation UE-USA (Data Privacy Framework, 10 juillet 2023). Plus de détails sur les cookies déposés dans notre <a rel="noopener noreferrer" href="/cookies.html" target="_blank">Politique des cookies</a>.',
              loadBtn: 'Charger la carte',
              loadAllBtn: 'Ne plus demander (toujours accepter)'
            }

          }

        }

      }

    });

  } // fine if (hasIframemanager)

  /* ═══════════════════════════════════════════════════════════════════════
     CONFIGURAZIONE COOKIECONSENT (con callback onConsent/onChange F0.12 + F0.23)
     ═══════════════════════════════════════════════════════════════════════ */

  CookieConsent.run({

    /* ─── Modalità consenso esplicita (default lib v3 ma dichiarato per chiarezza) ─── */
    mode: 'opt-in',

    /* ─── Revisione:
           F0.12 (dec.#20): 1 → 2 (attivazione Google Maps, extra-UE Google).
           F0.23: 2 → 3 (nuove categorie statistica + marketing/profilazione,
                  nuovi trasferimenti extra-UE Google LLC + Meta Platforms Inc.).
           Bump forza richiesta nuovo consenso a tutti gli utenti. ─── */
    revision: 3,

    /* ─── [v 2026.05.19.02 P3.8] Auto-show condizionato: no su pagine policy ─── */
    autoShow: !isPolicyPage,

    /* ─── [v 2026.05.19.02 P3.5] Anti-falsi positivi crawler (è già default v3) ─── */
    hideFromBots: true,

    /* ─── Cookie di stato del consenso ─── */
    cookie: {
      name: 'cc_cookie',
      expiresAfterDays: 182,   // 6 mesi (raccomandazione Garante)
      path: '/',
      sameSite: 'Lax'
    },

    /* ─── Opzioni UI ─── */
    guiOptions: {
      consentModal: {
        layout: 'box wide',
        position: 'middle center',
        equalWeightButtons: true,
        flipButtons: false
      },
      preferencesModal: {
        layout: 'box',
        position: 'right',
        equalWeightButtons: true,
        flipButtons: false
      }
    },

    /* ═══════════════════════════════════════════════════════════════════
       CALLBACK — Ponte CookieConsent ↔ servizi gated
       ═══════════════════════════════════════════════════════════════════
       F0.12: embeds → iframemanager google-maps.
       F0.23: analytics → GA4 · advertising → Meta Pixel.

       - onFirstConsent: prima scelta dell'utente.
       - onConsent:      ogni page-load con consenso valido → riapplica lo stato.
       - onChange:       modifica dal modale preferenze → sincronizza i servizi.

       Tutte le attivazioni sono idempotenti (guardie loaded + ID vuoto).
       ─────────────────────────────────────────────────────────────────── */

    onFirstConsent: function ({ cookie }) {
      var cats = cookie.categories;
      // embeds → google maps
      if (cats.indexOf('embeds') !== -1) {
        if (window.im && typeof window.im.acceptService === 'function') {
          window.im.acceptService('google-maps');
        }
      }
      // analytics → GA4
      if (cats.indexOf('analytics') !== -1) loadGA4();
      // advertising → Meta Pixel
      if (cats.indexOf('advertising') !== -1) loadMetaPixel();
    },

    onConsent: function ({ cookie }) {
      var cats = cookie.categories;
      // embeds → google maps
      if (cats.indexOf('embeds') !== -1) {
        if (window.im && typeof window.im.acceptService === 'function') {
          window.im.acceptService('google-maps');
        }
      } else {
        if (window.im && typeof window.im.rejectService === 'function') {
          window.im.rejectService('google-maps');
        }
      }
      // analytics → GA4
      if (cats.indexOf('analytics') !== -1) loadGA4(); else disableGA4();
      // advertising → Meta Pixel
      if (cats.indexOf('advertising') !== -1) loadMetaPixel();
    },

    onChange: function ({ cookie /*, changedCategories, changedServices */ }) {
      var cats = cookie.categories;
      // embeds → google maps
      if (cats.indexOf('embeds') !== -1) {
        if (window.im && typeof window.im.acceptService === 'function') {
          window.im.acceptService('google-maps');
        }
      } else {
        if (window.im && typeof window.im.rejectService === 'function') {
          window.im.rejectService('google-maps');
        }
      }
      // analytics → GA4
      if (cats.indexOf('analytics') !== -1) loadGA4(); else disableGA4();
      // advertising → Meta Pixel
      if (cats.indexOf('advertising') !== -1) loadMetaPixel();
    },

    /* ─── Categorie consenso ─── */
    categories: {
      necessary: {
        enabled: true,
        readOnly: true
      },
      embeds: {
        enabled: false,
        readOnly: false,
        services: {

          googleMaps: {
            label: 'Google Maps',
            cookies: [
              /* [v 2026.05.19.05 F0.12] Regex ampliata da
                 /^(NID|SOCS|OGPC)$/ a /^(NID|SOCS|OGPC|CONSENT)$/.
                 Aggiunto CONSENT (cookie cross-Google, durata 2 anni) che è
                 documentato dalla policy ufficiale Google. NID/SOCS/OGPC erano
                 già presenti in v 2026.05.19.01 (P2#4).
                 NOTE: _Secure-ENID (variante ESS di NID, 13m) intenzionalmente
                 NON in regex per evitare falsi positivi su account Google
                 (è cookie Search/account più ampio di Maps Embed). Resta
                 documentato in cookies.html §4 per trasparenza. */
              { name: /^(NID|SOCS|OGPC|CONSENT)$/ }
            ]
          }

        }
      },

      /* [v 2026.05.23.01 F0.23] Statistica — Google Analytics 4.
         autoClear rimuove i cookie GA alla revoca: _ga (2 anni), _ga_<container>,
         _gid (24h), _gat* (1 min throttling). */
      analytics: {
        enabled: false,
        readOnly: false,
        autoClear: {
          cookies: [
            { name: /^_ga/ },
            { name: /^_gid$/ },
            { name: /^_gat/ }
          ]
        },
        services: {
          ga4: {
            label: 'Google Analytics 4 (GA4)'
          }
        }
      },

      /* [v 2026.05.23.01 F0.23] Marketing — Meta Pixel (Facebook/Instagram).
         autoClear rimuove i cookie del Pixel alla revoca: _fbp (3 mesi),
         _fbc (clickID, 3 mesi), fr (cookie Meta, 3 mesi). */
      advertising: {
        enabled: false,
        readOnly: false,
        autoClear: {
          cookies: [
            { name: /^_fbp$/ },
            { name: /^_fbc$/ },
            { name: /^fr$/ }
          ]
        },
        services: {
          metaPixel: {
            label: 'Meta Pixel (Facebook / Instagram)'
          }
        }
      }
    },

    /* ─── Lingue e traduzioni ─── */
    language: {
      default: 'it',
      autoDetect: 'document',

      translations: {

        /* ═══════════════════════════ ITALIANO ═══════════════════════════ */
        it: {
          consentModal: {
            title: 'Cookie e privacy',
            description: 'Questo sito utilizza cookie tecnici necessari al funzionamento. Solo con il tuo consenso possiamo usare cookie di statistica (Google Analytics), cookie di marketing (Meta Pixel) e caricare contenuti incorporati di terze parti (ad es. mappe interattive). Puoi accettare, rifiutare o scegliere per categoria. Maggiori dettagli nella nostra <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a> e nell\'<a href="/privacy.html" target="_blank" rel="noopener noreferrer">Informativa sulla Privacy</a>.',
            acceptAllBtn: 'Accetta tutti',
            acceptNecessaryBtn: 'Rifiuta tutti',
            showPreferencesBtn: 'Personalizza',
            footer: '<a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>\n<a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a>'
          },
          preferencesModal: {
            title: 'Preferenze cookie',
            acceptAllBtn: 'Accetta tutti',
            acceptNecessaryBtn: 'Rifiuta tutti',
            savePreferencesBtn: 'Salva preferenze',
            closeIconLabel: 'Chiudi',
            serviceCounterLabel: 'Servizi',
            sections: [
              {
                title: 'Uso dei cookie',
                description: 'Questo sito utilizza cookie tecnici necessari al funzionamento e, solo con il tuo consenso, cookie di statistica e di marketing e contenuti incorporati di terze parti. Puoi attivarli o disattivarli per categoria qui sotto. Trovi il dettaglio completo nella <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a>.'
              },
              {
                title: 'Cookie strettamente necessari',
                description: 'Indispensabili per il funzionamento del sito. Non possono essere disattivati e non richiedono consenso.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Cookie di statistica',
                description: 'Se attivi questa categoria useremo <strong>Google Analytics 4</strong> per capire in forma aggregata come viene usato il sito (pagine viste, provenienza del traffico). Il servizio è fornito da <strong>Google LLC</strong> (Mountain View, California, USA), che imposta cookie propri (es. <code>_ga</code>, <code>_ga_*</code>, <code>_gid</code>). L\'indirizzo IP è trattato in forma anonimizzata. Il trasferimento dei dati negli Stati Uniti si fonda sulla decisione di adeguatezza UE-USA (<em>EU-U.S. Data Privacy Framework</em>, 10 luglio 2023). Dettaglio dei cookie nella <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy §5</a>.',
                linkedCategory: 'analytics'
              },
              {
                title: 'Cookie di marketing',
                description: 'Se attivi questa categoria useremo il <strong>Meta Pixel</strong> per misurare le nostre campagne su Facebook e Instagram e mostrarti contenuti più pertinenti. Il servizio è fornito da <strong>Meta Platforms Ireland Ltd</strong>, con trasferimenti a <strong>Meta Platforms, Inc.</strong> (USA); imposta cookie propri (es. <code>_fbp</code>, <code>_fbc</code>, <code>fr</code>). Il trasferimento negli Stati Uniti si fonda sulla decisione di adeguatezza UE-USA (<em>EU-U.S. Data Privacy Framework</em>, 10 luglio 2023). Senza il tuo consenso il Pixel non viene caricato. Dettaglio dei cookie nella <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy §5</a>.',
                linkedCategory: 'advertising'
              },
              {
                title: 'Contenuti incorporati',
                description: 'Se attivi questa categoria potremo caricare la mappa interattiva di <strong>Google Maps</strong> nella pagina «Dove siamo». Il servizio è fornito da <strong>Google LLC</strong> (1600 Amphitheatre Parkway, Mountain View, California, USA), che imposta cookie propri (es. <code>NID</code>, <code>SOCS</code>, <code>OGPC</code>, <code>CONSENT</code>) al momento del caricamento dell\'iframe. Il trasferimento dei dati negli Stati Uniti avviene sulla base della decisione di adeguatezza UE-USA (<em>EU-U.S. Data Privacy Framework</em>, decisione della Commissione europea del 10 luglio 2023). Senza il tuo consenso, viene mostrato un segnaposto e nessun dato è inviato a Google. Dettaglio dei cookie e della loro durata nella <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy §4</a>.',
                linkedCategory: 'embeds'
              },
              {
                title: 'Maggiori informazioni',
                description: 'Per qualsiasi domanda sull\'uso dei cookie e sui tuoi diritti scrivi a <a href="mailto:privacy@santamonicagenova.it">privacy@santamonicagenova.it</a>.'
              }
            ]
          }
        },

        /* ═══════════════════════════ ENGLISH ═══════════════════════════ */
        en: {
          consentModal: {
            title: 'Cookies & privacy',
            description: 'This website uses technical cookies required for basic operation. Only with your consent we may also use statistics cookies (Google Analytics), marketing cookies (Meta Pixel) and load third-party embedded content (e.g. interactive maps). You can accept, reject or choose by category. Read more in our <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a> and <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            showPreferencesBtn: 'Customise',
            footer: '<a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>\n<a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a>'
          },
          preferencesModal: {
            title: 'Cookie preferences',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            savePreferencesBtn: 'Save preferences',
            closeIconLabel: 'Close',
            serviceCounterLabel: 'Services',
            sections: [
              {
                title: 'Cookie usage',
                description: 'This site uses technical cookies required to function and, only with your consent, statistics and marketing cookies and third-party embedded content. You can enable or disable them by category below. Full details in our <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a>.'
              },
              {
                title: 'Strictly necessary cookies',
                description: 'Essential for the website to function. They cannot be disabled and do not require consent.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Statistics cookies',
                description: 'If you enable this category we will use <strong>Google Analytics 4</strong> to understand, in aggregate form, how the site is used (page views, traffic sources). The service is provided by <strong>Google LLC</strong> (Mountain View, California, USA), which sets its own cookies (e.g. <code>_ga</code>, <code>_ga_*</code>, <code>_gid</code>). The IP address is processed in anonymised form. The transfer of data to the United States relies on the EU-U.S. adequacy decision (<em>EU-U.S. Data Privacy Framework</em>, 10 July 2023). Cookie details in our <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy §5</a>.',
                linkedCategory: 'analytics'
              },
              {
                title: 'Marketing cookies',
                description: 'If you enable this category we will use the <strong>Meta Pixel</strong> to measure our Facebook and Instagram campaigns and show you more relevant content. The service is provided by <strong>Meta Platforms Ireland Ltd</strong>, with transfers to <strong>Meta Platforms, Inc.</strong> (USA); it sets its own cookies (e.g. <code>_fbp</code>, <code>_fbc</code>, <code>fr</code>). The transfer to the United States relies on the EU-U.S. adequacy decision (<em>EU-U.S. Data Privacy Framework</em>, 10 July 2023). Without your consent the Pixel is not loaded. Cookie details in our <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy §5</a>.',
                linkedCategory: 'advertising'
              },
              {
                title: 'Embedded content',
                description: 'If you enable this category we can load the interactive <strong>Google Maps</strong> on the "Where we are" page. The service is provided by <strong>Google LLC</strong> (1600 Amphitheatre Parkway, Mountain View, California, USA), which sets its own cookies (e.g. <code>NID</code>, <code>SOCS</code>, <code>OGPC</code>, <code>CONSENT</code>) when the iframe loads. The transfer of data to the United States relies on the EU-U.S. adequacy decision (<em>EU-U.S. Data Privacy Framework</em>, European Commission decision of 10 July 2023). Without your consent, a placeholder is shown and no data is sent to Google. Cookie details and durations in our <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy §4</a>.',
                linkedCategory: 'embeds'
              },
              {
                title: 'More information',
                description: 'For any question about cookie usage and your rights, write to <a href="mailto:privacy@santamonicagenova.it">privacy@santamonicagenova.it</a>.'
              }
            ]
          }
        },

        /* ═══════════════════════════ FRANÇAIS ═══════════════════════════ */
        fr: {
          consentModal: {
            title: 'Cookies et confidentialité',
            description: 'Ce site utilise des cookies techniques nécessaires au fonctionnement. Uniquement avec votre consentement, nous pouvons aussi utiliser des cookies de statistique (Google Analytics), des cookies de marketing (Meta Pixel) et charger des contenus intégrés de tiers (par ex. cartes interactives). Vous pouvez accepter, refuser ou choisir par catégorie. Plus de détails dans notre <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Politique des cookies</a> et notre <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a>.',
            acceptAllBtn: 'Tout accepter',
            acceptNecessaryBtn: 'Tout refuser',
            showPreferencesBtn: 'Personnaliser',
            footer: '<a href="/privacy.html" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a>\n<a href="/cookies.html" target="_blank" rel="noopener noreferrer">Politique des cookies</a>'
          },
          preferencesModal: {
            title: 'Préférences des cookies',
            acceptAllBtn: 'Tout accepter',
            acceptNecessaryBtn: 'Tout refuser',
            savePreferencesBtn: 'Enregistrer',
            closeIconLabel: 'Fermer',
            serviceCounterLabel: 'Services',
            sections: [
              {
                title: 'Utilisation des cookies',
                description: 'Ce site utilise des cookies techniques nécessaires au fonctionnement et, uniquement avec votre consentement, des cookies de statistique et de marketing ainsi que des contenus intégrés de tiers. Vous pouvez les activer ou les désactiver par catégorie ci-dessous. Détails complets dans notre <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Politique des cookies</a>.'
              },
              {
                title: 'Cookies strictement nécessaires',
                description: 'Indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés et ne nécessitent pas de consentement.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Cookies de statistique',
                description: 'Si vous activez cette catégorie, nous utiliserons <strong>Google Analytics 4</strong> pour comprendre, de façon agrégée, comment le site est utilisé (pages vues, origine du trafic). Le service est fourni par <strong>Google LLC</strong> (Mountain View, Californie, USA), qui dépose ses propres cookies (par ex. <code>_ga</code>, <code>_ga_*</code>, <code>_gid</code>). L\'adresse IP est traitée sous forme anonymisée. Le transfert des données aux États-Unis se fonde sur la décision d\'adéquation UE-USA (<em>EU-U.S. Data Privacy Framework</em>, 10 juillet 2023). Détail des cookies dans notre <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Politique des cookies §5</a>.',
                linkedCategory: 'analytics'
              },
              {
                title: 'Cookies de marketing',
                description: 'Si vous activez cette catégorie, nous utiliserons le <strong>Meta Pixel</strong> pour mesurer nos campagnes sur Facebook et Instagram et vous proposer des contenus plus pertinents. Le service est fourni par <strong>Meta Platforms Ireland Ltd</strong>, avec des transferts vers <strong>Meta Platforms, Inc.</strong> (USA) ; il dépose ses propres cookies (par ex. <code>_fbp</code>, <code>_fbc</code>, <code>fr</code>). Le transfert aux États-Unis se fonde sur la décision d\'adéquation UE-USA (<em>EU-U.S. Data Privacy Framework</em>, 10 juillet 2023). Sans votre consentement, le Pixel n\'est pas chargé. Détail des cookies dans notre <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Politique des cookies §5</a>.',
                linkedCategory: 'advertising'
              },
              {
                title: 'Contenus intégrés',
                description: 'Si vous activez cette catégorie, nous pourrons charger la carte interactive <strong>Google Maps</strong> sur la page « Où nous sommes ». Le service est fourni par <strong>Google LLC</strong> (1600 Amphitheatre Parkway, Mountain View, Californie, USA), qui dépose ses propres cookies (par ex. <code>NID</code>, <code>SOCS</code>, <code>OGPC</code>, <code>CONSENT</code>) au moment du chargement de l\'iframe. Le transfert des données aux États-Unis se fonde sur la décision d\'adéquation UE-USA (<em>EU-U.S. Data Privacy Framework</em>, décision de la Commission européenne du 10 juillet 2023). Sans votre consentement, un substitut s\'affiche et aucune donnée n\'est envoyée à Google. Détail des cookies et leur durée dans notre <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Politique des cookies §4</a>.',
                linkedCategory: 'embeds'
              },
              {
                title: 'Plus d\'informations',
                description: 'Pour toute question sur l\'utilisation des cookies et vos droits, écrivez à <a href="mailto:privacy@santamonicagenova.it">privacy@santamonicagenova.it</a>.'
              }
            ]
          }
        }

      }
    }

  });

})();

/* v 2026.05.23.01 */
