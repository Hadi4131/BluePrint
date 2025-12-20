const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// Read .env.local
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/) || envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim().replace(/^["']|["']$/g, '') : "";

const genAI = new GoogleGenerativeAI(apiKey);

// Trying the specific image generation model found in the list
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

async function testGen() {
    console.log("Attempting to generate image with Gemini 2.0 Flash Exp...");
    const prompt = "Generate a high-fidelity web design mockup for a modern coffee shop. Minimalist style, green and beige colors. Return as an image.";

    try {
        // Trying standard generateContent. For Gemini 2.0, images might come as part of the parts
        const result = await model.generateContent(prompt);
        const response = await result.response;

        console.log("Response received.");
        // console.log(JSON.stringify(response, null, 2)); gets too big

        // Check for inline data (images)
        const candidates = response.candidates;
        if (candidates && candidates[0].content.parts) {
            candidates[0].content.parts.forEach((part, i) => {
                if (part.inlineData) {
                    console.log(`Found Image Part at index ${i}! Mime: ${part.inlineData.mimeType}`);
                    fs.writeFileSync(`test_output_${i}.png`, Buffer.from(part.inlineData.data, 'base64'));
                    console.log(`Saved to test_output_${i}.png`);
                } else if (part.text) {
                    console.log(`Text Part: ${part.text.substring(0, 50)}...`);
                }
            });
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

testGen();
