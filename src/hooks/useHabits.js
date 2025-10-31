'use client'

import { useState, useEffect, useCallback } from 'react'
import { habitsAPI } from '@/lib/api'

// Helper function to generate mock completion data for demo
const generateMockCompletions = () => {
    const completions = []
    const today = new Date()

    // Generate 14 days of mock data for 3 habits
    for (let habitId = 1; habitId <= 3; habitId++) {
        for (let i = 0; i < 14; i++) {
            const date = new Date(today)
            date.setDate(today.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]

            // Create realistic completion patterns
            let completed = false
            if (habitId === 1) { // Morning Meditation - good streak
                completed = Math.random() > 0.2 // 80% completion rate
            } else if (habitId === 2) { // Reading - very consistent
                completed = Math.random() > 0.1 // 90% completion rate
            } else { // Exercise - moderate consistency
                completed = Math.random() > 0.4 // 60% completion rate
            }

            completions.push({
                habit_id: habitId,
                completion_date: dateStr,
                completed
            })
        }
    }

    return completions
}

export function useHabits(options = {}) {
    const [habits, setHabits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchHabits = useCallback(async (fetchOptions = options) => {
        // Check if user is authenticated
        const token = localStorage.getItem('auth_token')

        if (!token) {
            // No token, use mock data for demo with sample completion history
            const mockCompletions = generateMockCompletions()
            setHabits([
                {
                    id: 1,
                    title: 'Morning Meditation',
                    description: '10 minutes of mindfulness meditation',
                    category: 'Health',
                    current_streak: 7,
                    longest_streak: 15,
                    created_at: '2025-10-20T10:00:00Z',
                    is_archived: false,
                    recent_completions: mockCompletions.filter(c => c.habit_id === 1)
                },
                {
                    id: 2,
                    title: 'Read for 30 Minutes',
                    description: 'Read books or articles for learning',
                    category: 'Learning',
                    current_streak: 12,
                    longest_streak: 20,
                    created_at: '2025-10-15T10:00:00Z',
                    is_archived: false,
                    recent_completions: mockCompletions.filter(c => c.habit_id === 2)
                },
                {
                    id: 3,
                    title: 'Exercise',
                    description: 'Daily workout routine',
                    category: 'Health',
                    current_streak: 5,
                    longest_streak: 12,
                    created_at: '2025-10-25T10:00:00Z',
                    is_archived: false,
                    recent_completions: mockCompletions.filter(c => c.habit_id === 3)
                },
            ])
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)
            // Fetch with 14 days of history for better visualization
            const params = { days: 14, ...fetchOptions }
            const response = await habitsAPI.getHabits(params)
            setHabits(response.data.habits || [])
        } catch (err) {
            console.error('Error fetching habits:', err)

            // If 401, clear token and use mock data
            if (err.response?.status === 401) {
                localStorage.removeItem('auth_token')
                localStorage.removeItem('user')
            }

            setError(err.response?.data?.error || 'Failed to fetch habits')
            // Fallback to mock data with sample completions
            const mockCompletions = generateMockCompletions()
            setHabits([
                {
                    id: 1,
                    title: 'Morning Meditation',
                    description: '10 minutes of mindfulness meditation',
                    category: 'Health',
                    current_streak: 7,
                    longest_streak: 15,
                    created_at: '2025-10-20T10:00:00Z',
                    is_archived: false,
                    recent_completions: mockCompletions.filter(c => c.habit_id === 1)
                },
                {
                    id: 2,
                    title: 'Read for 30 Minutes',
                    description: 'Read books or articles for learning',
                    category: 'Learning',
                    current_streak: 12,
                    longest_streak: 20,
                    created_at: '2025-10-15T10:00:00Z',
                    is_archived: false,
                    recent_completions: mockCompletions.filter(c => c.habit_id === 2)
                },
            ])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchHabits()
    }, [fetchHabits])

    const createHabit = async (habitData) => {
        try {
            const response = await habitsAPI.createHabit(habitData)
            const newHabit = response.data.habit
            setHabits(prev => [...prev, newHabit])
            return newHabit
        } catch (err) {
            console.error('Error creating habit:', err)
            // Fallback to local creation for demo
            const newHabit = {
                id: Date.now(),
                ...habitData,
                current_streak: 0,
                longest_streak: 0,
                created_at: new Date().toISOString(),
                is_archived: false,
                recent_completions: []
            }
            setHabits(prev => [...prev, newHabit])
            return newHabit
        }
    }

    const updateHabit = async (id, habitData) => {
        try {
            const response = await habitsAPI.updateHabit(id, habitData)
            const updatedHabit = response.data.habit
            setHabits(prev => prev.map(habit =>
                habit.id === id ? updatedHabit : habit
            ))
            return updatedHabit
        } catch (err) {
            console.error('Error updating habit:', err)
            // Fallback to local update for demo
            setHabits(prev => prev.map(habit =>
                habit.id === id ? { ...habit, ...habitData } : habit
            ))
            throw err
        }
    }

    const deleteHabit = async (id) => {
        try {
            await habitsAPI.deleteHabit(id)
            setHabits(prev => prev.filter(habit => habit.id !== id))
        } catch (err) {
            console.error('Error deleting habit:', err)
            // Fallback to local deletion for demo
            setHabits(prev => prev.filter(habit => habit.id !== id))
        }
    }

    const toggleCompletion = async (id, date, completed) => {
        try {
            await habitsAPI.toggleCompletion(id, { date, completed })
            // Refresh habits to get updated streaks
            await fetchHabits()
        } catch (err) {
            console.error('Error toggling completion:', err)
            // Fallback to local update for demo
            setHabits(prev => prev.map(habit => {
                if (habit.id === id) {
                    const updatedHabit = { ...habit }
                    if (completed) {
                        updatedHabit.current_streak = (updatedHabit.current_streak || 0) + 1
                        updatedHabit.longest_streak = Math.max(
                            updatedHabit.longest_streak || 0,
                            updatedHabit.current_streak
                        )
                    }
                    return updatedHabit
                }
                return habit
            }))
        }
    }

    return {
        habits,
        loading,
        error,
        createHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
        refetch: fetchHabits,
    }
}

export function useHabitCategories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await habitsAPI.getCategories()
                setCategories(response.data.categories || [])
            } catch (err) {
                console.error('Error fetching categories:', err)
                // Fallback categories
                setCategories(['Health', 'Learning', 'Personal', 'Work'])
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return { categories, loading }
}