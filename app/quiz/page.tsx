"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [prefs, setPrefs] = useState<string[]>([]);
  const [tcmType, setTcmType] = useState("");
  const [coldHot, setColdHot] = useState("");
  const [dryness, setDryness] = useState("");
  const [sleep, setSleep] = useState("");
  const [digestion, setDigestion] = useState("");

  const preferenceOptions = ["安静阅读", "运动流汗", "夜猫子", "早睡早起", "爱喝茶", "爱咖啡"];

  function togglePref(opt: string) {
    setPrefs((prev) =>
      prev.includes(opt) ? prev.filter((p) => p !== opt) : [...prev, opt]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const profile = {
      birthday: birthday || undefined,
      gender: gender || undefined,
      location: location || undefined,
      preferences: prefs,
      tcm: {
        energy:
          tcmType === ""
            ? "随缘体质（说不上来）"
            : tcmType === "cold"
            ? "偏虚，容易怕风怕冷"
            : tcmType === "hot"
            ? "偏实热，容易上火出汗"
            : tcmType === "tired"
            ? "气血不足，容易疲惫、提不起劲"
            : "总体还算有底气",
        coldHot:
          coldHot === ""
            ? "冷热适中"
            : coldHot === "cold"
            ? "明显怕冷，手脚常凉"
            : "明显怕热，容易出汗、口渴",
        dryness:
          dryness === ""
            ? "口不太干，也不算特别爱上火"
            : dryness === "dry"
            ? "容易口干、咽干，偶尔溃疡"
            : "容易长痘、咽喉不适或口苦",
        sleep:
          sleep === ""
            ? "睡眠中等，偶尔会醒"
            : sleep === "insomnia"
            ? "入睡困难或容易半夜醒来"
            : "基本能睡够，醒来还算有精神",
        digestion:
          digestion === ""
            ? "消化一般"
            : digestion === "weak"
            ? "容易胃胀、饭后困倦或容易拉肚子"
            : "胃口不错，消化能力整体还行"
      }
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem("five-elements-profile", JSON.stringify(profile));
    }

    router.push("/profile");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 pb-6 pt-4">
      <header className="space-y-2">
        <p className="ink-section-title">QUIZ · 画像问卷</p>
        <h1 className="text-2xl font-semibold text-ink">先花 1 分钟，画一幅属于你的画像</h1>
        <p className="max-w-xl text-xs text-ink-soft">
          为了让后面的建议更贴近你，这里只保留最核心的几个问题，全部可以以后再改。
        </p>
      </header>

      <form onSubmit={handleSubmit} className="ink-card space-y-4 p-4 text-xs text-ink-soft">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 inline-block text-[11px] text-ink-light">生日</span>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs outline-none focus:border-jade focus:ring-1 focus:ring-jade/60"
            />
          </label>
          <label className="block">
            <span className="mb-1 inline-block text-[11px] text-ink-light">性别</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs outline-none focus:border-jade focus:ring-1 focus:ring-jade/60"
            >
              <option value="">不方便说</option>
              <option value="female">女性</option>
              <option value="male">男性</option>
              <option value="other">其他 / 不确定</option>
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 inline-block text-[11px] text-ink-light">
              常住城市（大致即可）
            </span>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="例：北京 / 上海 / 广州 / 杭州..."
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs outline-none focus:border-jade focus:ring-1 focus:ring-jade/60"
            />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <fieldset className="space-y-2">
            <legend className="mb-1 text-[11px] text-ink-light">生活偏好（可多选）</legend>
            <div className="flex flex-wrap gap-2">
              {preferenceOptions.map((opt) => {
                const checked = prefs.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => togglePref(opt)}
                    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] transition ${
                      checked
                        ? "border-jade bg-jade-soft text-ink"
                        : "border-slate-200 bg-white/60 text-ink-soft hover:border-jade"
                    }`}
                  >
                    <span
                      className={`h-3 w-3 rounded-full border ${
                        checked ? "border-emerald-500 bg-emerald-400" : "border-slate-300"
                      }`}
                    />
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="mb-1 text-[11px] text-ink-light">总体体质感受</legend>
            <select
              value={tcmType}
              onChange={(e) => setTcmType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs outline-none focus:border-jade focus:ring-1 focus:ring-jade/60"
            >
              <option value="">随缘体质（说不上来）</option>
              <option value="cold">偏虚偏寒，容易手脚凉、怕风</option>
              <option value="hot">偏实偏热，易上火出汗</option>
              <option value="tired">容易疲惫，久坐久站会累</option>
              <option value="strong">整体感觉还可以</option>
            </select>
          </fieldset>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <fieldset className="space-y-2">
            <legend className="mb-1 text-[11px] text-ink-light">对温度的敏感度</legend>
            <select
              value={coldHot}
              onChange={(e) => setColdHot(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs outline-none focus:border-jade focus:ring-1 focus:ring-jade/60"
            >
              <option value="">冷热都还好</option>
              <option value="cold">稍微降温就容易冷，手脚冰凉</option>
              <option value="hot">天气一热就容易出汗、烦躁</option>
            </select>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="mb-1 text-[11px] text-ink-light">是否容易上火 / 口干</legend>
            <select
              value={dryness}
              onChange={(e) => setDryness(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs outline-none focus:border-jade focus:ring-1 focus:ring-jade/60"
            >
              <option value="">比较少</option>
              <option value="dry">容易口干、咽干，偶尔便秘</option>
              <option value="heat">容易长痘、咽喉不适、口苦</option>
            </select>
          </fieldset>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <fieldset className="space-y-2">
            <legend className="mb-1 text-[11px] text-ink-light">最近一段时间睡眠</legend>
            <select
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs outline-none focus:border-jade focus:ring-1 focus:ring-jade/60"
            >
              <option value="">一般般</option>
              <option value="insomnia">入睡困难 / 半夜容易醒</option>
              <option value="good">基本能睡够，醒来不太累</option>
            </select>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="mb-1 text-[11px] text-ink-light">近期消化情况</legend>
            <select
              value={digestion}
              onChange={(e) => setDigestion(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-xs outline-none focus:border-jade focus:ring-1 focus:ring-jade/60"
            >
              <option value="">还可以</option>
              <option value="weak">偶有胃胀、腹泻或饭后犯困</option>
              <option value="good">胃口不错，很少不舒服</option>
            </select>
          </fieldset>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-full bg-ink px-5 py-1.5 text-xs text-white hover:bg-ink-soft"
          >
            完成，去看画像
          </button>
        </div>
      </form>
    </main>
  );
}


