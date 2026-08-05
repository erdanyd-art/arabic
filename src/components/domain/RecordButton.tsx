import { useEffect, useRef, useState } from "react";
import { Mic, Play, Square } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type RecordState = "idle" | "recording" | "recorded" | "unsupported" | "denied" | "playback-error";

const STATUS_TEXT: Record<RecordState, string> = {
  idle: "",
  recording: "Sedang merekam suaramu",
  recorded: "Rekaman siap diputar ulang",
  unsupported: "Perekaman tidak didukung di perangkat ini",
  denied: "Izin mikrofon ditolak",
  "playback-error": "Rekaman tidak bisa diputar di browser ini",
};

// Browsers disagree on which audio container MediaRecorder can produce
// (Chrome/Firefox default to webm/opus, Safari only supports mp4/aac).
// Ask for the first container the browser actually supports instead of
// assuming webm, and read the *real* format back off the recorder when
// building the Blob — mislabeling the Blob's MIME type is what silently
// breaks playback.
const CANDIDATE_MIME_TYPES = ["audio/webm", "audio/mp4", "audio/ogg"];

function pickSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return undefined;
  return CANDIDATE_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
}

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
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setState("unsupported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredType = pickSupportedMimeType();
      const recorder = preferredType
        ? new MediaRecorder(stream, { mimeType: preferredType })
        : new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (chunksRef.current.length === 0) {
          setState("playback-error");
          return;
        }
        // recorder.mimeType is the browser's actual negotiated format —
        // using anything else here (like a hardcoded "audio/webm") makes
        // the Blob lie about its own encoding and playback fails silently.
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || preferredType });
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = URL.createObjectURL(blob);
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
    if (!audioUrlRef.current) return;
    const audio = new Audio(audioUrlRef.current);
    audio.play().catch(() => setState("playback-error"));
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span role="status" aria-live="polite" className="sr-only">
        {STATUS_TEXT[state]}
      </span>

      {(state === "unsupported" || state === "denied" || state === "playback-error") && (
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

      {(state === "idle" || state === "playback-error") && (
        <Button variant="secondary" size="sm" onClick={startRecording}>
          <Mic className="h-3 w-3" /> {state === "playback-error" ? "Rekam ulang" : "Latihan"}
        </Button>
      )}
    </div>
  );
}
