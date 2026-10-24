'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * Animated AI Pipeline Diagram
 *
 * Shows the data flow through an AI system as a horizontal sequence of nodes
 * connected by animated flowing dots. Each project defines its own pipeline
 * stages. The animation makes the "practical AI connection" visible —
 * users see HOW data moves through the AI components.
 */

export interface PipelineNode {
  label: string
  icon: string
  color: string
}

interface ProjectPipelineProps {
  nodes: PipelineNode[]
  className?: string
}

export function ProjectPipeline({ nodes, className }: ProjectPipelineProps) {
  return (
    <div className={cn('relative overflow-x-auto py-4', className)}>
      <div className="flex min-w-fit items-center gap-0 px-2">
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            {/* Node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.15,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              whileHover={{ scale: 1.1, y: -4 }}
              className="relative flex flex-col items-center"
            >
              {/* Pulsing ring */}
              <motion.div
                className="absolute rounded-xl"
                style={{ backgroundColor: node.color, width: 48, height: 48 }}
                animate={{
                  scale: [1, 1.4],
                  opacity: [0.4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
              {/* Node body */}
              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-xl border-2 text-lg shadow-md"
                style={{
                  borderColor: node.color,
                  backgroundColor: `color-mix(in srgb, ${node.color} 15%, var(--card))`,
                }}
              >
                <span>{node.icon}</span>
              </div>
              {/* Label */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.2 }}
                className="mt-1.5 max-w-[80px] text-center text-[10px] font-medium leading-tight"
              >
                {node.label}
              </motion.div>
            </motion.div>

            {/* Connecting line with flowing dots */}
            {i < nodes.length - 1 && (
              <div className="relative flex h-12 w-12 items-center sm:w-16">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-muted" />
                <motion.div
                  className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 origin-left"
                  style={{
                    background: `linear-gradient(90deg, ${nodes[i].color}, ${nodes[i + 1].color})`,
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 + 0.1 }}
                />
                {/* Flowing dot */}
                <motion.div
                  className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: nodes[i + 1].color }}
                  animate={{
                    left: ['0%', '100%'],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3 + 0.5,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full opacity-60"
                  style={{ backgroundColor: nodes[i].color }}
                  animate={{
                    left: ['0%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3 + 1.2,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export const PROJECT_PIPELINES: Record<string, PipelineNode[]> = {
  'ai-chatbot': [
    { label: 'User Input', icon: '💬', color: 'rgb(59, 130, 246)' },
    { label: 'Intent Parser', icon: '🔍', color: 'rgb(99, 102, 241)' },
    { label: 'Rule Engine', icon: '⚙️', color: 'rgb(168, 85, 247)' },
    { label: 'Response', icon: '✨', color: 'rgb(217, 70, 239)' },
  ],
  'prompt-playground': [
    { label: 'User Prompt', icon: '📝', color: 'rgb(59, 130, 246)' },
    { label: 'Parameters', icon: '🎛️', color: 'rgb(6, 182, 212)' },
    { label: 'LLM', icon: '🧠', color: 'rgb(124, 92, 255)' },
    { label: 'Output', icon: '📤', color: 'rgb(217, 70, 239)' },
  ],
  'token-prediction-simulator': [
    { label: 'Text Corpus', icon: '📚', color: 'rgb(59, 130, 246)' },
    { label: 'N-gram Model', icon: '🔢', color: 'rgb(6, 182, 212)' },
    { label: 'Probabilities', icon: '📊', color: 'rgb(124, 92, 255)' },
    { label: 'Next Token', icon: '🎯', color: 'rgb(217, 70, 239)' },
  ],
  'transformer-explorer': [
    { label: 'Input', icon: '📝', color: 'rgb(59, 130, 246)' },
    { label: 'Tokenize', icon: '✂️', color: 'rgb(6, 182, 212)' },
    { label: 'Embed', icon: '🔢', color: 'rgb(124, 92, 255)' },
    { label: 'Attention', icon: '👁️', color: 'rgb(168, 85, 247)' },
    { label: 'Logits', icon: '📈', color: 'rgb(217, 70, 239)' },
  ],
  'semantic-search-app': [
    { label: 'Query', icon: '🔍', color: 'rgb(59, 130, 246)' },
    { label: 'Embed', icon: '🔢', color: 'rgb(6, 182, 212)' },
    { label: 'Vector DB', icon: '🗄️', color: 'rgb(124, 92, 255)' },
    { label: 'Rank', icon: '📊', color: 'rgb(168, 85, 247)' },
    { label: 'Results', icon: '✨', color: 'rgb(217, 70, 239)' },
  ],
  'doc-rag-assistant': [
    { label: 'Document', icon: '📄', color: 'rgb(59, 130, 246)' },
    { label: 'Chunk', icon: '✂️', color: 'rgb(6, 182, 212)' },
    { label: 'Embed', icon: '🔢', color: 'rgb(16, 185, 129)' },
    { label: 'Retrieve', icon: '🔍', color: 'rgb(124, 92, 255)' },
    { label: 'LLM', icon: '🧠', color: 'rgb(168, 85, 247)' },
    { label: 'Answer', icon: '✨', color: 'rgb(217, 70, 239)' },
  ],
  'tool-calling-agent': [
    { label: 'User', icon: '💬', color: 'rgb(59, 130, 246)' },
    { label: 'LLM', icon: '🧠', color: 'rgb(124, 92, 255)' },
    { label: 'Tool Call', icon: '🔧', color: 'rgb(249, 115, 22)' },
    { label: 'Execute', icon: '⚡', color: 'rgb(234, 179, 8)' },
    { label: 'Result', icon: '✨', color: 'rgb(217, 70, 239)' },
  ],
  'research-assistant': [
    { label: 'Question', icon: '❓', color: 'rgb(59, 130, 246)' },
    { label: 'Plan', icon: '📋', color: 'rgb(6, 182, 212)' },
    { label: 'Search', icon: '🔍', color: 'rgb(124, 92, 255)' },
    { label: 'Synthesize', icon: '🧠', color: 'rgb(168, 85, 247)' },
    { label: 'Report', icon: '📄', color: 'rgb(217, 70, 239)' },
  ],
  'csv-data-analysis-agent': [
    { label: 'CSV', icon: '📊', color: 'rgb(59, 130, 246)' },
    { label: 'Profile', icon: '🔎', color: 'rgb(6, 182, 212)' },
    { label: 'Gen Code', icon: '🧠', color: 'rgb(124, 92, 255)' },
    { label: 'Execute', icon: '⚡', color: 'rgb(249, 115, 22)' },
    { label: 'Insights', icon: '✨', color: 'rgb(217, 70, 239)' },
  ],
  'persistent-memory-agent': [
    { label: 'User', icon: '💬', color: 'rgb(59, 130, 246)' },
    { label: 'Recall', icon: '🧠', color: 'rgb(124, 92, 255)' },
    { label: 'Think', icon: '💭', color: 'rgb(168, 85, 247)' },
    { label: 'Store', icon: '💾', color: 'rgb(16, 185, 129)' },
    { label: 'Reply', icon: '✨', color: 'rgb(217, 70, 239)' },
  ],
  'multi-agent-research-system': [
    { label: 'User', icon: '💬', color: 'rgb(59, 130, 246)' },
    { label: 'Supervisor', icon: '👔', color: 'rgb(124, 92, 255)' },
    { label: 'Researcher', icon: '🔍', color: 'rgb(6, 182, 212)' },
    { label: 'Writer', icon: '✍️', color: 'rgb(249, 115, 22)' },
    { label: 'Critic', icon: '✅', color: 'rgb(16, 185, 129)' },
    { label: 'Report', icon: '📄', color: 'rgb(217, 70, 239)' },
  ],
  'production-ai-app': [
    { label: 'Request', icon: '🌐', color: 'rgb(59, 130, 246)' },
    { label: 'Cache', icon: '⚡', color: 'rgb(234, 179, 8)' },
    { label: 'Route', icon: '🛤️', color: 'rgb(6, 182, 212)' },
    { label: 'LLM', icon: '🧠', color: 'rgb(124, 92, 255)' },
    { label: 'Guard', icon: '🛡️', color: 'rgb(239, 68, 68)' },
    { label: 'Stream', icon: '✨', color: 'rgb(217, 70, 239)' },
  ],
}

export const PROJECT_IMAGES: Record<string, string> = {
  'ai-chatbot': '/projects/chatbot.png',
  'prompt-playground': '/projects/prompt.png',
  'token-prediction-simulator': '/projects/chatbot.png',
  'transformer-explorer': '/projects/transformer.png',
  'semantic-search-app': '/projects/embeddings.png',
  'doc-rag-assistant': '/projects/rag.png',
  'tool-calling-agent': '/projects/agent.png',
  'research-assistant': '/projects/agent.png',
  'csv-data-analysis-agent': '/projects/data-analysis.png',
  'persistent-memory-agent': '/projects/agent.png',
  'multi-agent-research-system': '/projects/multi-agent.png',
  'production-ai-app': '/projects/production.png',
}
