import manifestJson from '@/assets/asset-manifest.json';

export type ManifestAsset = {
  id: string;
  slot?: string;
  type: 'video' | 'image' | 'audio';
  category?: string;
  src: string;
  poster?: string;
  aspectRatio?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  required?: boolean;
  rightsStatus?: string;
  altJa?: string;
  altEn?: string;
};

const assets = (manifestJson.assets ?? []) as ManifestAsset[];
const bySlot = new Map(assets.filter((a) => a.slot).map((a) => [a.slot as string, a]));

/** 配信URLへ解決。素材参照は必ずこの2関数を経由する(直接パス参照を禁止) */
export function assetUrl(relPath: string): string {
  return `/assets/${relPath}`;
}

/** スロット名で素材を取得。存在しないスロットはundefined(=フォールバック表示) */
export function getAsset(slot: string): ManifestAsset | undefined {
  return bySlot.get(slot);
}

export function getAssetAlt(asset: ManifestAsset | undefined, locale: string): string {
  if (!asset) return '';
  return (locale === 'ja' ? asset.altJa : asset.altEn) ?? asset.altEn ?? '';
}
