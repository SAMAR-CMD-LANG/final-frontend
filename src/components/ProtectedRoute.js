'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()
    const [hasRedirected, setHasRedirected] = useState(false)

    useEffect(() => {
        if (!loading && !isAuthenticated && !hasRedirected) {
            setHasRedirected(true)
            router.push('/')
        }
    }, [isAuthenticated, loading, router, hasRedirected])

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    // Show loading while redirecting unauthenticated users
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        )
    }

    // Render children if authenticated
    return children
}