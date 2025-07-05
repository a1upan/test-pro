// src/screens/Performer/PerformerDashboardScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Platform, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RequestStatus } from '../../constants/types';
import { DUMMY_NOTIFICATIONS } from '../NotificationsScreen'; // Импортируем для подсчета непрочитанных

// Имитация данных (заглушка)
let DUMMY_PERFORMER_ORDERS = {
    'req1': {
        id: 'req1',
        category: 'Электрик',
        serviceName: 'Установка розеток',
        description: 'Нужен электрик для установки 5 двойных розеток в гостиной и спальне.',
        status: RequestStatus.PENDING,
        createdAt: '2025-07-01T10:00:00Z',
        clientName: 'Мария И.',
        offers: [
            { performerId: 'perf1', price: 60, comment: 'Готов выполнить завтра.', createdAt: '2025-07-02T15:00:00Z' }
        ], // Пример, что исполнитель уже сделал предложение
        assignedPerformerId: null,
    },
    'req5': {
        id: 'req5',
        category: 'Сантехник',
        serviceName: 'Замена смесителя',
        description: 'Требуется замена старого смесителя на новый на кухне.',
        status: RequestStatus.ACTIVE,
        createdAt: '2025-07-03T11:00:00Z',
        clientName: 'Ахмед Р.',
        assignedPerformerId: 'perf1', // Исполнитель назначен
    },
    'req6': {
        id: 'req6',
        category: 'Мелкий ремонт',
        serviceName: 'Повесить полку',
        description: 'Нужно повесить две книжные полки на стену в гостиной. Все инструменты есть.',
        status: RequestStatus.PENDING,
        createdAt: '2025-07-04T09:30:00Z',
        clientName: 'Ольга С.',
        offers: [], // Исполнитель еще не делал предложение
        assignedPerformerId: null,
    },
    'req2': {
        id: 'req2',
        category: 'Сантехник',
        serviceName: 'Устранить течь',
        description: 'Течет кран в ванной, нужна срочная помощь.',
        status: RequestStatus.COMPLETED,
        createdAt: '2025-06-25T14:30:00Z',
        clientName: 'Клиент Андрей',
        assignedPerformerId: 'perf3', // Назначен другой исполнитель
    }
};

const DUMMY_NEW_ORDERS_FEED = [ // Имитация ленты новых заказов
    {
        id: 'new1',
        category: 'Электрик',
        serviceName: 'Ремонт проводки в квартире',
        description: 'Короткое замыкание, нужна диагностика и ремонт.',
        createdAt: '2025-07-05T09:00:00Z',
        clientName: 'Ирина К.',
        address: 'ул. Гянджлик 12, Баку',
        clientExpectedPrice: 100,
        preferredTime: 'Срочно'
    },
    {
        id: 'new2',
        category: 'Малярные работы',
        serviceName: 'Покраска стен в спальне',
        description: 'Комната 15 кв.м, требуется покраска стен в светлый цвет.',
        createdAt: '2025-07-05T09:15:00Z',
        clientName: 'Самир А.',
        address: 'пр. Нефтяников 5, Баку',
        clientExpectedPrice: null,
        preferredTime: 'На выходных'
    },
];

