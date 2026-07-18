# データ・コンテンツ仕様

## 1. `models.json`

```ts
type ModelType = 'ai' | 'real' | 'ai-enhanced-real';

type ModelProfile = {
  slug: string;
  type: ModelType;
  displayName: string;
  featured: boolean;
  published: boolean;
  rightsStatus: 'approved' | 'pending' | 'restricted';
  portrait: string;
  fullbody?: string;
  editorial?: string;
  video?: string;
  videoPoster?: string;
  location?: string;
  languages?: string[];
  categories: string[];
  heightCm?: number;
  bio: Record<string, string>;
  capabilities: Record<string, string[]>;
};
```

ルール:

- `real`で`rightsStatus !== approved`なら公開しない。
- `ai`は完全な架空人物であること。
- 実在の著名人に似せたAIモデルを登録しない。
- 身長など未確認情報は空にする。

## 2. `projects.json`

```ts
type Project = {
  slug: string;
  status: 'concept' | 'client';
  published: boolean;
  title: Record<string, string>;
  summary: Record<string, string>;
  category: string[];
  cover: string;
  video?: string;
  gallery: string[];
  relatedModels: string[];
  challenge: Record<string, string>;
  approach: Record<string, string>;
  humanContribution: Record<string, string>;
  aiContribution: Record<string, string>;
  credits?: Array<{ role: string; name: string }>;
};
```

## 3. `services.json`

```ts
type Service = {
  id: string;
  order: number;
  title: Record<string, string>;
  short: Record<string, string>;
  detail: Record<string, string>;
  media?: string;
  poster?: string;
};
```

## 4. `site.json`

- ブランド名
- Tagline
- Contact email
- SNS
- 所在地の公開範囲
- 法人名または運営者名
- Analytics設定

## 5. 翻訳

翻訳JSONはUIと共通文章に使用し、モデルbioやプロジェクト本文はデータ内のlocale mapでもよい。

未翻訳の場合:

1. 英語
2. 日本語

の順でフォールバック。ただしページの`lang`と表示言語が不一致になり続けないようにする。

## 6. 仮データ

Codexはレイアウト確認用に仮データを作ってよいが、次を守る。

- `DEMO` または `CONCEPT` と明示
- 実在の企業名を使わない
- 実在モデルを勝手に仮名で登録しない
- 公開前に見つけられるよう`isPlaceholder: true`相当を持たせる
