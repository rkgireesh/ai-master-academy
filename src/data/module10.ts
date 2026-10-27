import type { Module } from './types'

export const module10: Module = {
  id: 'm10',
  index: 10,
  title: 'Multi-Agent Systems',
  shortTitle: 'Multi-Agent Systems',
  description:
    'One agent can plan, act, and verify. But no single agent is good at everything. This module covers multi-agent systems — when to use them, the supervisor/worker architecture, sequential vs parallel execution, specialist agents, communication, shared state with schema validation, task delegation, conflict resolution, failure recovery, and the cost/latency trade-offs that decide whether multi-agent is worth it for your problem.',
  level: 'Advanced',
  icon: 'Network',
  color: 'from-indigo-500 to-purple-500',
  quizId: 'q10',
  lessons: [
    {
      id: 'what-is-multi-agent',
      title: 'What Are Multi-Agent Systems?',
      subtitle: 'Multiple LLM agents coordinated to solve a task no single agent should tackle alone.',
      tags: ['multi-agent', 'agents', 'architecture', 'orchestration'],
      readingMinutes: 7,
      definition:
        'A multi-agent system (MAS) is a software architecture in which two or more LLM-based agents, each with its own role, prompt, and tools, collaborate on a task by exchanging messages or by reading and writing to a shared state. A supervisor (or orchestration layer) decides which agent acts when, and how their outputs combine.',
      whyItExists:
        'A single agent given a complex task faces three problems: context bloat (everything in one prompt), role confusion (one prompt tries to be researcher, writer, and critic), and brittle single-points-of-failure. Multi-agent systems exist to split work along role boundaries so each agent has a focused prompt, a clean context, and a verifiable sub-goal. This trades orchestration complexity for specialization, reliability, and parallelism.',
      howItWorks: [
        { type: 'h3', text: 'Components of a multi-agent system' },
        {
          type: 'ul',
          items: [
            'Agents — individual LLM-based workers, each with its own system prompt, tools, and memory.',
            'Roles — what each agent is responsible for (researcher, analyst, writer, verifier).',
            'Orchestrator — a supervisor agent or graph that decides which agent runs next and how outputs combine.',
            'Shared state — a structured store agents read from and write to; the substrate of coordination.',
            'Communication protocol — the message format and channels through which agents exchange information.'
          ]
        },
        { type: 'h3', text: 'A simple example' },
        {
          type: 'p',
          text: 'A "research report" task is split into three agents. The Research agent gathers sources. The Analysis agent extracts key findings. The Writing agent composes the report. A supervisor calls them in sequence: research → analysis → writing. Each agent has a focused prompt ("you are a research agent; return URLs and quotes") and a clean context window. The supervisor assembles the final report.'
        },
        {
          type: 'table',
          headers: ['Pattern', 'How agents coordinate', 'Best for'],
          rows: [
            ['Supervisor-worker', 'A supervisor delegates sub-tasks to workers and aggregates results', 'Mixed-skill tasks with clear sub-goals'],
            ['Pipeline (sequential)', 'Each agent\'s output feeds the next', 'Linear workflows (research → draft → review)'],
            ['Peer-to-peer', 'Agents message each other directly', 'Debate, negotiation, brainstorming'],
            ['Hierarchical', 'Supervisors supervise sub-supervisors', 'Large organisations of agents']
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Multi-agent vs one agent with many tools',
          text: 'A single agent with many tools is NOT a multi-agent system — it is one agent that can call tools. The hallmark of multi-agent is multiple distinct LLM instances, each with its own prompt and context, coordinating through a supervisor or shared state. If you only need tool variety, stay single-agent; multi-agent adds orchestration cost.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A customer-support system has a Triage agent (routes the ticket), a Billing agent (handles refunds), a Technical agent (debugs issues), and an Escalation agent (handles unhappy customers). The Triage agent reads the ticket, classifies it, and hands it to the right specialist. Each specialist has a focused prompt and access only to its own tools (the Billing agent cannot reset passwords). This is cleaner and safer than one agent with all tools.'
        }
      ],
      advantages: [
        'Specialization — each agent has a focused prompt and tools, improving output quality.',
        'Isolation — failures in one agent do not corrupt the others\' context.',
        'Parallelism — independent sub-tasks run concurrently, reducing wall-clock time.',
        'Auditability — the message log between agents is an explicit trace of decisions.'
      ],
      disadvantages: [
        'Orchestration complexity — coordination logic, shared state, and error handling multiply.',
        'Higher cost — multiple LLM calls per task instead of one.',
        'Higher latency for sequential patterns — each hop is an LLM call.'
      ],
      commonMistakes: [
        'Using multi-agent where a single agent with good prompting would do — premature distribution.',
        'No clear role boundaries — agents overlap and contradict each other.',
        'Shared state without schema validation — one agent writes bad data, the next crashes.',
        'Treating "more agents" as "better" — every agent adds orchestration tax.'
      ],
      limitations: [
        'Coordination overhead can exceed the benefit on simple tasks.',
        'Debugging a 5-agent cascade is much harder than debugging one agent.',
        'Cost grows roughly linearly with the number of agents per task.'
      ],
      relatedConcepts: ['Supervisor-Agent Architecture', 'Specialist Agents', 'Shared State', 'Agent Communication'],
      faq: [
        { q: 'Is a multi-agent system just a fancy chain of LLM calls?', a: 'It can be (a pipeline is essentially that), but the supervisor pattern adds dynamic routing: the supervisor decides which agent runs next based on the current state, not a fixed sequence. That is the meaningful difference from a static chain.' },
        { q: 'Do multi-agent systems outperform single-agent ones?', a: 'On complex tasks with distinct sub-skills, yes — measurably. On simple tasks, no — the overhead dominates. Choose based on task complexity, not fashion.' }
      ],
      summary:
        'A multi-agent system coordinates multiple LLM-based agents, each with its own role, prompt, and tools, to solve a task too complex for a single agent. The components are agents, roles, an orchestrator, shared state, and a communication protocol. The benefit is specialization, isolation, and parallelism; the cost is orchestration complexity, higher token spend, and harder debugging.'
    },
    {
      id: 'when-multiple-agents-useful',
      title: 'When Multiple Agents Are Useful',
      subtitle: 'A decision framework: when multi-agent pays off, and when it is premature.',
      tags: ['multi-agent', 'decision-framework', 'architecture', 'agents'],
      readingMinutes: 6,
      definition:
        'Multiple agents are useful when a task has distinct sub-skills that do not share context, when parallelism produces real wall-clock gains, or when role isolation improves reliability. They are not useful when a single well-prompted agent with the right tools would do the job — in that case, multi-agent is pure overhead.',
      whyItExists:
        'Multi-agent is fashionable, which means many teams adopt it for tasks where it adds cost without benefit. A decision framework exists to make the trade-off explicit: specialization benefit versus orchestration cost. Without one, teams ship multi-agent demos that never reach production because cost and latency are unacceptable.',
      howItWorks: [
        { type: 'h3', text: 'Use multi-agent when…' },
        {
          type: 'ul',
          items: [
            'Distinct sub-skills: the task needs research, analysis, and writing — different prompts and tools per role, and a single prompt doing all three performs worse.',
            'Parallelisable sub-tasks: three independent research queries can run in parallel and save wall-clock time.',
            'Role isolation matters: a "critic" agent should not be biased by being the same instance as the "writer" agent.',
            'Different model tiers: a cheap model triages, an expensive model reasons; routing by role saves cost.',
            'Compliance boundaries: the Billing agent must not access password-reset tools; role separation enforces this.'
          ]
        },
        { type: 'h3', text: 'Stay single-agent when…' },
        {
          type: 'ul',
          items: [
            'One skill, one task: a code-completion agent does not benefit from being split.',
            'Sequential dependency only, no parallelism: a chain of LLM calls is just a chain — no need for an orchestrator.',
            'Latency-sensitive: every agent hop adds an LLM call; if you need <2s response, multi-agent rarely fits.',
            'Cost-sensitive: 5 agents × 1000 tokens = 5× the cost of one agent doing the same work.',
            'Tight coupling: sub-tasks share state so heavily that the shared-state overhead exceeds the specialization benefit.'
          ]
        },
        {
          type: 'table',
          headers: ['Signal', 'Lean single-agent', 'Lean multi-agent'],
          rows: [
            ['Number of distinct skills', '1–2', '3+'],
            ['Parallelism available', 'None', 'Independent sub-tasks'],
            ['Latency budget', '<2s', '5s+ acceptable'],
            ['Cost sensitivity', 'High', 'Moderate'],
            ['Need for role isolation', 'Low', 'High (compliance, bias)'],
            ['State coupling between steps', 'Tight', 'Loose']
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Start single, split when you hit a wall',
          text: 'Begin with one well-prompted agent and good tools. Split into multi-agent only when you measure a specific failure (role confusion in the prompt, latency that parallelism would fix, compliance that needs isolation). Premature multi-agent is the most common waste in this space.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'Good multi-agent fit: a research-report pipeline (research → analysis → writing → verification) with distinct skills, parallel research, and a need for an independent verifier. Bad fit: a code-completion agent in an IDE — one skill, latency-critical, tightly coupled. The first ships multi-agent; the second stays single-agent with strong tools.'
        }
      ],
      advantages: [
        'Forces explicit thinking about when specialization pays off.',
        'Prevents premature adoption — saves cost and complexity.',
        'Makes the trade-off (specialization vs orchestration) visible to stakeholders.'
      ],
      disadvantages: [
        'The signals are heuristic; borderline cases need experimentation.',
        'Latency and cost budgets change with model improvements — revisit periodically.',
        'Some tasks have hidden sub-skills that only emerge after building a single agent and watching it fail.'
      ],
      commonMistakes: [
        'Defaulting to multi-agent because the demo looks impressive.',
        'Defaulting to single-agent because multi-agent seems hard, then hitting role-confusion failures.',
        'Not measuring — the decision should be driven by metrics, not vibes.',
        'Forgetting that latency and cost change: a 2023 no-go may be a 2025 yes.'
      ],
      limitations: [
        'The framework is qualitative; the only real answer is "build both, measure".',
        'Hybrid cases (some sub-tasks parallel, some sequential) need careful architecture.',
        'Team skill matters — multi-agent needs stronger engineering than single-agent.'
      ],
      relatedConcepts: ['What Are Multi-Agent Systems?', 'Supervisor-Agent Architecture', 'Cost and Latency Trade-offs'],
      faq: [
        { q: 'Single best signal for multi-agent?', a: 'Distinct sub-skills that conflict in one prompt. If you find yourself writing "you are a researcher and an analyst and a writer" and the model underperforms, that is the clearest signal to split.' },
        { q: 'Can I start multi-agent and collapse to single if it underperforms?', a: 'Yes, and many teams do. Keep your orchestration code modular so the multi-agent path is one swappable backend.' }
      ],
      summary:
        'Use multi-agent when the task has 3+ distinct sub-skills, parallelisable sub-tasks, role-isolation needs, or model-tier routing. Stay single-agent for one-skill tasks, latency-critical paths, cost-sensitive paths, or tightly-coupled state. Start single-agent and split only when you measure a specific failure the split would fix.'
    },
    {
      id: 'supervisor-agent-architecture',
      title: 'Supervisor-Agent Architecture',
      subtitle: 'A supervisor routes, workers execute, the supervisor aggregates — the dominant multi-agent pattern.',
      tags: ['supervisor', 'multi-agent', 'architecture', 'orchestration'],
      readingMinutes: 9,
      definition:
        'Supervisor-agent architecture is a multi-agent pattern in which a supervisor agent (or graph) decomposes the task, delegates sub-tasks to specialist worker agents, receives their outputs, decides whether to delegate more or to finalise, and assembles the final result. The supervisor owns the plan; the workers own execution of individual sub-tasks.',
      whyItExists:
        'In a peer-to-peer multi-agent system, every agent must reason about every other agent — coordination complexity grows quadratically. The supervisor pattern centralises coordination: workers do not need to know about each other; they only need to receive a sub-task, do it, and return a result. This keeps each agent\'s prompt focused and makes the system composable — you can add or remove workers without touching the others.',
      howItWorks: [
        { type: 'h3', text: 'Roles and data flow' },
        {
          type: 'p',
          text: 'A supervisor receives the user goal, plans the sub-tasks, and dispatches each to a worker. Each worker receives its sub-task and any inputs it needs, executes (calling the LLM and its tools), and returns a structured result. The supervisor collects results, decides whether the goal is met or more work is needed, and either dispatches more sub-tasks or assembles and returns the final answer.'
        },
        {
          type: 'interactive',
          componentId: 'multi-agent-diagram',
          caption: 'A supervisor dispatches sub-tasks to Research, Analysis, Writing, and Verification agents, then assembles the final result. Click each agent to read its responsibilities.'
        },
        { type: 'h3', text: 'Worker responsibilities in the diagram' },
        {
          type: 'ul',
          items: [
            'Research Agent — gathers sources (web, internal docs); returns URLs, quotes, and raw findings. Tools: web search, doc retrieval.',
            'Analysis Agent — synthesises raw findings into structured claims with evidence and confidence. Tools: none (pure reasoning).',
            'Writing Agent — composes the final report in the requested format and tone from the structured claims. Tools: none.',
            'Verification Agent — checks the report against the original sources for accuracy and missing claims; returns a list of corrections. Tools: source retrieval, fact-check.'
          ]
        },
        { type: 'h3', text: 'When the supervisor delegates vs finalises' },
        {
          type: 'p',
          text: 'After each worker returns, the supervisor consults its state (goal, completed sub-tasks, remaining sub-tasks, latest results) and decides: dispatch the next sub-task, dispatch a correction sub-task (if verification failed), or finalise and return. The decision is either LLM-driven (the supervisor is an LLM that reads state and chooses) or graph-driven (the supervisor is a fixed state machine with conditional edges).'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Supervisor + 4 specialist workers in LangGraph with a typed shared state',
          code: `from typing import TypedDict, Literal, Annotated
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o", temperature=0)

# 1. Typed shared state — schema validation is mandatory in multi-agent
class ReportState(TypedDict):
    goal: str
    research: str          # raw findings from Research agent
    analysis: str          # structured claims from Analysis agent
    draft: str             # draft report from Writing agent
    verification: str      # corrections from Verification agent
    final_report: str
    next: str

# 2. Worker agents — each with a focused system prompt
def research_agent(state: ReportState) -> dict:
    prompt = f"You are a research agent. Gather sources for: {state['goal']}. Return URLs and key quotes."
    return {"research": llm.invoke(prompt).content}

def analysis_agent(state: ReportState) -> dict:
    prompt = f"You are an analyst. From these findings, extract 3-7 structured claims with evidence:\\n{state['research']}"
    return {"analysis": llm.invoke(prompt).content}

def writing_agent(state: ReportState) -> dict:
    prompt = f"You are a report writer. Compose a 1-page report from these claims:\\n{state['analysis']}"
    return {"draft": llm.invoke(prompt).content}

def verification_agent(state: ReportState) -> dict:
    prompt = f"You are a fact-checker. Verify this draft against the original findings. List corrections or 'OK'.\\nDraft:\\n{state['draft']}\\nFindings:\\n{state['research']}"
    return {"verification": llm.invoke(prompt).content}

# 3. Supervisor — decides which worker runs next
def supervisor(state: ReportState) -> dict:
    msg = llm.invoke(
        f"Goal: {state['goal']}\\nHas research: {bool(state.get('research'))}\\n"
        f"Has analysis: {bool(state.get('analysis'))}\\nHas draft: {bool(state.get('draft'))}\\n"
        f"Verification: {state.get('verification', 'none')}\\n"
        f"Pick next worker: research | analysis | writing | verification | finalize"
    ).content.strip().lower()
    if msg not in {"research", "analysis", "writing", "verification", "finalize"}:
        msg = "finalize"
    return {"next": "finalize" if msg == "finalize" else msg}

def finalize(state: ReportState) -> dict:
    return {"final_report": state.get("draft", "") + "\\n\\n[Verified: " + state.get("verification", "") + "]"}

# 4. Wire the graph — supervisor routes to workers; workers route back
g = StateGraph(ReportState)
g.add_node("supervisor", supervisor)
g.add_node("research", research_agent)
g.add_node("analysis", analysis_agent)
g.add_node("writing", writing_agent)
g.add_node("verification", verification_agent)
g.add_node("finalize", finalize)

g.set_entry_point("supervisor")
g.add_conditional_edges("supervisor", lambda s: s["next"], {
    "research": "research", "analysis": "analysis",
    "writing": "writing", "verification": "verification",
    "finalize": "finalize",
})
for w in ["research", "analysis", "writing", "verification"]:
    g.add_edge(w, "supervisor")           # every worker returns to supervisor
g.add_edge("finalize", END)

app = g.compile()
result = app.invoke({"goal": "Summarise the state of open-weight LLMs in 2024"})`
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The supervisor owns the plan; workers own execution',
          text: 'A common mistake is letting workers call other workers directly. That defeats the pattern — coordination complexity returns. Workers return to the supervisor; the supervisor dispatches the next step. This keeps the system inspectable and composable.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A user asks: "Write a brief on the pros and cons of RISC-V." The supervisor plans: research → analysis → writing → verification. Research returns 8 sources with quotes. Analysis returns 5 structured claims (3 pro, 2 con) with evidence. Writing returns a 1-page brief. Verification finds one unsupported claim and returns a correction. The supervisor dispatches Writing again with the correction; Writing returns an updated brief; Verification returns "OK". The supervisor finalises. The user receives a fact-checked brief — and the full trace is logged.'
        }
      ],
      advantages: [
        'Centralised coordination — workers stay simple and focused.',
        'Composable — add or remove workers without touching the others.',
        'Inspectable — the supervisor\'s dispatch log is a full execution trace.',
        'Robust — a failing worker is caught by the supervisor, which can retry or reroute.'
      ],
      disadvantages: [
        'The supervisor is a bottleneck and a single point of failure.',
        'Every worker hop is an LLM call — cost and latency add up.',
        'Bad supervisor logic (wrong routing, no termination) breaks the whole system.'
      ],
      commonMistakes: [
        'Letting workers call workers directly — destroys the pattern.',
        'No termination cap on the supervisor — infinite delegation loops.',
        'Supervisor prompts that try to do the work themselves instead of delegating.',
        'Workers that return free-form text instead of structured results — the supervisor cannot reason over them.'
      ],
      limitations: [
        'Scales poorly past ~10 workers — the supervisor\'s routing decision becomes hard.',
        'For deeply hierarchical tasks, you need nested supervisors (hierarchy), which adds complexity.',
        'All communication goes through the supervisor, which is fine for control but expensive for peer-style debate.'
      ],
      relatedConcepts: ['Worker Agents', 'Specialist Agents', 'Shared State', 'Task Delegation'],
      faq: [
        { q: 'Supervisor as LLM or as graph?', a: 'Both are valid. LLM-driven supervisors are flexible but non-deterministic and harder to test. Graph-driven supervisors (fixed conditional edges) are deterministic and inspectable but less adaptive. Hybrid: graph for the structure, LLM for the routing decision within each graph node.' },
        { q: 'How do I prevent the supervisor from looping forever?', a: 'Hard caps: max iterations (e.g., 10), max tokens, max wall-clock. The supervisor must check these before each dispatch and route to "finalize" or "fail" when exceeded.' }
      ],
      summary:
        'Supervisor-agent architecture centralises coordination in a supervisor that plans, delegates to specialist workers, and aggregates. Workers stay focused and composable; the supervisor owns the plan. The pattern is dominant because it scales (workers are independent) and inspects (the dispatch log is a trace). Cost: every hop is an LLM call, and the supervisor is a bottleneck. Build it with a typed shared state, a routing decision (LLM or graph), and hard termination caps.'
    },
    {
      id: 'worker-agents',
      title: 'Worker Agents',
      subtitle: 'The specialist executors — focused, stateless between calls, and substitutable.',
      tags: ['workers', 'multi-agent', 'agents', 'architecture'],
      readingMinutes: 6,
      definition:
        'A worker agent is a specialist executor in a multi-agent system: it receives a single sub-task from the supervisor, executes it (LLM + tools), and returns a structured result. Workers do not coordinate with each other; they only communicate with the supervisor. They are stateless between calls — all needed context is passed in by the supervisor.',
      whyItExists:
        'A worker exists to be very good at one thing. A Research worker has the right prompt, the right tools (web search, doc retrieval), and the right output format for research — and nothing else. This specialisation makes each worker more reliable than a general-purpose agent trying to do everything, and makes workers substitutable: swap a GPT-4 Research worker for a Claude Research worker without changing anything else.',
      howItWorks: [
        { type: 'h3', text: 'Anatomy of a worker' },
        {
          type: 'ul',
          items: [
            'Role — a one-line identity ("you are a research agent").',
            'System prompt — focused instructions for the role; no other roles mentioned.',
            'Tools — only the tools this role needs (a research worker has web search; a writer does not).',
            'Input contract — the structured fields the worker expects (goal, prior findings, constraints).',
            'Output contract — the structured fields the worker returns (findings, citations, confidence).',
            'Model — the LLM tier appropriate to the role (cheap for triage, expensive for analysis).'
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A worker defined by role, prompt, tools, and contracts',
          code: `research_worker = Agent(
    role="Research Agent",
    system_prompt="""You are a research agent.
Given a research goal, gather 3-8 sources using web_search and retrieve_docs.
Return JSON: {"findings": [{"claim": str, "source_url": str, "quote": str}]}.
Do not analyse or write prose — only gather and quote.""",
    tools=[web_search, retrieve_docs],
    model="gpt-4o",
    input_schema=ResearchInput,   # {goal: str, prior_findings: list}
    output_schema=ResearchOutput, # {findings: list[Finding]}
)`
        },
        { type: 'h3', text: 'Why workers should be stateless' },
        {
          type: 'p',
          text: 'A worker should not keep state between calls. If it needs the prior finding, the supervisor passes it. Why: stateless workers are reproducible (same input → same output), substitutable (swap models or implementations), and parallel-safe (run N copies concurrently without coordination). Stateful workers create hidden coupling that breaks under concurrency and is hell to debug.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'A worker is not a full agent',
          text: 'A worker does not plan multi-step tasks; it executes one sub-task. If a worker needs to plan and act across multiple steps internally, it is itself a sub-agent with its own supervisor. Do not let a worker grow into a full agent — split it.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A Translation worker receives {text: "Hello world", target_lang: "fr"} and returns {translation: "Bonjour le monde"}. Stateless, focused, no tools. A Coding worker receives {task: "add a /health endpoint to app.py", file: "..."} and returns {diff: "...", tests_passed: True}. Uses tools (file read, pytest). Both workers can be swapped, parallelised, and tested in isolation.'
        }
      ],
      advantages: [
        'Focused prompts improve output quality versus one general prompt.',
        'Stateless workers are reproducible, substitutable, and parallel-safe.',
        'Clear input/output contracts make workers testable in isolation.',
        'Tool access is scoped per role — improves safety (a writer cannot run shell commands).'
      ],
      disadvantages: [
        'A worker cannot handle tasks that need cross-step state — those need a sub-supervisor.',
        'Too many tiny workers add orchestration overhead that exceeds their specialisation benefit.',
        'Defining good input/output contracts is upfront design work.'
      ],
      commonMistakes: [
        'Workers that grow into full agents — split instead.',
        'Workers that hold state between calls — coupling and concurrency bugs.',
        'Workers with overlapping roles (two "research" workers with slightly different prompts) — merge or specialise clearly.',
        'Workers that return free-form text instead of structured output — the supervisor cannot route on it.'
      ],
      limitations: [
        'A worker is only as good as its prompt and tools — bad prompt = bad worker.',
        'Statelessness means re-sending context each call — token cost.',
        'Worker granularity is a judgement call: too coarse and you lose specialisation, too fine and you add overhead.'
      ],
      relatedConcepts: ['Supervisor-Agent Architecture', 'Specialist Agents', 'Task Delegation', 'Shared State'],
      faq: [
        { q: 'How many workers should my system have?', a: 'Start with 2–4. Each worker should have a distinct role, prompt, and tool set. If two workers do nearly the same thing, merge them. If one worker tries to do two things, split it.' },
        { q: 'Should every worker use the same LLM?', a: 'No — match model to role. Use a cheap fast model for triage and routing, an expensive model for analysis and writing. Routing by role is one of the biggest cost levers in multi-agent.' }
      ],
      summary:
        'A worker agent is a focused, stateless executor that receives a sub-task, runs, and returns a structured result. Its anatomy is role, system prompt, tools, input contract, output contract, and model. Workers are stateless for reproducibility, substitutability, and parallel-safety. They do not coordinate with each other — only with the supervisor. A worker is not a full agent; if it needs to plan multi-step, make it a sub-agent with its own supervisor.'
    },
    {
      id: 'sequential-workflows',
      title: 'Sequential Workflows',
      subtitle: 'The simplest multi-agent pattern — a pipeline where each agent\'s output feeds the next.',
      tags: ['sequential', 'pipeline', 'multi-agent', 'workflows'],
      readingMinutes: 6,
      definition:
        'A sequential workflow is a multi-agent pattern in which agents run in a fixed order: agent A produces output that feeds agent B, whose output feeds agent C, and so on. There is no dynamic routing — the sequence is fixed by the workflow definition. It is the simplest multi-agent pattern and the right starting point for most use cases.',
      whyItExists:
        'Many tasks are naturally linear: research → analyse → write → verify. A sequential workflow makes this structure explicit and removes the supervisor\'s routing decision entirely. This trades flexibility (you cannot skip or repeat stages dynamically) for simplicity, determinism, and ease of debugging. When the task is linear, a sequential workflow is strictly better than a supervisor.',
      howItWorks: [
        { type: 'h3', text: 'Structure' },
        {
          type: 'p',
          text: 'A sequential workflow is a list of (agent, input_mapper, output_mapper) triples. The orchestrator runs each agent in order, passing the previous output through the input mapper to construct the next input, and storing the output in shared state. There is no routing decision — the next agent is always "the one after the current".'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A fixed sequential pipeline in LangGraph',
          code: `from langgraph.graph import StateGraph, END

class State(TypedDict):
    goal: str
    research: str
    analysis: str
    draft: str
    verified: str

g = StateGraph(State)
g.add_node("research", research_agent)
g.add_node("analysis", analysis_agent)
g.add_node("writing", writing_agent)
g.add_node("verification", verification_agent)

# Fixed edges — no conditional routing, just a linear chain
g.set_entry_point("research")
g.add_edge("research", "analysis")
g.add_edge("analysis", "writing")
g.add_edge("writing", "verification")
g.add_edge("verification", END)

pipeline = g.compile()
result = pipeline.invoke({"goal": "Summarise 2024 LLM open-weight releases"})`
        },
        { type: 'h3', text: 'When sequential beats supervisor' },
        {
          type: 'ul',
          items: [
            'The task is genuinely linear — no conditional branches.',
            'You want determinism — same input, same sequence, easier testing.',
            'Latency matters — skipping the supervisor\'s routing LLM call saves time.',
            'You need auditability — the sequence is fixed and logged.'
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Add a feedback edge only when needed',
          text: 'A pure sequential pipeline cannot retry a failed stage. If verification fails, you need a conditional edge back to writing. That is a "sequential with feedback" pattern — still mostly linear, but with one conditional loop. Do not jump to a full supervisor just because you need one feedback edge.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A content-moderation pipeline: Triage agent (classify: spam/abuse/ok) → Policy agent (decide action based on category) → Action agent (execute: hide, warn, ban) → Log agent (write audit entry). Fully linear, no routing. Same input always produces the same sequence of agent calls — trivial to test and audit. The pipeline handles 1000 messages/sec with no routing LLM in the loop.'
        }
      ],
      advantages: [
        'Simplest multi-agent pattern — no routing logic to design or debug.',
        'Deterministic — same input always produces the same agent sequence.',
        'Cheapest and lowest-latency — no supervisor LLM call per step.',
        'Easy to test — each stage can be tested in isolation with mock inputs.'
      ],
      disadvantages: [
        'No adaptation — a stage that fails cannot be retried or skipped.',
        'Wasteful when stages are conditional (e.g., verification only needed for high-risk outputs).',
        'Cannot parallelise — by definition, agents run one after another.'
      ],
      commonMistakes: [
        'Using a supervisor when the task is genuinely linear — paying for routing you do not need.',
        'Forcing a non-linear task into a sequential pipeline (lots of "if X, skip stage 3" hacks) — use a supervisor.',
        'No error handling between stages — one bad output propagates to all downstream stages.',
        'Stages that share too much context — defeats the specialisation benefit.'
      ],
      limitations: [
        'Cannot handle branching, parallelism, or retry — upgrade to supervisor or graph when you need these.',
        'A failure mid-pipeline leaves the system in a partial state — needs explicit rollback or compensation.',
        'Fixed order is brittle when the optimal order depends on the input.'
      ],
      relatedConcepts: ['Parallel Execution', 'Supervisor-Agent Architecture', 'Worker Agents'],
      faq: [
        { q: 'Sequential pipeline vs chain-of-prompts?', a: 'Same idea. A chain-of-prompts is a sequential pipeline implemented naively (just call LLMs in order). A sequential workflow is the same pattern with explicit state, contracts, and tooling around it.' },
        { q: 'When should I add a feedback edge?', a: 'When a downstream stage (typically verification) can detect a fixable upstream problem. One feedback edge is fine; two or more suggests you need a supervisor.' }
      ],
      summary:
        'A sequential workflow runs agents in a fixed order with no routing. It is the simplest, cheapest, lowest-latency multi-agent pattern and the right starting point for linear tasks. It trades flexibility for determinism and auditability. Add a feedback edge when you need one retry loop; upgrade to a supervisor when you need branching, parallelism, or dynamic routing.'
    },
    {
      id: 'parallel-execution',
      title: 'Parallel Execution',
      subtitle: 'Run independent agents concurrently to cut wall-clock time — but coordinate carefully.',
      tags: ['parallel', 'concurrency', 'multi-agent', 'performance'],
      readingMinutes: 7,
      definition:
        'Parallel execution is a multi-agent pattern in which two or more agents run concurrently because their sub-tasks are independent — neither needs the other\'s output. A barrier collects their results, which then feed downstream agents. The benefit is wall-clock latency: N independent agents running in parallel finish in roughly the time of the slowest, not the sum.',
      whyItExists:
        'Sequential pipelines pay wall-clock latency equal to the sum of their stages. For independent sub-tasks (three research queries on different topics), this is wasteful — they could all run at once. Parallel execution exists to collapse latency from sum to max for independent work, which is often the difference between a 30-second response and a 10-second one.',
      howItWorks: [
        { type: 'h3', text: 'Structure' },
        {
          type: 'p',
          text: 'A parallel pattern has three parts: (1) a fan-out step that creates N independent sub-tasks, (2) N agents running concurrently (each on its own sub-task), (3) a barrier that waits for all N to finish and merges their results. The merge can be a simple concatenation, a structured union, or an LLM-driven synthesis (e.g., a "summariser" agent combines N research outputs into one).'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Fan-out to 3 research agents, barrier, then synthesise',
          code: `import asyncio

async def research(topic: str) -> str:
    return await research_agent.ainvoke({"goal": topic})

async def parallel_research(topics: list[str]) -> str:
    # Fan-out: all research agents run concurrently
    results = await asyncio.gather(*[research(t) for t in topics])
    # Barrier (gather) waits for all to finish
    # Synthesise: one agent merges the N findings into one report
    synthesis = await synthesiser.ainvoke({"findings": results})
    return synthesis

report = await parallel_research([
    "RISC-V pros",
    "RISC-V cons",
    "RISC-V adoption in 2024",
])`
        },
        { type: 'h3', text: 'When parallel makes sense' },
        {
          type: 'ul',
          items: [
            'Independent sub-tasks: research on N different topics; analyse N different files.',
            'Latency budget is tight: collapsing sum-of-stages to max-of-stages matters.',
            'Throughput matters: N parallel agents use N× the LLM capacity, finishing sooner.',
            'You have capacity: your LLM provider rate limits and budget allow concurrent calls.'
          ]
        },
        {
          type: 'table',
          headers: ['Concern', 'Sequential', 'Parallel'],
          rows: [
            ['Wall-clock latency', 'Sum of stages', 'Max of stages'],
            ['Total token cost', 'Same', 'Same (plus merge)'],
            ['Provider rate-limit pressure', 'Low (1 call at a time)', 'High (N concurrent calls)'],
            ['Failure blast radius', 'One stage fails, pipeline halts', 'One agent fails, others still run'],
            ['Implementation complexity', 'Low', 'Medium (concurrency, merging)']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Concurrency is not free',
          text: 'N parallel agents make N concurrent LLM calls. If your provider rate-limits at 100 RPM and you fan out 20, a single task can blow the budget. Always check rate limits and budgets before fanning out, and add a semaphore to cap concurrency (e.g., max 5 in flight).'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A "compare three frameworks" task fans out three research agents (one per framework) running concurrently. Each takes 8 seconds. Sequential: 24s. Parallel: 8s plus a 2s synthesis step = 10s. The 14-second saving is the entire reason for parallel — and the only cost is one extra synthesis call and three concurrent LLM requests instead of one at a time.'
        }
      ],
      advantages: [
        'Cuts wall-clock latency from sum to max for independent sub-tasks.',
        'Failure isolation — one failing agent does not block the others.',
        'Higher throughput when the LLM provider has spare capacity.'
      ],
      disadvantages: [
        'Higher peak load — N concurrent calls hit rate limits harder.',
        'More complex error handling — partial failures need a merge policy.',
        'Result merging adds a step (and an LLM call if synthesis is needed).'
      ],
      commonMistakes: [
        'Fanning out without checking rate limits — requests get throttled and you gain nothing.',
        'No concurrency cap — fanning out 50 agents simultaneously overwhelms the provider.',
        'Treating all sub-tasks as parallel when some have hidden dependencies.',
        'Naive merge that loses information — design the merge carefully.'
      ],
      limitations: [
        'Only helps when sub-tasks are truly independent; dependent sub-tasks must be sequential.',
        'Rate limits and budgets cap the achievable concurrency.',
        'Merging N outputs is itself a non-trivial task, sometimes as expensive as one more agent.'
      ],
      relatedConcepts: ['Sequential Workflows', 'Supervisor-Agent Architecture', 'Cost and Latency Trade-offs'],
      faq: [
        { q: 'How many agents should I run in parallel?', a: 'As many as your rate limit and budget allow, capped by a semaphore. Start with 3–5, measure, and increase only if it helps and your provider can handle it.' },
        { q: 'What if one parallel agent fails?', a: 'Decide upfront: retry that one, continue with the others (partial result), or fail the whole task. The right answer depends on the task — make it explicit, do not leave it to chance.' }
      ],
      summary:
        'Parallel execution runs independent agents concurrently to collapse wall-clock latency from sum-of-stages to max-of-stages. The pattern is fan-out → concurrent execution → barrier → merge. It is the right pattern when sub-tasks are independent and latency matters. Watch out for rate limits (cap concurrency with a semaphore), partial failures (decide upfront), and merge cost.'
    },
    {
      id: 'specialist-agents',
      title: 'Specialist Agents',
      subtitle: 'Workers tuned for one domain — the right prompt, tools, and model for one job.',
      tags: ['specialist', 'multi-agent', 'agents', 'roles'],
      readingMinutes: 6,
      definition:
        'A specialist agent is a worker whose prompt, tools, and model are tuned for one domain or skill: a SQL specialist (system prompt about SQL, tools for querying the DB, model tuned for code), a legal-doc specialist (prompt about contract review, tools for citation retrieval), a code-review specialist. Generalisation is sacrificed for reliability within the specialty.',
      whyItExists:
        'A general-purpose agent prompt must hedge: "you are a helpful assistant that can write code, analyse data, draft emails, …". Such prompts underperform on every specific task versus a focused prompt. Specialist agents exist to push performance on each sub-task by removing the hedging — the SQL specialist never has to wonder whether the user wants prose or code, because its prompt says "you return SQL only".',
      howItWorks: [
        { type: 'h3', text: 'Designing a specialist' },
        {
          type: 'ol',
          items: [
            'Pick a narrow domain (SQL generation, contract review, log analysis).',
            'Write a system prompt that assumes the domain — no "you are a general assistant" hedging.',
            'Select tools scoped to the domain — a SQL specialist has DB query tools, not web search.',
            'Choose a model tier — code specialists may use a code-tuned model; legal specialists may use a long-context model.',
            'Define a strict output schema — SQL specialists return only SQL, not explanations.',
            'Build a small eval set for the specialty and tune the prompt against it.'
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A SQL specialist with strict output schema',
          code: `sql_specialist = Agent(
    role="SQL Specialist",
    system_prompt="""You are a SQL specialist for a Postgres analytics database.
Given a natural-language question and the schema, return ONLY valid SQL.
No prose, no markdown fences, no explanation.
If the question is ambiguous, return: "ERROR: <what is ambiguous>".
Schema:
  events(id, user_id, event, ts)
  users(id, email, plan, created_at)""",
    tools=[run_sql],            # only DB tools, nothing else
    model="gpt-4o",             # strong code model
    output_schema=SQLResult,    # {sql: str, error: str | None}
)`
        },
        { type: 'h3', text: 'Composing specialists' },
        {
          type: 'p',
          text: 'A multi-agent system composes specialists: a SQL specialist queries the DB, an Analysis specialist interprets the results, a Writing specialist drafts the report. Each specialist does one thing well; the supervisor sequences them. The composition is more reliable than one general agent doing all three because each prompt is hedging-free and each output is structured.'
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Specialists need evals',
          text: 'A specialist is only as good as its eval set. Build a small (20–100 example) eval set for each specialty and re-run it whenever you change the prompt or model. Without an eval, "this specialist is good" is a vibe — and vibes do not survive production.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A customer-support system has a Billing specialist (knows the billing schema, has refund tools, prompt is about invoices and payments), a Technical specialist (knows the product, has debug tools), and an Escalation specialist (long-context model, prompt is about de-escalation). Each specialist outperforms a general agent on its own tickets, and the supervisor routes by ticket type. The Billing specialist never sees a technical ticket and vice versa.'
        }
      ],
      advantages: [
        'Better output quality on the specialty than a general agent.',
        'Strict output schemas make downstream parsing reliable.',
        'Tool scope per specialty improves safety (a billing agent cannot reset passwords).',
        'Each specialty can use the optimal model tier.'
      ],
      disadvantages: [
        'Cannot handle out-of-domain inputs — needs the supervisor to route correctly.',
        'More specialists = more prompts to maintain and eval.',
        'Domain boundaries are fuzzy; a "billing" ticket may need technical context.'
      ],
      commonMistakes: [
        'Specialists with hedging prompts ("you are a billing assistant but can also…") — defeats the specialisation.',
        'No eval set per specialist — quality drifts unnoticed.',
        'Overlapping specialists (two "data" specialists with subtly different prompts) — merge or clearly separate.',
        'Specialists that try to do the supervisor\'s job (deciding what to do next).'
      ],
      limitations: [
        'Specialists degrade on out-of-domain inputs; routing accuracy matters.',
        'A specialist cannot adapt to a domain shift (new DB schema, new policy) without a prompt or eval update.',
        'Too many specialists fragment the system and increase routing difficulty.'
      ],
      relatedConcepts: ['Worker Agents', 'Supervisor-Agent Architecture', 'Task Delegation'],
      faq: [
        { q: 'How narrow should a specialist be?', a: 'Narrow enough that its prompt can be hedging-free and its tools scoped, broad enough to handle a meaningful class of inputs. "SQL" is a good specialty; "SELECT queries on the events table" is too narrow.' },
        { q: 'Can a specialist call other specialists?', a: 'No — that is the supervisor\'s job. If a specialist needs another specialty\'s output, it returns its partial result and the supervisor dispatches the other specialist.' }
      ],
      summary:
        'A specialist agent is a worker whose prompt, tools, model, and output schema are tuned for one domain. It sacrifices generalisation for reliability within the specialty. Specialists are designed by picking a narrow domain, writing a hedging-free prompt, scoping tools, choosing the right model, and building an eval set. They are composed by a supervisor that routes inputs to the right specialty.'
    },
    {
      id: 'agent-communication',
      title: 'Agent Communication',
      subtitle: 'How agents exchange information — message format, channels, and the contract between sender and receiver.',
      tags: ['communication', 'multi-agent', 'messages', 'protocols'],
      readingMinutes: 7,
      definition:
        'Agent communication is the protocol by which agents exchange information: the message format (what fields a message has), the channel (direct call, message queue, shared state), and the contract (what the sender promises and what the receiver may assume). In multi-agent systems, communication design is as important as agent design — bad protocols produce systems where agents misinterpret each other constantly.',
      whyItExists:
        'Two agents cannot collaborate if their messages are ambiguous. "Here\'s what I found" is a useless message; the receiver does not know what to do with it. Communication protocols exist to make messages self-describing: a Research agent returns {findings: [...], citations: [...], confidence: 0.8}, and the Analysis agent knows exactly what those fields mean. Without protocols, every message is a guessing game.',
      howItWorks: [
        { type: 'h3', text: 'Three communication channels' },
        {
          type: 'ul',
          items: [
            'Direct call — agent A invokes agent B as a function and gets a return value. Tightest coupling; best for supervisor-to-worker.',
            'Message queue — agents post messages to a queue; subscribers receive them. Loose coupling; good for peer-to-peer and event-driven systems.',
            'Shared state — agents read and write a common store; coordination is implicit through state changes. Best for systems where many agents contribute to one evolving artifact.'
          ]
        },
        { type: 'h3', text: 'Message contract' },
        {
          type: 'p',
          text: 'A good message has: (1) a sender (which agent produced it), (2) a type (what kind of message — finding, question, correction, done), (3) a structured payload matching a known schema, (4) optional metadata (timestamp, correlation id, confidence). The contract is the schema; both sender and receiver must agree on it. In typed systems, this is enforced by code; in untyped systems, it is enforced by hope (and breaks often).'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A typed message with sender, type, payload, and metadata',
          code: `from pydantic import BaseModel
from typing import Literal
from datetime import datetime

class Finding(BaseModel):
    claim: str
    source_url: str
    quote: str
    confidence: float

class Message(BaseModel):
    sender: str                              # "research_agent"
    type: Literal["finding", "question", "correction", "done"]
    payload: Finding | str | list[Finding]   # depends on type
    correlation_id: str                      # ties to the originating user request
    timestamp: datetime
    confidence: float | None = None

# Sender: research agent returns findings
msg = Message(sender="research_agent", type="finding",
              payload=[Finding(claim="...", source_url="...", quote="...", confidence=0.85)],
              correlation_id="req_42", timestamp=datetime.utcnow(),
              confidence=0.85)

# Receiver: analysis agent knows payload is list[Finding] when type == "finding"
findings = msg.payload  # typed; no parsing guesswork`
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Free-text messages are a smell',
          text: 'If your agents exchange free-form text ("here is what I found: ..."), you have a protocol problem. The receiver must parse the text, the LLM may format it differently each time, and there is no contract. Use structured messages with schemas; let the LLM produce the payload, but wrap it in a typed envelope.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A Verification agent sends a Correction message to the Writing agent: {sender: "verifier", type: "correction", payload: {claim: "X is unsupported", fix: "remove or cite"}}. The Writing agent receives this and knows exactly what to do — no interpretation needed. Compare with a free-text message ("by the way, I think claim X might be unsupported, maybe remove it or find a source") which the Writing agent might ignore or misinterpret.'
        }
      ],
      advantages: [
        'Structured messages make coordination reliable and parseable.',
        'A clear contract lets agents be developed and tested independently.',
        'Message logs become a full audit trail of the system\'s decisions.'
      ],
      disadvantages: [
        'Designing and maintaining schemas is upfront work.',
        'Schema changes require coordinated updates across agents.',
        'Over-engineered protocols (too many message types) add complexity without benefit.'
      ],
      commonMistakes: [
        'Free-text messages between agents — parse failures and misinterpretation.',
        'No correlation id — cannot trace which user request a message relates to.',
        'Mixing concerns in one message (a finding plus a question plus a status update).',
        'Letting the LLM decide the message type — the runtime should classify based on the agent\'s output.'
      ],
      limitations: [
        'A protocol cannot enforce that an agent\'s payload is correct, only that it is well-formed.',
        'Cross-language systems (Python + TypeScript agents) need a shared schema format (JSON Schema, protobuf).',
        'Evolving a protocol without breaking deployed agents requires versioning.'
      ],
      relatedConcepts: ['Shared State', 'Worker Agents', 'Supervisor-Agent Architecture', 'Task Delegation'],
      faq: [
        { q: 'Direct call vs message queue — which?', a: 'Direct call for tightly-coupled supervisor-worker systems. Message queue for distributed, event-driven, or polyglot systems. Shared state for systems where many agents contribute to one evolving artifact (a document, a plan).' },
        { q: 'How do I enforce the contract?', a: 'Use Pydantic, JSON Schema, or TypeScript types. Validate on send and on receive. Reject malformed messages explicitly — never let an agent try to interpret a malformed payload.' }
      ],
      summary:
        'Agent communication is the protocol — message format, channel, and contract — by which agents exchange information. Three channels: direct call (tight, supervisor-worker), message queue (loose, peer-to-peer), shared state (implicit, many-to-one artifact). Messages should be structured with sender, type, payload, and correlation id; free-text messages are a smell. The contract is enforced by schemas validated on both send and receive.'
    },
    {
      id: 'shared-state',
      title: 'Shared State',
      subtitle: 'The common substrate agents read and write — and why it must be schema-validated.',
      tags: ['shared-state', 'schema', 'multi-agent', 'architecture'],
      readingMinutes: 8,
      definition:
        'Shared state is a structured store that multiple agents in a system read from and write to: the current goal, intermediate findings, drafts, verification results, and any other field that needs to pass between agents. It is the substrate of coordination in patterns where agents do not message each other directly.',
      whyItExists:
        'Without shared state, every agent-to-agent interaction is a direct message — and the number of interactions grows quadratically with the number of agents. Shared state collapses this to linear: each agent reads what it needs and writes what it produces, with no direct addressing. The state is the blackboard; the agents are specialists that read and write to it.',
      howItWorks: [
        {
          type: 'callout',
          variant: 'info',
          title: 'Why shared state needs schema validation in multi-agent systems',
          text: 'In a single-agent system, the agent\'s output goes back to the same agent — small blast radius if it is malformed. In a multi-agent system, Agent A\'s output is read by Agent B, C, and D, each of which assumes specific fields exist with specific types. If Agent A writes {"findings": "some text"} (string) instead of {"findings": [...]} (list), every downstream agent that does findings[0] crashes — or worse, silently produces wrong output. Schema validation is the contract that makes multi-agent systems tractable: it catches type mismatches at the boundary, before they propagate, instead of three agents later where the failure is unattributable.'
        },
        { type: 'h3', text: 'Anatomy of a shared state' },
        {
          type: 'p',
          text: 'A shared state is a typed object with named fields. Each field has an owner (the agent that writes it), a type (string, list, nested object), and a meaning (what it represents). At any point, the state is the system\'s current understanding of the task: the goal, what has been found, what has been written, what has been verified.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A typed shared state with Pydantic validation',
          code: `from pydantic import BaseModel, Field, ValidationError
from typing import Optional

class Finding(BaseModel):
    claim: str
    source_url: str
    quote: str
    confidence: float = Field(ge=0.0, le=1.0)

class SharedState(BaseModel):
    goal: str
    research: Optional[list[Finding]] = None     # written by Research agent
    analysis: Optional[str] = None               # written by Analysis agent
    draft: Optional[str] = None                  # written by Writing agent
    verification: Optional[str] = None           # written by Verification agent
    final_report: Optional[str] = None
    iterations: int = 0
    max_iterations: int = 5

# Agent writes — validation happens HERE, not three agents later
def research_agent(state: SharedState) -> dict:
    raw = llm.invoke(...)
    try:
        findings = [Finding(**f) for f in parse_json(raw)]
        return {"research": findings}      # typed; downstream agents can rely on it
    except ValidationError as e:
        # Surface the failure at the boundary, with attribution
        raise AgentOutputError("research_agent", e)`
        },
        { type: 'h3', text: 'Why validation must happen at the write boundary' },
        {
          type: 'p',
          text: 'Validate the moment an agent writes — not when the next agent reads. Two reasons. (1) Attribution: if validation fails at write time, you know which agent produced bad output. If it fails at read time, the failing agent is blameless but cannot proceed, and debugging is a hunt. (2) Fail-fast: a bad write should not propagate to multiple downstream agents, each of which may interpret it differently. Validation at write time stops the bad data at the source.'
        },
        { type: 'h3', text: 'Patterns for evolving state' },
        {
          type: 'table',
          headers: ['Pattern', 'Description', 'When to use'],
          rows: [
            ['Overwrite', 'Writer replaces the field entirely', 'Single owner per field; new value supersedes old'],
            ['Append', 'Writer appends to a list', 'Multiple contributions (N agents each add findings)'],
            ['Merge', 'Writer merges into a dict/object with conflict resolution', 'Multiple agents write overlapping keys'],
            ['Versioned', 'Writer creates a new version; readers can pin', 'Long-running workflows with rollback needs']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Concurrency changes everything',
          text: 'When agents run in parallel and write to the same shared state, you need locking, transactions, or CRDT-style merge rules. Naive "read, modify, write" races silently corrupt state. Use a transactional store (a database) or a single-writer-per-field rule to avoid this.'
          }
      ],
      examples: [
        {
          type: 'p',
          text: 'A report-writing system has shared state {goal, research, analysis, draft, verification}. Research writes research (list[Finding]); Analysis reads research and writes analysis (str); Writing reads analysis and writes draft (str); Verification reads draft and research and writes verification (str). Each field has one owner. Each write is schema-validated. When Verification writes "claim X is unsupported", Writing re-reads draft and verification and produces a new draft. The state is the only thing tying these agents together — they have no direct messages.'
        }
      ],
      advantages: [
        'Linear coordination complexity — no N² message routing.',
        'Single source of truth — every agent sees the same current state.',
        'Inspectable — dump the state at any step to debug.',
        'Schema validation catches contract violations at the boundary.'
      ],
      disadvantages: [
        'Schema design is upfront work and evolves as the system grows.',
        'Concurrency requires locking or transactions — non-trivial.',
        'A single corrupted field can block the whole system; needs migration paths.'
      ],
      commonMistakes: [
        'No schema validation — agents write free-form data, downstream agents crash mysteriously.',
        'Validating at read instead of write — failures become unattributable.',
        'Multiple agents writing the same field with no merge rule — last-write-wins corrupts state.',
        'Stuffing everything into one giant state object — split by concern.'
      ],
      limitations: [
        'A shared state does not work well for peer-to-peer debate (where messages are the point).',
        'State schemas are hard to evolve without breaking deployed agents.',
        'Concurrency adds locking complexity that can outweigh the coordination benefit.'
      ],
      relatedConcepts: ['Agent Communication', 'Supervisor-Agent Architecture', 'Worker Agents', 'Conflict Resolution'],
      faq: [
        { q: 'Pydantic, JSON Schema, or TypeScript types?', a: 'Pydantic for Python backends (runtime validation + serialization). JSON Schema for cross-language systems (Python + TS agents). TypeScript types for TS-only systems. The point is enforcement; the tool is secondary.' },
        { q: 'What if an agent needs to add a new field?', a: 'Version the schema. New fields should be optional (default None) so old agents can still read the state. Remove fields only across a major version bump with a migration.' }
      ],
      summary:
        'Shared state is the structured store multiple agents read and write to, collapsing N² direct messages to linear coordination. In multi-agent systems it MUST be schema-validated: agents write typed fields, validation happens at the write boundary (for attribution and fail-fast), and downstream agents can rely on the contract. Concurrency requires locking or single-writer-per-field rules. Without schema validation, multi-agent systems are un-debuggable: a malformed write propagates silently and fails unattributably three agents later.'
    },
    {
      id: 'task-delegation-multi',
      title: 'Task Delegation',
      subtitle: 'How a supervisor decides who does what, when, and with what inputs.',
      tags: ['delegation', 'supervisor', 'multi-agent', 'orchestration'],
      readingMinutes: 6,
      definition:
        'Task delegation is the supervisor\'s act of selecting a worker agent, formulating a sub-task for it, passing the right inputs, and integrating its output. It is the core decision the supervisor makes on every step: who runs next, with what sub-goal, and what to do with the result.',
      whyItExists:
        'Without explicit delegation logic, a multi-agent system devolves into "every agent sees everything and tries to help" — chaos. Delegation exists to make the supervisor\'s routing decision explicit: at each step, one agent is chosen, given a focused sub-task, and its result is integrated. This concentrates responsibility and makes the system\'s behaviour inspectable.',
      howItWorks: [
        { type: 'h3', text: 'The delegation decision' },
        {
          type: 'ol',
          items: [
            'Assess current state: goal, completed sub-tasks, latest results, remaining work.',
            'Pick a worker: which specialist is best suited to the next sub-task.',
            'Formulate the sub-task: a focused instruction ("find 3 sources on topic X").',
            'Pass inputs: the slice of shared state the worker needs (no more).',
            'Dispatch: invoke the worker.',
            'Integrate: validate the worker\'s output, write it to shared state, decide next step.'
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A supervisor delegation step',
          code: `def delegate(state: SharedState) -> SharedState:
    # 1. Assess state and pick worker via LLM or rules
    next_worker = pick_worker(state)   # "research" | "analysis" | "writing" | "verification" | "finalize"

    if next_worker == "finalize":
        state.final_report = state.draft
        return state

    # 2. Formulate sub-task focused on this worker's role
    sub_task = formulate_subtask(next_worker, state)

    # 3. Pass only the inputs this worker needs (minimal slice)
    worker_input = slice_inputs(next_worker, state)

    # 4. Dispatch
    raw_output = workers[next_worker].invoke({"sub_task": sub_task, **worker_input})

    # 5. Validate and integrate (schema-validated at boundary)
    validated = validate_output(next_worker, raw_output)
    state = write_to_state(state, next_worker, validated)

    # 6. Update progress
    state.iterations += 1
    return state`
        },
        { type: 'h3', text: 'Rule-based vs LLM-based delegation' },
        {
          type: 'p',
          text: 'Rule-based delegation uses if-then logic ("if research is None, dispatch research; else if analysis is None, dispatch analysis"). It is deterministic, fast, and easy to debug. LLM-based delegation asks the supervisor LLM "given this state, who runs next?". It is flexible and handles novel situations but non-deterministic and slower. Most production systems hybridise: rules for the main flow, LLM for exceptions.'
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Pass minimal inputs',
          text: 'A common mistake is passing the entire shared state to every worker. This bloats the worker\'s context and leaks information the worker does not need (and should not see). Pass only the fields the worker needs to do its sub-task — a Research worker needs the goal; it does not need the current draft.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A supervisor on a research-report task: state has goal but no research. Pick: research. Sub-task: "find 3 sources on the pros and cons of RISC-V". Inputs: {goal}. Research returns findings. State now has research. Pick: analysis. Sub-task: "extract 3–7 structured claims from these findings". Inputs: {goal, research}. Analysis returns claims. Pick: writing. Sub-task: "draft a 1-page report from these claims". Inputs: {goal, analysis}. And so on. Each delegation is focused and minimal.'
        }
      ],
      advantages: [
        'Explicit routing makes the system inspectable and debuggable.',
        'Minimal inputs keep workers focused and cheap.',
        'Hybrid rule + LLM delegation balances determinism and flexibility.'
      ],
      disadvantages: [
        'Bad delegation logic wastes calls (wrong worker) or loops (no progress).',
        'LLM-based delegation is non-deterministic — harder to test.',
        'Formulating good sub-tasks is a skill; bad sub-tasks produce bad worker outputs.'
      ],
      commonMistakes: [
        'Passing the entire shared state to every worker — context bloat and information leakage.',
        'LLM-based delegation with no rules — non-deterministic and hard to debug.',
        'Sub-tasks that are too vague ("do the research") — workers flounder.',
        'No delegation cap — supervisor delegates forever, never finalises.'
      ],
      limitations: [
        'Delegation quality is bounded by the supervisor\'s reasoning (LLM) or rule coverage.',
        'A wrong delegation propagates: wrong worker produces wrong output, downstream agents build on it.',
        'Sub-task formulation is itself an LLM call — adds cost and latency.'
      ],
      relatedConcepts: ['Supervisor-Agent Architecture', 'Worker Agents', 'Shared State', 'Agent Communication'],
      faq: [
        { q: 'Rule-based or LLM-based delegation?', a: 'Start rule-based. Add LLM-based only for branches the rules cannot cover. Hybrid systems with rules for the main flow and LLM for exceptions are the most maintainable.' },
        { q: 'How do I know if my delegation logic is good?', a: 'Log every (state, worker, sub-task, output) tuple. Review traces of failed runs. If the supervisor picked the wrong worker, improve the rule or the LLM prompt; if the sub-task was bad, improve formulation.' }
      ],
      summary:
        'Task delegation is the supervisor\'s core act: assess state, pick a worker, formulate a focused sub-task, pass minimal inputs, dispatch, validate, integrate. Rule-based delegation is deterministic and easy to debug; LLM-based is flexible but non-deterministic. Most production systems hybridise. Pass minimal inputs to keep workers focused and cheap. Log every delegation for debugging.'
    },
    {
      id: 'conflict-resolution',
      title: 'Conflict Resolution',
      subtitle: 'When agents disagree — on facts, on approach, on the final answer — the system needs a way to decide.',
      tags: ['conflict', 'disagreement', 'multi-agent', 'debate'],
      readingMinutes: 6,
      definition:
        'Conflict resolution is the set of mechanisms a multi-agent system uses when agents produce contradictory outputs: two research agents return conflicting facts, the writer and verifier disagree on whether a claim is supported, two specialists propose different solutions. The mechanism picks a winner, merges, or escalates.',
      whyItExists:
        'In a multi-agent system, disagreement is inevitable — different prompts, different tools, different models produce different views. Without a resolution mechanism, conflicts silently corrupt the output: the supervisor picks the last writer\'s version, or the system produces an incoherent merge. Conflict resolution exists to make disagreement explicit and resolve it on purpose, with a traceable rationale.',
      howItWorks: [
        { type: 'h3', text: 'Detecting conflicts' },
        {
          type: 'ul',
          items: [
            'Schema-level: two agents write the same field with different values (the merge conflict).',
            'Semantic-level: two agents return claims that contradict each other (Research A says "X is true"; Research B says "X is false").',
            'Approach-level: two specialists propose different solutions to the same sub-problem.',
            'Quality-level: the verifier says the draft is wrong; the writer says it is right.'
          ]
        },
        { type: 'h3', text: 'Resolution strategies' },
        {
          type: 'table',
          headers: ['Strategy', 'How it works', 'When to use'],
          rows: [
            ['Last-write-wins', 'Most recent write supersedes', 'When recency implies correctness (live data)'],
            ['Confidence-weighted', 'Pick the output with higher confidence score', 'When agents report confidence'],
            ['Voting (majority)', 'N agents propose; majority wins', 'When you can run multiple independent agents'],
            ['Arbiter agent', 'A third agent judges the disagreement', 'High-stakes; needs reasoning over both views'],
            ['Debate', 'Agents argue for N rounds; supervisor decides', 'When the answer is genuinely unclear'],
            ['Escalate', 'Hand to a human or stronger model', 'When the system cannot resolve safely']
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'An arbiter agent resolves a disagreement between two researchers',
          code: `def resolve_conflict(claim_a: str, claim_b: str, source_a: str, source_b: str) -> dict:
    prompt = f"""Two research agents disagree. Pick the more reliable claim,
or merge if partially compatible. Return JSON.

Claim A: {claim_a}
Source A: {source_a}

Claim B: {claim_b}
Source B: {source_b}

Return: {{"winner": "A" | "B" | "merge", "rationale": str, "merged_claim": str | None}}"""
    return llm.invoke(prompt).parsed

result = resolve_conflict(
    claim_a="RISC-V adoption is growing fast",
    source_a="https://example.com/report-2024",
    claim_b="RISC-V adoption is plateauing",
    source_b="https://example.com/blog-2023",
)
# -> {"winner": "A", "rationale": "Source A is more recent (2024 vs 2023)", ...}`
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Silent conflicts are the worst failure mode',
          text: 'A system that silently picks one agent\'s output when two disagree produces wrong answers without anyone knowing. Always log conflicts and their resolution rationale. A high conflict rate is a signal that your agents are not well-aligned (overlapping roles, contradictory prompts) — root-cause it.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A research system runs three Research agents in parallel on the same question. Two say "RISC-V adoption is growing"; one says "it is plateauing". The supervisor detects the conflict (semantically different claims) and dispatches an Arbiter agent with all three claims and their sources. The Arbiter picks "growing" because two of three sources are 2024 reports and the dissenting source is a 2023 blog. The rationale is logged. The downstream Analysis agent proceeds with the resolved claim, not the raw disagreement.'
        }
      ],
      advantages: [
        'Makes disagreement explicit and resolves it on purpose.',
        'Logged rationales make the system auditable.',
        'Conflict rate is a useful diagnostic for agent alignment.'
      ],
      disadvantages: [
        'Resolution adds an extra LLM call (arbiter) — cost and latency.',
        'Debate strategies can loop without a cap.',
        'A bad arbiter produces bad resolutions consistently.'
      ],
      commonMistakes: [
        'Silent last-write-wins — the worst failure mode.',
        'No conflict detection — disagreements pass through as incoherent merges.',
        'Debate with no round cap — agents argue forever.',
        'Treating every conflict as escalable — floods human reviewers; reserve for high-stakes.'
      ],
      limitations: [
        'Arbiter agents can be biased (toward the first or last argument).',
        'Voting fails when agents are correlated (same model, similar prompts).',
        'Some conflicts reflect genuine ambiguity in the task — no resolution is "correct".'
      ],
      relatedConcepts: ['Shared State', 'Agent Communication', 'Failure Recovery', 'Specialist Agents'],
      faq: [
        { q: 'When should I escalate to a human?', a: 'When the stakes are high (legal, medical, financial), when the conflict reflects genuine ambiguity in the user\'s request, or when the system\'s confidence in any resolution is below threshold.' },
        { q: 'Majority vote or arbiter?', a: 'Majority vote for cheap, fast resolution when you can run independent agents. Arbiter for high-stakes when you need reasoning over the disagreement. They are complementary, not exclusive.' }
      ],
      summary:
        'Conflict resolution handles disagreements between agents — schema-level, semantic-level, approach-level, or quality-level. Strategies include last-write-wins, confidence-weighting, voting, arbiter agents, debate, and escalation. Silent conflicts are the worst failure mode — always log and rationale. A high conflict rate is a signal of mis-aligned agents; root-cause it rather than patching resolution.'
    },
    {
      id: 'failure-recovery',
      title: 'Failure Recovery',
      subtitle: 'Agents fail. Networks fail. The system must keep going — or fail gracefully with a useful report.',
      tags: ['failure', 'recovery', 'resilience', 'multi-agent'],
      readingMinutes: 7,
      definition:
        'Failure recovery is the set of mechanisms a multi-agent system uses when individual agents or the orchestration layer fails: retry, fallback to a different agent or model, partial completion, graceful degradation, or escalation. The goal is not to prevent failure (impossible) but to keep the system producing useful output when components fail.',
      whyItExists:
        'In a multi-agent system, failures multiply: a single agent failure can cascade through the supervisor and downstream agents, halting the whole system. Failure recovery exists to localise failures — one agent\'s error should not crash the system — and to provide clear paths forward (retry, fallback, degrade, escalate) instead of an opaque stack trace.',
      howItWorks: [
        { type: 'h3', text: 'Types of failure' },
        {
          type: 'ul',
          items: [
            'Agent output invalid — schema validation fails; the agent returned malformed JSON or wrong types.',
            'Agent output wrong — schema-valid but factually or logically wrong (verification fails).',
            'Agent crashed — exception, timeout, rate limit, network error.',
            'Supervisor stuck — routing loops, no progress, no termination.',
            'System crash — process died, state lost.'
          ]
        },
        { type: 'h3', text: 'Recovery strategies' },
        {
          type: 'table',
          headers: ['Failure type', 'Strategy', 'Fallback'],
          rows: [
            ['Transient error (rate limit, network)', 'Retry with exponential backoff, cap 3', 'Fail the agent after cap'],
            ['Invalid output (schema)', 'Re-prompt with the validation error, cap 2', 'Escalate to stronger model'],
            ['Wrong output (verification fails)', 'Replan; dispatch with the correction', 'Escalate to human'],
            ['Agent crashed', 'Catch exception; retry once', 'Skip the agent; degrade gracefully'],
            ['Supervisor stuck (no progress)', 'Force finalize with partial result', 'Escalate to human'],
            ['System crash', 'Persist state after each step; resume from checkpoint', 'Restart from last checkpoint']
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A recovery wrapper around an agent call',
          code: `import time
from tenacity import retry, stop_after_attempt, wait_exponential

class AgentFailed(Exception):
    pass

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
def call_with_retry(agent, inputs):
    try:
        raw = agent.invoke(inputs)
        return validate_output(agent.role, raw)   # raises on schema failure
    except ValidationError as e:
        # Re-prompt with the error so the agent can correct itself
        inputs["__validation_error__"] = str(e)
        raise   # tenacity will retry; raises AgentFailed after cap
    except (RateLimitError, TimeoutError) as e:
        raise   # transient; tenacity retries with backoff

# Usage in the supervisor
try:
    output = call_with_retry(workers[next_worker], worker_input)
except AgentFailed:
    # Fallback: try a stronger model on the same sub-task
    output = call_with_retry(stronger_fallback_worker, worker_input)`
        },
        {
          type: 'callout',
          variant: 'danger',
          title: 'Persistence is non-negotiable for long-running systems',
          text: 'A multi-agent system that holds state in memory will lose it on crash. For any task that runs more than a few seconds, persist the shared state after every agent write — to a database, not a file. Recovery then means "resume from the last checkpoint", not "restart from scratch".'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A report-writing system is mid-run when the Analysis agent times out. Recovery: the supervisor catches the timeout, retries Analysis once with a longer timeout, and if it fails again, falls back to a simpler Analysis prompt that produces a shorter structured summary. The pipeline continues with the degraded analysis. The final report includes a note: "Analysis was simplified due to a transient failure; full analysis pending." The user gets a useful artifact instead of an opaque error.'
        }
      ],
      advantages: [
        'Localises failures — one agent\'s error does not crash the system.',
        'Provides clear paths forward instead of opaque stack traces.',
        'Persistence enables resumption after crashes, not restart-from-scratch.'
      ],
      disadvantages: [
        'Adds code and complexity to every agent call.',
        'Retries multiply cost; caps must be tuned to avoid runaway.',
        'Degraded output may be worse than no output in some domains.'
      ],
      commonMistakes: [
        'No retry on transient errors — system fails on the first rate-limit.',
        'No retry cap — infinite retry loops.',
        'No persistence — long-running tasks restart from scratch on crash.',
        'Treating "wrong output" like "crashed output" — they need different recovery paths.'
      ],
      limitations: [
        'Recovery cannot fix a fundamentally broken agent (bad prompt, bad tools).',
        'Degraded output may be wrong in ways the user cannot detect.',
        'Cross-agent rollback (undoing N writes when one fails) is hard; usually you degrade instead.'
      ],
      relatedConcepts: ['Conflict Resolution', 'Supervisor-Agent Architecture', 'Planning and Replanning', 'Agent Termination'],
      faq: [
        { q: 'How many retries?', a: '2–3 for transient errors with exponential backoff. More than that and you are usually papering over a structural problem.' },
        { q: 'Should the system always try to recover, or sometimes just fail?', a: 'For low-stakes tasks, recover aggressively (degrade, retry, fallback). For high-stakes tasks (legal, medical), fail fast and escalate to a human — degraded wrong output can be worse than no output.' }
      ],
      summary:
        'Failure recovery keeps a multi-agent system producing useful output when components fail. Failure types: invalid output, wrong output, agent crash, supervisor stuck, system crash. Strategies: retry with backoff, re-prompt with the error, replan, fallback to a stronger model, degrade gracefully, escalate. Persistence (write state after every agent step) is non-negotiable for long-running systems. Distinguish transient from structural failure — retry the former, root-cause the latter.'
    },
    {
      id: 'cost-latency-tradeoffs',
      title: 'Cost and Latency Trade-offs',
      subtitle: 'Multi-agent is expensive. Decide deliberately what you are willing to pay for what you get.',
      tags: ['cost', 'latency', 'performance', 'multi-agent'],
      readingMinutes: 7,
      definition:
        'Cost and latency trade-offs are the engineering decisions that determine how much a multi-agent system costs per task (in tokens and dollars) and how long it takes (wall-clock latency). Multi-agent systems are inherently more expensive than single-agent ones — more LLM calls, more orchestration — and the trade-offs must be made deliberately, not accidentally.',
      whyItExists:
        'A naive 5-agent system can cost 10× a single-agent baseline and take 5× as long, with no improvement in output quality. Without explicit cost/latency analysis, teams ship demos that work in a demo and bleed money in production. The trade-off framework exists to make these decisions visible: what does each agent cost, what does each parallel branch save, what model tier is really needed for each role?',
      howItWorks: [
        { type: 'h3', text: 'Cost drivers' },
        {
          type: 'ul',
          items: [
            'Number of LLM calls per task — every agent and every supervisor routing decision is a call.',
            'Tokens per call — system prompt + history + inputs + output, summed across all calls.',
            'Model tier per call — GPT-4-class is 10–30× more expensive per token than GPT-4o-mini-class.',
            'Retries and replanning — every failure doubles the cost of that step.',
            'Concurrency overhead — parallel agents may pay rate-limit surcharges or require higher tiers.'
          ]
        },
        { type: 'h3', text: 'Latency drivers' },
        {
          type: 'ul',
          items: [
            'Sequential agent hops — each hop is an LLM call with its own first-token latency.',
            'Parallel branches — latency is max of branches (good) but you pay all of them (bad for cost).',
            'Tool latency — web search, DB queries, code execution add wall-clock time per agent.',
            'Supervisor routing — an LLM-driven supervisor adds a routing call between every worker.',
            'Retries — each retry adds another full agent-call latency.'
          ]
        },
        {
          type: 'table',
          headers: ['Lever', 'Cost impact', 'Latency impact', 'Quality impact'],
          rows: [
            ['Fewer agents (merge roles)', '↓↓', '↓↓', '↓ (less specialisation)'],
            ['Cheaper model for some roles', '↓↓', '↓', '↓ or → (if role is simple)'],
            ['Parallel vs sequential', '→ (same total work)', '↓↓ (max vs sum)', '→'],
            ['Cache supervisor routing decisions', '↓', '↓', '→'],
            ['Reduce retrieved memory per call', '↓', '↓', '↓ or →'],
            ['Skip verification on low-risk outputs', '↓', '↓', '↓ (riskier)']
          ]
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Estimating cost and latency before building',
          code: `# Cost model: tokens * price_per_token, summed across all calls
estimator = CostEstimator(
    agents=[
        ("research",    model="gpt-4o",      calls=1, tokens_per_call=4000),
        ("analysis",    model="gpt-4o",      calls=1, tokens_per_call=3000),
        ("writing",     model="gpt-4o",      calls=1, tokens_per_call=2500),
        ("verification",model="gpt-4o-mini", calls=1, tokens_per_call=2000),  # cheaper role
        ("supervisor",  model="gpt-4o-mini", calls=4, tokens_per_call=500),    # routing calls
    ],
    parallel_branches={"research"},  # only research can parallelise
)

# Expected per-task
print(estimator.cost_per_task())     # $0.012
print(estimator.latency_p50())       # 8.5s
print(estimator.latency_p95())       # 14s  (retries on slowest branch)

# Compare to single-agent baseline
baseline = CostEstimator(agents=[("single", "gpt-4o", calls=1, 8000)])
print(baseline.cost_per_task())      # $0.024  -- multi-agent is HALF the cost?`
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Cheaper models on simple roles often win',
          text: 'A common surprise: routing simple roles (verification, routing, triage) to a cheaper model can make a multi-agent system CHEAPER than a single-agent baseline that uses an expensive model for everything. The multi-agent system uses the expensive model only where it matters. This is one of the few cases where multi-agent is strictly better on cost AND quality.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A report-writing task: single-agent baseline uses GPT-4o for everything (8k tokens, $0.024, 12s). Multi-agent: Research (GPT-4o, 4k), Analysis (GPT-4o, 3k), Writing (GPT-4o, 2.5k), Verification (GPT-4o-mini, 2k), Supervisor routing (GPT-4o-mini, 4×500). Total: $0.012, 8.5s. The multi-agent version is half the cost and 30% faster because (a) verification and routing use a cheaper model, (b) research runs in parallel with nothing (it is the first step), (c) each agent\'s prompt is focused so output is more concise. This is the win — but only because the roles are well-matched to model tiers.'
        }
      ],
      advantages: [
        'Forces deliberate trade-offs instead of accidental cost overruns.',
        'Reveals where cheaper models can substitute — often the biggest lever.',
        'Lets you compare multi-agent vs single-agent on numbers, not vibes.'
      ],
      disadvantages: [
        'Estimates are noisy — actual cost depends on retry rate and output length.',
        'Model prices change; the analysis needs periodic refresh.',
        'Quality is hard to put on the same axis as cost and latency.'
      ],
      commonMistakes: [
        'Using one expensive model for every role — pays for capability you do not need.',
        'No retries — single transient failure doubles cost via user-facing error handling.',
        'Sequential where parallel would help — pays sum-of-latencies for independent work.',
        'No persistence — a crash mid-task means re-paying the full cost from scratch.'
      ],
      limitations: [
        'Latency has a floor (first-token latency of the LLM) you cannot beat.',
        'Cost has a floor (one LLM call) you cannot beat — for trivial tasks, single-agent wins.',
        'Quality improvements from multi-agent are real but hard to quantify in dollars.'
      ],
      relatedConcepts: ['When Multiple Agents Are Useful', 'Parallel Execution', 'Failure Recovery'],
      faq: [
        { q: 'How do I know if multi-agent is worth it?', a: 'Build a cost/latency estimate upfront, build a single-agent baseline, and measure both on a held-out set. If multi-agent is cheaper or faster at equal quality, ship it. If it is more expensive at equal quality, do not — the burden of proof is on multi-agent.' },
        { q: 'What\'s the single biggest cost lever?', a: 'Model tier per role. Routing simple roles (verification, routing, triage, formatting) to a cheap model is often a 50–80% cost reduction with no quality loss on those roles.' }
      ],
      summary:
        'Multi-agent systems cost more and take longer than single-agent baselines — unless you design the trade-offs deliberately. Cost drivers: number of calls, tokens per call, model tier per role, retries. Latency drivers: sequential hops, parallel branches (max vs sum), tool latency, supervisor routing. The biggest lever is model tier per role: cheap models on simple roles (verification, routing) can make multi-agent CHEAPER than a single-agent baseline that uses an expensive model for everything. Always estimate cost and latency upfront and compare to a single-agent baseline.'
    }
  ]
}
