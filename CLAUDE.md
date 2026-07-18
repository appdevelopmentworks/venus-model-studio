# CLAUDE.md — Venus Model Studio 開発覚書

AIモデル×実在モデルのハイブリッドスタジオサイト。仕様の正本は `docs/00〜21`。
実装前に docs/19(独自演出)と docs/20(拡張性)を必ず参照。

## コマンド

```bash
npm run dev              # 開発サーバー(port 3000。predevでassets同期)
npm run build            # 本番ビルド(prebuildで同期+検証)
npm run lint             # ESLint(next lintはNext 16で廃止済み。eslint . を使う)
npm run typecheck
npm run test             # Vitest(unit/component)
npm run test:e2e         # Playwright(port 3000が空いている状態で実行)
npm run assets:validate  # 素材・データ・権利の検証
node scripts/visual-check.mjs [出力先]  # ★実描画の視覚検証(下記参照)
```

## 絶対に守る教訓(過去に長時間を溶かした障害)

### 1. R3FのCanvas内でSuspenseを使わない(最重要)
`useTexture` / `useLoader` / `useGLTF` などdrei/R3FのSuspense系フックは使用禁止。
Suspenseが未解決のままだとR3Fは**初回フレームを一度も描画せず、Canvasが
未初期化WebGLバッファ=真っ白**になる。エラーも警告も出ないため特定が極めて困難。
→ 代わりに `lib/use-lazy-texture.ts`(Suspense非依存ローダー)を使い、
未ロード中はopacity 0等で上品にフォールバックする。

### 2. 視覚検証は必ず `scripts/visual-check.mjs` で行う
Claude内蔵ブラウザペインは非表示タブ扱いでrAFが停止し、**アニメーション・WebGL描画の
検証が一切できない**(DOM検証のみ可能)。描画確認はPlaywright実描画で
スクリーンショットを撮る `node scripts/visual-check.mjs` を使うこと。
「DOMにcanvasがある」ことと「描画されている」ことは別物。

### 3. 依存バージョンの固定理由(勝手に上げない)
- `three@0.182.0` … r183以降はTHREE.Clock非推奨警告(R3F内部由来・コード側で消せない)が
  dev IssuesとconsoleにノイズとしてＷ載る。threeは必ず `dependencies` に置く(`-D`で入れない)
- `typescript@5.9` … 7系はNext 16のビルドが壊れる
- パッケージマネージャーは npm(pnpm未インストール)

### 4. 品質ティアの降格は慎重に(リボルバー消失バグの原因)
`QualityProvider` の降格は5秒クールダウン+T2→T1は2ストライク制。
`PerformanceMonitor` はプリローダー完了+3秒後にマウント(起動時の負荷スパイクを
誤検知するとOrbit Galleryがアンマウントされ、そのセッション中戻らない)。

### 5. UIの重なり
モバイルメニューは `<header>`(z-50)の**外**に置く(内側だとheaderがクリックを遮る)。

## アーキテクチャの約束(docs/20)

- ホーム構成は `data/home-sections.json` のセクションレジストリ。ハードコード禁止
- 素材参照は `lib/assets.ts` の `getAsset(slot)`。直接パス禁止
- `assets/` が正本、`public/assets/` は同期生成物(直接編集しない)
- 横長素材を縦クロップする際は models.json の `focalX`(0..1)を設定
  → CSS object-position と WebGL UVクロップの両方に自動反映される
- 実在モデルは `rightsStatus: "approved"` のみ公開。AI/REALラベルを全カードで維持

## 完了条件

コード変更後は typecheck / lint / test / build / test:e2e / assets:validate を
すべてグリーンにし、3D・演出に触れた場合は visual-check のスクリーンショットで
実描画を確認してから完了とする。
