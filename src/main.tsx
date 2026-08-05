import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import { QueryProvider } from "./providers/QueryProvider.tsx";
import { Toaster } from "./components/ui/sonner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Respects the OS-level "reduce motion" setting for every framer-motion animation in the app, app-wide, with no per-component changes needed. */}
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <QueryProvider>
          <BrowserRouter>
            <App />
            <Toaster />
          </BrowserRouter>
        </QueryProvider>
      </ThemeProvider>
    </MotionConfig>
  </StrictMode>,
);
