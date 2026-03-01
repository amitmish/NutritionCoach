"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function CameraPage() {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleAnalyze = () => {
        // Simulate processing delay then navigate
        router.push("/analysis");
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white relative">
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            <AnimatePresence mode="wait">
                {!imagePreview ? (
                    <motion.div
                        key="camera-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
                    >
                        {/* Simulated Viewfinder */}
                        <div className="absolute inset-0 bg-zinc-900">
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="text-zinc-500 text-sm">Camera Stream Simulated</p>
                            </div>
                        </div>

                        {/* Guide Overlay */}
                        <div className="absolute inset-8 border-2 border-white/20 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
                            <div className="w-full flex justify-between">
                                <div className="w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                                <div className="w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                            </div>
                            <div className="w-full flex justify-between">
                                <div className="w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                                <div className="w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-lg" />
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-32 w-full flex items-center justify-center gap-8 z-20">
                            <button
                                onClick={triggerFileInput}
                                className="p-4 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
                                aria-label="Upload from Gallery"
                            >
                                <Upload className="w-6 h-6" />
                            </button>

                            <button
                                onClick={triggerFileInput}
                                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm transition-transform active:scale-95"
                                aria-label="Capture Photo"
                            >
                                <div className="w-16 h-16 rounded-full bg-white" />
                            </button>

                            <div className="w-14" /> {/* Spacer for balance */}
                        </div>

                        <div className="absolute top-6 w-full text-center z-20">
                            <h2 className="text-lg font-medium drop-shadow-md">Log Meal</h2>
                            <p className="text-xs text-white/70 drop-shadow-md">Snap a photo for AI analysis</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col relative bg-black"
                    >
                        <div className="relative flex-1 rounded-b-3xl overflow-hidden">
                            <Image
                                src={imagePreview}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />

                            <button
                                onClick={() => setImagePreview(null)}
                                className="absolute top-6 left-6 p-2 rounded-full bg-black/50 text-white backdrop-blur-md"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="h-48 flex flex-col items-center justify-center p-6 space-y-4">
                            <div className="text-center">
                                <h3 className="text-xl font-bold">Looks delicious!</h3>
                                <p className="text-muted-foreground text-sm">Ready to analyze this meal?</p>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                className="w-full max-w-xs h-14 bg-primary text-black font-bold rounded-full flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                            >
                                <span>Analyze Nutrition</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
