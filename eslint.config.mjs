import next from 'eslint-config-next/core-web-vitals';

/** Next.js 16 のフラット設定を直接使用(next lintは廃止) */
const eslintConfig = [
  ...next,
  {
    // react-three-fiber の命令的レイヤー: useFrame等はReactレンダー外で実行され、
    // マテリアル/uniformのミューテーションや一度きりの乱数生成は正しいR3Fパターン。
    // React Compilerの純粋性/不変性ルールは適用対象外のため無効化する。
    files: [
      'components/three/**/*.{ts,tsx}',
      'components/sections/meridian/*.{ts,tsx}',
      'components/sections/orbit/*.{ts,tsx}'
    ],
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off'
    }
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      'scripts/**',
      'tests/**'
    ]
  }
];

export default eslintConfig;
