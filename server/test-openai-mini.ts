import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
    try {
        console.log("Testing GPT-4o-mini...");
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: "Hi" }],
        });
        console.log("SUCCESS:", response.choices[0].message.content);
    } catch (error: any) {
        console.log("ERROR_MESSAGE:", error.message);
    }
}

test();
