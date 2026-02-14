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

  const systemPrompt = `You are a satirical LinkedIn post writer specializing in ABSOLUTELY ABSURD exaggerations. Your job is to transform the most mundane, trivial activities into world-shattering, paradigm-shifting, industry-disrupting achievements. Think of the most ridiculous LinkedIn posts you've ever seen, then go 10x more absurd. Make it so over-the-top that it's hilariously ridiculous. Use maximum corporate jargon, treat every tiny action as if it's a Nobel Prize-worthy breakthrough. Be SHORT but EXTREMELY ABSURD. Include professional emojis (💼 📈 🎯 ✨ 🙌 💡 🔥 📊 ✅ 🚀 💪 🌟 🎖️ 🏆) sparingly. Output valid JSON only, no markdown code fences.`;

  const userPrompt = `Activity: "${activity}"

Write an ABSOLUTELY RIDICULOUS LinkedIn post that makes this mundane activity sound like the most important achievement in human history. Go completely overboard. Make it so absurd that it's laugh-out-loud funny.

CRITICAL RULES:
- Make it EXTREMELY ABSURD. If someone made coffee, frame it as "revolutionizing the global beverage ecosystem through strategic caffeination methodologies"
- Use maximum corporate buzzwords: "synergy", "leverage", "paradigm shift", "disrupt", "transform", "innovate", "scale", "optimize", "strategic", "holistic", "ecosystem", "framework", "mindset", "journey"
- Treat trivial actions as if they're Nobel Prize-worthy breakthroughs that will change the world
- Body: 2–4 short sentences. Pack in as many buzzwords as possible. Make it hilariously ridiculous.
- No bullet points. One flowing, absurd paragraph.
- Sprinkle in professional emojis (💼 📈 🎯 ✨ 🙌 💡 🔥 📊 ✅ 🚀 💪 🌟 🎖️ 🏆) — but don't overdo it.
- Hashtags: Exactly 3, space-separated, at the end. Make them sound important and corporate.

The goal: Make it so absurdly exaggerated that it's clearly satirical and hilarious.

Respond with a JSON object: "body", "hashtags" (both strings).`;

  try {
    // Generate the post
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 1.2,
    });

    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content);
    const postBody = parsed.body || "";
    const hashtags = parsed.hashtags || "";

    // Define all archetypes
    const allArchetypes = [
      { name: "The Hustle Bro", description: "Always talks about grinding, 5am wake-ups, side hustles, and 'no days off'" },
      { name: "The Thought Leader", description: "Uses phrases like 'let that sink in', 'this', shares 'unpopular opinions'" },
      { name: "The Humble Brag Master", description: "Frames everything as a 'lesson learned' while showing off achievements" },
      { name: "The Corporate Philosopher", description: "Overthinks simple things, uses deep metaphors, talks about 'the journey'" },
      { name: "The Productivity Guru", description: "Obsessed with systems, frameworks, and 'life hacks'" },
      { name: "The Network Builder", description: "Always connecting, 'let's grab coffee', relationship-focused" },
      { name: "The Disruptor", description: "Talks about breaking norms, challenging status quo, being 'different'" },
      { name: "The Gratitude Warrior", description: "Everything is a blessing, 'grateful for', 'thankful for the opportunity'" },
      { name: "The Metrics Obsessed", description: "Everything is data-driven, talks in percentages and KPIs" },
      { name: "The Inspirational Speaker", description: "Motivational quotes, 'you got this', 'believe in yourself'" },
      { name: "The Crypto Bro", description: "Everything relates to crypto, NFTs, Web3, 'to the moon', 'diamond hands', blockchain solutions" },
      { name: "The Name Dropper", description: "Constantly mentions famous people they 'know', 'met once', or 'had coffee with'" },
      { name: "The Wellness Warrior", description: "Everything is about meditation, mindfulness, 'finding balance', 'self-care', 'mental health awareness'" },
      { name: "The Startup Founder", description: "Talks about 'disrupting industries', 'changing the world', 'unicorn potential', 'scaling', 'raising capital'" },
      { name: "The Corporate Jargon Generator", description: "Uses so many buzzwords in one sentence it becomes completely incomprehensible" },
      { name: "The LinkedIn Influencer", description: "Posts multiple times daily, uses clickbait, 'POV:', 'Tell me you're X without telling me', engagement farming" },
      { name: "The Always-Commenter", description: "Always the first to comment on every post, responds within seconds, has something to say about everything, never misses a post" },
    ];

    // Always include "The Always-Commenter" as the first comment, then randomly select 2 more
    const alwaysCommenter = allArchetypes.find(arch => arch.name === "The Always-Commenter");
    const otherArchetypes = allArchetypes.filter(arch => arch.name !== "The Always-Commenter");
    
    // Proper Fisher-Yates shuffle for better randomization
    const shuffleArray = (array) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    const shuffled = shuffleArray(otherArchetypes);
    const selectedArchetypes = [alwaysCommenter, ...shuffled.slice(0, 2)];

    // Generate archetype-based comments
    const archetypeSystemPrompt = `You are an expert at generating satirical, in-character LinkedIn comments. You understand the absurdity of LinkedIn culture and can create comments that perfectly juxtapose with mundane activities. Each comment must be UNIQUE and DIFFERENT every time, even for similar posts.`;

    const archetypeList = selectedArchetypes.map((arch, idx) => 
      `${idx + 1}. "${arch.name}" - ${arch.description}`
    ).join('\n');

    const archetypeUserPrompt = `Original mundane activity: "${activity}"
Generated LinkedIn post: "${postBody}"

You must generate comments for these 3 randomly selected archetypes:
${archetypeList}

CRITICAL: Generate UNIQUE, DIFFERENT comments each time. Even if you've seen similar posts, make these comments fresh and varied.

For each archetype, write a SHORT comment (1-2 sentences max) that is:
- In-character for that archetype
- Satirical and funny
- Juxtaposes with the original mundane activity (the comment should highlight the absurdity)
- Uses appropriate emojis sparingly
- Sounds like a real LinkedIn comment from that archetype
- UNIQUE and different from any previous comments you might have generated

Respond with JSON:
{
  "comments": [
    {
      "archetype": "${selectedArchetypes[0].name}",
      "text": "unique comment text here"
    },
    {
      "archetype": "${selectedArchetypes[1].name}",
      "text": "unique comment text here"
    },
    {
      "archetype": "${selectedArchetypes[2].name}",
      "text": "unique comment text here"
    }
  ]
}`;

    const archetypeCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: archetypeSystemPrompt },
        { role: "user", content: archetypeUserPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 1.1,
    });

    const archetypeContent = archetypeCompletion.choices[0].message.content;
    const archetypeParsed = JSON.parse(archetypeContent);
    const comments = archetypeParsed.comments || [];

    return res.json({
      body: postBody,
      hashtags: hashtags,
      comments: comments,
    });
  } catch (err) {
    console.error("OpenAI error:", err);
    const message = err.message || "Failed to generate post";
    const status = err.status || 500;
    return res.status(status).json({ error: message });
  }
});

