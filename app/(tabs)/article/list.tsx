import { IconSymbol } from '@/components/ui/icon-symbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Article {
    _id: string;
    title: string;
    content: string;
    category: string;
    author: string;
    createdAt: string;
}

const categoryNames: { [key: string]: string } = {
    'dinh-duong': 'Dinh Dưỡng',
    'suc-khoe': 'Sức Khỏe',
    'tam-ly': 'Tâm Lý',
    'van-dong': 'Vận Động'
};

export default function ArticleListScreen() {
    const { category } = useLocalSearchParams<{ category: string }>();
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getArticles = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`https://app-nhat-ky-me-bau.onrender.com/api/articles?category=${category}`, {
                    headers:
                    {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,

                    }
                });
                const data = await res.json();
                console.log("Fetching articles for category:", data); // ✅ Debug category
                // if (!res.ok) throw new Error(data.error || "Không thể tải bài viết");
                setArticles(data.article || []);
            } catch (err) {
                console.error(err);
                setArticles([]);
            } finally {
                setIsLoading(false);
            }
        };
        getArticles();
    }, [category]);

    const getCategoryIcon = (cat: string) => {
        const icons: { [key: string]: string } = {
            'dinh-duong': 'fork.knife',
            'suc-khoe': 'heart.fill',
            'tam-ly': 'brain.head.profile',
            'van-dong': 'figure.walk'
        };
        return icons[cat] || 'doc.text';
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.categoryHeader}>
                        <View style={styles.categoryIcon}>
                            <IconSymbol
                                name={getCategoryIcon(category)}
                                size={24}
                                color="#FF6B81"
                            />
                        </View>
                        <View>
                            <Text style={styles.categoryTitle}>
                                {categoryNames[category] || category}
                            </Text>
                            <Text style={styles.articleCount}>
                                {articles.length} bài viết
                            </Text>
                        </View>
                    </View>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Đang tải bài viết...</Text>
                    </View>
                ) : articles.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <IconSymbol name="doc.text" size={48} color="#CCC" />
                        <Text style={styles.emptyText}>Chưa có bài viết nào</Text>
                        <Text style={styles.emptySubtext}>Các bài viết sẽ được cập nhật sớm</Text>
                    </View>
                ) : (
                    <FlatList
                        data={articles}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => router.push(`/article/detail?url=${encodeURIComponent(item.content)}`)}
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <IconSymbol
                                        name="chevron.right"
                                        size={16}
                                        color="#999"
                                    />
                                </View>

                                <View style={styles.cardContent}>
                                    <View style={styles.metaInfo}>
                                        <View style={styles.metaItem}>
                                            <IconSymbol name="person.fill" size={12} color="#666" />
                                            <Text style={styles.metaText}>{item.author}</Text>
                                        </View>
                                        <View style={styles.metaItem}>
                                            <IconSymbol name="calendar" size={12} color="#666" />
                                            <Text style={styles.metaText}>
                                                {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.categoryTag}>
                                        <Text style={styles.categoryTagText}>
                                            {categoryNames[item.category] || item.category}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
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
        marginBottom: 24,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    categoryIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFF9FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFC7CC',
    },
    categoryTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    articleCount: {
        fontSize: 14,
        color: '#666',
    },
    listContent: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#FFF",
        borderRadius: 16,
        padding: 20,
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
        borderLeftColor: '#FFC7CC',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: '#333',
        flex: 1,
        marginRight: 12,
        lineHeight: 22,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    metaInfo: {
        flex: 1,
        gap: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 12,
        color: "#666",
    },
    categoryTag: {
        backgroundColor: '#FFF9FA',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFC7CC',
    },
    categoryTagText: {
        fontSize: 12,
        color: '#FF6B81',
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        color: '#999',
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});