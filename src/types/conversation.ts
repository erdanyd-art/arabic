export type ChatRole = "user" | "tutor";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  translation?: string;
  timestamp: number;
  failed?: boolean;
}

export type ScenarioCategory =
  | "daily"
  | "restaurant"
  | "shopping"
  | "airport"
  | "hotel"
  | "classroom"
  | "interview"
  | "friends";

export interface Scenario {
  id: ScenarioCategory;
  title: string;
  description: string;
  icon: string;
}

export interface TutorReply {
  text: string;
  translation?: string;
}

export interface SendMessageInput {
  scenario: Scenario;
  history: ChatMessage[];
  message: string;
}

/**
 * Anything that can play the role of the AI tutor implements this. Today
 * only `MockTutorProvider` (services/mockTutor.ts) exists; a future
 * `GeminiTutorProvider` implements the exact same shape, so
 * `useConversation` — and every component built on top of it — never
 * needs to know or care which one is in use.
 */
export interface TutorProvider {
  sendMessage(input: SendMessageInput): Promise<TutorReply>;
}
