import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHealthKit } from "../hooks/useHealthKit";

export default function AnalysisScreen() {
    const { photoUri } = useLocalSearchParams();
    const router = useRouter();
    const { saveFood } = useHealthKit();

    // Mock Analysis Data
    const analysisResult = {
        foodName: "Grilled Chicken Salad",
        calories: 450,
        protein: 42,
        carbs: 35,
        fats: 12,
        feedback: "Great source of lean protein!",
    };

    const handleLogMeal = () => {
        saveFood(
            analysisResult.foodName,
            analysisResult.calories,
            analysisResult.protein,
            analysisResult.carbs,
            analysisResult.fats
        );

        Alert.alert("Success", "Meal logged to Apple Health!", [
            { text: "OK", onPress: () => router.navigate("/(tabs)") }
        ]);
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-6">
            <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-foreground">Analysis Result</Text>
            </View>

            <View className="bg-card rounded-3xl overflow-hidden border border-border mb-6">
                {photoUri ? (
                    <Image source={{ uri: photoUri as string }} className="w-full h-48" resizeMode="cover" />
                ) : (
                    <View className="w-full h-48 bg-secondary items-center justify-center">
                        <Text className="text-muted-foreground">No Image</Text>
                    </View>
                )}

                <View className="p-6">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-2xl font-bold text-foreground">{analysisResult.foodName}</Text>
                        <Text className="text-primary font-bold">{analysisResult.calories} kcal</Text>
                    </View>
                    <Text className="text-muted-foreground mb-4">{analysisResult.feedback}</Text>

                    {/* Macros */}
                    <View className="flex-row gap-2">
                        {[
                            { l: "Protein", v: analysisResult.protein, c: "text-blue-500", b: "bg-blue-500/20" },
                            { l: "Carbs", v: analysisResult.carbs, c: "text-orange-500", b: "bg-orange-500/20" },
                            { l: "Fats", v: analysisResult.fats, c: "text-yellow-500", b: "bg-yellow-500/20" },
                        ].map((m) => (
                            <View key={m.l} className={`flex-1 p-2 rounded-xl items-center ${m.b}`}>
                                <Text className={`font-bold ${m.c}`}>{m.v}g</Text>
                                <Text className="text-[10px] text-muted-foreground uppercase">{m.l}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <TouchableOpacity
                onPress={handleLogMeal}
                className="w-full bg-primary h-14 rounded-full items-center justify-center shadow-lg shadow-primary/20"
            >
                <Text className="text-black font-bold text-lg">Log to Apple Health</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
