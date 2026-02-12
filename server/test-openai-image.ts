import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function testImage() {
    try {
        console.log("Testing DALL-E 3 generation...");
        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: "A simple red apple on a white background, professional photography",
            n: 1,
            size: "1024x1024",
        });
        console.log("SUCCESS! Image URL:", response.data[0].url);
    } catch (error: any) {
        console.error("ERROR:", error.message);
        if (error.response) {
            console.error("DETAILS:", error.response.data);
        }
    }
}

testImage();
