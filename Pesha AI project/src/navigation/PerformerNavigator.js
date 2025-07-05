// src/navigation/PerformerNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

// Экраны для исполнителей
import PerformerDashboardScreen from '../screens/Performer/PerformerDashboardScreen';
import PerformerOrdersScreen from '../screens/Performer/PerformerOrdersScreen';
import PerformerProfileScreen from '../screens/Performer/PerformerProfileScreen';
import PerformerOrderDetailsScreen from '../screens/Performer/PerformerOrderDetailsScreen';
import PerformerMakeOfferScreen from '../screens/Performer/PerformerMakeOfferScreen'; // <-- НОВЫЙ ИМПОРТ
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const DashboardStack = createStackNavigator();
const OrdersStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Стек для главной панели исполнителя
const DashboardStackScreen = () => (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
        <DashboardStack.Screen name="PerformerDashboard" component={PerformerDashboardScreen} />
        <DashboardStack.Screen name="PerformerOrderDetails" component={PerformerOrderDetailsScreen} />
        <DashboardStack.Screen name="PerformerMakeOffer" component={PerformerMakeOfferScreen} /> {/* <-- НОВЫЙ МАРШРУТ */}
    </DashboardStack.Navigator>
);

// Стек для заказов исполнителя
const OrdersStackScreen = () => (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
        <OrdersStack.Screen name="PerformerOrdersList" component={PerformerOrdersScreen} />
        <OrdersStack.Screen name="PerformerOrderDetails" component={PerformerOrderDetailsScreen} />
        <OrdersStack.Screen name="Chat" component={ChatScreen} />
        <OrdersStack.Screen name="PerformerMakeOffer" component={PerformerMakeOfferScreen} /> {/* <-- НОВЫЙ МАРШРУТ */}
    </OrdersStack.Navigator>
);

// Стек для профиля исполнителя
const ProfileStackScreen = () => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="PerformerProfile" component={PerformerProfileScreen} />
    </ProfileStack.Navigator>
);


const PerformerNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'PerformerDashboardTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'PerformerOrdersTab') {
                        iconName = focused ? 'briefcase' : 'briefcase-outline';
                    } else if (route.name === 'PerformerProfileTab') {
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
                name="PerformerDashboardTab"
                component={DashboardStackScreen}
                options={{ title: 'Главная' }}
            />
            <Tab.Screen
                name="PerformerOrdersTab"
                component={OrdersStackScreen}
                options={{ title: 'Мои Заказы' }}
            />
            <Tab.Screen
                name="PerformerProfileTab"
                component={ProfileStackScreen}
                options={{ title: 'Профиль' }}
            />
        </Tab.Navigator>
    );
};

export default PerformerNavigator;