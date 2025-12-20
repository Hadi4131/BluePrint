'use client';

import React, { useRef, useState } from 'react';
import { ReactSketchCanvasRef } from 'react-sketch-canvas';
import { CanvasLayer } from '@/components/CanvasLayer';
import { useBlueprintStore } from '@/store/useBlueprintStore';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Undo } from 'lucide-react';
import { generateDesignConcepts } from '@/lib/gemini';

// pure paint implementation
export default function DesignPage() {
    const router = useRouter();
    const { projectIntent, setSketchData, setConcepts, setIsGeneratingConcepts, isGeneratingConcepts } = useBlueprintStore();
    const canvasRef = useRef<ReactSketchCanvasRef>(null);
    const [color, setColor] = useState("#000000");
    const [strokeWidth, setStrokeWidth] = useState(4);

    const handleGenerate = async () => {
        try {
            setIsGeneratingConcepts(true);
            const image = await canvasRef.current?.exportImage('png');
            const metadata = { intent: projectIntent, mode: "paint" }; // No stencils
            setSketchData(image || '', metadata);

            const concepts = await generateDesignConcepts(projectIntent, image || '', metadata);
            setConcepts(concepts);
            router.push('/select');
        } catch (e) {
            console.error(e);
            alert("Failed to generate concepts.");
        } finally {
            setIsGeneratingConcepts(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden relative selection:bg-none">

            {/* Floating Top Toolbar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-black/5 z-50">
                <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
                    <button onClick={() => { setColor("#000000"); }} className={`w-6 h-6 rounded-full bg-black ${color === "#000000" ? 'ring-2 ring-offset-2 ring-black' : ''}`} />
                    <button onClick={() => { setColor("#2563eb"); }} className={`w-6 h-6 rounded-full bg-blue-600 ${color === "#2563eb" ? 'ring-2 ring-offset-2 ring-blue-600' : ''}`} />
                    <button onClick={() => { setColor("#dc2626"); }} className={`w-6 h-6 rounded-full bg-red-600 ${color === "#dc2626" ? 'ring-2 ring-offset-2 ring-red-600' : ''}`} />
                </div>

                <div className="flex items-center gap-1">
                    <button onClick={() => canvasRef.current?.undo()} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><Undo size={20} /></button>
                    <button onClick={() => canvasRef.current?.clearCanvas()} className="p-2 hover:bg-red-50 text-red-500 rounded-full"><Trash2 size={20} /></button>
                </div>
            </div>

            {/* Canvas */}
            <div className="absolute inset-0 z-0">
                <CanvasLayer
                    canvasRef={canvasRef}
                    onExport={() => { }}
                    className="cursor-crosshair w-full h-full"
                    strokeColor={color}
                    strokeWidth={strokeWidth}
                />
            </div>

            {/* Bottom Intent + Action */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50 flex flex-col gap-4">
                <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-lg text-xs text-center border shadow-sm">
                    Drawing for: <span className="font-bold">{projectIntent}</span>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGeneratingConcepts}
                    className="w-full h-14 bg-black text-white rounded-2xl font-bold text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isGeneratingConcepts ? <Loader2 className="animate-spin" /> : <Paintbrush className="w-5 h-5" />}
                    {isGeneratingConcepts ? "Dreaming..." : "Generate Styles"}
                </button>
            </div>
        </div>
    );
}

// Helper icons
import { Paintbrush } from 'lucide-react';
