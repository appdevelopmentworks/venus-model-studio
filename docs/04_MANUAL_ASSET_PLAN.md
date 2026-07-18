# 手動制作する素材一覧

## 結論

初期段階で手動制作するのは **動画、画像、音楽・効果音のみ**。3Dファイルは作らない。

## 1. `assets/` フォルダー

```text
assets/
├─ brand/
├─ video/
│  ├─ hero/
│  ├─ ai-models/
│  ├─ real-models/
│  ├─ hybrid/
│  ├─ projects/
│  ├─ showreel/
│  └─ brand/
├─ image/
│  ├─ posters/
│  ├─ models/
│  │  ├─ ai/
│  │  └─ real/
│  ├─ projects/
│  ├─ backgrounds/
│  └─ seo/
├─ audio/
│  ├─ music/
│  └─ sfx/
└─ asset-manifest.json
```

## 2. P0必須動画

### V01 Hero Desktop

- ファイル: `video/hero/hero-hybrid-desktop.mp4`
- 16:9
- 8〜10秒
- AIモデルと実在モデルを象徴する2人
- 黒、白、シャンパンゴールドのスタジオ
- ゆっくりしたドリーイン
- 無音
- 文字なし
- ループ可能

### V02 Hero Mobile

- `video/hero/hero-hybrid-mobile.mp4`
- 9:16
- 6〜8秒
- Desktopの単純クロップではなく縦構図で制作

### V03 AI Western Beauty

- `video/ai-models/ai-western-beauty-01.mp4`
- 4:5または9:16
- 5〜7秒
- 顔、目線、髪の微細な動き

### V04 AI Nordic Runway

- `video/ai-models/ai-nordic-runway-01.mp4`
- 9:16
- 5〜7秒
- 全身、1回の歩行と停止

### V05 AI Latin Commercial

- `video/ai-models/ai-latin-commercial-01.mp4`
- 4:5または9:16
- 5〜7秒
- 親しみやすい広告表情

### V06 AI Japanese Mixed

- `video/ai-models/ai-japanese-mixed-01.mp4`
- 4:5または9:16
- 5〜7秒
- 日本市場向けの自然な表情

### V07 Real Studio Flash

- `video/real-models/real-studio-flash-01.mp4`
- 16:9
- 5〜8秒
- 実在モデル、撮影、ストロボ、撮影現場

### V08 Real Backstage

- `video/real-models/real-backstage-01.mp4`
- 16:9または4:5
- 5〜8秒
- ヘアメイク、鏡、撮影直前

### V09 Hybrid Digital Twin

- `video/hybrid/hybrid-digital-twin-01.mp4`
- 16:9
- 6〜10秒
- 実在モデルの表現領域が拡張される流れ

### V10 Hybrid World Transform

- `video/hybrid/hybrid-world-transform-01.mp4`
- 16:9
- 6〜10秒
- 同一人物の顔を保ち、衣装と背景を変化

### V11 Logo Reveal

- `video/brand/brand-logo-reveal-01.mp4`
- 16:9
- 3秒
- 黒背景と金色ロゴ
- サイトでは透明ロゴ画像＋3Dリングで代替可能なため、未完成でも進行可能

## 3. P1任意動画

- `video/showreel/venus-showreel-45s.mp4`
- ケーススタディごとの短い動画
- モデル詳細ページ用の別カット
- 9:16 SNS動画

## 4. 必須画像

### ブランド

```text
brand/venus-emblem.svg             推奨
brand/venus-emblem-gold.png        透明背景
brand/venus-wordmark.svg           存在する場合
brand/favicon.png
```

SVGがない場合は透明PNG/WebPで開始してよい。

### 各動画のポスター

動画と同じベース名で作る。

```text
image/posters/hero-hybrid-desktop.webp
image/posters/hero-hybrid-mobile.webp
image/posters/ai-western-beauty-01.webp
...
```

### AIモデル4名

各人物:

```text
portrait.webp      4:5
fullbody.webp      2:3
editorial.webp     16:9または4:5
```

### 実在モデル

準備できる人数から開始。各人物:

```text
portrait.webp
fullbody.webp
editorial.webp
```

実在モデル素材が1〜2名しかなくてもサイトは完成可能にする。

### プロジェクト

最低3件分。

```text
image/projects/{project-slug}/cover.webp
image/projects/{project-slug}/detail-01.webp
image/projects/{project-slug}/detail-02.webp
```

### SEO

```text
image/seo/og-home-ja.webp
image/seo/og-home-en.webp
image/seo/og-default.webp
```

推奨1200×630。

## 5. 音楽・効果音

### 必須ではないが推奨

```text
audio/music/venus-ambient-loop.mp3
audio/sfx/logo-reveal.mp3
audio/sfx/panel-open.mp3
```

- 音楽は20〜45秒のループ
- 高級ファッション、アンビエント、シネマティック
- 歌詞なし
- UI音は短く小さく
- サイト初期状態では再生しない

## 6. 使用ツールの役割

### Z-Image

- モデルの基準静止画
- Hero開始・終了フレーム
- ポスター
- モデルカード
- 写実性が必要な画像

### LTX-2.3 ローカル

- 基準画像から短いI2V
- 顔を保った微細な動き
- ランウェイや撮影のシンプルな動作
- 縦動画
- ループ素材

### Google Flow

- Hero
- start frame / end frameを使った遷移
- Ingredientsを使った人物・空間の一貫性
- Hybrid Digital Twin
- 複数クリップのScene Builder
- 高品質な映像修正、延長

### LitMedia

- Seedance、Veo、Klingなどの比較生成
- ローカルLTXで難しいショットの代替
- 動画延長、画質改善
- アンビエント音楽、効果音

## 7. 書き出し基準

### 動画

- MP4 H.264を必須
- WebMは任意
- 24または30fps
- Hero Desktop: 1920×1080、8MB以下を目標
- Hero Mobile: 1080×1920、5MB以下を目標
- その他: 長辺1280〜1920、4MB以下を目標
- Hero自動再生用ファイルから音声トラックを削除

### 画像

- WebP推奨
- 透明ロゴはPNGまたはSVG
- ポスターは通常250KB以下を目標
- 元画像をアップスケールし過ぎない

### 音声

- MP3
- 128〜192kbps
- 音量を控えめに正規化
