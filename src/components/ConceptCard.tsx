'use client';

import { DesignConcept } from "@/store/useBlueprintStore";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface ConceptCardProps {
    concept: DesignConcept;
    selected: boolean;
    onSelect: () => void;
}

export function ConceptCard({ concept, selected, onSelect }: ConceptCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={`cursor-pointer group relative overflow-hidden rounded-2xl border-2 transition-all h-[400px] flex flex-col ${selected
                ? 'border-blue-500 ring-4 ring-blue-500/20 shadow-2xl'
                : 'border-transparent hover:border-gray-200 shadow-lg'
                }`}
        >
            {/* Header / Meta */}
            <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-start z-10 relative">
                <div>
                    <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase mb-1 block">
                        {concept.theme}
                    </span>
                    <h3 className="font-bold text-gray-900 leading-tight">{concept.name}</h3>
                </div>
                {selected && (
                    <div className="bg-blue-600 text-white p-1 rounded-full">
                        <Check size={14} />
                    </div>
                )}
            </div>

            {/* Visual Preview Window */}
            <div className="flex-1 bg-gray-50 relative w-full overflow-hidden">
                {/* We use a transformative container to scale down the 'desktop' preview to fit card */}
                {/* 1024px width scaled down to card width approx 300px -> scale 0.3 */}
                <div className="origin-top-left transform scale-[0.35] w-[285%] h-[285%] pointer-events-none select-none absolute top-0 left-0 bg-white">
                    <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: concept.htmlPreview }}
                    />
                </div>

                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors ${selected ? 'bg-blue-500/10' : ''}`} />
            </div>

            {/* Footer Palette */}
            <div className="bg-white p-3 border-t border-gray-100 flex gap-2 z-10 relative">
                {(concept.colorPalette || []).slice(0, 5).map((color, i) => (
                    <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
                        style={{ backgroundColor: color }}
                    />
                ))}
            </div>

        </motion.div>
    );
}

export function ConceptSkeleton() {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-xl h-[400px] animate-pulse flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-50">
                <div className="w-20 h-3 bg-gray-200 rounded mb-2" />
                <div className="w-32 h-5 bg-gray-200 rounded" />
            </div>
            <div className="flex-1 bg-gray-100 relative">
                <div className="absolute inset-x-8 top-12 bottom-12 bg-gray-200/50 rounded-lg" />
            </div>
        </div>
    );
}
