import type { ReactNode } from "react";
import { motion } from "framer-motion";

const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
};

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60% 40% at 15% 0%, var(--color-primary-muted), transparent), radial-gradient(50% 35% at 100% 10%, var(--color-accent-muted), transparent)",
        }}
      />
      <motion.main
        {...pageTransition}
        className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-12 pt-6 sm:px-8"
      >
        {children}
      </motion.main>
    </div>
  );
}
