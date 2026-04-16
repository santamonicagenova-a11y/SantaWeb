// Core functions per menu-admin Santamonica
// v 2026.04.16.01


var TRANSLATIONS = {"en": {"lang": "en", "lang_label": "English", "title": "Menu — Santamonica", "degu_titolo": "Tasting Menu", "degu_portate_label": "courses", "degu_vini_label": "wine pairing", "degu_nota": "Price per person, menu to be shared by the whole table.", "degu_intero_tavolo": "the whole table", "percorso_7": "Chef's free interpretation menu", "note_carta_1": "To maintain consistent quality and organoleptic characteristics of raw ingredients, fresh fish products are blast-frozen after purchase. These products are marked with the symbol * for clear and transparent customer information.", "note_carta_2": "The list of allergens is available on the last page of this menu.", "note_ospite_titolo": "Guest notes", "note_orario": "To maintain consistent quality standards and organoleptic characteristics, fresh fish products are blast-frozen. These products are marked with the symbol: *", "orario_titolo": "OPENING HOURS:", "titolo_degustazione": "Tasting Menu", "sezioni": {"Crudi": "Raw", "Sfiziosi": "Starters", "Amidi e Carboidrati": "Pasta & Grains", "Non Solo Mare": "Not Only Sea"}, "unita": {"cad.": "ea."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Skate wing, local broad beans, green apple, almonds", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wild boar tortelli, sea bream dashi, spring onion, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, citrus kosho, borlotti beans", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Line-caught local meagre, sea purslane, Belgian endive", "Gelato al limone nero, levistico, lime, cracker di latte": "Black lemon ice cream, lovage, lime, milk cracker", "Ostriche Fine de Claire": "Fine de Claire Oysters", "Ostriche Antilope": "Antilope Oysters", "Ostriche Enrico IV": "Enrico IV Oysters", "Scampi nostrani": "Local langoustines", "Gamberi viola nostrani": "Local purple prawns", "Selezione solamente di pesci nostrani pescati ad amo": "Selection of local line-caught fish only", "Degustazione di mare": "Sea tasting", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Local squid, fresh peas, light bagna cauda, kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Cabbage, miso, raspberries, cashews", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock reduction", "“Non formaggi”": "“Not cheese”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Tasting of artisan fake cheeses made with cashews and almond milk)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Square spaghettoni “<em>Mancini</em>”, sea anemones, nduja, marjoram", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, our fermented citrus kosho, borlotti beans", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Rice “<em>Riserva San Massimo</em>”, hare ragù, turnip tops, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Local octopus, rhubarb, peas", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinated courgette, mint, yogurt, Timut pepper", "Picanha, cardoncelli, fondo di manzo": "Picanha, king oyster mushrooms, beef jus", "Gambero viola crudo": "Raw purple prawn", "Agnello": "Lamb"}, "orario": {"Martedì": "Tuesday", "Dal mercoledì al sabato": "Wednesday to Saturday", "Domenica": "Sunday"}, "links": ["<u>Italian Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "fr": {"lang": "fr", "lang_label": "Français", "title": "Menu — Santamonica", "degu_titolo": "Menu Dégustation", "degu_portate_label": "plats", "degu_vini_label": "accord mets-vins", "degu_nota": "Prix par personne, menu à partager par toute la table.", "degu_intero_tavolo": "toute la table", "percorso_7": "Menu carte blanche du Chef", "note_carta_1": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques des matières premières, les produits de la mer achetés frais sont surgelés à basse température. Ces produits sont signalés par le symbole * pour une information claire et transparente à la clientèle.", "note_carta_2": "La liste des allergènes est consultable à la dernière page de ce menu.", "note_ospite_titolo": "Note pour nos hôtes", "note_orario": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques, les produits frais sont surgelés à basse température. Ces produits sont signalés par le symbole : *", "orario_titolo": "HORAIRES D'OUVERTURE :", "titolo_degustazione": "Menu Dégustation", "sezioni": {"Crudi": "Crus", "Sfiziosi": "Entrées", "Amidi e Carboidrati": "Pâtes & Céréales", "Non Solo Mare": "Pas Seulement la Mer"}, "unita": {"cad.": "p."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aile de raie, fèves locales, pomme verte, amandes", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Ris de veau, céleri-rave, noisettes, fond de poisson", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de sanglier, dashi de dorade, ciboule, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, morue, kosho d’agrumes, haricots borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Ombrine locale à la ligne, salicorne, endive belge", "Gelato al limone nero, levistico, lime, cracker di latte": "Glace au citron noir, livèche, citron vert, cracker au lait", "Ostriche Fine de Claire": "Huîtres Fine de Claire", "Ostriche Antilope": "Huîtres Antilope", "Ostriche Enrico IV": "Huîtres Enrico IV", "Scampi nostrani": "Langoustines locales", "Gamberi viola nostrani": "Crevettes violettes locales", "Selezione solamente di pesci nostrani pescati ad amo": "Sélection exclusivement de poissons locaux pêchés à la ligne", "Degustazione di mare": "Dégustation de la mer", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, petits pois frais, bagna cauda légère, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Chou pommé, miso, framboises, noix de cajou", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Ris de veau, céleri-rave, noisettes, réduction de fond de poisson", "“Non formaggi”": "“Non-fromages”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Dégustation de faux fromages artisanaux à base de noix de cajou et lait d’amande)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni carrés “<em>Mancini</em>”, anémones de mer, nduja, marjolaine", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, morue, notre kosho d’agrumes fermenté, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Riz “<em>Riserva San Massimo</em>”, ragû de lièvre, fanes de navet, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Poulpe local, rhubarbe, petits pois", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Courgette en escabèche, menthe, yaourt, poivre Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, pleurotes du panicaut, jus de bœuf", "Gambero viola crudo": "Crevette violette crue", "Agnello": "Agneau"}, "orario": {"Martedì": "Mardi", "Dal mercoledì al sabato": "Du mercredi au samedi", "Domenica": "Dimanche"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "de": {"lang": "de", "lang_label": "Deutsch", "title": "Speisekarte — Santamonica", "degu_titolo": "Degustationsmenü", "degu_portate_label": "Gänge", "degu_vini_label": "Weinbegleitung", "degu_nota": "Preis pro Person, Menü für den gesamten Tisch.", "degu_intero_tavolo": "den gesamten Tisch", "percorso_7": "Menü nach freier Wahl des Küchenchefs", "note_carta_1": "Um die Qualität und die organoleptischen Eigenschaften der Rohstoffe konstant zu halten, werden frisch eingekaufte Fischprodukte schockgefrostet. Diese Produkte sind mit dem Symbol * gekennzeichnet.", "note_carta_2": "Die Liste der Allergene finden Sie auf der letzten Seite dieser Speisekarte.", "note_ospite_titolo": "Hinweis für unsere Gäste", "note_orario": "Um die Qualität konstant zu halten, werden frische Fischprodukte schockgefrostet und mit dem Symbol * gekennzeichnet.", "orario_titolo": "ÖFFNUNGSZEITEN:", "titolo_degustazione": "Degustationsmenü", "sezioni": {"Crudi": "Rohkost", "Sfiziosi": "Vorspeisen", "Amidi e Carboidrati": "Pasta & Getreide", "Non Solo Mare": "Nicht Nur Meer"}, "unita": {"cad.": "Stk."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Rochenflügel, heimische Saubohnen, grüner Apfel, Mandeln", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfond", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wildschweintortelli, Goldbrassen-Dashi, Frühlingszwiebel, Shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, Zitruskosho, Borlottibohnen", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Lokal geangelter Umberfisch, Queller, Chicorée", "Gelato al limone nero, levistico, lime, cracker di latte": "Schwarzzitronen-Eis, Liebstöckel, Limette, Milchcracker", "Ostriche Fine de Claire": "Fine de Claire Austern", "Ostriche Antilope": "Antilope Austern", "Ostriche Enrico IV": "Enrico IV Austern", "Scampi nostrani": "Heimische Scampi", "Gamberi viola nostrani": "Heimische Violettgarnelen", "Selezione solamente di pesci nostrani pescati ad amo": "Auswahl ausschließlich heimischer Angelfische", "Degustazione di mare": "Meeresverkostung", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Heimischer Tintenfisch, frische Erbsen, leichte Bagna Cauda, Kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Weißkohl, Miso, Himbeeren, Cashewnüsse", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfondreduktion", "“Non formaggi”": "“Kein Käse”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Verkostung handwerklicher Pseudokäse auf Cashew- und Mandelmilchbasis)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Quadratische Spaghettoni “<em>Mancini</em>”, Seeanemonen, Nduja, Majoran", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, unser fermentiertes Zitruskosho, Borlottibohnen", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Reis “<em>Riserva San Massimo</em>”, Hasenragù, Steckrübenblätter, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Heimischer Oktopus, Rhabarber, Erbsen", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinierte Zucchini, Minze, Joghurt, Timutpfeffer", "Picanha, cardoncelli, fondo di manzo": "Picanha, Königskräuterseitlinge, Rinderjus", "Gambero viola crudo": "Rohe Violettgarnele", "Agnello": "Lamm"}, "orario": {"Martedì": "Dienstag", "Dal mercoledì al sabato": "Mittwoch bis Samstag", "Domenica": "Sonntag"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Carta en Español</u>"]}, "es": {"lang": "es", "lang_label": "Español", "title": "Carta — Santamonica", "degu_titolo": "Menú Degustación", "degu_portate_label": "platos", "degu_vini_label": "maridaje de vinos", "degu_nota": "Precio por persona, menú para toda la mesa.", "degu_intero_tavolo": "toda la mesa", "percorso_7": "Menú a libre elección del Chef", "note_carta_1": "Para mantener constantes el nivel cualitativo y las características organolépticas de las materias primas, los productos de pescado comprados frescos se someten a ultracongelación. Estos productos se señalan con el símbolo * para una información clara y transparente.", "note_carta_2": "La lista de alérgenos se puede consultar en la última página de esta carta.", "note_ospite_titolo": "Nota para nuestros huéspedes", "note_orario": "Para mantener constantes el nivel cualitativo y las características organolépticas, los productos frescos se ultracongelan y se señalan con el símbolo: *", "orario_titolo": "HORARIO DE SERVICIO:", "titolo_degustazione": "Menú Degustación", "sezioni": {"Crudi": "Crudos", "Sfiziosi": "Entrantes", "Amidi e Carboidrati": "Pastas & Cereales", "Non Solo Mare": "No Solo Mar"}, "unita": {"cad.": "ud."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aleta de raya, habas locales, manzana verde, almendras", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, fondo de pescado", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de jabalí, dashi de dorada, cebolleta, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, kosho de cítricos, alubias borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Corvina local de anzuelo, salicornia, endibia belga", "Gelato al limone nero, levistico, lime, cracker di latte": "Helado de limón negro, levístico, lima, cracker de leche", "Ostriche Fine de Claire": "Ostras Fine de Claire", "Ostriche Antilope": "Ostras Antilope", "Ostriche Enrico IV": "Ostras Enrico IV", "Scampi nostrani": "Cigalas locales", "Gamberi viola nostrani": "Gambas violetas locales", "Selezione solamente di pesci nostrani pescati ad amo": "Selección exclusivamente de pescados locales de anzuelo", "Degustazione di mare": "Degustación del mar", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, guisantes frescos, bagna cauda ligera, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Col repollo, miso, frambuesas, anacardos", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, reducción de fondo de pescado", "“Non formaggi”": "“No quesos”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Degustación de falsos quesos artesanales a base de anacardos y leche de almendra)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni cuadrados “<em>Mancini</em>”, anémonas de mar, nduja, mejorana", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, nuestro kosho de cítricos fermentado, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Arroz “<em>Riserva San Massimo</em>”, ragú de liebre, grelos, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Pulpo local, ruibarbo, guisantes", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Calabacín en escabeche, menta, yogur, pimienta Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, setas cardoncelli, jugo de ternera", "Gambero viola crudo": "Gamba violeta cruda", "Agnello": "Cordero"}, "orario": {"Martedì": "Martes", "Dal mercoledì al sabato": "De miércoles a sábado", "Domenica": "Domingo"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>"]}};
function costruisciHtmlTradotto(lang, t) {
  var menuForm = leggi();
  var m = costruisciMenuTradotto(menuForm, t);

  // Template senza ctrl-bar (backtick sostituiti con placeholder per embedding sicuro)
  var PH = "\u0000BT\u0000";
  var re = new RegExp(PH.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  var TPL_B = "<!DOCTYPE html>\n<html lang=\"it\">\n<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\" />\n  <meta http-equiv=\"Pragma\" content=\"no-cache\" />\n  <meta http-equiv=\"Expires\" content=\"0\" />\n  <title>Men\u00f9 \u2014 Santamonica<\/title>\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\" />\n  <link href=\"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap\" rel=\"stylesheet\" />\n\n  <style>\n    :root {\n      --cream: #faf7f2;\n      --ink:   #1a1714;\n      --stone: #8c7e6e;\n      --rust:  #9e4a2a;\n      --rule:  #d4c9b8;\n    }\n\n    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }\n\n    body {\n      background: var(--cream);\n      color: var(--ink);\n      font-family: 'Cormorant Garamond', Georgia, serif;\n      font-weight: 400;\n    }\n\n    /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n       BARRA CONTROLLI\n    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n    .ctrl-bar {\n      text-align: center;\n      padding: .9rem 1rem;\n      position: sticky;\n      top: 0;\n      z-index: 10;\n      background: var(--cream);\n      border-bottom: 1px solid var(--rule);\n      display: flex;\n      gap: .7rem;\n      justify-content: center;\n      align-items: center;\n      flex-wrap: wrap;\n    }\n\n    .ctrl-btn {\n      padding: .4rem 1.3rem;\n      background: transparent;\n      border: 1px solid var(--ink);\n      font-family: 'Jost', sans-serif;\n      font-size: .68rem;\n      letter-spacing: .16em;\n      text-transform: uppercase;\n      cursor: pointer;\n      color: var(--ink);\n      transition: background .2s, color .2s;\n    }\n    .ctrl-btn:hover, .ctrl-btn.active {\n      background: var(--ink);\n      color: var(--cream);\n    }\n    .ctrl-sep {\n      width: 1px;\n      height: 1.4rem;\n      background: var(--rule);\n    }\n\n    /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n       PAGINA  (shared)\n    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n    .pg {\n      width: 210mm;\n      min-height: 297mm;\n      margin: 2rem auto;\n      padding: 18mm 24mm 16mm;\n      background: #fff;\n      box-shadow: 0 2px 24px rgba(0,0,0,.10);\n      display: flex;\n      flex-direction: column;\n    }\n\n    /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n       LAYOUT: MEN\u00d9 ALLA CARTA\n    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n    #layout-carta { display: block; }\n    #layout-orario { display: none; }\n\n    /* \u2500\u2500 intestazione \u2500\u2500 */\n    .pg-header {\n      text-align: center;\n      margin-bottom: 9mm;\n      padding-bottom: 5mm;\n      border-bottom: 1px solid var(--rule);\n    }\n    .logo {\n      font-size: 2.5rem;\n      font-weight: 300;\n      letter-spacing: .22em;\n      text-transform: uppercase;\n      line-height: 1;\n    }\n    .logo em { font-style: italic; color: var(--stone); }\n    .logo-sub {\n      margin-top: .45rem;\n      font-family: 'Jost', sans-serif;\n      font-size: .67rem;\n      letter-spacing: .22em;\n      text-transform: uppercase;\n      color: var(--stone);\n    }\n\n    /* \u2500\u2500 degustazione \u2500\u2500 */\n    .degu {\n      text-align: center;\n      flex: 1;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n      padding: 4mm 0;\n    }\n    .degu-titolo {\n      font-size: 1.4rem;\n      font-weight: 600;\n      letter-spacing: .16em;\n      text-transform: uppercase;\n      margin-bottom: 5mm;\n    }\n    .degu-prezzi {\n      font-style: italic;\n      font-size: .98rem;\n      line-height: 1.4;\n      margin-bottom: 2mm;\n    }\n    .degu-nota {\n      font-style: italic;\n      font-size: .98rem;\n      color: var(--ink);\n      margin-bottom: 14mm;\n    }\n    .degu-nota strong {\n      font-style: normal;\n      font-weight: 400;\n      text-decoration: underline;\n      text-underline-offset: 2px;\n      color: var(--ink);\n    }\n    .percorso { margin-bottom: 12mm; }\n    .percorso-label {\n      font-style: italic;\n      font-weight: 700;\n      font-size: 1.25rem;\n      margin-bottom: 3mm;\n    }\n    .percorso-piatto { font-size: .96rem; line-height: 1.95; font-style: normal; }\n    .percorso-piatto em { font-style: normal; }\n    .percorso-libero { font-size: .96rem; line-height: 1.95; font-style: normal; }\n\n    /* \u2500\u2500 sezioni carta \u2500\u2500 */\n    .pg-content {\n      flex: 1;\n      display: flex;\n      flex-direction: column;\n      justify-content: center;\n    }\n    .sezione { margin-bottom: 14mm; }\n    .sezione-titolo {\n      font-family: 'Cormorant Garamond', serif;\n      font-style: normal;\n      font-size: 1.5rem;\n      font-weight: 600;\n      letter-spacing: .14em;\n      text-transform: uppercase;\n      text-align: center;\n      margin-bottom: 5mm;\n      padding-bottom: 2mm;\n      border-bottom: 1px solid var(--rule);\n    }\n\n    /* \u2500\u2500 piatti carta \u2500\u2500 */\n    .piatto {\n      text-align: center;\n      padding: .5mm 0;\n      font-size: .96rem;\n      line-height: 1.4;\n    }\n    .piatto-prezzo {\n      font-size: .8rem;\n      color: var(--stone);\n      margin-left: .3rem;\n    }\n    .piatto-unita {\n      font-size: .76rem;\n      color: var(--stone);\n      margin-left: .1rem;\n    }\n    .piatto-desc {\n      font-style: italic;\n      font-size: .82rem;\n      color: var(--stone);\n      display: block;\n    }\n    .piatto-staccato { margin-top: 3.5mm; }\n\n    .eco::after {\n      content: ' *';\n      color: var(--rust);\n      font-size: .76em;\n    }\n\n    /* \u2500\u2500 note ospite carta \u2500\u2500 */\n    .note-ospite {\n      margin-top: auto;\n      font-style: italic;\n      font-size: .73rem;\n      color: var(--stone);\n      text-align: center;\n      line-height: 1.65;\n      padding-top: 5mm;\n      border-top: 1px solid var(--rule);\n    }\n    .note-ospite-titolo {\n      text-decoration: underline;\n      display: block;\n      margin-bottom: 1.2mm;\n    }\n    .note-ospite u { text-decoration: underline; }\n\n    /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n       LAYOUT: FOGLIO ORARIO (1 pagina, 2 col)\n    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n    .pg-orario {\n      padding: 6mm 8mm 8mm;\n    }\n\n    .orario-logo {\n      font-family: 'Cormorant Garamond', serif;\n      font-size: 3.8rem;\n      font-style: italic;\n      font-weight: 300;\n      letter-spacing: .08em;\n      text-align: center;\n      margin-bottom: 5mm;\n      line-height: 1;\n    }\n\n    .orario-grid {\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      gap: 0;\n      border: 1.5px solid var(--ink);\n      flex: 1;\n    }\n\n    .orario-col {\n      padding: 6mm 8mm;\n      display: flex;\n      flex-direction: column;\n      gap: 6mm;\n    }\n\n    .orario-col:first-child {\n      border-right: 1.5px solid var(--ink);\n    }\n\n    /* separatore tratteggiato interno (dopo ostriche) */\n    .orario-sep {\n      border: none;\n      border-top: 1px dashed var(--stone);\n      margin: 1mm 0;\n    }\n\n    .orario-sez { text-align: center; }\n\n    .orario-sez-titolo {\n      font-size: 1.5rem;\n      font-weight: 700;\n      letter-spacing: .12em;\n      text-transform: uppercase;\n      margin-bottom: 3mm;\n    }\n\n    .orario-piatto {\n      font-size: 1.2rem;\n      line-height: 1.35;\n      text-align: center;\n      margin-bottom: .55rem;\n    }\n    .orario-piatto:last-child { margin-bottom: 0; }\n\n    .orario-piatto .eco::after {\n      content: ' *';\n      color: var(--rust);\n      font-size: .76em;\n    }\n\n    /* \u2500\u2500 sezione orario in basso \u2500\u2500 */\n    .orario-footer-col {\n      display: flex;\n      flex-direction: column;\n      gap: 4mm;\n    }\n\n    .orario-links {\n      font-family: 'Cormorant Garamond', serif;\n      font-style: normal;\n      font-weight: 700;\n      font-size: 1.1rem;\n      letter-spacing: .12em;\n      text-transform: uppercase;\n      line-height: 2.1;\n      text-align: center;\n    }\n    .orario-links u { text-decoration: none; }\n\n    .orario-qr {\n      width: 45mm;\n      height: 45mm;\n      display: block;\n      margin: 0 auto;\n    }\n\n    .orario-servizio {\n      font-style: italic;\n      font-size: 1rem;\n      line-height: 1.85;\n      text-align: center;\n    }\n    .orario-servizio-titolo {\n      text-decoration: underline;\n      font-style: italic;\n      display: block;\n      margin-bottom: 2mm;\n    }\n\n    .orario-nota {\n      font-size: .72rem;\n      color: var(--stone);\n      line-height: 1.6;\n      text-align: center;\n      border-top: 1px solid var(--rule);\n      padding-top: 3mm;\n      margin-top: auto;\n    }\n\n    /* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n       STAMPA\n    \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n    @media print {\n      @page { size: A4 portrait; margin: 0; }\n      body { background: white; }\n      .ctrl-bar { display: none; }\n\n      /* carta: 3 pagine */\n      #layout-carta .pg {\n        width: 210mm;\n        height: 297mm;\n        min-height: unset;\n        margin: 0;\n        padding: 15mm 22mm 14mm;\n        box-shadow: none;\n        page-break-after: always;\n      }\n      #layout-carta .pg:last-child { page-break-after: avoid; }\n\n      /* orario: 1 pagina */\n      #layout-orario .pg {\n        width: 210mm;\n        height: 297mm;\n        min-height: unset;\n        margin: 0;\n        box-shadow: none;\n        page-break-after: avoid;\n      }\n    }\n  <\/style>\n<\/head>\n<body>\n\n\n\n<div id=\"layout-carta\"><\/div>\n<div id=\"layout-orario\"><\/div>\n\n<script>\n/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   MEN\u00d9  \u2014  modifica solo qui per aggiornare tutto\n   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\n".replace(re, "`");
  var TPL_A = "\n/* \u2500\u2500 helpers condivisi \u2500\u2500 */\nconst NOTE_CARTA = \u0000BT\u0000\n  <span class=\"note-ospite-titolo\">Note per l'ospite<\/span>\n  Per mantenere costanti il livello qualitativo e le caratteristiche organolettiche delle materie prime i prodotti ittici\n  acquistati freschi vengono abbattuti e congelati. Tali prodotti vengono contrassegnati con il simbolo * per una\n  chiara e trasparente informazione alla clientela.<br>\n  L'elenco degli <u>allergeni<\/u> \u00e8 consultabile nell'ultima pagina di questo men\u00f9.\n\u0000BT\u0000;\n\nconst NOTE_ORARIO = \u0000BT\u0000Per mantenere costanti il livello qualitativo e le caratteristiche organolettiche\ndelle materie prime i prodotti acquistati freschi vengono abbattuti e congelati.\nQuesti prodotti vengono contrassegnati con il simbolo: *\u0000BT\u0000;\n\nfunction getSez(titolo) {\n  var found = MENU.sezioni.find(s => s.titolo === titolo);\n  if (!found) {\n    // Fallback: cerca per titolo_display o per indice\n    var idx = ['Crudi','Sfiziosi','Amidi e Carboidrati','Non Solo Mare'].indexOf(titolo);\n    if (idx >= 0 && MENU.sezioni[idx]) found = MENU.sezioni[idx];\n  }\n  return found;\n}\n\nfunction buildPiatto(p) {\n  const eco = p.sostenibile ? ' eco' : '';\n  const staccato = p.staccato ? ' piatto-staccato' : '';\n  const unitaHtml = p.unita ? \u0000BT\u0000<span class=\"piatto-unita\">${p.unita}<\/span>\u0000BT\u0000 : '';\n  const prezzoHtml = p.prezzo != null\n    ? \u0000BT\u0000<span class=\"piatto-prezzo\">${p.prezzo}${unitaHtml}<\/span>\u0000BT\u0000 : '';\n  const descHtml = p.descrizione\n    ? \u0000BT\u0000<span class=\"piatto-desc\">${p.descrizione}<\/span>\u0000BT\u0000 : '';\n  return \u0000BT\u0000<div class=\"piatto${staccato}\"><span class=\"piatto-riga${eco}\">${p.nome}<\/span>${prezzoHtml}${descHtml}<\/div>\u0000BT\u0000;\n}\n\nfunction buildSezione(s) {\n  const label = s.titolo_display || s.titolo;\n  return \u0000BT\u0000\n    <div class=\"sezione\">\n      <div class=\"sezione-titolo\">${label}<\/div>\n      ${s.piatti.map(buildPiatto).join('')}\n    <\/div>\u0000BT\u0000;\n}\n\nfunction buildDegu(degu) {\n  const optsHtml = degu.opzioni.map(o =>\n    \u0000BT\u0000${o.portate} portate &nbsp;\u20ac ${o.prezzo}, eventuale abbinamento vini \u20ac ${o.vini}\u0000BT\u0000\n  ).join('<br>');\n\n  let percorsiHtml = '';\n  for (const [n, piatti] of Object.entries(degu.percorsi)) {\n    if (typeof piatti === 'string') {\n      percorsiHtml += \u0000BT\u0000\n        <div class=\"percorso\">\n          <div class=\"percorso-label\">&ldquo;${n}&rdquo;<\/div>\n          <div class=\"percorso-piatto percorso-libero\">${piatti}<\/div>\n        <\/div>\u0000BT\u0000;\n    } else {\n      const righe = piatti.map(p =>\n        \u0000BT\u0000<div class=\"percorso-piatto${p.sostenibile ? ' eco' : ''}\">${p.nome}<\/div>\u0000BT\u0000\n      ).join('');\n      percorsiHtml += \u0000BT\u0000\n        <div class=\"percorso\">\n          <div class=\"percorso-label\">&ldquo;${n}&rdquo;<\/div>\n          ${righe}\n        <\/div>\u0000BT\u0000;\n    }\n  }\n\n  return \u0000BT\u0000\n    <div class=\"degu\">\n      <div class=\"degu-titolo\">Men&ugrave;&rsquo; Degustazione<\/div>\n      <div class=\"degu-prezzi\">${optsHtml}<\/div>\n      <div class=\"degu-nota\">${degu.nota.replace(\"l'intero tavolo\", \"<strong>l\\u2019intero tavolo<\/strong>\")}<\/div>\n      ${percorsiHtml}\n    <\/div>\u0000BT\u0000;\n}\n\n/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   RENDER: MEN\u00d9 ALLA CARTA\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\nfunction renderCarta() {\n  const root = document.getElementById('layout-carta');\n  root.innerHTML = '';\n\n  // Pag 1: intestazione + degustazione\n  const pag1 = document.createElement('div');\n  pag1.className = 'pg';\n  pag1.innerHTML = \u0000BT\u0000\n    ${buildDegu(MENU.degustazione)}\n    <div class=\"note-ospite\">${NOTE_CARTA}<\/div>\n  \u0000BT\u0000;\n  root.appendChild(pag1);\n\n  // Pag 2 e 3: sezioni\n  MENU.pagine.forEach(pg => {\n    const div = document.createElement('div');\n    div.className = 'pg';\n    div.innerHTML = \u0000BT\u0000\n      <div class=\"pg-content\">\n        ${pg.sezioni.map(t => buildSezione(getSez(t))).join('')}\n      <\/div>\n      <div class=\"note-ospite\">${NOTE_CARTA}<\/div>\n    \u0000BT\u0000;\n    root.appendChild(div);\n  });\n}\n\n/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   RENDER: FOGLIO ORARIO\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\nfunction buildOrarioColonna(titoli, sepDopo) {\n  return titoli.map(titolo => {\n    const s = getSez(titolo);\n    const piatti = s.piatti.map(p => {\n      const eco = p.sostenibile ? ' eco' : '';\n      const unitaHtml = p.unita ? \u0000BT\u0000 ${p.unita}\u0000BT\u0000 : '';\n      const prezzoHtml = p.prezzo != null ? \u0000BT\u0000 \u20ac ${p.prezzo}${unitaHtml}\u0000BT\u0000 : '';\n      return \u0000BT\u0000<div class=\"orario-piatto\"><span class=\"${'piatto-riga' + eco}\">${p.nome}${prezzoHtml}<\/span><\/div>\u0000BT\u0000;\n    }).join('');\n\n    const sep = (titolo === sepDopo) ? '<hr class=\"orario-sep\">' : '';\n    // ogni sezione in uno slot flex:1 centrato verticalmente\n    return \u0000BT\u0000\n      <div style=\"flex:1;display:flex;flex-direction:column;justify-content:center;\">\n        <div class=\"orario-sez\">\n          <div class=\"orario-sez-titolo\">${s.titolo_display || s.titolo}<\/div>\n          ${piatti}\n        <\/div>\n      <\/div>${sep}\u0000BT\u0000;\n  }).join('');\n}\n\nfunction renderOrario() {\n  const root = document.getElementById('layout-orario');\n  root.innerHTML = '';\n  const cfg = MENU.orario;\n\n  const orarioHtml = cfg.orarioServizio.map(o =>\n    \u0000BT\u0000<div><em>${o.giorno}<\/em><\/div>\u0000BT\u0000 + o.fasce.map(f => \u0000BT\u0000<div>${f}<\/div>\u0000BT\u0000).join('')\n  ).join('');\n\n  const pg = document.createElement('div');\n  pg.className = 'pg pg-orario';\n  pg.innerHTML = \u0000BT\u0000\n    <div class=\"orario-logo\">Santamonica<\/div>\n    <div class=\"orario-grid\" style=\"flex:1\">\n\n      <!-- colonna sinistra -->\n      <div class=\"orario-col\">\n        ${buildOrarioColonna(cfg.colSinistra, cfg.separatoreDopo)}\n\n        <!-- footer sinistra: link + QR -->\n        <div class=\"orario-footer-col\">\n          <hr style=\"border:none;border-top:1px solid var(--ink);margin:2mm 0\">\n          <div class=\"orario-links\">\n            English Menu<br>\n            Carte en Fran\u00e7aise\n          <\/div>\n          <img src=\"data:image/png;base64,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\" alt=\"QR code\" style=\"width:45mm;height:45mm;display:block;margin:0 auto;\" />\n        <\/div>\n      <\/div>\n\n      <!-- colonna destra -->\n      <div class=\"orario-col\">\n        ${buildOrarioColonna(cfg.colDestra, \"Amidi e Carboidrati\")}\n\n        <!-- footer destra: orario + nota -->\n        <div class=\"orario-footer-col\">\n          <hr style=\"border:none;border-top:1px solid var(--ink);margin:2mm 0\">\n          <div class=\"orario-servizio\">\n            <span class=\"orario-servizio-titolo\"><em>ORARIO DI SERVIZIO:<\/em><\/span>\n            ${orarioHtml}\n          <\/div>\n          <div class=\"orario-nota\">${NOTE_ORARIO}<\/div>\n        <\/div>\n      <\/div>\n\n    <\/div>\n  \u0000BT\u0000;\n  root.appendChild(pg);\n}\n\n/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n   SWITCH LAYOUT\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */\nfunction showLayout(which) {\n  document.getElementById('layout-carta').style.display  = which === 'carta'  ? 'block' : 'none';\n  document.getElementById('layout-orario').style.display = which === 'orario' ? 'block' : 'none';\n  var bc=document.getElementById('btn-carta'); if(bc) bc.classList.toggle('active',which==='carta');\n  var bo=document.getElementById('btn-orario'); if(bo) bo.classList.toggle('active',which==='orario');\n}\n\n/* \u2500\u2500 init \u2500\u2500 */\nrenderCarta();\nrenderOrario();\nshowLayout('carta');\n<\/script>\n<\/body>\n<\/html>\n".replace(re, "`");

  var SEP = '/* ' + '\u2550'.repeat(57) + ' */\n';
  var newBlock = 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + SEP;
  var html = TPL_B + newBlock + TPL_A;

  html = html.replace('return MENU.sezioni.find(s => s.titolo === titolo);',
    'var f=MENU.sezioni.find(s=>s.titolo===titolo); if(!f){var ix=["Crudi","Sfiziosi","Amidi e Carboidrati","Non Solo Mare"].indexOf(titolo); if(ix>=0&&MENU.sezioni[ix]) f=MENU.sezioni[ix];} return f;');
  html = html.replace('<html lang="it">', '<html lang="' + lang + '">');
  html = html.replace(/<title>[^<]*<\/title>/, '<title>' + t.title + '</title>');
  html = html.replace(/Note per l'ospite<\/span>[^`]*`/,
    t.note_ospite_titolo + '</span>\n  ' + t.note_carta_1 + '<br>\n  ' + t.note_carta_2 + '\n`');
  html = html.replace(/Per mantenere costanti[\s\S]*?simbolo: \*`/,
    t.note_orario + '`');
  html = html.replace('Men\u00f9\u2019 Degustazione', t.titolo_degustazione);
  html = html.replace('Men&ugrave;&rsquo; Degustazione', t.titolo_degustazione);
  html = html.replace(/\${o\.portate} portate/g, '${o.portate} ' + t.degu_portate_label);
  html = html.replace(/eventuale abbinamento vini/g, t.degu_vini_label);
  html = html.replace('ORARIO DI SERVIZIO:', t.orario_titolo);
  html = html.replace(
    /<u><em>English Menu<\/em><\/u><br>\s*<u><em>Carte en Fran[^<]*<\/em><\/u>/,
    t.links.join('<br>\n            ')
  );
  return html;
}


var tplBefore = '', tplAfter = '', dati = null, datiOriginali = null;

function carica(input) {
  var f = input.files[0];
  if (!f) return;
  var r = new FileReader();
  r.onload = function(e) {
    try { analizza(e.target.result); }
    catch(ex) { document.getElementById('err').textContent = 'Errore: ' + ex.message; }
  };
  r.readAsText(f, 'utf-8');
}

function analizza(src) {
  var START = 'const MENU = {';
  var END   = '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */';
  var i1 = src.indexOf(START);
  if (i1 < 0) throw new Error('Blocco MENU non trovato — hai caricato il file giusto?');
  var i2 = src.indexOf(END, i1);
  if (i2 < 0) throw new Error('Fine blocco MENU non trovata.');
  var i2end = src.indexOf('\n', i2) + 1;

  var js = src.slice(i1, i2).trim(); // "const MENU = { ... };"
  dati = Function('"use strict";' + js + ';return MENU;')();
  datiOriginali = JSON.parse(JSON.stringify(dati)); // copia immutabile

  tplBefore = src.slice(0, i1);
  tplAfter  = src.slice(i2end);


  document.getElementById('intro').style.display = 'none';
  document.getElementById('wrap').classList.add('on');
  costruisci();
  
}

function el(tag, cls, txt) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt !== undefined) e.textContent = txt;
  return e;
}
function inp(type, id, val, ph) {
  var e = document.createElement('input');
  e.type = type; e.id = id;
  if (val !== undefined && val !== null) e.value = val;
  if (ph) e.placeholder = ph;
  return e;
}
function chk(id, v) {
  var e = document.createElement('input');
  e.type = 'checkbox'; e.id = id; e.checked = !!v;
  e.style.cssText = 'display:block;margin:auto';
  return e;
}

function costruisci() {
  var wrap = document.getElementById('wrap');
  wrap.innerHTML = '';
  var m = dati;

  /* --- DEGUSTAZIONE --- */
  if (m.degustazione) {
  var fsd = el('div','fs');
  fsd.appendChild(el('div','fs-head','Menù Degustazione'));
  var bd = el('div','fs-body');

  bd.appendChild(el('div','sub','Opzioni prezzo'));
  m.degustazione.opzioni.forEach(function(o, i) {
    var row = el('div','opt-row');
    var c1 = el('div'); c1.appendChild(el('span','opt-lbl','Portate')); c1.appendChild(inp('number','op-portate-'+i, o.portate)); row.appendChild(c1);
    var c2 = el('div'); c2.appendChild(el('span','opt-lbl','Prezzo €')); c2.appendChild(inp('number','op-prezzo-'+i, o.prezzo)); row.appendChild(c2);
    var c3 = el('div'); c3.appendChild(el('span','opt-lbl','Vini €')); c3.appendChild(inp('number','op-vini-'+i, o.vini)); row.appendChild(c3);
    bd.appendChild(row);
  });

  var s6 = el('div','sub'); s6.innerHTML = 'Percorso \u201c6\u201d \u00a0<span style="color:var(--rust);font-size:.6rem">\u2611 = sostenibile *</span>';
  bd.appendChild(s6);
  var h6 = el('div'); h6.style.cssText = 'display:grid;grid-template-columns:1fr 30px;gap:.4rem;padding:.3rem 0;border-bottom:1px solid var(--rule);margin-bottom:.3rem';
  h6.appendChild(el('div','col-lbl','Nome piatto')); h6.appendChild(el('div','col-lbl','*'));
  bd.appendChild(h6);
  m.degustazione.percorsi['6'].forEach(function(p, i) {
    var row = el('div','degu-row');
    row.appendChild(inp('text','d6p-'+i, p.nome));
    row.appendChild(chk('d6s-'+i, p.sostenibile));
    bd.appendChild(row);
  });

  bd.appendChild(el('div','sub','Percorso \u201c7\u201d'));
  var i7 = inp('text','degu7', m.degustazione.percorsi['7']);
  i7.style.width = '100%'; bd.appendChild(i7);

  fsd.appendChild(bd); wrap.appendChild(fsd);

  } // fine degustazione

  /* --- SEZIONI --- */
  m.sezioni.forEach(function(sez, si) {
    var fs = el('div','fs');
    // Header con titolo editabile
    var head = el('div','fs-head', sez.titolo);
    fs.appendChild(head);
    var body = el('div','fs-body');

    var hdr = el('div','grid-hdr');
    ['Nome piatto','Prezzo €','Unità','Descrizione','*'].forEach(function(t){ hdr.appendChild(el('div','col-lbl',t)); });
    body.appendChild(hdr);

    sez.piatti.forEach(function(p, pi) {
      var row = el('div','grid-row');
      row.appendChild(inp('text',   's'+si+'p'+pi+'-nome',   p.nome));
      row.appendChild(inp('number', 's'+si+'p'+pi+'-prezzo', p.prezzo));
      row.appendChild(inp('text',   's'+si+'p'+pi+'-unita',  p.unita||'', 'cad.'));
      row.appendChild(inp('text',   's'+si+'p'+pi+'-desc',   p.descrizione||''));
      row.appendChild(chk('s'+si+'p'+pi+'-eco', p.sostenibile));
      body.appendChild(row);
    });

    fs.appendChild(body); wrap.appendChild(fs);
  });
}

function leggi() {
  var m = JSON.parse(JSON.stringify(dati));

  if (m.degustazione) {
    m.degustazione.opzioni.forEach(function(o, i) {
      o.portate = +document.getElementById('op-portate-'+i).value;
      o.prezzo  = +document.getElementById('op-prezzo-'+i).value;
      o.vini    = +document.getElementById('op-vini-'+i).value;
    });
    m.degustazione.percorsi['6'].forEach(function(p, i) {
      p.nome = document.getElementById('d6p-'+i).value;
      var eco = document.getElementById('d6s-'+i).checked;
      if (eco) p.sostenibile = true; else delete p.sostenibile;
    });
    m.degustazione.percorsi['7'] = document.getElementById('degu7').value;
  }

  m.sezioni.forEach(function(sez, si) {
    // NON sovrascrivere sez.titolo — è la chiave usata da getSez e pagine
    // Il titolo editabile nel form è solo display
    sez.piatti.forEach(function(p, pi) {
      p.nome = document.getElementById('s'+si+'p'+pi+'-nome').value;
      var pr = document.getElementById('s'+si+'p'+pi+'-prezzo').value;
      p.prezzo = pr !== '' ? +pr : null;
      var u = document.getElementById('s'+si+'p'+pi+'-unita').value.trim();
      if (u) p.unita = u; else delete p.unita;
      var d = document.getElementById('s'+si+'p'+pi+'-desc').value.trim();
      if (d) p.descrizione = d; else delete p.descrizione;
      var eco = document.getElementById('s'+si+'p'+pi+'-eco').checked;
      if (eco) p.sostenibile = true; else delete p.sostenibile;
    });
  });
  if (m.allergeni) {
    m.allergeni.forEach(function(a, ai) {
      var n = document.getElementById('all-'+ai+'-nome');
      var al = document.getElementById('all-'+ai+'-all');
      if (n) a.nome = n.value;
      if (al) a.allergeni = al.value;
    });
  }
  return m;
}

var MENU_URL = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu.html';
var REPO_OWNER = 'santamonicagenova-a11y';
var REPO_NAME  = 'SantaWeb';
var MENU_PATH  = 'menu.html';
var outputCorrente = '';
var DOLCI_URL = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu-dolci.html';
var DOLCI_PATH = 'menu-dolci.html';
var MENU_DOLCI_IT = {"sezioni": [{"titolo": "Golosità", "piatti": [{"nome": "Gelato al limone nero, levistico, lime, cracker di latte", "prezzo": 14}, {"nome": "Ananas, parfait al carbone, caramello al caffè", "prezzo": 14}, {"nome": "Gelato al porcino, fragole, terra al cioccolato", "prezzo": 14}, {"nome": "Sacripantina", "prezzo": 11}, {"nome": "Erborinato ligure e Picolit Zorzettig", "prezzo": 12}]}], "allergeni": [{"nome": "Gelato al limone nero", "allergeni": "glutine, latticini"}, {"nome": "Gelato porcino", "allergeni": "latticini, uova"}, {"nome": "Ananas", "allergeni": "uovo, glutine, latticini"}, {"nome": "Sacripantina", "allergeni": "frutta a guscio, uovo, glutine, latticini, solforosa"}, {"nome": "Erborinato e Picolit", "allergeni": "latticini, solforosa"}], "pagine": [{"sezioni": ["Golosità"]}]};
var TRADUZIONI_DOLCI = {"en": {"title": "Desserts — Santamonica", "sezione": "Sweets", "piatti": {"Gelato al limone nero, levistico, lime, cracker di latte": "Black lemon gelato, lovage, lime, milk cracker", "Ananas, parfait al carbone, caramello al caffè": "Pineapple, charcoal parfait, coffee caramel", "Gelato al porcino, fragole, terra al cioccolato": "Porcini gelato, strawberries, chocolate soil", "Sacripantina": "Sacripantina", "Erborinato ligure e Picolit Zorzettig": "Ligurian blue cheese and Picolit Zorzettig", "glutine, latticini": "gluten, dairy", "latticini, uova": "dairy, eggs", "uovo, glutine, latticini": "egg, gluten, dairy", "frutta a guscio, uovo, glutine, latticini, solforosa": "tree nuts, egg, gluten, dairy, sulphites", "latticini, solforosa": "dairy, sulphites", "Gelato al limone nero": "Black lemon gelato", "Gelato porcino": "Porcini gelato", "Ananas": "Pineapple", "Erborinato e Picolit": "Blue cheese and Picolit"}}, "fr": {"title": "Desserts — Santamonica", "sezione": "Gourmandises", "piatti": {"Gelato al limone nero, levistico, lime, cracker di latte": "Glace citron noir, livèche, citron vert, cracker au lait", "Ananas, parfait al carbone, caramello al caffè": "Ananas, parfait au charbon, caramel au café", "Gelato al porcino, fragole, terra al cioccolato": "Glace aux cèpes, fraises, terre au chocolat", "Sacripantina": "Sacripantina", "Erborinato ligure e Picolit Zorzettig": "Fromage persillé ligurien et Picolit Zorzettig", "glutine, latticini": "gluten, produits laitiers", "latticini, uova": "produits laitiers, œufs", "uovo, glutine, latticini": "œuf, gluten, produits laitiers", "frutta a guscio, uovo, glutine, latticini, solforosa": "fruits à coque, œuf, gluten, produits laitiers, sulfites", "latticini, solforosa": "produits laitiers, sulfites", "Gelato al limone nero": "Glace citron noir", "Gelato porcino": "Glace aux cèpes", "Ananas": "Ananas", "Erborinato e Picolit": "Fromage persillé et Picolit"}}, "de": {"title": "Desserts — Santamonica", "sezione": "Desserts", "piatti": {"Gelato al limone nero, levistico, lime, cracker di latte": "Schwarzzitroneneis, Liebstöckel, Limette, Milchcracker", "Ananas, parfait al carbone, caramello al caffè": "Ananas, Kohle-Parfait, Kaffeekaramell", "Gelato al porcino, fragole, terra al cioccolato": "Steinpilzeis, Erdbeeren, Schokoladenerde", "Sacripantina": "Sacripantina", "Erborinato ligure e Picolit Zorzettig": "Ligurischer Blauschimmelkäse und Picolit Zorzettig", "glutine, latticini": "Gluten, Milchprodukte", "latticini, uova": "Milchprodukte, Eier", "uovo, glutine, latticini": "Ei, Gluten, Milchprodukte", "frutta a guscio, uovo, glutine, latticini, solforosa": "Schalenfrüchte, Ei, Gluten, Milchprodukte, Sulfite", "latticini, solforosa": "Milchprodukte, Sulfite", "Gelato al limone nero": "Schwarzzitroneneis", "Gelato porcino": "Steinpilzeis", "Ananas": "Ananas", "Erborinato e Picolit": "Blauschimmelkäse und Picolit"}}, "es": {"title": "Postres — Santamonica", "sezione": "Delicias", "piatti": {"Gelato al limone nero, levistico, lime, cracker di latte": "Helado de limón negro, levístico, lima, cracker de leche", "Ananas, parfait al carbone, caramello al caffè": "Piña, parfait de carbón, caramelo de café", "Gelato al porcino, fragole, terra al cioccolato": "Helado de boletus, fresas, tierra de chocolate", "Sacripantina": "Sacripantina", "Erborinato ligure e Picolit Zorzettig": "Queso azul ligur y Picolit Zorzettig", "glutine, latticini": "gluten, lácteos", "latticini, uova": "lácteos, huevos", "uovo, glutine, latticini": "huevo, gluten, lácteos", "frutta a guscio, uovo, glutine, latticini, solforosa": "frutos secos, huevo, gluten, lácteos, sulfitos", "latticini, solforosa": "lácteos, sulfitos", "Gelato al limone nero": "Helado de limón negro", "Gelato porcino": "Helado de boletus", "Ananas": "Piña", "Erborinato e Picolit": "Queso azul y Picolit"}}};
var tipoMenuCorrente = 'carta';
var VINI_URL = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu-vini.html';
var VINI_PATH = 'menu-vini.html';
var datiVini = null;
var tplViniBefore = '', tplViniAfter = '';
var TRADUZIONI_VINI = {};

function costruisciOutput() {
  var m = leggi();
  var sep = '/* ' + '\u2550'.repeat(57) + ' */\n';
  var blocco = 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + sep;
  return tplBefore + blocco + tplAfter;
}

function salva() { apriPreview(); }

function togglePreviewMenu(e) {
  e.stopPropagation();
  document.getElementById('preview-menu').classList.toggle('open');
}
document.addEventListener('click', function() {
  var m = document.getElementById('preview-menu');
  if (m) m.classList.remove('open');
  var cm = document.getElementById('carica-menu');
  if (cm) cm.classList.remove('open');
});


function costruisciMenuTradotto(menuForm, t) {
  var orig = dati;
  var m = JSON.parse(JSON.stringify(menuForm));
  var piatti = t.piatti;

  // Usa sempre il nome nel form come chiave — Traduci ha già aggiornato il dizionario
  function tr(n) { return piatti[n] || n; }

  m.degustazione.nota = t.degu_nota;
  m.degustazione.percorsi['7'] = t.percorso_7;
  m.degustazione.percorsi['6'].forEach(function(p) {
    if (p) p.nome = tr(p.nome);
  });

  m.sezioni.forEach(function(sez, si) {
    var origSez = dati.sezioni[si];
    if (!origSez) return;
    sez.titolo_display = t.sezioni[sez.titolo] || t.sezioni[origSez.titolo] || t.piatti[sez.titolo] || sez.titolo;
    sez.piatti.forEach(function(p) {
      if (!p) return;
      p.nome = tr(p.nome);
      if (p.unita) p.unita = t.unita[p.unita] || p.unita;
      if (p.descrizione) p.descrizione = tr(p.descrizione);
    });
  });

  m.orario.orarioServizio.forEach(function(o) {
    o.giorno = t.orario[o.giorno] || o.giorno;
  });
  return m;
}
var tplBefore = '', tplAfter = '', dati = null, datiOriginali = null;

function apriPreview(lang) {
  if (!dati) { alert('Prima carica il menù'); return; }
  document.getElementById('preview-menu').classList.remove('open');
  outputCorrente = costruisciOutput();
  if (!lang || lang === 'it') {
    // Italiano: genera al volo
    var blob = new Blob([outputCorrente], { type: 'text/html;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank').focus();
  } else {
    // Lingue: apri direttamente da GitHub Pages
    var prefix = tipoMenuCorrente === 'dolci' ? 'menu-dolci-' : 'menu-';
    var base = 'https://santamonicagenova-a11y.github.io/SantaWeb/' + prefix + lang + '.html';
    window.open(base + '?v=' + Date.now(), '_blank').focus();
  }
}

function toggleCaricaMenu(e) {
  e.stopPropagation();
  document.getElementById('carica-menu').classList.toggle('open');
}

function caricaDalSito(tipo) {
  tipo = tipo || 'carta';
  tipoMenuCorrente = tipo;
  document.getElementById('carica-menu').classList.remove('open');
  if (tipo === 'vini') { caricaViniDalSito(); return; }
  var url = tipo === 'dolci' ? DOLCI_URL : MENU_URL;
  var btn = document.querySelector('.btn-load');
  document.getElementById('err').textContent = '';
  fetch(url + '?nocache=' + Date.now(), { cache: 'no-store' })
    .then(function(r) {
      if (!r.ok) throw new Error('Errore HTTP ' + r.status);
      return r.text();
    })
    .then(function(src) {
      try {
        analizza(src);
        document.getElementById('intro').style.display = 'none';
        document.getElementById('wrap').classList.add('on');
        costruisci();
        toast('✓ Menù caricato dal sito');
      } catch(ex) {
        document.getElementById('err').textContent = 'Errore: ' + ex.message;
      }
    })
    .catch(function(ex) {
      document.getElementById('err').textContent = 'Impossibile caricare: ' + ex.message;
    });
}

function pubblicaSuGithub() {
  if (!dati) { alert('Prima carica il menù'); return; }
  outputCorrente = costruisciOutput();
  var token = localStorage.getItem('gh_token') || '';
  if (token) {
    // Token già salvato — pubblica direttamente senza mostrare il modale
    eseguiPubblicazione(token);
  } else {
    document.getElementById('token-input').value = '';
    document.getElementById('modal-token').classList.add('on');
  }
}

function resetToken() {
  localStorage.removeItem('gh_token');
  document.getElementById('token-input').value = '';
  document.getElementById('modal-token').classList.add('on');
}

function confermaPubblica() {
  var token = document.getElementById('token-input').value.trim();
  if (!token) { alert('Inserisci il token'); return; }
  localStorage.setItem('gh_token', token);
  chiudiModal();
  eseguiPubblicazione(token);
  var btn = document.getElementById('btn-pubblica');
  if (btn) { btn.textContent = '✦ Traduci e Pubblica'; btn.disabled = false; }
}

function chiudiModal() {
  document.getElementById('modal-token').classList.remove('on');
}

var TRANSLATIONS = {"en": {"lang": "en", "lang_label": "English", "title": "Menu — Santamonica", "degu_titolo": "Tasting Menu", "degu_portate_label": "courses", "degu_vini_label": "wine pairing", "degu_nota": "Price per person, menu to be shared by the whole table.", "degu_intero_tavolo": "the whole table", "percorso_7": "Chef's free interpretation menu", "note_carta_1": "To maintain consistent quality and organoleptic characteristics of raw ingredients, fresh fish products are blast-frozen after purchase. These products are marked with the symbol * for clear and transparent customer information.", "note_carta_2": "The list of allergens is available on the last page of this menu.", "note_ospite_titolo": "Guest notes", "note_orario": "To maintain consistent quality standards and organoleptic characteristics, fresh fish products are blast-frozen. These products are marked with the symbol: *", "orario_titolo": "OPENING HOURS:", "titolo_degustazione": "Tasting Menu", "sezioni": {"Crudi": "Raw", "Sfiziosi": "Starters", "Amidi e Carboidrati": "Pasta & Grains", "Non Solo Mare": "Not Only Sea"}, "unita": {"cad.": "ea."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Skate wing, local broad beans, green apple, almonds", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wild boar tortelli, sea bream dashi, spring onion, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, citrus kosho, borlotti beans", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Line-caught local meagre, sea purslane, Belgian endive", "Gelato al limone nero, levistico, lime, cracker di latte": "Black lemon ice cream, lovage, lime, milk cracker", "Ostriche Fine de Claire": "Fine de Claire Oysters", "Ostriche Antilope": "Antilope Oysters", "Ostriche Enrico IV": "Enrico IV Oysters", "Scampi nostrani": "Local langoustines", "Gamberi viola nostrani": "Local purple prawns", "Selezione solamente di pesci nostrani pescati ad amo": "Selection of local line-caught fish only", "Degustazione di mare": "Sea tasting", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Local squid, fresh peas, light bagna cauda, kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Cabbage, miso, raspberries, cashews", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Veal sweetbread, celeriac, hazelnuts, fish stock reduction", "“Non formaggi”": "“Not cheese”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Tasting of artisan fake cheeses made with cashews and almond milk)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Square spaghettoni “<em>Mancini</em>”, sea anemones, nduja, marjoram", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, salt cod, our fermented citrus kosho, borlotti beans", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Rice “<em>Riserva San Massimo</em>”, hare ragù, turnip tops, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Local octopus, rhubarb, peas", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinated courgette, mint, yogurt, Timut pepper", "Picanha, cardoncelli, fondo di manzo": "Picanha, king oyster mushrooms, beef jus", "Gambero viola crudo": "Raw purple prawn", "Agnello": "Lamb"}, "orario": {"Martedì": "Tuesday", "Dal mercoledì al sabato": "Wednesday to Saturday", "Domenica": "Sunday"}, "links": ["<u>Italian Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "fr": {"lang": "fr", "lang_label": "Français", "title": "Menu — Santamonica", "degu_titolo": "Menu Dégustation", "degu_portate_label": "plats", "degu_vini_label": "accord mets-vins", "degu_nota": "Prix par personne, menu à partager par toute la table.", "degu_intero_tavolo": "toute la table", "percorso_7": "Menu carte blanche du Chef", "note_carta_1": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques des matières premières, les produits de la mer achetés frais sont surgelés à basse température. Ces produits sont signalés par le symbole * pour une information claire et transparente à la clientèle.", "note_carta_2": "La liste des allergènes est consultable à la dernière page de ce menu.", "note_ospite_titolo": "Note pour nos hôtes", "note_orario": "Pour maintenir constants le niveau qualitatif et les caractéristiques organoleptiques, les produits frais sont surgelés à basse température. Ces produits sont signalés par le symbole : *", "orario_titolo": "HORAIRES D'OUVERTURE :", "titolo_degustazione": "Menu Dégustation", "sezioni": {"Crudi": "Crus", "Sfiziosi": "Entrées", "Amidi e Carboidrati": "Pâtes & Céréales", "Non Solo Mare": "Pas Seulement la Mer"}, "unita": {"cad.": "p."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aile de raie, fèves locales, pomme verte, amandes", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Ris de veau, céleri-rave, noisettes, fond de poisson", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de sanglier, dashi de dorade, ciboule, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, morue, kosho d’agrumes, haricots borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Ombrine locale à la ligne, salicorne, endive belge", "Gelato al limone nero, levistico, lime, cracker di latte": "Glace au citron noir, livèche, citron vert, cracker au lait", "Ostriche Fine de Claire": "Huîtres Fine de Claire", "Ostriche Antilope": "Huîtres Antilope", "Ostriche Enrico IV": "Huîtres Enrico IV", "Scampi nostrani": "Langoustines locales", "Gamberi viola nostrani": "Crevettes violettes locales", "Selezione solamente di pesci nostrani pescati ad amo": "Sélection exclusivement de poissons locaux pêchés à la ligne", "Degustazione di mare": "Dégustation de la mer", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, petits pois frais, bagna cauda légère, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Chou pommé, miso, framboises, noix de cajou", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Ris de veau, céleri-rave, noisettes, réduction de fond de poisson", "“Non formaggi”": "“Non-fromages”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Dégustation de faux fromages artisanaux à base de noix de cajou et lait d’amande)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni carrés “<em>Mancini</em>”, anémones de mer, nduja, marjolaine", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, morue, notre kosho d’agrumes fermenté, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Riz “<em>Riserva San Massimo</em>”, ragû de lièvre, fanes de navet, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Poulpe local, rhubarbe, petits pois", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Courgette en escabèche, menthe, yaourt, poivre Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, pleurotes du panicaut, jus de bœuf", "Gambero viola crudo": "Crevette violette crue", "Agnello": "Agneau"}, "orario": {"Martedì": "Mardi", "Dal mercoledì al sabato": "Du mercredi au samedi", "Domenica": "Dimanche"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Speisekarte auf Deutsch</u>", "<u>Carta en Español</u>"]}, "de": {"lang": "de", "lang_label": "Deutsch", "title": "Speisekarte — Santamonica", "degu_titolo": "Degustationsmenü", "degu_portate_label": "Gänge", "degu_vini_label": "Weinbegleitung", "degu_nota": "Preis pro Person, Menü für den gesamten Tisch.", "degu_intero_tavolo": "den gesamten Tisch", "percorso_7": "Menü nach freier Wahl des Küchenchefs", "note_carta_1": "Um die Qualität und die organoleptischen Eigenschaften der Rohstoffe konstant zu halten, werden frisch eingekaufte Fischprodukte schockgefrostet. Diese Produkte sind mit dem Symbol * gekennzeichnet.", "note_carta_2": "Die Liste der Allergene finden Sie auf der letzten Seite dieser Speisekarte.", "note_ospite_titolo": "Hinweis für unsere Gäste", "note_orario": "Um die Qualität konstant zu halten, werden frische Fischprodukte schockgefrostet und mit dem Symbol * gekennzeichnet.", "orario_titolo": "ÖFFNUNGSZEITEN:", "titolo_degustazione": "Degustationsmenü", "sezioni": {"Crudi": "Rohkost", "Sfiziosi": "Vorspeisen", "Amidi e Carboidrati": "Pasta & Getreide", "Non Solo Mare": "Nicht Nur Meer"}, "unita": {"cad.": "Stk."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Rochenflügel, heimische Saubohnen, grüner Apfel, Mandeln", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfond", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Wildschweintortelli, Goldbrassen-Dashi, Frühlingszwiebel, Shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, Zitruskosho, Borlottibohnen", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Lokal geangelter Umberfisch, Queller, Chicorée", "Gelato al limone nero, levistico, lime, cracker di latte": "Schwarzzitronen-Eis, Liebstöckel, Limette, Milchcracker", "Ostriche Fine de Claire": "Fine de Claire Austern", "Ostriche Antilope": "Antilope Austern", "Ostriche Enrico IV": "Enrico IV Austern", "Scampi nostrani": "Heimische Scampi", "Gamberi viola nostrani": "Heimische Violettgarnelen", "Selezione solamente di pesci nostrani pescati ad amo": "Auswahl ausschließlich heimischer Angelfische", "Degustazione di mare": "Meeresverkostung", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Heimischer Tintenfisch, frische Erbsen, leichte Bagna Cauda, Kefir", "Cavolo cappuccio, miso, lamponi, anacardi": "Weißkohl, Miso, Himbeeren, Cashewnüsse", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Kalbsbries, Knollensellerie, Haselnüsse, Fischfondreduktion", "“Non formaggi”": "“Kein Käse”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Verkostung handwerklicher Pseudokäse auf Cashew- und Mandelmilchbasis)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Quadratische Spaghettoni “<em>Mancini</em>”, Seeanemonen, Nduja, Majoran", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, Stockfisch, unser fermentiertes Zitruskosho, Borlottibohnen", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Reis “<em>Riserva San Massimo</em>”, Hasenragù, Steckrübenblätter, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Heimischer Oktopus, Rhabarber, Erbsen", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Marinierte Zucchini, Minze, Joghurt, Timutpfeffer", "Picanha, cardoncelli, fondo di manzo": "Picanha, Königskräuterseitlinge, Rinderjus", "Gambero viola crudo": "Rohe Violettgarnele", "Agnello": "Lamm"}, "orario": {"Martedì": "Dienstag", "Dal mercoledì al sabato": "Mittwoch bis Samstag", "Domenica": "Sonntag"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Carta en Español</u>"]}, "es": {"lang": "es", "lang_label": "Español", "title": "Carta — Santamonica", "degu_titolo": "Menú Degustación", "degu_portate_label": "platos", "degu_vini_label": "maridaje de vinos", "degu_nota": "Precio por persona, menú para toda la mesa.", "degu_intero_tavolo": "toda la mesa", "percorso_7": "Menú a libre elección del Chef", "note_carta_1": "Para mantener constantes el nivel cualitativo y las características organolépticas de las materias primas, los productos de pescado comprados frescos se someten a ultracongelación. Estos productos se señalan con el símbolo * para una información clara y transparente.", "note_carta_2": "La lista de alérgenos se puede consultar en la última página de esta carta.", "note_ospite_titolo": "Nota para nuestros huéspedes", "note_orario": "Para mantener constantes el nivel cualitativo y las características organolépticas, los productos frescos se ultracongelan y se señalan con el símbolo: *", "orario_titolo": "HORARIO DE SERVICIO:", "titolo_degustazione": "Menú Degustación", "sezioni": {"Crudi": "Crudos", "Sfiziosi": "Entrantes", "Amidi e Carboidrati": "Pastas & Cereales", "Non Solo Mare": "No Solo Mar"}, "unita": {"cad.": "ud."}, "piatti": {"Ali di razza, fave nostrane, mela verde, mandorle": "Aleta de raya, habas locales, manzana verde, almendras", "Animella di vitello, sedano rapa, nocciole, fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, fondo de pescado", "Tortelli di cinghiale, dashi di orata, cipollina, shiso": "Tortelli de jabalí, dashi de dorada, cebolleta, shiso", "Tubetti “<em>Mancini</em>”, baccalà, kosho di agrumi, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, kosho de cítricos, alubias borlotti", "Ombrina nostrana pescata ad amo, salicornia, indivia belga": "Corvina local de anzuelo, salicornia, endibia belga", "Gelato al limone nero, levistico, lime, cracker di latte": "Helado de limón negro, levístico, lima, cracker de leche", "Ostriche Fine de Claire": "Ostras Fine de Claire", "Ostriche Antilope": "Ostras Antilope", "Ostriche Enrico IV": "Ostras Enrico IV", "Scampi nostrani": "Cigalas locales", "Gamberi viola nostrani": "Gambas violetas locales", "Selezione solamente di pesci nostrani pescati ad amo": "Selección exclusivamente de pescados locales de anzuelo", "Degustazione di mare": "Degustación del mar", "Calamaro nostrano, piselli freschi, bagna cauda leggera, kefir": "Calamar local, guisantes frescos, bagna cauda ligera, kéfir", "Cavolo cappuccio, miso, lamponi, anacardi": "Col repollo, miso, frambuesas, anacardos", "Animella di vitello, sedano rapa, nocciole, riduzione di fondo di pesce": "Mollejas de ternera, apio nabo, avellanas, reducción de fondo de pescado", "“Non formaggi”": "“No quesos”", "(Degustazione di finti formaggi artigianali a base anacardi e latte di mandorla)": "(Degustación de falsos quesos artesanales a base de anacardos y leche de almendra)", "Spaghettoni quadrati “<em>Mancini</em>”, anemoni di mare, nduja, maggiorana": "Spaghettoni cuadrados “<em>Mancini</em>”, anémonas de mar, nduja, mejorana", "Tubetti “<em>Mancini</em>”, baccalà, il nostro kosho di agrumi fermentato, borlotti": "Tubetti “<em>Mancini</em>”, bacalao, nuestro kosho de cítricos fermentado, borlotti", "Riso “<em>Riserva San Massimo</em>”, ragù di lepre, cime di rapa, Parmigiano Reggiano": "Arroz “<em>Riserva San Massimo</em>”, ragú de liebre, grelos, Parmigiano Reggiano", "Polpo nostrano, rabarbaro, piselli": "Pulpo local, ruibarbo, guisantes", "Zucchina alla scapece, menta, yogurt, pepe Timut": "Calabacín en escabeche, menta, yogur, pimienta Timut", "Picanha, cardoncelli, fondo di manzo": "Picanha, setas cardoncelli, jugo de ternera", "Gambero viola crudo": "Gamba violeta cruda", "Agnello": "Cordero"}, "orario": {"Martedì": "Martes", "Dal mercoledì al sabato": "De miércoles a sábado", "Domenica": "Domingo"}, "links": ["<u>Menu Italiano</u>", "<u>English Menu</u>", "<u>Carte en Française</u>", "<u>Speisekarte auf Deutsch</u>"]}};

function traduci() {
  if (!dati) { alert('Prima carica il menù'); return; }
  var m = leggi();
  var btn = document.getElementById('btn-traduci');

  // Raccogli tutti i testi dal form
  var testi = [];
  if (m.degustazione) {
    m.degustazione.percorsi['6'].forEach(function(p) { if (p.nome) testi.push(p.nome); });
  }
  m.sezioni.forEach(function(sez) {
    if (sez.titolo) testi.push(sez.titolo);
    sez.piatti.forEach(function(p) {
      if (p.nome) testi.push(p.nome);
      if (p.descrizione) testi.push(p.descrizione);
    });
  });
  if (m.allergeni) {
    m.allergeni.forEach(function(a) {
      if (a.nome) testi.push(a.nome);
      if (a.allergeni) testi.push(a.allergeni);
    });
  }
  testi = testi.filter(function(v, i, a) { return v && a.indexOf(v) === i; });

  if (testi.length === 0) { toast('Nessun testo da tradurre'); return; }

  var langs = ['en', 'fr', 'de', 'es'];
  var totale = testi.length * langs.length;
  var completati = 0;

  btn.textContent = '\u23f3 0/' + totale + '\u2026';
  btn.classList.add('translating');
  btn.disabled = true;

  // Coda sequenziale: una richiesta alla volta
  var coda = [];
  testi.forEach(function(testo) {
    langs.forEach(function(lang) {
      coda.push({ testo: testo, lang: lang });
    });
  });

  function traduciVoce(i) {
    if (i >= coda.length) {
      btn.textContent = '\uD83C\uDF10 Traduci';
      btn.classList.remove('translating');
      btn.disabled = false;
      toast('\u2713 ' + testi.length + ' voci tradotte in 4 lingue!');
      return;
    }
    var item = coda[i];
    btn.textContent = '\u23f3 ' + (i+1) + '/' + totale + '\u2026';

    // Google Translate API non ufficiale — nessun CORS, nessuna chiave
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=' +
      item.lang + '&dt=t&q=' + encodeURIComponent(item.testo);

    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        // La risposta è [[["traduzione","originale",null,null,1],...],...]
        var trad = data && data[0] && data[0][0] && data[0][0][0];
        if (trad) TRANSLATIONS[item.lang]['piatti'][item.testo] = trad;
      })
      .catch(function() {})
      .finally(function() {
        setTimeout(function() { traduciVoce(i + 1); }, 80);
      });
  }

  traduciVoce(0);
}


