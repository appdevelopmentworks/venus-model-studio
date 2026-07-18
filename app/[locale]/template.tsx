import { HaloTransition } from '@/components/interactions/HaloTransition';

// template.tsx はナビゲーションごとに再マウントされる → S7 Halo Transition を駆動する
export default function Template({ children }: { children: React.ReactNode }) {
  return <HaloTransition>{children}</HaloTransition>;
}
