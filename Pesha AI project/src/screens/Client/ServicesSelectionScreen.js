// src/screens/Client/ServicesSelectionScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Временные данные услуг и предложений
const DUMMY_SERVICES = {
    '1': [ // Категория 'Home Services'
        { id: 's1', name: 'Уборка квартир', canBeCompany: true, canBePrivate: true, offers: [{ id: 'o1', name: 'Генеральная уборка' }, { id: 'o2', name: 'Еженедельная уборка' }] },
        { id: 's2', name: 'Электрик', canBeCompany: false, canBePrivate: true, offers: [{ id: 'o3', name: 'Ремонт проводки' }, { id: 'o4', name: 'Установка розеток' }] },
        { id: 's3', name: 'Сантехник', canBeCompany: false, canBePrivate: true, offers: [{ id: 'o5', name: 'Устранение течи' }, { id: 'o6', name: 'Установка смесителя' }] },
    ],
    '2': [ // Категория 'Repair and Construction'
        { id: 's4', name: 'Укладка плитки', canBeCompany: true, canBePrivate: true, offers: [{ id: 'o7', name: 'Ванная комната' }, { id: 'o8', name: 'Кухня' }] },
        { id: 's5', name: 'Малярные работы', canBeCompany: true, canBePrivate: true, offers: [{ id: 'o9', name: 'Покраска стен' }, { id: 'o10', name: 'Поклейка обоев' }] },
    ],
    // ... другие категории и их услуги
};

const ServicesSelectionScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryId, categoryName } = route.params;

    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedOffers, setSelectedOffers] = useState([]);
    const [performerType, setPerformerType] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const servicesForCategory = DUMMY_SERVICES[categoryId] || [];
            setServices(servicesForCategory);
            setLoading(false);
        }, 500);
    }, [categoryId]);

    const handleServiceSelect = (service) => {
        if (selectedService?.id === service.id) {
            setSelectedService(null);
            setSelectedOffers([]);
            setPerformerType(null);
        } else {
            setSelectedService(service);
            setSelectedOffers([]);
            setPerformerType(null);
        }
    };

    const handleOfferToggle = (offer) => {
        setSelectedOffers(prevOffers => {
            if (prevOffers.includes(offer)) {
                return prevOffers.filter(o => o.id !== offer.id);
            } else {
                return [...prevOffers, offer];
            }
        });
    };

    const handleNext = () => {
        if (!selectedService) {
            Alert.alert('Ошибка', 'Пожалуйста, выберите услугу.');
            return;
        }

        if (selectedService.canBePrivate && selectedService.canBeCompany && !performerType) {
            Alert.alert('Ошибка', 'Пожалуйста, выберите, кого вы ищете: частного специалиста или компанию.');
            return;
        }

        // Переходим на экран списка исполнителей
        navigation.navigate('PerformerList', {
            categoryName: categoryName,
            categoryId: categoryId,
            selectedService: selectedService,
            selectedOffers: selectedOffers,
            performerType: performerType,
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={{ marginTop: 10 }}>Загрузка услуг...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Выбор услуги</Text>
            </View>

            <Text style={styles.categoryInfo}>Категория: {categoryName}</Text>
            <Text style={styles.sectionTitle}>Выберите одну из услуг:</Text>

            {services.length === 0 ? (
                <Text style={styles.emptyText}>Услуги в данной категории пока не найдены.</Text>
            ) : (
                <View style={styles.servicesGrid}>
                    {services.map(service => (
                        <TouchableOpacity
                            key={service.id}
                            style={[
                                styles.serviceItem,
                                selectedService?.id === service.id && styles.serviceItemSelected
                            ]}
                            onPress={() => handleServiceSelect(service)}
                        >
                            <Text style={[
                                styles.serviceName,
                                selectedService?.id === service.id && styles.serviceNameSelected
                            ]}>
                                {service.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {selectedService && (
                <>
                    {(selectedService.canBePrivate || selectedService.canBeCompany) && (
                        <>
                            <Text style={styles.sectionTitle}>Кого вы ищете?</Text>
                            <View style={styles.performerTypeContainer}>
                                {selectedService.canBePrivate && (
                                    <TouchableOpacity
                                        style={[
                                            styles.performerTypeButton,
                                            performerType === 'private' && styles.performerTypeButtonSelected
                                        ]}
                                        onPress={() => setPerformerType('private')}
                                    >
                                        <Text style={[
                                            styles.performerTypeText,
                                            performerType === 'private' && styles.performerTypeTextSelected
                                        ]}>Частный специалист</Text>
                                    </TouchableOpacity>
                                )}
                                {selectedService.canBeCompany && (
                                    <TouchableOpacity
                                        style={[
                                            styles.performerTypeButton,
                                            performerType === 'company' && styles.performerTypeButtonSelected
                                        ]}
                                        onPress={() => setPerformerType('company')}
                                    >
                                        <Text style={[
                                            styles.performerTypeText,
                                            performerType === 'company' && styles.performerTypeTextSelected
                                        ]}>Компания</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </>
                    )}

                    {selectedService.offers && selectedService.offers.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Выберите предложения (необязательно):</Text>
                            <View style={styles.offersContainer}>
                                {selectedService.offers.map(offer => (
                                    <TouchableOpacity
                                        key={offer.id}
                                        style={[
                                            styles.offerItem,
                                            selectedOffers.includes(offer) && styles.offerItemSelected
                                        ]}
                                        onPress={() => handleOfferToggle(offer)}
                                    >
                                        <Text style={[
                                            styles.offerText,
                                            selectedOffers.includes(offer) && styles.offerTextSelected
                                        ]}>
                                            {offer.name}
                                        </Text>
                                        <Ionicons
                                            name={selectedOffers.includes(offer) ? 'checkmark-circle' : 'ellipse-outline'}
                                            size={20}
                                            color={selectedOffers.includes(offer) ? '#FFD700' : '#ccc'}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}
                </>
            )}

            <TouchableOpacity
                style={[styles.nextButton, (!selectedService || ((selectedService.canBePrivate || selectedService.canBeCompany) && !performerType)) && styles.nextButtonDisabled]}
                onPress={handleNext}
                disabled={!selectedService || ((selectedService.canBePrivate || selectedService.canBeCompany) && !performerType)}
            >
                <Text style={styles.nextButtonText}>Продолжить</Text>
            </TouchableOpacity>

            <View style={{ height: 50 }} />
        </ScrollView>
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
    categoryInfo: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 15,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 16,
        color: '#999',
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingHorizontal: 15,
    },
    serviceItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        margin: 5,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    serviceItemSelected: {
        backgroundColor: '#333',
        borderColor: '#333',
    },
    serviceName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    serviceNameSelected: {
        color: '#fff',
    },
    performerTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 10,
    },
    performerTypeButton: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    performerTypeButtonSelected: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },
    performerTypeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    performerTypeTextSelected: {
        color: '#333',
    },
    offersContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    offerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    offerItemSelected: {
        backgroundColor: '#f0f0f0',
        borderColor: '#FFD700',
    },
    offerText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    offerTextSelected: {
        fontWeight: '600',
    },
    nextButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
    },
    nextButtonDisabled: {
        backgroundColor: '#ccc',
    },
    nextButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default ServicesSelectionScreen;