# 素材制作プロンプト集

この文書は、最初の素材を作るためのベースです。実在モデルを参照する場合、本人の許諾を得た画像だけを使用してください。

# 共通ビジュアルバイブル

```text
Premium hybrid model studio, high-end international fashion campaign, deep pure black, warm ivory, champagne gold and subtle rose-gold accents, cinematic studio lighting, refined glass and polished metal, elegant negative space, realistic skin texture, editorial composition, calm confident mood, sophisticated Japanese luxury advertising, no cyberpunk, no blue neon, no text, no watermark, no random letters.
```

# 1. Z-Image 静止画

## 共通ネガティブ

Z-Image基盤モデルでネガティブ入力が利用できる場合のみ使用。TurboワークフローではネガティブやCFGが効かない場合があるため、UI仕様を優先する。

```text
text, letters, captions, logo, watermark, signature, extra people, duplicate person, deformed hands, extra fingers, missing fingers, fused fingers, distorted face, asymmetrical eyes, waxy skin, plastic skin, excessive beauty filter, low resolution, blur, motion blur, oversharpening, chromatic aberration, fisheye distortion, wide-angle facial distortion, bad anatomy, broken limbs, bow legs, unnatural knees, floating objects, cyberpunk, blue neon, sci-fi armor, fantasy costume, revealing outfit, lingerie, childlike appearance
```

## Z01 Hero Desktop Start Frame

```text
Create an ultra-photorealistic 16:9 cinematic campaign image for Venus Model Studio. Two fictional adult female models in their early twenties stand in a vast premium black fashion studio. On the left, a real-world fashion model aesthetic with authentic natural skin and subtle human warmth. On the right, a flawlessly designed AI fashion model aesthetic, equally realistic and human, not robotic. Both are elegant, tall, healthy, sophisticated, and clearly adult. They wear different but harmonized ivory, black, champagne-gold high-fashion outfits, tasteful and non-revealing. A large circular champagne-gold halo is positioned behind them, with subtle rose-gold highlights and frosted-glass architectural panels. The models stand apart with a clean center axis reserved for HTML logo and headline. Cinematic Profoto-style soft light, polished floor reflection, Nikon 135mm portrait compression aesthetic, high-end Japanese luxury advertising, realistic pores and hair detail, calm direct eye contact, no text, no logo, no watermark.
```

## Z02 Hero Mobile Start Frame

```text
Create an ultra-photorealistic 9:16 vertical cinematic campaign image for Venus Model Studio. Two fictional adult female fashion models in their early twenties stand one slightly behind the other in a tall premium black studio. One represents real talent and one represents digital possibility, both fully human-looking and equally elegant, never robotic. Ivory, black and champagne-gold couture styling, tasteful and non-revealing. A vertical circular golden halo and frosted-glass light columns create depth behind them. Keep clear negative space in the upper center for an HTML logo and in the lower center for buttons. Full body visible, long healthy runway legs, refined straight leg alignment, cinematic softbox lighting, subtle polished floor reflection, luxury Japanese fashion advertising, no text, no logo, no watermark.
```

## Z03 AI Western Beauty Portrait

```text
Ultra-photorealistic 4:5 beauty campaign portrait of a completely fictional adult Western European female model in her early twenties. Youthful but clearly adult, luminous fair skin with natural pores, blue-gray eyes, soft ash-blonde hair, refined natural lips, healthy cheeks, elegant neck and shoulders. Ivory satin and minimal champagne-gold jewelry. Premium cosmetics campaign, Profoto beauty dish and soft fill, Nikon 135mm F2 portrait compression, shallow depth of field, warm ivory background, calm confident direct eye contact, no text, no logo, no watermark.
```

## Z04 AI Nordic Runway Full Body

```text
Ultra-photorealistic 2:3 full-body fashion image of a completely fictional adult Nordic female runway model in her early twenties. Very tall professional fashion proportions, approximately 8.5 heads tall, extremely long but anatomically healthy straight legs, elegant posture, knees and ankles naturally aligned, toned but not skinny. She wears an architectural ivory mini dress approximately 20 centimeters above the knee with a refined black and champagne-gold jacket, high-fashion but tasteful. Minimal premium runway studio, full body head to toe, long-lens fashion photography, soft cinematic strobe, no text, no logo, no watermark.
```

## Z05 AI Latin Commercial Portrait

```text
Ultra-photorealistic 4:5 commercial beauty portrait of a completely fictional adult Latin American female model in her early twenties with beauty-pageant finalist elegance. Warm healthy skin, rich dark brown hair, expressive brown eyes, polished but natural makeup, friendly confident smile. Ivory and champagne-gold luxury resort styling, premium hotel and beauty advertising mood, soft cinematic strobe, realistic skin texture, clean warm background, no text, no logo, no watermark.
```

## Z06 AI Japanese Mixed Portrait

```text
Ultra-photorealistic 4:5 Japanese advertising portrait of a completely fictional adult Japanese and European mixed-heritage female model in her early twenties. Youthful, intelligent, approachable, clear dark brown eyes, healthy natural Japanese skin tone, subtle facial depth, glossy dark brown hair, fresh natural makeup. Elegant ivory blouse and champagne-beige tailored jacket. Bright luxury studio, soft cinematic beauty lighting, realistic pores, premium Japanese commercial photography, no text, no logo, no watermark.
```

## Z07 Hybrid Digital Twin End Frame

