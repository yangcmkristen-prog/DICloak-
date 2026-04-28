"use client";
import { KnowledgeBase } from "@/lib/types";
export function KnowledgeManager({prompt,knowledge,onPromptChange,onUpload}:{prompt:string;knowledge:KnowledgeBase;onPromptChange:(v:string)=>void;onUpload:(f:File)=>Promise<void>}) {
  return <div className="panel-stack">
    <section className="panel"><h3>绯荤粺 Prompt</h3><textarea rows={8} value={prompt} onChange={e=>onPromptChange(e.target.value)} /></section>
    <section className="panel"><h3>鐭ヨ瘑搴撳鍏ワ紙Excel锛?/h3>
      <input type="file" accept=".xlsx,.xls" onChange={async e=>{const f=e.target.files?.[0]; if(f) await onUpload(f);}} />
      <ul className="kb-status">
        <li>FAQ / Routing锛歿knowledge.faqItems.length}</li><li>Troubleshooting锛歿knowledge.troubleshootingItems.length}</li>
        <li>Out of scope锛歿knowledge.outOfScopeItems.length}</li><li>Mapping锛歿knowledge.mappingItems.length}</li>
        <li>鍔熻兘鐭ヨ瘑搴擄細{knowledge.functionKnowledge.length}</li><li>鏈搴擄細{knowledge.termItems.length}</li>
      </ul>
    </section>
  </div>;
}
