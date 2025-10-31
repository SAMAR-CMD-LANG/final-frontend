import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import ConnectionStatus from '@/components/ConnectionStatus'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'InHabit - Daily Habit Tracker',
  description: 'Build better habits, one day at a time',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <main className="pb-16 md:pb-0">
                {children}
              </main>
              <Navigation />
              <ConnectionStatus />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}