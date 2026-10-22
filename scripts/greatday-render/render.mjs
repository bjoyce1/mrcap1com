// Re-render the Great Day jewelry into src/assets/greatday/render.
//   node scripts/greatday-render/render.mjs [pendant,locket,bail,rope,ropeH,plate,silverPlate]
// Needs puppeteer (already in devDependencies) and ffmpeg with libwebp on PATH.
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = path.join(root, 'src/assets/greatday/render');
const names = (process.argv[2] || 'pendant,locket,bail,rope,ropeH,plate,silverPlate').split(',');
// asset name -> file name and any ffmpeg filter (the silver bar is neutralized and cooled)
const files = { plate: ['gold-plate', null], silverPlate: ['silver-plate', 'hue=s=0,colorbalance=bs=0.06:bm=0.04,eq=brightness=0.04:contrast=1.05'] };
const types = { '.html': 'text/html', '.js': 'text/javascript' };

// serve only the studio page and three.js from the repo
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = path.normalize(path.join(root, url));
  const allowed = [path.join(root, 'scripts/greatday-render'), path.join(root, 'node_modules/three')];
  if (!allowed.some((dir) => file.startsWith(dir + path.sep)) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'greatday-render-'));
const browser = await puppeteer.launch({ headless: true, args: ['--enable-gpu', '--ignore-gpu-blocklist'] });
try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}/scripts/greatday-render/studio.html`, { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.studioReady === true', { timeout: 30000 });
  for (const name of names) {
    const { url, window: win } = await page.evaluate((n) => window.renderAsset(n), name);
    const png = path.join(tmp, `${name}.png`);
    fs.writeFileSync(png, Buffer.from(url.split(',')[1], 'base64'));
    const [file, filter] = files[name] || [name, null];
    const target = path.join(outDir, `${file}.webp`);
    const alpha = ['pendant', 'locket', 'bail', 'rope', 'ropeH'].includes(name);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', png, ...(filter ? ['-vf', filter] : []), '-c:v', 'libwebp', ...(alpha ? ['-pix_fmt', 'yuva420p'] : []), '-quality', '88', target]);
    console.log(`${path.relative(root, target)}${win === null ? '' : `  (window inset ${(win * 100).toFixed(2)}%)`}`);
  }
} finally {
  await browser.close();
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}
