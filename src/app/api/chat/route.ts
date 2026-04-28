import { NextRequest } from "next/server";
export const runtime = "nodejs";

function sse(data: string) { return `data: ${JSON.stringify({ chunk: data })}\n\n`; }

export async function POST(req: NextRequest) {
  const body = await req.json();
  const q = body?.message || "鏈彁渚涢棶棰?;
  const text = `闂绫诲瀷锛氬挩璇n\n鍥炲1锛氭偍濂斤紝鍏充簬鈥?{q}鈥濇垜浠凡鏀跺埌銆俓n\n鍥炲2锛氬凡鎸夌煡璇嗗簱妫€绱紝璇峰厛鎸夋祦绋嬫帓鏌ャ€俓n\n鍥炲3锛氬浠嶅紓甯革紝璇疯ˉ鍏呮埅鍥惧拰璐﹀彿瑙掕壊銆俙;

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