function pubblicaFile(token, headers, path, content) {
  var apiBase = 'https://api.github.com/repos/' + REPO_OWNER + '/' + REPO_NAME + '/contents/' + path;
  return fetch(apiBase, { headers: headers })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var body = {
        message: 'Aggiornamento menu',
        content: btoa(unescape(encodeURIComponent(content)))
      };
      if (data.sha) body.sha = data.sha;
      return fetch(apiBase, { method: 'PUT', headers: headers, body: JSON.stringify(body) });
    });
}

function costruisciMenuItPub() {
  // Menu italiano pubblico: outputCorrente senza pulsanti carta/orario
  var BTNS = "  <button class=\"ctrl-btn active\" id=\"btn-carta\" onclick=\"showLayout('carta')\">\u261e Men\u00f9 alla carta (3 pag.)</button>\n  <div class=\"ctrl-sep\"></div>\n  <button class=\"ctrl-btn\" id=\"btn-orario\" onclick=\"showLayout('orario')\">\u261e Foglio orario (1 pag.)</button>\n  <div class=\"ctrl-sep\"></div>\n";
  var html = outputCorrente.replace(BTNS, '');
  html = html.replace("  document.getElementById('btn-carta').classList.toggle('active',  which === 'carta');\n  document.getElementById('btn-orario').classList.toggle('active', which === 'orario');", "  var bc=document.getElementById('btn-carta'); if(bc) bc.classList.toggle('active',which==='carta');\n  var bo=document.getElementById('btn-orario'); if(bo) bo.classList.toggle('active',which==='orario');");
  return html;
}

