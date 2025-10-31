'use client'

import { useState, useEffect } from 'react'
import {
    InformationCircleIcon,
    HeartIcon,
    SparklesIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline'
import ProtectedRoute from '@/components/ProtectedRoute'

function NotesPageContent() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />
    }

    return (
        <div className="min-h-screen pt-4 md:pt-20 px-4 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    About InHabit
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Your companion for building better habits, one day at a time
                </p>
            </div>

            {/* App Information */}
            <div className="space-y-6">
                {/* What is InHabit */}
                <div className="card p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                            <InformationCircleIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                What is InHabit?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                InHabit is a simple, elegant habit tracking app designed to help you build positive daily routines.
                                Track your progress, maintain streaks, and visualize your journey towards better habits with our
                                clean, intuitive interface.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Key Features */}
                <div className="card p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <SparklesIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Key Features
                            </h2>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                                    <span>Simple daily habit tracking with one-tap completion</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                                    <span>Streak tracking to maintain motivation</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                                    <span>Weekly progress visualization</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                                    <span>Category organization for better habit management</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                                    <span>Dark and light theme support</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                                    <span>Mobile-first responsive design</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* How to Use */}
                <div className="card p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <RocketLaunchIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                How to Get Started
                            </h2>
                            <div className="space-y-3 text-gray-600 dark:text-gray-400">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100">1. Add Your First Habit</h3>
                                    <p className="text-sm">Go to the Habits tab and click "Add Habit" to create your first daily routine.</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100">2. Track Daily Progress</h3>
                                    <p className="text-sm">Use the Today tab to check off completed habits and see your daily progress.</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100">3. Build Streaks</h3>
                                    <p className="text-sm">Maintain consistency to build impressive streaks and see your progress over time.</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-gray-100">4. Review & Adjust</h3>
                                    <p className="text-sm">Use the Calendar view to see your historical progress and adjust habits as needed.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tips for Success */}
                <div className="card p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                            <HeartIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Tips for Building Lasting Habits
                            </h2>
                            <div className="space-y-2 text-gray-600 dark:text-gray-400">
                                <p><strong>Start Small:</strong> Begin with habits that take less than 2 minutes to complete.</p>
                                <p><strong>Be Consistent:</strong> It's better to do a small habit daily than a big one occasionally.</p>
                                <p><strong>Stack Habits:</strong> Link new habits to existing routines for better success rates.</p>
                                <p><strong>Focus on Systems:</strong> Don't just set goals, build systems that support your habits.</p>
                                <p><strong>Be Patient:</strong> Research shows it takes an average of 66 days to form a new habit.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Version Info */}
                <div className="card p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        InHabit v1.0
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Built with ❤️ for habit enthusiasts everywhere
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function NotesPage() {
    return (
        <ProtectedRoute>
            <NotesPageContent />
        </ProtectedRoute>
    )
}