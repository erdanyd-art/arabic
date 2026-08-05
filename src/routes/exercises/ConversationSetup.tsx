import { ExerciseSetupScreen } from "@/components/domain/ExerciseSetupScreen";
import { conversationTopics } from "@/data/conversationTopics";

export function ConversationSetup() {
  return (
    <ExerciseSetupScreen
      title="Latihan Percakapan"
      description="Dialog dua orang dalam berbagai situasi Bahasa Arab. Berlatihlah berperan sebagai salah satunya."
      topics={conversationTopics}
      topicLabel="Situasi"
      tabLabel="Pilih Situasi"
      customPlaceholder='Tulis situasi percakapan yang ingin dilatih, mis. "membeli tiket kereta".'
      sessionBasePath="/percakapan/sesi"
    />
  );
}
