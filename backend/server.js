import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { activity } = req.body;

  if (!activity) {
    return res.status(400).json({
      error: "Missing required field: activity",
    });
  }

  const systemPrompt = `You are a satirical LinkedIn post writer. Your job is to make mundane activities sound like insane, world-changing achievements — absurd and exaggerated, like the best (worst) of LinkedIn. Be SHORT, ABSURD, and FUNNY. Use ridiculous corporate buzzwords and treat trivial actions as epic leadership moments. Include professional, LinkedIn-appropriate emojis (e.g. 💼 📈 🎯 ✨ 🙌 💡 🔥 📊 ✅ 🚀 💪 — nothing childish or overly casual). The post should feel like one continuous paragraph, no bullet points. Output valid JSON only, no markdown code fences.`;

  const userPrompt = `Activity: "${activity}"

Write a SHORT, wildly exaggerated LinkedIn post — absurd and over-the-top, like classic LinkedIn humble-brag energy.

RULES:
- No headline, no bullet points. One flowing post: a ridiculous exaggeration of what the person actually did.
- Body: 2–4 short sentences. Pack in buzzwords and absurd framing. Make it laugh-out-loud silly.
- Sprinkle in professional emojis (💼 📈 🎯 ✨ 🙌 💡 🔥 📊 ✅ 🚀 💪) — the kind you see on real LinkedIn. They should add character, not clutter.
- Hashtags: Exactly 3, space-separated, at the end.

Respond with a JSON object: "body", "hashtags" (both strings).`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.92,
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content);

    return res.json({
      body: parsed.body || "",
      hashtags: parsed.hashtags || "",
    });
  } catch (err) {
    console.error("OpenAI error:", err);
    const message = err.message || "Failed to generate post";
    const status = err.status || 500;
    return res.status(status).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`WorkforceBeast API running at http://localhost:${PORT}`);
});
