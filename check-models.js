const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/) || envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim().replace(/^["']|["']$/g, '');
    }
} catch (e) {
    console.error("Could not read .env.local");
}

if (!apiKey) {
    console.error("API Key not found in .env.local");
    process.exit(1);
}

console.log(`Key Length: ${apiKey.length}`);
console.log(`Key Start: ${apiKey.substring(0, 4)}`);
console.log(`Key End: ${apiKey.substring(apiKey.length - 4)}`);
console.log(`Key contains quotes? ${/["']/.test(apiKey)}`);
console.log(`Fetching models...`);

async function checkModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.models) {
            console.log("\n✅ Available GENERATE models:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.error("❌ Failed to list models:", JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Network error:", e);
    }
}

checkModels();
