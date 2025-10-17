// Obtener la URL base del backend desde las variables de entorno
const BASE_URL = import.meta.env.VITE_API_URL;

// Helper para manejar las respuestas de la API
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        const error = (data && data.msg) || response.statusText;
        throw new Error(error);
    }
    return data;
};

// Función genérica para hacer peticiones fetch
export const apiRequest = async (endpoint, method = 'GET', body = null, token = null, options = {}) => {
    // Construir la URL asegurándose de que siempre incluya /api/
    // Si BASE_URL ya incluye /api, no se duplica
    // Si BASE_URL no incluye /api, se agrega automáticamente
    let baseUrl = BASE_URL.replace(/\/$/, ''); // Remover barra final si existe

    // Si la URL base NO termina con /api, agregarlo
    if (!baseUrl.endsWith('/api')) {
        baseUrl = `${baseUrl}/api`;
    }

    // Construir URL final evitando barras dobles
    const url = `${baseUrl}/${endpoint.replace(/^\//, '')}`;

    const headers = {
        'Content-Type': 'application/json',
        'accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const fetchOptions = {
        method,
        headers,
        ...options, // Permite pasar opciones adicionales como signal para AbortController
    };

    if (body) {
        fetchOptions.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, fetchOptions);
        return handleResponse(response);
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

// Servicios específicos de la API
export const api = {
    auth: {
        login: (credentials, options = {}) => apiRequest('auth/login', 'POST', credentials, null, options),
        register: (userData, options = {}) => apiRequest('auth/register', 'POST', userData, null, options),
        getProfile: (token, options = {}) => apiRequest('auth/profile', 'GET', null, token, options),
    },
    products: {
        get: (category = '', options = {}) => apiRequest(`products${category ? `?category=${category}` : ''}`, 'GET', null, null, options),
        getById: (id, options = {}) => apiRequest(`products/${id}`, 'GET', null, null, options),
        getWithGallery: (category, options = {}) => apiRequest(`products/category/${category}`, 'GET', null, null, options),
    },
    content: {
        get: (sectionName, options = {}) => apiRequest(`content/${sectionName}`, 'GET', null, null, options),
    },
    orders: {
        create: (orderData, token, options = {}) => apiRequest('orders', 'POST', orderData, token, options),
        getMyOrders: (token, options = {}) => apiRequest('orders/myorders', 'GET', null, token, options)
    }
};