type FiveScores = Record<"金" | "木" | "水" | "火" | "土", number>;

interface Props {
  scores: FiveScores;
}

const elements: Array<keyof FiveScores> = ["木", "火", "土", "金", "水"];

export default function FiveElementRadar({ scores }: Props) {
  const size = 180;
  const center = size / 2;
  const radius = 70;

  const valuePoints = elements
    .map((el, idx) => {
      const angle = ((Math.PI * 2) / elements.length) * idx - Math.PI / 2;
      const ratio = Math.min(scores[el] / 100, 1);
      const r = radius * (0.3 + 0.7 * ratio);
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {[0.35, 0.6, 1].map((level, i) => (
        <polygon
          key={i}
          points={elements
            .map((_, idx) => {
              const angle = ((Math.PI * 2) / elements.length) * idx - Math.PI / 2;
              const r = radius * level;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={0.8}
        />
      ))}

      {elements.map((el, idx) => {
        const angle = ((Math.PI * 2) / elements.length) * idx - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return (
          <g key={el}>
            <line
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e5e7eb"
              strokeWidth={0.8}
            />
            <text
              x={x}
              y={y}
              dy={y < center ? -6 : 10}
              textAnchor="middle"
              fontSize="10"
              fill="#4b5563"
            >
              {el}
            </text>
          </g>
        );
      })}

      <polygon
        points={valuePoints}
        fill="url(#radarFill)"
        stroke="#0f766e"
        strokeWidth={1.2}
      />
    </svg>
  );
}


