# -*- coding: utf-8 -*-
"""
weekend_page.py — pagina «Weekend a Genova» IT/EN/FR  ·  v 2026.10.07.01

Usato da scripts/build_lang_pages.py. Genera TUTTE E TRE le versioni della pagina (anche l'italiana):
  weekend-a-genova.html  ·  en/weekend-in-genoa-seafood-dinner.html  ·  fr/week-end-genes-diner-mer.html
Testi in WEEKEND (qui sotto, approvati da Andrea il 7/10/2026: progetto-seo/BOZZA_pagina_weekend_gastronomico_v2026.10.07.13.md).
URL, lingue e hreflang: D.PAGES['weekend'] in lang_pages_dict.py.

ORARI: mai scritti a mano. Il blocco orari e le frasi «venerdì e sabato a pranzo e a cena…» (testo, FAQ n. 2,
JSON-LD FAQPage, meta description) sono calcolati dai periodi del pannello admin «Orari di Apertura»
(funzione get-opening-hours, la stessa letta da orari.js). Se la rete non risponde, fallback su
scripts/orari-2026-10-01.json. A runtime orari.js riscrive #orari-info nella lingua della pagina.
Quando cambiano i periodi nel pannello: rilanciare build_lang_pages.py (--check segnala la pagina fuori allineamento).
"""
import datetime, html, json, os, re, urllib.request

BASE = 'https://santamonicagenova.it'
VERSION = 'v 2026.10.07.01'
LASTMOD = '2026-10-07'          # dateModified / lastmod: aggiornare a ogni modifica sostanziale dei contenuti
OPENING_URL = 'https://xbksultfskvzgncncada.supabase.co/functions/v1/get-opening-hours'
DAYS = ['lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom']
JSIDX = {'lun': 1, 'mar': 2, 'mer': 3, 'gio': 4, 'ven': 5, 'sab': 6, 'dom': 0}
TEL_HREF = 'tel:+390105533155'
TEL_TXT = '+39 010 553 31 55'
MICHELIN = {
    'it': 'https://guide.michelin.com/it/it/liguria/genova/ristorante/santamonica',
    'en': 'https://guide.michelin.com/en/liguria/genova/restaurant/santamonica',
    'fr': 'https://guide.michelin.com/fr/fr/liguria/genova/restaurant/santamonica',
}

# ── Foto (img/weekend/): file, dimensioni reali, alt per lingua (senza origine dei prodotti, senza promettere la vista di sera) ──
PHOTOS = {
    'sala_giorno': ('sala-vista-mare-giorno.jpg', 1600, 1064, {
        'it': 'La sala di Santamonica di giorno, con le finestre aperte sul mare e sulla spiaggia di San Giuliano',
        'en': 'Santamonica\'s dining room by day, with windows and doors opening onto the sea and San Giuliano beach',
        'fr': 'La salle de Santamonica en journée, avec ses fenêtres ouvertes sur la mer et la plage de San Giuliano'}),
    'sala_sera': ('sala-sera-lume.jpg', 900, 1200, {
        'it': 'Un angolo della sala di sera, con tavolini, lampade soffuse e una parete rossa illuminata',
        'en': 'A corner of the dining room in the evening, with small tables, soft lamps and a lit red wall',
        'fr': 'Un coin de la salle le soir, avec de petites tables, des lampes tamisées et un mur rouge éclairé'}),
    'ostriche': ('ostriche-sale-mare.jpg', 490, 640, {
        'it': 'Due ostriche aperte su un letto di sale, con il mare sullo sfondo',
        'en': 'Two open oysters on a bed of salt, with the sea behind',
        'fr': 'Deux huîtres ouvertes sur un lit de sel, avec la mer en arrière-plan'}),
    'gambero': ('gambero-rosso-mano.jpg', 640, 640, {
        'it': 'Un gambero rosso tenuto in mano, con il mare sullo sfondo',
        'en': 'A red prawn held in the hand, with the sea behind',
        'fr': 'Une gambas rouge tenue à la main, avec la mer en arrière-plan'}),
    'sashimi': ('sashimi-misto-ostriche.jpg', 512, 640, {
        'it': 'Pesce crudo tagliato a sashimi su un piatto bianco, con due ostriche',
        'en': 'Raw fish cut as sashimi on a white plate, with two oysters',
        'fr': 'Poisson cru taillé en sashimi sur une assiette blanche, avec deux huîtres'}),
}

