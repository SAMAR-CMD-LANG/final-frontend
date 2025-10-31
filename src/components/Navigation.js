'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    HomeIcon,
    ListBulletIcon,
    CalendarIcon,
    DocumentTextIcon,
    ShareIcon,
    UserIcon,
    SunIcon,
    MoonIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import {
    HomeIcon as HomeIconSolid,
    ListBulletIcon as ListBulletIconSolid,
    CalendarIcon as CalendarIconSolid,
    DocumentTextIcon as DocumentTextIconSolid,
    ShareIcon as ShareIconSolid,
    UserIcon as UserIconSolid
} from '@heroicons/react/24/solid'
import { useTheme } from './ThemeProvider'
import { useAuth } from '@/contexts/AuthContext'

const tabs = [
    { name: 'Today', href: '/today', icon: HomeIcon, activeIcon: HomeIconSolid },
    { name: 'Habits', href: '/habits', icon: ListBulletIcon, activeIcon: ListBulletIconSolid },
    { name: 'Calendar', href: '/calendar', icon: CalendarIcon, activeIcon: CalendarIconSolid },
    { name: 'Notes', href: '/notes', icon: DocumentTextIcon, activeIcon: DocumentTextIconSolid },
    { name: 'Share', href: '/share', icon: ShareIcon, activeIcon: ShareIconSolid },
    { name: 'Profile', href: '/profile', icon: UserIcon, activeIcon: UserIconSolid },
]

export default function Navigation() {
    const pathname = usePathname()
    const { theme, toggleTheme } = useTheme()
    const { isAuthenticated, user, logout } = useAuth()

    // Safety check for theme
    if (!theme || !toggleTheme) {
        return null
    }

    // Don't show navigation on auth pages or if not authenticated
    if (pathname.startsWith('/auth') || !isAuthenticated) {
        return null
    }

    return (
        <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                InHabit
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <div className="flex space-x-8">
                            {tabs.map((tab) => {
                                const isActive = pathname === tab.href
                                const Icon = isActive ? tab.activeIcon : tab.icon

                                return (
                                    <Link
                                        key={tab.name}
                                        href={tab.href}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                                            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{tab.name}</span>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* User Actions */}
                        <div className="flex items-center space-x-4">
                            {user && (
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Welcome, {user.name}
                                </span>
                            )}

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                aria-label="Toggle theme"
                            >
                                {theme === 'light' ? (
                                    <MoonIcon className="h-5 w-5" />
                                ) : (
                                    <SunIcon className="h-5 w-5" />
                                )}
                            </button>

                            {/* Logout Button */}
                            <button
                                onClick={logout}
                                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                                aria-label="Logout"
                            >
                                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-6 h-16">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href
                        const Icon = isActive ? tab.activeIcon : tab.icon

                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${isActive
                                    ? 'text-primary-600 dark:text-primary-400'
                                    : 'text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs font-medium">{tab.name}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Theme Toggle for Mobile (Floating Button) */}
            <button
                onClick={toggleTheme}
                className="md:hidden fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? (
                    <MoonIcon className="h-5 w-5" />
                ) : (
                    <SunIcon className="h-5 w-5" />
                )}
            </button>
        </>
    )
}