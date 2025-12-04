"use client";

import Link from "next/link";
import { analyzeFiveElementsFromBirthday } from "@/lib/fiveElements";
import { useEffect, useMemo, useState } from "react";
import type { UserProfile } from "@/lib/prompts";
import FiveElementRadar from "@/components/FiveElementRadar";
import HealthCharts from "@/components/HealthCharts";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiProfile, setAiProfile] = useState<any>(null);

  const birthday = profile?.birthday ?? null;
  const five = useMemo(() => analyzeFiveElementsFromBirthday(birthday), [birthday]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("five-elements-profile");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as UserProfile;
      setProfile(parsed);
      setLoading(true);
      fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "profile", profile: parsed })
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || "分析失败");
          setAiProfile(data);
        })
        .catch((e) => {
          setError(e.message || String(e));
        })
        .finally(() => setLoading(false));
    } catch (e) {
      // ignore parse error
    }
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 pb-6 pt-4">
      <header className="space-y-2">
        <p className="ink-section-title">PORTRAIT · 画像与健康</p>
        <h1 className="text-2xl font-semibold text-ink">你的五行 &amp; 体质小档案</h1>
        <p className="max-w-xl text-xs text-ink-soft">
          这一页整合了个人基础信息、五行雷达和 mock 健康节奏图表。真实项目里可以对接穿戴设备或健康 App。
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="ink-card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-ink">基本信息 · 快速总览</h2>
            <Link
              href="/quiz"
              className="rounded-full border border-slate-300 bg-white/70 px-3 py-1 text-[11px] text-ink hover:border-ink-light"
            >
              去填写 / 编辑问卷
            </Link>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-xs text-ink-soft">
            <div>
              <dt className="text-[11px] text-ink-light">主五行</dt>
              <dd className="mt-1 text-sm text-ink">{five.main}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-ink-light">副五行</dt>
              <dd className="mt-1 text-sm text-ink">{five.secondary}</dd>
            </div>
            <div>
              <dt className="text-[11px] text-ink-light">体质类型</dt>
              <dd className="mt-1 text-ink">
                {aiProfile?.tcm?.type || "还未生成，可先在问卷页简单填写体质感受"}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-ink-light">最近状态</dt>
              <dd className="mt-1">
                {aiProfile?.tcm?.tendency || "后续可接入真实健康数据，这里暂用 AI 概述。"}
              </dd>
            </div>
          </dl>
          {error && <p className="mt-2 text-[11px] text-red-500">AI 分析失败：{error}</p>}
          {loading && (
            <p className="mt-2 text-[11px] text-ink-light">
              正在根据你的资料生成五行与体质画像…
            </p>
          )}
        </div>

        <div className="ink-card space-y-3 p-4">
          <h2 className="text-sm font-medium text-ink">五行雷达图</h2>
          <p className="text-[11px] text-ink-soft">
            以生日推算为基础，只做生活向的参考，不做专业命理解读。
          </p>
          <div className="mt-1 flex items-center justify-center">
            <FiveElementRadar scores={five.scores} />
          </div>
        </div>
      </section>

      <section className="ink-card space-y-3 p-4">
        <h2 className="text-sm font-medium text-ink">健康节奏 · 虚拟数据示意</h2>
        <p className="text-[11px] text-ink-soft">
          先用虚拟的步数、睡眠与动静平衡数据画出趋势，正式产品可以直接替换成来自设备或 App
          的真实数据。
        </p>
        <HealthCharts />
      </section>
    </main>
  );
}


