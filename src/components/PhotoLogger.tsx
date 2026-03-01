import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Check, Loader2, Sparkles, AlertCircle, Upload } from 'lucide-react';
import { analyzeMealImage, type AIAnalysisResult } from '../lib/gemini';
import { cn } from '../lib/utils';

interface PhotoLoggerProps {
    onAddCalories: (cals: number, items: string[]) => void;
    onClose?: () => void;
}

export function PhotoLogger({ onAddCalories, onClose }: PhotoLoggerProps) {
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AIAnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Helper to resize and convert image to a smaller JPEG base64, or fallback to original data URL
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string;
                const img = new Image();
                img.onload = () => {
                    const MAX_SIZE = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height = Math.round((height * MAX_SIZE) / width);
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width = Math.round((width * MAX_SIZE) / height);
                            height = MAX_SIZE;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        console.warn("Failed to get canvas context, falling back to original image");
                        return resolve(dataUrl);
                    }

                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL("image/jpeg", 0.8));
                };
                img.onerror = () => {
                    console.warn("Browser cannot decode image for compression, falling back to original");
                    resolve(dataUrl);
                };
                img.src = dataUrl;
            };
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsDataURL(file);
        });
    };

    const handleCaptureClick = () => {
        cameraInputRef.current?.click();
    };

    const handleUploadClick = () => {
        galleryInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            // Compress and preview the image
            const compressedProxyDataUrl = await compressImage(file);
            setImageUri(compressedProxyDataUrl);

            // Analysis
            const match = compressedProxyDataUrl.match(/^data:(.*?);base64,(.*)$/);
            if (!match) throw new Error("Invalid image data");
            const mimeType = match[1] || "image/jpeg";
            const base64Data = match[2];

            const res = await analyzeMealImage(base64Data, mimeType);
            setResult(res);
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to analyze image.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSave = () => {
        if (result) {
            onAddCalories(result.totalCalories, result.items.map(i => i.name));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
                >
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="p-6 pb-2">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="text-indigo-400" size={20} />
                        AI Vision Logger
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">Snap a photo and let AI track the calories.</p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

                    {/* Image Preview / Capture Trigger */}
                    <div
                        onClick={undefined}
                        className={cn(
                            "relative w-full aspect-square rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all",
                            !imageUri ? "border-white/20 p-6" : "border-white/10 bg-black",
                            isAnalyzing && "pointer-events-none opacity-80"
                        )}
                    >
                        {imageUri ? (
                            <img src={imageUri} alt="Meal" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-4 w-full">
                                <button
                                    onClick={handleCaptureClick}
                                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 font-medium transition-colors"
                                >
                                    <Camera size={20} />
                                    Take Photo
                                </button>
                                <button
                                    onClick={handleUploadClick}
                                    className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 font-medium transition-colors"
                                >
                                    <Upload size={20} />
                                    Upload from Gallery
                                </button>
                            </div>
                        )}

                        <AnimatePresence>
                            {isAnalyzing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm flex flex-col shadow-inner items-center justify-center gap-3"
                                >
                                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                                    <span className="text-sm font-medium text-indigo-200 animate-pulse">Analyzing Meal...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Hidden Inputs */}
                    <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        ref={cameraInputRef}
                        onChange={handleFileChange}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={galleryInputRef}
                        onChange={handleFileChange}
                    />

                    {/* Errors */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}

                    {/* AI Results */}
                    <AnimatePresence>
                        {result && !isAnalyzing && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-4"
                            >
                                <div className="px-5 py-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                                        <span className="text-sm font-semibold text-neutral-300">Identified Items</span>
                                        <span className="font-bold text-indigo-300">~{result.totalCalories} kcal</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {result.items.map((item, idx) => (
                                            <li key={idx} className="flex justify-between text-sm">
                                                <span className="text-neutral-200">{item.name}</span>
                                                <span className="text-neutral-500">{item.calories}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                                    <p className="text-sm text-indigo-200 italic">" {result.recommendation} "</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-2 grid grid-cols-2 gap-3 border-t border-white/5 bg-neutral-900/80 backdrop-blur-xl">
                    <button
                        onClick={() => {
                            setImageUri(null);
                            setResult(null);
                            setError(null);
                        }}
                        disabled={isAnalyzing}
                        className="py-3.5 rounded-xl font-semibold text-neutral-400 bg-white/5 hover:bg-white/10 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                    >
                        {imageUri ? 'Discard' : 'Cancel'}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={!result || isAnalyzing}
                        className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:ring-4 ring-indigo-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:bg-indigo-600/50"
                    >
                        <Check size={18} />
                        <span>Save Meal</span>
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
