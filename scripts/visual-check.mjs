/**
 * 視覚スモークチェック(Playwright実描画)。
 * 使い方: npm run dev を起動した状態で `node scripts/visual-check.mjs [出力プレフィックス]`
 * Orbit/Meridianのスクリーンショットと、console error/warning・pageerror を出力する。
 */
import { chromium } from '@playwright/test';

const OUT = process.argv[2] || 'visual-check';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });

const issues = [];
page.on('pageerror', (e) => issues.push(`[pageerror] ${String(e.message).slice(0, 200)}`));
page.on('console', (m) => {
  const t = m.type();
  const text = m.text();
  if ((t === 'error' || t === 'warning') && !text.includes('GL Driver Message')) {
    issues.push(`[${t}] ${text.slice(0, 180)}`);
  }
});

await page.goto('http://localhost:3000/ja', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(7000);

await page.evaluate(() => {
  const sec = document.querySelector('[data-section="ai-models"]');
  if (sec) window.scrollTo(0, sec.offsetTop + window.innerHeight * 0.6);
});
await page.waitForTimeout(3500);
await page.screenshot({ path: `${OUT}-orbit.png` });

await page.evaluate(() => {
  const sec = document.querySelector('[data-section="hybrid"]');
  if (sec) window.scrollTo(0, sec.offsetTop - window.innerHeight * 0.1);
});
await page.waitForTimeout(3500);
await page.screenshot({ path: `${OUT}-meridian.png` });

console.log(JSON.stringify({ issues }, null, 1));
await browser.close();
