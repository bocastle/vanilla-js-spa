export default async function Home() {
  const res = await fetch('/views/pages/home.html');
  const html = await res.text();
  const template = document.createElement('div');
  template.innerHTML = html;
  return template;
}