function eseguiPubblicazione(token) {

  var headers = {
    'Authorization': 'token ' + token,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  // Ricostruisci SEMPRE l'output dal form aggiornato (non da outputCorrente)
  if (tipoMenuCorrente === 'vini') { traduciEPubblicaVini(); return; }
  outputCorrente = costruisciOutput();

  // File da pubblicare: IT + 4 traduzioni
  outputCorrente = costruisciOutput();
  var files;
  if (tipoMenuCorrente === 'dolci') {
    files = filesDolci();
  } else {
    files = [
      { path: 'menu.html', content: outputCorrente, label: 'Italiano (admin)' },
      { path: 'menu-it.html', content: costruisciMenuItPub(), label: 'Italiano (pub)' }
    ];
    ['en','fr','de','es'].forEach(function(lang) {
    var t = TRANSLATIONS[lang];
    // Parti da menu-it.html (già senza pulsanti) e traduci
    var html = costruisciMenuItPub();
    var m = costruisciMenuTradotto(leggi(), t);
    var SEP = '/* ' + '\u2550'.repeat(57) + ' */\n';
    var i1 = html.indexOf('const MENU = {');
    var i2 = html.indexOf(SEP, i1) + SEP.length;
    html = html.slice(0, i1) + 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + SEP + html.slice(i2);
    html = html.replace('<html lang="it">', '<html lang="' + lang + '">');
    html = html.replace(/<title>[^<]*<\/title>/, '<title>' + t.title + '<\/title>');
    html = html.replace(/Note per l'ospite<\/span>[^`]*`/, t.note_ospite_titolo + '<\/span>\n  ' + t.note_carta_1 + '<br>\n  ' + t.note_carta_2 + '\n`');
    html = html.replace(/Per mantenere costanti[\s\S]*?simbolo: \*`/, t.note_orario + '`');
    html = html.replace('Menù’ Degustazione', t.titolo_degustazione);
    html = html.replace('Men&ugrave;&rsquo; Degustazione', t.titolo_degustazione);
    html = html.replace(/\${o\.portate} portate/g, '${o.portate} ' + t.degu_portate_label);
    html = html.replace(/eventuale abbinamento vini/g, t.degu_vini_label);
    html = html.replace('ORARIO DI SERVIZIO:', t.orario_titolo);
    html = html.replace(/<u><em>English Menu<\/em><\/u><br>\s*<u><em>Carte en Fran[^<]*<\/em><\/u>/, t.links.join('<br>\n            '));
    files.push({ path: 'menu-' + lang + '.html', content: html, label: lang.toUpperCase() });
    });
  }

  toast('⏳ Pubblicazione in corso…');

  var i = 0;
  function next() {
    if (i >= files.length) {
      toast('✓ Pubblicato! Ricarica tra 90 secondi…');
      setTimeout(function() {
        toast('⏳ Ricarico dal sito…');
        setTimeout(caricaDalSito, 1500);
      }, 90000);
      return;
    }
    var f = files[i++];
    pubblicaFile(token, headers, f.path, f.content)
      .then(function(r) {
        if (!r.ok) return r.json().then(function(e){ throw new Error(f.path + ': ' + e.message); });
        toast('✓ ' + f.label + ' (' + i + '/' + files.length + ')');
        setTimeout(next, 400);
      })
      .catch(function(ex) { alert('Errore: ' + ex.message); });
  }
  next();
}


function costruisciMenuDolciTradotto(lang) {
  var m = JSON.parse(JSON.stringify(leggi())); // usa i dati aggiornati dal form
  var tStatic = TRADUZIONI_DOLCI[lang] || {};
  // Usa il dizionario dinamico (aggiornato da traduciEPubblica) come fonte primaria
  var piatti = (TRANSLATIONS[lang] && TRANSLATIONS[lang]['piatti']) || {};

  // Titolo sezione
  m.sezioni.forEach(function(sez) {
    sez.titolo_display = piatti[sez.titolo] || tStatic.sezione || sez.titolo;
    sez.piatti.forEach(function(p) {
      p.nome = piatti[p.nome] || p.nome;
      if (p.descrizione) p.descrizione = piatti[p.descrizione] || p.descrizione;
    });
  });

  // Allergeni — nome piatto e lista allergeni tradotti
  if (m.allergeni) {
    m.allergeni.forEach(function(a) {
      a.nome      = piatti[a.nome]      || a.nome;
      a.allergeni = piatti[a.allergeni] || a.allergeni;
    });
  }
  return m;
}

function filesDolci() {
  var files = [{ path: DOLCI_PATH, content: outputCorrente, label: 'Dolci IT' }];
  ['en','fr','de','es'].forEach(function(lang) {
    var m = costruisciMenuDolciTradotto(lang);
    if (!m) return;
    var html = outputCorrente;
    var SEP = '/* ' + '\u2550'.repeat(57) + ' */\n';
    var i1 = html.indexOf('const MENU = {');
    var i2 = html.indexOf(SEP, i1) + SEP.length;
    html = html.slice(0, i1) + 'const MENU = ' + JSON.stringify(m, null, 2) + ';\n' + SEP + html.slice(i2);
    html = html.replace('<html lang="it">', '<html lang="' + lang + '">');
    var t = TRADUZIONI_DOLCI[lang];
    html = html.replace(/<title>[^<]*<\/title>/, '<title>' + t.title + '<\/title>');
    files.push({ path: 'menu-dolci-' + lang + '.html', content: html, label: 'Dolci ' + lang.toUpperCase() });
  });
  return files;
}

function traduciEPubblica() {
  if (!dati) { alert('Prima carica il menù'); return; }
  var btn = document.getElementById('btn-pubblica');
  var m = leggi();
  var testi = [];
  if (m.degustazione) {
    m.degustazione.percorsi['6'].forEach(function(p) { if (p.nome) testi.push(p.nome); });
  }
  m.sezioni.forEach(function(sez) {
    if (sez.titolo) testi.push(sez.titolo);
    sez.piatti.forEach(function(p) {
      if (p.nome) testi.push(p.nome);
      if (p.descrizione) testi.push(p.descrizione);
    });
  });
  if (m.allergeni) {
    m.allergeni.forEach(function(a) {
      if (a.nome) testi.push(a.nome);
      if (a.allergeni) testi.push(a.allergeni);
    });
  }
  testi = testi.filter(function(v, i, a) { return v && a.indexOf(v) === i; });

  var langs = ['en', 'fr', 'de', 'es'];
  var langPair = { en: 'it-IT|en-GB', fr: 'it-IT|fr-FR', de: 'it-IT|de-DE', es: 'it-IT|es-ES' };
  var coda = [];
  testi.forEach(function(testo) {
    langs.forEach(function(lang) { coda.push({ testo: testo, lang: lang }); });
  });
  var totale = coda.length;
  btn.textContent = '⏳ Traduzione 0/' + totale + '…';
  btn.disabled = true;

  function traduciVoce(i) {
    if (i >= coda.length) {
      btn.textContent = '⏳ Pubblicazione…';
      var token = localStorage.getItem('gh_token') || '';
      if (token) {
        eseguiPubblicazione(token);
      } else {
        document.getElementById('token-input').value = '';
        document.getElementById('modal-token').classList.add('on');
      }
      btn.textContent = '✶ Traduci e Pubblica';
      btn.disabled = false;
      return;
    }
    var item = coda[i];
    btn.textContent = '⏳ Traduzione ' + (i+1) + '/' + totale + '…';
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=' +
      item.lang + '&dt=t&q=' + encodeURIComponent(item.testo);
    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var trad = data && data[0] && data[0][0] && data[0][0][0];
        if (trad) TRANSLATIONS[item.lang]['piatti'][item.testo] = trad;
      })
      .catch(function() {})
      .finally(function() { setTimeout(function() { traduciVoce(i + 1); }, 80); });
  }
  traduciVoce(0);
}


