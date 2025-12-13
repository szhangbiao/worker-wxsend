import { Hono } from 'hono';
import type { Env, WxSendRequest } from '../types';
import { validateEnv } from '../middleware/error-handler';
import { successResponse, errorResponse, validateRequired } from '../utils/response';
import { WeChatAPI } from '../utils/wechat-api';

const wechat = new Hono<{ Bindings: Env }>();

/**
 * POST /api/wechat/send
 * 发送微信消息
 */
wechat.post(
    '/send',
    validateEnv(['WECHAT_APP_ID', 'WECHAT_APP_SECRET']),
    async (c) => {
        try {
            const body = (await c.req.json()) as WxSendRequest;

            // 验证必填字段
            const validationError = validateRequired(body, ['message']);
            if (validationError) {
                return c.json(errorResponse(validationError), 400);
            }

            // 创建微信 API 客户端
            const wechatApi = new WeChatAPI(c.env);

            // 发送消息
            const result = await wechatApi.sendTextMessage('default_user', body.message);

            return c.json(
                successResponse(
                    {
                        sent_message: body.message,
                        timestamp: new Date().toISOString(),
                        app_id: c.env.WECHAT_APP_ID,
                        result,
                    },
                    '消息发送成功'
                )
            );
        } catch (error) {
            return c.json(
                errorResponse(error instanceof Error ? error.message : '未知错误'),
                500
            );
        }
    }
);

/**
 * POST /api/wechat/template
 * 发送模板消息
 */
wechat.post(
    '/template',
    validateEnv(['WECHAT_APP_ID', 'WECHAT_APP_SECRET', 'WECHAT_TEMPLATE_ID']),
    async (c) => {
        try {
            const body = await c.req.json();

            // 验证必填字段
            const validationError = validateRequired(body, ['toUser', 'data']);
            if (validationError) {
                return c.json(errorResponse(validationError), 400);
            }

            // 创建微信 API 客户端
            const wechatApi = new WeChatAPI(c.env);

            // 发送模板消息
            const result = await wechatApi.sendTemplateMessage({
                toUser: body.toUser,
                templateId: c.env.WECHAT_TEMPLATE_ID!,
                data: body.data,
            });

            return c.json(successResponse(result, '模板消息发送成功'));
        } catch (error) {
            return c.json(
                errorResponse(error instanceof Error ? error.message : '未知错误'),
                500
            );
        }
    }
);

/**
 * GET /api/wechat/info
 * 获取微信配置信息
 */
wechat.get('/info', (c) => {
    return c.json(
        successResponse({
            appId: c.env.WECHAT_APP_ID,
            hasSecret: !!c.env.WECHAT_APP_SECRET,
            hasTemplateId: !!c.env.WECHAT_TEMPLATE_ID,
        })
    );
});

export default wechat;
