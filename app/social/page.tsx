"use client";

import { useState, useEffect } from "react";
import type { UserProfile } from "@/lib/prompts";

// 更真实的虚拟用户数据
const generateMockUsers = () => [
  {
    id: "user-1",
    name: "林清",
    nickname: "清茶",
    avatar: "🌿",
    age: 28,
    location: "杭州",
    five: "木火",
    tcm: "气郁偏热",
    interests: ["茶艺", "书法", "散步", "阅读"],
    lifestyle: "早睡早起，喜欢在清晨泡一壶茶，周末会去公园写生",
    personality: "温和内敛，喜欢安静的环境，偶尔会分享一些读书心得",
    color: "浅绿 / 米白",
    bio: "喜欢慢节奏的生活，用一杯茶的时间思考"
  },
  {
    id: "user-2",
    name: "水眠",
    nickname: "夜猫",
    avatar: "🌙",
    age: 25,
    location: "上海",
    five: "水金",
    tcm: "偏阴虚，容易上火",
    interests: ["音乐", "追剧", "咖啡", "夜跑"],
    lifestyle: "典型的夜猫子，晚上精力充沛，喜欢在深夜听音乐或看剧",
    personality: "活泼外向，喜欢分享生活片段，对新鲜事物好奇",
    color: "蓝灰 / 墨黑",
    bio: "夜晚是我的灵感时间，用音乐和故事填满生活"
  },
  {
    id: "user-3",
    name: "土央",
    nickname: "稳稳",
    avatar: "🌾",
    age: 30,
    location: "成都",
    five: "土金",
    tcm: "痰湿体质，爱吃甜食",
    interests: ["美食", "烘焙", "瑜伽", "旅行"],
    lifestyle: "生活节奏稳定，喜欢自己下厨，周末会做甜点分享给朋友",
    personality: "务实可靠，是朋友圈里的「稳定器」，喜欢慢慢相处",
    color: "米黄 / 暖棕",
    bio: "用食物和陪伴温暖身边的人，慢慢来比较快"
  }
];

