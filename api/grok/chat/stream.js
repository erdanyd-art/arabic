// Vercel serverless function — the production equivalent of the
// /api/grok/chat/stream route in server/index.js (used only for local dev
// via `npm run dev`). Vercel only ever serves the static `vite build`
// output; it never runs server/index.js, so this file is what actually
// answers `/api/grok/chat/stream` in production. Keep the two in sync if
// the Grok request shape ever changes.
//
// Requires GROK_API_KEY to be set in the Vercel project's Environment
// Variables (Project Settings -> Environment Variables) — server/.env is
// gitignored and never reaches the deployed environment.

export const config = {
  maxDuration: 60,
};

const GROK_MODEL = "grok-4-fast";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const GROK_API_KEY = process.env.GROK_API_KEY;
  if (!GROK_API_KEY) {
    res.status(500).json({ error: "GROK_API_KEY belum diset di Environment Variables Vercel" });
    return;
  }

  const { messages, systemPrompt } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages wajib diisi" });
    return;
  }
  if (typeof systemPrompt !== "string" || !systemPrompt.trim()) {
    res.status(400).json({ error: "systemPrompt wajib diisi" });
    return;
  }

  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.text,
    })),
  ];

  let upstream;
  try {
    upstream = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        messages: chatMessages,
        stream: true,
        temperature: 0.8,
        max_tokens: 900,
      }),
    });
  } catch {
    res.status(502).json({ error: "network", message: "Tidak bisa menghubungi Grok API." });
    return;
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    res.status(upstream.status).json({
      error: "upstream",
      status: upstream.status,
      message: detail.slice(0, 500) || "Grok API menolak permintaan.",
    });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();

  req.on("close", () => reader.cancel().catch(() => {}));

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
  } catch {
    // client disconnected or upstream dropped — end the response quietly
  } finally {
    res.end();
  }
}
