# 拡張性・コンテンツ追加パイプライン

この文書は「後からコンテンツを追加しやすいサイト」を実現するための設計原則を定義する。
目標: **コードを書かずに、素材+JSONの追加だけでモデル・プロジェクト・セクションが増やせる**こと。

## 1. 大原則: Content as Data

- ページの「構成」も「内容」もJSONが正本。コンポーネントは器
- 新しいモデル1名の追加 = 画像/動画を `assets/` に置く+`models.json` に1エントリー
- データが無いものは自動で非表示(エラーにも空白にもしない)
- データが増えたときにレイアウトが自動適応する(4名でも12名でも破綻しない)

## 2. セクションレジストリ(ホーム構成の外部化)

ホームページのセクション構成をハードコードせず、`data/home-sections.json` で宣言する。

```ts
type SectionEntry = {
  id: string;            // 一意ID
  component: SectionKey; // 登録済みセクションコンポーネント名
  enabled: boolean;      // falseで非表示(コード変更なしで出し入れ)
  order: number;         // 表示順
  variant?: string;      // 'orbit' | 'grid' など表示バリエーション
  dataSource?: string;   // 参照するデータファイル/フィルター
  minItems?: number;     // これ未満なら自動非表示(例: projects最低1件)
};

type SectionKey =
  | 'hero' | 'manifesto' | 'aiModels' | 'realTalent'
  | 'hybridMeridian' | 'services' | 'featuredModels'
  | 'featuredProjects' | 'forTalents' | 'showreel'
  | 'contact' | 'endingSeal'
  // 将来追加枠(コンポーネント実装時にキーを登録)
  | 'news' | 'awards' | 'journal' | 'clients' | 'faq';
```

実装ルール:

- `components/sections/registry.ts` に `SectionKey → Component` のマップを1箇所だけ持つ
- 未実装キーがJSONにあってもビルドを壊さず、開発時のみ警告
- 3D演出(Orbit等)はセクションコンポーネント内に閉じ、追加・削除が
  `SceneProgressController` の進行度再計算だけで済むようにする
- スクロールストーリーの進行度はセクション数から動的算出(固定%を持たない)

これにより、将来「News」「受賞歴」「クライアントロゴ」等を追加する際は
コンポーネント1つ+JSON1行で済む。

## 3. コンテンツ追加レシピ(運用手順)

### モデルを1名追加する(目標10分)

1. `assets/image/models/{ai|real}/{slug}/` に `portrait.webp`(必須)、
   `fullbody.webp`、`editorial.webp`(任意)を置く
2. 動画があれば `assets/video/ai-models/`(または該当カテゴリー)へ
3. `data/models.json` に1エントリー追加(`type`、`rightsStatus` を必ず正しく)
4. `pnpm assets:validate` → 参照切れ・権利状態を機械チェック
5. `pnpm dev` で確認。featured: true なら自動でOrbit Gallery/Featuredに出現

### プロジェクトを1件追加する

1. `assets/image/projects/{slug}/cover.webp` + 詳細画像を置く
2. `data/projects.json` に1エントリー(`status: 'concept' | 'client'` を明示)
3. validate → 確認。3件未満でもセクションは崩れない(minItemsで制御)

### セクションを1つ追加する

1. `components/sections/` にコンポーネント実装、registryにキー登録
2. `data/home-sections.json` に1行追加
3. 翻訳キーを `messages/*.json` に追加(未翻訳はen→jaフォールバック)

### 言語を1つ追加する

1. `i18n/routing.ts` のlocales配列に追加
2. `messages/{locale}.json` を作成(英語からコピーし翻訳)
3. モデル・プロジェクトのlocale mapは追加任意(フォールバックで表示)

READMEに上記レシピを必ず転記し、非エンジニアでも実行できる粒度で書く。

## 4. スキーマの将来互換

- 全データはZodでパースし、`schemaVersion` フィールドを持たせる
- 追加フィールドは常にoptional(既存データを壊さない)
- 予約フィールド(初期は未使用でもスキーマに定義しておく):