function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('on');
  setTimeout(function(){ t.classList.remove('on'); }, 3000);
}

// ═══════════════════════════════════════════════════════
// MENU VINI — funzioni admin (da aggiungere ad admin-core.js)
// ═══════════════════════════════════════════════════════

var VINI_URL = 'https://santamonicagenova-a11y.github.io/SantaWeb/menu-vini.html';
var VINI_PATH = 'menu-vini.html';
var datiVini = null;
var tplViniBefore = '', tplViniAfter = '';

// ─── Carica menu-vini.html da GitHub ───────────────────
function caricaViniDalSito() {
  toast('⏳ Caricamento lista vini...');
  fetch(VINI_URL + '?v=' + Date.now(), { cache: 'no-store' })
    .then(function(r) { return r.text(); })
    .then(function(src) {
      analizzaVini(src);
      costruisciFormVini();
      toast('✓ Lista vini caricata');
    })
    .catch(function(e) { toast('✗ Errore caricamento vini: ' + e); });
}

// ─── Estrae const MENU_VINI dal sorgente ───────────────
function analizzaVini(src) {
  var start = src.indexOf('const MENU_VINI = ');
  if (start === -1) { toast('✗ MENU_VINI non trovato'); return; }
  start += 'const MENU_VINI = '.length;
  var depth = 0, i = start, inStr = false, strChar = '';
  for (; i < src.length; i++) {
    var c = src[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === strChar) inStr = false;
    } else {
      if (c === '"' || c === "'") { inStr = true; strChar = c; }
      else if (c === '{' || c === '[') depth++;
      else if (c === '}' || c === ']') { depth--; if (depth === 0) { i++; break; } }
    }
  }
  var jsonStr = src.substring(start, i);
  datiVini = (new Function('return ' + jsonStr))();
  tplViniBefore = src.substring(0, src.indexOf('const MENU_VINI = '));
  tplViniAfter = src.substring(i);
  // rimuove il ';' finale che rimane
  if (tplViniAfter.charAt(0) === ';') tplViniAfter = tplViniAfter.substring(1);
}

