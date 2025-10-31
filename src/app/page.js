'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  SparklesIcon,
  CheckCircleIcon,
  FireIcon,
  TrophyIcon,
  UserGroupIcon,
  ChartBarIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // If user is authenticated, redirect to today page (only once)
    if (mounted && !loading && isAuthenticated && !hasRedirected) {
      setHasRedirected(true)
      router.push('/today')
    }
  }, [mounted, loading, isAuthenticated, router, hasRedirected])

  if (!mounted || loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />
  }

  // If user is authenticated, show loading while redirecting
  if (isAuthenticated) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <SparklesIcon className="h-16 w-16 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              InHabit
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Transform your life one habit at a time. Track progress, build streaks,
              and achieve your goals with our simple, beautiful habit tracker.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Simple
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">One-tap tracking</p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    <FireIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Streaks
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Stay motivated</p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <TrophyIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Progress
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Visual insights</p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      Analytics
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Track trends</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
              <Link href="/auth/login" className="btn-primary text-lg px-8 py-3 block md:inline-block">
                Login
              </Link>
              <Link href="/auth/register" className="btn-secondary text-lg px-8 py-3 block md:inline-block">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
            Everything you need to build lasting habits
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircleIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Daily Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Simple one-tap completion for all your daily habits. No complexity, just results.
              </p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FireIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Streak Building
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Watch your streaks grow and stay motivated with visual progress indicators.
              </p>
            </div>

            <div className="text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ChartBarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Progress Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Understand your patterns with weekly views and completion analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Ready to build better habits?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of people who are transforming their lives, one habit at a time.
          </p>
          <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Quote Section */}
      <div className="py-16 px-4 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl italic text-gray-700 dark:text-gray-300 mb-4">
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
          </blockquote>
          <cite className="text-lg text-gray-500 dark:text-gray-400">— Aristotle</cite>
        </div>
      </div>
    </div>
  )
}