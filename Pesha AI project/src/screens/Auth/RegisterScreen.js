// src/screens/Auth/RegisterScreen.js
import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

// Предполагаемый сервис для регистрации
// import { registerClient } from '../../services/authService';

const RegisterSchema = Yup.object().shape({
    fullName: Yup.string()
        .min(2, 'Слишком короткое имя!')
        .max(50, 'Слишком длинное имя!')
        .required('Имя обязательно'),
    phoneNumber: Yup.string()
        .matches(/^\+?\d{9,15}$/, 'Некорректный номер телефона') // Пример для +994XXYYYYYYY
        .required('Номер телефона обязателен'),
});

const RegisterScreen = () => {
    const navigation = useNavigation();

    const handleRegister = async (values) => {
        try {
            // const response = await registerClient(values.fullName, values.phoneNumber);
            // Здесь должна быть логика отправки данных на бэкенд
            console.log('Попытка регистрации:', values);
            Alert.alert('Успех', 'Вы успешно зарегистрированы!');
            navigation.navigate('Client'); // Переходим на главный экран клиента
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            Alert.alert('Ошибка', 'Не удалось зарегистрироваться. Попробуйте еще раз.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Регистрация Клиента</Text>
            <Formik
                initialValues={{ fullName: '', phoneNumber: '' }}
                validationSchema={RegisterSchema}
                onSubmit={handleRegister}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder="Полное имя"
                            onChangeText={handleChange('fullName')}
                            onBlur={handleBlur('fullName')}
                            value={values.fullName}
                        />
                        {touched.fullName && errors.fullName && (
                            <Text style={styles.errorText}>{errors.fullName}</Text>
                        )}

                        <TextInput
                            style={styles.input}
                            placeholder="Номер телефона (например, +994XXXXXXXXX)"
                            onChangeText={handleChange('phoneNumber')}
                            onBlur={handleBlur('phoneNumber')}
                            value={values.phoneNumber}
                            keyboardType="phone-pad"
                        />
                        {touched.phoneNumber && errors.phoneNumber && (
                            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                        )}

                        <Button title="Зарегистрироваться" onPress={handleSubmit} />
                        <Button
                            title="Уже есть аккаунт? Войти"
                            onPress={() => navigation.navigate('Login')}
                        />
                    </View>
                )}
            </Formik>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    errorText: {
        fontSize: 12,
        color: 'red',
        marginBottom: 5,
    },
});

export default RegisterScreen;