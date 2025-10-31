'use client'

import { useState, useEffect } from 'react'
import { UserIcon, CogIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

function ProfilePageContent() {
    const [mounted, setMounted] = useState(false)
    const { user, logout } = useAuth()

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
                    Profile
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage your account and preferences
                </p>
            </div>

            {/* User Info */}
            {user && (
                <div className="card p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full">
                            <UserIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {user.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {user.email}
                            </p>
                            {user.display_name && (
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Display name: {user.display_name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Account Actions
                </h3>
                <div className="space-y-3">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 w-full p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-red-600 dark:text-red-400"
                    >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Coming Soon */}
            <div className="card p-8 text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <CogIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    More Features Coming Soon
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Profile editing, preferences, and advanced settings will be available in future updates.
                </p>

                <div className="space-y-4 text-left max-w-md mx-auto">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Planned Features:</h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                            <span>User registration and login</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                            <span>Profile customization</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                            <span>Data synchronization across devices</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                            <span>Backup and restore</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                            <span>Notification preferences</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfilePageContent />
        </ProtectedRoute>
    )
}