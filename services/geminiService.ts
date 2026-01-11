
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiSuggestion } from "../types";

// Helper to strip markdown code blocks if present
function parseSafeJson(text: string) {
  const jsonMatch = text.match(/```json\s?([\s\S]*?)\s?```/) || text.match(/```\s?([\s\S]*?)\s?```/);
  const cleanText = jsonMatch ? jsonMatch[1] : text;
  return JSON.parse(cleanText.trim());
}

export async function getSmartLabelSuggestions(userInput: string): Promise<GeminiSuggestion[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User wants to create a label for: "${userInput}". 
      Format this input into 3 logical label designs. 
      Return the output as a JSON array of objects with keys: formattedText, explanation, type.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              formattedText: { type: Type.STRING },
              explanation: { type: Type.STRING },
              type: { type: Type.STRING }
            },
            required: ["formattedText", "explanation", "type"]
          }
        }
      }
    });

    // Access .text property directly and handle potential undefined value
    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Empty response from Gemini API");
    }
    return parseSafeJson(textOutput);
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [{
      formattedText: userInput,
      explanation: "Original input (AI check failed)",
      type: "general"
    }];
  }
}
