import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import Intro from '../components/Intro.js';
import Sidebar from '../components/Sidebar.js';

const app = document.getElementById('app');

function renderLayout() {
  app.innerHTML = '';
  app.appendChild(Header());
  const layout = document.createElement('div');
  layout.className = 'layout';
  layout.appendChild(Sidebar());
  const main = document.createElement('main');
  main.id = 'main-content';
  main.textContent = '메인 컨텐츠 영역';
  layout.appendChild(main);
  app.appendChild(layout);
  app.appendChild(Footer());
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
