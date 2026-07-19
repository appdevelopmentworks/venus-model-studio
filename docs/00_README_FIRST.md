# Venus Model Studio 開発ドキュメント

このフォルダーは、`venus-model-studio/assets` に手動配置した動画・画像・音楽を使い、Codexでサイトを一気通貫に実装するための仕様書一式です。

## 最重要方針

1. 手動で作る素材は、初期段階では **動画・画像・音楽のみ**。
2. 手動素材はプロジェクト直下の `assets/` に配置する。
3. 3Dリング、ガラスパネル、光粒子、奥行き、カメラ移動などは、CodexがThree.js / React Three Fiberでプロシージャル生成する。
4. 初期段階ではGLB、FBX、Blenderファイルを要求しない。
5. 説明文、タイトル、CTAは画像や動画へ焼き込まず、HTMLで表示する。
6. 実在モデルとAIモデルを必ず明確に区別する。
7. 素材が未完成でも、プレースホルダーとフォールバックでサイトを起動できるようにする。

## 品質目標

本サイトはAwwwards / FWA / CSS Design Awards 入賞レベルを目標とする。
そのための独自演出は `19_SIGNATURE_EXPERIENCE.md`、拡張性設計は
`20_EXTENSIBILITY_CONTENT_PIPELINE.md` に定義した。実装時は必ず参照する。

## 推奨作業順

1. `21_ASSET_AUDIT_STATUS.md` で現素材の不足(P0)を確認し、`04_MANUAL_ASSET_PLAN.md` を見ながら素材を作る。
2. `06_ASSET_NAMING_AND_FOLDER_RULES.md` の名前で `assets/` に配置する。
3. `templates/asset-manifest.example.json` を参考に `assets/asset-manifest.json` を作る。
4. Codexに `14_CODEX_MASTER_PROMPT.md` の内容を最初の指示として渡す。
5. Codexが段階途中で止まった場合は `15_CODEX_PHASE_PROMPTS.md` の該当フェーズを渡す。
6. `13_TESTING_ACCEPTANCE_CRITERIA.md` の基準をすべて満たすまで修正する。

## ドキュメント一覧

- `01_PRODUCT_REQUIREMENTS.md`: 要求定義
- `02_SITE_MAP_CONTENT.md`: サイト構造と掲載内容
- `03_CREATIVE_AND_3D_SPEC.md`: デザイン、演出、3D仕様
- `04_MANUAL_ASSET_PLAN.md`: 手動制作する素材の全一覧
- `05_ASSET_PRODUCTION_PROMPTS.md`: Z-Image、LTX-2.3、Google Flow、LitMedia用プロンプト
- `06_ASSET_NAMING_AND_FOLDER_RULES.md`: フォルダー、命名、形式
- `07_TECHNICAL_ARCHITECTURE.md`: 技術構成
- `08_COMPONENT_ROUTE_SPEC.md`: ルート、コンポーネント
- `09_DATA_AND_CONTENT_SCHEMA.md`: JSONデータ仕様
- `10_RESPONSIVE_ACCESSIBILITY.md`: レスポンシブとアクセシビリティ
- `11_PERFORMANCE_AND_MEDIA_LOADING.md`: 動画・3Dの負荷対策
- `12_SEO_I18N_ANALYTICS.md`: SEO、多言語、解析
- `13_TESTING_ACCEPTANCE_CRITERIA.md`: テストと完成判定
- `14_CODEX_MASTER_PROMPT.md`: Codexへ最初に渡すプロンプト
- `15_CODEX_PHASE_PROMPTS.md`: フェーズ別の再開用プロンプト
- `16_DEPLOYMENT_CHECKLIST.md`: 公開前チェック
- `17_SOURCE_REFERENCES.md`: 参照した公式資料
- `18_AGENTS_MD_TEMPLATE.md`: Codex向け恒久ルール
- `19_SIGNATURE_EXPERIENCE.md`: 独自演出(シグネチャー体験)の詳細仕様
- `20_EXTENSIBILITY_CONTENT_PIPELINE.md`: 拡張性・コンテンツ追加パイプライン
- `21_ASSET_AUDIT_STATUS.md`: 素材の現状監査と不足リスト
- `22_MODEL_ADDITION_GUIDE.md`: モデル追加手順書(素材の準備・配置・データ追加)

## 想定ディレクトリ

```text
venus-model-studio/
├─ assets/                  # ユーザーが手動作成した素材
├─ docs/                    # このZIPの中身
├─ public/assets/           # Codexがassetsから同期する配信用ファイル
├─ src/ または app/         # Codexが実装
├─ scripts/                 # Codexが素材同期・検証スクリプトを作成
└─ package.json
```

`assets/` は制作物の正本、`public/assets/` は配信用コピーです。Codexはメディアの内容を勝手に生成・置換・改変してはいけません。
