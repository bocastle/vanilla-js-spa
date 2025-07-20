export default function Intro(onStart) {
  const intro = document.createElement('div');
  intro.className = 'intro-page';
  intro.innerHTML = `
    <h1 class="intro-title">心臓を捧げよ!</h1>
    <p class="intro-desc">Welcome to the Vanilla JS SPA.<br>최초 1회만 보이는 랜딩페이지입니다.</p>
  `;
  setTimeout(() => {
    if (onStart) onStart();
  }, 2000);
  return intro;
}
