import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                console.log("Token:", token); // ✅ Debug token
                setIsLoggedIn(!!token);
            } finally {
                setIsLoading(false);
                console.log("isLoggedIn:", isLoggedIn); // ✅ Debug login state
            }
        };
        checkLogin();
    }, []);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // ✅ Nếu chưa đăng nhập => quay về màn Login
    if (!isLoggedIn) {
        return <Redirect href="/login" />;
    }

    return <>{children}</>;
}
