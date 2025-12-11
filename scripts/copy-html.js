const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const publicDir = path.join(__dirname, '../public');
const distDir = path.join(__dirname, '../dist');

// dist 폴더가 없으면 생성
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// CSS 폴더 복사
const srcCss = path.join(publicDir, 'css');
const distCss = path.join(distDir, 'css');
if (fs.existsSync(srcCss)) {
  copyDir(srcCss, distCss);
  console.log('CSS files copied');
}

// pages 폴더 복사
const srcPages = path.join(publicDir, 'pages');
const distPages = path.join(distDir, 'pages');
if (fs.existsSync(srcPages)) {
  copyDir(srcPages, distPages);
  console.log('Pages files copied');
}

// HTML 파일 읽기 및 수정
const srcHtml = path.join(publicDir, 'index.html');
const distHtml = path.join(distDir, 'index.html');
let html = fs.readFileSync(srcHtml, 'utf8');

// script 태그를 bundle.js로 변경
html = html.replace(
  /<script type="module" src="\/js\/main\.js"><\/script>/,
  '<script src="/js/bundle.js"></script>'
);

// dist/index.html로 저장
fs.writeFileSync(distHtml, html, 'utf8');
console.log('HTML file copied and updated for webpack bundle');

