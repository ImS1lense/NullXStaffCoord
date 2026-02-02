
import { GoogleGenAI, Type } from "@google/genai";
import { FormData } from "../types";

export const analyzeApplication = async (data: FormData) => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this Minecraft server trainee application. 
  Nickname: ${data.nickname}
  About: ${data.about}
  Experience: ${data.timeOnProject}
  Previous Mod Exp: ${data.previousModExp}
  Duties understanding: ${data.duties}
  
  Provide a professional evaluation including a rating (1-10), key suggestions to improve the application, and a general feedback summary.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.NUMBER },
            suggestions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            feedback: { type: Type.STRING }
          },
          required: ["rating", "suggestions", "feedback"]
        }
      }
    });

    // Access .text property directly (not a method)
    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return null;
  }
};
