# Codexへ最初に渡すマスタープロンプト

以下のコードブロック全体をCodexへ渡してください。

```text
あなたはvenus-model-studioプロジェクトを完成させる主任フルスタック兼クリエイティブWebエンジニアです。目標品質はAwwwards SOTD入賞レベルです。

最初にプロジェクト全体を確認し、docs/00_README_FIRST.mdからdocs/21_ASSET_AUDIT_STATUS.mdまで、templatesを含む全ドキュメントを読んでください。ユーザーへ同じ質問を繰り返さず、文書間の優先順位は次の通りです。

1. 01_PRODUCT_REQUIREMENTS.md
2. 13_TESTING_ACCEPTANCE_CRITERIA.md
3. 07_TECHNICAL_ARCHITECTURE.md
4. 03_CREATIVE_AND_3D_SPEC.md
5. 19_SIGNATURE_EXPERIENCE.md(独自演出。P0のS1/S2/S4/S7は必須)
6. 20_EXTENSIBILITY_CONTENT_PIPELINE.md(拡張性。セクションレジストリとスロット方式は必須)
7. その他の文書

重要な前提:
- ユーザーが手動で作る素材はルートassets/内の動画、画像、音楽です。
- 素材を勝手に生成、置換、加工しないでください。
- 初期版ではGLB、FBX、Blenderなどの3D素材を要求しないでください。
- 3Dリング、粒子、ガラスパネル、奥行き、カメラ演出はThree.js / React Three Fiberでプロシージャル生成してください。
- assets/を配信するためscripts/sync-assets.mjsとscripts/validate-assets.mjsを実装し、public/assets/へ同期してください。
- MP4必須、WebM任意です。WebMがなくても動作させてください。
- 素材が欠ける場合は上品なフォールバックで完成させ、broken mediaを表示しないでください。
- 実在モデルはrightsStatus=approvedだけ公開してください。
- AIモデル、実在モデル、AI編集実在モデルを視覚的かつ文章で明確に区別してください。
- 架空の顧客、賞、掲載実績を捏造しないでください。

技術:
- 既存構成がある場合は尊重し、なければNext.js 16 App Router、React 19、TypeScript strict、Tailwind CSS 4を採用してください。
- Three.js、@react-three/fiber 9、@react-three/drei、GSAP、@gsap/react、lenis、next-intl、Zodを使用してください。
- 品質ティアT0〜T3(docs/07 3.5章)を実装し、全演出をティアで一元制御してください。
- ホーム構成はdata/home-sections.jsonのセクションレジストリで宣言し、素材はスロット方式(lib/assets.tsのgetAsset)で解決してください。モデル・プロジェクト・セクションの追加がコード変更なしで可能な状態が受け入れ条件です。
- Server Componentsを既定にし、Canvas、動画、音声、GSAPだけをClient Componentにしてください。
- 3D Canvasはdynamic importし、SSRから分離してください。
- 日本語、英語、ロシア語、中国語簡体、韓国語を実装してください。
- UIテキストは動画・画像へ焼き込まずHTMLで表示してください。
- Hero動画はHTML videoを第一候補にし、その上へ透明Canvasを重ねてください。
- 下部動画の同時再生は1本まで。画面外では停止してください。
- 音楽はユーザーがSound Onを押すまで再生しないでください。
- prefers-reduced-motion、WebGL非対応、低性能モバイルのフォールバックを実装してください。

作業手順:
1. リポジトリとassetsを監査し、既存コードを壊さない実装計画を内部で作る。
2. 必要な依存関係、ディレクトリ、データスキーマを整える。
3. assets同期と検証を先に実装する。
4. HTML中心の全ページ、ナビゲーション、多言語、データ表示を完成させる。
5. その後に3D Canvasとスクロール演出を追加する。
6. モバイル、reduced-motion、WebGL fallbackを実装する。
7. SEO、sitemap、robots、metadata、structured dataを実装する。
8. Unit、component、Playwright E2Eを追加する。
9. lint、typecheck、test、test:e2e、build、assets:validateを実行し、失敗を修正する。
10. READMEへ起動方法、素材追加方法、環境変数、公開方法を記載する。

実装ルール:
- 不明点が小さい場合は合理的な仮定で進め、TODOとして残さず完成度を優先してください。
- 大きな仕様矛盾がなければ確認待ちで停止しないでください。
- 途中経過だけで終了せず、実行可能な状態まで進めてください。
- 変更したファイル、実行したテスト、未設定の外部サービスだけを最後に簡潔に報告してください。
- APIキーや個人情報をコミットしないでください。
- コンソールエラー、TypeScriptエラー、lintエラーを残さないでください。

最初にdocsを読み、現状監査から着手してください。
```
