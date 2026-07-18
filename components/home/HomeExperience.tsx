'use client';

import dynamic from 'next/dynamic';
import { Awakening } from '@/components/preloader/Awakening';

const BackgroundExperience = dynamic(
  () => import('@/components/three/BackgroundExperience'),
  { ssr: false }
);

/**
 * ホーム専用のクライアント演出層。
 * プリローダー(S1)と背景常駐Canvasをまとめてマウントする。
 */
export function HomeExperience({ heroPosterUrl }: { heroPosterUrl?: string }) {
  return (
    <>
      <Awakening heroPosterUrl={heroPosterUrl} />
      <BackgroundExperience />
    </>
  );
}
