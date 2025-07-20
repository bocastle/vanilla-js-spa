import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import Intro from '../components/Intro.js';
import Sidebar from '../components/Sidebar.js';
import About from './about/index.js';
import Contact from './contact/index.js';
import Home from './home/index.js';
import Posts from './posts/index.js';

const app = document.getElementById('app');

async function renderPage() {
  const main = document.getElementById('main-content');
  if (!main) return;
  main.innerHTML = '';
  let page;
  switch (location.hash) {
    case '#/about':
      page = await About();
      break;
    case '#/posts':
      page = await Posts();
      break;
    case '#/contact':
      page = await Contact();
      break;
    default:
      page = await Home();
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
