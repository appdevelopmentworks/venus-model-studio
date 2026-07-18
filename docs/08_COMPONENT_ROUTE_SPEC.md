# ルート・コンポーネント仕様

## 共通レイアウト

### `SiteHeader`

- 透明からスクロール後に半透明黒へ
- Logo
- Models, Services, Projects, For Talents, About
- Contact CTA
- Locale switcher
- モバイルメニュー
- キーボード操作可能

### `SiteFooter`

- Brand statement
- Navigation
- SNS
- Contact
- 法的ページ
- Copyright

### `SoundToggle`

- 音声素材が存在する場合だけ表示
- 初期Off
- 状態をaria-labelで示す

### `MotionToggle`

OS設定を尊重。明示的設定UIはP1。

## Home components

```text
HomePage
├─ HeroSection
├─ ManifestoSection
├─ AIModelsSection
├─ RealTalentSection
├─ HybridProductionSection
├─ ServicesSection
├─ FeaturedModelsSection
├─ FeaturedProjectsSection
├─ ForTalentsSection
├─ ShowreelSection (optional)
├─ ContactSection
└─ EndingBrandSection
```

## Media components

### `ResponsiveVideo`

Props:

```ts
type ResponsiveVideoProps = {
  desktopSrc: string;
  mobileSrc?: string;
  poster: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  className?: string;
};
```

- play()失敗を例外にしない
- Reduced Motion時はposterのみ
- `<track>`は会話動画を追加する場合に使用

### `MediaCard`

- poster
- optional video
- category badge
- title
- short description
- hoverで動画再生はdesktop pointer環境のみ
- focus時に情報が失われない

### `ShowreelModal`

- ユーザー操作で開く
- controlsあり
- Escで閉じる
- focus trap
- 閉じたらpause

## Model components

### `ModelCard`

- AI／REALラベル
- portrait
- optional hover video
- name
- category
- locale-aware link

### `ModelProfile`

- Hero image
- Gallery
- Motion clip
- Public facts
- Capabilities
- Inquiry CTA

## Project components

### `ProjectCard`

- cover
- concept/client badge
- title
- category
- model names

### `ProjectStory`

- Challenge
- Approach
- Human contribution
- AI contribution
- Media gallery
- Credits

## 3D components

### `HaloRings`

- TorusGeometry 2〜4本
- スクロールで開閉
- reduced-motionで停止

### `ParticleField`

- desktop 500〜1200
- mobile 100〜250
- low-end 0〜100

### `GlassMediaPanel`

- poster textureを基本
- video textureはactive時だけ
- hoverで微細なtilt
- 透明度を高くし過ぎない

### `CameraRig`

- Scene progress 0〜1を受け取る
- 補間して移動
- pointer追従は最大ごく小さくする

## Contact

初期版:

- 名前
- 組織名 任意
- メール
- 問い合わせ種別
- 本文
- プライバシー同意

送信方法:

1. 環境変数があればサーバー送信
2. 未設定なら明確なメールリンクへフォールバック

成功したように見せて実際には送信しない実装は禁止。
