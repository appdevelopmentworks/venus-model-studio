/**
 * 素材・データ検証スクリプト(拡張の門番)
 * - manifest / models / projects の参照先ファイル存在チェック
 * - Hero MP4 の存在チェック(欠落は警告。posterフォールバックで進行可能)
 * - サイズ予算超過の警告(Hero 20MB超は失敗)
 * - real かつ rightsStatus !== approved の published を失敗扱い
 * - --production: isPlaceholder が公開データに残っていれば失敗
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(root, 'assets');
const production = process.argv.includes('--production');

let errors = 0;
let warnings = 0;
const err = (m) => { console.error('  ERROR  ' + m); errors++; };
const warn = (m) => { console.warn('  warn   ' + m); warnings++; };

function readJson(p) {
  try {
    // Windows系エディターが付けるUTF-8 BOMを許容する
    return JSON.parse(fs.readFileSync(p, 'utf8').replace(/^﻿/, ''));
  } catch (e) {
    err(`${path.relative(root, p)} のJSON構文エラー: ${e.message}`);
    return null;
  }
}

function assetExists(relPath) {
  return relPath && fs.existsSync(path.join(ASSETS, relPath));
}

function checkRef(owner, field, relPath, { required = true } = {}) {
  if (!relPath) return;
  if (!assetExists(relPath)) {
    (required ? err : warn)(`${owner}: ${field} が見つかりません → assets/${relPath}`);
  }
}

const MB = 1024 * 1024;
const budgets = [
  { match: /^video\/hero\/hero-hybrid-desktop/, warnAt: 8 * MB, failAt: 20 * MB },
  { match: /^video\/hero\/hero-hybrid-mobile/, warnAt: 5 * MB, failAt: 20 * MB },
  { match: /^video\//, warnAt: 4 * MB, failAt: 40 * MB },
  { match: /^image\/posters\//, warnAt: 0.25 * MB, failAt: 5 * MB },
  { match: /^image\//, warnAt: 0.5 * MB, failAt: 10 * MB }
];

function checkBudget(relPath) {
  if (!assetExists(relPath)) return;
  const size = fs.statSync(path.join(ASSETS, relPath)).size;
  const rule = budgets.find((b) => b.match.test(relPath));
  if (!rule) return;
  if (size > rule.failAt) err(`${relPath} が上限超過 (${(size / MB).toFixed(1)}MB)`);
  else if (size > rule.warnAt)
    warn(`${relPath} が予算超過 (${(size / MB).toFixed(1)}MB / 目標${(rule.warnAt / MB).toFixed(1)}MB)`);
}

console.log('[validate-assets] start' + (production ? ' (production)' : ''));

// --- manifest ---
const manifestPath = path.join(ASSETS, 'asset-manifest.json');
const manifest = fs.existsSync(manifestPath) ? readJson(manifestPath) : null;
if (!manifest) {
  err('assets/asset-manifest.json がありません');
} else {
  const slots = new Set();
  const ids = new Set();
  for (const a of manifest.assets ?? []) {
    if (ids.has(a.id)) err(`manifest: id重複 "${a.id}"`);
    ids.add(a.id);
    if (a.slot) {
      if (slots.has(a.slot)) err(`manifest: slot重複 "${a.slot}"`);
      slots.add(a.slot);
    }
    checkRef(`manifest:${a.id}`, 'src', a.src, { required: a.required !== false });
    checkRef(`manifest:${a.id}`, 'poster', a.poster, { required: false });
    checkBudget(a.src);
    if (a.poster) checkBudget(a.poster);
    if (a.type === 'video' && !a.poster) warn(`manifest:${a.id}: posterがありません`);
  }
}

// --- hero ---
if (!assetExists('video/hero/hero-hybrid-desktop.mp4')) {
  warn('Hero desktop MP4 がありません(posterフォールバックで進行)');
}

// --- models ---
const modelsData = readJson(path.join(root, 'data', 'models.json'));
const slugs = new Set();
for (const m of modelsData?.models ?? []) {
  if (slugs.has(m.slug)) err(`models: slug重複 "${m.slug}"`);
  slugs.add(m.slug);
  if (m.type === 'real' && m.published && m.rightsStatus !== 'approved') {
    err(`models:${m.slug}: 実在モデルがrights未承認のままpublishedです`);
  }
  if (production && m.isPlaceholder && m.published) {
    err(`models:${m.slug}: isPlaceholderが本番公開データに含まれています`);
  }
  if (m.published) {
    checkRef(`models:${m.slug}`, 'portrait', m.portrait);
    checkRef(`models:${m.slug}`, 'video', m.video, { required: false });
    checkRef(`models:${m.slug}`, 'videoPoster', m.videoPoster, { required: false });
  }
}

// --- projects ---
const projectsData = readJson(path.join(root, 'data', 'projects.json'));
for (const p of projectsData?.projects ?? []) {
  if (production && p.isPlaceholder && p.published) {
    err(`projects:${p.slug}: isPlaceholderが本番公開データに含まれています`);
  }
  if (p.published) checkRef(`projects:${p.slug}`, 'cover', p.cover);
}

console.log(`[validate-assets] done: ${errors} errors, ${warnings} warnings`);
if (errors > 0) process.exit(1);
