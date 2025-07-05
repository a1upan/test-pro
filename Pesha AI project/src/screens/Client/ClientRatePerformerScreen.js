// src/screens/Client/ClientRatePerformerScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Alert, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const ClientRatePerformerScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId, performerId, performerName } = route.params;

    const [rating, setRating] = useState(0); // Оценка от 1 до 5
    const [comment, setComment] = useState(''); // Текстовый отзыв

    const handleStarPress = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleSubmitReview = () => {
        if (rating === 0) {
            Alert.alert('Ошибка', 'Пожалуйста, поставьте оценку (от 1 до 5 звезд).');
            return;
        }

        if (comment.trim().length < 10) {
            Alert.alert('Ошибка', 'Пожалуйста, напишите более подробный отзыв (минимум 10 символов).');
            return;
        }

        Alert.alert(
            'Подтверждение отзыва',
            `Вы хотите отправить оценку ${rating} звезд и отзыв для ${performerName}?`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Отправить',
                    onPress: () => {
                        // В реальном приложении: отправка данных на сервер
                        console.log(`Отзыв для исполнителя ${performerId} (заказ ${orderId}):`);
                        console.log(`Оценка: ${rating} звезд`);
                        console.log(`Комментарий: "${comment}"`);

                        Alert.alert('Спасибо!', 'Ваш отзыв успешно отправлен.');
                        // Обычно после отправки отзыва возвращаемся на главный экран клиента или список заказов
                        navigation.popToTop(); // Возвращаемся к самому первому экрану в стеке (Dashboard)
                        navigation.navigate('ClientDashboardTab'); // Переходим на главную вкладку клиента
                    }
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={28} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Оцените Исполнителя</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.performerName}>Исполнитель: {performerName}</Text>
                        <Text style={styles.orderId}>Заказ ID: {orderId}</Text>

                        <Text style={styles.sectionTitle}>Поставьте оценку:</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                                    <Ionicons
                                        name={star <= rating ? 'star' : 'star-outline'}
                                        size={40}
                                        color={star <= rating ? '#FFD700' : '#ccc'}
                                        style={styles.starIcon}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.ratingText}>{rating > 0 ? `Ваша оценка: ${rating} из 5` : 'Выберите звезды'}</Text>

                        <Text style={styles.sectionTitle}>Напишите отзыв:</Text>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Расскажите о вашем опыте с этим исполнителем (минимум 10 символов)..."
                            placeholderTextColor="#888"
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            value={comment}
                            onChangeText={setComment}
                        />

                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
                            <Text style={styles.submitButtonText}>Отправить отзыв</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    container: {
        flexGrow: 1,
        // paddingBottom: Platform.OS === 'ios' ? 0 : 20, // Для KeyboardAvoidingView
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    performerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    orderId: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
        marginBottom: 10,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 15,
    },
    starIcon: {
        marginHorizontal: 5,
    },
    ratingText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 15,
        minHeight: 120,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
        marginBottom: 25,
    },
    submitButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default ClientRatePerformerScreen;