# ── Testi. Segnaposto: [[where]] [[menu]] [[book]] [[tel]] [[michelin]] [[weekend_times]] [[weekend_short]] [[open_phrase]] ──
WEEKEND = {
 'it': {
  'title': 'Weekend a Genova: pranzo o cena di pesce sul mare | Santamonica',
  'description': 'Pranzo o cena di pesce sulla spiaggia di San Giuliano, a Genova: pescato di Camogli, crudo a sashimi, vini liguri. [[open_phrase]].',
  'h1': 'Un weekend a Genova: pranzo o cena di pesce sulla spiaggia',
  'breadcrumb': 'Weekend a Genova',
  'intro': 'Santamonica è un ristorante di pesce sulla spiaggia di San Giuliano, a Genova. La sala è direttamente sulla spiaggia: a pranzo il mare è davanti a te, alla luce del giorno; la sera lo senti e, quando è mosso, sembra di stare dentro il mare. Da ottobre a primavera gli stabilimenti intorno sono chiusi e la spiaggia è tranquilla.',
  'sections': [
   ('Quando venire nel weekend', [
     '[[weekend_times]]',
     '<div class="orari-box" id="orari-info" aria-label="Orari di apertura">[[orari_rows]]</div>',
     'La prenotazione è consigliata, soprattutto nel weekend. Dopo Capodanno ci fermiamo per ferie una decina di giorni; le date e le altre chiusure straordinarie sono comunicate sui profili social.',
     '[[photo:sala_sera]]']),
   ('Il pesce arriva da Camogli', [
     'Il pesce del giorno arriva da Camogli, i crostacei da Liguria e Toscana, le ostriche dalla Normandia: la carta segue quello che arriva. In autunno, secondo disponibilità: ricciole, ombrine, gamberi e scampi, triglie e, fino ai primi di novembre, qualche lampuga. <em>Aggiornato a ottobre 2026.</em>']),
   ('Il crudo, solo a sashimi', [
     'Per il crudo la qualità della materia prima è fondamentale. Il pesce crudo è tagliato solo a sashimi, non in tartare, per rispettarne consistenza e sapore.',
     '[[photos:ostriche,gambero,sashimi]]']),
   ('Vino e abbinamenti', [
     'Spingiamo molto i prodotti liguri, che si abbinano perfettamente al pesce, crudo o cotto. Con le ostriche la sommelier Monica Capurro propone il Pigato «Ca da Rena» vendemmia tardiva di Punta Crena: la sua acidità si abbina alla sapidità dell\'ostrica. Con i piatti dal condimento più deciso funzionano anche i rossi liguri, serviti a una temperatura appena più bassa di quella ambiente.']),
   ('Quanto si spende', [
     'Menù degustazione di 6 portate a 75 € a persona (abbinamento vini +50 € a persona), oltre alla carta. Alla carta la spesa indicativa è di 70–90 € a persona, vini inclusi. Siamo nella <a href="[[michelin]]" target="_blank" rel="noopener noreferrer">Guida MICHELIN Italia 2026</a>. <a href="[[menu]]">Menù aggiornato</a>.']),
   ('Se arrivi da fuori Genova', [
     'Siamo sul Lungomare Lombardo 27, zona Albaro. Non abbiamo parcheggi privati; da ottobre a primavera di norma si trova posto in strada senza difficoltà (in estate la zona è più affollata). In <a href="[[where]]">Dove siamo</a> trovi come arrivare. Per prenotare usa il pulsante qui sotto o chiama il <a href="[[tel_href]]">[[tel]]</a>.']),
  ],
  'cta': 'Prenota un tavolo',
  'faq_h': 'Domande frequenti',
  'faq': [
   ('Il ristorante è davvero sul mare?', 'Sì. La sala è direttamente sulla spiaggia di San Giuliano.'),
   ('Siete aperti nel weekend?', '[[weekend_short]] La prenotazione è consigliata.'),
   ('Che pesce si mangia in autunno e in inverno?', 'Dipende dal pescato di Camogli: ad esempio ricciola, ombrina, triglia, gamberi e scampi, secondo disponibilità.'),
   ('Fate il crudo?', 'Sì, tagliato solo a sashimi, non in tartare.'),
   ('Quanto si spende?', 'Menù degustazione 6 portate 75 € a persona; vini +50 € a persona. Alla carta, spesa indicativa 70–90 € a persona, vini inclusi.'),
   ('Posso avere un tavolo con vista mare?', 'Tutti i tavoli, dentro e fuori, vedono il mare. I tavoli esterni sono sempre disponibili; da ottobre a primavera si mangia fuori solo a pranzo e con bel tempo.'),
  ],
 },
 'en': {
  'title': 'A Weekend in Genoa: Seafood Lunch or Dinner by the Sea | Santamonica',
  'description': 'Seafood lunch or dinner on San Giuliano beach, Genoa: fish from Camogli, sashimi-cut raw fish, Ligurian wines. [[open_phrase]].',
  'h1': 'A weekend in Genoa: seafood lunch or dinner on the beach',
  'breadcrumb': 'Weekend in Genoa',
  'intro': 'Santamonica is a seafood restaurant on San Giuliano beach in Genoa. The dining room is right on the beach: at lunch the sea is in front of you in daylight; in the evening you hear it, and when it is rough it feels as if you are inside it. From October to spring the beach clubs around us are closed and the beach is quiet.',
  'sections': [
   ('When to come at the weekend', [
     '[[weekend_times]]',
     '<div class="orari-box" id="orari-info" aria-label="Opening hours">[[orari_rows]]</div>',
     'Booking is recommended, especially at the weekend. After New Year we close for about ten days of winter holiday; the dates, and any other extraordinary closures, are announced on our social profiles.',
     '[[photo:sala_sera]]']),
   ('The fish comes from Camogli', [
     'Our daily fish comes from Camogli, our crustaceans from Liguria and Tuscany, our oysters from Normandy: the menu follows what arrives. In autumn, depending on availability: amberjack, shi drum, prawns and langoustines, red mullet and, until early November, some mahi-mahi (dolphinfish). <em>Updated October 2026.</em>']),
   ('Raw fish, cut as sashimi only', [
     'For raw fish, the quality of the ingredient is essential. Raw fish is cut only as sashimi, not as tartare, to respect its texture and flavour.',
     '[[photos:ostriche,gambero,sashimi]]']),
   ('Wine and pairings', [
     'We lean heavily on Ligurian products, which pair perfectly with fish, raw or cooked. With oysters, our sommelier Monica Capurro suggests Punta Crena\'s late-harvest Pigato «Ca da Rena»: its acidity sets off the oyster\'s salinity. With bolder dishes, Ligurian reds also work, served slightly cooler than room temperature.']),
   ('What it costs', [
     '6-course tasting menu at €75 per person (wine pairing +€50 per person), as well as the à la carte menu, where the indicative spend is €70–90 per person, wine included. We are listed in the <a href="[[michelin]]" target="_blank" rel="noopener noreferrer">MICHELIN Guide Italy 2026</a>. <a href="[[menu]]">Current menu</a>.']),
   ('If you are coming from out of town', [
     'We are at Lungomare Lombardo 27, in the Albaro district. We have no private parking; from October to spring you can usually find a space on the street without trouble (in summer the area is busier). <a href="[[where]]">Where we are</a> explains how to get here. To book, use the button below or call <a href="[[tel_href]]">[[tel]]</a>.']),
  ],
  'cta': 'Book a table',
  'faq_h': 'Frequently asked questions',
  'faq': [
   ('Is the restaurant really on the sea?', 'Yes. The dining room is right on San Giuliano beach.'),
   ('Are you open at the weekend?', '[[weekend_short]] Booking is recommended.'),
   ('What fish do you serve in autumn and winter?', 'It follows the Camogli catch: for example amberjack, shi drum, red mullet, prawns and langoustines, depending on availability.'),
   ('Do you serve raw fish?', 'Yes, cut only as sashimi, not as tartare.'),
   ('How much does it cost?', '6-course tasting menu €75 per person; wine pairing +€50 per person. À la carte, indicative spend €70–90 per person, wine included.'),
   ('Can I get a sea-view table?', 'Every table, inside and out, looks onto the sea. Outdoor tables are always available; from October to spring you can eat outside only at lunch and in good weather.'),
  ],
 },
 'fr': {
  'title': 'Week-end à Gênes : déjeuner ou dîner de poisson face à la mer | Santamonica',
  'description': 'Déjeuner ou dîner de poisson sur la plage de San Giuliano, à Gênes : poisson de Camogli, cru en sashimi, vins ligures. [[open_phrase]].',
  'h1': 'Un week-end à Gênes : déjeuner ou dîner de poisson sur la plage',
  'breadcrumb': 'Week-end à Gênes',
  'intro': 'Santamonica est un restaurant de poisson sur la plage de San Giuliano, à Gênes. La salle est directement sur la plage : à midi, la mer est devant vous en pleine lumière ; le soir on l\'entend et, quand elle est agitée, on a le sentiment d\'être au cœur de la mer. D\'octobre au printemps, les établissements de plage alentour sont fermés et la plage est tranquille.',
  'sections': [
   ('Quand venir le week-end', [
     '[[weekend_times]]',
     '<div class="orari-box" id="orari-info" aria-label="Horaires d\'ouverture">[[orari_rows]]</div>',
     'La réservation est conseillée, surtout le week-end. Après le Nouvel An, nous fermons une dizaine de jours pour les congés d\'hiver ; les dates, ainsi que les autres fermetures exceptionnelles, sont annoncées sur nos réseaux sociaux.',
     '[[photo:sala_sera]]']),
   ('Le poisson vient de Camogli', [
     'Le poisson du jour arrive de Camogli, les crustacés de Ligurie et de Toscane, les huîtres de Normandie : la carte suit ce qui arrive. En automne, selon la disponibilité : sériole, ombrine, gambas et langoustines, rouget et, jusqu\'au début novembre, quelques coryphènes (mahi-mahi). <em>Mis à jour en octobre 2026.</em>']),
   ('Le cru, uniquement en sashimi', [
     'Pour le cru, la qualité du produit est essentielle. Le poisson cru est taillé uniquement en sashimi, pas en tartare, pour respecter sa texture et sa saveur.',
     '[[photos:ostriche,gambero,sashimi]]']),
   ('Vins et accords', [
     'Nous faisons une large place aux produits ligures, qui s\'accordent parfaitement avec le poisson, cru ou cuit. Avec les huîtres, la sommelière Monica Capurro propose le Pigato « Ca da Rena » vendange tardive de Punta Crena : son acidité s\'accorde à la salinité de l\'huître. Avec les plats plus corsés, les rouges ligures s\'accordent aussi, servis un peu plus frais que la température ambiante.']),
   ('Combien compter', [
     'Menu dégustation en 6 temps à 75 € par personne (accord mets-vins +50 € par personne), en plus de la carte, où la dépense indicative est de 70–90 € par personne, vins compris. Nous figurons dans le <a href="[[michelin]]" target="_blank" rel="noopener noreferrer">Guide MICHELIN Italie 2026</a>. <a href="[[menu]]">Menu à jour</a>.']),
   ('Si vous venez de loin', [
     'Nous sommes au Lungomare Lombardo 27, quartier d\'Albaro. Pas de parking privé ; d\'octobre au printemps on trouve en général une place dans la rue sans difficulté (en été le quartier est plus fréquenté). <a href="[[where]]">Où nous trouver</a> explique comment venir. Pour réserver, utilisez le bouton ci-dessous ou appelez le <a href="[[tel_href]]">[[tel]]</a>.']),
  ],
  'cta': 'Réserver une table',
  'faq_h': 'Questions fréquentes',
  'faq': [
   ('Le restaurant est-il vraiment au bord de la mer ?', 'Oui. La salle est directement sur la plage de San Giuliano.'),
   ('Êtes-vous ouverts le week-end ?', '[[weekend_short]] La réservation est conseillée.'),
   ('Quel poisson mange-t-on en automne et en hiver ?', 'Cela suit la pêche de Camogli : par exemple sériole, ombrine, rouget, gambas et langoustines, selon la disponibilité.'),
   ('Servez-vous du poisson cru ?', 'Oui, taillé uniquement en sashimi, pas en tartare.'),
   ('Combien faut-il compter ?', 'Menu dégustation 75 € par personne ; vins +50 € par personne. À la carte, dépense indicative 70–90 € par personne, vins compris.'),
   ('Puis-je avoir une table avec vue sur la mer ?', 'Toutes les tables, à l\'intérieur comme à l\'extérieur, ont vue sur la mer. Les tables extérieures sont toujours disponibles ; d\'octobre au printemps, on mange dehors uniquement à midi et par beau temps.'),
  ],
 },
}

