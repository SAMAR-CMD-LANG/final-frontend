import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Create axios instance
const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Only add token if we're in the browser
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token if unauthorized, but don't redirect automatically
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('user')
            }
        }
        return Promise.reject(error)
    }
)

// Auth API
export const authAPI = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (userData) => api.put('/auth/profile', userData),
}

// Habits API
export const habitsAPI = {
    // Get all habits with filtering and sorting
    getHabits: (params = {}) => api.get('/habits', { params }),

    // Get specific habit
    getHabit: (id) => api.get(`/habits/${id}`),

    // Create new habit
    createHabit: (habitData) => api.post('/habits', habitData),

    // Update habit
    updateHabit: (id, habitData) => api.put(`/habits/${id}`, habitData),

    // Delete habit
    deleteHabit: (id) => api.delete(`/habits/${id}`),

    // Toggle habit completion
    toggleCompletion: (id, completionData) => api.post(`/habits/${id}/toggle`, completionData),

    // Get habit completions
    getCompletions: (id, params = {}) => api.get(`/habits/${id}/completions`, { params }),

    // Recalculate streaks
    recalculateStreaks: (id) => api.post(`/habits/${id}/streaks/recalculate`),

    // Get user categories
    getCategories: () => api.get('/habits/categories'),

    // Archive/unarchive habit
    toggleArchive: (id, isArchived) => api.post(`/habits/${id}/archive`, { is_archived: isArchived }),
}

// Utility functions
export const setAuthToken = (token) => {
    localStorage.setItem('auth_token', token)
}

export const removeAuthToken = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
}

export const getAuthToken = () => {
    return localStorage.getItem('auth_token')
}

export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user))
}

export const getUser = () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

export default api