# モデル追加手順書(Claude Code運用前提)

新しいモデル(AIモデル / 実在モデル)をサイトに追加するための実践手順。
このプロジェクトは **素材(assets)+ JSON を追加するだけでモデルが増える** 設計。
原則コードは触らない。Claude Codeに依頼する場合は、末尾の「Claude Codeへの依頼テンプレート」をそのまま渡す。

関連: 命名規則は `06`、データ仕様は `09`、拡張性の全体像は `20`、素材の現状は `21`。

---

## 0. 事前に決めること(モデル1名につき)

| 項目 | 内容 | 例 |
|---|---|---|
| slug | 半角小文字英数字とハイフンのみ。一意 | `ai-sora-mixed` / `real-model-003` |
| type | `ai`(架空) / `real`(実在) / `ai-enhanced-real`(AI編集した実在人物) | `ai` |
| displayName | 表示名(活動名) | `SORA` |
| featured | トップのAI Modelsリボルバーに出すか | `true` |
| rightsStatus | `approved` / `pending` / `restricted` | `approved` |
| categories | 分野タグ(配列) | `["beauty","fashion"]` |
| focalX | 横長素材を縦カードで切る時の顔の水平位置 0〜1(後述) | `0.6` |

**重要な公開ルール(厳守):**
- `real`(実在モデル)は **`rightsStatus: "approved"` の時だけ公開される**。本人の許諾が取れるまで `pending` にしておく(自動で非表示になる)
- `ai` は完全に架空であること。実在の著名人に似せた顔を登録しない
- 準備中・仮のデータには `"isPlaceholder": true` を付ける(本番ビルドの検証で弾かれる)

---

## 1. 用意する素材

### 必須
| 素材 | 形式・比率 | 置き場所 | 備考 |
|---|---|---|---|
| ポートレート静止画 | WebP / 縦長(3:5 目安) | `assets/image/models/{ai\|real}/{slug}/portrait.webp` | カード・一覧・詳細で使用。150KB以下目標 |

### 推奨(あると質が上がる)
| 素材 | 形式・比率 | 置き場所 | 備考 |
|---|---|---|---|
| モーション動画 | MP4 / H.264 / 無音 / 5〜7秒ループ | `assets/video/{ai-models\|real-models}/{slug}-01.mp4` | リボルバー/カードで再生。長辺1280〜1920、2.5MB以下目標 |
| 動画ポスター | WebP | `assets/image/posters/{slug}-01.webp` | 動画の代表フレーム。動画から書き出せる |
| 全身 / エディトリアル | WebP | `assets/image/models/{ai\|real}/{slug}/fullbody.webp` 他 | 詳細ページ用(任意) |

### 素材が無くても動く
- 動画が無ければ静止画だけで表示される(カードは動画の代わりにポスター/ポートレートを使う)
- ポスターが無ければポートレートで代替

### 素材づくりの実務メモ
- **動画からポスターを書き出す**(代表フレーム):
  ```bash
  ffmpeg -y -i "元動画.mp4" -ss 00:00:03 -frames:v 1 -vf "scale=1280:-2" -q:v 80 assets/image/posters/{slug}-01.webp
  ```
- **動画を軽量化**(4K等を1920幅・無音・faststartへ):
  ```bash
  ffmpeg -y -i "元動画.mp4" -vf "scale='min(1920,iw)':-2" -c:v libx264 -crf 24 -preset slow -movflags +faststart -an -pix_fmt yuv420p assets/video/ai-models/{slug}-01.mp4
  ```
- **静止画をWebPへ**:
  ```bash
  ffmpeg -y -i "元画像.png" -vf "scale='min(1280,iw)':-2" -q:v 82 assets/image/models/ai/{slug}/portrait.webp
  ```

### ★ 命名規則(最重要・過去に起動不能の障害あり)
- ファイル名は **半角小文字英数字とハイフンのみ**。空白・日本語・括弧・全角を使わない
  - 良い例: `ai-sora-mixed-01.mp4` / `portrait.webp`
  - 悪い例: `ChatGPT Image 2026年.png`(← 日本語・空白でsync時にクラッシュする)
- 素材は必ず **`assets/`** に置く。`public/assets/` は自動生成コピーなので直接置かない

---

## 2. focalX(顔が切れないための設定)

横長(16:9等)の素材を縦長カードやリボルバーのパネルに入れると、中央基準では顔が切れることがある。
`focalX`(0〜1、人物の水平位置)を指定すると、CSSの`object-position`とWebGLのUVクロップの**両方に自動反映**され、顔が中央に来る。

