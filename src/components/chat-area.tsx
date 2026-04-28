"use client";
import { useMemo, useState } from "react";
import { ChatTurn } from "@/lib/types";
function extractPureContent(text: string){ return text.replace(/^\[.*?\]\s*|^回复\s*\d+\s*[:：]?\s*/i,"").trim(); }
export function ChatArea({messages,loading,onSend}:{messages:ChatTurn[];loading:boolean;onSend:(t:string)=>void}) {
  const [input,setInput] = useState("");
  const lastAssistant = useMemo(()=>[...messages].reverse().find(m=>m.role==="assistant"),[messages]);
  const cards = (lastAssistant?.content||"").split("\n\n").filter(Boolean);
  return <section className="chat-area">
    <div className="message-list">{messages.map((m,i)=><div key={i} className={`msg ${m.role}`}>{m.content}</div>)}</div>
    <div className="composer"><textarea rows={3} value={input} onChange={e=>setInput(e.target.value)} /><button onClick={()=>{if(input.trim()){onSend(input.trim());setInput("");}}} disabled={loading}>{loading?"生成中...":"生成"}</button></div>
    <div className="reply-cards">{cards.map((r,i)=><article key={i} className="reply-card"><div className="reply-head"><h4>{i===0?"问题类型":`回复${i}`}</h4><button onClick={()=>navigator.clipboard.writeText(extractPureContent(r))}>复制</button></div><p>{extractPureContent(r)}</p></article>)}</div>
  </section>;
}
