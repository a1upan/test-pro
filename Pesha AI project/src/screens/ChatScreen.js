// src/screens/ChatScreen.js
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Временные данные для демонстрации чата
// Обычно сообщения будут приходить с бэкенда и храниться в состоянии
const DUMMY_MESSAGES = [
    {
        _id: 'msg1',
        text: 'Здравствуйте! Я готов выполнить ваш заказ. Могу ли я уточнить детали?',
        createdAt: new Date(Date.now() - 60 * 1000 * 5), // 5 минут назад
        user: {
            _id: 'performer1',
            name: 'Исполнитель Профи',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
    },
    {
        _id: 'msg2',
        text: 'Добрый день! Да, конечно, спрашивайте.',
        createdAt: new Date(Date.now() - 60 * 1000 * 2), // 2 минуты назад
        user: {
            _id: 'client1', // Это текущий пользователь (клиент)
            name: 'Ваше Имя', // В реальном приложении сюда подставится имя текущего пользователя
        },
    },
    {
        _id: 'msg3',
        text: 'Хорошо, когда вам будет удобно, я хотел бы уточнить, есть ли у вас все необходимые материалы или мне нужно будет их приобрести?',
        createdAt: new Date(), // Сейчас
        user: {
            _id: 'performer1',
            name: 'Исполнитель Профи',
            avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        },
    },
];

const ChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId, performerId, performerName, clientName, currentUserId } = route.params; // orderId для идентификации чата, performerId/Name, clientName для отображения, currentUserId для идентификации сообщений

    const [messages, setMessages] = useState([]);
    const [recipientName, setRecipientName] = useState(''); // Имя собеседника
    const [senderId, setSenderId] = useState(''); // ID текущего пользователя

    useEffect(() => {
        // В реальном приложении:
        // 1. Загрузка истории сообщений для orderId (например, через WebSocket или REST API)
        // const fetchedMessages = await chatService.fetchMessages(orderId);
        // setMessages(fetchedMessages);
        setMessages(DUMMY_MESSAGES.reverse()); // Переворачиваем для GiftedChat (новые сверху)

        // Определение имени собеседника и ID текущего пользователя
        // В упрощенном случае:
        if (currentUserId === 'client1') { // Если текущий пользователь - клиент
            setRecipientName(performerName || 'Исполнитель');
            setSenderId('client1');
        } else if (currentUserId === 'performer1') { // Если текущий пользователь - исполнитель
            setRecipientName(clientName || 'Клиент');
            setSenderId('performer1');
        }
        // В реальном приложении, currentUserId будет браться из состояния авторизации
        // и использоваться для фильтрации сообщений и определения собеседника.

    }, [orderId, performerId, performerName, clientName, currentUserId]);

    const onSend = useCallback((newMessages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
        // В реальном приложении: Отправка сообщения на бэкенд
        newMessages.forEach(msg => {
            console.log('Отправка сообщения на бэкенд:', {
                orderId: orderId,
                senderId: msg.user._id,
                recipientId: msg.user._id === currentUserId ? (currentUserId === 'client1' ? performerId : 'client1') : msg.user._id, // Упрощено
                text: msg.text,
                createdAt: msg.createdAt,
            });
            // Например: chatService.sendMessage(orderId, msg.text, msg.user._id, recipientId);
        });
    }, [orderId, performerId, currentUserId]);

    // Кастомный рендер Bubble для стилизации
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        // Сообщения текущего пользователя
                        backgroundColor: '#FFD700', // Золотой
                    },
                    left: {
                        // Сообщения собеседника
                        backgroundColor: '#E0E0E0', // Светло-серый
                    },
                }}
                textStyle={{
                    right: {
                        color: '#333',
                    },
                    left: {
                        color: '#333',
                    },
                }}
            />
        );
    };

    // Кастомный рендер кнопки отправки
    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <Ionicons name="send" size={24} color="#FFD700" />
                </View>
            </Send>
        );
    };

    // Кастомный рендер InputToolbar для стилизации
    const renderInputToolbar = (props) => (
        <InputToolbar
            {...props}
            containerStyle={styles.inputToolbar}
            primaryStyle={styles.textInput}
        />
    );


    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Чат с {recipientName}</Text>
            </View>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: senderId, // ID текущего пользователя
                    name: currentUserId === 'client1' ? clientName : performerName, // Имя текущего пользователя
                    // avatar: 'URL_Аватара_Текущего_Пользователя',
                }}
                renderBubble={renderBubble}
                renderSend={renderSend}
                renderInputToolbar={renderInputToolbar}
                alwaysShowSend
                placeholder="Напишите сообщение..."
                showUserAvatar
                // Дополнительные настройки для iOS, чтобы клавиатура не перекрывала ввод
                bottomOffset={Platform.OS === 'ios' ? 0 : -20} // Убрал 0 для iOS, чтобы не конфликтовать с KeyboardAvoidingView (GiftedChat сам ее использует)
            // renderChatFooter={() => <View style={{ height: Platform.OS === 'ios' ? 20 : 0 }} />}
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
        paddingTop: Platform.OS === 'android' ? 20 : 0, // Учитываем отступ для Android, для iOS SafeAreaView справляется
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        // Применяем тени, как на других экранах
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        marginRight: 10,
    },
    inputToolbar: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: '#fff',
        paddingVertical: 5,
    },
    textInput: {
        color: '#333',
    },
});

export default ChatScreen;