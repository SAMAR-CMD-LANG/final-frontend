'use client'

import { useState, useEffect, useRef } from 'react'
import {
    ShareIcon,
    LinkIcon,
    PhotoIcon,
    ChartBarIcon,
    ClipboardDocumentIcon,
    ArrowDownTrayIcon,
    FireIcon,
    TrophyIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useHabits } from '@/hooks/useHabits'
import { useAuth } from '@/contexts/AuthContext'

function SharePageContent() {
    const [mounted, setMounted] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isGeneratingCard, setIsGeneratingCard] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [exportFormat, setExportFormat] = useState('csv')
    const cardRef = useRef(null)

    const { habits, loading } = useHabits()
    const { user } = useAuth()

    useEffect(() => {
        setMounted(true)
    }, [])

    // Calculate progress stats
    const progressStats = {
        totalHabits: habits.length,
        activeHabits: habits.filter(h => !h.is_archived).length,
        totalStreaks: habits.reduce((sum, h) => sum + (h.current_streak || 0), 0),
        longestStreak: Math.max(...habits.map(h => h.longest_streak || 0), 0),
        completionRate: habits.length > 0 ?
            Math.round((habits.reduce((sum, h) => {
                const recentCompletions = h.recent_completions || []
                const completedDays = recentCompletions.filter(c => c.completed).length
                return sum + completedDays
            }, 0) / (habits.length * 14)) * 100) : 0
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.origin)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy link:', err)
        }
    }

    const generateProgressCard = async () => {
        if (!cardRef.current) return

        setIsGeneratingCard(true)
        try {
            // Import html2canvas dynamically
            const html2canvas = (await import('html2canvas')).default

            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true
            })

            // Create download link
            const link = document.createElement('a')
            link.download = `inhabit-progress-${new Date().toISOString().split('T')[0]}.png`
            link.href = canvas.toDataURL()
            link.click()
        } catch (error) {
            console.error('Failed to generate progress card:', error)
            alert('Failed to generate progress card. Please try again.')
        } finally {
            setIsGeneratingCard(false)
        }
    }

    const exportData = async () => {
        setIsExporting(true)
        try {
            const token = localStorage.getItem('auth_token')

            if (token) {
                // Use backend API for authenticated users
                await exportFromBackend()
            } else {
                // Use local export for demo mode
                if (exportFormat === 'csv') {
                    exportToCSV()
                } else {
                    exportToJSON()
                }
            }
        } catch (error) {
            console.error('Failed to export data:', error)
            alert('Failed to export data. Please try again.')
        } finally {
            setIsExporting(false)
        }
    }

    const exportFromBackend = async () => {
        try {
            const { default: apiService } = await import('@/services/api')
            const response = await apiService.exportHabits(exportFormat, 14)

            if (exportFormat === 'csv') {
                // Backend returns CSV as text
                const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `inhabit-habits-${new Date().toISOString().split('T')[0]}.csv`
                link.click()
            } else {
                // Backend returns JSON object
                const jsonString = JSON.stringify(response, null, 2)
                const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' })
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `inhabit-data-${new Date().toISOString().split('T')[0]}.json`
                link.click()
            }
        } catch (error) {
            console.error('Backend export failed, falling back to local export:', error)
            // Fallback to local export
            if (exportFormat === 'csv') {
                exportToCSV()
            } else {
                exportToJSON()
            }
        }
    }

    const exportToCSV = () => {
        const csvData = []

        // Add header
        csvData.push([
            'Habit Title',
            'Description',
            'Category',
            'Current Streak',
            'Longest Streak',
            'Created Date',
            'Is Archived',
            'Recent Completion Rate (%)'
        ])

        // Add habit data
        habits.forEach(habit => {
            const recentCompletions = habit.recent_completions || []
            const completionRate = recentCompletions.length > 0 ?
                Math.round((recentCompletions.filter(c => c.completed).length / recentCompletions.length) * 100) : 0

            csvData.push([
                habit.title,
                habit.description || '',
                habit.category || '',
                habit.current_streak || 0,
                habit.longest_streak || 0,
                new Date(habit.created_at).toLocaleDateString(),
                habit.is_archived ? 'Yes' : 'No',
                completionRate
            ])
        })

        // Convert to CSV string
        const csvString = csvData.map(row =>
            row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
        ).join('\n')

        // Download
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `inhabit-habits-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
    }

    const exportToJSON = () => {
        const exportData = {
            exportDate: new Date().toISOString(),
            user: user?.name || 'Demo User',
            summary: progressStats,
            habits: habits.map(habit => ({
                ...habit,
                recent_completions: habit.recent_completions || []
            }))
        }

        const jsonString = JSON.stringify(exportData, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `inhabit-data-${new Date().toISOString().split('T')[0]}.json`
        link.click()
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

                {/* Progress Card Generator */}
                <div className="card p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                            <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Share Your Progress Card
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Generate a beautiful progress card to share your achievements on social media.
                            </p>

                            {/* Progress Card Preview */}
                            <div
                                ref={cardRef}
                                className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white mb-4 max-w-md"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-bold">InHabit Progress</h3>
                                    <div className="text-2xl">🎯</div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <TrophyIcon className="h-5 w-5" />
                                            <span>Active Habits</span>
                                        </div>
                                        <span className="font-bold">{progressStats.activeHabits}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <FireIcon className="h-5 w-5" />
                                            <span>Longest Streak</span>
                                        </div>
                                        <span className="font-bold">{progressStats.longestStreak} days</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <ChartBarIcon className="h-5 w-5" />
                                            <span>Completion Rate</span>
                                        </div>
                                        <span className="font-bold">{progressStats.completionRate}%</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <CalendarDaysIcon className="h-5 w-5" />
                                            <span>Total Streaks</span>
                                        </div>
                                        <span className="font-bold">{progressStats.totalStreaks} days</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/20 text-center text-sm opacity-90">
                                    Building better habits with InHabit • {new Date().toLocaleDateString()}
                                </div>
                            </div>

                            <button
                                onClick={generateProgressCard}
                                disabled={isGeneratingCard || loading}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <PhotoIcon className="h-4 w-4" />
                                <span>{isGeneratingCard ? 'Generating...' : 'Download Progress Card'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Export Data */}
                <div className="card p-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                            <ArrowDownTrayIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Export Your Data
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Export your habit data as CSV for spreadsheet analysis or JSON for backup and other tools.
                            </p>

                            {/* Export Format Selection */}
                            <div className="flex items-center space-x-4 mb-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="exportFormat"
                                        value="csv"
                                        checked={exportFormat === 'csv'}
                                        onChange={(e) => setExportFormat(e.target.value)}
                                        className="text-primary-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">CSV (Spreadsheet)</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="exportFormat"
                                        value="json"
                                        checked={exportFormat === 'json'}
                                        onChange={(e) => setExportFormat(e.target.value)}
                                        className="text-primary-600"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">JSON (Complete Data)</span>
                                </label>
                            </div>

                            {/* Export Preview */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 text-sm">
                                <p className="text-gray-600 dark:text-gray-400">
                                    {exportFormat === 'csv'
                                        ? `Will export ${habits.length} habits with completion rates, streaks, and categories.`
                                        : `Will export complete data including ${habits.length} habits with full completion history.`
                                    }
                                </p>
                            </div>

                            <button
                                onClick={exportData}
                                disabled={isExporting || loading || habits.length === 0}
                                className="btn-primary flex items-center space-x-2"
                            >
                                <ArrowDownTrayIcon className="h-4 w-4" />
                                <span>
                                    {isExporting ? 'Exporting...' :
                                        habits.length === 0 ? 'No Data to Export' :
                                            `Export as ${exportFormat.toUpperCase()}`}
                                </span>
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