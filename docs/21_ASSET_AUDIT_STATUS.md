# 素材監査・現状ステータス

監査日: 2026-07-18(動画再エンコード後に更新)
`assets/` の実ファイルを走査した結果。素材追加のたびにこの文書を更新する。

**現状: assets:validate は 0 errors / 0 warnings。全動画が予算内。**
全動画を1920幅・H.264(crf 23〜25)・faststart・音声トラック除去で再エンコード済み(4Kソースからダウンスケール)。

## 1. 現在ある素材

| ファイル | サイズ | 予算 | 判定 |
|---|---|---|---|
| video/hero/hero-hybrid-desktop.mp4 | 2.7MB | 8MB以下 | OK |
| video/hero/hero-hybrid-mobile.mp4 | 4.0MB | 5MB以下 | OK |
| video/ai-models/ai-western-beauty-01.mp4 | 1.5MB | 2.5〜4MB | OK |
| video/ai-models/ai-nordic-runway-01.mp4 | 1.1MB | 2.5〜4MB | OK |
| video/ai-models/ai-latin-commercial-01.mp4 | 912KB | 2.5〜4MB | OK |
| video/ai-models/ai-japanese-mixed-01.mp4 | 1.1MB | 2.5〜4MB | OK |
| video/real-models/real-studio-flash-01.mp4 | 1.4MB | 4MB以下 | OK |
| video/real-models/real-backstage-01.mp4 | 1.6MB | 4MB以下 | OK |
| video/hybrid/hybrid-digital-twin-01.mp4 | 1.6MB | 4MB以下 | OK |
| video/hybrid/hybrid-world-transform-01.mp4 | 2.1MB | 4MB以下 | OK |
| audio/music/venus-ambient-loop.mp3 | 728KB | — | OK |
| image/posters/*.webp(動画代表フレーム) | 各40〜92KB | 250KB以下 | OK |
| image/backgrounds/meridian-{real,digital}.webp | 34/65KB | — | OK(S2用) |
| image/source/*.png(作業用原版) | 各1.7〜2MB | — | 同期対象外(配信されない) |

備考:

- ヒーロー以外にもAIモデル動画4本、実在モデル動画2本、ハイブリッド動画2本、音楽が既にある。
  ホームの主要セクション(Hero / AI Models / Real Talent / Hybrid)は現素材で起動可能
- `image/source/` は作業用原版フォルダーとして扱い、`sync-assets.mjs` の同期対象から除外する。
  Meridian(S2)用にはWebP書き出し版を配信フォルダーへ置く(下記P0参照)

## 2. 不足素材(P0: これが無いと公開不可)

```text
brand/venus-emblem.svg または venus-emblem-gold.png   ロゴ
brand/favicon.png                                      ファビコン
image/posters/hero-hybrid-desktop.webp                 Heroポスター(LCP要素)
image/posters/hero-hybrid-mobile.webp
image/posters/ai-western-beauty-01.webp                各動画ポスター(全10本分)
image/posters/ai-nordic-runway-01.webp
image/posters/ai-latin-commercial-01.webp
image/posters/ai-japanese-mixed-01.webp
image/posters/real-studio-flash-01.webp
image/posters/real-backstage-01.webp
image/backgrounds/meridian-real.webp                   S2用(sourceのstartフレームから書き出し)
image/backgrounds/meridian-digital.webp                S2用(sourceのendフレームから書き出し)
image/models/ai/{slug}/portrait.webp × 4名             AIモデル静止画(動画からの切り出しでも可)
image/seo/og-default.webp                              OG画像(1200×630)
asset-manifest.json                                    マニフェスト本体
```

ポスターは各動画の代表フレームを書き出せば新規生成は不要。

## 3. 不足素材(P1: あると完成度が上がる)

```text
image/models/ai/{slug}/fullbody.webp, editorial.webp
image/projects/{slug}/ × 3件分(CONCEPT PROJECT用)
image/seo/og-home-ja.webp, og-home-en.webp
audio/sfx/logo-reveal.mp3, panel-open.mp3
video/showreel/venus-showreel-45s.mp4
video/brand/brand-logo-reveal-01.mp4(ロゴ+リング演出で代替可能なため任意)
実在モデルの静止画(rights approved後)
```

## 4. 再エンコードの目安コマンド

動画(H.264、品質を保ったまま圧縮):

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -movflags +faststart -an output.mp4
# Heroで8MBを超える場合はcrf 24〜26へ。-an で音声トラック除去(自動再生用)
```

ポスター・静止画のWebP化:

```bash
ffmpeg -i input.png -vf "scale=1920:-2" -quality 82 output.webp
# ポスターは250KB以下目標。モデルカードは150KB以下
```

動画から代表フレームを抽出してポスター化:

```bash
ffmpeg -i video.mp4 -ss 00:00:02 -frames:v 1 -vf "scale=1920:-2" -quality 82 poster.webp
```

## 5. 運用ルール

- 素材を追加したら `asset-manifest.json` に登録し、`pnpm assets:validate` を実行
- 予算超過は警告で検知される。Heroが20MBを超える場合はビルド失敗
- 実在モデル素材は `rightsStatus: approved` になるまで `published: false`
- この表の「要再エンコード」が残っていても開発は進められる(公開前に解消)