```text
Create an ultra-photorealistic 16:9 cinematic image showing the same fictional adult female model twice in one luxury studio: the original real-world presentation on the left and an expanded digital fashion presentation on the right. Facial identity, age and body proportions must be identical. The left version wears a simple ivory studio outfit under authentic photographic lighting. The right version wears refined futuristic champagne-gold couture in a larger cinematic environment. The visual message is expansion of creative possibility, not replacement of the human. A soft glass ribbon of light connects the two versions. Premium black background, warm gold halo, realistic skin and hair, tasteful, no text, no logo, no watermark.
```

# 2. LTX-2.3 I2V用の短い動作プロンプト

LTXでは長い美術説明を繰り返さず、参照画像に対して行わせる動作だけを短く記述する。

## L01 Hero Desktop

```text
Both models slowly walk one step toward the camera and stop together. Gentle dolly-in. Their hair and fabric move subtly. The golden halo rotates very slowly. Stable faces, stable bodies, no sudden motion, seamless loop, no text.
```

## L02 Hero Mobile

```text
The front model takes one slow step and turns her gaze to camera while the second model remains poised behind her. Very slow camera push-in. Subtle hair and fabric motion. Stable identity, no text.
```

## L03 Western Beauty

```text
She slowly shifts her eyes toward the camera, makes a barely visible confident smile, and her hair moves gently. Static long-lens camera. Stable face and skin, no text.
```

## L04 Nordic Runway

```text
She walks forward for two elegant steps, stops, and holds one clean runway pose. Full body remains visible. Static camera, straight natural legs, stable clothing, no text.
```

## L05 Latin Commercial

```text
She turns her face slightly from three-quarter view to the camera and gives a natural warm smile. Gentle camera slide left. Stable face, no text.
```

## L06 Japanese Mixed

```text
She looks into the camera, breathes naturally, and gives a subtle friendly smile. Very slow dolly-in. Stable face and hair, no text.
```

## L07 Real Studio Flash

```text
The model changes from one clean fashion pose to another as a studio strobe flashes once. The photographer remains a soft silhouette. Stable anatomy, realistic motion, no text.
```

## L08 Backstage

```text
A makeup artist makes one final gentle adjustment, steps away, and the model looks toward the camera through the mirror. Calm natural motion, no text.
```

## L09 World Transform

```text
The model remains in the same pose while the studio background and outfit transition smoothly from ivory studio fashion to black runway couture. Identity and body remain unchanged. No text.
```

# 3. Google Flow

Google Flowでは、Z-Imageで作った開始画像、終了画像、人物画像をFramesまたはIngredientsとして登録する。

## G01 Hero Frames

Start frameにZ01、必要ならend frameに同じ人物の停止ポーズ画像を設定。

```text
A premium cinematic fashion studio introduction. The two adult models walk forward in perfect calm synchronization for one step, then stop on the center axis. The camera performs an extremely slow controlled dolly-in using a long portrait lens feeling. The circular champagne-gold halo turns subtly, frosted-glass panels catch soft warm light, and the polished black floor reflects the models. Preserve both identities, facial structure, age, clothing and body proportions. Sophisticated luxury, restrained motion, no dialogue, no captions, no text, no logo.
```

## G02 Hybrid Digital Twin

Ingredientsに同一人物の実写基準画像とZ07を追加。

```text
Begin in an authentic professional photography studio with the adult model standing calmly under soft strobe lighting. A refined transparent ribbon of champagne-gold light passes through the space. Without changing her face, age or body, the environment expands into a cinematic digital fashion world and a second presentation of the same model appears beside her in elegant couture. The real presentation remains visible and respected. The transformation represents expanded creative possibilities, not replacement. Slow camera arc, stable identity, realistic skin, no text or captions.
```

## G03 Seamless Service Panel Loop

```text
A five-second seamless luxury fashion loop. The adult model holds a calm editorial pose while a narrow band of soft studio light moves slowly across the frosted-glass background. Only subtle breathing, hair and fabric motion. Locked camera, stable identity and anatomy, no text.
```

## G04 Flowでの制作手順

1. 同じ人物の画像をIngredientsに登録。
2. Heroはstart/end framesを使用。
3. 4案生成し、顔と手の安定性を優先。
4. 必要な部分だけ10秒以内で編集。
5. Extendは動作を追加し過ぎず、停止状態または光の変化へつなぐ。
6. Scene BuilderでShowreelを組む場合も、Web用の短い素材は別々に書き出す。

# 4. LitMedia 音楽

## M01 Ambient Loop

```text
Instrumental luxury fashion ambient music for a premium hybrid model studio website. Slow 76 BPM, elegant cinematic atmosphere, warm analog synth pads, soft piano particles, subtle glass textures, restrained low pulse, champagne-gold mood, sophisticated and modern, no vocals, no dramatic trailer drums, no EDM drop, seamless loop, 30 seconds.
```

## M02 Logo Reveal

```text
A refined two-second luxury brand sonic logo: soft glass shimmer, warm metallic resonance, subtle low impact, elegant champagne-gold feeling, minimal, no melody, no voice.
```

## M03 Panel Open

```text
A very short and quiet premium UI sound: soft frosted-glass touch with a warm metallic overtone, under half a second, no harsh high frequencies.
```

# 5. 品質判定

採用する素材は次を満たすこと。

- 顔が別人に変わらない
- 指、腕、脚が破綻しない
- 服が突然変形しない
- カメラが暴れない
- 動作が1つに絞られている
- 無音でも意味が伝わる
- 文字が生成されていない
- ループ終端が不自然でない
- AIと実在モデルの区分をサイト側で説明できる
