# 开发环境指南

本项目是 Cloudflare Pages + Workers 全栈应用,提供了多种开发模式以适应不同的开发场景。

## 开发模式

### 🚀 推荐:统一端口模式(方案 2)

使用 Wrangler Pages Dev 作为主要开发服务器,完全模拟生产环境:

```bash
npm run dev
```

- **访问地址**: `http://localhost:8788`
- **特点**: Wrangler 会自动代理前端(5173)并处理后端 API
- **优势**: 完全模拟生产环境,前端和后端在同一端口

### 🔧 备选:独立前端开发(方案 1)

如果你只想开发前端,可以使用 Vite 开发服务器:

```bash
npm run dev:frontend
```

- **访问地址**: `http://localhost:5173`
- **前提**: 需要先在另一个终端运行 `npm run dev` 启动后端
- **特点**: Vite 会通过代理将 `/api` 请求转发到 `http://localhost:8788`

### 🔄 全栈并行模式

同时运行前端和后端,可以选择访问任一端口:

```bash
npm run dev:fullstack
```

- **前端**: `http://localhost:5173`
- **后端**: `http://localhost:8788`
- **特点**: 两个端口都可以访问,灵活切换

## 生产环境

在生产环境中,Cloudflare Pages 会自动统一处理:

```bash
npm run pages:deploy
```

部署后:
- 前端和后端都在同一个域名下(如 `your-project.pages.dev`)
- 访问 `/` → 前端页面
- 访问 `/api/*` → 自动路由到后端 Functions
- **无需任何额外配置**

## 常见问题

### Q: 我应该使用哪个开发模式?

**A**: 推荐使用 `npm run dev`,访问 `http://localhost:8788`,这样最接近生产环境。

### Q: 为什么有两个端口?

**A**: 
- `5173`: Vite 前端开发服务器
- `8788`: Wrangler Pages Dev 服务器(代理前端 + 处理后端)

### Q: API 请求失败怎么办?

**A**: 
1. 确保使用 `npm run dev` 启动了 Wrangler
2. 访问 `http://localhost:8788` 而不是 `5173`
3. 或者使用 `npm run dev:fullstack` 同时启动两个服务器

## 项目结构

```
worker-wxsend/
├── src/                    # 前端 React 应用
│   ├── components/ui/      # shadcn/ui 组件
│   └── App.tsx            # 主应用
├── functions/             # 后端 API
│   └── api/[[route]].ts   # Hono 路由入口
├── dist/                  # 构建输出
└── wrangler.jsonc         # Cloudflare 配置
```

## 技术栈

- **前端**: React + Vite + Tailwind CSS + shadcn/ui
- **后端**: Hono + Cloudflare Workers
- **部署**: Cloudflare Pages
