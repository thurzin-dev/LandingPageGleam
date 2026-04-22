import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const puppeteer = require('C:/Users/fachi/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url = process.argv[2] || 'http://localhost:3001';
const label = process.argv[3] || 'dark';
const scrollY = parseInt(process.argv[4] || '0');
const fullPage = process.argv[5] === 'full';

const dir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0')).filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;
const out = path.join(dir, `screenshot-${next}-${label}.png`);

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
await new Promise(r => setTimeout(r, 1000));
await page.evaluate(() => { document.body.classList.add('dark'); document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')); });
await page.evaluate((y) => window.scrollTo(0, y), scrollY);
await new Promise(r => setTimeout(r, 700));
await page.screenshot({ path: out, fullPage });
await browser.close();
console.log(`Saved: ${out}`);
