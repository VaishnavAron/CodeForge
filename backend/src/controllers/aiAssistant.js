const Problem = require("../models/problem");

const getAiHint = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { prompt, userCode, language } = req.body;

    if (!problemId) {
      return res.status(400).json({ message: "Problem ID is required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const refSolution = problem.referenceSolution?.find(
      (s) => s.language.toLowerCase() === (language || "javascript").toLowerCase()
    )?.completeCode || (problem.referenceSolution?.[0]?.completeCode || "None provided");

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(500).json({ message: "Groq API Key is not configured on the server" });
    }

    const systemPrompt = `You are CodeForge AI, an expert algorithmic mentor embedded in a coding sandbox.

CONTEXT:
Problem Title: "${problem.title}"
Difficulty: "${problem.difficulty}"
Problem Statement:
${problem.description}

Reference Verified Solution (${language || "javascript"}):
${refSolution}

Candidate's Current Editor Code (${language || "javascript"}):
${userCode || "// (Candidate has not written code yet)"}

STRICT OPERATIONAL RULES:
1. ANSWER ONLY WHAT WAS ASKED (NO RIGID/COOKIE-CUTTER TEMPLATES):
   - Jump DIRECTLY into answering the candidate's exact query in the very first sentence.
   - DO NOT force a repetitive 3-part template (Intuition, Breakdown, Complexity) on every message.
   - If the user asks to "Analyze my code bugs" or about errors:
     Pinpoint the exact line(s) in their editor code, explain the bug, and how to correct it.
   - If the user asks about "Optimal complexity":
     Directly state **Time: O(...)** and **Space: O(...)** with a 2-sentence justification.
   - If the user asks for a "Conceptual hint":
     Provide 1-2 punchy sentences nudging their intuition without revealing the full solution.
   - If the user asks a specific or comparison question (e.g., "how is this different from reverse linked list"):
     Answer that question directly and accurately.
2. ZERO FILLER & ZERO REPETITIVE BOILERPLATE:
   - Do NOT include generic conversational fluff ("Sure! Here is...", "Hello, I am CodeForge...").
   - Do NOT use markdown tables (they look cramped in sidebars).
   - Never dump unrequested sections. If they asked about complexity, ONLY discuss complexity.
3. CONCISE & READABLE:
   - Keep answers punchy (under 120-180 words).
   - Use bold highlights (**Key Point**, \`code_symbol\`) and clean bullet points for easy skimming.
4. DOMAIN RELEVANCE:
   - Keep answers centered on "${problem.title}", data structures, algorithms, and the candidate's code.`;

    const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

    const candidateModels = [
      groqModel,
      "openai/gpt-oss-20b",
      "qwen/qwen3.6-27b"
    ];

    let aiMessage = null;
    let successfulModel = groqModel;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqApiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: prompt || "Can you analyze my code and give me a hint for the next step?" }
            ],
            temperature: 0.3,
            max_tokens: 650
          })
        });

        const data = await response.json();
        if (data.choices?.[0]?.message?.content) {
          aiMessage = data.choices[0].message.content;
          successfulModel = modelName;
          break;
        } else if (data.error) {
          lastError = data.error.message;
          console.warn(`Model ${modelName} failed, trying fallback:`, data.error.message);
        }
      } catch (reqErr) {
        lastError = reqErr.message;
        console.warn(`Request to ${modelName} errored:`, reqErr.message);
      }
    }

    if (!aiMessage) {
      return res.status(502).json({
        success: false,
        message: `AI Mentor notice: ${lastError || "All Groq model endpoints busy. Please retry in 5s."}`
      });
    }

    return res.status(200).json({
      success: true,
      hint: aiMessage,
      model: successfulModel
    });

  } catch (err) {
    console.error("AI ASSISTANT CONTROLLER ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while contacting AI Mentor"
    });
  }
};

module.exports = { getAiHint };
