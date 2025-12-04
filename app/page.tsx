import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 pb-6 pt-4">
      <header className="space-y-2">
        <p className="ink-section-title">五行 × 体质 × 天气</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          <span className="ink-gradient-text">日常小助手</span>
        </h1>
        <p className="max-w-xl text-sm text-ink-soft">
          一页查看今日建议，轻松进入画像、健康与轻社交。信息不打扰，只在你需要的时候轻轻展开。
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <details className="ink-card group bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/70 p-4 open:border-jade/70">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-ink-light">
                PERSONAL
              </p>
              <h2 className="mt-1 text-sm font-medium text-ink">
                个人信息 · 五行画像
              </h2>
              <p className="mt-1 text-xs text-ink-soft">
                查看和编辑基础资料，生成五行雷达 &amp; 中医体质画像。
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-ink-soft group-open:bg-jade-soft group-open:text-ink">
              画像健康
            </span>
          </summary>
          <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
            <span>初次使用，可先完成画像问卷。</span>
            <div className="flex gap-2">
              <Link
                href="/quiz"
                className="rounded-full bg-ink text-[11px] text-white px-3 py-1 hover:bg-ink-soft"
              >
                填写问卷
              </Link>
              <Link
                href="/profile"
                className="rounded-full border border-slate-300 bg-white/60 px-3 py-1 text-[11px] text-ink hover:border-ink-light"
              >
                查看画像
              </Link>
            </div>
          </div>
        </details>

        <details className="ink-card group bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/70 p-4 open:border-jade/70">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-ink-light">
                TODAY
              </p>
              <h2 className="mt-1 text-sm font-medium text-ink">
                今日建议 · 与 AI 聊聊
              </h2>
              <p className="mt-1 text-xs text-ink-soft">
                实时天气 + 综合建议 + 内嵌 AI 咨询对话。
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-ink-soft group-open:bg-jade-soft group-open:text-ink">
              今日建议
            </span>
          </summary>
          <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
            <span>适合每天早晨或睡前看一眼，轻调整当天节奏。</span>
            <Link
              href="/today"
              className="rounded-full bg-jade px-3 py-1 text-[11px] text-ink hover:bg-emerald-300"
            >
              打开今日建议
            </Link>
          </div>
        </details>

        <details className="ink-card group bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/70 p-4 open:border-jade/70">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-ink-light">
                SOCIAL
              </p>
              <h2 className="mt-1 text-sm font-medium text-ink">
                轻社交 · 虚拟缘分
              </h2>
              <p className="mt-1 text-xs text-ink-soft">
                查看三个虚拟用户卡片，由 AI 解释五行 / 体质的相处建议。
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-ink-soft group-open:bg-jade-soft group-open:text-ink">
              缘分匹配
            </span>
          </summary>
          <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
            <span>不需要登录或真实数据，只是看看「如果我们相遇会怎样」。</span>
            <Link
              href="/social"
              className="rounded-full border border-slate-300 bg-white/60 px-3 py-1 text-[11px] text-ink hover:border-ink-light"
            >
              进入轻社交
            </Link>
          </div>
        </details>

        <details className="ink-card group bg-gradient-to-br from-rose-50/70 via-white to-amber-50/70 p-4 open:border-jade/70">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-ink-light">
                RHYTHM
              </p>
              <h2 className="mt-1 text-sm font-medium text-ink">
                今日状态 · 心情与健康节奏
              </h2>
              <p className="mt-1 text-xs text-ink-soft">
                手动记录今天的心情与精力，配合 mock 健康节奏小图表。
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-ink-soft group-open:bg-jade-soft group-open:text-ink">
              今日状态
            </span>
          </summary>
          <div className="mt-4 grid gap-3 text-xs text-ink-soft">
            <p>这一块后续会和你的步数、睡眠等数据联动，现在先预留入口。</p>
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-3 py-2 text-[11px]">
              今天的感觉可以在「今日建议」里通过对话告诉 AI，它会帮你整理成更温柔的建议。
            </p>
          </div>
        </details>
      </section>
    </main>
  );
}


