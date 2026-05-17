/* ============================================================
 * cookieconsent-config.js
 * Versione: v 2026.05.17.01
 * Progetto: Santamonica Web
 * Libreria: vanilla-cookieconsent v3.1.0 (orestbida, MIT, bundle locale)
 * Task ROADMAP: F0.9 — banner DIY (senza F0.8 revisione legale)
 * Conformità: Linee guida Garante 10 giugno 2021, GDPR Art. 4(11)/7,
 *             art. 122 c.1 D.Lgs. 196/2003
 * Allineato a: cookies.html v 2026.05.16.02, privacy.html v 2026.05.16.02
 * ============================================================ */

CookieConsent.run({

  /* ---------- Comportamento ---------- */
  mode: 'opt-in',              // consenso esplicito (GDPR-conforme)
  autoClearCookies: true,      // pulizia cookie su revoca
  hideFromBots: true,          // no banner per crawler SEO
  manageScriptTags: true,      // gestisce <script data-category="...">
  disablePageInteraction: false, // NO cookie wall (Garante)

  /* ---------- Storage consenso ---------- */
  cookie: {
    name: 'cc_cookie',
    expiresAfterDays: 182,     // 6 mesi (dichiarato in cookies.html §5)
    sameSite: 'Lax',
    path: '/'
    // domain: default current hostname
  },

  /* ---------- Categorie ---------- */
  categories: {
    necessary: {
      enabled: true,
      readOnly: true
    },
    maps: {                    // Google Maps embed — attivato in F0.12
      enabled: false,
      readOnly: false,
      services: {
        googleMaps: {
          label: 'Google Maps'
          // onAccept/onReject gestiti da F0.12 via data-category="maps"
        }
      }
    }
  },

  /* ---------- GUI ---------- */
  guiOptions: {
    consentModal: {
      layout: 'box inline',
      position: 'bottom left',
      equalWeightButtons: true,  // pari peso visivo Accetta/Rifiuta (Garante)
      flipButtons: false
    },
    preferencesModal: {
      layout: 'box',
      position: 'right',
      equalWeightButtons: true,
      flipButtons: false
    }
  },

  /* ---------- Lingue ---------- */
  language: {
    default: 'it',
    autoDetect: 'document',    // legge <html lang="..."> (oggi sempre 'it')
    translations: {
      it: {
        consentModal: {
          title: 'Questo sito utilizza i cookie',
          description: 'Utilizziamo esclusivamente cookie tecnici necessari al funzionamento del sito e alla sicurezza della rete. Solo previo tuo consenso possiamo caricare contenuti incorporati di terze parti, come la mappa di Google Maps. Puoi accettare, rifiutare o personalizzare le tue scelte; potrai modificarle in qualunque momento dal link «Gestisci preferenze cookie» nel footer di ogni pagina. Per il dettaglio consulta la <a href="/cookies.html">Cookie Policy</a> e l\'<a href="/privacy.html">Informativa sulla Privacy</a>.',
          acceptAllBtn: 'Accetta',
          acceptNecessaryBtn: 'Rifiuta',
          showPreferencesBtn: 'Personalizza',
          footer: '<a href="/privacy.html">Privacy</a> · <a href="/cookies.html">Cookie Policy</a>'
        },
        preferencesModal: {
          title: 'Gestisci preferenze cookie',
          acceptAllBtn: 'Accetta tutto',
          acceptNecessaryBtn: 'Rifiuta tutto',
          savePreferencesBtn: 'Salva le mie preferenze',
          closeIconLabel: 'Chiudi',
          serviceCounterLabel: 'Servizio|Servizi',
          sections: [
            {
              title: 'Le tue preferenze sui cookie',
              description: 'In questo pannello puoi esprimere o revocare le preferenze per ciascuna categoria. I cookie strettamente necessari sono sempre attivi perché indispensabili al funzionamento del sito (art.&nbsp;122, c.&nbsp;1, D.Lgs.&nbsp;196/2003). Per tutte le altre categorie il consenso è facoltativo e revocabile in qualunque momento, con la stessa facilità con cui è stato prestato (GDPR art.&nbsp;7&nbsp;§&nbsp;3). Per il dettaglio dei singoli cookie consulta la <a href="/cookies.html">Cookie Policy</a>.'
            },
            {
              title: 'Cookie strettamente necessari <span class="pm__badge">Sempre attivi</span>',
              description: 'Cookie indispensabili al funzionamento del sito e alla sicurezza della rete. Non richiedono consenso ai sensi dell\'art.&nbsp;122, c.&nbsp;1, del Codice Privacy. Includono il cookie che memorizza le tue scelte sul banner (<code>cc_cookie</code>) e i cookie tecnici di prima parte impostati dalla rete Cloudflare per il bot management (<code>__cf_bm</code>).',
              linkedCategory: 'necessary'
            },
            {
              title: 'Mappa Google Maps',
              description: 'Se accetti questa categoria, nella sezione «Dove siamo» verrà caricata la mappa interattiva di Google Maps. Google imposterà propri cookie sul proprio dominio. Finché non esprimi il consenso, al posto della mappa viene mostrato un segnaposto con l\'indirizzo testuale del ristorante. Per il dettaglio consulta la <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener">policy cookie di Google</a>.',
              linkedCategory: 'maps'
            },
            {
              title: 'Maggiori informazioni',
              description: 'Per esercitare i tuoi diritti o per qualsiasi richiesta sul trattamento dei dati scrivi a <a href="mailto:privacy@santamonicagenova.it">privacy@santamonicagenova.it</a>. Consulta l\'<a href="/privacy.html">Informativa sulla Privacy</a> per il dettaglio completo dei trattamenti.'
            }
          ]
        }
      }
    }
  }
});

/* Fine cookieconsent-config.js · v 2026.05.17.01 */