# ── Etichette per lingua (giorni, servizi, interfaccia) ─────────────────────────────────────────
L = {
 'it': {'days': ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica'], 'closed': 'chiuso',
        'sv': {'pranzo': 'pranzo', 'cena': 'cena'}, 'lang_label': 'Lingua / Language / Langue', 'home': '/', 'foot_home': 'Home',
        'foot_voucher': 'Voucher regalo', 'foot_privacy': 'Privacy', 'foot_cookie': 'Cookie', 'hours_aria': 'Orari di apertura'},
 'en': {'days': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 'closed': 'closed',
        'sv': {'pranzo': 'lunch', 'cena': 'dinner'}, 'lang_label': 'Lingua / Language / Langue', 'home': '/en/', 'foot_home': 'Home',
        'foot_voucher': 'Gift vouchers', 'foot_privacy': 'Privacy', 'foot_cookie': 'Cookies', 'hours_aria': 'Opening hours'},
 'fr': {'days': ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'], 'closed': 'fermé',
        'sv': {'pranzo': 'déjeuner', 'cena': 'dîner'}, 'lang_label': 'Lingua / Language / Langue', 'home': '/fr/', 'foot_home': 'Accueil',
        'foot_voucher': 'Bons cadeaux', 'foot_privacy': 'Confidentialité', 'foot_cookie': 'Cookies', 'hours_aria': 'Horaires d\'ouverture'},
}
LOCALE = {'it': 'it_IT', 'en': 'en_GB', 'fr': 'fr_FR'}
LDLANG = {'it': 'it-IT', 'en': 'en', 'fr': 'fr'}


