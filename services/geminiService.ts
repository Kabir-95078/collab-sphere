
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { Creator, CollabStrategyResponse, ScriptResponse, ThumbnailConcept } from "../types";

// Initialize Gemini
// NOTE: In a real production app, ensure API_KEY is handled securely via a backend proxy if possible,
// though for this demo we access process.env.API_KEY directly as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCollabStrategy = async (
  userProfile: string,
  targetCreator: Creator
): Promise<CollabStrategyResponse> => {
  const modelId = "gemini-2.5-flash";

  const prompt = `
    I am a content creator with the following profile: "${userProfile}".
    I want to collaborate with another creator named ${targetCreator.name}.
    Their niche is ${targetCreator.niche}, bio is "${targetCreator.bio}", and they create content for ${targetCreator.platform}.

    Please generate a collaboration strategy.
    1. Write a short, professional, yet personalized outreach pitch I can send them (max 50 words).
    2. Suggest 3 specific collaboration video/content ideas.
    3. Estimate a compatibility score (0-100) based on our niches.
    4. Provide a one-sentence reasoning for the score.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pitch: { type: Type.STRING, description: "The outreach message" },
            compatibilityScore: { type: Type.NUMBER, description: "Score from 0 to 100" },
            reasoning: { type: Type.STRING, description: "Reason for the score" },
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  viralPotential: { type: Type.NUMBER, description: "Score 1-100" }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as CollabStrategyResponse;

  } catch (error) {
    console.error("Error generating collab strategy:", error);
    // Fallback in case of error
    return {
      pitch: "Hey! I love your content and think we could make something great together.",
      ideas: [],
      compatibilityScore: 0,
      reasoning: "Could not generate analysis at this time."
    };
  }
};

export const generateVideoScript = async (
  topic: string,
  tone: string,
  duration: string
): Promise<ScriptResponse> => {
  const modelId = "gemini-2.5-flash";
  const prompt = `Write a YouTube video script about "${topic}". Tone: ${tone}. Target Duration: ${duration}.
  Structure the script with a catchy title, a strong hook (first 30s), main content sections, and a call to action.`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING, description: "The intro hook to grab attention" },
            estimatedDuration: { type: Type.STRING },
            callToAction: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING },
                  content: { type: Type.STRING, description: "The spoken script content" },
                  duration: { type: Type.STRING, description: "Approximate duration of this section" }
                }
              }
            }
          }
        }
      }
    });
    
    return JSON.parse(response.text || '{}') as ScriptResponse;
  } catch (error) {
    console.error("Script generation error", error);
    throw error;
  }
};

export const generateThumbnailConcepts = async (
  topic: string,
  vibe: string
): Promise<ThumbnailConcept[]> => {
  const modelId = "gemini-2.5-flash";
  const prompt = `Suggest 3 viral YouTube thumbnail concepts for a video about "${topic}". Vibe: ${vibe}.
  Describe the visuals, text overlay, and why it would get clicks (CTR).`;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              conceptName: { type: Type.STRING },
              visualDescription: { type: Type.STRING, description: "Detailed description of foreground, background, and facial expressions" },
              textOverlay: { type: Type.STRING, description: "Short, punchy text on the image" },
              colorVibe: { type: Type.STRING, description: "Dominant colors" },
              whyItWorks: { type: Type.STRING, description: "Psychology behind the click" }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '[]') as ThumbnailConcept[];
  } catch (error) {
    console.error("Thumbnail generation error", error);
    throw error;
  }
};

// Chatbot functionality
let chatSession: Chat | null = null;

export const getChatResponse = async (message: string): Promise<string> => {
  try {
    if (!chatSession) {
      chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: 'You are CollabBot, a helpful AI assistant for CollabSphere, a platform for content creators. Help users with platform navigation, collaboration advice, negotiation tips, and content strategy. Be concise, friendly, and use emojis occasionally.',
        },
      });
    }

    const response = await chatSession.sendMessage({ message });
    return response.text || "I'm having trouble thinking right now. Try again later!";
  } catch (error) {
    console.error("Chat Error", error);
    return "Sorry, I encountered an error connecting to the server.";
  }
};