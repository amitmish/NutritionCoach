"use client";

import { HealthSyncIndicator } from "@/components/HealthSyncIndicator";
import { Plus, Flame, Utensils, Footprints } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Today</h1>
          <p className="text-muted-foreground text-sm">Wed, Feb 18</p>
        </div>
        <HealthSyncIndicator />
      </header>

      {/* Main Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-card rounded-3xl p-6 border border-border shadow-lg overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-sm font-medium text-muted-foreground">Calories Left</span>
            <div className="text-4xl font-bold mt-1 text-foreground">840</div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-muted-foreground">Target</span>
            <div className="text-sm font-semibold">2,200</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-4 bg-secondary rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: "62%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1,360 Eaten</span>
          <span>62%</span>
        </div>
      </motion.div>

      {/* Macros Grid */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Protein", current: 90, total: 140, color: "bg-blue-500" },
          { label: "Carbs", current: 120, total: 200, color: "bg-orange-500" },
          { label: "Fats", current: 45, total: 70, color: "bg-yellow-500" },
        ].map((macro, i) => (
          <motion.div
            key={macro.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-4 rounded-2xl border border-border flex flex-col items-center justify-center text-center space-y-2"
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-secondary" />
                <motion.circle
                  cx="24" cy="24" r="20"
                  stroke="currentColor" strokeWidth="4"
                  fill="transparent"
                  className={macro.color.replace("bg-", "text-")}
                  strokeDasharray={126}
                  strokeDashoffset={126 - (126 * macro.current) / macro.total}
                  initial={{ strokeDashoffset: 126 }}
                  animate={{ strokeDashoffset: 126 - (126 * macro.current) / macro.total }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
              </svg>
              <span className="absolute text-[10px] font-bold">{macro.current}g</span>
            </div>
            <span className="text-xs font-medium text-muted-foreground">{macro.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Log Button */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's Meals</h2>
          <Link href="/camera" className="text-xs font-medium text-primary hover:underline">Log Meal</Link>
        </div>

        <div className="space-y-3">
          {[
            { name: "Oatmeal & Berries", cals: 350, time: "8:30 AM", icon: Utensils },
            { name: "Grilled Chicken Salad", cals: 420, time: "1:15 PM", icon: Utensils },
            { name: "Afternoon Walk", cals: -120, time: "5:00 PM", icon: Footprints, text: "text-green-500" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (i * 0.1) }}
              className="flex items-center justify-between p-4 bg-card/50 border border-border/50 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-xl">
                  <item.icon className="w-4 h-4 text-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
              <span className={`font-semibold text-sm ${item.text || 'text-muted-foreground'}`}>
                {item.cals > 0 ? `${item.cals} kcal` : `${item.cals} kcal`}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Action Button (Alternative to Tab Bar for main action) */}
      <div className="fixed bottom-24 right-6 z-40">
        <Link href="/camera">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 bg-primary text-black rounded-full flex items-center justify-center shadow-lg shadow-primary/25"
          >
            <Plus className="w-8 h-8" />
          </motion.button>
        </Link>
      </div>
    </div>
  );
}
