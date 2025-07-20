export default function Sidebar() {
  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";

  sidebar.innerHTML = `
    <div class="sidebar-profile">
      <img src="https://placehold.co/80x80" alt="프로필" class="profile-img" />
      <h2 class="profile-name">boce</h2>
      <p class="profile-desc">bece_info</p>
    </div>
    <nav class="sidebar-nav">
      <ul class="sidebar-menu">
        <li><a href="#/"><span class="icon">🏠</span> Home</a></li>
        <li><a href="#/about"><span class="icon">📖</span> About</a></li>
        <li><a href="#/posts"><span class="icon">📝</span> Posts</a></li>
        <li><a href="#/contact"><span class="icon">✉️</span> Contact</a></li>
      </ul>
    </nav>
    <button class="sidebar-toggle" aria-label="사이드바 토글">≡</button>
  `;

  // 사이드바 토글 기능 (모바일 대응 등)
  sidebar.querySelector(".sidebar-toggle").addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  return sidebar;
}
