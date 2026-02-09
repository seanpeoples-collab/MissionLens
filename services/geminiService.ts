import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

// Helper to clean markdown code blocks from response
const cleanJsonString = (text: string): string => {
  let clean = text.trim();
  // Remove markdown code blocks if present (e.g. ```json ... ```)
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  return clean;
};

// Check key status for debugging
const apiKey = process.env.API_KEY;
const isMissingKey = !apiKey || apiKey === "" || apiKey === "DUMMY_KEY_FOR_BUILD";

// Log status to console for debugging (masked)
if (isMissingKey) {
  console.warn("MissionLens: API Key is missing or invalid in this build.");
} else {
  console.log("MissionLens: API Key detected (starts with " + apiKey.substring(0, 4) + "...)");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "DUMMY_KEY_FOR_BUILD" });

export const analyzeOrganization = async (orgName: string): Promise<AnalysisResult> => {
  if (isMissingKey) {
    throw new Error("Configuration Error: API Key is missing. Please go to Netlify > Deploys > 'Trigger deploy' > 'Deploy project without cache' to ensure the environment variable is applied.");
  }

  const model = "gemini-3-flash-preview";

  const prompt = `
    You are an expert Video Strategy Consultant.
    Audit the *publicly accessible* video presence of: "${orgName}" using Google Search.

    **Output Format**: Return ONLY raw JSON. Do not use Markdown formatting.

    **Structure**:
    {
      "organizationName": "Exact Name",
      "summary": "Executive summary of their video maturity.",
      "estimatedImpactScore": 0-100 integer (0-30=High Opp, 31-60=Avg, 61-100=Strong),
      "metrics": [ {"label": "string", "value": "string", "trend": "up|down|neutral"} ],
      "platforms": [
        {
          "name": "YouTube|LinkedIn|Instagram|TikTok|Website",
          "status": "Strong|Average|Weak|Missing",
          "url": "https://...",
          "contentStrategy": "1 sentence summary",
          "auditSnippet": "5-7 word ruthless verdict",
          "followerCount": "string e.g. 10k",
          "lastActivityDate": "string e.g. 2 days ago"
        }
      ],
      "weaknesses": ["string", "string"],
      "strategy": {
        "emailFramework": {
          "subjectLine": "string",
          "hook": "string",
          "problem": "string",
          "solution": "string",
          "cta": "string"
        },
        "improvementIdeas": ["string", "string", "string"]
      }
    }

    **Task**:
    1. Search for official profiles on YouTube, LinkedIn, Instagram, TikTok, Website.
    2. Assess metrics and content health.
    3. If data is not found, mark status as "Missing".
    4. Focus strategy on "Video Presence" gaps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
        // removed responseMimeType to prevent conflict with search tool
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Gemini returned an empty response. The model might be overloaded.");
    }

    let data;
    try {
      const cleanedText = cleanJsonString(text);
      data = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.log("Raw Text:", text);
      throw new Error("Failed to parse the AI analysis. Please try again.");
    }

    const sources: Array<{ title: string; uri: string }> = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    const defaultEmail = {
      subjectLine: "Question about your video strategy",
      hook: "I noticed some opportunities in your current video messaging.",
      problem: "Inconsistent video can limit reach.",
      solution: "I help nonprofits streamline their message.",
      cta: "Open to a 5-minute chat?"
    };

    return {
      organizationName: data.organizationName || orgName,
      summary: data.summary || "Analysis not available.",
      metrics: Array.isArray(data.metrics) ? data.metrics : [],
      platforms: Array.isArray(data.platforms) ? data.platforms : [],
      weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
      strengths: [],
      opportunities: [],
      strategy: {
        relationshipBuilding: "",
        emailFramework: data.strategy?.emailFramework || defaultEmail,
        improvementIdeas: Array.isArray(data.strategy?.improvementIdeas) ? data.strategy.improvementIdeas : []
      },
      sources: sources,
      estimatedImpactScore: typeof data.estimatedImpactScore === 'number' ? data.estimatedImpactScore : 0
    };
  } catch (error: any) {
    // Enhance error message for the UI
    console.error("Analysis Failed:", error);
    
    // Check for specific Google API errors
    const msg = error.toString();
    if (msg.includes("400") || msg.includes("API key")) {
      throw new Error("Invalid API Key. Please check your Netlify environment variables.");
    }
    if (msg.includes("429")) {
      throw new Error("You are being rate limited by Google. Please wait a minute and try again.");
    }
    
    throw error;
  }
};