import * as XLSX from "xlsx";
import { KnowledgeBase } from "@/lib/types";

export async function parseKnowledgeWorkbook(file: File, current: KnowledgeBase): Promise<KnowledgeBase> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const next: KnowledgeBase = { ...current, lastUpdated: Date.now() };

  for (const sheetName of wb.SheetNames) {
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { defval: "" });
    const lower = sheetName.toLowerCase();
    if (lower === "feature_faq" || lower === "user_routing") next.faqItems = [...next.faqItems, ...rows];
    if (lower === "troubleshooting") next.troubleshootingItems = [...next.troubleshootingItems, ...rows];
    if (lower === "out_of_scope") next.outOfScopeItems = [...next.outOfScopeItems, ...rows];
    if (lower === "mapping") next.mappingItems = [...next.mappingItems, ...rows];
    if (lower === "function_knowledge" || lower === "鍔熻兘鐭ヨ瘑搴?) next.functionKnowledge = [...next.functionKnowledge, ...rows];
    if (lower === "term" || lower === "sheet1") next.termItems = [...next.termItems, ...rows];
  }
  return next;
}
