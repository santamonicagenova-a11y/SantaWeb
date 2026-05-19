/* ═══════════════════════════════════════════════════════════════════════
   cookieconsent-config.js
   Santamonica · Il Giuliano di Andrea Giachino e C. S.a.s.
   v 2026.05.19.05
   F0.12 — Integrazione Google Maps via iframemanager + revision: 2
   ───────────────────────────────────────────────────────────────────────
   Dipendenze:  /lib/cookieconsent/cookieconsent.umd.js (caricato prima)
                /lib/iframemanager/iframemanager.umd.js (caricato prima · F0.12)
   Espone:      window.CookieConsent (globale, già attivo dopo run)
                window.iframemanager (globale dell'istanza, dopo init)
   Lingue:      IT (default) · EN · FR  — auto-detect via navigator.language
   Categorie:   necessary (always on) · embeds (opt-in, default off)
   Servizi:     embeds → googleMaps (Google Maps Embed, gestito da iframemanager)
   Conformità:  GDPR Reg. UE 2016/679 · D.Lgs. 196/2003 art. 122
                Linee guida Garante 10-06-2021 (no cookie wall · parità accept/reject)
                Art. 13 GDPR (informativa specifica per servizio) · P3.10 backlog F0.9
                Art. 44+ GDPR (trasferimento extra-UE) → Google LLC USA
                EU-U.S. Data Privacy Framework (decisione adeguatezza 10-07-2023)
   ───────────────────────────────────────────────────────────────────────
   STORICO MODIFICHE
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
     CONFIGURAZIONE COOKIECONSENT (con callback onConsent/onChange F0.12)
     ═══════════════════════════════════════════════════════════════════════ */

  CookieConsent.run({

    /* ─── Modalità consenso esplicita (default lib v3 ma dichiarato per chiarezza) ─── */
    mode: 'opt-in',

    /* ─── Revisione: incrementata in F0.12 (dec. #20 propagation):
           nuovo trattamento Google Maps effettivamente attivo,
           nuovo trasferimento extra-UE Google LLC USA,
           nuovi cookie effettivamente posati su consenso.
           Bump 1 → 2 forza richiesta nuovo consenso a tutti. ─── */
    revision: 2,

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
       CALLBACK F0.12 — Ponte tra CookieConsent ed iframemanager
       ═══════════════════════════════════════════════════════════════════
       Strategia (decisione finale dopo loop 3 passate F0.12):
       - onFirstConsent: prima volta che l'utente esprime una scelta.
                         Se accetta 'embeds' → attiva google-maps.
       - onConsent:      eseguito a ogni page-load se l'utente ha già un consenso
                         valido. Se ha 'embeds' → attiva google-maps su questa pagina.
       - onChange:       eseguito quando l'utente modifica la scelta (dal modale
                         preferenze). Sincronizza iframemanager con lo stato corrente.

       Edge case (P3 adversarial loop F0.12):
       - Consenso revocato in altra tab: il prossimo onConsent in questa tab
         vedrà cookie aggiornato (sameSite=Lax) e disattiverà il servizio.
       - Consenso scaduto (>182gg): revision check costringe nuovo consenso.
       ─────────────────────────────────────────────────────────────────── */

    onFirstConsent: function ({ cookie }) {
      // cookie.categories è array es. ['necessary', 'embeds']
      if (cookie.categories.indexOf('embeds') !== -1) {
        if (window.im && typeof window.im.acceptService === 'function') {
          window.im.acceptService('google-maps');
        }
      }
    },

    onConsent: function ({ cookie }) {
      if (cookie.categories.indexOf('embeds') !== -1) {
        if (window.im && typeof window.im.acceptService === 'function') {
          window.im.acceptService('google-maps');
        }
      } else {
        // L'utente aveva consenso ma ora 'embeds' non c'è più → sicurezza
        if (window.im && typeof window.im.rejectService === 'function') {
          window.im.rejectService('google-maps');
        }
      }
    },

    onChange: function ({ cookie /*, changedCategories, changedServices */ }) {
      if (cookie.categories.indexOf('embeds') !== -1) {
        if (window.im && typeof window.im.acceptService === 'function') {
          window.im.acceptService('google-maps');
        }
      } else {
        if (window.im && typeof window.im.rejectService === 'function') {
          window.im.rejectService('google-maps');
        }
      }
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
      }
    },

    /* ─── Lingue e traduzioni ─── */
    language: {
      default: 'it',
      autoDetect: 'browser',

      translations: {

        /* ═══════════════════════════ ITALIANO ═══════════════════════════ */
        it: {
          consentModal: {
            title: 'Cookie e privacy',
            description: 'Questo sito utilizza solo cookie tecnici necessari al funzionamento. Con il tuo consenso possiamo caricare contenuti incorporati di terze parti (ad es. mappe interattive) per arricchire l\'esperienza. Maggiori dettagli nella nostra <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a> e nell\'<a href="/privacy.html" target="_blank" rel="noopener noreferrer">Informativa sulla Privacy</a>.',
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
                description: 'Questo sito utilizza solo i cookie strettamente necessari al funzionamento. Eventuali altri cookie sono opzionali e si attivano soltanto con il tuo consenso. Trovi il dettaglio completo nella <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a>.'
              },
              {
                title: 'Cookie strettamente necessari',
                description: 'Indispensabili per il funzionamento del sito. Non possono essere disattivati e non richiedono consenso.',
                linkedCategory: 'necessary'
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
            description: 'This website uses only technical cookies required for basic operation. With your consent we can also load third-party embedded content (e.g. interactive maps) to enhance your experience. Read more in our <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a> and <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.',
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
                description: 'This site uses only strictly necessary cookies. Any other cookies are optional and activated only with your consent. Full details in our <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Cookie Policy</a>.'
              },
              {
                title: 'Strictly necessary cookies',
                description: 'Essential for the website to function. They cannot be disabled and do not require consent.',
                linkedCategory: 'necessary'
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
            description: 'Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement. Avec votre consentement, nous pouvons également charger des contenus intégrés de tiers (par ex. cartes interactives) pour enrichir votre expérience. Plus de détails dans notre <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Politique des cookies</a> et notre <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a>.',
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
                description: 'Ce site utilise uniquement des cookies strictement nécessaires au fonctionnement. Les autres cookies sont optionnels et activés uniquement avec votre consentement. Détails complets dans notre <a href="/cookies.html" target="_blank" rel="noopener noreferrer">Politique des cookies</a>.'
              },
              {
                title: 'Cookies strictement nécessaires',
                description: 'Indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés et ne nécessitent pas de consentement.',
                linkedCategory: 'necessary'
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

/* v 2026.05.19.05 */
