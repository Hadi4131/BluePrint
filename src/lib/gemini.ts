import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");

// We use version 3 as listed in available models (gemini-3-pro-preview)
const MODEL_NAME = "gemini-3-pro-preview";

export const geminiModel = genAI.getGenerativeModel({ model: MODEL_NAME });

function sanitizeConcept(c: any): any {
    return {
        id: c.id || Math.random().toString(),
        name: typeof c.name === 'string' ? c.name : "Generated Concept",
        theme: typeof c.theme === 'string' ? c.theme : (c.theme?.primary || JSON.stringify(c.theme) || "Modern"),
        description: typeof c.description === 'string' ? c.description : "No description available.",
        colorPalette: Array.isArray(c.colorPalette) ? c.colorPalette : (c.colorPalette ? Object.values(c.colorPalette) : []),
        typography: typeof c.typography === 'string' ? c.typography : (c.typography?.primary || JSON.stringify(c.typography) || "Sans-serif"),
        layoutAnalysis: typeof c.layoutAnalysis === 'string' ? c.layoutAnalysis : "Layout analyzed.",
        htmlPreview: typeof c.htmlPreview === 'string' ? c.htmlPreview : "<div class='p-4 text-red-500'>Preview Unavailable</div>"
    };
}

export async function generateDesignConcepts(intent: string, sketchData: string, metadata: any) {
    try {
        const response = await fetch('/api/concepts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intent, sketchData, metadata })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return Array.isArray(data) ? data.map(sanitizeConcept) : [];

    } catch (error) {
        console.error("Client Generation Error:", error);
        throw error;
    }
}

export async function generateProjectCode(intent: string, concept: any) {
    // Strip base64
    const { htmlPreview, ...conceptForPrompt } = concept;
    console.log("Generating Code. Concept size:", JSON.stringify(conceptForPrompt).length);
    console.log("Concept keys:", Object.keys(conceptForPrompt));

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

    try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gemini Code Gen Error:", error);
        // Return a fallback mock if it fails for demo purposes so the app doesn't crash
        return {
            "/App.js": `import React from 'react'; export default function App() { return <div className="p-10 text-center font-bold text-red-500">Error generating code. Please try again.</div> }`
        };
    }
}
