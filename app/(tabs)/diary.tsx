import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Diary {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
}

export default function DiaryScreen() {
    const [diaries, setDiaries] = useState<Diary[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");

    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                const response = await fetch("https://app-nhat-ky-me-bau.onrender.com/api/diaries", {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
                    },
                });
                const data = await response.json();
                console.log("Fetched diaries:", data.diary);
                setDiaries(data.diary || []);
            } catch (error) {
                console.error("Error fetching diaries:", error);
            }
        };
        fetchDiaries();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await fetch(`https://app-nhat-ky-me-bau.onrender.com/api/diaries/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
                },
            });
            console.log("Deleted diary with id:", id);
            setDiaries(diaries.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Error deleting diary:", error);
        }
    };

    const handleEdit = (item: Diary) => {
        setEditingId(item._id);
        setEditTitle(item.title);
        setEditContent(item.content);
    };

    const handleSave = async (id: string) => {
        try {
            const response = await fetch(`https://app-nhat-ky-me-bau.onrender.com/api/diaries/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    title: editTitle,
                    content: editContent,
                }),
            });
            const updatedDiary = await response.json();

            setDiaries((prev) =>
                prev.map((item) =>
                    item._id === id ? { ...item, title: editTitle, content: editContent } : item
                )
            );
            setEditingId(null);
        } catch (error) {
            console.error("Error updating diary:", error);
        }
    };

    const handleAddDiary = async () => {
        if (!newTitle.trim() || !newContent.trim()) return;

        try {
            const newDiary = {
                title: newTitle,
                content: newContent,
            };

            const response = await fetch("https://app-nhat-ky-me-bau.onrender.com/api/diaries", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
                },
                body: JSON.stringify(newDiary),
            });

            const data = await response.json();
            setDiaries([data.diary, ...diaries]);
            setNewTitle("");
            setNewContent("");
            setIsAdding(false);
        } catch (error) {
            console.error("Error adding diary:", error);
        }
    };

    const renderItem = ({ item }: { item: Diary }) => {
        const isEditing = editingId === item._id;
        return (
            <View style={styles.card}>
                {isEditing ? (
                    <>
                        <TextInput
                            style={styles.input}
                            value={editTitle}
                            onChangeText={setEditTitle}
                            placeholder="Nhập tiêu đề"
                            placeholderTextColor="#999"
                        />
                        <TextInput
                            style={[styles.input, styles.contentInput]}
                            value={editContent}
                            onChangeText={setEditContent}
                            placeholder="Nhập nội dung"
                            multiline
                            textAlignVertical="top"
                            placeholderTextColor="#999"
                        />
                        <View style={styles.actionRow}>
                            <TouchableOpacity onPress={() => handleSave(item._id)} style={styles.saveBtn}>
                                <Text style={styles.saveText}>Lưu</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setEditingId(null)} style={styles.cancelBtn}>
                                <Text style={styles.cancelText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.date}>
                            {new Date(item.createdAt).toLocaleDateString("vi-VN", {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}
                        </Text>
                        <Text style={styles.content}>{item.content}</Text>

                        <View style={styles.actionRow}>
                            <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                                <Text style={styles.editText}>Sửa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
                                <Text style={styles.deleteText}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <View style={styles.content}>
                <Text style={styles.header}>📝 Nhật ký thai kỳ</Text>
                <Text style={styles.subtitle}>Lưu lại những khoảnh khắc đáng nhớ</Text>

                {/* Nút thêm nhật ký */}
                {!isAdding ? (
                    <TouchableOpacity style={styles.addBtn} onPress={() => setIsAdding(true)}>
                        <Text style={styles.addText}>+ Thêm nhật ký mới</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.addForm}>
                        <Text style={styles.addFormTitle}>Nhật ký mới</Text>
                        <TextInput
                            style={styles.input}
                            value={newTitle}
                            onChangeText={setNewTitle}
                            placeholder="Tiêu đề..."
                            placeholderTextColor="#999"
                        />
                        <TextInput
                            style={[styles.input, styles.contentInput]}
                            value={newContent}
                            onChangeText={setNewContent}
                            placeholder="Hôm nay của bạn thế nào?"
                            multiline
                            textAlignVertical="top"
                            placeholderTextColor="#999"
                        />
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                onPress={handleAddDiary}
                                style={[
                                    styles.saveBtn,
                                    (!newTitle.trim() || !newContent.trim()) && styles.saveBtnDisabled
                                ]}
                                disabled={!newTitle.trim() || !newContent.trim()}
                            >
                                <Text style={styles.saveText}>Lưu nhật ký</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setIsAdding(false)} style={styles.cancelBtn}>
                                <Text style={styles.cancelText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <FlatList
                    data={diaries}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>Chưa có nhật ký nào</Text>
                            <Text style={styles.emptyStateSubtext}>Hãy bắt đầu viết nhật ký đầu tiên của bạn!</Text>
                        </View>
                    }
                />
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
        marginBottom: 24,
    },
    card: {
        backgroundColor: "#FFF",
        padding: 16,
        borderRadius: 16,
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
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: "#FFC7CC",
        marginBottom: 8,
        fontWeight: "600",
    },
    content: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 12,
        gap: 12,
    },
    editBtn: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#FFC7CC",
    },
    deleteBtn: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#FFC7CC",
    },
    editText: {
        color: "#FF6B81",
        fontWeight: "600",
        fontSize: 12,
    },
    deleteText: {
        color: "#FF6B81",
        fontWeight: "600",
        fontSize: 12,
    },
    input: {
        backgroundColor: "#FAFAFA",
        borderWidth: 1,
        borderColor: "#F0F0F0",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        fontSize: 14,
        color: "#333",
    },
    contentInput: {
        height: 80,
        textAlignVertical: "top",
    },
    saveBtn: {
        backgroundColor: "#FFC7CC",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        shadowColor: "#FFC7CC",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    saveBtnDisabled: {
        backgroundColor: "#F0F0F0",
        shadowOpacity: 0,
        elevation: 0,
    },
    saveText: {
        color: "#333",
        fontWeight: "600",
        fontSize: 14,
    },
    cancelBtn: {
        backgroundColor: "#F0F0F0",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    cancelText: {
        color: "#666",
        fontWeight: "600",
        fontSize: 14,
    },
    addBtn: {
        backgroundColor: "#FFC7CC",
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        alignItems: "center",
        shadowColor: "#FFC7CC",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    addText: {
        color: "#333",
        fontWeight: "700",
        fontSize: 16,
    },
    addForm: {
        backgroundColor: "#FFF9FA",
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: "#FFC7CC",
    },
    addFormTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 12,
    },
    listContent: {
        paddingBottom: 40,
    },
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 18,
        color: "#999",
        fontWeight: "600",
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
    },
});