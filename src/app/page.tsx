'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useBlueprintStore } from '@/store/useBlueprintStore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { projectIntent, setProjectIntent } = useBlueprintStore();
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectIntent.trim()) {
      router.push('/design');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background overflow-hidden relative selection:bg-primary/20">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium mb-6 border border-border/50 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>AI-Powered Web Builder</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Describe it. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Build it.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Turn your text ideas into production-ready websites in seconds.
            Describe what you want, sketch more logic, and let AI do the rest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative group">
          <div
            className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur transition duration-500 group-hover:opacity-40 ${isFocused ? 'opacity-60 blur-md' : ''
              }`}
          />
          <div className="relative bg-card rounded-xl shadow-2xl border border-border overflow-hidden">
            <input
              type="text"
              value={projectIntent}
              onChange={(e) => setProjectIntent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="A modern portfolio for a photographer..."
              className="w-full bg-transparent p-6 pr-20 text-xl md:text-2xl outline-none placeholder:text-muted-foreground/30 font-medium"
              autoFocus
            />
            <button
              type="submit"
              disabled={!projectIntent.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-0 disabled:scale-90"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </form>

        <div className="mt-8 flex justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">✨ Instant Layouts</span>
          <span className="flex items-center gap-1">•</span>
          <span className="flex items-center gap-1">🎨 Custom Design System</span>
          <span className="flex items-center gap-1">•</span>
          <span className="flex items-center gap-1">🚀 Clean Code</span>
        </div>
      </motion.div>
    </main>
  );
}
