import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface ManualEntryModalProps {
    type: 'meal' | 'burn';
    onSave: (calories: number) => void;
    onClose: () => void;
}

export function ManualEntryModal({ type, onSave, onClose }: ManualEntryModalProps) {
    const [amount, setAmount] = useState('');

    const handleSave = () => {
        const parsed = parseInt(amount, 10);
        if (!isNaN(parsed) && parsed > 0) {
            if (type === 'meal') {
                onSave(parsed);
            } else {
                // Burn subtracts calories (or we can pass negative, but let's pass positive and handle it in App)
                onSave(-parsed);
            }
        }
    };

    const isMeal = type === 'meal';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-sm bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="p-6 pb-4">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center mb-4",
                        isMeal ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
                    )}>
                        {isMeal ? <span className="text-2xl">🥗</span> : <span className="text-2xl">🏃</span>}
                    </div>
                    <h2 className="text-xl font-bold">
                        {isMeal ? 'Log Meal manually' : 'Log Burn manually'}
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">
                        {isMeal ? 'How many calories did you consume?' : 'How many calories did you burn?'}
                    </p>
                </div>

                <div className="px-6 pb-6">
                    <div className="relative">
                        <input
                            type="number"
                            inputMode="numeric"
                            autoFocus
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g. 350"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-2xl font-bold text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">kcal</span>
                    </div>
                </div>

                <div className="p-6 pt-0">
                    <button
                        onClick={handleSave}
                        disabled={!amount || isNaN(parseInt(amount, 10)) || parseInt(amount, 10) <= 0}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white transition-all active:scale-95 disabled:opacity-50",
                            isMeal
                                ? "bg-emerald-600 hover:bg-emerald-500 focus:ring-4 ring-emerald-500/30"
                                : "bg-orange-600 hover:bg-orange-500 focus:ring-4 ring-orange-500/30"
                        )}
                    >
                        <Check size={20} />
                        <span>Save Entry</span>
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
