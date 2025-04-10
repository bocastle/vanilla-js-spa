document.addEventListener("DOMContentLoaded", () => {
  console.log("main.js");

  const btn = document.getElementById("loadBtn");

  const input = document.getElementById("mdUrl");
  const content = document.getElementById("content");

  btn.addEventListener("click", async () => {
    console.log("main.js");
    const url = input.value.trim();
    if (!url) return alert("URL을 입력하세요");

    content.innerHTML = "<p>⏳ 마크다운 불러오는 중...</p>";

    try {
      const res = await fetch(`/render?id=goroutine`);
      if (!res.ok) throw new Error("불러오기 실패");

      const html = await res.text();
      content.setAttribute("class", "markdown-body");
      content.innerHTML = html;
    } catch (err) {
      content.innerHTML = `<p style="color: red;">🚫 ${err.message}</p>`;
    }
  });
});
