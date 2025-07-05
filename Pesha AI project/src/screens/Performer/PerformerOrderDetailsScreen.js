// src/screens/Performer/PerformerOrderDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, Linking, Modal, TextInput } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RequestStatus } from '../../constants/types';

// Имитация данных
// Это будет глобальный или серверный стейт в реальном приложении
// Здесь мы храним offers непосредственно в заказе
let DUMMY_ORDERS_PERFORMER_VIEW = {
    'req1': {
        id: 'req1',
        category: 'Электрик',
        serviceName: 'Установка розеток',
        offersDetails: ['Установка 5 новых розеток', 'Проверка проводки'],
        description: 'Нужен электрик для установки 5 двойных розеток в гостиной и спальне. Также требуется проверить состояние существующей проводки. Предпочтительное время: будни после 18:00.',
        address: 'ул. Азадлыг 10, кв. 5, Сумгаит',
        clientExpectedPrice: null,
        status: RequestStatus.PENDING,
        createdAt: '2025-07-01T10:00:00Z',
        preferredTime: 'Будни после 18:00',
        clientName: 'Мария И.',
        clientId: 'client1',
        clientPhone: '+994551112233',
        clientRating: 4.7,
        assignedPerformerId: null,
        assignedPerformerName: null,
        isReviewed: false,
        offers: [ // Теперь у заказа есть массив offers
            {
                performerId: 'perf_other', // Другой исполнитель
                performerName: 'Другой Исполнитель',
                price: 70,
                comment: 'Готов выполнить срочно!',
                createdAt: '2025-07-02T12:00:00Z',
                rating: 4.0,
                reviewsCount: 10,
                categories: ['Электрик'],
                avatar: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=ДИ'
            },
            {
                performerId: 'perf1', // Текущий исполнитель (Иван Иванов)
                performerName: 'Иван Иванов',
                price: 60,
                comment: 'Могу сделать завтра. Опыт 10 лет.',
                createdAt: '2025-07-02T15:00:00Z',
                rating: 4.7,
                reviewsCount: 35,
                categories: ['Электрик', 'Сантехник'],
                avatar: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=ИИ'
            }
        ]
    },
    'req5': {
        id: 'req5',
        category: 'Сантехник',
        serviceName: 'Замена смесителя',
        offersDetails: ['Замена смесителя на кухне'],
        description: 'Требуется замена старого смесителя на новый на кухне. Смеситель уже куплен. Желательно выполнить работу завтра до обеда.',
        address: 'пр. Бюльбюля 20, кв. 8, Сумгаит',
        clientExpectedPrice: 50,
        status: RequestStatus.ACTIVE,
        createdAt: '2025-07-03T11:00:00Z',
        preferredTime: 'Завтра до обеда',
        clientName: 'Ахмед Р.',
        clientId: 'client5',
        clientPhone: '+994709998877',
        clientRating: 4.9,
        assignedPerformerId: 'perf1', // perf1 - назначен на этот заказ
        assignedPerformerName: 'Иван Иванов',
        isReviewed: false,
        offers: [
            {
                performerId: 'perf1',
                performerName: 'Иван Иванов',
                price: 45,
                comment: 'Сделаю быстро и качественно.',
                createdAt: '2025-07-03T12:00:00Z',
                rating: 4.7,
                reviewsCount: 35,
                categories: ['Электрик', 'Сантехник'],
                avatar: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=ИИ'
            }
        ]
    },
    'req2': { // Заказ, на который не было предложений от perf1
        id: 'req2',
        category: 'Сантехник',
        serviceName: 'Устранить течь',
        offersDetails: ['Устранение течи под раковиной'],
        description: 'Течет кран в ванной, нужна срочная помощь.',
        address: 'пр. Азадлыг 55, кв. 12, Баку',
        clientExpectedPrice: 40,
        status: RequestStatus.COMPLETED,
        createdAt: '2025-06-25T14:30:00Z',
        preferredTime: 'В любое время',
        clientName: 'Клиент Андрей',
        clientId: 'client2',
        clientPhone: '+994502223344',
        clientRating: 4.5,
        assignedPerformerId: 'perf3',
        assignedPerformerName: 'Анна Мастер',
        isReviewed: false,
        offers: [] // Нет предложений от perf1
    },
    'req8': {
        id: 'req8',
        category: 'Клининг',
        serviceName: 'Генеральная уборка',
        offersDetails: ['Мойка окон', 'Дезинфекция'],
        description: 'Нужна генеральная уборка после ремонта.',
        address: 'ул. Свободы 1, кв. 1, Баку',
        clientExpectedPrice: 150,
        status: RequestStatus.COMPLETED,
        createdAt: '2025-06-20T10:00:00Z',
        preferredTime: 'В выходные',
        clientName: 'Клиент Елена',
        clientId: 'client8',
        clientPhone: '+994551110011',
        clientRating: 4.7,
        assignedPerformerId: 'perf4',
        assignedPerformerName: 'Олег Профессионал',
        isReviewed: true,
        offers: []
    }
};

