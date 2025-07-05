// src/screens/Client/ClientDashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RequestStatus } from '../../constants/types';
import { DUMMY_NOTIFICATIONS } from '../NotificationsScreen'; // Импортируем для подсчета непрочитанных

// Имитация данных (заглушка)
let DUMMY_CLIENT_ORDERS = {
    'req1': {
        id: 'req1',
        category: 'Электрик',
        serviceName: 'Установка розеток',
        description: 'Нужен электрик для установки 5 двойных розеток в гостиной и спальне.',
        status: RequestStatus.PENDING,
        createdAt: '2025-07-01T10:00:00Z',
        offers: [
            { performerId: 'perf1', performerName: 'Иван Иванов', price: 60, comment: 'Готов выполнить завтра.', rating: 4.7, reviewsCount: 35, categories: ['Электрик', 'Сантехник'], avatar: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=ИИ', createdAt: '2025-07-02T15:00:00Z' },
            { performerId: 'perf2', performerName: 'Петр Петров', price: 65, comment: 'Сделаю быстро и качественно.', rating: 4.8, reviewsCount: 25, categories: ['Электрик'], avatar: 'https://via.placeholder.com/150/FFC0CB/FFFFFF?text=ПП', createdAt: '2025-07-02T16:00:00Z' },
        ],
        assignedPerformerId: null,
        assignedPerformerName: null,
    },
    'req5': {
        id: 'req5',
        category: 'Сантехник',
        serviceName: 'Замена смесителя',
        description: 'Требуется замена старого смесителя на новый на кухне.',
        status: RequestStatus.ACTIVE,
        createdAt: '2025-07-03T11:00:00Z',
        offers: [],
        assignedPerformerId: 'perf1',
        assignedPerformerName: 'Иван Иванов',
    },
    'req2': {
        id: 'req2',
        category: 'Сантехник',
        serviceName: 'Устранить течь',
        description: 'Течет кран в ванной, нужна срочная помощь.',
        status: RequestStatus.COMPLETED,
        createdAt: '2025-06-25T14:30:00Z',
        offers: [],
        assignedPerformerId: 'perf3',
        assignedPerformerName: 'Анна Мастер',
    },
    'req8': {
        id: 'req8',
        category: 'Клининг',
        serviceName: 'Генеральная уборка',
        description: 'Нужна генеральная уборка после ремонта.',
        status: RequestStatus.COMPLETED,
        createdAt: '2025-06-20T10:00:00Z',
        offers: [],
        assignedPerformerId: 'perf4',
        assignedPerformerName: 'Олег Профессионал',
    }
};

// Временные данные для популярных услуг (можно получать из API)
const POPULAR_SERVICES = [
    { id: 'ps1', name: 'Услуги электрика', icon: 'flash-outline' },
    { id: 'ps2', name: 'Услуги сантехника', icon: 'water-outline' },
    { id: 'ps3', name: 'Уборка квартир', icon: 'sparkles-outline' },
    { id: 'ps4', name: 'Компьютерная помощь', icon: 'desktop-outline' },
];

const ClientDashboardScreen = () => {
    const navigation = useNavigation();
    const [activeOrders, setActiveOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    const CLIENT_ID = 'client1'; // Имитация ID текущего клиента

    const fetchOrdersAndNotifications = () => {
        setLoading(true);
        // Имитация задержки сети
        setTimeout(() => {
            const allOrders = Object.values(DUMMY_CLIENT_ORDERS);
            const active = allOrders.filter(order => order.status === RequestStatus.ACTIVE);
            const pending = allOrders.filter(order => order.status === RequestStatus.PENDING);
            setActiveOrders(active);
            setPendingOrders(pending);

            // Подсчет непрочитанных уведомлений
            const unreadCount = DUMMY_NOTIFICATIONS.filter(notif => notif.userId === CLIENT_ID && !notif.read).length;
            setUnreadNotificationsCount(unreadCount);

            setLoading(false);
            setRefreshing(false);
        }, 800);
    };

    // Используем useFocusEffect для обновления данных при фокусировке на экране
    useFocusEffect(
        React.useCallback(() => {
            fetchOrdersAndNotifications();
            // Возвращаем функцию очистки, которая будет вызвана при расфокусировке
            return () => {
                // Можно добавить логику для отмены запросов или очистки состояния, если это необходимо
            };
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrdersAndNotifications();
    };

    const handleCreateOrderPress = () => {
        navigation.navigate('ClientCreateOrderTab');
    };

    const handleViewOrderDetails = (orderId) => {
        navigation.navigate('ClientOrderDetails', { orderId: orderId });
    };

    const handleBrowseCategories = () => {
        navigation.navigate('ClientBrowseTab'); // Переход на таб "Поиск"
    };

    const handleNotificationsPress = () => {
        navigation.navigate('NotificationsScreen', { userType: 'client', userId: CLIENT_ID });
    };

    const renderOrderCard = (order) => (
        <TouchableOpacity key={order.id} style={styles.orderCard} onPress={() => handleViewOrderDetails(order.id)}>
            <View style={styles.orderCardHeader}>
                <Text style={styles.orderCategory}>{order.category}</Text>
                <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>{order.status}</Text>
            </View>
            <Text style={styles.orderTitle}>{order.serviceName}</Text>
            <Text style={styles.orderDescription} numberOfLines={2}>{order.description}</Text>
            {order.status === RequestStatus.PENDING && order.offers && order.offers.length > 0 && (
                <Text style={styles.offersCount}>{order.offers.length} новых предложений</Text>
            )}
            {order.assignedPerformerName && (
                <Text style={styles.assignedPerformer}>Исполнитель: {order.assignedPerformerName}</Text>
            )}
            <Text style={styles.orderDate}>Создан: {new Date(order.createdAt).toLocaleDateString()}</Text>
        </TouchableOpacity>
    );

    const getStatusColor = (status) => {
        switch (status) {
            case RequestStatus.PENDING:
                return '#FFA500'; // Orange
            case RequestStatus.ACTIVE:
                return '#4CAF50'; // Green
            case RequestStatus.COMPLETED:
                return '#2196F3'; // Blue
            case RequestStatus.CANCELED_BY_CLIENT:
            case RequestStatus.CANCELED_BY_PERFORMER:
            case RequestStatus.CLOSED_AUTOMATICALLY:
                return '#F44336'; // Red
            default:
                return '#9E9E9E'; // Gray
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#FFD700']}
                        tintColor="#FFD700"
                    />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Главная</Text>
                    <TouchableOpacity style={styles.notificationsButton} onPress={handleNotificationsPress}>
                        <Ionicons name="notifications-outline" size={28} color="#333" />
                        {unreadNotificationsCount > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationBadgeText}>{unreadNotificationsCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FFD700" />
                        <Text style={{ marginTop: 10, color: '#555' }}>Загрузка данных...</Text>
                    </View>
                ) : (
                    <>
                        {/* Раздел "Создать новый заказ" */}
                        <TouchableOpacity style={styles.createOrderButton} onPress={handleCreateOrderPress}>
                            <Ionicons name="add-circle-outline" size={30} color="#333" />
                            <Text style={styles.createOrderButtonText}>Создать новый заказ</Text>
                        </TouchableOpacity>

                        {/* Раздел "Поиск услуг и исполнителей" */}
                        <TouchableOpacity style={styles.searchServicesButton} onPress={handleBrowseCategories}>
                            <Ionicons name="search-outline" size={26} color="#333" />
                            <Text style={styles.searchServicesButtonText}>Найти услуги и исполнителей</Text>
                        </TouchableOpacity>


                        {/* Секция Активные Заказы */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Активные заказы ({activeOrders.length})</Text>
                            {activeOrders.length === 0 ? (
                                <Text style={styles.noOrdersText}>У вас пока нет активных заказов.</Text>
                            ) : (
                                activeOrders.map(renderOrderCard)
                            )}
                        </View>

                        {/* Секция Заказы в ожидании предложений */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Заказы в ожидании предложений ({pendingOrders.length})</Text>
                            {pendingOrders.length === 0 ? (
                                <Text style={styles.noOrdersText}>Все ваши заказы в ожидании обработаны или отменены.</Text>
                            ) : (
                                pendingOrders.map(renderOrderCard)
                            )}
                        </View>

                        {/* Секция "Популярные услуги" */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Популярные услуги</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularServicesContainer}>
                                {POPULAR_SERVICES.map(service => (
                                    <TouchableOpacity key={service.id} style={styles.popularServiceCard} onPress={() => navigation.navigate('ClientBrowseTab', { screen: 'ClientPerformersByCategory', params: { category: service.name.replace('Услуги ', '').replace(' квартир', '') } })}>
                                        <Ionicons name={service.icon} size={30} color="#FFD700" />
                                        <Text style={styles.popularServiceText}>{service.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Место для других разделов, например, "Рекомендуемые исполнители" или "История заказов" */}
                        {/* <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Рекомендуемые исполнители</Text>
                            <Text style={styles.noOrdersText}>Здесь будут рекомендации.</Text>
                        </View> */}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200, // Высота для загрузки
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    notificationsButton: {
        position: 'relative',
        padding: 5,
    },
    notificationBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#F44336', // Красный для непрочитанных
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    notificationBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    createOrderButton: {
        flexDirection: 'row',
        backgroundColor: '#FFD700',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    createOrderButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    searchServicesButton: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 18,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    searchServicesButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    section: {
        marginTop: 25,
        marginHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderCategory: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    orderStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    orderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    orderDescription: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
    },
    offersCount: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFA500',
        marginTop: 5,
    },
    assignedPerformer: {
        fontSize: 13,
        color: '#4CAF50',
        fontWeight: 'bold',
        marginTop: 5,
    },
    orderDate: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 5,
    },
    noOrdersText: {
        fontSize: 15,
        color: '#777',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 10,
    },
    popularServicesContainer: {
        paddingRight: 10, // Чтобы последняя карточка не прилипала к краю
    },
    popularServiceCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        width: 130, // Фиксированная ширина карточки
        height: 120, // Фиксированная высота карточки
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    popularServiceText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default ClientDashboardScreen;