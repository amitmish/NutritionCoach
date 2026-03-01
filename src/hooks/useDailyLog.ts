import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface LogEntry {
    id: string;
    name: string;
    calories: number;
    type: 'meal' | 'burn';
    timestamp: number;
}

export interface DailyLog {
    date: string;
    totalCalories: number;
    entries: LogEntry[];
}

export function useDailyLog(dateStr: string = new Date().toISOString().split('T')[0]) {
    const [log, setLog] = useState<DailyLog>({
        date: dateStr,
        totalCalories: 0,
        entries: []
    });

    useEffect(() => {
        const docRef = doc(db, 'daily_logs', dateStr);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as DailyLog;
                if (data.entries) {
                    data.entries.sort((a, b) => b.timestamp - a.timestamp);
                } else {
                    data.entries = [];
                }
                setLog(data);
            } else {
                setLog({
                    date: dateStr,
                    totalCalories: 0,
                    entries: []
                });
            }
        });

        return () => unsubscribe();
    }, [dateStr]);

    const addEntry = async (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
        const newEntry: LogEntry = {
            ...entry,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now()
        };

        const docRef = doc(db, 'daily_logs', dateStr);

        try {
            // Ensure the document exists before we update it, merge: true prevents overwriting
            await setDoc(docRef, {
                date: dateStr,
            }, { merge: true });

            // Atomically increment the totalCalories and push to the array
            await updateDoc(docRef, {
                totalCalories: increment(entry.calories),
                entries: arrayUnion(newEntry)
            });
        } catch (error) {
            console.error("Error writing to Firestore:", error);
        }
    };

    const removeEntry = async (entry: LogEntry) => {
        const docRef = doc(db, 'daily_logs', dateStr);
        try {
            // Optimistically update UI could go here, but onSnapshot will handle it fast enough

            // Use arrayRemove to pull the exact object out of the array
            // Note: arrayRemove only works if the object exactly matches.
            // Since we know the exact entry object from the UI, this works perfectly.
            await updateDoc(docRef, {
                totalCalories: increment(-entry.calories),
                entries: arrayRemove(entry)
            });
        } catch (error) {
            console.error("Error removing from Firestore:", error);
        }
    };

    return { log, addEntry, removeEntry };
}
