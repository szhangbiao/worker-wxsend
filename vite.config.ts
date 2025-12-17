import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    server: {
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
        proxy: {
            // 将 /api 请求代理到 Wrangler Pages Dev 服务器
            // 这样在开发时访问 http://localhost:5173 也能正常调用 API
            '/api': {
                target: 'http://localhost:8788',
                changeOrigin: true,
            },
        },
    },
});
