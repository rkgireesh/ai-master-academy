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
  | { name: 'labs' }
  | { name: 'lab'; labId: string }

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

  // Hydration flag — false on server and during first client render,
  // set to true after persist middleware rehydrates from localStorage.
  // Components that read persisted state must gate on this to avoid
  // SSR hydration mismatches.
  _hasHydrated: boolean

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

      _hasHydrated: false,

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
      // Critical: don't auto-read localStorage during store creation.
      // Without this, the client's first render uses localStorage data
      // while the server rendered with empty defaults → hydration mismatch.
      skipHydration: true,
      // After we manually call rehydrate() (in AppShell's useEffect),
      // this callback fires. We use setState (not direct mutation) to
      // ensure React subscribers re-render.
      onRehydrateStorage: () => () => {
        useAppStore.setState({ _hasHydrated: true })
      },
      partialize: (s) => ({
        completedLessons: s.completedLessons,
        bookmarks: s.bookmarks,
        quizScores: s.quizScores,
        recentlyViewed: s.recentlyViewed,
      }),
    }
  )
)
