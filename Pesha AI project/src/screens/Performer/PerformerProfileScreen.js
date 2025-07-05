// src/screens/Performer/PerformerProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Временные данные для профиля исполнителя (имитация)
const DUMMY_PERFORMER_DATA = {
    id: 'performer1',
    name: 'Иван Иванов',
    email: 'ivan.ivanov@example.com',
    phone: '+994501234567',
    avatar: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=ИИ',
    bio: 'Опытный электрик и сантехник с 10-летним стажем. Гарантирую качество и оперативность. Работаю по Сумгаиту и Баку.',
    categories: ['Электрик', 'Сантехник', 'Мелкий ремонт'],
    averageRating: 4.7,
    totalReviews: 35,
    reviews: [
        {
            id: 'review1',
            clientId: 'client5',
            clientName: 'Ахмед Р.',
            orderId: 'req5',
            rating: 5,
            comment: 'Отличный специалист! Быстро и качественно заменил смеситель. Рекомендую.',
            createdAt: '2025-07-04T10:00:00Z',
        },
        {
            id: 'review2',
            clientId: 'client2',
            clientName: 'Андрей К.',
            orderId: 'req2',
            rating: 4,
            comment: 'Хорошо справился с течью. Приехал вовремя. Единственное, немного затянул с расходниками.',
            createdAt: '2025-06-26T16:00:00Z',
        },
        {
            id: 'review3',
            clientId: 'client9',
            clientName: 'Ольга П.',
            orderId: 'req9',
            rating: 5,
            comment: 'Иван устанавливал мне люстру. Все сделал аккуратно и профессионально. Очень довольна!',
            createdAt: '2025-07-01T12:00:00Z',
        },
    ],
    verified: true,
    joinedDate: '2024-01-15T00:00:00Z',
};

const PerformerProfileScreen = () => {
    const navigation = useNavigation();
    const [performerData, setPerformerData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Имитация загрузки данных профиля
        setTimeout(() => {
            setPerformerData(DUMMY_PERFORMER_DATA);
            setLoading(false);
        }, 800);
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={{ marginTop: 10 }}>Загрузка профиля...</Text>
            </View>
        );
    }

    if (!performerData) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Профиль не найден.</Text>
                <TouchableOpacity style={styles.backButtonBottom} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonTextBottom}>Назад</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={20}
                    color="#FFD700"
                />
            );
        }
        return <View style={styles.starRatingContainer}>{stars}</View>;
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Мой Профиль</Text>
                <TouchableOpacity onPress={() => Alert.alert('Редактировать профиль', 'Функция редактирования пока не реализована.')}>
                    <Ionicons name="create-outline" size={28} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileHeader}>
                    <Image
                        source={{ uri: performerData.avatar }}
                        style={styles.avatar}
                    />
                    <Text style={styles.name}>{performerData.name}</Text>
                    <View style={styles.ratingInfo}>
                        {renderStars(performerData.averageRating)}
                        <Text style={styles.ratingText}>{performerData.averageRating.toFixed(1)} ({performerData.totalReviews} отзывов)</Text>
                    </View>
                    {performerData.verified && (
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                            <Text style={styles.verifiedText}>Проверенный исполнитель</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Обо мне</Text>
                    <Text style={styles.bio}>{performerData.bio}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Контактная информация</Text>
                    <View style={styles.contactItem}>
                        <Ionicons name="mail-outline" size={20} color="#666" />
                        <Text style={styles.contactText}>{performerData.email}</Text>
                    </View>
                    <View style={styles.contactItem}>
                        <Ionicons name="call-outline" size={20} color="#666" />
                        <Text style={styles.contactText}>{performerData.phone}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Категории услуг</Text>
                    <View style={styles.categoriesContainer}>
                        {performerData.categories.map((category, index) => (
                            <View key={index} style={styles.categoryTag}>
                                <Text style={styles.categoryText}>{category}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Мои отзывы ({performerData.reviews.length})</Text>
                    {performerData.reviews.length === 0 ? (
                        <Text style={styles.noReviewsText}>У вас пока нет отзывов.</Text>
                    ) : (
                        performerData.reviews.map((review, index) => (
                            <View key={review.id} style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <Text style={styles.reviewClientName}>{review.clientName}</Text>
                                    {renderStars(review.rating)}
                                </View>
                                <Text style={styles.reviewComment}>{review.comment}</Text>
                                <Text style={styles.reviewDate}>
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                        ))
                    )}
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'android' ? 20 : 50,
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        padding: 20,
        paddingBottom: 30,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingVertical: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#FFD700',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    ratingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    starRatingContainer: {
        flexDirection: 'row',
        marginRight: 5,
    },
    ratingText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 5,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f5e9',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 12,
        marginTop: 5,
    },
    verifiedText: {
        fontSize: 14,
        color: '#4CAF50',
        marginLeft: 5,
        fontWeight: '500',
    },
    section: {
        marginBottom: 30,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    bio: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    contactText: {
        fontSize: 16,
        color: '#555',
        marginLeft: 10,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    categoryTag: {
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginRight: 10,
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    noReviewsText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
    },
    reviewCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewClientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    reviewComment: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
});

export default PerformerProfileScreen;