/**
 * gnb.js — GNB 카테고리 팝업 열기/닫기
 *
 * gnbOpen()  — ic_menu 버튼 클릭 시 호출 (header.html에 연결됨)
 * gnbClose() — ic_close_XL 버튼 클릭 시 호출 (gnb.html 내부에 연결됨)
 */
(function () {
  function getPopup() {
    return document.getElementById('gnb-popup');
  }

  window.gnbOpen = function () {
    var popup = getPopup();
    if (!popup) return;
    popup.classList.add('is-open');
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.gnbClose = function () {
    var popup = getPopup();
    if (!popup) return;
    popup.classList.remove('is-open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { window.gnbClose(); }
  });
})();
