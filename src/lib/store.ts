import { Conversation, KnowledgeBase } from "@/lib/types";
export const STORAGE_KEYS = {
  conversations: "diclok_conversations",
  knowledge: "diclok_knowledge",
  systemPrompt: "diclok_system_prompt",
  currentConversation: "diclok_current_conversation"
} as const;

export const DEFAULT_SYSTEM_PROMPT = `你是 DICloak 客服助手。
输出格式：
问题类型

回复1

回复2

回复3`;

const EMPTY_KB: KnowledgeBase = { faqItems: [], troubleshootingItems: [], outOfScopeItems: [], mappingItems: [], functionKnowledge: [], termItems: [], lastUpdated: 0 };

export const loadConversations = (): Conversation[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.conversations) || "[]");
export const saveConversations = (v: Conversation[]) => localStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify(v));
export const loadCurrentConversationId = () => localStorage.getItem(STORAGE_KEYS.currentConversation);
export const saveCurrentConversationId = (id: string) => localStorage.setItem(STORAGE_KEYS.currentConversation, id);
export const loadKnowledgeBase = (): KnowledgeBase => JSON.parse(localStorage.getItem(STORAGE_KEYS.knowledge) || JSON.stringify(EMPTY_KB));
export const saveKnowledgeBase = (v: KnowledgeBase) => localStorage.setItem(STORAGE_KEYS.knowledge, JSON.stringify(v));
export const loadSystemPrompt = () => localStorage.getItem(STORAGE_KEYS.systemPrompt) || DEFAULT_SYSTEM_PROMPT;
export const saveSystemPrompt = (v: string) => localStorage.setItem(STORAGE_KEYS.systemPrompt, v);
