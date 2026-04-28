"use client";
import { KnowledgeBase } from "@/lib/types";
export function KnowledgeManager({prompt,knowledge,onPromptChange,onUpload}:{prompt:string;knowledge:KnowledgeBase;onPromptChange:(v:string)=>void;onUpload:(f:File)=>Promise<void>}) {
  return <div className="panel-stack">
    <section className="panel"><h3>系统 Prompt</h3><textarea rows={8} value={prompt} onChange={e=>onPromptChange(e.target.value)} /></section>
    <section className="panel"><h3>知识库导入（Excel）</h3>
      <input type="file" accept=".xlsx,.xls" onChange={async e=>{const f=e.target.files?.[0]; if(f) await onUpload(f);}} />
      <ul className="kb-status">
        <li>FAQ / Routing：{knowledge.faqItems.length}</li><li>Troubleshooting：{knowledge.troubleshootingItems.length}</li>
        <li>Out of scope：{knowledge.outOfScopeItems.length}</li><li>Mapping：{knowledge.mappingItems.length}</li>
        <li>功能知识库：{knowledge.functionKnowledge.length}</li><li>术语库：{knowledge.termItems.length}</li>
      </ul>
    </section>
  </div>;
}
