import { useEffect, useRef, useState } from "react";
import { Mic, Square, Play } from "lucide-react";

type RecordState = "idle" | "recording" | "recorded" | "unsupported" | "denied";

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

  if (state === "unsupported" || state === "denied") {
    return (
      <span className="text-xs text-slate-400">
        {state === "denied" ? "Izin mikrofon ditolak" : "Rekam tidak didukung"}
      </span>
    );
  }

  if (state === "recording") {
    return (
      <button
        type="button"
        onClick={stopRecording}
        className="inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1.5 text-xs font-semibold text-white"
      >
        <Square className="h-3 w-3" /> Berhenti
      </button>
    );
  }

  if (state === "recorded") {
    return (
      <button
        type="button"
        onClick={playRecording}
        className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700"
      >
        <Play className="h-3 w-3" /> Putar rekaman
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={startRecording}
      className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700"
    >
      <Mic className="h-3 w-3" /> Latihan
    </button>
  );
}
