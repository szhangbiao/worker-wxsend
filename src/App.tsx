import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

function App() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!title.trim() || !content.trim()) {
            setResponse('错误: 标题和内容不能为空');
            return;
        }

        setLoading(true);
        setResponse('');

        try {
            const res = await fetch('/api/wechat/wxsend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
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
                        <CardDescription>输入标题和内容并发送到微信</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium text-gray-700">
                                标题
                            </label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="输入消息标题..."
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="content" className="text-sm font-medium text-gray-700">
                                内容
                            </label>
                            <Textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="输入消息内容..."
                                rows={4}
                                disabled={loading}
                            />
                        </div>
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
