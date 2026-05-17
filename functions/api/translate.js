// functions/api/translate.js
// Proxy DeepL per Cloudflare Pages Functions
// v 2026.05.17.02 — added pages.dev to CORS allowlist (F0.1b done)

export async function onRequest(context) {
  const { request, env } = context;

  // CORS allowlist
  const allowedOrigins = [
    'https://santamonicagenova-a11y.github.io',
    'https://santa-web-peach.vercel.app',
    'https://santamonicagenova.it',
    'https://nuovo.santamonicagenova.it',
    'https://santamonica-web.pages.dev'
  ];
  const origin = request.headers.get('origin') || '';
  const corsHeaders = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  if (allowedOrigins.some(o => origin === o || origin.startsWith(o + '/'))) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  }

  // Preflight CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Method gate
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Env check
  const key = env.DEEPL_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: 'DEEPL_KEY env variable non configurata' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Body parsing
  let body;
  try {
    body = await request.json();
  } catch (e) {
    body = {};
  }
  const { text, target_lang } = body || {};
  if (!text || !target_lang) {
    return new Response(JSON.stringify({ error: 'text e target_lang richiesti' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // DeepL call
  const params = new URLSearchParams({
    text,
    source_lang: 'IT',
    target_lang,
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
    return new Response(JSON.stringify({ error: 'DeepL ' + r.status, detail: errText.slice(0, 300) }), {
      status: r.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  const data = await r.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}
// Fine functions/api/translate.js · v 2026.05.17.01
