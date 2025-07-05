// src/screens/Client/PerformerListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Временные данные для исполнителей
const DUMMY_PERFORMERS = [
    {
        id: 'p1',
        name: 'Алиев Анар',
        rating: 4.8,
        reviews: 125,
        isCompany: false,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        services: ['s2', 's3'], // Электрик, Сантехник
        offers: ['o3', 'o4', 'o5', 'o6'], // Ремонт проводки, Установка розеток, Устранение течи, Установка смесителя
        description: 'Опытный электрик и сантехник с большим стажем. Быстро и качественно.',
    },
    {
        id: 'p2',
        name: 'CleanMaster LLC',
        rating: 4.5,
        reviews: 200,
        isCompany: true,
        avatar: 'https://via.placeholder.com/150/FFD700/000000?text=CM',
        services: ['s1'], // Уборка квартир
        offers: ['o1', 'o2'], // Генеральная уборка, Еженедельная уборка
        description: 'Профессиональная уборка помещений любой сложности. Работаем быстро и качественно.',
    },
    {
        id: 'p3',
        name: 'Строитель Профи',
        rating: 4.9,
        reviews: 80,
        isCompany: true,
        avatar: 'https://via.placeholder.com/150/ADD8E6/000000?text=СП',
        services: ['s4', 's5'], // Укладка плитки, Малярные работы
        offers: ['o7', 'o8', 'o9', 'o10'], // Ванная комната, Кухня, Покраска стен, Поклейка обоев
        description: 'Бригада опытных строителей. Выполняем ремонтные и отделочные работы.',
    },
    {
        id: 'p4',
        name: 'Гаджиев Руфат',
        rating: 4.7,
        reviews: 90,
        isCompany: false,
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        services: ['s2'], // Электрик
        offers: ['o3', 'o4'], // Ремонт проводки, Установка розеток
        description: 'Сертифицированный электрик. Решение любых проблем с электричеством.',
    },
];

const PerformerListScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryId, categoryName, selectedService, selectedOffers, performerType } = route.params;

    const [performers, setPerformers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            let filteredPerformers = DUMMY_PERFORMERS.filter(p => {
                const serviceMatch = selectedService ? p.services.includes(selectedService.id) : true;
                const performerTypeMatch = performerType ? (performerType === 'private' ? !p.isCompany : p.isCompany) : true;
                const offersMatch = selectedOffers.length > 0 ? selectedOffers.every(so => p.offers.includes(so.id)) : true;

                return serviceMatch && performerTypeMatch && offersMatch;
            });
            setPerformers(filteredPerformers);
            setLoading(false);
        }, 800);
    }, [categoryId, selectedService, selectedOffers, performerType]);

    const handleOfferToPerformer = (performer) => {
        Alert.alert(
            'Предложить заказ',
            `Вы хотите предложить заказ "${selectedService.name}" исполнителю ${performer.name}?`,
            [
                { text: 'Нет', style: 'cancel' },
                {
                    text: 'Да',
                    onPress: () => {
                        navigation.navigate('RequestCreation', {
                            categoryName,
                            categoryId,
                            selectedService,
                            selectedOffers,
                            performerType,
                            targetPerformer: performer,
                            requestType: 'to_one',
                        });
                    }
                },
            ]
        );
    };

    const handleSendGeneralRequest = () => {
        Alert.alert(
            'Отправить общий запрос',
            `Ваш запрос "${selectedService.name}" будет отправлен всем подходящим исполнителям.`,
            [
                { text: 'Нет', style: 'cancel' },
                {
                    text: 'Да',
                    onPress: () => {
                        navigation.navigate('RequestCreation', {
                            categoryName,
                            categoryId,
                            selectedService,
                            selectedOffers,
                            performerType,
                            requestType: 'to_all',
                        });
                    }
                },
            ]
        );
    };

    const handleViewPerformerProfile = (performer) => {
        navigation.navigate('PerformerProfile', {
            performerId: performer.id,
            // Передаем также контекст, чтобы кнопка "Предложить заказ" была доступна
            // если клиент пришел из потока создания запроса
            categoryName: categoryName,
            categoryId: categoryId,
            selectedService: selectedService,
            selectedOffers: selectedOffers,
            requestType: 'from_performer_list', // Индикатор, что пришли из списка
        });
    };

    const renderPerformerItem = ({ item: performer }) => (
        <TouchableOpacity style={styles.performerItem} onPress={() => handleViewPerformerProfile(performer)}>
            <Image source={{ uri: performer.avatar }} style={styles.performerAvatar} />
            <View style={styles.performerInfo}>
                <Text style={styles.performerName}>{performer.name}</Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{performer.rating} ({performer.reviews} reviews)</Text>
                </View>
                <Text style={styles.performerType}>
                    {performer.isCompany ? 'Компания' : 'Частный специалист'}
                </Text>
                <Text style={styles.performerDescription} numberOfLines={2}>
                    {performer.description}
                </Text>
            </View>
            <TouchableOpacity style={styles.offerButton} onPress={() => handleOfferToPerformer(performer)}>
                <Text style={styles.offerButtonText}>Предложить заказ</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={{ marginTop: 10 }}>Поиск исполнителей...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Исполнители</Text>
            </View>

            <Text style={styles.filterInfo}>
                Поиск по: {selectedService?.name || categoryName}
                {selectedOffers.length > 0 && ` (${selectedOffers.map(o => o.name).join(', ')})`}
                {performerType && `, ${performerType === 'private' ? 'Частные' : 'Компании'}`}
            </Text>

            {performers.length === 0 ? (
                <View style={styles.emptyListContainer}>
                    <Text style={styles.emptyListText}>
                        Извините, исполнителей по вашему запросу не найдено.
                    </Text>
                    <TouchableOpacity style={styles.generalRequestButton} onPress={handleSendGeneralRequest}>
                        <Text style={styles.generalRequestButtonText}>Отправить общий запрос всем</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={performers}
                        renderItem={renderPerformerItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContent}
                    />
                    <TouchableOpacity style={styles.generalRequestButton} onPress={handleSendGeneralRequest}>
                        <Text style={styles.generalRequestButtonText}>Отправить общий запрос всем</Text>
                    </TouchableOpacity>
                </>
            )}

            <View style={{ height: 20 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: '#f8f8f8',
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
    filterInfo: {
        fontSize: 14,
        color: '#666',
        marginHorizontal: 20,
        marginBottom: 15,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    performerItem: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    performerAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        backgroundColor: '#e0e0e0',
    },
    performerInfo: {
        flex: 1,
        marginRight: 10,
    },
    performerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    ratingText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    performerType: {
        fontSize: 13,
        color: '#888',
        marginBottom: 5,
    },
    performerDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    offerButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    offerButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    generalRequestButton: {
        backgroundColor: '#333',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: Platform.OS === 'ios' ? 30 : 20,
    },
    generalRequestButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 20,
    },
    emptyListText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
        marginBottom: 20,
    },
});

export default PerformerListScreen;