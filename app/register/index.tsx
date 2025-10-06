import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
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

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleRegister = () => {
        const { username, email, password, confirmPassword } = formData;

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (username.length < 3) {
            Alert.alert('Lỗi', 'Tên người dùng phải có ít nhất 3 ký tự');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Lỗi', 'Email không hợp lệ');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
            return;
        }

        if (!acceptTerms) {
            Alert.alert('Lỗi', 'Vui lòng chấp nhận điều khoản sử dụng');
            return;
        }

        // Xử lý đăng ký ở đây
        console.log('Registration Data:', formData);
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const isFormValid = () => {
        const { username, email, password, confirmPassword } = formData;
        return username && email && password && confirmPassword && acceptTerms;
    };

    return (

        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Đăng Ký</Text>
                        <Text style={styles.subtitle}>Tạo tài khoản mới</Text>
                    </View>

                    {/* Form đăng ký */}
                    <View style={styles.form}>
                        {/* Username Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Tên người dùng</Text>
                            <View style={styles.inputWrapper}>
                                <IconSymbol
                                    name="person"
                                    size={20}
                                    color="#666"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Nhập tên người dùng"
                                    placeholderTextColor="#999"
                                    value={formData.username}
                                    onChangeText={(value) => handleInputChange('username', value)}
                                    autoCapitalize="words"
                                    autoComplete="username"
                                />
                            </View>
                        </View>

                        {/* Email Input */}
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
                                    value={formData.email}
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
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
                                    value={formData.password}
                                    onChangeText={(value) => handleInputChange('password', value)}
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
                            <Text style={styles.passwordHint}>Mật khẩu phải có ít nhất 6 ký tự</Text>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Xác nhận mật khẩu</Text>
                            <View style={styles.inputWrapper}>
                                <IconSymbol
                                    name="lock.fill"
                                    size={20}
                                    color="#666"
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={[styles.textInput, styles.passwordInput]}
                                    placeholder="Nhập lại mật khẩu"
                                    placeholderTextColor="#999"
                                    value={formData.confirmPassword}
                                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                                    secureTextEntry={!isConfirmPasswordVisible}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={toggleConfirmPasswordVisibility}
                                    style={styles.eyeIcon}
                                >
                                    <IconSymbol
                                        name={isConfirmPasswordVisible ? "eye.slash" : "eye"}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <Text style={styles.errorText}>Mật khẩu xác nhận không khớp</Text>
                            )}
                        </View>

                        {/* Terms and Conditions */}
                        <View style={styles.termsContainer}>
                            <TouchableOpacity
                                style={styles.checkbox}
                                onPress={() => setAcceptTerms(!acceptTerms)}
                            >
                                <View style={[
                                    styles.checkboxSquare,
                                    acceptTerms && styles.checkboxSquareChecked
                                ]}>
                                    {acceptTerms && (
                                        <IconSymbol name="checkmark" size={14} color="#fff" />
                                    )}
                                </View>
                            </TouchableOpacity>
                            <View style={styles.termsTextContainer}>
                                <Text style={styles.termsText}>
                                    Tôi đồng ý với{' '}
                                    <Text style={styles.termsLink}>Điều khoản dịch vụ</Text>
                                    {' '}và{' '}
                                    <Text style={styles.termsLink}>Chính sách bảo mật</Text>
                                </Text>
                            </View>
                        </View>

                        {/* Register Button */}
                        <TouchableOpacity
                            style={[
                                styles.registerButton,
                                !isFormValid() && styles.registerButtonDisabled
                            ]}
                            onPress={handleRegister}
                            disabled={!isFormValid()}
                        >
                            <Text style={styles.registerButtonText}>Đăng Ký</Text>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>hoặc</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Social Register */}
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

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Đã có tài khoản? </Text>
                            <TouchableOpacity>
                                <Text style={styles.loginLink}>Đăng nhập ngay</Text>
                            </TouchableOpacity>
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
        backgroundColor: '#fff',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
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
        paddingBottom: 40,
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
    passwordHint: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        marginLeft: 4,
    },
    errorText: {
        fontSize: 12,
        color: '#FF3B30',
        marginTop: 4,
        marginLeft: 4,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30,
        marginTop: 10,
    },
    checkbox: {
        marginRight: 12,
        marginTop: 2,
    },
    checkboxSquare: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSquareChecked: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    termsTextContainer: {
        flex: 1,
    },
    termsText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    termsLink: {
        color: '#007AFF',
        fontWeight: '600',
    },
    registerButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    registerButtonDisabled: {
        backgroundColor: '#ccc',
    },
    registerButtonText: {
        color: '#fff',
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        color: '#666',
        fontSize: 14,
    },
    loginLink: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '600',
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});