'use client'

import { useState, useEffect } from 'react'
import { XCircleIcon, PlusIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid'

export default function DateHabitsModal({
    isOpen,
    onClose,
    selectedDate,
    habits,
    getDateCompletions,
    onToggleHabit,
    loading
}) {
    if (!isOpen || !selectedDate) return null

    const dateCompletions = getDateCompletions(selectedDate)

    return (
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
                        onClick={onClose}
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
                            const completion = dateCompletions.find(c => c.habit_id === habit.id)
                            const isCompleted = completion?.completed || false

                            return (
                                <div
                                    key={habit.id}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${isCompleted
                                            ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                    onClick={() => onToggleHabit(habit.id, !isCompleted)}
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
                                            {habit.category && (
                                                <span className="inline-block mt-1 px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                                                    {habit.category}
                                                </span>
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
                        onClick={onClose}
                        className="w-full btn-secondary"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}