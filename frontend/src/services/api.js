const API_URL = import.meta.env.VITE_API_URL;

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
export const apiRequest = async (endpoint, method = 'GET', body = null, token = null) => {
    // Se asegura de que la URL se construya correctamente, evitando dobles barras (//)
    const url = `${API_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    const headers = {
        'Content-Type': 'application/json',
        'accept': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(url, options);
        return handleResponse(response);
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
};

// Ejemplos de servicios específicos
export const api = {
    auth: {
        login: (credentials) => apiRequest('auth/login', 'POST', credentials),
        register: (userData) => apiRequest('auth/register', 'POST', userData),
        getProfile: (token) => apiRequest('auth/profile', 'GET', null, token),
    },
    products: {
        get: (category = '') => apiRequest(`products${category ? `?category=${category}` : ''}`),
        getById: (id) => apiRequest(`products/${id}`),
    },
    content: {
        get: (sectionName) => apiRequest(`content/${sectionName}`),
    },
    orders: {
        create: (orderData, token) => apiRequest('orders', 'POST', orderData, token),
        getMyOrders: (token) => apiRequest('orders/myorders', 'GET', null, token)
    }
};