// ─── Leggi form e restituisce MENU_VINI aggiornato ─────
function leggiFormVini() {
  if (!datiVini) return null;
  var m = JSON.parse(JSON.stringify(datiVini)); // deep copy
  m.sezioni.forEach(function(sez, si) {
    var viniList = raccogliViniDaForm(sez, si);
    if (sez.sottosezioni) {
      sez.sottosezioni.forEach(function(ss, ssi) {
        ss.vini = raccogliViniDaForm(ss, si + '_' + ssi);
      });
    } else {
      sez.vini = raccogliViniDaForm(sez, si);
    }
  });
  return m;
}

function raccogliViniDaForm(contenitore, prefisso) {
  var vini = [];
  (contenitore.vini || []).forEach(function(v, vi) {
    var p = 'vino_' + prefisso + '_' + vi + '_';
    var nv = {};
    nv.nome = getVal(p + 'nome') || v.nome;
    var abv = getVal(p + 'abv');
    if (abv) nv.abv = abv;
    var extra = getVal(p + 'extra');
    if (extra) nv.extra = extra;
    else if (v.annata) { var an = getVal(p + 'annata'); if (an) nv.annata = an; }
    var uve = getVal(p + 'uve');
    if (uve) nv.uve = uve;
    var regione = getVal(p + 'regione');
    if (regione) nv.regione = regione;
    var pb = getVal(p + 'prezzo_bottiglia');
    if (pb) nv.prezzo_bottiglia = parseFloat(pb);
    var pc = getVal(p + 'prezzo_calice');
    if (pc) nv.prezzo_calice = parseFloat(pc);
    var desc = getVal(p + 'descrizione');
    if (desc) nv.descrizione = desc;
    // Annate
    if (v.annate) {
      nv.annate = v.annate.map(function(a, ai) {
        var ap = 'annata_' + prefisso + '_' + vi + '_' + ai + '_';
        var na = {};
        na.anno = getVal(ap + 'anno') || a.anno;
        var aAbv = getVal(ap + 'abv');
        if (aAbv) na.abv = aAbv;
        var apb = getVal(ap + 'prezzo_bottiglia');
        if (apb) na.prezzo_bottiglia = parseFloat(apb);
        var apc = getVal(ap + 'prezzo_calice');
        if (apc) na.prezzo_calice = parseFloat(apc);
        return na;
      });
    }
    if (v.a_calice) nv.a_calice = true;
    vini.push(nv);
  });
  return vini;
}

