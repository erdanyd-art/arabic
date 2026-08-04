import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Home } from "@/routes/Home";
import { ModeSelect } from "@/routes/ModeSelect";
import { VocabSetup } from "@/routes/exercises/VocabSetup";
import { VocabSession } from "@/routes/exercises/VocabSession";
import { SentenceSetup } from "@/routes/exercises/SentenceSetup";
import { SentenceSession } from "@/routes/exercises/SentenceSession";
import { ConversationSetup } from "@/routes/exercises/ConversationSetup";
import { ConversationSession } from "@/routes/exercises/ConversationSession";
import { QuranList } from "@/routes/QuranList";
import { QuranReader } from "@/routes/QuranReader";
import { GuideDetail } from "@/routes/GuideDetail";

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
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
      </Routes>
    </AnimatePresence>
  );
}
