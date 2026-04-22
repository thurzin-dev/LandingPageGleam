import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/fachi/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const dir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const out = path.join(dir, filename);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 800));
// scroll through page so IntersectionObserver fires for all reveal elements
await page.evaluate(async () => {
  await new Promise(resolve => {
    let pos = 0;
    const step = 600;
    const timer = setInterval(() => {
      pos += step;
      window.scrollTo(0, pos);
      if (pos >= document.body.scrollHeight) {
        clearInterval(timer);
        window.scrollTo(0, 0);
        resolve();
      }
    }, 80);
  });
});
// Force-reveal all animated elements so nothing stays hidden
await page.evaluate(() => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
});
await new Promise(r => setTimeout(r, 400));
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`Saved: ${out}`);
