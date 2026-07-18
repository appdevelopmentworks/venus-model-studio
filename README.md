# Venus Model Studio

AIモデルと実在モデルを扱うハイブリッド型モデルスタジオのサイト。
3D演出(React Three Fiber)、多言語(日英露中韓)、コンテンツのデータ駆動と拡張性を備える。

- 詳細な仕様は `docs/` を参照。特に `docs/19_SIGNATURE_EXPERIENCE.md`(独自演出)と
  `docs/20_EXTENSIBILITY_CONTENT_PIPELINE.md`(拡張性)。

## 技術スタック

- Next.js 16(App Router)/ React 19 / TypeScript(strict)
- Tailwind CSS 4
- Three.js + @react-three/fiber 9 + @react-three/drei（3D）
- GSAP + ScrollTrigger + Lenis（スクロール演出）
- next-intl（多言語）/ Zod（検証）
- Vitest + Testing Library（単体・コンポーネント）/ Playwright（E2E）

## 必要環境

- Node.js 20 以上（開発は Node 24 で確認）
- パッケージマネージャーは npm
- 素材の再エンコード・ポスター生成に ffmpeg（任意。素材を差し替える場合のみ）

## セットアップと起動

```bash
npm install
npm run dev          # http://localhost:3000（/ja にリダイレクト）
```

初回・ビルド前に `assets/` が `public/assets/` へ自動同期される（`predev` / `prebuild`）。

## 主なコマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド（素材同期＋検証を含む） |
| `npm run start` | 本番サーバー |
| `npm run lint` | ESLint |
| `npm run typecheck` | 型チェック（`tsc --noEmit`） |
| `npm run test` | 単体・コンポーネントテスト（Vitest） |
| `npm run test:e2e` | E2E（Playwright。desktop / reduced-motion / mobile） |
| `npm run assets:sync` | `assets/` → `public/assets/` 同期 |
| `npm run assets:validate` | 素材・データの参照/権利/サイズ検証 |

E2E は初回のみブラウザ取得が必要: `npx playwright install chromium`

## ディレクトリ構成

```text
app/[locale]/     ルート（home・models・projects・services・for-talents・about・contact・privacy・terms）
app/api/contact/  問い合わせ受付API
components/        sections / layout / media / three / interactions / forms / seo / providers
config/three.ts   3D設定（粒子数・リング・品質ティア閾値など）
data/             models / projects / services / home-sections / site（コンテンツの正本）
lib/              assets（スロット解決）/ content / performance（品質ティア）/ metadata / validation
messages/         ja / en / ru / zh-CN / ko
assets/           ユーザーが手動配置する素材（正本）。docs はコピーしない
public/assets/    配信用コピー（scripts が同期。直接編集しない）
scripts/          sync-assets.mjs / validate-assets.mjs
```

## コンテンツの追加（コードを書かずに増やせる）

すべてのコンテンツは `data/*.json` が正本。追加後は `npm run assets:validate` で参照・権利・サイズを検証する。

### モデルを1名追加する（目標10分）

1. `assets/image/models/{ai|real}/{slug}/` に `portrait.webp`（必須）、
   任意で `fullbody.webp` / `editorial.webp` を置く。動画があれば該当カテゴリーの
   `assets/video/…` へ
2. `data/models.json` に1エントリー追加。`type`（`ai` / `real` / `ai-enhanced-real`）と
   `rightsStatus` を必ず正しく設定する
   - 横長素材を縦カードで使う場合は `focalX`（0〜1、人物の水平位置）を指定すると
     顔が中央に来る（CSSの object-position と 3D の UV クロップ両方に自動反映）
3. `npm run assets:validate` で確認
4. `npm run dev` で表示確認。`featured: true` の AI モデルは自動で Orbit Gallery に出現

