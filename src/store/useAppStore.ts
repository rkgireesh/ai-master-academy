'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Route =
  | { name: 'home' }
  | { name: 'dashboard' }
  | { name: 'modules' }
  | { name: 'module'; moduleId: string }
  | { name: 'lesson'; moduleId: string; lessonId: string }
  | { name: 'glossary' }
  | { name: 'roadmap' }
  | { name: 'projects' }
  | { name: 'project'; projectId: string }
  | { name: 'search'; query: string }
  | { name: 'quiz'; moduleId: string }

interface AppState {
  // Navigation
  route: Route
  navigate: (route: Route) => void

  // Progress
  completedLessons: string[]
  markLessonComplete: (moduleId: string, lessonId: string) => void
  unmarkLessonComplete: (moduleId: string, lessonId: string) => void

  // Bookmarks
  bookmarks: string[]
  toggleBookmark: (moduleId: string, lessonId: string) => void

  // Quiz scores (moduleId -> best score 0-100)
  quizScores: Record<string, number>
  recordQuizScore: (moduleId: string, score: number) => void

  // Recently viewed
  recentlyViewed: string[]
  recordView: (moduleId: string, lessonId: string) => void

  // Theme
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (t: 'light' | 'dark') => void

  // Helpers
  isCompleted: (moduleId: string, lessonId: string) => boolean
  isBookmarked: (moduleId: string, lessonId: string) => boolean
  resetProgress: () => void
}

const key = (moduleId: string, lessonId: string) => `${moduleId}/${lessonId}`

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      route: { name: 'home' },
      navigate: (route) => {
        set({ route })
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'auto' })
        }
      },

      completedLessons: [],
      markLessonComplete: (moduleId, lessonId) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(key(moduleId, lessonId))
            ? s.completedLessons
            : [...s.completedLessons, key(moduleId, lessonId)],
        })),
      unmarkLessonComplete: (moduleId, lessonId) =>
        set((s) => ({
          completedLessons: s.completedLessons.filter((k) => k !== key(moduleId, lessonId)),
        })),

      bookmarks: [],
      toggleBookmark: (moduleId, lessonId) => {
        const k = key(moduleId, lessonId)
        set((s) => ({
          bookmarks: s.bookmarks.includes(k)
            ? s.bookmarks.filter((b) => b !== k)
            : [...s.bookmarks, k],
        }))
      },

      quizScores: {},
      recordQuizScore: (moduleId, score) =>
        set((s) => ({
          quizScores: {
            ...s.quizScores,
            [moduleId]: Math.max(s.quizScores[moduleId] ?? 0, score),
          },
        })),

      recentlyViewed: [],
      recordView: (moduleId, lessonId) => {
        const k = key(moduleId, lessonId)
        set((s) => ({
          recentlyViewed: [k, ...s.recentlyViewed.filter((r) => r !== k)].slice(0, 12),
        }))
      },

      theme: 'dark',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setTheme: (t) => set({ theme: t }),

      isCompleted: (moduleId, lessonId) =>
        get().completedLessons.includes(key(moduleId, lessonId)),
      isBookmarked: (moduleId, lessonId) =>
        get().bookmarks.includes(key(moduleId, lessonId)),
      resetProgress: () =>
        set({
          completedLessons: [],
          bookmarks: [],
          quizScores: {},
          recentlyViewed: [],
        }),
    }),
    {
      name: 'ai-mastery-academy',
      partialize: (s) => ({
        completedLessons: s.completedLessons,
        bookmarks: s.bookmarks,
        quizScores: s.quizScores,
        recentlyViewed: s.recentlyViewed,
        theme: s.theme,
      }),
    }
  )
)
