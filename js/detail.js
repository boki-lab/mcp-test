/**
 * detail.js — 상품 상세 페이지 인터랙션
 */
(function () {
  'use strict';

  function qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function qsa(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

  /* ─────────────────────────────
   * 1. 메인 이미지 슬라이더 (스와이프)
   * ───────────────────────────── */
  var mainSlider = (function () {
    var track, total, curEl, current = 0;
    var startX = 0, isDragging = false, dragDelta = 0;

    function moveTo(idx) {
      idx = Math.max(0, Math.min(total - 1, idx));
      current = idx;
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      if (curEl) curEl.textContent = idx + 1;
      /* 썸네일 동기화 */
      qsa('.pd-thum-slider__item').forEach(function (btn, i) {
        btn.classList.toggle('is-active', i === idx);
      });
    }

    function onStart(e) {
      startX = e.touches ? e.touches[0].clientX : e.clientX;
      isDragging = true; dragDelta = 0;
      track.style.transition = 'none';
    }
    function onMove(e) {
      if (!isDragging) return;
      dragDelta = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
      track.style.transform = 'translateX(calc(-' + (current * 100) + '% + ' + dragDelta + 'px))';
    }
    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform 0.3s ease';
      if (dragDelta < -50) moveTo(current + 1);
      else if (dragDelta > 50) moveTo(current - 1);
      else moveTo(current);
    }

    function init() {
      var wrap = qs('#pdImgSlider');
      if (!wrap) return;
      track = qs('#pdImgTrack');
      total = qsa('.pd-img-slider__item').length;
      curEl = qs('#pdSliderCur');

      wrap.addEventListener('touchstart', onStart, { passive: true });
      wrap.addEventListener('touchmove',  onMove,  { passive: true });
      wrap.addEventListener('touchend',   onEnd);
      wrap.addEventListener('mousedown',  onStart);
      document.addEventListener('mousemove', function (e) { if (isDragging) onMove(e); });
      document.addEventListener('mouseup',   function ()  { if (isDragging) onEnd(); });
    }

    return { init: init, moveTo: moveTo };
  })();

  /* ─────────────────────────────
   * 2. 썸네일 클릭 → 메인 이미지
   * ───────────────────────────── */
  function initThumbnails() {
    qsa('.pd-thum-slider__item').forEach(function (btn) {
      btn.addEventListener('click', function () {
        mainSlider.moveTo(parseInt(btn.dataset.index, 10));
      });
    });
  }

  /* ─────────────────────────────
   * 3. 탭 Sticky + 섹션 스크롤
   * ───────────────────────────── */
  var tabCtrl = (function () {
    var tab, dummy, HEADER_H = 60, TAB_H = 40;

    function offsetTop(el) {
      var top = 0;
      while (el) { top += el.offsetTop; el = el.offsetParent; }
      return top;
    }

    function setActive(id) {
      qsa('.pd-tab__item').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.dataset.target === id);
      });
    }

    function onScroll() {
      if (!tab) return;
      var tabPos = dummy.classList.contains('is-visible')
        ? offsetTop(dummy)
        : offsetTop(tab);

      var shouldFix = window.scrollY + HEADER_H >= tabPos;
      tab.classList.toggle('is-fixed', shouldFix);
      dummy.classList.toggle('is-visible', shouldFix);

      /* 현재 섹션 활성화 (아래에서부터 체크) */
      var OFFSET = HEADER_H + TAB_H + 10;
      var ids = ['sec-qna', 'sec-review', 'sec-info'];
      var active = 'sec-info';
      for (var i = 0; i < ids.length; i++) {
        var sec = qs('#' + ids[i]);
        if (sec && window.scrollY + OFFSET >= offsetTop(sec)) {
          active = ids[i]; break;
        }
      }
      setActive(active);
    }

    function init() {
      tab   = qs('#pdTab');
      dummy = qs('#pdTabDummy');
      if (!tab) return;

      qsa('.pd-tab__item').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var sec = qs('#' + btn.dataset.target);
          if (!sec) return;
          var top = offsetTop(sec) - HEADER_H - TAB_H;
          window.scrollTo({ top: top, behavior: 'smooth' });
        });
      });

      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    return { init: init };
  })();

  /* ─────────────────────────────
   * 4. 상품 상세 더보기 (아코디언)
   * ───────────────────────────── */
  function initDetailMore() {
    var area    = qs('#pdImgArea');
    var btn     = qs('#pdMoreBtn');
    var textEl  = qs('#pdMoreText');
    var iconEl  = qs('#pdMoreIcon');
    if (!area || !btn) return;

    /* 콘텐츠가 400px 이하면 버튼 불필요 */
    function checkHeight() {
      /* 이미지 로드 완료 후 체크 */
      var imgs = area.querySelectorAll('img');
      var total = imgs.length, done = 0;
      function check() {
        done++;
        if (done < total) return;
        if (area.scrollHeight <= 400) {
          area.classList.remove('is-collapsed');
          btn.classList.add('is-hidden');
        }
      }
      imgs.forEach(function (img) {
        if (img.complete) check();
        else img.addEventListener('load', check);
      });
    }
    checkHeight();

    var open = false;
    btn.addEventListener('click', function () {
      open = !open;
      area.classList.toggle('is-collapsed', !open);
      btn.classList.toggle('is-open', open);
      if (textEl) textEl.textContent = open ? '상품 상세 접기' : '상품 상세 더보기';
    });
  }

  /* ─────────────────────────────
   * 5. 유튜브 썸네일 → iframe
   * ───────────────────────────── */
  function initYoutube() {
    var thumb = qs('#youtubeThumb');
    if (!thumb) return;
    thumb.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/Fn5uWTW9AZ0?autoplay=1&rel=0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;';
      thumb.innerHTML = '';
      thumb.appendChild(iframe);
      thumb.style.cursor = 'default';
    });
  }

  /* ─────────────────────────────
   * 6. 상세 아코디언 (배송정보 등)
   * ───────────────────────────── */
  window.toggleDetailAccordion = function (headerBtn) {
    var body   = headerBtn.nextElementSibling;
    var isOpen = body.classList.toggle('is-open');
    headerBtn.classList.toggle('is-open', isOpen);
  };

  /* ─────────────────────────────
   * 7. QnA 아코디언
   * ───────────────────────────── */
  window.toggleQnaAccordion = function (headerBtn) {
    var body   = headerBtn.nextElementSibling;
    var isOpen = body.classList.toggle('is-open');
    headerBtn.classList.toggle('is-open', isOpen);
  };

  /* ─────────────────────────────
   * 8. QnA 더보기 버튼
   * ───────────────────────────── */
  window.toggleQnaMore = function () {
    var hidden  = qsa('.qna-item--hidden');
    var btn     = qs('#qnaMoreBtn');
    var textEl  = qs('#qnaMoreText');
    var iconEl  = qs('#qnaMoreIcon');
    var isOpen  = btn.classList.toggle('is-open');

    hidden.forEach(function (item) {
      item.hidden = !isOpen;
    });
    if (textEl) textEl.textContent = isOpen ? '접기' : '더보기';
    if (iconEl) iconEl.style.transform = isOpen ? 'rotate(180deg)' : '';
  };

  /* ─────────────────────────────
   * 초기화
   * ───────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    mainSlider.init();
    initThumbnails();
    tabCtrl.init();
    initDetailMore();
    initYoutube();
  });

})();
