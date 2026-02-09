
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are a world-class AI Image Forensic Analyst. 
  Your task is to analyze the provided image and determine if it is a real human-captured photograph or an AI-generated image (GAN, Diffusion, etc.).
  
  Look for:
  1. Biological errors: Distorted ears, extra fingers, teeth irregularities, mismatched earrings.
  2. Background anomalies: Nonsensical text, blurred objects that should be sharp, structural inconsistencies in architecture.
  3. Lighting/Physics: Shadows going in different directions, unnatural reflections in eyes or water, lack of lens flare where expected.
  4. Textures: "Too smooth" skin (airbrushed look), repetitive hair patterns, or strange digital artifacts.

  You MUST return a JSON object.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType,
            data: base64Image.split(',')[1],
          },
        },
        {
          text: "Analyze this image for authenticity. Provide a detailed forensic report in JSON format.",
        },
      ],
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: {
            type: Type.STRING,
            description: "Must be 'Real', 'AI-Generated', or 'Inconclusive'",
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence percentage (0-100)",
          },
          reasoning: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Specific observations leading to the verdict",
          },
          technicalAnalysis: {
            type: Type.STRING,
            description: "A summary of the technical findings",
          },
          metadata: {
            type: Type.OBJECT,
            properties: {
              artifactsDetected: { type: Type.ARRAY, items: { type: Type.STRING } },
              lightingConsistency: { type: Type.STRING },
              textureQuality: { type: Type.STRING },
            },
            required: ["artifactsDetected", "lightingConsistency", "textureQuality"]
          }
        },
        required: ["verdict", "confidence", "reasoning", "technicalAnalysis", "metadata"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI model");
  }

  try {
    return JSON.parse(response.text.trim()) as AnalysisResult;
  } catch (err) {
    console.error("Failed to parse AI response:", response.text);
    throw new Error("Invalid response format from analysis engine");
  }
};
