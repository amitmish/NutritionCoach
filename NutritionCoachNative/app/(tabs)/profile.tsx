import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
    return (
        <SafeAreaView className="flex-1 bg-background p-6">
            <Text className="text-2xl font-bold text-foreground mb-8">Profile</Text>

            <View className="flex-row items-center gap-4 p-4 bg-card rounded-2xl border border-border mb-8">
                <View className="w-16 h-16 rounded-full bg-secondary items-center justify-center">
                    <MaterialCommunityIcons name="account" size={32} color="#a3a3a3" />
                </View>
                <View>
                    <Text className="font-semibold text-lg text-foreground">Amit Finkel</Text>
                    <Text className="text-sm text-muted-foreground">Goal: Maintain Weight</Text>
                </View>
            </View>

            <View className="bg-card rounded-2xl overflow-hidden border border-border">
                {[
                    { icon: "heart-pulse", label: "Health Details" },
                    { icon: "bell-outline", label: "Notifications" },
                    { icon: "cog-outline", label: "Preferences" },
                ].map((item, i) => (
                    <TouchableOpacity key={item.label} className="flex-row items-center justify-between p-4 border-b border-border/50">
                        <View className="flex-row items-center gap-3">
                            <MaterialCommunityIcons name={item.icon as any} size={20} color="#ededed" />
                            <Text className="font-medium text-foreground">{item.label}</Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={20} color="#a3a3a3" />
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}
