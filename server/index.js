import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const PORT = process.env.PORT || 8787;
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash";

const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_MODEL = "grok-4-fast";

const SYSTEM_PROMPT = `Kamu adalah pelatih percakapan Bahasa Arab yang ramah untuk penutur Indonesia yang sedang berlatih speaking.

Aturan balasan:
- Selalu balas dengan skenario/konteks yang sedang dilatih pengguna secara natural, seolah kamu lawan bicara dalam skenario itu.
- Gunakan Bahasa Arab Fusha yang jelas dan tidak terlalu formal, level pemula-menengah.
- Setelah kalimat Arab, tulis baris baru dimulai "→ ID:" berisi terjemahan Indonesia singkat.
- Jaga respons singkat: 1-3 kalimat Arab saja per balasan, supaya nyaman dipakai latihan bicara.
- Jika ada kesalahan tata bahasa/kosakata dari pengguna, beri koreksi singkat dan halus sebelum melanjutkan.
- Jangan gunakan markdown, tabel, atau list. Hanya teks biasa dua baris seperti dijelaskan.`;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, configured: Boolean(API_KEY), grokConfigured: Boolean(GROK_API_KEY) });
});

app.post("/api/chat/stream", async (req, res) => {
  if (!API_KEY) {
    res.status(500).json({ error: "GEMINI_API_KEY belum diset di server/.env" });
    return;
  }

  const { messages, scenario } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages wajib diisi" });
    return;
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const systemText = scenario
    ? `${SYSTEM_PROMPT}\n\nSkenario latihan saat ini: ${scenario}`
    : SYSTEM_PROMPT;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${API_KEY}`;

  let upstream;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemText }] },
        generationConfig: { temperature: 0.8, maxOutputTokens: 300 },
      }),
    });
  } catch {
    res.status(502).json({ error: "network", message: "Tidak bisa menghubungi Gemini API." });
    return;
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    res.status(upstream.status).json({
      error: "upstream",
      status: upstream.status,
      message: detail.slice(0, 500) || "Gemini API menolak permintaan.",
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
});

app.post("/api/grok/chat/stream", async (req, res) => {
  if (!GROK_API_KEY) {
    res.status(500).json({ error: "GROK_API_KEY belum diset di server/.env" });
    return;
  }

  const { messages, scenario } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages wajib diisi" });
    return;
  }

  const systemText = scenario
    ? `${SYSTEM_PROMPT}\n\nSkenario latihan saat ini: ${scenario}`
    : SYSTEM_PROMPT;

  const chatMessages = [
    { role: "system", content: systemText },
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
        max_tokens: 300,
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
});

app.listen(PORT, () => {
  console.log(`AI proxy server ready on http://localhost:${PORT}`);
  if (!API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not set — /api/chat/stream will fail.");
  }
  if (!GROK_API_KEY) {
    console.warn("WARNING: GROK_API_KEY is not set — /api/grok/chat/stream will fail.");
  }
});