function getVal(id) {
  var el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ─── Costruisce il form di editing ─────────────────────
function costruisciFormVini() {
  if (!datiVini) return;
  var html = '';
  datiVini.sezioni.forEach(function(sez, si) {
    html += '<div class="sez-block">';
    html += '<div class="sez-hdr">' + sez.titolo + '</div>';
    if (sez.sottosezioni) {
      sez.sottosezioni.forEach(function(ss, ssi) {
        if (ss.titolo) html += '<div class="subsez-hdr">' + ss.titolo + '</div>';
        html += renderViniForm(ss, si + '_' + ssi);
      });
    } else {
      html += renderViniForm(sez, si);
    }
    html += '</div>';
  });
  var w = document.getElementById('wrap');
  w.innerHTML = html;
  w.classList.add('on');
  document.getElementById('intro').style.display = 'none';
}

function renderViniForm(contenitore, prefisso) {
  var html = '';
  (contenitore.vini || []).forEach(function(v, vi) {
    var p = 'vino_' + prefisso + '_' + vi + '_';
    html += '<div class="vino-form">';
    html += inpRow('Nome', p + 'nome', v.nome, 'full');
    html += inpRow('ABV', p + 'abv', v.abv || '', 'short');
    if (v.extra !== undefined) html += inpRow('Extra (sboccatura/annata/extra)', p + 'extra', v.extra || '', 'mid');
    else if (v.annata !== undefined) html += inpRow('Annata', p + 'annata', v.annata || '', 'short');
    html += inpRow('Uve', p + 'uve', v.uve || '', 'full');
    if (v.regione !== undefined) html += inpRow('Regione', p + 'regione', v.regione || '', 'mid');
    if (!v.annate) {
      html += inpRow('Prezzo bottiglia (€)', p + 'prezzo_bottiglia', v.prezzo_bottiglia || '', 'short');
      html += inpRow('Prezzo calice (€)', p + 'prezzo_calice', v.prezzo_calice || '', 'short');
    }
    html += taRow('Descrizione', p + 'descrizione', v.descrizione || '');
    // Annate
    if (v.annate && v.annate.length) {
      html += '<div class="annate-form-hdr">Annate:</div>';
      v.annate.forEach(function(a, ai) {
        var ap = 'annata_' + prefisso + '_' + vi + '_' + ai + '_';
        html += '<div class="annata-form-row">';
        html += inpRow('Anno', ap + 'anno', a.anno || '', 'short');
        html += inpRow('ABV', ap + 'abv', a.abv || '', 'short');
        html += inpRow('€ bottiglia', ap + 'prezzo_bottiglia', a.prezzo_bottiglia || '', 'short');
        html += inpRow('€ calice', ap + 'prezzo_calice', a.prezzo_calice || '', 'short');
        html += '</div>';
      });
    }
    html += '</div>';
  });
  return html;
}

function inpRow(label, id, val, size) {
  var w = size === 'full' ? '100%' : size === 'mid' ? '60%' : '120px';
  return '<div class="inp-row"><label>' + label + '</label><input id="' + id + '" value="' + escHtml(String(val)) + '" style="width:' + w + '"></div>';
}
function taRow(label, id, val) {
  return '<div class="inp-row"><label>' + label + '</label><textarea id="' + id + '" rows="2" style="width:100%">' + escHtml(val) + '</textarea></div>';
}
function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ─── Costruisce output HTML vini (IT, sorgente) ────────
function costruisciOutputVini() {
  var mv = leggiFormVini();
  if (!mv) return '';
  var js = 'const MENU_VINI = ' + JSON.stringify(mv) + ';';
  return tplViniBefore + js + tplViniAfter;
}

// ─── Preview vini ──────────────────────────────────────
function apriPreviewVini(lang) {
  if (!lang || lang === 'it') {
    var html = costruisciOutputVini();
    if (!html) { toast('✗ Nessun dato vini'); return; }
    var blob = new Blob([html], {type: 'text/html'});
    window.open(URL.createObjectURL(blob), '_blank');
  } else {
    window.open(VINI_URL.replace('menu-vini.html', 'menu-vini-' + lang + '.html') + '?v=' + Date.now(), '_blank');
  }
}

// ─── Traduzione e pubblicazione vini ───────────────────
var TRADUZIONI_VINI = {};

function traduciEPubblicaVini() {
  var mv = leggiFormVini();
  if (!mv) { toast('✗ Nessun dato'); return; }
  var nomi = [];
  mv.sezioni.forEach(function(sez) {
    function raccogliNomi(contenitore) {
      (contenitore.vini || []).forEach(function(v) {
        if (v.nome) nomi.push(v.nome);
        if (v.descrizione) nomi.push(v.descrizione);
        if (v.uve) nomi.push(v.uve);
        if (v.annate) v.annate.forEach(function(a) { if (a.anno) nomi.push(a.anno); });
      });
    }
    if (sez.sottosezioni) sez.sottosezioni.forEach(raccogliNomi);
    else raccogliNomi(sez);
    if (sez.titolo) nomi.push(sez.titolo);
    if (sez.nota) nomi.push(sez.nota);
    if (sez.sottosezioni) sez.sottosezioni.forEach(function(ss) { if (ss.titolo) nomi.push(ss.titolo); });
  });
  // Deduplica
  nomi = nomi.filter(function(v, i, a) { return v && a.indexOf(v) === i; });
  var langs = ['en', 'fr', 'de', 'es'];
  var btn = document.getElementById('btn-pubblica');
  if (btn) btn.disabled = true;

  function traduciLang(li) {
    if (li >= langs.length) {
      pubblica_vini(mv);
      return;
    }
    var lang = langs[li];
    TRADUZIONI_VINI[lang] = {};
    var idx = 0;
    function next() {
      if (idx >= nomi.length) {
        toast('✦ Tradotto ' + lang.toUpperCase() + ' (' + (li+1) + '/4)');
        setTimeout(function() { traduciLang(li + 1); }, 200);
        return;
      }
      var testo = nomi[idx];
      idx++;
      if (btn) btn.textContent = '⏳ ' + lang + ' ' + idx + '/' + nomi.length;
      var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=it&tl=' + lang + '&dt=t&q=' + encodeURIComponent(testo);
      fetch(url).then(function(r){return r.json();}).then(function(d){
        TRADUZIONI_VINI[lang][testo] = d[0][0][0];
        setTimeout(next, 80);
      }).catch(function(){ TRADUZIONI_VINI[lang][testo] = testo; setTimeout(next, 80); });
    }
    next();
  }
  traduciLang(0);
}

function pubblica_vini(mv) {
  var token = localStorage.getItem('gh_token');
  if (!token) { token = prompt('GitHub token:'); if (!token) return; localStorage.setItem('gh_token', token); }
  toast('⏳ Pubblicazione vini in corso...');
  var itHtml = costruisciOutputVini();
  var headers = { 'Authorization': 'token ' + token, 'Content-Type': 'application/json' };
  var files = [{ path: VINI_PATH, content: itHtml }];
  ['en','fr','de','es'].forEach(function(lang) {
    files.push({ path: 'menu-vini-' + lang + '.html', content: costruisciViniTradotto(lang, mv) });
  });
  var idx = 0;
  function next() {
    if (idx >= files.length) {
      if (document.getElementById('btn-pubblica')) document.getElementById('btn-pubblica').disabled = false;
      toast('✓ Lista vini pubblicata in tutte le lingue');
      return;
    }
    pubblicaFileVini(token, headers, files[idx].path, files[idx].content, function() { idx++; next(); });
  }
  next();
}

function pubblicaFileVini(token, headers, path, content, cb) {
  var apiUrl = 'https://api.github.com/repos/santamonicagenova-a11y/SantaWeb/contents/' + path;
  fetch(apiUrl, { headers: headers })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      var body = { message: 'Update ' + path + ' v2026.04.16', content: btoa(unescape(encodeURIComponent(content))), sha: d.sha || undefined };
      return fetch(apiUrl, { method: 'PUT', headers: headers, body: JSON.stringify(body) });
    })
    .then(function() { cb(); })
    .catch(function(e) { toast('✗ Errore ' + path); cb(); });
}

