# -*- coding: utf-8 -*-
"""
lang_pages_dict.py — testi EN/FR delle pagine statiche /en/ e /fr/  ·  v 2026.10.07.01

Usato da scripts/build_lang_pages.py. La HOME prende i testi da translations.json (chiavi data-i18n);
qui ci sono i testi delle altre pagine (dove-siamo, prenota) e i pochi testi fuori da data-i18n della home.

Come funziona il match: ogni nodo di testo dell'HTML italiano, normalizzato (spazi collassati, nbsp -> spazio),
si cerca come chiave nei dizionari TEXT; i valori sono (en, fr). Gli attributi (alt, aria-label, title,
placeholder, content) usano lo stesso dizionario. HTML_BY_SELECTOR sostituisce l'innerHTML di elementi con
markup misto (grassetti, link) dove la frase non si può spezzare per nodi.
Se in una pagina resta un testo italiano non tradotto, lo script lo segnala (non lo ignora in silenzio).

Tono (regole del progetto): intimita, mestiere; niente hard-sell, niente superlativi; Michelin = «Guida MICHELIN Italia 2026»
(mai «Good Cooking», mai stelle); nessun nome di chef; cucina = prodotti del territorio, non "ligure tradizionale".
"""

# ── Pagine: slug, meta e URL ────────────────────────────────────────────────────────────────
BASE = 'https://santamonicagenova.it'
PAGES = {
    'home':  {'src': 'index.html',       'it': '/',            'en': '/en/',              'fr': '/fr/',
              'out': {'en': 'en/index.html', 'fr': 'fr/index.html'}},
    'where': {'src': 'dove-siamo.html',  'it': '/dove-siamo',  'en': '/en/where-we-are',  'fr': '/fr/ou-nous-trouver',
              'out': {'en': 'en/where-we-are.html', 'fr': 'fr/ou-nous-trouver.html'}},
    'book':  {'src': 'prenota.html',     'it': '/prenota',     'en': '/en/book',          'fr': '/fr/reserver',
              'out': {'en': 'en/book.html', 'fr': 'fr/reserver.html'}},
    # pagina «Weekend a Genova»: generata per intero (anche l'italiana) da scripts/weekend_page.py, niente sorgente a mano
    'weekend': {'src': None,             'it': '/weekend-a-genova', 'en': '/en/weekend-in-genoa-seafood-dinner', 'fr': '/fr/week-end-genes-diner-mer',
              'out': {'it': 'weekend-a-genova.html', 'en': 'en/weekend-in-genoa-seafood-dinner.html', 'fr': 'fr/week-end-genes-diner-mer.html'}},
}
# URL dei menu (esistono già per lingua) e della pagina cene a tema (lingua da ?lang=)
MENU_URL = {'it': '/menu', 'en': '/menu-en', 'fr': '/menu-fr'}

LOCALE = {'it': 'it_IT', 'en': 'en_GB', 'fr': 'fr_FR'}
LD_LANG = {'it': 'it-IT', 'en': 'en', 'fr': 'fr'}

# ── Meta per pagina (la home usa page_title/page_description di translations.json) ───────────
META = {
    'where': {
        'en': {'title': 'Where we are — Santamonica Restaurant · Genoa',
               'description': 'Santamonica restaurant in Genoa, Lungomare Lombardo 27: seafood cuisine, sea view, summer terrace. Open Tuesday to Sunday. Tel. +39 010 5533155.',
               'og_title': 'Santamonica Restaurant · Genoa',
               'og_description': 'Seafood cuisine on the Lungomare Lombardo. Sea view, summer terrace, tasting menu.'},
        'fr': {'title': 'Où nous trouver — Restaurant Santamonica · Gênes',
               'description': 'Restaurant Santamonica à Gênes, Lungomare Lombardo 27 : cuisine de la mer, vue sur la mer, terrasse d\'été. Ouvert du mardi au dimanche. Tél. +39 010 5533155.',
               'og_title': 'Restaurant Santamonica · Gênes',
               'og_description': 'Cuisine de la mer sur le Lungomare Lombardo. Vue sur la mer, terrasse d\'été, menu dégustation.'},
    },
    'book': {
        'en': {'title': 'Book a table — Santamonica Restaurant, Genoa',
               'description': 'Book a table at Santamonica restaurant in Genoa: choose the date, time and number of guests, register a card as a guarantee and receive immediate confirmation.'},
        'fr': {'title': 'Réserver une table — Restaurant Santamonica, Gênes',
               'description': 'Réservez une table au restaurant Santamonica à Gênes : choisissez la date, l\'horaire et le nombre de personnes, enregistrez une carte en garantie et recevez la confirmation immédiate.'},
    },
}

