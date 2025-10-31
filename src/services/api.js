const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

class ApiService {
    constructor() {
        this.baseURL = `${API_URL}/api`
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`
        const token = localStorage.getItem('auth_token')

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        }

        try {
            const response = await fetch(url, config)
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong')
            }

            return data
        } catch (error) {
            console.error('API Error:', error)
            throw error
        }
    }

    // Auth endpoints
    async login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })
    }

    async register(name, email, password) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        })
    }

    async getProfile() {
        return this.request('/auth/me')
    }

    // Habits endpoints
    async getHabits(params = {}) {
        const queryString = new URLSearchParams(params).toString()
        return this.request(`/habits${queryString ? `?${queryString}` : ''}`)
    }

    async createHabit(habitData) {
        return this.request('/habits', {
            method: 'POST',
            body: JSON.stringify(habitData),
        })
    }

    async updateHabit(id, habitData) {
        return this.request(`/habits/${id}`, {
            method: 'PUT',
            body: JSON.stringify(habitData),
        })
    }

    async deleteHabit(id) {
        return this.request(`/habits/${id}`, {
            method: 'DELETE',
        })
    }

    async toggleHabitCompletion(id, date, completed) {
        return this.request(`/habits/${id}/toggle`, {
            method: 'POST',
            body: JSON.stringify({ date, completed }),
        })
    }

    async getHabitCompletions(id, startDate, endDate) {
        const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
        return this.request(`/habits/${id}/completions?${params}`)
    }

    async recalculateStreaks(id) {
        return this.request(`/habits/${id}/streaks/recalculate`, {
            method: 'POST',
        })
    }

    async getCategories() {
        return this.request('/habits/categories')
    }
}

export default new ApiService()