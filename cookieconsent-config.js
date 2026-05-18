/* ═══════════════════════════════════════════════════════════════════════
   cookieconsent-config.js
   Santamonica · Il Giuliano di Andrea Giachino e C. S.a.s.
   v 2026.05.17.01
   F0.9 — Configurazione vanilla-cookieconsent v3.1.0 (bundle locale)
   ───────────────────────────────────────────────────────────────────────
   Dipendenze:  /lib/cookieconsent/cookieconsent.umd.js (caricato prima)
   Espone:      window.CookieConsent (globale, già attivo dopo run)
   Lingue:      IT (default) · EN · FR  — auto-detect via navigator.language
   Categorie:   necessary (always on) · embeds (opt-in, default off)
   Conformità:  GDPR Reg. UE 2016/679 + D.Lgs. 196/2003 art. 122
                Linee guida Garante 10-06-2021 (no cookie wall · parità accept/reject)
   ─────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  if (typeof window.CookieConsent === 'undefined') {
    console.error('[cookieconsent-config] CookieConsent UMD non caricato. Verifica /lib/cookieconsent/cookieconsent.umd.js');
    return;
  }

  CookieConsent.run({

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
              { name: /^(NID|SOCS|__Secure-)/ }
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
            description: 'Questo sito utilizza solo cookie tecnici necessari al funzionamento. Con il tuo consenso possiamo caricare contenuti di terze parti integrati (es. mappe Google) per arricchire l\'esperienza. Maggiori dettagli nella nostra <a href="/cookies.html">Cookie Policy</a> e nell\'<a href="/privacy.html">Informativa sulla Privacy</a>.',
            acceptAllBtn: 'Accetta tutti',
            acceptNecessaryBtn: 'Rifiuta tutti',
            showPreferencesBtn: 'Personalizza',
            footer: '<a href="/privacy.html">Privacy Policy</a>\n<a href="/cookies.html">Cookie Policy</a>'
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
                description: 'Questo sito utilizza solo i cookie strettamente necessari al funzionamento. Eventuali altri cookie sono opzionali e si attivano soltanto con il tuo consenso. Trovi il dettaglio completo nella <a href="/cookies.html">Cookie Policy</a>.'
              },
              {
                title: 'Cookie strettamente necessari',
                description: 'Indispensabili per il funzionamento del sito. Non possono essere disattivati e non richiedono consenso.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Contenuti incorporati',
                description: 'Se attivi questa categoria potremo caricare contenuti di terze parti, come le mappe di Google. Questi servizi possono impostare cookie propri al momento del caricamento. Senza il tuo consenso, i contenuti incorporati restano disabilitati.',
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
            description: 'This website uses only technical cookies required for basic operation. With your consent we can also load third-party embedded content (e.g. Google Maps) to enhance your experience. Read more in our <a href="/cookies.html">Cookie Policy</a> and <a href="/privacy.html">Privacy Policy</a>.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject all',
            showPreferencesBtn: 'Customise',
            footer: '<a href="/privacy.html">Privacy Policy</a>\n<a href="/cookies.html">Cookie Policy</a>'
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
                description: 'This site uses only strictly necessary cookies. Any other cookies are optional and activated only with your consent. Full details in our <a href="/cookies.html">Cookie Policy</a>.'
              },
              {
                title: 'Strictly necessary cookies',
                description: 'Essential for the website to function. They cannot be disabled and do not require consent.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Embedded content',
                description: 'If you enable this category we can load third-party content such as Google Maps. These services may set their own cookies when loaded. Without your consent, embedded content remains disabled.',
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
            description: 'Ce site utilise uniquement des cookies techniques nécessaires au fonctionnement. Avec votre consentement, nous pouvons également charger des contenus tiers intégrés (par ex. cartes Google) pour enrichir votre expérience. Plus de détails dans notre <a href="/cookies.html">Politique des cookies</a> et notre <a href="/privacy.html">Politique de confidentialité</a>.',
            acceptAllBtn: 'Tout accepter',
            acceptNecessaryBtn: 'Tout refuser',
            showPreferencesBtn: 'Personnaliser',
            footer: '<a href="/privacy.html">Politique de confidentialité</a>\n<a href="/cookies.html">Politique des cookies</a>'
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
                description: 'Ce site utilise uniquement des cookies strictement nécessaires au fonctionnement. Les autres cookies sont optionnels et activés uniquement avec votre consentement. Détails complets dans notre <a href="/cookies.html">Politique des cookies</a>.'
              },
              {
                title: 'Cookies strictement nécessaires',
                description: 'Indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés et ne nécessitent pas de consentement.',
                linkedCategory: 'necessary'
              },
              {
                title: 'Contenus intégrés',
                description: 'Si vous activez cette catégorie, nous pourrons charger des contenus tiers comme Google Maps. Ces services peuvent déposer leurs propres cookies au moment du chargement. Sans votre consentement, les contenus intégrés restent désactivés.',
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

/* v 2026.05.17.01 */
