'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { fetchUser } = useAuth()
    const [status, setStatus] = useState('processing')
    const hasProcessed = useRef(false)

    useEffect(() => {
        // Prevent multiple executions
        if (hasProcessed.current) return
        hasProcessed.current = true

        const handleCallback = async () => {
            const token = searchParams.get('token')
            const error = searchParams.get('error')

            if (error) {
                setStatus('error')
                setTimeout(() => {
                    router.push('/auth/login?error=' + encodeURIComponent(error))
                }, 2000)
                return
            }

            if (token) {
                try {
                    // Store the token
                    localStorage.setItem('auth_token', token)

                    // Fetch user data
                    await fetchUser(token)

                    setStatus('success')
                    setTimeout(() => {
                        router.push('/today')
                    }, 1000)
                } catch (err) {
                    console.error('Auth callback error:', err)
                    setStatus('error')
                    setTimeout(() => {
                        router.push('/auth/login?error=Authentication failed')
                    }, 2000)
                }
            } else {
                setStatus('error')
                setTimeout(() => {
                    router.push('/auth/login?error=No authentication token received')
                }, 2000)
            }
        }

        handleCallback()
    }, [searchParams, router, fetchUser])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>

                {status === 'processing' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Completing sign in...
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Please wait while we set up your account.
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <h2 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                            Sign in successful!
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Redirecting to your dashboard...
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                            Sign in failed
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Redirecting to login page...
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}