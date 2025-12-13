import { useState } from 'react';
import './App.css';

function App() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim()) {
            alert('请输入消息内容');
            return;
        }

        setLoading(true);
        setResponse('');

        try {
            const res = await fetch('/api/wxsend', {
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
            const res = await fetch('/api/hello');
            const data = await res.json();
            setResponse(JSON.stringify(data, null, 2));
        } catch (error) {
            setResponse(`错误: ${error instanceof Error ? error.message : '未知错误'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <div className="container">
                <h1>📱 微信消息发送</h1>
                <p className="subtitle">基于 Cloudflare Pages + Hono 构建</p>

                <div className="card">
                    <h2>测试 API</h2>
                    <button onClick={testHello} disabled={loading} className="btn-secondary">
                        测试 /api/hello
                    </button>
                </div>

                <div className="card">
                    <h2>发送微信消息</h2>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="输入要发送的消息..."
                        rows={4}
                        disabled={loading}
                    />
                    <button onClick={handleSendMessage} disabled={loading} className="btn-primary">
                        {loading ? '发送中...' : '发送消息'}
                    </button>
                </div>

                {response && (
                    <div className="card response">
                        <h3>响应结果</h3>
                        <pre>{response}</pre>
                    </div>
                )}

                <div className="footer">
                    <p>
                        🚀 前端: React + Vite | ⚡ 后端: Hono + Cloudflare Workers | 🌐 部署: Cloudflare
                        Pages
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
