import { View, Text } from "react-native";

export default function Home() {
    return (
        <View className="flex-1 items-center justify-center bg-background">
            <Text className="text-primary text-xl font-bold">Nutrition Coach Native</Text>
            <Text className="text-muted-foreground">NativeWind configured successfully.</Text>
        </View>
    );
}
