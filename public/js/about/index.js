export default async function About() {
  const res = await fetch('/pages/about.html');
  const html = await res.text();
  const template = document.createElement('div');
  template.innerHTML = html;
  return template;
}

