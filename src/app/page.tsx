"use client";
import { useEffect, useState } from "react";
import { ChatArea } from "@/components/chat-area";
import { ConversationList } from "@/components/conversation-list";
import { KnowledgeManager } from "@/components/knowledge-manager";
import { parseKnowledgeWorkbook } from "@/lib/excel-parser";
import { Conversation } from "@/lib/types";
import { DEFAULT_SYSTEM_PROMPT, loadConversations, loadCurrentConversationId, loadKnowledgeBase, loadSystemPrompt, saveConversations, saveCurrentConversationId, saveKnowledgeBase, saveSystemPrompt } from "@/lib/store";
import { Toaster } from "sonner";

const mk = (name="新对话"): Conversation => ({ id: Math.random().toString(36).slice(2,10), name, messages: [], createdAt: Date.now(), updatedAt: Date.now() });

export default function HomePage() {
  const [tab,setTab] = useState<"chat"|"knowledge">("chat");
  const [conversations,setConversations] = useState<Conversation[]>([]);
  const [currentId,setCurrentId] = useState<string|null>(null);
  const [knowledge,setKnowledge] = useState<any>(null);
  const [systemPrompt,setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{ const cs=loadConversations(); const init=cs.length?cs:[mk("默认对话")]; setConversations(init); setCurrentId(loadCurrentConversationId() || init[0].id); setKnowledge(loadKnowledgeBase()); setSystemPrompt(loadSystemPrompt()); },[]);
  useEffect(()=>{ if(conversations.length) saveConversations(conversations); },[conversations]);
  useEffect(()=>{ if(currentId) saveCurrentConversationId(currentId); },[currentId]);
  useEffect(()=>{ saveSystemPrompt(systemPrompt); },[systemPrompt]);

  const current = conversations.find(c=>c.id===currentId);

  const send = async (message:string) => {
    if(!current) return;
    const history = [...current.messages, { role:"user", content: message }];
    setConversations(prev=>prev.map(c=>c.id===currentId?{...c,messages:history}:c));
    setLoading(true);
    const res = await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message,history,knowledge,systemPrompt})});
    const reader = res.body?.getReader(); const decoder = new TextDecoder(); let buf=""; const chunks:string[]=[];
    while(reader){ const r=await reader.read(); if(r.done) break; buf += decoder.decode(r.value,{stream:true}); const events=buf.split("\n\n"); buf=events.pop()||""; for(const e of events){ if(e.startsWith("data: ")){ const p=JSON.parse(e.slice(6)); if(p.chunk) chunks.push(p.chunk); } } }
    const assistant = chunks.join("\n\n");
    setConversations(prev=>prev.map(c=>c.id===currentId?{...c,messages:[...c.messages,{role:"user",content:message},{role:"assistant",content:assistant}]}:c));
    setLoading(false);
  };

  if(!knowledge) return null;
  return <div className="app-shell">
    <Toaster position="top-right" />
    <header className="topbar"><h1>DICloak 客服助手</h1><span className="badge">内部版</span></header>
    <div className="content-grid">
      <ConversationList conversations={conversations} currentId={currentId} onSelect={setCurrentId}
        onCreate={()=>{const c=mk(); setConversations(p=>[c,...p]); setCurrentId(c.id);}}
        onRename={(id)=>{const n=prompt("新名称",""); if(!n) return; setConversations(p=>p.map(c=>c.id===id?{...c,name:n}:c));}}
        onDelete={(id)=>{const next=conversations.filter(c=>c.id!==id); if(next.length){setConversations(next); if(currentId===id) setCurrentId(next[0].id);} }} />
      <main className="main-panel">
        <div className="tabs"><button className={tab==="chat"?"active":""} onClick={()=>setTab("chat")}>对话助手</button><button className={tab==="knowledge"?"active":""} onClick={()=>setTab("knowledge")}>知识库</button></div>
        {tab==="chat" && current ? <ChatArea messages={current.messages as any} loading={loading} onSend={send} /> :
          <KnowledgeManager prompt={systemPrompt} knowledge={knowledge} onPromptChange={setSystemPrompt} onUpload={async f=>{const n=await parseKnowledgeWorkbook(f,knowledge); setKnowledge(n); saveKnowledgeBase(n);}} />}
      </main>
    </div>
  </div>;
}
