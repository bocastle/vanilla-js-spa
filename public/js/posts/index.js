const REPO = 'bocastle/logs';
const API_BASE = `https://api.github.com/repos/${REPO}/contents`;

function buildPostsHash(repoPath) {
  if (!repoPath) return '#/posts';
  return `#/posts/${repoPath
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;
}

/**
 * @returns {string | null} 저장소 루트 `''` 또는 `Go/topic.md` 형 경로. /posts가 아니면 null
 */
function postsPathFromHash() {
  const h = location.hash || '';
  if (!h.startsWith('#/posts')) return null;
  let rest = h.slice('#/posts'.length);
  if (rest.startsWith('/')) rest = rest.slice(1);
  if (!rest) return '';
  try {
    return rest.split('/').map(decodeURIComponent).join('/');
  } catch {
    return '';
  }
}

function parentPath(p) {
  if (!p) return '';
  const i = p.lastIndexOf('/');
  return i === -1 ? '' : p.slice(0, i);
}

function contentsApiUrl(repoPath) {
  if (!repoPath) return API_BASE;
  return `${API_BASE}/${repoPath
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderMarkdownToHtml(text) {
  const m = typeof globalThis !== 'undefined' && globalThis.marked ? globalThis.marked : null;
  if (m && typeof m.parse === 'function') {
    return m.parse(text, { mangle: false, headerIds: false });
  }
  return `<pre class="post-md-fallback">${escapeHtml(text)}</pre>`;
}

function filterPostItems(items) {
  const excludedNames = new Set([
    '.github',
    '.gitignore',
    '.obsidian',
    'README.md',
  ]);
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter((item) => !excludedNames.has(item.name));
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

/** 마지막 점 뒤 확장자만 제거 (`.env` 등은 그대로) */
function stripFileExtension(filename) {
  if (!filename) return filename;
  const i = filename.lastIndexOf('.');
  if (i <= 0) return filename;
  return filename.slice(0, i);
}

/** 목록/브레드크럼: 경로의 마지막 조각(파일명)에서만 확장자 제거 */
function pathForDisplay(repoPath) {
  if (!repoPath) return '-';
  const segs = repoPath.split('/');
  const last = segs[segs.length - 1];
  if (last.includes('.')) {
    segs[segs.length - 1] = stripFileExtension(last);
  }
  return segs.join('/');
}

function renderItemList(items) {
  const list = document.createElement('div');
  list.className = 'post-card-list';

  const sorted = filterPostItems(items).sort((a, b) => {
    if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
    return a.name.localeCompare(b.name, 'ko');
  });

  if (sorted.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'post-empty';
    empty.textContent = '표시할 항목이 없습니다.';
    list.appendChild(empty);
    return list;
  }

  sorted.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'post-card';

    const title = document.createElement('h3');
    title.className = 'post-title';
    title.textContent =
      item.type === 'file' ? stripFileExtension(item.name || '') || '-' : item.name || '-';

    const meta = document.createElement('div');
    meta.className = 'post-meta';
    meta.innerHTML = `
      <span class="post-meta-item">${formatType(item.type)}</span>
      <span class="post-meta-item">${item.path ? pathForDisplay(item.path) : '-'}</span>
    `;

    const actions = document.createElement('div');
    actions.className = 'post-actions';
    if (item.type === 'dir' && item.path) {
      const open = document.createElement('a');
      open.className = 'post-link';
      open.href = buildPostsHash(item.path);
      open.textContent = '글 보기';
      actions.appendChild(open);
    } else if (item.type === 'file' && item.path) {
      const isMd = /\.(md|markdown)$/i.test(item.name);
      if (isMd) {
        const read = document.createElement('a');
        read.className = 'post-link';
        read.href = buildPostsHash(item.path);
        read.textContent = '읽기';
        actions.appendChild(read);
      } else if (item.download_url) {
        const openFile = document.createElement('a');
        openFile.className = 'post-link';
        openFile.href = buildPostsHash(item.path);
        openFile.textContent = '열기';
        actions.appendChild(openFile);
      } else {
        const span = document.createElement('span');
        span.className = 'post-link is-disabled';
        span.textContent = '링크 없음';
        actions.appendChild(span);
      }
    } else {
      const span = document.createElement('span');
      span.className = 'post-link is-disabled';
      span.textContent = '—';
      actions.appendChild(span);
    }

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(actions);

    list.appendChild(card);
  });

  return list;
}

async function renderFileView(data) {
  const root = document.createElement('div');
  root.className = 'post-file-view';

  if (data.type !== 'file' || !data.path) {
    const err = document.createElement('p');
    err.className = 'post-empty';
    err.textContent = '표시할 수 없습니다.';
    root.appendChild(err);
    return root;
  }

  if (!/\.(md|markdown)$/i.test(data.name)) {
    if (data.download_url) {
      const p = document.createElement('p');
      p.appendChild(
        (() => {
          const a = document.createElement('a');
          a.className = 'post-link';
          a.href = data.download_url;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.textContent = '파일 받기 / 새 탭에서 열기';
          return a;
        })()
      );
      root.appendChild(p);
    } else {
      const err = document.createElement('p');
      err.className = 'post-empty';
      err.textContent = '이 파일을 열 수 없습니다.';
      root.appendChild(err);
    }
    return root;
  }

  if (!data.download_url) {
    const err = document.createElement('p');
    err.className = 'post-empty';
    err.textContent = '원문을 불러올 수 없습니다.';
    root.appendChild(err);
    return root;
  }

  const loading = document.createTextNode('불러오는 중...');
  root.appendChild(loading);
  try {
    const r = await fetch(data.download_url, { mode: 'cors' });
    if (!r.ok) throw new Error(String(r.status));
    const text = await r.text();
    root.textContent = '';
    const art = document.createElement('article');
    art.className = 'markdown-body post-article';
    art.innerHTML = renderMarkdownToHtml(text);
    root.appendChild(art);
  } catch (e) {
    root.textContent = '';
    const err = document.createElement('p');
    err.className = 'post-empty';
    err.textContent = '본문을 불러오지 못했습니다.';
    root.appendChild(err);
    console.error(e);
  }

  return root;
}

function setPostsNav(root, path) {
  const nav = root.querySelector('#posts-nav');
  const back = root.querySelector('#posts-back');
  const bread = root.querySelector('#posts-nav-breadcrumb');
  if (!nav || !back || !bread) return;

  if (!path) {
    nav.hidden = true;
    bread.hidden = true;
    return;
  }

  nav.hidden = false;
  const goBack = parentPath(path);
  const backHash = goBack ? buildPostsHash(goBack) : '#/posts';
  back.href = backHash;
  back.textContent = goBack ? '← 상위로' : '← 전체 시리즈';
  bread.textContent = pathForDisplay(path);
  bread.hidden = false;
}

export default async function Posts() {
  const res = await fetch('/pages/posts.html');
  const html = await res.text();
  const template = document.createElement('div');
  template.innerHTML = html;

  const content = template.querySelector('#posts-content');
  if (!content) {
    return template;
  }
  const path = postsPathFromHash();
  if (path === null) {
    content.textContent = '잘못된 경로입니다.';
    return template;
  }

  content.textContent = '불러오는 중...';

  try {
    const repoRes = await fetch(contentsApiUrl(path), {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!repoRes.ok) {
      throw new Error(`GitHub API 오류: ${repoRes.status}`);
    }
    const payload = await repoRes.json();
    if (Array.isArray(payload)) {
      setPostsNav(template, path);
      content.textContent = '';
      content.appendChild(renderItemList(payload));
      return template;
    }
    if (payload && payload.type === 'file') {
      setPostsNav(template, path);
      content.textContent = '';
      content.appendChild(await renderFileView(payload));
      return template;
    }
    content.textContent = '응답을 해석할 수 없습니다.';
  } catch (error) {
    content.textContent = '데이터를 불러오지 못했습니다.';
    console.error(error);
  }
  return template;
}
