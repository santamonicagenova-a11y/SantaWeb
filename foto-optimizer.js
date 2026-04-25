// foto-optimizer.js — Ottimizzazione immagini WebP per menu-admin.html
// v 2026.04.25.01

/**
 * FUNZIONI DI COMPRESSIONE/OTTIMIZZAZIONE IMMAGINI
 * 
 * Workflow:
 * 1. Utente seleziona foto JPG
 * 2. Carica in fotoDati come Base64 (preview)
 * 3. Al publish: ridimensiona + converte WebP
 * 4. Carica WebP ottimizzato su GitHub
 * 5. Aggiorna gallery-photos.json
 */

// Configurazione
var FOTO_CONFIG = {
  maxWidth: 400,        // pixel, mobile-first
  maxHeight: 600,       // pixel
  quality: 0.75,        // 75% qualità WebP
  format: 'image/webp'
};

/**
 * Ridimensiona + converte un'immagine a WebP
 * @param {string} dataUrl - Data URL immagine (base64)
 * @param {function} callback - (webpBase64String) =>
 */
function ottimizzaImmagine(dataUrl, callback) {
  var img = new Image();
  img.onload = function() {
    // Calcola dimensioni ridimensionate (mantenendo aspect ratio)
    var newW = img.width, newH = img.height;
    if (newW > FOTO_CONFIG.maxWidth) {
      var ratio = FOTO_CONFIG.maxWidth / newW;
      newW = FOTO_CONFIG.maxWidth;
      newH = Math.round(newH * ratio);
    }
    if (newH > FOTO_CONFIG.maxHeight) {
      var ratio = FOTO_CONFIG.maxHeight / newH;
      newH = FOTO_CONFIG.maxHeight;
      newW = Math.round(newW * ratio);
    }

    // Canvas
    var canvas = document.createElement('canvas');
    canvas.width = newW;
    canvas.height = newH;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, newW, newH);

    // Converti a WebP
    canvas.toBlob(function(blob) {
      if (!blob) {
        console.error('Errore conversione WebP');
        callback(null);
        return;
      }
      // Leggi blob come Base64
      var reader = new FileReader();
      reader.onload = function(e) {
        var webpBase64 = e.target.result.split(',')[1];
        callback(webpBase64);
      };
      reader.readAsDataURL(blob);
    }, FOTO_CONFIG.format, FOTO_CONFIG.quality);
  };
  img.onerror = function() {
    console.error('Errore caricamento immagine');
    callback(null);
  };
  img.src = dataUrl;
}

/**
 * Versione asincrona (Promise) — da usare con async/await
 */
function ottimizzaImmagineAsync(dataUrl) {
  return new Promise(function(resolve, reject) {
    ottimizzaImmagine(dataUrl, function(webpBase64) {
      if (webpBase64) resolve(webpBase64);
      else reject(new Error('Compressione immagine fallita'));
    });
  });
}

/**
 * Estrai metadati file originale (dimensioni, dimensione file)
 */
function getMetadataFoto(file) {
  var sizeKB = (file.size / 1024).toFixed(1);
  return {
    nome: file.name,
    sizeKB: sizeKB,
    type: file.type
  };
}

/**
 * Mostra info compressione in UI (dopo ottimizzazione)
 */
function mostraRisparmio(origSizeKB, compressSizeKB, elementId) {
  var risparmio = (100 * (1 - compressSizeKB / origSizeKB)).toFixed(1);
  var el = document.getElementById(elementId);
  if (el) {
    el.innerHTML = '✓ Ottimizzato: ' + compressSizeKB + ' KB (era ' + origSizeKB + ' KB, -' + risparmio + '%)';
    el.style.color = '#2d6a4f';
  }
}
