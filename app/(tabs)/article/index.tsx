import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
    {
        id: "dinh-duong",
        name: "Dinh dưỡng",
        icon: "nutrition" as const,
        description: "Chế độ ăn uống lành mạnh cho mẹ và bé"
    },
    {
        id: "suc-khoe",
        name: "Sức khỏe",
        icon: "heart.fill" as const,
        description: "Theo dõi sức khỏe thai kỳ"
    },
    {
        id: "tam-ly",
        name: "Tâm lý",
        icon: "brain.head.profile" as const,
        description: "Chăm sóc sức khỏe tinh thần"
    },
    {
        id: "van-dong",
        name: "Vận động",
        icon: "figure.walk" as const,
        description: "Bài tập thể dục an toàn"
    },
];

export default function ArticleCategoryScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.content}>
                <Text style={styles.header}>📚 Danh mục bài viết</Text>
                <Text style={styles.subtitle}>Kiến thức hữu ích cho hành trình mang thai</Text>

                <View style={styles.list}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.card}
                            onPress={() => router.push(`/article/list?category=${cat.id}`)}
                        >
                            <View style={styles.cardContent}>
                                <View style={styles.iconContainer}>
                                    <IconSymbol
                                        name={cat.icon}
                                        size={24}
                                        color="#FF6B81"
                                    />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.cardTitle}>{cat.name}</Text>
                                    <Text style={styles.cardDescription}>{cat.description}</Text>
                                </View>
                                <View style={styles.arrowContainer}>
                                    <IconSymbol
                                        name="chevron.right"
                                        size={20}
                                        color="#999"
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 32,
    },
    list: {
        flex: 1,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 4,
        borderLeftColor: "#FFC7CC",
    },
    cardContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#FFF9FA",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        borderWidth: 1,
        borderColor: "#FFC7CC",
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: "#666",
        lineHeight: 18,
    },
    arrowContainer: {
        marginLeft: 8,
    },
});