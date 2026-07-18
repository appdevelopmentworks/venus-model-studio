# テスト・完成判定

## 1. 自動テスト

### Unit

- asset path resolver
- locale fallback
- rights filtering
- model/project schema validation
- contact validation

### Component

- ModelCard labels
- ResponsiveVideo fallback
- Header mobile menu
- SoundToggle
- Contact form errors

### E2E

- 各localeのhome表示
- navigation
- models一覧→詳細
- projects一覧→詳細
- contact送信またはfallback
- showreel modal
- keyboard navigation
- reduced motion

## 2. 必須コマンド

Codexは利用するpackage managerに合わせて次を整備する。

```text
lint
typecheck
test
test:e2e
build
assets:validate
```

すべて成功させる。

## 3. 視覚検査

- 320px
- 375px
- 768px
- 1024px
- 1440px
- 1920px

確認項目:

- 横スクロールなし
- モデルの顔が不自然にトリミングされない
- CTAが映像と重なって読めなくならない
- 長いロシア語でも崩れない
- 中国語、韓国語の行間が狭過ぎない
- 3Dが本文を隠さない

## 4. 3D完成条件

- 3Dは装飾ではなくストーリー進行を補助
- 低性能時に簡略化
- ScrollTrigger重複なし
- ページ遷移後にCanvasやlistenerが残らない
- 30秒放置してメモリが増え続けない
- コンソールエラーなし

## 4.5 シグネチャー体験完成条件(docs/19)

- P0演出(S1 Awakening、S2 Meridian、S4 Kinetic Manifesto、S7 Halo Transition)が動作
- 各演出がreduced-motion、WebGL不可、モバイルの3条件で「機能等価な再演出」になる
- S2 Meridianがドラッグ・タップ・キーボードで操作可能
- プリローダーは最長3.5秒でクランプ、再訪問時は短縮版
- ページ遷移の連打で詰まらない(即時遷移へ切替)
- 演出があっても主要導線(モデル閲覧・問い合わせ)の到達が遅くならない

## 4.6 拡張性完成条件(docs/20)

- モデル1名の追加がコード変更なし(素材+JSON)で完了する
- プロジェクト1件の追加がコード変更なしで完了する
- home-sections.jsonのenabled切替・並び替えだけでセクション構成が変わる
- モデル0名/1名/12名でOrbit Galleryとグリッドが破綻しない
- isPlaceholder: trueのデータが本番ビルドに含まれるとassets:validateが失敗する

## 5. メディア完成条件

- Hero autoplay失敗でもposter表示
- 画面外動画pause
- 音は勝手に鳴らない
- Sound On後にだけ鳴る
- showreelを閉じたら停止
- missing assetでbroken iconを出さない

## 6. 内容完成条件

- AI／REAL区分が全カードにある
- Concept Projectが明示される
- 仮テキストが公開ビルドに残っていない
- Lorem ipsumなし
- 架空の賞、顧客、実績なし
- 実在モデルのrightsStatus approved

## 7. Accessibility

- keyboardのみで主要導線を完了
- visible focus
- modal focus trap
- axeの重大エラーなし
- reduced motionで大きな移動なし
- alt不足なし

## 8. Performance

- 3D chunk遅延
- Hero以外の動画は初期ダウンロードしない
- Lighthouseで重大なレイアウトシフトなし
- モバイルで操作不能なフレーム低下なし

## 9. Definition of Done

次をすべて満たして完了。

1. `build`成功
2. 自動テスト成功
3. 全locale表示
4. missing optional assetsに耐える
5. desktop 3Dとmobile fallback完成
6. SEO出力
7. Contactが実際に機能または明確なmailto fallback
8. READMEに起動・素材追加・公開方法を記載
