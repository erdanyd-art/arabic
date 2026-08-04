import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-8"
      >
        {children}
      </motion.div>
    </div>
  );
}