- `0.5` = 中央(既定)/ `0` = 左端寄り / `1` = 右端寄り
- 人物が画面右にいる素材 → `focalX` を大きく(例 `0.68`)
- 人物が画面左にいる素材 → `focalX` を小さく(例 `0.3`)
- **縦(9:16)素材や、人物が中央の素材なら `focalX` は不要**(省略で中央)

迷ったら Claude Code に「この素材のfocalXを提案して」と依頼すれば、フレームを解析して数値を出す。

---

## 3. データを追加する(`data/models.json`)

`data/models.json` の `models` 配列に1エントリー追加する。

```jsonc
{
  "slug": "ai-sora-mixed",
  "type": "ai",
  "displayName": "SORA",
  "featured": true,
  "published": true,
  "rightsStatus": "approved",
  "portrait": "image/models/ai/ai-sora-mixed/portrait.webp",
  "video": "video/ai-models/ai-sora-mixed-01.mp4",        // 任意
  "videoPoster": "image/posters/ai-sora-mixed-01.webp",   // 任意
  "focalX": 0.55,                                          // 任意(横長素材のみ)
  "categories": ["beauty", "fashion"],
  "bio": {
    "ja": "完全に架空のAIモデル。〇〇向けに設計。",
    "en": "A fully fictional AI model designed for ...",
    "ru": "…", "zh-CN": "…", "ko": "…"                     // 任意(未記入はen→jaで自動フォールバック)
  },
  "capabilities": {
    "ja": ["美容広告", "ファッション"],
    "en": ["Beauty campaigns", "Fashion"]
  }
}
```

パス(`portrait` / `video` / `videoPoster`)は **`assets/` を起点にした相対パス**で書く(先頭に `assets/` は付けない)。

### フィールド早見表
- `published`: `false` にすると非公開(下書き)。`true` で公開
- `featured`: `true` かつ `ai` ならトップのAI Modelsリボルバー/カルーセルに自動で出現
- `rightsStatus`: `real` は `approved` 以外だと自動で全ページから除外される
- `focalX` / `video` / `videoPoster` / `fullbody` / `editorial` / `bio`の各言語 / `location` / `heightCm` などは任意
- スキーマ定義の実体は `lib/content.ts` の `modelSchema`

---

## 4. 検証して確認する

```bash
npm run assets:validate   # 参照切れ・権利・サイズ・ファイル名規則をチェック
npm run dev               # http://localhost:3000/ja で表示確認
```

`assets:validate` が **0 errors** であること。警告(サイズ超過など)は公開前に解消が望ましい。
`featured: true` のAIモデルは、トップの「AI MODELS」セクションに自動で追加される。

公開前の最終確認:
```bash
npm run lint && npm run typecheck && npm run build && npm run test:e2e
node scripts/visual-check.mjs   # リボルバー等の実描画をスクショで確認(3D演出に触れた場合)
```

---

## 5. よくある質問

- **Q. 4名を超えて増やしても大丈夫?**
  A. はい。リボルバーの軌道半径・間隔は枚数に応じて自動調整される。0名〜十数名までレイアウトは崩れない。
- **Q. 実在モデルを載せたいが許諾がまだ**
  A. `published: false` か `rightsStatus: "pending"` にしておく。承諾後に `approved` + `published: true` にする。
- **Q. 動画が重い / スマホで発熱**
  A. §1の再エンコードコマンドで軽量化。目安は1本2.5〜4MB以下。
- **Q. モデル詳細ページは自動でできる?**
  A. はい。`/models/{slug}` は published モデルから自動生成される(sitemapにも自動追加)。

---

## 6. Claude Codeへの依頼テンプレート(コピペ用)

> 新しいモデルを追加してください。素材は次に用意しています(または「用意して」と伝える)。
>
> - slug: `ai-sora-mixed`
> - type: `ai`(架空)
> - 表示名: `SORA`
> - featured: true(トップに出す)
> - rightsStatus: approved
> - categories: ["beauty","fashion"]
> - 素材の元ファイル: `C:\...\sora.mp4`(と、あれば静止画)
>
> 手順は docs/22_MODEL_ADDITION_GUIDE.md に従ってください。
> 動画は1920幅・無音・faststartへ再エンコードし、ポスターWebPを書き出し、
> 命名規則(半角小文字英数字とハイフン)で assets/ に配置してください。
> 横長素材なら focalX を解析して提案してください。
> bioとcapabilitiesの日本語・英語は下書きで構いません(内容は後で調整します)。
> 追加後に assets:validate / dev で表示確認し、visual-check のスクショで
> リボルバー表示を見せてください。

依頼時の注意:
- 実在モデルの場合は「本人の許諾範囲」を必ず伝える(許諾外の公開はしない)
- 架空AIモデルは「実在の誰々に似せて」という依頼はしない(規約違反)
