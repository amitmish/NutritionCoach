"use client";

import { useEffect, useState } from "react";
import { Activity, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type SyncStatus = "idle" | "syncing" | "synced" | "error";

export function HealthSyncIndicator() {
    const [status, setStatus] = useState<SyncStatus>("idle");

    useEffect(() => {
        // Simulate sync process on mount
        const startSync = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setStatus("syncing");
            await new Promise((resolve) => setTimeout(resolve, 2500));
            setStatus("synced");
        };

        startSync();
    }, []);

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm">
            <div className="relative flex items-center justify-center w-5 h-5">
                <AnimatePresence mode="wait">
                    {status === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <Activity className="w-4 h-4 text-muted-foreground" />
                        </motion.div>
                    )}
                    {status === "syncing" && (
                        <motion.div
                            key="syncing"
                            initial={{ opacity: 0, rotate: 0 }}
                            animate={{ opacity: 1, rotate: 360 }}
                            exit={{ opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <RefreshCw className="w-4 h-4 text-primary" />
                        </motion.div>
                    )}
                    {status === "synced" && (
                        <motion.div
                            key="synced"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <Check className="w-4 h-4 text-primary" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <span className="text-xs font-medium text-muted-foreground w-24">
                {status === "idle" && "Health Access"}
                {status === "syncing" && "Syncing..."}
                {status === "synced" && "Apple Health"}
            </span>
        </div>
    );
}
