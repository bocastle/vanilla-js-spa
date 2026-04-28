import About from './about/index.js';
import Footer from './components/Footer.js';
import Header from './components/Header.js';
import Intro from './components/Intro.js';
import Sidebar from './components/Sidebar.js';
import Contact from './contact/index.js';
import Home from './home/index.js';
import Posts from './posts/index.js';

// 스타일된 콘솔 로그 (console.info는 production에서도 유지됨)
console.info(
  '%c🚀 心臓を捧げよ!',
  'color: #ff6b6b; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px #000;'
);
console.info(
  '%c Vanilla JS SPA ',
  'background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 4px; font-size: 14px;'
);

const app = document.getElementById('app');

async function renderPage() {
  const main = document.getElementById('main-content');
  if (!main) return;
  main.innerHTML = '';
  let page;
  const h = location.hash || '#/';
  if (h.startsWith('#/posts')) {
    page = await Posts();
  } else {
    switch (h) {
      case '#/about':
        page = await About();
        break;
      case '#/contact':
        page = await Contact();
        break;
      default:
        page = await Home();
    }
  }
  main.appendChild(page);
}

function renderLayout() {
  app.innerHTML = '';
  app.appendChild(Header());
  const layout = document.createElement('div');
  layout.className = 'layout';
  layout.appendChild(Sidebar());
  const main = document.createElement('main');
  main.id = 'main-content';
  layout.appendChild(main);
  app.appendChild(layout);
  app.appendChild(Footer());
  renderPage();
  window.addEventListener('hashchange', renderPage);
}

if (!localStorage.getItem('visited')) {
  app.appendChild(
    Intro(() => {
      localStorage.setItem('visited', 'true');
      renderLayout();
    })
  );
} else {
  renderLayout();
}

