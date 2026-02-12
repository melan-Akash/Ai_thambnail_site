import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

console.log("Checking GEMINI_API_KEY in ai.ts:", process.env.GEMINI_API_KEY ? "EXISTS" : "UNDEFINED");

if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL: GEMINI_API_KEY is missing from process.env!");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "missing_key"
})

export default ai;