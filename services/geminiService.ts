import { GoogleGenAI, Chat } from "@google/genai";
import { GEMINI_MODEL } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getApiKey = (): string | undefined => {
  // 1. Try Vite env (VITE_API_KEY) - Check this first!
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }

  // 2. Try process.env (safely)
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env?.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore reference errors
  }

  return undefined;
};

export const initializeGenAI = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      console.error("API_KEY is missing. If running locally, make sure you have a .env file with VITE_API_KEY=your_key");
      throw new Error("API_KEY is missing");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const getChatSession = (): Chat => {
  if (!chatSession) {
    const ai = initializeGenAI();
    chatSession = ai.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: "You are a helpful, witty, and concise AI assistant. You are powered by Google's Gemini 3 Flash model.",
      },
    });
  }
  return chatSession;
};

export const resetChatSession = (): void => {
  chatSession = null;
};
