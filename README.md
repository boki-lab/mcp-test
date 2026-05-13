# 스룩페이 FR (Front-end Reference)

## 개발 주의사항

### 1. 스타일 가이드 기준으로 코딩

모든 HTML 파일은 `style-guide.html`에 정의된 CSS 클래스 체계를 기준으로 작성합니다.

- CSS 변수는 `css/style.css`의 `:root` 변수 사용 (`--font-darkgray`, `--main-red` 등)
- 타이포그래피: `.headline1-bold`, `.contents2-regular` 등 정의된 클래스 사용
- 컴포넌트: `.btn`, `.input`, `.input-group`, `.header`, `.footer` 등 기존 컴포넌트 클래스 재사용
- 신규 클래스가 필요한 경우 `css/style.css` 하단에 섹션 구분 후 추가

---

### 2. 헤더 / 푸터는 스크립트로 불러오기

헤더와 푸터는 직접 HTML에 작성하지 않고 `include.js`를 통해 불러옵니다.

**메인 헤더** (로고 + 검색/장바구니 아이콘):
```html
<header data-include="header"></header>
```

**서브 헤더** (뒤로가기 + 타이틀, 서브페이지 공통):
```html
<header data-include="header-back" data-include-title="페이지명"></header>
```

**푸터**:
```html
<footer data-include="footer"></footer>
```

각 HTML 파일 하단에 `ROOT_PATH`를 반드시 설정하고 `include.js`를 로드합니다.

```html
<!-- 루트 경로 페이지 (index.html 등) -->
<script>var ROOT_PATH = './';</script>
<script src="js/include.js"></script>

<!-- 하위 폴더 페이지 (member/login.html 등 1단계) -->
<script>var ROOT_PATH = '../';</script>
<script src="../js/include.js"></script>
```

---

### 3. PC 428px 고정 / 모바일 반응형

- **PC**: `max-width: 428px` 고정 너비, 가운데 정렬, 외부 배경 `#f4f4f4`
- **모바일 (428px 이하)**: 전체 너비, 배경 흰색

`css/style.css`의 `.page-wrap` 클래스와 미디어쿼리가 처리합니다.
모든 콘텐츠는 반드시 `.page-wrap` 내부에 작성합니다.

```html
<div class="page-wrap">
  <!-- 콘텐츠 -->
</div>
```

---

---

### 4. GNB 카테고리 팝업

#### 구조 및 파일
- `inc/gnb.html` — GNB 팝업 HTML (로그인/로그아웃/비회원 top_box + 카테고리 메뉴)
- `js/gnb.js` — 팝업 open/close 제어 함수

#### 페이지에 GNB 적용하는 방법
GNB가 필요한 페이지에서 `</body>` 직전에 아래를 추가합니다.

```html
<!-- GNB include -->
<div data-include="gnb"></div>

<script>var ROOT_PATH = './';</script>
<script src="js/include.js"></script>
<script src="js/gnb.js"></script>  ← 반드시 include.js 뒤에 로드
```

#### ic_menu 클릭 → GNB 열기
`inc/header.html`의 메뉴 버튼에 `onclick="gnbOpen()"`이 연결되어 있습니다.
메인 헤더(`data-include="header"`)를 사용하는 모든 페이지에서 자동으로 동작합니다.

```html
<!-- inc/header.html 내부 -->
<button class="header__btn" onclick="gnbOpen()" aria-label="메뉴">
  <img src="{ROOT}icon/header/ic_menu.svg" ...>
</button>
```

#### ic_close_XL 클릭 → GNB 닫기
`inc/gnb.html` 내부 닫기 버튼과 딤 오버레이에 `onclick="gnbClose()"`가 연결되어 있습니다.
ESC 키로도 닫힙니다.

#### top_box 상태 전환 방법 (JavaScript)
기본값은 로그인 상태입니다. 상태에 따라 아래처럼 표시/숨김을 전환합니다.

```javascript
// 로그아웃 상태로 전환
document.getElementById('gnbTopLogin').hidden = true;
document.getElementById('gnbTopLogout').hidden = false;

// 비회원 상태로 전환
document.getElementById('gnbTopLogin').hidden = true;
document.getElementById('gnbTopNonmember').hidden = false;
```

---

### 페이지별 기타 주의사항

| 페이지 | 파일 경로 | 비고 |
|---|---|---|
| 메인 | `index.html` | 메인 헤더, GNB 포함 |
| 로그인 | `member/login.html` | 서브 헤더(뒤로가기), **독바·GNB 미포함** |
