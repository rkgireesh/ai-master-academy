import type { Module } from './types'

export const module9: Module = {
  id: 'm9',
  index: 9,
  title: 'Agent Memory and Planning',
  shortTitle: 'Memory & Planning',
  description:
    'An agent without memory repeats itself; an agent without a plan thrashes. This module covers the full taxonomy of agent memory — conversation history, working memory, persistent/episodic/semantic/procedural stores, retrieval — and the planning machinery (task decomposition, state machines, goal tracking, replanning, termination) that turns a reactive LLM into a goal-directed system.',
  level: 'Advanced',
  icon: 'MemoryStick',
  color: 'from-purple-500 to-pink-500',
  quizId: 'q9',
  lessons: [
    {
      id: 'conversation-history',
      title: 'Conversation History',
      subtitle: 'The message array is the simplest memory an agent has — and the most misunderstood.',
      tags: ['memory', 'conversation', 'context', 'agents'],
      readingMinutes: 7,
      definition:
        'Conversation history is the ordered list of past messages (user, assistant, tool) that an agent re-sends to the LLM on every call. It lives in the prompt, not in the model weights, and it is the default short-term memory of any LLM-based agent.',
      whyItExists:
        'An LLM has no internal state between calls — each request is stateless. To give the illusion of continuity, the agent must explicitly pass the prior turns back to the model. Conversation history exists because the model itself cannot remember; the application must remember on its behalf and re-inject the relevant parts every time.',
      howItWorks: [
        {
          type: 'callout',
          variant: 'info',
          title: 'Three things that are NOT conversation history',
          text: 'Do not conflate these. (1) Model parameters — weights learned during training, frozen at inference, stored in GPU memory; they encode general capabilities, not this conversation. (2) Conversation context — the message array sent in the prompt this turn; this IS the history (plus the current user turn). (3) External memory — anything stored outside the prompt (vector DB, KV store, files); it must be explicitly retrieved and injected. The history is just the slice of past messages you choose to resend.'
        },
        { type: 'h3', text: 'Structure of a history array' },
        {
          type: 'p',
          text: 'A history is a list of message objects, each with a role and content. In the OpenAI/Anthropic convention: system messages set behaviour, user messages carry instructions, assistant messages are the model\'s prior replies, and tool/function messages carry tool outputs. The order matters: the model treats the sequence as a transcript and conditions its next token on the entire prefix.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A minimal conversation history handed to an LLM',
          code: `messages = [
    {"role": "system",    "content": "You are a travel-planning agent."},
    {"role": "user",      "content": "I want a 3-day Lisbon trip."},
    {"role": "assistant", "content": "Sure — what's your budget?"},
    {"role": "user",      "content": "Around €800."},
    {"role": "assistant", "content": "Got it. Let me check flights.",
     "tool_calls": [{"id": "c1", "name": "search_flights", "args": {"to": "LIS"}}]},
    {"role": "tool",      "tool_call_id": "c1", "content": "3 options found..."},
]

# The agent appends the next assistant turn, then re-sends the whole array
response = client.chat.completions.create(model="gpt-4o", messages=messages)
messages.append(response.choices[0].message)`
        },
        { type: 'h3', text: 'Growth, cost, and the truncation problem' },
        {
          type: 'p',
          text: 'History grows linearly with turns. Every token in the history is re-processed on every call — so a 30-turn chat can cost 30× more per turn than turn 1. Once history exceeds the context window the agent must truncate, summarise, or move old turns to external memory. Naive truncation (drop oldest) loses early instructions; smart truncation preserves system messages, recent turns, and any turn flagged as important.'
        },
        {
          type: 'table',
          headers: ['Strategy', 'What it does', 'Risk'],
          rows: [
            ['Truncate oldest', 'Drop messages past a token budget', 'Loses early context (instructions, facts)'],
            ['Rolling summary', 'Summarise old turns into one message', 'Summaries lose detail; errors compound'],
            ['Sliding window', 'Keep last N turns verbatim', 'Forgets anything older than N'],
            ['External store', 'Move old turns to a DB; retrieve on demand', 'Adds latency and retrieval complexity']
          ]
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A coding agent that has run for 40 tool calls now has a 25k-token history. To keep going, it summarises turns 1–30 into "Prior work: refactored auth.py, added 4 tests, fixed login bug", keeps turns 31–40 verbatim, and re-sends system + summary + recent turns. Cost drops 5×; the agent can still answer "what did we change in auth.py?" because the summary mentions it.'
        }
      ],
      advantages: [
        'Simplest possible memory — no infrastructure beyond the message array.',
        'Preserves exact wording, which matters for code, quotes, and references.',
        'Native to the LLM API — every model supports it without extra plumbing.'
      ],
      disadvantages: [
        'Grows linearly with turns; cost and latency grow with it.',
        'Bounded by the context window — eventually you must truncate or summarise.',
        'Resends the same tokens repeatedly, wasting compute on long sessions.'
      ],
      commonMistakes: [
        'Confusing history (in the prompt) with model parameters (in the weights) — fine-tuning is not a substitute for sending history.',
        'Truncating without preserving the system message — the agent loses its instructions.',
        'Storing the full raw history in a database and assuming that equals "memory" — it still has to be retrieved and re-injected.',
        'Letting tool outputs (which can be huge) accumulate verbatim in the history.'
      ],
      limitations: [
        'Volatile — gone when the process restarts unless explicitly persisted.',
        'Not searchable except by re-reading sequentially; no semantic query.',
        'Subject to context-window limits; cannot scale to multi-year conversations on its own.'
      ],
      relatedConcepts: ['Working Memory', 'Context-Window Limits', 'Memory Retrieval', 'Persistent Memory'],
      faq: [
        { q: 'Is conversation history the same as "memory"?', a: 'It is one form of memory — the short-term, in-prompt kind. Production agents combine it with persistent external memory for facts that must survive across sessions.' },
        { q: 'Do fine-tuned models need less history?', a: 'Fine-tuning changes parameters (the model\'s general capabilities), but a fine-tuned model still has no per-conversation state. You still must pass history.' }
      ],
      summary:
        'Conversation history is the message array an agent re-sends on every call. It is the agent\'s default short-term memory, distinct from model parameters (learned, frozen) and external memory (retrieved on demand). It grows linearly and must eventually be truncated, summarised, or offloaded to a persistent store.'
    },
    {
      id: 'working-memory',
      title: 'Working Memory',
      subtitle: 'The agent\'s short-term scratchpad for the current task — what it is "thinking about" right now.',
      tags: ['memory', 'working-memory', 'agents', 'cognitive-architecture'],
      readingMinutes: 7,
      definition:
        'Working memory is the short-term, task-scoped store an agent uses to hold intermediate results, partial plans, and contextual notes during a single run. It is more structured than raw conversation history and shorter-lived than persistent memory — it is created for the task and discarded (or archived) when the task ends.',
      whyItExists:
        'Conversation history is a flat transcript; it does not separate "the file the user just uploaded", "the sub-goal we are currently pursuing", or "the value of variable X". Working memory gives the agent an explicit, structured scratchpad so it can track these things without re-deriving them from the transcript every step. Cognitive science calls this the difference between episodic recall and active manipulation.',
      howItWorks: [
        {
          type: 'callout',
          variant: 'info',
          title: 'Where working memory sits',
          text: 'Working memory is neither model parameters (frozen, in the weights) nor persistent storage (survives across sessions in a DB). It is a per-task scratchpad — typically a JSON object, a set of typed slots, or a few structured variables — that the agent reads and writes during the current run, and that is usually discarded when the task completes.'
        },
        { type: 'h3', text: 'Common forms of working memory' },
        {
          type: 'ul',
          items: [
            'Scratchpad variables — typed slots like {current_file: "auth.py", failing_test: "test_login", attempt: 3}.',
            'Plan stack — the current plan and the sub-step being executed, popped as steps complete.',
            'Thought log — the chain of intermediate reasoning (ReAct\'s thought/action/observation triples).',
            'Tool-result cache — recently fetched tool outputs kept for re-use within the same task.',
            'Open-file buffer — for coding agents, the contents of files currently being edited.'
          ]
        },
        { type: 'h3', text: 'How it differs from conversation history' },
        {
          type: 'p',
          text: 'Conversation history is the chronological transcript the LLM sees. Working memory is the structured subset the agent actively maintains: the file it is editing, the bug it is chasing, the partial answer it is assembling. The agent typically serialises working memory into the prompt (as a "current state" block) on each call, so the model can act on it, but the source of truth is the agent runtime, not the transcript.'
        },
        {
          type: 'interactive',
          componentId: 'agent-state-trace',
          caption: 'Step through an agent run and watch how working memory (current goal, scratchpad, recent tool calls) changes at each step.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A typed working-memory object an agent updates each step',
          code: `from pydantic import BaseModel, Field
from typing import Literal

class WorkingMemory(BaseModel):
    goal: str                          # what the agent is trying to do
    plan: list[str]                    # remaining sub-steps
    scratchpad: dict[str, str] = Field(default_factory=dict)
    last_action: str | None = None
    last_observation: str | None = None
    status: Literal["planning", "acting", "verifying", "done"] = "planning"

wm = WorkingMemory(goal="Fix failing test_login",
                   plan=["read test", "reproduce", "patch auth.py", "rerun"])
wm.scratchpad["failing_line"] = "assert login('a','b') is True"
wm.status = "acting"`
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A debug agent is fixing test_login. Its working memory holds {file_under_test: "auth.py", failing_assertion: "login returns None", hypothesis: "password hashing mismatch", attempt: 2}. When the model is called, this state is rendered into the prompt as a "Current state" block. The agent acts, the action fails, it updates hypothesis to "user fixture missing", and tries again. When the test passes, status becomes "done" and the scratchpad is archived to episodic memory before being cleared.'
        }
      ],
      advantages: [
        'Gives the model a stable, structured view of task state instead of forcing it to re-parse the transcript.',
        'Decouples task state from transcript length — the scratchpad can stay small even when history is huge.',
        'Makes agent behaviour debuggable: you can inspect the working memory at any step.'
      ],
      disadvantages: [
        'Requires the agent runtime (not the LLM) to maintain the schema and update rules.',
        'Schema design is hard — too rigid and the agent cannot adapt; too loose and it degrades into a free-form transcript.',
        'Serialising working memory into the prompt every turn adds tokens and cost.'
      ],
      commonMistakes: [
        'Storing working memory in the prompt as unstructured text — the model will hallucinate the current state instead of reading it.',
        'Forgetting to clear or archive working memory between tasks — state leaks across runs.',
        'Letting the scratchpad grow unbounded; treat it like a register file, not a log.',
        'Treating working memory as a substitute for persistent memory — it dies when the process dies.'
      ],
      limitations: [
        'Per-task and per-process; not shared between concurrent agents without explicit syncing.',
        'Bounded by what fits in the prompt when serialised; very large scratchpads must be offloaded.',
        'No semantic query — you address slots by name, not by meaning.'
      ],
      relatedConcepts: ['Conversation History', 'Persistent Memory', 'State Machines', 'Agent Planning'],
      faq: [
        { q: 'Is working memory the same as the context window?', a: 'No. The context window is the LLM\'s token budget for a single call. Working memory is the agent\'s structured task state — it is rendered into the context window, but it is a smaller, structured subset of what the prompt contains.' },
        { q: 'Should working memory survive between sessions?', a: 'Usually not. If a fact needs to survive, promote it to persistent or episodic memory. Working memory is for the current task only.' }
      ],
      summary:
        'Working memory is the agent\'s structured, per-task scratchpad — distinct from conversation history (a transcript) and from persistent memory (which survives sessions). It holds the current goal, plan, partial results, and recent observations. It must be serialised into the prompt each turn, kept small, and cleared or archived when the task ends.'
    },
    {
      id: 'persistent-memory',
      title: 'Persistent Memory',
      subtitle: 'Memory that survives across sessions, processes, and restarts — the agent\'s long-term store.',
      tags: ['memory', 'persistence', 'storage', 'agents'],
      readingMinutes: 7,
      definition:
        'Persistent memory is any store the agent reads from and writes to that outlives a single task or process. It is backed by a database, file system, KV store, or vector index, and it lets an agent recall facts about a user, project, or prior task that are not in the current conversation history.',
      whyItExists:
        'Without persistent memory, every session starts from zero. The agent cannot remember that you prefer Python, that your project uses pytest, or that you fixed a similar bug last week. Persistent memory exists because conversation history is volatile (lost on restart) and bounded (limited by the context window), and because users expect agents to "remember" them across sessions — like a colleague would.',
      howItWorks: [
        {
          type: 'callout',
          variant: 'info',
          title: 'Three distinct stores — keep them straight',
          text: 'Model parameters live in the weights (frozen at inference). Conversation history lives in the prompt (volatile, this session only). Persistent memory lives outside the prompt, in a database or file, and is retrieved on demand. Confusing them leads to wrong fixes: a "the agent forgets my preferences" bug is not fixed by fine-tuning (which changes parameters); it is fixed by adding a persistent store and a retrieval step.'
        },
        { type: 'h3', text: 'What gets stored' },
        {
          type: 'ul',
          items: [
            'User profile — preferences, language, timezone, communication style.',
            'Project context — repo layout, tech stack, conventions, "what we agreed on".',
            'Past interactions — episodic logs of prior tasks and their outcomes.',
            'Accumulated knowledge — semantic facts distilled from many sessions.',
            'Credentials and configuration — secrets the agent needs to act (API keys, OAuth tokens).'
          ]
        },
        { type: 'h3', text: 'Storage backends and their trade-offs' },
        {
          type: 'table',
          headers: ['Backend', 'Good for', 'Watch out for'],
          rows: [
            ['Relational DB (Postgres)', 'Structured user/project data with relations', 'Schema migrations; not great for free text'],
            ['Document DB (MongoDB)', 'Flexible JSON per user/project', 'Weak querying across docs'],
            ['KV store (Redis)', 'Hot per-session state, TTL\'d facts', 'Volatile if not persisted to disk'],
            ['Vector DB (Pinecone, pgvector)', 'Semantic recall over text/episodes', 'Approximate search; needs embeddings'],
            ['File system', 'Long-form notes, project READMEs', 'No query language; concurrency is manual']
          ]
        },
        { type: 'h3', text: 'Write and retrieve cycle' },
        {
          type: 'ol',
          items: [
            'On task completion, the agent (or a "memory writer" sub-agent) extracts durable facts from the transcript.',
            'Those facts are written to the persistent store with metadata: user_id, timestamp, source, importance.',
            'At the start of the next task, the agent queries the store (by user_id, by semantic similarity, or by recency).',
            'Retrieved facts are injected into the prompt as a "long-term memory" block, distinct from the conversation history.',
            'The agent treats retrieved memory as context, not as ground truth — it can be stale or wrong.'
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Memory is not free of error',
          text: 'A retrieved fact like "user prefers tabs" may be outdated (they switched to spaces). Persistent memory must include timestamps and provenance, and the agent should prefer fresh signals over stored ones when they conflict.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A coding agent stores, per project: {tech_stack: ["python","fastapi","pytest"], test_cmd: "pytest -q", conventions: "use Black, line length 100"}. On the next session, even before the user says anything, the agent retrieves this profile and prepares to run pytest. When the user says "run the tests", the agent knows the command without asking — that is persistent memory doing its job.'
        }
      ],
      advantages: [
        'Agents feel continuous and personalised across sessions.',
        'Decouples task-relevant facts from the context window — the store can be terabytes; only the retrieved slice enters the prompt.',
        'Enables learning over time — recurring patterns become durable knowledge.'
      ],
      disadvantages: [
        'Adds infrastructure (DB, embeddings, retrieval pipeline) and operational cost.',
        'Stale or wrong memories can mislead the agent worse than no memory.',
        'Privacy and retention: stored user data must be governed, deletable, and access-controlled.'
      ],
      commonMistakes: [
        'Dumping raw transcripts into the store and calling it memory — it must be distilled into structured or semantic facts.',
        'No expiry policy — old preferences accumulate and contradict newer ones.',
        'Treating retrieved memory as authoritative; the agent should still validate against current signals.',
        'Storing secrets in plaintext; use a secrets manager, not the memory store.'
      ],
      limitations: [
        'Retrieval is approximate — semantic search can miss the right fact and surface a wrong one.',
        'No guarantee of consistency across concurrent writes from multiple agents.',
        'Hard to "forget" cleanly — deletions can break references from other stored facts.'
      ],
      relatedConcepts: ['Episodic Memory', 'Semantic Memory', 'Memory Retrieval', 'Conversation History'],
      faq: [
        { q: 'Persistent memory vs fine-tuning — which should I use?', a: 'Use persistent memory for per-user, per-project, or evolving facts. Use fine-tuning only for stable, general capabilities that should live in the weights. They are not interchangeable.' },
        { q: 'How do I know what to store?', a: 'Store facts that are (a) reusable across future tasks, (b) expensive to re-derive, and (c) unlikely to change often. Skip one-off details and transient state.' }
      ],
      summary:
        'Persistent memory is the agent\'s long-term, out-of-prompt store — distinct from model parameters (frozen weights) and conversation history (volatile transcript). It is backed by a DB, KV store, or vector index, retrieved on demand, and injected into the prompt. It enables cross-session continuity but introduces staleness, privacy, and retrieval-quality concerns.'
    },
    {
      id: 'episodic-memory',
      title: 'Episodic Memory',
      subtitle: 'Memory of specific past events — "what happened, when, and to whom".',
      tags: ['memory', 'episodic', 'agents', 'recall'],
      readingMinutes: 6,
      definition:
        'Episodic memory stores records of specific past events — a timestamped log of what the agent did, what the user said, what tools were called, and what the outcome was. It is the agent\'s equivalent of "I remember last Tuesday we tried X and it failed because Y".',
      whyItExists:
        'Semantic memory ("user prefers Python") is general; episodic memory ("on 2024-11-03 the user asked me to refactor auth.py and I broke the login flow") is specific. Episodic memory exists because agents often need to recall exact prior events — to avoid repeating a failed approach, to cite a prior decision, or to resume an interrupted task. It is also the raw material from which semantic memory is distilled.',
      howItWorks: [
        {
          type: 'p',
          text: 'An episode is a structured record: {timestamp, user_id, session_id, goal, actions_taken, outcome, lessons}. It is written at the end of a task (or at meaningful checkpoints) and stored in a database, often with embeddings of the goal and outcome text so it can be retrieved by semantic query.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Writing an episode at the end of a task',
          code: `from datetime import datetime
import uuid

episode = {
    "id": str(uuid.uuid4()),
    "timestamp": datetime.utcnow().isoformat(),
    "user_id": "u_42",
    "session_id": "s_7",
    "goal": "Fix failing test_login in auth.py",
    "actions": [
        "read tests/test_auth.py",
        "reproduced locally -> login returns None",
        "patched password hashing in auth.py",
        "reran pytest -> passed",
    ],
    "outcome": "success",
    "lessons": ["hashlib.scrypt requires bytes; was passing str"],
    "embedding": embed("Fix failing test_login; password hashing; hashlib.scrypt bytes"),
}
episodes.insert(episode)`
        },
        { type: 'h3', text: 'Retrieval: recency, similarity, outcome' },
        {
          type: 'p',
          text: 'Episodes are typically retrieved by a combination of: (1) semantic similarity between the current goal and past episode goals, (2) recency — recent episodes weighted higher, (3) outcome — successful episodes are preferred as references, failed ones as warnings. The retrieved episodes enter the prompt as "relevant past experience", and the agent is told to learn from them.'
        },
        {
          type: 'table',
          headers: ['Use case', 'Retrieval signal', 'Why episodic'],
          rows: [
            ['Avoid repeating a failed approach', 'Similar goal + outcome=failure', 'Recall the specific failure mode'],
            ['Cite a prior decision', 'Same user + topic, recent', 'Provide exact prior context'],
            ['Resume an interrupted task', 'Same session_id, status=paused', 'Pick up where it left off'],
            ['Distil a general lesson', 'Cluster of similar episodes', 'Source data for semantic memory']
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Episodes are the raw material of learning',
          text: 'A "memory curator" sub-agent can periodically scan episodic logs, extract recurring patterns, and write them to semantic memory. This is how an agent turns "I have fixed hashlib bugs three times this month" into "user\'s project has recurring bytes/str issues in crypto code".'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A user asks the agent to "fix the login bug again". The agent embeds this query, retrieves the three most similar past episodes, and finds one from last week: "Fixed test_login — root cause was hashlib.scrypt receiving str instead of bytes". The agent injects this into the prompt, checks auth.py first, and finds the same bug pattern re-introduced. Total time saved: a full debugging cycle.'
        }
      ],
      advantages: [
        'Lets agents recall specific past events, not just general facts.',
        'Provides concrete precedents that improve decision quality on recurring tasks.',
        'Source data for distilling semantic memory and for evaluating agent performance.'
      ],
      disadvantages: [
        'Storage grows with use; needs retention policies (e.g., keep last 90 days, archive older).',
        'Privacy-sensitive — full transcripts may contain PII; consider redaction before storage.',
        'Retrieval quality depends on embeddings and metadata; bad metadata = unfindable episodes.'
      ],
      commonMistakes: [
        'Storing full raw transcripts as episodes — they are too noisy; extract the structured summary first.',
        'No outcome field — without success/failure, you cannot prefer good precedents.',
        'Forgetting to embed the goal text — without embeddings, semantic retrieval is impossible.',
        'Treating episodes as ground truth; they are one observation, not a law.'
      ],
      limitations: [
        'Retrieval is approximate; the most relevant episode may not be in the top-k.',
        'Old episodes may describe deprecated code or policies — always include timestamps and validate.',
        'Per-user episodes can reinforce biases if the user has unusual patterns.'
      ],
      relatedConcepts: ['Semantic Memory', 'Persistent Memory', 'Memory Retrieval', 'Working Memory'],
      faq: [
        { q: 'Episodic vs semantic memory — what\'s the difference?', a: 'Episodic = specific events ("on Tuesday we fixed X"). Semantic = general facts ("the project uses pytest"). Episodes are raw observations; semantic facts are distilled abstractions. A good agent uses both.' },
        { q: 'How long should I keep episodes?', a: 'Long enough to cover recurring patterns (weeks to months), short enough to avoid stale references (don\'t keep years). Compress old episodes into semantic facts and archive the raw records.' }
      ],
      summary:
        'Episodic memory stores timestamped records of specific past events — what the agent did, what happened, what was learned. It is retrieved by recency, semantic similarity, and outcome, and it provides concrete precedents for current tasks. It is also the raw material from which semantic memory is distilled.'
    },
    {
      id: 'semantic-memory',
      title: 'Semantic Memory',
      subtitle: 'General, distilled knowledge — facts, preferences, and rules that hold across many situations.',
      tags: ['memory', 'semantic', 'knowledge', 'agents'],
      readingMinutes: 6,
      definition:
        'Semantic memory stores general facts and knowledge the agent has derived or been told: "the user prefers Python 3.12", "the production API returns ISO-8601 timestamps", "never commit directly to main". Unlike episodic memory (specific events), semantic memory is abstracted and reusable across many future tasks.',
      whyItExists:
        'Episodes are concrete but verbose; retrieving ten similar past events to derive "the user hates tabs" is wasteful. Semantic memory exists to hold the distilled, general-purpose facts so the agent can act on them in one prompt-line instead of ten episodes. It is the agent\'s equivalent of "things you just know about this person/project".',
      howItWorks: [
        {
          type: 'p',
          text: 'A semantic memory record is a typed fact: {subject, predicate, object, confidence, source, last_updated}. Examples: {user_42, prefers, Python, 0.9, inferred_from_episodes, 2024-11-01}, {project_alpha, uses, pytest, 1.0, user_stated, 2024-10-15}. Facts are written either explicitly (the user said so) or implicitly (a curator sub-agent inferred them from episodes).'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A typed semantic-memory store with provenance',
          code: `semantic_facts.insert({
    "user_id": "u_42",
    "subject": "user",
    "predicate": "prefers_language",
    "object": "python",
    "confidence": 0.92,
    "source": "inferred",          # or "user_stated"
    "evidence": ["ep_103", "ep_187", "ep_290"],
    "last_updated": "2024-11-01",
})

# Retrieve at task start: all high-confidence facts for this user
facts = semantic_facts.find(
    {"user_id": "u_42", "confidence": {"$gte": 0.5}}
).sort("last_updated", -1)`
        },
        { type: 'h3', text: 'How facts get into the store' },
        {
          type: 'ol',
          items: [
            'Explicit: the user states a preference ("I use pytest, never unittest"). The agent writes it with confidence=1.0, source=user_stated.',
            'Inferred: a curator sub-agent reviews recent episodes and notices "in 8 of 10 sessions the user picked Python". It writes a fact with confidence=0.8, source=inferred.',
            'Imported: from external systems (HR profile, calendar, CRM) with appropriate confidence and source tags.'
          ]
        },
        { type: 'h3', text: 'Retrieval and conflict resolution' },
        {
          type: 'p',
          text: 'At task start, the agent queries semantic memory by user_id and topic, ranks by confidence and recency, and injects the top facts as a "what you know about this user/project" block. When two facts conflict (e.g., prefers tabs vs prefers spaces), the agent picks the higher-confidence, more recent one — or asks the user to disambiguate rather than guessing.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Confidence is not optional',
          text: 'Without confidence, you cannot resolve conflicts. A user-stated fact should override an inferred one; a recent fact should override a stale one. Treating all facts as equally true leads to contradictions and unreliable behaviour.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A user starts a new project with the agent. Semantic memory returns: prefers Python, uses pytest, line length 100, never commit to main. The agent scaffolds a Python project with pytest configured, Black at line 100, and a feature-branch git workflow — all without asking. The user feels understood. This is semantic memory at its best.'
        }
      ],
      advantages: [
        'Compact — one fact replaces many episodes in the prompt.',
        'Reusable across any future task for the same user/project.',
        'Enables personalisation without fine-tuning.'
      ],
      disadvantages: [
        'Inference can be wrong — a curator sub-agent may extract a fact the user would not endorse.',
        'Facts go stale — users change preferences; without updates, memory lies.',
        'Conflict resolution is non-trivial; a naive "latest wins" can be wrong.'
      ],
      commonMistakes: [
        'Storing facts without confidence or timestamp — unresolvable conflicts later.',
        'Inferred facts presented to the user as if they were stated — creepy and error-prone.',
        'Never pruning — old contradictions accumulate; periodically review and merge.',
        'Storing PII or sensitive inferences without consent.'
      ],
      limitations: [
        'Only as good as the inference pipeline that produces facts.',
        'Hard to validate against reality — a fact can be confidently wrong.',
        'Not suited to rapidly changing state (use working memory or episodic for that).'
      ],
      relatedConcepts: ['Episodic Memory', 'Persistent Memory', 'Procedural Memory', 'Memory Retrieval'],
      faq: [
        { q: 'Is semantic memory just RAG?', a: 'Not quite. RAG retrieves relevant text chunks from a corpus. Semantic memory stores typed, user/project-specific facts with confidence and provenance. They overlap in using embeddings but differ in structure and use.' },
        { q: 'How often should I re-derive facts from episodes?', a: 'After each session is a reasonable cadence. Cheap to run, fresh enough to catch preference changes within a day.' }
      ],
      summary:
        'Semantic memory holds distilled, general facts about users and projects — typed, confidence-scored, time-stamped. It is compact, reusable, and the foundation of personalisation. It is created explicitly (user-stated), inferred from episodes, or imported from external systems, and it must support conflict resolution between competing facts.'
    },
    {
      id: 'procedural-memory',
      title: 'Procedural Memory',
      subtitle: 'Memory of how to do things — skills, recipes, and recurring tool-use patterns.',
      tags: ['memory', 'procedural', 'skills', 'agents'],
      readingMinutes: 6,
      definition:
        'Procedural memory stores reusable procedures — step-by-step recipes for accomplishing recurring tasks. Where episodic memory says "what happened" and semantic memory says "what is true", procedural memory says "how to do X": the steps, the tools, the order, and the guards.',
      whyItExists:
        'Without procedural memory, the agent re-derives "how to deploy to staging" from scratch every time — slow, inconsistent, and error-prone. Procedural memory exists so that once the agent (or a human) has worked out a reliable procedure, it can be stored, reused, and refined. It is the agent\'s equivalent of "I know how to do this without thinking about each step".',
      howItWorks: [
        {
          type: 'p',
          text: 'A procedure is a named, parameterised recipe: {name, trigger, inputs, steps, tools, guards, success_criteria}. Procedures can be expressed as code (a Python function the agent can call), as a structured plan the agent executes step-by-step, or as a natural-language playbook the agent reads and interprets.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A procedure stored as a parameterised playbook',
          code: `procedure = {
    "name": "deploy_to_staging",
    "trigger": "user says 'deploy to staging'",
    "inputs": {"branch": "main", "services": ["api", "worker"]},
    "steps": [
        "git fetch && git checkout {branch}",
        "run pytest -q (guard: must pass)",
        "build docker images for {services}",
        "push to staging registry",
        "kubectl rollout status deployment/{svc} for each svc",
        "run smoke tests against staging URL",
    ],
    "tools": ["git", "docker", "kubectl", "pytest"],
    "guards": ["tests must pass", "no uncommitted changes"],
    "success_criteria": "smoke tests green and rollout complete",
}`
        },
        { type: 'h3', text: 'Three forms of procedural memory' },
        {
          type: 'ul',
          items: [
            'Coded procedures — Python functions registered as agent tools; deterministic and fast, but inflexible.',
            'Structured playbooks — JSON/YAML recipes the agent interprets at runtime; flexible and inspectable.',
            'Natural-language playbooks — Markdown docs the agent retrieves and follows; cheapest to author, least reliable.'
          ]
        },
        {
          type: 'p',
          text: 'A robust agent uses all three: coded procedures for deterministic steps (run pytest, kubectl apply), structured playbooks for multi-step flows with branches (deploy, onboard a new service), and natural-language playbooks for fuzzy guidance ("when the user is upset, acknowledge before solving").'
        },
        { type: 'h3', text: 'Acquisition and refinement' },
        {
          type: 'ol',
          items: [
            'Authored: a human writes the procedure (the most reliable source).',
            'Discovered: the agent successfully completes a task and a curator sub-agent extracts the steps as a candidate procedure.',
            'Refined: each time a procedure is used, the agent notes what worked and what did not; minor improvements are merged, major changes go through review.'
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Procedures are a guardrail, not a script',
          text: 'A good procedure tells the agent what to do, in what order, with what guards — but it should still allow the agent to adapt when reality differs from the recipe. Hard-coding every branch leads to brittle playbooks that break on the first unexpected input.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'An on-call agent has a procedure "restart_unhealthy_pod" with steps: identify pod, check logs for OOM, evict, wait for restart, verify healthy. The first time it runs, the agent notices the pod was OOM-killed and adds a guard "if OOM, increase memory limit before restart". The procedure is updated and stored. Next time, the agent skips straight to the right fix.'
        }
      ],
      advantages: [
        'Reuses hard-won knowledge instead of re-deriving it each run.',
        'Makes agent behaviour consistent and auditable — procedures are inspectable.',
        'Allows human oversight: playbooks can be reviewed before the agent uses them.'
      ],
      disadvantages: [
        'Procedures go stale when the underlying systems change (new deploy tool, new test runner).',
        'Too rigid and the agent cannot adapt; too loose and it is no better than a prompt.',
        'Versioning and review of procedures adds operational overhead.'
      ],
      commonMistakes: [
        'Hard-coding every branch — brittle; reality will diverge.',
        'Not versioning procedures — when something breaks, you cannot roll back.',
        'Letting the agent silently update procedures — changes should go through review.',
        'Storing procedures as free text without structure — the agent will skip steps.'
      ],
      limitations: [
        'Only as good as the author (human or agent); a wrong procedure propagates failures.',
        'Hard to handle genuinely novel situations — procedures assume the world matches their preconditions.',
        'Cross-procedure conflicts (two procedures both triggered) need an explicit resolver.'
      ],
      relatedConcepts: ['Semantic Memory', 'Agent Planning', 'Task Decomposition', 'State Machines'],
      faq: [
        { q: 'Are procedures the same as tools?', a: 'No. Tools are individual capabilities (run a shell command, query a DB). Procedures are sequences of tool uses that accomplish a higher-level goal. Procedures call tools; tools do not call procedures.' },
        { q: 'Should the agent learn procedures on its own?', a: 'Cautiously. Discovery (extracting a candidate procedure after a successful run) is valuable, but auto-applying unreviewed procedures is risky. Use human-in-the-loop review for any procedure that touches production.' }
      ],
      summary:
        'Procedural memory stores reusable, parameterised recipes for recurring tasks — coded functions, structured playbooks, or natural-language guides. It is acquired by authoring, discovery, or refinement, and it makes agent behaviour consistent, auditable, and adaptive. The key design tension is rigidity versus flexibility: too rigid and the agent breaks on novel inputs, too loose and the procedure adds nothing.'
    },
    {
      id: 'retrieval-based-memory',
      title: 'Retrieval-Based Memory',
      subtitle: 'Memory accessed by similarity query rather than by address — RAG applied to the agent\'s own past.',
      tags: ['memory', 'retrieval', 'rag', 'embeddings', 'agents'],
      readingMinutes: 7,
      definition:
        'Retrieval-based memory is a store of text records (episodes, facts, documents) indexed by embedding vectors, accessed via similarity search rather than by key or address. The agent embeds the current query, finds the k most similar stored records, and injects them into the prompt as relevant context. It is the same mechanism as RAG, applied to the agent\'s own memory rather than to an external corpus.',
      whyItExists:
        'Structured queries (by user_id, by date) only find records you knew to look for. The agent often needs records that are relevant by meaning — "have we ever dealt with a hashlib bug before?" — without knowing in advance which keywords to search. Embedding-based retrieval exists because semantic similarity is the right access pattern for an agent whose queries are natural-language goals.',
      howItWorks: [
        {
          type: 'p',
          text: 'The pipeline has four stages. (1) Embed: convert each stored record\'s text (goal, summary, fact) into a vector using an embedding model. (2) Index: store vectors in a vector DB (Pinecone, Weaviate, pgvector) with metadata filters. (3) Query: at retrieval time, embed the current goal or sub-query. (4) Rank: return the top-k most similar records, optionally filtered by metadata (user_id, date range, outcome) and re-ranked by recency or importance.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Writing to and querying a retrieval-based memory store',
          code: `from openai import OpenAI
import numpy as np

client = OpenAI()

def embed(text: str) -> list[float]:
    r = client.embeddings.create(model="text-embedding-3-small", input=text)
    return r.data[0].embedding

# Write: embed and store with metadata
mem.add(
    id="ep_103",
    vector=embed("Fixed test_login; hashlib.scrypt bytes/str bug"),
    metadata={
        "user_id": "u_42",
        "kind": "episode",
        "outcome": "success",
        "ts": "2024-11-01T10:00:00Z",
    },
)

# Query: embed the current goal, filter by user, take top 5
q = embed("login test is failing")
hits = mem.query(
    vector=q,
    filter={"user_id": "u_42", "kind": "episode"},
    top_k=5,
)`
        },
        { type: 'h3', text: 'Hybrid retrieval: similarity + metadata + recency' },
        {
          type: 'p',
          text: 'Pure similarity search returns semantically close but possibly irrelevant records (a similar bug from a different user). Production systems combine signals: vector similarity for "what is this about", metadata filters for "is it about this user/project", and a recency boost so the agent prefers fresh memory. Some systems add a cross-encoder re-ranker for the top-50 candidates to improve precision.'
        },
        {
          type: 'table',
          headers: ['Signal', 'Captures', 'Typical weight'],
          rows: [
            ['Vector similarity', 'Semantic relevance', '0.5–0.7'],
            ['Metadata filter', 'Scope (user, project, kind)', 'Hard filter'],
            ['Recency boost', 'Freshness', '0.1–0.2 (exponential decay)'],
            ['Importance score', 'Author/curator flag', '0.1–0.2'],
            ['Re-ranker (cross-encoder)', 'Fine precision on top-k', 'Replaces raw similarity for top results']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Retrieved memory is candidates, not truth',
          text: 'The agent must treat retrieved records as evidence to consider, not as authoritative answers. A retrieved episode that says "the user likes tabs" may be wrong, stale, or about a different project. Always include timestamps and provenance, and let the agent reason about conflicts rather than blindly trusting the top hit.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A support agent receives "the API is returning 500s again". It embeds the query, retrieves the top-5 similar past episodes (filtered to this user\'s account), and finds one from last week: "Resolved 500s by restarting the worker pool after deploy". The agent injects this and asks: "We saw this last week after a deploy — did we just deploy? Should I restart the worker pool?" This is retrieval-based memory turning a fresh incident into a known pattern.'
        }
      ],
      advantages: [
        'Finds relevant memory without exact keyword match.',
        'Scales to millions of records — only the top-k enter the prompt.',
        'Combines naturally with metadata filters and recency boosts.'
      ],
      disadvantages: [
        'Approximate: the most relevant record may rank below k and be missed.',
        'Embedding model choice matters; a poor embedder returns poor hits regardless of storage.',
        'Cost: every write and read requires an embedding call.'
      ],
      commonMistakes: [
        'Using one giant vector store with no metadata filters — cross-user contamination.',
        'Forgetting to re-embed when the embedding model changes — old vectors are incompatible.',
        'Trusting the top-1 hit blindly; always retrieve top-k and let the agent reason.',
        'Storing raw text without a summary — retrieval returns noise instead of signal.'
      ],
      limitations: [
        'Vector indexes are approximate (ANN); recall < 100% by design.',
        'Hard to update a stored record\'s embedding cheaply when its text changes.',
        'No native support for temporal queries ("what changed last week?") — combine with metadata.'
      ],
      relatedConcepts: ['Episodic Memory', 'Semantic Memory', 'Memory Retrieval', 'Vector Databases'],
      faq: [
        { q: 'Is retrieval-based memory the same as RAG?', a: 'Same mechanism (embed + search + inject), different corpus. RAG retrieves from external documents; retrieval-based memory retrieves from the agent\'s own past. The engineering is identical.' },
        { q: 'How many records should I retrieve?', a: 'Start with k=5. Too few and you miss relevant context; too many and you flood the prompt. Tune by measuring downstream task accuracy on a held-out set.' }
      ],
      summary:
        'Retrieval-based memory accesses stored records by embedding similarity rather than by key. It uses the same pipeline as RAG — embed, index, query, rank — and is the right access pattern for an agent whose queries are natural-language goals. Production systems combine vector similarity with metadata filters, recency boosts, and cross-encoder re-ranking for precision.'
    },
    {
      id: 'agent-planning',
      title: 'Planning',
      subtitle: 'How an agent decides what to do, in what order, before doing it.',
      tags: ['planning', 'agents', 'reasoning', 'cognitive-architecture'],
      readingMinutes: 7,
      definition:
        'Planning is the process by which an agent, given a goal, produces an ordered sequence of actions (or a structured plan) intended to achieve that goal before it begins executing. A plan is the artifact; planning is the act of producing it.',
      whyItExists:
        'Without a plan, the agent acts greedily — it picks the next action based only on the current observation, with no notion of where it is going. Greedy action works for trivial tasks but fails on multi-step ones: the agent may take an action that looks good now but blocks the goal later (e.g., editing a file before reading it). Planning exists to align the next action with the eventual goal.',
      howItWorks: [
        { type: 'h3', text: 'The plan-act-observe loop' },
        {
          type: 'ol',
          items: [
            'Goal: receive the user\'s objective ("fix the failing test").',
            'Plan: generate an ordered list of sub-steps ("read test, reproduce, patch, rerun, verify").',
            'Act: execute the next step.',
            'Observe: capture the outcome (tool output, error message).',
            'Update: mark the step done, possibly revise the remaining plan.',
            'Loop until goal achieved or impossible.'
          ]
        },
        { type: 'h3', text: 'Three planning styles' },
        {
          type: 'ul',
          items: [
            'Plan-then-execute: produce the full plan up front, then execute it step-by-step. Fast and predictable, but brittle if any step\'s outcome surprises the agent.',
            'ReAct (interleaved): reason one step at a time, act, observe, then reason the next step. Adaptive but slower and more expensive (one LLM call per step).',
            'Tree-of-thought / plan-with-branches: generate multiple candidate next steps, evaluate each, pursue the best. Most thorough but most expensive.'
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A plan-then-execute skeleton',
          code: `plan = agent.plan(goal="Fix failing test_login")
# -> ["read tests/test_auth.py", "reproduce", "patch auth.py", "rerun", "verify"]

while plan and agent.status != "done":
    step = plan.pop(0)
    observation = agent.act(step)
    if observation.failed:
        # Replan from the current state — do not blindly continue
        plan = agent.replan(goal="Fix failing test_login",
                            state=agent.working_memory,
                            failed_step=step,
                            error=observation.error)
agent.verify_goal()`
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Plans are hypotheses, not contracts',
          text: 'A plan produced by an LLM is a guess about what sequence of actions will work. Treat it as a hypothesis to be tested by execution. If step 2 fails, do not blindly continue to step 3 — replan from the current state.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A user asks: "Refactor auth.py to use async/await and make sure tests still pass." A plan-then-execute agent produces: [read auth.py, read tests, rewrite each sync function as async, update test fixtures, run pytest, fix any failures, run pytest again, final review]. The agent executes step 1, observes the file, marks it done, and proceeds. If step 5 reveals three failing tests, the agent replans: insert a "fix each failing test" sub-plan before continuing.'
        }
      ],
      advantages: [
        'Aligns next action with eventual goal — avoids greedy traps.',
        'Makes agent behaviour inspectable and debuggable (you can read the plan).',
        'Allows parallelism when sub-steps are independent.'
      ],
      disadvantages: [
        'A bad plan wastes time even if execution is perfect.',
        'Plans go stale as soon as reality diverges — must replan, not just execute.',
        'Plan generation costs an LLM call; deeply nested planning gets expensive.'
      ],
      commonMistakes: [
        'Treating the plan as a contract and executing it blindly even when steps fail.',
        'Producing a plan with no verification step at the end — the agent declares success without checking.',
        'Plans that are too abstract ("fix the bug") to be actionable; each step should be a concrete action.',
        'Plans that are too granular ("move cursor to line 12") — the LLM is bad at low-level choreography.'
      ],
      limitations: [
        'Quality is bounded by the LLM\'s reasoning ability on the planning prompt.',
        'Hard to plan in domains with hidden state (the agent cannot observe everything it needs to).',
        'Long plans accumulate error — the further out, the less reliable the prediction.'
      ],
      relatedConcepts: ['Task Decomposition', 'Planning and Replanning', 'Goal Tracking', 'State Machines'],
      faq: [
        { q: 'Plan-then-execute or ReAct — which is better?', a: 'ReAct for exploratory or uncertain tasks (debugging, research); plan-then-execute for well-understood procedures (deploy, onboarding). Many production agents hybridise: plan the high-level structure, ReAct within each step.' },
        { q: 'How detailed should a plan be?', a: 'Each step should be a single, verifiable action: "read file X", "run command Y", "assert Z is true". If a step needs sub-steps, decompose it.' }
      ],
      summary:
        'Planning is the act of producing an ordered sequence of actions to achieve a goal before executing. Plans align the next action with the eventual goal, make behaviour inspectable, and enable parallelism. They are hypotheses, not contracts — the agent must observe outcomes and replan when reality diverges.'
    },
    {
      id: 'agent-task-decomposition',
      title: 'Task Decomposition',
      subtitle: 'Breaking a large goal into smaller, independently solvable sub-tasks.',
      tags: ['planning', 'decomposition', 'agents', 'reasoning'],
      readingMinutes: 6,
      definition:
        'Task decomposition is the process of breaking a high-level goal ("build a REST API for a todo app") into smaller sub-tasks ("define schema", "implement CRUD handlers", "write tests", "add auth") that are each tractable for the agent to solve. Good decomposition is the single biggest lever on agent success.',
      whyItExists:
        'LLMs make more reliable decisions on small, well-scoped problems than on large, fuzzy ones. Asking an agent to "build the app" in one shot produces shallow, error-prone work; asking it to "write the Pydantic model for a Todo with fields id, title, done" produces precise, correct output. Decomposition exists to shrink the decision surface to what the model can reliably handle.',
      howItWorks: [
        { type: 'h3', text: 'Decomposition strategies' },
        {
          type: 'ul',
          items: [
            'By stage: requirements → design → implement → test → deploy. Each stage is a sub-task with clear inputs and outputs.',
            'By component: for a multi-part system, decompose by component (frontend, backend, DB) and within each by feature.',
            'By dependency: identify what must be done first (the schema before the handlers) and produce a DAG of sub-tasks.',
            'By uncertainty: separate the well-understood parts (CRUD) from the uncertain parts (auth edge cases) and tackle them with different strategies.'
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Decomposing a goal into a sub-task DAG',
          code: `goal = "Build a FastAPI todo app with auth and tests"

subtasks = [
    {"id": "schema",   "task": "Define Todo Pydantic model",        "depends_on": []},
    {"id": "db",       "task": "Set up SQLite + SQLAlchemy models",  "depends_on": ["schema"]},
    {"id": "crud",     "task": "Implement CRUD endpoints",           "depends_on": ["db"]},
    {"id": "auth",     "task": "Add JWT auth middleware",            "depends_on": ["db"]},
    {"id": "tests",    "task": "Write pytest tests for endpoints",   "depends_on": ["crud", "auth"]},
    {"id": "docs",     "task": "Write README with run instructions", "depends_on": ["crud"]},
]
# 'crud' and 'auth' are independent -> can run in parallel
# 'tests' depends on both -> must wait`
        },
        { type: 'h3', text: 'Properties of good sub-tasks' },
        {
          type: 'ol',
          items: [
            'Single responsibility: each sub-task does one thing.',
            'Clear inputs and outputs: schema in, model code out.',
            'Verifiable: there is an objective way to check the sub-task is done (tests pass, file exists).',
            'Right-sized: small enough to be reliable, large enough to be meaningful (not "type one line").',
            'Independent where possible: parallelisable sub-tasks reduce wall-clock time.'
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Decomposition is recursive',
          text: 'A sub-task may itself need decomposition. "Implement CRUD endpoints" becomes "implement POST /todos, GET /todos/:id, PUT, DELETE". Recursion bottoms out when a sub-task is a single concrete action the agent can perform in one step. Without this bottoming-out, the agent produces plans that look detailed but are still too vague to execute.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A user asks: "Migrate our REST API from Flask to FastAPI." Decomposition yields: [inventory Flask routes, map each to FastAPI equivalent, set up dependency injection, port auth middleware, write integration tests against the new endpoints, run side-by-side in staging, switch traffic]. Each sub-task is independently verifiable, and the agent can hand off the test-writing sub-task to a specialist agent while it continues porting routes.'
        }
      ],
      advantages: [
        'Shrinks the decision surface to what the LLM can reliably handle.',
        'Produces verifiable intermediate artifacts (each sub-task has a check).',
        'Enables parallelism when sub-tasks are independent.'
      ],
      disadvantages: [
        'Over-decomposition produces trivial sub-tasks and high orchestration overhead.',
        'Bad decomposition creates hidden dependencies the agent misses.',
        'The decomposition itself is an LLM output and can be wrong.'
      ],
      commonMistakes: [
        'Treating decomposition as one-shot — revisit and re-decompose as you learn.',
        'Sub-tasks with fuzzy success criteria ("improve the API") — make them measurable.',
        'Ignoring dependencies — running tests before implementing handlers fails predictably.',
        'Decomposing only at the top level — recurse until sub-tasks are concrete actions.'
      ],
      limitations: [
        'Decomposition quality is bounded by the LLM\'s understanding of the domain.',
        'Cross-cutting concerns (logging, error handling) often span sub-tasks and are missed.',
        'Some problems are not decomposable (e.g., "make this design beautiful") and decomposition adds overhead without benefit.'
      ],
      relatedConcepts: ['Agent Planning', 'Sequential Workflows', 'Parallel Execution', 'Goal Tracking'],
      faq: [
        { q: 'How deep should decomposition go?', a: 'Until each sub-task is a single concrete action the agent can perform in one tool call or one short edit. If a sub-task still requires reasoning about multiple steps, decompose further.' },
        { q: 'Should decomposition be done by the same agent that executes?', a: 'Often a separate "planner" agent decomposes, and "worker" agents execute. This specialises each and makes the plan inspectable before execution begins.' }
      ],
      summary:
        'Task decomposition breaks a large goal into smaller, independently solvable sub-tasks. Good sub-tasks are single-responsibility, verifiable, right-sized, and dependency-aware. Decomposition is recursive — it bottoms out at concrete actions. It is the single biggest lever on agent reliability because it shrinks the decision surface to what the LLM can handle.'
    },
    {
      id: 'state-machines',
      title: 'State Machines',
      subtitle: 'Explicit states and transitions give the agent a backbone — and let you trace what it did and why.',
      tags: ['state-machines', 'agents', 'planning', 'control-flow'],
      readingMinutes: 8,
      definition:
        'A state machine for an agent is an explicit set of states (e.g., planning, acting, verifying, done) and the allowed transitions between them. The agent\'s runtime enforces that only valid transitions happen, which makes behaviour predictable, debuggable, and safe. The current state is part of the working memory; transitions are driven by observations.',
      whyItExists:
        'Without a state machine, an agent is a free-form loop: at every step the LLM can decide to do anything, including skipping verification, looping forever, or declaring success without checking. A state machine exists to constrain the agent to a sane control flow — you cannot skip from "planning" to "done" without passing through "acting" and "verifying".',
      howItWorks: [
        { type: 'h3', text: 'States, transitions, guards' },
        {
          type: 'p',
          text: 'A state machine definition lists the states, the allowed transitions, and the guards that must hold for a transition to fire. Example: transition acting → verifying requires guard "current step produced output". Transition verifying → done requires guard "all tests pass and goal met". Guards are checked by the runtime, not the LLM — the LLM cannot "talk its way past" a guard.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A minimal agent state machine with guards',
          code: `from enum import Enum

class State(Enum):
    PLANNING = "planning"
    ACTING   = "acting"
    VERIFYING = "verifying"
    REPLANNING = "replanning"
    DONE = "done"
    FAILED = "failed"

TRANSITIONS = {
    (State.PLANNING,  State.ACTING):     lambda s: bool(s.plan),
    (State.ACTING,    State.VERIFYING):  lambda s: s.last_action is not None,
    (State.VERIFYING, State.DONE):       lambda s: s.goal_met(),
    (State.VERIFYING, State.REPLANNING): lambda s: not s.goal_met() and s.tries < 3,
    (State.REPLANNING,State.ACTING):     lambda s: bool(s.plan),
    (State.VERIFYING, State.FAILED):     lambda s: s.tries >= 3,
}

def step(state, wm):
    guard = TRANSITIONS.get((state, wm.next_state))
    if guard is None:
        raise InvalidTransition(f"{state} -> {wm.next_state} not allowed")
    if not guard(wm):
        raise GuardFailed(f"{state} -> {wm.next_state} blocked by guard")
    return wm.next_state`
        },
        {
          type: 'interactive',
          componentId: 'agent-state-trace',
          caption: 'Step through a multi-turn agent run and watch the state machine advance: planning → acting → verifying → (replanning on failure) → done. Each step shows the state, the action taken, the observation, and the guard that allowed (or blocked) the transition.'
        },
        { type: 'h3', text: 'Why explicit beats implicit' },
        {
          type: 'p',
          text: 'You could let the LLM decide "what state am I in" each turn — and many toy agents do. The problem: the LLM can hallucinate a state. "I think I\'m done" is a common hallucination. An explicit state machine keeps state in the runtime, where it cannot be hallucinated. The LLM proposes actions; the runtime decides whether the proposal is valid given the current state.'
        },
        {
          type: 'table',
          headers: ['Pattern', 'States', 'When to use'],
          rows: [
            ['Linear', 'plan → act → verify → done', 'Simple, well-understood tasks'],
            ['Loop with cap', 'plan → act → verify → replan (max N) → done/failed', 'Debugging, fixing tasks where retry helps'],
            ['Branching', 'plan → (act_a | act_b) → merge → verify', 'Tasks with conditional branches'],
            ['Hierarchical', 'top-level state machine with sub-machines per state', 'Complex workflows with phases']
          ]
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A bug-fixing agent uses the loop-with-cap pattern: plan → act → verify → (if not goal_met: replan) → act → verify → … capped at 3 tries. On the third failed verification it transitions to FAILED and reports to the user. Without the cap, the agent could loop forever re-applying the same broken fix. Without the explicit verify state, the LLM might declare success without actually running the tests.'
        }
      ],
      advantages: [
        'Makes agent behaviour predictable — only allowed transitions can happen.',
        'Guards are checked in code, not by the LLM — no hallucinated state changes.',
        'Every run produces a traceable state sequence, which is gold for debugging.'
      ],
      disadvantages: [
        'Adds upfront design cost — you must enumerate states and transitions.',
        'Too rigid and the agent cannot handle situations the designer did not anticipate.',
        'Guard logic is code; bugs in guards produce silent failures.'
      ],
      commonMistakes: [
        'Letting the LLM set its own state — defeats the point; the runtime must own state.',
        'No terminal states — the agent loops forever.',
        'Guards that check "the LLM said so" instead of objective conditions (tests pass, file exists).',
        'One giant state machine for everything — decompose into hierarchical machines for complex workflows.'
      ],
      limitations: [
        'Cannot handle genuinely novel control flow without a code change.',
        'Designing the right states requires domain expertise and iteration.',
        'A state machine constrains the agent; if misdesigned, it constrains it into failure.'
      ],
      relatedConcepts: ['Agent Planning', 'Working Memory', 'Planning and Replanning', 'Agent Termination'],
      faq: [
        { q: 'Do I need a state machine for every agent?', a: 'No. Trivial single-step agents don\'t need one. Any agent that loops, branches, or has a verification step benefits — and any production agent does.' },
        { q: 'State machine vs workflow engine (Temporal, Airflow)?', a: 'Conceptually similar. A workflow engine is a distributed, persistent state machine with retries and observability. For long-running or multi-process agents, use a workflow engine; for in-process agents, a small hand-rolled machine is enough.' }
      ],
      summary:
        'A state machine gives an agent an explicit backbone of states and transitions, with guards checked in code. It prevents the LLM from skipping verification, looping forever, or hallucinating success. State lives in the runtime, not the LLM. Every run produces a traceable state sequence that is invaluable for debugging.'
    },
    {
      id: 'planning-and-replanning',
      title: 'Planning and Replanning',
      subtitle: 'A plan is a hypothesis. When reality disagrees, you replan — not blindly continue.',
      tags: ['planning', 'replanning', 'agents', 'error-recovery'],
      readingMinutes: 6,
      definition:
        'Replanning is the act of producing a new plan from the current state when the original plan has failed, become irrelevant, or been superseded by new information. It is the agent\'s response to the gap between what it expected and what it observed.',
      whyItExists:
        'Plans fail. The file the agent wanted to edit does not exist. The test reveals three more bugs. The user changes the requirement mid-task. An agent that blindly continues a failed plan will compound errors; an agent that gives up at the first failure is useless. Replanning exists to let the agent adapt: produce a fresh plan from the new reality and continue toward the goal.',
      howItWorks: [
        { type: 'h3', text: 'Triggers for replanning' },
        {
          type: 'ul',
          items: [
            'Action failure: a tool call returned an error (pytest failed, file not found).',
            'Goal drift: new information changes what "done" means (user clarifies mid-task).',
            'Plan invalidation: a step\'s precondition no longer holds (dependency was removed).',
            'Progress stall: N consecutive steps produced no useful change.',
            'Resource exhaustion: token budget, time budget, or try-count exceeded.'
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Replanning from current state on action failure',
          code: `def run(agent, goal):
    plan = agent.plan(goal, state=agent.working_memory)
    while plan:
        step = plan.pop(0)
        try:
            obs = agent.act(step)
        except ActionFailed as e:
            # Don't continue blindly — replan from current state
            plan = agent.replan(
                goal=goal,
                state=agent.working_memory,
                failed_step=step,
                error=str(e),
                prior_failures=agent.failure_log,
            )
            if plan is None:
                return agent.report_failure(goal, reason=str(e))
            continue
        agent.update_working_memory(step, obs)
    return agent.verify_goal()`
        },
        { type: 'h3', text: 'Replan vs retry vs escalate' },
        {
          type: 'table',
          headers: ['Situation', 'Right response'],
          rows: [
            ['Transient error (network blip)', 'Retry the same step, capped at 2-3 attempts'],
            ['Step was wrong approach', 'Replan from current state'],
            ['Goal itself is now wrong', 'Stop, ask the user to clarify, then replan'],
            ['Repeated failure on same step', 'Escalate: report failure, do not loop forever']
          ]
        },
        {
          type: 'callout',
          variant: 'danger',
          title: 'Beware the replan loop',
          text: 'Without a try-count cap, an agent can enter a replan loop: plan → fail → replan → fail → replan, burning tokens indefinitely. Always cap total replans (typically 3–5) and escalate to the user when exceeded. An agent that loops forever is worse than one that gives up.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A refactor agent\'s plan is [rename function foo to bar in auth.py, update callers, run tests]. Step 2 reveals foo is called from 14 files, not 3 — the original plan underestimated scope. The agent replans: [find all callers of foo, rename in each file in batches of 5, run tests after each batch]. The original plan is discarded; the new plan reflects the discovered reality.'
        }
      ],
      advantages: [
        'Lets the agent adapt to surprises — the hallmark of a useful agent.',
        'Prevents compounding errors from a bad initial plan.',
        'Makes the agent feel intelligent: it responds to new information, not just the original prompt.'
      ],
      disadvantages: [
        'Each replan is an LLM call — cost adds up under heavy replanning.',
        'Replanning can mask deeper issues (bad tool, bad prompt) by retrying instead of fixing.',
        'Replan loops are catastrophic without caps.'
      ],
      commonMistakes: [
        'Continuing a failed plan instead of replanning — the most common agent failure mode.',
        'Replanning without including the failure reason in the new prompt — the agent repeats the mistake.',
        'No try-count cap — infinite replan loops.',
        'Replanning when a simple retry would do — distinguish transient from structural failure.'
      ],
      limitations: [
        'Replanning cannot fix a fundamentally unsolvable problem; it just retries with variations.',
        'The agent may replan into a worse plan than the original — keep prior plans to fall back.',
        'Heavy replanning is a signal of a poorly-scoped goal or inadequate tools; root-cause it.'
      ],
      relatedConcepts: ['Agent Planning', 'State Machines', 'Agent Termination', 'Failure Recovery'],
      faq: [
        { q: 'When should I retry vs replan?', a: 'Retry on transient errors (network, rate-limit) where the same action might succeed. Replan on structural failures (wrong approach, missing precondition) where the same action will fail again.' },
        { q: 'Should the agent ask the user before replanning?', a: 'For minor replans (within the original goal), no — adapt silently. For goal-changing replans (the user\'s intent seems different), yes — confirm before pursuing a new interpretation.' }
      ],
      summary:
        'Replanning produces a fresh plan from the current state when the original fails or becomes irrelevant. It is what makes an agent adaptive rather than brittle. Triggers include action failure, goal drift, plan invalidation, and progress stalls. Always cap replan attempts to avoid infinite loops, and distinguish retry (transient) from replan (structural).'
    },
    {
      id: 'goal-tracking',
      title: 'Goal Tracking',
      subtitle: 'How the agent knows whether it is done — and how to avoid declaring success prematurely.',
      tags: ['goals', 'verification', 'agents', 'planning'],
      readingMinutes: 6,
      definition:
        'Goal tracking is the agent\'s ongoing assessment of whether the original objective has been met. It maintains a structured representation of the goal (with verifiable success criteria) and updates a progress signal after each action, so the agent knows when to stop and when to keep going.',
      whyItExists:
        'An agent without goal tracking has two failure modes: it stops too early (declares success without checking) or it never stops (loops forever polishing). Both are catastrophic in production. Goal tracking exists to give the agent an objective signal for "am I done yet", independent of the LLM\'s self-assessment, which is unreliable.',
      howItWorks: [
        { type: 'h3', text: 'Define the goal as verifiable criteria' },
        {
          type: 'p',
          text: 'A vague goal ("make the tests pass") is un-trackable. A verifiable goal is "all tests in tests/ pass when invoked with pytest -q, exit code 0, zero failures". The success criteria must be checkable by code (a command, an assertion, a query), not by the LLM opining. The agent\'s goal tracker runs the check after each step.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A goal with executable success criteria',
          code: `class Goal:
    def __init__(self, description: str, check: Callable[[], bool]):
        self.description = description
        self.check = check              # must be a code function, not LLM judgment

goal = Goal(
    description="Fix test_login so the full suite passes",
    check=lambda: subprocess.run(["pytest", "-q"], check=False).returncode == 0,
)

# After each agent step:
if goal.check():
    agent.state = State.DONE
else:
    agent.state = State.ACTING   # keep going`
        },
        { type: 'h3', text: 'Progress signals' },
        {
          type: 'ul',
          items: [
            'Binary: goal_met() returns True or False. Simplest, but no sense of how close.',
            'Fractional: 4 of 7 sub-tasks done; 18 of 20 tests passing. Useful for UI and for deciding whether to continue.',
            'Distance-to-goal: an LLM-judge scores 0–1 how close the current state is to the goal. Useful when no executable check exists, but introduces LLM unreliability.'
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'LLM-judged success is unreliable',
          text: 'Asking the LLM "are we done?" produces false positives — the model is biased to agree with the goal it was given. Prefer executable checks (run the tests, query the DB). Use an LLM judge only as a fallback, and cross-check with a second model or human review for high-stakes goals.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A data-cleaning agent has goal: "every row in customers.csv has a non-null email matching the regex, and the file parses with pandas". The tracker runs this check after every batch edit. After batch 3, the check fails (12 rows still null). After batch 4, it passes. The agent transitions to verifying, runs the check one more time, and declares done. Without the check, the agent might have stopped after batch 3 (LLM thinks it looks done) or kept going past batch 4 (no termination signal).'
        }
      ],
      advantages: [
        'Gives the agent an objective termination signal — no premature success.',
        'Provides progress feedback to the user (4/7 sub-tasks done).',
        'Executable checks double as regression tests for the task itself.'
      ],
      disadvantages: [
        'Defining good success criteria is hard for fuzzy goals ("make the UI better").',
        'Over-engineered criteria add maintenance burden and may not match user intent.',
        'LLM-judged criteria inherit LLM unreliability.'
      ],
      commonMistakes: [
        'No success criteria at all — the agent loops or stops arbitrarily.',
        'Criteria that are LLM-judged only — false positives.',
        'Criteria that match the literal goal but miss the spirit (e.g., "tests pass" but the agent disabled the failing test).',
        'No anti-criteria (e.g., "must not disable tests") — agents game the check.'
      ],
      limitations: [
        'Cannot capture subjective goals ("make it more polished") without an LLM judge.',
        'Criteria can be gamed; include anti-criteria to prevent gaming.',
        'A passing check does not mean the user is satisfied — they may have meant something else.'
      ],
      relatedConcepts: ['Agent Termination', 'Agent Planning', 'State Machines', 'Failure Recovery'],
      faq: [
        { q: 'What if I cannot express success as a command?', a: 'Use an LLM judge with a clear rubric, and require a high confidence threshold. For high-stakes goals, add a human-confirmation step before declaring done.' },
        { q: 'How do I stop the agent gaming the criteria?', a: 'Add anti-criteria: "tests pass AND no test was deleted or disabled AND no test was modified to be a no-op". Make the criteria tamper-resistant by checking the test files\' diff.' }
      ],
      summary:
        'Goal tracking gives the agent an objective signal for "am I done". The goal must be expressed as verifiable success criteria, ideally executable by code rather than judged by the LLM. Progress signals (binary, fractional, distance-to-goal) drive the agent\'s termination decision. Add anti-criteria to prevent gaming, and use LLM judges only as a fallback.'
    },
    {
      id: 'context-window-limits',
      title: 'Context-Window Limits',
      subtitle: 'The token budget is finite. Managing it is a core agent-engineering skill.',
      tags: ['context-window', 'tokens', 'memory', 'agents'],
      readingMinutes: 7,
      definition:
        'The context window is the maximum number of tokens an LLM can process in a single call — combining system prompt, conversation history, retrieved memory, tool outputs, and the model\'s response. Every agent must manage this budget or it will eventually hit the limit and fail.',
      whyItExists:
        'Even with 128k–1M token windows, agents run out of context. Long sessions accumulate history; tool outputs (file contents, API responses) are large; retrieved memory adds tokens. Without explicit management, the agent silently degrades (drops context, hallucinates) or hard-fails (token-limit error).',
      howItWorks: [
        {
          type: 'callout',
          variant: 'info',
          title: 'What counts against the budget',
          text: 'All of: system prompt + conversation history + tool definitions + retrieved memory + tool outputs from this turn + reserved space for the model\'s response. A 128k window with a 30-turn history, five tool results averaging 2k tokens each, and a 4k response budget may have only 60k tokens left — less than it looks.'
        },
        { type: 'h3', text: 'Budget allocation' },
        {
          type: 'p',
          text: 'Treat the context window as a budget you allocate: reserve N tokens for the system prompt (fixed), M for the response, and split the rest between history, retrieved memory, and current tool outputs. When the total exceeds the window, shed load in priority order: summarise old history, drop low-relevance retrieved memory, truncate verbose tool outputs.'
        },
        {
          type: 'table',
          headers: ['Component', 'Typical share', 'When to shed'],
          rows: [
            ['System prompt', '5–10% (fixed)', 'Never — non-negotiable'],
            ['Response budget', '10–20%', 'Lower only if you can tolerate shorter responses'],
            ['Conversation history', '30–60%', 'Summarise oldest turns first'],
            ['Retrieved memory', '10–20%', 'Drop lowest-similarity items'],
            ['Tool outputs (current)', '10–30%', 'Truncate to first/last N lines, or extract key fields']
          ]
        },
        { type: 'h3', text: 'Strategies for staying under budget' },
        {
          type: 'ol',
          items: [
            'Summarise old history periodically — replace turns 1..k with a single summary message.',
            'Compact tool outputs — replace a 5k-token log with "3 errors found: …" extracted by a smaller model.',
            'Selective retrieval — retrieve top-3 memories, not top-10, when budget is tight.',
            'Offload to working memory — keep state in a structured scratchpad rather than re-stating it each turn.',
            'Sub-agent delegation — hand a long sub-task to a sub-agent with a fresh context window, return only the summary.'
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Token budgeting before sending the prompt',
          code: `def build_prompt(state, budget=128_000, response_reserve=4_000):
    parts = []
    parts.append(state.system_prompt)                       # fixed
    parts.append(render_working_memory(state.wm))           # small, structured
    parts.append(render_retrieved(state.memory, top_k=3))   # capped

    # Spend the rest on history, oldest first summarised
    remaining = budget - response_reserve - sum_tokens(parts)
    history = state.history
    while token_count(history) > remaining and len(history) > 4:
        # Summarise the oldest half, keep the rest verbatim
        old, history = history[:len(history)//2], history[len(history)//2:]
        summary = summarise(old)
        parts.append(summary)
    parts.extend(history)
    return parts`
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A coding agent runs for 50 turns. By turn 30, history is 60k tokens and tool outputs add 20k — only 48k left in a 128k window. The agent triggers summarisation: turns 1–20 become a 2k summary ("prior work: refactored auth.py, added 4 tests, fixed login bug"). History drops to 22k; budget is healthy again. The agent continues for another 20 turns before summarising once more.'
        }
      ],
      advantages: [
        'Explicit budgeting prevents silent failures and hard errors.',
        'Forces clean separation between system, history, and tool output — better engineering.',
        'Lets you predict cost — tokens in = cost in.'
      ],
      disadvantages: [
        'Summarisation loses information; summarisation errors compound over time.',
        'Budgeting logic adds complexity to the agent runtime.',
        'Aggressive truncation can drop the very context the agent needed.'
      ],
      commonMistakes: [
        'Assuming the model\'s nominal window is fully usable — always reserve for response and overhead.',
        'Naive "drop oldest" truncation that loses the system message or early critical instructions.',
        'Stuffing every retrieved memory into the prompt without a relevance cutoff.',
        'Letting one huge tool output (a 50k-line log) crowd out everything else.'
      ],
      limitations: [
        'Even perfect budgeting cannot recover information lost to summarisation.',
        'Long-running agents eventually need external memory regardless of window size.',
        'Sub-agent delegation adds latency and coordination overhead.'
      ],
      relatedConcepts: ['Conversation History', 'Memory Retrieval', 'Working Memory', 'Agent Termination'],
      faq: [
        { q: 'Will bigger context windows make this irrelevant?', a: 'Partially. A 1M-token window handles more, but cost scales with input tokens, so long contexts are expensive. And summarisation is still valuable for cost control even when it isn\'t strictly necessary for fitting.' },
        { q: 'How do I know my token count before sending?', a: 'Use the model\'s tokenizer (tiktoken for OpenAI, the model\'s own tokenizer for others). Always count before sending; do not rely on character estimates.' }
      ],
      summary:
        'The context window is a finite budget shared across system prompt, history, retrieved memory, tool outputs, and response. Allocate explicitly, reserve for response, and shed load in priority order when over budget: summarise old history, drop low-relevance memory, truncate verbose tool outputs. Even million-token windows need management because cost scales with input.'
    },
    {
      id: 'memory-retrieval',
      title: 'Memory Retrieval',
      subtitle: 'Having memory is useless if you cannot find the right fact at the right time.',
      tags: ['retrieval', 'memory', 'rag', 'agents'],
      readingMinutes: 7,
      definition:
        'Memory retrieval is the process of selecting, from a large memory store, the small subset of records that are relevant to the current task and injecting them into the prompt. It is the read side of memory — distinct from storage (the write side) and from the prompt-construction step that assembles the final context.',
      whyItExists:
        'An agent with a million stored memories cannot put them all in the prompt. Even if it could, the LLM would be overwhelmed — long contexts reduce attention quality ("lost in the middle" effects). Retrieval exists to surface the 3–10 records that matter right now, in a form the LLM can use, while leaving the rest in the store.',
      howItWorks: [
        { type: 'h3', text: 'The retrieval pipeline' },
        {
          type: 'ol',
          items: [
            'Query construction: turn the current goal/sub-goal into one or more retrieval queries. May be the raw goal text, an LLM-generated set of sub-queries, or a structured filter (user_id, date range).',
            'Candidate generation: run the queries against the store (vector similarity, keyword, structured query) to get top-N candidates, typically 20–50.',
            'Filtering: apply hard constraints (must be this user_id, must be after this date) to remove irrelevant candidates.',
            'Re-ranking: score the survivors by a finer model (cross-encoder, recency-weighted similarity) and take the top-k (3–10) for the prompt.',
            'Formatting: render the top-k into a clean "relevant memory" block with timestamps and provenance, distinct from the conversation history.'
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A multi-signal retrieval pipeline',
          code: `def retrieve(goal: str, user_id: str, k: int = 5):
    # 1. Multi-query expansion: LLM rewrites the goal as 3 sub-queries
    sub_queries = llm.expand(goal, n=3)

    # 2. Candidate generation: vector search per sub-query, union results
    candidates = []
    for q in sub_queries:
        candidates += vec_db.query(embed(q), top_k=20)
    candidates = dedupe(candidates)

    # 3. Hard filter: this user only, last 90 days
    candidates = [c for c in candidates
                  if c.metadata["user_id"] == user_id
                  and age_days(c) <= 90]

    # 4. Re-rank: cross-encoder + recency boost
    scored = [(c, rerank_score(goal, c, recency_weight=0.15)) for c in candidates]
    scored.sort(key=lambda x: -x[1])

    # 5. Top-k for the prompt
    return scored[:k]`
        },
        { type: 'h3', text: 'Query construction is the hard part' },
        {
          type: 'p',
          text: 'The quality of retrieval is dominated by the quality of the query. A literal goal ("fix login bug") may miss relevant episodes tagged "auth", "password", "session". Techniques: (1) multi-query expansion — ask the LLM to rewrite the goal as 3–5 paraphrases; (2) keyword extraction — pull named entities and add them as filters; (3) hierarchical retrieval — first retrieve by topic, then by detail within the topic.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Retrieval is a model, not a lookup',
          text: 'Treat retrieval as a small ML system with its own evaluation. Measure recall@k on a held-out set of (query, relevant-record) pairs. If your agent behaves poorly on memory-sensitive tasks, the cause is usually retrieval quality, not the LLM.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A user says "the deploy script is broken again". A naive retrieval embeds this query and finds episodes literally about "deploy script broken". A multi-query expansion produces ["deploy script failure", "CI/CD pipeline error", "deploy playbook issues"], retrieving episodes about a CI/CD failure from last week that did not contain the words "deploy script" but is exactly the relevant precedent. Multi-query retrieval finds the right memory; single-query does not.'
        }
      ],
      advantages: [
        'Surfaces relevant memory without flooding the prompt.',
        'Decouples memory size from prompt size — the store can grow without bound.',
        'Composable: multiple signals (similarity, recency, importance) combine cleanly.'
      ],
      disadvantages: [
        'Retrieval quality is the bottleneck — bad retrieval = bad agent, regardless of LLM.',
        'Each retrieval adds an embedding call and possibly a re-ranker call — latency and cost.',
        'Tuning (k, top-N, weights) is empirical and task-specific.'
      ],
      commonMistakes: [
        'Single-query retrieval on the raw goal — misses paraphrased memories.',
        'No re-ranker — top-k by raw similarity is often noisy.',
        'No metadata filter — cross-user or stale memories pollute the results.',
        'Stuffing top-20 into the prompt — context bloats and quality drops.'
      ],
      limitations: [
        'Approximate: the right memory may not be in the top-k.',
        'Slow queries (sub-second is achievable; multi-second hurts UX).',
        'Hard to retrieve negations ("facts that contradict X") with standard similarity search.'
      ],
      relatedConcepts: ['Retrieval-Based Memory', 'Episodic Memory', 'Semantic Memory', 'Context-Window Limits'],
      faq: [
        { q: 'How many memories should I retrieve?', a: 'Start with k=5. Measure task accuracy on a held-out set as you vary k. Diminishing returns usually hit by k=10; beyond that, you are spending tokens for noise.' },
        { q: 'Cross-encoder re-ranker — worth it?', a: 'Almost always yes for memory-sensitive tasks. A cross-encoder is slower than bi-encoder similarity but much more accurate on the top candidates. Run bi-encoder for top-50, cross-encoder for top-5.' }
      ],
      summary:
        'Memory retrieval is the read-side pipeline that selects, from a large store, the few records relevant to the current task. The pipeline is query-construction → candidate generation → filtering → re-ranking → formatting. Query construction dominates quality; use multi-query expansion and metadata filters. Treat retrieval as a small ML system with its own evaluation — it is usually the bottleneck on memory-sensitive tasks.'
    },
    {
      id: 'agent-termination',
      title: 'Agent Termination',
      subtitle: 'Knowing when to stop — and how to stop safely — is as important as knowing what to do.',
      tags: ['termination', 'agents', 'safety', 'control-flow'],
      readingMinutes: 6,
      definition:
        'Agent termination is the set of conditions and procedures by which an agent stops running. It includes success termination (goal met), failure termination (goal impossible or budget exhausted), and the cleanup steps (reporting, archiving, releasing resources) that must run before the process exits.',
      whyItExists:
        'An agent that cannot terminate cleanly is a production hazard. It loops forever burning tokens. It declares success without checking. It exits mid-action leaving tools in bad state. Termination logic exists to ensure every agent run ends in a known, safe, reported state — success, failure, or escalated — regardless of what happened in between.',
      howItWorks: [
        { type: 'h3', text: 'Termination conditions' },
        {
          type: 'ul',
          items: [
            'Success: goal_met() returns True (executable check) — transition to DONE.',
            'Failure — impossible: agent detects the goal cannot be achieved (file does not exist and cannot be created; missing permission).',
            'Failure — budget exhausted: token, time, or try-count cap exceeded.',
            'Failure — invalid state: state machine reaches an unrecoverable state (e.g., FAILED after N replans).',
            'External cancellation: user or supervisor cancels the run.'
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A termination function with all conditions',
          code: `def should_terminate(agent) -> tuple[bool, str]:
    if agent.goal.check():
        return True, "success"
    if agent.tries >= agent.max_tries:
        return True, "max_tries_exceeded"
    if agent.tokens_used >= agent.token_budget:
        return True, "token_budget_exhausted"
    if time.time() - agent.start_time > agent.time_budget:
        return True, "time_budget_exhausted"
    if agent.cancelled:
        return True, "cancelled"
    if agent.state == State.FAILED:
        return True, "unrecoverable_state"
    return False, ""`
        },
        { type: 'h3', text: 'Cleanup is part of termination' },
        {
          type: 'p',
          text: 'Termination is not just "stop running". A clean termination: (1) writes a final report (success or failure, with reason and evidence), (2) archives the working memory and episodic log, (3) releases resources (file handles, DB connections, locks), (4) notifies the supervisor or user, (5) on failure, suggests next steps. Skipping cleanup leaves the system in an inconsistent state and the user without feedback.'
        },
        {
          type: 'callout',
          variant: 'danger',
          title: 'No termination logic = infinite loop',
          text: 'The most common production agent failure is not "the agent did the wrong thing" — it is "the agent did not stop". Every agent must have hard caps (max tries, max tokens, max wall-clock) that terminate it regardless of what the LLM thinks. The LLM cannot be trusted to terminate itself.'
        },
        {
          type: 'table',
          headers: ['Termination type', 'User-facing message', 'What to archive'],
          rows: [
            ['Success', '"Done: <goal>. Evidence: <test output>"', 'Full episode, working memory'],
            ['Max tries', '"Tried N times, could not complete. Last error: …"', 'Episode with failure trace'],
            ['Budget exhausted', '"Ran out of token/time budget at step M of N"', 'Partial progress, consumption log'],
            ['Cancelled', '"Cancelled by user at step M"', 'Partial progress, cancellation point'],
            ['Unrecoverable', '"Cannot proceed: <reason>. Suggested next step: …"', 'Episode with state at failure']
          ]
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A code-fixing agent is given max_tries=5 and token_budget=200k. On try 4, it applies a fix; tests still fail. On try 5, it applies another fix; tests still fail. should_terminate returns (True, "max_tries_exceeded"). The agent cleans up: writes a report ("Could not fix test_login in 5 attempts. Last hypothesis: hashlib bytes/str. Suggested next: check user fixture."), archives the episode with the failure trace, and exits. The user gets actionable feedback; resources are released; the system is in a known state.'
        }
      ],
      advantages: [
        'Prevents infinite loops and runaway cost.',
        'Guarantees a known end state — no orphan processes or stuck sessions.',
        'Provides actionable feedback to the user on every termination, including failures.'
      ],
      disadvantages: [
        'Caps can terminate an agent that would have succeeded with one more try — tune carefully.',
        'Cleanup logic adds code and is easy to forget under failure paths.',
        'Premature termination can frustrate users who expected more effort.'
      ],
      commonMistakes: [
        'No hard caps — relying on the LLM to decide when to stop. It will not.',
        'Cleanup only on success — failures leave resources dangling.',
        'Failure reports without actionable next steps — user is stuck.',
        'Caps set too tight (3 tries) or too loose (100 tries) — both bad; tune empirically.'
      ],
      limitations: [
        'A cap is a heuristic; it cannot tell whether success was 1 step away.',
        'External cancellation may arrive mid-action; the cleanup path must handle partial state.',
        'In distributed multi-agent systems, termination must propagate to all sub-agents — non-trivial.'
      ],
      relatedConcepts: ['Goal Tracking', 'State Machines', 'Planning and Replanning', 'Failure Recovery'],
      faq: [
        { q: 'What are reasonable caps?', a: 'max_tries: 3–5 for tight tasks, up to 10 for exploratory ones. Token budget: 2–5× the typical successful run. Time budget: 2–3× the typical successful run. Always lean tighter rather than looser — you can always raise them.' },
        { q: 'Should the agent ask the user before terminating on a cap?', a: 'For budget caps, no — terminate and report. For "I think I cannot do this" detection, yes — escalate and let the user decide whether to retry with different parameters.' }
      ],
      summary:
        'Agent termination is the set of conditions and procedures by which an agent stops. Every agent needs hard caps (max tries, token budget, time budget) that override the LLM, plus executable goal-met checks. Cleanup — final report, archive, resource release, user notification — is part of termination, not optional. Without termination logic, agents loop forever; with it, every run ends in a known, safe, reported state.'
    }
  ]
}