# ── Orari dal pannello ──────────────────────────────────────────────────────────────────────────
def load_period(root, today=None):
    """Periodo in vigore (dict nel formato DB) dal pannello; fallback su scripts/orari-2026-10-01.json."""
    today = today or datetime.date.today().isoformat()
    periods, source = None, 'fallback'
    try:
        req = urllib.request.Request(OPENING_URL, headers={'User-Agent': 'santamonica-build/1'})
        data = json.loads(urllib.request.urlopen(req, timeout=15).read().decode('utf-8'))
        if isinstance(data.get('periods'), list) and data['periods']:
            periods, source = data['periods'], 'pannello (get-opening-hours)'
    except Exception:
        pass
    if periods is None:
        j = json.load(open(os.path.join(root, 'scripts', 'orari-2026-10-01.json'), encoding='utf-8'))
        p = dict(j['periodo_atteso']); p['from'] = j['valido_dal']; p['to'] = None
        periods = [p]
    periods = sorted(periods, key=lambda p: p['from'])
    cur = periods[-1]
    for p in periods:
        if p['from'] <= today and (p.get('to') in (None, '') or today <= p['to']):
            cur = p
    return cur, source


def week_services(period):
    """[(chiave giorno, [servizi])] da lunedì a domenica."""
    ds = period.get('day_services') or {}
    return [(d, list(ds.get(str(JSIDX[d]), []))) for d in DAYS]


