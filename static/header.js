export const Header = () => {
  const header = document.createElement("header");
  header.className = "site-header";

  header.innerHTML = `
    <div class="header-left">
      <h1 class="logo"><a href="/">心臓を捧げよ!</a></h1>
      <button class="menu-toggle" aria-label="메뉴 토글">&#9776;</button>
    </div>
    <div class="header-right">
      <nav class="nav">
        <ul class="nav-list">
          <li><a href="#/">home</a></li>
          <li><a href="#/about">blog</a></li>
          <li><a href="#/contact">blogTest</a></li>
        </ul>
      </nav>
    </div>
  `;

  // 햄버거 메뉴 toggle 기능 추가
  header.querySelector(".menu-toggle").addEventListener("click", () => {
    header.querySelector(".nav").classList.toggle("open");
  });

  return header;
};
