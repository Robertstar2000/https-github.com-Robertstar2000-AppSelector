import { GoogleGenerativeAI } from "@google/generative-ai";

let client: GoogleGenerativeAI | null = null;

// Initialize client with environment variable
// Note: In a real production app, you might want to proxy this through a backend
// to hide the key, but for this internal tool demo, we assume the env is available.
const getClient = () => {
  // Use VITE_GEMINI_API_KEY if available in frontend, or fallback to process.env for Node compatibility
  /*
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
  
  if (!client && apiKey) {
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
  */
  return null;
};

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {

  // AI DISABLED
  /*
  const ai = getClient();
  
  if (!ai) {
    return "API Key not configured. Please check your environment settings.";
  }

  try {
    // Corrected model name and usage for the new SDK
    const model = ai.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        systemInstruction: "You are a helpful corporate assistant for Tallman Equipment. You are professional, concise, and helpful. You know about industrial equipment, safety gear, and corporate logistics."
    });
    
    // Map history to the format expected by startChat
    const chatHistory = history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: h.parts
    }));

    const chat = model.startChat({
        history: chatHistory
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI service.";
  }
  */

  return "AI features are currently disabled by administrator.";
};
