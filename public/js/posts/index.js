export default async function Posts() {
  const res = await fetch('/pages/posts.html');
  const html = await res.text();
  const template = document.createElement('div');
  template.innerHTML = html;

  const postsRoot = template.querySelector('#posts-list');
  postsRoot.textContent = '불러오는 중...';

  try {
    const repoApi = 'https://api.github.com/repos/bocastle/logs/contents/';
    const repoRes = await fetch(repoApi, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!repoRes.ok) {
      throw new Error(`GitHub API 오류: ${repoRes.status}`);
    }
    const items = await repoRes.json();
    postsRoot.textContent = '';
    postsRoot.appendChild(renderPostCards(items));
  } catch (error) {
    postsRoot.textContent = '데이터를 불러오지 못했습니다.';
    console.error(error);
  }

  return template;
}

function renderPostCards(items) {
  const list = document.createElement('div');
  list.className = 'post-card-list';

  if (!Array.isArray(items) || items.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'post-empty';
    empty.textContent = '표시할 항목이 없습니다.';
    list.appendChild(empty);
    return list;
  }

  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'post-card';

    const title = document.createElement('h3');
    title.className = 'post-title';
    title.textContent = item.name || '-';

    const meta = document.createElement('div');
    meta.className = 'post-meta';
    meta.innerHTML = `
      <span class="post-meta-item">${formatType(item.type)}</span>
      <span class="post-meta-item">${item.path || '-'}</span>
    `;

    const actions = document.createElement('div');
    actions.className = 'post-actions';
    if (item.html_url) {
      actions.innerHTML = `<a class="post-link" href="${item.html_url}" target="_blank" rel="noopener">글 보기</a>`;
    } else {
      actions.innerHTML = '<span class="post-link is-disabled">링크 없음</span>';
    }

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(actions);
    list.appendChild(card);
  });

  return list;
}

function formatType(type) {
  if (type === 'dir') {
    return '시리즈';
  }
  if (type === 'file') {
    return '글';
  }
  return type || '-';
}
