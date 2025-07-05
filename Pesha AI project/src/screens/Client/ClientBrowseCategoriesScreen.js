// src/screens/Client/ClientBrowseCategoriesScreen.js
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Временные данные для категорий услуг
const DUMMY_CATEGORIES = [
    { id: 'cat1', name: 'Электрик', icon: 'flash-outline', image: 'https://via.placeholder.com/100/FFD700/000000?text=Электрик' },
    { id: 'cat2', name: 'Сантехник', icon: 'water-outline', image: 'https://via.placeholder.com/100/ADD8E6/000000?text=Сантехник' },
    { id: 'cat3', name: 'Малярные работы', icon: 'brush-outline', image: 'https://via.placeholder.com/100/F08080/000000?text=Маляр' },
    { id: 'cat4', name: 'Уборка', icon: 'sparkles-outline', image: 'https://via.placeholder.com/100/90EE90/000000?text=Уборка' },
    { id: 'cat5', name: 'Грузоперевозки', icon: 'cube-outline', image: 'https://via.placeholder.com/100/DDA0DD/000000?text=Груз' },
    { id: 'cat6', name: 'Ремонт бытовой техники', icon: 'hardware-chip-outline', image: 'https://via.placeholder.com/100/FFA07A/000000?text=Техника' },
    { id: 'cat7', name: 'Мелкий ремонт', icon: 'build-outline', image: 'https://via.placeholder.com/100/D3D3D3/000000?text=Ремонт' },
    { id: 'cat8', name: 'Садовник', icon: 'leaf-outline', image: 'https://via.placeholder.com/100/9ACD32/000000?text=Садовник' },
    { id: 'cat9', name: 'Компьютерная помощь', icon: 'desktop-outline', image: 'https://via.placeholder.com/100/87CEEB/000000?text=Компьютер' },
    { id: 'cat10', name: 'Автосервис', icon: 'car-sport-outline', image: 'https://via.placeholder.com/100/CD5C5C/000000?text=Авто' },
];

const ClientBrowseCategoriesScreen = () => {
    const navigation = useNavigation();

    const handleCategoryPress = (categoryName) => {
        // Переход на экран с списком исполнителей по выбранной категории
        navigation.navigate('ClientPerformersByCategory', { category: categoryName });
    };

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity style={styles.categoryCard} onPress={() => handleCategoryPress(item.name)}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.categoryImage} />
            ) : (
                <Ionicons name={item.icon || 'help-circle-outline'} size={40} color="#FFD700" />
            )}
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Категории Услуг</Text>
                {/* Опционально: кнопка для поиска по всем исполнителям или общая кнопка создания заказа */}
                <TouchableOpacity style={styles.createOrderButton} onPress={() => navigation.navigate('ClientCreateOrderTab')}>
                    <Ionicons name="add-circle-outline" size={26} color="#333" />
                    <Text style={styles.createOrderButtonText}>Создать заказ</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={DUMMY_CATEGORIES}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                numColumns={2} // Отображаем в 2 столбца
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
            />
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
    createOrderButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    createOrderButtonText: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    listContent: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    categoryCard: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%', // 2 элемента в строке с небольшим отступом
        aspectRatio: 1, // Делает карточку квадратной
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal: '1%', // Для отступа между карточками
        marginBottom: 15,
    },
    categoryImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: 5,
    },
});

export default ClientBrowseCategoriesScreen;