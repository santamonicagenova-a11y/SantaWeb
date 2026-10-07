#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
check_lang_pages.py — verifica le pagine IT/EN/FR sull'HTML GREZZO (senza JS)  ·  v 2026.10.07.01

Uso:  python scripts/check_lang_pages.py [BASE_URL]      (default https://santamonicagenova.it)
Prova in locale:  node <server pretty-URL> poi  python scripts/check_lang_pages.py http://localhost:8765

Controlla per le 9 pagine (home, dove siamo, prenota x it/en/fr): stato 200, <html lang>, canonical
autoreferenziale, hreflang it/en/fr/x-default reciproci, title/description propri e diversi per lingua,
niente "ItalianRestaurant", JSON-LD valido, testo nella lingua giusta nell'HTML grezzo, link interni
(href che iniziano con "/") senza 404; poi sitemap.xml (XML valido, coppie xhtml:link reciproche).
Esce con codice 1 se qualcosa non torna.
"""
import json, re, sys, urllib.request, urllib.error, xml.etree.ElementTree as ET
from html.parser import HTMLParser

BASE = (sys.argv[1] if len(sys.argv) > 1 else 'https://santamonicagenova.it').rstrip('/')
PROD = 'https://santamonicagenova.it'
PAGES = {
    'home':  {'it': '/', 'en': '/en/', 'fr': '/fr/'},
    'where': {'it': '/dove-siamo', 'en': '/en/where-we-are', 'fr': '/fr/ou-nous-trouver'},
    'book':  {'it': '/prenota', 'en': '/en/book', 'fr': '/fr/reserver'},
}
# parole attese nel testo visibile del grezzo (spia di "testo davvero nell'HTML")
EXPECT = {'home': {'en': 'Book a table', 'fr': 'Réserver une table', 'it': 'Prenota un tavolo'},
          'where': {'en': 'Getting here', 'fr': 'Comment venir', 'it': 'Come arrivare'},
          'book': {'en': 'Five quick steps', 'fr': 'Cinq étapes rapides', 'it': 'Cinque passaggi rapidi'}}
fails = []

def fail(msg):
    fails.append(msg); print('  FAIL', msg)

def get(path):
    req = urllib.request.Request(BASE + path, headers={'User-Agent': 'santamonica-check/1'})
    try:
        r = urllib.request.urlopen(req, timeout=30)
        return r.status, r.read().decode('utf-8', 'replace'), r.geturl()
    except urllib.error.HTTPError as e:
        return e.code, '', path

class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.lang = None; self.title = ''; self.in_title = False
        self.meta = {}; self.canon = None; self.alts = {}; self.hrefs = []; self.ld = []; self.in_ld = False; self.text = []; self.skip = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html': self.lang = a.get('lang')
        if tag == 'title': self.in_title = True
        if tag == 'meta' and a.get('name') == 'description': self.meta['description'] = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical': self.canon = a.get('href')
        if tag == 'link' and a.get('rel') == 'alternate' and a.get('hreflang'): self.alts[a['hreflang']] = a.get('href')
        if tag == 'a' and a.get('href'): self.hrefs.append(a['href'])
        if tag == 'script':
            self.skip += 1
            if a.get('type') == 'application/ld+json': self.in_ld = True; self.ld.append('')
        if tag == 'style': self.skip += 1
    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag == 'script': self.skip -= 1; self.in_ld = False
        if tag == 'style': self.skip -= 1
    def handle_data(self, d):
        if self.in_title: self.title += d
        if self.in_ld: self.ld[-1] += d
        elif not self.skip: self.text.append(d)

parsed = {}
for page, langs in PAGES.items():
    for lang, path in langs.items():
        print('%s [%s] %s' % (page, lang, path))
        st, body, _ = get(path)
        if st != 200: fail('%s: stato %s' % (path, st)); continue
        p = P(); p.feed(body); parsed[(page, lang)] = p
        if p.lang != lang: fail('%s: <html lang>=%s, atteso %s' % (path, p.lang, lang))
        want = PROD + path
        if p.canon != want: fail('%s: canonical %s, atteso %s' % (path, p.canon, want))
        for hl, tgt in (('it', PAGES[page]['it']), ('en', PAGES[page]['en']), ('fr', PAGES[page]['fr']), ('x-default', PAGES[page]['it'])):
            if p.alts.get(hl) != PROD + tgt: fail('%s: hreflang %s = %s, atteso %s' % (path, hl, p.alts.get(hl), PROD + tgt))
        if not p.title.strip() or not p.meta.get('description'): fail('%s: title/description mancanti' % path)
        if any('ItalianRestaurant' in b for b in p.ld): fail('%s: JSON-LD con @type ItalianRestaurant' % path)
        for blk in p.ld:
            try: json.loads(blk)
            except Exception as e: fail('%s: JSON-LD non valido (%s)' % (path, e))
        vis = ' '.join(' '.join(p.text).split())
        if EXPECT[page][lang] not in vis: fail('%s: nel grezzo manca il testo "%s"' % (path, EXPECT[page][lang]))
        if lang != 'it':
            for it_only in ('Prenota un tavolo', 'Cinque passaggi', 'Come arrivare', 'Dove siamo'):
                if it_only in vis: fail('%s: testo italiano nel grezzo: "%s"' % (path, it_only))
    # titoli/description distinti
    ts = [parsed[(page, l)].title.strip() for l in ('it', 'en', 'fr') if (page, l) in parsed]
    if len(set(ts)) != len(ts): fail('%s: title uguali tra lingue' % page)
    ds = [parsed[(page, l)].meta.get('description') for l in ('it', 'en', 'fr') if (page, l) in parsed]
    if len(set(ds)) != len(ds): fail('%s: description uguali tra lingue' % page)

print('link interni')
seen = {}
for (page, lang), p in parsed.items():
    for h in p.hrefs:
        if not h.startswith('/') or h.startswith('//') or h.startswith('/cdn-cgi/'): continue
        path = h.split('#')[0]
        if not path or path in seen: continue
        st, _, _ = get(path)
        seen[path] = st
        if st != 200: fail('%s [%s]: link %s -> %s' % (page, lang, h, st))

print('sitemap')
st, body, _ = get('/sitemap.xml')
if st != 200: fail('sitemap.xml: stato %s' % st)
else:
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'x': 'http://www.w3.org/1999/xhtml'}
    try:
        root = ET.fromstring(body.encode('utf-8'))
        locs = {u.find('s:loc', ns).text: {l.get('hreflang'): l.get('href') for l in u.findall('x:link', ns)} for u in root.findall('s:url', ns)}
        for page, langs in PAGES.items():
            for lang, path in langs.items():
                u = PROD + path
                if u not in locs: fail('sitemap: manca %s' % u); continue
                for hl in ('it', 'en', 'fr'):
                    if locs[u].get(hl) != PROD + langs[hl]: fail('sitemap: %s hreflang %s = %s' % (u, hl, locs[u].get(hl)))
                if locs[u].get('x-default') != PROD + langs['it']: fail('sitemap: %s x-default errato' % u)
    except ET.ParseError as e:
        fail('sitemap.xml non valido: %s' % e)

print('\nESITO:', 'OK' if not fails else '%d problemi' % len(fails))
sys.exit(1 if fails else 0)
