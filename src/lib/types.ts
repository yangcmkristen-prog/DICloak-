export type Role = "user" | "assistant";
export interface ChatTurn { role: Role; content: string }
export interface Conversation { id: string; name: string; messages: ChatTurn[]; createdAt: number; updatedAt: number }
export interface KnowledgeBase {
  faqItems: any[];
  troubleshootingItems: any[];
  outOfScopeItems: any[];
  mappingItems: any[];
  functionKnowledge: any[];
  termItems: any[];
  lastUpdated: number;
}
export interface ChatRequestPayload {
  message: string;
  history: ChatTurn[];
  knowledge: KnowledgeBase;
  systemPrompt: string;
}
