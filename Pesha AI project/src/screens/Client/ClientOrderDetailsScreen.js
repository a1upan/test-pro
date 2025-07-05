// src/screens/Client/ClientOrderDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, Linking, Modal, TextInput, Image } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RequestStatus } from '../../constants/types';

// Имитация хранения избранных исполнителей в клиенте
// В реальном приложении это будет из глобального состояния (Context/Redux) или API
let _localFavoritePerformers = []; // Временная переменная для имитации
const addPerformerToFavorites = (performer) => {
    if (!_localFavoritePerformers.some(p => p.id === performer.id)) {
        _localFavoritePerformers.push(performer);
        console.log('Added to favorites:', performer.name);
    }
};
const isPerformerFavorite = (performerId) => {
    return _localFavoritePerformers.some(p => p.id === performerId);
};
// END Имитация

const ClientOrderDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [favoriteStatus, setFavoriteStatus] = useState({}); // Состояние для статуса "избранное" для каждого исполнителя

    // Временные данные для заказов (имитация запроса к API)
    // Изменения: removed performerOffers, added offers array
    let DUMMY_ORDERS = {
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
            offers: [ // Теперь это массив предложений
                { performerId: 'perf1', performerName: 'Иван Иванов', price: 60, comment: 'Готов выполнить завтра. Есть опыт.', rating: 4.7, reviewsCount: 35, categories: ['Электрик', 'Сантехник'], avatar: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=ИИ', createdAt: '2025-07-02T15:00:00Z' },
                { performerId: 'perf2', performerName: 'Петр Петров', price: 65, comment: 'Сделаю быстро и качественно. Опыт 10 лет.', rating: 4.8, reviewsCount: 25, categories: ['Электрик'], avatar: 'https://via.placeholder.com/150/FFC0CB/FFFFFF?text=ПП', createdAt: '2025-07-02T16:00:00Z' },
                { performerId: 'perf5', performerName: 'Исполнитель 5', price: 55, comment: 'Могу начать сегодня.', rating: 4.2, reviewsCount: 8, categories: ['Электрик', 'Мелкий ремонт'], avatar: 'https://via.placeholder.com/150/8A2BE2/FFFFFF?text=И5', createdAt: '2025-07-02T17:00:00Z' },
            ],
            assignedPerformerId: null,
            assignedPerformerName: null,
            isReviewed: false,
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
            offers: [
                { performerId: 'perf1', performerName: 'Иван Иванов', price: 45, comment: 'Сделаю быстро и качественно.', rating: 4.7, reviewsCount: 35, categories: ['Электрик', 'Сантехник'], avatar: 'https://via.placeholder.com/150/007AFF/FFFFFF?text=ИИ', createdAt: '2025-07-03T12:00:00Z' }
            ],
            assignedPerformerId: 'perf1',
            assignedPerformerName: 'Иван Иванов',
            isReviewed: false,
        },
        'req2': {
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
            offers: [], // Нет предложений
            assignedPerformerId: 'perf3',
            assignedPerformerName: 'Анна Мастер',
            isReviewed: false,
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
            offers: [],
            assignedPerformerId: 'perf4',
            assignedPerformerName: 'Олег Профессионал',
            isReviewed: true,
        }
    };

    useFocusEffect( // Используем useFocusEffect для обновления статуса избранного при возвращении на экран
        React.useCallback(() => {
            const fetchedOrder = DUMMY_ORDERS[orderId];
            if (fetchedOrder) {
                setOrder(fetchedOrder);
                // Инициализируем favoriteStatus для всех исполнителей в предложении
                const initialFavoriteStatus = {};
                // Теперь используем fetchedOrder.offers
                fetchedOrder.offers?.forEach(performer => {
                    initialFavoriteStatus[performer.performerId] = isPerformerFavorite(performer.performerId);
                });
                setFavoriteStatus(initialFavoriteStatus);
            } else {
                Alert.alert('Ошибка', 'Заказ не найден.');
                navigation.goBack();
            }
            setLoading(false);
            return () => { }; // Очистка
        }, [orderId])
    );

    const handleAcceptOffer = (performer) => {
        Alert.alert(
            'Подтверждение',
            `Вы уверены, что хотите выбрать исполнителя ${performer.performerName} за ${performer.price} AZN?`,
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Подтвердить',
                    onPress: () => {
                        console.log(`Клиент принял предложение от ${performer.performerName} за ${performer.price} AZN для заказа ${order.id}`);
                        // Обновляем статус заказа и назначаем исполнителя в DUMMY_ORDERS (для имитации)
                        DUMMY_ORDERS[order.id].status = RequestStatus.ACTIVE;
                        DUMMY_ORDERS[order.id].assignedPerformerId = performer.performerId;
                        DUMMY_ORDERS[order.id].assignedPerformerName = performer.performerName;
                        setOrder(prev => ({ ...prev, status: RequestStatus.ACTIVE, assignedPerformerId: performer.performerId, assignedPerformerName: performer.performerName }));
                        Alert.alert('Заказ подтвержден!', `Исполнитель ${performer.performerName} назначен. Свяжитесь с ним для уточнения деталей.`);
                        navigation.navigate('ClientOrdersList');
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
                        console.log(`Заказ ${order.id} отменен клиентом. Причина: ${cancelReason}`);
                        // Обновляем статус заказа в DUMMY_ORDERS (для имитации)
                        DUMMY_ORDERS[order.id].status = RequestStatus.CANCELED_BY_CLIENT;
                        Alert.alert('Заказ отменен', 'Ваш заказ был отменен.');
                        setOrder(prev => ({ ...prev, status: RequestStatus.CANCELED_BY_CLIENT }));
                        setShowCancelModal(false);
                        navigation.goBack();
                    }
                },
            ]
        );
    };

    const handleCallPerformer = () => {
        // В реальном приложении здесь будет номер телефона назначенного исполнителя
        Alert.alert('Звонок Исполнителю', 'Функция звонка пока не реализована.');
    };

    const handleChatWithPerformer = () => {
        if (order?.assignedPerformerId && order?.assignedPerformerName) {
            navigation.navigate('Chat', {
                orderId: order.id,
                clientId: 'client1', // Заглушка для ID клиента
                clientName: order.clientName,
                performerId: order.assignedPerformerId,
                performerName: order.assignedPerformerName,
                currentUserId: 'client1',
                targetUserId: order.assignedPerformerId,
            });
        } else {
            Alert.alert('Ошибка', 'Невозможно начать чат. Исполнитель не назначен.');
        }
    };

    const handleOrderCompleted = () => {
        Alert.alert(
            'Подтвердить выполнение',
            'Вы уверены, что исполнитель завершил работу по этому заказу?',
            [
                { text: 'Нет', style: 'cancel' },
                {
                    text: 'Да, завершено',
                    onPress: () => {
                        console.log(`Заказ ${order.id} отмечен клиентом как выполненный.`);
                        // Обновляем статус заказа в DUMMY_ORDERS (для имитации)
                        DUMMY_ORDERS[order.id].status = RequestStatus.COMPLETED;
                        Alert.alert('Заказ завершен!', 'Пожалуйста, оставьте отзыв для исполнителя.');
                        setOrder(prev => ({ ...prev, status: RequestStatus.COMPLETED }));
                        navigation.navigate('ClientRatePerformer', {
                            orderId: order.id,
                            performerId: order.assignedPerformerId,
                            performerName: order.assignedPerformerName,
                        });
                    }
                },
            ]
        );
    };

    const handleToggleFavorite = (performer) => {
        const isCurrentlyFavorite = isPerformerFavorite(performer.performerId);
        if (isCurrentlyFavorite) {
            // Имитация удаления
            _localFavoritePerformers = _localFavoritePerformers.filter(p => p.id !== performer.performerId);
            Alert.alert('Удалено', `${performer.performerName} удален из избранного.`);
        } else {
            // Имитация добавления
            addPerformerToFavorites({
                id: performer.performerId,
                name: performer.performerName,
                avatar: performer.avatar,
                categories: performer.categories,
                averageRating: performer.rating, // Используем рейтинг из предложения как averageRating
                totalReviews: performer.reviewsCount,
                bio: 'Обо мне: нет данных (для примера из предложения)', // В реале нужно получать полное био
            });
            Alert.alert('Добавлено', `${performer.performerName} добавлен в избранное!`);
        }
        // Обновляем состояние, чтобы иконка изменилась
        setFavoriteStatus(prev => ({
            ...prev,
            [performer.performerId]: !isCurrentlyFavorite,
        }));
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

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={14}
                    color="#FFD700"
                />
            );
        }
        return <View style={styles.starRatingContainer}>{stars}</View>;
    };

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
                    <Text style={styles.detailText}><Text style={styles.label}>Ваша ожидаемая цена:</Text> {order.clientExpectedPrice} AZN</Text>
                )}

                {order.status === RequestStatus.PENDING && order.offers && order.offers.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Предложения от исполнителей:</Text>
                        {order.offers
                            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // Сортируем по дате создания
                            .map((performerOffer, index) => (
                                <View key={index} style={styles.performerOfferCard}>
                                    <View style={styles.performerOfferHeader}>
                                        <View style={styles.performerInfoSummary}>
                                            <Image source={{ uri: performerOffer.avatar }} style={styles.performerAvatar} />
                                            <View>
                                                <Text style={styles.performerName}>{performerOffer.performerName}</Text>
                                                <View style={styles.ratingInfo}>
                                                    {renderStars(performerOffer.rating)}
                                                    <Text style={styles.performerRatingText}>{performerOffer.rating} ({performerOffer.reviewsCount} отзывов)</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => handleToggleFavorite(performerOffer)}>
                                            <Ionicons
                                                name={favoriteStatus[performerOffer.performerId] ? 'heart' : 'heart-outline'}
                                                size={28}
                                                color={favoriteStatus[performerOffer.performerId] ? '#F44336' : '#999'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.performerPrice}>Цена: {performerOffer.price} AZN</Text>
                                    {performerOffer.comment && <Text style={styles.performerComment}>"{performerOffer.comment}"</Text>}
                                    <Text style={styles.offerDateText}>Отправлено: {new Date(performerOffer.createdAt).toLocaleDateString()}</Text>
                                    <TouchableOpacity style={styles.acceptOfferButton} onPress={() => handleAcceptOffer(performerOffer)}>
                                        <Text style={styles.acceptOfferButtonText}>Принять предложение</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                    </>
                )}

                {order.status === RequestStatus.PENDING && (!order.offers || order.offers.length === 0) && (
                    <View style={styles.noOffersContainer}>
                        <Ionicons name="information-circle-outline" size={30} color="#FFD700" />
                        <Text style={styles.noOffersText}>Пока нет предложений по вашему заказу.</Text>
                        <Text style={styles.noOffersSubText}>Ожидайте, исполнители скоро откликнутся!</Text>
                    </View>
                )}

                {order.assignedPerformerId && (
                    <View style={styles.assignedPerformerContainer}>
                        <Text style={styles.sectionTitle}>Назначенный исполнитель:</Text>
                        <Text style={styles.detailText}><Text style={styles.label}>Имя:</Text> {order.assignedPerformerName}</Text>
                        {/* Здесь можно добавить рейтинг исполнителя и кнопку для просмотра профиля */}
                    </View>
                )}

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
                    {order.status === RequestStatus.PENDING && !order.assignedPerformerId && (
                        <TouchableOpacity style={styles.actionButton} onPress={handleCancelOrder}>
                            <Text style={styles.actionButtonText}>Отменить заказ</Text>
                        </TouchableOpacity>
                    )}

                    {order.status === RequestStatus.ACTIVE && (
                        <>
                            <TouchableOpacity style={styles.chatButton} onPress={handleChatWithPerformer}>
                                <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
                                <Text style={styles.chatButtonText}>Чат с исполнителем</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.callButton} onPress={handleCallPerformer}>
                                <Ionicons name="call-outline" size={20} color="#fff" />
                                <Text style={styles.chatButtonText}>Позвонить исполнителю</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.completeButton} onPress={handleOrderCompleted}>
                                <Text style={styles.actionButtonText}>Заказ выполнен</Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {order.status === RequestStatus.COMPLETED && order.assignedPerformerId && !order.isReviewed && (
                        <TouchableOpacity style={[styles.actionButton, styles.ratePerformerButton]} onPress={() => navigation.navigate('ClientRatePerformer', {
                            orderId: order.id,
                            performerId: order.assignedPerformerId,
                            performerName: order.assignedPerformerName,
                        })}>
                            <Text style={styles.actionButtonText}>Оставить отзыв и оценку</Text>
                        </TouchableOpacity>
                    )}

                    {order.status === RequestStatus.COMPLETED && order.isReviewed && (
                        <Text style={styles.reviewedMessage}>Вы уже оставили отзыв по этому заказу.</Text>
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
                            placeholder="Например: исполнитель не вышел на связь, изменились планы"
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
    performerOfferCard: {
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    performerOfferHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    performerInfoSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    performerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    performerName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    ratingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starRatingContainer: {
        flexDirection: 'row',
        marginRight: 5,
    },
    performerRatingText: {
        fontSize: 14,
        color: '#666',
    },
    performerPrice: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 5,
    },
    performerComment: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 8,
    },
    offerDateText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'right',
        marginBottom: 10,
    },
    acceptOfferButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 5,
    },
    acceptOfferButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    noOffersContainer: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fffbe6',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ffe0b2',
        marginTop: 15,
    },
    noOffersText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 10,
    },
    noOffersSubText: {
        fontSize: 14,
        color: '#888',
        marginTop: 5,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    assignedPerformerContainer: {
        backgroundColor: '#e6f7ff',
        borderRadius: 10,
        padding: 15,
        marginTop: 15,
        borderWidth: 1,
        borderColor: '#91d5ff',
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
    actionButton: {
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
    ratePerformerButton: {
        backgroundColor: '#FFD700',
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
        height: 100, // Увеличена высота
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

export default ClientOrderDetailsScreen;