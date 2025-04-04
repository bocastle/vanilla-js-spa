const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

describe("index.html", () => {
  let dom;
  let container;

  beforeAll(() => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "../views/index.html"),
      "utf8"
    );
    dom = new JSDOM(html);
    container = dom.window.document.body;
  });

  it("renders a title", () => {
    expect(container.querySelector("h1").textContent).toBe("Vanilla JS SPA");
  });

  it("contains a paragraph with specific text", () => {
    expect(container.querySelector("p").textContent).toBe(
      "Go 서버에서 HTML 연결"
    );
  });

  it("includes a script tag with the correct src", () => {
    const script = container.querySelector("script");
    expect(script).not.toBeNull();
    expect(script.src).toContain("/static/js/main.js");
  });
});
