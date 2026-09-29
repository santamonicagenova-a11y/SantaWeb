/* jarvis-data.js · GENERATO da Jarvis (node Jarvis/_tools/jarvis.mjs build-pannello) — non modificare a mano. Renderer: jarvis.html */
window.JARVIS_DATA = {
 "generato": "2026-09-29",
 "versione": "2026.09.29.05",
 "briefing": "**Briefing 29/9/2026** — **Sito** (live, menu-admin v 2026.09.29.09 + Food Cost server v17): audit completo dei flussi di menu-admin, 12 incongruenze trovate e sistemate le principali — ricarica dopo Pubblica che non cancella più la vista aperta, guida \"Procedure\" riallineata, FC % e Menu Engineering su prezzo senza IVA, avviso vendite mancanti; poi, su tua approvazione, **Menù Degustazione nel Food Cost** (costo = somma piatti × % porzione), **Andamento sui periodi di inventario chiusi**, **piatti tolti dalla carta conservati come storico**. **Aspetta te**: in Costo piatti impostare la % porzione dei percorsi degustazione; ricompilare e pubblicare Allergeni carta; post orari dal 1/10. **Prossimo**: primo uso reale di Costo piatti/Vendite/Dashboard come verifica; restano da valutare rinomina sezioni (duplicati in Dettagli piatti) e costi storicizzati.",
 "kpi": {
  "aperte": 52,
  "scadute": 3,
  "bloccate": 1,
  "andrea": 14,
  "debiti": 10,
  "chiuse30": 41
 },
 "subs": {
  "SEO": {
   "tot": 42,
   "done": 31,
   "prog": 1,
   "up": 7,
   "future": 3,
   "bloccato": 0,
   "scadute": 0,
   "andrea": 3,
   "debiti": 0
  },
  "Decennale": {
   "tot": 11,
   "done": 11,
   "prog": 0,
   "up": 0,
   "future": 0,
   "bloccato": 0,
   "scadute": 0,
   "andrea": 0,
   "debiti": 0
  },
  "Sito": {
   "tot": 99,
   "done": 85,
   "prog": 2,
   "up": 3,
   "future": 9,
   "bloccato": 0,
   "scadute": 0,
   "andrea": 4,
   "debiti": 8
  },
  "Marketing": {
   "tot": 36,
   "done": 17,
   "prog": 3,
   "up": 2,
   "future": 13,
   "bloccato": 1,
   "scadute": 3,
   "andrea": 5,
   "debiti": 2
  },
  "Trasversale": {
   "tot": 7,
   "done": 7,
   "prog": 0,
   "up": 0,
   "future": 0,
   "bloccato": 0,
   "scadute": 0,
   "andrea": 0,
   "debiti": 0
  },
  "NoShowApp": {
   "tot": 9,
   "done": 1,
   "prog": 0,
   "up": 2,
   "future": 6,
   "bloccato": 0,
   "scadute": 0,
   "andrea": 2,
   "debiti": 0
  }
 },
 "andrea": [
  {
   "t": "Baseline misurazione geografica IG (4 sett, post 2/7)",
   "sub": "Marketing",
   "st": "future",
   "s": "2026-07-03",
   "e": "2026-07-31",
   "own": "Andrea",
   "az": "Confermare lo stato: nessuna traccia nei documenti dopo luglio (fatto, in corso o da ripianificare?)",
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "Calendario cene a tema (entro ago)",
   "sub": "Marketing",
   "st": "prog",
   "s": "2026-07-01",
   "e": "2026-08-31",
   "own": "Andrea",
   "az": "Mandare a Claude il calendario Mare d'Inverno appena pronto",
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "Meta budget teaser (set, 300€)",
   "sub": "Marketing",
   "st": "future",
   "s": "2026-09-01",
   "e": "2026-09-30",
   "own": "Andrea",
   "az": "Confermare lo stato: nessuna traccia nei documenti dopo luglio (fatto, in corso o da ripianificare?)",
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "Sponsorizzata Salone Nautico",
   "sub": "Marketing",
   "st": "prog",
   "s": "2026-09-25",
   "e": "2026-10-04",
   "own": "Andrea",
   "az": null,
   "bl": null,
   "deb": false,
   "agg": "2026-09-29"
  },
  {
   "t": "Pillar pesce §7 — 2-3 abbinamenti vino con pesce/crudo raccontati da Monica",
   "sub": "SEO",
   "st": "up",
   "s": "2026-09-28",
   "e": "2026-10-05",
   "own": "Andrea",
   "az": "Chiedere a Monica 2-3 esempi (con le ostriche X perché Y) e passarli a Claude",
   "bl": null,
   "deb": false,
   "agg": "2026-09-27"
  },
  {
   "t": "Pillar pesce §10 — foto recenti del crudo/sashimi (anche da telefono) + scelta delle migliori esistenti",
   "sub": "SEO",
   "st": "up",
   "s": "2026-09-28",
   "e": "2026-10-05",
   "own": "Andrea",
   "az": "Indicare a Claude dove sono le foto del crudo/sashimi (cartella PC o IG)",
   "bl": null,
   "deb": false,
   "agg": "2026-09-27"
  },
  {
   "t": "Intervista pillar /cucina-di-pesce ad Andrea e Monica (materia prima, pescatori, crudo, sala e cantina)",
   "sub": "SEO",
   "st": "prog",
   "s": "2026-10-01",
   "e": "2026-10-05",
   "own": "Andrea",
   "az": "Dedicare ~1 ora all'intervista (anche in 2 volte), con Monica per la parte vini/sala",
   "bl": null,
   "deb": false,
   "agg": "2026-09-27"
  },
  {
   "t": "Allergeni carta: il form parte sempre da carta + dolci pubblicati (bug perdita allergeni), la pubblicazione aggiorna Dettagli piatti, niente doppia sezione dolci in EN/FR",
   "sub": "Sito",
   "st": "prog",
   "s": "2026-09-29",
   "e": null,
   "own": "Andrea",
   "az": "Allergeni carta → ricompilare gli allergeni di tutti i piatti della carta (la pagina online oggi ha solo Golosità: erano stati persi) e pubblicare; poi Traduci e Pubblica della carta per rigenerare EN/FR con gli allergeni in fondo",
   "bl": null,
   "deb": true,
   "agg": "2026-09-29"
  },
  {
   "t": "Calcolo Food Cost ricette da ingredienti: anagrafica ingredienti in Setup + tab Calcolo Food Cost che valorizza Costo Ricetta in Costo piatti",
   "sub": "Sito",
   "st": "prog",
   "s": "2026-09-26",
   "e": null,
   "own": "Andrea",
   "az": "Usare il Calcolo Food Cost su qualche piatto reale e segnalare correzioni",
   "bl": null,
   "deb": false,
   "agg": "2026-09-26"
  },
  {
   "t": "Cambio completo del menu",
   "sub": "Sito",
   "st": "future",
   "s": "2026-09-25",
   "e": null,
   "own": "Andrea",
   "az": null,
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "NoShowApp F6 — acquisire 10 beta tester (WhatsApp + demo dal vivo con carta test) e guida onboarding",
   "sub": "NoShowApp",
   "st": "up",
   "s": "2026-10-01",
   "e": null,
   "own": "Andrea",
   "az": "Contattare i colleghi ristoratori per la demo",
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "NoShowApp F6 — registrare il marchio NoShowApp (verifica tmview.org, UIBM classe 42, ~200 €)",
   "sub": "NoShowApp",
   "st": "up",
   "s": "2026-10-01",
   "e": null,
   "own": "Andrea",
   "az": "Verifica disponibilità su tmview.org e deposito UIBM",
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "Post Instagram orari di apertura — grafica Canva rifatta, calendario dal 1/10 (pronto, non pubblicato)",
   "sub": "Marketing",
   "st": "prog",
   "s": "2026-09-28",
   "e": null,
   "own": "Andrea",
   "az": "Pubblicare il post dal 1/10 (il calendario mostrato è quello dal 1/10) e scegliere i canali; opzionale: logo (nessun Brand Kit su Canva)",
   "bl": null,
   "deb": false,
   "agg": "2026-09-28"
  },
  {
   "t": "Verificare dal vivo i flussi Food Cost (Tracciabilità, import Excel, IVA)",
   "sub": "Sito",
   "st": "up",
   "s": "2026-09-21",
   "e": null,
   "own": "Andrea",
   "az": "Giro veloce su tutti i tab Food Cost (Incassi, Inventario, Dashboard, Vendite, Costo piatti) + prova delle novità del 26/9",
   "bl": null,
   "deb": false,
   "agg": "2026-09-28"
  }
 ],
 "scadute": [
  {
   "t": "Baseline misurazione geografica IG (4 sett, post 2/7)",
   "sub": "Marketing",
   "st": "future",
   "s": "2026-07-03",
   "e": "2026-07-31",
   "own": "Andrea",
   "az": "Confermare lo stato: nessuna traccia nei documenti dopo luglio (fatto, in corso o da ripianificare?)",
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "Calendario cene a tema (entro ago)",
   "sub": "Marketing",
   "st": "prog",
   "s": "2026-07-01",
   "e": "2026-08-31",
   "own": "Andrea",
   "az": "Mandare a Claude il calendario Mare d'Inverno appena pronto",
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "Mailing Brevo — lancio (entro 15 set)",
   "sub": "Marketing",
   "st": "future",
   "s": "2026-08-15",
   "e": "2026-09-15",
   "own": null,
   "az": null,
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  }
 ],
 "prossime": [
  {
   "t": "Meta budget teaser (set, 300€)",
   "sub": "Marketing",
   "st": "future",
   "s": "2026-09-01",
   "e": "2026-09-30",
   "own": "Andrea",
   "az": "Confermare lo stato: nessuna traccia nei documenti dopo luglio (fatto, in corso o da ripianificare?)",
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "Chiusura cena domenica dal 1/10, senza data di ripristino (contenuti statici — disponibilità già corretta) — task schedulato 27/9",
   "sub": "Sito",
   "st": "up",
   "s": "2026-10-01",
   "e": "2026-10-01",
   "own": "Claude",
   "az": null,
   "bl": null,
   "deb": false,
   "agg": "2026-09-26"
  },
  {
   "t": "Sponsorizzata Salone Nautico",
   "sub": "Marketing",
   "st": "prog",
   "s": "2026-09-25",
   "e": "2026-10-04",
   "own": "Andrea",
   "az": null,
   "bl": null,
   "deb": false,
   "agg": "2026-09-29"
  },
  {
   "t": "Pillar pesce §7 — 2-3 abbinamenti vino con pesce/crudo raccontati da Monica",
   "sub": "SEO",
   "st": "up",
   "s": "2026-09-28",
   "e": "2026-10-05",
   "own": "Andrea",
   "az": "Chiedere a Monica 2-3 esempi (con le ostriche X perché Y) e passarli a Claude",
   "bl": null,
   "deb": false,
   "agg": "2026-09-27"
  },
  {
   "t": "Pillar pesce §10 — foto recenti del crudo/sashimi (anche da telefono) + scelta delle migliori esistenti",
   "sub": "SEO",
   "st": "up",
   "s": "2026-09-28",
   "e": "2026-10-05",
   "own": "Andrea",
   "az": "Indicare a Claude dove sono le foto del crudo/sashimi (cartella PC o IG)",
   "bl": null,
   "deb": false,
   "agg": "2026-09-27"
  },
  {
   "t": "Intervista pillar /cucina-di-pesce ad Andrea e Monica (materia prima, pescatori, crudo, sala e cantina)",
   "sub": "SEO",
   "st": "prog",
   "s": "2026-10-01",
   "e": "2026-10-05",
   "own": "Andrea",
   "az": "Dedicare ~1 ora all'intervista (anche in 2 volte), con Monica per la parte vini/sala",
   "bl": null,
   "deb": false,
   "agg": "2026-09-27"
  },
  {
   "t": "GEO giro 5 (verifica ricrawl orari ChatGPT/Claude)",
   "sub": "SEO",
   "st": "up",
   "s": "2026-10-02",
   "e": "2026-10-10",
   "own": "Claude",
   "az": null,
   "bl": null,
   "deb": false,
   "agg": "2026-09-27"
  },
  {
   "t": "Verificare aggiornamento orari su Michelin",
   "sub": "SEO",
   "st": "up",
   "s": "2026-10-02",
   "e": "2026-10-10",
   "own": "Claude",
   "az": null,
   "bl": null,
   "deb": false,
   "agg": "2026-09-27"
  }
 ],
 "inCorso": [
  {
   "t": "Allergeni carta: il form parte sempre da carta + dolci pubblicati (bug perdita allergeni), la pubblicazione aggiorna Dettagli piatti, niente doppia sezione dolci in EN/FR",
   "sub": "Sito",
   "st": "prog",
   "s": "2026-09-29",
   "e": null,
   "own": "Andrea",
   "az": "Allergeni carta → ricompilare gli allergeni di tutti i piatti della carta (la pagina online oggi ha solo Golosità: erano stati persi) e pubblicare; poi Traduci e Pubblica della carta per rigenerare EN/FR con gli allergeni in fondo",
   "bl": null,
   "deb": true,
   "agg": "2026-09-29"
  },
  {
   "t": "Calcolo Food Cost ricette da ingredienti: anagrafica ingredienti in Setup + tab Calcolo Food Cost che valorizza Costo Ricetta in Costo piatti",
   "sub": "Sito",
   "st": "prog",
   "s": "2026-09-26",
   "e": null,
   "own": "Andrea",
   "az": "Usare il Calcolo Food Cost su qualche piatto reale e segnalare correzioni",
   "bl": null,
   "deb": false,
   "agg": "2026-09-26"
  },
  {
   "t": "Calendario cene a tema (entro ago)",
   "sub": "Marketing",
   "st": "prog",
   "s": "2026-07-01",
   "e": "2026-08-31",
   "own": "Andrea",
   "az": "Mandare a Claude il calendario Mare d'Inverno appena pronto",
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "Intervista pillar /cucina-di-pesce ad Andrea e Monica (materia prima, pescatori, crudo, sala e cantina)",
   "sub": "SEO",
   "st": "prog",
   "s": "2026-10-01",
   "e": "2026-10-05",
   "own": "Andrea",
   "az": "Dedicare ~1 ora all'intervista (anche in 2 volte), con Monica per la parte vini/sala",
   "bl": null,
   "deb": false,
   "agg": "2026-09-27"
  },
  {
   "t": "Post Instagram orari di apertura — grafica Canva rifatta, calendario dal 1/10 (pronto, non pubblicato)",
   "sub": "Marketing",
   "st": "prog",
   "s": "2026-09-28",
   "e": null,
   "own": "Andrea",
   "az": "Pubblicare il post dal 1/10 (il calendario mostrato è quello dal 1/10) e scegliere i canali; opzionale: logo (nessun Brand Kit su Canva)",
   "bl": null,
   "deb": false,
   "agg": "2026-09-28"
  },
  {
   "t": "Sponsorizzata Salone Nautico",
   "sub": "Marketing",
   "st": "prog",
   "s": "2026-09-25",
   "e": "2026-10-04",
   "own": "Andrea",
   "az": null,
   "bl": null,
   "deb": false,
   "agg": "2026-09-29"
  }
 ],
 "bloccate": [
  {
   "t": "Gate Nord: decisione budget paid",
   "sub": "Marketing",
   "st": "bloccato",
   "s": "2026-08-01",
   "e": null,
   "own": null,
   "az": null,
   "bl": "Baseline geografica IG non ancora raccolta",
   "deb": false,
   "agg": "2026-09-25"
  }
 ],
 "senzaData": [
  {
   "t": "NoShowApp F6 — acquisire 10 beta tester (WhatsApp + demo dal vivo con carta test) e guida onboarding",
   "sub": "NoShowApp",
   "st": "up",
   "s": "2026-10-01",
   "e": null,
   "own": "Andrea",
   "az": "Contattare i colleghi ristoratori per la demo",
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "NoShowApp F6 — registrare il marchio NoShowApp (verifica tmview.org, UIBM classe 42, ~200 €)",
   "sub": "NoShowApp",
   "st": "up",
   "s": "2026-10-01",
   "e": null,
   "own": "Andrea",
   "az": "Verifica disponibilità su tmview.org e deposito UIBM",
   "bl": null,
   "deb": false,
   "agg": "2026-09-25"
  },
  {
   "t": "Dettagli piatti: la sync con Carta/Dolci non segnala quando un'intera sezione cambia nome — piatti orfani silenziosi (visto coi dolci 28/9)",
   "sub": "Sito",
   "st": "up",
   "s": "2026-09-28",
   "e": null,
   "own": null,
   "az": null,
   "bl": null,
   "deb": true,
   "agg": "2026-09-28"
  },
  {
   "t": "Verificare dal vivo i flussi Food Cost (Tracciabilità, import Excel, IVA)",
   "sub": "Sito",
   "st": "up",
   "s": "2026-09-21",
   "e": null,
   "own": "Andrea",
   "az": "Giro veloce su tutti i tab Food Cost (Incassi, Inventario, Dashboard, Vendite, Costo piatti) + prova delle novità del 26/9",
   "bl": null,
   "deb": false,
   "agg": "2026-09-28"
  }
 ],
 "sessioni": [
  {
   "d": "2026-09-29",
   "sub": "Sito",
   "t": "Audit flussi menu-admin"
  },
  {
   "d": "2026-09-29",
   "sub": "Sito",
   "t": "Food Cost consumi interni, allergeni carta ed elenchi"
  },
  {
   "d": "2026-09-29",
   "sub": "Sito",
   "t": "Stampa dolci e carta"
  },
  {
   "d": "2026-09-28",
   "sub": "Marketing",
   "t": "Post Instagram orari di apertura (grafica Canva)"
  },
  {
   "d": "2026-09-28",
   "sub": "Sito",
   "t": "Checkbox escludi dalla stampa per percorso degustazione"
  },
  {
   "d": "2026-09-28",
   "sub": "Sito",
   "t": "Fix percorso degustazione vuoto orfano online"
  },
  {
   "d": "2026-09-28",
   "sub": "Sito",
   "t": "Food Cost Dashboard default + pulizia dolci orfani"
  },
  {
   "d": "2026-09-28",
   "sub": "Sito",
   "t": "Importo per data nello storico conteggi Inventario"
  }
 ],
 "perWeek": [
  {
   "w": "2026-07-13",
   "n": 1
  },
  {
   "w": "2026-07-20",
   "n": 8
  },
  {
   "w": "2026-07-27",
   "n": 2
  },
  {
   "w": "2026-08-03",
   "n": 2
  },
  {
   "w": "2026-08-10",
   "n": 5
  },
  {
   "w": "2026-08-17",
   "n": 3
  },
  {
   "w": "2026-08-24",
   "n": 8
  },
  {
   "w": "2026-08-31",
   "n": 4
  },
  {
   "w": "2026-09-07",
   "n": 4
  },
  {
   "w": "2026-09-14",
   "n": 5
  },
  {
   "w": "2026-09-21",
   "n": 12
  },
  {
   "w": "2026-09-28",
   "n": 11
  }
 ],
 "perDay": [
  {
   "g": "lun",
   "n": 11
  },
  {
   "g": "mar",
   "n": 5
  },
  {
   "g": "mer",
   "n": 11
  },
  {
   "g": "gio",
   "n": 2
  },
  {
   "g": "ven",
   "n": 10
  },
  {
   "g": "sab",
   "n": 18
  },
  {
   "g": "dom",
   "n": 19
  }
 ]
};
