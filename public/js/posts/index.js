export default async function Posts() {
  const res = await fetch('/pages/posts.html');
  const html = await res.text();
  const template = document.createElement('div');
  template.innerHTML = html;

  const tableRoot = template.querySelector('#repo-table');
  tableRoot.textContent = '불러오는 중...';

  try {
    const repoApi = 'https://api.github.com/repos/bocastle/logs/contents/';
    const repoRes = await fetch(repoApi, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!repoRes.ok) {
      throw new Error(`GitHub API 오류: ${repoRes.status}`);
    }
    const items = await repoRes.json();
    tableRoot.textContent = '';
    tableRoot.appendChild(renderRepoTable(items));
  } catch (error) {
    tableRoot.textContent = '데이터를 불러오지 못했습니다.';
    console.error(error);
  }

  return template;
}

function renderRepoTable(items) {
  const table = document.createElement('table');
  table.className = 'repo-table';

  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>이름</th>
      <th>유형</th>
      <th>경로</th>
      <th>링크</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  if (!Array.isArray(items) || items.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4">표시할 항목이 없습니다.</td>';
    tbody.appendChild(row);
  } else {
    items.forEach((item) => {
      const row = document.createElement('tr');
      const link = item.html_url
        ? `<a href="${item.html_url}" target="_blank" rel="noreferrer">열기</a>`
        : '-';
      row.innerHTML = `
        <td>${item.name || '-'}</td>
        <td>${item.type || '-'}</td>
        <td>${item.path || '-'}</td>
        <td>${link}</td>
      `;
      tbody.appendChild(row);
    });
  }
  table.appendChild(tbody);

  return table;
}
