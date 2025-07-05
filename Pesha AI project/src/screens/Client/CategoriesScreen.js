// src/screens/Client/CategoriesScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Для иконок

// Временные данные для категорий, в будущем будут загружаться с бэкенда
const DUMMY_CATEGORIES = [
    { id: '1', name: 'Home Services', icon: 'home-outline' },
    { id: '2', name: 'Repair and Construction', icon: 'hammer-outline' },
    { id: '3', name: 'Moving', icon: 'car-outline' },
    { id: '4', name: 'Courier Services', icon: 'bicycle-outline' },
    { id: '5', name: 'Cleaning', icon: 'brush-outline' },
    { id: '6', name: 'LP Lorem Ipsum', icon: 'document-text-outline' },
    { id: '7', name: 'Websites', icon: 'globe-outline' },
    { id: '8', name: 'Design', icon: 'color-palette-outline' },
];

const CategoriesScreen = () => {
    const navigation = useNavigation();

    const handleCategoryPress = (category) => {
        // Теперь переходим на экран выбора услуг
        navigation.navigate('ServicesSelection', { categoryName: category.name, categoryId: category.id });
    };

    const renderCategoryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(item)}
        >
            <Ionicons name={item.icon} size={40} color="#333" />
            <Text style={styles.categoryName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Categories</Text>
            <Text style={styles.headerSubtitle}>Find a specialist for any task</Text>

            <FlatList
                data={DUMMY_CATEGORIES}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.categoriesGrid}
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
        marginBottom: 5,
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    categoriesGrid: {
        justifyContent: 'space-between',
    },
    categoryItem: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        margin: 8,
        height: 140,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryName: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        color: '#333',
    },
});

export default CategoriesScreen;