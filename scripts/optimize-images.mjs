// Resizes source images in images/ to web-friendly WebP copies, and renders the
// 1200x630 Open Graph preview (images/og-image.png) used by LinkedIn and others.
// Usage: npm run images
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const img = (name) => path.join(root, 'images', name);

// [source, output, max width]
const JOBS = [
  ['Virtual-CV-Image.png', 'profile.webp', 720],
  ['Project-LandingPages.jpg', 'Project-LandingPages.webp', 900],
  ['Project-VirtualPortfolio.jpg', 'Project-VirtualPortfolio.webp', 900],
  ['Project-EmployeeManagement.jpg', 'Project-EmployeeManagement.webp', 900],
];

async function resize(src, out, maxWidth) {
  const image = await loadImage(await readFile(img(src)));
  const scale = Math.min(1, maxWidth / image.width);
  const w = Math.round(image.width * scale);
  const h = Math.round(image.height * scale);
  const canvas = createCanvas(w, h);
  canvas.getContext('2d').drawImage(image, 0, 0, w, h);
  await writeFile(img(out), await canvas.encode('webp', 80));
  console.log(`${src} (${image.width}x${image.height}) -> ${out} (${w}x${h})`);
}

async function ogImage() {
  const W = 1200, H = 630;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, W, H);
  const glow = (x, y, r, color) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(10,10,26,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  };
  glow(180, 120, 520, 'rgba(102,126,234,0.35)');
  glow(1050, 560, 480, 'rgba(79,172,254,0.25)');

  ctx.strokeStyle = 'rgba(0,217,255,0.06)';
  for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Profile photo (the source is already a circular cut-out) with a soft ring
  const photo = await loadImage(await readFile(img('Virtual-CV-Image.png')));
  const size = 380, px = W - size - 90, py = (H - size) / 2;
  const s = Math.max(size / photo.width, size / photo.height);
  ctx.drawImage(photo, px + (size - photo.width * s) / 2, py + (size - photo.height * s) / 2, photo.width * s, photo.height * s);
  ctx.strokeStyle = 'rgba(102,126,234,0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(px + size / 2, py + size / 2, size / 2 + 10, 0, Math.PI * 2);
  ctx.stroke();

  const font = (weight, px) => `${weight} ${px}px "Segoe UI", Inter, Arial, sans-serif`;
  const grad = ctx.createLinearGradient(90, 0, 640, 0);
  grad.addColorStop(0, '#667eea');
  grad.addColorStop(1, '#4facfe');

  ctx.fillStyle = '#a0a0cc';
  ctx.font = font(600, 26);
  ctx.fillText('VIRTUAL CV  ·  PORTFOLIO', 90, 200);
  ctx.fillStyle = '#e6e6ff';
  ctx.font = font(800, 84);
  ctx.fillText('Danelle', 90, 300);
  ctx.fillStyle = grad;
  ctx.fillText('Kruger', 90, 390);
  ctx.fillStyle = '#e6e6ff';
  ctx.font = font(600, 34);
  ctx.fillText('Full-Stack Developer & Designer', 90, 455);
  ctx.fillStyle = '#a0a0cc';
  ctx.font = font(400, 26);
  ctx.fillText('Angular  ·  .NET  ·  SQL Server  ·  UI/UX', 90, 505);

  await writeFile(img('og-image.png'), await canvas.encode('png'));
  console.log('rendered og-image.png (1200x630)');
}

for (const job of JOBS) await resize(...job);
await ogImage();
