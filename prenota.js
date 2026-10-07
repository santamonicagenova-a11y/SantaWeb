/* prenota.js — logica del wizard prenotazioni (IT / EN / FR) · Santamonica
   v 2026.10.07.01
   v 2026.10.07.01 — Estratto da prenota.html (che resta la pagina IT) per essere condiviso con /en/book e
   /fr/reserver. Nessun cambio di logica: le stringhe scritte dal JS ora vengono da PRENOTA_I18N (lingua = <html lang>);
   gli orari discreti restano da orari.js. Storico delle versioni del wizard: intestazione di prenota.html. */
// ── Testi del wizard nelle tre lingue (la lingua è quella di <html lang>) ──
// Il testo statico delle pagine (titoli, etichette) sta nell'HTML; qui solo ciò che il JS scrive a runtime.
// Gli errori restituiti dal server (campo `error`) arrivano in italiano: debito noto.
var PRENOTA_I18N = {
  it: {
    months: ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'],
    dow: ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'],
    days: ['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'],
    fmtDate: function (day, d, month, y) { return day + ' ' + d + ' ' + month + ' ' + y; },
    stepOf: function (n, tot) { return 'Passo ' + n + ' di ' + tot; },
    hoursN: function (n) { return n + ' ore'; },
    perPerson: function (eur) { return eur + ' € per persona'; },
    specialTitle: 'Serata particolare',
    specialBody: 'A cena non c\'è il menù alla carta: si cena con il menù della serata.',
    specialLink: 'Scopri la serata',
    fullTip: 'Al completo: tocca per la lista d\'attesa',
    noSlots: 'Nessun orario disponibile per questa data. Chiamaci al 010 5533155.',
    spots: function (n) { return n + ' post' + (n === 1 ? 'o' : 'i'); },
    lunch: 'Pranzo', dinner: 'Cena', any: 'Qualsiasi',
    wlLink: 'Non trovi l\'orario che volevi? Mettiti in lista d\'attesa',
    wlRequired: 'Giorno, nome e telefono sono obbligatori.',
    sending: 'Invio…',
    wlFail: 'Qualcosa non ha funzionato: chiamaci al 010 5533155.',
    wlConn: 'Errore di connessione: riprova o chiamaci al 010 5533155.',
    wlDone: function (already, date, service, n, tel) {
      return (already ? 'Eri già in lista per ' : 'Ti abbiamo messo in lista per ') + date + (service === 'pranzo' ? ' a pranzo' : ' a cena') + ', ' + n + (n === 1 ? ' persona' : ' persone') + '. Se si libera un tavolo ti chiamiamo al ' + tel + '.';
    },
    gateOk: 'Ottimo: ora puoi spuntare la casella.',
    gateDone: 'Fatto: puoi chiudere e continuare',
    gateNeed: 'Per continuare apri il menù, leggilo fino in fondo e spunta "Ho letto il menù".',
    menuUrl: '/menu.html',
    rDate: 'Data', rTime: 'Orario', rPeople: 'Persone', rName: 'Nome', rContacts: 'Contatti',
    whyGroup: function (n) { return 'Per i tavoli da ' + n + ' persone in su chiediamo la carta a garanzia.'; },
    whyDate: 'Per questa data chiediamo la carta a garanzia.',
    s5TitleCard: 'Ultimo passo: la carta a garanzia',
    s5TitleNoCard: 'Ultimo passo: conferma la richiesta',
    btnCard: 'Registra la carta e conferma',
    btnSend: 'Invia la richiesta',
    oneMoment: 'Un momento…',
    genericFail: 'Qualcosa non ha funzionato. Riprova o chiamaci al 010 5533155.',
    connFail: 'Errore di connessione. Riprova o chiamaci al 010 5533155.',
    resPendingTitle: 'Hai una prenotazione in sospeso',
    resPendingBody: 'la sua registrazione della carta a garanzia non è ancora completata.',
    resPendingBtn: 'Riprendi la registrazione carta',
    resDoneTitle: 'Prenotazione già confermata',
    resDoneBody: 'Questa prenotazione risulta già confermata. A presto!',
    resBadTitle: 'Link non più valido',
    resBadBody: 'Questo link di registrazione carta non è più valido (probabilmente scaduto). Ci chiami al 010 5533155 oppure inizi una nuova prenotazione.',
    resErrTitle: 'Errore di connessione',
    resErrBody: 'Non riusciamo a recuperare i dati. Ci chiami al 010 5533155.',
    call: 'Chiama', newBooking: 'Nuova prenotazione', backToSite: 'Torna al sito',
    homeUrl: '/', bookUrl: '/prenota.html'
  },
  en: {
    months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    dow: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    fmtDate: function (day, d, month, y) { return day + ', ' + d + ' ' + month + ' ' + y; },
    stepOf: function (n, tot) { return 'Step ' + n + ' of ' + tot; },
    hoursN: function (n) { return n + ' hours'; },
    perPerson: function (eur) { return '€' + eur + ' per person'; },
    specialTitle: 'Special evening',
    specialBody: 'There is no à la carte menu that evening: dinner is the menu of the evening.',
    specialLink: 'Discover the evening',
    fullTip: 'Fully booked: tap to join the waiting list',
    noSlots: 'No times available for this date. Please call us on +39 010 5533155.',
    spots: function (n) { return n + (n === 1 ? ' seat' : ' seats'); },
    lunch: 'Lunch', dinner: 'Dinner', any: 'Any time',
    wlLink: 'Can\'t find the time you wanted? Join the waiting list',
    wlRequired: 'Day, name and telephone are required.',
    sending: 'Sending…',
    wlFail: 'Something went wrong: please call us on +39 010 5533155.',
    wlConn: 'Connection error: please try again or call us on +39 010 5533155.',
    wlDone: function (already, date, service, n, tel) {
      return (already ? 'You were already on the list for ' : 'We have added you to the list for ') + date + (service === 'pranzo' ? ' at lunch' : ' at dinner') + ', ' + n + (n === 1 ? ' guest' : ' guests') + '. If a table becomes free we will call you on ' + tel + '.';
    },
    gateOk: 'Thank you: you can now tick the box.',
    gateDone: 'Done: you can close this and continue',
    gateNeed: 'To continue, open the menu, read it to the end and tick "I have read the menu".',
    menuUrl: '/menu-en',
    rDate: 'Date', rTime: 'Time', rPeople: 'Guests', rName: 'Name', rContacts: 'Contact',
    whyGroup: function (n) { return 'For tables of ' + n + ' or more guests we ask for a card as a guarantee.'; },
    whyDate: 'For this date we ask for a card as a guarantee.',
    s5TitleCard: 'Last step: the guarantee card',
    s5TitleNoCard: 'Last step: confirm your request',
    btnCard: 'Save the card and confirm',
    btnSend: 'Send the request',
    oneMoment: 'One moment…',
    genericFail: 'Something went wrong. Please try again or call us on +39 010 5533155.',
    connFail: 'Connection error. Please try again or call us on +39 010 5533155.',
    resPendingTitle: 'You have a booking waiting',
    resPendingBody: 'the registration of your guarantee card is not complete yet.',
    resPendingBtn: 'Resume card registration',
    resDoneTitle: 'Booking already confirmed',
    resDoneBody: 'This booking is already confirmed. See you soon!',
    resBadTitle: 'This link is no longer valid',
    resBadBody: 'This card registration link is no longer valid (it has probably expired). Please call us on +39 010 5533155 or start a new booking.',
    resErrTitle: 'Connection error',
    resErrBody: 'We cannot retrieve the details. Please call us on +39 010 5533155.',
    call: 'Call', newBooking: 'New booking', backToSite: 'Back to the website',
    homeUrl: '/en/', bookUrl: '/en/book'
  },
  fr: {
    months: ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
    dow: ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'],
    days: ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],
    fmtDate: function (day, d, month, y) { return day + ' ' + d + ' ' + month + ' ' + y; },
    stepOf: function (n, tot) { return 'Étape ' + n + ' sur ' + tot; },
    hoursN: function (n) { return n + ' heures'; },
    perPerson: function (eur) { return eur + ' € par personne'; },
    specialTitle: 'Soirée particulière',
    specialBody: 'Ce soir-là, pas de carte : on dîne avec le menu de la soirée.',
    specialLink: 'Découvrir la soirée',
    fullTip: 'Complet : touchez pour la liste d\'attente',
    noSlots: 'Aucun horaire disponible pour cette date. Appelez-nous au +39 010 5533155.',
    spots: function (n) { return n + (n === 1 ? ' place' : ' places'); },
    lunch: 'Déjeuner', dinner: 'Dîner', any: 'Peu importe',
    wlLink: 'Vous ne trouvez pas l\'horaire souhaité ? Inscrivez-vous sur la liste d\'attente',
    wlRequired: 'Le jour, le nom et le téléphone sont obligatoires.',
    sending: 'Envoi…',
    wlFail: 'Un problème est survenu : appelez-nous au +39 010 5533155.',
    wlConn: 'Erreur de connexion : réessayez ou appelez-nous au +39 010 5533155.',
    wlDone: function (already, date, service, n, tel) {
      return (already ? 'Vous étiez déjà sur la liste pour le ' : 'Nous vous avons inscrit sur la liste pour le ') + date + (service === 'pranzo' ? ' au déjeuner' : ' au dîner') + ', ' + n + (n === 1 ? ' personne' : ' personnes') + '. Si une table se libère, nous vous appellerons au ' + tel + '.';
    },
    gateOk: 'Parfait : vous pouvez maintenant cocher la case.',
    gateDone: 'C\'est fait : vous pouvez fermer et continuer',
    gateNeed: 'Pour continuer, ouvrez le menu, lisez-le jusqu\'au bout et cochez « J\'ai lu le menu ».',
    menuUrl: '/menu-fr',
    rDate: 'Date', rTime: 'Heure', rPeople: 'Personnes', rName: 'Nom', rContacts: 'Contact',
    whyGroup: function (n) { return 'Pour les tables de ' + n + ' personnes et plus, nous demandons une carte en garantie.'; },
    whyDate: 'Pour cette date, nous demandons une carte en garantie.',
    s5TitleCard: 'Dernière étape : la carte en garantie',
    s5TitleNoCard: 'Dernière étape : confirmez votre demande',
    btnCard: 'Enregistrer la carte et confirmer',
    btnSend: 'Envoyer la demande',
    oneMoment: 'Un instant…',
    genericFail: 'Un problème est survenu. Réessayez ou appelez-nous au +39 010 5533155.',
    connFail: 'Erreur de connexion. Réessayez ou appelez-nous au +39 010 5533155.',
    resPendingTitle: 'Vous avez une réservation en attente',
    resPendingBody: 'l\'enregistrement de votre carte en garantie n\'est pas encore terminé.',
    resPendingBtn: 'Reprendre l\'enregistrement de la carte',
    resDoneTitle: 'Réservation déjà confirmée',
    resDoneBody: 'Cette réservation est déjà confirmée. À bientôt !',
    resBadTitle: 'Lien non valide',
    resBadBody: 'Ce lien d\'enregistrement de la carte n\'est plus valide (il a probablement expiré). Appelez-nous au +39 010 5533155 ou commencez une nouvelle réservation.',
    resErrTitle: 'Erreur de connexion',
    resErrBody: 'Nous ne parvenons pas à récupérer les données. Appelez-nous au +39 010 5533155.',
    call: 'Appeler', newBooking: 'Nouvelle réservation', backToSite: 'Retour au site',
    homeUrl: '/fr/', bookUrl: '/fr/reserver'
  }
};

