// src/screens/AuthScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from '../../assets/icon.png'; // Убедитесь, что у вас есть этот файл

const AuthScreen = ({ navigation, onAuthenticate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [role, setRole] = useState('client'); // 'client' или 'performer'

    const handleAuth = () => {
        // В реальном приложении здесь будет логика отправки данных на бэкенд
        // и получения токена аутентификации и роли пользователя.
        if (isLogin) {
            console.log('Попытка входа:', { email, password });
            // Имитация успешного входа
            if (email === 'client@test.com' && password === 'password') {
                onAuthenticate('client');
            } else if (email === 'performer@test.com' && password === 'password') {
                onAuthenticate('performer');
            } else {
                alert('Неверный логин или пароль');
            }
        } else {
            console.log('Попытка регистрации:', { fullName, email, password, phoneNumber, role });
            // Имитация успешной регистрации
            if (email && password && fullName && phoneNumber) {
                alert(`Вы успешно зарегистрированы как ${role}!`);
                onAuthenticate(role); // Передаем выбранную роль
            } else {
                alert('Пожалуйста, заполните все поля.');
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={logo} style={styles.logo} />
                <Text style={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</Text>

                {!isLogin && (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Полное имя"
                            placeholderTextColor="#888"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Номер телефона"
                            placeholderTextColor="#888"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                        />
                    </>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Пароль"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                {!isLogin && (
                    <View style={styles.roleSelectionContainer}>
                        <TouchableOpacity
                            style={[styles.roleButton, role === 'client' && styles.roleButtonActive]}
                            onPress={() => setRole('client')}
                        >
                            <Ionicons
                                name={role === 'client' ? 'person' : 'person-outline'}
                                size={20}
                                color={role === 'client' ? '#333' : '#888'}
                            />
                            <Text style={[styles.roleButtonText, role === 'client' && styles.roleButtonTextActive]}>
                                Клиент
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleButton, role === 'performer' && styles.roleButtonActive]}
                            onPress={() => setRole('performer')}
                        >
                            <Ionicons
                                name={role === 'performer' ? 'hammer' : 'hammer-outline'}
                                size={20}
                                color={role === 'performer' ? '#333' : '#888'}
                            />
                            <Text style={[styles.roleButtonText, role === 'performer' && styles.roleButtonTextActive]}>
                                Исполнитель
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity style={styles.button} onPress={handleAuth}>
                    <Text style={styles.buttonText}>{isLogin ? 'Войти' : 'Зарегистрироваться'}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                    <Text style={styles.toggleText}>
                        {isLogin ? 'У вас нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войти'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    roleSelectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    roleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    roleButtonActive: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },
    roleButtonText: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '500',
        color: '#888',
    },
    roleButtonTextActive: {
        color: '#333',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#333', // Темный цвет для кнопки входа
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    toggleText: {
        color: '#FFD700', // Золотой для ссылок
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default AuthScreen;