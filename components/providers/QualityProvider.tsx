'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode
} from 'react';
import { detectQualityTier, type QualityTier } from '@/lib/performance';

type QualityContextValue = {
  /** null = 未判定(SSR/初回マウント前)。Canvasはnullの間マウントしない */
  tier: QualityTier | null;
  /** 実行中降格(昇格はしない) */
  demote: () => void;
};

const QualityContext = createContext<QualityContextValue>({
  tier: null,
  demote: () => {}
});

/** 降格後、次の降格判定を受け付けるまでの猶予(降格自体が起こすヒッチの誤検知を防ぐ) */
const DEMOTE_COOLDOWN_MS = 5000;
/** T2→T1はセクションCanvas(Orbit/Meridian)を失う大きな降格。この回数の不調が続いた時のみ */
const T1_DEMOTE_STRIKES = 2;

export function QualityProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<QualityTier | null>(null);
  const tierRef = useRef<QualityTier | null>(null);
  const demoteStateRef = useRef({ lastAt: 0, strikes: 0 });

  useEffect(() => {
    // クライアント専用のティア検出(window/WebGL依存)。
    // SSRではnull、マウント後に確定させる意図的なsetState。
    const detected = detectQualityTier();
    tierRef.current = detected;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTier(detected);
  }, []);

  /**
   * 段階的降格。かつては1回のonDeclineで即降格していたが、
   * 降格に伴う再構築ヒッチが次のonDeclineを誘発し、T3→T2→T1と連鎖して
   * Orbit Gallery等がアンマウントされる問題があった(Context Lost)。
   * クールダウンとT1降格のストライク制で「本当に重い端末」だけを落とす。
   */
  const demote = useCallback(() => {
    const t = tierRef.current;
    if (t === null || t <= 1) return;

    const now = performance.now();
    const st = demoteStateRef.current;
    if (now - st.lastAt < DEMOTE_COOLDOWN_MS) return;
    st.lastAt = now;

    if (t === 2) {
      st.strikes += 1;
      if (st.strikes < T1_DEMOTE_STRIKES) return;
    }

    const next = (t - 1) as QualityTier;
    tierRef.current = next;
    setTier(next);
  }, []);

  const value = useMemo(() => ({ tier, demote }), [tier, demote]);

  return <QualityContext.Provider value={value}>{children}</QualityContext.Provider>;
}

export function useQuality() {
  return useContext(QualityContext);
}
