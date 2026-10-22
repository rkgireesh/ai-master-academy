import type { Module } from './types'

export const module8: Module = {
  id: 'm8',
  index: 8,
  title: 'Tools, APIs, and MCP',
  shortTitle: 'Tools, APIs & MCP',
  description:
    'The infrastructure layer that makes agents useful: APIs and REST, function calling and tool calling, JSON Schemas and structured outputs, validation, authentication and authorization, and the Model Context Protocol (MCP) that standardises how tools are exposed to any LLM. Build agents whose tools are safe, validated, authenticated, and interoperable.',
  level: 'Advanced',
  icon: 'Wrench',
  color: 'from-rose-500 to-red-500',
  quizId: 'q8',
  lessons: [
    {
      id: 'apis',
      title: 'APIs',
      subtitle: 'The contract that lets two programs talk without sharing code.',
      tags: ['api', 'integration', 'fundamentals'],
      readingMinutes: 6,
      definition:
        'An Application Programming Interface (API) is a defined contract through which one program requests a service from another. The contract specifies the endpoint, the request format, the response format, the errors, and the authentication — without exposing the implementation behind it.',
      whyItExists:
        'Without APIs, every program that wanted to use another program\'s functionality would have to embed its source code or speak a private protocol. APIs exist to enable modular composition: a weather service, a payment processor, and a database each expose a stable interface, and any client (your code, an agent, a mobile app) can use them without knowing how they are implemented. They are the substrate on which tool-using agents are built — every "tool" an agent calls is ultimately one or more API requests.',
      howItWorks: [
        {
          type: 'p',
          text: 'An API has four parts: (1) the endpoint — a URL (for web APIs) or function name (for library APIs) where the service lives; (2) the request — the input, including parameters, headers, and body; (3) the response — the structured output, including success data or an error; (4) the contract — a specification (OpenAPI, gRPC proto, GraphQL schema) that documents all of the above so clients can be generated automatically.'
        },
        { type: 'h3', text: 'API styles' },
        {
          type: 'table',
          headers: ['Style', 'Transport', 'Shape', 'When to use'],
          rows: [
            ['REST', 'HTTP', 'Resource URLs + verbs', 'Public web APIs, CRUD resources'],
            ['RPC (gRPC, JSON-RPC)', 'HTTP/2 or TCP', 'Function calls', 'Internal microservices, low latency'],
            ['GraphQL', 'HTTP', 'Query language', 'Flexible client-driven fetching'],
            ['WebSocket', 'TCP', 'Bidirectional stream', 'Real-time updates, chat'],
            ['SDK / library', 'In-process', 'Function calls', 'Same-language components']
          ]
        },
        { type: 'h3', text: 'APIs as agent tools' },
        {
          type: 'p',
          text: 'When an agent "calls a tool", the tool\'s implementation almost always wraps one or more API calls. A `search_flights` tool might call an airline\'s REST API; a `send_email` tool might call the Gmail API; a `query_db` tool might call an internal gRPC service. The agent never sees the API directly — the tool function hides transport, auth, retries, and parsing behind a single function call. This is why tool definitions and API contracts are so similar: a tool definition is essentially an API spec the LLM can read.'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Stability is the API\'s core value',
          text: 'An API that changes its endpoint, parameters, or response shape every release is worthless to clients — and worse than worthless to agents, who will call the old shape forever. Version your APIs (URL path, header, or media type) and treat backwards-incompatible changes as a last resort.'
        }
      ],
      examples: [
        { type: 'p', text: 'A weather service exposes GET /v1/weather?city={city} returning JSON {temp, conditions, humidity}. A mobile app, a web dashboard, and an LLM agent can all call it without knowing whether the server reads from a database, a satellite feed, or a third-party vendor. The contract — URL, query param, JSON shape — is the only thing they share.' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'A minimal REST API client an agent tool might wrap',
          code: `const API_BASE = "https://api.weather.example.com/v1";

export async function getWeather(city: string, units: "celsius" | "fahrenheit" = "celsius") {
  const url = new URL(\`\${API_BASE}/weather\`);
  url.searchParams.set("city", city);
  url.searchParams.set("units", units);
  const res = await fetch(url, {
    headers: { Authorization: \`Bearer \${process.env.WEATHER_API_KEY}\` },
  });
  if (!res.ok) {
    throw new Error(\`Weather API \${res.status}: \${await res.text()}\`);
  }
  return res.json() as Promise<{ temp: number; conditions: string; humidity: number }>;
}`
        }
      ],
      advantages: [
        'Enables modular composition — combine services you did not write.',
        'Stable contracts let clients and servers evolve independently.',
        'Language-agnostic: a Python client can call a Go server.',
        'Enables agent tools — every tool wraps one or more APIs.'
      ],
      disadvantages: [
        'Network introduces latency, failures, and security surface.',
        'Versioning is hard; breaking changes break every client at once.',
        'Rate limits, auth, and pagination add complexity every client must handle.',
        'Undocumented or under-tested APIs become liabilities when scale grows.'
      ],
      commonMistakes: [
        'Treating an internal function call as an "API" — a real API has a documented contract and stability guarantees.',
        'No versioning; breaking changes shipped without bumping the version.',
        'Embedding auth tokens in URLs (they leak into logs and browser history).',
        'Returning implementation details (stack traces, SQL) in error responses.'
      ],
      limitations: [
        'An API cannot enforce how clients use it — a misbehaving client can still cause harm.',
        'REST APIs without a schema (OpenAPI) are hard to consume automatically.',
        'Real-time push (server-to-client) requires WebSocket or SSE, not plain REST.'
      ],
      relatedConcepts: ['REST', 'GraphQL', 'gRPC', 'OpenAPI', 'MCP'],
      faq: [
        { q: 'Is an SDK the same as an API?', a: 'No. The API is the contract; the SDK is a language-specific library that wraps the API to make it easier to call. A single API typically has SDKs in many languages.' },
        { q: 'Why do agents need APIs at all?', a: 'Because an LLM cannot reach outside its own weights. To get live data, run code, or take an action, it must call something — and that something is a tool, which wraps an API.' }
      ],
      summary:
        'An API is a contract: endpoint, request, response, errors, auth. It lets programs compose without sharing code, and it is the substrate on which every agent tool is built. Version your APIs, document them with a schema, and treat backwards-incompatible changes as exceptional events.'
    },
    {
      id: 'rest-apis',
      title: 'REST APIs',
      subtitle: 'The dominant web API style: resources, HTTP verbs, stateless servers, status codes.',
      tags: ['rest', 'http', 'api'],
      readingMinutes: 7,
      definition:
        'REST (Representational State Transfer) is an API style in which resources are identified by URLs, operated on by HTTP verbs (GET, POST, PUT, PATCH, DELETE), represented as JSON (or XML), and accessed via stateless server requests. Each request contains everything the server needs to fulfil it; the server keeps no session state between requests.',
      whyItExists:
        'REST exists because earlier RPC-style APIs were tightly coupled — clients and servers shared method names and argument signatures, so any change broke both ends. REST decouples them: resources are nouns, verbs are a small fixed set, and representations are negotiable (JSON today, XML tomorrow). This decoupling, plus the fact that REST rides on HTTP (which already runs everywhere), made REST the default for public web APIs from roughly 2007 onward.',
      howItWorks: [
        {
          type: 'p',
          text: 'A REST API models the domain as resources: /users, /orders, /orders/{id}/items. Each resource supports the standard verbs: GET to read, POST to create, PUT to replace, PATCH to partially update, DELETE to remove. Responses use HTTP status codes: 200/201/204 for success, 4xx for client errors, 5xx for server errors. The body is JSON. State is in the URL and the body — the server treats each request independently.'
        },
        { type: 'h3', text: 'The verb-resource matrix' },
        {
          type: 'table',
          headers: ['Verb', 'Semantics', 'Idempotent?', 'Typical status'],
          rows: [
            ['GET', 'Read resource(s)', 'Yes', '200'],
            ['POST', 'Create new resource', 'No', '201'],
            ['PUT', 'Replace resource (full)', 'Yes', '200 / 204'],
            ['PATCH', 'Partial update', 'No', '200 / 204'],
            ['DELETE', 'Remove resource', 'Yes', '200 / 204']
          ]
        },
        { type: 'h3', text: 'Statelessness and scaling' },
        {
          type: 'p',
          text: 'Because the server keeps no session state, any instance can handle any request. This makes REST horizontally scalable: add more servers behind a load balancer and throughput rises linearly. Authentication is per-request (a token in a header), not per-connection — so the same client can be load-balanced across many servers transparently. This is the single most important property of REST for production systems.'
        },
        { type: 'h3', text: 'REST and agent tools' },
        {
          type: 'p',
          text: 'Most agent tools wrap REST APIs because the tool-call abstraction maps cleanly: a function with arguments becomes an HTTP request, and the JSON response becomes the observation. The OpenAPI specification (next lessons) describes REST APIs in a machine-readable format that can be turned directly into a tool definition the LLM can call. This is why a huge fraction of agent ecosystems are essentially "REST API + LLM".'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Idempotency matters for retries',
          text: 'Agents retry failed tool calls. If a tool\'s underlying API call is not idempotent (e.g. POST that creates a charge), a retry can double-charge. Design write endpoints idempotently with an idempotency key (Stripe-style) so a retry with the same key returns the original result instead of creating a duplicate.'
        }
      ],
      examples: [
        { type: 'p', text: 'A simple orders API: GET /orders lists them, POST /orders creates one, GET /orders/42 fetches one, PATCH /orders/42 updates status, DELETE /orders/42 cancels. An agent tool "list_user_orders(userId)" wraps GET /orders?user_id={userId} and returns the JSON. The LLM never sees HTTP — it sees a function call returning data.' },
        {
          type: 'code',
          lang: 'http',
          caption: 'A REST request and response',
          code: `# Request
POST /v1/orders HTTP/1.1
Host: api.shop.example.com
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json
Idempotency-Key: 7c0f6e2a-1b3d-4f5a-9e2c-8b1d3f5a7e9c

{
  "user_id": "u_8842",
  "items": [{"sku": "COFFEE-BLACK-L", "qty": 2}]
}

# Response
HTTP/1.1 201 Created
Location: /v1/orders/o_1701
Content-Type: application/json

{
  "id": "o_1701",
  "user_id": "u_8842",
  "items": [{"sku": "COFFEE-BLACK-L", "qty": 2, "price": 4.50}],
  "total": 9.00,
  "status": "created",
  "created_at": "2024-11-15T09:14:22Z"
}`
        }
      ],
      advantages: [
        'Rides on HTTP — works through firewalls, proxies, and CDNs out of the box.',
        'Stateless → horizontally scalable.',
        'Uniform interface (verbs + resources) → low cognitive load once learned.',
        'Easy to wrap as agent tools — request maps to function call, response to observation.'
      ],
      disadvantages: [
        'Multiple round-trips for related data (the "over-fetching / under-fetching" problem — GraphQL\'s pitch).',
        'No native real-time push; needs WebSocket or SSE on top.',
        'Schema is optional; many "REST" APIs are just JSON-over-HTTP with no contract.',
        'Idempotency for non-GET verbs requires explicit design (idempotency keys).'
      ],
      commonMistakes: [
        'Using GET to mutate state — breaks caches, bookmarks, and retries.',
        'Returning 200 with an error body — clients check status first and miss the failure.',
        'Embedding the version in the body instead of the URL path (/v1/...).',
        'Forgetting pagination — clients crash on a 10 MB JSON list response.'
      ],
      limitations: [
        'Not ideal for chatty, low-latency, schema-rich internal comms (use gRPC).',
        'Not ideal for client-driven flexible queries (use GraphQL).',
        'Not ideal for server push (use WebSocket / SSE).'
      ],
      relatedConcepts: ['HTTP', 'OpenAPI', 'Idempotency', 'GraphQL', 'gRPC'],
      faq: [
        { q: 'Is REST "better" than GraphQL?', a: 'Different. REST is simpler, more cacheable, and easier to wrap as agent tools. GraphQL is more flexible for clients with varied data needs. Most public APIs are REST; most internal flexible-fetch APIs are GraphQL.' },
        { q: 'Why does my agent retry POST calls and double-charge?', a: 'Your POST is not idempotent. Add an Idempotency-Key header the client generates; the server stores the response for that key and returns it on retries.' }
      ],
      summary:
        'REST is the dominant web API style: resources as URLs, HTTP verbs as operations, JSON as the body, stateless servers. Its statelessness makes it horizontally scalable and its clean request/response shape makes it easy to wrap as agent tools. Design for idempotency on writes, version in the URL, and use a schema (OpenAPI) to make the API consumable automatically.'
    },
    {
      id: 'function-calling',
      title: 'Function Calling',
      subtitle: 'The mechanism that lets an LLM emit a structured function call instead of plain text.',
      tags: ['function-calling', 'llm', 'tools'],
      readingMinutes: 7,
      definition:
        'Function calling is the capability of an LLM, given a list of function schemas (name, description, parameters), to emit a structured call to one of those functions as part of its response, rather than (or in addition to) plain text. The model does not execute the function — it produces a structured request that the calling application executes and feeds back.',
      whyItExists:
        'Without function calling, getting an LLM to trigger an action required brittle prompt engineering ("respond in JSON with field \'action\' set to…") that broke constantly: the model would wrap the JSON in prose, miss a field, or use the wrong type. Function calling exists to give models a dedicated channel for emitting structured calls — trained with examples so the output is reliably parseable, type-correct, and limited to the schema you provided.',
      howItWorks: [
        {
          type: 'p',
          text: 'On each request, the application sends the model (a) the conversation, and (b) a list of function schemas in JSON Schema format. The model responds either with text or with one or more function_call / tool_call objects containing the function name and a JSON-serialised arguments object. The application parses the call, executes the function, and appends a "function" or "tool" role message with the result. The model then produces the next response — usually text, sometimes another call.'
        },
        { type: 'h3', text: 'Function vs tool calling' },
        {
          type: 'p',
          text: 'The terms are used interchangeably, but historically: OpenAI\'s 2023 "function calling" API let the model emit one function call per turn; later "tool calling" generalised this to multiple parallel calls. Anthropic, Google, and Mistral all use "tool calling". Today "function calling" usually refers to the underlying mechanism (model emits structured call) and "tool calling" refers to the higher-level pattern (agent loop with multiple tools, possibly parallel).'
        },
        { type: 'h3', text: 'Q-in-Q (question-in-question) tool use' },
        {
          type: 'p',
          text: 'A powerful pattern: the user\'s question cannot be answered without first asking another question — answered by a tool. "What is the GDP of the country whose capital is Lima?" Step 1: the model calls get_country_by_capital("Lima") → returns "Peru". Step 2: the model, now knowing the country is Peru, calls get_gdp("Peru") → returns a number. Step 3: the model writes the final answer. The model never knew the answer to the sub-question; it learned it from the tool result. This is what makes function calling feel like reasoning rather than retrieval — the call sequence is the reasoning trace.'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The model proposes; the application executes',
          text: 'Function calling never gives the model direct access to anything. The model emits a request; your code decides whether to execute it, with what arguments (after validation), and what to feed back. This separation is the entire security model of agent tools — never let the model\'s emitted call bypass your validation, auth, or rate-limiting.'
        }
      ],
      examples: [
        { type: 'p', text: 'A weather assistant with one function. The user asks "What\'s the weather in Tokyo?" The model emits a function call get_weather(city="Tokyo"). The application executes it, gets {temp: 18, conditions: "clear"}, feeds it back. The model then writes "It\'s 18°C and clear in Tokyo." — grounded in the actual tool result, not in the model\'s weights.' },
        {
          type: 'code',
          lang: 'json',
          caption: 'A function definition sent to the model (JSON Schema)',
          code: `{
  "name": "get_weather",
  "description": "Get current weather for a city. Use when the user asks about weather, temperature, or precipitation anywhere in the world.",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "City name, e.g. \\"Tokyo\\" or \\"São Paulo\\". Use the most common English spelling."
      },
      "units": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "default": "celsius",
        "description": "Temperature units. Defaults to celsius."
      }
    },
    "required": ["city"],
    "additionalProperties": false
  }
}`
        }
      ],
      advantages: [
        'Reliable structured output — no more prompt-engineered JSON parsing.',
        'Type-correct arguments bounded by the schema.',
        'Enables agents: model proposes, app executes, result flows back.',
        'Composable: many functions can be offered; the model picks.'
      ],
      disadvantages: [
        'The model can call the wrong function or pass wrong arguments — validation is mandatory.',
        'Function descriptions dominate selection accuracy; bad descriptions = bad picks.',
        'Cost: schemas and tool results consume context tokens.',
        'Some models hallucinate function names or arguments not in the schema.'
      ],
      commonMistakes: [
        'Skipping validation — the model sometimes passes arguments outside the schema.',
        'Writing descriptions that say what the function does but not when to use it.',
        'Returning huge raw tool results into context — summarise before feeding back.',
        'Treating function calling as a security boundary — it is a structural one. You still need auth and validation in the function.'
      ],
      limitations: [
        'Quality depends on the model; smaller open models hallucinate calls more often.',
        'Schema expressiveness is limited — complex constraints (e.g. "array length equals another field") are not enforced by the model.',
        'No guarantee the model calls the function in the right order for multi-step tasks.'
      ],
      relatedConcepts: ['Tool Calling', 'JSON Schema', 'Structured Outputs', 'Q-in-Q Tool Use', 'MCP'],
      faq: [
        { q: 'Does function calling make the model an agent?', a: 'No. Function calling is one mechanism. The agent is the loop your code runs around it — calling the model, executing the function, feeding back, repeating. Function calling is necessary but not sufficient for agency.' },
        { q: 'How many functions can I pass?', a: 'Hundreds in principle, but selection accuracy drops past ~10–20. For larger function sets, retrieve the relevant functions first (RAG over function descriptions) and pass only those.' }
      ],
      summary:
        'Function calling is the LLM\'s structured-call channel: pass schemas, get a structured call back, execute it, feed the result. It replaced brittle prompt-engineered JSON with a trained, reliable mechanism. It is the foundation of tool-using agents — but it is a structural primitive, not a security boundary. Validation, auth, and rate-limiting still live in the function implementation.'
    },
    {
      id: 'tool-calling',
      title: 'Tool Calling',
      subtitle: 'The agent-level pattern built on function calling: a loop of model → tool → result → model.',
      tags: ['tool-calling', 'agents', 'openai', 'anthropic'],
      readingMinutes: 8,
      definition:
        'Tool calling is the agent-level pattern in which an LLM is presented with a set of tools (functions with schemas), emits one or more tool calls, the application executes them and appends the results as messages, and the loop repeats until the model produces a final text answer or a stop condition fires. It is function calling turned into a loop — the substrate of every tool-using agent.',
      whyItExists:
        'Function calling alone answers one question with one (or a few) calls. Real tasks need many calls, each depending on the previous result, with the model deciding when to stop and answer. Tool calling exists to turn function calling into a closed loop — the application runs the loop, the model drives it. This is the difference between a chatbot-with-functions and an agent.',
      howItWorks: [
        {
          type: 'p',
          text: 'The loop: (1) build the prompt (system + history + tool schemas + user message); (2) call the model; (3) if the response is text → return it; if the response contains tool calls → execute each call, append the results as "tool" role messages; (4) repeat. Every model provider exposes this differently in their SDK, but the underlying pattern is identical. The application owns the loop, the tool implementations, the validation, the rate limits, and the stop conditions.'
        },
        {
          type: 'interactive',
          componentId: 'tool-calling-flow',
          caption: 'The tool-calling loop: prompt → model → tool calls → execution → results → repeat.'
        },
        { type: 'h3', text: 'OpenAI vs Anthropic message shapes' },
        {
          type: 'p',
          text: 'Both providers support the same loop, but the wire format differs. OpenAI: the assistant message has a `tool_calls` array; each call has an `id`, a `function.name`, and a `function.arguments` JSON string; tool results are messages with `role: "tool"`, `tool_call_id`, and a string `content`. Anthropic: the assistant message has a `content` array mixing text and `tool_use` blocks (each with `id`, `name`, `input`); tool results are `role: "user"` messages with `tool_result` blocks referencing the `tool_use_id`. Cross-provider SDKs (Vercel AI SDK, LangChain) normalise these.'
        },
        { type: 'h3', text: 'Parallel tool calls' },
        {
          type: 'p',
          text: 'Modern models can emit multiple tool calls in one turn when the calls are independent. "Get the weather in Tokyo, London, and Sydney" can be one turn with three calls, not three turns. The application must execute them in parallel (Promise.all) and feed all results back as a batch before the next model call. Failure to parallelise wastes latency; failure to batch the results confuses the model.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Always cap the loop',
          text: 'A stuck model can emit tool calls forever — each call costs money and time. Hard-cap the loop with MAX_STEPS (10–20 for most tasks) and a dollar/token budget. When the cap fires, return the best partial answer with a note, do not silently loop.'
        }
      ],
      examples: [
        { type: 'p', text: 'A travel agent with two tools: search_flights and search_hotels. User: "Find me a flight from SFO to JFK next Friday and a hotel near Times Square." The model emits two parallel tool calls. The app executes both, returns both results. The model writes a summary with options for each. Total: 2 model calls, 2 tool calls, one final answer — about 8 seconds wall-clock.' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'Tool-calling loop — OpenAI and Anthropic side by side',
          code: `// --- OpenAI tool-calling loop ---
import OpenAI from "openai";
const openai = new OpenAI();

const tools = [{
  type: "function" as const,
  function: {
    name: "search_flights",
    description: "Search flights between two airports on a date.",
    parameters: {
      type: "object",
      properties: {
        origin: { type: "string" }, dest: { type: "string" }, date: { type: "string" }
      },
      required: ["origin", "dest", "date"]
    }
  }
}];

async function openaiLoop(userMsg: string) {
  const messages: any[] = [
    { role: "system", content: "You are a travel assistant." },
    { role: "user", content: userMsg },
  ];
  for (let i = 0; i < 10; i++) {
    const res = await openai.chat.completions.create({
      model: "gpt-4o", messages, tools,
    });
    const msg = res.choices[0].message;
    messages.push(msg);
    if (!msg.tool_calls?.length) return msg.content;          // final answer
    // Execute every tool call in parallel
    const results = await Promise.all(msg.tool_calls.map(async (call) => {
      const args = JSON.parse(call.function.arguments);
      const out = await runTool(call.function.name, args);     // dispatch + validate
      return { role: "tool", tool_call_id: call.id, content: JSON.stringify(out) };
    }));
    messages.push(...results);
  }
  throw new Error("step budget exceeded");
}

// --- Anthropic tool-calling loop ---
import Anthropic from "@anthropic-ai/sdk";
const anthropic = new Anthropic();

const anthropicTools = [{
  name: "search_flights",
  description: "Search flights between two airports on a date.",
  input_schema: {
    type: "object",
    properties: { origin: { type: "string" }, dest: { type: "string" }, date: { type: "string" } },
    required: ["origin", "dest", "date"]
  }
}];

async function anthropicLoop(userMsg: string) {
  const messages: any[] = [{ role: "user", content: userMsg }];
  for (let i = 0; i < 10; i++) {
    const res = await anthropic.messages.create({
      model: "claude-3-5-sonnet-latest", max_tokens: 1024, tools: anthropicTools, messages,
    });
    if (res.stop_reason === "end_turn") {
      return res.content.filter(b => b.type === "text").map(b => b.text).join("");
    }
    messages.push({ role: "assistant", content: res.content });
    // Collect tool_use blocks, execute in parallel, return as a user message
    const toolResults = await Promise.all(
      res.content.filter(b => b.type === "tool_use").map(async (b) => {
        const out = await runTool(b.name, b.input as any);
        return { type: "tool_result", tool_use_id: b.id, content: JSON.stringify(out) };
      })
    );
    messages.push({ role: "user", content: toolResults });
  }
  throw new Error("step budget exceeded");
}`
        }
      ],
      advantages: [
        'Turns an LLM into an agent — the loop is the agent.',
        'Parallel tool calls cut latency on independent sub-tasks.',
        'Cross-provider SDKs normalise OpenAI / Anthropic / Google / Mistral differences.',
        'Composes with retrieval, memory, and human-in-the-loop seamlessly.'
      ],
      disadvantages: [
        'Each model turn costs money and time; long loops get expensive.',
        'Stuck models loop forever without a hard cap.',
        'Wire formats differ across providers — direct API code is non-portable.',
        'Tool errors that return unhelpful messages cause the model to flail.'
      ],
      commonMistakes: [
        'No MAX_STEPS — stuck agents spend real money.',
        'Executing tool calls sequentially when they could be parallel.',
        'Not feeding tool errors back as useful messages ("401 Unauthorized" not "try again").',
        'Returning 50 KB of raw JSON as a tool result — the next turn\'s context explodes.'
      ],
      limitations: [
        'Quality is bounded by the model\'s ability to pick tools and sequence calls.',
        'No formal termination guarantee; the cap is a heuristic, not a proof.',
        'Tool call IDs must be matched exactly — losing the ID breaks the next turn.'
      ],
      relatedConcepts: ['Function Calling', 'ReAct', 'Parallel Tool Calls', 'OpenAI API', 'Anthropic API'],
      faq: [
        { q: 'Should I use the provider SDK directly or a cross-provider SDK?', a: 'Direct SDK for production with one provider (lower latency, full feature access). Cross-provider SDK (Vercel AI SDK, LangChain) for prototypes or when you must switch providers.' },
        { q: 'How do I get the model to call tools in parallel?', a: 'Describe the tools clearly, prompt the user with a request that obviously needs multiple, and ensure your loop uses Promise.all on the tool_calls array. Most modern models will parallelise when they can.' }
      ],
      summary:
        'Tool calling is function calling turned into a loop: model proposes, app executes, result flows back, repeat until text answer or step cap. OpenAI and Anthropic use different wire formats but the same pattern. Always cap the loop, execute independent calls in parallel, feed useful error messages back, and summarise large tool results before they re-enter the context.'
    },
    {
      id: 'json-schemas',
      title: 'JSON Schemas',
      subtitle: 'The vocabulary that describes what a JSON value must look like — and the contract for tool args.',
      tags: ['json-schema', 'validation', 'tools'],
      readingMinutes: 7,
      definition:
        'A JSON Schema is a JSON document that describes the shape of other JSON documents: which fields exist, what types they are, which are required, what values are allowed (enums, ranges, patterns), and how objects nest. It is the de-facto vocabulary LLM providers use to describe function parameters and structured outputs.',
      whyItExists:
        'Without a schema language, every API and tool would invent its own way to describe its inputs — and LLMs would have to learn them all. JSON Schema exists to provide one shared vocabulary so that any tool\'s arguments can be described, validated, and (with structured outputs) generated against the same contract. It is the lingua franca of tool calling: OpenAI, Anthropic, Google, and MCP all use it.',
      howItWorks: [
        {
          type: 'p',
          text: 'A JSON Schema is itself a JSON object. The "type" keyword constrains the value kind (object, array, string, number, boolean, null). "properties" lists the fields of an object and their sub-schemas. "required" lists which fields must be present. "enum" restricts a string to a fixed set. "items" describes array elements. "additionalProperties: false" forbids fields not listed in "properties". These few keywords cover ~90% of real tool schemas; the full spec adds patterns, formats (email, date-time), numeric ranges, and composition (allOf, oneOf, anyOf).'
        },
        { type: 'h3', text: 'How the schema is used in tool calling' },
        {
          type: 'p',
          text: 'When you register a tool with an LLM, you pass its JSON Schema. The provider uses it in two ways: (1) at generation, the model is constrained to emit arguments that match the schema (especially with "structured outputs" mode — see next lesson); (2) at validation, your code (and the provider) can check the model\'s emitted arguments against the schema before executing the function. The schema is the single source of truth — for the model, for your validator, and for your docs.'
        },
        { type: 'h3', text: 'Validation in practice' },
        {
          type: 'p',
          text: 'Libraries like Ajv (JS), Pydantic (Python), and jsonschema (Python) validate a JSON value against a schema and return a list of errors with paths. Every tool call from an LLM should be validated before execution — the model occasionally emits a wrong type, an extra field, or a missing required field. Validation is cheap (microseconds) and turns a confusing runtime crash into a clear "argument 1 must be string" error you can feed back to the model.'
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'additionalProperties: false is your friend',
          text: 'By default, JSON Schema allows any extra fields in an object. For tool arguments, set "additionalProperties": false so the model cannot smuggle in fields you did not define. This catches hallucinated arguments early.'
        }
      ],
      examples: [
        { type: 'p', text: 'A send_email tool needs a schema: to (string, email format, required), subject (string, required, max 120 chars), body (string, required), cc (array of strings, optional). The schema below captures all of this. The LLM is constrained to emit a JSON object matching it; your validator catches anything the model gets wrong; your function code can trust the shape.' },
        {
          type: 'code',
          lang: 'json',
          caption: 'A realistic JSON Schema for a send_email tool',
          code: `{
  "type": "object",
  "properties": {
    "to": {
      "type": "string",
      "format": "email",
      "description": "Recipient email address."
    },
    "subject": {
      "type": "string",
      "minLength": 1,
      "maxLength": 120,
      "description": "Email subject line. Max 120 characters."
    },
    "body": {
      "type": "string",
      "minLength": 1,
      "description": "Plain-text body of the email."
    },
    "cc": {
      "type": "array",
      "items": { "type": "string", "format": "email" },
      "maxItems": 20,
      "default": [],
      "description": "Optional CC recipients."
    },
    "priority": {
      "type": "string",
      "enum": ["low", "normal", "high"],
      "default": "normal"
    }
  },
  "required": ["to", "subject", "body"],
  "additionalProperties": false
}`
        },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'Validating the model\'s emitted arguments with Ajv',
          code: `import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(sendEmailSchema);

function runSendEmail(rawArgs: unknown) {
  if (!validate(rawArgs)) {
    // Feed the errors back to the model so it can self-correct
    const msg = ajv.errorsText(validate.errors, { separator: "; " });
    throw new ToolValidationError(\`Invalid arguments: \${msg}\`);
  }
  const args = rawArgs as { to: string; subject: string; body: string; cc?: string[] };
  return emailProvider.send(args);
}`
        }
      ],
      advantages: [
        'One vocabulary shared by every LLM provider and MCP.',
        'Validation is cheap and catches model mistakes before execution.',
        'With structured outputs, the schema constrains generation — guarantees shape.',
        'Schemas double as documentation and as TypeScript/Python type generators.'
      ],
      disadvantages: [
        'The full spec is huge; most users learn 10% and ignore the rest.',
        'Complex schemas (nested oneOf, recursive refs) confuse models.',
        'Strict mode (structured outputs) supports a subset — not every schema is enforceable.',
        'Schema does not encode semantics — "string" can be a credit card number, schema cannot tell.'
      ],
      commonMistakes: [
        'Forgetting "additionalProperties": false — model smuggles in extra fields.',
        'Using "format": "email" without enabling format validation in Ajv.',
        'Deeply nested schemas the model cannot fill reliably — flatten where possible.',
        'Treating the schema as a substitute for runtime validation of semantics (auth, permissions).'
      ],
      limitations: [
        'Cannot express cross-field constraints cleanly (e.g. "if A then B required") without if/then, which models handle poorly.',
        'Cannot validate against a database (e.g. "this user_id must exist") — that\'s a runtime check.',
        'Recursive schemas are valid JSON Schema but confuse most LLMs.'
      ],
      relatedConcepts: ['Structured Outputs', 'Ajv', 'Pydantic', 'OpenAPI', 'MCP Tool Schemas'],
      faq: [
        { q: 'Do I need to write schemas by hand?', a: 'No. In TypeScript use zod-to-json-schema; in Python use Pydantic\'s .model_json_schema(). You write types in your language, the library emits the JSON Schema.' },
        { q: 'What is "strict mode"?', a: 'Provider-specific feature (OpenAI structured outputs, Anthropic tool use strict) that guarantees the model output matches the schema exactly. It limits some schema features but eliminates validation failures.' }
      ],
      summary:
        'JSON Schema is the shared vocabulary for describing JSON shapes — and the contract that powers tool calling, structured outputs, and MCP. A handful of keywords (type, properties, required, enum, additionalProperties) cover most real tools. Validate every tool call before execution; set additionalProperties: false; and use libraries (zod, Pydantic) so you write types once and generate schemas from them.'
    },
    {
      id: 'structured-outputs',
      title: 'Structured Outputs',
      subtitle: 'Forcing the model to emit JSON that matches a schema — guaranteed, not best-effort.',
      tags: ['structured-outputs', 'json', 'llm'],
      readingMinutes: 6,
      definition:
        'Structured outputs is a provider feature (OpenAI "Structured Outputs", Anthropic "tool use strict mode", Google "controlled generation") that constrains the model\'s decoding so the JSON it emits is guaranteed to match a supplied JSON Schema. Unlike "JSON mode" (which only guarantees valid JSON, not a specific shape), structured outputs guarantee the shape: required fields present, types correct, enums respected, no extra fields.',
      whyItExists:
        'Without structured outputs, you prompt the model for JSON, run a parser, and on failure retry or patch — losing latency and reliability. For agent tools and downstream pipelines this fragility is unacceptable. Structured outputs exist to make the model\'s JSON output as reliable as a typed function return: parse once, trust the shape, move on. They turn "the model usually returns the right JSON" into "the model always returns the right JSON (or fails loudly)".',
      howItWorks: [
        {
          type: 'p',
          text: 'The provider implements structured outputs at the decoding level: instead of sampling freely, the model is constrained (typically via grammar-based or logits-masked decoding) to emit only tokens that lead to a JSON value matching the schema. Required fields are forced; disallowed fields are blocked; enums restrict the sampled tokens. The guarantee is structural — the output will parse and validate against the schema, or the call returns an error.'
        },
        { type: 'h3', text: 'Structured outputs vs JSON mode vs tool calling' },
        {
          type: 'table',
          headers: ['Feature', 'Guarantees', 'Use when'],
          rows: [
            ['Plain prompt for JSON', 'Nothing — model may wrap in prose, miss fields', 'Never, in production'],
            ['JSON mode', 'Valid JSON (parses), but not a specific shape', 'Free-form JSON where shape varies'],
            ['Structured outputs', 'Valid JSON matching the supplied schema', 'Fixed shape — tool args, extracted records'],
            ['Tool calling (non-strict)', 'Model usually emits matching args, validate anyway', 'Most agent tools today'],
            ['Tool calling (strict)', 'Guaranteed to match schema — like structured outputs', 'Production agent tools']
          ]
        },
        { type: 'h3', text: 'Schema subset' },
        {
          type: 'p',
          text: 'Strict decoding supports a subset of JSON Schema: type, properties, required (all properties must be required — no optionals), enum, const, items, additionalProperties: false. It does NOT support: union types (oneOf/anyOf at the top level), patterns, formats, numeric ranges, $ref to external files. To use strict mode, simplify your schema to fit the subset — flatten unions into an enum-with-prefix, mark all fields required with null as the optional marker.'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Strict means every field is required',
          text: 'OpenAI strict mode requires all properties to appear in "required". To make a field optional, declare its type as ["string", "null"] and set the value to null when absent. The field is always present in the output; its value is null when not applicable.'
        }
      ],
      examples: [
        { type: 'p', text: 'An invoice-extraction agent takes a PDF and must return a structured record: vendor name, invoice number, date, line items (each with description, qty, unit price), total. Without structured outputs, you would parse the model\'s free-form JSON and patch failures all day. With structured outputs, you pass the schema, the model returns a guaranteed-shape JSON object, and your code can treat it as a typed value.' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'OpenAI Structured Outputs — guaranteed shape',
          code: `import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const Invoice = z.object({
  vendor: z.string(),
  invoice_number: z.string(),
  date: z.string(),                          // ISO date
  line_items: z.array(z.object({
    description: z.string(),
    quantity: z.number().int().positive(),
    unit_price: z.number().nonnegative(),
  })),
  total: z.number().nonnegative(),
});

const openai = new OpenAI();
const res = await openai.beta.chat.completions.parse({
  model: "gpt-4o-2024-08-06",
  messages: [
    { role: "system", content: "Extract the invoice fields from the user-provided text." },
    { role: "user", content: invoiceText },
  ],
  response_format: zodResponseFormat(Invoice, "invoice"),
});

// Guaranteed to match the schema — no try/catch on parse
const invoice = res.choices[0].message.parsed;
console.log(invoice.vendor, invoice.total);`
        }
      ],
      advantages: [
        'Guaranteed shape — no parsing failures, no retry loops.',
        'Enables typed pipelines downstream (TypeScript types, Pydantic models).',
        'Reduces hallucinated fields (additionalProperties: false is enforced).',
        'Works for tool args and for free-form extraction alike.'
      ],
      disadvantages: [
        'Schema subset is restrictive — no top-level unions, no patterns, no formats.',
        'Latency is slightly higher (decoding is constrained).',
        'All fields must be required; optionals become null unions.',
        'Tight coupling to provider — code is less portable across models.'
      ],
      commonMistakes: [
        'Expecting strict mode to enforce semantic constraints (e.g. "email format") — it does not.',
        'Using optional fields — convert to "type": ["string","null"] and add to required.',
        'Forgetting that strict mode still lets the model pick wrong values within the schema (e.g. wrong enum choice).',
        'Treating structured outputs as a substitute for content validation (a well-shaped answer can still be wrong).'
      ],
      limitations: [
        'Subset of JSON Schema only; complex schemas must be simplified.',
        'Provider-specific; cross-provider portability requires a normalisation layer.',
        'Does not guarantee the *content* is correct, only the *shape*.'
      ],
      relatedConcepts: ['JSON Schema', 'JSON Mode', 'Tool Calling', 'Zod', 'Pydantic'],
      faq: [
        { q: 'Should I use structured outputs or tool calling for agent tools?', a: 'Both — use strict tool calling. It gives you the structured-outputs guarantee applied to tool arguments, plus the agent loop. Plain structured outputs are better for one-shot extraction without a loop.' },
        { q: 'What if my schema needs unions?', a: 'Either split into multiple tools (one per branch) or flatten into an enum + optional fields. Top-level unions are not supported in strict mode on most providers today.' }
      ],
      summary:
        'Structured outputs constrain the model\'s decoding so its JSON matches a schema — guaranteed. They replace fragile prompt-then-parse patterns with a typed return. The trade-off is a schema subset (no unions, all fields required) and provider-specific APIs. For agent tools, use strict tool calling to combine the guarantee with the agent loop.'
    },
    {
      id: 'tool-validation',
      title: 'Tool Validation',
      subtitle: 'Never trust the model — validate every argument before the tool touches the world.',
      tags: ['validation', 'tools', 'security'],
      readingMinutes: 6,
      definition:
        'Tool validation is the practice of checking every tool call\'s arguments (and, where relevant, its result) against a schema and against semantic rules before the tool executes. It is the boundary that turns "the model said do this" into "we have checked this is a legal, permitted, well-formed request — now execute it".',
      whyItExists:
        'LLMs hallucinate arguments, swap field types, invent enum values, omit required fields, and occasionally emit calls you never declared. A tool that trusts the model directly is a tool that will crash, leak data, or be exploited. Validation exists because the model is a structural proposer, not a trusted caller — every argument must be checked exactly as you would check untrusted user input from a web form.',
      howItWorks: [
        {
          type: 'p',
          text: 'Validation has three layers. (1) Structural: does the JSON match the schema? (types, required fields, enum, additionalProperties) — use Ajv / Pydantic. (2) Semantic: do the values make sense? (e.g. "user_id exists in the database", "date is in the future", "amount > 0 and within the user\'s balance") — implemented in code. (3) Authorisational: is this caller permitted to do this? (covered in the Authorization lesson). All three must pass before the tool executes its side effect.'
        },
        { type: 'h3', text: 'The four failure modes validation catches' },
        {
          type: 'ul',
          items: [
            'Wrong type — model emits a string where the schema requires a number.',
            'Extra fields — model adds fields not in the schema (additionalProperties: false catches these).',
            'Out-of-range values — model emits an enum value that does not exist, or a date in the past.',
            'Cross-field inconsistency — model emits end_date before start_date (semantic check).'
          ]
        },
        { type: 'h3', text: 'What to do when validation fails' },
        {
          type: 'p',
          text: 'Do not crash the agent. Return a structured error message back to the model as the tool result: "Invalid arguments: \'date\' must be in ISO 8601 format, got \'tomorrow\'". The model often self-corrects on the next turn. After 2–3 validation failures for the same call, give up and surface the failure to the user. Crashing wastes the entire run; a clear error message lets the agent recover.'
        },
        {
          type: 'callout',
          variant: 'danger',
          title: 'Validation is not authorisation',
          text: 'A schema-valid, semantically-valid tool call from the model may still be unauthorised — "delete this user\'s account" might be well-formed but the caller lacks permission. Validation checks the request is well-formed; authorization checks the request is permitted. Both must pass.'
        }
      ],
      examples: [
        { type: 'p', text: 'A transfer_money tool receives {from: "u_123", to: "u_456", amount: -50}. Structural validation passes (all fields present, all strings/numbers). Semantic validation fails: amount must be positive. The tool returns "Invalid arguments: amount must be greater than 0". The model retries with amount: 50, which passes — but authorisation then fails because u_123 cannot transfer to u_456. The tool returns "Forbidden: u_123 cannot transfer to u_456". The model gives up and surfaces the error to the user.' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Layered validation in a Python tool (Pydantic + semantic checks)',
          code: `from pydantic import BaseModel, Field, ValidationError, model_validator
from typing import Annotated

class TransferArgs(BaseModel):
    from_user: str = Field(alias="from")
    to_user: str
    amount: Annotated[float, Field(gt=0, le=1_000_000)]

    @model_validator(mode="after")
    def _no_self_transfer(self):
        if self.from_user == self.to_user:
            raise ValueError("from_user and to_user must differ")
        return self

def transfer_money(raw_args: dict, caller_id: str) -> dict:
    # Layer 1: structural (Pydantic raises ValidationError on bad shape/types)
    try:
        args = TransferArgs.model_validate(raw_args)
    except ValidationError as e:
        return {"error": "invalid_arguments", "detail": e.json()}

    # Layer 2: semantic (caller is who they claim; recipient exists)
    if args.from_user != caller_id:
        return {"error": "forbidden", "detail": "from_user must match the authenticated caller"}
    if not user_exists(args.to_user):
        return {"error": "not_found", "detail": f"user {args.to_user} does not exist"}
    if get_balance(args.from_user) < args.amount:
        return {"error": "insufficient_funds"}

    # Layer 3: execute (only after all checks pass)
    tx = ledger.transfer(args.from_user, args.to_user, args.amount)
    return {"tx_id": tx.id, "new_balance": tx.from_balance}`
        }
      ],
      advantages: [
        'Catches model mistakes before they cause real side effects.',
        'Clear error messages let the agent self-correct on the next turn.',
        'Decouples "is the request well-formed" from "is the request permitted" — both must pass.',
        'Cheap: validation is microseconds; a single failed side effect is far more expensive.'
      ],
      disadvantages: [
        'Adds a layer of code per tool — but this is non-negotiable, not optional.',
        'Strict schemas limit what the model can express — but that is the point.',
        'Validation errors must be designed as messages, not exceptions — extra discipline.'
      ],
      commonMistakes: [
        'Trusting the model because the call "looks right" — validate anyway, always.',
        'Crashing the agent on validation failure instead of returning a useful error message.',
        'Validating structure but skipping semantic checks (existence, ranges, cross-field).',
        'Conflating validation with authorisation — they are separate concerns with separate checks.'
      ],
      limitations: [
        'Validation cannot catch semantically wrong-but-legal calls (e.g. "transfer to the wrong person").',
        'Complex cross-field rules are hard to express in schemas alone — write them in code.',
        'Validation runs per-call; it cannot reason about a sequence of calls.'
      ],
      relatedConcepts: ['JSON Schema', 'Pydantic', 'Ajv', 'Authorization', 'Error Handling'],
      faq: [
        { q: 'Should I validate even in strict (structured outputs) mode?', a: 'Yes. Strict mode guarantees the shape, not the semantics. You still need existence checks, range checks, and authorization.' },
        { q: 'What if validation fails repeatedly?', a: 'After 2–3 failures for the same call, surface to the user with the error detail. Looping forever burns budget; the model has likely misunderstood the task.' }
      ],
      summary:
        'Tool validation is the boundary between "the model proposed" and "the tool executed". Three layers — structural (schema), semantic (existence, ranges, cross-field), authorisational (permission) — must all pass before any side effect. On failure, return a clear message so the model can self-correct. Never trust the model; treat its calls like untrusted user input from a web form.'
    },
    {
      id: 'authentication',
      title: 'Authentication',
      subtitle: 'Who is the caller? Proving identity before any tool runs.',
      tags: ['authentication', 'security', 'api'],
      readingMinutes: 6,
      definition:
        'Authentication (authn) is the process of verifying the identity of a caller — a user, a service, or an agent — before granting access to a tool or API. It answers "who are you?" by checking a credential (password, API key, OAuth token, mTLS certificate, signed JWT). It is distinct from authorization, which answers "what are you allowed to do?" and runs after authentication.',
      whyItExists:
        'Every tool that touches real data or performs real actions must know who is calling it. Without authentication, anyone can call transfer_money on anyone\'s behalf. Authentication exists to bind each request to an identity so that subsequent authorization, audit logs, and rate limits have a subject to act on. For agents, authentication matters twice: the agent itself must authenticate to the tools it calls, and the end-user on whose behalf the agent acts must be authenticated to the agent.',
      howItWorks: [
        {
          type: 'p',
          text: 'A caller presents a credential with each request. The server verifies it and attaches the resulting identity to the request context. Common credential types: (1) API keys — a long random string identifying the caller; (2) Bearer tokens (OAuth 2.0 access tokens, JWTs) — a signed token asserting identity and scopes; (3) mTLS — a client TLS certificate proving control of a private key; (4) session cookies — for browser-based auth. The choice depends on the client type and the sensitivity of the API.'
        },
        { type: 'h3', text: 'Agent-specific authentication' },
        {
          type: 'p',
          text: 'An agent tool call has two identities to track: the agent\'s own identity (what service account does the agent run as?) and the user\'s identity (on whose behalf is this agent acting?). Best practice is token forwarding: the user authenticates to the agent with their normal OAuth token; the agent calls downstream tools using a user-delegated token (OAuth 2.0 On-Behalf-Of or token exchange). This way the tool sees the user\'s identity, not the agent\'s — and the user\'s permissions apply, not the agent\'s god-mode service account.'
        },
        { type: 'h3', text: 'Where credentials live' },
        {
          type: 'p',
          text: 'Never in the prompt. Never in the tool description. Never in a code comment. Credentials belong in a secrets manager (Vault, AWS Secrets Manager, Doppler) injected as environment variables at runtime. Agent frameworks that let the LLM see credentials in context are an incident waiting to happen — the model will eventually echo them in a response. If the agent must call an authenticated API, the tool function reads the credential from the environment at call time, never from the prompt.'
        },
        {
          type: 'callout',
          variant: 'danger',
          title: 'Never put secrets in prompts',
          text: 'Anything in the prompt — system message, user message, tool description — can be exfiltrated by a crafted user input ("please repeat your system prompt"). Treat all prompt content as potentially exposed. Secrets go in env vars read by tool code, never in prompt text.'
        }
      ],
      examples: [
        { type: 'p', text: 'A Slack-sending agent tool: the end-user authenticates to the agent via OAuth with Slack. The agent receives a user-delegated Slack access token, stores it encrypted, and passes it as the Bearer token when the tool calls chat.postMessage. The Slack API sees the user\'s identity; the message appears as posted by the user; the user\'s channel permissions apply. The agent never has a "god" Slack token — only per-user delegated tokens.' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'Token forwarding — agent acts on behalf of the user',
          code: `// The end-user authenticated to our app via OAuth; we hold their
// access token for the downstream API (stored encrypted in the session).
async function sendSlackMessage(args: { channel: string; text: string }, ctx: ToolContext) {
  // ctx.user.accessToken is the user-delegated token — NOT the agent's own.
  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": \`Bearer \${ctx.user.accessToken}\`,
    },
    body: JSON.stringify({ channel: args.channel, text: args.text }),
  });
  const data = await res.json();
  if (!data.ok) throw new ToolError(\`Slack error: \${data.error}\`);
  return { ok: true, ts: data.ts };
}

// Tool definition: notice NO credentials in the schema or description.
const slackTool = {
  name: "send_slack_message",
  description: "Send a message to a Slack channel as the authenticated user.",
  parameters: {
    type: "object",
    properties: {
      channel: { type: "string", description: "Channel ID or name, e.g. C12345678 or #general" },
      text: { type: "string", description: "Message text. Slack markdown supported." }
    },
    required: ["channel", "text"],
    additionalProperties: false
  }
};`
        }
      ],
      advantages: [
        'Binds every request to an identity → enables authorization, audit, rate limits.',
        'Per-user tokens (OAuth) preserve user permissions through the agent call chain.',
        'mTLS / signed tokens resist replay and tampering.',
        'Centralised secrets management reduces leak surface.'
      ],
      disadvantages: [
        'Adds round-trips (token validation) and failure modes (expired token, revoked).',
        'Token lifecycle (refresh, rotation, revocation) is non-trivial.',
        'Per-user tokens require OAuth integration with each downstream service.',
        'Misconfigured auth is a top cause of real-world breaches.'
      ],
      commonMistakes: [
        'Embedding API keys in tool descriptions or system prompts.',
        'Using a single god-mode service account instead of per-user delegated tokens.',
        'Not validating tokens (signature, expiry, issuer) before trusting them.',
        'Logging Authorization headers — they contain live credentials.'
      ],
      limitations: [
        'Authentication confirms identity, not intent — a real user can still make a bad request.',
        'Token compromise is silent until noticed; short TTLs and revocation lists mitigate.',
        'OAuth flows are complex; mistakes in token exchange break the whole chain.'
      ],
      relatedConcepts: ['Authorization', 'OAuth 2.0', 'JWT', 'mTLS', 'Secrets Management'],
      faq: [
        { q: 'API key or OAuth token?', a: 'API key for service-to-service where one service owns the credentials. OAuth for user-delegated access where the agent acts on behalf of a human user — the user\'s permissions must apply, not the agent\'s.' },
        { q: 'How do I let the agent call an API without exposing the key to the LLM?', a: 'Keep the key in an env var. The tool function reads it at call time. The LLM only sees the tool name and argument schema — never the credential.' }
      ],
      summary:
        'Authentication proves who the caller is. Agents have two identities to manage: their own (service account) and the user\'s (delegated token). Use OAuth token forwarding so tools see the user, not the agent. Keep credentials in env vars read by tool code — never in prompts or tool descriptions. Authentication is necessary but not sufficient: authorization runs next.'
    },
    {
      id: 'authorization',
      title: 'Authorization',
      subtitle: 'What is this caller allowed to do? Enforcing permissions on every tool call.',
      tags: ['authorization', 'security', 'rbac'],
      readingMinutes: 7,
      definition:
        'Authorization (authz) is the process of deciding, after authentication has established who the caller is, whether that caller is permitted to perform the requested action on the requested resource. It answers "what are you allowed to do?" Common models are role-based access control (RBAC), attribute-based access control (ABAC), and capability-based access control.',
      whyItExists:
        'Authentication without authorization is a front door with no interior doors — once you are in, you can go anywhere. Real systems have differentiated permissions: a support agent can read tickets but not refund money; a user can edit their own profile but not anyone else\'s. Authorization exists to enforce these distinctions on every tool call, so that even a perfectly-authenticated, perfectly-validated request can be denied if the caller lacks permission.',
      howItWorks: [
        {
          type: 'p',
          text: 'After authentication attaches an identity to the request, the authorization layer checks: "is this identity permitted to perform this action on this resource?" In RBAC, the identity has roles (admin, editor, viewer); each role has a permission list (read:ticket, write:ticket, refund:payment); the check is "does any of the caller\'s roles grant this permission?". In ABAC, the check considers attributes of caller, resource, and context (e.g. "caller.department == resource.department AND action == read").'
        },
        { type: 'h3', text: 'Authorization at the tool boundary' },
        {
          type: 'p',
          text: 'For agent tools, authorization must run inside the tool, on every call, using the authenticated caller\'s identity. A tool that performs a write action (send_email, transfer_money, delete_file) must check the caller\'s permission before executing. The model cannot be trusted to self-censor — even if the system prompt says "only send emails the user has approved", a crafted user input can talk the model into calling send_email. The tool is the last line of defense.'
        },
        { type: 'h3', text: 'Per-resource checks' },
        {
          type: 'p',
          text: 'RBAC alone is not enough. "Can the caller send emails?" is a coarse check; "can the caller send emails on behalf of marketing@company.com?" is the real question. Most production authorization combines a role check (broad) with a resource-ownership check (specific): "caller is in role \'email_sender\' AND caller has access to the requested from_address". This catches the case where a user has permission to send some emails but not the one the model picked.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Deny by default',
          text: 'Default-deny: if the authorization check has any ambiguity (unknown role, missing ownership record, expired token), deny the call and surface a clear error. Default-allow is how breaches happen. The model will retry; the user will complain; that is the correct cost of a security boundary.'
        }
      ],
      examples: [
        { type: 'p', text: 'A delete_document tool. The caller is authenticated as alice@company.com. Authorization: (1) role check — does alice have the "document:delete" permission? (2) ownership check — does alice own the requested document_id? (3) policy check — is the document in a "draft" state (deletable) or "published" (only admins delete)? If any check fails, return a 403-style error to the model. The model can surface it to the user; it cannot bypass it.' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'Authorization middleware applied to every tool',
          code: `type Permission = \`read:\${string}\` | \`write:\${string}\` | \`delete:\${string}\`;
type ToolContext = { user: { id: string; roles: string[]; permissions: Set<Permission> } };

// Map each tool to the permission it requires.
const TOOL_PERMISSIONS: Record<string, Permission> = {
  delete_document:   "delete:document",
  send_email:        "write:email",
  transfer_money:    "write:payment",
  list_user_orders:  "read:order",
};

function authorize(toolName: string, ctx: ToolContext) {
  const required = TOOL_PERMISSIONS[toolName];
  if (!required) return; // tool not in the map → deny by default would be safer
  if (!ctx.user.permissions.has(required)) {
    throw new AuthorizationError(\`User lacks permission: \${required}\`);
  }
}

// Per-resource ownership check, run inside the tool after the broad check.
async function deleteDocument(args: { document_id: string }, ctx: ToolContext) {
  authorize("delete_document", ctx);                       // role check
  const doc = await db.documents.findById(args.document_id);
  if (!doc) throw new ToolError("document not found");
  if (doc.owner_id !== ctx.user.id && !ctx.user.roles.includes("admin")) {
    throw new AuthorizationError("not the document owner");  // ownership check
  }
  if (doc.status === "published" && !ctx.user.roles.includes("admin")) {
    throw new AuthorizationError("published docs require admin to delete"); // policy
  }
  await db.documents.delete(args.document_id);
  return { deleted: true };
}`
        }
      ],
      advantages: [
        'Enforces differentiated access — the right users can do the right things, no more.',
        'Last line of defense: even if the model is talked into calling a tool, authz stops it.',
        'Audit trail: every denial is logged with caller, action, resource, reason.',
        'Decouples "who can do what" policy from tool implementation (RBAC/ABAC engine).'
      ],
      disadvantages: [
        'Adds a check per tool call — small latency, large complexity if done well.',
        'Policy sprawl: hundreds of permission strings become unmaintainable without discipline.',
        'Per-resource checks require DB lookups — cache carefully or pay the latency.',
        'Wrong policy = broken product (user cannot do their job) or breach (user can do too much).'
      ],
      commonMistakes: [
        'Trusting the LLM to enforce permissions via system prompt — bypassable by prompt injection.',
        'Coarse role checks without per-resource ownership checks.',
        'Default-allow instead of default-deny.',
        'Not logging denials — silent failures hide both bugs and attacks.'
      ],
      limitations: [
        'Cannot reason about sequences of calls (e.g. "user transferred $1 then $1 then $1 to dodge the $3 limit") — needs aggregate rate limiting too.',
        'Policy changes are slow to propagate if permissions are cached long.',
        'Hard to test exhaustively — authorization bugs hide in edge cases.'
      ],
      relatedConcepts: ['Authentication', 'RBAC', 'ABAC', 'Prompt Injection', 'Default-Deny'],
      faq: [
        { q: 'Can the system prompt enforce authorization?', a: 'No. The system prompt is a request to the model; prompt injection can override it. Authorization must be enforced in code at the tool boundary, on every call, regardless of what the model thinks.' },
        { q: 'RBAC or ABAC?', a: 'Start with RBAC — it covers most cases and is simple. Move to ABAC when roles become too coarse (e.g. you need "editors can edit documents in their own department only"). Most systems end up with RBAC + a few ABAC-style ownership checks.' }
      ],
      summary:
        'Authorization decides what an authenticated caller may do. For agent tools it must run inside every tool, on every call, combining role checks (broad permission) with resource-ownership checks (specific permission). Default-deny. Log every denial. Never trust the system prompt to enforce authorization — prompt injection can override it. Authorization is the last line of defense between the model and a real-world side effect.'
    },
    {
      id: 'mcp-intro',
      title: 'What is MCP (Model Context Protocol)?',
      subtitle: 'An open standard for connecting AI models to external tools, resources, and prompts.',
      tags: ['mcp', 'protocol', 'standards'],
      readingMinutes: 7,
      definition:
        'The Model Context Protocol (MCP) is an open protocol, introduced by Anthropic in late 2024, that standardises how AI applications (hosts) expose context to models: tools (functions the model can call), resources (data the model can read), and prompts (templated instructions). An MCP server implements one of these capabilities; any MCP-compatible client (Claude Desktop, Cursor, an agent framework) can use it without bespoke integration per tool.',
      whyItExists:
        'Before MCP, every agent framework had its own tool-definition format, every model provider had its own function-calling API, and every integration was a one-off adapter. Writing a "search Jira" tool meant writing it once for LangChain, again for OpenAI Assistants, again for Claude, again for Cursor — and rewriting when any of them changed. MCP exists to be the "USB-C of AI tools": write the server once, any client that speaks MCP can use it. It exists because tool interoperability is the bottleneck holding back the agent ecosystem.',
      howItWorks: [
        {
          type: 'p',
          text: 'MCP is a JSON-RPC 2.0 protocol spoken between a client (inside the AI application) and a server (the thing exposing tools/resources/prompts). On connection the client calls initialize to negotiate version and capabilities. The client then calls tools/list to discover available tools (each with a name, description, and JSON Schema for arguments). When the model wants to call a tool, the client calls tools/call with the tool name and arguments; the server executes and returns a result (or error). Resources and prompts follow analogous list/get patterns.'
        },
        { type: 'h3', text: 'Why MCP matters for tool interoperability' },
        {
          type: 'p',
          text: 'Without a standard, every tool is bespoke to one client. With MCP, a single server — say, "github-mcp" — is usable by Claude Desktop, Cursor, Continue, Zed, and any custom agent that speaks MCP. The server author writes the GitHub integration once; every AI application gets it for free. The model sees the same tool description regardless of which client exposed it. This is the same dynamic that made HTTP the substrate of the web: a shared wire format unlocks an ecosystem.'
        },
        { type: 'h3', text: 'Transports: stdio vs SSE vs streamable HTTP' },
        {
          type: 'p',
          text: 'MCP defines multiple transports. stdio: the client spawns the server as a subprocess and communicates over its standard input/output — simplest, works locally, no port to manage, used by Claude Desktop for local integrations. SSE (Server-Sent Events) over HTTP: the server is a long-running process the client connects to over HTTP — supports remote servers, multi-client, but is being phased out. Streamable HTTP: the newer (2025) transport that supports both request/response and server-initiated notifications over a single HTTP endpoint, replacing SSE for remote use. The choice of transport is invisible to the server logic — the same tool handlers work over any transport.'
        },
        {
          type: 'table',
          headers: ['Transport', 'Where', 'Best for'],
          rows: [
            ['stdio', 'Local subprocess', 'Claude Desktop, single-user local integrations'],
            ['SSE (legacy)', 'Remote HTTP', 'Older remote servers; being replaced'],
            ['Streamable HTTP', 'Remote HTTP', 'Modern remote servers, multi-tenant']
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'MCP is transport-independent',
          text: 'A well-written MCP server registers the same tool handlers regardless of transport. You can run the same server over stdio for local testing and over streamable HTTP for production without changing tool code — only the entry-point wiring differs.'
        }
      ],
      examples: [
        { type: 'p', text: 'A developer wants their AI assistant to query a private Postgres database. They install a postgres-mcp server, point it at the DB, and configure their client (Claude Desktop, Cursor) to launch it. The client discovers tools like list_tables, describe_table, query. The user asks the assistant "show me the top 10 customers by revenue this month"; the assistant calls query via MCP and renders the result. No code was written against a specific AI app\'s SDK — the postgres-mcp server works for any MCP-compatible client.' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'Minimal MCP server skeleton (TypeScript SDK)',
          code: `import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "echo-server", version: "1.0.0" });

// Register a tool with a Zod schema (the SDK converts to JSON Schema for the client)
server.tool(
  "echo",
  { text: z.string().describe("The text to echo back") },
  async (args) => ({
    content: [{ type: "text", text: \`echo: \${args.text}\` }]
  })
);

// Register a resource (data the model can read)
server.resource(
  "server-info",
  "info://server",
  async (uri) => ({
    contents: [{ uri: uri.href, mimeType: "text/plain", text: "echo-server v1.0.0" }]
  })
);

// Register a prompt (templated instructions)
server.prompt(
  "summarise",
  { topic: z.string() },
  async ({ topic }) => ({
    messages: [{ role: "user", content: { type: "text", text: \`Summarise: \${topic}\` } }]
  })
);

// Run over stdio (swap for HttpServerTransport for remote)
const transport = new StdioServerTransport();
await server.connect(transport);`
        }
      ],
      advantages: [
        'Write the integration once, any MCP-compatible client can use it.',
        'Standard JSON-RPC wire format — easy to inspect and debug.',
        'Three primitives (tools, resources, prompts) cover most agent integrations.',
        'Open spec, multiple SDKs (TS, Python, Go, Java, Rust) — no vendor lock-in.'
      ],
      disadvantages: [
        'Young protocol; breaking changes between spec versions still happen.',
        'Stdio transport requires the client to manage subprocess lifecycle — non-trivial.',
        'Tool discovery (tools/list) returns all tools at once — does not scale to hundreds without paging.',
        'Adoption is uneven across AI applications; not every client supports every MCP feature.'
      ],
      commonMistakes: [
        'Treating MCP as "just another tool API" — the value is interoperability, not the wire format.',
        'Hard-coding transport choice into server logic — keep handlers transport-agnostic.',
        'Exposing every internal function as an MCP tool — surfaces too many tools, degrades model selection.',
        'Not versioning the server\'s tool list — clients break when tools disappear or change schemas.'
      ],
      limitations: [
        'No built-in authorization model — servers must enforce their own auth (often via OAuth).',
        'No native streaming for tool results (works for resources, awkward for tools).',
        'Discoverability across servers (the "MCP registry" problem) is still being solved.'
      ],
      relatedConcepts: ['JSON-RPC', 'stdio Transport', 'Streamable HTTP', 'MCP Tools', 'MCP Resources', 'MCP Prompts'],
      faq: [
        { q: 'Is MCP only for Claude?', a: 'No. Anthropic introduced it, but the spec is open and the SDKs are open-source. Cursor, Continue, Zed, Cline, and many custom agents support MCP. OpenAI announced MCP support in 2025. It is cross-vendor by design.' },
        { q: 'MCP vs OpenAPI?', a: 'OpenAPI describes REST APIs for human/SDK consumption. MCP describes tools/resources/prompts for LLM consumption. They overlap (both describe callable functions) but MCP adds the agent-loop primitives (prompts, resources, sampling) and the JSON-RPC transport.' }
      ],
      summary:
        'MCP is the open standard for connecting AI models to external context. It defines a JSON-RPC protocol with three primitives — tools, resources, prompts — spoken over stdio (local) or streamable HTTP (remote). Its value is interoperability: write the server once, any MCP client can use it. It is the substrate on which a portable agent-tool ecosystem is being built.'
    },
    {
      id: 'mcp-hosts-clients-servers',
      title: 'MCP Hosts, Clients, and Servers',
      subtitle: 'The three roles in every MCP deployment — and where your code lives in each.',
      tags: ['mcp', 'architecture', 'host', 'client', 'server'],
      readingMinutes: 6,
      definition:
        'An MCP deployment has three roles. The host is the AI application the user interacts with (Claude Desktop, Cursor, a custom agent). The client is the component inside the host that speaks MCP to one server (one client per server connection). The server is the external process that exposes tools, resources, and prompts. One host may run many clients, each connected to one server.',
      whyItExists:
        'The three-role split exists to enforce separation of concerns. The host owns the user interaction, the model, and the trust relationship with the user. The client is a thin protocol adapter. The server owns its domain (GitHub, Postgres, the filesystem) and its own security model. This separation lets servers be developed and trusted independently of any host, and lets hosts mix-and-match servers without re-implementing integrations. It is the same separation that made device drivers a separate concern from the OS kernel.',
      howItWorks: [
        {
          type: 'p',
          text: 'The user adds an MCP server to their host (via config file or UI). The host spawns one client per configured server. Each client opens a connection (stdio for local servers, HTTP for remote), calls initialize to negotiate version and capabilities, and then exposes the server\'s tools/resources/prompts to the host\'s model. When the model calls a tool, the host routes the call to the corresponding client, which calls tools/call on its server and returns the result. The host aggregates tools from all connected servers into a single list for the model.'
        },
        { type: 'h3', text: 'Who owns what' },
        {
          type: 'table',
          headers: ['Concern', 'Owner', 'Notes'],
          rows: [
            ['User interaction, model choice', 'Host', 'Cursor, Claude Desktop, your custom app'],
            ['Tool result presentation to model', 'Host', 'Host formats results into the model\'s context'],
            ['MCP wire protocol', 'Client', 'One client per server; thin adapter'],
            ['Tool execution, domain logic', 'Server', 'GitHub API calls, SQL queries, etc.'],
            ['Server-side auth (e.g. OAuth to GitHub)', 'Server', 'Server holds the credentials it needs'],
            ['User approval to use a tool', 'Host', 'Host may prompt user before risky tool calls']
          ]
        },
        { type: 'h3', text: 'Sampling: when the server calls back to the host' },
        {
          type: 'p',
          text: 'A lesser-known MCP capability: a server can ask the host\'s model to do work, via the sampling primitive. The server sends a prompt; the host runs it through the model (with the user\'s approval) and returns the result. This is how a server can do "summarise this file" without needing its own LLM — it delegates to the host\'s model. Sampling is opt-in (hosts can refuse) and always user-approved for security.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'The host is the trust root',
          text: 'Servers are external code. A malicious or compromised server can return misleading tool results, attempt prompt injection via resource content, or use sampling to exfiltrate data. The host must treat server output as untrusted — display resource content with care, prompt-injection-sanitise tool results, and require user approval for sampling and risky tool calls.'
        }
      ],
      examples: [
        { type: 'p', text: 'A developer uses Cursor (host) with three MCP servers configured: filesystem-mcp (read files), github-mcp (manage PRs), and postgres-mcp (query the dev DB). Cursor spawns three clients, one per server, and exposes ~15 tools to the model. The developer asks "review the open PRs in my repo and tell me which ones touch the auth module." The model calls github-mcp\'s list_prs tool, then for each PR calls filesystem-mcp\'s read_file on the changed paths, then answers. Three servers, one host, one coherent task.' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'Host-side: spawning multiple clients and aggregating tools',
          code: `import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

// Host: spawn one client per configured server
async function startClient(serverConfig: ServerConfig) {
  const transport = new StdioClientTransport({
    command: serverConfig.command,
    args: serverConfig.args,
    env: serverConfig.env,
  });
  const client = new Client({ name: "my-host", version: "1.0.0" });
  await client.connect(transport);
  return client;
}

const clients = await Promise.all(SERVERS.map(startClient));

// Aggregate tools from every connected client into one list for the model
async function allTools() {
  const lists = await Promise.all(clients.map(c => c.listTools()));
  return lists.flatMap((res, i) =>
    res.tools.map(t => ({
      ...t,
      // Namespace tool names so two servers cannot collide
      namespacedName: \`\${SERVERS[i].name}__\${t.name}\`,
      serverIndex: i,
    }))
  );
}

// When the model calls a tool, route to the correct client
async function callTool(namespacedName: string, args: any) {
  const [serverIdx, toolName] = parseNamespaced(namespacedName);
  const result = await clients[serverIdx].callTool({ name: toolName, arguments: args });
  return result.content;  // feed back to the model as a tool message
}`
        }
      ],
      advantages: [
        'Clean separation: host owns UX/trust, server owns domain — each evolves independently.',
        'One host, many servers — mix-and-match integrations without code changes.',
        'Servers are reusable across every MCP-compatible host.',
        'Sampling lets servers delegate LLM work to the host\'s model (no per-server LLM cost).'
      ],
      disadvantages: [
        'Subprocess lifecycle (stdio transport) is fiddly — crashes, hangs, partial output.',
        'Tool-name collisions across servers need namespacing at the host.',
        'Latency stacks: each tool call is a JSON-RPC round-trip to a subprocess.',
        'Trust boundary is fuzzy — servers can return prompt-injection content; hosts must defend.'
      ],
      commonMistakes: [
        'Trusting server output without sanitising (prompt injection via resource content).',
        'Not namespacing tool names — two servers with a "search" tool collide silently.',
        'Spawning one client per call instead of one per server — leaks processes.',
        'Forgetting to handle server crashes — the host should reconnect or surface the failure.'
      ],
      limitations: [
        'No native cross-server orchestration — each call is independent; chaining is the host\'s job.',
        'Stdio transport does not support remote servers (use streamable HTTP for that).',
        'Sampling is optional; many hosts disable it for security.'
      ],
      relatedConcepts: ['MCP', 'JSON-RPC', 'Sampling', 'Tool Namespacing', 'Prompt Injection'],
      faq: [
        { q: 'Can one server serve multiple hosts simultaneously?', a: 'Over stdio, no — each host spawns its own subprocess. Over streamable HTTP, yes — the server handles multiple client connections, but each is independent (no shared state by default).' },
        { q: 'Where does authorisation live — host or server?', a: 'Both. The host decides whether to ask the user for approval before calling a tool. The server enforces its own auth (e.g. OAuth to GitHub) and its own per-tool permissions. Neither alone is sufficient.' }
      ],
      summary:
        'Every MCP deployment has three roles: host (AI application, owns user trust), client (one per server, protocol adapter), server (owns domain and tools). The host aggregates tools from all servers, routes calls to the right client, and treats server output as untrusted. The split enables a portable ecosystem: servers are reusable across every MCP-compatible host.'
    },
    {
      id: 'mcp-tools-resources-prompts',
      title: 'MCP Tools, Resources, and Prompts',
      subtitle: 'The three primitives an MCP server exposes — and when to use each.',
      tags: ['mcp', 'tools', 'resources', 'prompts'],
      readingMinutes: 7,
      definition:
        'An MCP server exposes three kinds of primitives. Tools are functions the model can call (with arguments, returning a result). Resources are data the model can read (addressed by URI, returned as bytes or text). Prompts are templated instructions the host can insert into the conversation (with arguments, returning messages). Each primitive has a distinct purpose; choosing the right one is the main MCP design decision.',
      whyItExists:
        'LLM integrations need three different things: "do this action" (call an API), "read this data" (fetch a file or row), and "use this prompt template" (apply a known-good instruction). Conflating them — putting everything as a tool, or everything as a resource — produces awkward integrations. MCP separates them so each is handled with the right semantics: tools are active (the model calls them and they have side effects), resources are passive (the model reads them, no side effects), prompts are structural (the host inserts them, not the model).',
      howItWorks: [
        {
          type: 'p',
          text: 'Tools are exposed via tools/list (returns name, description, JSON Schema) and tools/call (executes with arguments, returns content blocks). Resources are exposed via resources/list (returns URIs and metadata) and resources/read (returns the bytes for a URI). Resources can also be templates (resources/templates/list) with URI templates like "file:///{path}" so the model can construct a URI for any path. Prompts are exposed via prompts/list and prompts/get — the host calls prompts/get with arguments and receives a ready-to-insert message list.'
        },
        { type: 'h3', text: 'Choosing between them' },
        {
          type: 'table',
          headers: ['Primitive', 'When to use', 'Side effects', 'Who triggers'],
          rows: [
            ['Tool', 'Do an action: call API, mutate state, send message', 'Yes (potentially)', 'Model decides'],
            ['Resource', 'Read data: file content, DB row, config', 'No (read-only)', 'Host / model reads'],
            ['Prompt', 'Apply a known-good instruction template', 'No (just produces text)', 'User picks from menu']
          ]
        },
        { type: 'h3', text: 'Why the distinction matters' },
        {
          type: 'p',
          text: 'A file should be a resource, not a tool — reading it has no side effects, and resources support caching, range requests, and subscription (notifications when the resource changes). A "send email" action should be a tool — it has side effects and needs the model\'s decision. A "code review" instruction with a known-good structure should be a prompt — the user explicitly invokes it from the host\'s UI, fills in arguments, and the host inserts the resulting messages. Getting this right is what makes an MCP server feel native rather than bolted-on.'
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Resources can be subscribed to',
          text: 'MCP supports resource subscriptions: the client subscribes to a URI and the server notifies on change. This is how a server can keep the model\'s context fresh ("the current error log") without the model polling. Use subscriptions for live data the model needs to reason about.'
        }
      ],
      examples: [
        { type: 'p', text: 'A github-mcp server exposes all three. Tools: create_issue, merge_pr, request_review (actions, side effects, model-driven). Resources: repo://owner/name/file/main.py (read-only file content, host can cache and subscribe), issue://owner/name/123 (issue content). Prompts: "summarise_pr" (user invokes from menu, fills {repo, pr_number}, host inserts "Summarise PR #{pr_number} in {repo}…" as the user message).' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'A server exposing one of each primitive',
          code: `const server = new McpServer({ name: "demo", version: "1.0.0" });

// TOOL — action with side effects, model decides when to call
server.tool(
  "create_issue",
  {
    repo: z.string().describe("owner/name, e.g. anthropics/anthropic-sdk-python"),
    title: z.string(),
    body: z.string().default("")
  },
  async (args) => {
    const issue = await github.issues.create(args.repo, args.title, args.body);
    return { content: [{ type: "text", text: \`Created #\${issue.number}: \${issue.url}\` }] };
  }
);

// RESOURCE — read-only data, addressed by URI, cacheable and subscribable
server.resource(
  "repo-file",
  new ResourceTemplate("repo://{repo}/file/{path}", { list: undefined }),
  async (uri, { repo, path }) => {
    const content = await github.files.read(repo as string, path as string);
    return {
      contents: [{
        uri: uri.href,
        mimeType: "text/plain",
        text: content
      }]
    };
  }
);

// PROMPT — templated instruction the user explicitly invokes
server.prompt(
  "summarise_pr",
  { repo: z.string(), pr_number: z.number() },
  async ({ repo, pr_number }) => {
    const pr = await github.pulls.get(repo, pr_number);
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: \`Summarise the changes in PR #\${pr_number} in \${repo}.\\n\\nTitle: \${pr.title}\\n\\nDiff (first 4000 chars):\\n\${pr.diff.slice(0, 4000)}\`
          }
        }
      ]
    };
  }
);`
        }
      ],
      advantages: [
        'Each primitive has the right semantics (active / passive / structural).',
        'Resources support caching and subscriptions — efficient for live data.',
        'Prompts let users invoke known-good instruction templates from the host UI.',
        'Tools are the only primitive with side effects → clear security boundary.'
      ],
      disadvantages: [
        'Three primitives to learn; designers sometimes default to "make it a tool" for everything.',
        'Resource URIs need careful design to avoid collisions and to be enumerable.',
        'Prompt templates mix server-side logic (fetching the PR) with user-facing instructions — boundary is fuzzy.',
        'Hosts vary in which primitives they fully support (resources and prompts less uniformly than tools).'
      ],
      commonMistakes: [
        'Exposing read-only data as a tool instead of a resource — loses caching, subscriptions, range requests.',
        'Exposing an action as a resource — the model will "read" it and expect data, not a side effect.',
        'Stuffing business logic into prompts that should be in tools (or vice versa).',
        'Not documenting URIs — resource templates must be discoverable for the host to use them.'
      ],
      limitations: [
        'No native cross-primitive composition — a tool cannot atomically read a resource and act on it.',
        'Prompt templates that fetch data (like the PR summary example) couple server-side data access to user invocation, which is unusual.',
        'Tool result size is bounded by the protocol; large results should be a resource the model reads separately.'
      ],
      relatedConcepts: ['MCP', 'URI Templates', 'Resource Subscriptions', 'Tool Calling'],
      faq: [
        { q: 'Should file content be a tool or a resource?', a: 'Resource. Reading a file has no side effects, supports caching, and the host can subscribe to changes. A "delete_file" action, by contrast, must be a tool.' },
        { q: 'When would I use a prompt instead of just letting the model decide?', a: 'When there is a known-good instruction template users invoke explicitly ("code review", "summarise PR", "draft release notes"). Prompts are user-driven, not model-driven — they appear in the host\'s slash-menu, not as tools the model picks.' }
      ],
      summary:
        'MCP servers expose three primitives: tools (actions, model-driven, side effects), resources (read-only data, URI-addressed, cacheable and subscribable), prompts (templated instructions, user-invoked). Choosing the right primitive for each capability is the main MCP design decision — read-only data is a resource, actions are a tool, reusable instructions are a prompt.'
    },
    {
      id: 'tool-permissions',
      title: 'Tool Permissions',
      subtitle: 'Scoping what each tool can do — read vs write, per-user, per-resource.',
      tags: ['permissions', 'security', 'tools', 'mcp'],
      readingMinutes: 6,
      definition:
        'Tool permissions are the rules that scope what a given tool, called by a given user via a given agent, is allowed to do. They sit on top of authentication (who is calling) and authorization (are they allowed this action) to add finer-grained controls: which resources the tool may touch, which arguments are permitted, whether the call requires human approval, and what budget it consumes.',
      whyItExists:
        'A bare "is this user allowed to call send_email?" check is too coarse for production agents. The real questions are: "to which addresses?", "with what daily volume cap?", "does this require approval for the first email to a new recipient?", "what is the per-user dollar budget?". Tool permissions exist because the model will eventually ask the tool to do something at the edge of what is acceptable, and the answer must be programmable — not left to the model\'s judgement or a single yes/no flag.',
      howItWorks: [
        {
          type: 'p',
          text: 'A permission system sits between the agent loop and the tool implementation. Before executing a tool call, it checks a policy that combines: caller identity, tool name, tool arguments, history (rate, budget, prior approvals), and resource ownership. If the policy allows, the call proceeds; if it denies, an error is returned to the model; if it requires approval, the call is paused and surfaced to a human (in-app, via Slack, via email) who can approve or deny.'
        },
        { type: 'h3', text: 'The read / write / admin spectrum' },
        {
          type: 'p',
          text: 'The simplest permission dimension is the read/write/admin axis. Read tools (search, lookup, get) are safe to call autonomously. Write tools (create, update, delete, send) need scoping — to a resource set, to a rate limit, and often to a human-approval gate for the first occurrence. Admin tools (delete user, deploy to prod, change billing) require human approval every time. Tag every tool with its tier and enforce gates accordingly.'
        },
        { type: 'h3', text: 'Approval patterns' },
        {
          type: 'ul',
          items: [
            'Always-approve: every call requires human sign-off (used for irreversible actions).',
            'First-of-its-kind approve: first call to a new recipient/resource needs approval; subsequent are auto.',
            'Threshold approve: small amount auto, large amount needs approval.',
            'Rate-limit deny: more than N calls per hour → deny (not approve).',
            'Circuit-breaker deny: if N calls fail in a window, pause the tool entirely.'
          ]
        },
        {
          type: 'callout',
          variant: 'danger',
          title: 'The model is not a permission system',
          text: 'Telling the model "only send emails the user has approved" via system prompt is not a permission — it is a request. Prompt injection can override it. Real permissions are enforced in code, on every call, with a policy engine that the model cannot influence.'
        }
      ],
      examples: [
        { type: 'p', text: 'A send_email tool with layered permissions: (1) caller must have email:write permission; (2) "from" address must be one the caller owns; (3) "to" must be in the caller\'s contact list OR a human approves the first send; (4) max 50 emails/hour, max 200/day; (5) if the subject contains "invoice", require human approval. Each rule is a function returning allow/deny/require-approval. The model sees only the final decision and the reason — never the rules.' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'A permission policy engine applied to every tool call',
          code: `type Decision = { allow: true } | { allow: false; reason: string } | { requireApproval: string };

interface PermissionRule {
  (args: any, ctx: ToolContext, history: CallHistory): Decision;
}

const sendEmailRules: PermissionRule[] = [
  // 1. From-address ownership
  (args, ctx) =>
    ctx.user.ownedEmails.includes(args.from)
      ? { allow: true }
      : { allow: false, reason: \`you do not own \${args.from}\` },
  // 2. Recipient must be known, else require approval
  (args, ctx, history) => {
    if (ctx.user.contacts.includes(args.to)) return { allow: true };
    const previouslyApproved = history.approvedRecipients.has(args.to);
    return previouslyApproved
      ? { allow: true }
      : { requireApproval: \`first email to \${args.to}\` };
  },
  // 3. Rate limit
  (_args, _ctx, history) =>
    history.callsLastHour("send_email") < 50
      ? { allow: true }
      : { allow: false, reason: "rate limit: 50 emails/hour" },
  // 4. Sensitive-content approval
  (args) =>
    /invoice|payment|refund/i.test(args.subject)
      ? { requireApproval: "sensitive subject requires approval" }
      : { allow: true },
];

async function enforceSendEmail(args: any, ctx: ToolContext, history: CallHistory) {
  for (const rule of sendEmailRules) {
    const decision = rule(args, ctx, history);
    if (decision.allow === false) throw new ToolError(decision.reason);
    if ("requireApproval" in decision) {
      const ok = await requestHumanApproval(ctx.user.id, decision.requireApproval, args);
      if (!ok) throw new ToolError("user denied approval");
      history.approvedRecipients.add(args.to);   // remember for next time
    }
  }
  return emailProvider.send(args);
}`
        }
      ],
      advantages: [
        'Fine-grained control that "yes/no authorisation" cannot express.',
        'Human-approval gates let risky actions run safely without blocking routine ones.',
        'Rate limits and circuit breakers protect against runaway agents.',
        'Rules are codified, auditable, and version-controlled — not embedded in prompts.'
      ],
      disadvantages: [
        'More moving parts — every tool needs a policy; policies need tests.',
        'Approval gates add latency (human response time can be minutes).',
        'Complex policies can become hard to reason about; rule ordering matters.',
        'A misconfigured rule can block legitimate work or allow harmful calls.'
      ],
      commonMistakes: [
        'Using only role-based authorization without per-call permission rules.',
        'Forgetting rate limits — a runaway agent can send 10,000 emails in minutes.',
        'Making approval gates too aggressive — users get alert fatigue and start approving everything blindly.',
        'Not testing policies — write property-based tests for permission rules just like for business logic.'
      ],
      limitations: [
        'Cannot reason about the *content* of a tool call beyond pattern matching (e.g. "is this email deceptive?").',
        'Approval latency can make agents impractical for time-sensitive tasks.',
        'Rules that depend on history require fast, accurate call-history storage.'
      ],
      relatedConcepts: ['Authorization', 'Approval Gates', 'Rate Limiting', 'Circuit Breakers', 'Prompt Injection'],
      faq: [
        { q: 'How do I balance safety and latency with approval gates?', a: 'Use first-of-its-kind approval (approve once, auto after) for medium-risk actions, and threshold approval (auto up to X, approve above) for variable-magnitude actions. Reserve always-approve for irreversible damage.' },
        { q: 'Should permissions be per-tool or per-argument?', a: 'Both. Per-tool for the broad "can the caller use this tool"; per-argument for the specific "can they use it this way". The send_email example shows both: caller has email:write (per-tool) AND from-address ownership (per-argument).' }
      ],
      summary:
        'Tool permissions scope what each tool can do per caller, per argument, per history. They layer on top of authorization with rate limits, approval gates, circuit breakers, and per-argument resource checks. The model is never the permission system — rules are enforced in code on every call. Design rules to be testable, audit-friendly, and forgiving of routine cases while blocking risky ones.'
    },
    {
      id: 'tool-error-handling',
      title: 'Error Handling',
      subtitle: 'When tools fail, the agent should recover or surface — not crash or loop.',
      tags: ['errors', 'tools', 'agents', 'reliability'],
      readingMinutes: 6,
      definition:
        'Tool error handling is the discipline of anticipating, classifying, and responding to tool failures inside the agent loop: network errors, validation errors, authorisation errors, business-rule violations, timeouts, and partial successes. The goal is that a tool failure produces either a self-correction (the model retries with better arguments) or a clear user-facing message — never an unhandled exception or an infinite loop.',
      whyItExists:
        'In a non-agent system, a tool failure is a 500 to the user. In an agent system, the same failure can be a recovery opportunity — the model reads the error message and retries with different arguments, or reports the problem clearly. Error handling exists because agents uniquely can self-correct from structured errors, but only if errors are surfaced as useful messages rather than thrown as exceptions or hidden as generic failures.',
      howItWorks: [
        {
          type: 'p',
          text: 'Every tool call is wrapped in a try/catch. Caught errors are classified into a small taxonomy: validation_error (bad arguments — model should retry), auth_error (caller lacks permission — surface to user, no retry), rate_limit (back off and retry), transient (network/timeout — retry with backoff), business_error (e.g. "insufficient funds" — surface to user, model may try a different approach), and internal_error (server bug — surface, do not retry). Each class produces a different tool-result message and a different recovery strategy.'
        },
        { type: 'h3', text: 'Errors as tool results, not exceptions' },
        {
          type: 'p',
          text: 'The agent loop must convert tool failures into tool-result messages, not let them propagate as exceptions. A thrown exception terminates the whole run; a returned error message lets the model decide what to do. The error message must be useful: include the error class, the specific field or constraint that failed, and a hint about what to change. "Invalid arguments: \'date\' must be ISO 8601 (e.g. 2024-11-15), got \'tomorrow\'" is useful; "validation failed" is not.'
        },
        { type: 'h3', text: 'Retry vs surface vs give up' },
        {
          type: 'table',
          headers: ['Error class', 'Recovery', 'Max attempts'],
          rows: [
            ['validation_error', 'Model retries with corrected args', '2–3'],
            ['transient (network)', 'Framework retries with backoff', '3'],
            ['rate_limit', 'Framework backs off (e.g. 60s)', '2'],
            ['auth_error', 'Surface to user; do not retry', '0'],
            ['business_error', 'Surface to user; model may try a different approach', '1'],
            ['internal_error', 'Surface; do not retry', '0']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Beware the retry loop',
          text: 'A model that gets the same validation error twice will often keep emitting the same wrong arguments. Cap per-tool retries at 2–3, and after the cap, return a final error to the user with the full error history. Uncapped retries are how agents spend $50 going in circles.'
        }
      ],
      examples: [
        { type: 'p', text: 'A travel agent calls book_flight with a date in the past. The tool returns {error: "validation_error", field: "date", detail: "date must be in the future, got 2024-01-15"}. The model reads this, asks the user for the correct date, retries, succeeds. Without structured error handling, the same call would throw, the agent would crash, and the user would see "internal error" with no path forward.' },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'Structured error handling in the agent loop',
          code: `type ToolError = {
  error: "validation_error" | "auth_error" | "rate_limit" | "transient" | "business_error" | "internal_error";
  field?: string;
  detail: string;
  retryable: boolean;
};

async function callToolSafely(name: string, args: any, ctx: ToolContext): Promise<string> {
  try {
    const result = await tools[name].run(args, ctx);
    return JSON.stringify(result);
  } catch (e) {
    const err = classifyError(e);            // -> ToolError
    logToolError(name, args, err, ctx);
    // Return as a tool-result message — do NOT throw. The model reads it.
    return JSON.stringify(err);
  }
}

function classifyError(e: unknown): ToolError {
  if (e instanceof ToolValidationError)
    return { error: "validation_error", field: e.field, detail: e.message, retryable: true };
  if (e instanceof AuthorizationError)
    return { error: "auth_error", detail: e.message, retryable: false };
  if (e instanceof RateLimitError)
    return { error: "rate_limit", detail: "rate limited; retry in 60s", retryable: true };
  if (e instanceof TimeoutError || isNetworkError(e))
    return { error: "transient", detail: "network error; will retry", retryable: true };
  if (e instanceof BusinessRuleError)
    return { error: "business_error", detail: e.message, retryable: false };
  return { error: "internal_error", detail: "unexpected server error", retryable: false };
}

// In the loop:
const result = await callToolSafely(call.name, args, ctx);
messages.push({ role: "tool", tool_call_id: call.id, content: result });
// The model reads the result; if it is a retryable error, it may emit a new call
// with corrected arguments. The MAX_STEPS cap prevents infinite retries.`
        }
      ],
      advantages: [
        'Models self-correct from clear error messages instead of crashing the run.',
        'Structured taxonomy lets the framework apply the right recovery per error class.',
        'Users get actionable messages ("insufficient funds") instead of "internal error".',
        'Logs of classified errors are gold for improving tools and prompts.'
      ],
      disadvantages: [
        'Adds a classification layer — but this is non-negotiable in production.',
        'Error messages become part of the model\'s context; poorly-worded messages can mislead.',
        'Cap-too-high = wasted budget; cap-too-low = premature failure. Tuning required.'
      ],
      commonMistakes: [
        'Throwing exceptions out of the agent loop — terminates the whole run.',
        'Returning generic "error" messages — model cannot self-correct.',
        'Not capping retries — same wrong args emitted forever.',
        'Retrying on auth_error or internal_error — wastes budget on unrecoverable failures.'
      ],
      limitations: [
        'Classification is heuristic; some errors straddle classes (e.g. a 500 from a downstream that is really a rate limit).',
        'Models sometimes "fix" the wrong thing — change a different argument and fail again.',
        'Cannot recover from semantic wrongness (the call succeeded but did the wrong thing).'
      ],
      relatedConcepts: ['Tool Validation', 'Retry with Backoff', 'Circuit Breakers', 'Agent Step Caps'],
      faq: [
        { q: 'Should I retry on validation_error?', a: 'Yes, but cap at 2–3. The model often corrects on retry. If it keeps making the same mistake, surface to the user — the model has likely misunderstood the task.' },
        { q: 'What if every tool call fails?', a: 'Probably a systemic issue (auth expired, network down, downstream outage). Stop the run, surface a single clear message to the user, do not let the agent keep trying every tool.' }
      ],
      summary:
        'Tool error handling converts failures into structured tool-result messages the model can recover from. Classify errors into a small taxonomy, return useful messages with field-level detail, cap retries, and never throw out of the agent loop. The result is agents that self-correct on minor mistakes and surface clear messages on real failures — instead of crashing or looping.'
    },
    {
      id: 'sandboxing',
      title: 'Sandboxing',
      subtitle: 'Running untrusted agent code and tools in isolation — the only safe way to give an agent shell access.',
      tags: ['sandboxing', 'security', 'isolation', 'containers'],
      readingMinutes: 7,
      definition:
        'Sandboxing is the practice of executing untrusted or risky code — a coding agent\'s shell commands, a data-analysis agent\'s Python, an MCP server\'s tool implementation — inside an isolated environment with restricted access to the network, filesystem, process tree, and host resources. A sandbox is the boundary that lets you give an agent real capabilities (run code, read files) without giving it the keys to your laptop or production servers.',
      whyItExists:
        'A coding agent with shell access can do anything: read your SSH keys, exfiltrate your source code, install malware, delete your home directory. A data-analysis agent running untrusted Python can do the same. Sandboxing exists because the value of these agents depends on giving them real execution capability, and that capability is unsafe without isolation. There is no middle ground — either the agent runs sandboxed, or it should not run untrusted code at all.',
      howItWorks: [
        {
          type: 'p',
          text: 'A sandbox restricts what code inside it can reach. The four key axes: (1) filesystem — what paths are visible and writable; (2) network — what hosts can be contacted, if any; (3) process — can it spawn subprocesses, signal other processes; (4) resources — CPU, memory, time, disk quotas. Sandboxing technologies enforce these at different layers: OS-level (Linux namespaces, seccomp), container-level (Docker, Podman), VM-level (Firecracker, gVisor), or language-level (WASM, restricted Python eval). The choice trades off isolation strength against startup latency and operational complexity.'
        },
        { type: 'h3', text: 'Sandbox technologies compared' },
        {
          type: 'table',
          headers: ['Technology', 'Isolation', 'Startup', 'Best for'],
          rows: [
            ['Linux namespaces + seccomp', 'Strong (kernel-level)', '~ms', 'Custom high-throughput sandboxes'],
            ['Docker / Podman container', 'Strong (shared kernel)', '~100ms–1s', 'Coding agents, MCP servers, dev environments'],
            ['gVisor (sandboxed runtime)', 'Very strong (user-space kernel)', '~100ms–1s', 'Stronger isolation than default Docker'],
            ['Firecracker microVM', 'Very strong (KVM)', '~125ms', 'Multi-tenant agent hosting (Lambda, Fargate style)'],
            ['WebAssembly (WASM)', 'Strong (language-level)', '~ms', 'Embedding untrusted code in an app'],
            ['Restricted Python (ast rewriting)', 'Weak (same process)', 'instant', 'Toy sandboxes; never for real untrusted code']
          ]
        },
        { type: 'h3', text: 'The mandatory baseline' },
        {
          type: 'p',
          text: 'Any sandbox running untrusted agent code must, at minimum: (1) have no network egress by default — opt-in per host, never blanket allow; (2) mount only the working directory, read-only except for an explicit scratch directory; (3) not mount secrets, SSH keys, cloud credentials, or .env files from the host; (4) run as a non-root user with dropped capabilities; (5) have CPU, memory, and wall-clock limits; (6) write an audit log of every command executed. Anything less is not a sandbox — it is a container with extra steps.'
        },
        {
          type: 'callout',
          variant: 'danger',
          title: 'Restricted Python is not a sandbox',
          text: 'Python\'s ast-rewriting "restricted" modes (RestrictedPython, ast literal_eval) are bypassable in many versions and are NOT a security boundary. They are fine for trusting-your-own-users scenarios; they are not fine for running code an LLM wrote in response to user input. Use a container or microVM.'
        }
      ],
      examples: [
        { type: 'p', text: 'A coding-agent product runs each session in a fresh Docker container: base image with the project repo mounted read-only, a /workspace directory mounted read-write, no network egress except to a package-proxy allowlist, root disabled, 2 CPU / 4 GB RAM / 30 min wall clock, every shell command logged. When the session ends, the container is destroyed. If the agent tries to read ~/.ssh/id_rsa, the path does not exist in the container; if it tries to curl an external host, the connection is refused.' },
        {
          type: 'code',
          lang: 'bash',
          caption: 'A hardened Docker invocation for a coding-agent sandbox',
          code: `docker run --rm -i \\
  --network none \\
  --memory 4g --cpus 2 --pids-limit 256 \\
  --read-only \\
  --tmpfs /tmp:rw,size=512m,mode=1777 \\
  --mount type=bind,source=/repo,target=/repo,readonly \\
  --mount type=volume,dst=/workspace,volume-driver=local,ao=ro \\
  --mount type=tmpfs,dst=/workspace,ao=rw \\
  --cap-drop ALL \\
  --security-opt no-new-privileges \\
  --security-opt seccomp=/etc/docker/seccomp-agent.json \\
  --user 1000:1000 \\
  --workdir /workspace \\
  --env PYTHONUNBUFFERED=1 \\
  agent-runtime:latest

# What this gives you:
# - --network none              → no egress, no ingress
# - --read-only rootfs          → cannot write to /usr, /etc, /bin
# - --tmpfs /tmp                → scratch space, dies with the container
# - bind /repo readonly         → can read the project, cannot modify it
# - volume /workspace rw        → writable workspace, isolated from host
# - --cap-drop ALL              → no Linux capabilities (no mknod, no net_admin, ...)
# - no-new-privileges           → cannot escalate via setuid binaries
# - seccomp profile             → further restricts syscalls (no ptrace, no mount, ...)
# - --user 1000:1000            → non-root inside the container
# - memory/cpu/pids limits      → resource caps prevent fork bombs and OOM storms`
        },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'Sandbox gateway: every tool call that runs code routes through here',
          code: `import Docker from "dockerode";
const docker = new Docker();

async function runInSandbox(code: string, projectPath: string): Promise<string> {
  const container = await docker.createContainer({
    Image: "agent-runtime:latest",
    Cmd: ["python", "-c", code],
    HostConfig: {
      NetworkMode: "none",                            // no network
      Memory: 4 * 1024 ** 3,                          // 4 GB
      NanoCpus: 2 * 1e9,                              // 2 CPUs
      PidsLimit: 256,
      ReadonlyRootfs: true,
      AutoRemove: true,
      CapDrop: ["ALL"],
      SecurityOpt: ["no-new-privileges"],
      Mounts: [
        { Type: "bind", Source: projectPath, Target: "/repo", ReadOnly: true },
        { Type: "tmpfs", Target: "/workspace", TmpfsOptions: { SizeBytes: 512 * 1024 ** 2 } },
      ],
    },
    User: "1000:1000",
    WorkingDir: "/workspace",
  });
  await container.start();

  const stream = await container.attach({ stream: true, stdout: true, stderr: true });
  let output = "";
  stream.on("data", (chunk) => { output += chunk.toString(); });

  // Hard wall-clock cap — kill if exceeded
  const timeout = setTimeout(() => container.kill({ signal: "SIGKILL" }), 30_000);
  const exitCode = await container.wait();
  clearTimeout(timeout);

  if (exitCode.StatusCode !== 0) {
    throw new ToolError(\`sandboxed code exited \${exitCode.StatusCode}\\n\${output.slice(-4000)}\`);
  }
  return output;
}`
        }
      ],
      advantages: [
        'Lets you give agents real execution capability without risking the host.',
        'Per-task isolation: a compromised session cannot reach another session.',
        'Resource caps prevent runaway code from taking down the host.',
        'Audit logs of every command support post-hoc incident analysis.'
      ],
      disadvantages: [
        'Adds startup latency (100ms–1s per container; more for microVMs).',
        'Operational complexity: image maintenance, orchestration, log shipping.',
        'Over-restriction can break legitimate agent workflows (no network = no package install).',
        'Sandbox escapes, while rare, are not impossible — keep kernel and runtime patched.'
      ],
      commonMistakes: [
        'Mounting the host home directory into the container "for convenience" — leaks all secrets.',
        'Allowing network egress by default — exfiltration is the first thing a malicious agent tries.',
        'Running as root inside the container — defeats most capability restrictions.',
        'Treating RestrictedPython / eval as a sandbox — it is not.'
      ],
      limitations: [
        'Container escapes are rare but real (kernel CVEs); for true untrusted multi-tenant code, use microVMs.',
        'Latency makes per-call sandboxing impractical for high-throughput tools — sandbox once per session instead.',
        'Some legitimate agent workflows need network (package install); allowlisting proxies are the compromise.'
      ],
      relatedConcepts: ['Containers', 'Linux Namespaces', 'seccomp', 'gVisor', 'Firecracker', 'WebAssembly'],
      faq: [
        { q: 'Docker or microVMs?', a: 'Docker for single-tenant coding agents where you trust the user (it is their own code). MicroVMs (Firecracker, gVisor) for multi-tenant hosting where one user\'s code might attack another. The stronger isolation is worth the latency for multi-tenant.' },
        { q: 'Can the agent install packages?', a: 'Only through an allowlisting proxy. Run pip install through a private PyPI mirror that vetoes known-malicious packages and requires approval for new ones. Or pre-bake the image with the dependencies the project actually needs.' }
      ],
      summary:
        'Sandboxing is the boundary that lets agents run real code without endangering the host. The mandatory baseline: no network egress, read-only rootfs, no host secrets mounted, non-root user, dropped capabilities, seccomp, resource caps, audit logs. Containers are the workhorse; microVMs for multi-tenant. Restricted Python and language-level restrictions are not sandboxes — use real isolation for any code an LLM wrote.'
    }
  ]
}
