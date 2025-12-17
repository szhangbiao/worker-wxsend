
/**
 * 微信 API 客户端
 */
export class WeChatAPI {
    baseUrl: string;
    appid?: string;
    appsecret?: string;
    constructor(_env: Env) {
        this.baseUrl = 'https://api.weixin.qq.com';
        this.appid = _env.WX_APPID;
        this.appsecret = _env.WX_SECRET;
    }

    /**
     * 获取 Access Token (使用 stable_token 接口)
     * @param forceRefresh 是否强制刷新 token
     * @returns access_token
     */
    async getStableToken(forceRefresh = false): Promise<string> {
        if (!this.appid || !this.appsecret) {
            throw new Error('WX_APPID or WX_SECRET not configured');
        }
        const url = `${this.baseUrl}/cgi-bin/stable_token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                grant_type: 'client_credential',
                appid: this.appid,
                secret: this.appsecret,
                force_refresh: forceRefresh,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to get stable token: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as {
            access_token?: string;
            expires_in?: number;
            errcode?: number;
            errmsg?: string;
        };

        if (data.errcode && data.errcode !== 0) {
            throw new Error(`WeChat API error: ${data.errcode} - ${data.errmsg}`);
        }

        if (!data.access_token) {
            throw new Error('No access_token in response');
        }

        return data.access_token;
    }

    /**
     * 发送模板消息
     * @param toUser 接收者 openid
     * @param templateId 模板 ID
     * @param data 模板数据
     * @param page 小程序页面路径 (可选)
     * @returns 是否发送成功
     */
    async sendTemplateMessage(params: {
        toUser: string;
        templateId: string;
        data: Record<string, { value: string }>;
        page?: string;
    }): Promise<boolean> {
        const accessToken = await this.getStableToken();
        const url = `${this.baseUrl}/cgi-bin/message/template/send?access_token=${accessToken}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                touser: params.toUser,
                template_id: params.templateId,
                page: params.page,
                data: params.data,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to send template message: ${response.status} ${response.statusText}`);
        }

        const result = await response.json() as {
            errcode: number;
            errmsg: string;
            msgid?: number;
        };

        if (result.errcode !== 0) {
            throw new Error(`WeChat API error: ${result.errcode} - ${result.errmsg}`);
        }

        return true;
    }
}