app.post("/generate-jobs", async (req, res) => {
  try {
    // Define all job archetypes
    const jobArchetypes = [
      {
        type: "nonexistent",
        name: "Job That Doesn't Actually Exist",
        description: "A job posting that was never real - maybe it's a data collection scheme, a way to build a candidate database, or just posted for 'market research'",
      },
      {
        type: "already-filled",
        name: "Job That Was Filled 3 Months Ago",
        description: "The position was already filled but they never took down the posting - maybe they're keeping it up 'just in case' or forgot to remove it",
      },
      {
        type: "nepotism",
        name: "Job Where the Hiring Manager Hired His Nephew",
        description: "The job was posted for 'compliance' but they already knew who they were hiring - probably a family member or friend",
      },
      {
        type: "senior-entry",
        name: "15 Years Experience for Entry-Level Role",
        description: "They want 15+ years of experience but it's listed as 'entry-level' with entry-level pay - the classic 'entry-level senior position'",
      },
      {
        type: "impossible-tech",
        name: "10 Years Experience in a 2-Year-Old Technology",
        description: "Requires 10+ years of experience in a framework/library that's only existed for 2 years - mathematically impossible",
      },
      {
        type: "mlm-scheme",
        name: "MLM/Pyramid Scheme Disguised as a Job",
        description: "Looks like a real job but it's actually a multi-level marketing scheme - 'be your own boss', 'unlimited earning potential', commission-only",
      },
      {
        type: "unpaid-internship",
        name: "Unpaid Internship Disguised as Full-Time Position",
        description: "Listed as 'full-time' but it's actually an unpaid internship with 'valuable experience' and 'exposure' as compensation",
      },
      {
        type: "buzzword-overload",
        name: "Job with Absurd Buzzword Requirements",
        description: "Requirements are 90% corporate buzzwords with no actual technical skills - 'synergy-driven thought leader', 'paradigm-shifting innovator', etc.",
      },
      {
        type: "exposure-pay",
        name: "Job That Pays in 'Exposure' and 'Experience'",
        description: "Offers 'valuable exposure', 'portfolio building', 'networking opportunities' instead of actual money - 'great for your resume!'",
      },
      {
        type: "24-7-availability",
        name: "Job That Requires 24/7 Availability for 'Work-Life Balance'",
        description: "Claims to value work-life balance but expects you to be available 24/7, respond to emails at 2am, and work weekends",
      },
      {
        type: "remote-but-office",
        name: "Job Listed as 'Remote' But Requires Daily Office Attendance",
        description: "Says 'remote' in the title but then requires you to come to the office every day, or it's 'remote' but only in their timezone with mandatory in-person meetings",
      },
      {
        type: "future-tech",
        name: "Job Requiring 5 Years Experience in Technology That Doesn't Exist Yet",
        description: "Asks for experience in a technology that hasn't been invented yet, or a framework that's still in 'concept phase'",
      },
      {
        type: "data-collection",
        name: "Job That's Actually Just Resume Data Collection",
        description: "The job doesn't exist - they just want your resume, references, and personal info for their database to sell to recruiters",
      },
      {
        type: "rockstar-ninja",
        name: "Job Looking for a 'Rockstar Ninja Unicorn'",
        description: "Uses ridiculous job titles like 'rockstar developer', 'ninja coder', 'unicorn designer' - wants someone who does 10 different jobs for one salary",
      },
      {
        type: "family-atmosphere",
        name: "Job That Promises 'Family Atmosphere' (Red Flag)",
        description: "Says 'we're like a family' which means no boundaries, expected to work unpaid overtime, and guilt trips for taking time off",
      },
      {
        type: "always-there",
        name: "The Job Posting That Is Always There",
        description: "This job posting has been up for 2+ years, never gets filled, never gets removed, just permanently lives on LinkedIn - everyone knows it's fake but it never goes away",
      },
    ];

    // Always include "The Job Posting That Is Always There", then randomly select 2 more
    const alwaysJob = jobArchetypes.find(job => job.name === "The Job Posting That Is Always There");
    const otherJobs = jobArchetypes.filter(job => job.name !== "The Job Posting That Is Always There");
    const shuffled = [...otherJobs].sort(() => Math.random() - 0.5);
    const selectedJobs = [alwaysJob, ...shuffled.slice(0, 2)];

    // Generate job postings using AI
    const jobSystemPrompt = `You are a satirical LinkedIn job posting writer. You create ABSOLUTELY ABSURD job postings that satirize the worst aspects of LinkedIn job listings. Make them hilariously ridiculous while maintaining the structure and format of real LinkedIn job postings. Use maximum corporate buzzwords, impossible requirements, and satirical framing. Output valid JSON only, no markdown code fences.`;

    const jobUserPrompt = `Generate 3 satirical LinkedIn job postings based on these archetypes:

1. "${selectedJobs[0].name}" - ${selectedJobs[0].description}
2. "${selectedJobs[1].name}" - ${selectedJobs[1].description}
3. "${selectedJobs[2].name}" - ${selectedJobs[2].description}

For each job posting, create:
- A job title (make it sound important and corporate, use buzzwords)
- A brief description (2-3 sentences, absurd and satirical)
- Requirements (list 4-6 requirements that are either impossible, absurdly buzzword-heavy, or hilariously mismatched)
- Location: "Remote" or "Hybrid" or a generic city
- Posted time: Random like "3 days ago", "1 week ago", "2 weeks ago"

Make each posting ABSOLUTELY RIDICULOUS and satirical. Pack in corporate jargon, impossible requirements, and make it clear these are satirical takes on bad job postings.

Requirements should be formatted as a bulleted list in the text (use actual bullet points or dashes).

Respond with JSON:
{
  "jobs": [
    {
      "title": "job title here",
      "description": "job description here",
      "requirements": "requirements as formatted text with bullets",
      "location": "Remote",
      "posted": "3 days ago",
      "archetype": "${selectedJobs[0].name}"
    },
    {
      "title": "job title here",
      "description": "job description here",
      "requirements": "requirements as formatted text with bullets",
      "location": "Hybrid",
      "posted": "1 week ago",
      "archetype": "${selectedJobs[1].name}"
    },
    {
      "title": "job title here",
      "description": "job description here",
      "requirements": "requirements as formatted text with bullets",
      "location": "San Francisco, CA",
      "posted": "2 weeks ago",
      "archetype": "${selectedJobs[2].name}"
    }
  ]
}`;

    const jobCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: jobSystemPrompt },
        { role: "user", content: jobUserPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 1.2,
    });

    const jobContent = jobCompletion.choices[0].message.content;
    const jobParsed = JSON.parse(jobContent);
    const jobs = jobParsed.jobs || [];

    return res.json({ jobs });
  } catch (err) {
    console.error("OpenAI error:", err);
    const message = err.message || "Failed to generate jobs";
    const status = err.status || 500;
    return res.status(status).json({ error: message });
  }
});

