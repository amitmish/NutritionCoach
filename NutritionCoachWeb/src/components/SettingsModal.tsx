import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Activity, Target } from 'lucide-react';
import { cn } from '../lib/utils';
import { type UserProfile, type Gender, type ActivityLevel, type Goal } from '../hooks/useUserProfile';

interface SettingsModalProps {
    currentProfile: UserProfile;
    onSave: (p: UserProfile) => void;
    onClose: () => void;
}

export function SettingsModal({ currentProfile, onSave, onClose }: SettingsModalProps) {
    const [profile, setProfile] = useState<UserProfile>(currentProfile);

    const handleSave = () => {
        onSave(profile);
        onClose();
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

                <div className="p-6 pb-4 border-b border-white/5">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Target className="text-indigo-400" size={20} />
                        Nutrition Coach Setup
                    </h2>
                    <p className="text-neutral-400 text-sm mt-1">
                        Tell us about yourself to let the AI calculate your perfect daily calorie target.
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                    {/* Basic Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Gender</label>
                            <select
                                value={profile.gender}
                                onChange={e => setProfile({ ...profile, gender: e.target.value as Gender })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Age (Years)</label>
                            <input
                                type="number"
                                value={profile.age}
                                onChange={e => setProfile({ ...profile, age: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Weight (kg)</label>
                            <input
                                type="number"
                                value={profile.weight}
                                onChange={e => setProfile({ ...profile, weight: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Height (cm)</label>
                            <input
                                type="number"
                                value={profile.height}
                                onChange={e => setProfile({ ...profile, height: Number(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                    </div>

                    {/* Activity Level */}
                    <div className="space-y-3 pt-2 border-t border-white/5">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Activity size={14} /> Activity Level
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {(['sedentary', 'light', 'moderate', 'active', 'very_active'] as ActivityLevel[]).map(level => (
                                <button
                                    key={level}
                                    onClick={() => setProfile({ ...profile, activityLevel: level })}
                                    className={cn(
                                        "px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all",
                                        profile.activityLevel === level
                                            ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-200"
                                            : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
                                    )}
                                >
                                    {level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Goal */}
                    <div className="space-y-3 pt-2 border-t border-white/5 pb-2">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Target size={14} /> Nutrition Goal
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {([
                                { val: 'lose', label: 'Lose Fat (-500 kcal)' },
                                { val: 'maintain', label: 'Maintain Weight' },
                                { val: 'build', label: 'Build Muscle (+500 kcal)' }
                            ] as Array<{ val: Goal, label: string }>).map(goal => (
                                <button
                                    key={goal.val}
                                    onClick={() => setProfile({ ...profile, goal: goal.val })}
                                    className={cn(
                                        "px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all",
                                        profile.goal === goal.val
                                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200"
                                            : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
                                    )}
                                >
                                    {goal.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-0 mt-4 border-t border-white/5 pt-4">
                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:ring-4 ring-indigo-500/30 transition-all active:scale-95"
                    >
                        <Check size={20} />
                        <span>Save & Recalculate</span>
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
