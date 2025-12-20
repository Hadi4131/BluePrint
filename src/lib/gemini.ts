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
    // Strip base64 (client side optimization, though server does it too)
    const { htmlPreview, ...conceptForPrompt } = concept;
    console.log("Requesting Code Generation from Server...");

    try {
        const response = await fetch('/api/generate-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ intent, concept: conceptForPrompt })
        });

        if (!response.ok) {
            throw new Error(`Code Gen API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Client Code Gen Error:", error);
        // Fallback
        return {
            "/App.js": `import React from 'react'; export default function App() { return <div className="p-10 text-center font-bold text-red-500">Error generating code. Please try again.</div> }`
        };
    }
}
