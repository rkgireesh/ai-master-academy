'use client'

import { GraduationCap, Github, Twitter, Linkedin } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { modules } from '@/data'
import { totalLessonCount } from '@/data'

export function Footer() {
  const navigate = useAppStore((s) => s.navigate)

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
        {/* Brand */}
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>
            AI Mastery Academy
          </div>
          <p className="mt-2 max-w-sm text-xs text-muted-foreground">
            Understand AI. Master LLMs. Build Intelligent Agents.
            A complete, free educational platform covering everything from AI fundamentals
            to production multi-agent systems — {modules.length} modules, {totalLessonCount()} lessons, {modules.length} quizzes, 12 hands-on projects.
          </p>
          <div className="mt-3 flex gap-2">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground">
              <Github className="h-4 w-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="rounded-md p-1.5 text-muted-foreground hover:bg-background hover:text-foreground">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Modules */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Modules</div>
          <ul className="space-y-1.5 text-sm">
            {modules.slice(0, 6).map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => navigate({ name: 'module', moduleId: m.id })}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {m.shortTitle}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resources</div>
          <ul className="space-y-1.5 text-sm">
            <li><button onClick={() => navigate({ name: 'dashboard' })} className="text-muted-foreground hover:text-foreground">Dashboard</button></li>
            <li><button onClick={() => navigate({ name: 'labs' })} className="text-muted-foreground hover:text-foreground">Practical Labs</button></li>
            <li><button onClick={() => navigate({ name: 'roadmap' })} className="text-muted-foreground hover:text-foreground">Learning Roadmap</button></li>
            <li><button onClick={() => navigate({ name: 'projects' })} className="text-muted-foreground hover:text-foreground">Projects Library</button></li>
            <li><button onClick={() => navigate({ name: 'glossary' })} className="text-muted-foreground hover:text-foreground">Glossary</button></li>
            <li><button onClick={() => navigate({ name: 'modules' })} className="text-muted-foreground hover:text-foreground">All Modules</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t px-4 py-3 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} AI Mastery Academy · Built for learners, by learners · Educational content only — verify before production use.
      </div>
    </footer>
  )
}