def hhmm(lang, t):
    return t.replace(':', ' h ') if lang == 'fr' else t


def group_days(period, keys):
    """Raggruppa i giorni consecutivi (nell'elenco keys) con gli stessi servizi → [(giorni, servizi)]."""
    ws = dict(week_services(period))
    groups = []
    for k in keys:
        sv = tuple(ws[k])
        if groups and groups[-1][1] == sv:
            groups[-1][0].append(k)
        else:
            groups.append(([k], sv))
    return groups


def join_names(names, lang):
    word = {'it': ' e ', 'en': ' and ', 'fr': ' et '}[lang]
    if len(names) <= 2:
        return word.join(names)
    return ', '.join(names[:-1]) + word + names[-1]


def weekend_sentence(period, lang, with_times):
    """Frase sul weekend (ven-sab-dom) generata dai periodi. with_times=True: con gli orari di apertura."""
    lab = L[lang]
    groups = group_days(period, ['ven', 'sab', 'dom'])
    name = lambda k: lab['days'][DAYS.index(k)]
    opens = {'pranzo': period.get('pranzo_opens'), 'cena': period.get('cena_opens')}
    parts = []
    for i, (days, sv) in enumerate(groups):
        names = [name(k) for k in days]
        if with_times:
            if lang == 'it':
                dn = join_names(([names[0].capitalize()] + names[1:]) if i == 0 else names, 'it')
                if sv:
                    svc = ' e '.join('a %s (dalle %s)' % (lab['sv'][s], opens[s]) for s in sv)
                    parts.append(('%s siamo aperti %s' % (dn, svc)) if i == 0 else ('%s %s' % (dn, svc)))
                else:
                    parts.append('%s %s' % (dn, lab['closed']))
            elif lang == 'en':
                dn = join_names(names, 'en')
                if sv:
                    svc = ' and '.join('%s (from %s)' % (lab['sv'][s], opens[s]) for s in sv)
                    parts.append(('On %s we are open for %s' % (dn, svc)) if i == 0 else ('on %s for %s' % (dn, svc)))
                else:
                    parts.append('on %s we are closed' % dn if i else 'On %s we are closed' % dn)
            else:
                dn = ' et '.join('le ' + n for n in names)
                if sv:
                    svc = ' et '.join('le %s (dès %s)' % (lab['sv'][s], hhmm('fr', opens[s])) for s in sv)
                    parts.append(('%s, nous sommes ouverts pour %s' % (dn.capitalize(), svc)) if i == 0 else ('%s pour %s' % (dn, svc)))
                else:
                    parts.append('%s, nous sommes fermés' % dn)
        else:
            if lang == 'it':
                dn = join_names(([names[0].capitalize()] + names[1:]) if i == 0 else names, 'it')
                parts.append('%s %s' % (dn, ('a ' + ' e a '.join(lab['sv'][s] for s in sv)) if sv else lab['closed']))
            elif lang == 'en':
                dn = join_names(names, 'en')
                parts.append('%s %s' % (dn, ('for ' + ' and '.join(lab['sv'][s] for s in sv)) if sv else lab['closed']))
            else:
                midi = {'pranzo': 'midi', 'cena': 'soir'}
                dn = join_names(([names[0].capitalize()] + names[1:]) if i == 0 else names, 'fr')
                parts.append('%s %s' % (dn, (' et '.join(midi[s] for s in sv)) if sv else lab['closed']))
    sep = (' ; ' if lang == 'fr' else '; ') if with_times else ', '
    return sep.join(parts) + '.'


