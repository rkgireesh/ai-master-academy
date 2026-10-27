import type { Module } from './types'
import { module1 } from './module1'
import { module2 } from './module2'
import { module3 } from './module3'
import { module4 } from './module4'
import { module5 } from './module5'
import { module6 } from './module6'
import { module7 } from './module7'
import { module8 } from './module8'
import { module9 } from './module9'
import { module10 } from './module10'
import { module11 } from './module11'
import { module12 } from './module12'

export const modules: Module[] = [
  module1, module2, module3, module4, module5, module6,
  module7, module8, module9, module10, module11, module12,
]

export function getModule(moduleId: string): Module | undefined {
  return modules.find((m) => m.id === moduleId)
}

export function getLesson(moduleId: string, lessonId: string) {
  const m = getModule(moduleId)
  if (!m) return undefined
  const idx = m.lessons.findIndex((l) => l.id === lessonId)
  if (idx === -1) return undefined
  return {
    module: m,
    lesson: m.lessons[idx],
    index: idx,
    prev: idx > 0 ? m.lessons[idx - 1] : undefined,
    next: idx < m.lessons.length - 1 ? m.lessons[idx + 1] : undefined,
  }
}

export function getAllLessons() {
  return modules.flatMap((m) =>
    m.lessons.map((l) => ({
      moduleId: m.id,
      moduleTitle: m.title,
      moduleIndex: m.index,
      lessonId: l.id,
      title: l.title,
      subtitle: l.subtitle ?? '',
      tags: l.tags,
      readingMinutes: l.readingMinutes,
      definition: l.definition,
      summary: l.summary,
    }))
  )
}

export function totalLessonCount(): number {
  return modules.reduce((acc, m) => acc + m.lessons.length, 0)
}

export * from './types'
export { glossary } from './glossary'
export { quizzes } from './quizzes'
export { projects } from './projects'
