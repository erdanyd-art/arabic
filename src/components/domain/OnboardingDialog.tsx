import { useEffect, useState } from "react";
import { BookOpenText, Mic, Sparkles, Volume2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "lisan-coach-onboarded";

const STEPS = [
  {
    icon: Volume2,
    title: "Dengar pengucapan asli",
    body: "Setiap kata, kalimat, dan dialog bisa didengarkan langsung dengan pelafalan Arab yang jelas.",
  },
  {
    icon: Mic,
    title: "Rekam & bandingkan suaramu",
    body: "Tekan Latihan untuk merekam ucapanmu sendiri, lalu putar ulang untuk menilai pelafalanmu.",
  },
  {
    icon: BookOpenText,
    title: "Belajar sesuai levelmu",
    body: "Mulai dari kosakata dasar, kalimat, percakapan, sampai bacaan Al-Quran — semua bisa disesuaikan levelnya.",
  },
];

export function OnboardingDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = window.localStorage.getItem(STORAGE_KEY);
    if (!seen) setOpen(true);
  }, []);

  function close() {
    window.localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && close()}>
      <DialogContent showClose={false} className="text-center">
        <DialogHeader>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-muted text-primary">
            <current.icon className="h-6 w-6" />
          </div>
          <DialogTitle className="mt-3 text-lg font-bold">{current.title}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">{current.body}</DialogDescription>
        </DialogHeader>

        <div className="mb-5 flex items-center justify-center gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s.title}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-primary" : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <Button variant="secondary" className="flex-1" onClick={() => setStep((s) => s - 1)}>
              Kembali
            </Button>
          )}
          <Button
            className="flex-1"
            onClick={() => (isLast ? close() : setStep((s) => s + 1))}
          >
            {isLast ? (
              <>
                <Sparkles className="h-4 w-4" /> Mulai Belajar
              </>
            ) : (
              "Lanjut"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