# ── JSON-LD: testi da localizzare (chiave = stringa italiana esatta) ──────────────────────────
LD_TEXT = {
    'Ristorante di pesce fresco sul Lungomare Lombardo di Genova. Sommelier Monica Capurro. Segnalato dalla Guida Michelin. Prodotti del territorio in ricette moderne, cantina curata, vista mare.': (
        'Seafood restaurant on the Lungomare Lombardo in Genoa. Sommelier Monica Capurro. Listed in the Michelin Guide. Local produce in modern recipes, curated wine cellar, sea view.',
        'Restaurant de poisson sur le Lungomare Lombardo à Gênes. Sommelière Monica Capurro. Cité dans le Guide Michelin. Produits du terroir en recettes modernes, cave soignée, vue sur la mer.'),
    'Menù Degustazione e carta': ('Tasting menu and à la carte menu', 'Menu dégustation et carte'),
    'Prenota un tavolo': ('Book a table', 'Réserver une table'),
    'Ristorante Santamonica': ('Santamonica Restaurant', 'Restaurant Santamonica'),
    'Guida MICHELIN Italia 2026': ('MICHELIN Guide Italy 2026', 'Guide MICHELIN Italie 2026'),
    'Sommelier': ('Sommelier', 'Sommelière'),
}

# ── Testi fuori da data-i18n (home) + dove-siamo + prenota: IT -> (EN, FR) ────────────────────
TEXT = {
    # ----- home -----
    'sul mare': ('by the sea', 'sur la mer'),
    'Sommelier Monica Capurro': ('Sommelier Monica Capurro', 'Sommelière Monica Capurro'),
    'Un ristorante dovrebbe farti stare meglio di quando sei entrato. Tutto il resto viene dopo.': (
        'A restaurant should make you feel better than when you walked in. Everything else comes after.',
        'Un restaurant devrait vous faire sentir mieux qu\'en entrant. Tout le reste vient après.'),
    'Vista del ristorante Santamonica sul Lungomare Lombardo di Genova con vista mare': (
        'View of Santamonica restaurant on the Lungomare Lombardo in Genoa, with the sea in front',
        'Vue du restaurant Santamonica sur le Lungomare Lombardo à Gênes, face à la mer'),
    'Un piatto di Santamonica, pesce e prodotti del territorio, servito in sala': (
        'A dish at Santamonica: fish and local produce, served in the dining room',
        'Un plat de Santamonica : poisson et produits du terroir, servi en salle'),
    'La veranda di Santamonica sulla spiaggia del Lungomare di Genova': (
        'The veranda of Santamonica on the beach of the Lungomare in Genoa',
        'La véranda de Santamonica sur la plage du Lungomare de Gênes'),
    'Tramonto sul mare dalla veranda di Santamonica': (
        'Sunset over the sea from the veranda of Santamonica',
        'Coucher de soleil sur la mer depuis la véranda de Santamonica'),
    'Cena a tema del 16 ottobre': ('Themed dinner of 16 October', 'Dîner à thème du 16 octobre'),
    'Anna e Riku di Château Puybarbe': ('Anna and Riku of Château Puybarbe', 'Anna et Riku du Château Puybarbe'),
    'La sala del ristorante Santamonica sul Lungomare di Genova': (
        'The dining room of Santamonica restaurant on the Lungomare in Genoa',
        'La salle du restaurant Santamonica sur le Lungomare de Gênes'),
    'Chiudi': ('Close', 'Fermer'),

    'Un weekend a Genova: pranzo o cena di pesce sul mare': (
        'A weekend in Genoa: seafood lunch or dinner by the sea',
        'Un week-end à Gênes : déjeuner ou dîner de poisson face à la mer'),

    # ----- dove-siamo -----
    'Vieni da fuori Genova?': ('Coming from out of town?', 'Vous venez de loin ?'),
    'Dove siamo': ('Where we are', 'Où nous trouver'),
    'Lungomare Lombardo 27 · 16145 Genova · vista mare in zona Albaro': (
        'Lungomare Lombardo 27 · 16145 Genoa · sea view in the Albaro district',
        'Lungomare Lombardo 27 · 16145 Gênes · vue sur la mer, quartier d\'Albaro'),
    'Contatti': ('Contact', 'Contact'),
    'Chiama il ristorante': ('Call the restaurant', 'Appeler le restaurant'),
    'Telefono': ('Telephone', 'Téléphone'),
    'Scrivi al ristorante': ('Write to the restaurant', 'Écrire au restaurant'),
    'Indirizzo': ('Address', 'Adresse'),
    'Lungomare Lombardo 27, 16145 Genova GE': ('Lungomare Lombardo 27, 16145 Genoa GE', 'Lungomare Lombardo 27, 16145 Gênes GE'),
    "Apri l'indirizzo nelle mappe": ('Open the address in maps', 'Ouvrir l\'adresse dans les cartes'),
    'Indicazioni stradali': ('Directions', 'Itinéraire'),
    "Apri nell'app mappe": ('Open in your maps app', 'Ouvrir dans l\'application de cartes'),
    "Apri l'indirizzo nell'app mappe del dispositivo": ('Open the address in your device\'s maps app', 'Ouvrir l\'adresse dans l\'application de cartes de l\'appareil'),
    'Orari di apertura': ('Opening hours', 'Horaires d\'ouverture'),
    'Orari settimanali': ('Weekly hours', 'Horaires de la semaine'),
    'La prenotazione è consigliata. Eventuali chiusure straordinarie (festività, ferie) vengono comunicate sui profili social del ristorante.': (
        'Booking is recommended. Any extraordinary closures (public holidays, summer break) are announced on the restaurant\'s social profiles.',
        'La réservation est conseillée. Les éventuelles fermetures exceptionnelles (jours fériés, congés) sont annoncées sur les profils sociaux du restaurant.'),
    'Mappa': ('Map', 'Plan'),
    'Mappa Google del Ristorante Santamonica, Lungomare Lombardo 27, Genova': (
        'Google map of Santamonica Restaurant, Lungomare Lombardo 27, Genoa',
        'Plan Google du restaurant Santamonica, Lungomare Lombardo 27, Gênes'),
    'La mappa è fornita da': ('The map is provided by', 'Le plan est fourni par'),
    'Google LLC': ('Google LLC', 'Google LLC'),
    '(USA): viene caricata solo dopo il tuo consenso. Senza consenso non viene inviato alcun dato a Google. Puoi modificare la scelta in qualunque momento dal pulsante «Gestisci preferenze cookie» (in fondo a ogni pagina).': (
        '(USA): it is loaded only after you consent. Without consent no data is sent to Google. You can change your choice at any time with the "Manage cookie preferences" button (at the bottom of every page).',
        '(États-Unis) : il n\'est chargé qu\'après votre consentement. Sans consentement, aucune donnée n\'est envoyée à Google. Vous pouvez modifier votre choix à tout moment avec le bouton « Gérer les préférences de cookies » (en bas de chaque page).'),
    'Apri in Google Maps': ('Open in Google Maps', 'Ouvrir dans Google Maps'),
    'Apri in OpenStreetMap': ('Open in OpenStreetMap', 'Ouvrir dans OpenStreetMap'),
    'Come arrivare': ('Getting here', 'Comment venir'),
    'In auto': ('By car', 'En voiture'),
    'Da Corso Italia, scendere verso il mare imboccando una delle traverse pedonali / carrabili che conducono al Lungomare Lombardo. Parcheggio libero o a pagamento lungo la strada — disponibilità variabile, in alta stagione consigliata partenza con anticipo.': (
        'From Corso Italia, head down towards the sea along one of the pedestrian or vehicle side streets that lead to the Lungomare Lombardo. Free or paid street parking — availability varies, so in high season we suggest leaving a little earlier.',
        'Depuis le Corso Italia, descendez vers la mer par l\'une des rues transversales, piétonnes ou carrossables, qui mènent au Lungomare Lombardo. Stationnement gratuit ou payant dans la rue — disponibilité variable ; en haute saison, nous conseillons de partir un peu plus tôt.'),
    'Con i mezzi pubblici': ('By public transport', 'En transports en commun'),
    'Linee AMT che fermano in Corso Italia (fermate San Giuliano / Boccadasse / Albaro a seconda del percorso); da lì circa 5-8 minuti a piedi scendendo verso il mare. Consultare': (
        'AMT bus lines stopping on Corso Italia (San Giuliano / Boccadasse / Albaro stops, depending on the route); from there it is about a 5-8 minute walk down towards the sea. See',
        'Les lignes AMT s\'arrêtent sur le Corso Italia (arrêts San Giuliano / Boccadasse / Albaro selon le trajet) ; de là, environ 5 à 8 minutes à pied en descendant vers la mer. Consultez'),
    'per orari aggiornati.': ('for up-to-date timetables.', 'pour les horaires à jour.'),
    'A piedi': ('On foot', 'À pied'),
    "Dal centro città, una passeggiata lungo Corso Italia in direzione Boccadasse offre una bella vista sul mare. L'ingresso del ristorante è a livello del Lungomare, raggiungibile dalle scalinate che scendono da Corso Italia.": (
        'From the city centre, a walk along Corso Italia towards Boccadasse offers a lovely view of the sea. The restaurant entrance is at Lungomare level, reached by the steps that go down from Corso Italia.',
        'Depuis le centre-ville, une promenade le long du Corso Italia en direction de Boccadasse offre une belle vue sur la mer. L\'entrée du restaurant est au niveau du Lungomare, accessible par les escaliers qui descendent du Corso Italia.'),
    'Seguici': ('Follow us', 'Suivez-nous'),
    'Instagram Santamonica': ('Instagram Santamonica', 'Instagram Santamonica'),
    'Facebook Santamonica': ('Facebook Santamonica', 'Facebook Santamonica'),
    'Home': ('Home', 'Accueil'),
    'Voucher regalo': ('Gift vouchers', 'Bons cadeaux'),
    'Cookie': ('Cookies', 'Cookies'),

    # ----- prenota -----
    'Prenota un tavolo': ('Book a table', 'Réserver une table'),
    'Serve aiuto?': ('Need help?', 'Besoin d\'aide ?'),
    'Cinque passaggi rapidi: data, persone, orario, contatti e la carta a garanzia.': (
        'Five quick steps: date, guests, time, contact details and the guarantee card.',
        'Cinq étapes rapides : date, personnes, horaire, coordonnées et carte en garantie.'),
    'Prenotazioni online momentaneamente chiuse': ('Online bookings temporarily closed', 'Réservations en ligne momentanément fermées'),
    "Al momento non accettiamo prenotazioni online. Per la disponibilità dell'ultimo minuto puoi chiamarci allo 010 5533155.": (
        'We are not taking online bookings at the moment. For last-minute availability you can call us on +39 010 5533155.',
        'Nous n\'acceptons pas de réservations en ligne pour le moment. Pour les disponibilités de dernière minute, vous pouvez nous appeler au +39 010 5533155.'),
    'Hai una prenotazione in sospeso': ('You have a booking waiting', 'Vous avez une réservation en attente'),
    'Recupero i dati…': ('Retrieving the details…', 'Récupération des données…'),
    'Data': ('Date', 'Date'), 'Persone': ('Guests', 'Personnes'), 'Orario': ('Time', 'Horaire'),
    'Contatti': ('Contact', 'Contact'), 'Garanzia': ('Guarantee', 'Garantie'),
    'Passo 1 di 5': ('Step 1 of 5', 'Étape 1 sur 5'), 'Passo 2 di 5': ('Step 2 of 5', 'Étape 2 sur 5'),
    'Passo 3 di 5': ('Step 3 of 5', 'Étape 3 sur 5'), 'Passo 4 di 5': ('Step 4 of 5', 'Étape 4 sur 5'),
    'Passo 5 di 5': ('Step 5 of 5', 'Étape 5 sur 5'),
    'Che giorno vieni a trovarci?': ('Which day would you like to visit us?', 'Quel jour souhaitez-vous nous rendre visite ?'),
    'Mese precedente': ('Previous month', 'Mois précédent'), 'Mese successivo': ('Next month', 'Mois suivant'),
    "I giorni in grigio sono chiusi o già al completo: tocca un giorno al completo per metterti in lista d'attesa. Chiamaci al 010 5533155 per richieste fuori calendario.": (
        'Days in grey are closed or already fully booked: tap a fully booked day to join the waiting list. Call us on +39 010 5533155 for requests outside the calendar.',
        'Les jours en gris sont fermés ou complets : touchez un jour complet pour vous inscrire sur la liste d\'attente. Appelez-nous au +39 010 5533155 pour toute demande hors calendrier.'),
    'In quanti sarete?': ('How many of you will be coming?', 'Combien serez-vous ?'),
    'Indietro': ('Back', 'Retour'),
    'A che ora?': ('At what time?', 'À quelle heure ?'),
    'I tuoi dati': ('Your details', 'Vos coordonnées'),
    'Nome *': ('Name *', 'Nom *'), 'Telefono *': ('Telephone *', 'Téléphone *'), 'Email *': ('Email *', 'E-mail *'),
    'CAP (facoltativo)': ('Postcode (optional)', 'Code postal (facultatif)'),
    'Email e telefono sono entrambi obbligatori per ricontattarti rapidamente. Il CAP ci aiuta a capire da dove arrivano i nostri ospiti.': (
        'Both email and telephone are required so that we can reach you quickly. The postcode helps us understand where our guests come from.',
        'L\'e-mail et le téléphone sont tous deux obligatoires pour vous recontacter rapidement. Le code postal nous aide à comprendre d\'où viennent nos hôtes.'),
    'Intolleranze o allergie *': ('Intolerances or allergies *', 'Intolérances ou allergies *'),
    "Scrivi 'nessuna' se non hai allergie": ('Write \'none\' if you have no allergies', 'Écrivez « aucune » si vous n\'avez pas d\'allergies'),
    'Occasione (opzionale)': ('Occasion (optional)', 'Occasion (facultatif)'),
    'Seleziona': ('Select', 'Sélectionner'),
    'Cena standard': ('Regular dinner', 'Dîner ordinaire'), 'Compleanno': ('Birthday', 'Anniversaire'),
    'Anniversario': ('Anniversary', 'Anniversaire de couple'),
    'Proposta di matrimonio': ('Marriage proposal', 'Demande en mariage'),
    'Cena di lavoro': ('Business dinner', 'Dîner d\'affaires'), 'Cena romantica': ('Romantic dinner', 'Dîner romantique'),
    'Altro': ('Other', 'Autre'),
    'Richieste particolari (opzionale)': ('Special requests (optional)', 'Demandes particulières (facultatif)'),
    'Acconsento a ricevere comunicazioni sul ristorante (eventi, serate a tema, novità). Facoltativo, revocabile in qualsiasi momento.': (
        'I agree to receive communications about the restaurant (events, themed evenings, news). Optional, and can be withdrawn at any time.',
        'J\'accepte de recevoir des communications sur le restaurant (événements, soirées à thème, nouveautés). Facultatif, révocable à tout moment.'),
    '* campo obbligatorio': ('* required field', '* champ obligatoire'),
    'Prima di prenotare, leggi il menù': ('Before booking, read the menu', 'Avant de réserver, lisez le menu'),
    "Così sai cosa ti aspetta a tavola, quanto costa e quali piatti fanno per te (c'è anche il filtro per allergie e intolleranze). Scorri il menù fino in fondo: poi potrai spuntare la casella e continuare.": (
        'This way you know what to expect at the table, what it costs and which dishes suit you (there is also a filter for allergies and intolerances). Scroll the menu to the end: then you can tick the box and continue.',
        'Ainsi, vous savez ce qui vous attend à table, combien cela coûte et quels plats vous conviennent (il y a aussi un filtre pour les allergies et intolérances). Faites défiler le menu jusqu\'au bout : vous pourrez ensuite cocher la case et continuer.'),
    'Leggi il menù': ('Read the menu', 'Lire le menu'),
    'Ho letto il menù *': ('I have read the menu *', 'J\'ai lu le menu *'),
    'Apri il menù e scorrilo fino in fondo per abilitare la casella.': ('Open the menu and scroll to the end to enable the box.', 'Ouvrez le menu et faites-le défiler jusqu\'au bout pour activer la case.'),
    'Continua': ('Continue', 'Continuer'),
    'Ultimo passo: la carta a garanzia': ('Last step: the guarantee card', 'Dernière étape : la carte en garantie'),
    'Nessun addebito immediato.': ('No immediate charge.', 'Aucun débit immédiat.'),
    'La carta viene solo registrata in modo sicuro.': ('The card is only registered securely.', 'La carte est seulement enregistrée de façon sécurisée.'),
    'Disdetta o modifica gratuita': ('Free cancellation or change', 'Annulation ou modification gratuite'),
    '24 ore': ('24 hours', '24 heures'),
    'Per questa prenotazione non chiediamo la carta di credito: la sua richiesta sarà confermata a mano dal ristorante, che la ricontatterà a breve.': (
        'For this booking we do not ask for a credit card: your request will be confirmed by the restaurant, which will contact you shortly.',
        'Pour cette réservation, nous ne demandons pas de carte de crédit : votre demande sera confirmée par le restaurant, qui vous recontactera sous peu.'),
    'Registra la carta e conferma': ('Save the card and confirm', 'Enregistrer la carte et confirmer'),
    "Lista d'attesa": ('Waiting list', 'Liste d\'attente'),
    'Ti chiamiamo noi se si libera un tavolo': ('We will call you if a table becomes free', 'Nous vous appelons si une table se libère'),
    "Se qualcuno disdice, ti telefoniamo al numero che ci lasci, in ordine di iscrizione. Non è ancora una prenotazione.": (
        'If someone cancels, we will call the number you leave us, in order of registration. This is not yet a booking.',
        'Si quelqu\'un annule, nous vous appelons au numéro que vous nous laissez, dans l\'ordre d\'inscription. Ce n\'est pas encore une réservation.'),
    'Giorno *': ('Day *', 'Jour *'), 'Servizio *': ('Service *', 'Service *'), 'Cena': ('Dinner', 'Dîner'), 'Pranzo': ('Lunch', 'Déjeuner'),
    'Persone *': ('Guests *', 'Personnes *'), 'Orario preferito': ('Preferred time', 'Horaire préféré'), 'Qualsiasi': ('Any time', 'Peu importe'),
    'Email (facoltativa)': ('Email (optional)', 'E-mail (facultatif)'), 'Note (facoltative)': ('Notes (optional)', 'Notes (facultatif)'),
    "Es. allergie, occasione, flessibilità sull'orario": ('E.g. allergies, occasion, flexibility on the time', 'Ex. allergies, occasion, flexibilité sur l\'horaire'),
    'Mettimi in lista': ('Put me on the list', 'M\'inscrire sur la liste'),
    "Sei in lista d'attesa": ('You are on the waiting list', 'Vous êtes sur la liste d\'attente'),
    'Torna al sito': ('Back to the website', 'Retour au site'),
    'Richiesta ricevuta': ('Request received', 'Demande reçue'),
    'Grazie! Abbiamo ricevuto la sua richiesta di prenotazione e le abbiamo inviato una mail di conferma. La contatteremo a breve per la conferma definitiva.': (
        'Thank you! We have received your booking request and sent you a confirmation email. We will contact you shortly for the final confirmation.',
        'Merci ! Nous avons bien reçu votre demande de réservation et vous avons envoyé un e-mail de confirmation. Nous vous contacterons sous peu pour la confirmation définitive.'),
    'Menù': ('Menu', 'Menu'), 'Menù Santamonica': ('Santamonica menu', 'Menu Santamonica'),
    'Scorri fino in fondo al menù': ('Scroll to the end of the menu', 'Faites défiler le menu jusqu\'au bout'),
    'Lungomare Lombardo 27 · Genova ·': ('Lungomare Lombardo 27 · Genoa ·', 'Lungomare Lombardo 27 · Gênes ·'),
    'Privacy': ('Privacy', 'Confidentialité'),
}

