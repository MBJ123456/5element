const steps = [5200, 8300, 7400, 9000, 6600, 10200, 7800];
const sleep = [6.2, 7.5, 7.1, 5.9, 6.8, 7.9, 7.0];
const balance = { activity: 0.7, rest: 0.6, mind: 0.8 };

function LineChart({
  data,
  color,
  max
}: {
  data: number[];
  color: string;
  max: number;
}) {
  const width = 220;
  const height = 70;
  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - (v / max) * (height - 10);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`line-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={0.8}
        points={`0,${height - 5} ${width},${height - 5}`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <polygon
        points={`${points} ${width},${height} 0,${height}`}
        fill={`url(#line-${color})`}
        opacity={0.7}
      />
    </svg>
  );
}

function MiniRadar() {
  const size = 120;
  const center = size / 2;
  const radius = 40;
  const keys: Array<keyof typeof balance> = ["activity", "rest", "mind"];

  const pts = keys
    .map((k, idx) => {
      const angle = ((Math.PI * 2) / keys.length) * idx - Math.PI / 2;
      const r = radius * (0.3 + 0.7 * balance[k]);
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[0.35, 0.6, 1].map((level, i) => (
        <polygon
          key={i}
          points={Array.from({ length: keys.length })
            .map((_, idx) => {
              const angle = ((Math.PI * 2) / keys.length) * idx - Math.PI / 2;
              const r = radius * level;
              const x = center + r * Math.cos(angle);
              const y = center + r * Math.sin(angle);
              return `${x},${y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={0.7}
        />
      ))}
      <polygon points={pts} fill="#22c55e40" stroke="#16a34a" strokeWidth={1.2} />
    </svg>
  );
}

export default function HealthCharts() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-3">
        <p className="text-xs font-medium text-ink">最近 7 天步数</p>
        <p className="mt-1 text-[11px] text-ink-soft">轻微起伏，整体还在比较温和的活动量。</p>
        <div className="mt-2">
          <LineChart data={steps} color="#0ea5e9" max={11000} />
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-3">
        <p className="text-xs font-medium text-ink">最近 7 天睡眠时长</p>
        <p className="mt-1 text-[11px] text-ink-soft">
          有一两天略短，其余时间接近理想睡眠，可以继续保持。
        </p>
        <div className="mt-2">
          <LineChart data={sleep} color="#22c55e" max={8.5} />
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-3">
        <div>
          <p className="text-xs font-medium text-ink">动 · 静 · 心神平衡</p>
          <p className="mt-1 text-[11px] text-ink-soft">
            以 mock 数据估算大致感觉：行动力略高，休息与心神也还算稳定。
          </p>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <MiniRadar />
          <ul className="space-y-1 text-[11px] text-ink-soft">
            <li>· 活动：{Math.round(balance.activity * 100)}%</li>
            <li>· 休息：{Math.round(balance.rest * 100)}%</li>
            <li>· 心神：{Math.round(balance.mind * 100)}%</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


