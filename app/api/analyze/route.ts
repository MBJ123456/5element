import { NextRequest, NextResponse } from "next/server";
import { analyzeFiveElementsFromBirthday } from "@/lib/fiveElements";
import { buildProfilePrompt, buildDailyPrompt, buildChatPrompt } from "@/lib/prompts";
import type { AnalyzeMode, UserProfile, WeatherInfo } from "@/lib/prompts";

const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions";
const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

async function callDeepSeek(prompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(DEEPSEEK_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  const text = data.choices?.[0]?.message?.content ?? "";
  return text;
}

async function callOpenAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  const text = data.choices?.[0]?.message?.content ?? "";
  return text;
}

async function callGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      mode?: AnalyzeMode;
      profile?: UserProfile;
      weather?: WeatherInfo;
      chatHistory?: { role: "user" | "assistant"; content: string }[];
      question?: string;
    };

    const mode: AnalyzeMode = body.mode || "profile";
    const profile: UserProfile = body.profile || {};
    const weather: WeatherInfo | undefined = body.weather;
    const five = analyzeFiveElementsFromBirthday(profile.birthday);

    let prompt: string;
    if (mode === "profile") {
      prompt = buildProfilePrompt(profile, five);
    } else if (mode === "daily") {
      prompt = buildDailyPrompt({ profile, five, weather });
    } else if (mode === "chat") {
      prompt = buildChatPrompt({
        profile,
        five,
        weather,
        history: body.chatHistory || [],
        latestQuestion: body.question || ""
      });
    } else if (mode === "pair") {
      // 轻社交匹配分析
      const targetUser = (body as any).targetUser || {};
      const userFive = analyzeFiveElementsFromBirthday(profile.birthday);
      prompt = `
你是一名温柔、专业的五行+中医体质匹配顾问。请根据以下信息，生成一份真实、具体、贴近生活的匹配分析。

[你的信息]
- 主五行：${userFive.main}
- 副五行：${userFive.secondary}
- 生日：${profile.birthday || "未知"}
- 体质：${JSON.stringify(profile.tcm || {})}
- 偏好：${profile.preferences?.join("、") || "未填写"}

[对方信息]
- 姓名：${targetUser.name || "未知"}
- 五行组合：${targetUser.five || "未知"}
- 体质：${targetUser.tcm || "未知"}
- 兴趣爱好：${Array.isArray(targetUser.interests) ? targetUser.interests.join("、") : "未知"}
- 生活节奏：${targetUser.lifestyle || "未知"}
- 性格特点：${targetUser.personality || "未知"}

请输出一个 JSON 对象，包含以下字段：
{
  "score": 75-95之间的整数（匹配度分数，要合理，不要太高或太低）,
  "summary": "一段2-3句话的整体评价，语气温和真实，不要过于夸张",
  "reasons": [
    "五行层面的匹配理由（如：木生火，你们在沟通上会比较顺畅）",
    "体质层面的互补或相似点（如：你们都偏静，可以一起做安静的活动）",
    "生活方式或兴趣的契合点（如：你们都喜欢茶，可以一起品茶聊天）"
  ],
  "activities": [
    "可以一起做的具体活动1（如：周末一起去公园散步）",
    "可以一起做的具体活动2（如：一起尝试新的茶品）",
    "可以一起做的具体活动3（如：分享读书心得）"
  ],
  "tips": "一条实用的相处小建议（如：ta是夜猫子，你如果早睡，可以约在下午见面）"
}

要求：
- 语气要真实、温和，不要过于理想化
- 匹配理由要具体，不要泛泛而谈
- 活动建议要可落地，贴近日常生活
- 分数要合理，不要都是90+，也不要太低
`;
    } else {
      prompt = `未知模式：${mode}`;
    }

    // 优先 DeepSeek，其次 OpenAI，最后 Gemini
    let text: string | null = null;
    const errors: string[] = [];
    const hasApiKey = {
      deepseek: !!process.env.DEEPSEEK_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY
    };

    // 尝试调用各个 API
    if (hasApiKey.deepseek) {
      try {
        text = await callDeepSeek(prompt);
        if (text) {
          // 成功，直接返回
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        errors.push(`DeepSeek: ${errMsg}`);
      }
    }

    if (!text && hasApiKey.openai) {
      try {
        text = await callOpenAI(prompt);
        if (text) {
          // 成功
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        errors.push(`OpenAI: ${errMsg}`);
      }
    }

    if (!text && hasApiKey.gemini) {
      try {
        text = await callGemini(prompt);
        if (text) {
          // 成功
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        errors.push(`Gemini: ${errMsg}`);
      }
    }

    if (!text) {
      // 检查是否有配置 API Key
      const hasAnyKey = hasApiKey.deepseek || hasApiKey.openai || hasApiKey.gemini;
      if (!hasAnyKey) {
        return NextResponse.json(
          {
            error: "未配置任何 AI API Key",
            detail: "请在 Vercel 项目设置中添加 DEEPSEEK_API_KEY、OPENAI_API_KEY 或 GEMINI_API_KEY 环境变量"
          },
          { status: 500 }
        );
      }

      // 有配置但都失败了
      return NextResponse.json(
        {
          error: "所有配置的 LLM 提供商调用失败",
          detail: errors.length > 0 ? errors.join("; ") : "未知错误",
          tips: "请检查：1) API Key 是否正确 2) API Key 是否有余额 3) 网络连接是否正常"
        },
        { status: 500 }
      );
    }

    // 尝试把 LLM 返回内容解析为 JSON，如果失败就原样返回文本
    let parsed: unknown = null;
    try {
      // 有些模型会用 ``` 包裹 JSON，先清洗
      const cleaned = text.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // 忽略解析错误，直接以 text 形式返回
    }

    return NextResponse.json(
      parsed ?? {
        rawText: text
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "调用 AI 失败",
        detail: String(e?.message || e)
      },
      { status: 500 }
    );
  }
}


