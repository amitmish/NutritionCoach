import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

export default function CameraScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null);
    const router = useRouter();

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 justify-center items-center bg-background px-4">
                <Text className="text-foreground text-center mb-4">We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const result = await cameraRef.current.takePictureAsync();
            if (result?.uri) {
                setPhoto(result.uri);
            }
        }
    };

    const handleAnalyze = () => {
        // Navigate to analysis with photo URI (simulated via query param or context)
        router.push({ pathname: "/analysis", params: { photoUri: photo } });
        setPhoto(null);
    };

    if (photo) {
        return (
            <SafeAreaView className="flex-1 bg-black">
                <Image source={{ uri: photo }} className="flex-1 rounded-2xl m-4" />
                <View className="absolute bottom-10 w-full flex-row justify-around px-8">
                    <TouchableOpacity onPress={() => setPhoto(null)} className="p-4 bg-secondary rounded-full">
                        <MaterialCommunityIcons name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAnalyze} className="p-4 bg-primary rounded-full flex-row items-center gap-2 px-8">
                        <Text className="font-bold text-black text-lg">Analyze</Text>
                        <MaterialCommunityIcons name="arrow-right" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <View className="flex-1 bg-black">
            <CameraView
                style={styles.camera}
                facing={'back'}
                ref={cameraRef}
            >
                <SafeAreaView className="flex-1 justify-between p-6">
                    <View className="items-center">
                        <Text className="text-white font-medium drop-shadow-md">Log Meal</Text>
                    </View>

                    <View className="flex-row justify-center items-center mb-10">
                        <TouchableOpacity
                            onPress={takePicture}
                            className="w-20 h-20 rounded-full border-4 border-white items-center justify-center bg-white/20"
                        >
                            <View className="w-16 h-16 rounded-full bg-white" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
});
