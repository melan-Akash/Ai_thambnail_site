import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY as string
});

async function test() {
    try {
        console.log("Testing with API Key:", process.env.GEMINI_API_KEY?.substring(0, 10) + "...");
        const model = "gemini-3-pro-image-preview";
        console.log("Using model:", model);

        const response = await ai.models.generateContent({
            model: model,
            contents: ["Hello, are you working?"],
        });

        console.log("Response:", JSON.stringify(response, null, 2));
    } catch (error: any) {
        console.error("Error detected:");
        console.error(error);
        if (error.status) console.log("Status:", error.status);
        if (error.message) console.log("Message:", error.message);
    }
}

test();
