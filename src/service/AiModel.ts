import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
    GenerationConfig,
    GenerativeModel,
    ChatSession as ChatSessionType,
  } from "@google/generative-ai";
  
  // Retrieve the API key from the environment variables
  const apiKey: string | undefined = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  
  // Initialize the GoogleGenerativeAI instance
  const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(apiKey);
  
  // Get the specific generative model
  const model: GenerativeModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  // Define the configuration for the generation
  const generationConfig: GenerationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  // Start a new chat session with the configured model
  export const chatSession: ChatSessionType = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [],
  });
