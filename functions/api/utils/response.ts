import type { ApiResponse } from '../types';

/**
 * 创建成功响应
 */
export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
    };
}

/**
 * 创建错误响应
 */
export function errorResponse(error: string): ApiResponse {
    return {
        success: false,
        error,
        timestamp: new Date().toISOString(),
    };
}

/**
 * 验证必填字段
 */
export function validateRequired(
    data: Record<string, any>,
    fields: string[]
): string | null {
    for (const field of fields) {
        if (!data[field]) {
            return `缺少必填字段: ${field}`;
        }
    }
    return null;
}
