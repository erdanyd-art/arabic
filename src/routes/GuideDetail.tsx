import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/ui/PageShell";
import { SessionHeader } from "@/components/ui/SessionHeader";
import { AudioButton } from "@/components/ui/AudioButton";
import { umrahGuide, hajiGuide } from "@/data/guideContent";
import type { GuideSection } from "@/lib/types";

const GUIDES: Record<string, { title: string; sections: GuideSection[] }> = {
  umrah: { title: "Panduan Umrah", sections: umrahGuide },
  haji: { title: "Panduan Haji", sections: hajiGuide },
};

export function GuideDetail() {
  const { jenis } = useParams();
  const navigate = useNavigate();
  const [openStep, setOpenStep] = useState<string | null>(null);
  const guide = jenis ? GUIDES[jenis] : undefined;

  if (!guide) {
    return (
      <PageShell>
        <p className="text-center text-sm text-slate-400">Panduan tidak ditemukan.</p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SessionHeader title={guide.title} onBack={() => navigate("/pilih-mode")} />
      <div className="space-y-6 pb-4">
        {guide.sections.map((section) => (
          <div key={section.id}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {section.title}
            </p>
            <div className="space-y-2">
              {section.steps.map((step) => {
                const isOpen = openStep === step.id;
                return (
                  <div key={step.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => setOpenStep(isOpen ? null : step.id)}
                      className="flex w-full items-center justify-between gap-3 p-4 text-left"
                    >
                      <span className="text-sm font-semibold text-slate-800">{step.title}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4"
                        >
                          <p className="text-sm text-slate-500">{step.description}</p>
                          {step.dua && (
                            <div className="mt-3 rounded-xl bg-slate-50 p-3">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-arabic text-right text-lg leading-relaxed text-slate-900">
                                  {step.dua}
                                </p>
                                <AudioButton text={step.dua} size="sm" />
                              </div>
                              {step.duaTranslation && (
                                <p className="mt-2 text-xs text-slate-500">{step.duaTranslation}</p>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
