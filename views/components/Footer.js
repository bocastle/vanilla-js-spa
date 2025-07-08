export default function Footer() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <p>&copy; 2024 bocastle. All rights reserved.</p>
    <p>Powered by <a href="https://github.com/bocastle" target="_blank" rel="noopener">bocastle</a></p>
  `;
  return footer;
}
