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

export default health;
