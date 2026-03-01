import { useEffect, useState } from "react";
import { Platform } from "react-native";

export function useHealthKit() {
    const [hasPermissions, setHasPermissions] = useState(false);
    const [data, setData] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
    });

    useEffect(() => {
        // Mock permission grant
        setTimeout(() => {
            setHasPermissions(true);
            fetchData();
        }, 500);
    }, []);

    const fetchData = () => {
        if (!hasPermissions) return;

        // Mock data fetch
        setTimeout(() => {
            setData({
                calories: 1250,
                protein: 85,
                carbs: 120,
                fats: 45,
            });
        }, 500);
    };

    const saveFood = (name: string, calories: number, protein: number, carbs: number, fats: number) => {
        // Mock save implementation
        console.log(`[Mock Apple Health] Saved: ${name} (${calories} cals)`);

        setData(prev => ({
            calories: prev.calories + calories,
            protein: prev.protein + protein,
            carbs: prev.carbs + carbs,
            fats: prev.fats + fats,
        }));
    };

    return { hasPermissions, data, saveFood, refresh: fetchData };
}
