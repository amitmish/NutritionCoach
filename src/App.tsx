import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Flame, ChevronRight, Share2, Menu, Plus, Zap } from 'lucide-react';
import { getCurrentDateFormatted, formatCalories } from './lib/utils';
import { PhotoLogger } from './components/PhotoLogger';
import { ManualEntryModal } from './components/ManualEntryModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { useDailyLog } from './hooks/useDailyLog';
import { useUserProfile } from './hooks/useUserProfile';
// import { collection, onSnapshot } from 'firebase/firestore'; 
// import { db } from './lib/firebase';

export default function App() {
  const { log, addEntry, removeEntry } = useDailyLog();
  const { profile, saveProfile, dailyGoal } = useUserProfile();

  const calories = log?.totalCalories || 0;

  const [showLogger, setShowLogger] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [manualEntryType, setManualEntryType] = useState<'meal' | 'burn' | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const progressPercent = Math.min((calories / dailyGoal) * 100, 100);

  const handleAddCalories = async (cals: number, items: string[] = []) => {
    await addEntry({
      name: items.length > 0 ? items.join(', ') : 'AI Scanned Meal',
      calories: cals,
      type: 'meal',
    });
    setShowLogger(false);
  };

  const handleManualSave = async (cals: number) => {
    const isBurn = manualEntryType === 'burn' || cals < 0;
    const absCals = Math.abs(cals);

    await addEntry({
      name: isBurn ? 'Manual Active Burn' : 'Manual Meal Entry',
      calories: isBurn ? -absCals : absCals,
      type: isBurn ? 'burn' : 'meal',
    });
    setManualEntryType(null);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Nutrition Coach',
          text: `Check out my daily progress! I'm at ${calories}/${dailyGoal} kcal today!`,
          url: window.location.href,
        });
      } else {
        alert('Sharing is not supported on this device.');
      }
    } catch (e) {
      console.log('Share error', e);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30">

      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="px-6 pt-10 pb-6 flex items-center justify-between sticky top-0 z-20 w-full max-w-xl mx-auto backdrop-blur-xl bg-neutral-950/50 border-b border-white/5"
      >
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-0.5">Dashboard</h1>
          <p className="text-sm font-medium text-neutral-400">{getCurrentDateFormatted()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all outline-none border border-white/5 text-neutral-300"
          >
            <Activity className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all outline-none border border-white/5 text-neutral-300"
          >
            <Share2 className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all outline-none border border-white/5 text-neutral-300"
          >
            <Menu className="w-[18px] h-[18px]" />
          </button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-xl mx-auto px-6 py-6 pb-40 space-y-6 z-10">

        {/* Main Calorie Ring Card */}
        <motion.section
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="relative bg-neutral-900/60 rounded-[32px] p-8 border border-white/5 shadow-2xl overflow-hidden backdrop-blur-md"
        >
          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

          <div className="absolute top-0 right-0 p-8 opacity-[0.04]">
            <Activity className="w-32 h-32 text-indigo-100" />
          </div>

          <div className="flex items-center justify-between mb-8 z-10 relative">
            <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Zap size={16} className="text-indigo-400" />
              Energy Consumed
            </h2>
            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-300 tracking-wide">
              {progressPercent < 100 ? 'ON TRACK' : 'GOAL MET'}
            </div>
          </div>

          <div className="flex items-end justify-between relative z-10">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <AnimatePresence>
                  <motion.span
                    key={calories}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 via-white to-neutral-400"
                  >
                    {formatCalories(calories)}
                  </motion.span>
                </AnimatePresence>
                <span className="text-xl font-bold text-neutral-600">/ {formatCalories(dailyGoal)}</span>
              </div>
              <span className="text-sm font-medium text-neutral-500 mt-2">
                <span className="text-neutral-300 font-semibold">{formatCalories(Math.max(0, dailyGoal - calories))}</span> kcal remaining
              </span>
            </div>

            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/10 mix-blend-screen"
            >
              <Flame className="w-8 h-8 text-indigo-300" />
            </motion.div>
          </div>

          {/* Progress Bar Container */}
          <div className="mt-10 relative w-full h-4 bg-neutral-950/50 rounded-full overflow-hidden border border-white/5 p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              className="h-full rounded-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-400" />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
            </motion.div>
          </div>
        </motion.section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-2 gap-4">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(38, 38, 38, 0.8)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setManualEntryType('meal')}
            className="group flex flex-col items-center justify-center p-6 bg-neutral-900/50 border border-white/5 rounded-3xl backdrop-blur-sm transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors border border-emerald-500/10">
              <span className="text-2xl drop-shadow-md">🥗</span>
            </div>
            <span className="font-semibold text-neutral-200 tracking-wide text-sm">Log Meal</span>
          </motion.button>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(38, 38, 38, 0.8)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setManualEntryType('burn')}
            className="group flex flex-col items-center justify-center p-6 bg-neutral-900/50 border border-white/5 rounded-3xl backdrop-blur-sm transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors border border-orange-500/10">
              <span className="text-2xl drop-shadow-md">🏃</span>
            </div>
            <span className="font-semibold text-neutral-200 tracking-wide text-sm">Log Burn</span>
          </motion.button>
        </section>

      </main>

      {/* Floating Action Button */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.6 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 flex justify-center pointer-events-none z-50"
      >
        <button
          onClick={() => setShowLogger(true)}
          className="pointer-events-auto flex items-center justify-center gap-3 bg-white text-black hover:bg-neutral-200 rounded-full px-8 py-4 font-bold shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] active:scale-95 transition-all outline-none"
        >
          <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center">
            <Plus size={16} strokeWidth={3} />
          </div>
          <span className="text-[15px] tracking-wide">AI Photo Log</span>
          <ChevronRight size={18} className="text-neutral-500" strokeWidth={3} />
        </button>
      </motion.div>

      {/* AI Photo Modal */}
      <AnimatePresence>
        {showLogger && (
          <PhotoLogger
            onAddCalories={handleAddCalories}
            onClose={() => setShowLogger(false)}
          />
        )}
      </AnimatePresence>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {manualEntryType && (
          <ManualEntryModal
            type={manualEntryType}
            onSave={handleManualSave}
            onClose={() => setManualEntryType(null)}
          />
        )}
      </AnimatePresence>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentLog={log}
        onDeleteEntry={removeEntry}
      />

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal
            currentProfile={profile}
            onSave={saveProfile}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
