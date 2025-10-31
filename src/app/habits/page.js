'use client'

import { useState, useEffect } from 'react'
import {
    PlusIcon,
    FireIcon,
    PencilIcon,
    TrashIcon,
    FunnelIcon,
    Bars3BottomLeftIcon
} from '@heroicons/react/24/outline'
import AddHabitModal from '@/components/AddHabitModal'
import EditHabitModal from '@/components/EditHabitModal'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useHabits, useHabitCategories } from '@/hooks/useHabits'

function HabitsPageContent() {
    const { habits, loading, createHabit, updateHabit, deleteHabit } = useHabits()
    const { categories: userCategories } = useHabitCategories()
    const [filteredHabits, setFilteredHabits] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState('desc')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedHabit, setSelectedHabit] = useState(null)
    const [mounted, setMounted] = useState(false)

    // Create categories list with 'All' and user categories
    const categories = ['All', ...userCategories]

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        let filtered = [...habits]

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(habit => habit.category === selectedCategory)
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue = a[sortBy]
            let bValue = b[sortBy]

            if (sortBy === 'title') {
                aValue = aValue.toLowerCase()
                bValue = bValue.toLowerCase()
            }

            if (sortBy === 'created_at') {
                aValue = new Date(aValue)
                bValue = new Date(bValue)
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })

        setFilteredHabits(filtered)
    }, [habits, selectedCategory, sortBy, sortOrder])

    const handleAddHabit = async (newHabit) => {
        try {
            await createHabit(newHabit)
            setShowAddModal(false)
        } catch (error) {
            console.error('Error creating habit:', error)
        }
    }

    const handleEditHabit = async (updatedHabit) => {
        try {
            await updateHabit(selectedHabit.id, updatedHabit)
            setShowEditModal(false)
            setSelectedHabit(null)
        } catch (error) {
            console.error('Error updating habit:', error)
        }
    }

    const handleDeleteHabit = async () => {
        try {
            await deleteHabit(selectedHabit.id)
            setShowDeleteModal(false)
            setSelectedHabit(null)
        } catch (error) {
            console.error('Error deleting habit:', error)
        }
    }

    const openEditModal = (habit) => {
        setSelectedHabit(habit)
        setShowEditModal(true)
    }

    const openDeleteModal = (habit) => {
        setSelectedHabit(habit)
        setShowDeleteModal(true)
    }

    if (!mounted) {
        return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-4 md:pt-20 px-4 max-w-4xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="card p-6">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-4 md:pt-20 px-4 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Habits
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {filteredHabits.length} habit{filteredHabits.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center space-x-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span>Add Habit</span>
                </button>
            </div>

            {/* Filters and Sorting */}
            <div className="card p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    {/* Category Filter */}
                    <div className="flex items-center space-x-2">
                        <FunnelIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <div className="flex space-x-2 overflow-x-auto">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${selectedCategory === category
                                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="flex items-center space-x-2">
                        <Bars3BottomLeftIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-')
                                setSortBy(field)
                                setSortOrder(order)
                            }}
                            className="input text-sm py-1"
                        >
                            <option value="created_at-desc">Recently Created</option>
                            <option value="created_at-asc">Oldest First</option>
                            <option value="title-asc">Name (A-Z)</option>
                            <option value="title-desc">Name (Z-A)</option>
                            <option value="current_streak-desc">Highest Streak</option>
                            <option value="current_streak-asc">Lowest Streak</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Habits List */}
            <div className="space-y-4">
                {filteredHabits.length === 0 ? (
                    <div className="card p-8 text-center">
                        <div className="text-gray-400 dark:text-gray-600 mb-4">
                            <PlusIcon className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            No habits found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {selectedCategory === 'All'
                                ? "Get started by creating your first habit!"
                                : `No habits found in the "${selectedCategory}" category.`
                            }
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="btn-primary"
                        >
                            Add Your First Habit
                        </button>
                    </div>
                ) : (
                    filteredHabits.map((habit) => (
                        <div key={habit.id} className="card p-6 hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            {habit.title}
                                        </h3>
                                        {habit.category && (
                                            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
                                                {habit.category}
                                            </span>
                                        )}
                                    </div>

                                    {habit.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {habit.description}
                                        </p>
                                    )}

                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center space-x-2">
                                            <FireIcon className="h-5 w-5 text-orange-500" />
                                            <div>
                                                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                    {habit.current_streak}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                                    current
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <div className="w-5 h-5 flex items-center justify-center">
                                                🏆
                                            </div>
                                            <div>
                                                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                    {habit.longest_streak}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                                    best
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Created {new Date(habit.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => openEditModal(habit)}
                                        className="p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                                        title="Edit habit"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(habit)}
                                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                                        title="Delete habit"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modals */}
            <AddHabitModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddHabit}
            />

            <EditHabitModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false)
                    setSelectedHabit(null)
                }}
                onEdit={handleEditHabit}
                habit={selectedHabit}
            />

            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false)
                    setSelectedHabit(null)
                }}
                onConfirm={handleDeleteHabit}
                habitTitle={selectedHabit?.title}
            />
        </div>
    )
}

export default function HabitsPage() {
    return (
        <ProtectedRoute>
            <HabitsPageContent />
        </ProtectedRoute>
    )
}