// ─── Genera HTML vini in lingua ────────────────────────
function costruisciViniTradotto(lang, mv) {
  var t = TRADUZIONI_VINI[lang] || {};
  function tr(s) { return t[s] || s; }
  // Traduce la struttura dati
  var mvt = JSON.parse(JSON.stringify(mv));
  mvt.sezioni.forEach(function(sez) {
    sez.titolo = tr(sez.titolo);
    if (sez.nota) sez.nota = tr(sez.nota);
    function tradVini(contenitore) {
      (contenitore.vini || []).forEach(function(v) {
        if (v.descrizione) v.descrizione = tr(v.descrizione);
        if (v.uve) v.uve = tr(v.uve);
      });
    }
    if (sez.sottosezioni) {
      sez.sottosezioni.forEach(function(ss) {
        ss.titolo = tr(ss.titolo);
        tradVini(ss);
      });
    } else {
      tradVini(sez);
    }
  });
  // Usa tplViniBefore/After con lang sostituito
  var js = 'const MENU_VINI = ' + JSON.stringify(mvt) + ';';
  var html = tplViniBefore + js + tplViniAfter;
  html = html.replace('<html lang="it">', '<html lang="' + lang + '">');
  var titles = { en: 'Wine List — Santamonica', fr: 'Carte des Vins — Santamonica', de: 'Weinkarte — Santamonica', es: 'Lista de Vinos — Santamonica' };
  html = html.replace('<title>Lista Vini — Santamonica</title>', '<title>' + (titles[lang] || 'Lista Vini — Santamonica') + '</title>');
  var coverTitles = { en: ['Wine List', 'Wine List'], fr: ['Carte des Vins', 'Carte des Vins'], de: ['Weinkarte', 'Weinkarte'], es: ['Lista de Vinos', 'Lista de Vinos'] };
  return html;
}
