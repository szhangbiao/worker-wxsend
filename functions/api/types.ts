// 环境变量类型定义
export type Env = {
    WX_APPID?: string;
    WX_SECRET?: string;
};

// API 响应类型
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
    timestamp?: string;
}
