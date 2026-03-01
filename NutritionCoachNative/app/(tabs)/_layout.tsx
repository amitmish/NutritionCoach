import { Tabs } from "expo-router";
import { Home, Camera, User } from "lucide-react-native";
import { View } from "react-native";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#171717",
                    borderTopWidth: 0,
                    elevation: 0,
                    height: 60,
                    paddingBottom: 10,
                },
                tabBarActiveTintColor: "#10b981",
                tabBarInactiveTintColor: "#a3a3a3",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="camera"
                options={{
                    title: "Scan",
                    tabBarIcon: ({ color }) => <Camera color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tabs>
    );
}
