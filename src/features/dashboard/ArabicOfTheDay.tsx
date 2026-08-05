import { AudioButton } from "@/components/domain/AudioButton";
import { getDailyPhrase } from "@/data/dailyPhrases";

/** One word, one sentence, one pronunciation button — no session, no AI, just a daily touch of Arabic. */
export function ArabicOfTheDay() {
  const phrase = getDailyPhrase();

  return (
    <section>
      <p className="mb-3 text-[13px] font-semibold text-muted-foreground">Kata Hari Ini</p>
      <div className="flex items-center gap-4 rounded-2xl bg-accent-muted/60 p-5">
        <AudioButton text={phrase.word} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2.5">
            <p lang="ar" dir="rtl" className="font-arabic text-2xl text-foreground">
              {phrase.word}
            </p>
            <p className="text-sm text-muted-foreground">{phrase.meaning}</p>
          </div>
          <p lang="ar" dir="rtl" className="font-arabic mt-1.5 text-left text-sm text-foreground/80">
            {phrase.example}
          </p>
          <p className="text-xs text-muted-foreground">{phrase.exampleTranslation}</p>
        </div>
      </div>
    </section>
  );
}
