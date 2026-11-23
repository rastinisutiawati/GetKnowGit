/**
 * script.js — GetKnowGit
 * -------------------------------------------------------
 * 1. Tombol Copy: menyalin teks perintah Git ke clipboard
 *    dan menampilkan feedback "Tersalin!" sementara.
 * 2. Sorotan kartu tahap: menambahkan class .is-active
 *    pada kartu Alur 4 Tahap Git yang diklik, dan
 *    menghapusnya dari kartu lain (single-active).
 * -------------------------------------------------------
 */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. TOMBOL COPY
     Mendelegasikan event ke document sehingga bekerja pada
     semua .copy-btn yang ada di halaman, baik di kartu tahap
     maupun di kartu rangkuman.
  ---------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.copy-btn');
    if (!btn) return;

    var textToCopy = btn.getAttribute('data-copy');
    if (!textToCopy) return;

    /* Gunakan Clipboard API modern jika tersedia */
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textToCopy).then(function () {
        showCopied(btn);
      }).catch(function () {
        fallbackCopy(textToCopy, btn);
      });
    } else {
      /* Fallback execCommand untuk browser/lingkungan lama */
      fallbackCopy(textToCopy, btn);
    }
  });

  /**
   * Ubah label tombol menjadi "Tersalin!" selama 1,5 detik,
   * lalu kembalikan ke teks asli.
   * @param {HTMLElement} btn
   */
  function showCopied(btn) {
    var original = btn.textContent;
    btn.textContent = 'Tersalin!';
    btn.classList.add('copied');
    btn.disabled = true;

    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('copied');
      btn.disabled = false;
    }, 1500);
  }

  /**
   * Fallback copy menggunakan textarea + execCommand.
   * @param {string} text
   * @param {HTMLElement} btn
   */
  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showCopied(btn);
    } catch (err) {
      /* Senyapkan – tidak ada aksi lebih lanjut */
    }
    document.body.removeChild(ta);
  }

  /* ----------------------------------------------------------
     2. SOROTAN KARTU TAHAP (Alur 4 Tahap Git)
     Klik pada .stage-card → tambah class .is-active.
     Klik ulang kartu yang sama → hapus sorotan (toggle).
     Klik kartu lain → pindahkan sorotan.
  ---------------------------------------------------------- */
  var stagesGrid = document.querySelector('.stages-grid');
  if (stagesGrid) {
    stagesGrid.addEventListener('click', function (e) {
      var card = e.target.closest('.stage-card');
      if (!card) return;

      /* Jika tombol Copy diklik di dalam kartu, abaikan sorotan */
      if (e.target.closest('.copy-btn')) return;

      var isAlreadyActive = card.classList.contains('is-active');

      /* Hapus sorotan dari semua kartu tahap */
      var allCards = stagesGrid.querySelectorAll('.stage-card');
      allCards.forEach(function (c) {
        c.classList.remove('is-active');
      });

      /* Toggle: aktifkan hanya jika belum aktif */
      if (!isAlreadyActive) {
        card.classList.add('is-active');
      }
    });
  }

})();
