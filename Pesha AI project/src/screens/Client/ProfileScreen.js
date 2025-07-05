// src/screens/Client/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
    const navigation = useNavigation();

    // Временные данные профиля клиента
    const clientProfile = {
        fullName: 'John Doe',
        phoneNumber: '+000 000 00 00',
    };

    const handleEditProfile = () => {
        Alert.alert('Редактирование профиля', 'Функция редактирования профиля будет реализована.');
        // navigation.navigate('EditProfileScreen');
    };

    const handleNavigate = (screenName) => {
        Alert.alert('Навигация', `Переход на экран: ${screenName} (пока не реализовано)`);
        // navigation.navigate(screenName);
    };

    const handleSupport = () => {
        Alert.alert('Поддержка', 'Обращение в службу поддержки (будет реализован чат/форма)');
    };

    const handleSendRequest = () => {
        // Эта кнопка "Send request" на макете выглядит как отправка общего запроса,
        // возможно, связанного с предложениями или напрямую с поиском специалиста.
        // Пока что можно направить на экран создания запроса.
        navigation.navigate('CategoriesTab', { screen: 'RequestCreation' });
        Alert.alert('Отправка запроса', 'Переход к созданию нового запроса.');
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <View style={styles.profileCard}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>JD</Text>
                </View>
                <Text style={styles.profileName}>{clientProfile.fullName}</Text>
                <Text style={styles.profilePhone}>{clientProfile.phoneNumber}</Text>
                <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                    <Text style={styles.editButtonText}>Edit profile</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.menuItemContainer}>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Orders')}>
                    <Text style={styles.menuItemText}>Orders</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Favorites')}>
                    <Text style={styles.menuItemText}>Favorites</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleSupport}>
                    <Text style={styles.menuItemText}>Support</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('PrivacyPolicy')}>
                    <Text style={styles.menuItemText}>Privacy Policy</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('OptionalSettings')}>
                    <Text style={styles.menuItemText}>Optional</Text>
                    <Ionicons name="chevron-forward-outline" size={24} color="#555" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.sendRequestButton} onPress={handleSendRequest}>
                <Text style={styles.sendRequestButtonText}>Send request</Text>
            </TouchableOpacity>

            <View style={{ height: 50 }} /> {/* Отступ снизу */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginHorizontal: 20,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#666',
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    profilePhone: {
        fontSize: 16,
        color: '#666',
        marginBottom: 15,
    },
    editButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    editButtonText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    menuItemContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
    sendRequestButton: {
        backgroundColor: '#FFD700', // Золотой
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 30,
        marginBottom: 20,
    },
    sendRequestButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default ProfileScreen;