import { useCallback, useEffect, useRef, useState } from "react";
import { createSpeechRecognizer, isSpeechRecognitionSupported, type SpeechRecognizer } from "@/services/speechRecognition";

export type RecordingState = "idle" | "listening" | "processing" | "finished" | "error";
export type RecordingErrorKind = "permission-denied" | "no-microphone" | "unsupported" | "recognition-failed";

const WAVEFORM_BARS = 28;

export function useSpeechRecognition() {
  const [state, setState] = useState<RecordingState>("idle");
  const [errorKind, setErrorKind] = useState<RecordingErrorKind | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => Array(WAVEFORM_BARS).fill(0));
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognizerRef = useRef<SpeechRecognizer | null>(null);

  const isSupported = isSpeechRecognitionSupported();

  const cleanupAudioGraph = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => {});
    audioCtxRef.current = null;
    analyserRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const tickLevels = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const chunkSize = Math.floor(data.length / WAVEFORM_BARS) || 1;
    const next: number[] = [];
    for (let i = 0; i < WAVEFORM_BARS; i += 1) {
      let sum = 0;
      for (let j = 0; j < chunkSize; j += 1) sum += data[i * chunkSize + j] ?? 0;
      next.push(Math.min(1, sum / chunkSize / 180));
    }
    setLevels(next);
    rafRef.current = requestAnimationFrame(tickLevels);
  }, []);

  const start = useCallback(async () => {
    setErrorKind(null);
    setFinalTranscript("");
    setInterimTranscript("");
    setSeconds(0);

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorKind("no-microphone");
      setState("error");
      return;
    }
    if (!isSupported) {
      setErrorKind("unsupported");
      setState("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextCtor =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextCtor();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      rafRef.current = requestAnimationFrame(tickLevels);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);

      const recognizer = createSpeechRecognizer({
        onFinal: (chunk) => setFinalTranscript((prev) => `${prev} ${chunk}`.trim()),
        onInterim: (chunk) => setInterimTranscript(chunk),
        onError: () => setErrorKind("recognition-failed"),
        onEnd: () => {},
      });
      recognizerRef.current = recognizer;
      recognizer?.start();

      setState("listening");
    } catch {
      cleanupAudioGraph();
      setErrorKind("permission-denied");
      setState("error");
    }
  }, [cleanupAudioGraph, isSupported, tickLevels]);

  const stop = useCallback((): Promise<string> => {
    return new Promise((resolve) => {
      setState("processing");
      recognizerRef.current?.stop();
      // give the recognizer a beat to flush its final result chunk
      window.setTimeout(() => {
        cleanupAudioGraph();
        setLevels(Array(WAVEFORM_BARS).fill(0));
        setFinalTranscript((current) => {
          const combined = `${current} ${interimTranscript}`.trim();
          setState("finished");
          resolve(combined);
          return current;
        });
      }, 350);
    });
  }, [cleanupAudioGraph, interimTranscript]);

  /** Discard whatever was recorded/transcribed and return to a clean idle state, ready to record again. */
  const restart = useCallback(() => {
    recognizerRef.current?.abort();
    cleanupAudioGraph();
    setState("idle");
    setErrorKind(null);
    setLevels(Array(WAVEFORM_BARS).fill(0));
    setFinalTranscript("");
    setInterimTranscript("");
    setSeconds(0);
  }, [cleanupAudioGraph]);

  const resetError = useCallback(() => {
    setErrorKind(null);
    setState("idle");
  }, []);

  useEffect(() => cleanupAudioGraph, [cleanupAudioGraph]);

  return {
    state,
    errorKind,
    seconds,
    levels,
    liveTranscript: `${finalTranscript} ${interimTranscript}`.trim(),
    isSupported,
    start,
    stop,
    restart,
    resetError,
  };
}
