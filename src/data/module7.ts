import type { Module } from './types'

export const module7: Module = {
  id: 'm7',
  index: 7,
  title: 'Types of AI Agents',
  shortTitle: 'AI Agents',
  description:
    'A taxonomy of the agents you will actually build or deploy: from reactive rule-followers and goal-based planners to LLM-powered, tool-using, research, coding, browser, voice, workflow, autonomous, and multi-agent supervisor-worker systems. Learn what each one is good at, where it breaks, and how to choose between them.',
  level: 'Intermediate',
  icon: 'Users',
  color: 'from-amber-500 to-orange-500',
  quizId: 'q7',
  lessons: [
    {
      id: 'reactive-agents',
      title: 'Reactive Agents',
      subtitle: 'The simplest agent: stimulus → response, no internal model of the world.',
      tags: ['agents', 'reactive', 'fundamentals'],
      readingMinutes: 6,
      definition:
        'A reactive agent maps its current percept directly to an action using a fixed condition-action policy. It keeps no history, builds no world model, and does not deliberate about the future. Its intelligence is entirely in the hand-authored (or learned) rules that link percepts to actions.',
      whyItExists:
        'Reactive agents exist because for many real-time control problems — a thermostat, a collision-avoidance reflex, a spam rule — the cheapest reliable solution is a direct mapping. Maintaining an internal model and planning would add latency, memory, and failure modes that the task does not need. Reactive agents are the right tool when the environment is simple enough that the current percept determines the correct action.',
      howItWorks: [
        {
          type: 'p',
          text: 'A reactive agent has three components: (1) a sensor that produces the current percept, (2) a policy (lookup table, decision tree, or rule set) that maps percepts to actions, and (3) an actuator that executes the chosen action. The classic textbook example is the simple vacuum-cleaner agent: if the current square is dirty, suck; otherwise move to the other square. No memory, no plan, no goal representation beyond what the rules already encode.'
        },
        {
          type: 'p',
          text: 'Reactive agents are descended from Rodney Brooks\' subsumption architecture (1986), which argued that intelligent behaviour could emerge from layered reactive rules without any central world model. The Roomba is a direct commercial descendant. Modern descendants include circuit breakers, feature-flag auto-rolls, alerting thresholds, and the "reflex" layer of hybrid robotic stacks that runs faster than the planning layer.'
        },
        { type: 'h3', text: 'When reactivity is enough' },
        {
          type: 'ul',
          items: [
            'The correct action is a function of the current percept only (Markov property holds).',
            'Latency budgets are tight (milliseconds) — no time to deliberate.',
            'The environment is bounded and well-specified.',
            'Failure of the rule is acceptable or easily overridden by a human.'
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Reactive is not "dumb"',
          text: 'A reactive agent can be very sophisticated if its rule set is large or learned. A trained CNN that maps camera frames to steering angles is reactive: it has no memory of past frames and no plan, yet it drives. The defining feature is "no internal state used to choose the action" — not "simple".'
        }
      ],
      examples: [
        { type: 'p', text: 'A thermostat is the canonical reactive agent. Percept: current temperature. Rule: if temperature < target, turn heater on; if temperature ≥ target, turn heater off. It cannot reason about the weather forecast or the cost of electricity — and for most rooms, it does not need to.' },
        {
          type: 'code',
          lang: 'python',
          caption: 'A reactive vacuum-cleaner agent',
          code: `def reactive_vacuum(percept):
    location, status = percept
    if status == "dirty":
        return "suck"
    if location == "A":
        return "right"
    return "left"

# No memory, no plan, no goal stack.
# The policy is a pure function of the current percept.
while True:
    percept = sensors.read()
    action = reactive_vacuum(percept)
    actuators.execute(action)`
        }
      ],
      advantages: [
        'Lowest latency and compute cost of any agent type.',
        'Easy to verify, test, and certify — useful in safety-critical domains.',
        'No planning means no risk of choosing a catastrophically wrong long-term plan.'
      ],
      disadvantages: [
        'Cannot handle environments where the current percept is insufficient (e.g. requires memory of past states).',
        'Cannot pursue goals that require multi-step plans.',
        'Rules do not generalise to unseen situations.',
        'Rule sets grow unmanageably large as the environment becomes more complex.'
      ],
      commonMistakes: [
        'Calling an LLM chatbot a "reactive agent" — it has no sensors, no actuators, and no policy in this sense.',
        'Adding reactive rules when the underlying problem actually needs planning (you end up with hundreds of patches).',
        'Forgetting to bound inputs — a reactive controller fed garbage sensor data will happily act on it.'
      ],
      limitations: [
        'Fails when the world is partially observable and history matters.',
        'Cannot reason about future consequences beyond what the rules encode.',
        'Brittle under distribution shift; cannot adapt without a human rewriting the rules.'
      ],
      relatedConcepts: ['Subsumption Architecture', 'Reflex Agents', 'Markov Property', 'Hybrid Agents'],
      faq: [
        { q: 'Is a spam filter a reactive agent?', a: 'Yes, in this taxonomy. Percept (email features) → action (spam/ham) via a learned policy. It has no memory of past emails and no plan.' },
        { q: 'Why study reactive agents when LLM agents exist?', a: 'Because reactivity is still the right choice for millions of high-throughput, low-latency decisions. A bank\'s fraud-block rule cannot wait two seconds for an LLM.' }
      ],
      summary:
        'Reactive agents map percepts directly to actions with no internal model or plan. They are the cheapest, fastest, most verifiable agent type — and the right choice whenever the current percept alone determines the correct action. They fail when the environment needs memory, planning, or generalisation.'
    },
    {
      id: 'goal-based-agents',
      title: 'Goal-Based Agents',
      subtitle: 'Agents that maintain a goal and select actions that move toward it.',
      tags: ['agents', 'goal-based', 'planning'],
      readingMinutes: 7,
      definition:
        'A goal-based agent maintains an explicit representation of a desired state (the goal) and selects actions it believes will move the current state closer to that goal. Unlike a reactive agent, it reasons about the future effect of its actions, not just the current percept.',
      whyItExists:
        'Reactive agents break the moment the right action depends on the goal, not just the percept. A vacuum cleaner that must visit both rooms before docking needs to remember where it has been and what remains to be done. Goal-based agents exist to handle tasks where progress is measured against a target state, not against an immediate stimulus.',
      howItWorks: [
        {
          type: 'p',
          text: 'A goal-based agent adds two things to the reactive loop: an internal state (what it believes about the world) and a goal (what it wants to achieve). On each cycle it (1) updates its internal state from the percept, (2) checks whether the goal is satisfied, and if not, (3) selects an action whose predicted effect moves the state closer to the goal. The selection rule can be as simple as a hand-coded heuristic or as complex as a learned value function.'
        },
        { type: 'h3', text: 'Goal representation' },
        {
          type: 'p',
          text: 'Goals come in three flavours. Achievement goals are predicates the agent wants to make true ("the package is at the customer\'s door"). Maintenance goals are predicates the agent wants to keep true ("the reactor temperature stays below 90 °C"). Optimisation goals are objectives to minimise or maximise ("minimise fuel consumed while reaching the destination"). Most production agents combine all three.'
        },
        { type: 'h3', text: 'Goal-based vs utility-based' },
        {
          type: 'p',
          text: 'A pure goal-based agent is satisfied by any sequence that reaches the goal — it does not distinguish between a 5-step plan and a 50-step plan if both succeed. A utility-based agent goes further: it assigns a numeric score to outcomes and picks the action sequence that maximises expected utility. In practice, every modern "goal-based" agent is at least weakly utility-based because it ranks candidate plans by cost or length.'
        },
        {
          type: 'table',
          headers: ['Aspect', 'Reactive', 'Goal-Based'],
          rows: [
            ['Internal state', 'None', 'Yes — current world belief'],
            ['Goal', 'Implicit in rules', 'Explicit representation'],
            ['Selects action by', 'Direct percept→action map', 'Predicted progress toward goal'],
            ['Handles partial observability', 'No', 'Yes, with state estimation'],
            ['Typical cost', 'Microseconds', 'Milliseconds to seconds']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'A package-delivery drone is goal-based. Its goal is "package delivered to (lat, lon)". Its internal state includes its GPS position, battery level, and wind estimate. On each cycle it picks the action (fly north, hover, land) that most reduces expected distance to the goal without violating the maintenance goal "battery > 20% to return home".' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Goal-based loop with a heuristic action selector',
          code: `def goal_based_agent(state, goal, actions, predict):
    if goal_satisfied(state, goal):
        return "done"
    # Rank candidate actions by predicted progress toward the goal
    best, best_score = None, -float("inf")
    for a in actions:
        next_state = predict(state, a)
        score = -goal_distance(next_state, goal)  # higher = closer
        # Penalise actions that violate maintenance goals
        if not maintenance_ok(next_state):
            score -= 1e6
        if score > best_score:
            best, best_score = a, score
    return best

state = initial_state()
while True:
    percept = sensors.read()
    state = update_belief(state, percept)
    action = goal_based_agent(state, goal, ACTIONS, predict)
    if action == "done":
        break
    actuators.execute(action)`
        }
      ],
      advantages: [
        'Can pursue multi-step objectives that reactive agents cannot express.',
        'Explicit goals make behaviour inspectable and adjustable.',
        'Naturally supports replanning when the world changes mid-task.'
      ],
      disadvantages: [
        'Requires a world model (the predict function) — wrong model, wrong actions.',
        'Slower than reactive agents because it evaluates candidate actions.',
        'Goal specification is hard: an agent optimises exactly what you ask, including side effects you did not think to forbid.'
      ],
      commonMistakes: [
        'Forgetting maintenance goals — the agent reaches the achievement goal but tramples a constraint (drone arrives with 1% battery).',
        'Trusting the world model outside its calibrated range.',
        'Setting a goal that is too coarse ("deliver the package") vs. too narrow ("deliver the package in under 30 minutes for under $2").'
      ],
      limitations: [
        'Quality of behaviour is bounded by the quality of the world model.',
        'Does not inherently optimise across multiple competing goals — needs a utility layer for that.',
        'Goal selection itself is external; the agent does not choose its own goals.'
      ],
      relatedConcepts: ['Utility-Based Agents', 'Belief State', 'Maintenance Goals', 'Model-Based Agents'],
      faq: [
        { q: 'Is an LLM agent goal-based?', a: 'A typical LLM agent is goal-based: its goal is the user\'s task, its "world model" is the tool-result history, and its action selection is the model\'s next-tool-call. The "world model" is implicit in the LLM weights, not hand-coded.' },
        { q: 'What if two goals conflict?', a: 'You need a utility function that trades them off (utility-based agent) or a priority scheme that hard-gates lower-priority goals behind higher ones.' }
      ],
      summary:
        'Goal-based agents keep an explicit goal and an internal world state, then pick actions predicted to move toward the goal. They are the minimum viable agent for any task that requires more than reflex — and the substrate on which planning agents are built.'
    },
    {
      id: 'planning-agents',
      title: 'Planning Agents',
      subtitle: 'Agents that project action sequences into the future before acting.',
      tags: ['agents', 'planning', 'search'],
      readingMinutes: 8,
      definition:
        'A planning agent constructs (or searches for) a sequence of actions — a plan — that is predicted to transform the current state into a goal state, then executes it. Unlike a purely goal-based agent that picks one action at a time, a planning agent commits to a multi-step trajectory and re-plans when reality diverges from prediction.',
      whyItExists:
        'For problems where individual greedy actions get stuck in local minima (a maze, a logistics schedule, a Rubik\'s cube), short-horizon action selection is not enough. Planning exists to reason several steps ahead, detect dead-ends, and commit to a coherent sequence rather than improvising step by step. It is the bridge between reactive control and deliberative intelligence.',
      howItWorks: [
        {
          type: 'p',
          text: 'A classical planner works in a formal state space: a set of states S, a successor function succ(s) that returns the states reachable in one action, a goal test g(s), and a step cost c(s, a, s\'). It searches the space (DFS, BFS, Dijkstra, A*, Monte-Carlo tree search) for a sequence of actions whose predicted trajectory ends in a goal state, then executes the first action and re-plans (or follows the cached plan with monitoring).'
        },
        { type: 'h3', text: 'Classical vs. reactive planning' },
        {
          type: 'p',
          text: 'Classical (deliberative) planning commits to a full sequence up front and re-plans only on failure. Reactive planning interleaves search and execution tightly: the agent searches a short horizon, takes one step, searches again. HTN (Hierarchical Task Network) planners decompose high-level tasks into subtasks recursively. Modern LLM agents typically do reactive planning with a horizon of one tool-call and a natural-language plan in their context.'
        },
        { type: 'h3', text: 'The plan-execute-monitor loop' },
        {
          type: 'ol',
          items: [
            'Observe the current state.',
            'Search for a plan from current state to goal.',
            'Execute the first action of the plan.',
            'Observe the resulting state; compare with the prediction.',
            'If the prediction was wrong or a better plan exists, re-plan; otherwise continue.'
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'The frame problem',
          text: 'In a real environment, most things change while you execute the plan. A planner must decide which facts to assume unchanged (the frame) and which to re-check. Miss a relevant change and the plan executes into a wall. Modern planners handle this by replanning frequently and keeping plans short.'
        }
      ],
      examples: [
        { type: 'p', text: 'A warehouse robot that needs to fetch three items from three shelves and bring them to a packing station. Greedy "go to nearest item" gets stuck cycling between shelves; an A* planner over the (robot_position, items_remaining) state space produces a short detour-free route and updates it each time a human walks into the aisle.' },
        {
          type: 'code',
          lang: 'python',
          caption: 'A* search over an explicit state space',
          code: `import heapq

def a_star(start, goal, succ, h):
    """succ(s) -> list of (action, next_state, cost). h(s) -> admissible heuristic."""
    frontier = [(h(start), 0, start, [])]      # (f, g, state, path)
    best = {start: 0}
    while frontier:
        f, g, s, path = heapq.heappop(frontier)
        if goal(s):
            return path                          # sequence of actions
        if g > best.get(s, 1e18):
            continue
        for action, s2, c in succ(s):
            g2 = g + c
            if g2 < best.get(s2, 1e18):
                best[s2] = g2
                heapq.heappush(frontier, (g2 + h(s2), g2, s2, path + [action]))
    return None  # no plan exists

plan = a_star(start_state, is_goal, successors, heuristic)
for action in plan:
    if world_changed():
        plan = a_star(world_state(), is_goal, successors, heuristic)  # replan
    execute(action)`
        }
      ],
      advantages: [
        'Solves problems that defeat greedy action selection (mazes, scheduling, multi-step puzzles).',
        'Plans are inspectable artefacts — humans can review them before execution.',
        'Naturally supports hard constraints and cost optimisation.'
      ],
      disadvantages: [
        'State-space explosion: the search tree grows exponentially with horizon and branching factor.',
        'Requires a transition model — wrong model = wrong plan.',
        'Planning latency can dominate; real-time control often cannot afford full replanning.'
      ],
      commonMistakes: [
        'Planning too far ahead in a stochastic environment (the plan is invalidated by the first unexpected event).',
        'Using a non-admissible heuristic with A* — the planner returns suboptimal (or wrong) plans.',
        'Confusing "the agent can plan" with "the agent understands" — planning is search over a model, not comprehension.'
      ],
      limitations: [
        'Pure classical planning assumes a deterministic, fully observable world — rarely true.',
        'Search cost is exponential in the worst case; even good heuristics only delay the wall.',
        'Does not learn — the same dead-end is hit every time unless the planner is augmented with learning.'
      ],
      relatedConcepts: ['A* Search', 'Monte-Carlo Tree Search', 'HTN Planning', 'Replanning', 'Frame Problem'],
      faq: [
        { q: 'How is LLM "planning" different from classical planning?', a: 'LLM planning is informal: the model emits a natural-language sequence of intended tool calls. It has no formal state-space guarantee and can hallucinate impossible steps. Classical planners are formal but narrow. Modern agent frameworks combine both: an LLM proposes, a formal planner validates.' },
        { q: 'When should I use MCTS vs A*?', a: 'A* when you have a good admissible heuristic and a small branching factor. MCTS when the branching factor is huge (games like Go) and you can sample rollouts.' }
      ],
      summary:
        'Planning agents search the future: they project action sequences, pick one that reaches the goal, execute it, and replan when reality diverges. They solve problems that defeat greedy agents, at the cost of a world model and exponential search. Modern LLM agents do a soft version of this with natural-language plans.'
    },
    {
      id: 'llm-powered-agents',
      title: 'LLM-Powered Agents',
      subtitle: 'Agents whose reasoning, action selection, and memory are driven by a large language model.',
      tags: ['agents', 'llm', 'reasoning'],
      readingMinutes: 8,
      definition:
        'An LLM-powered agent uses a large language model as its reasoning engine: it reads the user\'s goal and the running tool-call history as a prompt, and emits either a final answer or the next action (typically a tool call). The LLM replaces the hand-coded policy and world model of classical agents with a learned, general-purpose one.',
      whyItExists:
        'Hand-coded agent policies do not generalise. Every new task needs new rules; every new environment needs a new model. LLMs, trained on internet-scale text and code, expose a single interface — natural language — that can be repurposed for any task you can describe. The LLM-powered agent exists because the LLM is the first general-purpose substrate for "understand the goal, decide the next step" that does not require per-task engineering.',
      howItWorks: [
        {
          type: 'p',
          text: 'The canonical loop is ReAct (Reason + Act). On each step the agent constructs a prompt containing: the system instructions, the user task, the conversation history, the list of available tools with their schemas, and the running scratchpad of past thoughts and tool results. The LLM emits a structured tool call (or a final answer); the framework executes the tool, appends the result to the scratchpad, and loops until the LLM emits a final answer or a stop condition fires.'
        },
        {
          type: 'diagram',
          diagramId: 'llm-agent-react-loop',
          caption: 'The ReAct loop: prompt → LLM → tool call → observation → repeat.'
        },
        { type: 'h3', text: 'What the LLM replaces' },
        {
          type: 'ul',
          items: [
            'The policy — "given state, which action?" — is now the LLM\'s next-token prediction.',
            'The world model — "what happens if I call this tool?" — is implicit in the LLM weights.',
            'The plan — "what is my next sub-goal?" — is the LLM\'s chain of thought.',
            'The natural-language interface — "do X" — is parsed by the LLM, not by code.'
          ]
        },
        { type: 'h3', text: 'The four pillars of an LLM agent' },
        {
          type: 'p',
          text: 'A production LLM agent is more than a prompt loop. It typically has: (1) a model — the LLM itself; (2) tools — functions the LLM can call; (3) memory — short-term (the scratchpad / context window) and long-term (a vector store of past interactions); (4) orchestration — the framework that runs the loop, enforces limits, and handles errors. Weakness in any pillar produces a broken agent, regardless of how good the LLM is.'
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The context window is the agent\'s working memory',
          text: 'Everything the agent "knows" about the current task must fit in the context window. Long tasks overflow it; the fix is summarisation, retrieval, or external scratchpad storage. This is the single biggest difference between LLM agents and classical agents — the latter have unbounded RAM, the former pay token-cost for every byte of working memory.'
        }
      ],
      examples: [
        { type: 'p', text: 'A travel-planning agent receives "plan a 5-day trip to Tokyo for two under $3000 in November." It calls a flights_search tool, a hotels_search tool, a weather_lookup tool, and an itinerary_builder tool in sequence, reading each result back into its context. After 8 tool calls it returns a structured day-by-day plan with links to bookings.' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'Minimal ReAct agent loop',
          code: `const tools = [searchFlights, searchHotels, getWeather, buildItinerary];
const toolSchemas = tools.map(t => t.jsonSchema);

let messages = [
  { role: "system", content: SYSTEM_PROMPT },
  { role: "user",   content: "Plan a 5-day Tokyo trip under $3000 in November." },
];

for (let step = 0; step < MAX_STEPS; step++) {
  const resp = await llm.chat({
    model: "gpt-4o",
    messages,
    tools: toolSchemas,
  });
  if (resp.finish_reason === "stop") {
    return resp.content;                      // final answer
  }
  // The model emitted one or more tool calls
  messages.push(resp.message);
  for (const call of resp.message.tool_calls) {
    const fn = tools.find(t => t.name === call.function.name);
    const args = JSON.parse(call.function.arguments);
    const result = await fn.run(args);
    messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
  }
}
throw new Error("Agent did not finish within step budget");`
        }
      ],
      advantages: [
        'Generalises across tasks you never anticipated — describe the task in language.',
        'No per-task policy engineering; the LLM is the policy.',
        'Natural-language interface lowers the barrier for non-developer users.',
        'Can explain its reasoning in the same language it acts in.'
      ],
      disadvantages: [
        'Non-deterministic: same input can produce different trajectories.',
        'Latency and cost: each step is a model call; long tasks cost dollars and seconds.',
        'Hallucinations propagate — a fabricated tool result can derail the whole task.',
        'Context window limits force summarisation that loses information.'
      ],
      commonMistakes: [
        'Giving the agent too many tools — the LLM picks poorly when the tool list is huge.',
        'Not capping the step budget — a stuck agent will loop until you run out of money.',
        'Trusting chain-of-thought as ground truth — it is a generated explanation, not a transcript of actual reasoning.',
        'Putting secrets in prompts that get logged or sent to telemetry.'
      ],
      limitations: [
        'Quality is bounded by the LLM; a weak model produces a weak agent regardless of orchestration.',
        'Long-horizon tasks (>20 steps) drift; the agent forgets earlier sub-goals.',
        'No formal guarantee of correctness, termination, or safety.'
      ],
      relatedConcepts: ['ReAct', 'Chain-of-Thought', 'Tool Use', 'Memory', 'Agent Orchestration'],
      faq: [
        { q: 'Is an LLM chatbot an "agent"?', a: 'A plain chatbot with no tools and no loop is not an agent in this taxonomy — it has no actuators and no goal pursuit. Add a single tool and a loop and it becomes the simplest LLM agent.' },
        { q: 'Why do my agents loop forever?', a: 'Usually: too few or too many tools, unclear stop condition, no step cap, or a tool that returns errors the LLM cannot interpret. Add a hard MAX_STEPS, log every step, and inspect the trace.' }
      ],
      summary:
        'An LLM-powered agent uses the LLM as policy, world model, and planner in one. The ReAct loop — prompt, model call, tool execution, observation, repeat — is the dominant pattern. Its superpower is generality; its weaknesses are cost, latency, hallucination, and the context-window working-memory limit.'
    },
    {
      id: 'tool-using-agents',
      title: 'Tool-Using Agents',
      subtitle: 'Agents that extend their capability by calling external functions, APIs, and code.',
      tags: ['agents', 'tools', 'function-calling'],
      readingMinutes: 7,
      definition:
        'A tool-using agent is any agent — reactive, goal-based, planning, or LLM-powered — that can invoke external functions (tools) to sense or affect the world beyond what its core model can do alone. Tools turn an LLM from a "text in, text out" function into a system that can fetch data, run code, query databases, and act on the results.',
      whyItExists:
        'No model can do everything internally. An LLM cannot fetch today\'s stock price, run Python to compute a factorial, query your private database, or send an email — and even if it could, you would not want it to, because deterministic external tools are auditable, cheap, and correct. Tools exist to push the deterministic parts of a task out of the probabilistic model and into code you control.',
      howItWorks: [
        {
          type: 'p',
          text: 'A tool is a named function with a JSON Schema describing its arguments and return type. The agent loop presents the tool list to the LLM; on each step the LLM either responds with text or emits a structured tool call. The orchestrator parses the call, validates the arguments against the schema, executes the function, and feeds the result back as a "tool" message. The LLM then decides whether to call another tool or to answer.'
        },
        { type: 'h3', text: 'Categories of tools' },
        {
          type: 'table',
          headers: ['Category', 'Read / Write', 'Examples'],
          rows: [
            ['Retrieval', 'Read', 'Web search, vector DB lookup, file read'],
            ['Computation', 'Read', 'Calculator, Python interpreter, SQL query'],
            ['Communication', 'Write', 'Send email, post to Slack, open a ticket'],
            ['Action', 'Write', 'Create a file, deploy code, make a payment'],
            ['Sensing', 'Read', 'Get current time, GPS, sensor reading'],
            ['Verification', 'Read', 'Run unit tests, lint code, type-check']
          ]
        },
        { type: 'h3', text: 'Q-in-Q tool use' },
        {
          type: 'p',
          text: 'A subtle pattern: the LLM is asked a question whose answer requires another question. "What is the GDP of the country whose capital is Lima?" The agent must first call a tool to identify Lima as Peru\'s capital, then call a GDP tool with country=Peru, then answer. This is "question-in-question" tool use. It is what distinguishes a tool-using agent from a chatbot that has tools bolted on: the agent chains tool calls where each call\'s arguments depend on the previous call\'s output.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Write tools need gates',
          text: 'A read tool (search, lookup) is safe to call autonomously. A write tool (send email, deploy code, make a payment) needs explicit human approval, a permission scope, or a sandbox. Treat the read/write distinction as a security boundary in your agent design.'
        }
      ],
      examples: [
        { type: 'p', text: 'A code-review agent has three tools: get_pr_diff, run_tests, post_comment. It calls get_pr_diff to read the change, run_tests to verify the build, and post_comment to leave a review. Without tools, the agent could only summarise the diff in text; with tools, it can actually validate the change against the CI system.' },
        {
          type: 'code',
          lang: 'json',
          caption: 'A minimal tool definition (JSON Schema)',
          code: `{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "Get current weather for a city. Use when the user asks about weather, temperature, or precipitation.",
    "parameters": {
      "type": "object",
      "properties": {
        "city": { "type": "string", "description": "City name, e.g. \\"Tokyo\\" or \\"São Paulo\\"" },
        "units": { "type": "string", "enum": ["celsius", "fahrenheit"], "default": "celsius" }
      },
      "required": ["city"],
      "additionalProperties": false
    }
  }
}`
        }
      ],
      advantages: [
        'Extends the agent with arbitrary capabilities the base model lacks.',
        'Deterministic tools are auditable and testable — unlike LLM-internal reasoning.',
        'Same agent can target new domains by adding tools, not retraining the model.',
        'Lets you keep secrets and side effects in code you control, not in the prompt.'
      ],
      disadvantages: [
        'Every tool is an attack surface — malicious arguments, side effects, leaks.',
        'Tool-call latency dominates total response time on multi-step tasks.',
        'Tool overload: too many tools degrade LLM selection accuracy.',
        'Tool errors must be surfaced as useful messages or the agent loops.'
      ],
      commonMistakes: [
        'Giving the LLM tools without a description that says *when* to use them — selection accuracy collapses.',
        'Letting write tools run without approval — agents will email the wrong person eventually.',
        'Returning raw 50 KB JSON blobs as tool results — the LLM token budget evaporates.',
        'Not idempotency-designing write tools — a retry can double-charge a customer.'
      ],
      limitations: [
        'The LLM cannot use a tool it does not understand from the description.',
        'Tool schemas with deep nested objects are mis-serialised frequently.',
        'No formal guarantee the agent will pick the right tool or stop calling tools.'
      ],
      relatedConcepts: ['Function Calling', 'Tool Calling', 'JSON Schema', 'MCP', 'Read vs Write Tools'],
      faq: [
        { q: 'How many tools can an agent have?', a: 'Empirically, performance degrades past ~10–20 tools in the prompt. For larger tool sets, use retrieval (RAG over tool descriptions) or hierarchical tool namespaces.' },
        { q: 'Should tools be coarse or fine-grained?', a: 'Coarse. The LLM picks better between "search_flights(origin, dest, date)" than between "list_airports", "query_airline", "fetch_schedule". Fewer, richer tools beat many small ones.' }
      ],
      summary:
        'Tool-using agents extend their core model with external functions. The LLM picks tools from a schema-described menu, the orchestrator executes them, and the results flow back into the next reasoning step. Tools turn an LLM into an agent that can sense, compute, and act — but every tool is also a security and reliability surface that must be designed carefully.'
    },
    {
      id: 'research-agents',
      title: 'Research Agents',
      subtitle: 'Agents that gather, cross-check, and synthesise information from many sources.',
      tags: ['agents', 'research', 'rag'],
      readingMinutes: 7,
      definition:
        'A research agent is a tool-using agent specialised for open-ended information gathering: given a question, it plans a search strategy, executes multiple queries against web or private sources, reads and cross-checks the results, and produces a synthesised answer with citations. Its defining behaviour is iteration — it does not stop at the first hit.',
      whyItExists:
        'A single web search returns a snippet. A real research question — "compare the regulatory stance of the EU and US on stablecoins in 2024" — needs dozens of queries, conflicting sources, date filtering, and synthesis across them. A research agent exists because the gap between "one search" and "a defensible answer" is too large for a human to bridge cheaply at scale, and too nuanced for a single LLM call to produce reliably.',
      howItWorks: [
        {
          type: 'p',
          text: 'The research loop has four phases. (1) Plan: the agent decomposes the question into sub-questions and lists the queries needed. (2) Search: it runs those queries (web search, internal vector DB, API calls), reads the top results, and extracts relevant passages. (3) Cross-check: it looks for corroborating or contradicting sources, flags uncertainty, and may run follow-up queries to resolve conflicts. (4) Synthesise: it writes a structured answer with inline citations to the sources it used.'
        },
        { type: 'h3', text: 'Sub-question decomposition' },
        {
          type: 'p',
          text: 'The first call is rarely the right call. The agent breaks "compare EU and US stablecoin regulation" into at least: "EU MiCA stablecoin provisions", "US SEC vs CFTC stablecoin jurisdiction", "EU stablecoin timeline 2024", "US stablecoin bill 2024 status". Each sub-question becomes a query. This decomposition is what distinguishes a research agent from a chatbot-with-search.'
        },
        { type: 'h3', text: 'Source quality and conflict resolution' },
        {
          type: 'p',
          text: 'A research agent must rank sources: primary (regulator press releases, legislation) over secondary (news, blogs), and recent over stale for time-sensitive questions. When sources conflict, it must not silently average them — it must surface the conflict, prefer the more authoritative source, and note the disagreement in the answer. This is the part that most distinguishes a good research agent from a hallucination machine.'
        },
        {
          type: 'table',
          headers: ['Component', 'Role', 'Common failure'],
          rows: [
            ['Query planner', 'Breaks question into sub-queries', 'Too few or too broad queries'],
            ['Search tool', 'Runs web / DB queries', 'Rate limits, stale index'],
            ['Reader', 'Extracts passages from full pages', 'Loses structure on JS-heavy pages'],
            ['Synthesiser', 'Writes the cited answer', 'Stitches passages without synthesis'],
            ['Citation linker', 'Maps claims → source URLs', 'Mis-attributes claims to wrong source']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'A research agent asked "Which LLMs are best for code generation in 2024?" plans five queries, retrieves benchmark papers (HumanEval, MBPP, SWE-bench), vendor release notes, and independent eval blogs, cross-checks that vendor claims match independent results, and writes a comparison table with per-model citations. It flags that vendor-published numbers are systematically higher than independent ones.' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Research agent sub-question decomposition (sketch)',
          code: `sub_questions = llm.plan_subquestions(user_question)
# ["What is GDP of country with capital Lima?",
#  ->  "What country has Lima as its capital?",
#      "What is the GDP of Peru?"]

findings = []
for sq in sub_questions:
    for query in llm.generate_queries(sq):
        results = web_search(query, top_k=5)
        for url in results:
            page = fetch_and_parse(url)
            passages = llm.extract_relevant(page, sq)
            findings.extend(passages)

# Cross-check + synthesise with citations
answer = llm.synthesise(
    question=user_question,
    findings=findings,
    instruction="Cite each claim with [n] matching the source list. "
                "Flag conflicts explicitly. Say 'unknown' if no source supports a claim."
)
return answer, source_list`
        }
      ],
      advantages: [
        'Produces cited, checkable answers — far more useful than a bare LLM response.',
        'Iterative queries cover ground no single search could.',
        'Cross-checking catches hallucinations before they reach the user.',
        'Naturally extends to private data (RAG over internal docs).'
      ],
      disadvantages: [
        'Many tool calls = high latency and cost (a deep run can take minutes and dollars).',
        'Web sources rot; JS-rendered pages break the reader.',
        'Synthesis can hide source disagreement if not prompted carefully.',
        'Citation quality is only as good as the source ranking.'
      ],
      commonMistakes: [
        'Letting the agent cite the snippet alone without reading the page — snippets mislead.',
        'Trusting vendor-published benchmarks without independent corroboration.',
        'Forgetting to set a time filter on web search — answers cite 2018 pages for a 2024 question.',
        'Not asking the agent to flag low-confidence claims; users assume everything is verified.'
      ],
      limitations: [
        'Cannot reason about sources it cannot fetch (paywalled, JS-only, blocked).',
        'No immunity to coordinated misinformation: if many sources repeat the same false claim, the agent will corroborate it.',
        'Citation format is brittle; LLMs sometimes invent citation numbers.'
      ],
      relatedConcepts: ['Retrieval-Augmented Generation', 'Sub-Question Decomposition', 'Citation Grounding', 'Source Ranking'],
      faq: [
        { q: 'How is a research agent different from RAG?', a: 'RAG is one tool: retrieve from a fixed corpus. A research agent orchestrates many retrieval calls (web, RAG, APIs), plans them, cross-checks, and synthesises. RAG is a building block; the research agent is the loop around it.' },
        { q: 'How do I stop the agent from running forever?', a: 'Set hard caps: max sub-questions, max queries per sub-question, max pages per query, and a total token budget. Make the caps visible to the model so it can plan within them.' }
      ],
      summary:
        'Research agents gather, cross-check, and synthesise information across many sources. Their power comes from sub-question decomposition and conflict resolution — not from the LLM alone. They produce cited answers that are checkable and far more reliable than a bare chatbot response, at the cost of latency, complexity, and source-quality dependence.'
    },
    {
      id: 'coding-agents',
      title: 'Coding Agents',
      subtitle: 'Agents that write, edit, test, and debug code inside a real development environment.',
      tags: ['agents', 'coding', 'software-engineering'],
      readingMinutes: 8,
      definition:
        'A coding agent is a tool-using agent specialised for software-engineering tasks: it reads a repository, edits files, runs build and test commands, observes failures, iterates, and stops when tests pass (or it gives up). Unlike a code-completion assistant that suggests snippets, a coding agent operates autonomously across the whole edit-test-debug loop.',
      whyItExists:
        'Code completion helps you type. It does not run tests, fix imports across files, refactor a module, or chase a failing CI build through five repositories. A coding agent exists because the bottleneck in real software work is the edit-test-debug cycle, not the typing — and that cycle is exactly what an autonomous agent with file and shell tools can drive.'
        ,
      howItWorks: [
        {
          type: 'p',
          text: 'The coding agent loop mirrors a developer\'s: (1) understand the task (read the issue, the failing test, the relevant files); (2) form a plan (which files to change, in what order); (3) edit (apply changes to disk); (4) verify (run lint, type-check, build, tests); (5) on failure, read the error, form a hypothesis, edit again; (6) commit or report. Tools are: file_read, file_edit (or patch), file_write, shell_exec, and grep/search.'
        },
        { type: 'h3', text: 'Edit primitives' },
        {
          type: 'p',
          text: 'There are three ways an agent edits code. Full-file rewrite: simplest, but expensive in tokens and risky for large files. Search-and-replace block (SAR): the agent emits the exact old text and the new text; the framework replaces it. Used by Aider. Unified diff: the agent emits a git-style patch; the framework applies it. Each has trade-offs in reliability and token cost. SAR is the most common in production because it fails loudly when the old text does not match.'
        },
        { type: 'h3', text: 'The verification loop' },
        {
          type: 'p',
          text: 'A coding agent without a verification loop is just a code generator with extra steps. The verification loop — run tests, read failure, fix, repeat — is what makes it an agent. The agent must be able to run the project\'s tests as a tool and parse the failure output. Without that, it cannot tell whether its edit worked. This is why coding agents perform much better on repos with good test suites.'
        },
        {
          type: 'callout',
          variant: 'danger',
          title: 'Coding agents will run arbitrary shell commands',
          text: 'A coding agent with shell_exec can do anything: delete files, push to remote, exfiltrate secrets, install malware. Sandboxing (see Module 8 Lesson 15) is not optional. Run untrusted coding agents in containers, network-restricted VMs, or ephemeral devcontainers — never on your laptop with your SSH keys mounted.'
        }
      ],
      examples: [
        { type: 'p', text: 'A coding agent is given "fix the failing test in tests/test_auth.py". It reads the test, identifies the assertion that fails, greps the source for the function under test, reads it, applies a search-and-replace edit, runs the test, sees it now passes but a different test breaks, reads that failure, reverts the over-broad change, applies a narrower one, runs the full suite, and reports done with a diff attached.' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Aider-style search-and-replace edit primitive',
          code: `# The agent emits one or more of these blocks; the framework applies them.
# If the SEARCH text is not found verbatim, the edit is rejected — this is
# the loud-failure property that makes SAR reliable.

edit_block = '''
src/auth.py
<<<<<<< SEARCH
    if user.password == supplied:
        return True
    return False
=======
    if user.password_hash is None:
        return False
    return bcrypt.checkpw(supplied.encode(), user.password_hash)
>>>>>>> REPLACE
'''

# Verification loop:
# 1. apply edit_block -> file on disk changes
# 2. run: pytest tests/test_auth.py
# 3. if exit code != 0: read stderr, append to context, loop
# 4. if exit code == 0: optionally run full suite, then stop`
        }
      ],
      advantages: [
        'Closes the edit-test-debug loop autonomously — handles real engineering tasks, not just typing.',
        'Scales linearly with test quality: well-tested repos let the agent verify itself.',
        'Frees engineers from mechanical work (chasing failing tests, refactors, migrations).'
      ],
      disadvantages: [
        'Shell access makes them dangerous without sandboxing.',
        'Token cost can be huge — a single task may read 100k tokens and edit 10 files.',
        'Quality collapses on repos without tests: the agent cannot verify, so it cannot self-correct.',
        'Long horizons drift: the agent forgets the original task after 20 file edits.'
      ],
      commonMistakes: [
        'Trusting the agent\'s "tests pass" claim without re-running the suite yourself.',
        'Letting the agent edit files outside the task scope (e.g. refactoring unrelated code).',
        'Giving the agent push access — it will push broken branches.',
        'Not enforcing a step / token / time budget; stuck agents spend real money.'
      ],
      limitations: [
        'Architecture-level decisions still need a human — agents are local optimisers.',
        'Performance on legacy code with no tests is poor.',
        'Cannot reliably verify its own work for tasks where the test itself is what it just wrote (circular).'
      ],
      relatedConcepts: ['Edit-Test-Debug Loop', 'Search-and-Replace Edits', 'SWE-bench', 'Agent Sandboxing'],
      faq: [
        { q: 'Will coding agents replace engineers?', a: 'No. They automate the edit-test-debug loop and the mechanical parts of engineering. Architecture, requirements, code review, and operational judgement remain human work — augmented, not replaced.' },
        { q: 'How do I evaluate a coding agent?', a: 'Use SWE-bench (real GitHub issues with passing tests as the success criterion). Accuracy on SWE-bench is the closest thing to a standard benchmark.' }
      ],
      summary:
        'Coding agents drive the edit-test-debug loop autonomously. Their reliability is bounded by the quality of the test suite they can run — they cannot self-correct without verification. The edit primitive (SAR vs full-file vs diff) and the sandbox in which the shell runs are the two engineering decisions that dominate a coding agent\'s usefulness and safety.'
    },
    {
      id: 'data-analysis-agents',
      title: 'Data-Analysis Agents',
      subtitle: 'Agents that load data, explore it, compute statistics, and produce insight — not just charts.',
      tags: ['agents', 'data-analysis', 'python'],
      readingMinutes: 7,
      definition:
        'A data-analysis agent is a tool-using agent specialised for working with datasets: it loads data (CSV, SQL, Parquet), profiles it, computes summary statistics, generates visualisations, runs statistical tests, and writes a narrative interpretation. The deliverable is an analysis, not just a number — the agent reasons about what the data shows.',
      whyItExists:
        'Asking an LLM "what does this CSV show?" produces confident hallucination. Asking it to call a Python tool to load the CSV, compute the statistics, and then interpret the actual numbers produces grounded insight. A data-analysis agent exists because the gap between "I have data" and "I understand what this data says" is exactly the gap that an LLM-driven code-interpreter loop can close — and humans do not scale to the volume of datasets we now generate.',
      howItWorks: [
        {
          type: 'p',
          text: 'The canonical pattern is the code-interpreter agent: a Python (or SQL) sandbox is exposed as a tool. The LLM writes code, the framework executes it in the sandbox, the stdout/stderr and any chart images are returned as the observation. The LLM then either writes more code (to drill deeper) or writes a natural-language interpretation. This is what powers ChatGPT\'s Advanced Data Analysis, Anthropic\'s analysis tool, and most notebook-style agent products.'
        },
        { type: 'h3', text: 'The analysis loop' },
        {
          type: 'ol',
          items: [
            'Profile: load the data, print schema, head, dtypes, null counts, cardinality.',
            'Question: state what the user wants to know in concrete terms.',
            'Compute: write code to aggregate, filter, join, or test as needed.',
            'Visualise: render charts (matplotlib, plotly) and feed images back to a vision-capable LLM.',
            'Interpret: write the finding, citing the computed numbers.',
            'Verify: re-run on a sample or with a different method to sanity-check.'
          ]
        },
        { type: 'h3', text: 'Why code is non-negotiable' },
        {
          type: 'p',
          text: 'LLMs cannot reliably do arithmetic in their heads. Asking "what is the average of these 1000 numbers" without a tool produces a confidently wrong guess. The code tool is not a convenience — it is the difference between grounded analysis and fabrication. Every numeric claim in the final answer must trace to a line of code that produced it; an agent that prints numbers without showing the code is suspect.'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Charts feed back into the loop',
          text: 'When the LLM is multimodal, the chart it generates becomes an observation: it can spot an outlier in the image, decide to investigate, and run a follow-up query. This visual feedback loop is what makes analysis agents feel like a real analyst rather than a SQL-to-text converter.'
        }
      ],
      examples: [
        { type: 'p', text: 'A user uploads sales.csv and asks "why did revenue drop in Q3?" The agent profiles the data, plots monthly revenue by region, spots that APAC revenue collapsed in August, filters to APAC, plots by product, identifies that one product line went to zero, reads the data dictionary, and concludes: "APAC revenue drop is fully explained by the discontinuation of Product X in August; ex-Product X, APAC revenue grew 4%."' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Code-interpreter tool the agent calls',
          code: `import pandas as pd, matplotlib.pyplot as plt, io, base64

def python_tool(code: str) -> str:
    """Run python in a sandbox; return stdout + any chart as base64."""
    ns = {"pd": pd, "plt": plt}
    out = io.StringIO()
    try:
        exec(code, ns)                  # NEVER do this on raw input — sandbox first
    except Exception as e:
        return f"ERROR: {type(e).__name__}: {e}"
    text = out.getvalue()
    if plt.get_fignums():
        buf = io.BytesIO()
        plt.savefig(buf, format="png"); plt.close()
        img_b64 = base64.b64encode(buf.getvalue()).decode()
        return f"{text}\\n[chart:image/png;base64,{img_b64[:40]}...]"
    return text

# Agent emits code like:
agent_code = '''
df = pd.read_csv("sales.csv", parse_dates=["date"])
df["month"] = df["date"].dt.to_period("M").astype(str)
monthly = df.groupby(["month","region"])["revenue"].sum().unstack()
print(monthly.tail(6))
monthly.plot(kind="bar", stacked=True); plt.tight_layout()
'''
print(python_tool(agent_code))`
        }
      ],
      advantages: [
        'Produces grounded numeric claims — every number traces to executed code.',
        'Handles exploratory questions you did not pre-specify ("why did revenue drop?").',
        'Scales data work: a non-technical user can run a real analysis.',
        'Visual feedback loop catches what summary statistics hide.'
      ],
      disadvantages: [
        'Sandbox escape is a real risk if the tool runs untrusted code on real data.',
        'LLMs write plausible-but-wrong pandas: silent dropna, wrong join type, off-by-one in groupby.',
        'Token cost on large datasets — agents read full dataframes into context instead of querying them.',
        'Confirmation bias: the agent finds a pattern that fits the user\'s framing and stops.'
      ],
      commonMistakes: [
        'Letting the agent exfiltrate data via network calls from the sandbox.',
        'Trusting the first chart — agents rarely re-verify with a second method.',
        'Not exposing the executed code to the user — opaque analyses are unverifiable.',
        'Using the agent for sensitive data without isolation, audit logs, and access controls.'
      ],
      limitations: [
        'Cannot replace a statistician for causal inference — observational correlations are not causation.',
        'Performance collapses on dirty data (mixed types, broken encoding) without explicit cleaning steps.',
        'No formal guarantee the agent picked the right test or visualisation.'
      ],
      relatedConcepts: ['Code Interpreter', 'Notebook Agents', 'Pandas', 'Visual Question Answering'],
      faq: [
        { q: 'Is this just a chatbot that runs Python?', a: 'The loop is similar, but a real analysis agent plans the analysis, verifies its findings, and writes an interpretation that cites the numbers. A chatbot-with-python runs one snippet and answers.' },
        { q: 'How do I prevent data exfiltration?', a: 'Run the sandbox with no network egress, no mounted secrets, and an audit log of every cell executed. See Module 8 Lesson 15 on sandboxing.' }
      ],
      summary:
        'Data-analysis agents use a code-interpreter tool to ground every numeric claim in executed code. The pattern — profile, question, compute, visualise, interpret, verify — turns an LLM from a confident guesser into a real analyst. The two risks are sandbox escape and silent pandas errors; both are mitigated by exposing the executed code to the user.'
    },
    {
      id: 'browser-use-agents',
      title: 'Browser-Use Agents',
      subtitle: 'Agents that drive a real web browser: navigate, click, type, read, complete web tasks.',
      tags: ['agents', 'browser', 'automation', 'web'],
      readingMinutes: 7,
      definition:
        'A browser-use agent controls a web browser through tools that read the DOM, take screenshots, click elements, fill forms, and navigate between pages. Given a goal stated in natural language ("order me a black coffee from the nearest cafe on DoorDash"), it operates the browser like a human would: perceive the page, decide the next action, execute it, observe the new page, repeat until the goal is met or it gives up.',
      whyItExists:
        'Millions of workflows live behind a web UI with no API: internal tools, legacy systems, vendor portals, and any site that requires login. Browser-use agents exist because the alternative — building a custom scraper and API client per site — does not scale, and breaks the moment the site changes its HTML. A browser agent that sees the page like a human is the only general-purpose way to automate the long tail of web tasks.',
      howItWorks: [
        {
          type: 'p',
          text: 'A browser agent has two perception modes. (1) DOM-based: the framework extracts a simplified accessibility tree (role, name, value, bounding box for each interactive element) and feeds it as text to the LLM. (2) Vision-based: the framework takes a screenshot and the LLM, being multimodal, identifies elements by their visual position. Production agents usually combine both — DOM for reliability, vision for layouts the accessibility tree misrepresents (canvas, complex SPAs).'
        },
        { type: 'h3', text: 'The action space' },
        {
          type: 'p',
          text: 'The agent\'s tools mirror what a human can do: goto(url), click(element_id), type(element_id, text), scroll(direction), key(key), screenshot(), get_text(element_id), back(), wait(seconds). Each action returns the new page state (DOM tree + screenshot). The agent decides the next action from this observation. Element identification uses stable attributes (aria-label, role, text) where possible, falling back to coordinates for canvas apps.'
        },
        { type: 'h3', text: 'State, history, and recovery' },
        {
          type: 'p',
          text: 'Browser state changes on every action; the agent must track which page it is on, what it has already done, and what remains. Most frameworks keep a running action history in context and re-plan when a click leads somewhere unexpected. Recovery from errors (popup, login wall, captcha) is where most browser agents fail; a human-in-the-loop approval for unexpected states is a common production pattern.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Captchas and ToS',
          text: 'Browser agents will hit captchas (Cloudflare, reCAPTCHA). Bypassing them is technically possible but legally and ethically fraught — and often violates the target site\'s Terms of Service. For production workflows, prefer official APIs where they exist; use browser agents for sites you have permission to automate.'
        }
      ],
      examples: [
        { type: 'p', text: 'A browser agent is asked "find the cheapest direct flight from SFO to JFK next Friday and email me the link." It opens the airline site, types origin and destination, selects dates, filters to non-stop, sorts by price, reads the top result, opens the email tool, and sends the link. It handles a popup that asks to accept cookies by clicking "Accept", and recovers from a date-picker that opened on the wrong month by re-navigating.' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Minimal browser-use loop (Playwright + LLM)',
          code: `from playwright.sync_api import sync_playwright
from llm import decide_action

GOAL = "Order a black coffee from the nearest cafe on DoorDash"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://www.doordash.com")
    history = []
    for step in range(50):
        dom = page.accessibility_snapshot()         # simplified tree
        shot_b64 = page.screenshot(full_page=False) # vision input
        action = decide_action(goal=GOAL, dom=dom, screenshot=shot_b64,
                               history=history, tools=BROWSER_TOOLS)
        if action.name == "DONE":
            break
        execute(page, action)                       # click / type / goto / ...
        history.append(action)
    browser.close()`
        }
      ],
      advantages: [
        'Automates any web workflow without an API — the long tail of business tasks.',
        'Generalises across site redesigns better than CSS selectors (it sees the page, not the markup).',
        'One tool stack serves every site; no per-site scraper maintenance.'
      ],
      disadvantages: [
        'Slow: each action is an LLM call plus a page load; tasks take minutes.',
        'Brittle on captchas, login walls, anti-bot protection, and dynamic SPAs.',
        'Risk of destructive actions (placing a real order, deleting data) if not gated.',
        'ToS violations are a real legal risk for commercial use.'
      ],
      commonMistakes: [
        'Running browser agents headlessly when headed mode is needed for debugging — you cannot fix what you cannot see.',
        'Letting the agent click "Confirm Order" or "Delete" without a human approval step.',
        'Storing session cookies or passwords insecurely — agents need credentials, and they leak.',
        'Treating "the agent reached the goal" as success without verifying the side effect actually happened.'
      ],
      limitations: [
        'Cannot reliably pass captchas — and should not, by design.',
        'Performance collapses on highly dynamic canvas apps (Google Maps, Figma).',
        'No way to verify the agent did what you asked without observing the final state.'
      ],
      relatedConcepts: ['Playwright', 'Accessibility Tree', 'Multimodal LLMs', 'Web Automation', 'RPA'],
      faq: [
        { q: 'How is this different from Selenium / RPA?', a: 'Selenium scripts are deterministic: you write the click sequence. A browser agent decides each click from the page state — so it survives redesigns and handles unexpected popups, at the cost of latency and non-determinism.' },
        { q: 'DOM or vision?', a: 'Both. DOM is faster and more reliable for forms and standard UI; vision is needed for canvas apps and layouts where the accessibility tree is broken. Modern agents feed both to a multimodal LLM.' }
      ],
      summary:
        'Browser-use agents perceive a web page (via DOM accessibility tree and/or screenshots) and choose browser actions to achieve a natural-language goal. They are the only general-purpose way to automate the long tail of web tasks without APIs. Their limits are captchas, anti-bot protection, latency, and the legal risk of automating sites you do not own.'
    },
    {
      id: 'voice-agents',
      title: 'Voice Agents',
      subtitle: 'Agents that converse in speech — ASR in, LLM think, TTS out, all under a latency budget.',
      tags: ['agents', 'voice', 'asr', 'tts'],
      readingMinutes: 7,
      definition:
        'A voice agent is an LLM-powered agent whose input and output are audio rather than text. It combines automatic speech recognition (ASR) to transcribe the user, an LLM to reason and respond, and text-to-speech (TTS) to synthesise the reply — coordinated so that end-to-end latency stays below the threshold where a conversation feels natural (typically under 800 ms).',
      whyItExists:
        'Voice is the most natural human interface and the only one available hands-busy, eyes-busy (driving, cooking, on a factory floor). Text-based chatbots cannot serve these contexts. Voice agents exist to bring LLM reasoning to phone calls, smart speakers, in-car assistants, and accessibility tools — and they exist because ASR, LLMs, and TTS are finally good enough and cheap enough to chain in real time.',
      howItWorks: [
        {
          type: 'p',
          text: 'A voice agent runs a streaming pipeline. Audio frames from the microphone flow into ASR, which emits partial transcripts as the user speaks. When the user pauses (endpointing — typically 300–500 ms of silence), the final transcript is sent to the LLM. The LLM streams tokens; the first sentence is sent to TTS before the LLM finishes its full response, so audio playback starts while the model is still generating. The whole pipeline must stay under the latency budget or the conversation feels broken.'
        },
        { type: 'h3', text: 'The four components and their budgets' },
        {
          type: 'table',
          headers: ['Stage', 'Latency target', 'Bottleneck'],
          rows: [
            ['ASR (streaming)', '~200 ms after speech ends', 'Network + model size'],
            ['LLM first token', '~300 ms', 'TTFT of the model + queue'],
            ['TTS first audio', '~200 ms', 'Model size; streaming TTS preferred'],
            ['Total (perceived)', '< 800 ms', 'Sum of above + transport']
          ]
        },
        { type: 'h3', text: 'Barge-in and turn-taking' },
        {
          type: 'p',
          text: 'A real voice conversation is not request-response. The user interrupts ("wait, no —"), and the agent must stop talking, drop its current response, and re-listen. This is "barge-in". Implementing it requires the TTS audio to be interruptible, the ASR to keep listening during agent speech, and a state machine that handles "user spoke while I was speaking" by cancelling the in-flight LLM stream. Without barge-in, voice agents feel like voicemail.'
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Tool calls in voice',
          text: 'A voice agent can call tools mid-conversation, but the user is waiting. Always TTS a short acknowledgment ("Let me check that.") before running a slow tool, then speak the result. Silence for 5 seconds while a tool runs is unacceptable; a 1-second acknowledgment + 4 seconds of music is fine.'
        }
      ],
      examples: [
        { type: 'p', text: 'A pizza-ordering voice agent answers a phone call. ASR transcribes "I want a large pepperoni". The LLM calls get_menu, asks "thick or thin crust?", the user answers, the LLM calls place_order with the assembled details, reads back the confirmation, hangs up. End-to-end latency budget: under 1 second per turn; barge-in must work so the user can interrupt the confirmation.' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'Streaming voice loop with barge-in (sketch)',
          code: `const asr = new StreamingASR(micStream);
const llm = new LLM(SYSTEM_PROMPT, TOOLS);
const tts = new StreamingTTS(speakerStream);

let speaking = false;
asr.on("partial", (text) => {
  if (speaking && text.length > 3) {
    // Barge-in: user is interrupting our speech
    tts.interrupt();
    llm.cancel();
    speaking = false;
  }
});
asr.on("final", async (text) => {
  const stream = await llm.stream(text);     // token stream
  speaking = true;
  let sentence = "";
  for await (const token of stream) {
    sentence += token;
    if (/[.!?]/.test(token)) {                // flush a sentence at a time
      tts.speak(sentence);                    // streaming audio out
      sentence = "";
    }
  }
  speaking = false;
});`
        }
      ],
      advantages: [
        'Only interface available in hands-busy / eyes-busy contexts.',
        'Lower friction than text for many users (elderly, low-literacy, driving).',
        'Enables phone-call automation — a huge market unreachable by chat UIs.'
      ],
      disadvantages: [
        'Latency budget is brutal — every component must stream, every millisecond shows.',
        'ASR errors compound: a misheard word derails the whole conversation.',
        'Hard to debug — you cannot "scroll up" in a voice call.',
        'Privacy: always-listening devices raise real concerns.'
      ],
      commonMistakes: [
        'Using non-streaming ASR/TTS — total latency exceeds 2 s and the call feels broken.',
        'Not implementing barge-in — the agent talks over the user and feels rude.',
        'Letting the LLM call slow tools without first acknowledging ("Let me check…").',
        'Ignoring accents and background noise in ASR testing — lab accuracy ≠ call-center accuracy.'
      ],
      limitations: [
        'No good way to show structured information (tables, lists) over voice — must fall back to SMS or in-app.',
        'Multilingual and code-switching support is uneven across ASR vendors.',
        'Hard to verify what the agent actually said without full call recording and transcription logs.'
      ],
      relatedConcepts: ['ASR', 'TTS', 'Streaming', 'Barge-In', 'Voice Activity Detection'],
      faq: [
        { q: 'Can I use a single end-to-end speech-to-speech model?', a: 'Emerging (e.g. GPT-4o voice mode). They reduce latency by skipping the text intermediate but are harder to instrument (no readable transcript mid-call) and harder to tool-augment. Most production systems still use ASR + LLM + TTS for control.' },
        { q: 'What latency is acceptable?', a: 'Under 800 ms perceived feels natural. 1–2 s is tolerable for transactional calls. Over 3 s feels broken and users hang up.' }
      ],
      summary:
        'Voice agents chain streaming ASR, an LLM, and streaming TTS under a brutal latency budget, with barge-in and turn-taking to feel like a real conversation. Their superpower is reaching contexts chat cannot (phone calls, driving, accessibility); their weaknesses are latency engineering, ASR errors, and the difficulty of debugging a medium with no scroll-back.'
    },
    {
      id: 'workflow-based-agents',
      title: 'Workflow-Based Agents',
      subtitle: 'Deterministic graphs with LLMs at specific nodes — control flow you can audit and replay.',
      tags: ['agents', 'workflow', 'orchestration', 'determinism'],
      readingMinutes: 7,
      definition:
        'A workflow-based agent is a directed graph of nodes (LLM calls, tools, code, or human steps) with explicit edges (conditional routing, branching, loops) defined in code. Unlike a free-form ReAct agent where the LLM decides every step, the workflow fixes the control flow; the LLM only fills in specific decisions inside nodes. The result is an agent you can draw, test, audit, and replay.',
      whyItExists:
        'Free-form LLM agents are non-deterministic and hard to debug: the same input produces a different trajectory every run, and a failure somewhere in step 12 of an unbounded loop is brutal to reproduce. Many production tasks (refund processing, KYC, claim triage) need determinism for compliance, audit, and reliability. Workflow-based agents exist to put the LLM inside a scaffold you control, where the path through the system is fixed and only the content at each node varies.',
      howItWorks: [
        {
          type: 'p',
          text: 'You define the workflow as a graph: nodes are functions (LLM calls, tool calls, transformations, human approval gates); edges are routing rules (conditional branches, parallel fan-out, loops). At runtime, an orchestrator (LangGraph, Temporal, Inngest, a hand-written state machine) executes the graph: it runs a node, inspects the output, picks the next node, and persists state. Failures retry per-node; the whole graph can be paused and resumed.'
        },
        { type: 'h3', text: 'Workflow vs autonomous agent' },
        {
          type: 'table',
          headers: ['Property', 'Workflow', 'Autonomous Agent'],
          rows: [
            ['Control flow', 'Fixed, code-defined', 'LLM decides each step'],
            ['Determinism', 'High (same path each run)', 'Low (path varies)'],
            ['Debuggability', 'Step-by-step trace, easy to reproduce', 'Hard; trajectories diverge'],
            ['Adaptability', 'Limited to designed branches', 'Handles unanticipated situations'],
            ['Best for', 'Compliance, repeatable processes', 'Open-ended research, creative tasks']
          ]
        },
        { type: 'h3', text: 'Common patterns' },
        {
          type: 'ul',
          items: [
            'Prompt chaining — output of one LLM call is the input to the next (summarise → translate → format).',
            'Routing — a classifier LLM picks which specialised sub-workflow to run.',
            'Parallelisation — fan out to N independent LLM calls, fan in (e.g. N reviewers, majority vote).',
            'Evaluator-optimiser — one LLM produces, another critiques, loop until quality bar met.',
            'Human-in-the-loop — pause the graph, wait for a human decision, resume.'
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Use workflows by default',
          text: 'Anthropic\'s own engineering guidance: start with the simplest workflow that solves the problem. Reach for autonomous agents only when the task is genuinely open-ended and the determinism of a workflow is too restrictive. Most production "agents" are workflows in disguise.'
        }
      ],
      examples: [
        { type: 'p', text: 'A refund-approval workflow: (1) extract order details [tool], (2) classify refund reason [LLM], (3) if reason == "damaged" → route to photo-check sub-flow; if "late" → policy-check sub-flow; if "other" → human queue, (4) compute refund amount [code], (5) if amount > $100 → human approval [gate], (6) issue refund [tool], (7) send confirmation email [tool]. Every step is logged; every run is replayable.' },
        {
          type: 'code',
          lang: 'python',
          caption: 'LangGraph-style workflow definition',
          code: `from langgraph.graph import StateGraph, END

workflow = StateGraph(state_schema=RefundState)

def extract_order(state):    state.order = get_order(state.order_id); return state
def classify_reason(state):  state.reason = llm.classify(state.complaint); return state
def route(state):            return {"damaged": "photo_check", "late": "policy_check", "other": "human"}[state.reason]
def photo_check(state):      state.approved = llm.check_photo(state.photo_url); return state
def policy_check(state):     state.approved = policy_engine(state.order, state.reason); return state
def maybe_human(state):
    if state.refund_amount > 100: state.approved = human_review(state); return state
    return state
def issue_refund(state):     payments.refund(state.order_id, state.refund_amount); return state

workflow.add_node("extract", extract_order)
workflow.add_node("classify", classify_reason)
workflow.add_node("photo", photo_check)
workflow.add_node("policy", policy_check)
workflow.add_node("human", maybe_human)
workflow.add_node("refund", issue_refund)

workflow.set_entry_point("extract")
workflow.add_edge("extract", "classify")
workflow.add_conditional_edges("classify", route)
workflow.add_edge("photo", "human")
workflow.add_edge("policy", "human")
workflow.add_edge("human", "refund")
workflow.add_edge("refund", END)

app = workflow.compile(checkpointer=PostgresCheckpointer())  # resumable, replayable`
        }
      ],
      advantages: [
        'Deterministic control flow → auditable, testable, replayable.',
        'Per-node retries, timeouts, and human gates compose cleanly.',
        'Easier to certify for regulated industries than free-form agents.',
        'Easier to debug: a failed run produces a precise node and input.'
      ],
      disadvantages: [
        'Cannot handle situations the workflow author did not anticipate.',
        'Workflow sprawl: large graphs become hard to maintain.',
        'Adding a new branch touches the graph definition, not just a prompt.',
        'Less "magical" — the LLM is a component, not the driver.'
      ],
      commonMistakes: [
        'Stuffing too much logic into one node — defeats the purpose of granular control.',
        'Using a workflow when an autonomous agent is needed (open-ended research).',
        'Not versioning the graph definition — replaying an old run against a new graph fails.',
        'Forgetting persistence: a crash mid-workflow must resume, not restart from zero.'
      ],
      limitations: [
        'Brittle to inputs that do not fit any designed branch.',
        'Graph complexity grows with the number of edge cases.',
        'Hard to optimise globally — each node is tuned in isolation.'
      ],
      relatedConcepts: ['LangGraph', 'Temporal', 'State Machines', 'Human-in-the-Loop', 'Prompt Chaining'],
      faq: [
        { q: 'When do I move from workflow to autonomous agent?', a: 'When the space of possible trajectories is too large to enumerate in a graph, and the cost of a wrong path is recoverable. Most B2B and internal tools should stay workflows.' },
        { q: 'Can a workflow contain an autonomous agent?', a: 'Yes — a node can be a sub-agent. Common pattern: deterministic wrapper for compliance, autonomous sub-agent for the open-ended core.' }
      ],
      summary:
        'Workflow-based agents fix the control flow in code and use LLMs only at specific nodes. They trade adaptability for determinism, auditability, and debuggability — the right trade for most production use. Start with a workflow; reach for an autonomous agent only when the task genuinely defeats enumeration.'
    },
    {
      id: 'autonomous-agents',
      title: 'Autonomous Agents',
      subtitle: 'Agents that set their own goals, plan their own tasks, and run without step-by-step oversight.',
      tags: ['agents', 'autonomy', 'long-horizon'],
      readingMinutes: 8,
      definition:
        'An autonomous agent is given a high-level objective ("grow our newsletter to 10k subscribers this quarter") and decides for itself what sub-tasks to perform, in what order, for how long, and when to stop. Unlike a workflow agent whose control flow is fixed, or a ReAct agent that stops when the user\'s immediate question is answered, an autonomous agent operates over long horizons (hours, days, weeks) and self-directs its activity.',
      whyItExists:
        'Some goals cannot be reduced to a fixed procedure. "Find and fix bugs in this codebase", "research and draft a market entry plan", "manage this inbox" — the next action depends on what the agent finds, and the set of possible next actions is too large to enumerate. An autonomous agent exists to close the loop on objectives that need ongoing judgement rather than one-shot execution.'
        ,
      howItWorks: [
        {
          type: 'p',
          text: 'An autonomous agent adds three layers above a tool-using agent: (1) a goal manager that breaks the objective into sub-goals and tracks them; (2) a planner that produces a task list each cycle from the current sub-goals and the agent\'s memory; (3) a self-critique / reflection step that reviews what worked and updates the plan. Memory is critical — short-term (current cycle), working (this run), and long-term (a vector store of past attempts and lessons).'
        },
        { type: 'h3', text: 'The autonomy loop' },
        {
          type: 'ol',
          items: [
            'Goal: read the high-level objective and current progress.',
            'Plan: decompose into concrete tasks for this cycle.',
            'Act: execute tasks via tools (each task is itself a mini-agent loop).',
            'Observe: store results in memory.',
            'Reflect: did the cycle move toward the goal? What should change?',
            'Re-prioritise: drop stale tasks, add new ones, repeat.'
          ]
        },
        { type: 'h3', text: 'Levels of autonomy' },
        {
          type: 'p',
          text: 'Autonomy is a spectrum. Level 1: agent executes one task then stops. Level 2: agent executes a small plan, asks for the next. Level 3: agent runs for hours, asks for approval on side-effects. Level 4: agent runs indefinitely, only escalates exceptions. Level 5: fully self-directed, including choosing its own goals. Today\'s production systems cluster around Level 2–3; Level 5 is research.'
        },
        {
          type: 'callout',
          variant: 'danger',
          title: 'Autonomy without bounds is a security incident',
          text: 'An autonomous agent with write tools, a budget, and no oversight will eventually do something you regret — send 10,000 emails, delete the wrong files, spend $5000 on API calls. Hard caps (step count, dollar budget, write-tool allowlist, human escalation thresholds) are not optional for any deployment past Level 2.'
        }
      ],
      examples: [
        { type: 'p', text: 'An autonomous SRE agent is given "keep the staging cluster healthy". Every 5 minutes it reads alerts, identifies the most severe, fetches logs, forms a hypothesis, applies a fix (restart pod, scale deployment, roll back a release), and verifies. It escalates to a human only for actions outside its allowlist (e.g. dropping a database). Over a week it resolves 47 incidents, escalates 3, causes 0.' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Autonomous goal-pursuit loop (sketch)',
          code: `class AutonomousAgent:
    def __init__(self, goal, tools, memory, allowlist, budget):
        self.goal = goal
        self.tools = tools                      # gated by allowlist
        self.memory = memory                    # long-term vector store
        self.budget = budget                    # hard caps: steps, dollars, time

    def run(self):
        while not self.goal_met() and self.budget.remaining():
            tasks = self.plan_tasks()           # decompose goal -> concrete tasks
            for task in tasks:
                if task.requires_write and not task.approved:
                    task.approved = self.request_human_approval(task)
                if not task.approved:
                    continue
                result = self.execute(task)     # run sub-agent loop with tools
                self.memory.add(task, result)
                self.budget.consume(result.cost)
            self.reflect()                      # update plan, drop stale tasks
            self.check_escalation()             # surface anomalies to humans

agent = AutonomousAgent(
    goal="Resolve all P1 alerts in staging within 24h",
    tools=[read_logs, restart_pod, scale_deploy, rollback_release],
    memory=VectorStore(),
    allowlist=["restart_pod", "scale_deploy", "rollback_release"],
    budget=Budget(max_steps=1000, max_dollars=50, max_hours=24),
)
agent.run()`
        }
      ],
      advantages: [
        'Handles open-ended objectives that defeat fixed workflows.',
        'Scales one human\'s intent into many hours of execution.',
        'Improves over time if memory and reflection are well-designed.',
        'Frees humans from low-level task management.'
      ],
      disadvantages: [
        'Hardest agent class to make reliable — long horizons accumulate errors.',
        'Cost is unpredictable without hard budgets.',
        'Side effects can be severe before reflection catches them.',
        'Very hard to evaluate: success is subjective and slow to measure.'
      ],
      commonMistakes: [
        'Deploying Level 4+ autonomy without write-tool allowlists and budgets.',
        'Trusting the agent\'s self-reflection as ground truth — it can rationalise failures.',
        'Not logging every action for post-hoc audit.',
        'Skipping the human-escalation path; small anomalies compound into outages.'
      ],
      limitations: [
        'Today\'s models drift over long horizons; memory techniques help but do not solve it.',
        'Cannot reliably estimate its own competence — overconfidence is the default.',
        'Reflection quality is bounded by the LLM; a weak model produces useless self-critique.'
      ],
      relatedConcepts: ['Goal Decomposition', 'Reflection', 'Long-Term Memory', 'Agent Budgets', 'AutoGPT'],
      faq: [
        { q: 'Is AutoGPT an autonomous agent?', a: 'Yes — it was the first widely-known open-source autonomous agent (2023). Its reliability was poor because the underlying models and memory techniques were not ready. The pattern is sound; the implementation has matured.' },
        { q: 'How long can an autonomous agent run unsupervised?', a: 'Today, in production, hours to a few days with hard caps and human escalation. Weeks of unsupervised operation remain a research target.' }
      ],
      summary:
        'Autonomous agents self-direct over long horizons: they decompose goals, plan, act, observe, reflect, and re-prioritise. They are the most powerful agent class and the most dangerous. Hard budgets, write-tool allowlists, audit logs, and human escalation are not optional. Most production deployments should aim for Level 2–3 autonomy, not Level 5.'
    },
    {
      id: 'multi-agent-systems-intro',
      title: 'Multi-Agent Systems (intro)',
      subtitle: 'When one agent is not enough — orchestrate several specialised agents to solve a bigger problem.',
      tags: ['agents', 'multi-agent', 'orchestration'],
      readingMinutes: 9,
      definition:
        'A multi-agent system (MAS) is a system in which multiple agents, each with its own role, tools, and context, collaborate (or compete) to solve a problem no single agent could solve as well. Coordination happens through a topology — supervisor-to-workers, peer-to-peer, debate, market — chosen by the system designer.',
      whyItExists:
        'A single LLM agent has a context window, a tool set, and a system prompt — all shared across every task it does. As tasks grow, this bundle gets unwieldy: too many tools, conflicting instructions, role drift. Splitting the task across specialised agents ("you write code, you run tests, you review") keeps each agent\'s context focused, lets prompts be tuned per role, and enables parallelism. Multi-agent systems exist because specialisation beats generalisation once a task exceeds what one well-tuned agent can hold.',
      howItWorks: [
        {
          type: 'p',
          text: 'A multi-agent system has three parts: (1) the agents themselves — each with its own model, tools, system prompt, and memory; (2) the topology — how messages and control flow between them; (3) the orchestrator — code that runs the topology, handles failures, and aggregates results. The choice of topology is the most important design decision; it determines latency, cost, and failure modes.'
        },
        { type: 'h3', text: 'Common topologies' },
        {
          type: 'ul',
          items: [
            'Supervisor-worker (next lesson) — one agent routes tasks to specialised worker agents and aggregates.',
            'Pipeline (chaining) — Agent A\'s output feeds Agent B; linear, easy to debug.',
            'Peer-to-peer — agents exchange messages freely; flexible but hard to control.',
            'Debate — N agents argue a question, a judge agent picks the best answer.',
            'Market / auction — agents bid on subtasks; allocation follows bids.',
            'Hierarchical — supervisors of supervisors; scales to large orgs of agents.'
          ]
        },
        { type: 'h3', text: 'Why (and when) to go multi-agent' },
        {
          type: 'p',
          text: 'Multi-agent pays off when (a) the task naturally decomposes into distinct roles, (b) each role needs different tools or prompts, (c) parallelism across sub-tasks matters, or (d) you want cross-checking (debate, reviewer). It does not pay off when one well-prompted agent could do the job — multi-agent adds orchestration cost, message overhead, and debugging surface. Most teams reach for multi-agent too early; the rule of thumb is to start with one agent and split only when its context becomes unmanageable.'
        },
        { type: 'h3', text: 'Comparison across all 14 agent types' },
        {
          type: 'p',
          text: 'The table below maps the full taxonomy of this module across four dimensions: capability, complexity to build, typical use case, and key limitation. Use it as a cheat-sheet when choosing an architecture for a new task.'
        },
        {
          type: 'table',
          headers: ['Agent Type', 'Capability', 'Complexity', 'Use Case', 'Key Limitation'],
          rows: [
            ['Reactive', 'Stimulus → response', 'Very low', 'Thermostats, fraud rules, alerting', 'No memory, no planning'],
            ['Goal-Based', 'Pursues explicit goal', 'Low', 'Delivery drones, task bots', 'Needs world model; greedy'],
            ['Planning', 'Searches multi-step plans', 'Medium', 'Logistics, scheduling, mazes', 'State-space explosion'],
            ['LLM-Powered', 'General reasoning + tools', 'Medium', 'Chat assistants, copilots', 'Hallucination, cost, latency'],
            ['Tool-Using', 'Calls external functions', 'Medium', 'Any LLM agent that needs data/action', 'Tool selection errors; security surface'],
            ['Research', 'Multi-source gathering + synthesis', 'Medium-High', 'Market research, due diligence', 'Slow, source-quality dependent'],
            ['Coding', 'Edit-test-debug in a repo', 'High', 'PR fixes, refactors, migrations', 'Dangerous without sandbox'],
            ['Data-Analysis', 'Profile, compute, interpret data', 'High', 'Ad-hoc analytics, dashboards', 'Sandbox escape; silent pandas errors'],
            ['Browser-Use', 'Drives a real browser', 'High', 'Web automation, form filling', 'Captchas, ToS, latency'],
            ['Voice', 'Real-time spoken conversation', 'High', 'Phone agents, smart speakers', 'Brutal latency budget; ASR errors'],
            ['Workflow-Based', 'Fixed graph with LLM nodes', 'Medium', 'Compliance, KYC, refunds', 'Cannot handle unanticipated branches'],
            ['Autonomous', 'Self-directed over long horizons', 'Very high', 'SRE, inbox management, research', 'Unpredictable; needs hard budgets'],
            ['Multi-Agent', 'Coordinates specialised agents', 'Very high', 'Complex end-to-end products', 'Orchestration overhead; debugging'],
            ['Supervisor-Worker', 'Routes + aggregates workers', 'High', 'Multi-step pipelines with review', 'Supervisor is a bottleneck / SPOF']
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Reading the table',
          text: 'Capability and complexity usually rise together. The cheapest agent that can do the job is the right one — not the most capable. A reactive fraud rule that catches 99% of cases is better than an autonomous agent that catches 99.5% at 1000× the cost.'
        }
      ],
      examples: [
        { type: 'p', text: 'A content-generation product is a classic multi-agent system: a Researcher agent gathers sources, an Outliner agent structures the article, a Writer agent drafts sections in parallel, a Fact-Checker agent verifies each claim, an Editor agent harmonises tone. Each agent has a focused prompt and a small tool set; the supervisor (next lesson) coordinates. No single agent could do all of this well in one context.' },
        {
          type: 'code',
          lang: 'python',
          caption: 'A simple pipeline multi-agent system',
          code: `researcher = Agent(role="researcher",  tools=[web_search, fetch_page],  model="gpt-4o")
outliner   = Agent(role="outliner",    tools=[],                          model="gpt-4o")
writers    = [Agent(role="writer",     tools=[],                          model="gpt-4o-mini") for _ in range(3)]
fact_check = Agent(role="factchecker", tools=[web_search, fetch_page],    model="gpt-4o")
editor     = Agent(role="editor",      tools=[],                          model="gpt-4o")

def multi_agent_pipeline(topic: str) -> str:
    sources   = researcher.run(f"Find 5 credible sources on: {topic}")
    outline   = outliner.run(f"Outline a 1500-word article using these sources:\\n{sources}")
    sections  = outline.sections
    # Parallel fan-out: each writer takes a section
    drafts    = parallel_map(writers, sections, lambda w, s: w.run(f"Write section: {s}"))
    checked   = [fact_check.run(f"Verify every claim in this draft:\\n{d}") for d in drafts]
    final     = editor.run(f"Harmonise tone and assemble:\\n{checked}")
    return final`
        }
      ],
      advantages: [
        'Specialisation: each agent has a focused prompt and tool set → better per-step quality.',
        'Parallelism: independent sub-tasks run concurrently → lower wall-clock latency.',
        'Cross-checking: debate / reviewer topologies catch errors a single agent would miss.',
        'Composability: swap one agent (e.g. upgrade the writer\'s model) without touching others.'
      ],
      disadvantages: [
        'Orchestration overhead: more code, more failure modes, harder debugging.',
        'Cost multiplies: N agents means N× the model calls in the worst case.',
        'Message-passing overhead: agents must serialise state to send to each other, losing nuance.',
        'Cascading failures: one bad agent output poisons downstream agents.'
      ],
      commonMistakes: [
        'Going multi-agent on day one — start with one agent, split when forced.',
        'Giving every agent the same system prompt — defeats the point of specialisation.',
        'No global step / dollar budget across the whole system — cost runs away.',
        'Tracing only the final output; multi-agent failures live in intermediate messages.'
      ],
      limitations: [
        'Topologies that look elegant on paper can deadlock or livelock in practice.',
        'Multi-agent does not fix a weak base model — it amplifies its weaknesses across roles.',
        'Hard to attribute a final failure to one agent without per-agent traces.'
      ],
      relatedConcepts: ['Supervisor-Worker', 'Agent Topologies', 'Debate', 'Pipeline', 'Hierarchical MAS'],
      faq: [
        { q: 'Is multi-agent always better than single-agent?', a: 'No. For most tasks a single well-prompted agent with the right tools beats a multi-agent system. Multi-agent wins when roles are genuinely distinct and a single context cannot hold them all.' },
        { q: 'How many agents is too many?', a: 'Empirically, 3–5 specialised agents in a clear topology is the sweet spot. Past that, orchestration overhead dominates and you usually want a hierarchical design (supervisors of supervisors).' }
      ],
      summary:
        'Multi-agent systems coordinate specialised agents to solve problems too broad for one agent. The topology — supervisor-worker, pipeline, debate, hierarchical — is the key design decision. Start with a single agent and split only when its context becomes unmanageable; multi-agent adds power but also orchestration overhead, cost, and debugging complexity.'
    },
    {
      id: 'supervisor-worker-architectures',
      title: 'Supervisor-Worker Architectures',
      subtitle: 'The dominant multi-agent pattern: one router agent dispatches to specialised workers.',
      tags: ['agents', 'supervisor-worker', 'multi-agent', 'architecture'],
      readingMinutes: 8,
      definition:
        'A supervisor-worker architecture is a multi-agent system in which a single supervisor agent receives the task, decomposes it, assigns sub-tasks to specialised worker agents, gathers their outputs, and produces (or routes to) the final answer. The supervisor holds the global plan and the workers hold the specialised capabilities. It is the most common production multi-agent pattern.',
      whyItExists:
        'In a flat multi-agent system, every agent must understand the whole task — context explodes, roles blur, and coordination is ad-hoc. A supervisor-worker split separates two concerns: "what should be done next, by whom, in what order" (the supervisor) from "do this specific sub-task well" (each worker). This separation lets each agent have a small, focused context and a clear role, which is what makes multi-agent systems debuggable and production-grade.',
      howItWorks: [
        {
          type: 'p',
          text: 'The supervisor is itself an LLM agent whose tools are the worker agents (or "call_worker(name, task)" plus a "finish(result)" tool). On each step, the supervisor looks at the original task and the results returned so far, then either calls a worker with a new sub-task or calls finish. Workers are normal tool-using agents with their own prompts, model, and tools. The supervisor never executes domain work itself — its only job is routing and aggregation.'
        },
        { type: 'h3', text: 'Why the supervisor is the bottleneck — and SPOF' },
        {
          type: 'p',
          text: 'Every sub-task result passes through the supervisor\'s context. Long tasks overflow it. Two mitigations: (1) workers return short structured summaries, not full outputs ("done: 3 files patched, 1 test still failing"); (2) the supervisor\'s context is summarised periodically to drop old results. Even so, the supervisor is a single point of failure — if it loops or makes a bad routing call, the whole system fails. Hard step caps and a fallback "give up and return what we have" path are mandatory.'
        },
        { type: 'h3', text: 'Hierarchical supervisors' },
        {
          type: 'p',
          text: 'When the worker count grows past ~5–7, the supervisor\'s routing decision gets unreliable. The fix is hierarchy: a top supervisor routes to sub-supervisors (each owning a domain — research, writing, QA), and each sub-supervisor routes to its own workers. This is how large agent products (e.g. CrewAI fleets, AutoGen teams) scale. Each layer keeps its context small; the cost is more LLM calls and harder end-to-end tracing.'
        },
        {
          type: 'table',
          headers: ['Topology', 'Strength', 'Weakness'],
          rows: [
            ['Single supervisor + N workers', 'Simple, debuggable, fits most products', 'Supervisor context overflow on long tasks'],
            ['Hierarchical supervisors', 'Scales to dozens of workers', 'More calls, harder tracing, latency stacks'],
            ['Supervisor + worker pool (parallel)', 'Latency wins on independent sub-tasks', 'Aggregation logic in supervisor gets complex'],
            ['Supervisor + human worker', 'Safety: high-stakes actions go to a human', 'Latency bound by human response time']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Supervisor model choice matters more than worker choice',
          text: 'A weak supervisor misroutes tasks; no amount of strong workers can recover. Use your best model for the supervisor. Workers can be smaller / cheaper / specialised — they only need to be good at their one job.'
        }
      ],
      examples: [
        { type: 'p', text: 'A customer-support product: a supervisor agent receives the ticket, classifies it, and routes to one of: billing_worker (has Stripe tools), technical_worker (has KB search + code-search tools), or escalation_worker (drafts a human handoff). Workers return a proposed response. The supervisor reviews, optionally asks the worker to revise, and sends. The supervisor holds the ticket\'s state; each worker is stateless and focused.' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Supervisor whose "tools" are worker agents',
          code: `from langgraph.graph import StateGraph, END

# Workers are themselves Agents
billing_worker    = Agent(role="billing",    tools=[stripe_lookup, issue_refund],   model="gpt-4o-mini")
technical_worker  = Agent(role="technical",  tools=[kb_search, code_search],         model="gpt-4o-mini")
escalation_worker = Agent(role="escalation", tools=[draft_handoff],                  model="gpt-4o-mini")

# The supervisor's "tools" are: call each worker, or finish
supervisor_tools = [
    {"name": "call_billing",    "fn": lambda task: billing_worker.run(task)},
    {"name": "call_technical",  "fn": lambda task: technical_worker.run(task)},
    {"name": "call_escalation", "fn": lambda task: escalation_worker.run(task)},
    {"name": "finish",          "fn": lambda result: result},
]

def supervisor(state):
    # The supervisor LLM picks the next tool call given the ticket + history
    decision = supervisor_llm.chat(
        system=SUPERVISOR_PROMPT,                  # "Route to the right worker. Aggregate results. Finish when done."
        messages=state.history,
        tools=supervisor_tools,
        max_steps=20,                               # HARD CAP
        budget=Budget(max_dollars=2.0),
    )
    return decision

graph = StateGraph(SupportState)
graph.add_node("supervisor", supervisor)
graph.set_entry_point("supervisor")
graph.add_edge("supervisor", END)        # finish tool ends the graph
app = graph.compile()`
        }
      ],
      advantages: [
        'Clean separation of routing (supervisor) from execution (workers) → debuggable.',
        'Each worker has a small focused context → better per-step quality.',
        'Easy to swap a worker (upgrade model, add a tool) without touching others.',
        'Natural place for human-in-the-loop: route high-stakes tasks to a human worker.'
      ],
      disadvantages: [
        'Supervisor is a bottleneck and single point of failure.',
        'Supervisor context overflows on long tasks → needs summarisation.',
        'Routing errors cascade — a misrouted task gets a poor worker answer.',
        'Total cost can be high: every step pays for a supervisor call plus worker calls.'
      ],
      commonMistakes: [
        'Using a cheap model for the supervisor to save money — routing quality collapses.',
        'Letting workers return full unstructured output to the supervisor — context explodes.',
        'No hard step cap — a stuck supervisor loops forever.',
        'Skipping the "give up and return partial" fallback — users get no answer instead of a partial one.'
      ],
      limitations: [
        'Top-down routing cannot handle peer-to-peer collaboration patterns (e.g. debate).',
        'Hierarchy adds latency and tracing complexity faster than it adds capability.',
        'Supervisor quality is the ceiling — no worker upgrade can fix a weak supervisor.'
      ],
      relatedConcepts: ['Hierarchical Agents', 'LangGraph Supervisor', 'Routing', 'Agent Pools', 'Single Point of Failure'],
      faq: [
        { q: 'How many workers should one supervisor manage?', a: '3–7 is the comfortable range. Past that, hierarchical supervisors or a worker-selection-by-retrieval pattern (RAG over worker descriptions) is better than a giant tool list.' },
        { q: 'Should the supervisor see worker outputs or only summaries?', a: 'Summaries. The supervisor needs to know what the worker concluded, not the full trace. Full outputs overflow the supervisor context within a few steps.' }
      ],
      summary:
        'Supervisor-worker is the dominant production multi-agent pattern: one supervisor routes and aggregates, N specialised workers execute. It cleanly separates routing from execution at the cost of making the supervisor a bottleneck and single point of failure. Use your best model for the supervisor, cap its steps, summarise worker outputs, and reach for hierarchy only when worker count grows past seven.'
    }
  ]
}
