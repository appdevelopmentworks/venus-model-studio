# 素材の命名・配置ルール

## 1. 命名原則

- 小文字英数字とハイフンのみ
- 空白、日本語、括弧を使わない
- ファイル名でカテゴリーと内容が分かるようにする
- バージョン番号を日常的にファイル名へ増殖させない
- 採用版だけを正式名にする

## 2. 正式な配置例

```text
assets/
├─ asset-manifest.json
├─ brand/
│  ├─ venus-emblem.svg
│  ├─ venus-emblem-gold.png
│  └─ favicon.png
├─ video/
│  ├─ hero/
│  │  ├─ hero-hybrid-desktop.mp4
│  │  └─ hero-hybrid-mobile.mp4
│  ├─ ai-models/
│  │  ├─ ai-western-beauty-01.mp4
│  │  ├─ ai-nordic-runway-01.mp4
│  │  ├─ ai-latin-commercial-01.mp4
│  │  └─ ai-japanese-mixed-01.mp4
│  ├─ real-models/
│  │  ├─ real-studio-flash-01.mp4
│  │  └─ real-backstage-01.mp4
│  ├─ hybrid/
│  │  ├─ hybrid-digital-twin-01.mp4
│  │  └─ hybrid-world-transform-01.mp4
│  ├─ showreel/
│  │  └─ venus-showreel-45s.mp4
│  └─ brand/
│     └─ brand-logo-reveal-01.mp4
├─ image/
│  ├─ posters/
│  ├─ models/
│  │  ├─ ai/{model-slug}/
│  │  └─ real/{model-slug}/
│  ├─ projects/{project-slug}/
│  ├─ backgrounds/
│  └─ seo/
└─ audio/
   ├─ music/venus-ambient-loop.mp3
   └─ sfx/
```

## 3. モデルslug例

```text
ai-elena-west
ai-freja-nordic
ai-camila-latin
ai-mio-hybrid
real-model-001
real-model-002
```

実在モデルは公開可能な活動名が確定した時点でslugを変更してよい。

## 4. 必須形式

### 動画

- `.mp4` 必須
- 同名`.webm` 任意

CodexはWebMが存在すれば先に指定し、なければMP4だけで動作させる。

### 画像

優先順:

1. SVG: ロゴ、アイコン
2. WebP: 写真、ポスター
3. PNG: 透明素材
4. JPEG: 元素材しかない場合

### 音声

- MP3必須
- OGG任意

## 5. `asset-manifest.json`

ユーザーが手動で完全記入できなくても、Codexがファイルの存在を検査して初期版を補完する。ただしAI／REAL区分、権利、代替テキストは推測してはいけない。

必須項目:

```json
{
  "id": "hero-hybrid-desktop",
  "type": "video",
  "category": "hero",
  "src": "video/hero/hero-hybrid-desktop.mp4",
  "poster": "image/posters/hero-hybrid-desktop.webp",
  "aspectRatio": "16:9",
  "autoplay": true,
  "loop": true,
  "muted": true,
  "altJa": "AIモデルと実在モデルを象徴する二人が並ぶスタジオ映像",
  "altEn": "Two models representing real talent and digital possibility in a luxury studio",
  "rightsStatus": "approved"
}
```

## 6. Codexが作る同期処理

Codexは次を実装する。

```text
scripts/sync-assets.mjs
scripts/validate-assets.mjs
```

### sync-assets

- `assets/` を `public/assets/` にコピー
- `docs/` はコピーしない
- ソース素材を変換しない
- ファイル名を変えない
- 削除された素材は配信先からも削除

### validate-assets

- manifest参照先の存在確認
- Hero MP4の存在確認
- poster欠落を警告
- 大き過ぎるファイルを警告
- rightsStatusがapprovedでない実在モデルを公開データから除外

## 7. 欠落時の挙動

- Hero動画なし: Hero posterを使用
- Posterなし: ブランド背景＋テキスト
- Model videoなし: 静止画だけで表示
- Audioなし: Soundボタンを非表示
- Showreelなし: セクションを非表示
- Real modelsなし: 募集ページは表示するが架空人物を実在と偽らない
