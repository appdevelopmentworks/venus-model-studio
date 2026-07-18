import { create } from 'zustand';

/**
 * DOM(スクロール・操作)と3Dシーンを繋ぐ共有ストア。
 * 3D側はuseFrame内で getState() を読む(再レンダーを起こさない)。
 */
type SceneState = {
  /** ページ全体のスクロール進行 0..1 */
  progress: number;
  /** プリローダー完了 */
  preloaderDone: boolean;
  /** ポインター位置 -1..1(パララックス用) */
  pointerX: number;
  pointerY: number;
  setProgress: (v: number) => void;
  setPreloaderDone: () => void;
  setPointer: (x: number, y: number) => void;
};

export const useSceneStore = create<SceneState>((set) => ({
  progress: 0,
  preloaderDone: false,
  pointerX: 0,
  pointerY: 0,
  setProgress: (v) => set({ progress: v }),
  setPreloaderDone: () => set({ preloaderDone: true }),
  setPointer: (x, y) => set({ pointerX: x, pointerY: y })
}));
