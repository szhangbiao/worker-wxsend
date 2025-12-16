// 环境变量类型定义
export type Env = {
    WX_APPID?: string;
    WX_SECRET?: string;
    WX_USERID?: string;
    WX_TEMPLATE_ID?: string;
};

// API 响应类型
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    timestamp?: string;
}

// 微信消息请求类型
export interface WxSendRequest {
    message: string;
    toUser?: string;
    templateId?: string;
}

// 微信消息响应类型
export interface WxSendResponse {
    sent_message: string;
    timestamp: string;
    app_id: string;
    api_base: string;
}
