// src/screens/Client/ClientCreateOrderScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert, Platform, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RequestStatus } from '../../constants/types';

// Временные данные для категорий услуг
const DUMMY_CATEGORIES = [
    'Электрик', 'Сантехник', 'Малярные работы', 'Уборка', 'Грузоперевозки',
    'Ремонт бытовой техники', 'Мелкий ремонт', 'Садовник', 'Компьютерная помощь', 'Автосервис'
];

const ClientCreateOrderScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    // Получаем параметры маршрута, если они есть
    const { selectedCategory, preferredPerformer, preferredPerformerName } = route.params || {};

    const [category, setCategory] = useState(selectedCategory || '');
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [expectedPrice, setExpectedPrice] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assignedPerformerName, setAssignedPerformerName] = useState(preferredPerformerName || '');

    useEffect(() => {
        // Если выбрана категория или исполнитель из других экранов, обновить состояние
        if (selectedCategory && selectedCategory !== category) {
            setCategory(selectedCategory);
        }
        if (preferredPerformerName && preferredPerformerName !== assignedPerformerName) {
            setAssignedPerformerName(preferredPerformerName);
        }
    }, [selectedCategory, preferredPerformerName]);


    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const newAttachment = {
                uri: result.assets[0].uri,
                name: result.assets[0].uri.split('/').pop(),
                type: 'image',
            };
            setAttachments(prev => [...prev, newAttachment]);
        }
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*', // Позволяет выбирать любые типы файлов
            });

            if (!result.canceled) {
                const newAttachment = {
                    uri: result.assets[0].uri,
                    name: result.assets[0].name,
                    type: result.assets[0].mimeType.startsWith('image/') ? 'image' : 'document',
                };
                setAttachments(prev => [...prev, newAttachment]);
            }
        } catch (error) {
            console.error('Error picking document:', error);
            Alert.alert('Ошибка', 'Не удалось выбрать файл.');
        }
    };

    const removeAttachment = (uriToRemove) => {
        Alert.alert(
            'Удалить вложение',
            'Вы уверены, что хотите удалить это вложение?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    onPress: () => {
                        setAttachments(prev => prev.filter(att => att.uri !== uriToRemove));
                    }
                }
            ]
        );
    };

    const handleSubmitOrder = () => {
        if (!category || !serviceName || !description || !address || !preferredTime) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля.');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            console.log('Создание заказа:', {
                category,
                serviceName,
                description,
                address,
                preferredTime,
                expectedPrice: expectedPrice ? parseFloat(expectedPrice) : null,
                attachments: attachments.map(att => ({ name: att.name, uri: att.uri, type: att.type })),
                preferredPerformerId: preferredPerformer, // Передаем ID предпочтительного исполнителя
            });

            setLoading(false);
            Alert.alert(
                'Заказ создан!',
                `Ваш запрос "${serviceName}" в категории "${category}" успешно отправлен. ${preferredPerformerName ? `Предпочтительный исполнитель: ${preferredPerformerName}.` : ''} Ожидайте предложений.`,
                [{
                    text: 'ОК',
                    onPress: () => {
                        // Очистка формы
                        setCategory('');
                        setServiceName('');
                        setDescription('');
                        setAddress('');
                        setPreferredTime('');
                        setExpectedPrice('');
                        setAttachments([]);
                        setAssignedPerformerName(''); // Сброс имени предпочтительного исполнителя

                        navigation.navigate('ClientDashboardTab'); // Возвращаемся на главный экран
                    }
                }]
            );
        }, 1500); // Имитация задержки сети
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Создать Заказ</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Категория услуги *</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={category}
                            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
                            style={styles.picker}
                            itemStyle={styles.pickerItem}
                        >
                            <Picker.Item label="Выберите категорию..." value="" />
                            {DUMMY_CATEGORIES.map((cat, index) => (
                                <Picker.Item key={index} label={cat} value={cat} />
                            ))}
                        </Picker>
                    </View>

                    {assignedPerformerName ? (
                        <View style={styles.preferredPerformerContainer}>
                            <Text style={styles.label}>Предпочтительный исполнитель:</Text>
                            <Text style={styles.preferredPerformerText}>{assignedPerformerName}</Text>
                        </View>
                    ) : null}

                    <Text style={styles.label}>Название услуги *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Например: Установка розеток, Замена смесителя"
                        placeholderTextColor="#888"
                        value={serviceName}
                        onChangeText={setServiceName}
                    />

                    <Text style={styles.label}>Подробное описание заказа *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Опишите, что нужно сделать, какие детали, сроки и т.д."
                        placeholderTextColor="#888"
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                        value={description}
                        onChangeText={setDescription}
                    />

                    <Text style={styles.label}>Адрес выполнения *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Введите полный адрес"
                        placeholderTextColor="#888"
                        value={address}
                        onChangeText={setAddress}
                    />

                    <Text style={styles.label}>Предпочтительное время выполнения *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Например: Завтра после 14:00, В любой день"
                        placeholderTextColor="#888"
                        value={preferredTime}
                        onChangeText={setPreferredTime}
                    />

                    <Text style={styles.label}>Ваша ожидаемая цена (AZN, необязательно)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Например: 50, 100-120"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={expectedPrice}
                        onChangeText={setExpectedPrice}
                    />

                    <Text style={styles.label}>Прикрепить файлы (фото, документы)</Text>
                    <View style={styles.attachmentButtons}>
                        <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
                            <Ionicons name="image-outline" size={24} color="#333" />
                            <Text style={styles.attachButtonText}>Фото</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
                            <Ionicons name="document-outline" size={24} color="#333" />
                            <Text style={styles.attachButtonText}>Документ</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.attachmentsPreview}>
                        {attachments.map((att, index) => (
                            <View key={index} style={styles.attachmentItem}>
                                <Ionicons
                                    name={att.type === 'image' ? 'image' : 'document'}
                                    size={20}
                                    color="#666"
                                />
                                <Text style={styles.attachmentName} numberOfLines={1}>{att.name}</Text>
                                <TouchableOpacity onPress={() => removeAttachment(att.uri)} style={styles.removeAttachmentButton}>
                                    <Ionicons name="close-circle" size={20} color="#F44336" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmitOrder}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.submitButtonText}>Опубликовать Заказ</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 10,
        overflow: 'hidden',
        backgroundColor: '#f9f9f9',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    pickerItem: {
        fontSize: 16,
        color: '#333',
    },
    preferredPerformerContainer: {
        backgroundColor: '#e6f7ff',
        borderRadius: 10,
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#91d5ff',
    },
    preferredPerformerText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 5,
    },
    attachmentButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
        marginTop: 10,
    },
    attachButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eee',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    attachButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    attachmentsPreview: {
        marginTop: 10,
    },
    attachmentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
        marginBottom: 8,
    },
    attachmentName: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#555',
    },
    removeAttachmentButton: {
        marginLeft: 10,
        padding: 5,
    },
    submitButton: {
        backgroundColor: '#333',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default ClientCreateOrderScreen;