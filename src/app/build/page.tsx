'use client';

import { useEffect } from 'react';
import { useBlueprintStore } from '@/store/useBlueprintStore';
import { generateProjectCode } from '@/lib/gemini';
import { Sandpack } from "@codesandbox/sandpack-react";
import { Copy, Check, Loader2, Play } from 'lucide-react';

export default function BuildPage() {
    const {
        projectIntent,
        selectedConcept,
        generatedCode,
        setGeneratedCode,
        isBuilding,
        setIsBuilding
    } = useBlueprintStore();

    useEffect(() => {
        let mounted = true;

        const build = async () => {
            if (!selectedConcept || !projectIntent) return;
            if (Object.keys(generatedCode).length > 0) return; // Already built

            setIsBuilding(true);
            try {
                const code = await generateProjectCode(projectIntent, selectedConcept);
                if (mounted) setGeneratedCode(code);
            } catch (error) {
                console.error(error);
            } finally {
                if (mounted) setIsBuilding(false);
            }
        };

        build();

        return () => { mounted = false; };
    }, [projectIntent, selectedConcept, generatedCode, setGeneratedCode, setIsBuilding]);

    // Custom setup for Sandpack
    const files = {
        ...generatedCode,
        // Ensure index.js or entry is correct if not provided by generic prompt
        // usually Sandpack expects /App.js as default entry for react template
    };

    return (
        <main className="h-screen w-full flex flex-col bg-background">
            <header className="h-16 border-b border-border flex items-center px-6 justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Blueprint</span>
                    <span className="px-2 py-0.5 rounded bg-secondary text-xs text-muted-foreground">Preview</span>
                </div>
                <div className="flex items-center gap-4">
                    {isBuilding ? (
                        <div className="flex items-center gap-2 text-sm text-blue-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Generating Application...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-green-500">
                            <Check className="w-4 h-4" />
                            <span className="text-sm font-medium">Build Complete</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-hidden relative">
                {isBuilding ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <h2 className="text-xl font-bold">Constructing your idea...</h2>
                        <p className="text-muted-foreground">Writing React components, styling with Tailwind...</p>
                    </div>
                ) : null}

                <div className="h-full w-full">
                    {Object.keys(generatedCode).length > 0 && (
                        <Sandpack
                            template="react"
                            theme="dark"
                            files={files}
                            options={{
                                showNavigator: true,
                                showTabs: true,
                                externalResources: ["https://cdn.tailwindcss.com"],
                                resizablePanels: true,
                                editorWidthPercentage: 30,
                                classes: {
                                    "sp-wrapper": "h-full",
                                    "sp-layout": "h-full",
                                    "sp-stack": "h-full",
                                }
                            }}
                            customSetup={{
                                dependencies: {
                                    "lucide-react": "latest",
                                    "clsx": "latest",
                                    "tailwind-merge": "latest"
                                }
                            }}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}
