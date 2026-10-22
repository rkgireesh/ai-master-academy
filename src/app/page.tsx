'use client'

import * as React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { AppShell } from '@/components/layout/app-shell'
import { HomeView } from '@/components/views/home-view'
import { DashboardView } from '@/components/views/dashboard-view'
import { ModulesView } from '@/components/views/modules-view'
import { ModuleView } from '@/components/views/module-view'
import { LessonView } from '@/components/views/lesson-view'
import { GlossaryView } from '@/components/views/glossary-view'
import { RoadmapView } from '@/components/views/roadmap-view'
import { ProjectsView } from '@/components/views/projects-view'
import { ProjectDetailView } from '@/components/views/project-detail-view'
import { SearchView } from '@/components/views/search-view'
import { QuizView } from '@/components/views/quiz-view'

export default function Home() {
  const route = useAppStore((s) => s.route)

  return (
    <AppShell>
      <RouteRenderer route={route} />
    </AppShell>
  )
}

function RouteRenderer({ route }: { route: ReturnType<typeof useAppStore.getState>['route'] }) {
  switch (route.name) {
    case 'home':      return <HomeView />
    case 'dashboard': return <DashboardView />
    case 'modules':   return <ModulesView />
    case 'module':    return <ModuleView moduleId={route.moduleId} />
    case 'lesson':    return <LessonView moduleId={route.moduleId} lessonId={route.lessonId} />
    case 'glossary':  return <GlossaryView />
    case 'roadmap':   return <RoadmapView />
    case 'projects':  return <ProjectsView />
    case 'project':   return <ProjectDetailView projectId={route.projectId} />
    case 'search':    return <SearchView query={route.query} />
    case 'quiz':      return <QuizView moduleId={route.moduleId} />
    default:          return <HomeView />
  }
}
