// src/constants/types.js

// Общие типы
export const UserRole = {
    CLIENT: 'client',
    PERFORMER: 'performer',
    ADMIN: 'admin',
};

export const RequestStatus = {
    PENDING: 'на рассмотрении',
    ACTIVE: 'активно',
    COMPLETED: 'завершен',
    CANCELED_BY_CLIENT: 'отклонен клиентом',
    CANCELED_BY_PERFORMER: 'отклонен исполнителем', // Добавлено, если исполнитель может отменять
    CLOSED_AUTOMATICALLY: 'закрыт автоматически',
};

export const PerformerStatus = {
    AVAILABLE: 'доступен',
    UNAVAILABLE: 'недоступен',
    INACTIVE: 'неактивен', // Для модерации
};

// Модель пользователя
export interface User {
    id: string;
    fullName: string;
    phoneNumber: string;
    role: UserRole;
    // ... другие общие поля
}

// Модель клиента
export interface Client extends User {
    // В будущем: email, address
}

// Модель исполнителя
export interface Performer extends User {
    serviceIds: string[]; // ID услуг, которые предоставляет исполнитель
    categoryIds: string[]; // ID категорий
    status: PerformerStatus;
    description?: string;
    workPhotos: string[]; // URL'ы фото работ
    finPassport?: string; // FIN паспорта (скрыт)
    averageRating: number;
    reviewCount: number;
    location: {
        city: string;
        district?: string;
        metro?: string;
    };
    onServiceSince: string; // Дата регистрации
    experienceYears?: number;
    workAddress?: string; // Место работы (по адресу)
    workRemotely: boolean; // Можно удаленно
    educationDocs: string[]; // Образование/Документы/Сертификаты
    achievements: string[];
    // Для VIP
    isVIP: boolean;
    vipSubscriptionEndDate?: string;
    // ... другие поля
    debt: number; // Для админа
}

// Модель услуги
export interface Service {
    id: string;
    name: string;
    categoryId: string; // Связь с категорией
    minPrice?: number; // Минимальная цена (для отображения в профиле исполнителя)
    photoUrl?: string; // Пример фото услуги
    isCompanyService: boolean; // Указывает, могут ли выполнять компании
    isPrivateSpecialistService: boolean; // Указывает, могут ли выполнять частные специалисты
}

// Модель категории
export interface Category {
    id: string;
    name: string;
}

// Модель предложения (как под-услуга или тип работы)
export interface Offer {
    id: string;
    name: string;
    serviceId: string; // К какой услуге относится предложение
}

// Модель запроса от клиента
export interface Request {
    id: string;
    clientId: string;
    description: string;
    address: string;
    city: string;
    district?: string;
    phoneNumber: string;
    price?: number; // Максимальная цена
    dueDate?: string; // Точная дата выполнения
    timePeriod?: string; // Период выполнения (или "свободный срок")
    workLocation: 'on_address' | 'remote' | 'travel'; // Место работы
    photos: string[]; // URL'ы фото
    status: RequestStatus;
    createdAt: string;
    serviceId: string;
    offerId?: string; // Если запрос по конкретному предложению
    selectedPerformerId?: string; // Выбранный исполнитель
    respondedPerformers: {
        performerId: string;
        offeredPrice?: number;
        respondedAt: string;
    }[]; // Список откликнувшихся исполнителей с их предложениями
    cancellationReason?: string; // Причина отмены
    moderationStatus: 'pending' | 'approved' | 'rejected'; // Статус модерации
    // Для "одному", "всем", "одному и всем"
    requestType: 'to_all' | 'to_one' | 'to_one_and_all';
    targetPerformerId?: string; // Для "одному" или "одному и всем"
    // ... история изменений
}

// Модель заказа (активный запрос после принятия)
export interface Order {
    id: string;
    requestId: string;
    clientId: string;
    performerId: string;
    status: 'active' | 'completed' | 'canceled'; // Может отличаться от статусов запроса
    contractUrl?: string;
    actOfWorkUrl?: string;
    receiptUrl?: string;
    chatId: string;
    // ... другая информация, перенесенная из запроса
}

// Модель отзыва
export interface Review {
    id: string;
    orderId: string;
    reviewerId: string; // Клиент
    reviewedPerformerId: string; // Исполнитель
    rating: number; // от 1 до 5
    comment: string;
    createdAt: string;
}

// Модель компании (для будущего)
export interface Company extends User {
    organizationName: string;
    isVerified: boolean; // Галочка "Организация проверена"
    worksByContract: boolean; // "Работает по договору"
    givesWarranty: boolean; // "Даёт гарантию"
    acceptsContactlessPayment: boolean; // "Принимает бесконтактный платеж"
    workingDays: string[]; // Дни работы
    workingHours: string; // Время работы
    employeeCount: number;
    // ... другие поля аналогичные Performer, но для компании
}