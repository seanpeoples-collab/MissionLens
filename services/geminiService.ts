import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeOrganization = async (orgName: string): Promise<AnalysisResult> => {
  // Switch to Flash for significantly faster inference while maintaining search capabilities
  const model = "gemini-3-flash-preview";

  const prompt = `
    You are an expert Video Strategy Consultant specializing in business development for agencies.
    Your goal is to audit the *publicly accessible* video presence of: "${orgName}" (a nonprofit, public institution, or mission-driven organization) using Google Search.

    **Primary Objective**: Identify if this organization has a **WEAK** video presence that represents a sales opportunity.
    
    **Phase 1: Platform Audit**
    Find the official profiles for these 5 platforms:
    1. **YouTube**
    2. **LinkedIn**
    3. **Instagram**
    4. **TikTok**
    5. **Website**

    For EACH platform:
    - **URL**: The profile link.
    - **Status**: "Strong", "Average", "Weak", "Missing".
    - **Strategy**: 1 sentence summary.
    - **Audit Snippet**: A ruthless, 5-7 word verdict (e.g. "Great visuals but bad audio", "Inconsistent posting schedule").
    - **Last Activity**: e.g. "2 days ago".

    **Phase 2: Key Metrics**
    - Estimate **Subscribers** and **Engagement** from search results.
    - **RULE**: 'value' field must be a CLEAN string (e.g. "15k", "2.5%"). No extra text.

    **Phase 3: The Pitch (Focus on Gaps)**
    Create a cold email framework targeting their biggest video weakness.
    - If they are "Weak", the pitch should be about *establishing* a presence.
    - If they are "Average", the pitch should be about *optimizing* for impact/donations.

    **Output Rules:**
    - JSON format only.
    - "estimatedImpactScore": Rate their CURRENT video maturity 0-100.
      - **0-30**: (HIGH OPPORTUNITY) Dormant, amateur, or missing. 
      - **31-60**: (MODERATE OPPORTUNITY) Inconsistent, low engagement.
      - **61-100**: (LOW OPPORTUNITY) World-class, viral (e.g. TED, Red Bull).
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          organizationName: { type: Type.STRING },
          summary: { type: Type.STRING, description: "Executive summary focusing on their video maturity gaps." },
          metrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING, description: "Max 3 words e.g. 'YouTube Subs'" },
                value: { type: Type.STRING, description: "Clean value ONLY. e.g. '10k', 'Low'." },
                trend: { type: Type.STRING, enum: ["up", "down", "neutral"] }
              }
            }
          },
          platforms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["Strong", "Average", "Weak", "Missing"] },
                followerCount: { type: Type.STRING },
                contentStrategy: { type: Type.STRING },
                auditSnippet: { type: Type.STRING, description: "5-7 word quality verdict" },
                lastActivityDate: { type: Type.STRING },
                url: { type: Type.STRING, nullable: true }
              }
            }
          },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          strategy: {
            type: Type.OBJECT,
            properties: {
              relationshipBuilding: { type: Type.STRING },
              emailFramework: {
                type: Type.OBJECT,
                properties: {
                  subjectLine: { type: Type.STRING },
                  hook: { type: Type.STRING },
                  problem: { type: Type.STRING },
                  solution: { type: Type.STRING },
                  cta: { type: Type.STRING }
                }
              },
              improvementIdeas: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          estimatedImpactScore: { type: Type.INTEGER }
        },
        required: ["organizationName", "summary", "metrics", "platforms", "weaknesses", "strategy", "estimatedImpactScore"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from Gemini");
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Invalid JSON received from API");
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
    strengths: Array.isArray(data.strengths) ? data.strengths : [],
    opportunities: Array.isArray(data.opportunities) ? data.opportunities : [],
    strategy: {
      relationshipBuilding: data.strategy?.relationshipBuilding || "No relationship strategy generated.",
      emailFramework: data.strategy?.emailFramework || defaultEmail,
      improvementIdeas: Array.isArray(data.strategy?.improvementIdeas) ? data.strategy.improvementIdeas : []
    },
    sources: sources,
    estimatedImpactScore: typeof data.estimatedImpactScore === 'number' ? data.estimatedImpactScore : 0
  };
};