import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
    try {
        console.log("Testing with OpenAI API Key...");

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello" }],
        });

        console.log("SUCCESS: Text Response:", response.choices[0].message.content);
    } catch (error: any) {
        console.log("FAILED: Details below:");
        console.log("Message:", error.message);
        if (error.response) {
            console.log("Status:", error.status);
            console.log("Body:", JSON.stringify(error.body, null, 2));
        }
    }
}

test();
