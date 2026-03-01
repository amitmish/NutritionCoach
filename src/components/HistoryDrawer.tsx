import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Flame, Utensils, Trash2 } from 'lucide-react';
import { type DailyLog, type LogEntry } from '../hooks/useDailyLog';

interface HistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentLog: DailyLog;
    onDeleteEntry: (entry: LogEntry) => void;
}

export function HistoryDrawer({ isOpen, onClose, currentLog, onDeleteEntry }: HistoryDrawerProps) {
    // Temporary: In a real app we would fetch the last 7 days from Firebase
    // For now, we'll just show today's detailed log.
    const entries = currentLog.entries || [];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-neutral-900 border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Clock className="text-indigo-400" size={20} />
                                Activity Log
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content: Today's Entries */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">Today</h3>

                            {entries.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 text-neutral-500 gap-2">
                                    <Utensils size={24} className="opacity-50" />
                                    <p className="text-sm">No meals logged yet today.</p>
                                </div>
                            ) : (
                                <ul className="space-y-4">
                                    {entries.map((entry) => (
                                        <li key={entry.id} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${entry.type === 'meal' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                                {entry.type === 'meal' ? <Utensils size={18} /> : <Flame size={18} />}
                                            </div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-neutral-200 font-medium">{entry.name}</span>
                                                <span className="text-xs text-neutral-500">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className={`font-bold ${entry.type === 'meal' ? 'text-emerald-300' : 'text-orange-300'}`}>
                                                    {entry.type === 'meal' ? '+' : '-'}{Math.abs(entry.calories)}
                                                </div>
                                                <button
                                                    onClick={() => onDeleteEntry(entry)}
                                                    className="text-neutral-500 hover:text-red-400 p-1.5 -mr-1.5 rounded-lg hover:bg-red-400/10 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
