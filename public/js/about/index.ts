export default async function About(): Promise<HTMLDivElement> {
  const res = await fetch('/pages/about.html');
  const html = await res.text();
  const template = document.createElement('div');
  template.innerHTML = html;
  return template;
}
