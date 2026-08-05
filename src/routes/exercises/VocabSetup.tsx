import { useState } from "react";
import { ExerciseSetupScreen } from "@/components/domain/ExerciseSetupScreen";
import { OptionSwitchRow } from "@/components/domain/OptionSwitchRow";
import { vocabTopics } from "@/data/vocabTopics";

export function VocabSetup() {
  const [harian, setHarian] = useState(false);

  return (
    <ExerciseSetupScreen
      title="Latihan Kosakata"
      description="Pilih topik kosakata Arab. Tebak arti tiap kata dengan kuis pilihan ganda, lalu dengarkan pengucapannya."
      topics={vocabTopics}
      customPlaceholder='Tulis topik kosakata yang ingin dipelajari, mis. "alat musik" atau "cuaca".'
      sessionBasePath="/kosakata/sesi"
      extraOptions={
        <OptionSwitchRow
          label="Dialek audio"
          offLabel="Formal (Fusha)"
          onLabel="Sehari-hari (Ammiyah)"
          checked={harian}
          onCheckedChange={setHarian}
        />
      }
    />
  );
}
