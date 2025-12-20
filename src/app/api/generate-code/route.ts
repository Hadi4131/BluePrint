import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

const MODEL_NAME = "gemini-3-pro-preview";
export const geminiModel = genAI.getGenerativeModel({ model: MODEL_NAME });

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { intent, concept } = body;

        // Strip base64 if it still exists (defensive)
        const { htmlPreview, ...conceptForPrompt } = concept;

        const prompt = `
        You are an AI Code Generator.
        
        Project Intent: "${intent}"
        Selected Concept: ${JSON.stringify(conceptForPrompt)}
        
        Generate a complete, running React application using Tailwind CSS.
        The output must be a standard React project structure that works in CodeSandbox/Sandpack.
        
        Required Files:
        - /App.js (Main entry point, export default function App)
        - /styles.css (Tailwind directives are assumed, but specific custom styles can go here)
        - /components/Navbar.js
        - /components/Hero.js
        - /components/Feature.js
        - /components/Footer.js
        
        Rules:
        - Use "export default function" for components.
        - Use "lucide-react" for icons. KEY RULE: You MUST import every icon you use. Example: 'import { Menu, Leaf, ArrowRight } from "lucide-react";'
        - Use standard Tailwind utility classes for ALL styling based on the Concept's color palette and theme.
        - Make it LOOK PREMIUM and MAGICAL. Use deep gradients, glassmorphism, or clean whitespace.
        - Ensure it is responsive (mobile-first).
        - IMPORTANT: Do NOT use placeholder images like "via.placeholder.com". Use real, high-quality images from Unsplash.
          - Example: <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80" />
          - Pick varied images relevant to the "${intent}".
        - The layout must start with a Hero section that takes at least 80vh.
        
        Return the result as a JSON object where keys are file paths (e.g., "/App.js") and values are the code content (strings).
        Do NOT use markdown. Just raw JSON.
        `;

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const codeFiles = JSON.parse(jsonStr);

        return NextResponse.json(codeFiles);

    } catch (error: any) {
        console.error("Gemini Code Gen Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
