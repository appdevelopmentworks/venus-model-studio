# Codexフェーズ別プロンプト

Codexが途中で止まった場合、該当するものだけを渡す。

## Phase 1: 素材同期・基盤

```text
既存の進捗を確認し、docs/06_ASSET_NAMING_AND_FOLDER_RULES.mdとdocs/07_TECHNICAL_ARCHITECTURE.mdに従って、assets/の検証、public/assetsへの同期、manifest読込、欠落素材フォールバックを完成させてください。素材の変換や生成はしないでください。完了後、lint、typecheck、assets:validate、buildを実行して修正してください。
```

## Phase 2: HTMLページと多言語

```text
3D追加前に、docs/01、02、08、09、12、20に従って全ルート、全locale、Header、Footer、Models、Projects、Services、For Talents、About、Contactを通常HTML中心で完成させてください。ホームはdata/home-sections.jsonのセクションレジストリで構成し、素材参照はスロット方式(lib/assets.ts)に統一してください。素材欠落時も動作させ、AI/REALラベルとrights filteringを必ず実装してください。テストとbuildを実行してください。
```

## Phase 3: 3D演出

```text
現在のHTMLサイトを壊さず、docs/03_CREATIVE_AND_3D_SPEC.mdに従ってReact Three Fiberの透明Canvasを追加してください。外部3Dモデルを要求せず、HaloRings、ParticleField、GlassMediaPanel、CameraRigをプロシージャル生成してください。HeroはHTML videoを維持し、Canvasはdynamic importしてください。GSAP useGSAPでcleanupし、ScrollTriggerの重複を防止してください。
```

## Phase 3.5: シグネチャー体験

```text
docs/19_SIGNATURE_EXPERIENCE.mdに従い、P0演出(S1 The Awakening、S2 The Meridian、S4 Kinetic Manifesto、S7 Halo Transition)を実装してください。S2はassets/image/source/のstart/endフレームをWebP化した2枚のテクスチャで成立させ、動画テクスチャ版はT3ティアのみにしてください。各演出にreduced-motion、WebGL不可、モバイルのフォールバックを必ず実装し、品質ティア(docs/07 3.5章)で一元制御してください。余裕があればP1(S3 Orbit Gallery、S5 Atelier Wall、S6 Constellation Index、S8 Cursor)を追加してください。
```

## Phase 4: 動画制御と音声

```text
全動画の読み込みを監査し、Hero以外はpreload=none、IntersectionObserverで接近時だけ読み込み、画面外pause、同時再生1本までにしてください。MP4のみでも動作し、WebMがあれば優先してください。Sound On操作後のみ音楽を再生し、Showreel modalを閉じたら停止してください。
```

## Phase 5: モバイル・アクセシビリティ

```text
320pxから1920pxまで検証し、docs/10_RESPONSIVE_ACCESSIBILITY.mdに完全準拠させてください。モバイルはHTMLメディア中心、粒子削減、VideoTexture無効。prefers-reduced-motionでは動画自動再生とカメラ移動を停止。keyboard、focus、modal、form、alt、見出し構造を修正し、axeの重大エラーをなくしてください。
```

## Phase 6: 性能改善

```text
Lighthouseとバンドルを監査し、docs/11_PERFORMANCE_AND_MEDIA_LOADING.mdの予算を目標に改善してください。3D chunkを遅延、Canvas待ちでHTMLを隠さない、初期に下部動画を取得しない、画像sizesを正確化、レイアウトシフトを除去してください。見た目を大きく損なう最適化は避けてください。
```

## Phase 7: 最終テスト

```text
requirementsとdocs/13_TESTING_ACCEPTANCE_CRITERIA.mdを基準に最終監査してください。lint、typecheck、unit、component、Playwright E2E、assets:validate、production buildをすべて実行し、失敗を修正してください。仮データ、Lorem ipsum、未承認実在モデル、架空実績、broken asset、console errorを残さないでください。最後に変更点、テスト結果、ユーザーが設定すべき環境変数だけを報告してください。
```
