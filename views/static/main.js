document.addEventListener("DOMContentLoaded", function () {
  // 콘솔 확인
  console.log("Go 서버에서 HTML을 렌더링 이후 JS 실행.");
});

async function renderMarkdown() {
  const url = document.getElementById("mdUrl").value;
  const res = await fetch(`/render?url=${encodeURIComponent(url)}`);
  const html = await res.text();
  document.getElementById("content").innerHTML = html;
}
