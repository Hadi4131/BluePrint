const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
let apiKey = '';

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/NEXT_PUBLIC_GEMINI_API_KEY=(.*)/) || envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match) {
        apiKey = match[1].trim().replace(/^["']|["']$/g, '');
    }
} catch (e) { }

async function checkModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        let output = "MODELS:\n";
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes('generateContent')) {
                    output += m.name + "\n";
                }
            });
        } else {
            output += JSON.stringify(data);
        }

        fs.writeFileSync('models_list.txt', output);
        console.log("Done.");
    } catch (e) {
        console.error(e);
    }
}

checkModels();
