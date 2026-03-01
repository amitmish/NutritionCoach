import { View, Text, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHealthKit } from "../../hooks/useHealthKit";
import { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // Included in Expo

export default function Dashboard() {
    const { hasPermissions, data, refresh } = useHealthKit();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refresh(); // Re-fetch HealthKit data
        setRefreshing(false);
    };

    const caloriesLeft = 2200 - (data?.calories || 0);
    const progress = Math.min((data?.calories || 0) / 2200, 1);

    return (
        <SafeAreaView className="flex-1 bg-background p-4">
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
                }
            >
                {/* Header */}
                <View className="flex-row justify-between items-center mb-8">
                    <View>
                        <Text className="text-2xl font-bold text-foreground">Today</Text>
                        <Text className="text-muted-foreground text-sm">Real HealthKit Sync</Text>
                    </View>
                    <View className="bg-secondary/50 px-3 py-1.5 rounded-full flex-row items-center gap-2">
                        <MaterialCommunityIcons
                            name={hasPermissions ? "check-circle" : "alert-circle"}
                            size={16}
                            color={hasPermissions ? "#10b981" : "#a3a3a3"}
                        />
                        <Text className="text-xs font-medium text-muted-foreground">
                            {hasPermissions ? "Health Synced" : "No Access"}
                        </Text>
                    </View>
                </View>

                {/* Main Stats Card */}
                <View className="bg-card rounded-3xl p-6 mb-6 border border-border overflow-hidden relative">
                    <View className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                    <View className="flex-row justify-between items-start mb-6">
                        <View>
                            <Text className="text-sm font-medium text-muted-foreground">Calories Left</Text>
                            <Text className="text-4xl font-bold mt-1 text-foreground">{caloriesLeft}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-xs font-medium text-muted-foreground">Target</Text>
                            <Text className="text-sm font-semibold text-foreground">2,200</Text>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="h-4 bg-secondary rounded-full overflow-hidden mb-2">
                        <View
                            className="h-full bg-primary"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-xs text-muted-foreground">{data?.calories || 0} Eaten</Text>
                        <Text className="text-xs text-muted-foreground">{Math.round(progress * 100)}%</Text>
                    </View>
                </View>

                {/* Macros Grid */}
                <View className="flex-row gap-4 mb-8">
                    {[
                        { label: "Protein", val: `${data?.protein || 0}g`, color: "text-blue-500", bg: "bg-blue-500/20" },
                        { label: "Carbs", val: `${data?.carbs || 0}g`, color: "text-orange-500", bg: "bg-orange-500/20" },
                        { label: "Fats", val: `${data?.fats || 0}g`, color: "text-yellow-500", bg: "bg-yellow-500/20" },
                    ].map((macro) => (
                        <View key={macro.label} className="flex-1 bg-card p-4 rounded-2xl border border-border items-center space-y-2">
                            <Text className={`text-lg font-bold ${macro.color}`}>{macro.val}</Text>
                            <Text className="text-xs font-medium text-muted-foreground">{macro.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Activity Log Placeholder */}
                <View>
                    <Text className="text-lg font-semibold text-foreground mb-4">Recent Activity</Text>
                    <View className="bg-card/50 p-6 rounded-2xl items-center">
                        <Text className="text-muted-foreground text-center">
                            Meals logged here will automatically sync to Apple Health.
                        </Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
