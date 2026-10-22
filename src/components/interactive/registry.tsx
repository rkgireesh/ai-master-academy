'use client'

import * as React from 'react'
import { TokenPredictor } from './token-predictor'
import { LLMArchitectureExplorer } from './llm-architecture-explorer'
import { AttentionCalculator } from './attention-calculator'
import { RAGDiagram } from './rag-diagram'
import { SemanticSearchDemo } from './semantic-search-demo'
import { AgentSimulator } from './agent-simulator'
import { MultiAgentDiagram } from './multi-agent-diagram'
import { ToolCallingFlow } from './tool-calling-flow'
import { AgentStateTrace } from './agent-state-trace'
import { TemperatureSampling } from './temperature-sampling'

interface InteractiveComponentProps {
  componentId: string
}

const REGISTRY: Record<string, React.ComponentType> = {
  'token-predictor': TokenPredictor,
  'llm-architecture-explorer': LLMArchitectureExplorer,
  'attention-calculator': AttentionCalculator,
  'rag-diagram': RAGDiagram,
  'semantic-search-demo': SemanticSearchDemo,
  'agent-simulator': AgentSimulator,
  'multi-agent-diagram': MultiAgentDiagram,
  'tool-calling-flow': ToolCallingFlow,
  'agent-state-trace': AgentStateTrace,
  'temperature-sampling': TemperatureSampling,
}

export function InteractiveComponent({ componentId }: InteractiveComponentProps) {
  const Cmp = REGISTRY[componentId]
  if (!Cmp) {
    return (
      <div className="my-4 rounded border border-dashed border-amber-500/40 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-500">
        Unknown interactive component: <code className="font-mono">{componentId}</code>
      </div>
    )
  }
  return <Cmp />
}