(function () {
  'use strict';

  var LANG = /^(it|en|fr)$/.test(document.documentElement.lang) ? document.documentElement.lang : 'it';
  var L = PRENOTA_I18N[LANG];

  var STATUS_URL = 'https://xbksultfskvzgncncada.supabase.co/functions/v1/reservations-status';
  var CAUZIONE_URL = 'https://xbksultfskvzgncncada.supabase.co/functions/v1/get-cauzione';
  var CHECKOUT_URL = 'https://xbksultfskvzgncncada.supabase.co/functions/v1/create-reservation-checkout';

  // v 2026.07.25.02: gli orari discreti di pranzo/cena NON sono più array fissi qui — vengono
  // da orari.js#getPeriodSlots(dateStr), che sceglie il periodo giusto per la DATA scelta dal
  // cliente (non per "oggi"). Questo permette di prenotare già ora un servizio che sarà attivo
  // solo da una data futura (es. un pranzo di settembre, prenotabile oggi anche se in piena
  // estate il pranzo è chiuso). Vedi servicesForDate()/getSlotsForDate() più sotto.

  var state = {
    online_open: true,
    card_required_days: [0,1,2,3,4,5,6],
    card_min_persone: null,
    card_special_dates: [],
    special_evenings: [],
    penale_eur: 25,
    ore_disdetta_default: 24,
    closures: [], openings: [], slot_closures: [], slot_openings: [], slot_caps: [],
    calMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    selectedDate: null,
    selectedPersone: null,
    selectedOrario: null,
    step: 1,
  };

  // Il ristorante chiede la carta a garanzia se: il giorno della settimana (0=domenica..6=sabato,
  // come Date.getDay()) è tra card_required_days, OPPURE i coperti sono >= card_min_persone,
  // OPPURE la data è tra card_special_dates (v 2026.09.30.02). Tutto impostabile da
  // menu-admin.html sotto "Prenotazioni online". Stessa regola in create-reservation-checkout.
  function cardReasonFor(dateStr, persone) {
    if (!dateStr) return 'giorno';
    var day = new Date(dateStr + 'T00:00:00').getDay();
    if (state.card_special_dates.indexOf(dateStr) !== -1) return 'data';
    if (state.card_min_persone != null && persone && persone >= state.card_min_persone) return 'gruppo';
    if (state.card_required_days.indexOf(day) !== -1) return 'giorno';
    return null;
  }
  function cardRequiredForDate(dateStr, persone) {
    return cardReasonFor(dateStr, persone) !== null;
  }

  var MESI = L.months;
  var DOW = L.dow;

  function todayStr() {
    var d = new Date(); d.setHours(0,0,0,0);
    return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
  }
  function fmtDateStr(y,m,d) { return y + '-' + String(m+1).padStart(2,'0') + '-' + String(d).padStart(2,'0'); }

  /* ── disponibilità (stessa logica già in uso nel vecchio form embedded) ── */
  function specialFor(dateStr) {
    for (var i = 0; i < state.special_evenings.length; i++) { if (state.special_evenings[i].date === dateStr) return state.special_evenings[i]; }
    return null;
  }
  function escSp(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function renderSpecialNotice() {
    var sp = state.selectedDate ? specialFor(state.selectedDate) : null;
    var html = '';
    if (sp) {
      var link = (sp.url && (sp.url.charAt(0) === '/' || sp.url.indexOf('https://santamonicagenova.it') === 0)) ? sp.url : '/cene-a-tema';
      if (LANG !== 'it' && link.indexOf('?') === -1 && link.indexOf('/cene-a-tema') !== -1) link += '?lang=' + LANG;
      html = '<strong>' + L.specialTitle + '</strong> — ' + escSp(sp.title) + '. ' + L.specialBody + ' ' +
        '<a href="' + escSp(link) + '" target="_blank" rel="noopener">' + L.specialLink + '</a>';
    }
    updateStepperForSpecial();
    document.querySelectorAll('.special-notice').forEach(function(el){
      el.innerHTML = html; el.style.display = html ? '' : 'none';
    });
  }
  // Serata speciale con orario fisso (v 2026.10.06.01): il passo «Orario» non compare, l'orario è quello della serata.
  function fixedSpecialTime(dateStr) {
    var sp = dateStr ? specialFor(dateStr) : null;
    if (!sp || !sp.time) return null;
    var slots = (typeof getSlotsForDate === 'function') ? getSlotsForDate(dateStr) : [];
    return slots.some(function(x){ return x.time === sp.time; }) ? sp.time : null;
  }
  function updateStepperForSpecial() {
    var fixed = !!fixedSpecialTime(state.selectedDate);
    var item3 = document.querySelector('.stepper-item[data-step="3"]');
    if (item3) item3.style.display = fixed ? 'none' : '';
    [['4', fixed ? '3' : '4'], ['5', fixed ? '4' : '5']].forEach(function(p){
      var d = document.querySelector('.stepper-item[data-step="' + p[0] + '"] .stepper-dot'); if (d) d.textContent = p[1];
    });
    var tot = fixed ? 4 : 5;
    [1, 2, 3, 4, 5].forEach(function(n){
      var lab = document.querySelector('#step-' + n + ' .step-label'); if (!lab) return;
      var num = (fixed && n > 3) ? n - 1 : n;
      lab.textContent = L.stepOf(num, tot);
    });
  }
  function slotClosedFor(dateStr, time) { return state.slot_closures.some(function(s){ return s.date===dateStr && s.time===time; }); }
  function slotOpenFor(dateStr, time) { return state.slot_openings.some(function(s){ return s.date===dateStr && s.time===time; }); }
  function closuresForDate(dateStr) {
    var set = { pranzo:false, cena:false };
    state.closures.forEach(function(c){
      if (c.date !== dateStr) return;
      if (c.service==='tutto') { set.pranzo=true; set.cena=true; }
      else set[c.service] = true;
    });
    return set;
  }
  function openingsForDate(dateStr) {
    var set = { pranzo:false, cena:false };
    state.openings.forEach(function(o){
      if (o.date !== dateStr) return;
      if (o.service==='tutto') { set.pranzo=true; set.cena=true; }
      else set[o.service] = true;
    });
    return set;
  }
  function servicesForDate(dateStr) {
    var base = (typeof window.getServicesForDate === 'function') ? window.getServicesForDate(dateStr) : ['pranzo','cena'];
    var set = { pranzo: base.indexOf('pranzo')!==-1, cena: base.indexOf('cena')!==-1 };
    var op = openingsForDate(dateStr);
    if (op.pranzo) set.pranzo = true;
    if (op.cena) set.cena = true;
    var cl = closuresForDate(dateStr);
    if (cl.pranzo) set.pranzo = false;
    if (cl.cena) set.cena = false;
    return set;
  }
  function capForSlot(dateStr, time) {
    return state.slot_caps.find(function(c){ return c.date===dateStr && c.time===time; }) || null;
  }
  function periodForTime(t) {
    // Euristica pranzo/cena sull'orario (hh:mm): prima delle 17:00 = pranzo, altrimenti cena.
    // Usata solo per raggruppare visivamente gli slot nello step 3 (nessun impatto su
    // apertura/chiusura, già decisa altrove da servicesForDate/getPeriodSlots).
    return parseInt(t.split(':')[0], 10) < 17 ? 'pranzo' : 'cena';
  }
  function getSlotsForDate(dateStr) {
    var svc = servicesForDate(dateStr);
    var periodSlots = (typeof window.getPeriodSlots === 'function') ? window.getPeriodSlots(dateStr) : { pranzo: [], cena: [] };
    var times = [];
    if (svc.pranzo) periodSlots.pranzo.forEach(function(t){ times.push(t); });
    if (svc.cena) periodSlots.cena.forEach(function(t){ times.push(t); });
    state.slot_openings.filter(function(o){ return o.date===dateStr; }).forEach(function(o){
      if (times.indexOf(o.time) === -1) times.push(o.time);
    });
    times = times.filter(function(t){ return slotOpenFor(dateStr,t) || !slotClosedFor(dateStr,t); });
    times.sort();
    return times.map(function(t){
      var cap = capForSlot(dateStr,t);
      return { time: t, period: periodForTime(t), capMax: cap ? cap.max_covers : null, capUsed: cap ? cap.current_covers : 0 };
    });
  }
  function dayStatus(dateStr) {
    if (dateStr < todayStr()) return 'past';
    var slots = getSlotsForDate(dateStr);
    if (slots.length === 0) return 'closed';
    var allFull = slots.every(function(s){ return s.capMax !== null && s.capUsed >= s.capMax; });
    if (allFull) return 'full';
    return 'selectable';
  }

  /* ── caricamento stato ── */
  function loadStatus() {
    return fetch(STATUS_URL, { cache: 'no-store' })
      .then(function(r){ return r.json(); })
      .then(function(d){
        state.online_open = !(d && d.online_open === false);
        state.card_required_days = (d && Array.isArray(d.card_required_days)) ? d.card_required_days : [0,1,2,3,4,5,6];
        state.card_min_persone = (d && d.card_min_persone != null) ? Number(d.card_min_persone) : null;
        state.card_special_dates = (d && Array.isArray(d.card_special_dates)) ? d.card_special_dates : [];
        state.special_evenings = (d && Array.isArray(d.special_evenings)) ? d.special_evenings : [];
        state.penale_eur = (d && d.penale_eur != null) ? Number(d.penale_eur) : 25;
        state.ore_disdetta_default = (d && d.ore_disdetta_default != null) ? Number(d.ore_disdetta_default) : 24;
        document.getElementById('step5-ore-disdetta').textContent = L.hoursN(state.ore_disdetta_default);
        document.getElementById('step5-penale').innerHTML = L.perPerson(state.penale_eur);
        state.closures = (d && d.closures) || [];
        state.openings = (d && d.openings) || [];
        state.slot_closures = (d && d.slot_closures) || [];
        state.slot_openings = (d && d.slot_openings) || [];
        state.slot_caps = (d && d.slot_caps) || [];
      })
      .catch(function(){ /* fail-open: il wizard resta usabile, il blocco è comunque server-side */ });
  }

  /* ── stepper / navigazione ── */
  function goToStep(n) {
    state.step = n;
    document.querySelectorAll('.step').forEach(function(s){ s.classList.remove('active'); });
    document.getElementById('step-' + n).classList.add('active');
    document.querySelectorAll('.stepper-item').forEach(function(el){
      var s = parseInt(el.getAttribute('data-step'), 10);
      el.classList.toggle('active', s === n);
      el.classList.toggle('done', s < n);
    });
    document.getElementById('wizard-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (n === 4 && window.aggiornaMenuGate) window.aggiornaMenuGate();
  }
  document.querySelectorAll('[data-back]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var t = parseInt(btn.getAttribute('data-back'), 10);
      if (t === 3 && fixedSpecialTime(state.selectedDate)) t = 2;
      goToStep(t);
    });
  });

  /* ── STEP 1: calendario ── */
  function renderCalendar() {
    var y = state.calMonth.getFullYear(), m = state.calMonth.getMonth();
    document.getElementById('cal-month-label').textContent = MESI[m] + ' ' + y;
    var firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    document.getElementById('cal-prev').disabled = (y === firstOfMonth.getFullYear() && m === firstOfMonth.getMonth());
    var maxMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() + 6, 1);
    document.getElementById('cal-next').disabled = (y === maxMonth.getFullYear() && m === maxMonth.getMonth());

    var grid = document.getElementById('cal-grid');
    grid.innerHTML = '';
    DOW.forEach(function(d){ var el = document.createElement('div'); el.className='cal-dow'; el.textContent=d; grid.appendChild(el); });

    var firstDay = new Date(y, m, 1);
    var startOffset = (firstDay.getDay() + 6) % 7; // lun=0
    for (var i = 0; i < startOffset; i++) { var e = document.createElement('div'); e.className='cal-day empty'; grid.appendChild(e); }

    var daysInMonth = new Date(y, m + 1, 0).getDate();
    for (var d = 1; d <= daysInMonth; d++) {
      var dateStr = fmtDateStr(y, m, d);
      var status = dayStatus(dateStr);
      var cell = document.createElement('div');
      cell.className = 'cal-day ' + (status === 'selectable' ? 'selectable' : status);
      cell.textContent = d;
      if (state.selectedDate === dateStr) cell.classList.add('selected');
      var spCell = specialFor(dateStr);
      if (spCell) { cell.classList.add('special'); cell.title = L.specialTitle + ': ' + spCell.title; }
      if (status === 'selectable') {
        cell.addEventListener('click', function(ds){ return function(){ selectDate(ds); }; }(dateStr));
      } else if (status === 'full') {
        cell.classList.add('wl');
        cell.title = L.fullTip;
        cell.addEventListener('click', function(ds){ return function(){ openWaitlist(ds); }; }(dateStr));
      }
      grid.appendChild(cell);
    }
  }
  function selectDate(dateStr) {
    state.selectedDate = dateStr;
    state.selectedOrario = null;
    renderCalendar();
    renderSpecialNotice();
    goToStep(2);
  }
  document.getElementById('cal-prev').addEventListener('click', function(){
    state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  document.getElementById('cal-next').addEventListener('click', function(){
    state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  /* ── STEP 2: persone ── */
  function renderPersone() {
    var grid = document.getElementById('persone-grid');
    grid.innerHTML = '';
    for (var n = 1; n <= 6; n++) {
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'persona-btn'; btn.textContent = n;
      if (state.selectedPersone === n) btn.classList.add('selected');
      btn.addEventListener('click', function(num){ return function(){ selectPersone(num); }; }(n));
      grid.appendChild(btn);
    }
  }
  function selectPersone(n) {
    state.selectedPersone = n;
    renderPersone();
    var fixedT = fixedSpecialTime(state.selectedDate);
    if (fixedT) { state.selectedOrario = fixedT; goToStep(4); return; }
    goToStep(3);
    renderOrario();
  }

  /* ── STEP 3: orario ── */
  function renderOrario() {
    var container = document.getElementById('orario-grid');
    container.innerHTML = '';
    if (!state.selectedDate) return;
    var slots = getSlotsForDate(state.selectedDate);
    if (!slots.length) {
      container.innerHTML = '<p class="orario-empty">' + L.noSlots + '</p>';
      return;
    }
    function buildBtn(s) {
      var remaining = s.capMax !== null ? Math.max(0, s.capMax - s.capUsed) : null;
      var disabled = remaining !== null && remaining < (state.selectedPersone || 1);
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'orario-btn';
      btn.innerHTML = s.time + (remaining !== null ? '<span class="orario-cap">' + L.spots(remaining) + '</span>' : '');
      if (disabled) btn.disabled = true;
      if (state.selectedOrario === s.time) btn.classList.add('selected');
      if (!disabled) btn.addEventListener('click', function(t){ return function(){ selectOrario(t); }; }(s.time));
      return btn;
    }
    [['pranzo', L.lunch], ['cena', L.dinner]].forEach(function(pair){
      var period = pair[0], label = pair[1];
      var periodSlots = slots.filter(function(s){ return s.period === period; });
      if (!periodSlots.length) return;
      if (slots.some(function(s){ return s.period !== period; })) {
        var lbl = document.createElement('p');
        lbl.className = 'orario-period-label';
        lbl.textContent = label;
        container.appendChild(lbl);
      }
      var grid = document.createElement('div');
      grid.className = 'orario-grid';
      periodSlots.forEach(function(s){ grid.appendChild(buildBtn(s)); });
      container.appendChild(grid);
    });
    var qualchePieno = slots.some(function(s){ return s.capMax !== null && Math.max(0, s.capMax - s.capUsed) < (state.selectedPersone || 1); });
    if (qualchePieno) {
      var wl = document.createElement('button');
      wl.type = 'button'; wl.className = 'wl-link';
      wl.textContent = L.wlLink;
      wl.addEventListener('click', function(){ openWaitlist(state.selectedDate); });
      container.appendChild(wl);
    }
  }

  /* ── LISTA D'ATTESA (v 2026.09.30.01) ── */
  var WL_URL = 'https://xbksultfskvzgncncada.supabase.co/functions/v1/lista-attesa';
  function wlRiempiServizi() {
    var d = document.getElementById('wl-data').value;
    var selS = document.getElementById('wl-servizio'), selO = document.getElementById('wl-orario');
    var periodSlots = (d && typeof window.getPeriodSlots === 'function') ? window.getPeriodSlots(d) : { pranzo: [], cena: [] };
    var svc = d ? servicesForDate(d) : { pranzo: true, cena: true };
    var prima = selS.value;
    var opts = [];
    if (svc.cena || !svc.pranzo) opts.push(['cena', L.dinner]);
    if (svc.pranzo || !svc.cena) opts.push(['pranzo', L.lunch]);
    selS.innerHTML = opts.map(function(o){ return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('');
    if (opts.some(function(o){ return o[0] === prima; })) selS.value = prima;
    var orari = (periodSlots[selS.value] || []);
    selO.innerHTML = '<option value="">' + L.any + '</option>' + orari.map(function(t){ return '<option value="' + t + '">' + t + '</option>'; }).join('');
  }
  function openWaitlist(dateStr) {
    state.wlFrom = state.step;
    var inp = document.getElementById('wl-data');
    var oggi = todayStr();
    var max = new Date(); max.setMonth(max.getMonth() + 6);
    inp.min = oggi;
    inp.max = max.getFullYear() + '-' + String(max.getMonth()+1).padStart(2,'0') + '-' + String(max.getDate()).padStart(2,'0');
    inp.value = dateStr || '';
    var selP = document.getElementById('wl-persone');
    if (!selP.options.length) { for (var n = 1; n <= 6; n++) { var o = document.createElement('option'); o.value = n; o.textContent = n; selP.appendChild(o); } }
    selP.value = String(state.selectedPersone || 2);
    ['nome', 'tel', 'email'].forEach(function(k){
      var src = document.getElementById('p-' + k), dst = document.getElementById('wl-' + k);
      if (src && dst && !dst.value) dst.value = src.value;
    });
    wlRiempiServizi();
    if (state.selectedOrario) {
      var selO = document.getElementById('wl-orario');
      if ([].some.call(selO.options, function(o){ return o.value === state.selectedOrario; })) selO.value = state.selectedOrario;
    }
    document.getElementById('wl-status').textContent = '';
    goToStep('wl');
  }
  document.getElementById('wl-data').addEventListener('change', wlRiempiServizi);
  document.getElementById('wl-servizio').addEventListener('change', function(){
    var d = document.getElementById('wl-data').value;
    var periodSlots = (d && typeof window.getPeriodSlots === 'function') ? window.getPeriodSlots(d) : { pranzo: [], cena: [] };
    var orari = periodSlots[this.value] || [];
    document.getElementById('wl-orario').innerHTML = '<option value="">' + L.any + '</option>' + orari.map(function(t){ return '<option value="' + t + '">' + t + '</option>'; }).join('');
  });
  document.getElementById('wl-back').addEventListener('click', function(){ goToStep(state.wlFrom && state.wlFrom !== 'wl' ? state.wlFrom : 1); });
  document.getElementById('wl-form').addEventListener('submit', function(e){
    e.preventDefault();
    var st = document.getElementById('wl-status');
    var payload = {
      action: 'join',
      _hp: document.getElementById('wl-hp').value,
      data: document.getElementById('wl-data').value,
      servizio: document.getElementById('wl-servizio').value,
      orario: document.getElementById('wl-orario').value,
      persone: Number(document.getElementById('wl-persone').value),
      nome: document.getElementById('wl-nome').value.trim(),
      telefono: document.getElementById('wl-tel').value.trim(),
      email: document.getElementById('wl-email').value.trim(),
      note: document.getElementById('wl-note').value.trim()
    };
    if (!payload.data || !payload.nome || !payload.telefono) { st.textContent = L.wlRequired; return; }
    var btn = document.getElementById('wl-submit');
    btn.disabled = true; st.textContent = L.sending;
    fetch(WL_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function(r){ return r.json().then(function(j){ return { ok: r.ok, j: j }; }); })
      .then(function(res){
        btn.disabled = false;
        if (!res.ok || !res.j || !res.j.ok) { st.textContent = (res.j && res.j.error) || L.wlFail; return; }
        document.getElementById('wl-form').style.display = 'none';
        document.getElementById('wl-done').style.display = '';
        document.getElementById('wl-done-txt').textContent = L.wlDone(!!res.j.gia_iscritto, formatDateIt(payload.data), payload.servizio, payload.persone, payload.telefono);
      })
      .catch(function(){ btn.disabled = false; st.textContent = L.wlConn; });
  });
  function selectOrario(t) {
    state.selectedOrario = t;
    renderOrario();
    goToStep(4);
  }

  /* ── STEP 4: contatti ── */
  document.getElementById('contatti-form').addEventListener('submit', function(e){
    e.preventDefault();
    var nome = document.getElementById('p-nome').value.trim();
    var tel = document.getElementById('p-tel').value.trim();
    var email = document.getElementById('p-email').value.trim();
    var intoll = document.getElementById('p-intolleranze').value.trim();
    if (!nome || !tel || !email || !intoll) return;
    var gateOn = document.getElementById('menu-gate').style.display !== 'none';
    if (gateOn && !document.getElementById('p-menu').checked) {
      var st = document.getElementById('menu-gate-state');
      st.textContent = L.gateNeed;
      st.style.color = '#9e4a2a';
      document.getElementById('menu-gate').scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    renderRiepilogo();
    goToStep(5);
  });

  /* ── STEP 4: lettura del menù prima di prenotare (v 2026.10.02.03) ── */
  var LETTURA_MENU_OBBLIGATORIA = false; // v 2026.10.03.01: DISABILITATA (3/10, decisione Andrea). Metti true per riattivarla.
  (function () {
    var modal = document.getElementById('menu-modal'), frame = document.getElementById('menu-frame');
    var chk = document.getElementById('p-menu'), st = document.getElementById('menu-gate-state');
    var timer = null, poll = null, sbloccato = false;
    function sblocca() {
      if (sbloccato) return; sbloccato = true; if (poll) { clearInterval(poll); poll = null; }
      chk.disabled = false;
      st.textContent = L.gateOk; st.style.color = '';
      document.getElementById('menu-modal-hint').textContent = L.gateDone;
    }
    function controllaScroll() {
      try {
        var d = frame.contentDocument, w = frame.contentWindow;
        var h = Math.max(d.documentElement.scrollHeight, d.body.scrollHeight);
        if (w.scrollY + w.innerHeight >= h - 60) sblocca();
      } catch (e) { /* iframe non leggibile: vale il timer di riserva */ }
    }
    document.getElementById('menu-open').addEventListener('click', function () {
      if (!frame.getAttribute('src')) frame.setAttribute('src', L.menuUrl);
      if (!poll) poll = setInterval(controllaScroll, 400); // controllo periodico: piu' robusto degli eventi di scroll dell'iframe
      modal.classList.add('open');
      if (!timer && !sbloccato) timer = setTimeout(sblocca, 15000); // riserva se il menù non si legge dall'iframe
    });
    function chiudi() { modal.classList.remove('open'); }
    document.getElementById('menu-close').addEventListener('click', chiudi);
    modal.addEventListener('click', function (e) { if (e.target === modal) chiudi(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') chiudi(); });
    // Serate speciali: non hanno il menù alla carta, il passo non chiede la lettura
    window.aggiornaMenuGate = function () {
      var sp = state.selectedDate ? specialFor(state.selectedDate) : null;
      document.getElementById('menu-gate').style.display = (sp || !LETTURA_MENU_OBBLIGATORIA) ? 'none' : '';
    };
  })();

  /* ── STEP 5: riepilogo + garanzia ── */
  function formatDateIt(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return L.fmtDate(L.days[d.getDay()], d.getDate(), MESI[d.getMonth()], d.getFullYear());
  }
  function renderRiepilogo() {
    var box = document.getElementById('riepilogo');
    box.innerHTML =
      row(L.rDate, formatDateIt(state.selectedDate)) +
      row(L.rTime, state.selectedOrario) +
      row(L.rPeople, state.selectedPersone) +
      row(L.rName, document.getElementById('p-nome').value.trim()) +
      row(L.rContacts, document.getElementById('p-tel').value.trim() + ' · ' + document.getElementById('p-email').value.trim());
    function row(l,v) { return '<div class="riepilogo-row"><span class="riepilogo-label">'+l+'</span><span class="riepilogo-val">'+v+'</span></div>'; }

    // Il giorno scelto determina se questo passo chiede la carta (Stripe) o se la
    // prenotazione va semplicemente in revisione manuale (vedi cardRequiredForDate).
    var needsCard = cardRequiredForDate(state.selectedDate, state.selectedPersone);
    var motivo = cardReasonFor(state.selectedDate, state.selectedPersone);
    var why = document.getElementById('step5-card-why');
    why.textContent = motivo === 'gruppo' ? L.whyGroup(state.card_min_persone)
      : motivo === 'data' ? L.whyDate : '';
    why.style.display = why.textContent ? '' : 'none';
    document.getElementById('step5-title').textContent = needsCard ? L.s5TitleCard : L.s5TitleNoCard;
    document.getElementById('step5-rules').style.display = needsCard ? '' : 'none';
    document.getElementById('step5-nocard-note').style.display = needsCard ? 'none' : '';
    confirmBtn.textContent = needsCard ? L.btnCard : L.btnSend;
  }

  var confirmBtn = document.getElementById('confirm-btn');
  var confirmStatus = document.getElementById('confirm-status');
  confirmBtn.addEventListener('click', function(){
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = '<span class="spinner"></span>' + L.oneMoment;
    confirmStatus.className = 'status-msg';
    confirmStatus.textContent = '';

    var payload = {
      nome: document.getElementById('p-nome').value.trim(),
      email: document.getElementById('p-email').value.trim(),
      telefono: document.getElementById('p-tel').value.trim(),
      data: state.selectedDate,
      orario: state.selectedOrario,
      persone: state.selectedPersone,
      intolleranze: document.getElementById('p-intolleranze').value.trim(),
      occasione: document.getElementById('p-occasione').value,
      note: document.getElementById('p-note').value.trim(),
      cap: document.getElementById('p-cap').value.trim(),
      marketing_consent: document.getElementById('p-marketing').checked,
      _hp: document.getElementById('p-hp').value,
    };

    fetch(CHECKOUT_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    })
      .then(function(res){ return res.json().then(function(body){ return { status: res.status, body: body }; }); })
      .then(function(r){
        if (r.status === 201 && r.body && r.body.url) {
          window.location.href = r.body.url;
          return;
        }
        if (r.status === 201 && r.body && r.body.pending) {
          // Giorno "libero": nessuna carta richiesta, prenotazione in revisione manuale.
          document.getElementById('wizard-wrap').style.display = 'none';
          document.getElementById('pending-card').style.display = '';
          return;
        }
        var msg = (r.body && r.body.error) || L.genericFail;
        confirmStatus.textContent = msg;
        confirmStatus.className = 'status-msg error show';
        confirmBtn.disabled = false;
        confirmBtn.textContent = cardRequiredForDate(state.selectedDate, state.selectedPersone) ? L.btnCard : L.btnSend;
        if (r.status === 403 || r.status === 409) { loadStatus().then(function(){ renderOrario(); }); }
      })
      .catch(function(){
        confirmStatus.textContent = L.connFail;
        confirmStatus.className = 'status-msg error show';
        confirmBtn.disabled = false;
        confirmBtn.textContent = L.btnCard;
      });
  });

  /* ── resume flow (?resume=SHORT_ID) ── */
  function initResume(shortId) {
    document.getElementById('wizard-wrap').style.display = 'none';
    var card = document.getElementById('resume-card');
    card.style.display = '';
    fetch(CAUZIONE_URL + '?short_id=' + encodeURIComponent(shortId))
      .then(function(r){ return r.status === 404 ? null : r.json(); })
      .then(function(data){
        var icon = document.getElementById('resume-icon');
        var title = document.getElementById('resume-title');
        var body = document.getElementById('resume-body');
        var actions = document.getElementById('resume-actions');
        if (data && data.status === 'pending' && data.stripe_session_url) {
          icon.textContent = '⏳';
          title.textContent = L.resPendingTitle;
          body.textContent = (data.nome_cliente ? data.nome_cliente + ', ' : '') + L.resPendingBody;
          actions.innerHTML = '<a class="btn btn-primary" style="display:inline-block;" href="' + data.stripe_session_url + '">' + L.resPendingBtn + '</a>';
        } else if (data && data.status && data.status !== 'pending') {
          icon.textContent = '✓';
          title.textContent = L.resDoneTitle;
          body.textContent = L.resDoneBody;
          actions.innerHTML = '<a class="btn btn-primary" style="display:inline-block;" href="' + L.homeUrl + '">' + L.backToSite + '</a>';
        } else {
          icon.textContent = '📞';
          title.textContent = L.resBadTitle;
          body.textContent = L.resBadBody;
          actions.innerHTML = '<a class="btn btn-primary" style="display:inline-block;margin-right:0.6rem;" href="tel:+390105533155">' + L.call + '</a>' +
                               '<a class="btn btn-ghost" style="display:inline-block;" href="' + L.bookUrl + '">' + L.newBooking + '</a>';
        }
      })
      .catch(function(){
        document.getElementById('resume-title').textContent = L.resErrTitle;
        document.getElementById('resume-body').textContent = L.resErrBody;
      });
  }

  /* ── init ── */
  function init() {
    var params = new URLSearchParams(window.location.search);
    var resumeId = params.get('resume');
    loadStatus().then(function(){
      if (!state.online_open) {
        document.getElementById('wizard-wrap').style.display = 'none';
        document.getElementById('closed-banner').style.display = '';
        return;
      }
      if (resumeId) { initResume(resumeId); return; }
      renderCalendar();
      renderPersone();
      // ?data=YYYY-MM-DD (v 2026.10.02.02): arrivo da un link con la data già scelta (es. pagina
      // cene a tema) → si parte dal passo 2 «In quanti sarete?». Data non valida/chiusa/al
      // completo: si resta al passo 1.
      var dataParam = params.get('data');
      if (dataParam && /^\d{4}-\d{2}-\d{2}$/.test(dataParam) && dayStatus(dataParam) === 'selectable') {
        var pd = dataParam.split('-');
        state.calMonth = new Date(Number(pd[0]), Number(pd[1]) - 1, 1);
        selectDate(dataParam);
      }
    });
  }
  init();
})();
