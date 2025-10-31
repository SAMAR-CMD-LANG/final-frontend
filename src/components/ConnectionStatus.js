'use client'

import { useState, useEffect } from 'react'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export default function ConnectionStatus() {
    const [backendStatus, setBackendStatus] = useState('checking')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        checkBackendConnection()
    }, [])

    const checkBackendConnection = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/health`)
            if (response.ok) {
                setBackendStatus('connected')
            } else {
                setBackendStatus('error')
            }
        } catch (error) {
            console.error('Backend connection error:', error)
            setBackendStatus('disconnected')
        }
    }

    if (!mounted) return null

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${backendStatus === 'connected'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                : backendStatus === 'disconnected'
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                }`}>
                {backendStatus === 'connected' ? (
                    <>
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Backend Connected</span>
                    </>
                ) : backendStatus === 'disconnected' ? (
                    <>
                        <XCircleIcon className="h-4 w-4" />
                        <span>Backend Offline (Demo Mode)</span>
                    </>
                ) : (
                    <span>Checking connection...</span>
                )}
            </div>
        </div>
    )
}