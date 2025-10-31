'use client'

import { useState, useEffect, useCallback } from 'react'
import { habitsAPI } from '@/lib/api'

export function useCalendar() {
    const [completions, setCompletions] = useState({})
    const [habits, setHabits] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchCalendarData = useCallback(async (startDate, endDate) => {
        const token = localStorage.getItem('auth_token')

        if (!token) {
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            setError(null)

            // Fetch habits
            const habitsResponse = await habitsAPI.getHabits()
            const userHabits = habitsResponse.data.habits || []
            setHabits(userHabits)

            // Fetch completions for each habit in the date range
            const completionsData = {}

            for (const habit of userHabits) {
                try {
                    const completionsResponse = await habitsAPI.getCompletions(habit.id, {
                        start_date: startDate,
                        end_date: endDate
                    })

                    const habitCompletions = completionsResponse.data.completions || []

                    habitCompletions.forEach(completion => {
                        const date = completion.completion_date
                        if (!completionsData[date]) {
                            completionsData[date] = []
                        }
                        completionsData[date].push({
                            habit_id: habit.id,
                            habit_title: habit.title,
                            completed: completion.completed
                        })
                    })
                } catch (err) {
                    console.error(`Error fetching completions for habit ${habit.id}:`, err)
                }
            }

            setCompletions(completionsData)
        } catch (err) {
            console.error('Error fetching calendar data:', err)
            setError(err.response?.data?.error || 'Failed to fetch calendar data')
        } finally {
            setLoading(false)
        }
    }, [])

    const getDateCompletions = useCallback((date) => {
        const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date
        return completions[dateStr] || []
    }, [completions])

    const getDateStats = useCallback((date) => {
        const dateCompletions = getDateCompletions(date)
        const totalHabits = habits.length
        const completedHabits = dateCompletions.filter(c => c.completed).length

        return {
            total: totalHabits,
            completed: completedHabits,
            completionRate: totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0
        }
    }, [getDateCompletions, habits])

    const toggleDateCompletion = useCallback(async (habitId, date, completed) => {
        try {
            await habitsAPI.toggleCompletion(habitId, { date, completed })

            // Update local state
            const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date
            setCompletions(prev => {
                const updated = { ...prev }
                if (!updated[dateStr]) {
                    updated[dateStr] = []
                }

                const existingIndex = updated[dateStr].findIndex(c => c.habit_id === habitId)
                if (existingIndex >= 0) {
                    updated[dateStr][existingIndex].completed = completed
                } else {
                    const habit = habits.find(h => h.id === habitId)
                    updated[dateStr].push({
                        habit_id: habitId,
                        habit_title: habit?.title || 'Unknown',
                        completed
                    })
                }

                return updated
            })
        } catch (err) {
            console.error('Error toggling completion:', err)
            throw err
        }
    }, [habits])

    return {
        completions,
        habits,
        loading,
        error,
        fetchCalendarData,
        getDateCompletions,
        getDateStats,
        toggleDateCompletion
    }
}