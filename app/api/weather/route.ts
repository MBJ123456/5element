import { NextRequest, NextResponse } from "next/server";

// 使用免费的 Open-Meteo API，无需 API key
// 先通过地理编码 API 获取城市坐标，再获取天气
const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cityInput = (body.city as string | undefined) || "Beijing";

    // 步骤1: 通过地理编码获取城市坐标
    const geoUrl = `${GEOCODING_API}?name=${encodeURIComponent(cityInput)}&count=1&language=zh`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoRes.ok || !geoData.results || geoData.results.length === 0) {
      return NextResponse.json(
        { error: "未找到该城市，请尝试英文城市名（如 Beijing、Shanghai）", detail: geoData },
        { status: 400 }
      );
    }

    const location = geoData.results[0];
    const latitude = location.latitude;
    const longitude = location.longitude;
    const cityName = location.name || cityInput;

    // 步骤2: 获取天气数据
    const weatherUrl = `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,weather_code&current_weather=true&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (!weatherRes.ok) {
      return NextResponse.json(
        { error: "获取天气数据失败", detail: weatherData },
        { status: weatherRes.status }
      );
    }

    // 解析天气代码为中文描述
    const weatherCode = weatherData.current_weather?.weather_code || 0;
    const weatherDesc = getWeatherDescription(weatherCode);

    return NextResponse.json({
      city: cityName,
      temperature: Math.round(weatherData.current_weather?.temperature || 0),
      humidity: Math.round(weatherData.hourly?.relative_humidity_2m?.[0] || 0),
      description: weatherDesc
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "天气查询失败", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// 将 WMO 天气代码转换为中文描述
function getWeatherDescription(code: number): string {
  const weatherMap: Record<number, string> = {
    0: "晴朗",
    1: "基本晴朗",
    2: "部分多云",
    3: "阴天",
    45: "有雾",
    48: "有雾",
    51: "小雨",
    53: "中雨",
    55: "大雨",
    56: "冻雨",
    57: "冻雨",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    66: "冻雨",
    67: "冻雨",
    71: "小雪",
    73: "中雪",
    75: "大雪",
    77: "雪粒",
    80: "小雨",
    81: "中雨",
    82: "大雨",
    85: "小雪",
    86: "大雪",
    95: "雷暴",
    96: "雷暴伴冰雹",
    99: "雷暴伴冰雹"
  };
  return weatherMap[code] || "未知";
}


