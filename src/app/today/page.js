'use client'

import { useState, useEffect } from 'react'
import {
    CheckCircleIcon,
    FireIcon,
    CalendarDaysIcon,
    TrophyIcon,
    PlusIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useHabits } from '@/hooks/useHabits'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']



function TodayPageContent() {
    const { habits, loading, toggleCompletion } = useHabits()
    const { user } = useAuth()
    const [mounted, setMounted] = useState(false)
    const [localHabits, setLocalHabits] = useState([])
    const [weeklyData, setWeeklyData] = useState([])

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (habits.length > 0) {
            // Transform habits to include completion status for today
            const today = new Date().toISOString().split('T')[0]
            const habitsWithCompletion = habits.map(habit => ({
                ...habit,
                completed: habit.recent_completions?.some(
                    completion => completion.completion_date === today && completion.completed
                ) || false
            }))
            setLocalHabits(habitsWithCompletion)

            // Generate weekly data from recent completions
            generateWeeklyData(habits)
        }
    }, [habits])

    const generateWeeklyData = (habitsData) => {
        const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const today = new Date()
        const weekData = []

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(today.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            const dayName = weekDays[date.getDay() === 0 ? 6 : date.getDay() - 1] // Adjust for Monday start

            let completed = 0
            const total = habitsData.length

            habitsData.forEach(habit => {
                const dayCompletion = habit.recent_completions?.find(
                    completion => completion.completion_date === dateStr && completion.completed
                )
                if (dayCompletion) {
                    completed++
                }
            })

            weekData.push({
                day: dayName,
                date: dateStr,
                completed,
                total,
                isToday: i === 0
            })
        }

        setWeeklyData(weekData)
    }

    const handleToggleHabit = async (id) => {
        const today = new Date().toISOString()
        const habit = localHabits.find(h => h.id === id)
        const newCompletedState = !habit.completed

        // Optimistic update
        setLocalHabits(prev => prev.map(h =>
            h.id === id ? { ...h, completed: newCompletedState } : h
        ))

        try {
            await toggleCompletion(id, today, newCompletedState)
        } catch (error) {
            // Revert on error
            setLocalHabits(prev => prev.map(h =>
                h.id === id ? { ...h, completed: !newCompletedState } : h
            ))
        }
    }

    const completedCount = localHabits.filter(h => h.completed).length
    const totalCount = localHabits.length
    const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-4 md:pt-20 px-4 max-w-4xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="card p-4">
                                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-4 md:pt-20 px-4 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Today
                    </h1>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                {user && (
                    <p className="text-gray-600 dark:text-gray-400">
                        Welcome back, {user.name}! 👋
                    </p>
                )}

                {/* Progress Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-6">
                    <div className="card p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                                <CheckCircleIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {completedCount}/{totalCount}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                <FireIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {localHabits.length > 0 ? Math.max(...localHabits.map(h => h.current_streak || 0)) : 0}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Best Streak</p>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <TrophyIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {completionRate}%
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                            </div>
                        </div>
                    </div>

                    <div className="card p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <CalendarDaysIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {weeklyData.filter(d => d.total > 0 && d.completed === d.total).length}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Perfect Days</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Habits Checklist */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Today's Habits
                    </h2>
                    <Link
                        href="/habits"
                        className="flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Add Habit</span>
                    </Link>
                </div>

                {localHabits.length === 0 ? (
                    <div className="card p-8 text-center">
                        <div className="text-gray-400 dark:text-gray-600 mb-4">
                            <PlusIcon className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            No habits yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Start building better habits today!
                        </p>
                        <Link href="/habits" className="btn-primary">
                            Create Your First Habit
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {localHabits.map((habit) => {
                            // Generate completion history for last 14 days
                            const completionHistory = []
                            const today = new Date()

                            for (let i = 13; i >= 0; i--) {
                                const date = new Date(today)
                                date.setDate(today.getDate() - i)
                                const dateStr = date.toISOString().split('T')[0]

                                const completion = habit.recent_completions?.find(
                                    c => c.completion_date === dateStr
                                )

                                completionHistory.push({
                                    date: dateStr,
                                    completed: completion?.completed || false,
                                    isToday: i === 0
                                })
                            }

                            return (
                                <div
                                    key={habit.id}
                                    className={`card p-6 transition-all duration-200 hover:shadow-md ${habit.completed ? 'ring-2 ring-green-200 dark:ring-green-800' : ''
                                        }`}
                                >
                                    {/* Main habit info with toggle */}
                                    <div
                                        className="flex items-center space-x-4 cursor-pointer mb-4"
                                        onClick={() => handleToggleHabit(habit.id)}
                                    >
                                        <div className="flex-shrink-0">
                                            {habit.completed ? (
                                                <CheckCircleIconSolid className="h-6 w-6 text-green-600 dark:text-green-400 animate-bounce-subtle" />
                                            ) : (
                                                <div className="h-6 w-6 border-2 border-gray-300 dark:border-gray-600 rounded-full hover:border-primary-500 transition-colors duration-200" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-lg font-medium transition-colors duration-200 ${habit.completed
                                                ? 'text-gray-500 dark:text-gray-400 line-through'
                                                : 'text-gray-900 dark:text-gray-100'
                                                }`}>
                                                {habit.title}
                                            </p>
                                            {habit.description && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {habit.description}
                                                </p>
                                            )}
                                            {habit.category && (
                                                <span className="inline-block mt-2 px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                                                    {habit.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Streak Information */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-6">
                                            <div className="flex items-center space-x-2">
                                                <FireIcon className="h-5 w-5 text-orange-500" />
                                                <div>
                                                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                        {habit.current_streak || 0}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                                        current streak
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <TrophyIcon className="h-5 w-5 text-yellow-500" />
                                                <div>
                                                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                        {habit.longest_streak || 0}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                                        best streak
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Created {new Date(habit.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* 14-Day Completion History */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Last 14 Days
                                        </h4>
                                        <div className="flex space-x-1">
                                            {completionHistory.map((day, index) => {
                                                const date = new Date(day.date)
                                                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
                                                const dayNumber = date.getDate()

                                                return (
                                                    <div
                                                        key={day.date}
                                                        className="flex flex-col items-center space-y-1"
                                                        title={`${date.toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })} - ${day.completed ? 'Completed ✅' : 'Not completed ❌'}`}
                                                    >
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            {dayNumber}
                                                        </div>
                                                        <div
                                                            className={`w-3 h-3 rounded-full transition-all duration-200 ${day.completed
                                                                ? 'bg-green-500 shadow-sm'
                                                                : 'bg-gray-200 dark:bg-gray-700'
                                                                } ${day.isToday
                                                                    ? 'ring-2 ring-primary-500 dark:ring-primary-400'
                                                                    : ''
                                                                }`}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Completion rate and legend */}
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {Math.round((completionHistory.filter(d => d.completed).length / completionHistory.length) * 100)}% completion rate
                                            </div>
                                            <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center space-x-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span>Done</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                                    <span>Missed</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <div className="w-2 h-2 border-2 border-primary-500 rounded-full"></div>
                                                    <span>Today</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Weekly Preview Grid */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    This Week
                </h2>

                <div className="card p-6">
                    <div className="grid grid-cols-7 gap-4">
                        {weeklyData.map((day, index) => {
                            const completionRate = day.total > 0 ? (day.completed / day.total) * 100 : 0

                            return (
                                <div key={day.date} className="text-center">
                                    <div className={`text-sm font-medium mb-2 ${day.isToday
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {day.day}
                                    </div>

                                    <div className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-200 ${day.total === 0
                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                        : completionRate === 100
                                            ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                            : completionRate >= 80
                                                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                                                : completionRate > 0
                                                    ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                                        } ${day.isToday ? 'ring-2 ring-primary-500 dark:ring-primary-400' : ''}`}>
                                        {day.total === 0 ? '➖' :
                                            completionRate === 100 ? '✅' :
                                                completionRate >= 80 ? '🔥' :
                                                    completionRate > 0 ? '⚡' : '❌'}
                                    </div>

                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {day.completed}/{day.total}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Motivational Quote */}
            <div className="card p-6 text-center mb-8">
                <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-2">
                    "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
                </blockquote>
                <cite className="text-sm text-gray-500 dark:text-gray-400">— Aristotle</cite>
            </div>
        </div>
    )
}

export default function TodayPage() {
    return (
        <ProtectedRoute>
            <TodayPageContent />
        </ProtectedRoute>
    )
}