重要ルール:
- `real` は `rightsStatus: "approved"` のときだけ公開される（未承認は自動で非表示）
- AI モデルは完全に架空であること。実在の著名人に似せない
- 仮データには `isPlaceholder: true` を付ける（本番ビルドの検証で弾かれる）

### プロジェクトを1件追加する

1. `assets/image/projects/{slug}/cover.webp` を置く
2. `data/projects.json` に1エントリー。`status: "concept" | "client"` を明示
   （実案件がなければ自主制作を `concept` として掲載。架空の顧客・受賞・実績は書かない）
3. `npm run assets:validate` → 確認。0件でもセクションは崩れない

### ホームのセクションを出し入れ・並べ替える

`data/home-sections.json` の各エントリーの `enabled` / `order` を編集するだけ。
コード変更は不要。新規セクションを作る場合のみ、`components/sections/` に実装して
`components/sections/registry.tsx` にキーを登録する。

### 言語を1つ追加する

1. `i18n/routing.ts` の `locales` に追加
2. `messages/{locale}.json` を英語からコピーして翻訳
3. モデル bio 等のロケールマップは任意（未翻訳は en→ja でフォールバック）

## 素材の差し替え

- 素材は `assets/` が正本。`asset-manifest.json` の `slot` 経由で参照される
  （コンポーネントは直接パスを持たない）。差し替えは manifest の `src` を変えるだけ
- 動画は MP4 必須。目安予算は `docs/11` と `docs/21` を参照
- 再エンコード例（4K→1920幅、音声除去、faststart）:

```bash
ffmpeg -i input.mp4 -vf "scale='min(1920,iw)':-2" -c:v libx264 -crf 23 \
  -preset slow -movflags +faststart -an -pix_fmt yuv420p output.mp4
```

## 問い合わせフォームの配信設定

`app/api/contact/route.ts` は環境変数で動作を切り替える。

- 既定（未設定）: サーバー送信せず、クライアントが実際にメールソフトを開く（mailto フォールバック）
- サーバー送信を使う場合: `CONTACT_DELIVERY_MODE=email`、`RESEND_API_KEY`、`CONTACT_EMAIL` を設定

「送信したように見せて実際には送らない」実装はしていない。honeypot と簡易レート制限あり。

## 環境変数

`.env.example`（`templates/.env.example` 参照）をコピーして `.env.local` を作成する。

```bash
NEXT_PUBLIC_SITE_URL=https://example.com   # canonical / sitemap / OG の絶対URL
NEXT_PUBLIC_GA_ID=                          # 任意
NEXT_PUBLIC_VERCEL_ANALYTICS=false          # 任意
CONTACT_DELIVERY_MODE=mailto                # または email
CONTACT_EMAIL=contact@example.com
RESEND_API_KEY=                             # email モード時に必要
```

`data/site.json` のブランド名・連絡先・SNS・運営者情報も公開前に更新する。

## 品質ティアとアクセシビリティ

- 3D の負荷と演出は `lib/performance.ts` の品質ティア（T0〜T3）で一元制御
  - T0: WebGL 不可 / `prefers-reduced-motion` → Canvas なし。CSS/HTML で同等の情報
  - T1: モバイル・低性能 → 粒子削減・動画テクスチャなし
  - T2/T3: デスクトップ → 全演出（T3 のみ限定ポストプロセス）
- すべての演出に reduced-motion / WebGL 不可 / モバイルのフォールバックがある
- カスタムカーソルは fine pointer かつ reduced-motion でない環境のみ

## 公開前チェック

`docs/16_DEPLOYMENT_CHECKLIST.md` に従う。最低限:

```bash
npm run lint && npm run typecheck && npm run test && npm run build && npm run test:e2e
npm run assets:validate
```

- `data/site.json` の連絡先・運営者情報を実データに更新
- 実在モデルは許諾済み（`rightsStatus: approved`）のみ公開
- `NEXT_PUBLIC_SITE_URL` を本番ドメインに設定（sitemap / canonical / hreflang に反映）