def open_phrase(period, lang):
    """«Aperti da martedì a domenica» (se i giorni aperti sono contigui)."""
    ws = week_services(period)
    idx = [i for i, (_, sv) in enumerate(ws) if sv]
    if not idx:
        return ''
    contiguous = idx == list(range(idx[0], idx[-1] + 1))
    a, b = L[lang]['days'][idx[0]], L[lang]['days'][idx[-1]]
    if not contiguous:
        return {'it': 'Aperti più giorni a settimana', 'en': 'Open several days a week', 'fr': 'Ouvert plusieurs jours par semaine'}[lang]
    if lang == 'it':
        return 'Aperti da %s a %s' % (a, b)
    if lang == 'en':
        return 'Open %s to %s' % (a, b)
    return 'Ouvert du %s au %s' % (a, b)


def hours_rows(period, lang):
    """Righe orari statiche, identiche a quelle che orari.js scrive in #orari-info (stesso raggruppamento)."""
    lab = L[lang]
    ws = week_services(period)
    sv_times = {'pranzo': (period.get('pranzo_opens'), period.get('pranzo_closes')), 'cena': (period.get('cena_opens'), period.get('cena_closes'))}
    aperti, chiusi, i = [], [], 0
    while i < len(ws):
        d, sv = ws[i]
        if not sv:
            chiusi.append(d); i += 1; continue
        j = i
        while j + 1 < len(ws) and ws[j + 1][1] and tuple(ws[j + 1][1]) == tuple(sv):
            j += 1
        name = lab['days'][i].capitalize()
        label = name if j == i else '%s – %s' % (name, lab['days'][j].capitalize())
        times = ' / '.join('%s – %s' % sv_times[s] for s in sv)
        aperti.append((label, times)); i = j + 1
    out = ''.join('<div class="orari-row"><span class="g">%s</span><strong>%s</strong></div>' % (g, t) for g, t in aperti)
    for k in chiusi:
        out += '<div class="orari-row"><span class="g">%s</span><strong>%s</strong></div>' % (lab['days'][DAYS.index(k)].capitalize(), lab['closed'].capitalize())
    return out


# ── HTML ────────────────────────────────────────────────────────────────────────────────────────
CSS = """
    :root { --bg:#241812; --surface:#33221A; --text:#faf8f4; --text-soft:rgba(245,240,232,0.65); --accent:#4AA3D1; --rule:rgba(245,240,232,0.14);
      --serif:"Cormorant Garamond","Georgia","Times New Roman",serif; --sans:-apple-system,BlinkMacSystemFont,"Segoe UI","Inter","Helvetica Neue",Arial,sans-serif; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body { font-family: var(--sans); font-size: 1rem; line-height: 1.65; color: var(--text); background: var(--bg); -webkit-text-size-adjust: 100%; }
    main.legal-page { max-width: 760px; margin: 0 auto; padding: 2rem 1.1rem 3.5rem; }
    header.legal-head { border-bottom: 1px solid var(--rule); padding-bottom: 1.25rem; margin-bottom: 1.5rem; }
    .breadcrumb { font-size: .85rem; color: var(--text-soft); margin-bottom: .75rem; }
    .breadcrumb a { color: var(--text-soft); text-decoration: none; border-bottom: 1px dotted var(--text-soft); }
    h1 { font-family: var(--serif); font-weight: 500; font-size: 1.85rem; line-height: 1.2; margin: 0 0 .4rem; }
    h2 { font-family: var(--serif); font-weight: 500; font-size: 1.35rem; margin: 2rem 0 .75rem; color: var(--accent); }
    h3 { font-family: var(--sans); font-weight: 600; font-size: 1rem; margin: 1.25rem 0 .3rem; }
    p { margin: .6rem 0; }
    a { color: var(--accent); }
    .lede { font-size: 1.05rem; }
    .lang-switch { display: inline-flex; gap: .3rem; margin: .4rem 0 0; font-size: .78rem; letter-spacing: .12em; text-transform: uppercase; }
    .lang-switch a { color: var(--text-soft); text-decoration: none; padding: .2rem .5rem; border: 1px solid transparent; }
    .lang-switch a:hover { color: var(--text); }
    .lang-switch a[aria-current="true"] { color: var(--text); border-color: var(--rule); }
    figure { margin: 1.25rem 0; }
    figure img { display: block; width: 100%; height: auto; border-radius: 4px; background: var(--surface); }
    figure.narrow { max-width: 360px; }
    .food-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: .5rem; margin: 1.25rem 0; }
    .food-grid figure { margin: 0; }
    .food-grid img { aspect-ratio: 3 / 4; object-fit: cover; }
    .orari-box { margin: .75rem 0; border-top: 1px solid var(--rule); }
    .orari-row { display: flex; justify-content: space-between; gap: 1rem; padding: .6rem .2rem; border-bottom: 1px solid var(--rule); font-size: .95rem; }
    .orari-row .g { color: var(--text-soft); }
    .orari-note { font-size: .85rem; color: var(--text-soft); }
    .faq h3 { margin-top: 1.1rem; }
    .cta { margin: 2rem 0 .5rem; }
    .cta a { display: inline-block; background: var(--accent); color: #fff; padding: .8rem 1.5rem; border-radius: 2px; font-weight: 500; text-decoration: none; transition: background .15s; }
    .cta a:hover { background: #2E6E93; }
    footer.legal-foot { margin-top: 3rem; padding-top: 1.25rem; border-top: 1px solid var(--rule); font-size: .82rem; color: var(--text-soft); }
    footer.legal-foot .foot-links { margin-top: .5rem; }
    footer.legal-foot .foot-links a { color: var(--text-soft); text-decoration: none; margin-right: .85rem; }
    @media (min-width: 640px) { main.legal-page { padding: 3rem 1.5rem 4rem; } h1 { font-size: 2.25rem; } h2 { font-size: 1.5rem; } }
"""


