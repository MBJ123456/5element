import type { FiveElementProfile } from "./fiveElements";

export type AnalyzeMode = "profile" | "daily" | "pair" | "chat";

export interface UserProfile {
  name?: string;
  birthday?: string;
  gender?: string;
  location?: string;
  preferences?: string[];
  description?: string;
  tcm?: {
    coldHot?: string;
    dryness?: string;
    energy?: string;
    sleep?: string;
    digestion?: string;
  };
}

export interface WeatherInfo {
  city?: string;
  temperature?: number;
  humidity?: number;
  description?: string;
}

export function buildProfilePrompt(
  profile: UserProfile,
  five: FiveElementProfile
): string {
  return `
你是一名温柔克制的中医+五行生活顾问，请根据下面的资料，输出「五行人格画像 + 中医体质」：

[基本资料]
- 生日：${profile.birthday || "未知"}
- 性别：${profile.gender || "未知"}
- 地区：${profile.location || "未知"}
- 生活偏好：${profile.preferences?.join("、") || "未填写"}
- 自我描述：${profile.description || "未填写"}

[五行推断（前端预计算，仅供你参考，可以不必完全采纳）]
- 主五行：${five.main}
- 副五行：${five.secondary}
- 各项分值：${JSON.stringify(five.scores)}

[体质问卷]
- 怕冷/怕热：${profile.tcm?.coldHot || "未填写"}
- 口干/上火：${profile.tcm?.dryness || "未填写"}
- 精力状态：${profile.tcm?.energy || "未填写"}
- 睡眠状况：${profile.tcm?.sleep || "未填写"}
- 消化情况：${profile.tcm?.digestion || "未填写"}

请用 JSON 输出（不要出现多余说明），字段包括：
{
  "fiveElement": {
    "main": "木",
    "secondary": "水",
    "strength": "木旺略缺金",
    "traits": ["温和有同理心", "重视成长与学习"],
    "suggestions": ["保持适度运动舒筋活络", "多亲近自然、树木与水边"]
  },
  "tcm": {
    "type": "气虚夹湿",
    "tendency": "容易疲惫、偶有食欲不振",
    "focus": ["健脾补气", "适当运动促进代谢"]
  }
}`;
}

export function buildDailyPrompt(options: {
  profile: UserProfile;
  five: FiveElementProfile;
  weather?: WeatherInfo;
}): string {
  const { profile, five, weather } = options;
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  return `
你是一位懂得五行、中医和现代生活方式的「日常养生顾问」。
请结合用户的「五行人格 + 中医体质 + 当日天气」，用轻盈简短的方式给出今天的生活建议。
今天的日期是：${dateStr}。

[用户画像]
- 主五行：${five.main}
- 副五行：${five.secondary}
- 生日：${profile.birthday || "未知"}
- 体质问卷：${JSON.stringify(profile.tcm || {})}

[天气]
- 城市：${weather?.city || "未知"}
- 温度：${weather?.temperature ?? "未知"}℃
- 湿度：${weather?.humidity ?? "未知"}%
- 描述：${weather?.description || "未知"}

请用 JSON 输出一个对象，字段示例：
{
  "summary": "今天整体气机平稳，适合温和推进手上的事情。",
  "drink": "温热的花茶或淡淡的麦芽茶，少冰饮。",
  "food": "以清淡、少油的家常菜为主，可少量粗粮和应季蔬菜。",
  "schedule": "上午处理需要专注的事情，下午留一点空白给自己。",
  "outfit": "可以选择偏 ${five.main} 属性对应颜色的点缀，例如浅青绿或米白。",
  "emotion": "给自己一点缓冲，不必急着回应所有信息。",
  "dos": ["适度伸展舒筋", "早点收手机，给自己预留睡前安静时间"],
  "donts": ["连续久坐不动", "情绪上头时立刻做重大决定"]
}`;
}

export function buildChatPrompt(options: {
  profile: UserProfile;
  five: FiveElementProfile;
  weather?: WeatherInfo;
  history: { role: "user" | "assistant"; content: string }[];
  latestQuestion: string;
}): string {
  const { profile, five, weather, history, latestQuestion } = options;

  const historyText = history
    .map((m) => `${m.role === "user" ? "用户" : "顾问"}：${m.content}`)
    .join("\n");

  return `
你是一位语气温柔、话不多的东方养生顾问，会结合「五行人格」「中医体质」「天气」给出贴近日常的小建议。

[用户画像]
- 主五行：${five.main}
- 副五行：${five.secondary}
- 生日：${profile.birthday || "未知"}
- 偏好：${profile.preferences?.join("、") || "未填写"}
- 体质：${JSON.stringify(profile.tcm || {})}

[天气]
- 城市：${weather?.city || "未知"}
- 温度：${weather?.temperature ?? "未知"}℃
- 湿度：${weather?.humidity ?? "未知"}%
- 描述：${weather?.description || "未知"}

[近期对话]
${historyText || "（暂无历史对话）"}

[用户此刻的问题]
${latestQuestion}

请直接用中文回答 3～6 句话，风格要求：
- 语气平和，不灌鸡汤，不吓唬人
- 每条建议尽量具体，可落地（例如「今晚少刷手机，提前 30 分钟上床」）
- 适度提到五行和体质，但不要太玄乎
`;
}


