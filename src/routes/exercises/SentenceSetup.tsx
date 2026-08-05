import { useState } from "react";
import { ExerciseSetupScreen } from "@/components/domain/ExerciseSetupScreen";
import { OptionSwitchRow } from "@/components/domain/OptionSwitchRow";
import { sentenceTopics } from "@/data/sentenceTopics";

export function SentenceSetup() {
  const [harian, setHarian] = useState(false);
  const [wanita, setWanita] = useState(false);

  return (
    <ExerciseSetupScreen
      title="Latihan Kalimat"
      description="Pilih topik atau tulis kalimat sendiri, lalu berlatih pengucapan kalimat Arab secara utuh."
      topics={sentenceTopics}
      customPlaceholder='Tulis kalimat atau topik kalimat yang ingin dilatih, mis. "cerita liburan sekolah".'
      sessionBasePath="/kalimat/sesi"
      allowRandomPick
      buildSessionPath={(topicId) => `/kalimat/sesi/${topicId}?voice=${wanita ? "wanita" : "pria"}`}
      extraOptions={
        <>
          <OptionSwitchRow
            label="Aksen"
            offLabel="Formal (Fusha)"
            onLabel="Sehari-hari (Ammiyah)"
            checked={harian}
            onCheckedChange={setHarian}
          />
          <OptionSwitchRow
            label="Suara"
            offLabel="Laki-laki"
            onLabel="Perempuan"
            checked={wanita}
            onCheckedChange={setWanita}
          />
        </>
      }
    />
  );
}
