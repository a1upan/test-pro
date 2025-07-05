// src/navigation/ClientNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

// Экраны для клиентов
import ClientDashboardScreen from '../screens/Client/ClientDashboardScreen';
import ClientCreateOrderScreen from '../screens/Client/ClientCreateOrderScreen';
import ClientOrdersScreen from '../screens/Client/ClientOrdersScreen';
import ClientProfileScreen from '../screens/Client/ClientProfileScreen';
import ClientOrderDetailsScreen from '../screens/Client/ClientOrderDetailsScreen';
import ClientRatePerformerScreen from '../screens/Client/ClientRatePerformerScreen';
import ClientFavoritePerformersScreen from '../screens/Client/ClientFavoritePerformersScreen';
import ClientBrowseCategoriesScreen from '../screens/Client/ClientBrowseCategoriesScreen'; // <-- НОВЫЙ ИМПОРТ
import ClientPerformersByCategoryScreen from '../screens/Client/ClientPerformersByCategoryScreen'; // <-- НОВЫЙ ИМПОРТ
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const DashboardStack = createStackNavigator();
const CreateOrderStack = createStackNavigator();
const OrdersStack = createStackNavigator();
const FavoritesStack = createStackNavigator();
const BrowseStack = createStackNavigator(); // <-- НОВЫЙ СТЕК ДЛЯ ПРОСМОТРА КАТЕГОРИЙ
const ProfileStack = createStackNavigator();

// Стек для главной панели (Dashboard)
const DashboardStackScreen = () => (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
        <DashboardStack.Screen name="ClientDashboard" component={ClientDashboardScreen} />
        <DashboardStack.Screen name="ClientOrderDetails" component={ClientOrderDetailsScreen} />
    </DashboardStack.Navigator>
);

// Стек для создания заказа
const CreateOrderStackScreen = () => (
    <CreateOrderStack.Navigator screenOptions={{ headerShown: false }}>
        <CreateOrderStack.Screen name="ClientCreateOrder" component={ClientCreateOrderScreen} />
    </CreateOrderStack.Navigator>
);

// Стек для заказов клиента
const OrdersStackScreen = () => (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
        <OrdersStack.Screen name="ClientOrdersList" component={ClientOrdersScreen} />
        <OrdersStack.Screen name="ClientOrderDetails" component={ClientOrderDetailsScreen} />
        <OrdersStack.Screen name="ClientRatePerformer" component={ClientRatePerformerScreen} />
        <OrdersStack.Screen name="Chat" component={ChatScreen} />
    </OrdersStack.Navigator>
);

// Стек для избранных исполнителей
const FavoritesStackScreen = () => (
    <FavoritesStack.Navigator screenOptions={{ headerShown: false }}>
        <FavoritesStack.Screen name="ClientFavoritePerformers" component={ClientFavoritePerformersScreen} />
    </FavoritesStack.Navigator>
);

// Стек для просмотра категорий и исполнителей (НОВЫЙ)
const BrowseStackScreen = () => (
    <BrowseStack.Navigator screenOptions={{ headerShown: false }}>
        <BrowseStack.Screen name="ClientBrowseCategories" component={ClientBrowseCategoriesScreen} />
        <BrowseStack.Screen name="ClientPerformersByCategory" component={ClientPerformersByCategoryScreen} />
        {/* Возможно, сюда же можно добавить экран с деталями профиля исполнителя, чтобы клиент мог его просмотреть перед выбором */}
        <BrowseStack.Screen name="ClientPerformerProfileDetails" component={ClientPerformersByCategoryScreen} /> {/* Пока переиспользуем, в будущем будет отдельный экран */}
        <BrowseStack.Screen name="ClientCreateOrderFromSearch" component={ClientCreateOrderScreen} /> {/* Для перехода на создание заказа из поиска */}
    </BrowseStack.Navigator>
);

// Стек для профиля клиента
const ProfileStackScreen = () => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="ClientProfile" component={ClientProfileScreen} />
    </ProfileStack.Navigator>
);


const ClientNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'ClientDashboardTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'ClientCreateOrderTab') {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (route.name === 'ClientOrdersTab') {
                        iconName = focused ? 'briefcase' : 'briefcase-outline';
                    } else if (route.name === 'ClientFavoritesTab') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'ClientBrowseTab') { // <-- НОВЫЙ ТАБ
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'ClientProfileTab') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#FFD700',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    height: 70,
                    paddingBottom: Platform.OS === 'ios' ? 15 : 5,
                    paddingTop: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    marginBottom: Platform.OS === 'ios' ? 0 : 5,
                },
            })}
        >
            <Tab.Screen
                name="ClientDashboardTab"
                component={DashboardStackScreen}
                options={{ title: 'Главная' }}
            />
            <Tab.Screen
                name="ClientBrowseTab" // <-- НОВЫЙ ТАБ
                component={BrowseStackScreen}
                options={{ title: 'Поиск' }}
            />
            <Tab.Screen
                name="ClientCreateOrderTab"
                component={CreateOrderStackScreen}
                options={{ title: 'Создать Заказ' }}
            />
            <Tab.Screen
                name="ClientOrdersTab"
                component={OrdersStackScreen}
                options={{ title: 'Мои Заказы' }}
            />
            <Tab.Screen
                name="ClientFavoritesTab"
                component={FavoritesStackScreen}
                options={{ title: 'Избранное' }}
            />
            <Tab.Screen
                name="ClientProfileTab"
                component={ProfileStackScreen}
                options={{ title: 'Профиль' }}
            />
        </Tab.Navigator>
    );
};

export default ClientNavigator;