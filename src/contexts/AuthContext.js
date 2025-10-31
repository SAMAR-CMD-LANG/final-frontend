'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext()

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [token, setToken] = useState(null)
    const router = useRouter()
    const hasInitialized = useRef(false)

    const fetchUser = useCallback(async (authToken) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
                setToken(authToken)
            } else {
                // Token is invalid, remove it
                localStorage.removeItem('auth_token')
                setToken(null)
                setUser(null)
            }
        } catch (error) {
            console.error('Error fetching user:', error)
            localStorage.removeItem('auth_token')
            setToken(null)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        // Prevent multiple initializations
        if (hasInitialized.current) return
        hasInitialized.current = true

        // Check for stored token on mount (only once)
        const storedToken = localStorage.getItem('auth_token')
        if (storedToken) {
            setToken(storedToken)
            fetchUser(storedToken)
        } else {
            setLoading(false)
        }
    }, [fetchUser])

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('auth_token', data.token)
                setToken(data.token)
                setUser(data.user)
                router.push('/today')
                return { success: true }
            } else {
                return { success: false, error: data.error }
            }
        } catch (error) {
            console.error('Login error:', error)
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    const register = async (name, email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('auth_token', data.token)
                setToken(data.token)
                setUser(data.user)
                router.push('/today')
                return { success: true }
            } else {
                return { success: false, error: data.error || data }
            }
        } catch (error) {
            console.error('Registration error:', error)
            return { success: false, error: 'Network error. Please try again.' }
        }
    }

    const logout = async () => {
        try {
            // Call backend logout endpoint if token exists
            if (token) {
                await fetch(`${API_URL}/api/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
            }
        } catch (error) {
            console.error('Logout error:', error)
            // Continue with client-side logout even if server call fails
        } finally {
            // Always clear client-side data
            localStorage.removeItem('auth_token')
            setToken(null)
            setUser(null)
            router.push('/')
        }
    }

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        fetchUser,
        isAuthenticated: !!user,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}