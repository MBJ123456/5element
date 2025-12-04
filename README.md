# 五行 × 中医 × AI 日常助手

一个基于 Next.js 14 + TailwindCSS 的极简水墨风健康生活助手 Demo。

## 功能特性

- 🌿 **五行人格测试**：根据生日和偏好生成五行画像
- 🧘 **中医体质判定**：通过问卷判断体质类型
- 🌤️ **实时天气 + 每日建议**：结合天气和体质生成个性化生活建议
- 💬 **AI 对话助手**：结合五行、体质、天气的智能咨询
- 👥 **轻社交匹配**：虚拟用户匹配和相处建议

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 环境变量

创建 `.env` 文件，添加以下变量：

```env
# DeepSeek API（推荐）
DEEPSEEK_API_KEY=your_deepseek_api_key

# 或使用 OpenAI
OPENAI_API_KEY=your_openai_api_key

# 或使用 Gemini
GEMINI_API_KEY=your_gemini_api_key
```

**注意**：天气 API 使用免费的 Open-Meteo，无需 API key。

## 部署到 Vercel

### 方法一：通过 GitHub（推荐）

1. **在 GitHub 创建仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/5elements.git
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库
   - 添加环境变量（DEEPSEEK_API_KEY 等）
   - 点击 "Deploy"

### 方法二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署
vercel

# 添加环境变量（在 Vercel 控制台或使用 CLI）
vercel env add DEEPSEEK_API_KEY
```

## 项目结构

```
5elements/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 主页
│   ├── quiz/              # 问卷页
│   ├── profile/           # 画像页
│   ├── today/             # 今日建议页
│   ├── social/            # 轻社交页
│   └── api/               # API 路由
├── components/            # React 组件
├── lib/                   # 工具函数
└── public/                # 静态资源
```

## 技术栈

- **框架**：Next.js 14 (App Router)
- **样式**：TailwindCSS
- **AI**：DeepSeek / OpenAI / Gemini
- **天气**：Open-Meteo API
- **语言**：TypeScript

## 许可证

MIT

