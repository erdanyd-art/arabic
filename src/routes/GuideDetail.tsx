import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AudioButton } from "@/components/domain/AudioButton";
import { umrahGuide, hajiGuide } from "@/data/guideContent";
import type { GuideSection } from "@/lib/types";

const GUIDES: Record<string, { title: string; sections: GuideSection[] }> = {
  umrah: { title: "Panduan Umrah", sections: umrahGuide },
  haji: { title: "Panduan Haji", sections: hajiGuide },
};

export function GuideDetail() {
  const { jenis } = useParams();
  const navigate = useNavigate();
  const guide = jenis ? GUIDES[jenis] : undefined;

  if (!guide) {
    return (
      <AppShell>
        <p className="text-center text-sm text-muted-foreground">Panduan tidak ditemukan.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TopBar title={guide.title} onBack={() => navigate("/pilih-mode")} />
      <div className="space-y-6 pb-4">
        {guide.sections.map((section) => (
          <div key={section.id}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {section.title}
            </p>
            <Card className="divide-y divide-border overflow-hidden">
              <Accordion type="single" collapsible>
                {section.steps.map((step) => (
                  <AccordionItem key={step.id} value={step.id}>
                    <AccordionTrigger>{step.title}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{step.description}</p>
                      {step.dua && (
                        <div className="mt-3 rounded-md bg-surface-muted p-3">
                          <div className="flex items-start justify-between gap-2">
                            <p lang="ar" className="font-arabic text-right text-lg leading-relaxed text-foreground">
                              {step.dua}
                            </p>
                            <AudioButton text={step.dua} size="sm" />
                          </div>
                          {step.duaTranslation && (
                            <p className="mt-2 text-xs text-muted-foreground">{step.duaTranslation}</p>
                          )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
