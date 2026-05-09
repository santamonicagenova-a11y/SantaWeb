// foto-optimizer.js — v 2026.05.09.02
// Ottimizzazione immagini per repo SantaWeb (Canvas API → WebP).
//
// API pubblica (window.*):
//   ottimizzaImmagine(dataUrl, callback)            → WebP qualità alta, max 1920px, q=0.90
//                                                     (usata per Hero / Cucina / Cantina sito)
//   ottimizzaImmagineFullGalleria(dataUrl, cb)      → WebP "full" per lightbox, max 2400px, q=0.90
//   ottimizzaImmagineThumb(dataUrl, cb)             → WebP thumbnail, max 800px, q=0.82
//   ottimizzaImmagineDoppia(dataUrl, cb)            → cb({ full, thumb }) — per gallerie con lightbox
//
// Tutti i callback ricevono SOLO la parte base64 (senza prefisso "data:image/webp;base64,").
// In caso di errore: callback(null) — oppure { full:null, thumb:null } per la doppia.
//
// Cambiamenti rispetto alla versione precedente (q=0.75):
//  - Qualità innalzata a 0.90 per ridurre artefatti visivi su pannelli grandi
//  - Limite dimensione massima 1920/2400 (prima era libero/non documentato)
//  - Smoothing alto in fase di resize per nitidezza
//  - Aggiunte ottimizzaImmagineThumb e ottimizzaImmagineDoppia per pattern thumb+full

(function (global) {
  'use strict';

  function _processImage(dataUrl, maxW, quality, callback) {
    if (!dataUrl) { callback(null); return; }
    var img = new Image();
    img.onload = function () {
      var w = img.width, h = img.height;
      if (!w || !h) { callback(null); return; }
      if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
      var canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      var ctx = canvas.getContext('2d');
      // Smoothing alta qualità per ridimensionamento nitido
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      try {
        var url = canvas.toDataURL('image/webp', quality);
        if (!url || url.indexOf('data:image/webp') !== 0) {
          // Browser non supporta encoding WebP — fallback impossibile mantenendo lo schema attuale
          callback(null);
          return;
        }
        callback(url.split(',')[1]);
      } catch (e) {
        callback(null);
      }
    };
    img.onerror = function () { callback(null); };
    img.src = dataUrl;
  }

  // === API ===

  // Foto singola alta qualità (Hero / Cucina / Cantina sito)
  global.ottimizzaImmagine = function (dataUrl, callback) {
    _processImage(dataUrl, 1920, 0.90, callback);
  };

  // Foto "full" per galleria — più grande perché aperta nel lightbox
  global.ottimizzaImmagineFullGalleria = function (dataUrl, callback) {
    _processImage(dataUrl, 2400, 0.90, callback);
  };

  // Thumbnail (visualizzata in griglia)
  global.ottimizzaImmagineThumb = function (dataUrl, callback) {
    _processImage(dataUrl, 800, 0.82, callback);
  };

  // Doppia esportazione per galleria: { full, thumb } in parallelo
  global.ottimizzaImmagineDoppia = function (dataUrl, callback) {
    var result = { full: null, thumb: null };
    var done = 0;
    function check() { done++; if (done === 2) callback(result); }
    global.ottimizzaImmagineFullGalleria(dataUrl, function (b) { result.full = b; check(); });
    global.ottimizzaImmagineThumb(dataUrl, function (b) { result.thumb = b; check(); });
  };

})(window);
