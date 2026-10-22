import type { GlossaryEntry } from './types'

// Alphabetical glossary of AI terms (case-insensitive sort).
// Categories are constrained to the set defined in the project spec.

export const glossary: GlossaryEntry[] = [
  {
    term: 'Activation Function',
    category: 'Deep Learning',
    short: 'A mathematical function applied to a neuron\u2019s weighted input to introduce non-linearity into a neural network.',
    detailed: 'Without activation functions, stacking linear layers would still produce only a linear function, making deep networks pointless. Common choices include ReLU (cheap, default for hidden layers), sigmoid and tanh (older, suffer from vanishing gradients), and GELU (used in Transformers). The choice of activation affects training speed, gradient flow, and the kinds of functions the network can represent.'
  },
  {
    term: 'Agent',
    category: 'Agents',
    short: 'An AI system that perceives input, reasons about goals, chooses actions (often via tools), and observes outcomes in a loop.',
    detailed: 'An agent is distinguished from a single model call by its loop: it does not just answer, it acts, observes the result, and decides the next step. Agents typically combine an LLM as the reasoning engine with tools, memory, and a control flow (ReAct, plan-and-execute, or a custom state machine). The hard parts are deciding when to stop, handling tool failures, and bounding cost.'
  },
  {
    term: 'Agentic AI',
    category: 'Agents',
    short: 'A class of AI systems built around autonomous agents that pursue multi-step goals with minimal human steering.',
    detailed: 'Agentic AI shifts the interaction model from "one prompt, one response" to "give the agent a goal and let it iterate". This raises new engineering concerns: cost control, safety guardrails, observability of multi-step traces, and graceful failure when a tool or sub-agent errors. Production agentic systems almost always include a human-in-the-loop checkpoint for consequential actions.'
  },
  {
    term: 'AGI',
    category: 'AI Fundamentals',
    short: 'Artificial General Intelligence \u2014 a hypothetical system that matches or exceeds human reasoning across essentially any cognitive task.',
    detailed: 'No system today qualifies as AGI; current LLMs, no matter how impressive, are narrow AI specialised on language and the patterns in their training data. AGI is debated because it is unclear whether scaling current architectures is sufficient or whether new ideas (planning, grounding, memory) are required. Treating near-term AGI as certain is a marketing claim, not an engineering one.',
    relatedLesson: { moduleId: 'm1', lessonId: 'what-is-ai' }
  },
  {
    term: 'ANI',
    category: 'AI Fundamentals',
    short: 'Artificial Narrow Intelligence \u2014 AI that performs one task or a narrow family of tasks well, without cross-domain generality.',
    detailed: 'Every deployed AI system today \u2014 spam filters, self-driving stacks, LLMs, recommendation engines \u2014 is ANI. ANI is not a failure mode; it is the engineering reality that makes evaluation, safety, and SLAs tractable. The honest framing is: "this model is narrow on the distribution it was trained on, and brittle outside it."',
    relatedLesson: { moduleId: 'm1', lessonId: 'what-is-ai' }
  },
  {
    term: 'ANN',
    category: 'Deep Learning',
    short: 'Artificial Neural Network \u2014 a model composed of layered nodes that apply weighted sums and non-linearities to input.',
    detailed: 'ANNs are loosely inspired by biological neurons but are best understood as parameterised function approximators. A feed-forward ANN maps an input vector through stacked linear+activation layers to an output; training adjusts the weights via backpropagation to minimise a loss. Depth (many layers) and width (nodes per layer) determine the class of functions the network can represent.'
  },
  {
    term: 'ANNS',
    category: 'Embeddings',
    short: 'Approximate Nearest Neighbour Search \u2014 algorithms that find near vectors fast, trading exactness for speed.',
    detailed: 'Exact nearest-neighbour search over millions of high-dimensional vectors is too slow for production. ANNS algorithms (HNSW, IVF, ScaNN) build index structures that return "good enough" neighbours in milliseconds with recall typically above 95%. The trade-off is index build time, memory, and a configurable recall/latency dial \u2014 you tune it to your SLA.'
  },
  {
    term: 'Attention',
    category: 'Deep Learning',
    short: 'A mechanism that lets a model weigh different parts of the input differently when producing each output element.',
    detailed: 'In the Transformer, attention computes a weighted average of value vectors, where weights come from a similarity score between a query and keys. This lets the model focus on relevant tokens regardless of position. Attention is what replaced recurrence and made parallel training of language models on GPUs tractable \u2014 the core idea of "Attention Is All You Need" (2017).'
  },
  {
    term: 'Autoregressive',
    category: 'LLM',
    short: 'A generation model that produces output one token at a time, conditioning each new token on all previously generated tokens.',
    detailed: 'Autoregressive LLMs sample token t+1 from p(x_{t+1} | x_1\u2026x_t), append it, and repeat until a stop condition. This is why generation is sequential and why long outputs are slow. It is also why errors compound: one bad token becomes part of the context for the next. Non-autoregressive alternatives exist but lag in quality for text.'
  },
  {
    term: 'Backpropagation',
    category: 'Machine Learning',
    short: 'The algorithm used to compute gradients of a neural network\u2019s loss with respect to its weights, enabling gradient descent.',
    detailed: 'Backprop applies the chain rule from the output layer backwards through every layer to compute \u2202L/\u2202w for each weight in one pass. Combined with gradient descent, this is how neural networks learn. Modern frameworks (PyTorch, TensorFlow) compute backprop automatically via autodiff; the engineer\u2019s job is to ensure gradients flow well (no vanishing/exploding) and the loss is well-shaped.'
  },
  {
    term: 'Batch Normalization',
    category: 'Deep Learning',
    short: 'A technique that normalises layer activations across a mini-batch to stabilise and accelerate training.',
    detailed: 'Batch norm reduces internal covariate shift by re-centring and re-scaling activations using batch statistics, then applying a learned scale and shift. It allows higher learning rates and acts as a mild regulariser. In Transformers it has largely been displaced by LayerNorm (which normalises per-token across features, avoiding batch dependence).'
  },
  {
    term: 'Batch Size',
    category: 'Machine Learning',
    short: 'The number of training examples processed together in one forward/backward pass before a weight update.',
    detailed: 'Batch size trades off gradient noise against compute efficiency. Small batches (8\u201332) give noisier but more frequent updates and often generalise better; large batches (thousands) use GPUs efficiently but need careful learning-rate scaling and can converge to sharper minima. Memory is the usual constraint: batch size is bounded by what fits in VRAM.'
  },
  {
    term: 'BPE',
    category: 'LLM',
    short: 'Byte-Pair Encoding \u2014 a tokenisation scheme that builds a vocabulary by iteratively merging the most frequent adjacent byte pairs.',
    detailed: 'BPE starts from individual bytes and merges common pairs ("th", "e_" \u2192 "the_"), producing a vocabulary that handles rare and unseen words as compositions of subword units. This balances vocabulary size (typical: 30k\u2013200k tokens) against sequence length. GPT-style models use BPE; Llama uses a SentencePiece variant. Tokenisation explains why " strawberry" has 3 r\u2019s is a real model behaviour, not a typo.'
  },
  {
    term: 'Chunking',
    category: 'RAG',
    short: 'Splitting long documents into smaller, retrievable units before embedding them in a vector store.',
    detailed: 'Chunking is the most under-appreciated lever in RAG quality. Naive fixed-size chunks (e.g. 512 tokens) cut sentences and lose context; better strategies split on semantic boundaries (paragraphs, headings) and add overlap. Chunk size trades recall (small chunks = precise matches) against context (large chunks = more surrounding info for the LLM). Metadata (section title, page) should travel with each chunk.'
  },
  {
    term: 'Context Window',
    category: 'LLM',
    short: 'The maximum number of tokens a model can attend to in a single forward pass, including prompt and generated output.',
    detailed: 'The context window sets how much text the model can "see" at once. Early GPT-3 had 2k tokens; modern models range from 8k to 2M. Larger windows enable long-document Q&A and long agentic traces, but cost grows quadratically with naive attention (variants like sliding-window, ring, or sparse attention reduce this). Exceeding the window truncates or errors \u2014 RAG exists largely to work around the limit.'
  },
  {
    term: 'Cosine Similarity',
    category: 'Embeddings',
    short: 'A similarity metric equal to the cosine of the angle between two vectors, ranging from -1 (opposite) to 1 (identical direction).',
    detailed: 'Cosine similarity ignores vector magnitude, focusing only on direction, which matches how semantic embeddings are usually compared. For normalised vectors it equals the dot product, making it cheap to compute. It is the default similarity for embedding search, though dot product or L2 distance are sometimes preferred depending on how the embedding model was trained.'
  },
  {
    term: 'Cross-Entropy',
    category: 'Machine Learning',
    short: 'A loss function measuring the difference between a predicted probability distribution and the true distribution.',
    detailed: 'For classification, cross-entropy penalises confident wrong predictions heavily and rewards confident correct ones. In LLM training, the loss is the cross-entropy of the model\u2019s next-token distribution against the actual next token, averaged over the sequence. Minimising cross-entropy is equivalent to maximising the likelihood of the data under the model.'
  },
  {
    term: 'Diffusion Model',
    category: 'Generative AI',
    short: 'A generative model that learns to reverse a gradual noising process, producing samples (often images) from noise.',
    detailed: 'Diffusion models train a network to predict the noise added at each step of a Markov chain that destroys structure; at inference, they start from pure noise and iteratively denoise. Stable Diffusion, DALL\u00b7E 3, and Midjourney are diffusion-based. They beat GANs on mode coverage and training stability at the cost of slower sampling, which distillation and consistency models partly address.'
  },
  {
    term: 'Embedding',
    category: 'Embeddings',
    short: 'A vector of real numbers representing an entity (word, sentence, image) in a space where closeness reflects semantic similarity.',
    detailed: 'Embeddings turn discrete or high-dimensional inputs into dense vectors that downstream models or search systems can use. A good embedding places related items near each other and unrelated ones far apart. They are the substrate of semantic search, RAG, and recommendation; the quality of the embedding model usually matters more than the choice of vector DB.'
  },
  {
    term: 'Embedding Model',
    category: 'Embeddings',
    short: 'A trained model that maps inputs (text, images, code) to fixed-dimensional embedding vectors.',
    detailed: 'Text embedding models (OpenAI text-embedding-3, BGE, E5, gte) are typically encoder-style Transformers fine-tuned with contrastive losses so that similar texts have high cosine similarity. Choice of model fixes dimensionality (e.g. 1536, 768), language coverage, and maximum input length. Mixing embedding models in one store breaks similarity \u2014 pick one and stick with it.'
  },
  {
    term: 'Episodic Memory',
    category: 'Agents',
    short: 'An agent\u2019s memory of past events \u2014 specific interactions, outcomes, and context \u2014 that can be retrieved for future decisions.',
    detailed: 'Episodic memory contrasts with semantic memory (general facts) and procedural memory (skills). In agents, it is usually implemented as a vector store of past turns or a structured log indexed by time and topic. Without it, an agent repeats mistakes and cannot learn within a session; with it, an agent can recall "last time the user asked this, this tool failed" and adapt.'
  },
  {
    term: 'Few-Shot',
    category: 'LLM',
    short: 'Prompting a model with a small number of input\u2192output examples to steer its behaviour on a new input.',
    detailed: 'Few-shot places 2\u201310 worked examples in the prompt so the model pattern-matches the task format without weight updates. It works because of in-context learning. It is cheap (no training) but consumes context tokens and is brittle \u2014 example order and wording shift outputs. When you have hundreds of examples, fine-tuning usually beats few-shot on cost and quality.'
  },
  {
    term: 'Fine-Tuning',
    category: 'LLM',
    short: 'Continued training of a pretrained model on a smaller, task-specific dataset to adapt its behaviour.',
    detailed: 'Fine-tuning shifts the model\u2019s weights so it adopts a style, format, or domain knowledge. Supervised fine-tuning (SFT) uses input\u2192output pairs; preference fine-tuning (DPO, RLHF) uses ranked outputs. It is more durable than few-shot prompting and saves tokens at inference, but risks catastrophic forgetting and requires labelled data. LoRA/QLoRA make it affordable on consumer GPUs.'
  },
  {
    term: 'Foundation Model',
    category: 'LLM',
    short: 'A large pretrained model that serves as a base for downstream adaptation via fine-tuning or prompting.',
    detailed: 'Coined by Stanford in 2021, "foundation model" emphasises that one expensive pretrained model backs many downstream applications. GPT-4, Claude, Llama 3, and Gemini are foundation models. The economic argument: pretrain once at huge cost, adapt cheaply many times. The risk: a single model\u2019s biases propagate to every downstream use.'
  },
  {
    term: 'Function Calling',
    category: 'Tools & MCP',
    short: 'A structured output mode in which an LLM returns a JSON argument block naming a function to invoke, instead of free text.',
    detailed: 'Function calling constrains the model to a declared tool schema (name, parameters, types) so the application can parse and execute reliably. The model is trained or prompted to emit valid JSON; the host validates, executes, and returns the result. It is the basis of tool use, agents, and MCP. Tool choice and parameter accuracy remain failure modes worth testing.'
  },
  {
    term: 'GAN',
    category: 'Generative AI',
    short: 'Generative Adversarial Network \u2014 two networks (generator and discriminator) trained against each other to produce realistic samples.',
    detailed: 'The generator creates fakes; the discriminator tries to detect them; the generator improves until the discriminator can\u2019t tell. GANs dominated image generation pre-diffusion and still lead on inference speed and sharpness. They are notoriously hard to train (mode collapse, instability) and have been largely displaced by diffusion for high-quality image synthesis.'
  },
  {
    term: 'Gradient Descent',
    category: 'Machine Learning',
    short: 'An optimisation algorithm that updates parameters in the direction of the negative gradient of the loss.',
    detailed: 'Each step moves weights by \u2013\u03b7\u00b7\u2207L, where \u03b7 is the learning rate. Stochastic/mini-batch variants estimate the gradient from a sample. Momentum, Adam, and RMSProp add adaptive terms that speed convergence and reduce sensitivity to the learning rate. The art of training is choosing the optimiser, schedule, and rate so the loss decreases without diverging.'
  },
  {
    term: 'Grounding',
    category: 'RAG',
    short: 'Constraining a model\u2019s output to be supported by retrieved or provided evidence rather than its parametric memory.',
    detailed: 'Grounding reduces hallucination by giving the model a source to cite and (optionally) penalising claims not in the source. RAG is the dominant grounding pattern: retrieve relevant chunks, prepend them, instruct the model to answer only from them. Full grounding is impossible \u2014 the model can still misread \u2014 but citations and verification steps push accuracy up significantly.'
  },
  {
    term: 'Hallucination',
    category: 'LLM',
    short: 'When an LLM produces fluent text that is factually wrong, fabricated, or ungrounded in provided context.',
    detailed: 'Hallucination is not a bug but a property of next-token prediction: the model samples the most plausible continuation, not the truest one. It is worst on long-tail facts, dates, citations, and code APIs. Mitigations include RAG, function calling for facts, lower temperature, and post-hoc verification. Complete elimination is not currently achievable; bounding it via evaluation is the production goal.'
  },
  {
    term: 'HNSW',
    category: 'Embeddings',
    short: 'Hierarchical Navigable Small World \u2014 a graph-based ANNS index that delivers high recall with low query latency.',
    detailed: 'HNSW builds a multi-layer graph where upper layers are sparse (fast long-range navigation) and lower layers are dense (precise local search). Queries descend the layers. It is the default index in most vector DBs (pgvector, Qdrant, Weaviate) because it gives sub-millisecond queries at 95%+ recall. Trade-offs: high memory, slow inserts, tunable M and efConstruction parameters.'
  },
  {
    term: 'In-Context Learning',
    category: 'LLM',
    short: 'A model\u2019s ability to adapt to a task from examples in the prompt, without any weight updates.',
    detailed: 'In-context learning is what makes large pretrained models feel "general" \u2014 you show 3 examples and the model follows the pattern. It emerges sharply above a parameter threshold and is not fully understood mechanistically. It is the basis of few-shot prompting and is bounded by context length and the model\u2019s ability to attend to the examples.'
  },
  {
    term: 'Inference',
    category: 'Production',
    short: 'Running a trained model on new inputs to produce outputs, as opposed to training.',
    detailed: 'Inference is the serving phase: model weights are frozen, and each request is a forward pass. Inference cost dominates for most LLM applications, so it is heavily optimised \u2014 KV cache, batching, quantization, speculative decoding, and distillation all target inference. The production metric is usually tokens/sec/$ at a target latency and quality.'
  },
  {
    term: 'KV Cache',
    category: 'LLM',
    short: 'A cache of the keys and values computed for past tokens so they need not be recomputed at each generation step.',
    detailed: 'In autoregressive generation, every new token attends to all previous tokens. Naively this is O(n\u00b2). The KV cache stores the per-layer K and V for past tokens so only the new token\u2019s K/V is computed per step, reducing each step to O(n). The cache grows with context and is the main memory cost of long-context serving \u2014 eviction and paged-KV strategies manage it.'
  },
  {
    term: 'LLM',
    category: 'LLM',
    short: 'Large Language Model \u2014 a Transformer trained on massive text corpora to predict the next token, exhibiting broad language competence.',
    detailed: 'LLMs are autoregressive Transformers with billions to trillions of parameters, trained on trillions of tokens. Their "intelligence" is statistical pattern matching at scale, refined by instruction tuning and RLHF. They power chat, code, search, agents, and RAG. They hallucinate, have finite context, and reflect training-data biases \u2014 production use requires guardrails and evaluation.'
  },
  {
    term: 'LoRA',
    category: 'LLM',
    short: 'Low-Rank Adaptation \u2014 fine-tuning method that trains small low-rank weight deltas instead of all parameters.',
    detailed: 'LoRA freezes the base model and injects trainable A\u00b7B decompositions (rank r typically 8\u201364) into each weight matrix. This cuts trainable parameters by 100\u20131000\u00d7, letting you fine-tune a 7B model on a single consumer GPU. Quality is usually within a point or two of full fine-tuning. LoRA adapters are tiny (megabytes) and swappable at runtime, enabling per-user or per-task models.'
  },
  {
    term: 'Loss Function',
    category: 'Machine Learning',
    short: 'A function measuring how wrong a model\u2019s prediction is, which training minimises.',
    detailed: 'The loss turns "the model is bad" into a number the optimiser can descend. Common losses: cross-entropy (classification), MSE (regression), contrastive (embeddings), KL divergence (probability matching). Choosing and shaping the loss is one of the highest-leverage modelling decisions \u2014 a bad loss can make a powerful architecture learn the wrong thing.'
  },
  {
    term: 'MCP',
    category: 'Tools & MCP',
    short: 'Model Context Protocol \u2014 an open standard for exposing tools, resources, and prompts to LLMs through a uniform interface.',
    detailed: 'MCP decouples tool definition from the model and host: a server exposes tools as typed schemas; any MCP-aware client (Claude Desktop, IDE, agent) can consume them. This replaces bespoke per-model function-calling glue with a shared protocol, so a Postgres MCP server works with any compliant agent. MCP also defines resources (read-only context) and prompts (reusable templates).'
  },
  {
    term: 'Multi-Head Attention',
    category: 'Deep Learning',
    short: 'Attention computed in parallel across several learned subspaces, then concatenated.',
    detailed: 'Instead of one attention operation, the model splits the query/key/value into h heads (e.g. 12, 32), attends within each, and concatenates. Each head can specialise \u2014 one attends to syntax, another to coreference, another to long-range dependencies. Heads increase representational capacity at linear cost and are a defining feature of the Transformer.'
  },
  {
    term: 'Multimodal',
    category: 'Generative AI',
    short: 'A model that can take in or produce more than one modality \u2014 e.g. text, images, audio, video.',
    detailed: 'Multimodal models encode different modalities into a shared representation so the model can reason across them \u2014 caption an image, transcribe speech, answer questions about a video. GPT-4o, Gemini, and Claude 3 are multimodal. Multimodality improves grounding (the model can "see" evidence) and expands use cases but multiplies evaluation and safety complexity.'
  },
  {
    term: 'Next-Token Prediction',
    category: 'LLM',
    short: 'The training objective of autoregressive LLMs: predict the next token given previous tokens.',
    detailed: 'Given a sequence x_1\u2026x_t, the model outputs a probability distribution over the vocabulary for x_{t+1}. Training minimises cross-entropy against the actual next token from the data. This self-supervised objective scales with data: you can train on the entire web without labelling. The surprising result is that next-token prediction, at scale, produces broad competence \u2014 the basis of modern LLMs.'
  },
  {
    term: 'Overfitting',
    category: 'Machine Learning',
    short: 'When a model learns patterns specific to training data, including noise, that do not generalise to new data.',
    detailed: 'An overfit model scores high on training data but low on validation data \u2014 it has memorised rather than generalised. Causes: too many parameters, too little data, too many epochs. Fixes: more data, regularisation (dropout, weight decay), early stopping, and capacity control. The train/validation gap is the diagnostic; a model with low train but high validation loss is underfitting instead.'
  },
  {
    term: 'Positional Encoding',
    category: 'Deep Learning',
    short: 'A signal added to token embeddings so the Transformer knows the order of tokens, since attention is permutation-invariant.',
    detailed: 'Self-attention has no notion of order \u2014 it treats input as a set. Positional encodings inject order information. The original Transformer used sinusoidal encodings; modern models often use learned absolute or rotary (RoPE) encodings, the latter enabling length extrapolation. Choice of positional encoding affects maximum context length and out-of-distribution behaviour on long inputs.'
  },
  {
    term: 'Pretraining',
    category: 'LLM',
    short: 'The first, expensive training phase where a model learns general patterns from a massive unlabelled corpus.',
    detailed: 'Pretraining uses self-supervised objectives (next-token prediction for LLMs, masked-language modelling for some encoders) on trillions of tokens. It is what makes a model a "foundation" \u2014 the resulting weights encode broad language and world knowledge. Pretraining a frontier LLM costs millions of dollars and months of GPU time; everything downstream (fine-tuning, prompting) is cheap by comparison.'
  },
  {
    term: 'QLoRA',
    category: 'LLM',
    short: 'Quantized LoRA \u2014 fine-tunes a 4-bit quantised base model with LoRA adapters, enabling large-model fine-tuning on a single GPU.',
    detailed: 'QLoRA keeps the frozen base in 4-bit NormalFloat (NF4) and computes LoRA gradients in BF16, paging optimiser state to CPU to fit memory. This lets you fine-tune a 33B model on a 24GB GPU. Quality matches full fine-tuning on most benchmarks. It is the standard recipe for affordable fine-tuning and pairs well with PEFT libraries.'
  },
  {
    term: 'Quantization',
    category: 'Production',
    short: 'Reducing the precision of model weights (e.g. FP16\u2192INT8 or INT4) to shrink memory and speed up inference.',
    detailed: 'Quantization trades a small quality drop for large memory and throughput gains \u2014 INT4 can cut a 7B model from 14GB to ~4GB. Post-training quantization (PTQ) is cheap but can degrade quality; quantization-aware training (QAT) preserves quality better. For LLMs, weight-only quantization (W4A16) is common because activations stay in FP16, avoiding accuracy loss in the attention path.'
  },
  {
    term: 'RAG',
    category: 'RAG',
    short: 'Retrieval-Augmented Generation \u2014 retrieving relevant context from a store and including it in the prompt before generation.',
    detailed: 'RAG addresses two LLM limits: knowledge cutoff and hallucination. At query time you embed the query, retrieve top-k chunks from a vector store, and prepend them so the model answers from current, grounded context. RAG is cheaper than fine-tuning for frequently changing knowledge and provides citations. Quality hinges on chunking, retrieval, and reranking \u2014 not the LLM.'
  },
  {
    term: 'ReAct',
    category: 'Agents',
    short: 'A prompting pattern where the agent interleaves Reasoning (Thought) and Acting (Action/Observation) steps in a loop.',
    detailed: 'ReAct prompts the model to emit a Thought (what to do next), an Action (a tool call), and an Observation (the tool\u2019s result), repeating until it can produce a final answer. The explicit reasoning trace improves tool selection and gives observability. It is the simplest effective agent loop and the basis of most production agent frameworks; its failure mode is looping on bad observations.'
  },
  {
    term: 'ReLU',
    category: 'Deep Learning',
    short: 'Rectified Linear Unit \u2014 the activation f(x)=max(0,x), the default for hidden layers in most feed-forward networks.',
    detailed: 'ReLU is cheap, non-saturating for positive inputs (mitigating vanishing gradients), and empirically effective. Its main issue is "dying ReLU": neurons with negative inputs produce 0 gradient and never recover. Leaky ReLU, GELU, and SwiGLU (used in modern Transformers) address this. Despite its simplicity, ReLU was one of the enablers of deep-network training.'
  },
  {
    term: 'Reranking',
    category: 'RAG',
    short: 'A second-stage model that re-scores initially retrieved documents to improve the order shown to the LLM.',
    detailed: 'Vector retrieval is fast but coarse \u2014 it ranks by embedding similarity, which can miss query-specific relevance. A cross-encoder reranker takes (query, doc) pairs and outputs a relevance score using full attention between them, far more accurate but too slow to run over the whole corpus. The standard RAG pattern: retrieve top-50 with embeddings, rerank to top-5, send to the LLM.'
  },
  {
    term: 'RLHF',
    category: 'LLM',
    short: 'Reinforcement Learning from Human Feedback \u2014 aligning a model to human preferences using a reward model trained on rankings.',
    detailed: 'RLHF collects human preferences over pairs of model outputs, trains a reward model to predict them, then optimises the policy (usually via PPO) to maximise reward. It is what turned base GPT-3 into ChatGPT \u2014 instructive, helpful, and refusing harmful requests. DPO simplifies this by skipping the reward model. RLHF is powerful but can reward-model-hack and introduce subtle biases.'
  },
  {
    term: 'Sampling',
    category: 'LLM',
    short: 'The process of picking the next token from the model\u2019s probability distribution during generation.',
    detailed: 'Greedy sampling picks the argmax (deterministic, repetitive); temperature scales the distribution before sampling (high = creative, low = focused); top-k restricts to the k most likely; top-p (nucleus) restricts to the smallest set whose probability exceeds p. Combining temperature + top-p gives most production behaviour. Stop sequences and max tokens bound the output length regardless of sampling.'
  },
  {
    term: 'Self-Attention',
    category: 'Deep Learning',
    short: 'Attention where the same sequence provides its own queries, keys, and values \u2014 every token attends to every other token.',
    detailed: 'Self-attention lets each position gather information from all positions (including itself) weighted by query-key similarity. It is permutation-invariant without positional encoding. Self-attention is the core of the encoder and decoder in the Transformer and the reason the architecture parallelises: all positions are computed at once, unlike RNNs.'
  },
  {
    term: 'Semantic Search',
    category: 'Embeddings',
    short: 'Search that ranks results by meaning (embedding similarity) rather than exact keyword match.',
    detailed: 'Semantic search embeds the query and retrieves the nearest documents in vector space, so "how do I reset my password" finds "account recovery steps" even with no shared words. It handles synonyms and phrasing variation that keyword search misses. Hybrid search (BM25 + vector) usually wins on production benchmarks, and a reranker on top pushes relevance further.'
  },
  {
    term: 'Softmax',
    category: 'Deep Learning',
    short: 'A function that converts a vector of scores into a probability distribution that sums to 1.',
    detailed: 'Softmax exponentiates each score and normalises by the sum, producing probabilities. It is the standard output layer for classification and the final step before sampling in LLMs. The temperature parameter scales the logits before softmax: high temperature flattens the distribution, low temperature sharpens it. Numerically stable implementations subtract the max logit before exponentiating.'
  },
  {
    term: 'Stop Sequence',
    category: 'LLM',
    short: 'A string that, when generated, ends the response and is usually suppressed from the output.',
    detailed: 'Stop sequences let you control where generation ends \u2014 e.g. a "\n\nUser:" delimiter in a chat-formatted prompt. They are essential when the model is prompted with a continuation format and would otherwise keep generating the next turn. Combining stop sequences with max-tokens bounds cost; without a stop sequence, a model can ramble until it hits the token limit.'
  },
  {
    term: 'Temperature',
    category: 'LLM',
    short: 'A scalar that scales logits before softmax, controlling the randomness of sampling.',
    detailed: 'Temperature T divides logits before softmax: low T (<1) sharpens the distribution toward the top token (deterministic, focused); high T (>1) flattens it (creative, risky). T=0 is greedy. Typical settings: 0\u20130.3 for extraction/code, 0.7 for chat, 0.9+ for brainstorming. Temperature interacts with top-p and top-k; in production you usually set all three together.'
  },
  {
    term: 'Token',
    category: 'LLM',
    short: 'The basic unit of text an LLM processes \u2014 typically a subword, common word, or punctuation mark.',
    detailed: 'Tokens are produced by a tokenizer (BPE, SentencePiece) and are the unit for context length, pricing, and generation count. English averages ~0.75 words per token; non-Latin scripts often use more tokens per word. Counting tokens accurately requires the specific model\u2019s tokenizer; rough estimates (4 chars = 1 token) are off by 10\u201320% and matter for cost and context-window planning.'
  },
  {
    term: 'Tokenization',
    category: 'LLM',
    short: 'The process of splitting text into tokens using a trained tokenizer\u2019s vocabulary.',
    detailed: 'Tokenization is deterministic given the vocabulary and is the first and last step of LLM inference (encode text\u2192tokens, decode tokens\u2192text). Bad tokenization (e.g. splitting on whitespace only) inflates sequence length; good subword tokenization balances vocabulary size against compression. Tokenization also affects model behaviour \u2014 spelling, counting, and arithmetic are sensitive to how words break into tokens.'
  },
  {
    term: 'Tool Calling',
    category: 'Tools & MCP',
    short: 'An LLM invoking external tools (functions, APIs) by emitting structured requests that the host executes.',
    detailed: 'Tool calling lets a model do things it cannot do alone: fetch live data, run code, query a database, send an email. The model decides which tool and arguments; the host executes and returns the result. It is the bridge from "language model" to "agent". Production concerns: schema validation, timeouts, retries, permission checks, and preventing the model from calling unsafe tools.'
  },
  {
    term: 'Transformer',
    category: 'Deep Learning',
    short: 'The neural architecture based on self-attention that underlies virtually all modern LLMs.',
    detailed: 'Introduced in 2017, the Transformer replaced recurrence with self-attention, enabling parallel training and better scaling. It has an encoder (BERT-style), decoder (GPT-style), or both (original, T5). Decoder-only Transformers dominate generative LLMs. The architecture\u2019s strength is that it scales smoothly with data and compute \u2014 the empirical basis of the modern AI era.'
  },
  {
    term: 'Underfitting',
    category: 'Machine Learning',
    short: 'When a model is too simple or undertrained to capture the patterns in the data, performing poorly on both train and validation.',
    detailed: 'An underfit model has high bias: it cannot represent the true function. Symptoms: train loss stays high and validation loss tracks it. Fixes: increase model capacity, train longer, reduce regularisation, or improve features. The opposite of overfitting, underfitting is the easier diagnosis \u2014 just check whether train loss is also bad.'
  },
  {
    term: 'VAE',
    category: 'Generative AI',
    short: 'Variational Autoencoder \u2014 a generative model that learns a latent space and decodes samples from it.',
    detailed: 'VAEs train an encoder to map inputs to a distribution over latents and a decoder to reconstruct inputs from sampled latents, optimising a reconstruction plus KL term. They produce smooth latent spaces useful for interpolation and controlled generation. VAEs dominated generative modelling pre-GAN/diffusion and remain useful where structured latents matter more than sample sharpness.'
  },
  {
    term: 'Vector Database',
    category: 'Embeddings',
    short: 'A database specialised for storing and querying high-dimensional vectors, typically using ANNS indexes.',
    detailed: 'Vector DBs (Pinecone, Qdrant, Weaviant, Milvus, pgvector) store embeddings alongside metadata and support k-NN queries filtered by metadata. They are the substrate of RAG and semantic search. Choice of DB trades managed-service convenience against self-hosted control; the underlying index is usually HNSW or IVF. Filtering and hybrid search are the features that distinguish production-grade options.'
  },
  {
    term: 'Zero-Shot',
    category: 'LLM',
    short: 'Using a model on a task with no task-specific examples in the prompt \u2014 only an instruction.',
    detailed: 'Zero-shot relies entirely on the model\u2019s pretrained knowledge and instruction tuning: "Translate to French: Hello" with no examples. It works well on common tasks and large models, and is the cheapest prompting mode. It is brittle on unusual formats or low-resource tasks, where few-shot usually wins. Zero-shot is also an evaluation setting: "can the model do X with no demonstrations?"'
  }
]
