# パフォーマンス・メディア読み込み仕様

## 1. 目標

- LCP: 2.5秒以内を目標
- INP: 200ms以内を目標
- CLS: 0.1以下を目標
- 3Dが失敗してもHTMLは即表示

## 2. 初期表示の優先順位

1. HTML見出し
2. Hero poster
3. ナビゲーション
4. Hero video
5. 透明3D Canvas
6. 下部セクション動画
7. 音楽

Canvasや動画の準備待ちでHero文章を隠さない。

プリローダー(19章 S1)を使う場合の条件:

- 表示は最短1.2秒・最長3.5秒でクランプ(実ロードがそれ以上でもHeroポスターへ進む)
- 再訪問(sessionStorage)では0.6秒の短縮版
- プリローダー自体は軽量(HTML+CSS+小さなJS)にし、重い3D初期化を待たせる口実にしない

## 3. サイズ予算

### 画像

- Hero poster desktop: 350KB以下目標
- Hero poster mobile: 250KB以下目標
- model card: 150KB以下目標
- project cover: 250KB以下目標

### 動画

- Hero desktop: 8MB以下目標
- Hero mobile: 5MB以下目標
- section clip: 4MB以下目標
- model hover clip: 2.5MB以下目標

### JavaScript

- 3D関連をmain route初期chunkから分離
- Three.js、R3F、GSAPは必要箇所だけClientへ
- 不要なUIライブラリを追加しない

## 4. 動画ロード戦略

### Hero

```html
<video autoplay muted loop playsinline preload="metadata" poster="...">
```

- モバイルsourceはmedia queryまたはJSで選択
- 音声トラックなし
- autoplay失敗時はposterのまま

### 下部動画

```text
初期: preload=none
接近: sourceを設定
表示: play
画面外: pause
遠ざかった後: 必要ならsource解放
```

### VideoTexture

- 同時に1つ
- active panel以外は静止テクスチャ
- mobileでは使わない
- video elementを使い回し可能にする

## 5. Canvas

- dynamic import
- dpr `[1, 1.5]` 程度
- antialiasは端末で調整
- shadowsは原則オフ、必要箇所だけ疑似表現
- real-time reflection禁止
- transmissionはT3ティアのみ、多用しない
- postprocessingはT3ティアのみ許可。許可パスはBloom(弱)+Noise/Grainの最大2種。
  T2以下ではポストなしで成立する設計にする(グレインはCSS、グローは加算合成マテリアルで代替)
- `PerformanceMonitor` で連続フレーム低下を検出したら粒子削減→ポスト停止→ティア降格の順に自動調整
- フレームループを常時回す必要がなければdemandを検討
- 品質ティア(T0〜T3)の定義は `07_TECHNICAL_ARCHITECTURE.md` 3.5章に従う

## 6. フォント

- `next/font`
- 日本語は可変フォントの巨大ファイルに注意
- 見出しと本文の最大2ファミリー
- 自前フォントファイルを配布物へ含めない

## 7. 画像

- `next/image`
- width/heightまたはfillの親サイズを確定
- above-the-foldのみpriority相当
- sizesを正確に指定

## 8. 検証

- Lighthouse mobile/desktop
- Chrome Performance
- Network Slow 4G
- CPU 4x slowdown
- iOS Safari相当
- Android Chrome相当
- WebGL無効
- reduced motion

## 9. ビルドを止める条件

- Hero MP4がない: 止めない。posterへフォールバック
- manifest構文エラー: 止める
- 実在モデルrights未承認: 公開対象から除外し警告
- 20MBを超える単一Hero: 警告またはビルド失敗を設定可能
