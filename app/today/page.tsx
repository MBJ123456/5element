"use client";

import { useEffect, useState } from "react";
import type { UserProfile, WeatherInfo } from "@/lib/prompts";

export default function TodayPage() {
  const [city, setCity] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [advice, setAdvice] = useState<any>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [adviceError, setAdviceError] = useState<string | null>(null);

  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // 加载用户资料
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("five-elements-profile");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as UserProfile;
      setProfile(parsed);
      if (parsed.location && !city) {
        setCity(parsed.location);
      }
    } catch {
      // ignore
    }
  }, []);

  // 自动获取今日建议（如果已有城市和资料）
  useEffect(() => {
    if (typeof window === "undefined" || !city || !profile || loadingAdvice) return;

    // 检查今天是否已经获取过建议（针对当前城市）
    const todayKey = `today-advice-${new Date().toDateString()}-${city}`;
    const cached = window.localStorage.getItem(todayKey);
    if (cached) {
      try {
        const cachedData = JSON.parse(cached);
        if (cachedData.weather?.city === city) {
          // 使用缓存数据
          setWeather(cachedData.weather);
          setAdvice(cachedData.advice);
          return;
        }
      } catch {
        // 缓存解析失败，继续获取新的
      }
    }

    // 自动获取建议（内联逻辑）
    let cancelled = false;
    (async () => {
      setAdviceError(null);
      setLoadingAdvice(true);
      try {
        let w: WeatherInfo | null = null;
        if (city) {
          const resWeather = await fetch("/api/weather", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ city })
          });
          const dataWeather = await resWeather.json();
          if (!resWeather.ok) {
            throw new Error(dataWeather?.error || "天气查询失败");
          }
          w = dataWeather;
          if (!cancelled) setWeather(w);
        }

        const resAdvice = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "daily",
            profile: profile || {},
            weather: w || undefined
          })
        });
        const dataAdvice = await resAdvice.json();
        if (!resAdvice.ok) {
          throw new Error(dataAdvice?.error || "AI 生成建议失败");
        }
        if (!cancelled) {
          setAdvice(dataAdvice);
          // 缓存今日建议
          const cacheKey = `today-advice-${new Date().toDateString()}-${city}`;
          window.localStorage.setItem(
            cacheKey,
            JSON.stringify({ weather: w, advice: dataAdvice })
          );
        }
      } catch (e: any) {
        if (!cancelled) setAdviceError(e.message || String(e));
      } finally {
        if (!cancelled) setLoadingAdvice(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [city, profile]);

  async function handleGenerateAdvice(forceRefresh = false) {
    setAdviceError(null);
    setLoadingAdvice(true);
    try {
      let w: WeatherInfo | null = null;
      if (city) {
        const resWeather = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city })
        });
        const dataWeather = await resWeather.json();
        if (!resWeather.ok) {
          throw new Error(dataWeather?.error || "天气查询失败");
        }
        w = dataWeather;
        setWeather(w);
      }

      const resAdvice = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "daily",
          profile: profile || {},
          weather: w || undefined
        })
      });
      const dataAdvice = await resAdvice.json();
      if (!resAdvice.ok) {
        throw new Error(dataAdvice?.error || "AI 生成建议失败");
      }
      setAdvice(dataAdvice);

      // 缓存今日建议（按日期和城市）
      if (typeof window !== "undefined" && city) {
        const todayKey = `today-advice-${new Date().toDateString()}-${city}`;
        window.localStorage.setItem(
          todayKey,
          JSON.stringify({ weather: w, advice: dataAdvice })
        );
      }
    } catch (e: any) {
      setAdviceError(e.message || String(e));
    } finally {
      setLoadingAdvice(false);
    }
  }

  async function handleSendToAI() {
    if (!question.trim()) return;
    setChatError(null);
    setChatLoading(true);
    const nextHistory = [...chatHistory, { role: "user" as const, content: question.trim() }];
    setChatHistory(nextHistory);
    setQuestion("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "chat",
          profile: profile || {},
          weather: weather || undefined,
          chatHistory: nextHistory,
          question: nextHistory[nextHistory.length - 1].content
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "AI 对话失败");
      }
      const reply: string = typeof data === "string" ? data : data.rawText || data.answer || "";
      setChatHistory((prev) => [...prev, { role: "assistant", content: reply || " " }]);
    } catch (e: any) {
      setChatError(e.message || String(e));
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 pb-6 pt-4">
      <header className="space-y-2">
        <p className="ink-section-title">TODAY · 建议 + 天气 + 对话</p>
        <h1 className="text-2xl font-semibold text-ink">今天，慢一点看自己</h1>
        <p className="max-w-xl text-xs text-ink-soft">
          页面会自动加载今日建议，结合你的五行人格、体质和实时天气。如需调整，可点击刷新按钮。
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-[minmax(0,2.2fr)_minmax(0,2.8fr)]">
        <div className="ink-card space-y-3 bg-gradient-to-br from-sky-50/80 via-white to-emerald-50/70 p-4">
          <h2 className="text-sm font-medium text-ink">今日天气 · 生活向建议</h2>
          <div className="space-y-2 text-xs text-ink-soft">
            <label className="block">
              <span className="mb-1 inline-block">所在城市</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="例：Beijing / Shanghai / Hangzhou..."
                className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs outline-none focus:border-jade focus:ring-1 focus:ring-jade/60"
              />
            </label>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleGenerateAdvice(true)}
                disabled={loadingAdvice}
                className="inline-flex items-center rounded-full bg-ink px-4 py-1.5 text-[11px] text-white hover:bg-ink-soft disabled:opacity-60"
              >
                {loadingAdvice ? "正在生成…" : advice ? "刷新建议" : "获取今日建议"}
              </button>
              {advice && (
                <span className="text-[10px] text-ink-light">
                  {new Date().toLocaleDateString("zh-CN", {
                    month: "short",
                    day: "numeric"
                  })}
                  的建议
                </span>
              )}
            </div>
            {adviceError && (
              <p className="mt-2 text-[11px] text-red-500">获取建议失败：{adviceError}</p>
            )}
            {weather && (
              <div className="mt-3 grid gap-2 rounded-xl bg-slate-50/80 px-3 py-2 text-[11px] text-ink-soft">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-ink">
                    {weather.city} · {weather.temperature}℃
                  </p>
                  <span>湿度约 {weather.humidity}%</span>
                </div>
                <p>天气：{weather.description}</p>
              </div>
            )}
            {advice && (
              <div className="mt-3 grid gap-2 text-[11px] text-ink-soft">
                <div className="rounded-xl bg-white/90 px-3 py-2">
                  <p className="font-medium text-ink">
                    {advice.summary || "今天整体气机平稳，可以温柔地安排自己的节奏。"}
                  </p>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2">
                    <p className="font-medium text-ink">饮食</p>
                    <p className="mt-1">
                      {advice.food ||
                        "以清淡少油为主，配合当季蔬菜，避免过多生冷和重口味。"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-sky-100 bg-sky-50/60 px-3 py-2">
                    <p className="font-medium text-ink">饮品</p>
                    <p className="mt-1">
                      {advice.drink ||
                        "优先选择温热的茶饮或温水，尽量减少含糖饮料与冰饮。"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 px-3 py-2">
                    <p className="font-medium text-ink">作息 & 情绪</p>
                    <p className="mt-1">{advice.schedule || "晚上尽量提前半小时放下屏幕。"}</p>
                    {advice.emotion && <p className="mt-1">情绪：{advice.emotion}</p>}
                  </div>
                  <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-2">
                    <p className="font-medium text-ink">穿搭 · 出行 · 运动</p>
                    <p className="mt-1">
                      {advice.outfit ||
                        "可选一两件你喜欢的浅色或接近大地色的小物件，让整体更舒展。"}
                    </p>
                    <p className="mt-1">
                      {advice.dos?.[0] ||
                        "若天气允许，可以安排一小段散步或轻微拉伸，给身体一点温和流动。"}
                    </p>
                  </div>
                </div>

                {(Array.isArray(advice.dos) || Array.isArray(advice.donts)) && (
                  <div className="mt-1 grid gap-2 md:grid-cols-2">
                    <div className="rounded-xl border border-emerald-100 bg-white/90 px-3 py-2">
                      <p className="font-medium text-ink">今日宜</p>
                      <ul className="mt-1 list-disc space-y-1 pl-4">
                        {(advice.dos || []).map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-3 py-2">
                      <p className="font-medium text-ink">今日忌</p>
                      <ul className="mt-1 list-disc space-y-1 pl-4">
                        {(advice.donts || []).map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="ink-card flex flex-col bg-gradient-to-br from-slate-50/80 via-white to-sky-50/70 p-4">
          <h2 className="text-sm font-medium text-ink">AI 咨询 · 简短问一问</h2>
          <p className="mt-1 text-xs text-ink-soft">
            比如：「今天有点焦虑，睡前可以怎么安顿自己？」、「最近总是熬夜，对我这个体质有影响吗？」。
          </p>
          <div className="mt-3 flex-1 space-y-2">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={4}
              placeholder="把你今天最想问的一件小事写下来吧。"
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs outline-none focus:border-jade focus:ring-1 focus:ring-jade/60"
            />
            <button
              type="button"
              onClick={handleSendToAI}
              disabled={chatLoading}
              className="mt-1 inline-flex items-center justify-center rounded-full bg-ink px-4 py-1.5 text-xs text-white hover:bg-ink-soft disabled:opacity-60"
            >
              {chatLoading ? "AI 正在思考…" : "发送给 AI"}
            </button>
            {chatError && (
              <p className="text-[11px] text-red-500">对话出错：{chatError}</p>
            )}
            <div className="mt-2 max-h-64 space-y-2 overflow-y-auto rounded-xl bg-slate-50/70 p-3">
              {chatHistory.length === 0 && (
                <p className="text-[11px] text-ink-light">
                  还没有对话，可以先说说你今天的状态、困扰或者想养成的小习惯。
                </p>
              )}
              {chatHistory.map((m, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl px-3 py-2 text-[11px] ${
                    m.role === "user"
                      ? "ml-auto max-w-[80%] bg-ink text-white"
                      : "mr-auto max-w-[80%] bg-white text-ink-soft"
                  }`}
                >
                  {m.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}


