/**
 * include.js — header / footer fetch 인클루드
 *
 * 사용법: 각 HTML 페이지에서 이 스크립트를 불러오기 전에
 *   <script>var ROOT_PATH = './';</script>          ← 루트 페이지
 *   <script>var ROOT_PATH = '../';</script>          ← 하위 폴더 페이지 (예: member/)
 *
 * 지원 토큰:
 *   {ROOT}  — ROOT_PATH 값으로 치환 (아이콘 경로 등)
 *   {TITLE} — data-include-title 속성값으로 치환 (서브 헤더 타이틀)
 *
 * 사용 예:
 *   <header data-include="header"></header>
 *   <header data-include="header-back" data-include-title="로그인"></header>
 *   <footer data-include="footer"></footer>
 */
(function () {
  var ROOT = (typeof window.ROOT_PATH !== 'undefined') ? window.ROOT_PATH : './';

  function run() {
    var elements = document.querySelectorAll('[data-include]');
    elements.forEach(function (el) {
      var name  = el.getAttribute('data-include');
      var title = el.getAttribute('data-include-title') || '';
      var file  = name + '.html';
      fetch(ROOT + 'inc/' + file)
        .then(function (r) {
          if (!r.ok) throw new Error(file + ' load failed: ' + r.status);
          return r.text();
        })
        .then(function (html) {
          var temp = document.createElement('div');
          temp.innerHTML = html.trim()
            .replace(/\{ROOT\}/g, ROOT)
            .replace(/\{TITLE\}/g, title);
          el.parentNode.replaceChild(temp.firstElementChild, el);
        })
        .catch(function (e) { console.warn('[include.js]', e); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