```ts
// ModelProfile への予約
socials?: Record<string, string>;   // SNSリンク
availability?: 'available' | 'booked' | 'inactive';
tags?: string[];                    // 検索・フィルター用
sortWeight?: number;                // 手動並び替え
gallery?: string[];                 // 追加ギャラリー
reels?: string[];                   // 追加動画

// Project への予約
publishedAt?: string;               // ISO日付。Newsとしての再利用
externalUrl?: string;               // 公開先(SNS/掲載媒体)
awards?: Array<{ name: string; year: number }>; // 事実のみ。捏造禁止
```

## 5. メディアスロット方式

`asset-manifest.json` の各エントリーに `slot` を持たせ、
コンポーネントは「ファイルパス」ではなく「スロット名」で素材を要求する。

```json
{
  "id": "hero-hybrid-desktop",
  "slot": "hero.desktop",
  "type": "video",
  "src": "video/hero/hero-hybrid-desktop.mp4",
  "poster": "image/posters/hero-hybrid-desktop.webp"
}
```

- 素材の差し替え = manifestの `src` 変更のみ(コンポーネント変更不要)
- スロットが空 → コンポーネントは定義済みフォールバック
  (`06_ASSET_NAMING_AND_FOLDER_RULES.md` 7章)へ自動移行
- `lib/assets.ts` に `getAsset(slot)` を実装し、直接パス参照を禁止する

## 6. スキャフォールドスクリプト(P1)

手作業ミスを減らすため、対話式スクリプトを用意する。

```text
scripts/new-model.mjs    → slug入力 → フォルダー作成+models.jsonへ雛形追記
scripts/new-project.mjs  → 同上
```

- 雛形は `published: false`, `isPlaceholder: true` で生成し、公開事故を防ぐ
- `assets:validate` は `isPlaceholder: true` が本番ビルドに含まれると失敗する

## 7. 検証による拡張の安全化

`scripts/validate-assets.mjs` を拡張性の門番にする。

- manifest・models・projectsの参照先ファイル存在チェック
- `real` かつ `rightsStatus !== 'approved'` → 公開データから除外+警告
- ポスター欠落・サイズ超過(11章の予算)を警告
- スロット重複・slug重複を検出
- 未使用素材(どのJSONからも参照されない)を情報表示(削除はしない)

## 8. 3D演出の拡張性

- Orbit Galleryのパネル数、Particle数、リング本数はすべて設定オブジェクト
  (`config/three.ts`)から供給。マジックナンバーをシーン内に書かない
- 新モデル追加時: パネル数に応じて軌道半径・角度を自動計算
- 新セクション追加時: `SceneProgressController` がセクションレジストリから
  シーン区間を再生成(3D側の手動タイムライン編集を不要にする)
- 品質ティア(T0〜T3)の閾値も設定ファイルに集約

## 9. 将来ロードマップ枠(設計だけ先行)

MVPには含めないが、データ構造とセクションキーだけ予約しておく。

- Showreelの複数本化(`showreel` 配列化)
- News / Journal(`publishedAt` ベース。プロジェクトと同型)
- モデル検索・フィルター(`tags` / `categories` ベース)
- クライアントロゴ帯(許諾済みのみ。`clients.json`)
- 採用/オーディション告知(`for-talents` 配下の告知データ)
- CMS移行: 全データがJSON+Zodなので、将来ヘッドレスCMSへ
  同一スキーマで移設可能(コンポーネントは無変更)

## 10. 拡張性の受け入れ基準

- [ ] モデル追加がコード変更なしで完了する
- [ ] プロジェクト追加がコード変更なしで完了する
- [ ] セクションの表示/非表示/並び替えがJSONだけで可能
- [ ] モデル0名/1名/12名でレイアウトと3Dが破綻しない
- [ ] 素材欠落・翻訳欠落が視覚的に破綻しない
- [ ] READMEに全レシピが記載されている
