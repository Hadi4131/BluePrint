import { create } from 'zustand';

export type DesignConcept = {
  id: string;
  name: string;
  theme: string;
  description: string;
  colorPalette: string[];
  typography: string;
  layoutAnalysis: string;
  htmlPreview: string; // [NEW] HTML for the card
};

interface BlueprintState {
  // Step 1: Idea
  projectIntent: string;
  setProjectIntent: (intent: string) => void;

  // Step 2: Sketch
  sketchImage: string | null; // Base64
  layoutMetadata: any;
  setSketchData: (image: string, metadata: any) => void;

  // Step 3: Concepts
  isGeneratingConcepts: boolean;
  concepts: DesignConcept[];
  setConcepts: (concepts: DesignConcept[]) => void;
  setIsGeneratingConcepts: (loading: boolean) => void;

  // Step 4: Selection
  selectedConcept: DesignConcept | null;
  setSelectedConcept: (concept: DesignConcept) => void;

  // Step 5: Build
  isBuilding: boolean;
  generatedCode: Record<string, string>; // Filename -> Content
  setGeneratedCode: (code: Record<string, string>) => void;
  setIsBuilding: (loading: boolean) => void;

  // Navigation
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useBlueprintStore = create<BlueprintState>((set) => ({
  projectIntent: '',
  setProjectIntent: (intent) => set({ projectIntent: intent }),

  sketchImage: null,
  layoutMetadata: null,
  setSketchData: (image, metadata) => set({ sketchImage: image, layoutMetadata: metadata }),

  isGeneratingConcepts: false,
  concepts: [],
  setConcepts: (concepts) => set({ concepts }),
  setIsGeneratingConcepts: (loading) => set({ isGeneratingConcepts: loading }),

  selectedConcept: null,
  setSelectedConcept: (concept) => set({ selectedConcept: concept }),

  isBuilding: false,
  generatedCode: {},
  setGeneratedCode: (code) => set({ generatedCode: code }),
  setIsBuilding: (loading) => set({ isBuilding: loading }),

  currentStep: 1,
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
  reset: () => set({
    projectIntent: '',
    sketchImage: null,
    layoutMetadata: null,
    concepts: [],
    selectedConcept: null,
    generatedCode: {},
    currentStep: 1,
  }),
}));
