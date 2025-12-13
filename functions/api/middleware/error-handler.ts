import type { Context } from 'hono';
import type { Env } from '../types';

/**
 * 错误处理中间件
 */
export const errorHandler = (err: Error, c: Context) => {
    console.error('API Error:', err);

    return c.json(
        {
            success: false,
            error: err.message || '服务器内部错误',
            timestamp: new Date().toISOString(),
        },
        500
    );
};

/**
 * 404 处理中间件
 */
export const notFoundHandler = (c: Context) => {
    return c.json(
        {
            success: false,
            error: '接口不存在',
            path: c.req.path,
            timestamp: new Date().toISOString(),
        },
        404
    );
};

/**
 * 环境变量验证中间件
 */
export const validateEnv = (requiredVars: (keyof Env)[]) => {
    return async (c: Context<{ Bindings: Env }>, next: () => Promise<void>) => {
        const env = c.env;
        const missing: string[] = [];

        for (const varName of requiredVars) {
            if (!env[varName]) {
                missing.push(varName);
            }
        }

        if (missing.length > 0) {
            return c.json(
                {
                    success: false,
                    error: `缺少必要的环境变量: ${missing.join(', ')}`,
                },
                500
            );
        }

        await next();
    };
};
