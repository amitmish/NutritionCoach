"use client";

import { motion } from "framer-motion";
import { Check, ChevronRight, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // In a real app we'd pass the image, here we'll mock it or use a placeholder if state isn't preserved

export default function AnalysisPage() {
    // Mock Data simulating AI Response
    const analysisResult = {
        foodName: "Grilled Chicken Bowl",
        calories: 450,
        confidence: 98,
        macros: {
            protein: 42,
            carbs: 35,
            fats: 12,
        },
        ingredients: ["Chicken Breast", "Brown Rice", "Avocado", "Mixed Greens"],
        feedback: "Excellent high-protein choice! Meets 30% of your daily protein goal.",
        suggestion: "Consider adding more leafy greens for volume without calories."
    };

    return (
        <div className="min-h-screen p-6 pb-32 space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Analysis Result</h1>
                <div className="flex items-center gap-1 text-primary text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                    <Check className="w-3 h-3" />
                    <span>Completed</span>
                </div>
            </header>

            {/* Main Result Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-3xl overflow-hidden border border-border shadow-lg"
            >
                <div className="h-48 bg-zinc-800 relative">
                    {/* Placeholder for the user's image */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <span className="text-sm border border-dashed border-white/20 p-4 rounded-xl">Analyzed Image View</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                        <h2 className="text-2xl font-bold text-white">{analysisResult.foodName}</h2>
                        <p className="text-white/80 text-sm">{analysisResult.calories} kcal</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Macros */}
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { label: "Protein", val: `${analysisResult.macros.protein}g`, color: "bg-blue-500/20 text-blue-500" },
                            { label: "Carbs", val: `${analysisResult.macros.carbs}g`, color: "bg-orange-500/20 text-orange-500" },
                            { label: "Fats", val: `${analysisResult.macros.fats}g`, color: "bg-yellow-500/20 text-yellow-500" },
                        ].map((m) => (
                            <div key={m.label} className={`rounded-2xl p-3 flex flex-col items-center justify-center ${m.color}`}>
                                <span className="text-lg font-bold">{m.val}</span>
                                <span className="text-[10px] uppercase tracking-wider opacity-80">{m.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* AI Feedback */}
                    <div className="space-y-4">
                        <div className="flex gap-3 items-start p-4 bg-secondary/50 rounded-2xl">
                            <div className="p-2 bg-primary/20 rounded-full text-primary shrink-0">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm mb-1">Nutritionist Note</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {analysisResult.feedback}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-start p-4 bg-secondary/50 rounded-2xl">
                            <div className="p-2 bg-blue-500/20 rounded-full text-blue-500 shrink-0">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm mb-1">Suggestion</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {analysisResult.suggestion}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ingredients Detected */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Detected Ingredients</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysisResult.ingredients.map((ing) => (
                                <span key={ing} className="px-3 py-1 rounded-full bg-secondary border border-border text-xs text-foreground">
                                    {ing}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                <Link href="/camera" className="h-12 flex items-center justify-center rounded-xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors">
                    Retake
                </Link>
                <Link href="/" className="h-12 flex items-center justify-center rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                    Log Meal
                </Link>
            </div>
        </div>
    );
}
