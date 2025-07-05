// src/screens/Client/OrderDetailsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Linking, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RequestStatus } from '../../constants/types';

// Временные причины отмены
const CANCELLATION_REASONS = [
    'Не договорились по цене',
    'Не совпало время',
    'Исполнитель не вышел на связь',
    'Передумал(а) заказывать услугу',
    'Другое',
];

const OrderDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { requestId, requestData } = route.params;

    const [isCancellationModalVisible, setCancellationModalVisible] = useState(false);
    const [selectedCancellationReason, setSelectedCancellationReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const order = requestData;

    // Временные данные для назначенного исполнителя в заказе
    const assignedPerformer = {
        id: 'p1', // Заглушка, в реальном приложении это будет order.assignedPerformerId
        name: 'Алиев Анар',
        phone: '+994501234567',
        isCompany: false,
    };

    if (!order) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Загрузка деталей заказа...</Text>
            </View>
        );
    }

    const handleCancelOrder = () => {
        setCancellationModalVisible(true);
    };

    const confirmCancelOrder = () => {
        const reason = selectedCancellationReason === 'Другое' ? otherReason : selectedCancellationReason;
        if (!reason) {
            Alert.alert('Ошибка', 'Пожалуйста, выберите или введите причину отмены.');
            return;
        }
        Alert.alert(
            'Подтверждение отмены',
            `Вы уверены, что хотите отменить заказ? Причина: ${reason}`,
            [
                { text: 'Нет', style: 'cancel' },
                {
                    text: 'Да',
                    onPress: async () => {
                        try {
                            Alert.alert('Успех', 'Заказ отменен.');
                            setCancellationModalVisible(false);
                            Alert.alert(
                                'Заказ отменен',
                                'Хотите пересоздать или обновить запрос?',
                                [
                                    { text: 'Нет', style: 'cancel' },
                                    {
                                        text: 'Пересоздать',
                                        onPress: () => navigation.navigate('CategoriesTab', {
                                            screen: 'ServicesSelection',
                                            params: {
                                                categoryName: order.category,
                                                categoryId: order.categoryId,
                                            }
                                        }),
                                    },
                                    {
                                        text: 'Обновить',
                                        onPress: () => Alert.alert('Обновить', 'Функция обновления будет реализована позже. Пока что можно выбрать другого исполнителя из уже откликнувшихся.'),
                                    },
                                ]
                            );
                        } catch (error) {
                            console.error('Ошибка отмены заказа:', error);
                            Alert.alert('Ошибка', 'Не удалось отменить заказ. Попробуйте еще раз.');
                        }
                    },
                },
            ]
        );
    };

    const handleCompleteOrder = () => {
        Alert.alert(
            'Завершить заказ',
            'Вы уверены, что хотите завершить этот заказ?',
            [
                { text: 'Нет', style: 'cancel' },
                {
                    text: 'Да',
                    onPress: async () => {
                        try {
                            Alert.alert('Заказ завершен', 'Спасибо за использование нашего сервиса! Пожалуйста, оставьте отзыв.');
                            navigation.goBack();
                        } catch (error) {
                            console.error('Ошибка завершения заказа:', error);
                            Alert.alert('Ошибка', 'Не удалось завершить заказ. Попробуйте еще раз.');
                        }
                    },
                },
            ]
        );
    };

    const handleChatWithPerformer = () => {
        navigation.navigate('Chat', {
            orderId: order.id,
            performerId: assignedPerformer.id,
            performerName: assignedPerformer.name,
            clientName: 'Ваше Имя (Клиент)',
            currentUserId: 'client1',
        });
    };

    const handleViewAssignedPerformerProfile = () => {
        navigation.navigate('PerformerProfile', {
            performerId: assignedPerformer.id,
            // Здесь не передаем selectedService, selectedOffers и requestType,
            // так как это просмотр профиля уже назначенного исполнителя, а не для нового запроса.
            // Кнопка "Предложить заказ" не должна отображаться в этом контексте.
        });
    };

    const handleDownloadDocument = (docType) => {
        Alert.alert('Скачать документ', `Скачать ${docType} (пока не реализовано)`);
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
                <Text style={styles.cardTitle}>{order.category}</Text>
                <Text style={styles.detailText}><Text style={styles.label}>Описание:</Text> {order.description}</Text>
                <Text style={styles.detailText}><Text style={styles.label}>Адрес:</Text> {order.address}</Text>
                <Text style={styles.detailText}><Text style={styles.label}>Статус:</Text>
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}> {order.status}</Text>
                </Text>
                <Text style={styles.detailText}><Text style={styles.label}>Создан:</Text> {new Date(order.createdAt).toLocaleDateString()}</Text>

                {order.status === RequestStatus.ACTIVE && (
                    <>
                        <Text style={styles.label}>Назначенный исполнитель:</Text>
                        <TouchableOpacity onPress={handleViewAssignedPerformerProfile} style={styles.performerLink}>
                            <Text style={styles.detailTextLink}>{assignedPerformer.name} ({assignedPerformer.isCompany ? 'Компания' : 'Частный специалист'})</Text>
                        </TouchableOpacity>
                        <Text style={styles.detailText}>Телефон: {assignedPerformer.phone}</Text>

                        <TouchableOpacity style={styles.chatButton} onPress={handleChatWithPerformer}>
                            <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
                            <Text style={styles.chatButtonText}>Связаться в чате</Text>
                        </TouchableOpacity>

                        <View style={styles.documentButtons}>
                            <TouchableOpacity style={styles.documentButton} onPress={() => handleDownloadDocument('договор')}>
                                <Text style={styles.documentButtonText}>Скачать договор</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.documentButton} onPress={() => handleDownloadDocument('акт работ')}>
                                <Text style={styles.documentButtonText}>Акт выполненных работ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.documentButton} onPress={() => handleDownloadDocument('расписка')}>
                                <Text style={styles.documentButtonText}>Расписка (ценные вещи)</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.actionButton} onPress={handleCompleteOrder}>
                            <Text style={styles.actionButtonText}>Завершить заказ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancelOrder}>
                            <Text style={styles.actionButtonText}>Отменить заказ</Text>
                        </TouchableOpacity>
                    </>
                )}

                {order.status === RequestStatus.PENDING && (
                    <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancelOrder}>
                        <Text style={styles.actionButtonText}>Отменить запрос</Text>
                    </TouchableOpacity>
                )}

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isCancellationModalVisible}
                    onRequestClose={() => setCancellationModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Причина отмены</Text>
                            {CANCELLATION_REASONS.map((reason, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.reasonOption}
                                    onPress={() => {
                                        setSelectedCancellationReason(reason);
                                        if (reason !== 'Другое') setOtherReason('');
                                    }}
                                >
                                    <Ionicons
                                        name={selectedCancellationReason === reason ? 'radio-button-on' : 'radio-button-off'}
                                        size={20}
                                        color="#333"
                                    />
                                    <Text style={styles.reasonText}>{reason}</Text>
                                </TouchableOpacity>
                            ))}
                            {selectedCancellationReason === 'Другое' && (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Укажите другую причину"
                                    value={otherReason}
                                    onChangeText={setOtherReason}
                                />
                            )}
                            <View style={styles.modalButtons}>
                                <Button title="Отмена" onPress={() => setCancellationModalVisible(false)} />
                                <Button title="Подтвердить" onPress={confirmCancelOrder} />
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
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
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    detailTextLink: { // Стиль для кликабельного текста
        fontSize: 16,
        marginBottom: 8,
        color: '#007AFF', // Стандартный синий цвет ссылки
        textDecorationLine: 'underline',
    },
    performerLink: {
        marginBottom: 8,
    },
    statusText: {
        fontWeight: 'bold',
    },
    chatButton: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    chatButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    documentButtons: {
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 15,
    },
    documentButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    documentButtonText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    actionButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 15,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cancelButton: {
        backgroundColor: '#F44336',
        marginTop: 10,
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
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    reasonOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    reasonText: {
        marginLeft: 10,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginTop: 10,
        width: '100%',
    },
});

export default OrderDetailsScreen;