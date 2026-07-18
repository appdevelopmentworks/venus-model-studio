'use client';

import { useEffect, useState } from 'react';
import * as THREE from 'three';

/**
 * Suspenseに依存しないテクスチャローダー。
 *
 * dreiのuseTexture(=React Suspense経由)は、本プロジェクトの構成で
 * Suspenseが解決されないままR3Fの初回描画が永久にブロックされ、
 * Canvasが未初期化バッファ(真っ白)のまま残る問題を起こした。
 * 描画をブロックしない読み込みに切り替え、未ロード時は呼び出し側が
 * フェード等で上品にフォールバックする(docs/19 実装ガードレール)。
 *
 * 読み込み完了までnullを返す。失敗時もnullのまま(呼び出し側の
 * フォールバック表示が継続する)。
 */
export function useLazyTexture(url: string | undefined): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!url) return;
    let alive = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        if (alive) setTexture(t);
        else t.dispose();
      },
      undefined,
      () => {
        /* 失敗時はnullのまま。broken表示を出さない(docs/06 7章) */
      }
    );
    return () => {
      alive = false;
      setTexture((prev) => {
        prev?.dispose();
        return null;
      });
    };
  }, [url]);

  return texture;
}
