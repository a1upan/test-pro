// src/screens/Client/RequestsListScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RequestStatus } from '../../constants/types'; // Импортируем статусы из наших типов

// Временные данные для демонстрации списка запросов
const DUMMY_REQUESTS = [
    {
        id: 'req1',
        category: 'Electrician and Plumbing Repair',
        description: 'Task description goes here',
        address: 'Baku, Nizami',
        status: RequestStatus.PENDING,
        createdAt: '2025-07-01T10:00:00Z',
    },
    {
        id: 'req2',
        category: 'Electrician Plumbing Repair',
        description: 'Task description conscetetr',
        address: 'Baku, Nizami',
        status: RequestStatus.ACTIVE,
        createdAt: '2025-06-25T14:30:00Z',
    },
    {
        id: 'req3',
        category: 'Plumbing Repair',
        description: 'Task description goeshere',
        address: 'Baku, Nizami',
        status: RequestStatus.COMPLETED,
        createdAt: '2025-06-15T09:15:00Z',
    },
    {
        id: 'req4',
        category: 'Home Services',
        description: 'Need help with cleaning the apartment',
        address: 'Baku, Sabayil',
        status: RequestStatus.CANCELED_BY_CLIENT,
        createdAt: '2025-06-20T11:00:00Z',
    },
];

const RequestsListScreen = () => {
    const navigation = useNavigation();
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        // В реальном приложении здесь будет загрузка данных запросов с бэкенда
        // Например: const fetchedRequests = await clientService.fetchClientRequests();
        setRequests(DUMMY_REQUESTS);
    }, []);

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
                return '#9E9E9E'; // Grey
        }
    };

    const renderRequestItem = ({ item }) => (
        <TouchableOpacity
            style={styles.requestItem}
            onPress={() => navigation.navigate('OrderDetails', { requestId: item.id, requestData: item })}
        >
            <View style={styles.requestContent}>
                <Text style={styles.requestCategory}>{item.category}</Text>
                <Text style={styles.requestDescription}>{item.description}</Text>
                <Text style={styles.requestAddress}>{item.address}</Text>
            </View>
            <View style={styles.statusContainer}>
                <Text style={[styles.requestStatus, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
                <Ionicons name="chevron-forward-outline" size={24} color="#ccc" />
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>My Orders</Text>
            {/* TODO: Здесь можно добавить переключатель между "Активные заказы" и "История заказов" */}

            <FlatList
                data={requests}
                renderItem={renderRequestItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyListText}>У вас пока нет запросов.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333',
    },
    listContent: {
        paddingBottom: 20,
    },
    requestItem: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    requestContent: {
        flex: 1,
        marginRight: 10,
    },
    requestCategory: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    requestDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    requestAddress: {
        fontSize: 12,
        color: '#999',
    },
    statusContainer: {
        alignItems: 'flex-end',
    },
    requestStatus: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    emptyListText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#999',
    },
});

export default RequestsListScreen;