import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { SYSTEM_PROMPT } from '../../config/prompts'; // 确保路径正确

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    // 【监控点 1】确认收到请求
    console.log("👉 1. 后端收到请求，开始处理...");

    // 【监控点 2】检查 API Key 是否存在
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      console.error("❌ 致命错误：未读取到 API Key！请检查 .env.local 文件。");
      return new Response("Error: API Key is missing", { status: 500 });
    }
    console.log("✅ 2. API Key 读取成功 (前3位):", apiKey.substring(0, 3) + "...");

    // 初始化 OpenAI 客户端
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    });

    const { messages } = await req.json();

    // 【监控点 3】准备呼叫阿里云
    console.log("👉 3. 正在呼叫阿里云 Qwen-plus...");

    const response = await openai.chat.completions.create({
      model: 'qwen-plus',
      stream: true,
      temperature: 0.7,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
    });

    // 【监控点 4】呼叫成功
    console.log("✅ 4. 阿里云连接成功，开始流式输出...");

    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    // 【监控点 5】捕获所有报错
    console.error("❌ 发生严重错误:", error);
    
    // 把错误信息返回给前端，这样您在 Network 里就能看到了
    return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}