const PerformerDashboardScreen = () => {
    const navigation = useNavigation();
    const [activeOrders, setActiveOrders] = useState([]);
    const [ordersWithMyOffers, setOrdersWithMyOffers] = useState([]);
    const [newOrdersFeed, setNewOrdersFeed] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    const PERFORMER_ID = 'performer1'; // Имитация ID текущего исполнителя

    const fetchOrdersAndNotifications = () => {
        setLoading(true);
        setTimeout(() => {
            const allOrders = Object.values(DUMMY_PERFORMER_ORDERS);
            const active = allOrders.filter(order => order.status === RequestStatus.ACTIVE && order.assignedPerformerId === PERFORMER_ID);
            const offersMade = allOrders.filter(order =>
                order.status === RequestStatus.PENDING &&
                order.offers &&
                order.offers.some(offer => offer.performerId === PERFORMER_ID)
            );

            setActiveOrders(active);
            setOrdersWithMyOffers(offersMade);
            setNewOrdersFeed(DUMMY_NEW_ORDERS_FEED); // Загружаем имитацию новых заказов

            // Подсчет непрочитанных уведомлений
            const unreadCount = DUMMY_NOTIFICATIONS.filter(notif => notif.userId === PERFORMER_ID && !notif.read).length;
            setUnreadNotificationsCount(unreadCount);

            setLoading(false);
            setRefreshing(false);
        }, 800);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchOrdersAndNotifications();
            return () => { };
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrdersAndNotifications();
    };

    const handleViewOrderDetails = (orderId) => {
        navigation.navigate('PerformerOrderDetails', { orderId: orderId });
    };

    const handleNotificationsPress = () => {
        navigation.navigate('NotificationsScreen', { userType: 'performer', userId: PERFORMER_ID });
    };

    const renderOrderCard = (order, isNewOrder = false) => (
        <TouchableOpacity key={order.id} style={isNewOrder ? styles.newOrderCard : styles.orderCard} onPress={() => handleViewOrderDetails(order.id)}>
            <View style={styles.orderCardHeader}>
                <Text style={styles.orderCategory}>{order.category}</Text>
                {!isNewOrder && <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>{order.status}</Text>}
            </View>
            <Text style={styles.orderTitle}>{order.serviceName}</Text>
            <Text style={styles.orderDescription} numberOfLines={2}>{order.description}</Text>
            <View style={styles.orderInfoRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.orderInfoText}>{order.address || 'Адрес не указан'}</Text>
            </View>
            <View style={styles.orderInfoRow}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.orderInfoText}>{order.preferredTime || 'Время не указано'}</Text>
            </View>
            {order.clientExpectedPrice && (
                <View style={styles.orderInfoRow}>
                    <Ionicons name="pricetag-outline" size={16} color="#666" />
                    <Text style={styles.orderInfoText}>Бюджет: {order.clientExpectedPrice} AZN</Text>
                </View>
            )}
            {!isNewOrder && order.status === RequestStatus.PENDING && order.offers && order.offers.some(offer => offer.performerId === PERFORMER_ID) && (
                <Text style={styles.myOfferNote}>Вы уже сделали предложение</Text>
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
                        {/* Секция "Новые заказы в вашем районе/категориях" */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Новые доступные заказы ({newOrdersFeed.length})</Text>
                            {newOrdersFeed.length === 0 ? (
                                <Text style={styles.noOrdersText}>Пока нет новых заказов, соответствующих вашим категориям.</Text>
                            ) : (
                                newOrdersFeed.map(order => renderOrderCard(order, true))
                            )}
                        </View>

                        {/* Секция "Активные заказы" (назначены вам) */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Мои активные заказы ({activeOrders.length})</Text>
                            {activeOrders.length === 0 ? (
                                <Text style={styles.noOrdersText}>У вас пока нет активных назначенных заказов.</Text>
                            ) : (
                                activeOrders.map(renderOrderCard)
                            )}
                        </View>

                        {/* Секция "Заказы, на которые вы сделали предложения" */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Заказы, на которые вы сделали предложения ({ordersWithMyOffers.length})</Text>
                            {ordersWithMyOffers.length === 0 ? (
                                <Text style={styles.noOrdersText}>Вы пока не делали предложений по заказам.</Text>
                            ) : (
                                ordersWithMyOffers.map(renderOrderCard)
                            )}
                        </View>

                        {/* Место для других разделов, например, "Мои услуги", "Отзывы" */}
                        {/* <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Мой профиль и услуги</Text>
                            <Text style={styles.noOrdersText}>Здесь будет информация о ваших услугах и категориях.</Text>
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
    newOrderCard: {
        backgroundColor: '#e6ffe6', // Светло-зеленый фон для новых заказов
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#4CAF50',
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
    orderInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    orderInfoText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    myOfferNote: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#FFA500',
        marginTop: 5,
        textAlign: 'right',
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
});

export default PerformerDashboardScreen;