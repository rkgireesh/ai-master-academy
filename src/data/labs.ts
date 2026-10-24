export interface Lab {
  id: string
  title: string
  tagline: string
  description: string
  category: 'Fundamentals' | 'LLM' | 'RAG' | 'Agents' | 'Generative'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedMinutes: number
  learningGoals: string[]
  relatedModuleId: string
  icon: string
  color: string
}

export const labs: Lab[] = [
  {
    id: 'neural-network-playground',
    title: 'Neural Network Playground',
    tagline: 'Train a real MLP in your browser and watch the decision boundary evolve.',
    description:
      'Pick a dataset (XOR, circles, spiral, or two-gaussians), configure the network architecture, and train it live. The decision boundary updates every epoch so you can see how the network learns. Adjust learning rate, hidden layers, and activation to build intuition for how deep learning actually works.',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    learningGoals: [
      'See how a neural network learns a non-linear decision boundary',
      'Understand the impact of learning rate, depth, and activation',
      'Visualise overfitting on small datasets',
      'Build intuition that transfers to LLMs and transformers',
    ],
    relatedModuleId: 'm1',
    icon: 'Brain',
    color: 'from-blue-500 to-violet-500',
  },
  {
    id: 'tokenizer-lab',
    title: 'Tokenizer Lab',
    tagline: 'See how text becomes tokens — the first step inside every LLM.',
    description:
      'Type or paste any text and watch a BPE-style tokenizer split it into sub-word tokens. Each token gets a unique colour and an illustrative token ID. Experiment with vocabulary size and see why rare words break into more pieces, why spaces matter, and why tokenisation is not just "splitting on words".',
    category: 'LLM',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    learningGoals: [
      'Understand sub-word tokenisation (BPE)',
      'See why token count ≠ word count',
      'Visualise vocabulary size trade-offs',
      'Connect tokenisation to LLM context windows',
    ],
    relatedModuleId: 'm3',
    icon: 'Type',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'attention-heatmap',
    title: 'Self-Attention Heatmap',
    tagline: 'Type a sentence and inspect which tokens attend to which.',
    description:
      'Self-attention is the heart of the Transformer. In this lab you type a short sentence and see the attention weight matrix as a heatmap. Hover any cell to see the exact weight. Adjust the temperature to make attention sharper or flatter. A small, deterministic Q/K/V generator produces interpretable patterns so you can build intuition before tackling real attention matrices.',
    category: 'LLM',
    difficulty: 'Intermediate',
    estimatedMinutes: 12,
    learningGoals: [
      'Visualise the attention matrix softmax(QKᵀ/√d_k)',
      'See how temperature sharpens or flattens attention',
      'Understand why some tokens attend to themselves, others to neighbours',
      'Connect attention patterns to model behaviour',
    ],
    relatedModuleId: 'm3',
    icon: 'Grid3x3',
    color: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 'prompt-sandbox',
    title: 'Prompt Engineering Sandbox',
    tagline: 'Try zero-shot, few-shot, and chain-of-thought prompting side by side.',
    description:
      'Pick a task (sentiment, classification, math, summarisation) and a prompting strategy. See how the same simulated model produces different outputs depending on the prompt structure. The lab clearly labels outputs as simulations but demonstrates the real-world principle: prompt structure has a bigger effect than model size on many tasks.',
    category: 'LLM',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    learningGoals: [
      'Compare zero-shot vs few-shot vs chain-of-thought prompting',
      'See how examples steer model output',
      'Understand why explicit reasoning steps help on math tasks',
      'Build a prompting intuition you can apply to real LLMs',
    ],
    relatedModuleId: 'm2',
    icon: 'MessageSquareCode',
    color: 'from-fuchsia-500 to-pink-500',
  },
  {
    id: 'rag-sandbox',
    title: 'RAG Sandbox',
    tagline: 'Paste a document, ask questions, watch retrieval + generation happen.',
    description:
      'A full RAG pipeline running in your browser. Paste any text, watch it get chunked, see chunks embedded (using a small heuristic embedder), then ask a question. The lab shows the top-k retrieved chunks, the assembled prompt, and a template-based answer with citations. Everything is clearly labelled as educational simulation — but the architecture is exactly what production RAG systems do.',
    category: 'RAG',
    difficulty: 'Intermediate',
    estimatedMinutes: 20,
    learningGoals: [
      'See the full RAG pipeline: chunk → embed → retrieve → assemble → generate',
      'Understand why chunk size matters',
      'Visualise cosine similarity ranking',
      'See how retrieved context grounds the answer',
    ],
    relatedModuleId: 'm5',
    icon: 'Database',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    id: 'agent-builder',
    title: 'Agent Builder Lab',
    tagline: 'Compose tools, set a goal, and step through the agent loop.',
    description:
      'Design your own agent: pick which tools it has access to (search, calculator, weather, database, code-runner), set a goal, and run the simulation step by step. Watch the agent plan, select tools, observe results, and decide whether to continue or stop. The lab uses a rule-based decision engine so the behaviour is fully traceable — and clearly labelled as an educational simulation.',
    category: 'Agents',
    difficulty: 'Advanced',
    estimatedMinutes: 25,
    learningGoals: [
      'Understand the plan → act → observe → reflect loop',
      'See how tool selection depends on the goal',
      'Visualise agent state evolution across steps',
      'Build intuition for when agents succeed vs loop forever',
    ],
    relatedModuleId: 'm6',
    icon: 'Bot',
    color: 'from-orange-500 to-amber-500',
  },
]

export function getLab(id: string): Lab | undefined {
  return labs.find((l) => l.id === id)
}
