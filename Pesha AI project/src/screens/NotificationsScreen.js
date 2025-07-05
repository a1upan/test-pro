// src/screens/NotificationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // useIsFocused для обновления при фокусировке

// Временное глобальное хранилище для уведомлений
// В реальном приложении это будет поступать из Redux, Context API или API
let DUMMY_NOTIFICATIONS = [
    {
        id: 'notif1',
        userId: 'client1', // Для клиента
        type: 'newOffer',
        message: 'На ваш заказ "Установка розеток" поступило новое предложение от Ивана Иванова!',
        read: false,
        createdAt: '2025-07-04T10:30:00Z',
        relatedOrderId: 'req1',
    },
    {
        id: 'notif2',
        userId: 'performer1', // Для исполнителя
        type: 'offerAccepted',
        message: 'Ваше предложение по заказу "Замена смесителя" было принято клиентом Ахмед Р.!',
        read: false,
        createdAt: '2025-07-04T11:00:00Z',
        relatedOrderId: 'req5',
    },
    {
        id: 'notif3',
        userId: 'client1',
        type: 'orderCompleted',
        message: 'Исполнитель Олег Профессионал завершил работу по вашему заказу "Генеральная уборка". Пожалуйста, оставьте отзыв.',
        read: false,
        createdAt: '2025-07-04T12:00:00Z',
        relatedOrderId: 'req8',
    },
    {
        id: 'notif4',
        userId: 'performer1',
        type: 'newOrder',
        message: 'Появился новый заказ в вашей категории "Электрик": "Мелкий ремонт проводки"',
        read: true,
        createdAt: '2025-07-03T09:00:00Z',
        relatedOrderId: 'req9',
    },
    {
        id: 'notif5',
        userId: 'client1',
        type: 'orderCanceled',
        message: 'Ваш заказ "Починка водонагревателя" был отменен вами.',
        read: true,
        createdAt: '2025-07-02T14:00:00Z',
        relatedOrderId: 'req7',
    },
    {
        id: 'notif6',
        userId: 'performer1',
        type: 'orderCanceledByClient',
        message: 'Клиент отменил заказ "Замена замка".',
        read: false,
        createdAt: '2025-07-05T09:00:00Z',
        relatedOrderId: 'req10',
    },
];

// Функция для добавления нового уведомления
export const addNotification = (userId, type, message, relatedOrderId = null) => {
    const newNotification = {
        id: `notif${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        userId: userId,
        type: type,
        message: message,
        read: false,
        createdAt: new Date().toISOString(),
        relatedOrderId: relatedOrderId,
    };
    DUMMY_NOTIFICATIONS.unshift(newNotification); // Добавляем в начало списка
    console.log('Новое уведомление добавлено:', newNotification);
};


const NotificationsScreen = ({ route }) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const { userType, userId } = route.params; // Получаем тип пользователя и ID

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isFocused) {
            setLoading(true);
            // Имитация загрузки уведомлений для текущего пользователя
            setTimeout(() => {
                const userNotifications = DUMMY_NOTIFICATIONS.filter(notif => notif.userId === userId);
                setNotifications(userNotifications);
                setLoading(false);
            }, 500);
        }
    }, [isFocused, userId]);

    const markAsRead = (notificationId) => {
        // Имитация пометки уведомления как прочитанного
        DUMMY_NOTIFICATIONS = DUMMY_NOTIFICATIONS.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
        );
        setNotifications(prev => prev.map(notif =>
            notif.id === notificationId ? { ...notif, read: true } : notif
        ));
    };

    const handleNotificationPress = (notification) => {
        markAsRead(notification.id); // Помечаем как прочитанное при нажатии

        if (notification.relatedOrderId) {
            // В зависимости от типа пользователя и типа уведомления, переходим на соответствующий экран
            if (userType === 'client') {
                if (notification.type === 'newOffer' || notification.type === 'orderCompleted') {
                    navigation.navigate('ClientOrdersTab', {
                        screen: 'ClientOrderDetails',
                        params: { orderId: notification.relatedOrderId },
                    });
                } else if (notification.type === 'orderCanceled' || notification.type === 'orderAssigned') { // Допустим, будет такой тип
                    navigation.navigate('ClientOrdersTab', {
                        screen: 'ClientOrderDetails',
                        params: { orderId: notification.relatedOrderId },
                    });
                }
            } else if (userType === 'performer') {
                if (notification.type === 'offerAccepted' || notification.type === 'newOrder' || notification.type === 'orderCanceledByClient') {
                    navigation.navigate('PerformerOrdersTab', { // или DashboardTab, если удобнее
                        screen: 'PerformerOrderDetails',
                        params: { orderId: notification.relatedOrderId },
                    });
                }
            }
        } else {
            Alert.alert('Уведомление', notification.message);
        }
    };

    const renderNotificationItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.notificationCard, item.read ? styles.readCard : styles.unreadCard]}
            onPress={() => handleNotificationPress(item)}
        >
            <View style={styles.iconContainer}>
                <Ionicons
                    name={getNotificationIcon(item.type)}
                    size={24}
                    color={item.read ? '#666' : '#333'}
                />
            </View>
            <View style={styles.contentContainer}>
                <Text style={[styles.notificationMessage, item.read ? styles.readMessage : styles.unreadMessage]}>
                    {item.message}
                </Text>
                <Text style={styles.notificationTime}>
                    {new Date(item.createdAt).toLocaleString()}
                </Text>
            </View>
            {!item.read && (
                <View style={styles.unreadDot} />
            )}
        </TouchableOpacity>
    );

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'newOffer':
                return 'mail-outline';
            case 'offerAccepted':
                return 'checkmark-circle-outline';
            case 'orderCompleted':
                return 'ribbon-outline';
            case 'newOrder':
                return 'briefcase-outline';
            case 'orderCanceled':
            case 'orderCanceledByClient':
                return 'close-circle-outline';
            case 'orderAssigned':
                return 'person-add-outline';
            default:
                return 'notifications-outline';
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
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Уведомления</Text>
                {notifications.some(n => !n.read) && (
                    <TouchableOpacity
                        onPress={() => {
                            DUMMY_NOTIFICATIONS = DUMMY_NOTIFICATIONS.map(notif => notif.userId === userId ? { ...notif, read: true } : notif);
                            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
                            Alert.alert('Все прочитано', 'Все уведомления помечены как прочитанные.');
                        }}
                        style={styles.markAllReadButton}
                    >
                        <Text style={styles.markAllReadButtonText}>Отметить все как прочитанные</Text>
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
                        <Ionicons name="notifications-off-outline" size={80} color="#ccc" />
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
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 5,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    markAllReadButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#eee',
    },
    markAllReadButtonText: {
        fontSize: 12,
        color: '#555',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
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
    unreadCard: {
        borderLeftWidth: 5,
        borderLeftColor: '#FFD700',
    },
    readCard: {
        backgroundColor: '#f5f5f5',
    },
    iconContainer: {
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
    },
    notificationMessage: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 5,
    },
    unreadMessage: {
        fontWeight: 'bold',
        color: '#333',
    },
    readMessage: {
        color: '#666',
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FFD700',
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
});

export default NotificationsScreen;