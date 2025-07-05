// src/screens/Performer/PerformerMakeOfferScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const PerformerMakeOfferScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId, orderTitle, existingOfferPrice, existingOfferComment } = route.params;

    const [price, setPrice] = useState(existingOfferPrice ? String(existingOfferPrice) : '');
    const [comment, setComment] = useState(existingOfferComment || '');
    const [loading, setLoading] = useState(false);

    const handleSubmitOffer = () => {
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            Alert.alert('Ошибка', 'Пожалуйста, введите корректную цену.');
            return;
        }
        if (!comment.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, добавьте комментарий к вашему предложению.');
            return;
        }

        setLoading(true);
        // Имитация отправки предложения на сервер
        setTimeout(() => {
            const offerData = {
                orderId: orderId,
                performerId: 'perf1', // Заглушка: ID текущего исполнителя
                performerName: 'Иван Иванов', // Заглушка: Имя текущего исполнителя
                price: parseFloat(price),
                comment: comment.trim(),
                createdAt: new Date().toISOString(),
                rating: 4.7, // Заглушка: рейтинг исполнителя
                reviewsCount: 35, // Заглушка: количество отзывов
                categories: ['Электрик', 'Сантехник'], // Заглушка: категории исполнителя
                avatar: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=ИИ' // Заглушка: аватар исполнителя
            };

            console.log('Отправка предложения:', offerData);

            setLoading(false);
            Alert.alert(
                'Предложение отправлено!',
                'Ваше предложение успешно отправлено клиенту. Вы будете уведомлены, если клиент его примет.',
                [{
                    text: 'ОК',
                    onPress: () => {
                        // Переход назад на экран деталей заказа, возможно, с обновлением данных
                        navigation.goBack();
                        // В реальном приложении, если бы мы использовали Redux/Context,
                        // можно было бы обновить состояние заказа здесь или на предыдущем экране через эффект.
                    }
                }]
            );
        }, 1500); // Имитация задержки сети
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Сделать Предложение</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formContainer}>
                    <Text style={styles.orderTitle}>Заказ: "{orderTitle}"</Text>

                    <Text style={styles.label}>Ваша цена (AZN) *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Например: 50, 120"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={text => setPrice(text.replace(/[^0-9.]/g, ''))} // Только цифры и точка
                    />

                    <Text style={styles.label}>Комментарий к предложению *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Опишите, что входит в цену, сроки выполнения, ваш опыт и т.д."
                        placeholderTextColor="#888"
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        value={comment}
                        onChangeText={setComment}
                    />

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmitOffer}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>
                                {existingOfferPrice ? 'Обновить Предложение' : 'Отправить Предложение'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 20 : 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    backButton: {
        marginRight: 15,
        padding: 5,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#333',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default PerformerMakeOfferScreen;