# 公式参照資料

確認日: 2026-07-17

## 制作ツール

### LitMedia

- Official home: https://www.litmedia.ai/
- 動画、画像、音楽を一つのサービスで扱い、Seedance、Veo、Klingなど複数モデルを掲載。
- 本プロジェクトでは代替動画生成、動画延長、音楽生成に使用。

### LTX-2.3

- Model page: https://ltx.io/model/ltx-2-3
- ComfyUI workflows: https://github.com/Lightricks/ComfyUI-LTXVideo/
- Native portrait、image-to-video、camera control、20秒クリップ、音声映像統合などを公式が案内。
- 本プロジェクトでは短いI2Vと安定した微細動作を中心に使用。

### Z-Image

- Official repository: https://github.com/Tongyi-MAI/Z-Image
- 写実的画像、指示追従、基盤モデルでのnegative prompting、Turboの高速生成などを公式が案内。
- Turboは公式表でCFGなしのため、利用UIによってnegative promptが効かない可能性に注意。

### Google Flow

- Help center: https://support.google.com/flow/
- Create videos: https://support.google.com/flow/answer/16353334
- Edit videos & build scenes: https://support.google.com/flow/answer/16935718
- Create & edit images: https://support.google.com/flow/answer/16729550
- Frames、Ingredients、人物や物体の参照、動画編集、延長、Scene Builder、画像生成・編集を公式が案内。

## Web開発

### Next.js

- Docs: https://nextjs.org/docs
- Lazy loading: https://nextjs.org/docs/app/guides/lazy-loading
- App Router、Server Components、Client Component遅延読込を参照。

### React Three Fiber

- Introduction: https://r3f.docs.pmnd.rs/getting-started/introduction
- React 19には`@react-three/fiber` 9系を合わせる旨が公式に記載。

### Three.js

- Docs: https://threejs.org/docs/

### GSAP React

- React guide: https://gsap.com/resources/React/
- `useGSAP`によるcleanupとNext.js Client Componentでの利用を参照。

### MDN Media

- Video element: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video
- Autoplay guide: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
- Video performance: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/video
- muted videoのautoplay、poster、preload、音声トラック削除を参照。

## 注記

サービスのモデル名、利用可能地域、料金、生成長、利用規約は変更される可能性がある。素材制作開始時と公開前に各サービスの画面・利用規約を再確認する。