app.post("/generate-headlines", async (req, res) => {
  try {
    const headlineSystemPrompt = `You are a satirical tech news headline writer specializing in ABSOLUTELY ABSURD, SHORT one-line LinkedIn-style headlines. You create hilariously ridiculous headlines that satirize tech culture, startup culture, CS student culture, and the absurdity of LinkedIn. Make them so over-the-top that they're laugh-out-loud funny. Keep them SHORT - one line, punchy, absurd. Output valid JSON only, no markdown code fences.`;

    const headlineUserPrompt = `Generate 3 ABSOLUTELY ABSURD, SHORT one-line LinkedIn-style headlines that satirize tech culture, startup culture, and CS student culture. 

Include themes like:
1. Random made-up absurd company names laying off people (e.g., "SynergyCloud.ai Lays Off Entire Engineering Team to 'Focus on Core Values'")
2. AI replacing people in ridiculous ways (e.g., "ChatGPT Replaces CEO, Company Stock Soars 300%")
3. Ridiculously young children launching startups (e.g., "3-Year-Old Launches 5th Unicorn Startup, Raises $50M Series A")

These should be SHORT, one-line absurdities in the style of:
- "ChatGPT Applies to Y Combinator and Gets In"
- "Human Engineers Rebranded as 'Legacy Support Infrastructure'"
- "Global Markets Reprice Based on One LinkedIn Post"
- "Federal Reserve Considers Founder Confidence in Next Rate Decision"
- "Reality Enters Beta Following Strong Venture Backing"
- "SynergyCloud.ai Lays Off Entire Engineering Team to 'Focus on Core Values'"
- "3-Year-Old Launches 5th Unicorn Startup, Raises $50M Series A"
- "AI Replaces All Employees, Company Announces 'Record Productivity'"

CRITICAL RULES:
- Keep them SHORT - one line only, punchy (max 15-20 words)
- Be EXTREMELY satirical and absurd - go completely overboard
- Include themes: made-up company layoffs, AI replacing humans, ridiculously young startup founders
- Make up absurd company names (SynergyCloud, ParadigmShift.io, DisruptCo, etc.)
- For child founders: make them impossibly young (toddlers, babies, even fetuses)
- Reference tech/startup/CS culture (Y Combinator, VCs, coding bootcamps, LeetCode, FAANG, etc.)
- Sound like they could be real LinkedIn posts but are completely ridiculous
- Be hilariously funny and over-the-top
- Each should be unique and different

Respond with JSON:
{
  "headlines": [
    "short absurd headline 1 here",
    "short absurd headline 2 here",
    "short absurd headline 3 here"
  ]
}`;

    const headlineCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: headlineSystemPrompt },
        { role: "user", content: headlineUserPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 1.2,
    });

    const headlineContent = headlineCompletion.choices[0].message.content;
    const headlineParsed = JSON.parse(headlineContent);
    const headlines = headlineParsed.headlines || [];

    return res.json({ headlines });
  } catch (err) {
    console.error("OpenAI error:", err);
    const message = err.message || "Failed to generate headlines";
    const status = err.status || 500;
    return res.status(status).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`MakeItUp API running at http://localhost:${PORT}`);
});
