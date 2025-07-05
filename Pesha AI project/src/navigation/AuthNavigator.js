// src/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;

// src/navigation/ClientNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CategoriesScreen from '../screens/Client/CategoriesScreen';
import RequestsListScreen from '../screens/Client/RequestsListScreen';
import ProfileScreen from '../screens/Client/ProfileScreen';

const Tab = createBottomTabNavigator();

const ClientNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Категории" component={CategoriesScreen} />
            <Tab.Screen name="Заказы" component={RequestsListScreen} /> {/* Возможно, переименуем в "Запросы" или "Мои Заказы" */}
            <Tab.Screen name="Профиль" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default ClientNavigator;

// src/navigation/PerformerNavigator.js (Пример)
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PerformerRequestsScreen from '../screens/Performer/PerformerRequestsScreen';
import PerformerOrdersScreen from '../screens/Performer/PerformerOrdersScreen';
import PerformerProfileScreen from '../screens/Performer/PerformerProfileScreen';

const Tab = createBottomTabNavigator();

const PerformerNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Запросы" component={PerformerRequestsScreen} />
            <Tab.Screen name="Заказы" component={PerformerOrdersScreen} />
            <Tab.Screen name="Кабинет" component={PerformerProfileScreen} />
        </Tab.Navigator>
    );
};

export default PerformerNavigator;

// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import ClientNavigator from './ClientNavigator';
import PerformerNavigator from './PerformerNavigator';
// import AdminNavigator from './AdminNavigator'; // Если будет отдельный навигатор для админа

const Stack = createStackNavigator();

const AppNavigator = () => {
    // Здесь будет логика для определения роли пользователя
    // и выбора соответствующего навигатора
    const userRole = 'client'; // Это должно приходить из состояния или после аутентификации

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {/* Предположим, что неавторизованные пользователи видят только AuthNavigator */}
                {!userRole ? (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <>
                        {userRole === 'client' && (
                            <Stack.Screen name="Client" component={ClientNavigator} />
                        )}
                        {userRole === 'performer' && (
                            <Stack.Screen name="Performer" component={PerformerNavigator} />
                        )}
                        {/* {userRole === 'admin' && (
                            <Stack.Screen name="Admin" component={AdminNavigator} />
                        )} */}
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;

// App.js
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
    return <AppNavigator />;
}