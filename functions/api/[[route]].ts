import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import type { Env } from './types';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

// 导入路由模块
import healthRoutes from './routes/health';
import wechatRoutes from './routes/wechat';

// 创建主应用
const app = new Hono<{ Bindings: Env }>().basePath('/api');

// ============================================
// 全局中间件
// ============================================
app.use('/*', cors());
app.use('/*', logger());
app.use('/*', prettyJSON());

// ============================================
// API 根路径
// ============================================
app.get('/', (c) => {
    return c.json({
        name: 'Worker WxSend API',
        version: '1.0.0',
        description: '基于 Cloudflare Pages + Hono 的微信消息发送服务',
        endpoints: {
            health: 'GET /api/health',
            config: 'GET /api/health/config',
            wechatSend: 'POST /api/wechat/send',
            wechatTemplate: 'POST /api/wechat/template',
            wechatInfo: 'GET /api/wechat/info',
        },
        documentation: 'https://github.com/your-repo/worker-wxsend',
    });
});

// ============================================
// 挂载路由模块
// ============================================
app.route('/health', healthRoutes);
app.route('/wechat', wechatRoutes);

// 兼容旧的 API 路径
app.post('/wxsend', async (c) => {
    // 重定向到新的路径
    const body = await c.req.json();
    const request = new Request(c.req.url.replace('/wxsend', '/wechat/send'), {
        method: 'POST',
        headers: c.req.raw.headers,
        body: JSON.stringify(body),
    });
    return app.fetch(request, c.env);
});

// ============================================
// 错误处理
// ============================================
app.onError(errorHandler);
app.notFound(notFoundHandler);

// ============================================
// 导出为 Pages Functions 处理器
// ============================================
export const onRequest = app.fetch;
