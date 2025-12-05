import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

// Initialize client with environment variable
// Note: In a real production app, you might want to proxy this through a backend
// to hide the key, but for this internal tool demo, we assume the env is available.
const getClient = () => {
  if (!client && process.env.API_KEY) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  const ai = getClient();
  
  if (!ai) {
    return "API Key not configured. Please check your environment settings.";
  }

  try {
    const model = 'gemini-2.5-flash';
    
    // Construct the prompt with history if needed, or use chat mode
    // For simplicity in this demo, we'll use a single generateContent for the "quick answer"
    // or a chat session if we were persisting the object.
    // Let's use the chat capability for better context.
    
    const chat = ai.chats.create({
        model: model,
        config: {
            systemInstruction: "You are a helpful corporate assistant for Tallman Equipment. You are professional, concise, and helpful. You know about industrial equipment, safety gear, and corporate logistics."
        },
        history: history
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I couldn't generate a response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
};
