'use client'

import * as React from 'react'
import { NeuralNetworkPlayground } from './neural-network-playground'
import { TokenizerLab } from './tokenizer-lab'
import { AttentionHeatmapLab } from './attention-heatmap-lab'
import { PromptSandbox } from './prompt-sandbox'
import { RAGSandbox } from './rag-sandbox'
import { AgentBuilderLab } from './agent-builder-lab'

const REGISTRY: Record<string, React.ComponentType> = {
  'neural-network-playground': NeuralNetworkPlayground,
  'tokenizer-lab': TokenizerLab,
  'attention-heatmap': AttentionHeatmapLab,
  'prompt-sandbox': PromptSandbox,
  'rag-sandbox': RAGSandbox,
  'agent-builder': AgentBuilderLab,
}

export function LabRenderer({ labId }: { labId: string }) {
  const Cmp = REGISTRY[labId]
  if (!Cmp) {
    return (
      <div className="rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5 p-4 text-sm text-amber-700 dark:text-amber-500">
        Unknown lab: <code className="font-mono">{labId}</code>
      </div>
    )
  }
  return <Cmp />
}
