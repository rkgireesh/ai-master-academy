import type { Module } from './types'

export const module3: Module = {
  id: 'm3',
  index: 3,
  title: 'Large Language Models',
  shortTitle: 'LLMs',
  description:
    'The deep technical core of modern AI. From tokenization to transformers, from pretraining to RLHF, from KV caching to quantization — this module takes you inside the machine. You will finish it understanding exactly what happens between a user prompt and the model\'s first generated token, and why LLMs behave the way they do (including why they hallucinate). This is the most detailed module in the academy; take it slowly.',
  level: 'Intermediate',
  icon: 'BrainCircuit',
  color: 'from-blue-500 to-cyan-500',
  quizId: 'q3',
  lessons: [
    // ------------------------------------------------------------------
    // 1. WHAT IS AN LLM
    // ------------------------------------------------------------------
    {
      id: 'what-is-llm',
      title: 'What is an LLM?',
      subtitle: 'A precise, demystified definition: an LLM is a token-prediction function trained on internet-scale text.',
      tags: ['llm', 'fundamentals', 'definition'],
      readingMinutes: 7,
      definition:
        'A Large Language Model (LLM) is a neural network — specifically a Transformer — trained on a massive text corpus to predict the next token in a sequence. Its parameters encode statistical regularities of language and world knowledge absorbed from that corpus. All of its capabilities (translation, summarization, code generation, reasoning) emerge from this single next-token-prediction objective.',
      whyItExists:
        'For decades, natural language processing required assembling hand-built pipelines: a tokenizer, a part-of-speech tagger, a parser, a named-entity recognizer, a domain-specific rule engine. Each component was fragile and the whole stack could not generalize beyond its training domain. LLMs exist because scaling a single, simple objective (predict the next token) on enough text, with enough parameters and compute, produces a model that can perform most language tasks without task-specific architecture — replacing the entire pipeline with one learned function.',
      howItWorks: [
        {
          type: 'p',
          text: 'An LLM is, at its core, a function f(tokens) → probability distribution over the next token. Given the input "The cat sat on the", the model outputs a vector of ~50,000 probabilities (one per vocabulary entry), with high probability mass on "mat", "floor", "couch", and low probability on "quantum". Generation is just sampling from that distribution, appending the sampled token, and repeating.'
        },
        {
          type: 'p',
          text: '"Large" refers to three things scaled together: (1) parameter count — millions to trillions of weights; (2) training data — trillions of tokens of text from the web, books, code, and conversation; (3) compute — thousands of GPUs running for weeks to months. The empirical discovery of the last decade is that capability grows smoothly with all three, a phenomenon called a "scaling law".'
        },
        { type: 'h3', text: 'The three-stage lifecycle of a modern LLM' },
        {
          type: 'ol',
          items: [
            'Pretraining — self-supervised next-token prediction on trillions of tokens. Produces a "base model" that can continue text but not follow instructions.',
            'Instruction tuning (SFT) — supervised fine-tuning on (instruction, response) pairs so the model answers questions instead of just continuing text.',
            'Preference optimization (RLHF / DPO) — train the model to prefer helpful, harmless, honest responses over plausible-but-bad ones using human preference data.'
          ]
        },
        {
          type: 'table',
          headers: ['Model family', 'Approx. parameters', 'Approx. training tokens', 'Architecture'],
          rows: [
            ['GPT-3 (2020)', '175B', '300B', 'Decoder-only Transformer'],
            ['Llama 2 70B', '70B', '2T', 'Decoder-only, RoPE, SwiGLU'],
            ['Llama 3.1 405B', '405B', '15T', 'Decoder-only, GQA, RoPE'],
            ['Mistral 7B', '7B', '~8T', 'Decoder-only, SWA, GQA'],
            ['GPT-4 (est.)', '~1.8T (MoE)', '~13T', 'Mixture-of-Experts Transformer']
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'What "emergent" really means',
          text: 'No engineer wrote code that says "if the user asks for Python, output Python". The model learned the statistical relationship between the prompt "write a function that..." and code-like continuations. Capabilities are emergent in the sense that they appear with scale, not in the sense that they are unexplainable — they all reduce to next-token prediction.'
        }
      ],
      examples: [
        { type: 'p', text: 'Prompt a base (non-instruct) LLM with "Q: What is the capital of France? A:" and it may respond "Q: What is the capital of Germany? A: Berlin" — because in its training data, lists of trivia questions often appeared together. The same model after instruction tuning responds "Paris" and stops. This single example shows what instruction tuning changes: behavior, not capability.' },
        { type: 'p', text: 'A 1.5B-parameter model trained on 100B tokens can write grammatical English but cannot follow multi-step instructions. The same architecture at 70B parameters on 2T tokens can. The capability difference is not in the code — both run the same forward pass — it is in the parameters learned from more data.' }
      ],
      advantages: [
        'One architecture handles an unprecedented range of language tasks.',
        'Capabilities improve predictably with more data, parameters, and compute.',
        'No task-specific feature engineering or labeled datasets required for the base model.',
        'Can be steered with natural-language instructions and examples (in-context learning).'
      ],
      disadvantages: [
        'Extremely expensive to pretrain (millions of dollars, weeks of GPU time).',
        'Outputs are probabilistic — they can be wrong, contradictory, or fabricated.',
        'Knowledge is frozen at training time; updates require retraining or retrieval.',
        'Opaque: it is hard to trace why a specific token was generated.'
      ],
      commonMistakes: [
        'Treating an LLM as a knowledge database — it is a pattern completer, not a lookup table.',
        'Equating "fluent" with "correct" — confident, well-written text can be entirely fabricated.',
        'Assuming the model "understands" — it pattern-matches; understanding is a property we project onto it.',
        'Believing bigger is always better for your task — a 7B model fine-tuned on your domain often beats a 70B general model.'
      ],
      limitations: [
        'Context window is finite (4K–2M tokens depending on model); the model cannot "read" more than that at once.',
        'Training data biases are absorbed and reproduced.',
        'No persistent memory across conversations without external storage.',
        'Symbolic reasoning (arithmetic, exact logic) is unreliable unless augmented with tools.'
      ],
      relatedConcepts: ['Transformers', 'Pretraining', 'Instruction Tuning', 'RLHF', 'Tokenization'],
      faq: [
        { q: 'Does an LLM "understand" language?', a: 'It models statistical regularities of text well enough to perform many tasks that require understanding-like behavior. Whether that constitutes understanding is a philosophical question. Practically: treat the model as a powerful pattern matcher, not a mind.' },
        { q: 'Why are LLMs called "large"?', a: 'Three things scale together: parameter count (billions), training data (trillions of tokens), and compute (thousands of GPU-hours). Capability depends on all three; you cannot scale one alone and expect the same gains.' },
        { q: 'Is ChatGPT one LLM or many?', a: 'The user-facing ChatGPT is a system: an LLM at its core, plus retrieval, tool use, moderation, conversation memory, and a UI. The LLM itself is just the token predictor; everything else is engineering around it.' }
      ],
      summary:
        'An LLM is a Transformer trained to predict the next token on internet-scale text. Its broad capabilities emerge from this single objective plus massive scale of parameters, data, and compute. Understanding LLMs means understanding that everything — translation, code, reasoning, hallucinations — is a side effect of next-token prediction. The rest of this module unpacks each component.'
    },

    // ------------------------------------------------------------------
    // 2. LLM VS TRADITIONAL NLP
    // ------------------------------------------------------------------
    {
      id: 'llm-vs-traditional-nlp',
      title: 'How LLMs Differ from Traditional NLP',
      subtitle: 'The shift from hand-built pipelines to a single end-to-end learned function.',
      tags: ['llm', 'nlp', 'comparison', 'fundamentals'],
      readingMinutes: 7,
      definition:
        'Traditional NLP decomposes language tasks into a pipeline of discrete, hand-engineered stages (tokenize → POS tag → parse → NER → intent classifier → rule engine). An LLM replaces the entire pipeline with a single neural network that maps input tokens directly to output tokens, learning every intermediate representation from data.',
      whyItExists:
        'The pipeline approach hit a ceiling: each stage accumulated errors, components could not be jointly optimized, and adding a new task (say, summarization) meant building a new component from scratch. LLMs exist because a single end-to-end model, trained on enough data, learns the shared representations underlying all language tasks — and new tasks require only a prompt or a small fine-tune, not new architecture.',
      howItWorks: [
        { type: 'h3', text: 'The traditional NLP pipeline (c. 2015)' },
        {
          type: 'p',
          text: 'A typical 2015-era chatbot ran text through this fixed pipeline: (1) regex-based tokenizer splits on whitespace and punctuation; (2) a part-of-speech tagger labels each token; (3) a dependency parser builds a syntax tree; (4) a named-entity recognizer extracts "Paris" as a location; (5) an intent classifier maps the utterance to one of N predefined intents; (6) a rule engine maps the intent plus entities to a response template. Every stage was a separate model trained on separate labeled data, and errors compounded.'
        },
        { type: 'h3', text: 'The LLM approach' },
        {
          type: 'p',
          text: 'An LLM removes every stage. The user types "Book a flight to Paris tomorrow"; the tokenizer (the only piece that survives, in modified form) converts it to token IDs; the Transformer processes the IDs in one forward pass; the output distribution is sampled to produce "Sure — booking you on the 9am flight to CDG. Confirm?". Intent detection, entity extraction, and response generation all happen inside the same set of weights.'
        },
        {
          type: 'table',
          headers: ['Dimension', 'Traditional NLP', 'LLM-based NLP'],
          rows: [
            ['Architecture', 'Pipeline of separate models', 'Single end-to-end Transformer'],
            ['Intermediate reps', 'Explicit (POS tags, parse trees)', 'Implicit (latent vectors)'],
            ['Training signal', 'Per-component labeled data', 'Next-token prediction (self-supervised)'],
            ['Adding a new task', 'Build & train a new component', 'Write a prompt or small fine-tune'],
            ['Error handling', 'Compounds down the pipeline', 'Single model, no compounding'],
            ['Compute at inference', 'Cheap (small models, CPU)', 'Expensive (billions of parameters, GPU)'],
            ['Explainability', 'High (you can inspect each stage)', 'Low (latent representations)'],
            ['Domain adaptation', 'Retrain relevant components', 'Fine-tune or RAG the LLM']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'What survived from traditional NLP',
          text: 'Tokenization is still with us (BPE, WordPiece, SentencePiece) — LLMs need it. Evaluation metrics (BLEU, ROUGE) and datasets (SQuAD, GLUE) are still used. And for high-throughput, narrow tasks (e.g. spam filtering on a million emails/day), a fine-tuned BERT still beats an LLM on cost-per-call by 1000x.'
        }
      ],
      examples: [
        { type: 'p', text: 'Sentiment analysis, traditional way: a TF-IDF vectorizer + logistic regression on n-grams, trained on 50K labeled reviews. ~92% accuracy, 1ms latency on CPU, $0.0001 per call. The LLM way: prompt GPT-4 with "Classify sentiment: <review>". ~95% accuracy, 800ms latency, $0.002 per call. For 10 reviews/day, the LLM wins on accuracy and zero engineering. For 10M reviews/day, the traditional model wins by $20,000/day in cost.' },
        { type: 'p', text: 'A 2018 chatbot that handled "What is my balance?" required an intent classifier trained on thousands of labeled banking utterances, an NER model trained on entity annotations, and a hand-written response template. A 2024 LLM handles it zero-shot with a prompt and a tool call to the balance API. The whole banking-NLP team that built the 2018 system is now a prompt + RAG pipeline.' }
      ],
      advantages: [
        'One model handles tasks that previously needed dozens of specialized components.',
        'New tasks need only a prompt — no model architecture or labeled dataset required.',
        'End-to-end training means no error compounding across pipeline stages.',
        'Capabilities transfer across tasks — a model good at translation is also good at summarization.'
      ],
      disadvantages: [
        'Far more expensive per inference call than specialized models.',
        'Latency is seconds, not milliseconds — unsuitable for some real-time use cases.',
        'Much harder to interpret or debug — no intermediate POS tags or parse trees to inspect.',
        'Harder to constrain — a pipeline can refuse out-of-scope inputs by design; an LLM will attempt anything.'
      ],
      commonMistakes: [
        'Using an LLM where a fine-tuned BERT would be 1000x cheaper and equally accurate.',
        'Throwing away years of labeled task-specific data when fine-tuning a smaller model on it would beat the LLM.',
        'Assuming "end-to-end" means "no pipeline" — production LLM systems are pipelines too (retrieval → LLM → tool call → LLM → response).',
        'Forgetting that LLMs need guardrails (output schemas, content filters, retry logic) that traditional pipelines got for free.'
      ],
      limitations: [
        'LLMs are not deterministic enough for tasks requiring exactness (tax calc, compliance).',
        'Cost per call limits use in high-volume, low-value-per-call applications.',
        'Difficult to formally verify behavior — problematic in safety-critical domains.'
      ],
      relatedConcepts: ['Foundation Models', 'Pretraining', 'Fine-Tuning', 'RAG', 'Tokenization'],
      faq: [
        { q: 'Is traditional NLP dead?', a: 'No. For narrow, high-volume tasks (spam, classification, NER on known schemas) specialized models are still cheaper and more reliable. LLMs won the long tail of low-volume, diverse tasks.' },
        { q: 'Why not just use an LLM for everything?', a: 'Cost, latency, and determinism. A bank processing 100M transactions/day for fraud signals cannot use a $0.002-per-call LLM; a 1ms XGBoost model is the right tool. LLMs are best where task diversity makes specialized models uneconomical.' }
      ],
      summary:
        'Traditional NLP built a pipeline of specialized models; LLMs replace it with one end-to-end learned function. The pipeline approach is still cheaper and more debuggable for narrow, high-volume tasks. LLMs win where task diversity, generalization, and zero-shot capability matter more than per-call cost. Modern production systems blend both: LLMs for the long tail, specialized models for the head.'
    },

    // ------------------------------------------------------------------
    // 3. FOUNDATION MODELS
    // ------------------------------------------------------------------
    {
      id: 'foundation-models',
      title: 'Foundation Models',
      subtitle: 'Train once on broad data, adapt many times to downstream tasks.',
      tags: ['foundation-models', 'transfer-learning', 'llm'],
      readingMinutes: 6,
      definition:
        'A foundation model is a large model pretrained on broad, generally unlabeled data at scale, designed to be adapted (via fine-tuning, prompting, or retrieval) to a wide range of downstream tasks. The term was coined by Stanford\'s CRFM in 2021; LLMs are the most prominent example, but the category also includes vision models (CLIP, DINO), multimodal models, and protein models (ESM, AlphaFold).',
      whyItExists:
        'Before foundation models, every new ML task required collecting a labeled dataset and training a model from scratch. The cost was enormous and the results were narrow. Foundation models flip the economics: spend tens of millions on one pretraining run, then adapt the result to thousands of downstream tasks with comparatively tiny fine-tunes (or no fine-tune at all, just a prompt). This is the engine behind the "one model, many tasks" era.',
      howItWorks: [
        {
          type: 'p',
          text: 'A foundation model is defined by two phases. Pretraining: train on broad data with a self-supervised objective (next-token prediction for LLMs, masked-image modeling for vision, contrastive image-text for CLIP). The output is a "base model" with general capabilities but no specific task alignment. Adaptation: take the base model and specialize it via prompting, in-context examples, fine-tuning, or retrieval. The same pretrained weights power every adaptation.'
        },
        { type: 'h3', text: 'Why this works: transfer learning' },
        {
          type: 'p',
          text: 'Pretraining forces the model to learn representations useful for predicting the next token (or masked patch, or contrasted pair). These representations — syntax, world knowledge, code structure, image textures — turn out to be useful for almost every downstream task. A model that can predict the next word in a Wikipedia article has implicitly learned grammar, entities, and basic reasoning, all of which transfer to summarization, translation, or Q&A.'
        },
        {
          type: 'table',
          headers: ['Foundation model', 'Modality', 'Pretraining objective', 'Downstream adaptations'],
          rows: [
            ['GPT-4 / Llama 3', 'Text', 'Next-token prediction', 'Chat, code, agents, RAG'],
            ['CLIP', 'Image + Text', 'Contrastive (image↔text)', 'Image search, zero-shot classification'],
            ['DINOv2', 'Image', 'Self-distillation', 'Segmentation, depth, retrieval'],
            ['Whisper', 'Audio + Text', 'Multitask speech', 'Transcription, translation'],
            ['ESM-2', 'Protein sequences', 'Masked residue prediction', 'Structure prediction, function'],
            ['AlphaFold 2', 'Protein', 'Structure distillation', 'Folding, docking']
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The economic shift',
          text: 'In 2018, a company wanting a good support-chatbot trained a BERT from scratch on its tickets — millions of dollars. In 2024, the same company fine-tunes Llama 3 8B on a few thousand tickets — hundreds of dollars. The base capability came free from pretraining; only the specialization costs.'
        }
      ],
      examples: [
        { type: 'p', text: 'OpenAI\'s GPT-3 (2020) was the first clear demonstration that a single pretrained model could perform dozens of tasks — translation, arithmetic, code, Q&A — from a few examples in the prompt, with no weight updates. The paper called this "in-context learning" and it is the foundation of the modern prompting era.' },
        { type: 'p', text: 'Meta\'s Llama models are open-weight foundation models: Meta pays for pretraining (Llama 3 405B reportedly cost >$500M), then releases the weights so anyone can fine-tune for specific domains. Thousands of derived models exist — CodeLlama, Llama-3-Vision, medical Llamas — each a small adaptation on top of the same foundation.' }
      ],
      advantages: [
        'One pretraining run powers thousands of downstream tasks.',
        'Downstream adaptation is cheap (prompting) to moderate (LoRA fine-tuning).',
        'Knowledge and representations transfer across tasks.',
        'Enables zero-shot and few-shot capabilities not possible with task-specific models.'
      ],
      disadvantages: [
        'Pretraining is astronomically expensive — only a few organizations can afford frontier-scale runs.',
        'Concentrates capability in the hands of whoever controls the foundation model.',
        'Foundation model inherits biases, errors, and knowledge cutoffs from pretraining data.',
        'Downstream behavior is harder to control than a purpose-built model.'
      ],
      commonMistakes: [
        'Treating "foundation model" as synonymous with "LLM" — the category is broader (vision, audio, bio).',
        'Assuming a foundation model is task-aligned out of the box — base models need instruction tuning or task-specific fine-tuning to be useful.',
        'Fine-tuning a foundation model when prompting would suffice (and vice versa).',
        'Ignoring the knowledge cutoff — a 2023-pretrained foundation model does not know 2024 events.'
      ],
      limitations: [
        'Foundation models are only as good as their pretraining data and scale.',
        'Adaptation cannot add fundamentally new capabilities absent from the base.',
        'Open-weight foundation models can be misused (deepfakes, automated abuse) since the provider loses control post-release.'
      ],
      relatedConcepts: ['Pretraining', 'Transfer Learning', 'Instruction Tuning', 'Fine-Tuning', 'In-Context Learning'],
      faq: [
        { q: 'Is BERT a foundation model?', a: 'Yes — BERT (2018) was an early foundation model: pretrained on masked-language modeling over Wikipedia + BookCorpus, then fine-tuned for classification, NER, and Q&A. The 2018 BERT paper is what made the foundation-model pattern explicit.' },
        { q: 'What is the difference between a foundation model and an LLM?', a: 'LLM is a subset. All LLMs are foundation models (in the modern sense), but not all foundation models are LLMs — CLIP, Whisper, ESM, AlphaFold are foundation models for non-text or multi-modal domains.' }
      ],
      summary:
        'A foundation model is pretrained once on broad data and adapted many times to downstream tasks. The pattern — expensive pretraining, cheap adaptation — replaced the old "train a new model per task" economics. LLMs are the most visible example, but the same pattern applies to vision, audio, and biology. Understanding foundation models means understanding why one big pretraining run can power an entire product line.'
    },

    // ------------------------------------------------------------------
    // 4. TOKENIZATION
    // ------------------------------------------------------------------
    {
      id: 'tokenization',
      title: 'Tokenization',
      subtitle: 'How text becomes numbers: BPE, WordPiece, SentencePiece, and why tokenizers are weird.',
      tags: ['tokenization', 'bpe', 'fundamentals'],
      readingMinutes: 8,
      definition:
        'Tokenization is the process of converting a string of text into a sequence of tokens — chunks that may be words, subwords, or characters — each mapped to an integer ID. Modern LLMs use subword tokenizers (BPE, WordPiece, Unigram) trained on a corpus to balance vocabulary size against sequence length.',
      whyItExists:
        'Neural networks operate on numbers, not characters. We need a deterministic mapping from text to integers. Naive options fail: character-level tokenization makes sequences too long (every English word = 5+ tokens) and ignores morphology; word-level tokenization produces huge vocabularies and cannot handle unseen words, typos, or agglutinative languages. Subword tokenization is the compromise: common words stay whole, rare words split into meaningful pieces, and any text can be tokenized without an <UNK> token.',
      howItWorks: [
        { type: 'h3', text: 'Byte-Pair Encoding (BPE)' },
        {
          type: 'p',
          text: 'BPE starts with a vocabulary of all single characters (or bytes). It then iteratively merges the most frequent adjacent pair into a new token: "t"+"h" → "th", "th"+"e" → "the", and so on, until the vocabulary reaches a target size (typically 32K–256K). At inference, the tokenizer greedily applies the learned merges left-to-right. "Unbelievable" might tokenize as ["un", "believ", "able"] if those subwords are in the vocabulary.'
        },
        { type: 'h3', text: 'WordPiece and Unigram' },
        {
          type: 'p',
          text: 'WordPiece (used by BERT) is similar to BPE but selects merges that maximize the likelihood of the training corpus under a language model. Unigram (used by SentencePiece) works in reverse: start with a large vocabulary and prune tokens whose removal least decreases likelihood. The choice matters less than people think — all three produce comparable subword vocabularies on similar data.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Tokenizing with tiktoken (the tokenizer used by GPT-4 / GPT-3.5)',
          code: `import tiktoken

# Load the cl100k_base encoding used by GPT-4 and GPT-3.5
enc = tiktoken.get_encoding("cl100k_base")

text = "Tokenization is surprisingly weird."
tokens = enc.encode(text)
print(tokens)
# -> [44375, 1295, 374, 29346, 9273, 13]

# Decode back to text (lossless)
print(enc.decode(tokens))
# -> "Tokenization is surprisingly weird."

# Inspect individual tokens as byte strings
for t in tokens:
    print(f"{t:6d}  ->  {enc.decode_single_token_bytes(t)!r}")
# 44375  ->  b'Token'
#  1295  ->  b'ization'
#   374  ->  b' is'
# 29346  ->  b' surprisingly'
#  9273  ->  b' weird'
#    13  ->  b'.'

# Token count depends on language and casing
print(len(enc.encode("Hello")))          # 1
print(len(enc.encode("hello")))          # 1
print(len(enc.encode("HELLO")))          # 1
print(len(enc.encode("helloworld")))     # 1 (rare merge!)
print(len(enc.encode("привет")))         # 4 (Cyrillic is expensive)
print(len(enc.encode("你好")))           # 2-3 per char (CJK is expensive)`
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Tokenizers cause real bugs',
          text: 'A leading space changes tokenization: "Hello" is one token, " Hello" (with leading space) is a different token. Many models are sensitive to this. Numbers tokenize unpredictably — "1234" might be one token, "12345" three. These quirks affect everything from prompt engineering (where you put the space matters) to security (string-matching filters can be bypassed by token-boundary tricks).'
        },
        {
          type: 'table',
          headers: ['Tokenizer', 'Used by', 'Vocab size', 'Notes'],
          rows: [
            ['BPE (tiktoken)', 'GPT-3.5, GPT-4', '~100K', 'Byte-level BPE; greedy merges'],
            ['SentencePiece BPE', 'Llama, Mistral, T5', '32K–128K', 'Treats input as raw Unicode stream'],
            ['WordPiece', 'BERT, DistilBERT', '~30K', 'Maximizes corpus likelihood'],
            ['Unigram LM', 'T5, ALBERT', '32K', 'Prunes from large vocab; samples multiple segmentations']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'Why " strawberry" has 3 tokens in many tokenizers but "strawberry" without a leading space may have 1: the tokenizer learned merges that depend on the preceding space. This is the root cause of the famous "how many r\'s in strawberry" failures of early 2024 LLMs — the model sees token IDs, not characters, and certain tokens blend letters in ways the model cannot easily count.' },
        { type: 'p', text: 'Code is expensive to tokenize. Python "    def f(x):" (4 spaces, def, space, f, (, x, ), :) is ~8 tokens. Indentation in particular eats tokens. Some models (CodeLlama, StarCoder) use tokenizers trained on more code so common code patterns merge into single tokens, reducing sequence length.' }
      ],
      advantages: [
        'Open-vocabulary: any Unicode string can be tokenized (no <UNK>).',
        'Balances sequence length (longer than word-level, shorter than char-level) and vocab size.',
        'Subwords capture morphology: "un"+"believ"+"able" generalizes to "un"+"think"+"able".',
        'Deterministic and reversible — decode(encode(text)) == text.'
      ],
      disadvantages: [
        'Tokenization is language-biased: English is cheap, non-Latin scripts cost 2–5× more tokens per character.',
        'Token boundaries affect model behavior — a leading space, capitalization, or digit count can change outputs.',
        'Tokenizers must be trained and frozen before the LLM; changing the tokenizer means retraining from scratch.',
        'Character-level tasks (counting letters, reversing strings) are surprisingly hard because the model never sees characters.'
      ],
      commonMistakes: [
        'Estimating token count by word count — they differ by 20–40% depending on language and tokenizer.',
        'Forgetting that API billing is per token, not per character or per word — non-English text costs much more.',
        'Modifying the tokenizer after pretraining — this destroys the embedding alignment.',
        'Assuming the tokenizer is symmetric across languages; an English prompt and its French translation rarely have the same token count.'
      ],
      limitations: [
        'Tokenizer design is a compromise — no single tokenizer is optimal for all languages and code.',
        'Cannot represent truly out-of-vocabulary concepts beyond byte-level fallback.',
        'Token-level reasoning (letter counting, character manipulation) requires the model to "decode" tokens, which it does imperfectly.'
      ],
      relatedConcepts: ['Tokens and IDs', 'Embeddings', 'SentencePiece', 'BPE', 'Context Windows'],
      faq: [
        { q: 'Why not just use characters as tokens?', a: 'Sequence length explodes — "Hello world" is 11 char-tokens instead of 2 word-tokens. The Transformer\'s compute scales quadratically with sequence length (without optimizations), so 5× longer sequences cost 25× more. Subwords are the practical compromise.' },
        { q: 'Why are tokenizer quirks like " strawberry" important?', a: 'Because the model never sees characters — it sees token IDs. A single token containing multiple letters cannot be inspected letter-by-letter by the model. This is why LLMs fail at simple character-level tasks that humans find trivial.' }
      ],
      summary:
        'Tokenization converts text to integer IDs via a learned subword vocabulary (BPE, WordPiece, or Unigram). It balances sequence length against vocabulary size and handles any text without <UNK>. Its quirks — leading spaces, language bias, character-blindness — propagate into real model behaviors. Treat the tokenizer as a first-class component of any LLM system, not an afterthought.'
    },

    // ------------------------------------------------------------------
    // 5. TOKENS AND IDS
    // ------------------------------------------------------------------
    {
      id: 'tokens-ids',
      title: 'Tokens and Token IDs',
      subtitle: 'From text to integers: the lookup table that turns tokens into vectors.',
      tags: ['tokenization', 'embeddings', 'fundamentals'],
      readingMinutes: 5,
      definition:
        'After a tokenizer splits text into tokens, each token is mapped to a unique integer ID via a fixed vocabulary table. These IDs are the actual input to the LLM; an embedding lookup converts each ID into a dense vector that begins the forward pass. Every model has a frozen vocabulary of typically 32K–256K tokens, learned before pretraining and never changed.',
      whyItExists:
        'Neural networks need continuous vector inputs, but tokens are discrete symbols. The two-step bridge is: (1) map each token to an integer ID using the vocabulary table, (2) use the ID as a row index into a learnable embedding matrix of shape [vocab_size, d_model]. This decouples the discrete vocabulary from the continuous math of the Transformer, and lets the model learn a meaningful vector for every token through gradient descent.',
      howItWorks: [
        {
          type: 'p',
          text: 'Consider the vocabulary as a dictionary V mapping strings to integers. For GPT-4\'s cl100k_base tokenizer, V has ~100K entries: "the" → 1820, " cat" → 3797, " sat" → 5292, and so on. To process "the cat sat", the tokenizer returns [1820, 3797, 5292]. These IDs are then used to index the embedding matrix E of shape [100000, 4096], producing a [3, 4096] tensor of dense vectors that flows into the first Transformer block.'
        },
        { type: 'h3', text: 'Special tokens' },
        {
          type: 'p',
          text: 'Vocabularies reserve slots for special tokens that never appear in natural text: <BOS> (beginning of sequence), <EOS> (end, signals "stop generating"), <PAD> (for batching variable-length sequences), and chat-template tokens like <|im_start|> and <|im_end|> used by instruction-tuned models to delimit user/assistant turns. Getting these wrong — e.g. omitting <EOS> so the model never stops, or using the wrong chat template — is a common production bug.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Tokens → IDs → embeddings in PyTorch',
          code: `import torch
import torch.nn as nn

vocab_size = 100_352       # GPT-4-ish
d_model = 4096

# The embedding matrix: learned during pretraining.
# Row i is the learned vector for token ID i.
embedding = nn.Embedding(vocab_size, d_model)

# Suppose the tokenizer produced these IDs for "The cat sat"
token_ids = torch.tensor([[464, 3797, 5292]])   # shape [1, 3]

# Lookup: gather the corresponding rows
token_embeddings = embedding(token_ids)         # shape [1, 3, 4096]
print(token_embeddings.shape)                   # torch.Size([1, 3, 4096])

# These vectors then have positional encodings added and flow
# into the first Transformer block. The embedding matrix is the
# ONLY part of the model that "knows" what each token means;
# everything downstream operates on positions in R^d_model.`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Weight tying',
          text: 'Most LLMs use the same matrix for input embeddings and the output projection (the layer that converts the final hidden state back to vocab probabilities). This "weight tying" saves ~vocab_size × d_model parameters and empirically helps. GPT-2 made it standard; modern Llama models untie them for a small quality gain.'
        },
        {
          type: 'table',
          headers: ['Stage', 'Data shape', 'What it represents'],
          rows: [
            ['Raw text', 'string', '"The cat sat"'],
            ['After tokenizer', 'list[string]', '["The", " cat", " sat"]'],
            ['After vocab lookup', 'tensor[int] of shape [seq_len]', '[464, 3797, 5292]'],
            ['After embedding lookup', 'tensor[float] of shape [seq_len, d_model]', '[3, 4096] dense vectors'],
            ['After first Transformer block', 'tensor[float] of shape [seq_len, d_model]', 'context-aware vectors']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'Token IDs are stable: the ID for " cat" is fixed for the lifetime of a model. This means you can pre-tokenize a corpus once and reuse it across many training runs. It also means a token ID is meaningless across models — ID 3797 is " cat" in GPT-4 but might be a completely different token in Llama 3. Never hard-code token IDs; always look them up via the tokenizer at runtime.' },
        { type: 'p', text: 'When an LLM finishes generating, it emits an <EOS> token ID (e.g. 50256 in GPT-2, 128001 in Llama 3). The inference loop checks each sampled ID against the EOS ID and stops. If your tokenizer\'s EOS ID is misconfigured, the model runs until it hits the context window, generating reams of irrelevant text and burning compute.' }
      ],
      advantages: [
        'Integer IDs are compact, efficient to store, and trivial to batch.',
        'Embedding lookup is a single indexed gather — extremely fast on GPU.',
        'Vocabulary is frozen, enabling pre-tokenization and caching.',
        'IDs decouple discrete tokens from continuous network math.'
      ],
      disadvantages: [
        'Vocabulary is fixed at pretraining — adding a new token (e.g. a new emoji) requires either retraining or careful embedding initialization.',
        'IDs are model-specific — no portability across models.',
        'Large vocabularies (100K+) make the output projection (logits layer) memory-heavy.'
      ],
      commonMistakes: [
        'Reusing token IDs across models — they are arbitrary per tokenizer.',
        'Forgetting special tokens — omitting <BOS> or using the wrong chat template degrades quality silently.',
        'Hardcoding EOS or PAD IDs in code instead of looking them up via tokenizer.eos_token_id.',
        'Tokenizing once and assuming the IDs stay valid after a tokenizer version bump.'
      ],
      limitations: [
        'Cannot represent tokens outside the vocabulary at the subword level (byte-level fallback handles it but at the cost of longer sequences).',
        'Adding task-specific tokens (e.g. <RETRIEVED_DOC>) requires resizing the embedding matrix and training the new rows.'
      ],
      relatedConcepts: ['Tokenization', 'Embeddings', 'Positional Encodings', 'Special Tokens', 'Chat Templates'],
      faq: [
        { q: 'Why are special tokens needed at all?', a: 'They give the model deterministic signals for structural events — sequence boundaries, role changes in chat, padding for batching. Without them the model has to infer structure from content, which is unreliable.' },
        { q: 'Can I add new tokens to a trained model?', a: 'Yes — resize the embedding matrix, initialize new rows (e.g. mean of existing embeddings), and fine-tune so the new tokens get useful gradients. This is how domain-specific tokens or new control tokens are added.' }
      ],
      summary:
        'Tokens are mapped to integer IDs via a fixed vocabulary, then to dense vectors via an embedding lookup. The vocabulary is frozen at pretraining; special tokens handle structural events like sequence boundaries and chat turns. Token IDs are model-specific and must be looked up, never hardcoded. The embedding matrix is the model\'s only link between discrete symbols and continuous math.'
    },

    // ------------------------------------------------------------------
    // 6. EMBEDDINGS
    // ------------------------------------------------------------------
    {
      id: 'embeddings',
      title: 'Embeddings',
      subtitle: 'Dense vectors where semantic similarity becomes geometric proximity.',
      tags: ['embeddings', 'vector-spaces', 'fundamentals'],
      readingMinutes: 7,
      definition:
        'An embedding is a learned dense vector representation of a discrete entity (a token, a word, a sentence, an image, a user). Embeddings map entities into a continuous vector space where geometric relationships — distance, direction — encode semantic relationships. The token embeddings inside an LLM are the input vectors the Transformer operates on; separate embedding models (e.g. text-embedding-3, BGE, E5) are trained to produce sentence-level vectors for retrieval.',
      whyItExists:
        'Neural networks need continuous inputs, but language is discrete. One-hot encodings (a 100K-dim vector with a single 1) are sparse, huge, and tell the model nothing about meaning — "cat" and "dog" are as different as "cat" and "democracy". Embeddings solve this by learning a compact (typically 768–12288-dim) vector per token, where similar meanings end up near each other in the space. This is the foundation of all neural NLP — without it, Transformers have nothing useful to compute on.',
      howItWorks: [
        {
          type: 'p',
          text: 'Inside an LLM, the embedding matrix E has shape [vocab_size, d_model] — e.g. [100352, 4096] for a GPT-4-sized model. Each row is the learned vector for one token. When the model sees token ID 3797 (" cat"), it looks up row 3797 — a 4096-dim vector — and that vector flows into the first Transformer block. Crucially, these vectors are learned during pretraining; the model starts with random vectors and gradient descent moves semantically related tokens to nearby regions.'
        },
        { type: 'h3', text: 'Why embeddings capture meaning' },
        {
          type: 'p',
          text: 'The pretraining objective — predict the next token — forces embeddings to encode meaning: tokens that appear in similar contexts (cat, dog, pet) get pushed to nearby vectors, because the model needs them to be substitutable. This is the distributional hypothesis in vector form: "you shall know a word by the company it keeps" (Firth, 1957). The geometry of the resulting space has surprising structure — the classic "king - man + woman ≈ queen" relationship holds approximately because gender is a learnable direction.'
        },
        { type: 'h3', text: 'Token embeddings vs sentence embeddings' },
        {
          type: 'p',
          text: 'The LLM\'s token embeddings are contextualized by the Transformer: by the final layer, the vector for "bank" in "river bank" differs from "bank" in "savings bank". These contextualized vectors are what the model uses internally. For retrieval (RAG), we use a separate embedding model that produces one vector per sentence or document — typically by mean-pooling the final layer or using a [CLS] token. Sentence embeddings are not the same as token embeddings; they are trained with a contrastive objective (similar texts close, dissimilar far).'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Using a sentence embedding model for semantic search',
          code: `from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("BAAI/bge-small-en-v1.5")  # 384-dim embeddings

docs = [
    "The cat sat on the mat.",
    "A feline rested on the rug.",
    "Interest rates rose by 0.5%.",
    "The Federal Reserve hiked rates.",
]
embeddings = model.encode(docs, normalize_embeddings=True)  # [4, 384]

query = model.encode(["Where did the cat sleep?"], normalize_embeddings=True)
# Cosine similarity = dot product (since normalized)
scores = embeddings @ query.T   # [4, 1]
for doc, score in zip(docs, scores.flatten()):
    print(f"{score:.3f}  {doc}")
# 0.81  The cat sat on the mat.
# 0.74  A feline rested on the rug.
# 0.22  Interest rates rose by 0.5%.
# 0.19  The Federal Reserve hiked rates.`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why normalization matters',
          text: 'Cosine similarity = dot product only when vectors are unit-norm. Most production embedding APIs return normalized vectors so you can use a fast dot product instead of computing norms every query. If you skip normalization, longer texts can get spuriously high dot-product scores just by having larger vectors.'
        }
      ],
      examples: [
        { type: 'p', text: 'In a well-trained embedding space, "dog" and "puppy" are close, "dog" and "wolf" are moderately close, "dog" and "democracy" are far. This geometry is what makes semantic search work: a query "feline pet" retrieves documents about cats even if the word "feline" never appears, because the query vector is close to the cat-document vectors.' },
        { type: 'p', text: 'Token embeddings inside an LLM are not the same as standalone word embeddings (word2vec, GloVe). The LLM\'s token embeddings are the input to a Transformer that contextualizes them — by layer 32, the vector for "bank" carries the entire sentence\'s meaning. Standalone embeddings are static: "bank" has the same vector regardless of context.' }
      ],
      advantages: [
        'Compact, fixed-size representation — easy to store and index.',
        'Semantic similarity becomes a cheap dot product.',
        'Learnable end-to-end with the rest of the model.',
        'Transfer across tasks — the same embeddings power search, clustering, classification.'
      ],
      disadvantages: [
        'Quality depends entirely on training data and objective — biased data produces biased embeddings.',
        'Dimensionality is a tradeoff: too small loses information, too large wastes memory and slows search.',
        'Static embeddings (word2vec) miss context; contextual ones (LLM hidden states) are expensive to compute.',
        'Embedding spaces have "anisotropy" — vectors cluster in a narrow cone, hurting retrieval. Normalization and contrastive training mitigate this.'
      ],
      commonMistakes: [
        'Comparing token embeddings across different layers — early layers are lexical, late layers are contextual. Pick one layer consistently.',
        'Using cosine similarity on unnormalized vectors — results are dominated by vector magnitude, not direction.',
        'Treating embedding distance as a hard semantic judgment — "0.85 similarity" is model-specific, not a universal score.',
        'Mixing embedding models — BGE vectors cannot be compared to OpenAI vectors even if both are 1536-dim.'
      ],
      limitations: [
        'Embeddings capture statistical co-occurrence, not truth — false statements can have normal-looking embeddings.',
        'Out-of-distribution terms (new jargon, rare names) get poor embeddings until the model is retrained or fine-tuned.',
        'Cross-lingual embedding alignment is imperfect; semantic search across languages requires specially trained models.'
      ],
      relatedConcepts: ['Tokenization', 'Positional Encodings', 'Vector Databases', 'RAG', 'Contrastive Learning'],
      faq: [
        { q: 'What dimensionality should my embeddings be?', a: 'For retrieval, 384–768 dims is enough for most use cases; 1536+ helps marginally but costs more storage and search time. The lift from larger embeddings is much smaller than the lift from a better-trained model.' },
        { q: 'Can I use LLM hidden states as embeddings?', a: 'Yes, but they underperform dedicated embedding models on retrieval benchmarks unless you fine-tune them. Use a model trained with contrastive loss (BGE, E5, GTE) for retrieval; LLM hidden states are tuned for next-token prediction, not similarity.' }
      ],
      summary:
        'Embeddings map discrete tokens (or sentences, images, users) into dense vectors where geometric proximity encodes semantic similarity. The LLM\'s token embeddings are its input; separate sentence embedding models power RAG retrieval. Embeddings are the bridge between discrete symbols and continuous neural math. Their geometry — what ends up close to what — is learned from data and reveals the model\'s implicit semantics.'
    },

    // ------------------------------------------------------------------
    // 7. POSITIONAL ENCODINGS
    // ------------------------------------------------------------------
    {
      id: 'positional-encodings',
      title: 'Positional Encodings',
      subtitle: 'Why Transformers need position info — sinusoidal, learned, ALiBi, and RoPE.',
      tags: ['positional-encoding', 'rope', 'transformer', 'intermediate'],
      readingMinutes: 8,
      definition:
        'Positional encodings are vectors added to token embeddings that tell the Transformer where each token sits in the sequence. They are necessary because self-attention is permutation-invariant — without positional information, the model cannot distinguish "dog bites man" from "man bites dog". Modern LLMs use RoPE (Rotary Position Embedding) almost universally; older models used sinusoidal or learned absolute encodings.',
      whyItExists:
        'The Transformer\'s self-attention computes attention weights as a function of (query, key) dot products. The dot product Q·K is permutation-invariant: if you shuffle the input tokens, the attention weights shuffle identically, and the model has no way to know which token was first. RNNs and CNNs got position for free from their sequential/convolutional structure; Transformers need it injected explicitly. Positional encodings are the workaround.',
      howItWorks: [
        { type: 'h3', text: 'Sinusoidal encodings (Vaswani et al., 2017)' },
        {
          type: 'p',
          text: 'The original Transformer added a fixed vector to each token embedding, computed from sine and cosine of different frequencies: PE(pos, 2i) = sin(pos / 10000^(2i/d)), PE(pos, 2i+1) = cos(pos / 10000^(2i/d)). The intuition: each dimension is a wave at a different frequency, so every position gets a unique combination. These are fixed (not learned) and let the model extrapolate to longer sequences in principle.'
        },
        { type: 'h3', text: 'Learned absolute encodings (GPT-2, BERT)' },
        {
          type: 'p',
          text: 'GPT-2 and BERT instead learned a separate positional embedding per position (an embedding matrix of shape [max_seq_len, d_model]). Simpler than sinusoidal but cannot extrapolate beyond max_seq_len — the model has no embedding for positions it never saw during training. This is why GPT-2 had a hard 1024-token limit.'
        },
        { type: 'h3', text: 'RoPE — Rotary Position Embedding (modern default)' },
        {
          type: 'p',
          text: 'RoPE rotates the query and key vectors in 2D subspaces by an angle proportional to position. The crucial property: the dot product Q_m · K_n depends only on the relative position (m - n), not the absolute positions. This means attention naturally encodes "how far apart are these tokens" rather than "where is each token". RoPE enables length extrapolation (with interpolation tricks like NTK-aware scaling) and is used by Llama 2/3, Mistral, Qwen, Gemma, and most modern LLMs.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'RoPE applied to queries and keys in PyTorch (simplified)',
          code: `import torch
import torch.nn as nn

class RotaryEmbedding(nn.Module):
    def __init__(self, dim, base=10000):
        super().__init__()
        # Inverse frequencies: one per pair of dimensions
        inv_freq = 1.0 / (base ** (torch.arange(0, dim, 2).float() / dim))
        self.register_buffer("inv_freq", inv_freq)

    def forward(self, seq_len, device):
        t = torch.arange(seq_len, device=device).float()
        freqs = torch.einsum("i,j->ij", t, self.inv_freq)   # [seq, dim/2]
        # cos/sin are repeated to match the dim of Q and K
        cos = freqs.cos().repeat_interleave(2, dim=-1)       # [seq, dim]
        sin = freqs.sin().repeat_interleave(2, dim=-1)
        return cos, sin

def apply_rope(x, cos, sin):
    # x: [batch, heads, seq, dim]
    # Rotate each pair (x_{2i}, x_{2i+1}) by angle theta_i
    x1 = x[..., 0::2]   # even indices
    x2 = x[..., 1::2]   # odd indices
    # Rotation: [x1*cos - x2*sin, x1*sin + x2*cos]
    rot = torch.stack([x1 * cos - x2 * sin,
                       x1 * sin + x2 * cos], dim=-1).flatten(-2)
    return rot

# After computing Q and K from the input, apply RoPE BEFORE the
# attention dot product. The relative-position property emerges
# because rotating Q_m and K_n by (m*theta) and (n*theta) makes
# Q_m . K_n depend only on (m - n) * theta.`
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Why RoPE won',
          text: 'RoPE encodes relative position (good for language where "X before Y" matters more than absolute indices), extrapolates better than learned encodings (you can scale theta to extend context), and has clean math (rotations preserve vector norms, so attention scores stay stable). Once Llama 2 adopted RoPE in 2023, it became the de facto standard.'
        },
        { type: 'h3', text: 'ALiBi — an alternative' },
        {
          type: 'p',
          text: 'ALiBi (Attention with Linear Biases) adds a fixed penalty to attention scores based on distance: tokens far apart get a fixed negative bias. No positional embeddings at all — just a slope per attention head. ALiBi extrapolates extremely well to longer sequences than seen in training, but it slightly underperforms RoPE on quality and is now used less commonly (BLOOM, MPT).'
        },
        {
          type: 'table',
          headers: ['Method', 'Used by', 'Type', 'Length extrapolation'],
          rows: [
            ['Sinusoidal', 'Original Transformer (2017)', 'Absolute, fixed', 'Theoretical; weak in practice'],
            ['Learned absolute', 'GPT-2, BERT', 'Absolute, learned', 'None (hard max_len)'],
            ['ALiBi', 'BLOOM, MPT', 'Relative, fixed bias', 'Excellent'],
            ['RoPE', 'Llama 2/3, Mistral, Qwen, Gemma', 'Relative, rotary', 'Good with NTK/YaRN scaling']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'Without positional encoding, the Transformer sees "dog bites man" and "man bites dog" as identical bags of tokens (self-attention is permutation-invariant). With RoPE, the relative positions are encoded into Q·K, so the model can distinguish the two orderings. This is why positional encoding is non-optional — every Transformer variant has some form of it.' },
        { type: 'p', text: 'Llama 3 was pretrained with 8K context using RoPE. To extend to 32K and beyond, Meta scaled RoPE\'s base frequency (from 10000 to 500000) and applied NTK-aware interpolation — essentially rescaling the rotation angles so positions up to 128K map onto the range the model already understands. This is "length extrapolation via RoPE scaling", and it is how every modern context-extension works.' }
      ],
      advantages: [
        'Required to break the permutation invariance of self-attention.',
        'RoPE encodes relative position, which matches linguistic intuition.',
        'RoPE enables length extrapolation via frequency scaling.',
        'Cheap to compute — small overhead in the forward pass.'
      ],
      disadvantages: [
        'Absolute encodings (sinusoidal, learned) extrapolate poorly past the training length.',
        'RoPE scaling for long context requires careful tuning (NTK, YaRN); naive interpolation degrades quality.',
        'Positional encoding choice is baked in at pretraining — changing it requires retraining.',
        'Some research suggests very long contexts still "fade" — the model attends less to far-away tokens regardless of encoding.'
      ],
      commonMistakes: [
        'Applying positional encodings after the first attention layer — they belong at the input, baked into Q and K from the start.',
        'Forgetting to apply RoPE to keys as well as queries (both must be rotated).',
        'Trying to extend context length by simply increasing max_seq_len without RoPE scaling — the model sees positions it has no representation for.',
        'Using learned absolute encodings for a model intended to handle long contexts.'
      ],
      limitations: [
        'Even with RoPE scaling, attention quality degrades at distances much larger than pretraining saw ("lost in the middle" effect).',
        'Positional encodings do not encode hierarchical structure (paragraph, document) directly — the model must learn it.'
      ],
      relatedConcepts: ['Self-Attention', 'Transformer Architecture', 'RoPE', 'ALiBi', 'Context Windows'],
      faq: [
        { q: 'Why not just add position as a feature?', a: 'You can (learned absolute encodings do this), but it does not generalize to longer sequences and ignores that language cares about relative order ("X before Y") more than absolute indices. Relative encodings like RoPE match the structure of language better.' },
        { q: 'How does Llama 3.1 support 128K context if pretrained on 8K?', a: 'RoPE scaling: rescale the rotation frequencies so positions 0–128K map onto the angle range the model learned at pretraining. Combined with continued pretraining on long sequences, this extends context 16× without retraining from scratch.' }
      ],
      summary:
        'Positional encodings inject sequence-position information into the otherwise permutation-invariant Transformer. Sinusoidal and learned absolute encodings were early solutions; RoPE is the modern default because it encodes relative position and enables length extrapolation. ALiBi is an alternative. Without positional encoding, the model literally cannot tell word order; with it, attention can reason about syntax, structure, and long-range dependencies.'
    },

    // ------------------------------------------------------------------
    // 8. TRANSFORMER ARCHITECTURE
    // ------------------------------------------------------------------
    {
      id: 'transformer-architecture',
      title: 'Transformer Architecture',
      subtitle: 'The high-level picture: embeddings, N stacked blocks, and an output head.',
      tags: ['transformer', 'architecture', 'core'],
      readingMinutes: 9,
      definition:
        'The Transformer is a neural architecture built entirely on attention — no recurrence, no convolution. An LLM is a "decoder-only" Transformer: tokens are embedded, passed through N stacked transformer blocks (each containing self-attention and a feed-forward network with residuals and layer norms), and a final linear layer projects the last hidden state to vocabulary logits for next-token prediction.',
      whyItExists:
        'Before Transformers, sequence models were RNNs (LSTMs, GRUs) that processed tokens one at a time, carrying hidden state forward. This made training sequential (no parallelism across positions) and limited long-range dependencies (gradients vanish over many steps). The 2017 paper "Attention Is All You Need" replaced recurrence with self-attention: every token attends to every other token in parallel, gradient paths are length-1, and GPUs can parallelize across the entire sequence. This is why Transformers scaled where RNNs could not.',
      howItWorks: [
        {
          type: 'p',
          text: 'A decoder-only LLM processes a sequence of T tokens through five stages: (1) Tokenize and look up embeddings — input shape becomes [T, d_model]. (2) Add positional encodings. (3) Pass through N transformer blocks (N=32 for a 7B model, 80 for 70B, 120+ for frontier models). (4) Apply a final layer norm. (5) Project to vocabulary logits via a linear layer of shape [d_model, vocab_size]. Softmax over the last position\'s logits gives the next-token distribution.'
        },
        { type: 'h3', text: 'Encoder vs Decoder vs Decoder-only' },
        {
          type: 'p',
          text: 'The original 2017 Transformer had an encoder (bidirectional attention) and a decoder (causal attention + cross-attention to the encoder). BERT uses only the encoder — good for understanding tasks (classification, NER). T5 uses both (encoder-decoder) — good for sequence-to-sequence tasks (translation). GPT and all modern LLMs (Llama, Mistral, Claude, Gemini) use decoder-only — causal self-attention, no encoder. Decoder-only won because (a) one architecture handles all tasks, (b) it scales better, (c) it is simpler to implement and inference.'
        },
        {
          type: 'interactive',
          componentId: 'llm-architecture-explorer',
          caption: 'Interactive: explore a decoder-only Transformer — toggle layers, see data shapes flow through embeddings, attention, FFN, and the output head.'
        },
        {
          type: 'table',
          headers: ['Hyperparameter', 'Llama 3 8B', 'Llama 3 70B', 'Llama 3 405B', 'GPT-3 175B'],
          rows: [
            ['Layers (N)', '32', '80', '126', '96'],
            ['d_model', '4096', '8192', '16384', '12288'],
            ['Attention heads', '32', '64', '128', '96'],
            ['KV heads (GQA)', '8', '8', '8', '96 (MHA)'],
            ['d_head', '128', '128', '128', '128'],
            ['d_ff (FFN hidden)', '14336', '28672', '53248', '49152'],
            ['Vocab size', '128256', '128256', '128256', '50257'],
            ['Context window', '8192', '8192', '8192', '2048']
          ]
        },
        { type: 'h3', text: 'Where the parameters live' },
        {
          type: 'p',
          text: 'In a typical decoder-only model, the four embedding/projection matrices of each attention block (Wq, Wk, Wv, Wo) contribute ~4·d_model² parameters; the FFN (with SwiGLU) contributes ~3·d_model·d_ff. For Llama 3 70B: per layer, attention = 4·8192² ≈ 268M, FFN = 3·8192·28672 ≈ 704M, total ~1B per layer × 80 layers = 80B. The embedding matrix adds 128256·8192 ≈ 1B more. Parameter counts are dominated by the FFN, not attention.'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Decoder-only = universal',
          text: 'A decoder-only model can do classification (prompt + "Sentiment:"), translation (prompt + source + "Translation:"), summarization (prompt + text + "Summary:"), and of course chat. One architecture, every task — that is the entire reason the field converged on decoder-only Transformers.'
        }
      ],
      examples: [
        { type: 'p', text: 'Trace a forward pass through Llama 3 8B on "Hello": Tokenizer returns [15496]. Embedding lookup gives a [1, 4096] vector. Add RoPE position 0. Pass through 32 blocks, each producing a new [1, 4096] vector. Final layer norm. Project to [1, 128256] logits. Softmax over the last position. Sample — likely "!" or " world" depending on temperature. The whole forward pass for one token takes ~10ms on an A100.' },
        { type: 'p', text: 'Mixture-of-Experts (MoE) architectures (GPT-4, Mixtral, DeepSeek-MoE) replace the dense FFN with N "expert" FFNs and a learned router that picks 2 experts per token. This multiplies parameter count without multiplying per-token compute, so a 8x22B MoE has 141B parameters but only runs ~39B per token. MoE is the main architectural innovation beyond vanilla decoder-only Transformers.' }
      ],
      advantages: [
        'Parallelizes across sequence positions — GPUs love it.',
        'Gradient paths of length 1 — no vanishing gradients across long contexts.',
        'Single architecture handles understanding and generation.',
        'Scales smoothly with parameters, data, and compute (scaling laws).'
      ],
      disadvantages: [
        'Self-attention is O(T²) in sequence length (mitigated by FlashAttention, sparse attention).',
        'Memory-hungry: KV cache grows linearly with context.',
        'No implicit recurrence — the model has no "state" between forward passes; each token sees only the context window.',
        'Many hyperparameters (N, d_model, n_heads, d_ff) that interact non-trivially.'
      ],
      commonMistakes: [
        'Confusing encoder (BERT) with decoder-only (GPT/Llama) — they use attention differently and serve different purposes.',
        'Assuming attention is the bottleneck — the FFN usually uses more FLOPs than attention at typical context lengths.',
        'Forgetting that "Transformer" is a family — every modern LLM is a Transformer, but with different choices (RoPE vs ALiBi, GQA vs MHA, SwiGLU vs GeGLU).',
        'Estimating parameter count by multiplying layer count × d_model² — the FFN contributes comparably and is often the largest component.'
      ],
      limitations: [
        'O(T²) attention limits context length without algorithmic improvements (sparse, linear, Mamba alternatives).',
        'Transformer scaling laws are empirical — we do not have a principled theory of why they work.',
        'Alternative architectures (Mamba, RWKV, Hyena) compete on long-context efficiency but have not displaced Transformers at frontier scale.'
      ],
      relatedConcepts: ['Self-Attention', 'Multi-Head Attention', 'Feed-Forward Networks', 'Positional Encodings', 'Mixture of Experts'],
      faq: [
        { q: 'Why did decoder-only beat encoder-decoder?', a: 'Simplicity and scale. Encoder-decoder (T5) needs two stacks and a cross-attention; decoder-only needs one stack. Empirically, decoder-only matches or beats encoder-decoder on most tasks when scaled, and is easier to serve. The field voted with its GPUs.' },
        { q: 'Are Mamba and state-space models replacing Transformers?', a: 'Not yet at frontier scale. SSMs (Mamba, RWKV) have O(T) attention and excellent long-context efficiency, but Transformers still win on quality at the largest scales. Hybrid architectures (Jamba, Samba) combine both and may become common.' }
      ],
      summary:
        'A modern LLM is a decoder-only Transformer: embeddings + N stacked blocks (attention + FFN, with residuals and layer norms) + an output head. The architecture replaced RNNs because it parallelizes across positions and scales smoothly. Every architectural choice — RoPE, GQA, SwiGLU, MoE — is a refinement of this skeleton. Use the architecture explorer above to see data shapes flow through each component.'
    },

    // ------------------------------------------------------------------
    // 9. SELF-ATTENTION
    // ------------------------------------------------------------------
    {
      id: 'self-attention',
      title: 'Self-Attention',
      subtitle: 'The math that lets every token look at every other token — in one parallel step.',
      tags: ['attention', 'transformer', 'core', 'math'],
      readingMinutes: 8,
      definition:
        'Self-attention is the operation at the heart of the Transformer. For each token in a sequence, it computes a weighted average of all tokens\' value vectors, where the weights are determined by the similarity (dot product) of that token\'s query with every token\'s key. The output for each position is thus a context-dependent blend of the entire sequence — every token attends to every other, in parallel.',
      whyItExists:
        'Before attention, sequence models (RNNs) processed tokens left-to-right, with information about early tokens slowly "fading" as it passed through hidden states. A word in position 50 had no direct path to a word in position 5; the gradient had to traverse 45 steps. Self-attention gives every pair of positions a direct, length-1 path: the model can attend from any token to any other token in a single operation, making long-range dependencies trivially learnable. This is the key insight that made Transformers work.',
      howItWorks: [
        { type: 'h3', text: 'The attention equation' },
        {
          type: 'p',
          text: 'Given input X of shape [T, d_model], three learned linear projections produce Queries Q = X·Wq, Keys K = X·Wk, and Values V = X·Wv, each of shape [T, d_k]. Attention is then: softmax(Q·Kᵀ / √d_k) · V. The matrix Q·Kᵀ has shape [T, T] — entry (i, j) is the similarity between token i\'s query and token j\'s key. Scaling by √d_k keeps the variance stable (otherwise dot products grow with d_k and softmax saturates). Softmax over each row normalizes these into weights that sum to 1. Multiplying by V gives a weighted blend of value vectors.'
        },
        {
          type: 'interactive',
          componentId: 'attention-calculator',
          caption: 'Interactive: enter tokens and a query, see the Q·Kᵀ matrix and attention weights update live. Adjust d_k and temperature to see how the distribution sharpens or flattens.'
        },
        { type: 'h3', text: 'Causal masking' },
        {
          type: 'p',
          text: 'In a decoder-only LLM, token i must not attend to tokens j > i (it cannot peek at the future). This is enforced by adding -∞ to the upper triangle of Q·Kᵀ before softmax, so those entries become exactly 0 after softmax. The resulting attention matrix is lower-triangular. This "causal mask" is the only thing that makes a decoder different from a bidirectional encoder — same math, different mask.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Minimal single-head self-attention in PyTorch',
          code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class SelfAttention(nn.Module):
    def __init__(self, d_model, d_k):
        super().__init__()
        self.q = nn.Linear(d_model, d_k, bias=False)
        self.k = nn.Linear(d_model, d_k, bias=False)
        self.v = nn.Linear(d_model, d_k, bias=False)
        self.d_k = d_k

    def forward(self, x, mask=None):
        # x: [batch, seq, d_model]
        Q = self.q(x)   # [batch, seq, d_k]
        K = self.k(x)
        V = self.v(x)

        # Similarity scores: [batch, seq, seq]
        scores = Q @ K.transpose(-2, -1) / math.sqrt(self.d_k)

        if mask is not None:
            scores = scores.masked_fill(mask == 0, float("-inf"))

        # Row-wise softmax -> attention weights
        attn = F.softmax(scores, dim=-1)

        # Weighted blend of values
        out = attn @ V   # [batch, seq, d_k]
        return out, attn

# Causal mask: lower-triangular ones
T = 5
causal = torch.tril(torch.ones(T, T))
sa = SelfAttention(d_model=64, d_k=64)
x = torch.randn(1, T, 64)
out, attn = sa(x, mask=causal)
print(attn[0])   # Lower-triangular, rows sum to 1
`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why divide by √d_k?',
          text: 'If Q and K entries have unit variance, Q·Kᵀ entries have variance d_k. For d_k=128, dot products can reach ±11, which pushes softmax into a near-one-hot regime where gradients vanish. Dividing by √d_k restores unit variance so softmax stays in a useful range. This scaling is non-optional — without it, deep Transformers do not train.'
        },
        {
          type: 'table',
          headers: ['Step', 'Operation', 'Shape'],
          rows: [
            ['1', 'Project to Q, K, V', '[B, T, d_k] each'],
            ['2', 'Compute Q·Kᵀ / √d_k', '[B, T, T]'],
            ['3', 'Add -∞ above diagonal (causal mask)', '[B, T, T]'],
            ['4', 'Softmax over last dim', '[B, T, T] weights, rows sum to 1'],
            ['5', 'Multiply weights · V', '[B, T, d_k]']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'In "The cat sat on the mat because it was tired", the word "it" must resolve to "cat" (not "mat"). Self-attention lets the "it" token\'s query match the "cat" token\'s key strongly, so its output vector is mostly the cat\'s value vector plus small contributions from other tokens. This coreference resolution is learned automatically from next-token prediction — no rule, no supervised coreference data.' },
        { type: 'p', text: 'In code generation, when the model writes "def fibonacci(n):" and later returns to "n", attention lets the "n" in the return statement attend back to the "n" in the function signature to retrieve its meaning. Without long-range attention, function-level code would be impossible.' }
      ],
      advantages: [
        'Every token can directly attend to every other — no vanishing gradients over distance.',
        'Parallelizes across all positions (unlike RNNs).',
        'Learns long-range dependencies from data, no manual feature engineering.',
        'Interpretable: attention weights are inspectable (though not always faithful explanations).'
      ],
      disadvantages: [
        'O(T²) compute and memory in sequence length — quadratic scaling hurts long contexts.',
        'Attention weights are not always a faithful explanation of model behavior.',
        'Without causal masking, decoder-only models would cheat by looking ahead.',
        'Computationally dense — most of a Transformer\'s FLOPs at short context are in attention projections.'
      ],
      commonMistakes: [
        'Forgetting the √d_k scaling — training becomes unstable.',
        'Forgetting the causal mask in decoder-only models — the model trivially learns to copy future tokens, training loss looks great, model is useless.',
        'Interpreting attention weights as "what the model is thinking" — they are a learned routing, not a causal explanation.',
        'Assuming attention is the bottleneck at long context — FlashAttention and friends make it fast; the KV cache memory is the real bottleneck.'
      ],
      limitations: [
        'O(T²) scaling caps context length without sparse/linear attention variants.',
        'Attention "dilutes" over very long contexts — the model can lose information from the middle of long inputs ("lost in the middle").',
        'Cannot model hierarchical structure explicitly; only implicit via learned attention patterns.'
      ],
      relatedConcepts: ['Query, Key, Value', 'Multi-Head Attention', 'Causal Masking', 'FlashAttention', 'Transformer Architecture'],
      faq: [
        { q: 'Is attention the same as memory?', a: 'Loosely. Attention lets the model dynamically retrieve information from the context — analogous to content-addressable memory. But it is not persistent memory; once the context is dropped, the attention is gone. RAG and external memory systems add persistence.' },
        { q: 'Why is attention called "attention"?', a: 'The name comes from the analogy to human visual attention — focusing on some inputs more than others. The model "attends" to certain tokens when computing each output. It is a useful metaphor but should not be over-anthropomorphized.' }
      ],
      summary:
        'Self-attention computes, for each token, a weighted blend of all tokens\' value vectors, with weights from softmax(Q·Kᵀ / √d_k). Causal masking prevents looking ahead. This single operation gives Transformers their power: every pair of positions has a direct path. The O(T²) cost is the main weakness, mitigated by FlashAttention and sparse variants. Use the attention calculator above to build intuition.'
    },

    // ------------------------------------------------------------------
    // 10. QKV
    // ------------------------------------------------------------------
    {
      id: 'qkv',
      title: 'Query, Key, and Value',
      subtitle: 'The database analogy: queries search keys to retrieve values.',
      tags: ['attention', 'qkv', 'transformer', 'core'],
      readingMinutes: 6,
      definition:
        'Query (Q), Key (K), and Value (V) are three vector representations of each token, produced by three separate linear projections of the input. The query asks "what am I looking for?", the key advertises "what do I contain?", and the value is "what I contribute if selected". Attention weight = softmax(Q·Kᵀ) — a soft lookup — and the output is weights·V.',
      whyItExists:
        'Self-attention needs a flexible mechanism: a token must both (a) specify what it wants from other tokens and (b) offer what it has to give. A single representation cannot do both — that would force a token to be both the search query and the indexed document. Splitting into Q, K, V decouples these roles: the model learns separate projections so that a token\'s query can match a completely different token\'s key, enabling rich relational reasoning (subject-verb, pronoun-antecedent, definition-use).',
      howItWorks: [
        { type: 'h3', text: 'The database analogy' },
        {
          type: 'p',
          text: 'Think of a soft database lookup. In a real database, you write a query (e.g. "name = \'Alice\'"), the system compares it against the keys in each row, and returns the values of matching rows. Attention is the differentiable version: the query is a vector, the keys are vectors, and "matching" is a dot product followed by softmax. The softmax makes it a soft lookup — every row contributes a little, weighted by similarity, instead of returning exactly one row.'
        },
        { type: 'h3', text: 'Why three separate projections?' },
        {
          type: 'p',
          text: 'Each token\'s input vector x goes through three learned linear layers: Q = x·Wq, K = x·Wk, V = x·Wv. The three weight matrices are different, so a token can have a very different query from its key. A verb token like "chased" might have a query tuned to find its subject (so Q for "chased" matches K for "dog") while its key advertises itself as a verb (so K for "chased" matches Q from pronouns like "it"). This three-way separation is what makes attention expressive.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Q, K, V projections and the attention math, made explicit',
          code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

d_model = 512
d_k = 64

Wq = nn.Linear(d_model, d_k, bias=False)
Wk = nn.Linear(d_model, d_k, bias=False)
Wv = nn.Linear(d_model, d_k, bias=False)

x = torch.randn(1, 10, d_model)   # 10 tokens, 512-dim each

Q = Wq(x)   # [1, 10, 64]  -- "what each token wants"
K = Wk(x)   # [1, 10, 64]  -- "what each token offers"
V = Wv(x)   # [1, 10, 64]  -- "what each token contributes"

# Similarity: how well does each query match each key?
scores = Q @ K.transpose(-2, -1) / math.sqrt(d_k)   # [1, 10, 10]

# Softmax over keys -> weights that sum to 1 per query
weights = F.softmax(scores, dim=-1)

# Weighted sum of values -> context-aware output per token
out = weights @ V   # [1, 10, 64]

# The output for token i is a blend of all V vectors, weighted by
# how strongly Q_i matches each K_j. Token i "retrieves" the most
# relevant information from the whole sequence.`
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Why share the same input x?',
          text: 'Q, K, V all come from the same x (the token\'s current representation). This is what makes it *self*-attention — the sequence attends to itself. In encoder-decoder Transformers, the decoder\'s queries attend to the encoder\'s keys/values (cross-attention), so Q comes from the decoder, K and V from the encoder.'
        },
        { type: 'h3', text: 'Grouped-Query Attention (GQA)' },
        {
          type: 'p',
          text: 'A key efficiency optimization: instead of one K and V per query head, share one K/V across multiple query heads. Multi-Head Attention (MHA) has n_heads of each; Multi-Query Attention (MQA) has n_heads of Q but 1 each of K/V (extreme); Grouped-Query Attention (GQA) is the middle ground — n_kv_heads groups, e.g. 32 query heads and 8 KV heads. GQA slashes the KV cache size (memory) by n_heads/n_kv_heads with minimal quality loss. Llama 3, Mistral, and Gemma all use GQA.'
        },
        {
          type: 'table',
          headers: ['Variant', '#Q heads', '#KV heads', 'KV cache size', 'Used by'],
          rows: [
            ['MHA', 'H', 'H', 'Full', 'GPT-2, GPT-3, BERT'],
            ['MQA', 'H', '1', '1/H of MHA', 'PaLM, Falcon (quality hit)'],
            ['GQA', 'H', 'H/g (e.g. 8)', '1/g of MHA', 'Llama 3, Mistral, Gemma']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'In "Alice told Bob she would call him", the "she" must attend to "Alice" and "him" to "Bob". The model learns Q projections such that Q("she") has high dot product with K("Alice"), and Q("him") with K("Bob"). The V vectors of "Alice" and "Bob" then flow into the representations of "she" and "him", letting the rest of the network reason about who is calling whom.' },
        { type: 'p', text: 'GQA in practice: Llama 3 70B has 64 attention heads but only 8 KV heads, an 8× reduction. At 8K context and 80 layers, this saves ~8GB of KV cache per sequence versus MHA — the difference between fitting 32 concurrent users on a GPU and fitting 4.' }
      ],
      advantages: [
        'Three-way separation gives expressive relational reasoning.',
        'Soft (softmax) lookup is differentiable and end-to-end learnable.',
        'Same input x supports both querying and being queried.',
        'GQA variants trade minimal quality for major memory savings.'
      ],
      disadvantages: [
        'Three projections × heads × layers = a lot of parameters in the attention layers.',
        'KV cache grows with sequence length × n_kv_heads — the dominant memory cost at long context.',
        'Three matrices per layer mean three sets of weights to load from memory per forward pass (memory-bandwidth bound).'
      ],
      commonMistakes: [
        'Using the same projection for Q, K, and V — collapses attention to a degenerate form.',
        'Forgetting that K and V must use the same n_heads (or n_kv_heads in GQA) — shape mismatches.',
        'Confusing self-attention (Q, K, V all from x) with cross-attention (Q from decoder, K/V from encoder).',
        'Thinking Q·Kᵀ is "correlation" — it is a learned similarity, not a statistical one.'
      ],
      limitations: [
        'Q, K, V projections are dense (full d_model × d_k matrices); sparse alternatives (e.g. grouped convolutions) trade expressivity for speed.',
        'At very long contexts, even GQA\'s KV cache becomes prohibitive — motivating linear/sparse attention and SSMs.'
      ],
      relatedConcepts: ['Self-Attention', 'Multi-Head Attention', 'Grouped-Query Attention', 'KV Cache', 'Cross-Attention'],
      faq: [
        { q: 'Why are Q, K, V the same dimension (d_k)?', a: 'So the dot product Q·Kᵀ is well-defined. In MHA each head has its own d_k; in GQA the d_k of Q and K/V must match per group. The output is projected back to d_model by Wo.' },
        { q: 'Is GQA always better than MHA?', a: 'For inference (especially long context), yes — the KV cache savings are large and quality loss is small. For training compute, MHA can be slightly better, but inference cost dominates for most production deployments.' }
      ],
      summary:
        'Q, K, V are three projections of each token that decouple "what I want" (query), "what I offer" (key), and "what I contribute" (value). Attention computes a soft lookup: softmax(Q·Kᵀ / √d_k) weights the values. The three-way split is what gives attention its expressive power. GQA shares K/V across query heads to shrink the KV cache, with minimal quality loss — it is the production default.'
    },

    // ------------------------------------------------------------------
    // 11. MULTI-HEAD ATTENTION
    // ------------------------------------------------------------------
    {
      id: 'multi-head-attention',
      title: 'Multi-Head Attention',
      subtitle: 'Run attention H times in parallel — each head learns a different relation.',
      tags: ['attention', 'multi-head', 'transformer', 'core'],
      readingMinutes: 6,
      definition:
        'Multi-Head Attention (MHA) runs H independent self-attention operations ("heads") in parallel on different learned subspaces of the input, then concatenates and projects the results. Each head can specialize in a different relation: subject-verb agreement, pronoun coreference, syntactic dependency, positional patterns, etc. The combined output is richer than any single attention could produce.',
      whyItExists:
        'A single attention head must blend all relational reasoning into one set of weights — a hard bottleneck. Multi-head attention lets the model simultaneously maintain H different "views" of the same sequence. Empirically, different heads learn different things: some attend to the previous token (positional), some to syntactic heads (subject→verb), some to coreference (pronoun→antecedent). Without multiple heads, the model cannot represent these distinct relations simultaneously.',
      howItWorks: [
        {
          type: 'p',
          text: 'For H heads, the input x is projected into H separate (Q_h, K_h, V_h) triples, each of dimension d_k = d_model / H. Each head computes attention independently: head_h = softmax(Q_h · K_hᵀ / √d_k) · V_h, producing an output of shape [T, d_k]. The H heads are concatenated along the feature axis to form [T, H·d_k = d_model], then multiplied by a final output projection Wo of shape [d_model, d_model]. Total parameter cost: H × (3·d_model·d_k) + d_model² = 4·d_model² (same as single-head with d_k=d_model, but split into H specialized subspaces).'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Multi-Head Attention in PyTorch (single Matrix, then reshape into H heads)',
          code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        assert d_model % n_heads == 0
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        # Single big projections, then reshape into H heads
        self.qkv = nn.Linear(d_model, 3 * d_model, bias=False)
        self.o = nn.Linear(d_model, d_model, bias=False)

    def forward(self, x, mask=None):
        B, T, C = x.shape
        # Project Q, K, V at once: [B, T, 3*C] -> 3 x [B, T, C]
        qkv = self.qkv(x).reshape(B, T, 3, self.n_heads, self.d_k)
        q, k, v = qkv.unbind(dim=2)
        # -> [B, n_heads, T, d_k]
        q = q.transpose(1, 2)
        k = k.transpose(1, 2)
        v = v.transpose(1, 2)

        scores = (q @ k.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, float("-inf"))
        attn = F.softmax(scores, dim=-1)
        out = attn @ v                       # [B, n_heads, T, d_k]
        out = out.transpose(1, 2).reshape(B, T, C)   # concat heads
        return self.o(out)

mha = MultiHeadAttention(d_model=512, n_heads=8)
x = torch.randn(2, 16, 512)
print(mha(x).shape)   # torch.Size([2, 16, 512])`
        },
        { type: 'h3', text: 'What heads learn' },
        {
          type: 'p',
          text: 'Probing studies of trained Transformers find specialized heads: "previous-token heads" that always attend to the immediately preceding token; "induction heads" that attend to the token after a previous occurrence of the current token (key to in-context learning); "syntactic heads" that attend from verbs to their subjects; "duplicate heads" that find prior occurrences of the same token. Heads are not pre-assigned these roles — they emerge from training.'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Induction heads and in-context learning',
          text: 'Anthropic\'s research found that "induction heads" — heads that copy a token that followed a previous occurrence of the current token — are the mechanism behind in-context learning. If you prompt with "A B C A B →", an induction head sees the second "A" and copies "B" (the token that followed the first "A"). This is the circuit-level explanation for few-shot learning.'
        },
        {
          type: 'table',
          headers: ['Head type', 'What it attends to', 'Why it matters'],
          rows: [
            ['Previous-token', 'Position t-1', 'Models local syntax; baseline positional info'],
            ['Induction', 'Token after prior occurrence of current', 'Mechanism behind in-context/few-shot learning'],
            ['Syntactic', 'Subject/object/verb dependencies', 'Models long-range grammar'],
            ['Coreference', 'Pronoun -> antecedent', 'Resolves "it" -> "cat"'],
            ['Duplicate', 'Earlier occurrence of same token', 'Tracks entities across a document']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'In "The dog chased the cat. It ran away.", one head might attend from "It" to "dog" (if the model thinks "It" = "dog"), another to "cat" (the more likely referent). The model\'s final answer is a function of all heads\' outputs. Multi-head lets the model hedge across possible interpretations before the FFN integrates them.' },
        { type: 'p', text: 'Ablation studies show that pruning the bottom 50% of attention heads by importance often causes minimal quality loss — many heads are redundant. But removing *all* attention heads destroys the model. The redundancy is a feature: it makes training robust, even if it wastes some compute at inference.' }
      ],
      advantages: [
        'Lets the model learn multiple relational patterns simultaneously.',
        'Cheap: total compute is the same as a single head with d_k=d_model.',
        'Parallelizes trivially across heads on a GPU.',
        'Empirically, more heads help up to a point (16–64 typical).'
      ],
      disadvantages: [
        'Memory: KV cache scales with n_heads (or n_kv_heads in GQA).',
        'Many heads end up redundant — wasted capacity.',
        'Hard to interpret "the model\'s attention" when there are H different attention maps per layer.'
      ],
      commonMistakes: [
        'Choosing n_heads that does not divide d_model evenly — d_k = d_model/n_heads must be integer.',
        'Forgetting to transpose heads to dim 1 for batched matmul.',
        'Assuming all heads are equally important — pruning redundant heads is a common compression technique.',
        'Confusing n_heads with n_kv_heads in GQA — they differ in modern LLMs.'
      ],
      limitations: [
        'Beyond ~64 heads, returns diminish; d_k becomes too small to be expressive.',
        'Heads in early layers tend to be more redundant than late-layer heads.',
        'Head specialization is emergent and not always clean — some heads are "dead" or noisy.'
      ],
      relatedConcepts: ['Self-Attention', 'Query, Key, Value', 'Grouped-Query Attention', 'Induction Heads', 'Mechanistic Interpretability'],
      faq: [
        { q: 'How many heads should I use?', a: 'Common choices: 32 for 7B models, 64 for 70B, with d_k=64 or 128. Beyond ~64 heads, returns diminish. Smaller d_k (< 32) tends to underperform — heads lose expressivity.' },
        { q: 'Are all heads necessary at inference?', a: 'No — typically 30-50% can be pruned with minimal quality loss. Techniques like HeadPruner and structured pruning exploit this. But the savings are usually smaller than quantization, so most deployments do not bother.' }
      ],
      summary:
        'Multi-Head Attention runs H parallel attention operations in different learned subspaces, letting the model maintain multiple relational views of the sequence. Different heads specialize in different relations (previous-token, induction, syntax, coreference). Parameter cost is the same as a single big head. GQA shares K/V across heads to shrink the KV cache. The diversity of heads is what gives the Transformer its representational power.'
    },

    // ------------------------------------------------------------------
    // 12. FEED-FORWARD, RESIDUAL, LAYERNORM
    // ------------------------------------------------------------------
    {
      id: 'feed-forward-residual-layernorm',
      title: 'Feed-Forward, Residual, LayerNorm',
      subtitle: 'The other half of every Transformer block — where the model "thinks".',
      tags: ['ffn', 'residual', 'layernorm', 'transformer'],
      readingMinutes: 7,
      definition:
        'Every Transformer block contains, in addition to attention, three components: a position-wise feed-forward network (FFN) with two linear layers and a non-linearity, residual ("skip") connections that add a block\'s input to its output, and layer normalization that stabilizes activations. Together with attention, these complete the block; stacked N times, they form the LLM.',
      whyItExists:
        'Attention alone is a weighted-average — a linear operation followed by softmax. Without the FFN\'s non-linearity, a stack of attention-only layers would collapse toward a linear model and lose expressivity. The FFN is where most of the model\'s parameters and per-token "reasoning" live. Residual connections and layer norm are the engineering tricks that let you stack 100+ layers without training collapsing — without them, deep Transformers do not train.',
      howItWorks: [
        { type: 'h3', text: 'Feed-Forward Network (FFN)' },
        {
          type: 'p',
          text: 'The FFN applies the same two-layer MLP to each position independently (no mixing across positions — that is attention\'s job). Classic FFN: FFN(x) = W2 · GELU(W1·x + b1) + b2, where W1: [d_model, d_ff], W2: [d_ff, d_model]. The hidden dimension d_ff is typically 4×d_model. Modern LLMs use SwiGLU instead: FFN(x) = (Swish(W1·x) ⊙ W_gate·x) · W3, with d_ff ≈ 8/3 × d_model to keep parameter count comparable. SwiGLU outperforms vanilla ReLU/GELU FFNs at the same parameter budget.'
        },
        { type: 'h3', text: 'Residual connections' },
        {
          type: 'p',
          text: 'A residual connection adds the input of a sublayer to its output: y = x + Sublayer(x). This gives the gradient a direct path backward, mitigating vanishing gradients in deep networks. Without residuals, networks deeper than ~10 layers fail to train. In Transformers, every sublayer (attention and FFN) has its own residual: y = x + Attention(LayerNorm(x)), then z = y + FFN(LayerNorm(y)). The "pre-norm" variant applies LayerNorm before the sublayer; "post-norm" applies it after. Modern LLMs use pre-norm because it trains more stably at depth.'
        },
        { type: 'h3', text: 'Layer normalization' },
        {
          type: 'p',
          text: 'LayerNorm normalizes each token\'s vector across its d_model features independently: LN(x) = γ · (x - μ) / σ + β, where μ and σ are the mean and std over the feature dimension, and γ, β are learnable. This stabilizes training by keeping activations at consistent scale. RMSNorm — a simpler variant that only normalizes by RMS (no mean subtraction, no bias) — is now preferred (Llama, Mistral, Gemma) for ~10–30% speedup with no quality loss.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A complete pre-norm Transformer block (attention + FFN + residuals + RMSNorm)',
          code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class RMSNorm(nn.Module):
    def __init__(self, d, eps=1e-6):
        super().__init__()
        self.weight = nn.Parameter(torch.ones(d))
        self.eps = eps
    def forward(self, x):
        rms = x.pow(2).mean(-1, keepdim=True).add(self.eps).rsqrt()
        return self.weight * x * rms

class TransformerBlock(nn.Module):
    def __init__(self, d_model, n_heads, d_ff, d_k=None):
        super().__init__()
        d_k = d_k or d_model // n_heads
        self.norm1 = RMSNorm(d_model)
        self.attn  = MultiHeadAttention(d_model, n_heads)   # from previous lesson
        self.norm2 = RMSNorm(d_model)
        # SwiGLU FFN: 3 projections, gate * up, then down
        self.w1   = nn.Linear(d_model, d_ff, bias=False)    # gate
        self.w2   = nn.Linear(d_model, d_ff, bias=False)    # up
        self.w3   = nn.Linear(d_ff, d_model, bias=False)    # down

    def forward(self, x, mask=None):
        # Pre-norm attention with residual
        x = x + self.attn(self.norm1(x), mask=mask)
        # Pre-norm SwiGLU FFN with residual
        h = self.norm2(x)
        x = x + self.w3(F.silu(self.w1(h)) * self.w2(h))
        return x`
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Pre-norm vs Post-norm',
          text: 'Post-norm (original 2017 Transformer) applies LayerNorm after the residual add: y = LayerNorm(x + Sublayer(x)). At depth > 20, post-norm becomes unstable and training diverges. Pre-norm (modern default) applies LayerNorm before the sublayer: y = x + Sublayer(LayerNorm(x)). Always use pre-norm for deep Transformers.'
        },
        {
          type: 'table',
          headers: ['Component', 'Where params live', 'Approx. fraction of Llama 3 70B params'],
          rows: [
            ['Attention (Wq, Wk, Wv, Wo)', '4 × d_model² per layer (or less with GQA)', '~27%'],
            ['FFN (w1, w2, w3 — SwiGLU)', '3 × d_model × d_ff per layer', '~70%'],
            ['Embeddings', 'vocab × d_model', '~1%'],
            ['Norms', '2 × d_model per layer', '~0% (negligible)']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'In Llama 3 70B, the FFN per layer is 3 × 8192 × 28672 ≈ 704M params; attention per layer (with GQA: 64 query heads, 8 KV heads) is roughly 268M params. The FFN is 2.6× larger than attention per layer. Across 80 layers, FFN dominates total parameters — this is why MoE architectures (which replace the dense FFN with multiple experts) can drastically increase parameter count without proportionally increasing compute.' },
        { type: 'p', text: 'Ablating residual connections from a 32-layer Transformer makes it untrainable — loss plateaus near the initialization value. Ablating LayerNorm (without residuals) is similar. Both are necessary engineering, not optional optimizations. They are the difference between a 2-layer toy Transformer and a 100-layer LLM.' }
      ],
      advantages: [
        'FFN provides the non-linearity and per-token capacity that attention lacks.',
        'Residual connections enable training of very deep networks.',
        'LayerNorm/RMSNorm stabilize activations, allowing high learning rates.',
        'SwiGLU FFN gives better quality per parameter than vanilla FFN.'
      ],
      disadvantages: [
        'FFN is the largest parameter consumer — most of the model\'s memory and compute.',
        'Residual connections make attribution hard — every output is a sum across many layers.',
        'LayerNorm/RMSNorm add a small but non-zero kernel-launch overhead on GPU.'
      ],
      commonMistakes: [
        'Using post-norm in a deep Transformer — training diverges.',
        'Forgetting the residual add — model quality collapses.',
        'Using vanilla ReLU FFN instead of SwiGLU — leaving quality on the table.',
        'Putting LayerNorm inside the residual path (post-norm) instead of on the input to the sublayer (pre-norm).'
      ],
      limitations: [
        'FFN capacity per token is fixed regardless of context — the model cannot "think longer" on hard tokens without more layers.',
        'SwiGLU has 3 matrices instead of 2, increasing memory traffic at inference.'
      ],
      relatedConcepts: ['Transformer Blocks', 'Self-Attention', 'Residual Connections', 'Layer Normalization', 'SwiGLU'],
      faq: [
        { q: 'Why is the FFN bigger than attention?', a: 'Attention mixes information across positions but is linear in feature space (within a head). The FFN applies a learned non-linear transformation per position; it is where the model "computes" on the attended information. Empirically, more FFN capacity helps quality, so d_ff ≈ 4×d_model became standard.' },
        { q: 'RMSNorm vs LayerNorm — what is the difference?', a: 'RMSNorm drops the mean-subtraction step, normalizing only by root-mean-square. It has one fewer operation, fewer params (no bias), and trains as well as LayerNorm in practice. Most modern LLMs use RMSNorm.' }
      ],
      summary:
        'Every Transformer block contains an FFN (SwiGLU is the modern default), residual connections, and RMSNorm. The FFN is where most parameters and per-token computation live; residuals and norms are what make deep stacks trainable. Pre-norm is the modern default over post-norm. Together with attention, these four components form a block; stacking N blocks forms the LLM.'
    },

    // ------------------------------------------------------------------
    // 13. TRANSFORMER BLOCKS
    // ------------------------------------------------------------------
    {
      id: 'transformer-blocks',
      title: 'Transformer Blocks',
      subtitle: 'Stack N identical blocks — depth is where capability lives.',
      tags: ['transformer', 'depth', 'architecture'],
      readingMinutes: 5,
      definition:
        'A Transformer block is the repeated unit of an LLM: one attention sublayer plus one FFN sublayer, each with a residual connection and a normalization. An LLM is N such blocks stacked, where N ranges from 6 (small models) to 120+ (frontier models). Each block refines the representation; the depth lets the model build up hierarchical features — early blocks handle syntax, middle blocks semantics, late blocks task-specific reasoning.',
      whyItExists:
        'Depth is empirically more parameter-efficient than width for the same total parameter count: a deep narrow network outperforms a shallow wide one on most tasks. The Transformer block is the smallest unit that benefits from being stacked: attention mixes information across positions, the FFN transforms it, and the residual lets the next block build on the result. Repeating this N times lets the model perform multi-step reasoning — each block is one "step" of computation on the input.',
      howItWorks: [
        {
          type: 'p',
          text: 'The forward pass through a stack of N blocks is simply: h_0 = embedding(tokens) + positions; h_l = Block_l(h_{l-1}) for l = 1..N; logits = W_out · LayerNorm(h_N). All blocks have the same architecture but different learned weights. The hidden state h_l at layer l is a tensor of shape [batch, seq, d_model] — its dimension never changes inside the stack; only the content evolves.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A complete decoder-only Transformer in ~40 lines of PyTorch',
          code: `import torch
import torch.nn as nn

class DecoderOnlyTransformer(nn.Module):
    def __init__(self, vocab_size, d_model, n_layers, n_heads,
                 d_ff, max_seq_len, rope_base=10000.0):
        super().__init__()
        self.tok_emb = nn.Embedding(vocab_size, d_model)
        self.rope = RotaryEmbedding(d_model // n_heads, base=rope_base)
        self.blocks = nn.ModuleList([
            TransformerBlock(d_model, n_heads, d_ff)
            for _ in range(n_layers)
        ])
        self.norm = RMSNorm(d_model)
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)
        # Weight tying (optional): share tok_emb and lm_head weights
        self.lm_head.weight = self.tok_emb.weight

    def forward(self, token_ids):
        B, T = token_ids.shape
        x = self.tok_emb(token_ids)             # [B, T, d_model]
        # Causal mask
        mask = torch.tril(torch.ones(T, T, device=x.device))
        for block in self.blocks:
            x = block(x, mask=mask)             # [B, T, d_model]
        x = self.norm(x)
        logits = self.lm_head(x)                # [B, T, vocab_size]
        return logits

# Instantiate a small GPT-2-like model
model = DecoderOnlyTransformer(
    vocab_size=50257, d_model=768, n_layers=12,
    n_heads=12, d_ff=3072, max_seq_len=1024,
)
print(f"Parameters: {sum(p.numel() for p in model.parameters()):,}")
# -> Parameters: ~124M  (matches GPT-2 small)`
        },
        { type: 'h3', text: 'What different layers learn' },
        {
          type: 'p',
          text: 'Probing experiments reveal a rough division: layers 1–25% handle surface features (part-of-speech, syntax); 25–75% handle semantics (entity relations, common-sense); 75–100% handle task-specific behavior (instruction following, formatting). The final layer is "polished" into logits. Skipping layers or shuffling them dramatically degrades quality — the depth-wise computation is meaningful, not just redundant.'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why not 1000 layers?',
          text: 'Returns to depth diminish. Beyond ~100 layers, additional layers add parameters and training cost with small quality gains. Frontier models top out around 120 layers; wider models (larger d_model) tend to scale better than deeper ones at this point. The empirical sweet spot is roughly N ≈ d_model / 64 to 128.'
        },
        {
          type: 'table',
          headers: ['Model', 'N (layers)', 'd_model', 'Total params'],
          rows: [
            ['GPT-2 small', '12', '768', '124M'],
            ['GPT-2 XL', '48', '1600', '1.5B'],
            ['Llama 3 8B', '32', '4096', '8B'],
            ['Llama 3 70B', '80', '8192', '70B'],
            ['Llama 3 405B', '126', '16384', '405B']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'Early layers in BERT-like models learn syntactic features: linear classifiers on layer 5 representations can predict part-of-speech with >95% accuracy. Late layers encode semantics: linear classifiers on layer 11 predict coreference with much higher accuracy than on layer 5. This depth-wise specialization emerges from training, not from explicit supervision.' },
        { type: 'p', text: 'Some "fast inference" techniques exploit layer redundancy: "early exiting" predicts the output from a middle layer if the model is confident, skipping later layers for easy inputs. Layer-skipping distillation can produce 2× speedups with <2% quality loss on simple inputs, though it is rarely used in production because the confidence calibration is tricky.' }
      ],
      advantages: [
        'Depth enables multi-step computation, critical for reasoning.',
        'Same architecture repeated simplifies implementation and hardware optimization.',
        'Layer-wise specialization emerges naturally from training.',
        'Scales smoothly — adding layers reliably improves quality up to a point.'
      ],
      disadvantages: [
        'Sequential dependency between layers limits parallelism at training (within a single forward pass).',
        'Returns diminish past ~100 layers; further scaling benefits more from width.',
        'Each layer adds memory for activations (training) and KV cache (inference).'
      ],
      commonMistakes: [
        'Making the model very deep with small d_model — quality suffers; depth/width balance matters.',
        'Forgetting that all blocks must use the same mask (causal for decoder-only).',
        'Assuming layers are interchangeable — they are not; per-layer weights capture different abstractions.'
      ],
      limitations: [
        'Layer count is fixed at training; cannot be changed without retraining.',
        'Very deep models (100+ layers) need careful initialization and pre-norm to train stably.'
      ],
      relatedConcepts: ['Transformer Architecture', 'Self-Attention', 'Feed-Forward Networks', 'Residual Connections', 'Layer Normalization'],
      faq: [
        { q: 'Should I scale depth or width?', a: 'Both, proportionally. Empirically, N ≈ d_model / 64 to 128 is a good ratio. Going very deep with narrow d_model underperforms; going very wide with few layers also underperforms. Scaling laws (Chinchilla, Kaplan) suggest balanced scaling.' },
        { q: 'Why do all blocks have the same architecture?', a: 'Simplicity, hardware efficiency (kernel reuse), and the empirical finding that heterogeneous blocks rarely outperform homogeneous ones enough to justify the complexity.' }
      ],
      summary:
        'A Transformer block is the repeated unit — attention + FFN + residuals + norm. An LLM is N stacked blocks; depth is where multi-step reasoning emerges. Layers specialize: early for syntax, middle for semantics, late for task behavior. The architecture repeats but the weights differ. Stacking N=12 to 120 blocks is what turns a single attention layer into an LLM.'
    },

    // ------------------------------------------------------------------
    // 14. NEXT-TOKEN PREDICTION
    // ------------------------------------------------------------------
    {
      id: 'next-token-prediction',
      title: 'Next-Token Prediction',
      subtitle: 'The single training objective that produces every LLM capability.',
      tags: ['training', 'objective', 'core'],
      readingMinutes: 7,
      definition:
        'Next-token prediction is the self-supervised training objective for LLMs: given a sequence of tokens (x_1, …, x_{t-1}), predict the probability distribution over the next token x_t. The loss is cross-entropy between the predicted distribution and the actual next token (one-hot). Training on trillions of tokens, the model learns grammar, facts, reasoning, and style — all from this one objective.',
      whyItExists:
        'It is the simplest objective that (a) requires no labels (the data is its own supervision), (b) works on any text (web, books, code, dialogue), and (c) forces the model to learn everything useful for language understanding. Predicting the next token well requires understanding syntax, semantics, world knowledge, and reasoning — there is no way to predict "Paris" after "The capital of France is" without knowing the fact. This is why a single objective produces such broad capabilities.',
      howItWorks: [
        {
          type: 'p',
          text: 'During pretraining, a document is tokenized into a sequence (x_1, …, x_T). The model processes x_1…x_{t-1} and outputs a distribution p(x_t | x_1…x_{t-1}) at each position t. The loss at position t is -log p(x_t | x_1…x_{t-1}). The total loss is the average over all positions. Because the model sees every position in parallel (thanks to causal masking), one forward pass over a sequence computes T predictions — extremely sample-efficient.'
        },
        {
          type: 'interactive',
          componentId: 'token-predictor',
          caption: 'Interactive: type a prefix, see the model\'s top-k next-token predictions with their probabilities. Adjust temperature and top-p to see how sampling changes the output.'
        },
        { type: 'h3', text: 'Why this works: compression is intelligence' },
        {
          type: 'p',
          text: 'Predicting the next token is, in information-theoretic terms, building the best possible compressor of the training data. To compress well, the model must learn every regularity in the data — grammar, facts, code patterns, reasoning chains. This is why next-token prediction produces broad capabilities: it is equivalent to learning a model of the world (or at least, of the text describing it). The model is not "trained to answer questions" — it is trained to predict text, and answering questions is a special case of predicting the text that follows the question.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Next-token-prediction loss in PyTorch',
          code: `import torch
import torch.nn.functional as F

# logits: [B, T, vocab]  -- model output at every position
# tokens: [B, T]         -- the full input sequence
# We predict token t+1 from positions 0..t.
logits = model(tokens)              # [B, T, vocab]

# Shift: predict next token
pred_logits = logits[:, :-1, :]     # [B, T-1, vocab]  (positions 0..T-2)
targets      = tokens[:, 1:]        # [B, T-1]         (positions 1..T-1)

# Cross-entropy: -log p(target | context)
loss = F.cross_entropy(
    pred_logits.reshape(-1, vocab_size),
    targets.reshape(-1),
)

# Perplexity = exp(loss): interpretable as "effective vocab size"
perplexity = torch.exp(loss)
# A perplexity of 1.0 means perfect prediction;
# a perplexity of V means uniform-random guessing over V tokens.`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Perplexity is the standard quality metric for base LLMs',
          text: 'Perplexity = exp(cross-entropy loss). It can be read as "the effective number of choices the model was uncertain between". A perplexity of 3 means the model was as uncertain as if it were choosing uniformly among 3 tokens. Lower is better; frontier base LLMs reach ~1.5–3 perplexity on high-quality English text.'
        },
        { type: 'h3', text: 'Generation = iterated prediction' },
        {
          type: 'p',
          text: 'At inference, the model predicts one token, appends it to the context, predicts the next, and repeats. This autoregressive loop continues until an <EOS> token is sampled or a max length is hit. Each step requires a full forward pass over the (growing) context — the source of LLM inference latency. KV caching (next lessons) makes this efficient by reusing intermediate computation.'
        }
      ],
      examples: [
        { type: 'p', text: 'Prompt: "The capital of France is". Model logits put >90% probability on " Paris". Why? Because in trillions of tokens of training text, "The capital of France is Paris" appeared many thousands of times; the model learned this regularity. This is also why the model fails on rare facts — if a fact appeared only 5 times in training, the model has weak signal and may guess wrong.' },
        { type: 'p', text: 'Prompt: "If 2 + 2 = 4, then 4 + 4 =". A base model might output " 8" if it has seen enough arithmetic, or " 16" if it pattern-matched on "2 + 2 = 4, 4 + 4 = 16" (which it has also seen in non-arithmetic contexts). The point: next-token prediction does not guarantee correct reasoning; it guarantees statistically plausible continuation. This is the root of hallucinations.' }
      ],
      advantages: [
        'No labels required — any text is training data.',
        'Scales to internet-sized corpora (trillions of tokens).',
        'Forces the model to learn every regularity in the data.',
        'One objective produces many capabilities — no per-task architecture.'
      ],
      disadvantages: [
        'Learns statistical plausibility, not truth — confident wrong answers are common.',
        'Knowledge is bounded by training data; no mechanism for new facts.',
        'Cannot "know what it doesn\'t know" — calibration is poor without RLHF.',
        'Reward is per-token, but tasks often require multi-token coherence.'
      ],
      commonMistakes: [
        'Equating low perplexity with good task performance — a model can have low perplexity and still fail at instructions.',
        'Forgetting that a base (non-instruct) model trained only on next-token prediction continues text rather than answering questions.',
        'Assuming the model "understands" — it predicts, it does not understand in a human sense.',
        'Using perplexity to compare models with different tokenizers — perplexity is tokenizer-dependent.'
      ],
      limitations: [
        'Next-token prediction cannot directly optimize for helpfulness, honesty, or safety — that is what instruction tuning and RLHF add.',
        'Long-horizon coherence is hard: each token is predicted myopically.',
        'Cannot learn from feedback at inference time without external mechanisms (RLHF, constitutional AI).'
      ],
      relatedConcepts: ['Pretraining', 'Cross-Entropy Loss', 'Perplexity', 'Logits and Softmax', 'Sampling Strategies'],
      faq: [
        { q: 'If LLMs just predict the next token, why are they useful?', a: 'Because predicting the next token well requires modeling the underlying distribution of language — which encodes facts, reasoning, style, and task structure. The capability is a side effect of accurate prediction.' },
        { q: 'Why not predict multiple tokens at once?', a: 'Some recent models (e.g. Meta\'s Multi-Token Prediction) do, with modest gains. The single-token objective is simpler and more parallelizable; multi-token is an active research area but not yet standard.' }
      ],
      summary:
        'Next-token prediction is the self-supervised objective behind every LLM: predict x_t from x_1…x_{t-1}, minimizing cross-entropy. It needs no labels and scales to trillions of tokens. The broad capabilities it produces emerge because predicting text well requires modeling everything in the text — grammar, facts, reasoning, style. Use the token predictor above to see the model\'s distribution and how sampling controls generation.'
    },

    // ------------------------------------------------------------------
    // 15. LOGITS AND SOFTMAX
    // ------------------------------------------------------------------
    {
      id: 'logits-softmax',
      title: 'Logits and Softmax',
      subtitle: 'From raw scores to probabilities — and the temperature knob that controls randomness.',
      tags: ['logits', 'softmax', 'temperature', 'core'],
      readingMinutes: 6,
      definition:
        'Logits are the raw, unnormalized scores output by the model\'s final linear layer — one per vocabulary entry, before any normalization. Softmax converts logits to a probability distribution: softmax(z)_i = exp(z_i) / Σ_j exp(z_j). Temperature T rescales logits as z/T before softmax: high T flattens the distribution (more random), low T sharpens it (more deterministic).',
      whyItExists:
        'The model\'s final layer outputs a vector of real numbers (logits), but a probability distribution must be non-negative and sum to 1. Softmax is the standard differentiable function that maps R^V to the V-simplex. Logits are kept unnormalized internally because they preserve information (gradient of softmax is well-behaved in log space) and because other operations (top-k, top-p, temperature scaling) operate naturally on logits. Temperature exists because pure softmax is often too sharp at low probability mass — sampling becomes near-deterministic, which is bad for creative tasks but good for factual ones.',
      howItWorks: [
        {
          type: 'p',
          text: 'After the final Transformer block, the hidden state h of shape [T, d_model] is projected by a linear layer W_out of shape [d_model, vocab_size], producing logits of shape [T, vocab_size]. For next-token prediction, we only need the logits at the last position: logits[-1] is a [vocab_size] vector. Softmax over this vector gives a probability distribution; sampling from it gives the next token.'
        },
        { type: 'h3', text: 'The softmax formula and temperature' },
        {
          type: 'p',
          text: 'softmax(z)_i = exp(z_i) / Σ_j exp(z_j). For numerical stability, subtract the max: softmax(z)_i = exp(z_i - max(z)) / Σ_j exp(z_j - max(z)) — the max cancels. Temperature T divides z before softmax: softmax(z/T). At T=1, default behavior. At T→0, softmax becomes argmax (deterministic). At T→∞, softmax becomes uniform (random). Typical ranges: T=0.7 for focused generation, T=1.0 default, T=1.5+ for creative/diverse.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Logits, softmax, and temperature in NumPy',
          code: `import numpy as np

# Suppose the model produced these logits for the next token
# after "The cat sat on the"
logits = np.array([8.2, 7.9, 6.5, 5.1, 4.8, 2.0, ...])  # vocab of ~50k
# (truncated for clarity; imagine ~50k entries)

def softmax(z, temperature=1.0):
    z = z / temperature
    z = z - z.max()                  # numerical stability
    e = np.exp(z)
    return e / e.sum()

# T=1.0 (default): moderately sharp
p1 = softmax(logits, temperature=1.0)
# T=0.5 (sharp): peakier, more deterministic
p05 = softmax(logits, temperature=0.5)
# T=2.0 (flat): more diverse, more random
p2 = softmax(logits, temperature=2.0)

# Compare top-3 probability mass
print("T=0.5:", p05[:3].sum())   # ~0.95  -- very concentrated
print("T=1.0:", p1[:3].sum())    # ~0.80
print("T=2.0:", p2[:3].sum())    # ~0.55  -- more spread out

# Sample a token: np.random.choice over vocab with p as weights
next_token = np.random.choice(len(logits), p=p1)`
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Why not always use temperature=0?',
          text: 'T=0 (argmax) is fully deterministic and good for factual tasks, but it has two problems: (1) it always gives the same answer for the same prompt — bad for chatbots where variety matters; (2) it amplifies model biases — if "nurse" is always slightly more likely than "doctor" after "The hospital hired a", argmax always outputs "nurse". Sampling with T>0 lets the model explore and is less biased in aggregate.'
        },
        {
          type: 'table',
          headers: ['Temperature', 'Behavior', 'Use case'],
          rows: [
            ['0 (argmax)', 'Always pick top token; deterministic', 'Code generation, factual Q&A, evals'],
            ['0.3–0.7', 'Sharp, mostly top token; rare excursions', 'Focused generation, summarization'],
            ['0.7–1.0', 'Balanced; some variety', 'Default for chat assistants'],
            ['1.0–1.3', 'More variety; sometimes surprising', 'Brainstorming, creative writing'],
            ['1.5+', 'Often incoherent; very random', 'Rare; mostly for novelty/diversity sampling']
          ]
        },
        { type: 'h3', text: 'Log-probabilities and why they matter' },
        {
          type: 'p',
          text: 'For evaluation and tooling, we often need the log-probability of a chosen token: logp_i = z_i - logsumexp(z). This is the (negative) loss for that token. Summing logp across a generated sequence gives the sequence log-probability — useful for scoring outputs, detecting anomalies, and computing perplexity. Modern sampling strategies (top-p, top-k) operate on these probabilities or log-probabilities.'
        }
      ],
      examples: [
        { type: 'p', text: 'A model generating "The capital of France is" produces logits where "Paris" has score 12.4, "Lyon" 4.1, "Berlin" 3.8, and 50,000 other tokens have scores < 0. After softmax with T=1, "Paris" gets ~0.95 probability, the rest ~0.05. At T=0.3, "Paris" gets >0.999. At T=2, "Paris" gets ~0.4 and the model often samples other tokens — generating wrong answers like "Lyon". Temperature matters more when the distribution is flat.' },
        { type: 'p', text: 'For structured output (JSON, code), T=0 is often right: the top token is almost always the correct one (a comma after a string, a closing brace). For creative writing, T=0 makes every output identical and boring; T=0.8–1.0 introduces variation that feels natural. Choosing temperature is a task-specific design decision, not a fixed default.' }
      ],
      advantages: [
        'Softmax is differentiable — trainable end-to-end.',
        'Temperature gives a smooth knob from deterministic to random.',
        'Logits preserve information for top-k/top-p sampling.',
        'Numerically stable with the max-subtraction trick.'
      ],
      disadvantages: [
        'Softmax over a 100K+ vocab is memory- and compute-heavy (the final projection is large).',
        'Temperature is global — affects all tokens equally, even when some positions want determinism (e.g. JSON braces) and others want variety.',
        'High-temperature sampling often produces incoherent text — there is no quality filter.'
      ],
      commonMistakes: [
        'Forgetting the max-subtraction — softmax overflows with logits > 30.',
        'Using high temperature for factual tasks — produces hallucinations.',
        'Using T=0 for chat — feels robotic and repetitive.',
        'Comparing raw logit values across models — they are not normalized and have no consistent meaning.'
      ],
      limitations: [
        'Softmax cannot produce a "none of the above" — every token gets nonzero probability.',
        'Temperature is a single global knob; per-position temperature is rare and adds complexity.'
      ],
      relatedConcepts: ['Next-Token Prediction', 'Sampling Strategies', 'Cross-Entropy Loss', 'Top-K Sampling', 'Top-P Sampling'],
      faq: [
        { q: 'What temperature should I use?', a: 'Code/factual: 0–0.3. Chat: 0.7–1.0. Creative: 0.9–1.2. Always evaluate on your specific task — there is no universal best value.' },
        { q: 'Why are logits called "logits"?', a: 'From "log-odds" in statistics — the inverse of the sigmoid function. In ML, "logit" has come to mean any unnormalized score before a softmax/sigmoid. The terminology is loose but standard.' }
      ],
      summary:
        'Logits are raw scores per vocabulary token; softmax converts them to a probability distribution. Temperature rescales logits before softmax — low T is sharp/deterministic, high T is flat/random. Temperature is a task-specific design choice: low for factual and structured outputs, higher for creative. Logits and log-probabilities power both training (cross-entropy) and inference (top-k, top-p sampling).'
    },

    // ------------------------------------------------------------------
    // 16. SAMPLING STRATEGIES
    // ------------------------------------------------------------------
    {
      id: 'sampling-strategies',
      title: 'Sampling Strategies',
      subtitle: 'Greedy, top-k, top-p (nucleus), and temperature — choosing the next token.',
      tags: ['sampling', 'decoding', 'inference', 'core'],
      readingMinutes: 7,
      definition:
        'Sampling strategies decide which token to actually emit given the model\'s probability distribution. Greedy decoding picks the highest-probability token (deterministic). Top-k restricts sampling to the k highest-probability tokens. Top-p (nucleus) restricts to the smallest set whose cumulative probability exceeds p. Temperature rescales the distribution before any of these. Most production LLM APIs expose all three.',
      whyItExists:
        'Pure sampling from the full distribution often picks low-probability "tail" tokens, producing incoherent text. Greedy (always pick top) is deterministic but repetitive and gets stuck in loops ("I am I am I am"). Top-k and top-p exist to remove the bad tail while preserving useful diversity — they let the model sample from "good" continuations only. The right strategy depends on the task: factual wants determinism; creative wants curated diversity.',
      howItWorks: [
        { type: 'h3', text: 'Greedy decoding' },
        {
          type: 'p',
          text: 'Pick argmax of the distribution at every step. Equivalent to temperature=0. Always produces the same output for the same prompt. Tends to be repetitive — once the model enters a state where "the" is most likely after "the", it loops. Used for code, structured output, and evals. Bad for chat (boring) and creative writing (sterile).'
        },
        { type: 'h3', text: 'Top-k sampling' },
        {
          type: 'p',
          text: 'Keep only the k tokens with highest probability, renormalize them to sum to 1, and sample from this restricted set. k=40 is a common default. Eliminates the long tail of bad tokens. Weakness: k is fixed, but the distribution shape varies — sometimes the top 5 tokens have 99% mass (you want k=5), sometimes the top 50 have 50% mass (you want k>50). Top-k is too rigid.'
        },
        { type: 'h3', text: 'Top-p (nucleus) sampling' },
        {
          type: 'p',
          text: 'Keep the smallest set of top tokens whose cumulative probability ≥ p. Renormalize and sample. p=0.9 is a common default. Adaptive: when the distribution is sharp (one token dominates), the set is tiny; when flat, the set is larger. Better than top-k because it adapts to the distribution. Most modern chat APIs use top-p as the default.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Implementing greedy, top-k, top-p, and temperature in NumPy',
          code: `import numpy as np

def sample(logits, temperature=1.0, top_k=None, top_p=None):
    # 1. Temperature
    if temperature != 1.0:
        logits = logits / temperature

    # 2. Top-k: keep only k highest logits, set rest to -inf
    if top_k is not None:
        idx = np.argpartition(logits, -top_k)[-top_k:]
        mask = np.full_like(logits, -np.inf)
        mask[idx] = logits[idx]
        logits = mask

    # 3. Top-p: keep smallest set whose softmax-prob sums to >= p
    if top_p is not None:
        sorted_idx = np.argsort(logits)[::-1]    # descending
        sorted_logits = logits[sorted_idx]
        probs = np.exp(sorted_logits - sorted_logits.max())
        probs = probs / probs.cumsum()           # cumulative
        # Find cutoff: first index where cumulative prob >= top_p
        cutoff = np.searchsorted(probs, top_p) + 1
        keep = sorted_idx[:cutoff]
        mask = np.full_like(logits, -np.inf)
        mask[keep] = logits[keep]
        logits = mask

    # 4. Softmax and sample
    logits = logits - logits.max()
    probs = np.exp(logits)
    probs = probs / probs.sum()
    return np.random.choice(len(probs), p=probs)

# Typical presets
# greedy:    sample(logits, temperature=0)            (or argmax)
# balanced:  sample(logits, temperature=0.7, top_p=0.9)
# creative:  sample(logits, temperature=1.0, top_p=0.95)
# diverse:   sample(logits, temperature=1.2, top_k=50)`
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Practical defaults',
          text: 'Most production chat deployments use temperature=0.7, top_p=0.95, no top_k. For evals, set temperature=0 (greedy) for reproducibility. For JSON output, temperature=0 + grammar constraints. For creative writing, temperature=0.9, top_p=0.9. Avoid stacking all three knobs at extreme values — they interact unpredictably.'
        },
        {
          type: 'table',
          headers: ['Strategy', 'Determinism', 'Diversity', 'Best for'],
          rows: [
            ['Greedy (T=0)', 'Full', 'None', 'Code, evals, structured output'],
            ['Beam search', 'Full (returns top beams)', 'Low', 'Translation, summarization (rare for LLMs)'],
            ['Top-k (k=40)', 'Stochastic', 'Moderate', 'Older default; superseded by top-p'],
            ['Top-p (p=0.9)', 'Stochastic', 'Moderate, adaptive', 'Modern default for chat'],
            ['Min-p', 'Stochastic', 'Adaptive by absolute prob', 'Long-context, varying confidence']
          ]
        },
        { type: 'h3', text: 'Beam search and why LLMs rarely use it' },
        {
          type: 'p',
          text: 'Beam search keeps the top-B sequences at each step, expanding each by all tokens, pruning back to B. It produces higher-probability sequences than sampling and was standard for translation (2014–2020). But beam search produces generic, repetitive text — exactly the wrong behavior for open-ended generation. Modern LLMs use sampling instead. Beam search survives in translation, structured generation, and ASR.'
        }
      ],
      examples: [
        { type: 'p', text: 'Prompt: "It was a dark and". Greedy: "stormy night" (always). Top-p=0.9, T=0.8: sometimes "stormy night", sometimes "cold evening", sometimes "lonely road" — all plausible continuations. Pure sampling (no top-p): occasionally "purple banana" — bad. The point of top-p is to keep the good variety and cut the bad tail.' },
        { type: 'p', text: 'A common production bug: setting temperature=0.7 and top_p=0.1 (overly restrictive). The output becomes repetitive and "stuck" because top_p=0.1 keeps only the top 1–2 tokens at each step. Conversely, temperature=1.5 and top_p=1.0 (no cutoff) produces incoherent rambles. Tune one knob at a time.' }
      ],
      advantages: [
        'Sampling strategies trade diversity vs determinism smoothly.',
        'Top-p adapts to the distribution shape — better than fixed top-k.',
        'Temperature is a single intuitive knob.',
        'All are cheap (microseconds per token) compared to the forward pass.'
      ],
      disadvantages: [
        'Wrong settings produce loops (greedy), incoherence (high T), or boring outputs (low T).',
        'Settings interact unpredictably — stacking top_k AND top_p AND temperature is hard to reason about.',
        'No strategy fixes a model that has learned bad distributions; sampling is post-hoc.'
      ],
      commonMistakes: [
        'Using high temperature for factual/code tasks — hallucinations explode.',
        'Using T=0 for chat — boring, repetitive, and amplifies biases.',
        'Setting top_p=0.1 thinking it improves quality — actually degenerates output.',
        'Forgetting to set a random seed for reproducible evals — temperature sampling is non-deterministic by default.'
      ],
      limitations: [
        'Sampling cannot add capabilities the model lacks.',
        'Quality at high temperature degrades non-linearly — small T increases can produce large quality drops.',
        'No principled way to set parameters without task-specific evaluation.'
      ],
      relatedConcepts: ['Logits and Softmax', 'Next-Token Prediction', 'Beam Search', 'Inference', 'Repetition Penalties'],
      faq: [
        { q: 'What is the difference between top-k and top-p?', a: 'Top-k keeps a fixed number of tokens (k=40 means 40 tokens). Top-p keeps a variable number — whatever is needed for cumulative probability to reach p. Top-p adapts to the distribution shape; top-k does not. Top-p is generally better.' },
        { q: 'Should I use temperature OR top-p, or both?', a: 'Both, but tuned carefully. Temperature controls overall sharpness; top-p removes the bad tail. The standard chat preset (T=0.7, top_p=0.95) uses both. For evals, use T=0 only.' }
      ],
      summary:
        'Sampling strategies choose the next token from the model\'s distribution. Greedy is deterministic but repetitive; top-k and top-p cut the bad tail while preserving diversity. Top-p (nucleus) is the modern default because it adapts to the distribution shape. Temperature controls overall sharpness. Defaults: T=0.7, top_p=0.95 for chat; T=0 for evals and structured output. Tune one knob at a time and evaluate on your task.'
    },

    // ------------------------------------------------------------------
    // 17. CONTEXT WINDOWS
    // ------------------------------------------------------------------
    {
      id: 'context-windows',
      title: 'Context Windows',
      subtitle: 'How much text the model can see at once — and why it is never enough.',
      tags: ['context-window', 'inference', 'rope'],
      readingMinutes: 6,
      definition:
        'The context window is the maximum number of tokens the model can process in a single forward pass — the sum of input prompt and generated output. It is set at pretraining (by the positional encoding\'s reach) and hard-capped by GPU memory (KV cache grows linearly with context). Modern LLMs range from 4K tokens (older models) to 2M tokens (Gemini 1.5 Pro).',
      whyItExists:
        'Every token in the context occupies memory (its KV cache entry) and compute (attention is O(T²)). The window is therefore bounded by hardware and by what the positional encoding was trained for. The window matters because it determines what the model can "see" in one call: a 4K-window model cannot summarize a 50K-token document in one shot; a 1M-window model can. Many production problems (RAG, long-document Q&A, codebase understanding) are bounded by context length.',
      howItWorks: [
        {
          type: 'p',
          text: 'Two limits combine: (1) Positional encoding reach — RoPE-trained models extrapolate poorly beyond their pretraining length without scaling; (2) KV cache memory — at 80 layers, 64 heads, 128 d_k, bf16, a single token\'s K and V take 80 × 64 × 128 × 2 bytes × 2 (K+V) ≈ 2.6MB. A 128K-token context thus needs ~340GB of KV cache per sequence — far exceeding a single GPU. Techniques like GQA, paged KV (vLLM), and ring attention are essential for long contexts.'
        },
        { type: 'h3', text: 'Why longer context is hard' },
        {
          type: 'ul',
          items: [
            'Memory: KV cache grows linearly with sequence length; a single sequence can exceed GPU memory.',
            'Compute: Attention is O(T²) — doubling context quadruples attention FLOPs.',
            'Quality: Models attend less reliably to the middle of long contexts ("lost in the middle" effect, Liu et al. 2023).',
            'Training data: There is far less 100K-token training data than 4K-token data; long-context capability requires deliberate long-context fine-tuning.'
          ]
        },
        {
          type: 'table',
          headers: ['Model', 'Pretraining context', 'Extended context', 'Technique'],
          rows: [
            ['GPT-3 (2020)', '2K', '2K', 'No extension'],
            ['GPT-4 Turbo', '8K', '128K', 'RoPE + long-context SFT'],
            ['Llama 3', '8K', '128K (Llama 3.1)', 'RoPE NTK scaling + long-context SFT'],
            ['Claude 3', '200K', '200K', 'Native long-context training'],
            ['Gemini 1.5 Pro', '1M', '2M', 'Ring attention + mixture-of-localities']
          ]
        },
        { type: 'h3', text: 'RoPE scaling for length extension' },
        {
          type: 'p',
          text: 'To extend a RoPE model\'s context, you can (a) Linear Interpolation: rescale positions to fit the original range (simpler, slight quality loss); (b) NTK-aware: rescale RoPE frequencies so high-frequency components stay untouched (better quality); (c) YaRN: a more sophisticated combination. After scaling, continued pretraining on long sequences recovers (and often exceeds) the original quality. Llama 3.1\'s 128K context uses NTK with base frequency 500000.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Long context does not mean good long context',
          text: 'Even with 128K-token windows, models retrieve information from the beginning and end of the context more reliably than the middle. "Lost in the middle" is a robustness issue, not a hard limit — but you should still place critical information at the start or end of the prompt, not buried in the middle.'
        }
      ],
      examples: [
        { type: 'p', text: 'A 4K-context model summarizing a 30K-token report must either truncate (losing information), use sliding-window chunking (losing coherence), or use RAG (retrieving only relevant chunks). A 128K-context model ingests the whole report in one call — far better coherence. The economics flip: at $0.01 per 1K input tokens, the 30K-token report costs $0.30 per call; many users find this acceptable for high-value tasks.' },
        { type: 'p', text: 'Codebase Q&A illustrates the limit even at long contexts. A 100K-token codebase fits in a 128K-window model — but asking "where is the authentication logic?" still benefits from RAG because (a) it is cheaper (no need to send 100K tokens every query), (b) it is more reliable (retrieved chunks are focused, no lost-in-the-middle), and (c) it scales to codebases far beyond any context window.' }
      ],
      advantages: [
        'Longer context enables whole-document and multi-document tasks in one call.',
        'Reduces the need for chunking and RAG in many use cases.',
        'Improves coherence for long outputs (long-form writing, multi-turn dialogue).'
      ],
      disadvantages: [
        'Cost grows linearly with input length (per-token pricing).',
        'Latency grows (prefill is O(T²) in attention).',
        'Quality does not scale linearly — "lost in the middle" degrades reliability.',
        'Memory for KV cache becomes a hard constraint beyond ~100K tokens per sequence.'
      ],
      commonMistakes: [
        'Stuffing the entire context with raw text when RAG would be cheaper and more reliable.',
        'Assuming the model uses all of the context equally — middle tokens are attended less reliably.',
        'Forgetting that output tokens count against the window — a 128K context with 127K input leaves only 1K for output.',
        'Comparing context lengths across models without considering quality at that length (some models degrade sharply past their pretraining length).'
      ],
      limitations: [
        'Even 2M-token models are finite; multi-document, multi-year corpora still need RAG.',
        'Long-context inference is expensive — pricing often scales with length, sometimes superlinearly.',
        'Long-context reliability requires ongoing research; current models are imperfect.'
      ],
      relatedConcepts: ['Positional Encodings', 'RoPE', 'KV Cache', 'RAG', 'Grouped-Query Attention'],
      faq: [
        { q: 'Is long context a replacement for RAG?', a: 'For moderate document sizes (under the context window), often yes — simpler and more coherent. For large corpora (millions of tokens), no — RAG is still cheaper and more reliable. The two are complementary: use RAG to retrieve, long context to reason over the retrieved chunks.' },
        { q: 'Why is the context window not 1 billion tokens?', a: 'Memory (KV cache would be terabytes per sequence), compute (O(T²) attention), and lack of training data at that length. Sparse/linear attention and SSMs (Mamba) might eventually push the limit higher.' }
      ],
      summary:
        'The context window is the maximum tokens a model can process at once, bounded by positional encoding reach and KV cache memory. Modern windows range from 4K to 2M tokens. Longer context enables whole-document reasoning but costs more (compute, memory, dollars) and does not guarantee reliability — "lost in the middle" is real. RAG and long context are complementary, not competing.'
    },

    // ------------------------------------------------------------------
    // 18. PARAMETERS AND WEIGHTS
    // ------------------------------------------------------------------
    {
      id: 'parameters-weights',
      title: 'Parameters and Weights',
      subtitle: 'Where the model\'s "knowledge" lives — billions of learned numbers.',
      tags: ['parameters', 'weights', 'fundamentals'],
      readingMinutes: 6,
      definition:
        'A parameter (or weight) is a single learned number inside the model — an entry in a weight matrix or bias vector. The total parameter count is the canonical size metric for an LLM: a "7B model" has 7 billion parameters. They are learned during training via gradient descent and frozen at inference. The parameters are the model — the architecture is just the recipe for combining them.',
      whyItExists:
        'The Universal Approximation Theorem says a sufficiently large neural network can represent any function. The parameters are how that representation is encoded. A transformer architecture with random parameters produces noise; the same architecture with trained parameters produces coherent English. The capability lives in the parameter values, not the architecture code. This is why you can "release" a model by publishing its weights — the architecture is public, the weights are the IP.',
      howItWorks: [
        {
          type: 'p',
          text: 'In a Transformer, parameters live in: (1) Embedding matrix: vocab_size × d_model (~1B for Llama 3 70B); (2) Per-layer attention: 4 matrices (Wq, Wk, Wv, Wo), each ~d_model × d_model or smaller with GQA; (3) Per-layer FFN: 3 matrices (SwiGLU) of d_model × d_ff; (4) Layer norm scales: small. The FFN typically dominates (~70% of total), then attention (~27%), then embeddings (~1–3%).'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Counting parameters in a Transformer from hyperparameters',
          code: `def count_params(vocab, d_model, n_layers, n_heads, n_kv_heads,
                  d_ff, tied_embeddings=True):
    # Embeddings
    embed = vocab * d_model
    # Per-layer attention (GQA: Wq is full, Wk/Wv are smaller, Wo is full)
    d_k = d_model // n_heads
    per_layer_attn = (n_heads * d_k * d_model     # Wq
                    + n_kv_heads * d_k * d_model  # Wk
                    + n_kv_heads * d_k * d_model  # Wv
                    + n_heads * d_k * d_model)    # Wo
    # Per-layer FFN (SwiGLU has 3 matrices)
    per_layer_ffn = 3 * d_model * d_ff
    per_layer = per_layer_attn + per_layer_ffn
    # Output head: tied with embeddings or separate
    head = 0 if tied_embeddings else vocab * d_model
    # RMSNorm (small) — 2 per layer, plus final
    norms = (2 * n_layers + 1) * d_model

    total = embed + n_layers * per_layer + head + norms
    return {
        "embeddings": embed,
        "attention_total": n_layers * per_layer_attn,
        "ffn_total": n_layers * per_layer_ffn,
        "head": head,
        "norms": norms,
        "TOTAL": total,
    }

# Llama 3 70B-ish numbers
print(count_params(vocab=128256, d_model=8192, n_layers=80,
                   n_heads=64, n_kv_heads=8, d_ff=28672,
                   tied_embeddings=False))
# TOTAL ~ 70B; FFN dominates, then attention, then embeddings.`
        },
        { type: 'h3', text: 'What parameters store' },
        {
          type: 'p',
          text: 'Individual parameters are not interpretable — there is no "Paris is at row 1234 of Wq in layer 17". Knowledge is distributed across billions of parameters in superposition. Mechanistic interpretability research tries to reverse-engineer what specific subnetworks do, but at the parameter level, the model is a dense, distributed representation. This is why editing a model (e.g. to "delete" a fact) is so hard — the fact is smeared across many weights.'
        },
        {
          type: 'table',
          headers: ['Model size', 'Approx. disk (fp16)', 'Approx. disk (int4)', 'Typical GPU memory to run'],
          rows: [
            ['1B params', '~2 GB', '~0.5 GB', '~3 GB (with KV cache)'],
            ['7B params', '~14 GB', '~4 GB', '~10–16 GB'],
            ['13B params', '~26 GB', '~7 GB', '~24–32 GB'],
            ['70B params', '~140 GB', '~35 GB', '~80–160 GB (multi-GPU)'],
            ['405B params', '~810 GB', '~200 GB', '~480–800 GB (multi-node)']
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Mixture-of-Experts changes the math',
          text: 'An MoE model like Mixtral 8x22B has 141B total parameters but only ~39B "active" per token (the router picks 2 of 8 experts). Disk size scales with total parameters; per-token compute scales with active parameters. This is the main appeal of MoE — you get a 141B model\'s quality at a 39B model\'s inference cost, at the price of memory.'
        }
      ],
      examples: [
        { type: 'p', text: 'A 7B-parameter model in fp16 needs ~14GB of VRAM to load, plus ~2GB for activations and KV cache at moderate context. It fits on a single 16GB GPU (e.g. RTX 4080). A 70B model in fp16 needs ~140GB — requires 2×80GB H100s or 4×48GB L40s. Quantizing the 70B model to int4 brings it to ~35GB — fits on a single 80GB H100. This is why quantization is so important for deployment.' },
        { type: 'p', text: 'The Chinchilla scaling laws suggest that for compute-optimal training, a model should be trained on ~20 tokens per parameter. A 70B model should see ~1.4T tokens. Llama 3 was trained on 15T tokens — far past compute-optimal, intentionally, because inference cost (which scales with parameters) is amortized over many queries while training cost is one-time. The "overtrain then serve" strategy favors smaller, longer-trained models.' }
      ],
      advantages: [
        'Parameter count is a simple, comparable size metric across models.',
        'Once trained, parameters are static — inference is deterministic (modulo sampling).',
        'Parameters can be quantized, pruned, and distilled for cheaper deployment.'
      ],
      disadvantages: [
        'Parameter count is a poor quality predictor across architectures (a well-trained 7B can beat a poorly-trained 70B).',
        'Memory footprint scales with parameters — deployment is constrained by GPU VRAM.',
        'Distributed representation makes targeted editing nearly impossible.'
      ],
      commonMistakes: [
        'Equating parameter count with quality — Chinchilla showed data quality and tokens-per-parameter matter as much.',
        'Forgetting that MoE "total" parameters are not all active at inference — active params determine compute cost.',
        'Estimating memory as parameter_count × 2 bytes (fp16) and forgetting the KV cache, activations, and overhead.'
      ],
      limitations: [
        'Past a point, more parameters need more data to be useful — diminishing returns without scaling data.',
        'Very large models are expensive to serve, even quantized — limits practical deployment.'
      ],
      relatedConcepts: ['Pretraining', 'Quantization', 'Mixture of Experts', 'Chinchilla Scaling Laws', 'Model Distillation'],
      faq: [
        { q: 'How many parameters do I need for my task?', a: 'Often fewer than you think. A 7B model fine-tuned on your domain often beats a 70B general model. Start small, evaluate, and scale up only if quality demands it.' },
        { q: 'Are more parameters always better?', a: 'No — only with sufficient training data and compute. The Chinchilla paper showed many large models were undertrained. Llama 3 8B trained on 15T tokens outperforms many 70B models trained on 1.4T.' }
      ],
      summary:
        'Parameters are the learned numbers that encode everything the model knows. They live mostly in FFN and attention matrices; the embedding and output head are also large. Parameter count is the canonical size metric but a poor quality predictor across architectures and training recipes. Memory footprint scales with parameters, which is why quantization and MoE are essential deployment techniques.'
    },

    // ------------------------------------------------------------------
    // 19. PRETRAINING
    // ------------------------------------------------------------------
    {
      id: 'pretraining',
      title: 'Pretraining',
      subtitle: 'The expensive, one-time step that turns random weights into a base model.',
      tags: ['pretraining', 'training', 'core'],
      readingMinutes: 8,
      definition:
        'Pretraining is the first and most expensive training stage: train a randomly-initialized Transformer on trillions of tokens of raw text using next-token prediction (self-supervised). The output is a "base model" that can continue text fluently but does not yet follow instructions. Pretraining is where the model acquires language fluency, world knowledge, and reasoning ability — everything else (instruction tuning, RLHF) refines this base.',
      whyItExists:
        'Pretraining exists because labeled data is expensive and limited, while raw text is effectively infinite (the open web has trillions of tokens). Self-supervised next-token prediction lets us train on all of it without any human labeling. The discovery of the last decade is that this single objective, scaled up, produces models with broad capabilities — far more than any supervised training on labeled task data ever did. Pretraining is the engine that made LLMs possible.',
      howItWorks: [
        { type: 'h3', text: 'The pretraining pipeline' },
        {
          type: 'ol',
          items: [
            'Data collection: scrape the web (CommonCrawl), gather books (Books3, Gutenberg), code (GitHub), academic papers (arXiv), dialogue (Reddit, Stack Overflow).',
            'Data cleaning: deduplicate (exact and fuzzy), remove low-quality text (PII, spam, boilerplate), language filtering, safety filtering.',
            'Data mixing: weight different sources — Llama 3 used ~50% web, ~25% code, ~15% books, ~10% academic. The mix strongly affects final capabilities.',
            'Tokenize: apply the frozen tokenizer to produce integer IDs.',
            'Train: forward + backward + optimizer step, on batches of ~4M tokens, for trillions of tokens total. Cosine learning rate schedule with warmup.',
            'Checkpoint: save weights periodically; evaluate perplexity on held-out data.'
          ]
        },
        { type: 'h3', text: 'Compute-optimal vs. overtraining' },
        {
          type: 'p',
          text: 'The Chinchille paper (2022) established compute-optimal scaling: for a fixed FLOPs budget, model size and token count should scale together (~20 tokens per parameter). Llama 3 broke this rule deliberately: it trained an 8B model on 15T tokens (1500 tokens/parameter, 75× past optimal). Why? Because the model is served billions of times — inference cost dominates total cost-of-ownership, and a smaller-but-overtrained model is cheaper to serve. This is now standard practice for open-weight releases.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Sketch of a pretraining loop in PyTorch (real loops add FSDP, checkpointing, etc.)',
          code: `import torch
from torch.utils.data import DataLoader

model = DecoderOnlyTransformer(vocab_size=128256, d_model=4096,
        n_layers=32, n_heads=32, d_ff=14336, max_seq_len=8192).cuda()

# AdamW + cosine LR schedule with warmup
optimizer = torch.optim.AdamW(model.parameters(),
                              lr=3e-4, betas=(0.9, 0.95),
                              weight_decay=0.1, eps=1e-8)
scheduler = torch.optim.lr_scheduler.OneCycleLR(
    optimizer, max_lr=3e-4, total_steps=1_000_000,
    pct_start=0.01, anneal_strategy='cos')

# Data: pre-tokenized corpus in shards of ~4M tokens each
loader = DataLoader(pretokenized_dataset, batch_size=32,
                    shuffle=True, num_workers=8)

model.train()
for step, batch in enumerate(loader):
    tokens = batch["input_ids"].cuda()           # [B, T]
    logits = model(tokens)                       # [B, T, V]
    # Next-token prediction: predict t+1 from t
    loss = torch.nn.functional.cross_entropy(
        logits[:, :-1].reshape(-1, V),
        tokens[:, 1:].reshape(-1),
    )
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    optimizer.step()
    optimizer.zero_grad()
    scheduler.step()
    if step % 1000 == 0:
        print(f"step={step}  loss={loss.item():.4f}  "
              f"ppl={torch.exp(loss).item():.2f}  "
              f"lr={scheduler.get_last_lr()[0]:.2e}")`
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Pretraining is absurdly expensive',
          text: 'Llama 3 405B: ~16K H100 GPUs for ~50 days, estimated cost >$500M. GPT-4: similar order. This is why only a handful of organizations pretrain frontier models. Fine-tuning is 1000–10000× cheaper; that is why most teams fine-tune rather than pretrain.'
        },
        {
          type: 'table',
          headers: ['Model', 'Approx. GPU-hours', 'Approx. tokens', 'Approx. cost'],
          rows: [
            ['Llama 3 8B', '~1.3M H100-hrs', '15T', '~$30M'],
            ['Llama 3 70B', '~6.4M H100-hrs', '15T', '~$150M'],
            ['Llama 3 405B', '~30M H100-hrs', '15T', '~$500M+'],
            ['GPT-4 (est.)', '~30M+ A100-hrs', '~13T', '~$100M+']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'A base (pretraining-only) Llama 3 model, prompted with "What is the capital of France?", will often continue with "What is the capital of Germany?..." — because in its training data, lists of trivia questions often appeared together. The base model has the knowledge (it can complete "The capital of France is ___" correctly) but not the behavior of answering questions. Instruction tuning is what makes it answer.' },
        { type: 'p', text: 'Pretraining data quality dominates model quality. Llama 3 reportedly spent enormous effort on data cleaning: multi-stage deduplication, quality classification (using earlier Llama models to score web pages), and careful source mixing. The lesson: a 7B model trained on 5T high-quality tokens beats a 70B model trained on 5T noisy tokens.' }
      ],
      advantages: [
        'Self-supervised — no labels needed, scales to all available text.',
        'Single objective produces broad, general capabilities.',
        'One pretraining run powers thousands of downstream adaptations.',
        'Knowledge and reasoning emerge for free from the objective.'
      ],
      disadvantages: [
        'Astronomically expensive — millions to tens of millions of dollars.',
        'Requires thousands of GPUs and substantial ML infrastructure (FSDP, checkpointing, fault tolerance).',
        'Sensitive to data quality — bad data in, bad model out.',
        'Cannot add new knowledge without retraining or continued pretraining.'
      ],
      commonMistakes: [
        'Pretraining from scratch when continued pretraining of an open model would suffice.',
        'Underestimating data quality — spending 80% of effort on architecture and 20% on data, when it should be reversed.',
        'Forgetting that base models do not follow instructions — a common confusion when first using open-weight base models.',
        'Ignoring tokenizer/data alignment — the tokenizer must be trained on the same data distribution as pretraining.'
      ],
      limitations: [
        'Knowledge is frozen at training-data cutoff; new events require continued pretraining or RAG.',
        'Training data biases are absorbed; mitigations (filtering, RLHF) happen post-pretraining.',
        'Pretraining cannot teach instruction-following, safety, or alignment — those require separate stages.'
      ],
      relatedConcepts: ['Instruction Tuning', 'Fine-Tuning', 'Next-Token Prediction', 'Chinchilla Scaling Laws', 'Data Curation'],
      faq: [
        { q: 'Can I pretrain my own LLM?', a: 'Technically yes, but for any serious size (>1B) it is cheaper to fine-tune an open base model like Llama 3. Pretraining only makes sense if you have unusual data (e.g. genomic, proprietary logs) and the budget.' },
        { q: 'What is "continued pretraining"?', a: 'Taking an already-pretrained base model and training further on new data — cheaper than from-scratch, used to add domain knowledge (e.g. CodeLlama is continued-pretrained Llama on code).' }
      ],
      summary:
        'Pretraining is the expensive, one-time, self-supervised stage that produces a base model from random weights. It uses next-token prediction on trillions of tokens, costs millions of dollars, and is where the model acquires language fluency, world knowledge, and reasoning. Base models do not follow instructions — that requires the next stage, instruction tuning. Data quality and training-recipe details dominate final quality as much as raw scale.'
    },

    // ------------------------------------------------------------------
    // 20. INSTRUCTION TUNING
    // ------------------------------------------------------------------
    {
      id: 'instruction-tuning',
      title: 'Instruction Tuning',
      subtitle: 'SFT: teaching a base model to answer questions instead of continuing text.',
      tags: ['instruction-tuning', 'sft', 'training'],
      readingMinutes: 6,
      definition:
        'Instruction tuning (also called Supervised Fine-Tuning, SFT) is the second training stage: fine-tune a pretrained base model on (instruction, response) pairs so that it learns to follow instructions and stop generating after a complete answer. The base model already has the capability — SFT teaches the behavior of using that capability on demand.',
      whyItExists:
        'A base model trained only on next-token prediction continues text rather than answering questions. Ask "What is the capital of France?" and it might generate "What is the capital of Germany?..." — it has the knowledge but not the conversational behavior. Instruction tuning exists because users want models that answer, summarize, translate, and stop. SFT on thousands of high-quality (instruction, response) pairs shifts the model\'s behavior from "continue text" to "respond to instructions" — a small but transformative behavioral change.',
      howItWorks: [
        {
          type: 'p',
          text: 'Curate a dataset of (instruction, ideal response) pairs — typically 10K–1M examples covering diverse tasks: Q&A, summarization, translation, code, math, creative writing, instruction-following. The data is the single biggest determinant of SFT quality; a few thousand excellent examples (e.g. LIMA\'s 1000 carefully-curated pairs) outperform millions of mediocre ones. Fine-tune the base model on this data using the same next-token loss, but only computing loss on the response tokens (not the instruction).'
        },
        { type: 'h3', text: 'Chat templates' },
        {
          type: 'p',
          text: 'Instruction-tuned models use a chat template — a structured format with special tokens that delimit user/assistant turns. Llama 3 uses <|im_start|>user\\n{prompt}<|im_end|>\\n<|im_start|>assistant\\n. The model is trained to produce the assistant turn\'s tokens after seeing the user turn. At inference, the same template is applied to new prompts. Using the wrong chat template is a common cause of "the model is broken" issues — the model expects a specific format.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'SFT with Hugging Face TRL (simplified)',
          code: `from trl import SFTTrainer, SFTConfig
from datasets import Dataset
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B")
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B")

# Each example: a list of {role, content} messages
dataset = Dataset.from_list([
    {"messages": [
        {"role": "user", "content": "What is the capital of France?"},
        {"role": "assistant", "content": "The capital of France is Paris."},
    ]},
    # ... thousands more
])

config = SFTConfig(
    output_dir="./sft-llama3",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,        # effective batch 16
    learning_rate=2e-5,                   # 10x smaller than pretraining
    lr_scheduler_type="cosine",
    warmup_ratio=0.03,
    bf16=True,
    packing=True,                         # pack short sequences together
)

trainer = SFTTrainer(
    model=model,
    args=config,
    train_dataset=dataset,
    processing_class=tokenizer,
)
trainer.train()
# Loss is computed only on assistant tokens (mask the user tokens).
# The model now responds to instructions instead of continuing text.`
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Quality > quantity for SFT data',
          text: 'The LIMA paper (Meta, 2023) showed that 1000 carefully-curated instruction-response pairs produce a model competitive with GPT-3.5 — far better than models trained on millions of scraped instructions. The lesson: hand-curate a few thousand excellent examples first; only scale up if quality plateaus.'
        },
        {
          type: 'table',
          headers: ['Stage', 'Loss on', 'Goal', 'Typical dataset size'],
          rows: [
            ['Pretraining', 'All tokens', 'Language + knowledge', 'Trillions of tokens'],
            ['SFT', 'Response tokens only', 'Instruction-following behavior', '10K–1M pairs'],
            ['RLHF / DPO', 'Preference pairs', 'Align with human preferences', '10K–1M preferences']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'Before SFT (base Llama 3 8B), prompt "Summarize: <long article>" produces another long article continuing the topic. After SFT on a few thousand (article, summary) pairs, the same model produces a 3-sentence summary and stops. The capability to summarize was already present — SFT just unlocked it as a behavior.' },
        { type: 'p', text: 'Modern chat models also include "refuse" examples in SFT data: prompts that should be refused ("How do I make a bomb?") paired with polite refusals. Without these, even a well-SFT\'d model will happily comply with harmful requests because base-model pretraining data contained instructions for everything. SFT is where basic safety is established.' }
      ],
      advantages: [
        'Transforms a base model into a usable assistant with minimal cost (~$100–$10K vs. millions for pretraining).',
        'Quality SFT data dominates final model behavior more than model size.',
        'Composable with other stages (RLHF, DPO) — the standard SFT-then-align pipeline.',
        'Easy to redo when you want to change the model\'s persona or format.'
      ],
      disadvantages: [
        'Sensitive to SFT data quality — bad examples (incorrect answers, toxic content) directly corrupt the model.',
        'Catastrophic forgetting: aggressive SFT can degrade general capabilities the base model had.',
        'Easily "jailbroken" — SFT safety is shallow; RLHF and external filters add depth.'
      ],
      commonMistakes: [
        'Using a base model without SFT for chat — produces text continuation, not answers.',
        'Using the wrong chat template — silent quality degradation.',
        'Computing loss on user tokens during SFT — the model learns to imitate user questions instead of answering them.',
        'SFT on too much data with too high a learning rate — catastrophic forgetting of pretraining knowledge.'
      ],
      limitations: [
        'SFT cannot add capabilities absent from the base model — it only unlocks existing ones.',
        'SFT alignment is shallow — models can be jailbroken with creative prompts; RLHF hardens this.',
        'SFT behavior is bounded by the diversity of the instruction dataset.'
      ],
      relatedConcepts: ['Pretraining', 'Fine-Tuning', 'RLHF', 'Chat Templates', 'Supervised Learning'],
      faq: [
        { q: 'How much SFT data do I need?', a: 'For a general assistant, 50K–500K high-quality diverse pairs. For a specific domain (e.g. your product\'s support), 1K–10K curated pairs often suffice. Quality matters far more than quantity.' },
        { q: 'Can I do SFT with LoRA instead of full fine-tuning?', a: 'Yes, and it is the standard for most teams — LoRA on attention matrices gives 95%+ of full-SFT quality at <1% of the compute and memory. See the LoRA lesson.' }
      ],
      summary:
        'Instruction tuning (SFT) fine-tunes a base model on (instruction, response) pairs so it follows instructions and stops appropriately. It is cheap compared to pretraining, and quality of SFT data dominates final behavior. SFT shifts behavior from "continue text" to "respond to instructions" — it does not add capability, it unlocks what pretraining already built. Chat templates and loss masking are the key engineering details.'
    },

    // ------------------------------------------------------------------
    // 21. FINE-TUNING
    // ------------------------------------------------------------------
    {
      id: 'fine-tuning',
      title: 'Fine-Tuning',
      subtitle: 'Specializing a pretrained model on your domain or task — without pretraining from scratch.',
      tags: ['fine-tuning', 'training', 'core'],
      readingMinutes: 6,
      definition:
        'Fine-tuning is the process of continuing training on a pretrained model using a smaller, task-specific dataset to specialize it. Full fine-tuning updates every parameter; parameter-efficient methods (LoRA, QLoRA, adapters) update only a small subset. Fine-tuning is the standard way to make a general LLM good at a specific task — medical Q&A, legal summarization, your product\'s support tickets — at 1/1000 the cost of pretraining.',
      whyItExists:
        'A general LLM is good at everything but excellent at nothing domain-specific. Pretraining a domain-specific model from scratch is prohibitively expensive. Fine-tuning is the middle path: take a pretrained model that already understands language, and update its weights on a smaller domain dataset. The model retains general capability while becoming specialized. This is the dominant pattern for production LLM deployment — most teams fine-tune, not pretrain.',
      howItWorks: [
        {
          type: 'p',
          text: 'Start with a pretrained base or instruct model. Curate a task-specific dataset (input/output pairs, or preferred/rejected pairs for DPO). Train with the same next-token objective but a much smaller learning rate (1e-5 to 5e-5, vs. 1e-3 to 3e-4 for pretraining) for 1–5 epochs. Use a cosine schedule with warmup. Monitor validation loss to detect overfitting. The result is a model that performs much better on your task, often at the cost of slight degradation on out-of-domain tasks ("catastrophic forgetting").'
        },
        { type: 'h3', text: 'When to fine-tune vs. prompt vs. RAG' },
        {
          type: 'table',
          headers: ['Need', 'Best approach'],
          rows: [
            ['Add new knowledge (facts, documents)', 'RAG — fine-tuning cannot reliably add facts'],
            ['Change output format or style', 'Few-shot prompting or SFT'],
            ['Specialize on a domain\'s vocabulary/jargon', 'Fine-tuning (especially continued pretraining)'],
            ['Improve at a specific task with examples', 'Fine-tuning (LoRA)'],
            ['Add a new tool or capability', 'Prompt engineering or fine-tuning with tool-use examples'],
            ['Make the model safer or more aligned', 'RLHF / DPO']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Fine-tuning does not add knowledge',
          text: 'A common misconception: "fine-tune the model on our docs so it knows them." This rarely works well — the model learns surface patterns, not the underlying facts, and forgets them quickly. For adding knowledge, RAG is almost always better. Fine-tune for behavior, style, and format; use RAG for facts.'
        },
        { type: 'h3', text: 'Full vs. parameter-efficient fine-tuning' },
        {
          type: 'p',
          text: 'Full fine-tuning updates all parameters — best quality, but needs as much GPU memory as pretraining (a 70B model needs 70B × 16 bytes = 1.1TB for fp16 weights + AdamW states + gradients). Parameter-efficient fine-tuning (PEFT) methods like LoRA add a small number of trainable parameters (often <1% of total) and keep the base frozen — needs only the frozen weights in memory plus the small LoRA adapters. LoRA gives 95%+ of full-FT quality at <5% of the cost, and is the production default.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Full fine-tuning of a Llama 3 8B model with Hugging Face Trainer',
          code: `import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

model_id = "meta-llama/Llama-3.1-8B-Instruct"
model = AutoModelForCausalLM.from_pretrained(
    model_id, torch_dtype=torch.bfloat16, device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained(model_id)

dataset = load_dataset("your-org/your-task", split="train")

config = SFTConfig(
    output_dir="./finetuned",
    num_train_epochs=3,
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,           # effective batch 16
    learning_rate=2e-5,                      # small LR for fine-tuning
    warmup_ratio=0.03,
    lr_scheduler_type="cosine",
    bf16=True,
    save_strategy="epoch",
    logging_steps=20,
)

trainer = SFTTrainer(model=model, args=config,
                     train_dataset=dataset, processing_class=tokenizer)
trainer.train()

# Caveats for full fine-tuning:
# - 8B in bf16 needs ~16GB weights + ~48GB AdamW states = ~64GB VRAM
# - Use FSDP or DeepSpeed to shard across multiple GPUs
# - LoRA (next lesson) is far cheaper and usually good enough.`
        }
      ],
      examples: [
        { type: 'p', text: 'A medical Q&A model: take Llama 3 8B Instruct, fine-tune on 50K (medical question, expert answer) pairs from your hospital\'s anonymized records. The result answers medical questions with your institution\'s preferred terminology, citations, and disclaimers. Cost: ~$100 of GPU time. Quality on medical Q&A jumps from ~70% (base) to ~92% (fine-tuned).' },
        { type: 'p', text: 'A support chatbot: fine-tune on (customer ticket, ideal response) pairs. The model learns your product\'s terminology, escalation rules, and tone. Compare to RAG-only: RAG retrieves relevant docs but does not learn the tone or routing rules. Most production support bots do both — fine-tune for behavior, RAG for product docs.' }
      ],
      advantages: [
        '1000× cheaper than pretraining.',
        'Specializes a general model for your task with a small dataset.',
        'LoRA/QLoRA make it feasible on a single GPU.',
        'Multiple fine-tunes can share one base model — adapters are tiny (10–100MB).'
      ],
      disadvantages: [
        'Catastrophic forgetting — fine-tuning can degrade general capabilities.',
        'Cannot reliably add new factual knowledge (use RAG for that).',
        'Sensitive to dataset quality and learning rate.',
        'Full fine-tuning needs as much memory as pretraining — PEFT is the practical alternative.'
      ],
      commonMistakes: [
        'Fine-tuning to add knowledge — RAG is better for facts.',
        'Using too high a learning rate — destroys pretraining knowledge.',
        'Not holding out a validation set — overfitting is silent.',
        'Forgetting to evaluate on out-of-domain tasks to detect catastrophic forgetting.'
      ],
      limitations: [
        'Fine-tuning is bounded by what the base model can do — it cannot add fundamentally new capabilities.',
        'Distributed fine-tuning of large models (70B+) requires significant infrastructure.',
        'Fine-tuned models need retraining when the base model or task changes.'
      ],
      relatedConcepts: ['Pretraining', 'Instruction Tuning', 'LoRA', 'QLoRA', 'Catastrophic Forgetting'],
      faq: [
        { q: 'Full fine-tuning vs. LoRA — when to use which?', a: 'Start with LoRA — it gives 95%+ of full-FT quality at 1% of the cost. Use full FT only when you have abundant data, abundant compute, and need the last few percent of quality.' },
        { q: 'How do I avoid catastrophic forgetting?', a: 'Use a small learning rate (1e-5 to 5e-5), few epochs (1–3), and mix some general data into your fine-tuning set. LoRA mitigates forgetting naturally because base weights are frozen.' }
      ],
      summary:
        'Fine-tuning specializes a pretrained model on your task at 1/1000 the cost of pretraining. Use it for behavior, style, and format — not for adding facts (use RAG). LoRA is the production default because it gives near-full-FT quality at a fraction of the cost. Watch for catastrophic forgetting by evaluating on out-of-domain tasks. Most production LLM deployments combine a fine-tuned model with RAG for facts.'
    },

    // ------------------------------------------------------------------
    // 22. LORA AND QLORA
    // ------------------------------------------------------------------
    {
      id: 'lora-qlora',
      title: 'LoRA and QLoRA',
      subtitle: 'Train a tiny adapter on top of a frozen model — 1% of the parameters, 95% of the quality.',
      tags: ['lora', 'qlora', 'peft', 'training'],
      readingMinutes: 8,
      definition:
        'LoRA (Low-Rank Adaptation) freezes a pretrained model\'s weights and inserts small trainable low-rank matrices ("adapters") alongside selected weight matrices. The forward pass becomes W·x + B·A·x where A and B are small (rank r, typically 8–64). Only A and B are trained — <1% of the parameters. QLoRA extends LoRA by quantizing the frozen base model to 4-bit before training, fitting 70B-model fine-tuning on a single 48GB GPU.',
      whyItExists:
        'Full fine-tuning of large models requires enormous memory: a 70B model needs ~1.1TB of VRAM for weights + gradients + AdamW optimizer states. Only the largest organizations can do this. LoRA exists because most of the "change" needed for fine-tuning is low-rank — a few directions in weight space matter; the rest can stay frozen. By training only those directions (typically <1% of parameters), LoRA achieves 95%+ of full-FT quality at <5% of the cost. QLoRA makes it feasible on consumer hardware.',
      howItWorks: [
        { type: 'h3', text: 'The LoRA math' },
        {
          type: 'p',
          text: 'For a weight matrix W of shape [d_out, d_in], LoRA adds two small matrices A: [r, d_in] and B: [d_out, r], where r << min(d_out, d_in) — typically r=8 to 64. The forward pass becomes y = W·x + B·A·x, with W frozen and only A, B trained. A is initialized with random Gaussian, B with zeros, so initially B·A = 0 and the model behaves exactly like the base. Total trainable params per layer: 2·r·(d_in + d_out) — for r=8 and d=4096, that\'s ~130K params per layer, vs. 16M for the full weight. ~80× reduction.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Fine-tuning Llama 3 8B with LoRA via Hugging Face PEFT',
          code: `import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from trl import SFTTrainer, SFTConfig
from datasets import load_dataset

model_id = "meta-llama/Llama-3.1-8B-Instruct"

# QLoRA: load base model in 4-bit (needs bitsandbytes)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.bfloat16,
    load_in_4bit=True,           # QLoRA: 4-bit base
    device_map="auto",
)
model = prepare_model_for_kbit_training(model)

tokenizer = AutoTokenizer.from_pretrained(model_id)

# LoRA configuration: which matrices to adapt, rank r, scaling alpha
peft_config = LoraConfig(
    r=16,                        # rank -- the key hyperparameter
    lora_alpha=32,               # scaling = alpha/r; usually 2*r
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
)

# Wrap the base model with LoRA adapters
model = get_peft_model(model, peft_config)
model.print_trainable_parameters()
# trainable params: 42,558,976 || all params: 8,073,644,032 || 0.53% trainable

dataset = load_dataset("your-org/your-task", split="train")
config = SFTConfig(
    output_dir="./lora-llama3",
    num_train_epochs=3,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,
    learning_rate=2e-4,           # 10x larger than full FT -- LoRA is stable
    bf16=True,
    save_strategy="epoch",
)
trainer = SFTTrainer(model=model, args=config, train_dataset=dataset,
                     processing_class=tokenizer)
trainer.train()
trainer.save_model("./lora-llama3")   # saves ~100MB adapter, not 16GB base`
        },
        { type: 'h3', text: 'QLoRA: LoRA on a 4-bit base' },
        {
          type: 'p',
          text: 'QLoRA (Dettmers et al., 2023) combines 4-bit NormalFloat quantization of the frozen base model with LoRA adapters trained in bf16. The frozen base shrinks 4× (e.g. Llama 3 70B from 140GB to ~35GB), and only the LoRA adapters are updated. This fits 70B fine-tuning on a single 48GB GPU. The 4-bit base introduces minimal quality loss because LoRA gradients flow through the high-precision adapters, not the quantized base. QLoRA democratized LLM fine-tuning — it is the standard for anyone without a cluster.'
        },
        { type: 'h3', text: 'Hyperparameter choices' },
        {
          type: 'table',
          headers: ['Hyperparameter', 'Typical value', 'Effect'],
          rows: [
            ['Rank r', '8 (small) – 64 (large)', 'Higher = more capacity, more overfitting risk'],
            ['Alpha', '2 × r', 'Scales LoRA contribution; alpha/r is the effective learning rate boost'],
            ['Target modules', 'All linear (q,k,v,o,gate,up,down)', 'More modules = better quality, more params'],
            ['Dropout', '0.05–0.1', 'Regularization; often 0 for small r'],
            ['Learning rate', '1e-4 to 5e-4', '~10× higher than full FT; LoRA is stable at high LR']
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'LoRA adapters are tiny and swappable',
          text: 'A LoRA adapter for Llama 3 8B is ~50MB. The base model is ~16GB. You can serve 100 different fine-tunes from a single base model by hot-swapping adapters — far cheaper than 100 full fine-tunes. This is the basis of "multi-tenant LoRA serving" (e.g. LoRAX).'
        }
      ],
      examples: [
        { type: 'p', text: 'A typical QLoRA setup: Llama 3 8B Instruct in 4-bit (~5GB VRAM), LoRA rank 16 on all linear layers (~40M trainable params, 0.5% of total), trained on a single 24GB RTX 4090. Total cost for a 3-epoch fine-tune on 50K examples: ~$5 of GPU time. Quality on the target task: typically within 1–3% of full fine-tuning.' },
        { type: 'p', text: 'A common deployment pattern: one base Llama 3 70B (loaded once, ~35GB in 4-bit) with multiple LoRA adapters — one per customer or use case. Each request routes to the right adapter. The base model\'s weights stay in GPU memory; only the small adapters swap in/out. This is how LoRA-serving systems (LoRAX, vLLM\'s multi-LoRA mode) achieve high throughput.' }
      ],
      advantages: [
        'Trains <1% of parameters — minimal memory and compute.',
        'QLoRA fits 70B fine-tuning on a single consumer GPU.',
        'Adapters are tiny (10–100MB), swappable, and composable.',
        'Base weights are frozen — no catastrophic forgetting of base capabilities.',
        'Higher learning rates are stable, so fewer epochs are needed.'
      ],
      disadvantages: [
        'Slightly lower quality than full fine-tuning on large datasets (~1–3%).',
        'Rank r is a hyperparameter — too low underfits, too high overfits.',
        'Adapter inference adds a small per-token overhead (the B·A·x matrix multiply).',
        'Multi-LoRA serving requires careful scheduling to amortize the base model load.'
      ],
      commonMistakes: [
        'Using too low a rank (r=4) when the task needs more capacity — underfitting.',
        'Targeting only attention matrices (q,k,v,o) — adding the FFN (gate, up, down) typically gives a meaningful quality boost.',
        'Using the same learning rate as full fine-tuning (1e-5) — LoRA needs ~10× higher (1e-4 to 5e-4) because gradients are diluted.',
        'Forgetting to merge the adapter into the base for production (unless you are using multi-LoRA serving).'
      ],
      limitations: [
        'For very large fine-tune datasets (>1M examples), full fine-tuning eventually wins on quality.',
        'QLoRA\'s 4-bit base introduces small quality loss vs. fp16 base + LoRA.',
        'Adapters are task-specific — combining multiple adapters via merging is approximate.'
      ],
      relatedConcepts: ['Fine-Tuning', 'Quantization', 'PEFT', 'Adapters', 'Multi-LoRA Serving'],
      faq: [
        { q: 'What rank should I use?', a: 'Start with r=16 and alpha=32. For simple style/format tasks, r=8 suffices. For complex domain adaptation (medical, legal), r=64 may help. Higher rank gives more capacity but more overfitting risk and more adapter memory.' },
        { q: 'Can I merge LoRA back into the base model?', a: 'Yes — peft\'s merge_and_unload() folds B·A into the original W, producing a single standard model. Merged models have zero inference overhead but lose the ability to swap adapters. Merge for production unless you are multi-tenant.' }
      ],
      summary:
        'LoRA freezes the base model and trains small low-rank adapters alongside selected weight matrices — <1% of parameters, 95%+ of full-FT quality. QLoRA quantizes the base to 4-bit, enabling 70B fine-tuning on a single GPU. Adapters are tiny, swappable, and avoid catastrophic forgetting. LoRA/QLoRA is the production default for fine-tuning; full fine-tuning is reserved for the largest teams and datasets.'
    },

    // ------------------------------------------------------------------
    // 23. RLHF AND PREFERENCE OPTIMIZATION
    // ------------------------------------------------------------------
    {
      id: 'rlhf-preference-optimization',
      title: 'RLHF and Preference Optimization',
      subtitle: 'Aligning LLMs with human preferences — PPO, DPO, and the modern alignment stack.',
      tags: ['rlhf', 'dpo', 'ppo', 'alignment', 'training'],
      readingMinutes: 8,
      definition:
        'RLHF (Reinforcement Learning from Human Feedback) trains an LLM to produce outputs humans prefer, using a reward model trained on human preference comparisons. DPO (Direct Preference Optimization, 2023) achieves the same goal without a separate reward model by directly optimizing a contrastive loss on preference pairs. Both follow SFT in the standard pipeline and produce the "aligned" model users actually interact with.',
      whyItExists:
        'SFT teaches a model to follow instructions, but not which responses are *better*. Two responses can both be valid instructions-following yet differ in helpfulness, honesty, harmlessness, and tone. SFT only sees one "correct" answer per prompt. RLHF and DPO exist to optimize the *preference* signal — given two responses A and B, A is preferred — which is much easier for humans to provide than absolute quality labels. This is what makes modern chat models helpful and safe rather than just instruction-following.',
      howItWorks: [
        { type: 'h3', text: 'Classic RLHF (PPO) — three stages' },
        {
          type: 'ol',
          items: [
            'Train a reward model: collect human preference pairs (prompt, response_A, response_B, which_is_better). Fine-tune a separate model to predict the preference as a scalar reward r(prompt, response).',
            'Initialize the policy from the SFT model. Generate responses, score them with the reward model, and update the policy with PPO to maximize reward.',
            'Add a KL-divergence penalty: the policy must stay close to the SFT model, otherwise it finds adversarial "reward hacks" (e.g. repeating keywords the reward model likes).'
          ]
        },
        { type: 'h3', text: 'DPO — direct preference optimization' },
        {
          type: 'p',
          text: 'DPO skips the reward model and PPO entirely. The key mathematical insight: the optimal policy under a KL-constrained reward objective has a closed form, so you can derive a loss function directly on the policy that implicitly defines the reward. The DPO loss is a contrastive binary cross-entropy: -log σ(β · [log π(y_w|x)/π_ref(y_w|x) - log π(y_l|x)/π_ref(y_l|x)]), where y_w is the preferred ("winner") response, y_l the rejected ("loser"), π is the policy, π_ref is the frozen SFT model, and β controls the KL penalty strength.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'DPO loss sketch in PyTorch (the actual training loop wraps the SFT model)',
          code: `import torch
import torch.nn.functional as F

def dpo_loss(policy_logps_w, policy_logps_l,
             ref_logps_w, ref_logps_l, beta=0.1):
    """
    policy_logps_w: log P(y_w | x) under the policy (preferred response)
    policy_logps_l: log P(y_l | x) under the policy (rejected response)
    ref_logps_*:    same, under the frozen reference (SFT) model
    beta:           KL penalty strength (0.1 typical)
    """
    # log-ratio of policy vs. reference for each response
    logratio_w = policy_logps_w - ref_logps_w
    logratio_l = policy_logps_l - ref_logps_l

    # The DPO objective: maximize log sigma(beta * (logratio_w - logratio_l))
    # Equivalently minimize the negative log-sigmoid:
    logits = beta * (logratio_w - logratio_l)
    loss = -F.logsigmoid(logits).mean()
    return loss

# During training:
# 1. Compute log P(y_w | x) and log P(y_l | x) under the policy
#    (forward pass through the trainable model, sum token log-probs)
# 2. Compute the same under the frozen reference (no grad)
# 3. Backprop the DPO loss to update the policy.
#
# No reward model, no PPO, no RL instability -- just supervised
# contrastive learning on preference pairs. Simpler, cheaper, more
# stable than classic RLHF, and often higher quality.`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why DPO displaced PPO',
          text: 'PPO is unstable (RL hyperparameters are notoriously finicky), requires training a separate reward model, and is expensive (4 models in memory: policy, ref, reward, value). DPO needs only the policy and the frozen reference, has no RL hyperparameters, and converges in a fraction of the time. Most post-2024 alignment uses DPO or its variants (IPO, KTO, SimPO).'
        },
        { type: 'h3', text: 'Modern variants' },
        {
          type: 'ul',
          items: [
            'IPO (Identity Preference Optimization): regularized DPO that does not overfit to preference noise.',
            'KTO (Kahneman-Tversky Optimization): uses single-sided signals (good/bad) instead of pairs — easier data collection.',
            'SimPO (Simple Preference Optimization): length-normalized DPO without a reference model — even simpler.',
            'ORPO: combines SFT and preference optimization in a single stage.',
            'Constitutional AI (Anthropic): replaces human preferences with model-graded preferences against a "constitution" — scales better.'
          ]
        },
        {
          type: 'table',
          headers: ['Method', 'Needs reward model?', 'Needs reference?', 'Stability', 'Used by'],
          rows: [
            ['RLHF (PPO)', 'Yes', 'Yes (for KL)', 'Low (RL finicky)', 'GPT-3.5/4 (original), Claude 1'],
            ['DPO', 'No', 'Yes (frozen)', 'High', 'Llama 3, Mistral, Zephyr'],
            ['KTO', 'No', 'Yes', 'High', 'Some 2024 models'],
            ['SimPO', 'No', 'No', 'High', 'Mistral-Large, some 2024 models'],
            ['Constitutional AI', 'Yes (AI-graded)', 'Yes', 'Medium', 'Claude 2/3+']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'A typical preference dataset entry: prompt "How do I make a bomb?", response_A (refuses politely with explanation), response_B (provides bomb-making instructions). Human rater marks A as preferred. After DPO training on thousands of such pairs, the model becomes more likely to refuse harmful requests even when phrased differently. This is the basic mechanism of LLM safety alignment.' },
        { type: 'p', text: 'Llama 3 alignment used multiple rounds of DPO on ~10M preference pairs collected from human raters and from earlier Llama models rejecting their own outputs. The base → SFT → DPO pipeline transformed a model that occasionally produced harmful or low-quality outputs into a chat assistant comparable to GPT-4. The total alignment cost was a tiny fraction of pretraining.' }
      ],
      advantages: [
        'Optimizes human preference, which is easier to elicit than absolute quality.',
        'DPO is simple, stable, and cheap — no RL infrastructure required.',
        'Produces helpful, harmless, honest behavior — the qualities users actually want.',
        'Composable with SFT and continued pretraining in a single pipeline.'
      ],
      disadvantages: [
        'PPO is complex, unstable, and requires 4 models in memory — costly and finicky.',
        'Preference data is expensive to collect (humans must compare responses).',
        'Reward hacking: models learn to game the reward signal without genuinely improving.',
        'Can reduce output diversity (mode collapse) and degrade capabilities if over-optimized.'
      ],
      commonMistakes: [
        'Applying DPO without an SFT model as the reference — the loss assumes a reasonable starting distribution.',
        'Using too high a beta (KL penalty too strong) — model does not move from SFT; too low — reward hacking.',
        'Confusing "RLHF" with "alignment" — alignment is the goal; RLHF/DPO/KTO/SimPO are means.',
        'Ignoring reward hacking — always inspect model outputs qualitatively, not just the reward curve.'
      ],
      limitations: [
        'Alignment quality is bounded by the preference data — biased raters produce biased models.',
        'Cannot align a model against behaviors absent from the preference data.',
        'Over-alignment ("alignment tax") degrades general capability — the art is balancing helpfulness, harmlessness, and honesty.'
      ],
      relatedConcepts: ['Instruction Tuning', 'Reward Models', 'PPO', 'Constitutional AI', 'Alignment'],
      faq: [
        { q: 'Is DPO always better than RLHF?', a: 'For most teams, yes — it is simpler, cheaper, more stable, and produces comparable or better quality. PPO may still win for complex multi-turn or agentic alignment, but for chat assistants DPO is the default.' },
        { q: 'How much preference data do I need?', a: 'For DPO, 10K–100K high-quality pairs is often enough. For broad alignment (Llama 3-scale), millions. Quality matters more than quantity — clean pairs from expert raters beat noisy pairs from crowdsourcing.' }
      ],
      summary:
        'RLHF and preference optimization align LLMs with human preferences after SFT. Classic RLHF (PPO) trains a reward model and optimizes the policy with RL — powerful but unstable. DPO directly optimizes a contrastive loss on preference pairs without a reward model — simpler, cheaper, and now the default. The SFT → DPO pipeline produces the helpful, safe chat assistants users actually interact with. Alignment quality is bounded by the preference data, not the algorithm.'
    },

    // ------------------------------------------------------------------
    // 24. INFERENCE AND KV CACHING
    // ------------------------------------------------------------------
    {
      id: 'inference-kv-cache',
      title: 'Inference and KV Caching',
      subtitle: 'The optimization that makes autoregressive generation tractable.',
      tags: ['inference', 'kv-cache', 'serving', 'core'],
      readingMinutes: 8,
      definition:
        'KV caching is the inference optimization that stores the Keys and Values computed for previous tokens so they need not be recomputed when generating the next token. Without it, generating token t+1 requires reprocessing all t previous tokens — O(T²) total for a T-token generation. With KV caching, generation is O(T) — each new token only requires computing one new query\'s attention against the cached keys/values. KV caching is the difference between seconds and minutes per response.',
      whyItExists:
        'Autoregressive generation is inherently sequential: token t+1 depends on token t. Without caching, every step recomputes the K and V for all earlier tokens — wasted work, because the K and V for a given token depend only on that token (and its input embedding), not on later tokens. Caching them eliminates the redundant computation. The trade-off is memory: the KV cache grows linearly with sequence length, often becoming the dominant memory cost at long contexts. The prefill vs. decode distinction and techniques like paged KV (vLLM) exist to manage this trade-off.',
      howItWorks: [
        { type: 'h3', text: 'Prefill vs. Decode' },
        {
          type: 'p',
          text: 'Inference has two phases. Prefill: process the entire input prompt in parallel, computing and caching K/V for every input token. This is compute-bound (one big matrix multiply). Decode: generate one token at a time, each requiring one forward pass with a single new query attending against the cached K/V. Decode is memory-bandwidth-bound (small matmuls, large weight loads) and is the slow phase. Most latency in long generations is decode; most compute is prefill.'
        },
        { type: 'h3', text: 'The KV cache size' },
        {
          type: 'p',
          text: 'Per token, the cache stores K and V across all layers and all KV heads: size = 2 (K+V) × n_layers × n_kv_heads × d_k × bytes_per_element. For Llama 3 70B (80 layers, 8 KV heads, d_k=128, bf16): 2 × 80 × 8 × 128 × 2 = 327KB per token. A 4K-token context: 1.3GB. A 128K-token context: 41GB — comparable to the model itself. This is why GQA (fewer KV heads) is so valuable: it shrinks the cache 8× vs. MHA.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'KV cache logic, conceptually (real impls use FlashAttention and paged memory)',
          code: `import torch
import torch.nn.functional as F

# Self-attention WITH KV cache, single decoder step
def attention_step(x_new, kv_cache, Wq, Wk, Wv, Wo, n_heads, d_k):
    """
    x_new:     [B, 1, d_model]   -- embedding of the just-generated token
    kv_cache:  dict with 'K' and 'V', each [B, n_kv_heads, T_past, d_k]
                (or None on the first step)
    Returns: out [B, 1, d_model] and updated kv_cache
    """
    B = x_new.shape[0]

    # 1. Compute Q, K, V for ONLY the new token
    q = Wq(x_new).reshape(B, 1, n_heads, d_k).transpose(1, 2)   # [B, h, 1, d_k]
    k_new = Wk(x_new).reshape(B, 1, n_kv_heads, d_k).transpose(1, 2)
    v_new = Wv(x_new).reshape(B, 1, n_kv_heads, d_k).transpose(1, 2)

    # 2. Append new K, V to the cache
    if kv_cache is None:
        k, v = k_new, v_new
    else:
        k = torch.cat([kv_cache["K"], k_new], dim=2)   # [B, h, T_past+1, d_k]
        v = torch.cat([kv_cache["V"], v_new], dim=2)
    kv_cache = {"K": k, "V": v}

    # 3. Attention: 1 query attends to T_past+1 keys
    #    For GQA: q has n_heads, k/v have n_kv_heads; repeat k/v to match
    scores = (q @ k.transpose(-2, -1)) / (d_k ** 0.5)  # [B, h, 1, T_past+1]
    # No causal mask needed -- the single query is at position T_past,
    # and all cached keys are at positions <= T_past (no future to mask).
    attn = F.softmax(scores, dim=-1)
    out = attn @ v                                       # [B, h, 1, d_k]
    out = out.transpose(1, 2).reshape(B, 1, -1)
    return Wo(out), kv_cache

# Generation loop:
# 1. Prefill: run the full model on the prompt; populate kv_cache.
# 2. Decode: for each new token, call attention_step once per layer.
#    The cache grows by 1 entry per layer per step.
# 3. Stop when EOS is sampled or max length is reached.`
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'No causal mask needed during decode',
          text: 'During decode, the single new query is at position T_past (the last position). All cached keys are at positions ≤ T_past — there is no "future" to mask. The causal mask is only needed during prefill, when all positions are computed in parallel. This is a small but useful simplification in serving code.'
        },
        { type: 'h3', text: 'Paged KV caching (vLLM)' },
        {
          type: 'p',
          text: 'Naive KV caching pre-allocates a contiguous buffer for max_seq_len per request — wastes memory when sequences are short, fragments when they grow. vLLM\'s PagedAttention borrows the OS paging idea: the KV cache is split into fixed-size blocks (e.g. 16 tokens each), and each sequence has a table mapping logical blocks to physical blocks. This enables 2–4× higher throughput by eliminating fragmentation and allowing fine-grained memory sharing (e.g. for parallel sampling or shared prefixes).'
        },
        {
          'type': 'table',
          'headers': ['Phase', 'What it computes', 'Bottleneck', 'Time per token'],
          'rows': [
            ['Prefill (prompt)', 'K, V for every input token (parallel)', 'Compute (matmul-bound)', 'Microseconds/token (parallel)'],
            ['Decode (generation)', 'One new Q attended to cached K, V', 'Memory bandwidth (weight loads)', 'Milliseconds/token (sequential)'],
            ['Total (1000-token gen)', '1 prefill + 1000 decodes', '—', 'Dominated by decode']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'Generating 500 tokens after a 100-token prompt: prefill processes 100 tokens in ~10ms (parallel). Decode runs 500 steps of ~5ms each (sequential, memory-bound). Total: ~2.5s. Without KV caching, each decode step would reprocess all previous tokens — step 500 would take 100× longer than step 1, and total time would be ~125s. KV caching makes autoregressive generation 50× faster.' },
        { type: 'p', text: 'vLLM serves 10× more concurrent requests than naive Hugging Face pipelines on the same hardware, primarily through PagedAttention. The win comes from packing many variable-length sequences into a shared KV cache pool — without paging, you either pre-allocate max-length buffers (waste) or copy/move tensors (slow).' }
      ],
      advantages: [
        'Turns O(T²) generation into O(T) — essential for any real deployment.',
        'Lets the model attend to cached K/V without recomputation.',
        'Paged KV (vLLM) eliminates fragmentation and enables 2–10× throughput.',
        'Composes with GQA, quantization, and batching for further gains.'
      ],
      disadvantages: [
        'KV cache grows linearly with context — dominant memory cost at long contexts.',
        'Each concurrent request needs its own KV cache — memory scales with batch size.',
        'Without paging, fragmentation wastes 30–60% of memory.'
      ],
      commonMistakes: [
        'Forgetting to populate the KV cache correctly when batched — off-by-one or wrong layer assignment causes silent quality degradation.',
        'Allocating KV cache based on max_seq_len instead of using paging — wastes memory and limits batch size.',
        'Comparing "tokens per second" across systems without accounting for batch size, context length, and prefill vs. decode.',
        'Ignoring the prefill/decode distinction when optimizing — prefill is compute-bound, decode is memory-bound; different optimizations apply.'
      ],
      limitations: [
        'KV cache is per-request and per-session — cannot be shared across unrelated requests.',
        'Prefix caching (sharing cache for shared prompts) helps but only for identical prefixes.',
        'Very long contexts make the cache prohibitively large, motivating sparse attention and SSM alternatives.'
      ],
      relatedConcepts: ['Self-Attention', 'Grouped-Query Attention', 'vLLM', 'PagedAttention', 'Prefill vs Decode'],
      faq: [
        { q: 'How much memory does the KV cache use?', a: 'Per token: 2 × n_layers × n_kv_heads × d_k × bytes. For Llama 3 70B in bf16: ~327KB/token. A 32K context uses ~10GB; a 128K context uses ~41GB. GQA reduces this 8× vs. MHA.' },
        { q: 'Can I share the KV cache across requests?', a: 'Only for shared prefixes (e.g. a common system prompt). Prefix caching in vLLM and SGLang exploits this. Otherwise, each request\'s cache is independent because the K/V depend on the full sequence.' }
      ],
      summary:
        'KV caching stores computed Keys and Values for previous tokens so they need not be recomputed — turning O(T²) generation into O(T). Prefill (parallel, compute-bound) processes the prompt; decode (sequential, memory-bound) generates one token at a time. The cache grows linearly with context, often dominating memory at long contexts — GQA and paged KV caching (vLLM) mitigate this. KV caching is the single most important inference optimization in LLM serving.'
    },

    // ------------------------------------------------------------------
    // 25. QUANTIZATION
    // ------------------------------------------------------------------
    {
      id: 'quantization',
      title: 'Quantization',
      subtitle: 'Compressing models from fp16 to int8/int4 — less memory, faster inference, minimal quality loss.',
      tags: ['quantization', 'inference', 'optimization'],
      readingMinutes: 7,
      definition:
        'Quantization reduces the precision of model weights (and sometimes activations) from 16-bit floats to 8-bit or 4-bit integers. A 70B model shrinks from 140GB (fp16) to 70GB (int8) or 35GB (int4) — fitting on smaller and fewer GPUs. Quality loss is typically <1% on standard benchmarks. Quantization is the dominant technique for cost-effective LLM deployment; almost no one serves frontier LLMs in fp16.',
      whyItExists:
        'LLM inference is memory-bound: the dominant cost is loading weights from HBM into compute units, not the compute itself. Smaller weights load faster (and fit on cheaper GPUs). 4-bit quantization gives 4× memory reduction and 2–4× speedup, with minimal quality loss, because LLM weights are highly redundant — most bits encode noise that does not affect outputs. Without quantization, deploying 70B+ models would require multi-GPU setups costing $30K+; with it, a single $2K RTX 4090 can run Llama 3 70B (in int4).',
      howItWorks: [
        { type: 'h3', text: 'Weight-only vs. weight+activation quantization' },
        {
          type: 'p',
          text: 'Weight-only quantization (most common for LLMs) converts only the weight matrices to int8/int4, leaving activations in fp16. At inference, weights are dequantized on the fly into fp16/bf16 for the matmul, or used directly with int8/int4 matmul kernels (faster). Weight+activation quantization (typical for vision models) converts both, requiring calibration data to find good activation scales. For LLMs, weight-only is preferred because activations have outliers that make uniform int8 quantization hard.'
        },
        { type: 'h3', text: 'Common methods' },
        {
          type: 'p',
          text: 'GPTQ: post-training quantization that solves for int4 weights minimizing output error per layer, using calibration data. AWQ (Activation-aware Weight Quantization): observes that some weight channels are more important (because they process large activations) and protects them with higher precision. GGUF (llama.cpp): a popular format supporting 2–8 bit quantization with k-quants (e.g. Q4_K_M) that mix precisions for better quality. bitsandbytes: simple NF4 quantization used by QLoRA. Each has quality/speed tradeoffs.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Quantizing and running a Llama 3 8B model in 4-bit with bitsandbytes',
          code: `import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

# 4-bit quantization config (NF4 -- NormalFloat4, designed for LLMs)
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,   # dequantize-to-compute type
    bnb_4bit_use_double_quant=True,           # quantize the scales too
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.1-8B-Instruct",
    quantization_config=bnb_config,
    device_map="auto",
)
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")

print(f"Memory: {model.get_memory_footprint() / 1e9:.2f} GB")
# fp16 would be ~16 GB; nf4 is ~5 GB.

# Inference works exactly the same as fp16
prompt = "Explain KV caching in two sentences."
inputs = tokenizer.apply_chat_template(
    [{"role": "user", "content": prompt}],
    add_generation_prompt=True, return_tensors="pt",
).to(model.device)
out = model.generate(inputs, max_new_tokens=100, temperature=0.7)
print(tokenizer.decode(out[0], skip_special_tokens=True))`
        },
        {
          type: 'table',
          headers: ['Method', 'Bits', 'Quality loss', 'Speed', 'Use case'],
          rows: [
            ['fp16 (baseline)', '16', '0%', '1×', 'Reference; high-memory GPUs'],
            ['int8 (bitsandbytes)', '8', '~0.5%', '1.5×', 'Cheap 2× memory savings'],
            ['NF4 (bitsandbytes)', '4', '~1–2%', '2×', 'QLoRA training, consumer GPUs'],
            ['GPTQ', '4', '~1%', '2–3×', 'High-throughput serving'],
            ['AWQ', '4', '~0.5%', '2–3×', 'Production serving (vLLM, SGLang)'],
            ['GGUF Q4_K_M (llama.cpp)', '~4.5 (mixed)', '~1%', '2× (CPU-friendly)', 'CPU/Mac deployment']
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why 4-bit works',
          text: 'LLM weights are highly redundant — most of the 16 bits per weight are noise. Research shows that ~6 bits per weight is essentially lossless, and 4 bits loses <1% on benchmarks. Below 3 bits, quality degrades sharply. The sweet spot for deployment is 4-bit; for training (QLoRA), 4-bit base with high-precision LoRA adapters.'
        },
        { type: 'h3', text: 'Per-layer mixed precision' },
        {
          type: 'p',
          text: 'Not all layers quantize equally well. The first and last layers (embeddings, output head) are typically more sensitive and kept at higher precision. Some layers have outlier channels that need higher precision. AWQ and GGUF\'s k-quants exploit this by mixing precisions — keeping sensitive layers/channels at 8-bit and the rest at 4-bit. This recovers most of the quality lost to uniform 4-bit quantization at minimal memory cost.'
        }
      ],
      examples: [
        { type: 'p', text: 'Llama 3 70B deployment options: (a) fp16, 140GB, needs 2×80GB H100s (~$60K of hardware); (b) int8 AWQ, 70GB, fits on 1×80GB H100 (~$30K); (c) int4 AWQ, 35GB, fits on 1×48GB L40 (~$8K) or 2×24GB RTX 4090s (~$4K). Quality loss from fp16 to int4: ~1% on MMLU. For most deployments, int4 is the right choice — 4× cheaper hardware for 1% quality.' },
        { type: 'p', text: 'Apple Silicon Macs run Llama 3 8B in GGUF Q4_K_M (~5GB) using llama.cpp, hitting ~30 tokens/sec on an M2 Max with 32GB unified memory. Without quantization, the same model would need ~16GB and run at half the speed. Quantization is what makes local LLMs practical on consumer hardware.' }
      ],
      advantages: [
        '2–4× memory reduction enables cheaper deployment.',
        '2–3× inference speedup (memory-bandwidth-bound workloads).',
        'Minimal quality loss at 4-bit (<1% on benchmarks).',
        'Composes with KV caching, GQA, and batching for cumulative gains.'
      ],
      disadvantages: [
        'Quality degrades below 3 bits — diminishing returns past 4-bit.',
        'Some methods (GPTQ, AWQ) require calibration data and offline conversion.',
        'Quantized kernels are hardware-specific — portability across GPUs is limited.',
        'Mixed-precision layers add complexity to serving code.'
      ],
      commonMistakes: [
        'Using int4 for the embedding/output layers — these are sensitive and should stay higher precision.',
        'Comparing quantized model benchmarks without verifying the quantization method (GPTQ vs AWQ vs NF4 are not interchangeable).',
        'Forgetting that activations may have outliers — naive int8 activation quantization can collapse quality.',
        'Using llama.cpp GGUF on a GPU server when vLLM with AWQ would be much faster — match the runtime to the hardware.'
      ],
      limitations: [
        'Quantization is post-hoc — it cannot add capability, only preserve it.',
        'Some model architectures (especially MoE) are harder to quantize well.',
        'Sub-3-bit quantization (e.g. 2-bit) requires specialized methods and has visible quality loss.'
      ],
      relatedConcepts: ['Inference', 'KV Caching', 'QLoRA', 'AWQ', 'GPTQ', 'llama.cpp'],
      faq: [
        { q: 'What quantization should I use?', a: 'For serving on NVIDIA GPUs: AWQ int4 via vLLM or SGLang. For QLoRA training: bitsandbytes NF4. For CPU/Mac: GGUF Q4_K_M via llama.cpp. For maximum quality: int8 AWQ.' },
        { q: 'Does quantization affect all models equally?', a: 'No. Larger models tolerate quantization better — a 70B model loses less at 4-bit than a 7B model. MoE models can be trickier because of the routing layers.' }
      ],
      summary:
        'Quantization reduces weight precision from fp16 to int8/int4, cutting memory 2–4× and speeding up inference 2–3× with <1% quality loss. Weight-only quantization (AWQ, GPTQ, GGUF) is the LLM standard; AWQ is the production default on GPUs, GGUF on CPUs/Macs. 4-bit is the sweet spot; below 3 bits, quality degrades. Quantization composes with KV caching, GQA, and batching to make frontier LLMs deployable on consumer hardware.'
    },

    // ------------------------------------------------------------------
    // 26. MODEL EVALUATION
    // ------------------------------------------------------------------
    {
      id: 'llm-evaluation',
      title: 'Model Evaluation',
      subtitle: 'How to measure whether an LLM is actually good — MMLU, HumanEval, MT-Bench, and beyond.',
      tags: ['evaluation', 'benchmarks', 'metrics'],
      readingMinutes: 7,
      definition:
        'LLM evaluation is the discipline of measuring model quality across capabilities (knowledge, reasoning, code, instruction-following) and risks (hallucination, bias, safety). It combines static benchmarks (MMLU, HumanEval, GSM8K), human evaluation, model-graded evaluation (LLM-as-judge), and behavioral tests. No single metric captures LLM quality — evaluation is always multi-dimensional and partly subjective.',
      whyItExists:
        'Without rigorous evaluation, you cannot tell whether a new model (or fine-tune, or prompt) actually improved things. LLMs are general-purpose, so any single benchmark misses most capabilities. They generate open-ended text, so there is no exact-match metric for most outputs. And capabilities interact nonlinearly — improving coding can hurt creative writing. Evaluation exists to make LLM development empirical rather than vibes-based; it is the discipline that separates serious model work from guessing.',
      howItWorks: [
        { type: 'h3', text: 'Static benchmarks' },
        {
          type: 'p',
          text: 'Standardized test sets with fixed prompts and automatic scoring. MMLU (Massive Multitask Language Understanding): 57 subjects, multiple-choice, tests knowledge. HumanEval: 164 Python coding problems, tests code generation. GSM8K: grade-school math word problems, tests multi-step reasoning. HellaSwag, ARC, TruthfulQA: common-sense, science, hallucination. Benchmarks are cheap, reproducible, and gameable — models overfit to popular benchmarks via contamination (the benchmark appears in pretraining data).'
        },
        { type: 'h3', text: 'LLM-as-judge (model-graded evaluation)' },
        {
          type: 'p',
          text: 'Use a strong LLM (GPT-4, Claude) to grade responses from the model under test. MT-Bench: 80 multi-turn questions, judged by GPT-4 on a 1–10 scale across dimensions (helpfulness, depth, reasoning). AlpacaEval: compare against a reference model and report win rate. LLM-as-judge correlates ~0.8 with human judgments for many tasks, is cheap, and scales — but has known biases (preferring longer responses, preferring its own style, position bias).'
        },
        { type: 'h3', text: 'Human evaluation' },
        {
          type: 'p',
          text: 'The gold standard for open-ended quality. Chatbot Arena (LMSYS): blind side-by-side comparisons from real users, Elo-rated — the most cited LLM leaderboard. Internal red-teaming: humans try to elicit harmful outputs. A/B testing in production: real users interact with two model versions and metrics (satisfaction, retention, thumbs-up) decide. Human eval is expensive and slow but irreplaceable for measuring what users actually experience.'
        },
        {
          type: 'table',
          headers: ['Benchmark', 'Capability', 'Format', 'Gameability risk'],
          rows: [
            ['MMLU', 'Broad knowledge', '57-subject multiple choice', 'High (likely in pretraining)'],
            ['HumanEval', 'Code generation', '164 Python problems, unit tests', 'Medium'],
            ['GSM8K', 'Math reasoning', 'Word problems, exact answer', 'High'],
            ['TruthfulQA', 'Hallucination resistance', 'Multiple choice + free-form', 'Medium'],
            ['MT-Bench', 'Chat quality (multi-turn)', 'LLM-graded on 1-10', 'Medium (judge bias)'],
            ['Chatbot Arena', 'Overall user preference', 'Blind human comparisons, Elo', 'Low (real users)']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Benchmark contamination',
          text: 'Popular benchmarks leak into pretraining data — models memorize answers without understanding. Always check for contamination (e.g. by paraphrasing questions or using newer benchmarks like MMLU-Pro). A model scoring 95% on MMLU may score 60% on a paraphrased version. Trust benchmarks that are recent, dynamic, or held private.'
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Always build your own eval',
          text: 'Public benchmarks measure general capability; your production task is specific. Curate 100–1000 examples representative of real user queries, with ideal responses or grading rubrics. Run this eval on every model change. This "golden set" is more valuable than any public benchmark for your product decisions.'
        }
      ],
      examples: [
        { type: 'p', text: 'Llama 3 70B\'s reported MMLU is ~82%. But MMLU is likely partially in its pretraining data. The honest signal is that on Chatbot Arena (real user blind comparisons), Llama 3 70B ranks near GPT-4-class — a different, more reliable indicator of real quality than the benchmark alone.' },
        { type: 'p', text: 'A startup building a support chatbot should not optimize for MMLU. They should build a 200-example "golden set" of real support queries with ideal answers, and run it after every fine-tune. MMLU going from 80% to 82% is irrelevant if their support quality goes from 90% to 85%.' }
      ],
      advantages: [
        'Static benchmarks are cheap, reproducible, and good for tracking progress.',
        'LLM-as-judge scales human-quality evaluation to thousands of examples.',
        'Human eval (Arena, A/B) captures real-world quality no benchmark can.',
        'Multi-dimensional evaluation exposes tradeoffs (e.g. capability vs. safety).'
      ],
      disadvantages: [
        'Benchmarks are gamed — contamination, overfitting, metric hacking.',
        'LLM-as-judge has biases (length, style, position) that distort scores.',
        'Human eval is expensive and slow.',
        'No single metric captures LLM quality — evaluation is always partial.'
      ],
      commonMistakes: [
        'Treating MMLU as a single "intelligence" score — it tests knowledge, not reasoning or instruction-following.',
        'Ignoring benchmark contamination — scores inflate without real capability gains.',
        'Optimizing for a public benchmark instead of your production task\'s golden set.',
        'Reporting only averages — distributions and per-category breakdowns reveal more.'
      ],
      limitations: [
        'Benchmarks lag behind model capabilities — new tasks need new benchmarks.',
        'Safety and alignment are hard to measure quantitatively.',
        'Cross-model comparisons are noisy — small score differences may not be meaningful.'
      ],
      relatedConcepts: ['Perplexity', 'Human Evaluation', 'LLM-as-Judge', 'Chatbot Arena', 'Benchmark Contamination'],
      faq: [
        { q: 'Which benchmark should I trust most?', a: 'Chatbot Arena for general quality (real users, blind comparisons). For code: HumanEval and its successor BigCodeBench. For your product: your own golden set. No public benchmark is sufficient alone.' },
        { q: 'How do I build my own eval?', a: 'Curate 100–1000 representative examples with ideal outputs or grading rubrics. Automate scoring (exact match, LLM-as-judge, or unit tests for code). Run after every model/prompt change. Treat the eval as a first-class engineering artifact — version it, review it, evolve it.' }
      ],
      summary:
        'LLM evaluation combines static benchmarks (MMLU, HumanEval), LLM-as-judge (MT-Bench), and human evaluation (Chatbot Arena, A/B tests). No single metric captures quality. Benchmarks are gameable and contaminated; LLM-judges have biases; human eval is slow. The discipline is to triangulate across methods and always maintain a task-specific golden set. Without rigorous eval, LLM development is guesswork.'
    },

    // ------------------------------------------------------------------
    // 27. HALLUCINATIONS AND REASONING LIMITATIONS
    // ------------------------------------------------------------------
    {
      id: 'llm-hallucinations-reasoning',
      title: 'Hallucinations and Reasoning Limitations',
      subtitle: 'Why LLMs make things up — and why multi-step reasoning is hard.',
      tags: ['hallucination', 'reasoning', 'limitations', 'safety'],
      readingMinutes: 8,
      definition:
        'Hallucination is when an LLM generates text that is fluent and confident but factually wrong, fabricated, or unsupported. It is an inherent property of next-token prediction: the model generates statistically plausible continuations, not verified truths. Reasoning limitations are the model\'s struggles with multi-step logical, mathematical, and causal reasoning — bounded by the depth of its forward pass and the absence of explicit search or verification.',
      whyItExists:
        'Hallucination exists because the LLM is trained to predict plausible text, not true text. There is no training signal for "is this fact correct" — only "is this what would come next". When the model lacks strong evidence for a fact, it falls back on plausible-sounding patterns, which can be wrong. Reasoning limitations exist because each forward pass is a fixed-depth computation: the model cannot iterate, backtrack, or verify its own intermediate steps. Chain-of-thought helps but is still bounded by what the attention and FFN can compute in N layers.',
      howItWorks: [
        { type: 'h3', text: 'Why hallucinations happen' },
        {
          type: 'p',
          text: 'Three causes dominate. (1) Knowledge gaps: the model was never trained on the fact, so it generalizes from related patterns — often correctly, sometimes wildly wrong. (2) Source confusion: the model blends facts from different sources ("Abraham Lincoln was the first president of the United States" — blends Lincoln and Washington). (3) Sycophancy: after RLHF, models tend to agree with user prompts even when the user is wrong, because agreeing was rewarded during preference data collection. All three stem from the same root: the model optimizes plausibility, not truth.'
        },
        { type: 'h3', text: 'Why reasoning is hard' },
        {
          type: 'p',
          text: 'A forward pass is a fixed-depth computation: N layers of attention + FFN. There is no loop, no memory across passes, no opportunity to verify intermediate results. For tasks requiring O(K) sequential steps (long arithmetic, multi-hop reasoning, planning), the model must compress all K steps into N layers — and N is fixed (typically 32–80). Chain-of-thought prompting helps by externalizing intermediate steps into the context, effectively giving the model more "passes", but it is still bounded by the context length and by errors compounding across steps. Models also lack a world model — they reason about text patterns, not about the underlying entities, so they can produce logically inconsistent outputs.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Confident wrongness is the dangerous failure mode',
          text: 'An LLM that says "I don\'t know" is safe. An LLM that confidently states a fabricated fact is dangerous — users trust fluent, confident text. This is why RAG (retrieve facts and cite sources), tool use (call a calculator instead of guessing arithmetic), and verification steps are critical production patterns. Never deploy an LLM in a high-stakes setting without a verification layer.'
        },
        { type: 'h3', text: 'Mitigations' },
        {
          type: 'ul',
          items: [
            'RAG: retrieve relevant facts from a trusted source and ground the response in them. Cite sources so users can verify.',
            'Tool use: route arithmetic, code execution, database queries to deterministic tools instead of letting the model guess.',
            'Chain-of-thought: ask the model to reason step-by-step, reducing (but not eliminating) reasoning errors.',
            'Self-consistency: sample multiple responses and majority-vote — improves accuracy on reasoning tasks.',
            'Verification prompts: ask the model to check its own answer (limited effectiveness — models often confirm their own errors).',
            'Constitutional AI / critique: a second model critiques the first\'s output for accuracy and safety.',
            'Confidence elicitation: ask the model to express uncertainty; calibrate with temperature or sampling.'
          ]
        },
        {
          type: 'table',
          headers: ['Failure mode', 'Why it happens', 'Mitigation'],
          rows: [
            ['Fabricated facts', 'Knowledge gap + plausibility optimization', 'RAG with citations'],
            ['Wrong arithmetic', 'No built-in arithmetic; pattern-matches on numbers', 'Tool use (calculator)'],
            ['Source confusion', 'Blends similar facts in latent space', 'RAG; explicit entity grounding'],
            ['Sycophancy', 'RLHF rewarded agreement with user', 'Train against sycophancy; system prompts to push back'],
            ['Multi-step errors', 'Fixed-depth forward pass; no backtracking', 'Chain-of-thought; tool use; verification'],
            ['Stale knowledge', 'Knowledge frozen at training cutoff', 'RAG with current sources; tool-based lookups']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'Ask "What did Abraham Lincoln say about the internet?" and a base LLM might generate a plausible-sounding quote — Lincoln never spoke about the internet (it did not exist), but the model has no signal for "this question is anachronistic" and falls back on stylistic patterns from Lincoln\'s speeches. This is hallucination from knowledge gap + plausibility. RAG with a knowledge cutoff check would refuse the question.' },
        { type: 'p', text: 'Multiply 3457 × 8921 by hand. A 7B LLM has ~30% accuracy — far below a calculator. The model has no built-in arithmetic; it pattern-matches on the digits, and small errors compound. With a tool call to a Python interpreter, accuracy jumps to ~100%. The lesson: use tools for exactness-critical tasks; do not trust LLM arithmetic.' }
      ],
      advantages: [
        'Understanding hallucination modes lets you build targeted mitigations (RAG, tools, verification).',
        'Knowing reasoning limits tells you when to use chain-of-thought, when to use tools, when to use a different architecture.',
        'Calibrated expectations prevent over-deployment in high-stakes settings.'
      ],
      disadvantages: [
        'No mitigation fully eliminates hallucination — it is inherent to the objective.',
        'Mitigations add latency, cost, and complexity (RAG retrieval, tool calls, verification).',
        'Users underestimate the risk because the outputs are fluent and confident.'
      ],
      commonMistakes: [
        'Deploying an LLM in a high-stakes domain (medical, legal, financial) without RAG, tools, or human review.',
        'Trusting chain-of-thought as a guarantee of correct reasoning — it helps but errors still compound.',
        'Assuming the model "knows what it doesn\'t know" — calibration is poor without specific training.',
        'Treating confident text as evidence of correctness — fluency is uncorrelated with truth.'
      ],
      limitations: [
        'Hallucination cannot be fully eliminated without changing the training objective (and losing generative capability).',
        'Reasoning is bounded by the fixed forward-pass depth and the absence of explicit search.',
        'Mitigations (RAG, tools, verification) trade latency and cost for reliability — never free.'
      ],
      relatedConcepts: ['RAG', 'Tool Use', 'Chain-of-Thought', 'Constitutional AI', 'Calibration'],
      faq: [
        { q: 'Will hallucinations ever be "solved"?', a: 'Not fully — they are inherent to next-token prediction. But they can be reduced dramatically with RAG (for facts), tools (for exactness), and verification layers. The goal is reliable systems, not zero hallucination.' },
        { q: 'Why can LLMs write working code but not multiply?', a: 'Code generation tolerates small errors (the compiler/runtime catches them) and benefits from massive training data. Arithmetic has zero tolerance for digit errors and the model has no built-in arithmetic circuits. Tool use closes the gap.' }
      ],
      summary:
        'Hallucinations come from the gap between plausibility and truth — the model optimizes the former, not the latter. Reasoning is limited by the fixed-depth forward pass and absence of explicit search. Mitigations include RAG (ground in facts), tool use (offload exactness), chain-of-thought (externalize reasoning), and verification layers. No mitigation eliminates hallucination; the goal is reliable systems that catch and correct it. Never deploy an LLM in a high-stakes setting without verification.'
    },

    // ------------------------------------------------------------------
    // 28. OPEN-VS-PROPRIETARY
    // ------------------------------------------------------------------
    {
      id: 'open-vs-proprietary',
      title: 'Open-Weight vs Proprietary Models',
      subtitle: 'Llama and Mistral vs GPT-4 and Claude — the deployment tradeoffs.',
      tags: ['open-source', 'proprietary', 'deployment', 'comparison'],
      readingMinutes: 6,
      definition:
        'Open-weight (sometimes "open-source") LLMs release their trained weights publicly under a license (Llama, Mistral, Qwen, Gemma, DeepSeek). Proprietary LLMs are accessible only via the developer\'s API; the weights are never released (GPT-4, Claude, Gemini, Gemini). The choice determines cost, control, privacy, customization, and capability ceiling. Most production systems use both — proprietary for the hardest tasks, open-weight for everything else.',
      whyItExists:
        'The split exists because training frontier LLMs costs $50M–$500M, and the two business models for recouping that cost are: (a) sell API access (proprietary — OpenAI, Anthropic, Google) or (b) release weights and monetize the ecosystem, cloud, or downstream products (Meta, Mistral). Each model has genuine advantages: proprietary models can be larger and more capable (no need to fit on customer hardware); open-weight models give customers control, privacy, and customization. The market supports both because different use cases value different things.',
      howItWorks: [
        {
          type: 'table',
          headers: ['Dimension', 'Open-weight (Llama 3, Mistral)', 'Proprietary (GPT-4, Claude)'],
          rows: [
            ['Weight access', 'Public download', 'API only'],
            ['Cost (per 1M output tokens)', '~$0.10–$1 (self-hosted)', '$5–$75'],
            ['Latency', 'Variable (your infra)', 'Provider-managed SLA'],
            ['Privacy', 'Full (data never leaves your network)', 'Provider sees your data (with enterprise tier: zero retention)'],
            ['Customization', 'Full fine-tune / LoRA', 'Limited (fine-tunes via API; no weight access)'],
            ['Capability ceiling', 'Llama 3 405B ~ GPT-4-class', 'GPT-4o, Claude 3.5 Sonnet — frontier'],
            ['Knowledge cutoff', 'Fixed at training; add via RAG', 'Updates more frequently'],
            ['Vendor lock-in', 'None — open format', 'High — API, format, pricing all controlled'],
            ['Hardware requirement', 'Significant (GPU servers)', 'None — managed API']
          ]
        },
        { type: 'h3', text: 'The "open-weight" vs "open-source" distinction' },
        {
          type: 'p',
          text: 'Strictly, none of the major "open" LLMs are open-source in the OSI sense, because the training data, training code, and (often) the right to use the model commercially are not all open. Llama 3 has a license restricting use at very large scale (>700M MAU); Gemma has acceptable-use restrictions; Qwen and DeepSeek are most permissive. "Open-weight" is the more accurate term. Truly open-source LLMs (Pythia, OLMo, Amber) exist but are typically smaller and research-oriented.'
        },
        { type: 'h3', text: 'When to choose which' },
        {
          type: 'ul',
          items: [
            'Privacy-sensitive (healthcare, finance, internal code): open-weight, self-hosted, no data leaves your network.',
            'Customization-heavy (domain fine-tunes, custom adapters): open-weight with LoRA.',
            'High-volume, low-margin (support chat at scale): open-weight — per-token cost is ~10× lower at scale.',
            'Highest capability needed (frontier reasoning, complex agentic tasks): proprietary — GPT-4-class leads open by ~6 months.',
            'Low-volume, simple integration: proprietary — no infra to manage, faster to ship.',
            'Edge / offline / on-device: open-weight small models (Phi, Gemma 2B) — proprietary APIs need network.'
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'The capability gap is shrinking',
          text: 'In 2023, GPT-4 led open-weight models by ~1 year. In 2024, Llama 3 405B and Qwen 2.5 72B closed the gap to months. The open-weight ecosystem improves faster because every release builds on the last. Most teams now use open-weight for the bulk of workloads and proprietary only for the hardest 5% of queries.'
        }
      ],
      examples: [
        { type: 'p', text: 'A hospital building a medical Q&A system cannot send patient data to OpenAI (HIPAA). They deploy Llama 3 70B on-prem, fine-tune on their records, and keep all data inside their network. The cost: ~$30K of GPU hardware + engineering time. The benefit: full control, full privacy, full customization. Proprietary APIs simply are not an option here.' },
        { type: 'p', text: 'A startup building an AI coding assistant might use Claude 3.5 Sonnet for the hardest 5% of queries (complex refactors, agentic tasks) and Llama 3 70B for the 95% routine ones. Per-query cost: ~$0.01 for Claude, ~$0.001 for Llama. Routing intelligently between them is the modern production pattern.' }
      ],
      advantages: [
        'Open-weight: full control, privacy, customization, no per-token cost, no vendor lock-in.',
        'Proprietary: highest capability, no infra, faster shipping, frequent updates, managed SLA.'
      ],
      disadvantages: [
        'Open-weight: requires GPU infrastructure, engineering expertise, slower to access frontier capability.',
        'Proprietary: high per-token cost, vendor lock-in, data leaves your network, limited customization, subject to deprecations.'
      ],
      commonMistakes: [
        'Defaulting to proprietary APIs for all tasks when open-weight would be 10× cheaper at scale.',
        'Self-hosting open-weight models without the engineering capacity to operate them reliably.',
        'Treating "open" as "free" — operating a 70B model is expensive in hardware and people.',
        'Assuming proprietary is always more capable — Llama 3 405B and Qwen 2.5 72B are competitive with GPT-4 on many tasks.'
      ],
      limitations: [
        'Open-weight models require expertise to deploy, fine-tune, and operate at production quality.',
        'Proprietary models can be deprecated or repriced with little notice — your product depends on someone else\'s roadmap.',
        'Both can be misused; open-weight releases raise dual-use concerns that proprietary providers can mitigate via API filters.'
      ],
      relatedConcepts: ['Fine-Tuning', 'Quantization', 'RAG', 'Inference', 'SLM vs LLM'],
      faq: [
        { q: 'Can I use Llama 3 commercially?', a: 'Yes, with limits — Meta requires a license for products with >700M monthly active users. For most companies, the license is permissive. Qwen, Mistral, and DeepSeek are even more permissive. Always read the license before deployment.' },
        { q: 'Is it cheaper to self-host or use the API?', a: 'Break-even is around 10M–100M tokens/month, depending on model size and hardware. Below that, API is cheaper (no infra). Above that, self-hosting wins. Most teams start with the API and migrate to self-hosting as volume grows.' }
      ],
      summary:
        'Open-weight LLMs (Llama, Mistral, Qwen) give control, privacy, customization, and low per-token cost at the price of infrastructure. Proprietary LLMs (GPT-4, Claude, Gemini) give frontier capability, no infra, and managed SLAs at the price of cost, lock-in, and data leaving your network. The capability gap is shrinking. Most production systems use both — proprietary for the hardest queries, open-weight for the bulk. Choose based on privacy, volume, customization, and capability needs.'
    },

    // ------------------------------------------------------------------
    // 29. SLM VS LLM
    // ------------------------------------------------------------------
    {
      id: 'slm-vs-llm',
      title: 'Small Language Models vs LLMs',
      subtitle: 'Phi, Gemma, SmolLM — when smaller is actually better.',
      tags: ['slm', 'small-models', 'deployment', 'efficiency'],
      readingMinutes: 6,
      definition:
        'Small Language Models (SLMs) are LLMs in the 1B–7B parameter range, often distilled or trained on highly-curated data, designed to run on consumer hardware (laptops, phones, edge devices). Examples: Microsoft Phi-3 (3.8B), Google Gemma 2 (2B/9B), Meta Llama 3 8B, Hugging Face SmolLM (1.7B). They trade raw capability for cost, latency, and deployability — and on many tasks, the trade is worth it.',
      whyItExists:
        'Not every task needs a 70B model. A chatbot summarizing support tickets, an on-device assistant running offline, a coding helper embedded in an IDE — these tasks run millions of times and need millisecond latency at cents-per-day cost. SLMs exist because for narrow, well-defined tasks, a 3B model fine-tuned on the task beats a 70B general model on cost-per-call by 100× with comparable quality. They also exist because most users (and most devices) cannot run 70B models locally — SLMs make on-device AI possible.',
      howItWorks: [
        { type: 'h3', text: 'How SLMs punch above their weight' },
        {
          type: 'p',
          text: 'Three techniques make small models surprisingly capable. (1) High-quality data: Microsoft\'s Phi models are trained on heavily-filtered "textbook quality" synthetic data — a 3.8B Phi-3 matches GPT-3.5 (175B) on many benchmarks. Data quality matters more than parameter count. (2) Knowledge distillation: train the small model on outputs of a larger teacher model, transferring capabilities. (3) Specialization: a small model fine-tuned on one task (medical Q&A, SQL generation) beats a large general model on that task. SLMs exploit the fact that most production use cases are narrow.'
        },
        {
          type: 'table',
          headers: ['Model', 'Parameters', 'Approx. memory (int4)', 'Capability', 'Best for'],
          rows: [
            ['SmolLM2', '1.7B', '~1 GB', 'Basic chat, simple Q&A', 'On-device, mobile, edge'],
            ['Phi-3 mini', '3.8B', '~2.5 GB', 'GPT-3.5-class on many tasks', 'Laptops, IoT, privacy-sensitive'],
            ['Gemma 2 2B', '2.6B', '~1.5 GB', 'Strong small model', 'Edge, browser, mobile'],
            ['Llama 3.2 3B', '3B', '~2 GB', 'Strong chat & reasoning', 'On-device assistants'],
            ['Llama 3 8B', '8B', '~5 GB', 'Near-70B quality on narrow tasks', 'Single-GPU serving, fine-tuning']
          ]
        },
        { type: 'h3', text: 'Where SLMs win' },
        {
          type: 'ul',
          items: [
            'On-device / offline: phone assistants, browser extensions, embedded systems — no network needed.',
            'Privacy-sensitive: data never leaves the device; critical for healthcare, legal, enterprise.',
            'Narrow, high-volume tasks: support classification, intent detection, format conversion — fine-tuned SLM beats general LLM at 100× lower cost.',
            'Latency-critical: real-time autocomplete, IDE suggestions, voice transcription correction — millisecond budgets.',
            'Cost-critical: a 1B model on CPU is ~1000× cheaper per call than a frontier API.'
          ]
        },
        { type: 'h3', text: 'Where LLMs still win' },
        {
          type: 'ul',
          items: [
            'Complex multi-step reasoning: frontier LLMs are noticeably better at long reasoning chains.',
            'Broad open-ended tasks where specialization is impossible.',
            'Code generation beyond small snippets: 70B+ models write meaningfully better code.',
            'Agentic workflows: tool use, multi-step planning, long-horizon tasks.',
            'Knowledge-intensive Q&A without RAG (though with RAG, SLMs close much of the gap).'
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'The SLM + RAG pattern',
          text: 'For most enterprise use cases, a fine-tuned 3B SLM with RAG beats a 70B LLM without RAG — at 100× lower cost. The SLM provides the language and behavior; the RAG provides the knowledge. This pattern dominates production deployments and is the right starting point for most teams.'
        }
      ],
      examples: [
        { type: 'p', text: 'Microsoft Phi-3.5 mini (3.8B parameters) matches GPT-3.5 (175B) on MMLU and several reasoning benchmarks, despite being 46× smaller. How? Trained on 4.8T tokens of "textbook quality" data — heavily filtered web text plus synthetic textbooks and code. The lesson: at small scale, data quality dominates parameter count.' },
        { type: 'p', text: 'A customer support classifier fine-tuned on Llama 3 8B (8B params) classifies tickets into 50 categories at 95% accuracy, ~5ms latency on a single L4 GPU, ~$0.0001 per call. The same task with GPT-4: 96% accuracy, ~800ms latency, $0.005 per call. For 10M tickets/day, the SLM costs $1000/day; the API costs $50K/day. The 1% accuracy difference is rarely worth 50× the cost.' }
      ],
      advantages: [
        'Run on consumer hardware — phones, laptops, single GPUs, even CPUs.',
        '100–1000× cheaper per call than frontier LLMs.',
        'Millisecond latency — suitable for real-time and on-device use.',
        'Privacy-friendly — data never leaves the device.',
        'Fine-tunable for narrow tasks where they beat general LLMs.'
      ],
      disadvantages: [
        'Lower capability ceiling — struggle with complex reasoning, broad knowledge, agentic tasks.',
        'More sensitive to data quality — bad fine-tune data hurts a small model more than a large one.',
        'Smaller context windows — typically 4K–8K, vs. 128K–2M for frontier models.',
        'Less robust to adversarial prompts — easier to jailbreak.'
      ],
      commonMistakes: [
        'Using a 70B LLM where a 3B SLM would do — massive cost overkill.',
        'Using a 3B SLM for complex reasoning it cannot handle — quality collapses.',
        'Forgetting to fine-tune — a base SLM is much weaker than a fine-tuned one on a specific task.',
        'Comparing SLM and LLM on benchmarks alone — latency, cost, and privacy often dominate the decision.'
      ],
      limitations: [
        'SLM capability is bounded — they cannot match frontier LLMs on hardest tasks.',
        'General-knowledge tasks (without RAG) favor large models.',
        'Multi-step agentic workflows still require frontier-class models.'
      ],
      relatedConcepts: ['Open-Weight vs Proprietary', 'Fine-Tuning', 'Quantization', 'Knowledge Distillation', 'RAG'],
      faq: [
        { q: 'When should I use an SLM instead of an LLM?', a: 'For narrow, high-volume, latency-sensitive, or privacy-sensitive tasks where you can fine-tune. Start with an SLM; only escalate to an LLM if the SLM cannot meet your quality bar after fine-tuning and RAG.' },
        { q: 'Are SLMs getting better faster than LLMs?', a: 'Yes, especially post-Phi — high-quality training data and distillation are letting 3B models match 2022-era 70B models. But frontier LLMs are also improving; the gap narrows on simple tasks and persists on complex ones.' }
      ],
      summary:
        'SLMs (1B–7B parameters) trade raw capability for cost, latency, and deployability. With high-quality data, distillation, and fine-tuning, they match much larger models on narrow tasks — at 100–1000× lower cost. They dominate on-device, privacy-sensitive, and high-volume use cases. LLMs still win on complex reasoning, agentic workflows, and broad knowledge tasks. The SLM + RAG pattern is the right starting point for most production deployments; escalate to an LLM only when the SLM cannot meet the quality bar.'
    }
  ]
}
