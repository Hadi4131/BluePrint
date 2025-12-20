import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { exec } from "child_process";
import util from "util";
import path from "path";

const execAsync = util.promisify(exec);

// Initialize Gemini (Node) for the Text Part
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");
// Use 2.0 Flash Exp for analysis too, as it's better
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { intent, sketchData, metadata } = body;

        // 1. Generate Concepts (Text/JSON) using Node SDK
        const promptString = `
        You are an AI Design Engine.
        User Intent: "${intent}"
        
        Provided is a user's rough sketch.
        Generate 4 distinct, high-fidelity design concepts.
        Analyze the sketch layout heavily.
        
        Output JSON Array with keys: id, name, theme, description, colorPalette.
        
        Rules:
        - "htmlPreview" is NOT needed here. We will generate it separately.
        - "description" should be visual and descriptive for an Image Generator prompt.
        `;

        const imagePart = {
            inlineData: {
                data: sketchData.split(",")[1],
                mimeType: "image/png",
            },
        };

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: promptString }, imagePart] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
        const response = await result.response;
        const text = response.text();
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const concepts = JSON.parse(jsonStr);

        // 2. Generate Images for each concept via Python Bridge
        const enhancedConcepts = await Promise.all(concepts.map(async (concept: any) => {
            const imagePrompt = `A high quality website design screenshot for: ${concept.name}. ${concept.theme} style. ${concept.description}. User intent: ${intent}.`;

            try {
                // Call Python script
                // Adjust path potentially if deployed, but for local cwd is project root usually
                const scriptPath = path.join(process.cwd(), "src", "scripts", "generate_images.py");
                // Escape quotes in prompt
                const cleanPrompt = imagePrompt.replace(/"/g, '\\"');

                const pythonCommand = process.platform === "win32" ? "python" : "python3";
                const { stdout, stderr } = await execAsync(`${pythonCommand} "${scriptPath}" "${cleanPrompt}"`, { maxBuffer: 50 * 1024 * 1024 });

                if (stderr) console.error("Python Stderr:", stderr);

                const images = JSON.parse(stdout);

                if (images && images.length > 0 && !images.error) {
                    // Success!
                    // Use the first image
                    const b64 = images[0];
                    return {
                        ...concept,
                        htmlPreview: `<div class="w-full h-full relative"><img src="data:image/png;base64,${b64}" class="w-full h-full object-cover" alt="${concept.name}" /></div>`
                    };
                } else {
                    console.error("Python Image Gen Failed:", images);
                    return {
                        ...concept,
                        htmlPreview: `<div class='p-8 text-center text-gray-500 bg-gray-100 flex items-center justify-center h-full'><span>Image Generation Failed</span></div>`
                    };
                }

            } catch (e) {
                console.error("Image Gen Error for concept", concept.name, e);
                return {
                    ...concept,
                    htmlPreview: `<div class='p-8 text-center text-gray-500 bg-gray-100 flex items-center justify-center h-full'><span>Preview Unavailable</span></div>`
                };
            }
        }));

        return NextResponse.json(enhancedConcepts);

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
