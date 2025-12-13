import { Hono } from 'hono';
import type { Env } from '../types';

const health = new Hono<{ Bindings: Env }>();

/**
 * 健康检查端点
 */
health.get('/', (c) => {
    return c.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'worker-wxsend',
    });
});

/**
 * 配置信息端点
 */
health.get('/config', (c) => {
    const env = c.env;

    return c.json({
        success: true,
        config: {
            apiBaseUrl: env.API_BASE_URL || 'https://api.weixin.qq.com',
            debug: env.DEBUG === 'true',
            hasCredentials: !!(env.WECHAT_APP_ID && env.WECHAT_APP_SECRET),
        },
    });
});

export default health;
