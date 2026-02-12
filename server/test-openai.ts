import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
    try {
        console.log("Testing with OpenAI API Key...");

        // Testing a simple text generation first to verify key
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello, are you working?" }],
        });

        console.log("Text Response:", response.choices[0].message.content);

        console.log("Testing DALL-E (Image Generation)...");
        // Testing image generation (DALL-E 2 for cheaper test)
        const image = await openai.images.generate({
            model: "dall-e-2",
            prompt: "A simple cat icon",
            n: 1,
            size: "256x256",
        });

        console.log("Image URL:", image.data[0].url);

    } catch (error: any) {
        console.error("Error detected:");
        if (error.status) console.log("Status:", error.status);
        if (error.message) console.log("Message:", error.message);
        if (error.response?.data) console.log("Data:", JSON.stringify(error.response.data));
    }
}

test();
