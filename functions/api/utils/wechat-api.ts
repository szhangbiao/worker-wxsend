import type { Env } from '../types';

/**
 * 微信 API 客户端
 */
export class WeChatAPI {
    constructor(_env: Env) {
        // 环境变量将在实际实现时使用
    }

    /**
     * 获取 Access Token
     */
    async getAccessToken(): Promise<string> {
        // TODO: 实现获取 access_token 的逻辑
        return 'mock_access_token';
    }

    /**
     * 发送模板消息
     */
    async sendTemplateMessage(params: {
        toUser: string;
        templateId: string;
        data: Record<string, any>;
    }): Promise<any> {
        // TODO: 实现发送模板消息的逻辑
        return {
            errcode: 0,
            errmsg: 'ok',
            msgid: 'mock_msg_id',
            params,
        };
    }

    /**
     * 发送文本消息
     */
    async sendTextMessage(toUser: string, content: string): Promise<any> {
        // TODO: 实现发送文本消息的逻辑
        return {
            errcode: 0,
            errmsg: 'ok',
            content,
            toUser,
        };
    }
}
