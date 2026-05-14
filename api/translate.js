// api/translate.js — v 2026.05.14.01
// Vercel Serverless Function: proxy per DeepL API.
// Bypassa il blocco CORS che impedisce le chiamate dirette dal browser
// (DeepL API non risponde con Access-Control-Allow-Origin per i client browser).
//
// Setup richiesto su Vercel:
//   Settings → Environment Variables → DEEPL_KEY = <la tua chiave DeepL ...:fx>
//
// Uso lato admin:
//   POST https://santa-web-peach.vercel.app/api/translate
//   Body JSON: { "text": "Ciao mondo", "target_lang": "EN-GB" }
//   Risposta:  { "translations": [ { "text": "Hello world" } ] }

export default async function handler(req, res) {
  // ── CORS: consenti chiamate dall'admin sia su Vercel sia su GitHub Pages
  const allowedOrigins = [
    'https://santamonicagenova-a11y.github.io',
    'https://santa-web-peach.vercel.app',
    'https://santamonicagenova.it'
  ];
  const origin = req.headers.origin || '';
  if (allowedOrigins.some(o => origin === o || origin.startsWith(o + '/'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.DEEPL_KEY;
  if (!key) {
    return res.status(500).json({ error: 'DEEPL_KEY env variable non configurata su Vercel' });
  }

  // Vercel parsa automaticamente il body JSON, ma a volte arriva come stringa: gestisco entrambi
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const { text, target_lang } = body || {};
  if (!text || !target_lang) {
    return res.status(400).json({ error: 'Parametri mancanti: text e target_lang sono richiesti' });
  }

  try {
    const params = new URLSearchParams({
      text: text,
      source_lang: 'IT',
      target_lang: target_lang,
      tag_handling: 'html',
      preserve_formatting: '1'
    });

    const r = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': 'DeepL-Auth-Key ' + key,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => '');
      // Propaga lo status DeepL al client per gestione differenziata
      return res.status(r.status).json({
        error: 'DeepL ' + r.status,
        status: r.status,
        detail: errText.slice(0, 300)
      });
    }

    const data = await r.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(502).json({
      error: 'Proxy fetch error',
      message: String(err && err.message || err)
    });
  }
}
