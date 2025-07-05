// src/screens/Client/PerformerProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Временные данные для демонстрации профиля исполнителя
const DUMMY_PERFORMER_DETAILS = {
    'p1': {
        id: 'p1',
        name: 'Алиев Анар',
        rating: 4.8,
        reviews: 125,
        isCompany: false,
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        description: 'Опытный электрик и сантехник с большим стажем работы более 10 лет. Специализируюсь на ремонте электропроводки, установке сантехники, устранении засоров и течей. Гарантирую качество и оперативность. Выезжаю во все районы Баку.',
        phone: '+994501234567',
        servicesProvided: [
            { id: 's2', name: 'Электрик' },
            { id: 's3', name: 'Сантехник' },
        ],
        portfolio: [
            'https://via.placeholder.com/150/FFD700/000000?text=Ремонт+1',
            'https://via.placeholder.com/150/ADD8E6/000000?text=Ремонт+2',
            'https://via.placeholder.com/150/C0C0C0/000000?text=Ремонт+3',
        ],
        // Отзывы можно будет загрузить отдельно или иметь ссылку на отдельный экран
        // reviewsData: [{ reviewer: 'Клиент А', text: 'Очень доволен работой!', rating: 5 }]
    },
    'p2': {
        id: 'p2',
        name: 'CleanMaster LLC',
        rating: 4.5,
        reviews: 200,
        isCompany: true,
        avatar: 'https://via.placeholder.com/150/FFD700/000000?text=CM',
        description: 'Компания CleanMaster предлагает полный спектр услуг по уборке для жилых и коммерческих помещений. Используем только экологически чистые средства. Профессиональное оборудование. Заключаем договоры.',
        phone: '+994709876543',
        servicesProvided: [
            { id: 's1', name: 'Уборка квартир' },
            { id: 's5', name: 'Малярные работы' },
        ],
        portfolio: [
            'https://via.placeholder.com/150/A0A0A0/FFFFFF?text=Уборка+Офиса',
            'https://via.placeholder.com/150/D0D0D0/FFFFFF?text=Генеральная+Уборка',
        ],
    },
    // Добавьте больше детализированных профилей, если нужно
};


const PerformerProfileScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { performerId, selectedService, selectedOffers, requestType, categoryName, categoryId } = route.params;

    const [performer, setPerformer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // В реальном приложении: загрузка данных профиля исполнителя с бэкенда по performerId
        // const fetchedPerformer = await apiService.getPerformerProfile(performerId);
        // setPerformer(fetchedPerformer);
        setTimeout(() => { // Имитация задержки загрузки
            setPerformer(DUMMY_PERFORMER_DETAILS[performerId]);
            setLoading(false);
        }, 500);
    }, [performerId]);

    const handleCall = () => {
        if (performer?.phone) {
            Linking.openURL(`tel:${performer.phone}`).catch(err => Alert.alert('Ошибка', 'Не удалось открыть приложение для звонков.'));
        } else {
            Alert.alert('Ошибка', 'Номер телефона не указан.');
        }
    };

    const handleOfferToPerformer = () => {
        // Если PerformerProfileScreen был открыт из PerformerListScreen, то у нас есть
        // selectedService, selectedOffers.
        // Если же он был открыт из OrderDetailsScreen, этих данных может не быть,
        // и тогда кнопка "Предложить заказ" не должна отображаться или вести к другому флоу.
        if (!selectedService || !categoryName || !categoryId) {
            Alert.alert('Ошибка', 'Для предложения заказа необходимо сначала выбрать услугу.');
            return;
        }

        Alert.alert(
            'Предложить заказ',
            `Вы хотите предложить заказ "${selectedService.name}" исполнителю ${performer?.name}?`,
            [
                { text: 'Нет', style: 'cancel' },
                {
                    text: 'Да',
                    onPress: () => {
                        navigation.navigate('RequestCreation', {
                            categoryName: categoryName,
                            categoryId: categoryId,
                            selectedService: selectedService,
                            selectedOffers: selectedOffers,
                            performerType: performer.isCompany ? 'company' : 'private', // Определяем тип исполнителя
                            targetPerformer: performer,
                            requestType: 'to_one',
                        });
                    }
                },
            ]
        );
    };

    const handleChat = () => {
        // В реальном приложении: нужно знать orderId или создать новый чат, если его нет
        // Для демонстрации, предполагаем, что это чат для уже существующего (или потенциального) заказа.
        Alert.alert('Чат', 'Функция чата будет реализована при наличии активного заказа или прямой инициации чата.');
        // navigation.navigate('Chat', {
        //     orderId: 'some_order_id_if_exists', // Или создать новый при первой отправке сообщения
        //     performerId: performer.id,
        //     performerName: performer.name,
        //     clientName: 'Ваше Имя (Клиент)', // Из текущего пользователя
        //     currentUserId: 'client1', // Из текущего пользователя
        // });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={{ marginTop: 10 }}>Загрузка профиля...</Text>
            </View>
        );
    }

    if (!performer) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Профиль исполнителя не найден.</Text>
                <TouchableOpacity style={styles.backButtonBottom} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonTextBottom}>Назад</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Проверяем, откуда пришли: из списка исполнителей (для создания нового запроса)
    const showOfferButton = selectedService && requestType !== undefined; // Если selectedService и requestType пришли, значит, есть контекст для создания запроса

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Профиль исполнителя</Text>
            </View>

            <View style={styles.profileCard}>
                <Image source={{ uri: performer.avatar }} style={styles.avatar} />
                <Text style={styles.name}>{performer.name}</Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={20} color="#FFD700" />
                    <Text style={styles.ratingText}>{performer.rating} ({performer.reviews} reviews)</Text>
                </View>
                <Text style={styles.type}>
                    {performer.isCompany ? 'Компания' : 'Частный специалист'}
                </Text>
                <Text style={styles.description}>{performer.description}</Text>

                {performer.phone && (
                    <TouchableOpacity style={styles.contactButton} onPress={handleCall}>
                        <Ionicons name="call-outline" size={20} color="#333" />
                        <Text style={styles.contactButtonText}>{performer.phone}</Text>
                    </TouchableOpacity>
                )}

                <Text style={styles.sectionTitle}>Предоставляемые услуги:</Text>
                <View style={styles.servicesContainer}>
                    {performer.servicesProvided.map(service => (
                        <View key={service.id} style={styles.serviceTag}>
                            <Text style={styles.serviceTagText}>{service.name}</Text>
                        </View>
                    ))}
                </View>

                {performer.portfolio && performer.portfolio.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Портфолио:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.portfolioScroll}>
                            {performer.portfolio.map((imgUri, index) => (
                                <Image key={index} source={{ uri: imgUri }} style={styles.portfolioImage} />
                            ))}
                        </ScrollView>
                    </>
                )}

                {showOfferButton && (
                    <TouchableOpacity style={styles.mainActionButton} onPress={handleOfferToPerformer}>
                        <Text style={styles.mainActionButtonText}>Предложить заказ</Text>
                    </TouchableOpacity>
                )}
                {/* Кнопка чата, возможно, потребуется более сложная логика для ее отображения */}
                {/* <TouchableOpacity style={[styles.mainActionButton, styles.chatActionButton]} onPress={handleChat}>
                    <Text style={styles.mainActionButtonText}>Написать в чат</Text>
                </TouchableOpacity> */}
            </View>
            <View style={{ height: 30 }} />
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
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        margin: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#eee',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    ratingText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 5,
    },
    type: {
        fontSize: 15,
        color: '#888',
        marginBottom: 15,
    },
    description: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    contactButtonText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 15,
        marginBottom: 10,
        alignSelf: 'flex-start', // Выравнивание по левому краю
        width: '100%',
    },
    servicesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center', // Выравнивание по центру
        marginBottom: 15,
        width: '100%',
    },
    serviceTag: {
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        margin: 5,
    },
    serviceTagText: {
        fontSize: 14,
        color: '#555',
    },
    portfolioScroll: {
        width: '100%',
        marginBottom: 20,
    },
    portfolioImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginRight: 10,
        backgroundColor: '#eee',
    },
    mainActionButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginTop: 20,
    },
    mainActionButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    chatActionButton: {
        backgroundColor: '#333', // Для кнопки чата
        marginTop: 10,
    },
});

export default PerformerProfileScreen;