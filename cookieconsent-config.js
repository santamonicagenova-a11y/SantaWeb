/* ═══════════════════════════════════════════════════════════════════════
   cookieconsent-config.js
   Santamonica · Il Giuliano di Andrea Giachino e C. S.a.s.
   v 2026.05.19.02
   F0.9 chiusura + F0.9-post tweak (P3.5 + P3.8) + bug fix UX link banner
   ───────────────────────────────────────────────────────────────────────
   Dipendenze:  /lib/cookieconsent/cookieconsent.umd.js (caricato prima)
   Espone:      window.CookieConsent (globale, già attivo dopo run)
   Lingue:      IT (default) · EN · FR  — auto-detect via navigator.language
   Categorie:   necessary (always on) · embeds (opt-in, default off)
   Conformità:  GDPR Reg. UE 2016/679 + D.Lgs. 196/2003 art. 122
                Linee guida Garante 10-06-2021 (no cookie wall · parità accept/reject)
   ───────────────────────────────────────────────────────────────────────
   STORICO MODIFICHE
   - v 2026.05.19.02 (chiusura F0.9 post-verifica funzionale — 3 modifiche):
       · [BUG FIX UX] aggiunto target="_blank" rel="noopener noreferrer"
                 a tutti i 15 link policy (/privacy.html, /cookies.html) nelle
                 3 traduzioni IT/EN/FR · consentModal.description (2 link/lingua)
                 + consentModal.footer (2 link/lingua) + preferencesModal
                 sections[0].description (1 link/lingua) = 5 × 3 = 15 link.
                 Scoperto in verifica funzionale post-deploy F0.9 (incoerenza UX
                 con footer pagina che già usa target=_blank).
                 I link mailto: NON modificati (non beneficiano di target=_blank).
       · [P3.5 F0.9-post] aggiunto hideFromBots: true (default v3 ma esplicitato)
                 → bot crawler/lighthouse non vedono banner · evita falsi positivi
                 in audit SEO/accessibilità Lighthouse e indicizzazione contenuto.
       · [P3.8 F0.9-post opzione b] autoShow disabilitato condizionalmente su
                 pagine policy (privacy.html, cookies.html) · banner appare
                 ovunque tranne quando l'utente sta leggendo la policy stessa
                 (anti-paradosso "leggi la policy per acconsentire al banner che
                 ti chiede di acconsentire alla policy") · check via regex su
                 window.location.pathname prima del run · bottone "Gestisci
                 preferenze cookie" del footer pagina rimane operativo
                 (CookieConsent.showPreferences() invocato manualmente via
                 data-cc="show-preferencesModal").
   - v 2026.05.19.01 (Passata 2 sostanziale F0.9 — 3 correzioni):
       · [#8 P2] aggiunto mode: 'opt-in' esplicito (era default implicito v3)
                 → robustezza vs eventuali breaking changes futuri lib
       · [#4 P2] regex autoClear googleMaps corretta a /^(NID|SOCS|OGPC)$/
                 rimosso __Secure-* che matchava cookie Google account
                 (3PSID, 1PAPISID, …) → falsi positivi su utenti loggati Google
                 + integrità sessione utente violata
       · [#1 P2] rewording IT/EN/FR consentModal.description + sezione embeds
                 preferencesModal: rimossa menzione esplicita "Google Maps /
                 mappe Google / cartes Google" (prematura prima di F0.12)
                 → testo generico "contenuti incorporati / mappe interattive"
       · F0.12 TODO: aggiungere callback onConsent + onChange per gestire
                 iframe Maps dinamico (caricamento condizionato al consenso)
   - v 2026.05.17.01: prima emissione · IT/EN/FR simmetriche · 2 categorie
                      (necessary + embeds predisposta per F0.12) · revision 1
                      cookie 6 mesi · equalWeightButtons true entrambi modali
   ─────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  if (typeof window.CookieConsent === 'undefined') {
    console.error('[cookieconsent-config] CookieConsent UMD non caricato. Verifica /lib/cookieconsent/cookieconsent.umd.js');
    return;
  }

  /* ─── [P3.8 opzione b · v 2026.05.19.02] autoShow condizionale ───
     Banner NON appare automaticamente quando l'utente sta leggendo
     privacy.html o cookies.html. Su queste pagine rimane disponibile
     solo il bottone "Gestisci preferenze cookie" del footer (data-cc).
     Anti-paradosso UX + non blocca lettura policy.                    */
  const isPolicyPage = /\/(privacy|cookies)\.html$/i.test(window.location.pathname);

  CookieConsent.run({

    /* ─── Modalità consenso esplicita (default lib v3 ma dichiarato per chiarezza) ─── */
    mode: 'opt-in',

    /* ─── [P3.8 v 2026.05.19.02] autoShow condizionale su pagine policy ─── */
    autoShow: !isPolicyPage,

    /* ─── [P3.5 v 2026.05.19.02] Banner nascosto a bot/crawler (default v3, esplicito) ─── */
    hideFromBots: true,

    /* ─── Revisione: incrementare se le categorie cambiano (forza nuovo consenso) ─── */
    revision: 1,

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
          /* Predisposto per F0.12 (embed Google Maps).
             Oggi nessun servizio attivo: OpenStreetMap iframe non setta cookie tracker. */
          googleMaps: {
            label: 'Google Maps',
            cookies: [
              /* [v 2026.05.19.01 #4 P2] regex stretta: solo cookie effettivamente
                 posati da Maps Embed API. NID (principale), SOCS e OGPC (occasionali).
                 Rimosso __Secure-* perché matchava cookie Google account
                 (3PSID, 1PAPISID, …) → falsi positivi su utenti loggati Google. */
              { name: /^(NID|SOCS|OGPC)$/ }
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
                description: 'Se attivi questa categoria potremo caricare contenuti incorporati di terze parti (ad es. mappe interattive). Questi servizi possono impostare cookie propri al momento del caricamento. Senza il tuo consenso, i contenuti incorporati restano disabilitati.',
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
                description: 'If you enable this category we can load third-party embedded content (e.g. interactive maps). These services may set their own cookies when loaded. Without your consent, embedded content remains disabled.',
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
                description: 'Si vous activez cette catégorie, nous pourrons charger des contenus intégrés de tiers (par ex. cartes interactives). Ces services peuvent déposer leurs propres cookies au moment du chargement. Sans votre consentement, les contenus intégrés restent désactivés.',
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

/* v 2026.05.19.02 */
