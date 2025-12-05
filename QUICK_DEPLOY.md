# 🚀 快速部署方案（无需翻墙、无需注册）

## 方案一：Netlify（推荐，最简单）

### 3 步完成部署

#### 第 1 步：确保代码已推送
```bash
git add .
git commit -m "准备部署到 Netlify"
git push
```

#### 第 2 步：登录 Netlify
1. 访问：https://app.netlify.com/signup
2. 点击 **Sign up with GitHub**（使用 GitHub 账号登录）

#### 第 3 步：导入项目
1. 点击 **Add new site** → **Import an existing project**
2. 选择 GitHub → 授权 → 选择仓库 `5element`
3. 构建设置（通常会自动检测）：
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`（如果不行，留空让 Netlify 自动处理）
4. 点击 **Environment variables** → **Add variable**：
   - 变量名：`DEEPSEEK_API_KEY`
   - 值：你的 DeepSeek API Key
5. 点击 **Deploy site**

### 完成！
等待 2-3 分钟，你会得到一个链接：
```
https://你的项目名.netlify.app
```

**这个链接可以直接分享给任何人，无需翻墙、无需注册！**

---

## 方案二：优化 Vercel（如果继续使用）

### 确保使用生产域名

1. **检查 Vercel Dashboard**
   - 访问：https://vercel.com/dashboard
   - 找到你的项目
   - 查看 **Production** 部署（不是 Preview）

2. **获取生产链接**
   - 格式：`https://你的项目名.vercel.app`
   - 这个链接应该可以直接访问

3. **如果仍然需要翻墙**
   - 建议改用 Netlify（方案一）

---

## 方案三：Cloudflare Pages（备选）

### 注意：需要特殊配置

Cloudflare Pages 对 Next.js 支持需要额外配置，建议优先使用 Netlify。

如果必须使用 Cloudflare：
1. 访问：https://dash.cloudflare.com/sign-up
2. 使用 GitHub 登录
3. 创建 Pages 项目
4. 可能需要安装 `@cloudflare/next-on-pages` 适配器

---

## 常见问题

**Q: Netlify 构建失败？**
A: 
- 检查 `package.json` 中的 `build` 脚本
- 在环境变量中添加 `NODE_VERSION=18`

**Q: API 调用失败？**
A: 检查 `DEEPSEEK_API_KEY` 环境变量是否正确设置

**Q: 如何更新网站？**
A: 推送代码到 GitHub，Netlify/Vercel 会自动重新部署

**Q: 分享链接需要登录吗？**
A: 不需要！生产部署链接是公开的，任何人都可以直接访问

