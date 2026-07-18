/**
 * S6 Constellation Index の装飾レイヤー(docs/19)
 * 金の星を細い線で結んだSVGの星座。純装飾(aria-hidden)で、
 * 操作はテキストリンク一覧が主経路。reduced-motionでも静的に成立する。
 */
export function ConstellationBackdrop() {
  // 星の座標(viewBox 0..100)。線で順に結ぶ
  const stars = [
    { x: 18, y: 22 },
    { x: 34, y: 40 },
    { x: 26, y: 62 },
    { x: 48, y: 74 },
    { x: 66, y: 58 },
    { x: 78, y: 34 },
    { x: 60, y: 26 }
  ];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
    >
      <polyline
        points={stars.map((s) => `${s.x},${s.y}`).join(' ')}
        fill="none"
        stroke="rgba(214,179,106,0.3)"
        strokeWidth="0.15"
      />
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={i % 3 === 0 ? 0.6 : 0.35}
          fill="#d6b36a"
        >
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur={`${3 + (i % 4)}s`}
            repeatCount="indefinite"
            begin={`${i * 0.3}s`}
          />
        </circle>
      ))}
    </svg>
  );
}
