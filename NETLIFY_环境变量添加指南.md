# 🔑 Netlify 环境变量添加指南

## 📍 方法一：部署时添加（推荐）

### 步骤

1. **导入项目后，在部署配置页面**
   - 当你选择 GitHub 仓库后，会看到配置页面
   - 向下滚动，找到 **"Environment variables"** 或 **"Show advanced"** 按钮

2. **点击展开环境变量设置**
   - 点击 **"Show advanced"** 或直接看到 **"Environment variables"** 部分
   - 点击 **"New variable"** 或 **"Add variable"** 按钮

3. **添加变量**
   - **Key（变量名）**：`DEEPSEEK_API_KEY`
   - **Value（值）**：你的 DeepSeek API Key（例如：`sk-xxxxx...`）
   - 点击 **"Add"** 或 **"Save"**

4. **开始部署**
   - 点击 **"Deploy site"** 按钮
   - 环境变量会在构建时自动注入

---

## 📍 方法二：部署后添加（如果忘记添加）

### 步骤

1. **进入 Netlify Dashboard**
   - 访问：https://app.netlify.com
   - 登录后，找到你的项目（点击项目名称）

2. **进入项目设置**
   - 在项目页面顶部，点击 **"Site settings"** 或 **"Settings"** 标签

3. **找到环境变量设置**
   - 在左侧菜单中，找到 **"Environment variables"**
   - 或者直接向下滚动找到 **"Build & deploy"** → **"Environment"**

4. **添加新变量**
   - 点击 **"Add a variable"** 或 **"New variable"** 按钮
   - 输入：
     - **Key**: `DEEPSEEK_API_KEY`
     - **Value**: 你的 DeepSeek API Key
   - 点击 **"Save"**

5. **重新部署**
   - 添加环境变量后，需要重新部署才能生效
   - 点击 **"Deploys"** 标签
   - 点击 **"Trigger deploy"** → **"Deploy site"**
   - 或者直接推送代码到 GitHub，Netlify 会自动重新部署

---

## 📸 详细位置说明

### 部署时添加（方法一）

```
Netlify Dashboard
└── Add new site
    └── Import an existing project
        └── 选择 GitHub 仓库后
            └── 配置页面
                ├── Branch to deploy: main
                ├── Build command: npm run build
                ├── Publish directory: (留空)
                └── ⬇️ 向下滚动 ⬇️
                    └── Environment variables
                        └── [New variable] 按钮
                            ├── Key: DEEPSEEK_API_KEY
                            └── Value: sk-xxxxx...
```

### 部署后添加（方法二）

```
Netlify Dashboard
└── 你的项目名称
    └── Site settings (或 Settings)
        └── 左侧菜单
            └── Environment variables
                └── [Add a variable] 按钮
                    ├── Key: DEEPSEEK_API_KEY
                    └── Value: sk-xxxxx...
```

---

## 🔍 如何找到你的 DeepSeek API Key

1. **登录 DeepSeek**
   - 访问：https://platform.deepseek.com
   - 登录你的账号

2. **获取 API Key**
   - 进入 **"API Keys"** 或 **"密钥管理"** 页面
   - 复制你的 API Key（格式：`sk-xxxxx...`）

3. **添加到 Netlify**
   - 按照上面的步骤添加到 Netlify 环境变量中

---

## ✅ 验证环境变量是否生效

### 方法一：查看构建日志

1. 进入项目 → **"Deploys"** 标签
2. 点击最新的部署记录
3. 查看构建日志，应该能看到环境变量已加载（但不会显示具体值，这是安全的）

### 方法二：测试 API 调用

1. 访问你的网站：`https://你的项目名.netlify.app`
2. 尝试使用 AI 功能（比如生成建议）
3. 如果功能正常，说明环境变量已正确设置

---

## ⚠️ 常见问题

### Q: 找不到 "Environment variables" 选项？

**A:** 
- 确保你在正确的页面（Site settings）
- 尝试使用搜索功能搜索 "environment"
- 或者直接访问：`https://app.netlify.com/sites/你的项目名/configuration/env`

### Q: 添加环境变量后，API 还是调用失败？

**A:**
1. 确认变量名完全正确：`DEEPSEEK_API_KEY`（区分大小写）
2. 确认 API Key 值正确（没有多余空格）
3. **重要**：添加环境变量后，必须重新部署才能生效
4. 重新部署：点击 **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**

### Q: 环境变量是公开的吗？

**A:**
- ❌ **不是**！环境变量是私密的
- ✅ 只有你能在 Netlify Dashboard 中看到变量名
- ✅ 变量值是完全隐藏的，即使是构建日志也不会显示
- ✅ 这是安全的，可以放心使用

### Q: 可以添加多个环境变量吗？

**A:**
- ✅ 可以！你可以添加多个环境变量
- 例如：
  - `DEEPSEEK_API_KEY`
  - `OPENAI_API_KEY`（如果需要）
  - `NODE_VERSION`（如果需要指定 Node.js 版本）

---

## 📝 快速检查清单

- [ ] 已登录 Netlify
- [ ] 已创建或选择项目
- [ ] 找到 "Environment variables" 设置
- [ ] 添加了 `DEEPSEEK_API_KEY`
- [ ] 输入了正确的 API Key 值
- [ ] 保存了环境变量
- [ ] 重新部署了项目（如果是在部署后添加的）
- [ ] 测试了网站功能

---

## 🎯 总结

**最简单的方法：**
1. 部署时，在配置页面找到 **"Environment variables"**
2. 点击 **"New variable"**
3. 输入 `DEEPSEEK_API_KEY` 和你的 API Key
4. 点击部署

**如果忘记添加：**
1. 进入项目 → **"Site settings"**
2. 找到 **"Environment variables"**
3. 添加变量
4. 重新部署

完成！🎉

