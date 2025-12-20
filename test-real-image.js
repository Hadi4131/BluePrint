const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/) || envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = match ? match[1].trim().replace(/^["']|["']$/g, '') : "";

const genAI = new GoogleGenerativeAI(apiKey);

// Targeting the specific image generation capability
// Based on list: models/gemini-2.0-flash-exp
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

async function testImageGen() {
    console.log("Attempting to generate REAL image...");
    const prompt = "Draw a red apple in the style of an oil painting.";

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;

        console.log("Response received.");
        const candidates = response.candidates;

        if (candidates && candidates[0].content.parts) {
            let foundImage = false;
            candidates[0].content.parts.forEach((part, i) => {
                if (part.inlineData) {
                    console.log(`✅ IMAGE FOUND! Mime: ${part.inlineData.mimeType}`);
                    fs.writeFileSync(`test_real_output.png`, Buffer.from(part.inlineData.data, 'base64'));
                    foundImage = true;
                } else if (part.executableCode) {
                    console.log("Code execution part found (not image).");
                } else if (part.text) {
                    console.log(`Text: ${part.text.substring(0, 100)}...`);
                }
            });

            if (!foundImage) {
                console.log("❌ No inlineData image found in parts.");
            }
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testImageGen();
