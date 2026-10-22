import type { Module } from './types'

export const module11: Module = {
  id: 'm11',
  index: 11,
  title: 'AI Development Frameworks',
  shortTitle: 'AI Frameworks',
  description:
    'The production toolchain for building LLM applications. Ten frameworks and APIs you will actually ship: Hugging Face Transformers, LangChain, LangGraph, LlamaIndex, CrewAI, AutoGen, PydanticAI, Semantic Kernel, the major model-provider APIs, and the Model Context Protocol (MCP). Each lesson ships with a real install command and a runnable minimal example — no invented APIs.',
  level: 'Advanced',
  icon: 'Library',
  color: 'from-teal-500 to-emerald-500',
  quizId: 'q11',
  lessons: [
    // -------------------------------------------------------------------------
    // 1. Hugging Face Transformers
    // -------------------------------------------------------------------------
    {
      id: 'huggingface-transformers',
      title: 'Hugging Face Transformers',
      subtitle: 'The universal Python interface for downloading, running, and fine-tuning transformer models.',
      tags: ['transformers', 'huggingface', 'inference', 'fine-tuning'],
      readingMinutes: 9,
      definition:
        'Hugging Face Transformers is an open-source library (Python, with sister ports in JS/Rust/Swift) that gives a single API for downloading, running, and fine-tuning thousands of pretrained transformer models from the Hugging Face Hub — spanning NLP, vision, audio, and multimodal.',
      whyItExists:
        'Before Transformers, every model architecture (BERT, GPT, T5, Whisper) shipped its own codebase, tokenizer, and inference path. The library unifies all of them behind `AutoModel.from_pretrained(...)` so the same code works across hundreds of architectures. The Hub (huggingface.co) is the distribution layer. Maintained by Hugging Face Inc., Apache-2.0 licensed.',
      howItWorks: [
        { type: 'h3', text: 'Core concepts' },
        {
          type: 'ul',
          items: [
            'Auto classes — `AutoModel`, `AutoTokenizer`, `AutoConfig` resolve architecture from a model repo id at load time.',
            'Pipeline — a high-level `task → model` wrapper for inference in one line (sentiment, generation, ASR, etc.).',
            'Hub model repos — every model has an id like `"bert-base-uncased"` or `"mistralai/Mistral-7B-Instruct-v0.3"` that resolves to a git-LFS repo.',
            'Tokenizers — fast Rust-backed tokenizers (`AutoTokenizer.from_pretrained`) shared between training and inference.',
            'Chat templates — Jinja templates stored on the model repo that format messages into the model\'s expected prompt string.',
            'Trainer / TRL — high-level training loops for fine-tuning, including SFT, DPO, and PPO via the TRL library.'
          ]
        },
        { type: 'h3', text: 'Installation' },
        {
          type: 'code',
          lang: 'bash',
          caption: 'Install Transformers plus PyTorch as the backend',
          code: `pip install transformers torch
# For accelerated inference / training:
pip install transformers accelerate`
        },
        { type: 'h3', text: 'Minimal working example' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Sentiment analysis with the high-level pipeline API',
          code: `from transformers import pipeline

classifier = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
)
result = classifier("I absolutely loved this course!")
print(result)
# [{'label': 'POSITIVE', 'score': 0.9998}]`
        },
        {
          type: 'p',
          text: 'For generation with a chat model, load the model and tokenizer explicitly, apply the model\'s chat template, and call `generate()`. This is the path you will use for any open-weight LLM (Llama, Mistral, Qwen, Phi).'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Chat with a small instruct model on a single GPU',
          code: `import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "Qwen/Qwen2.5-1.5B-Instruct"
tok = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id, torch_dtype=torch.bfloat16, device_map="auto"
)

messages = [{"role": "user", "content": "Explain gradient descent in one sentence."}]
inputs = tok.apply_chat_template(messages, add_generation_prompt=True, return_tensors="pt").to(model.device)
out = model.generate(inputs, max_new_tokens=120)
print(tok.decode(out[0][inputs.shape[-1]:], skip_special_tokens=True))`
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Streaming tokens from a causal LM',
          code: `from transformers import TextIteratorStreamer
from threading import Thread

streamer = TextIteratorStreamer(tok, skip_prompt=True, skip_special_tokens=True)
gen_kwargs = dict(inputs=inputs, streamer=streamer, max_new_tokens=200)
Thread(target=model.generate, kwargs=gen_kwargs).start()
for token in streamer:
    print(token, end="", flush=True)`
        }
      ],
      advantages: [
        'One API across hundreds of architectures — switch models by changing the repo id.',
        'Massive open ecosystem: most open-weight models are published on the Hub.',
        'Excellent fine-tuning support via `Trainer` and TRL (SFT, DPO, PPO).',
        'Backend-agnostic: PyTorch, JAX, and TensorFlow variants of many models.'
      ],
      disadvantages: [
        'Abstraction can hide performance pitfalls (e.g. default fp32 loading wastes memory).',
        'Some community models are stale, broken, or unsafe — read the model card.',
        'Loading very large models requires extra plumbing (accelerate, device_map, quantization).'
      ],
      commonMistakes: [
        'Forgetting `torch_dtype` and `device_map` — defaults load in fp32 on CPU, often OOMing on consumer GPUs.',
        'Calling `tokenizer(...)` instead of `apply_chat_template(...)` for instruct models — the model sees an unformatted prompt and produces garbage.',
        'Using `padding_side="right"` when batched generation needs left padding (and vice versa).',
        'Fine-tuning a 7B model on a single 24GB GPU without LoRA / QLoRA and OOMing.'
      ],
      limitations: [
        'Inference throughput is lower than dedicated serving runtimes (vLLM, TGI, SGLang) for production traffic.',
        'No built-in agent loop, tool calling, or memory — you compose those yourself or use a framework.',
        'Quantized formats (GGUF, AWQ) often require sibling libraries (`gguf`, `autoawq`).'
      ],
      relatedConcepts: ['Tokenizers', 'Chat Templates', 'Fine-Tuning', 'LoRA / QLoRA', 'vLLM', 'Model Hub'],
      faq: [
        { q: 'Should I use Transformers or a serving engine like vLLM in production?', a: 'Use Transformers for prototyping, fine-tuning, and any architecture vLLM does not yet support. Use vLLM/TGI/SGLang for high-throughput serving of mainstream architectures — they are 5-20x faster for concurrent requests.' },
        { q: 'When should I NOT use this framework?', a: 'When you only need a hosted API (GPT-4o, Claude) — the OpenAI/Anthropic SDKs are simpler and faster to integrate. Transformers shines for open-weight models you run yourself.' }
      ],
      summary:
        'Transformers is the lingua franca for open-weight models: one API to load, run, and fine-tune essentially every transformer architecture. Use it for research, fine-tuning, and architectures not covered by serving engines; switch to vLLM/TGI for high-throughput production serving.'
    },

    // -------------------------------------------------------------------------
    // 2. LangChain
    // -------------------------------------------------------------------------
    {
      id: 'langchain',
      title: 'LangChain',
      subtitle: 'Reusable LLM application components composed with the LCEL pipe operator.',
      tags: ['langchain', 'lcel', 'chains', 'rag'],
      readingMinutes: 9,
      definition:
        'LangChain is an open-source framework for building applications powered by LLMs. It provides modular components — chat models, prompt templates, output parsers, retrievers, tools — and the LangChain Expression Language (LCEL) for composing them into pipelines with the `|` operator.',
      whyItExists:
        'Building an LLM app directly with provider SDKs means re-implementing prompt templating, retries, streaming, structured output, retrieval, and tool use for every provider. LangChain packages these as composable `Runnable` objects and adds integrations for 100+ document loaders, vector stores, and tools. Maintained by LangChain Inc., MIT-licensed.',
      howItWorks: [
        { type: 'h3', text: 'Core concepts' },
        {
          type: 'ul',
          items: [
            'Runnable — the universal interface: every component exposes `.invoke()`, `.stream()`, `.batch()`, and `.ainvoke()`.',
            'LCEL (LangChain Expression Language) — chain components with `|`, e.g. `prompt | model | parser`.',
            'ChatModels — provider adapters (`ChatOpenAI`, `ChatAnthropic`, `ChatMistralAI`) with a uniform message API.',
            'PromptTemplate / ChatPromptTemplate — parameterised prompts with input variables.',
            'Output parsers — extract typed values from model text (StrOutputParser, JsonOutputParser, PydanticOutputParser).',
            'Retrievers — `.invoke(query)` returns a list of Documents; backed by vector stores, BM25, hybrid.',
            'Tools & agents — `@tool` decorator turns functions into tool schemas; `create_tool_calling_agent` wires them into an LLM loop.'
          ]
        },
        { type: 'h3', text: 'Installation' },
        {
          type: 'code',
          lang: 'bash',
          caption: 'Install core LangChain plus an integration package',
          code: `pip install langchain langchain-openai
# Other common integrations:
pip install langchain-anthropic langchain-community langchain-chroma`
        },
        { type: 'h3', text: 'Minimal working example' },
        {
          type: 'code',
          lang: 'python',
          caption: 'A classic LCEL chain: prompt → model → string parser',
          code: `import os
os.environ["OPENAI_API_KEY"] = "sk-..."

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a concise teacher."),
    ("user", "{question}"),
])

chain = (
    prompt
    | ChatOpenAI(model="gpt-4o-mini", temperature=0)
    | StrOutputParser()
)

answer = chain.invoke({"question": "Explain backprop in one sentence."})
print(answer)`
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'A minimal RAG chain combining a retriever and a prompt',
          code: `from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

vectorstore = Chroma(persist_directory="./db",
                     embedding_function=OpenAIEmbeddings())
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

prompt = ChatPromptTemplate.from_template(
    "Answer using only this context:\\n{context}\\n\\nQuestion: {question}"
)

def format_docs(docs):
    return "\\n\\n".join(d.page_content for d in docs)

rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt
    | ChatOpenAI(model="gpt-4o-mini")
    | StrOutputParser()
)
print(rag_chain.invoke("What is our refund policy?"))`
        }
      ],
      advantages: [
        'Huge integration catalog: most vector stores, loaders, and providers have a LangChain adapter.',
        'LCEL gives streaming, batching, and async for free on any chain.',
        'Strong ecosystem — LangSmith for tracing, LangGraph for agents, LangServe for deployment.',
        'Beginner-friendly tutorials and excellent cookbook examples.'
      ],
      disadvantages: [
        'Many layers of abstraction can make debugging hard ("which Runnable failed?").',
        'Older `LLMChain` / `AgentExecutor` APIs are still widely used in tutorials but deprecated in favor of LCEL + LangGraph.',
        'Defaults are often not production-grade (e.g. naive RAG without reranking).',
        'Heavy dependency footprint when you pull in `langchain-community`.'
      ],
      commonMistakes: [
        'Following 2023-era tutorials that use `ConversationChain` / `AgentExecutor` — prefer LCEL + LangGraph.',
        'Not setting `temperature`, `max_tokens`, or `model` explicitly — defaults drift across versions.',
        'Calling `.invoke()` in async code paths — use `.ainvoke()` to avoid blocking the event loop.',
        'Building complex logic inside the chain instead of extracting it into a Python function with `@tool` or `RunnableLambda`.'
      ],
      limitations: [
        'Not designed for cyclic agent loops with state — use LangGraph for that.',
        'Tracing/debugging without LangSmith can be painful on complex chains.',
        'Abstractions leak provider features (e.g. Anthropic prompt caching, OpenAI structured-output modes) — drop down to the integration class when you need them.'
      ],
      relatedConcepts: ['LCEL', 'Retrieval-Augmented Generation', 'Tool Calling', 'LangGraph', 'LangSmith'],
      faq: [
        { q: 'LangChain or LangGraph — which should I start with?', a: 'LangChain for linear chains and RAG. LangGraph the moment you need loops, branching, shared state, or multi-agent coordination. LangGraph builds on LangChain\'s Runnables.' },
        { q: 'When should I NOT use this framework?', a: 'For a single provider call with no retrieval or tools — the raw `openai` or `anthropic` SDK is simpler, has less surface area, and gives you direct access to provider features (caching, batch API) that LangChain may not expose.' }
      ],
      summary:
        'LangChain gives you composable, streaming-first primitives for LLM apps. Use LCEL for chains and RAG; reach for LangGraph when you need stateful agents. It is the most popular entry point, but its abstractions can hide provider features — drop down to the integration layer when you need them.'
    },

    // -------------------------------------------------------------------------
    // 3. LangGraph
    // -------------------------------------------------------------------------
    {
      id: 'langgraph',
      title: 'LangGraph',
      subtitle: 'Stateful, cyclic agent graphs — the production layer over LangChain.',
      tags: ['langgraph', 'agents', 'stateful', 'graphs'],
      readingMinutes: 10,
      definition:
        'LangGraph is a library for building stateful, multi-step, multi-actor LLM applications as directed graphs. It extends LangChain\'s Runnable model with persistent state, cycles, conditional edges, and checkpointing — the primitives you need for real agents.',
      whyItExists:
        'LCEL chains are DAGs: no loops, no shared mutable state, no human-in-the-loop pauses. Real agents need to think → act → observe → repeat, possibly forever, with memory and interruption. LangGraph adds those primitives while staying compatible with LangChain components. Maintained by LangChain Inc., MIT-licensed.',
      howItWorks: [
        { type: 'h3', text: 'Core concepts' },
        {
          type: 'ul',
          items: [
            'StateGraph — a typed graph where every node reads and writes a shared State (a TypedDict or Pydantic model).',
            'State — a schema you define; reducers (`Annotated[list, add_messages]`) control how node outputs merge.',
            'Nodes — Python functions `(state) -> partial_state`.',
            'Edges — static (`add_edge`) or conditional (`add_conditional_edges`) routing between nodes.',
            'START / END — built-in pseudo-nodes marking graph entry and exit.',
            'Checkpointers — persist state across runs (`MemorySaver` for dev, `SqliteSaver`/`PostgresSaver` for prod).',
            'Human-in-the-loop — `interrupt()` pauses execution for approval; resume with updated state.',
            'Subgraphs & multi-agent — compose graphs as nodes inside larger graphs.'
          ]
        },
        { type: 'h3', text: 'Installation' },
        {
          type: 'code',
          lang: 'bash',
          caption: 'Install LangGraph (it brings in langchain-core)',
          code: `pip install langgraph langchain-openai`
        },
        { type: 'h3', text: 'Minimal working example' },
        {
          type: 'code',
          lang: 'python',
          caption: 'A single-node chatbot graph',
          code: `import os
os.environ["OPENAI_API_KEY"] = "sk-..."

from typing import Annotated
from typing_extensions import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_openai import ChatOpenAI

class State(TypedDict):
    messages: Annotated[list, add_messages]

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def chatbot(state: State) -> State:
    return {"messages": [llm.invoke(state["messages"])]}

builder = StateGraph(State)
builder.add_node("chatbot", chatbot)
builder.add_edge(START, "chatbot")
builder.add_edge("chatbot", END)

graph = builder.compile()
result = graph.invoke({"messages": [{"role": "user", "content": "Hello!"}]})
print(result["messages"][-1].content)`
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'A ReAct-style tool-calling loop with a conditional edge',
          code: `from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode, tools_condition

@tool
def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b

tools = [add]
llm_with_tools = llm.bind_tools(tools)

def call_model(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

builder = StateGraph(State)
builder.add_node("call_model", call_model)
builder.add_node("tools", ToolNode(tools))
builder.add_edge(START, "call_model")
builder.add_conditional_edges("call_model", tools_condition, ["tools", END])
builder.add_edge("tools", "call_model")  # loop back after a tool call

agent = builder.compile()
print(agent.invoke({
    "messages": [{"role": "user", "content": "What is 23 + 19?"}]
})["messages"][-1].content)`
        }
      ],
      advantages: [
        'Explicit graph makes agent logic inspectable and debuggable — unlike opaque "agent executors".',
        'First-class support for cycles, loops, and recursion limits.',
        'Checkpointing gives durable agents that survive restarts and support time-travel debugging.',
        'Built-in `interrupt()` and `Command` resume for human-in-the-loop workflows.'
      ],
      disadvantages: [
        'More boilerplate than "just call the model" — overhead for trivial tasks.',
        'Steep learning curve: state schemas, reducers, and conditional edges take practice.',
        'Recursion limits default to 25; long-running loops need explicit tuning.',
        'Debugging conditional edges requires reading graph traces carefully (use LangSmith).'
      ],
      commonMistakes: [
        'Forgetting to add the `tools` edge back to the model node — the graph dead-ends after one tool call.',
        'Returning the full state from a node instead of just the delta — causes state bloat and weird reducer behavior.',
        'Not setting `recursion_limit` on `invoke()` for long tool-calling loops — graph raises `RecursionError`.',
        'Mixing LangChain v0.1 `AgentExecutor` patterns with LangGraph — pick one, prefer LangGraph.'
      ],
      limitations: [
        'Checkpointers store every state transition; long-running agents can produce large DB tables.',
        'No built-in marketplace of prebuilt agents (yet) — you compose from primitives.',
        'Streaming intermediate steps requires `stream_mode="updates"` or `"values"`; the API is correct but takes practice.'
      ],
      relatedConcepts: ['LangChain', 'ReAct Agents', 'Checkpointing', 'Human-in-the-Loop', 'Multi-Agent Systems'],
      faq: [
        { q: 'LangGraph vs AutoGen vs CrewAI — when to pick which?', a: 'LangGraph for fine-grained, custom agent graphs with durable state. AutoGen for event-driven, async multi-agent conversations. CrewAI for role-based "teams" with minimal code.' },
        { q: 'When should I NOT use this framework?', a: 'For a single-shot LLM call with no tools or loops — a 5-line `client.chat.completions.create(...)` is simpler. LangGraph pays off when you have state, cycles, or multi-step coordination.' }
      ],
      summary:
        'LangGraph is the production agent runtime of the LangChain ecosystem: typed state, cycles, conditional edges, checkpointing, and human-in-the-loop. Use it whenever an agent needs more than one step. Prefer it over the deprecated `AgentExecutor` for all new work.'
    },

    // -------------------------------------------------------------------------
    // 4. LlamaIndex
    // -------------------------------------------------------------------------
    {
      id: 'llamaindex',
      title: 'LlamaIndex',
      subtitle: 'A data framework for RAG pipelines, structured queries, and document agents.',
      tags: ['llamaindex', 'rag', 'indexing', 'retrieval'],
      readingMinutes: 9,
      definition:
        'LlamaIndex is a data framework for building LLM applications that connect to private data. It provides ingestion connectors, indexing strategies, retrieval pipelines, query engines, and document-level agents — the full stack for retrieval-augmented generation (RAG).',
      whyItExists:
        'LangChain started as a generic chain framework; LlamaIndex (originally "GPT Index") was built specifically around the data problem: how do you chunk, embed, index, retrieve, and synthesize over private documents at scale? It ships batteries-included pipelines for common RAG patterns. Maintained by LlamaIndex Inc., MIT-licensed.',
      howItWorks: [
        { type: 'h3', text: 'Core concepts' },
        {
          type: 'ul',
          items: [
            'Document / Node — a Document is a source file; Nodes are chunks with metadata and relationships.',
            'Readers / Loader — `SimpleDirectoryReader`, LlamaHub readers for 100+ sources (PDFs, Notion, GitHub, SQL).',
            'Index — a searchable structure: `VectorStoreIndex`, `SummaryIndex`, `KnowledgeGraphIndex`.',
            'Retriever — fetches the top-k Nodes for a query; supports vector, BM25, hybrid, auto-merging.',
            'Query Engine — wraps a retriever + response synthesizer; `index.as_query_engine()`.',
            'Chat Engine — stateful, multi-turn variant of the query engine.',
            'Agent — an LLM with tools, where each tool can itself be a query engine (sub-question query engine).',
            'Workflow — event-driven, multi-step pipelines (LlamaIndex 0.11+) replacing older query pipelines.'
          ]
        },
        { type: 'h3', text: 'Installation' },
        {
          type: 'code',
          lang: 'bash',
          caption: 'Install the meta-package plus OpenAI integration',
          code: `pip install llama-index llama-index-llms-openai llama-index-embeddings-openai`
        },
        { type: 'h3', text: 'Minimal working example' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Index a folder of text files and ask a question',
          code: `import os
os.environ["OPENAI_API_KEY"] = "sk-..."

from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("./data").load_data()
index = VectorStoreIndex.from_documents(documents)

query_engine = index.as_query_engine(similarity_top_k=4)
response = query_engine.query("What is the refund policy?")
print(response)`
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Hybrid retrieval + a sub-question agent over multiple indexes',
          code: `from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.agent import ReActAgent
from llama_index.core import VectorStoreIndex

# Build two separate indexes (e.g. docs + tickets)
docs_engine = VectorStoreIndex.from_documents(docs_nodes).as_query_engine()
ticket_engine = VectorStoreIndex.from_documents(ticket_nodes).as_query_engine()

tools = [
    QueryEngineTool.from_defaults(
        query_engine=docs_engine,
        metadata=ToolMetadata(
            name="docs",
            description="Product documentation, manuals, and policies."
        ),
    ),
    QueryEngineTool.from_defaults(
        query_engine=ticket_engine,
        metadata=ToolMetadata(
            name="tickets",
            description="Historical support tickets and resolutions."
        ),
    ),
]

agent = ReActAgent.from_tools(tools, verbose=True)
print(agent.chat("Compare our refund policy to how we resolved ticket #4821."))`
        }
      ],
      advantages: [
        'Best-in-class ingestion: 100+ LlamaHub readers cover most enterprise sources.',
        'Multiple first-class index types (vector, summary, keyword, knowledge graph) with the same query API.',
        'Excellent advanced retrieval: auto-merging, recursive, sentence-window, hierarchical.',
        'Strong observability via `llama_index.core.callbacks` and integrations with Arize, Langfuse, OpenTelemetry.'
      ],
      disadvantages: [
        'Frequent breaking changes between minor versions — pin your version.',
        'The `VectorStoreIndex.from_documents(...)` one-liner hides chunking defaults that may not suit your data.',
        'Two parallel APIs (older "query pipelines" vs newer "Workflows") can confuse newcomers.',
        'Heavy install if you pull in `llama-index-llms-*` and `llama-index-embeddings-*` separately.'
      ],
      commonMistakes: [
        'Using the default chunk size (1024) and overlap (20) for all data — tune for your domain.',
        'Forgetting to set `Settings.llm` and `Settings.embed_model` globally — defaults may not be what you want.',
        'Storing the index in memory every run instead of `storage_context.persist("./storage")`.',
        'Treating `response` as a string — it is a `Response` object; use `str(response)` or `response.response`.'
      ],
      limitations: [
        'Less mature for general agent orchestration than LangGraph; LlamaIndex Agents are best for data-heavy tasks.',
        'Production multi-tenant setups require careful `StorageContext` and `docstore` management.',
        'Some advanced features (auto-merging retriever, recursive retriever) have sparse docs.'
      ],
      relatedConcepts: ['RAG', 'Chunking', 'Hybrid Search', 'Reranking', 'Sub-Question Query Engine'],
      faq: [
        { q: 'LlamaIndex or LangChain for RAG?', a: 'LlamaIndex if your problem is primarily "chat with my data" — its retrieval primitives and readers are deeper. LangChain if RAG is one piece of a larger agent graph. They compose: LlamaIndex query engines can be LangChain Runnables.' },
        { q: 'When should I NOT use this framework?', a: 'When you have only a handful of documents or are doing pure generation without retrieval — the indexing machinery is overhead. A direct provider call with the text inlined is simpler.' }
      ],
      summary:
        'LlamaIndex is the deepest open-source RAG stack: ingestion → indexing → retrieval → synthesis, with advanced retrieval patterns out of the box. Pick it when "chat with my data" is the product; pair with LangGraph when RAG is one node in a larger agent.'
    },

    // -------------------------------------------------------------------------
    // 5. CrewAI
    // -------------------------------------------------------------------------
    {
      id: 'crewai',
      title: 'CrewAI',
      subtitle: 'Role-based multi-agent crews that ship in 30 lines of code.',
      tags: ['crewai', 'multi-agent', 'orchestration'],
      readingMinutes: 9,
      definition:
        'CrewAI is a multi-agent orchestration framework where you define Agents (role-playing personas), Tasks (assignments with expected outputs), and Crews (teams that execute the tasks sequentially or hierarchically). It is batteries-included for role-based collaboration.',
      whyItExists:
        'LangGraph and AutoGen make you build the orchestration graph yourself. CrewAI ships a high-level "crew" abstraction — role, goal, backstory, expected output — that handles delegation, handoffs, and process management with minimal code. Maintained by CrewAI Inc., MIT-licensed.',
      howItWorks: [
        { type: 'h3', text: 'Core concepts' },
        {
          type: 'ul',
          items: [
            'Agent — a persona with `role`, `goal`, `backstory`, optional `tools`, and an `llm`.',
            'Task — a unit of work with `description`, `expected_output`, an assigned `agent`, and optional `context` (other tasks).',
            'Crew — a team of agents + tasks run with a `process` (sequential or hierarchical).',
            'Process — `sequential` (tasks in order) or `hierarchical` (a manager agent delegates).',
            'Flow — a higher-level stateful workflow that can call multiple crews (uses Python generators for state).',
            'Tools — `@tool` decorator or `BaseTool` subclass; same idea as LangChain tools.',
            'Memory — short-term (conversation), long-term (cross-crew), entity memory (knowledge graph).',
            'CrewAI+ / crewai run — managed runtime and CLI for deploying crews.'
          ]
        },
        { type: 'h3', text: 'Installation' },
        {
          type: 'code',
          lang: 'bash',
          caption: 'Install CrewAI and optional extra tools',
          code: `pip install crewai
pip install 'crewai[tools]'   # filesystem, search, scrapers, etc.`
        },
        { type: 'h3', text: 'Minimal working example' },
        {
          type: 'code',
          lang: 'python',
          caption: 'A two-agent crew: researcher hands off to writer',
          code: `import os
os.environ["OPENAI_API_KEY"] = "sk-..."

from crewai import Agent, Task, Crew, Process

researcher = Agent(
    role="Research Analyst",
    goal="Find 5 key facts about {topic}",
    backstory="A meticulous analyst with 10 years of experience.",
    llm="gpt-4o-mini",
    allow_delegation=False,
)

writer = Agent(
    role="Tech Writer",
    goal="Turn research into a 200-word plain-text summary",
    backstory="A former journalist who loves clarity.",
    llm="gpt-4o-mini",
    allow_delegation=False,
)

research_task = Task(
    description="Research the topic: {topic}. Return a bullet list of 5 key facts.",
    expected_output="A markdown bullet list of 5 key facts.",
    agent=researcher,
)

write_task = Task(
    description="Using the research, write a 200-word plain-text summary.",
    expected_output="A 200-word plain-text summary.",
    agent=writer,
    context=[research_task],
)

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, write_task],
    process=Process.sequential,
)

result = crew.kickoff(inputs={"topic": "Model Context Protocol"})
print(result.raw)`
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'A hierarchical crew with a manager agent delegating dynamically',
          code: `from crewai import Agent, Task, Crew, Process

planner = Agent(
    role="Project Manager",
    goal="Break the request into sub-tasks and delegate to specialists",
    backstory="A senior PM who keeps projects on track.",
    llm="gpt-4o-mini",
    allow_delegation=True,
)

researcher = Agent(role="Researcher", goal="Find facts",
                   backstory="Fast and thorough.", llm="gpt-4o-mini")
coder = Agent(role="Engineer", goal="Write code",
              backstory="10x senior engineer.", llm="gpt-4o-mini")

# Only the top-level task is defined; the manager delegates the rest
top_task = Task(
    description="Build a CLI tool that fetches the weather for a city.",
    expected_output="A working Python CLI script + a one-paragraph README.",
)

crew = Crew(
    agents=[planner, researcher, coder],
    tasks=[top_task],
    process=Process.hierarchical,
    manager_agent=planner,
)
print(crew.kickoff().raw)`
        }
      ],
      advantages: [
        'Fastest path from idea to a working multi-agent demo — minutes, not hours.',
        'Role/goal/backstory persona design is intuitive for non-developers.',
        'Hierarchical process with a manager agent handles delegation for you.',
        'Built-in memory and `crewai run` CLI for quick local iteration.'
      ],
      disadvantages: [
        'Less fine-grained control than LangGraph — opaque under the hood.',
        'Defaults can be expensive: many agents × many turns × large models.',
        'Sequential process is brittle if one task returns poor output — no built-in retry.',
        'Hierarchical manager sometimes "forgets" to delegate, doing the work itself.'
      ],
      commonMistakes: [
        'Giving every agent `gpt-4o` when `gpt-4o-mini` would suffice — bills add up fast.',
        'Writing vague `expected_output` strings — agents optimise for matching them, so be specific.',
        'Forgetting `context=[...]` between tasks — downstream agents lose the upstream work.',
        'Using `Process.hierarchical` without a real manager persona — the manager just re-does the work.'
      ],
      limitations: [
        'No native checkpointing or human-in-the-loop interrupts (must be emulated via Flows).',
        'Tool-calling reliability depends on the underlying LLM; weak models hallucinate tool args.',
        'Production observability requires external tools (Langfuse, AgentOps) — built-in tracing is basic.'
      ],
      relatedConcepts: ['Multi-Agent Systems', 'Role-Based Design', 'Hierarchical Orchestration', 'Agent Delegation'],
      faq: [
        { q: 'How is CrewAI different from LangGraph?', a: 'CrewAI is higher-level and role-centric: define agents and tasks, get a working crew. LangGraph is lower-level and graph-centric: define nodes, edges, and state yourself. CrewAI for speed-to-demo; LangGraph for control.' },
        { q: 'When should I NOT use this framework?', a: 'For single-agent tasks or deterministic pipelines — the role/delegation machinery is overhead. Also avoid when you need precise control over the conversation graph; LangGraph is a better fit there.' }
      ],
      summary:
        'CrewAI is the fastest path from idea to a working multi-agent demo. Define agents, tasks, and a process; the framework handles the loop. Use it for role-based collaboration and rapid prototyping; choose LangGraph or AutoGen when you need fine-grained control or durable state.'
    },

    // -------------------------------------------------------------------------
    // 6. AutoGen
    // -------------------------------------------------------------------------
    {
      id: 'autogen',
      title: 'AutoGen',
      subtitle: 'Microsoft\'s async, event-driven multi-agent framework (v0.4+).',
      tags: ['autogen', 'multi-agent', 'async', 'microsoft'],
      readingMinutes: 10,
      definition:
        'AutoGen is Microsoft\'s framework for building multi-agent conversations. The v0.4 rewrite is an asynchronous, actor-based, event-driven architecture where agents communicate via messages on a runtime, with first-class support for tool use, code execution, and cross-language (Python + .NET) interop.',
      whyItExists:
        'The original AutoGen (0.2) was a synchronous `ConversableAgent` pattern that was hard to scale and debug. The v0.4 rewrite ("AutoGen v0.4") is actor-based, fully async, and decoupled agents from the runtime that hosts them — enabling long-running, concurrent, distributed agent systems. Maintained by Microsoft, MIT-licensed.',
      howItWorks: [
        { type: 'h3', text: 'Core concepts' },
        {
          type: 'ul',
          items: [
            'Agent — an actor that receives messages and produces messages. `AssistantAgent` is the LLM-backed default.',
            'Team — a group of agents with a coordination pattern: `RoundRobinGroupChat`, `SelectorGroupChat`, `MagenticOneGroupChat`, `Swarm`.',
            'Model client — adapter to a provider (`OpenAIChatCompletionClient`, `AzureOpenAIChatCompletionClient`, `AnthropicCliClient`).',
            'Termination condition — when the team stops: `TextMentionTermination`, `MaxMessageTermination`, `TokenUsageTermination`, `SourceMatchTermination`, or a combination (`|` / `&`).',
            'Tools — Python functions decorated with `@user_function` (from `autogen_core`); passed to `AssistantAgent(tools=[...])`.',
            'CodeExecutorAgent — runs code produced by other agents in a sandbox (Docker, local, Jupyter).',
            'Runtime — message bus that routes events; the default `SingleThreadedAgentRuntime` is in-process.'
          ]
        },
        { type: 'h3', text: 'Installation' },
        {
          type: 'code',
          lang: 'bash',
          caption: 'Install AutoGen v0.4+ — agentchat plus the OpenAI extension',
          code: `pip install autogen-agentchat autogen-ext[openai]
# Optional: Docker code execution
pip install "autogen-ext[docker]"`
        },
        { type: 'h3', text: 'Minimal working example' },
        {
          type: 'code',
          lang: 'python',
          caption: 'An assistant agent in a round-robin team',
          code: `import asyncio, os
os.environ["OPENAI_API_KEY"] = "sk-..."

from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.conditions import TextMentionTermination, MaxMessageTermination
from autogen_ext.models.openai import OpenAIChatCompletionClient

model = OpenAIChatCompletionClient(model="gpt-4o-mini")

assistant = AssistantAgent(
    name="assistant",
    model_client=model,
    system_message="You are a helpful assistant. End your reply with TERMINATE.",
)

team = RoundRobinGroupChat(
    participants=[assistant],
    termination_condition=TextMentionTermination("TERMINATE")
                    | MaxMessageTermination(5),
)

async def main():
    result = await team.run(task="What is 2+2? Explain in one sentence.")
    for msg in result.messages:
        print(f"[{msg.source}] {msg.content}")

asyncio.run(main())`
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'A selector team with two tool-using specialists',
          code: `from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.teams import SelectorGroupChat
from autogen_core.tools import tool

@tool
def add(a: float, b: float) -> str:
    return f"{a} + {b} = {a + b}"

@tool
def multiply(a: float, b: float) -> str:
    return f"{a} * {b} = {a * b}"

math_agent = AssistantAgent(
    name="math",
    model_client=model,
    tools=[add, multiply],
    system_message="You do arithmetic. Reflect on the tool result, then say TERMINATE.",
)

reviewer = AssistantAgent(
    name="reviewer",
    model_client=model,
    system_message="Check the math agent's answer for correctness. If correct, say TERMINATE.",
)

team = SelectorGroupChat(
    participants=[math_agent, reviewer],
    model_client=model,           # selects the next speaker
    allow_repeated_speaker=False,
    termination_condition=TextMentionTermination("TERMINATE") | MaxMessageTermination(6),
)

asyncio.run(team.run(task="Compute (3 + 4) * 5 and verify."))`
        }
      ],
      advantages: [
        'Fully async — handles long-running, concurrent, multi-agent workloads cleanly.',
        'Actor model separates agents from the runtime, enabling distributed deployment.',
        'MagenticOne and Selector teams are well-tuned for complex research/coding tasks.',
        'Cross-language: .NET and Python agents can interop via the same message protocols.'
      ],
      disadvantages: [
        'v0.4 is a clean break from v0.2 — many old tutorials are obsolete.',
        'Async-everything is steeper than CrewAI\'s synchronous API.',
        'Smaller ecosystem of prebuilt integrations than LangChain.',
        'Documentation is still catching up after the rewrite.'
      ],
      commonMistakes: [
        'Following v0.2 tutorials that use `ConversableAgent` and `GroupChat` — they do not exist in v0.4.',
        'Forgetting `await team.run(...)` — the API is async, blocking calls raise.',
        'Forgetting a termination condition — the team can loop forever (and burn tokens).',
        'Passing sync `def` functions as tools — they work but block the event loop; prefer `async def`.'
      ],
      limitations: [
        'No native checkpointing across process restarts in v0.4 yet — long-running state must be persisted manually.',
        'Code executor requires Docker or a local Python env — extra setup in CI.',
        'Streaming and partial outputs are supported but the API is more verbose than LangChain\'s.'
      ],
      relatedConcepts: ['Actor Model', 'Group Chat', 'MagenticOne', 'Code Execution', 'Tool Calling'],
      faq: [
        { q: 'AutoGen v0.2 vs v0.4 — which should I use?', a: 'v0.4 for all new work. v0.2 is in maintenance mode. The APIs are not compatible — v0.2 `ConversableAgent` tutorials will not run on v0.4.' },
        { q: 'When should I NOT use this framework?', a: 'For single-agent, single-step tasks — the team/runtime machinery is overhead. Also avoid if your codebase is fully synchronous and async/await is not idiomatic in your team.' }
      ],
      summary:
        'AutoGen v0.4 is Microsoft\'s async, actor-based multi-agent framework. Use it for long-running, concurrent, code-executing agent systems — especially MagenticOne-style research/coding tasks. Skip it for trivial single-agent work or if you need a synchronous, batteries-included API like CrewAI.'
    },

    // -------------------------------------------------------------------------
    // 7. PydanticAI
    // -------------------------------------------------------------------------
    {
      id: 'pydantic-ai',
      title: 'PydanticAI',
      subtitle: 'Type-safe, FastAPI-flavoured agents from the Pydantic team.',
      tags: ['pydantic-ai', 'type-safety', 'structured-outputs', 'di'],
      readingMinutes: 9,
      definition:
        'PydanticAI is a newer agent framework (from the Pydantic team) that brings type-safe structured outputs, dependency injection, and ergonomic tool definitions to LLM applications. Its design philosophy mirrors FastAPI for LLMs — typed, validated, editor-friendly.',
      whyItExists:
        'Most agent frameworks treat prompts, tool inputs, and outputs as strings. PydanticAI uses Pydantic models throughout: tools get validated arguments, agents return typed `result_type` objects, and dependencies are injected via `RunContext[Deps]` — the same patterns that made FastAPI ergonomic for web APIs. Maintained by the Pydantic team (Samuel Colvin et al.), MIT-licensed.',
      howItWorks: [
        { type: 'h3', text: 'Core concepts' },
        {
          type: 'ul',
          items: [
            'Agent — bound to a model (`"openai:gpt-4o-mini"`, `"anthropic:claude-3-5-sonnet-latest"`) and a `result_type` (default `str`).',
            'result_type — a Pydantic model the agent must return; PydanticAI retries on validation failure.',
            'System prompt — static (`agent_system_prompt` decorator) or dynamic (depends on `RunContext`).',
            'Tool functions — `@agent.tool` (instance) or `@agent.tool_plain` (no context); args validated by Pydantic.',
            'Dependencies — typed via `Agent[Deps, Result]`; injected into tools and dynamic prompts via `RunContext[Deps]`.',
            'Run vs Run sync — `agent.run()` (async) and `agent.run_sync()` (sync wrapper for scripts).',
            'Usage tracking — `RunUsage` tracks request and token counts; pluggable for cost accounting.',
            'Model providers — OpenAI, Anthropic, Gemini, Groq, Mistral, Ollama, via `pip install pydantic-ai-slim` + provider extras.'
          ]
        },
        { type: 'h3', text: 'Installation' },
        {
          type: 'code',
         lang: 'bash',
          caption: 'Install PydanticAI (slim lets you pick providers)',
          code: `pip install pydantic-ai
# Or pick providers explicitly:
pip install pydantic-ai-slim[openai,anthropic]`
        },
        { type: 'h3', text: 'Minimal working example' },
        {
          type: 'code',
          lang: 'python',
          caption: 'An agent that returns a validated Pydantic model',
          code: `import os
os.environ["OPENAI_API_KEY"] = "sk-..."

from pydantic import BaseModel, Field
from pydantic_ai import Agent

class CityInfo(BaseModel):
    name: str
    country: str
    population: int = Field(description="Approximate population")

agent = Agent(
    "openai:gpt-4o-mini",
    result_type=CityInfo,
    system_prompt="Extract structured city info from the user's message.",
)

result = agent.run_sync("Paris is the capital of France with about 2.1M people.")
print(result.data)
# CityInfo(name='Paris', country='France', population=2100000)
print(result.usage())
# Usage(requests=1, request_tokens=..., response_tokens=...)`
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Agent with typed dependencies and a tool',
          code: `from dataclasses import dataclass
from pydantic_ai import Agent, RunContext

@dataclass
class Deps:
    db_user: str
    db_url: str

async def fetch_balance(ctx: RunContext[Deps], user_id: int) -> float:
    """Look up a user's account balance."""
    # ctx.deps.db_url etc. — typed, IDE-autocompleted
    return 1250.50

agent = Agent(
    "openai:gpt-4o-mini",
    deps_type=Deps,
    result_type=float,
    system_prompt="Answer questions about account balances using the fetch_balance tool.",
)

agent.tool(fetch_balance)

import asyncio
async def main():
    async with agent.run_mcp_servers():  # noop here; would launch MCP servers if configured
        result = await agent.run(
            "What is the balance for user 42?",
            deps=Deps(db_user="app", db_url="postgres://..."),
        )
    print(result.data)

asyncio.run(main())`
        }
      ],
      advantages: [
        'Type safety everywhere: tools, deps, and results are Pydantic-validated.',
        'Clean dependency injection via `RunContext[Deps]` — testable and IDE-friendly.',
        'Structured outputs with automatic retries on validation failure.',
        'Lightweight, fast, and a small surface area compared to LangChain.',
        'Native MCP client support — connect agents to MCP servers as tools.'
      ],
      disadvantages: [
        'Younger ecosystem — fewer integrations and community examples than LangChain.',
        'No built-in graph/state primitives (use it inside LangGraph or your own loop if needed).',
        'Provider features sometimes lag behind official SDKs by a release cycle.',
        'Limited built-in memory abstractions; you wire your own.'
      ],
      commonMistakes: [
        'Declaring tools after `agent.run()` — register them with `@agent.tool` before running.',
        'Using `agent.run()` inside sync code without `asyncio.run()` — use `agent.run_sync()` instead.',
        'Forgetting to pass `deps=` at `run()` time when `deps_type` is set — raises a validation error.',
        'Putting non-JSON-serialisable objects in `result_type` fields — PydanticAI serializes them as JSON for the model.'
      ],
      limitations: [
        'Not a multi-agent framework by itself — compose with LangGraph/AutoGen for that.',
        'No native checkpointing or long-running persistence.',
        'Streaming structured outputs (partial Pydantic models) is supported but limited.'
      ],
      relatedConcepts: ['Pydantic', 'Structured Outputs', 'Dependency Injection', 'FastAPI', 'MCP Clients'],
      faq: [
        { q: 'PydanticAI vs LangChain — when to pick which?', a: 'PydanticAI for type-safe single-agent apps with structured I/O and DI — especially if you already love FastAPI. LangChain for the broad integration catalog and when you need LangGraph-style agent graphs.' },
        { q: 'When should I NOT use this framework?', a: 'When you need multi-agent orchestration or long-running stateful graphs — PydanticAI is single-agent by design. Compose it as one node inside LangGraph/AutoGen instead.' }
      ],
      summary:
        'PydanticAI is the FastAPI-flavoured agent framework: typed, validated, dependency-injected. Use it for single-agent apps where structured I/O and clean testing matter. Compose it inside LangGraph or AutoGen when you need multi-agent graphs.'
    },

    // -------------------------------------------------------------------------
    // 8. Semantic Kernel
    // -------------------------------------------------------------------------
    {
      id: 'semantic-kernel',
      title: 'Semantic Kernel',
      subtitle: 'Microsoft\'s plugin-first SDK for orchestrating prompts and native code.',
      tags: ['semantic-kernel', 'microsoft', 'plugins', 'orchestration'],
      readingMinutes: 9,
      definition:
        'Semantic Kernel (SK) is Microsoft\'s SDK for integrating AI services into applications. It is built around "plugins" — collections of native code functions and prompt templates — that can be invoked by application code directly or orchestrated by an LLM via function calling. Available in Python, .NET, and Java.',
      whyItExists:
        'Microsoft wanted a lightweight, language-agnostic way to combine prompt templates with native code functions under a single "function-calling" abstraction, so the same plugin could be called by C# code or by an LLM. SK is the underlying SDK for Microsoft 365 Copilot and Azure AI agents. Maintained by Microsoft, MIT-licensed.',
      howItWorks: [
        { type: 'h3', text: 'Core concepts' },
        {
          type: 'ul',
          items: [
            'Kernel — the central object that holds services (AI clients), plugins, filters, and a dependency-injection container.',
            'KernelFunction — either a `kernel_function`-decorated Python method (native) or a prompt template (semantic). Both expose `.invoke()` / `.invoke_async()`.',
            'Plugin — a class or a folder of functions; register with `kernel.add_plugin(...)`.',
            'KernelArguments — dict-like arguments passed to functions; prompt templates use `{{$variable}}` syntax.',
            'Filters — middleware for function invocation (auto-invoke, function invocation, prompt rendering).',
            'Connectors — adapters for OpenAI, Azure OpenAI, Anthropic, Google, Ollama, Hugging Face, ONNX.',
            'Memory — volatile, Azure AI Search, Postgres, Redis, Chroma backends for semantic memory.',
            'Process Framework — durable, stateful workflows built on top of the kernel (SK v1.x+).'
          ]
        },
        { type: 'h3', text: 'Installation' },
        {
          type: 'code',
          lang: 'bash',
          caption: 'Install the Python Semantic Kernel SDK',
          code: `pip install semantic-kernel`
        },
        { type: 'h3', text: 'Minimal working example' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Register OpenAI and invoke a prompt function',
          code: `import asyncio, os
os.environ["OPENAI_API_KEY"] = "sk-..."

from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.functions import kernel_function

kernel = Kernel()
kernel.add_service(
    OpenAIChatCompletion(service_id="chat", ai_model_id="gpt-4o-mini")
)

async def main():
    summary = await kernel.invoke_prompt(
        function_name="summary",
        plugin_name="demo",
        prompt="Summarize this in one sentence:\\n\\n{{$input}}",
        input="Semantic Kernel is a lightweight SDK from Microsoft "
              "that lets you mix prompts and native code.",
    )
    print(str(summary))

asyncio.run(main())`
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'A native plugin the LLM can call via function calling',
          code: `from semantic_kernel.functions import kernel_function
from semantic_kernel.kernel import Kernel
from semantic_kernel.connectors.ai.function_choice_behavior import (
    FunctionChoiceBehavior,
)

class MathPlugin:
    @kernel_function(description="Add two numbers.", name="add")
    def add(self, a: float, b: float) -> float:
        return a + b

    @kernel_function(description="Multiply two numbers.", name="multiply")
    def multiply(self, a: float, b: float) -> float:
        return a * b

kernel.add_plugin(MathPlugin(), plugin_name="math")

settings = kernel.get_service("chat").get_prompt_execution_settings_class()()
# Schematic — verify against current docs: enable auto function calling
settings.function_choice_behavior = FunctionChoiceBehavior.Auto()

async def main():
    result = await kernel.invoke_prompt(
        function_name="math_qa",
        plugin_name="demo",
        prompt="What is (3 + 4) * 5?",
        execution_settings={"chat": settings},
    )
    print(str(result))

asyncio.run(main())`
        }
      ],
      advantages: [
        'Same SDK in Python, .NET, and Java — true cross-language agent portability.',
        'Plugin model unifies native code and prompt templates under one callable interface.',
        'Backed by Microsoft; underpins Copilot, so it is battle-tested at enterprise scale.',
        'Process Framework adds durable, stateful workflows (think LangGraph-style) on top of the kernel.'
      ],
      disadvantages: [
        'Python API has changed multiple times across v0.x → v1.x; older tutorials break.',
        'Heavier conceptual model than LangChain for simple use cases.',
        'Documentation is .NET-first; Python examples sometimes lag.',
        'Fewer community integrations than LangChain/LlamaIndex.'
      ],
      commonMistakes: [
        'Following v0.x tutorials that use `kernel.create_semantic_function(...)` — removed in v1.x.',
        'Forgetting to add the service with a `service_id` and then failing to look it up.',
        'Not setting `function_choice_behavior` — the LLM never actually calls your plugins.',
        'Confusing `KernelFunction.invoke()` (sync) with `invoke_async()` — pick the right one for your runtime.'
      ],
      limitations: [
        'Auto function-calling reliability depends on the underlying model; weaker models mis-call tools.',
        'Process Framework is newer and has fewer community examples than LangGraph.',
        'Memory abstractions are limited compared to a full vector DB integration.'
      ],
      relatedConcepts: ['Plugins', 'Function Calling', 'Microsoft Copilot', 'Process Framework', 'Cross-Language SDK'],
      faq: [
        { q: 'Semantic Kernel vs LangChain — when to pick which?', a: 'SK if you are in the Microsoft ecosystem (.NET/Azure), need cross-language consistency, or are building on Copilot patterns. LangChain if you want the broadest Python ecosystem and integrations.' },
        { q: 'When should I NOT use this framework?', a: 'For a single-provider, Python-only app where you just need a chain of prompts — LangChain or PydanticAI will get you there faster with less conceptual overhead.' }
      ],
      summary:
        'Semantic Kernel is Microsoft\'s plugin-first SDK for mixing prompts and native code under one function-calling abstraction, with cross-language consistency (Python/.NET/Java). Use it in the Microsoft ecosystem or when you need the Process Framework for durable workflows; choose LangChain or PydanticAI for simpler Python-only work.'
    },

    // -------------------------------------------------------------------------
    // 9. Model Provider APIs
    // -------------------------------------------------------------------------
    {
      id: 'model-provider-apis',
      title: 'Model Provider APIs',
      subtitle: 'OpenAI, Anthropic, Google, Mistral, Together, Groq, Fireworks — when to use each.',
      tags: ['api', 'openai', 'anthropic', 'google', 'mistral', 'groq', 'together', 'fireworks'],
      readingMinutes: 12,
      definition:
        'Each major AI provider exposes an HTTP API for their models. Most now offer an OpenAI-compatible `/v1/chat/completions` endpoint plus a native Python SDK. This lesson compares the seven providers you will encounter most and shows the lowest-friction integration path: the provider SDK directly, with no framework.',
      whyItExists:
        'A framework is not always necessary. If you need a single chat completion or one structured output, the provider SDK is simpler, faster to integrate, and exposes provider-specific features (Anthropic prompt caching, OpenAI Batch API, Gemini multimodal) that frameworks often hide. Understanding the differences in models, context windows, pricing, and SDK ergonomics lets you pick the right provider per task.',
      howItWorks: [
        { type: 'h3', text: 'Core concepts' },
        {
          type: 'ul',
          items: [
            'Chat completions endpoint — `POST /v1/chat/completions` with a `messages` array; OpenAI\'s de-facto standard that most providers mirror.',
            'Streaming — `stream: true` returns Server-Sent Events with incremental token chunks.',
            'Tool / function calling — model emits a structured call; you execute and return the result.',
            'Structured outputs — provider constrains output to a JSON schema (OpenAI, Gemini, Mistral, Anthropic via tools).',
            'Embeddings endpoint — `POST /v1/embeddings` for vector representations of text.',
            'Rate limits & quotas — per-provider, per-model, per-tier; check the dashboard before scaling.',
            'OpenAI-compatible gateways — Together, Groq, Fireworks, Mistral, OpenRouter, vLLM all accept the OpenAI SDK with `base_url` swapped.'
          ]
        },
        { type: 'h3', text: 'Provider comparison' },
        {
          type: 'table',
          headers: ['Provider', 'Best model', 'Context', 'Pricing tier', 'Strengths'],
          rows: [
            ['OpenAI', 'GPT-4o / GPT-4o-mini / o1', '128K', '$$$', 'Broadest ecosystem, structured outputs, Batch API'],
            ['Anthropic', 'Claude 3.5 Sonnet / Haiku', '200K', '$$$', 'Long context, prompt caching, strong coding/writing'],
            ['Google', 'Gemini 1.5 Pro / Flash', '1M–2M', '$$', 'Massive context, native multimodal, generous free tier'],
            ['Mistral', 'Mistral Large / Small', '128K', '$$', 'Open weights + hosted API, EU data residency'],
            ['Together', 'Llama 3.1 405B, Qwen2.5', '128K+', '$$', 'Open-weight hosting, fine-tuning, OpenAI-compatible'],
            ['Groq', 'Llama 3.1 70B, Mixtral', '128K', '$', 'LPU inference — fastest token/s on the market'],
            ['Fireworks', 'Llama 3.1, Qwen2.5, DeepSeek', '128K+', '$$', 'Open models, fast, function-calling JSON mode']
          ]
        },
        { type: 'h3', text: 'Installation' },
        {
          type: 'code',
          lang: 'bash',
          caption: 'Install the SDK for your chosen provider',
          code: `pip install openai            # OpenAI, plus gateway-compatible (Together/Groq/Fireworks)
pip install anthropic         # Anthropic
pip install google-genai      # Google Gemini (new unified SDK)
pip install mistralai         # Mistral`
        },
        { type: 'h3', text: 'Minimal working example (OpenAI)' },
        {
          type: 'code',
          lang: 'python',
          caption: 'Direct OpenAI SDK call — no framework',
          code: `import os
os.environ["OPENAI_API_KEY"] = "sk-..."
from openai import OpenAI

client = OpenAI()
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Explain RAG in one sentence."}],
    temperature=0,
)
print(response.choices[0].message.content)`
        },
        {
          type: 'p',
          text: 'For Together, Groq, or Fireworks, swap `base_url` and `api_key` — the rest of the OpenAI SDK works unchanged. This is the simplest way to run open-weight models without self-hosting.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'OpenAI-compatible client pointed at Groq',
          code: `from openai import OpenAI

groq = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ["GROQ_API_KEY"],
)
r = groq.chat.completions.create(
    model="llama-3.1-70b-versatile",
    messages=[{"role": "user", "content": "Stream me a haiku."}],
    stream=True,
)
for chunk in r:
    print(chunk.choices[0].delta.content or "", end="", flush=True)`
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Anthropic SDK with prompt caching and a tool',
          code: `import os
os.environ["ANTHROPIC_API_KEY"] = "sk-ant-..."
from anthropic import Anthropic

client = Anthropic()

resp = client.messages.create(
    model="claude-3-5-sonnet-latest",
    max_tokens=1024,
    system=[{
        "type": "text",
        "text": "You are a precise assistant. Use the provided context.",
        "cache_control": {"type": "ephemeral"},  # cache this prefix
    }],
    tools=[{
        "name": "get_balance",
        "description": "Get a user's account balance.",
        "input_schema": {
            "type": "object",
            "properties": {"user_id": {"type": "integer"}},
            "required": ["user_id"],
        },
    }],
    messages=[{"role": "user", "content": "What is user 42's balance?"}],
)
print(resp.content)
# Subsequent calls reusing the cached system prompt are ~90% cheaper and faster.`
        }
      ],
      advantages: [
        'Lowest abstraction overhead — full access to provider-specific features.',
        'Smallest dependency footprint; fewest moving parts to break.',
        'Direct path to provider features (caching, batch, fine-tunes, guardrails).',
        'OpenAI-compatible gateways mean one SDK works for 5+ providers.'
      ],
      disadvantages: [
        'No portability across providers — switching means rewriting call sites.',
        'You build retries, streaming, structured outputs, and tool loops yourself.',
        'No observability layer — wire your own logging/tracing.',
        'Each provider\'s tool-calling schema differs slightly; abstraction is welcome at scale.'
      ],
      commonMistakes: [
        'Hard-coding `model="gpt-4"` — pin a specific version like `gpt-4o-2024-08-06` for reproducibility.',
        'Not streaming long outputs — users see "nothing, then everything" instead of token-by-token.',
        'Ignoring token usage in the response — bills creep up; log `response.usage`.',
        'Mixing provider SDKs without a thin wrapper — your codebase becomes impossible to refactor.'
      ],
      limitations: [
        'Rate limits are real and per-account; design for backoff from day one.',
        'Provider outages happen — multi-provider fallback needs an abstraction layer.',
        'Some features (Anthropic prompt caching, Gemini multimodal) are not portable across providers.'
      ],
      relatedConcepts: ['Chat Completions', 'Function Calling', 'Prompt Caching', 'Batch API', 'OpenAI-Compatible Gateways'],
      faq: [
        { q: 'Should I use the provider SDK or a framework?', a: 'SDK for a single provider, single task, or when you need a provider-specific feature. Framework (LangChain, PydanticAI) when you need portability, retrieval, agents, or multi-provider routing.' },
        { q: 'When should I NOT use this approach?', a: 'When you need RAG, tool-use loops, multi-agent coordination, or want to switch providers without rewriting code — a framework pays for itself fast. Also avoid raw SDKs if your team needs observability that frameworks provide out of the box.' }
      ],
      summary:
        'The provider SDKs are the lowest-friction path to an LLM call. Use them directly for single-provider apps; use a framework when you need portability, retrieval, or agent loops. Together, Groq, and Fireworks all speak the OpenAI protocol, so one SDK covers most open-weight hosting options.'
    },

    // -------------------------------------------------------------------------
    // 10. MCP-Compatible Tools
    // -------------------------------------------------------------------------
    {
      id: 'mcp-compatible-tools',
      title: 'MCP-Compatible Tools',
      subtitle: 'The Model Context Protocol — write a tool once, use it from any MCP client.',
      tags: ['mcp', 'model-context-protocol', 'tools', 'anthropic', 'interoperability'],
      readingMinutes: 10,
      definition:
        'The Model Context Protocol (MCP) is an open standard from Anthropic (released November 2024) for connecting LLM applications to external tools, data sources, and prompts. An MCP server exposes Resources (read-only data), Prompts (reusable templates), and Tools (executable functions) over JSON-RPC; any MCP-compatible client — Claude Desktop, Cursor, Cline, Zed, VS Code, or any agent that speaks MCP — can consume them.',
      whyItExists:
        'Before MCP, every tool integration was bespoke: each editor and each agent framework wrote its own adapters for GitHub, Slack, Postgres, the filesystem, and so on. MCP standardizes the contract — write a server once, use it from any client. It is the "USB-C for AI tools." Maintained by Anthropic; open spec, MIT-licensed Python and TypeScript SDKs.',
      howItWorks: [
        { type: 'h3', text: 'Core concepts' },
        {
          type: 'ul',
          items: [
            'MCP server — a process that exposes capabilities (tools, resources, prompts) over JSON-RPC.',
            'MCP client — embedded in an LLM app (Claude Desktop, Cursor, an agent framework); connects to servers.',
            'Transports — `stdio` (local subprocess), `Streamable HTTP` (the current default for remote), and SSE (legacy).',
            'Tools — executable functions with a JSON-schema for arguments; the LLM decides when to call them.',
            'Resources — read-only data the client can list and read (file contents, DB rows, logs).',
            'Prompts — reusable, parameterised message templates the user can pick from a UI.',
            'Sampling — a server can ask the client to make an LLM call on its behalf (reverse direction).',
            'Roots — filesystem/workspace boundaries the client publishes so servers know where to operate.'
          ]
        },
        { type: 'h3', text: 'Installation' },
        {
          type: 'code',
          lang: 'bash',
          caption: 'Install the official Anthropic Python SDK for MCP',
          code: `pip install mcp`
        },
        { type: 'h3', text: 'Minimal working example (server pattern from the Anthropic spec)' },
        {
          type: 'code',
          lang: 'python',
          caption: 'A FastMCP server with one tool — the canonical pattern',
          code: `# server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("calculator")

@mcp.tool()
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b

if __name__ == "__main__":
    mcp.run()  # runs over stdio by default`
        },
        {
          type: 'p',
          text: 'Register this server in Claude Desktop by adding it to `claude_desktop_config.json`. The client launches your server as a subprocess and discovers its tools automatically.'
        },
        {
          type: 'code',
          lang: 'json',
          caption: 'Claude Desktop config (macOS path)',
          code: `{
  "mcpServers": {
    "calculator": {
      "command": "python",
      "args": ["/abs/path/to/server.py"]
    }
  }
}`
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'A richer server: a Resource (read-only data) plus a Tool, with type hints',
          code: `from mcp.server.fastmcp import FastMCP

mcp = FastMCP("notes")

NOTES: dict[str, str] = {}

@mcp.resource("notes://list")
def list_notes() -> str:
    """Return all notes as a single text blob the client can display."""
    return "\\n".join(f"- {k}: {v[:40]}" for k, v in NOTES.items())

@mcp.resource("notes://{title}")
def get_note(title: str) -> str:
    """Return the full body of one note."""
    return NOTES.get(title, "(not found)")

@mcp.tool()
def create_note(title: str, body: str) -> str:
    """Create or overwrite a note."""
    NOTES[title] = body
    return f"Saved note '{title}'."

if __name__ == "__main__":
    mcp.run()`
        },
        {
          type: 'p',
          text: 'On the client side, MCP servers appear to the LLM as ordinary tools. PydanticAI, LangChain (via `langchain-mcp-adapters`), and the Anthropic SDK all expose MCP servers as tools with one or two lines of configuration, so the same `notes` server is reusable from any of them.'
        }
      ],
      advantages: [
        'Write a tool once, use it from Claude Desktop, Cursor, Cline, Zed, and any MCP-aware agent.',
        'Clean separation: the server owns the integration logic; the client owns the LLM.',
        'Stdio transport means zero network config for local tools; HTTP transport scales to remote.',
        'Growing library of community servers (GitHub, Slack, Postgres, filesystem, Brave search, Puppeteer).'
      ],
      disadvantages: [
        'Each MCP server is a separate process — startup cost and memory overhead per server.',
        'Stdio transport is local-only; remote deployment needs the HTTP transport and auth.',
        'Spec is young and still evolving — some clients support features others do not.',
        'No built-in auth standard yet (OAuth flows are being finalised in the spec).'
      ],
      commonMistakes: [
        'Returning non-JSON-serialisable objects from a `@mcp.tool()` — wrap in a dataclass / dict.',
        'Forgetting the docstring on a tool — the LLM uses it to decide when to call; a missing docstring means the tool is never called.',
        'Running the server with `mcp.run()` in a script that also does other things — `run()` blocks the event loop.',
        'Not validating inputs inside the tool — JSON schema validates shape, not business rules.'
      ],
      limitations: [
        'No built-in marketplace or registry of servers (yet) — discovery is manual via GitHub lists.',
        'Sandboxing is the server author\'s responsibility — a tool that runs shell commands is as dangerous as it sounds.',
        'Stateful servers (in-memory `NOTES` above) do not survive restarts; persist to disk or a DB for production.'
      ],
      relatedConcepts: ['Model Context Protocol', 'JSON-RPC', 'Tool Calling', 'Claude Desktop', 'MCP Clients'],
      faq: [
        { q: 'How is MCP different from OpenAI function calling?', a: 'Function calling is a per-call LLM feature; MCP is a protocol for discovering and exposing tools across clients and servers. You can wrap MCP tools as OpenAI-style functions, but MCP also covers resources, prompts, sampling, and roots — a richer contract.' },
        { q: 'When should I NOT use this framework?', a: 'For a single in-process tool used by only one agent — direct function calls are simpler. MCP pays off when the same tool should be reusable across clients (Claude Desktop, Cursor, your own agent) or shared between teams.' }
      ],
      summary:
        'MCP is the open standard for tool/data integration across LLM clients and servers. Use it when you want a tool to be reusable across Claude Desktop, Cursor, your own agents, and others — write once, run anywhere. Skip it for single-process, single-agent tools where direct function calls are cheaper.'
    }
  ]
}
