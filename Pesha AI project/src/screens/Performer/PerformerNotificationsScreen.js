// src/screens/Performer/PerformerNotificationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DUMMY_NOTIFICATIONS = [
    {
        id: 'notif1',
        type: 'new_order_offer',
        title: 'Новое предложение заказа: Электрик',
        message: 'Поступил новый заказ "Установка розеток" от Марии И. Просмотрите детали и сделайте предложение.',
        orderId: 'req1',
        isRead: false,
        createdAt: '2025-07-05T10:00:00Z',
    },
    {
        id: 'notif2',
        type: 'offer_accepted',
        title: 'Ваше предложение принято!',
        message: 'Клиент Ахмед Р. принял ваше предложение по заказу "Замена смесителя". Свяжитесь с клиентом!',
        orderId: 'req5',
        isRead: false,
        createdAt: '2025-07-05T09:30:00Z',
    },
    {
        id: 'notif3',
        type: 'chat_message',
        title: 'Новое сообщение в чате',
        message: 'У вас новое сообщение от клиента Марии И. по заказу "Установка розеток".',
        orderId: 'req1',
        isRead: false,
        createdAt: '2025-07-05T09:15:00Z',
    },
    {
        id: 'notif4',
        type: 'order_status_change',
        title: 'Статус заказа изменен: Устранить течь',
        message: 'Заказ "Устранить течь" (req2) был отмечен клиентом как "Завершенный".',
        orderId: 'req2',
        isRead: true,
        createdAt: '2025-07-04T18:00:00Z',
    },
    {
        id: 'notif5',
        type: 'order_cancelled',
        title: 'Заказ отменен: Покраска стен',
        message: 'Клиент Денис отменил заказ "Покраска стен" (req4).',
        orderId: 'req4',
        isRead: true,
        createdAt: '2025-07-03T16:00:00Z',
    },
    {
        id: 'notif6',
        type: 'new_order_offer',
        title: 'Новое предложение заказа: Уборка',
        message: 'Поступил новый заказ "Еженедельная уборка" от Фатимы А.',
        orderId: 'req6',
        isRead: false,
        createdAt: '2025-07-02T14:00:00Z',
    },
];

const PerformerNotificationsScreen = () => {
    const navigation = useNavigation();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Имитация загрузки уведомлений
        setTimeout(() => {
            setNotifications(DUMMY_NOTIFICATIONS.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setLoading(false);
        }, 800);
    }, []);

    const handleNotificationPress = (notification) => {
        // Отметить уведомление как прочитанное
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));

        // В зависимости от типа уведомления, переходим на соответствующий экран
        switch (notification.type) {
            case 'new_order_offer':
            case 'offer_accepted':
            case 'order_status_change':
            case 'order_cancelled':
                navigation.navigate('OrdersTab', { screen: 'PerformerOrderDetails', params: { orderId: notification.orderId } });
                break;
            case 'chat_message':
                // В реальном приложении нужно передать clientID для чата
                navigation.navigate('OrdersTab', { screen: 'Chat', params: { orderId: notification.orderId, currentUserId: 'performer1' } });
                break;
            default:
                Alert.alert('Уведомление', notification.message);
                break;
        }
    };

    const renderNotificationItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.notificationCard, item.isRead ? styles.readNotification : styles.unreadNotification]}
            onPress={() => handleNotificationPress(item)}
        >
            <View style={styles.notificationIcon}>
                <Ionicons
                    name={getNotificationIcon(item.type)}
                    size={24}
                    color={item.isRead ? '#999' : '#FFD700'}
                />
            </View>
            <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage} numberOfLines={2}>{item.message}</Text>
                <Text style={styles.notificationDate}>
                    {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                </Text>
            </View>
            {!item.isRead && (
                <View style={styles.unreadDot} />
            )}
        </TouchableOpacity>
    );

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'new_order_offer':
                return 'briefcase-outline';
            case 'offer_accepted':
                return 'checkmark-circle-outline';
            case 'chat_message':
                return 'chatbubbles-outline';
            case 'order_status_change':
                return 'reload-outline';
            case 'order_cancelled':
                return 'close-circle-outline';
            default:
                return 'information-circle-outline';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={{ marginTop: 10 }}>Загрузка уведомлений...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Уведомления</Text>
                {/* В будущем здесь может быть кнопка "Очистить все" или "Отметить все прочитанным" */}
                {notifications.some(n => !n.isRead) && (
                    <TouchableOpacity onPress={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}>
                        <Text style={styles.markAllReadText}>Отметить все прочитанным</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList
                data={notifications}
                renderItem={renderNotificationItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                        <Ionicons name="notifications-off-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyListText}>У вас пока нет уведомлений.</Text>
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
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    markAllReadText: {
        fontSize: 14,
        color: '#007AFF',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    notificationCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
        elevation: 2,
        position: 'relative',
    },
    unreadNotification: {
        borderLeftWidth: 5,
        borderLeftColor: '#FFD700', // Яркий цвет для непрочитанных
    },
    readNotification: {
        borderLeftWidth: 5,
        borderLeftColor: '#e0e0e0', // Более тусклый для прочитанных
        opacity: 0.8,
    },
    notificationIcon: {
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    notificationDate: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 5,
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFD700',
        position: 'absolute',
        top: 10,
        right: 10,
    },
    emptyListContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
        marginTop: 50,
    },
    emptyListText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 15,
    },
});

export default PerformerNotificationsScreen;