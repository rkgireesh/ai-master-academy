// Content block types for rich educational articles.
// Articles are composed of an ordered list of blocks rendered by ArticleContent.tsx.

import type { ReactNode } from 'react'

export type ContentBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; lang: string; code: string; caption?: string }
  | { type: 'callout'; variant: 'info' | 'warning' | 'tip' | 'danger'; title?: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][]; caption?: string }
  | { type: 'diagram'; diagramId: string; caption?: string }
  | { type: 'interactive'; componentId: string; caption?: string }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'example'; title?: string; text: string }

export interface Lesson {
  id: string
  title: string
  subtitle?: string
  tags: string[]
  readingMinutes: number
  // Structured fields that the lesson page renders in a consistent layout
  definition: string
  whyItExists: string
  howItWorks: ContentBlock[]
  examples: ContentBlock[]
  advantages?: string[]
  disadvantages?: string[]
  commonMistakes?: string[]
  limitations?: string[]
  relatedConcepts?: string[]
  faq?: { q: string; a: string }[]
  summary: string
  // Optional override: if provided, replaces the default "howItWorks" block list
  body?: ContentBlock[]
}

export interface Module {
  id: string
  index: number
  title: string
  shortTitle: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  icon: string // lucide icon name
  color: string // tailwind gradient/color hint
  lessons: Lesson[]
  quizId: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Quiz {
  id: string
  title: string
  questions: QuizQuestion[]
}

export interface Project {
  id: string
  title: string
  tagline: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  category: string
  estimatedHours: number
  problem: string
  prerequisites: string[]
  techStack: string[]
  architecture: string
  projectStructure?: string
  implementation: ContentBlock[]
  runInstructions: string[]
  expectedOutput: string
  troubleshooting: string[]
  security: string[]
  extensions: string[]
}

export interface GlossaryEntry {
  term: string
  category: string
  short: string
  detailed: string
  relatedLesson?: { moduleId: string; lessonId: string }
}
