// src/screens/Client/ClientFavoritePerformersScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Временные данные для избранных исполнителей (имитация хранения)
// В реальном приложении это будет храниться в AsyncStorage или в базе данных на сервере
const DUMMY_FAVORITE_PERFORMERS = [
    {
        id: 'perf1',
        name: 'Иван Иванов',
        avatar: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=ИИ',
        categories: ['Электрик', 'Сантехник'],
        averageRating: 4.7,
        totalReviews: 35,
        bio: 'Опытный электрик и сантехник.',
    },
    {
        id: 'perf3',
        name: 'Анна Мастер',
        avatar: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=АМ',
        categories: ['Малярные работы', 'Мелкий ремонт'],
        averageRating: 4.9,
        totalReviews: 22,
        bio: 'Выполняю малярные работы любой сложности.',
    },
    {
        id: 'perf4',
        name: 'Олег Профессионал',
        avatar: 'https://via.placeholder.com/150/32CD32/FFFFFF?text=ОП',
        categories: ['Клининг'],
        averageRating: 4.8,
        totalReviews: 18,
        bio: 'Быстрая и качественная уборка.',
    },
];

const ClientFavoritePerformersScreen = () => {
    const navigation = useNavigation();
    const [favoritePerformers, setFavoritePerformers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Загружаем избранных исполнителей при фокусе на экране
    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            // Имитация загрузки из хранилища
            setTimeout(() => {
                setFavoritePerformers(DUMMY_FAVORITE_PERFORMERS);
                setLoading(false);
            }, 500);
            return () => {
                // Опционально: очистка или другие действия при уходе с экрана
            };
        }, [])
    );

    const handleRemoveFavorite = (performerId) => {
        Alert.alert(
            'Удалить из избранного',
            'Вы уверены, что хотите удалить этого исполнителя из избранного?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    onPress: () => {
                        setFavoritePerformers(prev => prev.filter(p => p.id !== performerId));
                        Alert.alert('Успех', 'Исполнитель удален из избранного.');
                        // В реальном приложении: отправить запрос на сервер для удаления
                    }
                }
            ]
        );
    };

    const handleViewPerformerDetails = (performerId) => {
        // В реальном приложении: переход на детальный профиль исполнителя
        Alert.alert('Профиль исполнителя', `Переход на профиль исполнителя с ID: ${performerId}`);
        // navigation.navigate('PerformerProfileScreen', { performerId: performerId }); // если такой экран будет доступен клиенту
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={16}
                    color="#FFD700"
                />
            );
        }
        return <View style={styles.starRatingContainer}>{stars}</View>;
    };

    const renderPerformerItem = ({ item: performer }) => (
        <TouchableOpacity style={styles.performerCard} onPress={() => handleViewPerformerDetails(performer.id)}>
            <View style={styles.performerInfo}>
                <Image source={{ uri: performer.avatar }} style={styles.avatar} />
                <View style={styles.textContainer}>
                    <Text style={styles.performerName}>{performer.name}</Text>
                    <View style={styles.ratingSection}>
                        {renderStars(performer.averageRating)}
                        <Text style={styles.ratingText}>{performer.averageRating.toFixed(1)} ({performer.totalReviews})</Text>
                    </View>
                    <Text style={styles.categoriesText}>{performer.categories.join(', ')}</Text>
                    <Text style={styles.bioText} numberOfLines={2}>{performer.bio}</Text>
                </View>
            </View>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFavorite(performer.id)}>
                <Ionicons name="heart-dislike-outline" size={24} color="#F44336" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={{ marginTop: 10 }}>Загрузка избранных исполнителей...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Избранные Исполнители</Text>
            </View>

            <FlatList
                data={favoritePerformers}
                renderItem={renderPerformerItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                        <Ionicons name="heart-dislike-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyListText}>У вас пока нет избранных исполнителей.</Text>
                        <Text style={styles.emptyListSubText}>Добавляйте исполнителей в избранное после просмотра их предложений по заказам.</Text>
                    </View>
                }
            />
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
        justifyContent: 'center',
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
    listContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    performerCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
        justifyContent: 'space-between',
    },
    performerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    textContainer: {
        flex: 1,
    },
    performerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    ratingSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    starRatingContainer: {
        flexDirection: 'row',
        marginRight: 5,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
    },
    categoriesText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 5,
    },
    bioText: {
        fontSize: 13,
        color: '#555',
    },
    removeButton: {
        padding: 8,
        marginLeft: 10,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        marginTop: 50,
    },
    emptyListText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#999',
        textAlign: 'center',
        marginTop: 15,
    },
    emptyListSubText: {
        fontSize: 14,
        color: '#bbb',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
});

export default ClientFavoritePerformersScreen;