// App.js
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View, StyleSheet, Text, TouchableOpacity } from 'react-native';

// Импорт навигаторов
import ClientNavigator from './src/navigation/ClientNavigator';
import PerformerNavigator from './src/navigation/PerformerNavigator';
import AuthScreen from './src/screens/AuthScreen';

const Stack = createStackNavigator();

const App = () => {
    // В реальном приложении здесь будет логика проверки аутентификации
    // и загрузки роли пользователя.
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null); // 'client' или 'performer'

    useEffect(() => {
        // Имитация проверки аутентификации и загрузки роли
        setTimeout(() => {
            setIsLoading(false);
            // Для демонстрации, можем по умолчанию установить одну из ролей
            // Или оставить isAuthenticated: false для показа AuthScreen
            // setIsAuthenticated(true);
            // setUserRole('client'); // Или 'performer'
        }, 1500);
    }, []);

    // Временный переключатель для отладки
    const toggleRole = (role) => {
        setIsAuthenticated(true);
        setUserRole(role);
    };

    if (isLoading) {
        return (
            <SafeAreaProvider style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={{ marginTop: 10 }}>Загрузка приложения...</Text>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <NavigationContainer>
                <StatusBar style="auto" />
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {!isAuthenticated ? (
                        <Stack.Screen name="Auth">
                            {props => <AuthScreen {...props} onAuthenticate={(role) => toggleRole(role)} />}
                        </Stack.Screen>
                    ) : (
                        userRole === 'client' ? (
                            <Stack.Screen name="ClientApp" component={ClientNavigator} />
                        ) : (
                            <Stack.Screen name="PerformerApp" component={PerformerNavigator} />
                        )
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    // Добавьте стили для кнопок переключения, если вы их используете
    roleSwitcherContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    roleButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#FFD700',
    },
    roleButtonText: {
        fontWeight: 'bold',
        color: '#333',
    },
});

export default App;