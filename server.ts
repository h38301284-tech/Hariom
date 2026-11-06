import express, { Request, Response } from "express";
import path from "path";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const upload = multer({ dest: "uploads/" });

// Middleware
app.use(express.json());

// Middleware to check maintenance mode
let isMaintenanceMode = false;

app.use((req, res, next) => {
  if (isMaintenanceMode && !req.path.startsWith("/api/admin")) {
    return res.status(503).json({ error: "Website is under maintenance. Please try again later." });
  }
  next();
});

async function startServer() {
  // Admin Routes
  app.post("/api/admin/toggle-maintenance", (req, res) => {
    const { password } = req.body;
    // Simple check for demo purposes, in production should use proper auth
    if (password === "admin123") {
      isMaintenanceMode = !isMaintenanceMode;
      return res.json({ status: "success", isMaintenanceMode });
    }
    res.status(401).json({ error: "Invalid admin password" });
  });

  app.get("/api/admin/status", (req, res) => {
    res.json({ isMaintenanceMode, owner: "Hariom", contact: "h38301284@gmail.com" });
  });

  // API Routes

  // AI content pack generation (scripts, SEO metadata and storyboards).
  app.post("/api/content-pack", async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      const { channel, topic, format, language, duration, extra, channelProfile } = req.body || {};
      if (typeof topic !== "string" || !topic.trim() || topic.length > 500) {
        return res.status(400).json({ error: "Enter a topic (maximum 500 characters)." });
      }
      const safe = (value: unknown, fallback: string, max = 100) =>
        typeof value === "string" ? value.slice(0, max) : fallback;
      const prompt = [
        "You are an expert YouTube content producer. Create one complete, original, ready-to-edit content pack.",
        "Channel: " + safe(channel, "General"),
        "Channel style: " + safe(channelProfile, "Clear, engaging and useful.", 1200),
        "Topic: " + topic.trim(),
        "Format: " + safe(format, "YouTube Short"),
        "Language: " + safe(language, "Hinglish"),
        "Target duration: " + safe(duration, "35 seconds"),
        "Additional direction: " + safe(extra, "None", 1000),
        "",
        "Return well-structured Markdown with these sections:",
        "1. 3 clickable but honest title options",
        "2. 3 opening hooks",
        "3. Full narration script with natural spoken language and pacing cues",
        "4. Scene-by-scene storyboard in a table: time, narration, visual direction, on-screen text, sound",
        "5. Thumbnail concept and 3 short thumbnail text options",
        "6. SEO description, relevant hashtags and searchable tags",
        "7. A concise call to action",
        "",
        "Keep the script aligned with the target duration. Avoid fabricated facts, fake statistics, misleading claims and guaranteed outcomes. For finance, make educational content and include appropriate risk context. For anime, clearly mark uncertain details as theories and do not invent canon events. Do not claim the content has been fact-checked or published."
      ].join("\n");
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
      const content = result.text || "";
      if (!content.trim()) return res.status(502).json({ error: "The AI returned an empty response. Please try again." });
      return res.json({ content });
    } catch (error: any) {
      console.error("Content pack generation failed:", error?.message || error);
      return res.status(500).json({ error: "Content generation failed. Check the Gemini API configuration and try again." });
    }
  });

  app.post("/api/clone-and-speak", upload.single("sample"), async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "ELEVENLABS_API_KEY is not configured" });
      }

      const { text, voiceName, stability, similarityBoost } = req.body;
      const sampleFile = req.file as Express.Multer.File;

      if (!sampleFile || !text) {
        return res.status(400).json({ error: "Missing required fields: sample and text" });
      }

      // Step 1: Add Voice
      const form = new FormData();
      form.append("name", voiceName || "Cloned Voice");
      form.append("files", fs.createReadStream(sampleFile.path));
      form.append("description", `Cloned via VoiceClone AI by ${voiceName || 'User'}`);

      const addVoiceResponse = await axios.post(
        "https://api.elevenlabs.io/v1/voices/add",
        form,
        {
          headers: {
            ...form.getHeaders(),
            "xi-api-key": apiKey,
          },
        }
      );

      const voiceId = addVoiceResponse.data.voice_id;

      // Step 2: Text to Speech
      const ttsResponse = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
        {
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: parseFloat(stability) || 0.5,
            similarity_boost: parseFloat(similarityBoost) || 0.75,
          },
        },
        {
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      // Clean up uploaded file
      fs.unlinkSync(sampleFile.path);

      // Return the audio as base64 for the frontend to play
      const audioBase64 = Buffer.from(ttsResponse.data).toString("base64");
      res.json({
        voiceId,
        audio: audioBase64,
        contentType: "audio/mpeg",
      });

    } catch (error: any) {
      console.error("Error in clone-and-speak:", error.response?.data || error.message);
      res.status(500).json({ 
        error: "Failed to process voice clone", 
        details: error.response?.data || error.message 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
