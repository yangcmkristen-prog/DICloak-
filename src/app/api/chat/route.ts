import { NextRequest } from "next/server";
export const runtime = "nodejs";

function sse(data: string) { return `data: ${JSON.stringify({ chunk: data })}\n\n`; }

export async function POST(req: NextRequest) {
  const body = await req.json();
  const q = body?.message || "未提供问题";
  const text = `问题类型：咨询\n\n回复1：您好，关于“${q}”我们已收到。\n\n回复2：已按知识库检索，请先按流程排查。\n\n回复3：如仍异常，请补充截图和账号角色。`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for (const part of text.split("\n\n")) {
        controller.enqueue(encoder.encode(sse(part)));
        await new Promise(r => setTimeout(r, 60));
      }
      controller.enqueue(encoder.encode("event: done\ndata: [DONE]\n\n"));
      controller.close();
    }
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache" }
  });
}
