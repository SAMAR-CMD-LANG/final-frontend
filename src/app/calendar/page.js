'use client'

import { useState, useEffect } from 'react'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PlusIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useCalendar } from '@/hooks/useCalendar'

function CalendarPageContent() {
    const [mounted, setMounted] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(null)
    const [showDateModal, setShowDateModal] = useState(false)

    const {
        completions,
        habits,
        loading,
        fetchCalendarData,
        getDateCompletions,
        getDateStats,
        toggleDateCompletion
    } = useCalendar()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            // Fetch data for the current month
            const year = currentDate.getFullYear()
            const month = currentDate.getMonth()
            const startDate = new Date(year, month, 1).toISOString().split('T')[0]
            const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

            fetchCalendarData(startDate, endDate)
        }
    }, [mounted, currentDate, fetchCalendarData])

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />
    }

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const getDaysInMonth = (date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days = []

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }

        // Add all days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day)
        }

        return days
    }

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev)
            newDate.setMonth(prev.getMonth() + direction)
            return newDate
        })
    }

    const isToday = (day) => {
        if (!day) return false
        const today = new Date()
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        )
    }

    const getDateObject = (day) => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    }

    const handleDateClick = (day) => {
        if (!day) return
        const dateObj = getDateObject(day)
        setSelectedDate(dateObj)
        setShowDateModal(true)
    }

    const handleToggleHabit = async (habitId, completed) => {
        if (!selectedDate) return

        try {
            await toggleDateCompletion(habitId, selectedDate, completed)
        } catch (error) {
            console.error('Error toggling habit:', error)
        }
    }

    const days = getDaysInMonth(currentDate)

    return (
        <div className="min-h-screen pt-4 md:pt-20 px-4 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Calendar
                </h1>
            </div>

            {/* Calendar */}
            <div className="card p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>

                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                        if (!day) {
                            return <div key={index} className="aspect-square" />
                        }

                        const dateObj = getDateObject(day)
                        const stats = getDateStats(dateObj)
                        const isCurrentDay = isToday(day)

                        return (
                            <div
                                key={index}
                                onClick={() => handleDateClick(day)}
                                className={`aspect-square p-2 text-center cursor-pointer transition-all duration-200 rounded-lg ${isCurrentDay
                                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold ring-2 ring-primary-500'
                                    : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex flex-col items-center justify-center h-full">
                                    <span className="text-sm mb-1">{day}</span>

                                    {/* Habit completion indicators */}
                                    <div className="flex justify-center">
                                        {stats.total > 0 && (
                                            <div
                                                className={`w-2 h-2 rounded-full ${stats.completionRate === 100
                                                    ? 'bg-green-500'
                                                    : stats.completionRate >= 50
                                                        ? 'bg-yellow-500'
                                                        : stats.completionRate > 0
                                                            ? 'bg-orange-500'
                                                            : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                                title={`${stats.completed}/${stats.total} habits completed`}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Legend</h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <span className="text-gray-600 dark:text-gray-400">All habits completed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            <span className="text-gray-600 dark:text-gray-400">Most habits completed (≥50%)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full" />
                            <span className="text-gray-600 dark:text-gray-400">Some habits completed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-400 rounded-full" />
                            <span className="text-gray-600 dark:text-gray-400">No habits completed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date Modal */}
            {showDateModal && selectedDate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </h3>
                            <button
                                onClick={() => setShowDateModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <XCircleIcon className="h-6 w-6" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="animate-pulse">
                                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : habits.length === 0 ? (
                            <div className="text-center py-8">
                                <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    No habits created yet. Create your first habit to start tracking!
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {habits.map((habit) => {
                                    const dateCompletions = getDateCompletions(selectedDate)
                                    const completion = dateCompletions.find(c => c.habit_id === habit.id)
                                    const isCompleted = completion?.completed || false

                                    return (
                                        <div
                                            key={habit.id}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isCompleted
                                                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                            onClick={() => handleToggleHabit(habit.id, !isCompleted)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    {isCompleted ? (
                                                        <CheckCircleIconSolid className="h-6 w-6 text-green-600 dark:text-green-400" />
                                                    ) : (
                                                        <div className="h-6 w-6 border-2 border-gray-300 dark:border-gray-600 rounded-full" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className={`font-medium ${isCompleted
                                                            ? 'text-green-800 dark:text-green-200 line-through'
                                                            : 'text-gray-900 dark:text-gray-100'
                                                        }`}>
                                                        {habit.title}
                                                    </h4>
                                                    {habit.description && (
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            {habit.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowDateModal(false)}
                                className="w-full btn-secondary"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function CalendarPage() {
    return (
        <ProtectedRoute>
            <CalendarPageContent />
        </ProtectedRoute>
    )
}