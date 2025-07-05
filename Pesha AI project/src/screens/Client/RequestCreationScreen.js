// src/screens/Client/RequestCreationScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    Switch,
    Platform,
    Button,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';

const RequestSchema = Yup.object().shape({
    description: Yup.string()
        .min(10, 'Описание слишком короткое!')
        .required('Описание задачи обязательно'),
    city: Yup.string().required('Город обязателен'),
    district: Yup.string().when('city', {
        is: 'Баку',
        then: (schema) => schema.required('Район обязателен для Баку'),
        otherwise: (schema) => schema.notRequired(),
    }),
    address: Yup.string().required('Адрес обязателен'),
    phoneNumber: Yup.string()
        .matches(/^\+?\d{9,15}$/, 'Некорректный номер телефона')
        .required('Номер телефона обязателен'),
    price: Yup.number()
        .min(0, 'Цена не может быть отрицательной')
        .nullable(),
});

const BAKU_DISTRICTS = [
    'Наримановский', 'Низаминский', 'Ясамальский', 'Сабаильский',
    'Хатаинский', 'Бинагадинский', 'Сураханский', 'Гарадагский',
    'Азизбековский', 'Насиминский'
];

const WORK_LOCATIONS = [
    { label: 'По адресу', value: 'on_address' },
    { label: 'На выезд', value: 'travel' },
    { label: 'Удаленно', value: 'remote' },
];

const RequestCreationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryName, categoryId, selectedService, selectedOffers, performerType, targetPerformer, requestType } = route.params || {};

    const [photos, setPhotos] = useState([]);

    const handleCreateRequest = async (values) => {
        try {
            const requestData = {
                ...values,
                categoryId: categoryId,
                serviceId: selectedService?.id,
                offerIds: selectedOffers.map(o => o.id),
                performerType: performerType,
                targetPerformerId: targetPerformer?.id || null, // ID конкретного исполнителя, если выбран
                requestType: requestType, // 'to_one' или 'to_all'
                photos: photos,
                // moderationStatus: 'pending',
            };
            console.log('Данные для отправки запроса:', requestData);
            // const response = await createRequest(requestData);
            Alert.alert('Успех', 'Ваш запрос успешно отправлен и будет рассмотрен модератором.');
            navigation.navigate('OrdersTab'); // Переходим на вкладку "Мои Заказы" после создания
        } catch (error) {
            console.error('Ошибка при создании запроса:', error);
            Alert.alert('Ошибка', 'Не удалось отправить запрос. Попробуйте еще раз.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Создание запроса</Text>
            </View>

            <Text style={styles.sectionTitle}>
                Услуга: {selectedService?.name || 'Не выбрана'}
            </Text>
            {selectedOffers && selectedOffers.length > 0 && (
                <Text style={styles.sectionDescription}>
                    Предложения: {selectedOffers.map(o => o.name).join(', ')}
                </Text>
            )}
            {performerType && (
                <Text style={styles.sectionDescription}>
                    Тип исполнителя: {performerType === 'private' ? 'Частный специалист' : 'Компания'}
                </Text>
            )}
            {targetPerformer && (
                <Text style={styles.sectionDescription}>
                    Целевой исполнитель: {targetPerformer.name} ({targetPerformer.isCompany ? 'Компания' : 'Частный специалист'})
                </Text>
            )}
            {requestType === 'to_all' && (
                <Text style={styles.sectionDescription}>
                    Запрос будет отправлен всем подходящим исполнителям.
                </Text>
            )}

            <Formik
                initialValues={{
                    description: '',
                    city: 'Баку',
                    district: '',
                    address: '',
                    phoneNumber: '',
                    price: '',
                    dueDate: '',
                    timePeriod: '',
                    workLocation: 'on_address',
                }}
                validationSchema={RequestSchema}
                onSubmit={handleCreateRequest}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <View>
                        {/* Описание задачи */}
                        <Text style={styles.label}>Описание задачи</Text>
                        <TextInput
                            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                            placeholder="Опишите задачу в поле для ввода текста"
                            onChangeText={handleChange('description')}
                            onBlur={handleBlur('description')}
                            value={values.description}
                            multiline
                        />
                        {touched.description && errors.description && (
                            <Text style={styles.errorText}>{errors.description}</Text>
                        )}

                        {/* Город и Район */}
                        <Text style={styles.label}>Город</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={values.city}
                                onValueChange={(itemValue) => {
                                    setFieldValue('city', itemValue);
                                    if (itemValue !== 'Баку') {
                                        setFieldValue('district', '');
                                    }
                                }}
                            >
                                <Picker.Item label="Баку" value="Баку" />
                            </Picker>
                        </View>
                        {touched.city && errors.city && (
                            <Text style={styles.errorText}>{errors.city}</Text>
                        )}

                        {values.city === 'Баку' && (
                            <>
                                <Text style={styles.label}>Административный район</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={values.district}
                                        onValueChange={(itemValue) => setFieldValue('district', itemValue)}
                                    >
                                        <Picker.Item label="Выберите район" value="" />
                                        {BAKU_DISTRICTS.map((district, index) => (
                                            <Picker.Item key={index} label={district} value={district} />
                                        ))}
                                    </Picker>
                                </View>
                                {touched.district && errors.district && (
                                    <Text style={styles.errorText}>{errors.district}</Text>
                                )}
                            </>
                        )}

                        {/* Адрес */}
                        <Text style={styles.label}>Адрес</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Начните вводить адрес или добавить локацию в картах"
                            onChangeText={handleChange('address')}
                            onBlur={handleBlur('address')}
                            value={values.address}
                        />
                        {touched.address && errors.address && (
                            <Text style={styles.errorText}>{errors.address}</Text>
                        )}

                        {/* Номер телефона */}
                        <Text style={styles.label}>Номер телефона</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+994XXXXXXXXX"
                            onChangeText={handleChange('phoneNumber')}
                            onBlur={handleBlur('phoneNumber')}
                            value={values.phoneNumber}
                            keyboardType="phone-pad"
                        />
                        {touched.phoneNumber && errors.phoneNumber && (
                            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                        )}

                        {/* Необязательные параметры */}
                        <Text style={styles.sectionTitle}>Необязательные параметры</Text>

                        {/* Максимальная цена */}
                        <Text style={styles.label}>Максимальный бюджет (AZN)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="До 500 AZN"
                            onChangeText={handleChange('price')}
                            onBlur={handleBlur('price')}
                            value={values.price}
                            keyboardType="numeric"
                        />
                        {touched.price && errors.price && (
                            <Text style={styles.errorText}>{errors.price}</Text>
                        )}

                        {/* Сроки выполнения */}
                        <Text style={styles.label}>Сроки выполнения работы</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={[styles.radioButton, values.timePeriod === 'exact_date' && styles.radioButtonSelected]}
                                onPress={() => setFieldValue('timePeriod', 'exact_date')}
                            >
                                <Text style={values.timePeriod === 'exact_date' && { color: '#fff' }}>Точная дата</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, values.timePeriod === 'flexible' && styles.radioButtonSelected]}
                                onPress={() => setFieldValue('timePeriod', 'flexible')}
                            >
                                <Text style={values.timePeriod === 'flexible' && { color: '#fff' }}>Свободный срок</Text>
                            </TouchableOpacity>
                        </View>
                        {values.timePeriod === 'exact_date' && (
                            <TextInput
                                style={styles.input}
                                placeholder="Укажите точную дату"
                                onChangeText={handleChange('dueDate')}
                                onBlur={handleBlur('dueDate')}
                                value={values.dueDate}
                            />
                        )}

                        {/* Место работы */}
                        <Text style={styles.label}>Место работы</Text>
                        <View style={styles.radioGroup}>
                            {WORK_LOCATIONS.map((loc) => (
                                <TouchableOpacity
                                    key={loc.value}
                                    style={[styles.radioButton, values.workLocation === loc.value && styles.radioButtonSelected]}
                                    onPress={() => setFieldValue('workLocation', loc.value)}
                                >
                                    <Text style={values.workLocation === loc.value && { color: '#fff' }}>{loc.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Загрузка фото */}
                        {/* <Text style={styles.label}>Добавить фото (макс 3)</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                            <Ionicons name="camera-outline" size={24} color="#666" />
                            <Text style={styles.uploadButtonText}>Выбрать фото</Text>
                        </TouchableOpacity>
                        <View style={styles.photoPreviewContainer}>
                            {photos.map((uri, index) => (
                                <Image key={index} source={{ uri }} style={styles.photoPreview} />
                            ))}
                        </View> */}

                        <TouchableOpacity style={styles.sendRequestButton} onPress={handleSubmit}>
                            <Text style={styles.sendRequestButtonText}>Отправить запрос</Text>
                        </TouchableOpacity>
                        <View style={{ height: 50 }} />
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    sectionDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
    },
    input: {
        height: 50,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    pickerContainer: {
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginTop: 5,
        marginBottom: 5,
    },
    sendRequestButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    sendRequestButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    radioGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    radioButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: 10,
        marginTop: 10,
        backgroundColor: '#fff',
    },
    radioButtonSelected: {
        backgroundColor: '#333',
        borderColor: '#333',
    },
});

export default RequestCreationScreen;