import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Home } from "@/routes/Home";
import { Skeleton } from "@/components/ui/skeleton";

const ModeSelect = lazy(() => import("@/routes/ModeSelect").then((m) => ({ default: m.ModeSelect })));
const VocabSetup = lazy(() => import("@/routes/exercises/VocabSetup").then((m) => ({ default: m.VocabSetup })));
const VocabSession = lazy(() => import("@/routes/exercises/VocabSession").then((m) => ({ default: m.VocabSession })));
const SentenceSetup = lazy(() => import("@/routes/exercises/SentenceSetup").then((m) => ({ default: m.SentenceSetup })));
const SentenceSession = lazy(() => import("@/routes/exercises/SentenceSession").then((m) => ({ default: m.SentenceSession })));
const ConversationSetup = lazy(() => import("@/routes/exercises/ConversationSetup").then((m) => ({ default: m.ConversationSetup })));
const ConversationSession = lazy(() => import("@/routes/exercises/ConversationSession").then((m) => ({ default: m.ConversationSession })));
const QuranList = lazy(() => import("@/routes/QuranList").then((m) => ({ default: m.QuranList })));
const QuranReader = lazy(() => import("@/routes/QuranReader").then((m) => ({ default: m.QuranReader })));
const GuideDetail = lazy(() => import("@/routes/GuideDetail").then((m) => ({ default: m.GuideDetail })));
const AiSpeakingSession = lazy(() =>
  import("@/routes/AiSpeakingSession").then((m) => ({ default: m.AiSpeakingSession })),
);
const VocabularyNotebook = lazy(() =>
  import("@/routes/VocabularyNotebook").then((m) => ({ default: m.VocabularyNotebook })),
);
const SavedExpressions = lazy(() =>
  import("@/routes/SavedExpressions").then((m) => ({ default: m.SavedExpressions })),
);
const ConversationHistoryList = lazy(() =>
  import("@/routes/ConversationHistoryList").then((m) => ({ default: m.ConversationHistoryList })),
);
const ConversationHistoryDetail = lazy(() =>
  import("@/routes/ConversationHistoryDetail").then((m) => ({ default: m.ConversationHistoryDetail })),
);
const SessionSummary = lazy(() =>
  import("@/routes/SessionSummary").then((m) => ({ default: m.SessionSummary })),
);
const ReviewMode = lazy(() => import("@/routes/ReviewMode").then((m) => ({ default: m.ReviewMode })));
const LearningNotebook = lazy(() =>
  import("@/routes/LearningNotebook").then((m) => ({ default: m.LearningNotebook })),
);

function RouteFallback() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-3 px-5 pt-6">
      <Skeleton className="h-9 w-9 rounded-full" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
      <Skeleton className="h-24 w-full rounded-lg" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/pilih-mode" element={<ModeSelect />} />

          <Route path="/kosakata/setup" element={<VocabSetup />} />
          <Route path="/kosakata/sesi/:topicId" element={<VocabSession />} />

          <Route path="/kalimat/setup" element={<SentenceSetup />} />
          <Route path="/kalimat/sesi/:topicId" element={<SentenceSession />} />

          <Route path="/percakapan/setup" element={<ConversationSetup />} />
          <Route path="/percakapan/sesi/:topicId" element={<ConversationSession />} />

          <Route path="/quran" element={<QuranList />} />
          <Route path="/quran/:surahNumber" element={<QuranReader />} />

          <Route path="/panduan/:jenis" element={<GuideDetail />} />

          <Route path="/bicara-ai" element={<AiSpeakingSession />} />

          <Route path="/kosakata-tersimpan" element={<VocabularyNotebook />} />
          <Route path="/ekspresi-tersimpan" element={<SavedExpressions />} />
          <Route path="/riwayat" element={<ConversationHistoryList />} />
          <Route path="/riwayat/:id" element={<ConversationHistoryDetail />} />
          <Route path="/ringkasan/:id" element={<SessionSummary />} />
          <Route path="/ulas" element={<ReviewMode />} />
          <Route path="/buku-belajar" element={<LearningNotebook />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}
