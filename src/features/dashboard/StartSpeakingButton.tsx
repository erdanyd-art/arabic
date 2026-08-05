import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTodayScenario } from "./useTodayScenario";

/** The strongest visual element on the page — deep-links straight into today's scenario, skipping the picker entirely. */
export function StartSpeakingButton() {
  const navigate = useNavigate();
  const { scenario } = useTodayScenario();

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      onClick={() => navigate(`/bicara-ai?scenario=${scenario.id}`)}
      className="mt-5 flex w-full items-center justify-center gap-3 rounded-full bg-primary py-5 text-[17px] font-bold text-primary-foreground shadow-floating"
    >
      <Mic className="h-5 w-5" />
      Mulai Bicara
    </motion.button>
  );
}
