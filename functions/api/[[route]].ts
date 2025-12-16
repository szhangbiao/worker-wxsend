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
    return c.text('Hello world');
});

// ============================================
// 挂载路由模块
// ============================================
app.route('/health', healthRoutes);
app.route('/wechat', wechatRoutes);
// ============================================
// 错误处理
// ============================================
app.onError(errorHandler);
app.notFound(notFoundHandler);

// ============================================
// 导出为 Pages Functions 处理器
// ============================================
export const onRequest = async (context: any) => {
    return app.fetch(context.request, context.env);
};

