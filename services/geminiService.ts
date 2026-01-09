
import { GoogleGenAI, Type } from "@google/genai";
import { OptimizationResult } from "../types";

export async function optimizeResume(resumeText: string, jobDescription: string): Promise<OptimizationResult> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    You are a professional executive resume writer and career coach. 
    Analyze the provided RESUME against the TARGET JOB DESCRIPTION.
    
    TASK:
    1. Calculate a "Match Score" (0-100) for the current resume.
    2. Rewrite key sections of the resume to better highlight relevant skills, achievements, and keywords from the job description.
    3. Ensure the tone is professional, achievement-oriented (use STAR method), and ATS-friendly.
    4. Provide a new "Optimized Match Score" (0-100).
    5. List 5-8 priority keywords you added.
    6. Provide the ENTIRE REVISED RESUME as a single cohesive string, formatted perfectly for professional presentation.
    
    INPUT:
    RESUME:
    ${resumeText}
    
    JOB DESCRIPTION:
    ${jobDescription}
    
    RESPONSE FORMAT:
    You MUST return JSON according to the following schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            initialScore: { type: Type.NUMBER, description: "Matching score of original resume (0-100)" },
            optimizedScore: { type: Type.NUMBER, description: "Expected matching score after optimization (0-100)" },
            analysis: { type: Type.STRING, description: "A paragraph summary of the gaps found and improvements made." },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  original: { type: Type.STRING, description: "Original content of this section" },
                  optimized: { type: Type.STRING, description: "Revised content of this section" },
                  changes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific improvement types applied" }
                },
                required: ["title", "original", "optimized", "changes"]
              }
            },
            suggestedKeywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key terms from JD that were missing" },
            fullOptimizedResume: { type: Type.STRING, description: "The full, complete text of the revised resume, formatted for a job application." }
          },
          required: ["initialScore", "optimizedScore", "analysis", "sections", "suggestedKeywords", "fullOptimizedResume"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");
    
    return JSON.parse(resultText) as OptimizationResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
