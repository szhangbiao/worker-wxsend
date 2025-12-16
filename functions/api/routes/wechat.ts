import { Hono } from 'hono';
import type { Env } from '../types';
import { WeChatAPI } from '../utils/wechat-api';

const wechat = new Hono<{ Bindings: Env }>();

/**
 * POST /api/wechat/send
 * 发送微信模板消息
 * Body: { title: string, content: string }
 */
wechat.post('/send', async (c) => {
    try {
        // 解析请求体
        const body = await c.req.json();
        const { title, content } = body;

        // 参数验证
        if (!title || !content) {
            return c.json({
                success: false,
                error: 'title and content are required',
            }, 400);
        }

        // 获取环境变量
        const userId = c.env.WX_USERID;
        const templateId = c.env.WX_TEMPLATE_ID;

        if (!userId || !templateId) {
            return c.json({
                success: false,
                error: 'WX_USERID or WX_TEMPLATE_ID not configured',
            }, 500);
        }

        // 创建微信 API 客户端
        const wechatAPI = new WeChatAPI(c.env);

        // 发送模板消息
        const success = await wechatAPI.sendTemplateMessage({
            toUser: userId,
            templateId: templateId,
            data: {
                title: { value: title },
                content: { value: content },
            },
        });

        return c.json({
            success,
            message: 'Template message sent successfully',
            data: {
                title,
                content,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Error sending WeChat message:', error);
        return c.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        }, 500);
    }
});

export default wechat;
