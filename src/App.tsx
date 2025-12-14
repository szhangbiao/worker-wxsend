import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

function App() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) {
            return;
        }

        setLoading(true);
        setResponse('');

        try {
            const res = await fetch('/api/wechat/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await res.json();
            setResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            setResponse(`错误: ${error instanceof Error ? error.message : '未知错误'}`);
        } finally {
            setLoading(false);
        }
    };

    const testHello = async () => {
        setLoading(true);
        setResponse('');

        try {
            const res = await fetch('/api/health'); // Updated path
            const data = await res.json();
            setResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            setResponse(`错误: ${error instanceof Error ? error.message : '未知错误'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900">📱 微信消息发送</h1>
                    <p className="mt-2 text-sm text-gray-600">基于 Cloudflare Pages + Hono 构建</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>测试 API</CardTitle>
                        <CardDescription>检查后端服务是否正常</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={testHello}
                            disabled={loading}
                            variant="secondary"
                            className="w-full"
                        >
                            测试 /api/health
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>发送微信消息</CardTitle>
                        <CardDescription>输入内容并发送到微信</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="输入要发送的消息..."
                            rows={4}
                            disabled={loading}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleSendMessage}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? '发送中...' : '发送消息'}
                        </Button>
                    </CardFooter>
                </Card>

                {response && (
                    <Card>
                        <CardHeader>
                            <CardTitle>响应结果</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="bg-slate-100 p-4 rounded-md overflow-x-auto text-xs">
                                {response}
                            </pre>
                        </CardContent>
                    </Card>
                )}

                <footer className="text-center text-xs text-gray-500">
                    <p>
                        🚀 前端: React + Vite | ⚡ 后端: Hono + Cloudflare Workers | 🌐 部署: Cloudflare Pages
                    </p>
                </footer>
            </div>
        </div>
    );
}

export default App;
