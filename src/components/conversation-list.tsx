"use client";
import { Conversation } from "@/lib/types";
export function ConversationList({ conversations, currentId, onSelect, onCreate, onRename, onDelete }:{
  conversations: Conversation[]; currentId: string | null;
  onSelect:(id:string)=>void; onCreate:()=>void; onRename:(id:string)=>void; onDelete:(id:string)=>void;
}) {
  return <aside className="sidebar">
    <div className="sidebar-header"><h3>对话列表</h3><button onClick={onCreate}>+ 新建</button></div>
    <div className="conversation-items">{conversations.map(c => <div key={c.id} className={`conv-item ${c.id===currentId?"active":""}`}>
      <button className="conv-name" onClick={()=>onSelect(c.id)}>{c.name}</button>
      <div className="conv-actions"><button onClick={()=>onRename(c.id)}>重命名</button><button onClick={()=>onDelete(c.id)}>删除</button></div>
    </div>)}</div>
  </aside>;
}