const CURRENT_PERFORMER_ID = 'perf1'; // Имитация ID текущего исполнителя

const PerformerOrderDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myOffer, setMyOffer] = useState(null); // Состояние для предложения текущего исполнителя
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            // Имитация загрузки заказа с сервера
            setTimeout(() => {
                const fetchedOrder = DUMMY_ORDERS_PERFORMER_VIEW[orderId];
                if (fetchedOrder) {
                    setOrder(fetchedOrder);
                    // Находим предложение текущего исполнителя
                    const foundOffer = fetchedOrder.offers?.find(offer => offer.performerId === CURRENT_PERFORMER_ID);
                    setMyOffer(foundOffer);
                } else {
                    Alert.alert('Ошибка', 'Заказ не найден.');
                    navigation.goBack();
                }
                setLoading(false);
            }, 500);
            return () => { };
        }, [orderId])
    );

    const handleMakeOffer = () => {
        navigation.navigate('PerformerMakeOffer', {
            orderId: order.id,
            orderTitle: order.serviceName,
            existingOfferPrice: myOffer?.price,
            existingOfferComment: myOffer?.comment,
        });
    };

    const handleWithdrawOffer = () => {
        Alert.alert(
            'Отменить предложение',
            'Вы уверены, что хотите отменить свое предложение по этому заказу?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Отменить',
                    onPress: () => {
                        console.log(`Исполнитель ${CURRENT_PERFORMER_ID} отменил предложение на заказ ${order.id}`);
                        // Имитация удаления предложения из DUMMY_ORDERS_PERFORMER_VIEW
                        DUMMY_ORDERS_PERFORMER_VIEW[order.id].offers = DUMMY_ORDERS_PERFORMER_VIEW[order.id].offers.filter(
                            offer => offer.performerId !== CURRENT_PERFORMER_ID
                        );
                        setMyOffer(null); // Сбросить мое предложение в состоянии
                        Alert.alert('Успех', 'Ваше предложение отменено.');
                    }
                }
            ]
        );
    };

    const handleCompleteOrder = () => {
        Alert.alert(
            'Завершить Заказ',
            'Вы уверены, что работа по этому заказу выполнена?',
            [
                { text: 'Нет', style: 'cancel' },
                {
                    text: 'Да, завершено',
                    onPress: () => {
                        console.log(`Исполнитель ${CURRENT_PERFORMER_ID} отметил заказ ${order.id} как выполненный.`);
                        Alert.alert('Заказ завершен!', 'Клиент будет уведомлен и сможет оставить отзыв.');
                        // В реальном приложении: отправить запрос на сервер для смены статуса
                        setOrder(prev => ({ ...prev, status: RequestStatus.COMPLETED }));
                        navigation.goBack(); // Вернуться к списку заказов
                    }
                },
            ]
        );
    };

    const handleCancelOrder = () => {
        setShowCancelModal(true);
    };

    const confirmCancelOrder = () => {
        if (!cancelReason.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, укажите причину отмены.');
            return;
        }
        Alert.alert(
            'Подтверждение отмены',
            `Вы уверены, что хотите отменить этот заказ? Причина: ${cancelReason}`,
            [
                { text: 'Нет', style: 'cancel' },
                {
                    text: 'Да, отменить',
                    onPress: () => {
                        console.log(`Заказ ${order.id} отменен исполнителем ${CURRENT_PERFORMER_ID}. Причина: ${cancelReason}`);
                        Alert.alert('Заказ отменен', 'Вы отменили этот заказ. Клиент будет уведомлен.');
                        setOrder(prev => ({ ...prev, status: RequestStatus.CANCELED_BY_PERFORMER }));
                        setShowCancelModal(false);
                        navigation.goBack();
                    }
                },
            ]
        );
    };

    const handleCallClient = () => {
        // Здесь можно использовать Linking.openURL(`tel:${order.clientPhone}`)
        Alert.alert('Звонок клиенту', `Функция звонка клиенту ${order.clientName} (${order.clientPhone}) пока не реализована.`);
    };

    const handleChatWithClient = () => {
        navigation.navigate('Chat', {
            orderId: order.id,
            clientId: order.clientId,
            clientName: order.clientName,
            performerId: CURRENT_PERFORMER_ID,
            performerName: order.assignedPerformerName || 'Вы', // Если назначен, то ваше имя
            currentUserId: CURRENT_PERFORMER_ID,
            targetUserId: order.clientId,
        });
    };

    const handleDownloadAttachment = (uri, name) => {
        Alert.alert('Скачать файл', `Функция скачивания "${name}" пока не реализована. URL: ${uri}`);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={{ marginTop: 10 }}>Загрузка деталей заказа...</Text>
            </View>
        );
    }

    if (!order) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Детали заказа не найдены.</Text>
                <TouchableOpacity style={styles.backButtonBottom} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonTextBottom}>Назад</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Детали Заказа</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>{order.category} - {order.serviceName}</Text>
                <Text style={styles.detailText}><Text style={styles.label}>Статус:</Text>
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}> {order.status}</Text>
                </Text>

                <Text style={styles.sectionTitle}>Описание:</Text>
                <Text style={styles.descriptionText}>{order.description}</Text>

                {order.offersDetails && order.offersDetails.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Детали услуги:</Text>
                        {order.offersDetails.map((detail, index) => (
                            <Text key={index} style={styles.detailText}>• {detail}</Text>
                        ))}
                    </>
                )}

                <Text style={styles.sectionTitle}>Адрес и время:</Text>
                <Text style={styles.detailText}><Text style={styles.label}>Адрес:</Text> {order.address}</Text>
                <Text style={styles.detailText}><Text style={styles.label}>Предпочтительное время:</Text> {order.preferredTime}</Text>
                <Text style={styles.detailText}><Text style={styles.label}>Создан:</Text> {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</Text>

                {order.clientExpectedPrice !== null && (
                    <Text style={styles.detailText}><Text style={styles.label}>Ожидаемая цена клиента:</Text> {order.clientExpectedPrice} AZN</Text>
                )}

                {/* Блок для предложения исполнителя */}
                <View style={styles.offerSection}>
                    <Text style={styles.sectionTitle}>Ваше предложение:</Text>
                    {myOffer ? (
                        <View style={styles.myOfferCard}>
                            <Text style={styles.myOfferPrice}>Цена: {myOffer.price} AZN</Text>
                            <Text style={styles.myOfferComment}>"{myOffer.comment}"</Text>
                            <Text style={styles.myOfferDate}>Отправлено: {new Date(myOffer.createdAt).toLocaleDateString()}</Text>
                            <View style={styles.offerActions}>
                                <TouchableOpacity style={styles.offerActionButton} onPress={handleMakeOffer}>
                                    <Ionicons name="pencil-outline" size={20} color="#007AFF" />
                                    <Text style={styles.offerActionButtonText}>Редактировать</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.offerActionButton} onPress={handleWithdrawOffer}>
                                    <Ionicons name="close-circle-outline" size={20} color="#F44336" />
                                    <Text style={styles.offerActionButtonText}>Отменить</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        order.status === RequestStatus.PENDING && (
                            <TouchableOpacity style={styles.makeOfferButton} onPress={handleMakeOffer}>
                                <Text style={styles.makeOfferButtonText}>Сделать Предложение</Text>
                            </TouchableOpacity>
                        )
                    )}
                    {order.status !== RequestStatus.PENDING && !myOffer && (
                        <Text style={styles.noOfferMessage}>На этот заказ уже нельзя сделать предложение или он уже назначен.</Text>
                    )}
                </View>

                {order.attachments && order.attachments.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Вложения:</Text>
                        <View style={styles.attachmentsContainer}>
                            {order.attachments.map((attachment, index) => (
                                <TouchableOpacity key={index} style={styles.attachmentButton} onPress={() => handleDownloadAttachment(attachment.uri, attachment.name)}>
                                    <Ionicons name={attachment.type === 'image' ? 'image-outline' : 'document-outline'} size={20} color="#333" />
                                    <Text style={styles.attachmentButtonText} numberOfLines={1}>{attachment.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                <View style={styles.actionButtonsContainer}>
                    {order.status === RequestStatus.ACTIVE && order.assignedPerformerId === CURRENT_PERFORMER_ID && (
                        <>
                            <TouchableOpacity style={styles.chatButton} onPress={handleChatWithClient}>
                                <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
                                <Text style={styles.chatButtonText}>Чат с клиентом</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.callButton} onPress={handleCallClient}>
                                <Ionicons name="call-outline" size={20} color="#fff" />
                                <Text style={styles.chatButtonText}>Позвонить клиенту</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteOrder}>
                                <Text style={styles.actionButtonText}>Завершить Заказ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
                                <Text style={styles.actionButtonText}>Отменить Заказ</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {order.status === RequestStatus.COMPLETED && order.assignedPerformerId === CURRENT_PERFORMER_ID && order.isReviewed && (
                        <Text style={styles.reviewedMessage}>Клиент уже оставил отзыв по этому заказу.</Text>
                    )}
                    {order.status === RequestStatus.COMPLETED && order.assignedPerformerId === CURRENT_PERFORMER_ID && !order.isReviewed && (
                        <Text style={styles.reviewedMessage}>Ожидаем отзыв от клиента.</Text>
                    )}
                    {order.status.includes('CANCELED') && (
                        <Text style={[styles.statusText, { color: getStatusColor(order.status), textAlign: 'center', marginTop: 20 }]}>Заказ отменен.</Text>
                    )}
                </View>
            </View>

            {/* Модальное окно для отмены */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showCancelModal}
                onRequestClose={() => setShowCancelModal(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Причина отмены заказа</Text>
                        <TextInput
                            style={styles.inputModal}
                            placeholder="Например: нет времени, заказ не соответствует профилю"
                            placeholderTextColor="#888"
                            value={cancelReason}
                            onChangeText={setCancelReason}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => setShowCancelModal(false)}>
                                <Text style={styles.modalButtonText}>Отмена</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]} onPress={confirmCancelOrder}>
                                <Text style={styles.modalButtonText}>Подтвердить отмену</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case RequestStatus.PENDING:
            return '#FFA500';
        case RequestStatus.ACTIVE:
            return '#4CAF50';
        case RequestStatus.COMPLETED:
            return '#2196F3';
        case RequestStatus.CANCELED_BY_CLIENT:
        case RequestStatus.CANCELED_BY_PERFORMER:
        case RequestStatus.CLOSED_AUTOMATICALLY:
            return '#F44336';
        default:
            return '#9E9E9E';
    }
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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
        marginTop: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    label: {
        fontWeight: 'bold',
        color: '#555',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    statusText: {
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 10,
    },
    attachmentsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
        marginBottom: 10,
    },
    attachmentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        margin: 5,
    },
    attachmentButtonText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#333',
        maxWidth: 100,
    },
    actionButtonsContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    makeOfferButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    makeOfferButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    myOfferCard: {
        backgroundColor: '#e6ffe6', // Светло-зеленый фон для своего предложения
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#4CAF50',
        marginTop: 10,
    },
    myOfferPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    myOfferComment: {
        fontSize: 15,
        color: '#555',
        fontStyle: 'italic',
        marginBottom: 10,
    },
    myOfferDate: {
        fontSize: 12,
        color: '#777',
        textAlign: 'right',
        marginBottom: 10,
    },
    offerActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 10,
        marginTop: 5,
    },
    offerActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    offerActionButtonText: {
        marginLeft: 5,
        color: '#007AFF',
        fontWeight: '600',
    },
    noOfferMessage: {
        fontSize: 14,
        color: '#777',
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 10,
    },
    chatButton: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    chatButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    callButton: {
        flexDirection: 'row',
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    completeButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: '#F44336',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    reviewedMessage: {
        fontSize: 16,
        color: '#2196F3',
        textAlign: 'center',
        marginTop: 20,
        fontWeight: 'bold',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    inputModal: {
        width: '100%',
        height: 100, // Увеличена высота для текста
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    modalButtonCancel: {
        backgroundColor: '#9E9E9E',
    },
    modalButtonConfirm: {
        backgroundColor: '#F44336',
    },
});

export default PerformerOrderDetailsScreen;