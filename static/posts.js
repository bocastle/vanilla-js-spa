document.addEventListener("DOMContentLoaded", async () => {
  const postList = document.getElementById("postList");

  const posts = [
    { title: "Go 입문 정리", id: "go-intro" },
    { title: "Goroutine 개념정리", id: "goroutine" },
    { title: "JavaScript 비동기", id: "js-async" },
  ];

  posts.forEach((post) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `/render/${post.id}`;
    a.textContent = post.title;
    li.appendChild(a);
    postList.appendChild(li);
  });
});
