# 🚀 部署指南：将项目分享给他人

本指南将帮助你把这个项目部署到 Vercel，生成一个可以分享的网页链接。

## 📋 部署前准备

### 1. 确保项目可以正常构建

```bash
npm run build
```

如果构建成功，你会看到 "✓ Compiled successfully"。

### 2. 准备 API Key

你需要至少一个 AI API Key（DeepSeek / OpenAI / Gemini 任选其一）：
- **DeepSeek**：访问 https://platform.deepseek.com 申请
- **OpenAI**：访问 https://platform.openai.com 申请
- **Gemini**：访问 https://makersuite.google.com/app/apikey 申请

## 🌐 方法一：通过 GitHub + Vercel（推荐，最简单）

### 步骤 1：创建 GitHub 仓库

1. **在 GitHub 上创建新仓库**
   - 访问 https://github.com/new
   - 仓库名：`5elements`（或任意名称）
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize with README"

2. **在本地项目目录执行：**

```bash
# 初始化 Git（如果还没有）
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 五行中医AI助手"

# 连接到 GitHub（替换成你的仓库地址）
git remote add origin https://github.com/你的用户名/5elements.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

**如果遇到问题：**
- 如果提示需要登录，先执行：`git config --global user.name "你的名字"` 和 `git config --global user.email "你的邮箱"`
- 如果提示需要认证，访问 https://github.com/settings/tokens 创建 Personal Access Token

### 步骤 2：在 Vercel 部署

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录（如果没有账号，先注册）

2. **导入项目**
   - 点击 "Add New..." → "Project"
   - 在 "Import Git Repository" 中找到你的 `5elements` 仓库
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**：选择 "Next.js"（通常会自动检测）
   - **Root Directory**：保持默认（`./`）
   - **Build Command**：`npm run build`（默认）
   - **Output Directory**：`.next`（默认）

4. **添加环境变量**
   - 在 "Environment Variables" 部分，点击 "Add"
   - 添加以下变量（至少添加一个 AI API Key）：
     ```
     DEEPSEEK_API_KEY = 你的 DeepSeek API Key
     ```
     或
     ```
     OPENAI_API_KEY = 你的 OpenAI API Key
     ```
     或
     ```
     GEMINI_API_KEY = 你的 Gemini API Key
     ```

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待 1-2 分钟，Vercel 会自动构建和部署

6. **获取分享链接**
   - 部署完成后，你会看到一个 "Congratulations!" 页面
   - 你的网站链接类似：`https://5elements-xxx.vercel.app`
   - 这个链接可以分享给任何人！

## 🔧 方法二：通过 Vercel CLI（适合开发者）

### 步骤 1：安装 Vercel CLI

```bash
npm i -g vercel
```

### 步骤 2：登录 Vercel

```bash
vercel login
```

会打开浏览器让你登录。

### 步骤 3：部署

```bash
# 在项目目录执行
vercel

# 按提示操作：
# - Set up and deploy? Yes
# - Which scope? 选择你的账号
# - Link to existing project? No
# - Project name? 5elements（或自定义）
# - Directory? ./
# - Override settings? No
```

### 步骤 4：添加环境变量

```bash
# 添加 DeepSeek API Key
vercel env add DEEPSEEK_API_KEY

# 或添加 OpenAI
vercel env add OPENAI_API_KEY

# 或添加 Gemini
vercel env add GEMINI_API_KEY
```

### 步骤 5：重新部署

```bash
vercel --prod
```

## ✅ 部署后检查

1. **访问你的网站链接**（如 `https://5elements-xxx.vercel.app`）
2. **测试功能**：
   - 填写问卷
   - 查看今日建议
   - 测试 AI 对话
   - 查看轻社交匹配

3. **如果遇到问题**：
   - 检查 Vercel 控制台的 "Deployments" 标签页
   - 查看构建日志中的错误信息
   - 确认环境变量已正确添加

## 🔄 更新网站

每次你修改代码后：

```bash
# 提交更改
git add .
git commit -m "更新说明"
git push

# Vercel 会自动重新部署（如果使用方法一）
# 或手动部署（如果使用方法二）
vercel --prod
```

## 📝 常见问题

**Q: 部署后 API 调用失败？**
A: 检查环境变量是否正确添加，并在 Vercel 控制台的 "Settings" → "Environment Variables" 中确认。

**Q: 构建失败？**
A: 在本地先运行 `npm run build` 检查错误，修复后再部署。

**Q: 如何自定义域名？**
A: 在 Vercel 项目设置中，点击 "Domains" 可以添加自定义域名。

## 🎉 完成！

现在你的网站已经可以分享给任何人访问了！链接格式类似：
`https://5elements-你的用户名.vercel.app`

