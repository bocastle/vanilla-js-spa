export default async function Contact() {
  const res = await fetch('/views/pages/contact.html');
  const html = await res.text();
  const template = document.createElement('div');
  template.innerHTML = html;
  return template;
}
