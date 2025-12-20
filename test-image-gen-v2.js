const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/) || envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim().replace(/^["']|["']$/g, '') : "";

const genAI = new GoogleGenerativeAI(apiKey);

// Trying the model the user used or the one we know exists
// User used 'gemini-2.5-flash-image' but our list showed 'gemini-2.0-flash-exp'
// Let's try 2.0-flash-exp first with the new config
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
        responseModalities: ["IMAGE"]
    }
});

async function testImageGen() {
    console.log("Attempting to generate IMAGE via Node SDK...");
    const prompt = "A hyper-realistic digital painting of a cyberpunk cat wearing neon goggles";

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;

        console.log("Response received.");
        const candidates = response.candidates;

        if (candidates && candidates[0].content.parts) {
            candidates[0].content.parts.forEach((part, i) => {
                if (part.inlineData) {
                    console.log(`✅ IMAGE FOUND! Mime: ${part.inlineData.mimeType}`);
                    fs.writeFileSync(`test_node_cat_${i}.png`, Buffer.from(part.inlineData.data, 'base64'));
                    console.log(`Saved to test_node_cat_${i}.png`);
                } else {
                    console.log("Part type:", Object.keys(part));
                }
            });
        }
    } catch (e) {
        console.error("Error:", e.message);
        // If 2.0 fails, let's try 2.5 just in case
        if (e.message.includes("not found") || e.message.includes("supported")) {
            console.log("Retrying with gemini-2.5-flash-image...");
            const model2 = genAI.getGenerativeModel({
                model: "gemini-2.5-flash-image",
                generationConfig: { responseModalities: ["IMAGE"] }
            });
            try {
                const res2 = await model2.generateContent(prompt);
                console.log("2.5 Response received.");
                // ... (handling would be same)
            } catch (e2) {
                console.error("2.5 Error:", e2.message);
            }
        }
    }
}

testImageGen();
