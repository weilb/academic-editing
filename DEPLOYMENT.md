# 部署指南

## 🚀 GitHub Pages 部署

项目已成功部署到 GitHub Pages！

### 访问地址
**线上地址**: https://weilb.github.io/academic-editing

### 部署步骤

1. **安装部署工具**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **配置 package.json**
   ```json
   {
     "homepage": "https://weilb.github.io/academic-editing",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **构建和部署**
   ```bash
   npm run build
   npm run deploy
   ```

### 自动部署流程

每次运行 `npm run deploy` 时会自动：
1. 执行 `npm run build` 构建生产版本
2. 将 `build` 文件夹内容推送到 `gh-pages` 分支
3. GitHub Pages 自动从 `gh-pages` 分支部署网站

## 🔧 其他部署选项

### 1. Vercel 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### 2. Netlify 部署
1. 将项目推送到 GitHub
2. 在 Netlify 中连接 GitHub 仓库
3. 设置构建命令：`npm run build`
4. 设置发布目录：`build`

### 3. 服务器部署
```bash
# 构建项目
npm run build

# 将 build 文件夹上传到服务器
# 配置 Nginx 或 Apache 指向 build 目录
```

## ⚠️ 注意事项

1. **API 密钥安全**
   - 生产环境需要配置环境变量
   - 不要在前端代码中暴露 API 密钥

2. **路由配置**
   - 单页应用需要配置服务器重定向
   - GitHub Pages 已自动处理

3. **HTTPS**
   - GitHub Pages 自动提供 HTTPS
   - 确保 API 调用使用 HTTPS

## 📊 构建信息

- **构建大小**: ~475KB (gzipped)
- **主要依赖**: React, Ant Design, AI SDK
- **构建时间**: ~30秒

## 🔄 更新部署

每次代码更新后，只需运行：
```bash
npm run deploy
```

系统会自动构建最新版本并部署到 GitHub Pages。