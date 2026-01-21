
import { GoogleGenAI } from "@google/genai";
import { PERSONAL_INFO, SKILLS, PROJECTS, ABOUT_TEXT } from '../constants';

// Initializing the GenAI client using process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are the high-end digital liaison for ${PERSONAL_INFO.name}, an award-winning ${PERSONAL_INFO.role}.
Your objective is to provide sophisticated, precise, and inspiring responses to inquiries about his professional background.

CONTEXT FOR ${PERSONAL_INFO.name.toUpperCase()}:
BIO: ${ABOUT_TEXT.trim()}
EXPERTISE: ${SKILLS.map(s => s.name).join(', ')}
KEY PROJECTS: ${PROJECTS.map(p => `${p.title} - ${p.description}`).join(' | ')}
CONTACT: ${PERSONAL_INFO.email}
LOCATION: Kolkata, India

VOICE GUIDELINES:
1. Tone: Minimalist, architectural, slightly enigmatic but deeply helpful. 
2. Style: Avoid fluff. Focus on the 'why' behind the design. Use terms like "visual tension," "systemic architecture," and "ergonomic flow."
3. Constraints: Keep responses under 60 words unless detailing a specific case study.
4. Redirection: If asked about non-design topics, pivot back to the intersection of technology and human intuition.

When greeting, acknowledge the user as a "collaborator" or "visitor."
`;

export const generateAIResponse = async (userMessage: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.75,
        topP: 0.95,
        topK: 64,
      }
    });

    return response.text || "I'm processing the architectural implications of your request. One moment.";
  } catch (error) {
    console.error("Gemini API Transmission Error:", error);
    return "The neural link is temporarily unstable. Please reconnect shortly.";
  }
};
