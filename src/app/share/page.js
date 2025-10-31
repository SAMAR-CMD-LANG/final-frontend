'use client'

import { useState, useEffect } from 'react'
import {
    ShareIcon,
    LinkIcon,
    PhotoIcon,
    ChartBarIcon,
    ClipboardDocumentIcon
} from '@heroicons/react/24/outline'
import ProtectedRoute from '@/components/ProtectedRoute'

function SharePageContent() {
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.origin)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy link:', err)
        }
    }

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />
    }

    return (
        <div className="min-h-screen pt-4 md:pt-20 px-4 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Share Your Progress
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Inspire others with your habit-building journey
                </p>
            </div>

            {/* Share Options */}
            <div className="space-y-6">
                {/* Share App */}
                <div className="card p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                            <ShareIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Share InHabit
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Help others discover the power of habit tracking. Share InHabit with friends and family.
                            </p>
                            <button
                                onClick={handleCopyLink}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <LinkIcon className="h-4 w-4" />
                                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Share Progress (Coming Soon) */}
                <div className="card p-6 opacity-75">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Share Your Stats
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Create beautiful progress cards to share your achievements and inspire others.
                            </p>
                            <button
                                disabled
                                className="btn-secondary opacity-50 cursor-not-allowed flex items-center space-x-2"
                            >
                                <PhotoIcon className="h-4 w-4" />
                                <span>Coming Soon</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Export Data (Coming Soon) */}
                <div className="card p-6 opacity-75">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <ClipboardDocumentIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Export Your Data
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Export your habit data as CSV or JSON for backup or analysis in other tools.
                            </p>
                            <button
                                disabled
                                className="btn-secondary opacity-50 cursor-not-allowed"
                            >
                                Export Data
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Media Templates */}
                <div className="card p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Share Templates
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Use these templates to share your progress on social media:
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Streak Achievement</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                "🔥 Just hit a 30-day streak with my morning meditation habit! Building consistency one day at a time with @InHabit #HabitTracker #Consistency #PersonalGrowth"
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Weekly Progress</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                "📊 This week: 5/5 workout days, 6/7 reading sessions, 7/7 water goals! Small habits, big results. #HabitTracker #Progress #Wellness"
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Motivation</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                "💪 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.' - Aristotle. What habits are you building today? #Motivation #Habits #Growth"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SharePage() {
    return (
        <ProtectedRoute>
            <SharePageContent />
        </ProtectedRoute>
    )
}