export default function SocialPage() {
  const [users] = useState(generateMockUsers());
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // 加载用户资料
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("five-elements-profile");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as UserProfile;
      setUserProfile(parsed);
    } catch {
      // ignore
    }
  }, []);

  // 自动为每个用户生成匹配分析
  useEffect(() => {
    if (!userProfile) return;
    users.forEach((user) => {
      if (!matches[user.id] && !loading[user.id]) {
        generateMatch(user);
      }
    });
  }, [userProfile]);

  async function generateMatch(targetUser: typeof users[0]) {
    if (!userProfile) return;
    setLoading((prev) => ({ ...prev, [targetUser.id]: true }));
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "pair",
          profile: userProfile,
          targetUser: {
            name: targetUser.name,
            five: targetUser.five,
            tcm: targetUser.tcm,
            interests: targetUser.interests,
            lifestyle: targetUser.lifestyle,
            personality: targetUser.personality
          }
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "匹配分析生成失败");
      }
      setMatches((prev) => ({ ...prev, [targetUser.id]: data }));
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setLoading((prev) => ({ ...prev, [targetUser.id]: false }));
    }
  }

  async function handleRefresh() {
    setMatches({});
    setError(null);
    users.forEach((user) => {
      generateMatch(user);
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 pb-6 pt-4">
      <header className="space-y-2">
        <p className="ink-section-title">SOCIAL · 轻社交</p>
        <h1 className="text-2xl font-semibold text-ink">只是想象中的「如果我们相遇」</h1>
        <p className="max-w-xl text-xs text-ink-soft">
          这里不需要真实账号，只是通过三张虚拟卡片，看看五行和体质互补时，AI
          会怎么描述相处方式。你可以当作「扫码附近朋友」的预演。
        </p>
      </header>

      <section className="flex items-center justify-between">
        <p className="text-xs text-ink-soft">
          真实项目中，这一块可以接入地理位置、扫码或昵称搜索，我们现在只保留卡片展示和由
          AI 概括的匹配说明。
        </p>
        <button
          onClick={handleRefresh}
          disabled={Object.values(loading).some((v) => v)}
          className="rounded-full border border-slate-300 bg-white/70 px-3 py-1 text-[11px] text-ink hover:border-ink-light disabled:opacity-60"
        >
          {Object.values(loading).some((v) => v)
            ? "正在重新生成…"
            : "刷新匹配分析"}
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {users.map((user) => {
          const match = matches[user.id];
          const isLoading = loading[user.id];
          return (
            <article
              key={user.id}
              className="ink-card flex flex-col bg-gradient-to-br from-white/90 via-slate-50/80 to-jade-soft/40 p-4"
            >
              {/* 用户基本信息 */}
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-jade-soft/60 to-sky-50/80 text-2xl">
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-medium text-ink">{user.name}</h2>
                    <span className="text-[10px] text-ink-light">@{user.nickname}</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-ink-light">
                    {user.age}岁 · {user.location}
                  </p>
                </div>
              </div>

              {/* 五行 & 体质 */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-50/80 px-2 py-0.5 text-[10px] text-emerald-700">
                  五行：{user.five}
                </span>
                <span className="rounded-full bg-amber-50/80 px-2 py-0.5 text-[10px] text-amber-700">
                  体质：{user.tcm}
                </span>
              </div>

              {/* 个人简介 */}
              <p className="mt-2 text-xs text-ink-soft leading-relaxed">{user.bio}</p>

              {/* 兴趣爱好 */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {user.interests.slice(0, 4).map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full border border-slate-200 bg-white/60 px-2 py-0.5 text-[10px] text-ink-soft"
                  >
                    {interest}
                  </span>
                ))}
              </div>

              {/* 生活状态 */}
              <div className="mt-3 rounded-lg bg-slate-50/60 p-2 text-[11px] text-ink-soft">
                <p className="font-medium text-ink">生活节奏</p>
                <p className="mt-0.5 leading-relaxed">{user.lifestyle}</p>
              </div>

              {/* AI 匹配分析 */}
              <div className="mt-3 rounded-xl bg-white/80 p-3 text-[11px]">
                {isLoading ? (
                  <p className="text-ink-light">正在分析匹配度…</p>
                ) : match ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink">匹配度</span>
                      <span className="text-sm font-semibold text-jade">
                        {match.score || "—"} / 100
                      </span>
                    </div>
                    {match.summary && (
                      <p className="leading-relaxed text-ink-soft">{match.summary}</p>
                    )}
                    {Array.isArray(match.reasons) && match.reasons.length > 0 && (
                      <ul className="mt-2 space-y-1 pl-3 text-ink-soft">
                        {match.reasons.slice(0, 2).map((r: string, idx: number) => (
                          <li key={idx} className="list-disc text-[10px] leading-relaxed">
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                    {match.activities && Array.isArray(match.activities) && (
                      <div className="mt-2 rounded-lg bg-jade-soft/40 p-2">
                        <p className="text-[10px] font-medium text-ink">可以一起：</p>
                        <ul className="mt-1 space-y-0.5 pl-3">
                          {match.activities.slice(0, 3).map((act: string, idx: number) => (
                            <li key={idx} className="list-disc text-[10px] text-ink-soft">
                              {act}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {match.tips && (
                      <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50/60 p-2">
                        <p className="text-[10px] font-medium text-ink">💡 相处小贴士</p>
                        <p className="mt-0.5 text-[10px] leading-relaxed text-ink-soft">
                          {match.tips}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-ink-light">等待生成匹配分析…</p>
                )}
              </div>
            </article>
          );
        })}
      </section>

      {error && (
        <section className="ink-card p-4">
          <p className="text-[11px] text-red-500">匹配分析生成失败：{error}</p>
        </section>
      )}
    </main>
  );
}


