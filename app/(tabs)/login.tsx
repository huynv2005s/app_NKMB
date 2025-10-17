import { IconSymbol } from '@/components/ui/icon-symbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

interface User {
    _id: string;
    name: string;
    email: string;
    dueDate?: string;
    pregnancyWeek?: number;
    baby?: {
        name: string;
        gender: string;
    };
}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        dueDate: '',
        pregnancyWeek: '',
        babyName: '',
        babyGender: ''
    });

    useEffect(() => {
        const checkLogin = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                setIsLoggedIn(true);
                fetchUserProfile(token);
            }
        };
        checkLogin();
    }, []);

    const fetchUserProfile = async (token: string) => {
        try {
            const res = await fetch("https://app-nhat-ky-me-bau.onrender.com/api/auth/me", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                method: "POST",
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                setEditForm({
                    name: data.user.name || '',
                    dueDate: data.user.dueDate ? new Date(data.user.dueDate).toISOString().split('T')[0] : '',
                    pregnancyWeek: data.user.pregnancyWeek?.toString() || '',
                    babyName: data.user.baby?.name || '',
                    babyGender: data.user.baby?.gender || ''
                });
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Lỗi', 'Email không hợp lệ');
            return;
        }

        try {
            const res = await fetch("https://app-nhat-ky-me-bau.onrender.com/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();


            if (res.ok) {
                await AsyncStorage.setItem("token", data.accessToken);
                setIsLoggedIn(true);
                setUser(data.user);
                setEditForm({
                    name: data.user.name || '',
                    dueDate: data.user.dueDate ? new Date(data.user.dueDate).toISOString().split('T')[0] : '',
                    pregnancyWeek: data.user.pregnancyWeek?.toString() || '',
                    babyName: data.user.baby?.name || '',
                    babyGender: data.user.baby?.gender || ''
                });
                Alert.alert("Thành công", "Đăng nhập thành công!");
            } else {
                Alert.alert("Lỗi", "Sai thông tin đăng nhập");
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng nhập");
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch("https://app-nhat-ky-me-bau.onrender.com/api/auth/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editForm.name,
                    dueDate: editForm.dueDate,
                    pregnancyWeek: parseInt(editForm.pregnancyWeek),
                    baby: {
                        name: editForm.babyName,
                        gender: editForm.babyGender
                    }
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setUser(data.user);
                setIsEditing(false);
                setTimeout(() => {
                    Alert.alert("Đăng nhập thành công");
                }, 500);
                router.replace('/(tabs)')
            } else {
                Alert.alert("Lỗi", "Cập nhật thất bại");
            }
        } catch (error) {
            Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật");
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        setEmail('');
        setPassword('');
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                {isLoggedIn && user ? (
                    <ScrollView style={styles.profileContainer}>
                        <View style={styles.profileHeader}>
                            <View style={styles.avatar}>
                                <IconSymbol name="person.fill" size={40} color="#FFF" />
                            </View>
                            <Text style={styles.welcomeText}>Chào mừng trở lại!</Text>
                            <Text style={styles.userName}>{user.name}</Text>
                        </View>

                        <View style={styles.profileCard}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
                                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                                    <IconSymbol
                                        name={isEditing ? "xmark" : "pencil"}
                                        size={20}
                                        color="#FF6B81"
                                    />
                                </TouchableOpacity>
                            </View>

                            {isEditing ? (
                                <View style={styles.editForm}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Họ và tên</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            value={editForm.name}
                                            onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                                            placeholder="Nhập họ và tên"
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Ngày dự sinh</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            value={editForm.dueDate}
                                            onChangeText={(text) => setEditForm(prev => ({ ...prev, dueDate: text }))}
                                            placeholder="YYYY-MM-DD"
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Tuần thai</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            value={editForm.pregnancyWeek}
                                            onChangeText={(text) => setEditForm(prev => ({ ...prev, pregnancyWeek: text }))}
                                            placeholder="Tuần thai hiện tại"
                                            keyboardType="numeric"
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Tên bé</Text>
                                        <TextInput
                                            style={styles.textInput}
                                            value={editForm.babyName}
                                            onChangeText={(text) => setEditForm(prev => ({ ...prev, babyName: text }))}
                                            placeholder="Tên của bé"
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Giới tính bé</Text>
                                        <View style={styles.genderButtons}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.genderButton,
                                                    editForm.babyGender === 'Nam' && styles.genderButtonSelected
                                                ]}
                                                onPress={() => setEditForm(prev => ({ ...prev, babyGender: 'Nam' }))}
                                            >
                                                <Text style={[
                                                    styles.genderButtonText,
                                                    editForm.babyGender === 'Nam' && styles.genderButtonTextSelected
                                                ]}>Nam</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    styles.genderButton,
                                                    editForm.babyGender === 'Nữ' && styles.genderButtonSelected
                                                ]}
                                                onPress={() => setEditForm(prev => ({ ...prev, babyGender: 'Nữ' }))}
                                            >
                                                <Text style={[
                                                    styles.genderButtonText,
                                                    editForm.babyGender === 'Nữ' && styles.genderButtonTextSelected
                                                ]}>Nữ</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    <View style={styles.actionRow}>
                                        <TouchableOpacity
                                            style={styles.saveButton}
                                            onPress={handleUpdateProfile}
                                        >
                                            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.cancelButton}
                                            onPress={() => setIsEditing(false)}
                                        >
                                            <Text style={styles.cancelButtonText}>Hủy</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.infoGrid}>
                                    <View style={styles.infoItem}>
                                        <IconSymbol name="envelope" size={16} color="#666" />
                                        <Text style={styles.infoLabel}>Email</Text>
                                        <Text style={styles.infoValue}>{user.email}</Text>
                                    </View>

                                    <View style={styles.infoItem}>
                                        <IconSymbol name="calendar" size={16} color="#666" />
                                        <Text style={styles.infoLabel}>Ngày dự sinh</Text>
                                        <Text style={styles.infoValue}>
                                            {user.dueDate ? formatDate(user.dueDate) : 'Chưa cập nhật'}
                                        </Text>
                                    </View>

                                    <View style={styles.infoItem}>
                                        <IconSymbol name="heart.fill" size={16} color="#666" />
                                        <Text style={styles.infoLabel}>Tuần thai</Text>
                                        <Text style={styles.infoValue}>
                                            {user.pregnancyWeek ? `Tuần ${user.pregnancyWeek}` : 'Chưa cập nhật'}
                                        </Text>
                                    </View>

                                    <View style={styles.infoItem}>
                                        <IconSymbol name="person.fill" size={16} color="#666" />
                                        <Text style={styles.infoLabel}>Tên bé</Text>
                                        <Text style={styles.infoValue}>
                                            {user.baby?.name || 'Chưa đặt tên'}
                                        </Text>
                                    </View>

                                    <View style={styles.infoItem}>
                                        <IconSymbol name="heart.fill" size={16} color="#666" />
                                        <Text style={styles.infoLabel}>Giới tính</Text>
                                        <Text style={styles.infoValue}>
                                            {user.baby?.gender || 'Chưa biết'}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#FFF" />
                            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
                        </TouchableOpacity>
                    </ScrollView>
                ) : (
                    // Form đăng nhập (giữ nguyên code cũ)
                    <View style={styles.loginContainer}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Đăng Nhập</Text>
                            <Text style={styles.subtitle}>Chào mừng bạn trở lại</Text>
                        </View>

                        <View style={styles.form}>
                            {/* ... Giữ nguyên form đăng nhập ... */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <View style={styles.inputWrapper}>
                                    <IconSymbol
                                        name="envelope"
                                        size={20}
                                        color="#666"
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="Nhập email của bạn"
                                        placeholderTextColor="#999"
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Mật khẩu</Text>
                                <View style={styles.inputWrapper}>
                                    <IconSymbol
                                        name="lock"
                                        size={20}
                                        color="#666"
                                        style={styles.inputIcon}
                                    />
                                    <TextInput
                                        style={[styles.textInput, styles.passwordInput]}
                                        placeholder="Nhập mật khẩu"
                                        placeholderTextColor="#999"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!isPasswordVisible}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity
                                        onPress={togglePasswordVisibility}
                                        style={styles.eyeIcon}
                                    >
                                        <IconSymbol
                                            name={isPasswordVisible ? "eye.slash" : "eye"}
                                            size={20}
                                            color="#666"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.forgotPassword}>
                                <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.loginButton,
                                    (!email || !password) && styles.loginButtonDisabled
                                ]}
                                onPress={handleLogin}
                                disabled={!email || !password}
                            >
                                <Text style={styles.loginButtonText}>Đăng Nhập</Text>
                            </TouchableOpacity>

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>hoặc</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <View style={styles.socialButtons}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <IconSymbol name="logo-google" size={20} color="#DB4437" />
                                    <Text style={styles.socialButtonText}>Google</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.socialButton}>
                                    <IconSymbol name="logo-facebook" size={20} color="#4267B2" />
                                    <Text style={styles.socialButtonText}>Facebook</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.signupContainer}>
                                <Text style={styles.signupText}>Chưa có tài khoản? </Text>
                                <TouchableOpacity>
                                    <Text style={styles.signupLink} onPress={() => router.navigate('/register')}>Đăng ký ngay</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    loginContainer: {
        flex: 1,
    },
    // Styles cho profile
    profileContainer: {
        flex: 1,
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFC7CC',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    welcomeText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 8,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    profileCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
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
        alignItems: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    infoGrid: {
        gap: 16,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        marginRight: 16,
        width: 80,
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        flex: 1,
    },
    editForm: {
        gap: 16,
    },
    genderButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    genderButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
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
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    genderButtonTextSelected: {
        color: '#333',
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    saveButton: {
        flex: 2,
        backgroundColor: '#FFC7CC',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 16,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#FF6B81',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    logoutButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    // Giữ nguyên các styles cũ cho form đăng nhập
    header: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    form: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 16,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 16,
        color: '#1C1C1E',
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    passwordInput: {
        paddingRight: 40,
    },
    inputIcon: {
        marginRight: 12,
    },
    eyeIcon: {
        padding: 8,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 30,
    },
    forgotPasswordText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: '#FFC7CC',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    loginButtonDisabled: {
        backgroundColor: '#ccc',
    },
    loginButtonText: {
        color: '#333',
        fontSize: 18,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        paddingHorizontal: 16,
        color: '#666',
        fontSize: 14,
    },
    socialButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingVertical: 12,
        marginHorizontal: 6,
    },
    socialButtonText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signupText: {
        color: '#666',
        fontSize: 14,
    },
    signupLink: {
        color: '#FFC7CC',
        fontSize: 14,
        fontWeight: '600',
    },
});