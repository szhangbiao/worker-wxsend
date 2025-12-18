import { Hono } from 'hono';
import { errorResponse } from '../utils/response';
import { WeChatAPI } from '../utils/wechat-api';

const wechat = new Hono<{ Bindings: Env }>();

/**
 * POST /api/wechat/wxsend
 * 发送微信模板消息
 * Body: { title: string, content: string }
 */
wechat.post('/wxsend', async (c) => {
    try {
        // 解析请求体
        const body = await c.req.json();
        const { title, content } = body;

        // 参数验证
        if (!title || !content) {
            return c.json(errorResponse('title and content are required'), 400);
        }

        // 获取环境变量
        const userId = 'ogGeC2PyZ7KsV9f8xams6eMxzx-c';
        const templateId = 'e9awqnF0v2fkNVC25_kYLvQJNnaF0wCrisXMl892j6c';
        const priceUrl = 'https://price-pole.szhangbiao.cn';

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
            url: priceUrl
        });

        return c.json({
            success,
            message: 'Template message sent successfully'
        });
    } catch (error) {
        console.error('Error sending WeChat message:', error);
        return c.json(errorResponse(error instanceof Error ? error.message : 'Unknown error'), 500);
    }
});


wechat.post('/wxprice', async (c) => {
    try {
        // 解析请求体
        const body = await c.req.json();
        const { toUserId, templateId, templateData, url } = body;

        // 参数验证
        if (!toUserId) {
            return c.json(errorResponse('toUserId are required'), 400);
        }

        if (!templateId) {
            return c.json(errorResponse('templateId are required'), 400);
        }

        if (!templateData) {
            return c.json(errorResponse('templateData are required'), 400);
        }

        // 创建微信 API 客户端
        const wechatAPI = new WeChatAPI(c.env);

        // 发送模板消息
        const success = await wechatAPI.sendTemplateMessage({
            toUser: toUserId,
            templateId: templateId,
            data: templateData,
            url: url
        });

        return c.json({
            success,
            message: 'Template message sent successfully'
        });
    } catch (error) {
        console.error('Error sending WeChat message:', error);
        return c.json(errorResponse(error instanceof Error ? error.message : 'Unknown error'), 500);
    }
});

export default wechat;
