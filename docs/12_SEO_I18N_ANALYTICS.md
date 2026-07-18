# SEO・多言語・アクセス解析

## 1. 多言語

- `next-intl`
- locale prefixを常時使用
- `ja`, `en`, `ru`, `zh-CN`, `ko`
- 日本語をdefault
- locale switch時に同一ページを維持
- `hreflang`とcanonicalを出力

## 2. Metadata

各ページに:

- title
- description
- canonical
- alternates.languages
- Open Graph
- Twitter card
- robots

## 3. Structured Data

使用候補:

- Organization
- WebSite
- BreadcrumbList
- Personは実在モデルの同意があり公開情報が正確な場合のみ
- VideoObjectは公開動画に必要情報がある場合のみ

架空AIモデルをPerson構造化データで実在人物のように示さない。

## 4. Sitemap

- locale別URL
- published model
- published project
- legal pages

`pending`、placeholder、権利未承認を含めない。

## 5. OG画像

- `assets/image/seo`から取得
- 言語別がなければdefault
- 文字化けを避けるため、OG画像生成をCodexに無理にさせず、手動画像を優先

## 6. 本文SEO

3D Canvasの裏に隠れない通常HTMLとして文章を出す。

重要語:

- AIモデル制作
- 実在モデル撮影
- ハイブリッド映像制作
- AI女優
- モデルブランディング
- デジタルツイン
- fashion model production
- AI model studio

キーワードの不自然な詰め込みはしない。

## 7. Analytics

環境変数で選択可能:

```text
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_VERCEL_ANALYTICS=true|false
```

計測イベント:

- hero_cta_click
- model_open
- project_open
- showreel_play
- sound_enable
- contact_start
- contact_submit_success
- contact_submit_error

個人情報をイベント名やパラメータへ送らない。

## 8. Cookie

必須でない解析は同意前に実行しない構成を検討。対象地域と利用サービスに応じて公開前に法務確認する。
