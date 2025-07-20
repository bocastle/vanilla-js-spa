export default async function Posts() {
  const res = await fetch('/views/pages/posts.html');
  const html = await res.text();
  const template = document.createElement('div');
  template.innerHTML = html;

  // 예시 데이터
  const posts = [{ title: '첫 번째 글' }, { title: '두 번째 글' }];
  const ul = template.querySelector('#posts-list');
  ul.innerHTML = '';
  if (posts.length === 0) {
    const li = document.createElement('li');
    li.innerHTML = '<span>-</span>';
    ul.appendChild(li);
  } else {
    posts.forEach((post) => {
      const li = document.createElement('li');
      li.textContent = post.title;
      ul.appendChild(li);
    });
  }
  return template;
}
