import { GoogleGenAI } from "@google/genai";
import { AuditResult, GroundingSource } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to parse the raw text response and extract the JSON block.
 * Since we are using Search Grounding, we cannot force JSON mode via config,
 * so we must rely on the model following instructions to output a code block.
 */
const parseAuditResponse = (text: string, url: string, groundingChunks?: any[]): AuditResult => {
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  
  let parsedData: any = {};
  
  if (jsonMatch && jsonMatch[1]) {
    try {
      parsedData = JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini response", e);
      // Fallback structure if JSON parsing fails but we have text
      parsedData = {
        overallScore: 50,
        summary: "We analyzed the store but couldn't generate a structured report. Please check the text summary below.",
        metrics: {
            seo: { name: "SEO", score: 50, status: "average", description: "Analysis unavailable." },
            ux: { name: "UX", score: 50, status: "average", description: "Analysis unavailable." },
            performance: { name: "Performance", score: 50, status: "average", description: "Analysis unavailable." },
            content: { name: "Content", score: 50, status: "average", description: "Analysis unavailable." }
        },
        recommendations: [],
        strengths: [],
        competitors: []
      };
    }
  } else {
     // Hard fallback if no JSON found
     parsedData = {
        overallScore: 0,
        summary: text.slice(0, 500) + "...", // Use the raw text as summary
        metrics: {
            seo: { name: "SEO", score: 0, status: "poor", description: "Could not parse details." },
            ux: { name: "UX", score: 0, status: "poor", description: "Could not parse details." },
            performance: { name: "Performance", score: 0, status: "poor", description: "Could not parse details." },
            content: { name: "Content", score: 0, status: "poor", description: "Could not parse details." }
        },
        recommendations: [],
        strengths: [],
        competitors: []
     };
  }

  // Extract grounding sources
  const sources: GroundingSource[] = [];
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
            sources.push({
                title: chunk.web.title,
                uri: chunk.web.uri
            });
        }
    });
  }

  return {
    ...parsedData,
    url,
    sources
  };
};

export const runStoreAudit = async (url: string): Promise<AuditResult> => {
  const prompt = `
  You are a world-class E-commerce Auditor specializing in Shopify stores. 
  I need you to audit this specific URL: ${url}
  
  Use Google Search to analyze the store's public pages, reviews, social media presence, and any available performance data (like PageSpeed insights mentioned in forums or blogs).
  
  Evaluate the store on 4 key pillars:
  1. SEO (Search Engine Optimization)
  2. UX (User Experience & Design)
  3. Performance (Speed & Trust signals)
  4. Content (Product descriptions, About Us, Clarity)

  After your research, generate a structured JSON object. 
  
  CRITICAL OUTPUT INSTRUCTIONS:
  1. Provide a brief text summary of your findings first.
  2. THEN, strictly output a valid JSON object wrapped in a code block \`\`\`json ... \`\`\`.
  
  The JSON structure must match this schema exactly:
  {
    "overallScore": number (0-100),
    "summary": "A 2-3 sentence executive summary of the store health.",
    "metrics": {
      "seo": { "name": "SEO", "score": number, "status": "good"|"average"|"poor", "description": "Brief reason" },
      "ux": { "name": "UX/UI", "score": number, "status": "good"|"average"|"poor", "description": "Brief reason" },
      "performance": { "name": "Performance", "score": number, "status": "good"|"average"|"poor", "description": "Brief reason" },
      "content": { "name": "Content", "score": number, "status": "good"|"average"|"poor", "description": "Brief reason" }
    },
    "recommendations": [
      { "priority": "High"|"Medium"|"Low", "category": "SEO"|"UX"|"Speed", "issue": "Problem found", "fix": "Actionable advice" }
      // Limit to top 4 recommendations
    ],
    "strengths": ["string", "string", "string"],
    "competitors": ["Competitor 1", "Competitor 2"]
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType cannot be set when using googleSearch
      },
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    return parseAuditResponse(text, url, groundingChunks);
  } catch (error) {
    console.error("Audit failed:", error);
    throw new Error("Unable to complete audit. Please check the URL or try again later.");
  }
};