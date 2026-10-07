#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_lang_pages.py — genera le pagine statiche EN/FR  ·  v 2026.10.07.01

Genera da index.html, dove-siamo.html e prenota.html (le sorgenti italiane, uniche da modificare a mano):
  en/index.html  en/where-we-are.html  en/book.html
  fr/index.html  fr/ou-nous-trouver.html  fr/reserver.html
con il testo GIÀ NELL'HTML (non iniettato da JS), html lang, title/meta propri, canonical autoreferenziale,
hreflang reciproci it/en/fr + x-default (IT), JSON-LD localizzato, selettore lingua a link, link interni alle
pagine nella stessa lingua, URL assolute. Poi riscrive le coppie hreflang di sitemap.xml.

Uso (dalla radice del repo SantaWeb):   python scripts/build_lang_pages.py [--check]
  --check  non scrive nulla: esce con 1 se qualcosa è fuori allineamento (utile prima del commit).

Dipendenza: beautifulsoup4 (pip install beautifulsoup4).
Quando cambi index.html / dove-siamo.html / prenota.html / translations.json / lang_pages_dict.py: rilancia
questo script e committa anche le pagine generate. Non modificare a mano en/ e fr/.
"""
import copy, html, json, os, re, sys
from bs4 import BeautifulSoup, Comment, NavigableString

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lang_pages_dict as D

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VERSION = 'v 2026.10.07.01'
CHECK = '--check' in sys.argv
problems = []

def read(p):
    return open(os.path.join(ROOT, p), encoding='utf-8', newline='').read().replace('\r\n', '\n')

def norm(t):
    return ' '.join(t.replace('\xa0', ' ').split())

def url(page, lang):
    return D.BASE + D.PAGES[page][lang]

# mappa URL interni italiani -> pagina logica
INTERNAL = {
    '/prenota.html': 'book', '/prenota': 'book', 'prenota.html': 'book',
    '/dove-siamo.html': 'where', '/dove-siamo': 'where', 'dove-siamo.html': 'where',
    '/': 'home', '/index.html': 'home',
}

def localize_href(href, lang, T=None):
    """href italiano -> href nella lingua; URL relative -> assolute; None se non va toccato."""
    if not href or href.startswith(('#', 'mailto:', 'tel:', 'geo:', 'http:', 'https:', 'data:', 'javascript:', '//')):
        return href
    base, sep, frag = href.partition('#')
    base, qsep, query = base.partition('?')
    if not base.startswith('/'):
        base = '/' + base
    if base in INTERNAL:
        base = D.PAGES[INTERNAL[base]][lang]
    elif base in ('/menu.html', '/menu'):
        base = D.MENU_URL[lang]
    elif base.startswith('/cene-a-tema') and not query:
        query = 'lang=' + lang
        qsep = '?'
    if base.endswith('.html') and base != '/index.html':
        base = base[:-5]   # Cloudflare Pages: le .html rispondono con redirect verso l'URL pulita
    return base + (qsep + query if qsep else '') + (sep + frag if sep else '')

def ld_localize(node, lang, page):
    """Localizza ricorsivamente un oggetto JSON-LD."""
    if isinstance(node, list):
        return [ld_localize(x, lang, page) for x in node]
    if isinstance(node, dict):
        out = {}
        for k, v in node.items():
            if k == 'inLanguage' and isinstance(v, str):
                out[k] = D.LD_LANG[lang]; continue
            if k == 'name' and isinstance(v, str) and v in D.LD_TEXT:
                out[k] = D.LD_TEXT[v][0 if lang == 'en' else 1]; continue
            out[k] = ld_localize(v, lang, page)
        return out
    if isinstance(node, str):
        if node in D.LD_TEXT:
            return D.LD_TEXT[node][0 if lang == 'en' else 1]
        if node == D.BASE + '/prenota':
            return url('book', lang)
        if node in (D.BASE + '/menu', D.BASE + '/menu#menu'):
            return D.BASE + D.MENU_URL[lang] + ('#menu' if node.endswith('#menu') else '')
        if node == D.BASE + '/dove-siamo':
            return url('where', lang)
    return node

def set_meta(soup, attr, key, value):
    el = soup.find('meta', attrs={attr: key})
    if el is None:
        return
    el['content'] = value

def strip_comments(soup):
    for c in soup.find_all(string=lambda t: isinstance(t, Comment)):
        c.extract()

def translate_texts(soup, lang, skip_i18n):
    """Traduce nodi di testo e attributi con D.TEXT; segnala i testi italiani non coperti."""
    idx = 0 if lang == 'en' else 1
    untranslated = []
    for node in list(soup.find_all(string=True)):
        if isinstance(node, Comment) or node.parent.name in ('script', 'style', 'title'):
            continue
        if skip_i18n and node.find_parent(attrs={'data-i18n': True}):
            continue
        raw = str(node)
        key = norm(raw)
        if not key:
            continue
        if key in D.TEXT:
            lead = raw[:len(raw) - len(raw.lstrip())]
            trail = raw[len(raw.rstrip()):]
            node.replace_with(NavigableString(lead + D.TEXT[key][idx] + trail))
    for el in soup.find_all(True):
        for a in ('alt', 'aria-label', 'title', 'placeholder'):
            v = el.get(a)
            if v and norm(v) in D.TEXT:
                el[a] = D.TEXT[norm(v)][idx]
    return untranslated

def italian_leftovers(soup, page):
    """Nodi di testo visibili che sembrano ancora italiani (euristica a parole-spia)."""
    spy = re.compile(r"\b(gli|della|delle|nel|nella|sono|siamo|nostri|nostre|tavolo|chiuso|aperto|oggi|ristorante|prenota\w*|cucina|pesce)\b", re.I)
    out = []
    for node in soup.find_all(string=True):
        if isinstance(node, Comment) or node.parent.name in ('script', 'style', 'title', 'noscript'):
            continue
        t = norm(str(node))
        if 'P.IVA' in t:
            continue   # riga legale: resta com'è
        if len(t) > 12 and len(spy.findall(t)) >= 1:
            out.append(t[:90])
    return out

def build_nav_current(soup, lang):
    for nav in soup.select('.lang-switch'):
        for a in nav.find_all('a'):
            if a.get('lang') == lang:
                a['aria-current'] = 'true'
            elif a.has_attr('aria-current'):
                del a['aria-current']

def add_hreflang(soup, page, lang):
    head = soup.head
    for l in head.find_all('link', rel='alternate'):
        if l.get('hreflang'):
            l.extract()
    canon = head.find('link', rel='canonical')
    canon['href'] = url(page, lang)
    anchor = canon
    for hl, target in (('it', url(page, 'it')), ('en', url(page, 'en')), ('fr', url(page, 'fr')), ('x-default', url(page, 'it'))):
        tag = soup.new_tag('link', rel='alternate', hreflang=hl, href=target)
        anchor.insert_after(tag)
        anchor = tag

# ── FAQ JSON-LD (come buildFaqJsonLd in index.html) ──────────────────────────────────────────
def strip_html(h):
    return norm(BeautifulSoup(h, 'html.parser').get_text())

def faq_jsonld(t, lang):
    ents = []
    for i in range(1, 12):
        q, a = t.get('faq_q%d' % i), t.get('faq_a%d' % i)
        if q is None or a is None:
            continue
        ld = t.get('faqld_a%d' % i)
        ents.append({'@type': 'Question', 'name': strip_html(q),
                     'acceptedAnswer': {'@type': 'Answer', 'text': strip_html(ld if ld is not None else a)}})
    return {'@context': 'https://schema.org', '@type': 'FAQPage', '@id': D.BASE + '/#faq',
            'inLanguage': {'en': 'en-US', 'fr': 'fr-FR'}[lang], 'mainEntity': ents}

def banner_t(src):
    """Estrae BANNER_T (banner cena a tema) dal JS di index.html."""
    m = re.search(r'var BANNER_T = \{(.*?)\n  \};', src, re.S)
    res = {}
    for lm in re.finditer(r"(\w+): \{([^}]*)\}", m.group(1)):
        res[lm.group(1)] = dict(re.findall(r"(\w+): '((?:[^'\\]|\\.)*)'", lm.group(2)))
    return res

# ── Generazione di una pagina ────────────────────────────────────────────────────────────────
def build(page, lang):
    p = D.PAGES[page]
    src = read(p['src'])
    soup = BeautifulSoup(src, 'html.parser')
    html_el = soup.html
    html_el['lang'] = lang
    meta = D.META.get(page, {}).get(lang)
    T = None
    if page == 'home':
        T = json.load(open(os.path.join(ROOT, 'translations.json'), encoding='utf-8'))[lang]
        for k, v in banner_t(src).get(lang, {}).items():
            T[k] = v
        # testo da data-i18n (innerHTML) e attributi collegati
        for el in soup.find_all(attrs={'data-i18n': True}):
            key = el['data-i18n']
            if key in T:
                el.clear()
                el.append(BeautifulSoup(T[key], 'html.parser'))
            else:
                problems.append('%s/%s: chiave data-i18n senza traduzione: %s' % (page, lang, key))
        for attr, tgt in (('data-i18n-placeholder', 'placeholder'), ('data-i18n-label', 'label')):
            for el in soup.find_all(attrs={attr: True}):
                if el[attr] in T:
                    el[tgt] = html.unescape(T[el[attr]])   # niente entity letterali (bug setAttribute)
        title = html.unescape(T['page_title']); desc = html.unescape(T['page_description'])
        soup.title.string = title
        set_meta(soup, 'name', 'description', desc)
        set_meta(soup, 'property', 'og:title', title); set_meta(soup, 'property', 'og:description', desc)
        set_meta(soup, 'name', 'twitter:title', title); set_meta(soup, 'name', 'twitter:description', desc)
        # bottoni menu
        mb = soup.find(id='menu-btn')
        if mb and T.get('cucina_btn_link'):
            mb['href'] = '/' + T['cucina_btn_link']
        db = soup.find(id='dolci-btn')
        if db:
            db['style'] = 'display:none'
    elif meta:
        soup.title.string = meta['title']
        set_meta(soup, 'name', 'description', meta['description'])
        if 'og_title' in meta:
            set_meta(soup, 'property', 'og:title', meta['og_title'])
            set_meta(soup, 'property', 'og:description', meta['og_description'])

    # markup misto (prima dei nodi di testo)
    idx = 0 if lang == 'en' else 1
    for sel, vals in D.HTML_BY_SELECTOR.get(page, {}).items():
        els = soup.select(sel)
        if not els:
            problems.append('%s/%s: selettore non trovato: %s' % (page, lang, sel)); continue
        for el in els:
            el.clear(); el.append(BeautifulSoup(vals[idx], 'html.parser'))

    translate_texts(soup, lang, skip_i18n=(page == 'home'))

    # JSON-LD
    for sc in soup.find_all('script', type='application/ld+json'):
        data = json.loads(sc.string)
        if data.get('@type') == 'FAQPage':
            if T is None:
                continue
            data = faq_jsonld(T, lang)
        else:
            data = ld_localize(data, lang, page)
            if data.get('@id', '').endswith('#webpage'):
                data['url'] = url(page, lang); data['name'] = soup.title.string
            elif data.get('@type') == 'WebSite':
                data['url'] = D.BASE + '/'
            elif data.get('@type') == 'Restaurant':
                data['url'] = D.BASE + '/'
        sc.string = '\n' + json.dumps(data, ensure_ascii=False, indent=2) + '\n'

    # meta: og/locale/url e hreflang
    set_meta(soup, 'property', 'og:locale', D.LOCALE[lang])
    set_meta(soup, 'property', 'og:url', url(page, lang))
    add_hreflang(soup, page, lang)
    # og:image:alt
    oia = soup.find('meta', attrs={'property': 'og:image:alt'})
    if oia and norm(oia['content']) in D.TEXT:
        oia['content'] = D.TEXT[norm(oia['content'])][idx]

    # link interni nella lingua + URL assolute
    for el in soup.find_all(['a', 'link', 'script', 'img', 'source', 'iframe', 'form']):
        for a in ('href', 'src', 'action'):
            v = el.get(a)
            if not v or el.name == 'link' and el.get('rel') == ['alternate']:
                continue
            if el.name == 'a' and el.parent and 'lang-switch' in (el.parent.get('class') or []):
                continue
            if el.name == 'link' and el.get('rel') in (['canonical'],):
                continue
            nv = localize_href(v, lang, T)
            if nv != v:
                el[a] = nv

    # selettore lingua: voce corrente
    build_nav_current(soup, lang)

    # CSS specifico di pagina: etichetta "oggi" della tabella orari (dove-siamo)
    for st in soup.find_all('style'):
        if st.string and 'content: "  oggi"' in st.string:
            st.string = st.string.replace('content: "  oggi"', 'content: "  %s"' % ('today' if lang == 'en' else 'aujourd\\2019hui'))

    strip_comments(soup)
    out = re.sub(r'\n{3,}', '\n\n', str(soup))
    banner = ('<!-- GENERATA da scripts/build_lang_pages.py (%s) da %s e translations.json: non modificare a mano -->\n' % (VERSION, p['src']))
    if out.lower().startswith('<!doctype'):
        first, rest = out.split('\n', 1) if '\n' in out else (out, '')
        out = first + '\n' + banner + rest
    else:
        out = banner + out
    left = italian_leftovers(soup, page)
    for t in left:
        problems.append('%s/%s: testo ancora italiano? "%s"' % (page, lang, t))
    return out

# ── sitemap.xml: coppie hreflang ─────────────────────────────────────────────────────────────
def update_sitemap():
    p = os.path.join(ROOT, 'sitemap.xml')
    s = read('sitemap.xml')
    # rimuove blocchi <url> delle pagine generate (idempotente) e le xhtml:link di home/dove-siamo/prenota
    for page in ('home', 'where', 'book'):
        for lang in ('en', 'fr'):
            s = re.sub(r'\n  <url>\s*<loc>%s</loc>.*?</url>' % re.escape(url(page, lang)), '', s, flags=re.S)
    def block(page, lang, lastmod, prio):
        links = ''.join('\n    <xhtml:link rel="alternate" hreflang="%s" href="%s"/>' % (hl, url(page, hl if hl != 'x-default' else 'it'))
                        for hl in ('it', 'en', 'fr', 'x-default'))
        return '\n  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n    <priority>%s</priority>%s\n  </url>' % (url(page, lang), lastmod, prio, links)
    lastmod = '2026-10-07'
    for page, prio in (('home', '0.9'), ('where', '0.6'), ('book', '0.7')):
        # aggiunge/aggiorna le alternate della versione italiana
        loc = re.escape(url(page, 'it'))
        m = re.search(r'(<url>\s*<loc>%s</loc>)(.*?)(</url>)' % loc, s, re.S)
        if not m:
            problems.append('sitemap: manca la voce IT di %s' % page); continue
        body = re.sub(r'\s*<xhtml:link[^>]*/>', '', m.group(2))
        links = ''.join('\n    <xhtml:link rel="alternate" hreflang="%s" href="%s"/>' % (hl, url(page, hl if hl != 'x-default' else 'it'))
                        for hl in ('it', 'en', 'fr', 'x-default'))
        s = s[:m.start()] + m.group(1) + body.rstrip() + links + '\n  ' + m.group(3) + s[m.end():]
    # accoda i blocchi EN/FR prima di </urlset>
    add = ''.join(block(page, lang, lastmod, prio) for page, prio in (('home', '0.8'), ('where', '0.5'), ('book', '0.6')) for lang in ('en', 'fr'))
    s = s.replace('\n</urlset>', add + '\n</urlset>')
    s = re.sub(r'<!-- v [\d.]+: \+pagine /en/ e /fr/[^\n]*-->\n', '', s)
    s = re.sub(r'<!-- Santamonica Web — sitemap.xml — v [\d.]+ -->', '<!-- Santamonica Web — sitemap.xml — %s -->\n<!-- %s: +pagine /en/ e /fr/ (home, dove siamo, prenota) con coppie hreflang it/en/fr/x-default, generate da scripts/build_lang_pages.py. -->' % (VERSION, VERSION), s, count=1)
    return p, s

def main():
    outputs = {}
    for page, p in D.PAGES.items():
        for lang in ('en', 'fr'):
            outputs[p['out'][lang]] = build(page, lang)
    sm_path, sm = update_sitemap()
    outputs['sitemap.xml'] = sm
    stale = []
    for rel, content in outputs.items():
        path = os.path.join(ROOT, rel)
        old = open(path, encoding='utf-8', newline='').read().replace('\r\n', '\n') if os.path.exists(path) else None
        if old != content:
            stale.append(rel)
            if not CHECK:
                os.makedirs(os.path.dirname(path), exist_ok=True)
                open(path, 'w', encoding='utf-8', newline='\n').write(content)
    for pr in problems:
        print('ATTENZIONE:', pr)
    if CHECK:
        print('da rigenerare:' if stale else 'allineato.', ', '.join(stale))
        sys.exit(1 if stale or problems else 0)
    print('scritti: ' + ', '.join(stale) if stale else 'nessuna modifica')

main()