def esc(s):
    return html.escape(s, quote=True)


def strip_tags(h):
    return ' '.join(re.sub(r'<[^>]+>', '', h).replace('\xa0', ' ').split())


def render(lang, D, period, source):
    """HTML completo della pagina nella lingua indicata. D = lang_pages_dict."""
    T = WEEKEND[lang]
    lab = L[lang]
    P = D.PAGES
    page_url = {l: BASE + P['weekend'][l] for l in ('it', 'en', 'fr')}
    me = page_url[lang]
    links = {
        'where': P['where'][lang], 'book': P['book'][lang], 'menu': D.MENU_URL[lang],
        'michelin': MICHELIN[lang], 'tel_href': TEL_HREF, 'tel': TEL_TXT,
    }
    wk_times = weekend_sentence(period, lang, True)
    wk_short = weekend_sentence(period, lang, False)
    opens_phrase = open_phrase(period, lang)
    rep = dict(links)
    rep.update({'weekend_times': wk_times, 'weekend_short': wk_short, 'open_phrase': opens_phrase, 'orari_rows': hours_rows(period, lang)})

    def fill(s):
        for k, v in rep.items():
            s = s.replace('[[%s]]' % k, v)
        return s

    def fig(key, eager=False, cls=''):
        f, w, h, alts = PHOTOS[key]
        attrs = 'loading="eager" fetchpriority="high"' if eager else 'loading="lazy" decoding="async"'
        return '<figure%s><img src="/img/weekend/%s" width="%d" height="%d" alt="%s" %s></figure>' % (
            (' class="%s"' % cls) if cls else '', f, w, h, esc(alts[lang]), attrs)

    def block(s):
        m = re.fullmatch(r'\[\[photo:(\w+)\]\]', s)
        if m:
            return fig(m.group(1), cls='narrow')
        m = re.fullmatch(r'\[\[photos:([\w,]+)\]\]', s)
        if m:
            return '<div class="food-grid">' + ''.join(fig(k) for k in m.group(1).split(',')) + '</div>'
        s = fill(s)
        return s if s.startswith('<div') else '<p>%s</p>' % s

    title = fill(T['title'])
    desc = fill(T['description'])
    sections = ''
    for h2, blocks in T['sections']:
        sections += '  <h2>%s</h2>\n' % esc(h2) + ''.join('  %s\n' % block(b) for b in blocks)
    faq = [(q, fill(a)) for q, a in T['faq']]
    faq_html = ''.join('    <h3>%s</h3>\n    <p>%s</p>\n' % (esc(q), a) for q, a in faq)

    og_img = BASE + '/img/weekend/' + PHOTOS['sala_giorno'][0]
    webpage = {
        '@context': 'https://schema.org', '@type': 'WebPage', '@id': me + '#webpage', 'url': me, 'name': title,
        'description': desc, 'inLanguage': LDLANG[lang], 'dateModified': LASTMOD,
        'isPartOf': {'@id': BASE + '/#website'}, 'about': {'@id': BASE + '/#restaurant'},
        'primaryImageOfPage': {'@type': 'ImageObject', 'url': og_img, 'width': PHOTOS['sala_giorno'][1], 'height': PHOTOS['sala_giorno'][2]},
    }
    faqld = {
        '@context': 'https://schema.org', '@type': 'FAQPage', '@id': me + '#faq', 'inLanguage': LDLANG[lang], 'url': me,
        'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': strip_tags(a)}} for q, a in faq],
    }
    ld = lambda o: '<script type="application/ld+json">\n' + json.dumps(o, ensure_ascii=False, indent=2) + '\n</script>'
    switch = ''.join('<a href="%s" hreflang="%s" lang="%s"%s>%s</a>' % (P['weekend'][l], l, l, ' aria-current="true"' if l == lang else '', l.upper()) for l in ('it', 'en', 'fr'))
    alts = ''.join('  <link rel="alternate" hreflang="%s" href="%s">\n' % (hl, page_url[hl if hl != 'x-default' else 'it']) for hl in ('it', 'en', 'fr', 'x-default'))

    out = """<!DOCTYPE html>
<!-- GENERATA da scripts/build_lang_pages.py (scripts/weekend_page.py, %(ver)s): non modificare a mano. Orari dal %(src)s. -->
<html lang="%(lang)s">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <title>%(title)s</title>
  <meta name="description" content="%(desc)s">
  <link rel="canonical" href="%(me)s">
%(alts)s
  <meta property="og:type" content="website">
  <meta property="og:title" content="%(title)s">
  <meta property="og:description" content="%(desc)s">
  <meta property="og:url" content="%(me)s">
  <meta property="og:image" content="%(og_img)s">
  <meta property="og:image:alt" content="%(og_alt)s">
  <meta property="og:locale" content="%(locale)s">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="%(title)s">
  <meta name="twitter:description" content="%(desc)s">
  <link rel="stylesheet" href="/lib/cookieconsent/cookieconsent.css">
  %(ld_web)s
  %(ld_faq)s
  <script src="/orari.js"></script>
  <style>%(css)s  </style>
</head>
<body>

<main class="legal-page" id="content">

  <header class="legal-head">
    <div class="breadcrumb"><a href="%(home)s">Santamonica</a> &nbsp;›&nbsp; <span>%(crumb)s</span></div>
    <h1>%(h1)s</h1>
    <div class="lang-switch" role="group" aria-label="%(lang_label)s">%(switch)s</div>
  </header>

  <p class="lede">%(intro)s</p>
  %(hero)s
%(sections)s
  <div class="cta"><a href="%(book)s">%(cta)s</a></div>

  <section class="faq" aria-labelledby="faq-h">
  <h2 id="faq-h">%(faq_h)s</h2>
%(faq_html)s  </section>

  <footer class="legal-foot">
    Santamonica · Il Giuliano di Andrea Giachino e C. S.a.s. · P.IVA 02395420991 · %(ver_nb)s
    <div class="foot-links">
      <a href="%(home)s">%(f_home)s</a>
      <a href="/regala">%(f_voucher)s</a>
      <a href="/privacy" target="_blank" rel="noopener noreferrer">%(f_privacy)s</a>
      <a href="/cookies" target="_blank" rel="noopener noreferrer">%(f_cookie)s</a>
    </div>
  </footer>

</main>

<script defer src="/lib/cookieconsent/cookieconsent.umd.js"></script>
<script defer src="/cookieconsent-config.js"></script>

</body>
</html>
<!-- Fine weekend (%(lang)s) · %(ver)s -->
""" % {
        'ver': VERSION, 'ver_nb': VERSION.replace(' ', '&nbsp;', 1), 'src': source, 'lang': lang, 'title': esc(title), 'desc': esc(desc), 'me': me,
        'alts': alts.rstrip('\n'), 'og_img': og_img, 'og_alt': esc(PHOTOS['sala_giorno'][3][lang]), 'locale': LOCALE[lang],
        'ld_web': ld(webpage), 'ld_faq': ld(faqld), 'css': CSS, 'home': lab['home'], 'crumb': esc(T['breadcrumb']), 'h1': esc(T['h1']),
        'lang_label': lab['lang_label'], 'switch': switch, 'intro': fill(T['intro']), 'hero': fig('sala_giorno', eager=True),
        'sections': sections.rstrip('\n'), 'book': links['book'], 'cta': esc(T['cta']), 'faq_h': esc(T['faq_h']), 'faq_html': faq_html,
        'f_home': lab['foot_home'], 'f_voucher': lab['foot_voucher'], 'f_privacy': lab['foot_privacy'], 'f_cookie': lab['foot_cookie'],
    }
    return out
