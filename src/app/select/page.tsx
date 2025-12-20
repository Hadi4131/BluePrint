'use client';

import { useEffect, useState } from 'react';
import { useBlueprintStore, DesignConcept } from '@/store/useBlueprintStore';
import { useRouter } from 'next/navigation';
import { ConceptCard, ConceptSkeleton } from '@/components/ConceptCard';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SelectPage() {
    const { concepts, setSelectedConcept, isGeneratingConcepts } = useBlueprintStore();
    const router = useRouter();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Redirect if no concepts (and not generating) - e.g. reload on this page
    useEffect(() => {
        if (concepts.length === 0 && !isGeneratingConcepts) {
            router.push('/design');
        }
    }, [concepts, isGeneratingConcepts, router]);

    const handleSelect = (concept: DesignConcept) => {
        setSelectedId(concept.id);
        setSelectedConcept(concept);
    };

    const handleConfirm = () => {
        if (selectedId) {
            router.push('/build');
        }
    };

    return (
        <main className="min-h-screen p-8 bg-background">
            <header className="max-w-6xl mx-auto mb-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold mb-4">Choose Your Style</h1>
                    <p className="text-muted-foreground">
                        Gemini imagined 4 ways to build your idea. Pick your favorite.
                    </p>
                </motion.div>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isGeneratingConcepts && concepts.length === 0 ? (
                    // Loading State
                    [1, 2, 3, 4].map(n => <ConceptSkeleton key={n} />)
                ) : (
                    concepts.map((concept) => (
                        <ConceptCard
                            key={concept.id}
                            concept={concept}
                            selected={selectedId === concept.id}
                            onSelect={() => handleSelect(concept)}
                        />
                    ))
                )}
            </div>

            <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: selectedId ? 1 : 0, y: selectedId ? 0 : 20 }}
                    className="pointer-events-auto"
                >
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedId}
                        className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-2xl flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        Start Building <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </main>
    );
}
