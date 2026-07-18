# 技術アーキテクチャ

## 1. 基本技術

- Next.js 16系 App Router
- React 19系
- TypeScript strict
- Tailwind CSS 4系
- Three.js
- `@react-three/fiber` 9系
- `@react-three/drei`
- `@react-three/postprocessing`(T3品質ティアのみで使用。11章参照)
- GSAP + `@gsap/react`
- `lenis`(慣性スムーススクロール。reduced-motion時は無効化)
- `next-intl`
- Zod
- Lucide React
- Vitest + Testing Library
- Playwright

既存プロジェクトにpackage managerや設定がある場合は尊重する。新規ならpnpmを推奨するが、Codexは利用可能な環境を検出する。

## 2. アーキテクチャ原則

- Server Componentを既定とする。
- Canvas、動画制御、GSAP、音声のみClient Componentにする。
- 3D Canvasはdynamic importし、初期JSから分離する。
- HTMLコンテンツをCanvas内だけに閉じ込めない。
- CMS、DBを導入しない。
- モデル、プロジェクト、サービスはローカルJSONまたはTypeScriptデータ。
- すべてのページを静的生成可能にする。

## 3. 推奨構成

```text
app/
├─ [locale]/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ models/
│  │  ├─ page.tsx
│  │  └─ [slug]/page.tsx
│  ├─ services/page.tsx
│  ├─ projects/
│  │  ├─ page.tsx
│  │  └─ [slug]/page.tsx
│  ├─ for-talents/page.tsx
│  ├─ about/page.tsx
│  ├─ contact/page.tsx
│  ├─ privacy/page.tsx
│  └─ terms/page.tsx
├─ sitemap.ts
├─ robots.ts
└─ globals.css

components/
├─ layout/
├─ sections/
├─ media/
├─ three/
├─ models/
├─ projects/
├─ forms/
└─ ui/

data/
├─ models.json
├─ projects.json
├─ services.json
├─ home-sections.json   # ホーム構成のセクションレジストリ(20章参照)
└─ site.json

config/
└─ three.ts             # 粒子数、リング本数、品質ティア閾値などの設定集約

i18n/
├─ routing.ts
└─ request.ts

messages/
├─ ja.json
├─ en.json
├─ ru.json
├─ zh-CN.json
└─ ko.json

lib/
├─ assets.ts
├─ content.ts
├─ metadata.ts
├─ performance.ts
└─ validation.ts

scripts/
├─ sync-assets.mjs
└─ validate-assets.mjs
```

## 3.5 品質ティア

演出のON/OFFと負荷を `lib/performance.ts` の単一ティア判定で一元制御する。
判定材料: WebGL可否、reduced-motion、画面幅、deviceMemory、
`drei` の `PerformanceMonitor` による実測フレームレート降格。

```text
T3 cinema   高性能デスクトップ: 全演出+限定ポストプロセス(Bloom弱+Grain)
            粒子1200、VideoTexture 1本、ガラスtransmission可
T2 balanced 標準デスクトップ: ポストプロセスなし(グレインはCSS)、粒子600
T1 lite     モバイル/低性能: 粒子150、VideoTextureなし、HTML動画中心
T0 static   WebGL不可/reduced-motion: Canvasなし。CSS/HTMLで同等の情報と品質
```

- ティアは起動時判定+実行中降格のみ(実行中昇格はしない)
- 降格は視覚的にスムーズに行い、ユーザーへ警告を出さない
- 各シグネチャー演出(19章)は必ずティアごとのフォールバック定義を持つ

## 4. 3Dレイヤー

### `ThreeExperience`

- dynamic import
- `ssr: false`
- `<Canvas>`を固定背景として配置
- Device Pixel Ratioは最大1.5程度
- powerPreferenceをhigh-performanceに固定しない。端末に応じる
- 背景透明

### シーン構成

```text
ThreeExperience
├─ CameraRig
├─ AmbientLighting
├─ HaloRings
├─ ParticleField
├─ GlassPanelGroup
├─ ActiveMediaPanel
└─ SceneProgressController
```

## 5. スクロール制御

GSAP ScrollTriggerを使用してDOMセクションと3Dシーン進行を同期する。

- `useGSAP`で必ずcleanup
- Client Componentのみ
- 1つのmaster timelineに集約
- 各コンポーネントが独自に大量のScrollTriggerを作らない
- Strict Modeで重複しないことをテスト
- LenisとScrollTriggerは公式推奨の連携(`lenis.on('scroll', ScrollTrigger.update)`)で同期
- シーン区間はセクションレジストリ(`data/home-sections.json`)から動的算出し、
  セクション追加時に3D側のタイムライン手修正を不要にする(20章参照)

## 6. メディア制御

### Hero

- HTML `<video>`
- autoplay, muted, loop, playsInline
- poster指定
- 音声トラックなしを推奨
- モバイルとデスクトップでsourceを分ける

### セクション動画

- 初期`preload="none"`
- IntersectionObserverで近づいた時だけmetadataまたは再生
- 画面外でpause
- 同時再生は1本まで
- Canvas VideoTextureはデスクトップの選択中パネルだけ

### 音楽

- ユーザー操作後のみ再生
- 状態をセッション内で保持してもよいが、ブラウザー永続保存は必須でない
- ページ遷移で急に大音量にならない

## 7. 素材同期

`predev` と `prebuild` で `sync-assets.mjs` を実行する。

```json
{
  "scripts": {
    "assets:sync": "node scripts/sync-assets.mjs",
    "assets:validate": "node scripts/validate-assets.mjs",
    "predev": "pnpm assets:sync",
    "prebuild": "pnpm assets:sync && pnpm assets:validate"
  }
}
```

package managerに応じてコマンドを調整する。

## 8. セキュリティ

- APIキーをクライアントへ露出しない
- Contact APIを作る場合はZod、レート制限、honeypot
- HTMLを外部入力から直接描画しない
- CSPは動画、画像、フォントの実際の配信元に合わせる
- 初期版は外部動画埋め込みを避け、ローカル静的配信を優先
