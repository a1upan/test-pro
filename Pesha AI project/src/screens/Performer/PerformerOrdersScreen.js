// src/screens/Performer/PerformerOrdersScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, FlatList, Alert, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RequestStatus } from '../../constants/types';

// Временные данные для заказов исполнителя
const DUMMY_PERFORMER_ORDERS = [
    {
        id: 'req1',
        category: 'Электрик',
        serviceName: 'Установка розеток',
        description: 'Установить новые розетки в трех комнатах.',
        address: 'ул. Азадлыг 10, кв. 5',
        status: RequestStatus.PENDING, // Пусть этот будет PENDING, чтобы показать фильтр
        createdAt: '2025-07-01T10:00:00Z',
        clientName: 'Клиент Мария',
        clientId: 'client1',
    },
    {
        id: 'req5',
        category: 'Сантехник',
        serviceName: 'Замена смесителя',
        description: 'Требуется замена старого смесителя на новый на кухне.',
        address: 'пр. Бюльбюля 20, кв. 8',
        status: RequestStatus.ACTIVE,
        createdAt: '2025-07-03T11:00:00Z',
        clientName: 'Ахмед Р.',
        clientId: 'client5',
    },
    {
        id: 'req6',
        category: 'Уборка',
        serviceName: 'Еженедельная уборка',
        description: 'Генеральная уборка двухкомнатной квартиры.',
        address: 'ул. 28 Мая 5, кв. 1',
        status: RequestStatus.PENDING,
        createdAt: '2025-07-04T09:00:00Z',
        clientName: 'Фатима А.',
        clientId: 'client6',
    },
    {
        id: 'req2',
        category: 'Сантехник',
        serviceName: 'Устранить течь',
        description: 'Устранить течь под раковиной на кухне.',
        address: 'пр. Бюльбюля 5, кв. 12',
        status: RequestStatus.COMPLETED,
        createdAt: '2025-06-25T14:30:00Z',
        clientName: 'Клиент Андрей',
        clientId: 'client2',
    },
    {
        id: 'req4',
        category: 'Малярные работы',
        serviceName: 'Покраска стен',
        description: 'Покраска стен в спальне.',
        address: 'ул. 28 Мая 15, кв. 8',
        status: RequestStatus.CANCELED_BY_CLIENT,
        createdAt: '2025-06-30T11:00:00Z',
        clientName: 'Клиент Денис',
        clientId: 'client4',
    },
    {
        id: 'req7',
        category: 'Грузоперевозки',
        serviceName: 'Перевозка мебели',
        description: 'Перевезти диван и несколько коробок.',
        address: 'ул. Низами 33, кв. 1',
        status: RequestStatus.ACTIVE,
        createdAt: '2025-07-02T16:00:00Z',
        clientName: 'Клиент Гюльнара',
        clientId: 'client7',
    },
];

const ORDER_STATUS_FILTERS = [
    { label: 'Все', value: 'ALL' },
    { label: 'В ожидании', value: RequestStatus.PENDING },
    { label: 'Активные', value: RequestStatus.ACTIVE },
    { label: 'Завершенные', value: RequestStatus.COMPLETED },
    { label: 'Отмененные', value: 'CANCELED' }, // Объединим все отмененные в одну категорию
];

