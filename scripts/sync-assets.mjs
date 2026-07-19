/**
 * assets/ → public/assets/ 同期スクリプト
 * - ソース素材は変換・改名しない(単純コピー)
 * - image/source/(作業用原版)と asset-manifest.json は配信しない
 * - 削除された素材は配信先からも削除する(孤児ファイル掃除)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(root, 'assets');
const DEST = path.join(root, 'public', 'assets');

const EXCLUDE_DIRS = new Set(['image/source']);
const EXCLUDE_FILES = new Set(['asset-manifest.json']);

function rel(p, base) {
  return path.relative(base, p).split(path.sep).join('/');
}

function isExcluded(relPath) {
  if (EXCLUDE_FILES.has(relPath)) return true;
  for (const dir of EXCLUDE_DIRS) {
    if (relPath === dir || relPath.startsWith(dir + '/')) return true;
  }
  return false;
}

function walk(dir, base, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const r = rel(full, base);
    if (isExcluded(r)) continue;
    if (entry.isDirectory()) walk(full, base, out);
    else out.push(r);
  }
  return out;
}

if (!fs.existsSync(SRC)) {
  console.error('[sync-assets] assets/ が見つかりません');
  process.exit(1);
}

const srcFiles = walk(SRC, SRC);
let copied = 0;

for (const r of srcFiles) {
  const from = path.join(SRC, r);
  const to = path.join(DEST, r);
  const fromStat = fs.statSync(from);
  const needsCopy =
    !fs.existsSync(to) ||
    (() => {
      const toStat = fs.statSync(to);
      return toStat.size !== fromStat.size || toStat.mtimeMs < fromStat.mtimeMs;
    })();
  if (needsCopy) {
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    copied++;
  }
}

// 孤児ファイルの削除
// 注意: fs.rmSync は Node 24.x(Windows)で日本語等の非ASCIIファイル名に対し
// ネイティブクラッシュ(STATUS_STACK_BUFFER_OVERRUN)する。unlinkSyncを使うこと。
const destFiles = walk(DEST, DEST);
const srcSet = new Set(srcFiles);
let removed = 0;
for (const r of destFiles) {
  if (!srcSet.has(r)) {
    try {
      fs.unlinkSync(path.join(DEST, r));
      removed++;
    } catch (e) {
      console.warn(`[sync-assets] 削除失敗(手動で削除してください): ${r} — ${e.message}`);
    }
  }
}

console.log(
  `[sync-assets] ${srcFiles.length} files tracked, ${copied} copied, ${removed} removed`
);
