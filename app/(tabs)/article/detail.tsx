import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function ArticleDetailScreen() {
    const { url } = useLocalSearchParams<{ url: string }>();

    return (
        <View style={{ flex: 1 }}>
            <WebView
                source={{ uri: decodeURIComponent(url) }}
                startInLoadingState
                renderLoading={() => (
                    <View style={styles.loading}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
});
