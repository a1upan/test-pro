// src/screens/Client/ClientPerformersByCategoryScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Временные данные для исполнителей (имитация)
// В реальном приложении это будет запрос к API
const DUMMY_ALL_PERFORMERS = [
    {
        id: 'perf1',
        name: 'Иван Иванов',
        avatar: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=ИИ',
        categories: ['Электрик', 'Сантехник', 'Мелкий ремонт'],
        averageRating: 4.7,
        totalReviews: 35,
        bio: 'Опытный электрик и сантехник с 10-летним стажем. Гарантирую качество и оперативность. Работаю по Сумгаиту и Баку.',
    },
    {
        id: 'perf2',
        name: 'Петр Петров',
        avatar: 'https://via.placeholder.com/150/FFC0CB/FFFFFF?text=ПП',
        categories: ['Электрик', 'Компьютерная помощь'],
        averageRating: 4.8,
        totalReviews: 25,
        bio: 'Профессиональный электрик, также оказываю компьютерную помощь.',
    },
    {
        id: 'perf3',
        name: 'Анна Мастер',
        avatar: 'https://via.placeholder.com/150/FF6347/FFFFFF?text=АМ',
        categories: ['Малярные работы', 'Уборка', 'Мелкий ремонт'],
        averageRating: 4.9,
        totalReviews: 22,
        bio: 'Выполняю малярные работы любой сложности и профессиональную уборку.',
    },
    {
        id: 'perf4',
        name: 'Олег Профессионал',
        avatar: 'https://via.placeholder.com/150/32CD32/FFFFFF?text=ОП',
        categories: ['Клининг', 'Садовник'],
        averageRating: 4.8,
        totalReviews: 18,
        bio: 'Быстрая и качественная уборка квартир и офисов. Уход за садом.',
    },
    {
        id: 'perf5',
        name: 'Дмитрий Строитель',
        avatar: 'https://via.placeholder.com/150/8A2BE2/FFFFFF?text=ДС',
        categories: ['Малярные работы', 'Мелкий ремонт'],
        averageRating: 4.2,
        totalReviews: 10,
        bio: 'Все виды строительных и отделочных работ.',
    },
    {
        id: 'perf6',
        name: 'Сархан Сантехник',
        avatar: 'https://via.placeholder.com/150/808000/FFFFFF?text=СС',
        categories: ['Сантехник'],
        averageRating: 4.6,
        totalReviews: 15,
        bio: 'Специалист по водопроводным системам и отоплению.',
    },
];

const ClientPerformersByCategoryScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { category } = route.params;

    const [performers, setPerformers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            // Фильтрация исполнителей по выбранной категории
            const filtered = DUMMY_ALL_PERFORMERS.filter(
                (performer) => performer.categories.includes(category)
            );
            setPerformers(filtered);
            setLoading(false);
        }, 800);
    }, [category]);

    const handleViewPerformerProfile = (performer) => {
        // Здесь можно будет перейти на детальный профиль исполнителя
        // Alert.alert('Профиль', `Переход на профиль ${performer.name}`);
        navigation.navigate('ClientPerformerProfileDetails', { performerId: performer.id, performerName: performer.name });
    };

    const handleCreateOrderWithPerformer = (performer) => {
        Alert.alert(
            'Создать заказ',
            `Вы хотите создать заказ и предложить его напрямую ${performer.name}?`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Да, создать',
                    onPress: () => {
                        // Переход на экран создания заказа, предзаполняя поля
                        navigation.navigate('ClientCreateOrderTab', {
                            screen: 'ClientCreateOrder', // Указываем конкретный экран в табе
                            params: {
                                selectedCategory: category,
                                preferredPerformer: performer.id,
                                preferredPerformerName: performer.name,
                            },
                        });
                    }
                }
            ]
        );
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={18}
                    color="#FFD700"
                />
            );
        }
        return <View style={styles.starRatingContainer}>{stars}</View>;
    };

    const renderPerformerItem = ({ item: performer }) => (
        <TouchableOpacity style={styles.performerCard} onPress={() => handleViewPerformerProfile(performer)}>
            <Image source={{ uri: performer.avatar }} style={styles.avatar} />
            <View style={styles.performerDetails}>
                <Text style={styles.performerName}>{performer.name}</Text>
                <View style={styles.ratingInfo}>
                    {renderStars(performer.averageRating)}
                    <Text style={styles.ratingText}>{performer.averageRating.toFixed(1)} ({performer.totalReviews})</Text>
                </View>
                <Text style={styles.performerBio} numberOfLines={2}>{performer.bio}</Text>
                <View style={styles.performerCategories}>
                    {performer.categories.map((cat, index) => (
                        <Text key={index} style={styles.categoryTag}>{cat}</Text>
                    ))}
                </View>
                <TouchableOpacity
                    style={styles.directOrderButton}
                    onPress={() => handleCreateOrderWithPerformer(performer)}
                >
                    <Text style={styles.directOrderButtonText}>Предложить заказ этому исполнителю</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={{ marginTop: 10 }}>Загрузка исполнителей...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Исполнители в "{category}"</Text>
                <View style={{ width: 28 }} />
            </View>

            <FlatList
                data={performers}
                renderItem={renderPerformerItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                        <Ionicons name="sad-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyListText}>В этой категории пока нет исполнителей.</Text>
                        <Text style={styles.emptyListSubText}>Попробуйте выбрать другую категорию или создать общий заказ.</Text>
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
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    performerCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'flex-start',
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    performerDetails: {
        flex: 1,
    },
    performerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    ratingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    starRatingContainer: {
        flexDirection: 'row',
        marginRight: 5,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
    },
    performerBio: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    performerCategories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    categoryTag: {
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginRight: 8,
        marginBottom: 5,
        fontSize: 12,
        color: '#555',
    },
    directOrderButton: {
        backgroundColor: '#333',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    directOrderButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
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

export default ClientPerformersByCategoryScreen;