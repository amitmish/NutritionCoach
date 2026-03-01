import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type Goal = 'lose' | 'maintain' | 'build';

export interface UserProfile {
    age: number;
    gender: Gender;
    weight: number; // in kg
    height: number; // in cm
    activityLevel: ActivityLevel;
    goal: Goal;
}

const DEFAULT_PROFILE: UserProfile = {
    age: 30,
    gender: 'male',
    weight: 70,
    height: 175,
    activityLevel: 'moderate',
    goal: 'maintain',
};

// Activity Multipliers
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
};

// Goal Modifiers (kcal)
const GOAL_MODIFIERS: Record<Goal, number> = {
    lose: -500,
    maintain: 0,
    build: 500,
};

export function calculateTDEE(profile: UserProfile): number {
    // Mifflin-St Jeor Equation
    let bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age);
    if (profile.gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    const tdee = bmr * ACTIVITY_MULTIPLIERS[profile.activityLevel];
    const dailyGoal = tdee + GOAL_MODIFIERS[profile.goal];

    // Ensure we don't return dangerously low calorie targets
    return Math.max(Math.round(dailyGoal), 1200);
}

export function useUserProfile(userId: string = 'default_user') {
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const docRef = doc(db, 'user_profiles', userId);

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setProfile(docSnap.data() as UserProfile);
            } else {
                // Initialize if it doesn't exist
                setDoc(docRef, DEFAULT_PROFILE, { merge: true });
                setProfile(DEFAULT_PROFILE);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const saveProfile = async (newProfile: UserProfile) => {
        const docRef = doc(db, 'user_profiles', userId);
        try {
            await setDoc(docRef, newProfile, { merge: true });
        } catch (error) {
            console.error("Error saving profile to Firestore:", error);
        }
    };

    const dailyGoal = calculateTDEE(profile);

    return { profile, loading, saveProfile, dailyGoal };
}
