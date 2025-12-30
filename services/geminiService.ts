import { GoogleGenAI, Chat } from "@google/genai";
import { GEMINI_MODEL } from "../constants";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

export const initializeGenAI = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
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
