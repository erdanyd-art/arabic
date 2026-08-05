import { useEffect, useRef, useState } from "react";
import { Mic, Play, Square } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type RecordState = "idle" | "recording" | "recorded" | "unsupported" | "denied";

const STATUS_TEXT: Record<RecordState, string> = {
  idle: "",
  recording: "Sedang merekam suaramu",
  recorded: "Rekaman siap diputar ulang",
  unsupported: "Perekaman tidak didukung di perangkat ini",
  denied: "Izin mikrofon ditolak",
};

export function RecordButton() {
  const [state, setState] = useState<RecordState>("idle");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => chunksRef.current.push(event.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        audioUrlRef.current = URL.createObjectURL(blob);
        stream.getTracks().forEach((track) => track.stop());
        setState("recorded");
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setState("recording");
    } catch {
      setState("denied");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  function playRecording() {
    if (audioUrlRef.current) new Audio(audioUrlRef.current).play();
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span role="status" aria-live="polite" className="sr-only">
        {STATUS_TEXT[state]}
      </span>

      {(state === "unsupported" || state === "denied") && (
        <span className="text-xs text-muted-foreground">{STATUS_TEXT[state]}</span>
      )}

      {state === "recording" && (
        <Button variant="destructive" size="sm" onClick={stopRecording} className="relative">
          <motion.span
            className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-white"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <Square className="h-3 w-3" /> Berhenti
        </Button>
      )}

      {state === "recorded" && (
        <Button variant="secondary" size="sm" onClick={playRecording} className="text-success">
          <Play className="h-3 w-3" /> Putar rekaman
        </Button>
      )}

      {state === "idle" && (
        <Button variant="secondary" size="sm" onClick={startRecording}>
          <Mic className="h-3 w-3" /> Latihan
        </Button>
      )}
    </div>
  );
}