# ── Elementi con markup misto: selettore CSS -> (innerHTML EN, innerHTML FR) ─────────────────
# Gli id interni (es. step5-ore-disdetta) devono restare: il JS li aggiorna.
HTML_BY_SELECTOR = {
    'book': {
        '#step5-rules .rule:nth-child(2) span:last-child': (
            '<b>Free cancellation or change</b> up to <b id="step5-ore-disdetta">24 hours</b> before the booking time.',
            '<b>Annulation ou modification gratuite</b> jusqu\'à <b id="step5-ore-disdetta">24 heures</b> avant l\'heure de la réservation.'),
        '#step5-rules .rule:nth-child(3) span:last-child': (
            'After that deadline, in case of a <b>no-show</b> or a <b>reduction in the number of guests</b>, a penalty of <b id="step5-penale">€25 per person</b> will be charged.',
            'Passé ce délai, en cas de <b>non-présentation</b> ou de <b>réduction du nombre de couverts</b>, une pénalité de <b id="step5-penale">25&nbsp;€ par personne</b> sera facturée.'),
        '#step5-rules .rule:nth-child(4) span:last-child': (
            'The card details are <b>encrypted and not visible</b> to the restaurant: registration takes place on the secure Stripe page.',
            'Les données de la carte sont <b>chiffrées et non visibles</b> par le restaurant : l\'enregistrement se fait sur la page sécurisée de Stripe.'),
        '#wl-form > p.hint': (
            'For more than 6 guests please call us on +39 010 5533155. Your details are used only to contact you about this request and are deleted within 30 days of the date — <a href="/privacy.html" style="color:inherit;">privacy</a>.',
            'Pour plus de 6 personnes, appelez-nous au +39 010 5533155. Vos données servent uniquement à vous recontacter pour cette demande et sont supprimées dans les 30 jours suivant la date — <a href="/privacy.html" style="color:inherit;">confidentialité</a>.'),
    },
}
