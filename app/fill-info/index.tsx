import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
export default function PregnancyInfoUpdate() {
    const [dueDate, setDueDate] = React.useState('');
    const [babyName, setBabyName] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [pregnancyWeek, setPregnancyWeek] = React.useState('');
    const router = useRouter();
    const handleSave = async () => {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            Alert.alert("Error", "Bạn chưa đăng nhập");
            return;
        }

        const res = await fetch("https://app-nhat-ky-me-bau.onrender.com/api/auth/updateInfo", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                dueDate,
                babyName,
                gender,
                pregnancyWeek: Number(pregnancyWeek),
            }),
        });

        const data = await res.json();
        if (res.ok) {
            setTimeout(() => {
                Alert.alert("✅ Thành công", "Cập nhật thông tin thai kỳ thành công!");
            }, 500);
            router.replace("../(tabs)/index");
        } else {
            Alert.alert("❌ Lỗi", data.error || "Không thể cập nhật");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <Text style={styles.title}>Cập nhật thông tin thai kỳ</Text>
                        <Text style={styles.subtitle}>Nhập thông tin để theo dõi thai kỳ tốt hơn</Text>

                        {/* Ngày dự sinh */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Ngày dự sinh</Text>
                            <TextInput
                                placeholder="YYYY-MM-DD"
                                placeholderTextColor="#999"
                                value={dueDate}
                                onChangeText={setDueDate}
                                style={styles.textInput}
                            />
                            <Text style={styles.hint}>Ví dụ: 2024-12-25</Text>
                        </View>

                        {/* Tên em bé */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Tên em bé</Text>
                            <TextInput
                                placeholder="Nhập tên bé"
                                placeholderTextColor="#999"
                                value={babyName}
                                onChangeText={setBabyName}
                                style={styles.textInput}
                            />
                        </View>

                        {/* Giới tính */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Giới tính</Text>
                            <View style={styles.genderButtons}>
                                <TouchableOpacity
                                    style={[
                                        styles.genderButton,
                                        gender === 'Nam' && styles.genderButtonSelected
                                    ]}
                                    onPress={() => setGender('Nam')}
                                >
                                    <Text style={[
                                        styles.genderButtonText,
                                        gender === 'Nam' && styles.genderButtonTextSelected
                                    ]}>Nam</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.genderButton,
                                        gender === 'Nữ' && styles.genderButtonSelected
                                    ]}
                                    onPress={() => setGender('Nữ')}
                                >
                                    <Text style={[
                                        styles.genderButtonText,
                                        gender === 'Nữ' && styles.genderButtonTextSelected
                                    ]}>Nữ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Tuần thai hiện tại */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Tuần thai hiện tại</Text>
                            <TextInput
                                placeholder="VD: 12"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={pregnancyWeek}
                                onChangeText={setPregnancyWeek}
                                style={styles.textInput}
                            />
                            <Text style={styles.hint}>Nhập số tuần thai hiện tại</Text>
                        </View>

                        {/* Button Lưu thông tin */}
                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                (!dueDate || !pregnancyWeek) && styles.saveButtonDisabled
                            ]}
                            onPress={handleSave}
                            disabled={!dueDate || !pregnancyWeek}
                        >
                            <Text style={styles.saveButtonText}>Lưu thông tin</Text>
                        </TouchableOpacity>

                        {/* Thông tin thêm */}
                        <View style={styles.infoBox}>
                            <Text style={styles.infoTitle}>💡 Mẹo nhỏ</Text>
                            <Text style={styles.infoText}>
                                • Ngày dự sinh giúp theo dõi sự phát triển của bé{'\n'}
                                • Tên bé có thể cập nhật sau{'\n'}
                                • Tuần thai giúp tính toán các mốc quan trọng
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        fontSize: 16,
        color: '#333',
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        marginLeft: 4,
    },
    genderButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
    },
    genderButtonSelected: {
        backgroundColor: '#FFC7CC',
        borderColor: '#FFC7CC',
    },
    genderButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    genderButtonTextSelected: {
        color: '#333',
        fontWeight: '600',
    },
    saveButton: {
        backgroundColor: '#FFC7CC',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
        shadowColor: '#FFC7CC',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonDisabled: {
        backgroundColor: '#F0F0F0',
        shadowOpacity: 0,
        elevation: 0,
    },
    saveButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    infoBox: {
        backgroundColor: '#FFF9FA',
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FFC7CC',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
});