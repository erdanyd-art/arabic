export type Level = "pemula" | "menengah" | "mahir";
export type Dialect = "formal" | "harian";
export type VoiceGender = "pria" | "wanita";

export const LEVEL_LABEL: Record<Level, string> = {
  pemula: "Pemula",
  menengah: "Menengah",
  mahir: "Mahir",
};

export interface VocabWord {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  distractors: [string, string];
}

export interface VocabTopic {
  id: string;
  title: string;
  arabicTitle: string;
  hint: string;
  level: Level;
  words: VocabWord[];
}

export interface PracticeSentence {
  id: string;
  arabic: string;
  translation: string;
}

export interface SentenceTopic {
  id: string;
  title: string;
  hint: string;
  level: Level;
  sentences: PracticeSentence[];
}

export interface DialogueRole {
  id: string;
  label: string;
  arabicLabel: string;
}

export interface DialogueLine {
  id: string;
  roleId: string;
  arabic: string;
  translation: string;
}

export interface ConversationTopic {
  id: string;
  title: string;
  arabicTitle: string;
  hint: string;
  level: Level;
  roles: [DialogueRole, DialogueRole];
  lines: DialogueLine[];
}

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  dua?: string;
  duaTranslation?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  steps: GuideStep[];
}

export interface SurahMeta {
  number: number;
  name: string;
  arabicName: string;
  ayahCount: number;
  revelation: "Makkiyah" | "Madaniyah";
}

export interface Ayah {
  number: number;
  arabic: string;
  translation: string;
}

export type ExerciseKind =
  | "kosakata"
  | "kalimat"
  | "percakapan"
  | "quran"
  | "umrah"
  | "haji";

export interface SessionHistoryEntry {
  id: string;
  kind: ExerciseKind;
  topicTitle: string;
  completedAt: string;
  score?: number;
  total?: number;
}