const PerformerOrdersScreen = () => {
    const navigation = useNavigation();
    const [selectedFilter, setSelectedFilter] = useState('ALL');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [sortBy, setSortBy] = useState('createdAt_desc'); // createdAt_asc, createdAt_desc

    useEffect(() => {
        applyFiltersAndSort();
    }, [selectedFilter, sortBy]);

    const applyFiltersAndSort = () => {
        let tempOrders = [...DUMMY_PERFORMER_ORDERS]; // Используем копию

        // 1. Фильтрация
        if (selectedFilter !== 'ALL') {
            if (selectedFilter === 'CANCELED') {
                tempOrders = tempOrders.filter(order =>
                    order.status === RequestStatus.CANCELED_BY_CLIENT ||
                    order.status === RequestStatus.CANCELED_BY_PERFORMER ||
                    order.status === RequestStatus.CLOSED_AUTOMATICALLY
                );
            } else {
                tempOrders = tempOrders.filter(order => order.status === selectedFilter);
            }
        }

        // 2. Сортировка
        tempOrders.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            if (sortBy === 'createdAt_asc') {
                return dateA.getTime() - dateB.getTime();
            } else { // createdAt_desc (по умолчанию)
                return dateB.getTime() - dateA.getTime();
            }
        });

        setFilteredOrders(tempOrders);
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

    const handleViewOrderDetails = (orderId) => {
        navigation.navigate('OrdersTab', {
            screen: 'PerformerOrderDetails',
            params: { orderId: orderId }
        });
    };

    const handleChatWithClient = (order) => {
        navigation.navigate('Chat', {
            orderId: order.id,
            performerId: 'performer1',
            performerName: 'Ваше Имя Исполнителя',
            clientName: order.clientName,
            currentUserId: 'performer1',
        });
    };

    const renderOrderItem = ({ item: order }) => (
        <TouchableOpacity style={styles.orderCard} onPress={() => handleViewOrderDetails(order.id)}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>{order.category} - {order.serviceName}</Text>
                <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>{order.status}</Text>
            </View>
            <Text style={styles.orderDescription} numberOfLines={2}>{order.description}</Text>
            <Text style={styles.orderAddress}><Ionicons name="location-outline" size={14} color="#666" /> {order.address}</Text>
            <Text style={styles.orderClient}>Клиент: {order.clientName}</Text>
            <Text style={styles.orderDate}>Создан: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</Text>

            {order.status === RequestStatus.ACTIVE && (
                <TouchableOpacity style={styles.chatButton} onPress={() => handleChatWithClient(order)}>
                    <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
                    <Text style={styles.chatButtonText}>Чат с клиентом</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Мои Заказы</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => setShowFilterModal(true)}>
                        <Ionicons name="filter-outline" size={24} color="#333" />
                    </TouchableOpacity>
                    {/* Кнопка сортировки, если нужно отдельная */}
                    {/* <TouchableOpacity style={styles.iconButton} onPress={() => setShowSortModal(true)}>
                        <Ionicons name="swap-vertical-outline" size={24} color="#333" />
                    </TouchableOpacity> */}
                </View>
            </View>

            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>Заказы не найдены по выбранным критериям.</Text>
                    </View>
                }
            />

            {/* Модальное окно для фильтрации и сортировки */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showFilterModal}
                onRequestClose={() => setShowFilterModal(false)}
            >
                <Pressable style={styles.centeredView} onPress={() => setShowFilterModal(false)}>
                    <View style={styles.modalView} onStartShouldSetResponder={() => true}>
                        <Text style={styles.modalTitle}>Фильтровать и сортировать</Text>

                        <View style={styles.filterSection}>
                            <Text style={styles.sectionHeading}>Показать заказы:</Text>
                            {ORDER_STATUS_FILTERS.map(filter => (
                                <TouchableOpacity
                                    key={filter.value}
                                    style={[
                                        styles.filterOption,
                                        selectedFilter === filter.value && styles.selectedFilterOption
                                    ]}
                                    onPress={() => setSelectedFilter(filter.value)}
                                >
                                    <Text style={[
                                        styles.filterOptionText,
                                        selectedFilter === filter.value && styles.selectedFilterOptionText
                                    ]}>
                                        {filter.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.filterSection}>
                            <Text style={styles.sectionHeading}>Сортировать по:</Text>
                            <TouchableOpacity
                                style={[
                                    styles.filterOption,
                                    sortBy === 'createdAt_desc' && styles.selectedFilterOption
                                ]}
                                onPress={() => setSortBy('createdAt_desc')}
                            >
                                <Text style={[
                                    styles.filterOptionText,
                                    sortBy === 'createdAt_desc' && styles.selectedFilterOptionText
                                ]}>
                                    Дате создания (новые сначала)
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.filterOption,
                                    sortBy === 'createdAt_asc' && styles.selectedFilterOption
                                ]}
                                onPress={() => setSortBy('createdAt_asc')}
                            >
                                <Text style={[
                                    styles.filterOptionText,
                                    sortBy === 'createdAt_asc' && styles.selectedFilterOptionText
                                ]}>
                                    Дате создания (старые сначала)
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilterModal(false)}>
                            <Text style={styles.applyButtonText}>Применить</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
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
    headerActions: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 5,
        marginLeft: 15,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 15,
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
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flexShrink: 1,
        marginRight: 10,
    },
    orderStatus: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    orderDescription: {
        fontSize: 15,
        color: '#555',
        marginBottom: 8,
    },
    orderAddress: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderClient: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    orderDate: {
        fontSize: 13,
        color: '#999',
    },
    chatButton: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    chatButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 5,
    },
    emptyListContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyListText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
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
        alignItems: 'flex-start', // Выравнивание влево для фильтров
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
        alignSelf: 'center', // Центрируем заголовок
    },
    filterSection: {
        width: '100%',
        marginBottom: 20,
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 10,
    },
    filterOption: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 8,
        width: '100%',
    },
    selectedFilterOption: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },
    filterOptionText: {
        fontSize: 16,
        color: '#333',
    },
    selectedFilterOptionText: {
        fontWeight: 'bold',
        color: '#333',
    },
    applyButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    applyButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default PerformerOrdersScreen;