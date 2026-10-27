import type { Module } from './types'

export const module4: Module = {
  id: 'm4',
  index: 4,
  title: 'Embeddings and Vector Databases',
  shortTitle: 'Embeddings & Vectors',
  description:
    'Turn text, images, and audio into searchable vectors. This module covers embedding models, similarity metrics, chunking strategies, vector databases (Pinecone, Qdrant, Milvus, pgvector), ANN indexes (HNSW, IVF), metadata filtering, hybrid search, and cross-encoder reranking — the entire retrieval stack that powers modern RAG systems.',
  level: 'Intermediate',
  icon: 'Boxes',
  color: 'from-emerald-500 to-teal-500',
  quizId: 'q4',
  lessons: [
    {
      id: 'what-are-embeddings',
      title: 'What Are Embeddings?',
      subtitle: 'Dense vectors that turn meaning into geometry — the foundation of semantic search and RAG.',
      tags: ['embeddings', 'fundamentals', 'representation-learning'],
      readingMinutes: 7,
      definition:
        'An embedding is a learned dense vector representation of data (text, images, audio, code, graphs) where the geometry of the space encodes semantic relationships: similar items land near each other, related items are nearby, and certain analogies appear as vector arithmetic.',
      whyItExists:
        'Computers compute on numbers, but most useful data is not naturally numerical. Embeddings exist to translate unstructured data into a vector space where similarity, relevance, and ranking become geometric operations — distance, angle, projection — that you can compute efficiently and at scale.',
      howItWorks: [
        {
          type: 'p',
          text: 'An embedding model is a function f(x) → ℝᵈ that maps an input (a sentence, an image, a product description) to a d-dimensional vector — typically 100 to 4096 dimensions. The model is trained so that the loss function rewards pulling semantically related inputs together and pushing unrelated ones apart. After training, the geometry of the resulting space reflects meaning rather than surface form.'
        },
        {
          type: 'p',
          text: 'The two dominant training recipes are contrastive learning and masked/next-token prediction. Contrastive learning (SimCLR, CLIP, SBERT) takes pairs labelled similar or dissimilar and adjusts the model so similar pairs have high cosine similarity and dissimilar pairs do not. Next-token prediction (used by decoder LLMs) produces embeddings as a side effect: the hidden state of the final layer at the last token encodes the meaning of the prefix, and that hidden state can be pooled and used as a sentence embedding.'
        },
        { type: 'h3', text: 'What the dimensions mean — and do not mean' },
        {
          type: 'p',
          text: 'Each dimension is a learned feature, but no single dimension is interpretable on its own. The vector [0.21, -0.83, 0.04, …] does not have "dimension 1 = topic, dimension 2 = sentiment". Instead, meaning emerges from the joint configuration of all dimensions. You can inspect neighborhoods (which other vectors are close?) but you cannot read off a single dimension and explain it. This is why embedding-based systems are powerful but opaque.'
        },
        {
          type: 'diagram',
          diagramId: 'embedding-space-2d',
          caption: 'A 2D projection of an embedding space: similar concepts cluster, dissimilar ones separate.'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Embeddings are model-specific',
          text: 'Vectors from different models are not interchangeable. An OpenAI text-embedding-3 vector cannot be compared to a BGE vector, even if both have 1536 dimensions — they live in different spaces with different geometries. Always store the model name alongside the vectors.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'The classic Word2Vec analogy: vec("king") - vec("man") + vec("woman") ≈ vec("queen"). This works because the model was trained on a large corpus and learned that gender is a direction in the space. Subtracting the "male" direction and adding the "female" direction transforms king into queen. It is not magic — it is a side effect of how word co-occurrence patterns encode semantic relationships.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Embedding a sentence with sentence-transformers',
          code: `from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")  # 384-dim, fast & strong
vectors = model.encode([
    "The cat sat on the mat.",
    "A feline rested on the rug.",
    "Interest rates rose 0.25%.",
])

# vectors.shape == (3, 384)
# Sentences 1 and 2 will have high cosine similarity (~0.7+);
# sentence 3 will be far from both.`
        }
      ],
      advantages: [
        'Translate unstructured data into a form where similarity, clustering, and ranking become linear-algebra operations.',
        'Generalise across vocabularies — "dog" and "puppy" are close even though they share no letters.',
        'Enable sub-second semantic search over millions of documents via ANN indexes.',
        'Multi-modal: text, image, and audio embeddings can share a space (CLIP), enabling cross-modal retrieval.'
      ],
      disadvantages: [
        'Lossy: an embedding cannot reconstruct the original input perfectly.',
        'Opaque: you cannot easily inspect why two vectors are close.',
        'Model-locked: changing models requires re-embedding everything.',
        'Drift: as models are updated, the geometry changes and old vectors become stale.'
      ],
      commonMistakes: [
        'Mixing vectors from different embedding models in the same index.',
        'Forgetting to store which model produced each vector.',
        'Comparing embeddings with L2 distance when the model was trained for cosine (or vice versa).',
        'Treating embedding similarity as a probability — it is a similarity score, not a calibrated probability.'
      ],
      limitations: [
        'Out-of-distribution inputs (text in a domain the model never saw) produce poor embeddings.',
        'Embeddings compress meaning; nuance, tone, and exact wording are partially lost.',
        'Long documents cannot be embedded as a single vector without information loss — hence chunking (Module 4.8).'
      ],
      relatedConcepts: ['Representation Learning', 'Contrastive Learning', 'Metric Learning', 'Dimensionality Reduction'],
      faq: [
        { q: 'How many dimensions do I need?', a: 'For prototyping, 384 (MiniLM) is enough. For production semantic search, 768–1536 is the sweet spot. Larger (3072+) helps slightly at a steep storage and latency cost. Start small and benchmark.' },
        { q: 'Can I embed images and text into the same space?', a: 'Yes — CLIP and similar models are trained jointly on image-text pairs so that an image of a cat and the text "a cat" land near each other. This enables text-to-image search.' },
        { q: 'Do LLMs produce good embeddings?', a: 'The hidden states of decoder LLMs can be pooled into embeddings, and modern instruction-tuned embedding models (GTE, E5, OpenAI text-embedding-3) are competitive with or better than SBERT. But raw base-LLM hidden states are usually weaker than purpose-built embedding models.' }
      ],
      summary:
        'Embeddings are learned dense vectors whose geometry encodes meaning. They let you turn "find similar text" into "find nearby vectors" — a problem solvable in milliseconds at billion-vector scale. The embedding model defines the space; vectors are model-specific, lossy, and opaque, but they are the substrate on which the entire retrieval stack in this module is built.'
    },
    {
      id: 'token-vs-sentence-embeddings',
      title: 'Token vs Sentence Embeddings',
      subtitle: 'Why averaging word vectors is not enough — and how sentence-transformers fix it.',
      tags: ['embeddings', 'token-embeddings', 'sentence-embeddings', 'sbert'],
      readingMinutes: 6,
      definition:
        'Token embeddings map individual tokens (words or subwords) to vectors. Sentence (and document) embeddings map an entire text span to a single vector that captures its meaning. Token embeddings are building blocks used inside transformer models; sentence embeddings are end products used directly for semantic search, clustering, and retrieval.',
      whyItExists:
        'A sentence is more than the average of its words. "The dog bit the man" and "The man bit the dog" produce nearly identical mean-pooled token embeddings, but have opposite meanings. Sentence embedding models exist to encode whole-passage semantics — word order, negation, scope, and context that token-level averaging destroys.',
      howItWorks: [
        { type: 'h3', text: 'Token embeddings' },
        {
          type: 'p',
          text: 'Inside every transformer is an embedding matrix E of shape [vocab_size, d]. For each input token id t, the model looks up row E[t] — a d-dimensional vector. These token vectors are then contextualised by attention: each token representation is mixed with every other token. The raw lookup vectors are static (the same token always gets the same starting vector), but after attention they become contextual — the vector for "bank" differs next to "river" vs next to "investment".'
        },
        { type: 'h3', text: 'Naive sentence embeddings: mean pooling' },
        {
          type: 'p',
          text: 'The simplest way to get a sentence vector is to average the token embeddings. For a BERT-style encoder, you can either take the [CLS] token final hidden state or mean-pool all token states. Mean pooling works okay and is fast, but BERT was pretrained on next-sentence and masked-word objectives — not on producing good sentence vectors. The result: semantically unrelated sentences can land close, and related but differently-phrased sentences can land far apart.'
        },
        { type: 'h3', text: 'SBERT: fine-tuning for sentence-level semantics' },
        {
          type: 'p',
          text: 'Sentence-BERT (Reimers & Gurevych, 2019) fine-tunes a BERT encoder with a siamese architecture: the same encoder processes two sentences independently, then a contrastive or regression loss pushes their pooled outputs to high similarity for related pairs and low similarity for unrelated pairs. After this fine-tuning, the pooled output is directly usable as a sentence embedding — and dramatically outperforms raw BERT mean-pooling on semantic similarity benchmarks.'
        },
        {
          type: 'table',
          headers: ['Aspect', 'Token embedding', 'Sentence embedding'],
          rows: [
            ['Granularity', 'Per token (word/subword)', 'Per span (sentence/paragraph)'],
            ['Use case', 'Input layer of a transformer', 'Semantic search, clustering, RAG retrieval'],
            ['Context', 'Contextualised by attention', 'Already a pooled, contextualised summary'],
            ['Typical dim', '128–4096', '384–3072'],
            ['Example models', 'Word2Vec, BERT token embeddings, LLaMA embeddings', 'SBERT, E5, BGE, GTE, OpenAI text-embedding-3']
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Practical rule of thumb',
          text: 'If you need to embed whole sentences or paragraphs for retrieval, use a model whose name starts with "sentence-" or that is explicitly labelled an embedding model (E5, BGE, GTE, OpenAI text-embedding-3). Do not pull hidden states out of a base BERT or GPT and treat them as sentence embeddings — they were not trained for that.'
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Token vs sentence embedding with sentence-transformers',
          code: `from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

# Sentence embeddings — one vector per sentence, ready for similarity
sents = ["The dog bit the man.", "The man bit the dog."]
sent_vecs = model.encode(sents)            # shape (2, 384)

cos = (sent_vecs[0] @ sent_vecs[1]
       / (np.linalg.norm(sent_vecs[0]) * np.linalg.norm(sent_vecs[1])))
print(f"Sentence cosine: {cos:.3f}")       # ~0.85 (high — both about dog/man/biting)

# Token-level outputs are available too, but raw BERT token embeddings
# without SBERT fine-tuning would give MUCH worse sentence similarity.`
        }
      ],
      advantages: [
        'Sentence embeddings preserve word order and negation that token averaging loses.',
        'One vector per document enables sub-second ANN search at billion-scale.',
        'Well-suited for cross-lingual retrieval when using multilingual models.'
      ],
      disadvantages: [
        'Sentence embeddings compress away exact wording — bad for keyword-critical queries (use hybrid search).',
        'Truncation: most sentence models cap input at 256–512 tokens; long documents need chunking.',
        'Mean-pooled raw BERT embeddings perform poorly without SBERT-style fine-tuning.'
      ],
      commonMistakes: [
        'Using raw BERT [CLS] or mean-pool outputs as sentence embeddings — they are not trained for this and perform near-random on similarity.',
        'Pooling token embeddings from a causal (decoder-only) LLM without an attention mask — padding tokens corrupt the average.',
        'Comparing token-level embeddings to sentence-level embeddings as if they were the same kind of object.'
      ],
      limitations: [
        'Sentence embeddings cap at the model max sequence length; you must chunk longer inputs.',
        'A single sentence vector cannot represent a multi-topic document well — embeddings dilute across topics.'
      ],
      relatedConcepts: ['SBERT', 'Contrastive Learning', 'Mean Pooling', 'Contextual Embeddings'],
      faq: [
        { q: 'Can I just average GPT token embeddings to get a sentence vector?', a: 'You can, but it underperforms purpose-built sentence encoders. GPT is trained to predict the next token, not to produce a good pooled sentence vector. Use SBERT, E5, BGE, GTE, or OpenAI text-embedding-3 instead.' },
        { q: 'What is [CLS] pooling vs mean pooling?', a: '[CLS] uses the special classification token final hidden state; mean pooling averages all token states. SBERT typically uses mean pooling with an attention mask — it tends to outperform [CLS] on sentence similarity.' }
      ],
      summary:
        'Token embeddings are the per-word inputs inside a transformer; sentence embeddings are purpose-built, pooled vectors designed for downstream similarity tasks. Naive mean-pooling of raw BERT is a known anti-pattern — use models fine-tuned for sentence similarity (SBERT, E5, BGE, GTE, OpenAI). Sentence embeddings trade exact wording for semantic generalization, which is why production systems pair them with keyword search.'
    },
    {
      id: 'semantic-similarity',
      title: 'Semantic Similarity',
      subtitle: 'Measuring meaning-based closeness between texts using embedding geometry.',
      tags: ['embeddings', 'similarity', 'retrieval'],
      readingMinutes: 5,
      definition:
        'Semantic similarity is a score that quantifies how close in meaning two pieces of text are. It is computed by embedding both texts and measuring the similarity (typically cosine) between their vectors. Unlike lexical similarity, it generalises across synonyms, paraphrases, and vocabulary differences.',
      whyItExists:
        'Keyword search fails when the user uses different words than the documents. "How to fix a flat tire" should match "patching a punctured car wheel" — but they share no significant words. Semantic similarity bridges this vocabulary gap by operating in meaning space rather than token space.',
      howItWorks: [
        {
          type: 'p',
          text: 'The pipeline is three steps: (1) embed the query into a vector q, (2) embed every candidate document into vectors d₁..dₙ (typically pre-computed and stored in a vector database), (3) compute a similarity score — usually cosine — between q and each dᵢ, and (4) rank by descending score. The result is a list of documents ordered by estimated relevance, not by keyword overlap.'
        },
        {
          type: 'p',
          text: 'Semantic similarity scores are not probabilities. A cosine of 0.85 does not mean "85% relevant"; it just means the two vectors point in similar directions. The actual mapping from score to relevance depends on the model, the corpus, and the query distribution. In production, you calibrate by running a held-out set of queries with known relevant docs and finding a threshold that maximises precision or F1.'
        },
        {
          type: 'table',
          headers: ['Similarity type', 'What it captures', 'Example'],
          rows: [
            ['Lexical (BM25, Jaccard)', 'Token overlap', '"cat sat on mat" vs "the cat sat on the mat" → high'],
            ['Semantic (embedding cosine)', 'Meaning overlap', '"feline rested on rug" vs "cat sat on mat" → high'],
            ['Both low', 'Unrelated', '"cat sat on mat" vs "interest rates rose" → low']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Semantic similarity is not relevance',
          text: 'Two texts can be semantically similar (about the same topic) without one being a relevant answer to a query about the other. "Cats are popular pets" and "Cats are an invasive species killing native birds" are topically similar but answer very different questions. This is why reranking (Module 4.13) on top of semantic search often helps.'
        },
        {
          type: 'p',
          text: 'Semantic similarity degrades predictably in two regimes. First, on rare or out-of-vocabulary terms (product codes, proper nouns, technical jargon) the embedding model has seen few examples and the resulting vectors are noisy — exact-match queries on those terms are better served by lexical search. Second, on cross-domain pairs (a legal query against a medical corpus) the embedding geometry may not transfer, because the model was trained on a different distribution. Hybrid search and domain-specific embedding models address both failure modes.'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'A user asks: "How do I reset my password?" A document titled "Account Recovery: Changing Your Login Credentials" contains no shared words with the query, but they are semantically near-identical. A keyword search returns nothing; a semantic search returns the document at the top with cosine around 0.78.'
        },
        {
          type: 'p',
          text: 'Multilingual case: a German query "Wie setze ich mein Passwort zurück?" and an English document "Resetting your account password" produce vectors with cosine around 0.65 in a multilingual model (BGE-M3, Cohere multilingual) — high enough to retrieve correctly despite zero shared tokens. A monolingual English-only model would score them near 0 and miss the match entirely. This is why multilingual corpora demand multilingual embedding models.'
        }
      ],
      advantages: [
        'Matches across vocabulary differences (synonyms, paraphrases, multi-lingual content).',
        'Robust to typos and morphological variation once the model has seen enough examples.',
        'Sub-millisecond per-pair scoring enables real-time ranking over millions of candidates via ANN.'
      ],
      disadvantages: [
        'Misses exact-match intent — searching for a specific product code or proper noun is weaker than BM25.',
        'Scores are uncalibrated; thresholds require per-corpus tuning.',
        'Sensitive to embedding model choice — switching models changes every score.'
      ],
      commonMistakes: [
        'Treating cosine similarity as a probability of relevance.',
        'Using a single global score threshold across different query types.',
        'Forgetting to normalise embeddings before dot-product search (use cosine or normalise once at ingest).'
      ],
      limitations: [
        'Topic similarity does not imply answer relevance — see reranking.',
        'Out-of-domain text (legal queries against a medical embedding model) underperforms.',
        'Score drift: as you update embedding models, old scores become incomparable to new ones.'
      ],
      relatedConcepts: ['Cosine Similarity', 'Lexical Search', 'BM25', 'Reranking'],
      faq: [
        { q: 'What score counts as "similar"?', a: 'It depends on the model. For SBERT all-MiniLM-L6-v2, 0.7+ usually means topically related; for OpenAI text-embedding-3, 0.2+ may already indicate relevance because scores cluster lower. Always calibrate against your corpus.' },
        { q: 'Should I use cosine or dot product?', a: 'If your embeddings are normalised (unit norm), they give the same ranking. If not, cosine is safer because it ignores magnitude. Many vector DBs require you to declare the metric at index creation time.' }
      ],
      summary:
        'Semantic similarity scores how close in meaning two texts are by comparing their embedding vectors — typically with cosine. It powers semantic search, clustering, and retrieval by generalising across vocabulary, but its scores are uncalibrated and topic similarity is not the same as answer relevance. Production systems combine semantic search with keyword search (hybrid) and reranking to compensate for these limits.'
    },
    {
      id: 'vector-representations',
      title: 'Vector Representations',
      subtitle: 'Dense, high-dimensional arrays — the universal currency of modern AI.',
      tags: ['embeddings', 'vectors', 'representation'],
      readingMinutes: 6,
      definition:
        'A vector representation is a fixed-length ordered array of real numbers (a point in ℝᵈ) that encodes the salient features of an object. In modern AI, embeddings are dense (most entries non-zero), high-dimensional (100–4096), and learned rather than hand-engineered.',
      whyItExists:
        'Vectors are the lingua franca that lets you apply linear algebra, geometry, and approximate search to anything embeddable. Once you have a vector, the entire retrieval toolkit — nearest-neighbor search, clustering, classification, visualisation — becomes available, regardless of whether the source was text, image, audio, or a product catalog.',
      howItWorks: [
        { type: 'h3', text: 'Sparse vs dense vectors' },
        {
          type: 'p',
          text: 'A sparse vector has mostly zeros — a one-hot encoding of a 50,000-word vocabulary is a 50,000-dimensional vector with a single 1. A TF-IDF vector over the same vocabulary might have a few hundred non-zero entries out of 50,000. Sparse vectors are interpretable (each dimension is a known word) but high-dimensional and capture only lexical information. A dense embedding vector is the opposite: every dimension is a real number, the dimensionality is modest (384–3072), and the dimensions are learned latent features that nobody labelled.'
        },
        { type: 'h3', text: 'Dimensionality tradeoffs' },
        {
          type: 'p',
          text: 'More dimensions give the model more capacity to encode distinctions — but each vector costs more storage (4 bytes per float × d), more RAM in the ANN index, and more compute per similarity calculation. A 1536-dim index over 10M vectors is ~60GB of raw vectors alone; a 384-dim index is ~15GB. Most production systems pick the smallest dimension that meets recall targets on a held-out query set.'
        },
        {
          type: 'table',
          headers: ['Aspect', 'Sparse (TF-IDF, BM25)', 'Dense (learned embedding)'],
          rows: [
            ['Dimensionality', '10k–1M (mostly zeros)', '100–4096 (all non-zero)'],
            ['Interpretability', 'Each dim = a token', 'Latent — not individually interpretable'],
            ['Captures', 'Lexical overlap', 'Semantic meaning'],
            ['Storage', 'Compressed sparse formats', '4 bytes × d per vector'],
            ['Best for', 'Keyword search, exact match', 'Semantic search, clustering, RAG']
          ]
        },
        { type: 'h3', text: 'Geometric operations on vectors' },
        {
          type: 'p',
          text: 'Once an object is a vector, you can compute: distance (L2, Manhattan), similarity (cosine, dot product), average (cluster centroid), projection (PCA, UMAP for visualisation), and arithmetic (king - man + woman ≈ queen). These operations are the building blocks of every retrieval, clustering, and recommendation system you will build.'
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Comparing sparse (TF-IDF) and dense (embedding) representations',
          code: `import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sentence_transformers import SentenceTransformer

docs = ["Cats are popular pets.", "Felines are common companion animals."]

# Sparse: ~vocabulary_size dimensions, mostly zeros
tfidf = TfidfVectorizer()
sparse_vecs = tfidf.fit_transform(docs)   # shape (2, ~6), sparse
print(sparse_vecs.toarray())              # mostly zeros, NO overlap (different tokens)

# Dense: 384 dimensions, all non-zero, semantic similarity preserved
model = SentenceTransformer("all-MiniLM-L6-v2")
dense_vecs = model.encode(docs)            # shape (2, 384)
cos = (dense_vecs[0] @ dense_vecs[1]
       / (np.linalg.norm(dense_vecs[0]) * np.linalg.norm(dense_vecs[1])))
print(f"Dense cosine: {cos:.3f}")          # ~0.65 — high despite no shared words`
        }
      ],
      advantages: [
        'Universal: any embeddable object becomes a vector you can search, cluster, and classify.',
        'Compact: a 384-dim dense vector is smaller than a sparse 50k-dim TF-IDF vector and far more informative.',
        'Composable: vector arithmetic (averaging, projection) supports clustering and visualisation out of the box.'
      ],
      disadvantages: [
        'Dense vectors are opaque — you cannot inspect a dimension and explain it.',
        'Storage and compute scale linearly with dimensionality.',
        'Vectors are only as good as the model that produced them — garbage in, garbage out.'
      ],
      commonMistakes: [
        'Picking the largest available embedding dimension "for quality" without benchmarking — usually overkill.',
        'Storing vectors without their model name and version, then losing track of which vectors are comparable.',
        'Comparing sparse and dense vectors with the same distance metric — cosine works on both but means very different things.'
      ],
      limitations: [
        'Fixed dimensionality: changing models means re-embedding the whole corpus.',
        'Information loss: a single vector cannot reconstruct its source — vectors summarise, they do not store.'
      ],
      relatedConcepts: ['Embeddings', 'Sparse Vectors', 'Dimensionality Reduction', 'PCA', 'UMAP'],
      faq: [
        { q: 'Can I reduce the dimensionality of an existing embedding?', a: 'Yes — PCA or random projection can shrink a 1536-dim vector to 256-dim with modest recall loss. Some models (OpenAI text-embedding-3) support native Matryoshka truncation, where you can simply take the first N dimensions.' },
        { q: 'Why not use sparse vectors for everything?', a: 'Sparse vectors cannot capture semantic similarity across vocabularies. They remain excellent for keyword search (BM25), which is why production systems combine them with dense vectors in hybrid search.' }
      ],
      summary:
        'Vector representations turn any embeddable object into a fixed-length array of numbers. Modern embeddings are dense, modest in dimensionality (384–3072), and learned — they capture semantics that sparse lexical vectors cannot. The choice of dimensionality trades capacity against storage and compute. Once data is a vector, the full toolkit of linear algebra, geometry, and ANN search becomes available.'
    },
    {
      id: 'cosine-similarity',
      title: 'Cosine Similarity',
      subtitle: 'The default similarity metric for embeddings — and why it beats raw dot product.',
      tags: ['similarity', 'cosine', 'metrics', 'embeddings'],
      readingMinutes: 6,
      definition:
        'Cosine similarity measures the cosine of the angle between two vectors: cos(θ) = (A · B) / (||A|| · ||B||). It ranges from -1 (opposite direction) to 1 (identical direction), with 0 meaning orthogonal. It captures the orientation of vectors, ignoring their magnitude.',
      whyItExists:
        'In embedding spaces, vector magnitude often reflects text length or stylistic intensity rather than meaning. A long document may have a larger norm than a short one even when both are about the same topic. Cosine similarity normalises magnitude away, comparing only direction — making it robust to document length and the dominant default metric for semantic search.',
      howItWorks: [
        {
          type: 'p',
          text: 'The formula decomposes into two parts: the dot product A · B = Σ aᵢ bᵢ measures alignment, and the denominator ||A|| · ||B|| normalises by vector lengths. Dividing makes the result depend only on the angle between vectors. Two vectors pointing the same direction score 1; opposite directions score -1; perpendicular vectors score 0.'
        },
        {
          type: 'p',
          text: 'In practice, embedding models are often trained so that semantically related inputs produce vectors with high cosine similarity. SBERT-style models use a contrastive loss that directly optimises cosine. OpenAI text-embedding-3 models produce vectors that are already approximately normalised, so cosine and dot product give nearly identical rankings — but cosine is still the safe default because it does not assume normalisation.'
        },
        { type: 'h3', text: 'Cosine distance vs cosine similarity' },
        {
          type: 'p',
          text: 'Vector databases typically ask for a distance (lower = more similar), not a similarity. Cosine distance is defined as 1 - cosine_similarity, ranging from 0 (identical) to 2 (opposite). Many ANN indexes (HNSW, IVF) require you to declare the distance metric at index creation; switching later means rebuilding the index.'
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Normalise once, then use dot product',
          text: 'If you normalise every embedding to unit length at ingest time, then ||A|| · ||B|| = 1 and cosine similarity equals dot product. Dot product is faster (no division, no norm computation) and many ANN indexes optimise for it. Normalising once at ingest and using dot product at query is a standard production pattern.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Computing cosine similarity in numpy',
          code: `import numpy as np

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """Cosine similarity between two vectors."""
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# Batched: query (1, d) against corpus (N, d)
def cosine_sim_batch(q: np.ndarray, corpus: np.ndarray) -> np.ndarray:
    q_norm = q / np.linalg.norm(q, axis=-1, keepdims=True)
    c_norm = corpus / np.linalg.norm(corpus, axis=-1, keepdims=True)
    return q_norm @ c_norm.T          # shape (1, N), values in [-1, 1]

# Or pre-normalise the corpus once and just use dot product:
corpus_norm = corpus / np.linalg.norm(corpus, axis=-1, keepdims=True)
scores = q @ corpus_norm.T            # equivalent ranking, faster`
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'Three sentences: "Cats are great pets", "Felines make wonderful companions", "Interest rates climbed today". Embedding all three and computing pairwise cosine gives ~0.75 for the first pair (semantically similar) and ~0.1 for either of the first two against the third (unrelated). The actual numbers depend on the model — for OpenAI text-embedding-3, similar pairs typically score 0.3–0.6 and unrelated pairs score near 0.'
        },
        {
          type: 'interactive',
          componentId: 'semantic-search-demo',
          caption: 'Live demo: type a query, see cosine similarity rank a small corpus in real time. Adjust the threshold and watch results change.'
        }
      ],
      advantages: [
        'Robust to vector magnitude — handles unequal-length documents correctly.',
        'Range [-1, 1] is interpretable and bounded, unlike raw dot product.',
        'Matches how most embedding models are trained (contrastive cosine loss).'
      ],
      disadvantages: [
        'Slightly more expensive than dot product (norm computation, division).',
        'Does not capture magnitude differences that may matter in some applications (e.g. confidence weighting).',
        'Assumes the model was trained for cosine — for some L2-trained models, Euclidean distance may be more appropriate.'
      ],
      commonMistakes: [
        'Using cosine on a model trained with L2 (Euclidean) loss — check the model card for the recommended metric.',
        'Forgetting to set the distance metric correctly when creating the vector index (Pinecone, Qdrant, etc.) — defaults vary.',
        'Comparing cosine scores across different embedding models as if they were on the same scale.'
      ],
      limitations: [
        'Cosine is a similarity, not a probability — thresholds require per-corpus calibration.',
        'Cosine on raw BERT hidden states performs poorly; use a sentence-embedding model fine-tuned with cosine loss.'
      ],
      relatedConcepts: ['Dot Product', 'L2 Distance', 'Vector Normalization', 'Semantic Similarity'],
      faq: [
        { q: 'When should I use dot product instead of cosine?', a: 'When your embeddings are already normalised (or you normalise them once at ingest), dot product and cosine give the same ranking and dot product is faster. Some models (OpenAI text-embedding-3) are designed so dot product on raw vectors works well.' },
        { q: 'Can cosine similarity be negative?', a: 'Yes, for models whose training allows it (rare in modern sentence encoders). Most modern sentence embeddings cluster in a narrow cone of the unit sphere, so scores rarely go below 0 in practice.' }
      ],
      summary:
        'Cosine similarity = (A · B) / (||A|| ||B||) measures vector alignment, ignoring magnitude. It is the default metric for semantic search because it is robust to document length and matches how embedding models are trained. In production, pre-normalise vectors at ingest and use dot product for speed. Always declare the metric correctly when creating the vector index — switching later requires a rebuild.'
    },
    {
      id: 'vector-distance',
      title: 'Vector Distance Metrics',
      subtitle: 'L2, dot product, cosine, Manhattan — when each matters and why.',
      tags: ['distance', 'metrics', 'l2', 'cosine', 'manhattan'],
      readingMinutes: 7,
      definition:
        'A vector distance metric quantifies how far apart two vectors are. The four most common are L2 (Euclidean) distance √Σ(aᵢ-bᵢ)², dot product Σaᵢbᵢ, cosine distance (1 - cosine_similarity), and Manhattan (L1) distance Σ|aᵢ-bᵢ|. The choice affects search quality, performance, and which embedding models work correctly.',
      whyItExists:
        'Different metrics are sensitive to different geometric properties: L2 captures both direction and magnitude, cosine captures direction only, dot product mixes both, and Manhattan is robust to outliers in individual dimensions. The right metric depends on how the embedding model was trained — using the wrong one can drop recall by 20%+ with no other change.',
      howItWorks: [
        { type: 'h3', text: 'The four metrics, formalised' },
        {
          type: 'table',
          headers: ['Metric', 'Formula', 'Range', 'Sensitive to'],
          rows: [
            ['L2 (Euclidean)', '√Σ(aᵢ-bᵢ)²', '[0, ∞)', 'Magnitude and direction'],
            ['Dot product', 'Σaᵢbᵢ', '(-∞, ∞)', 'Magnitude and direction (mixed)'],
            ['Cosine distance', '1 - (a·b)/(||a||·||b||)', '[0, 2]', 'Direction only'],
            ['Manhattan (L1)', 'Σ|aᵢ-bᵢ|', '[0, ∞)', 'Per-coordinate differences']
          ]
        },
        { type: 'h3', text: 'Why L2 vs cosine matters' },
        {
          type: 'p',
          text: 'If your embeddings are not normalised, L2 distance is dominated by vector magnitude. A 2000-word document and a 50-word summary of the same topic may have very different norms, so their L2 distance is large even though their cosine similarity is high. Many embedding models (notably OpenAI text-embedding-3) produce vectors whose norms correlate with information density or text length — for these, L2 ranking differs from cosine ranking. If the model was trained with cosine contrastive loss, use cosine.'
        },
        {
          type: 'p',
          text: 'Conversely, some models are trained with Euclidean contrastive loss (certain image embeddings). For these, L2 is the correct metric and cosine can underperform. The model card or paper usually states the intended metric — read it before building your index. If unsure, benchmark both on a small held-out query set with known relevant docs and pick the winner.'
        },
        { type: 'h3', text: 'Dot product: the fast path' },
        {
          type: 'p',
          text: 'Dot product is the cheapest metric — a single matrix multiply. When vectors are normalised to unit length, dot product equals cosine similarity, so normalising once at ingest and using dot product at query gives the same ranking as cosine at lower compute cost. Many ANN indexes (FAISS HNSW, Qdrant) are optimised for dot product or cosine and handle the normalisation internally.'
        },
        { type: 'h3', text: 'Manhattan: the outlier-robust metric' },
        {
          type: 'p',
          text: 'Manhattan (L1) sums absolute coordinate differences instead of squared differences. It penalises a single huge coordinate difference linearly rather than quadratically, making it more robust to outliers. It is rarely used in modern semantic search but appears in classical ML (clustering tabular data, computer vision features).'
        }
      ],
      examples: [
        {
          type: 'p',
          text: 'Worked example with two 2D vectors: A = [3, 4], B = [6, 8] (B = 2A, same direction, larger magnitude). L2 distance = √((3)² + (4)²) = 5 — non-zero, the vectors are "far apart". Cosine similarity = 1.0 — they point the same direction. Dot product = 50. If A is a short document and B is a longer doc about the same topic, cosine says "identical topic" while L2 says "different" — illustrating why cosine is the right default for text embeddings.'
        }
      ],
      advantages: [
        'Each metric captures a different geometric property — picking the right one can boost recall by 10–20%.',
        'Dot product is the fastest and works as well as cosine when vectors are normalised.',
        'Most vector databases support all four metrics with optimised ANN indexes.'
      ],
      disadvantages: [
        'Picking the wrong metric silently degrades recall — easy to miss without benchmarking.',
        'Manhattan and L2 can be dominated by magnitude when vectors are not normalised.',
        'Metric is fixed at index-creation time in most vector databases — switching means rebuilding.'
      ],
      commonMistakes: [
        'Defaulting to L2 because "it is Euclidean" without checking the model card — most text embedding models expect cosine.',
        'Comparing raw dot product scores between models — they are not on the same scale.',
        'Mixing metrics within the same index (querying with cosine when the index was built with L2).'
      ],
      limitations: [
        'No metric compensates for a poorly-trained embedding model — the model defines the geometry.',
        'All four assume the vector space is approximately Euclidean, which holds for most modern embeddings but not all (some are spherical).'
      ],
      relatedConcepts: ['Cosine Similarity', 'L2 Normalization', 'ANN Index', 'Embedding Model Training'],
      faq: [
        { q: 'Which metric should I default to?', a: 'Cosine for text embeddings (most models are trained for it). Dot product if you can pre-normalise. L2 for image embeddings or models trained with Euclidean loss. Always check the model card.' },
        { q: 'Can I switch metrics without rebuilding the index?', a: 'Usually not — the ANN index structure (HNSW graph links, IVF partitions) is metric-specific. Some databases (Qdrant) let you store vectors once and create multiple named indexes, but in practice switching means rebuilding.' }
      ],
      summary:
        'The four common distance metrics — L2, dot product, cosine, Manhattan — each capture different geometry. For text embeddings, cosine (or dot product on normalised vectors) is the default and matches how most models are trained. L2 is correct for Euclidean-trained models (often image embeddings) but wrong for cosine-trained ones. Manhattan is rare in modern semantic search. Always check the model card and benchmark on held-out queries.'
    },
    {
      id: 'embedding-models',
      title: 'Embedding Models',
      subtitle: 'From Word2Vec to SBERT to OpenAI text-embedding-3 — the evolution and the tradeoffs.',
      tags: ['embeddings', 'word2vec', 'sbert', 'openai', 'models'],
      readingMinutes: 8,
      definition:
        'An embedding model is a neural network trained to map inputs (words, sentences, images) to vectors where vector similarity corresponds to semantic similarity. The family includes classic static word vectors (Word2Vec, GloVe, FastText), contextual sentence encoders (SBERT, E5, BGE, GTE), and proprietary API models (OpenAI text-embedding-3, Cohere embed-v3, Voyage AI).',
      whyItExists:
        'A good embedding model encodes meaning compactly and consistently. Without one, "similarity" reduces to lexical overlap, which fails on paraphrase, synonymy, and multilingual content. Different model families make different tradeoffs between quality, speed, cost, dimensionality, and openness — there is no single best model for every application.',
      howItWorks: [
        { type: 'h3', text: 'Static word vectors: Word2Vec, GloVe, FastText' },
        {
          type: 'p',
          text: 'Word2Vec (Mikolov et al., 2013) trained a shallow two-layer network with either CBOW (predict a word from its context) or skip-gram (predict context from a word). The learned input embeddings turned out to encode semantic relationships — the famous king - man + woman ≈ queen analogy. GloVe (Pennington et al., 2014) factorised a word co-occurrence matrix to similar effect. FastText extended Word2Vec with subword units so it could embed rare and out-of-vocabulary words. These models are static: each word gets one fixed vector regardless of context.'
        },
        { type: 'h3', text: 'Contextual sentence encoders: SBERT and friends' },
        {
          type: 'p',
          text: 'SBERT (Reimers & Gurevych, 2019) fine-tuned BERT with a siamese architecture and contrastive loss to produce sentence vectors that beat raw BERT pooling by huge margins on STS benchmarks. The same recipe applied to other backbones produced E5, BGE, GTE, and others. These models are contextual — the same word gets a different vector depending on its sentence — and produce one fixed-length vector per sentence or paragraph. Dimensions range from 384 (MiniLM) to 1024+ (BGE-large).'
        },
        { type: 'h3', text: 'Proprietary API models' },
        {
          type: 'p',
          text: 'OpenAI text-embedding-3-small/large (1536/3072 dim), Cohere embed-v3, and Voyage AI offer state-of-the-art quality without managing infrastructure. They support Matryoshka representation (you can truncate the vector to smaller sizes with modest quality loss), multilingual input, and tight integration with their respective LLM APIs. The cost is per-token billing, vendor lock-in, and the need to send your data to an external API.'
        },
        {
          type: 'table',
          headers: ['Model', 'Dim', 'Open?', 'Strengths'],
          rows: [
            ['all-MiniLM-L6-v2 (SBERT)', '384', 'Yes', 'Fast, free, solid baseline'],
            ['BGE-large-en-v1.5', '1024', 'Yes', 'Strong open-source quality'],
            ['E5-large-v2', '1024', 'Yes', 'Good multilingual'],
            ['GTE-large', '1024', 'Yes', 'Competitive on benchmarks'],
            ['OpenAI text-embedding-3-small', '1536', 'No (API)', 'Best quality per dollar, easy'],
            ['OpenAI text-embedding-3-large', '3072', 'No (API)', 'Top-tier quality'],
            ['Cohere embed-v3', '1024', 'No (API)', 'Multilingual, search-tuned']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Lock-in is real',
          text: 'Switching embedding models means re-embedding your entire corpus and rebuilding every vector index. Before committing to a proprietary API for production, evaluate open-source alternatives (BGE, E5) — the quality gap has narrowed significantly.'
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Embedding with sentence-transformers (local) and OpenAI (API)',
          code: `# --- Option A: local open-source model (free, private) ---
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("BAAI/bge-large-en-v1.5")
vectors = model.encode(
    ["What is RAG?", "Retrieval-augmented generation explained."],
    normalize_embeddings=True,           # BGE recommends L2-normalising
)
# vectors.shape == (2, 1024)

# --- Option B: OpenAI API (no local model, pay per token) ---
from openai import OpenAI
client = OpenAI()

resp = client.embeddings.create(
    model="text-embedding-3-small",
    input=["What is RAG?", "Retrieval-augmented generation explained."],
)
vectors = [d.embedding for d in resp.data]   # list of 1536-dim lists`
        }
      ],
      advantages: [
        'Wide choice — open-source for privacy/control, API for convenience and top quality.',
        'Modern models handle multilingual input and long context (up to 8192 tokens).',
        'Matryoshka support lets you trade dimension for quality without re-embedding.'
      ],
      disadvantages: [
        'Quality varies by domain — a model trained on web text may underperform on legal or medical content.',
        'Proprietary models introduce cost, latency, and vendor lock-in.',
        'Open-source models require GPU or CPU inference infrastructure.'
      ],
      commonMistakes: [
        'Not checking the model recommended distance metric (BGE wants cosine on normalised vectors, some models want L2).',
        'Using an English-only model for multilingual content (use BGE-M3, E5-multilingual, or Cohere multilingual).',
        'Switching models without re-embedding the corpus — comparing vectors from different models is meaningless.'
      ],
      limitations: [
        'Max input length: most models cap at 256–512 tokens; long-context variants (BGE-M3, OpenAI v3) cap at 8192.',
        'Specialised domains (legal, medical, code) may need fine-tuned models for best results.',
        'Models age — a 2022 SOTA model is mid-tier by 2024 standards.'
      ],
      relatedConcepts: ['Word2Vec', 'SBERT', 'Contrastive Learning', 'Matryoshka Representations'],
      faq: [
        { q: 'Which model should I start with?', a: 'For prototyping: all-MiniLM-L6-v2 (fast, free, 384-dim). For production: BGE-large-en-v1.5 (open-source, strong) or OpenAI text-embedding-3-small (API, easy). Benchmark both on your data.' },
        { q: 'Are bigger embeddings always better?', a: 'No. Beyond ~1024 dimensions, returns diminish rapidly while storage and search costs scale linearly. Pick the smallest model that meets your recall target on a held-out query set.' },
        { q: 'Can I fine-tune an embedding model on my data?', a: 'Yes — sentence-transformers supports contrastive fine-tuning on domain-specific (query, positive, negative) triples. This can substantially improve in-domain recall.' }
      ],
      summary:
        'Embedding models range from static word vectors (Word2Vec, GloVe) to contextual sentence encoders (SBERT, E5, BGE, GTE) to API models (OpenAI, Cohere, Voyage). The right choice depends on quality needs, privacy constraints, latency budget, and willingness to manage infrastructure. Always check the model card for the recommended distance metric and input length, and benchmark on your domain before committing — switching models later means re-embedding everything.'
    },
    {
      id: 'chunking',
      title: 'Chunking Strategies',
      subtitle: 'How to split long documents into embeddable units without losing signal.',
      tags: ['chunking', 'rag', 'embeddings', 'preprocessing'],
      readingMinutes: 7,
      definition:
        'Chunking is the process of splitting long documents into smaller, semantically coherent units before embedding. Each chunk is embedded and stored separately so retrieval can target the most relevant passage rather than an averaged whole-document vector.',
      whyItExists:
        'Embedding models have a maximum input length (typically 256–8192 tokens), so long documents must be split. But there is a deeper reason: a whole-document embedding averages across all topics in the document, diluting signal so specific queries cannot surface specific passages. Chunking preserves local specificity, which is essential for RAG retrieval quality.',
      howItWorks: [
        { type: 'h3', text: 'The main strategies' },
        {
          type: 'ul',
          items: [
            'Fixed-size chunking: split every N tokens (e.g. 512) with an overlap of M tokens (e.g. 50). Simple, predictable, but can split mid-sentence or mid-thought.',
            'Sentence-based chunking: split on sentence boundaries, then group sentences until reaching a target size. Preserves grammatical units.',
            'Recursive structural chunking: split by markdown headers, then paragraphs, then sentences. Preserves document structure (great for technical docs).',
            'Semantic chunking: embed each sentence, then split where cosine similarity between adjacent sentences drops below a threshold. Adaptive — chunks align with topic shifts.'
          ]
        },
        { type: 'h3', text: 'Chunk size tradeoffs' },
        {
          type: 'p',
          text: 'Smaller chunks (128–256 tokens) give precise retrieval — the vector represents a focused passage, so the top hit is likely to contain the exact answer. But they may lack context: a retrieved 200-token chunk might mention "the CEO" without saying who. Larger chunks (512–1024 tokens) provide more context but dilute signal — the embedding averages more topics, so specific queries may miss. Most RAG systems settle on 256–512 tokens with 50–100 token overlap as a starting point.'
        },
        { type: 'h3', text: 'Overlap and context preservation' },
        {
          type: 'p',
          text: 'Overlap (typically 10–20% of chunk size) ensures that information at a chunk boundary is not lost — both chunks include the boundary tokens. Without overlap, a sentence split between two chunks may never match a query that targets it. More sophisticated systems attach parent-document metadata to each chunk so the retriever can expand to the parent at generation time ("parent document retrieval" or "small-to-big").'
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Match chunk size to your LLM and queries',
          text: 'If your LLM context window is large (128k+ tokens) and queries are broad, larger chunks (or even whole documents) work well. If queries are specific ("what is the refund window?") and the LLM context is small, use 256-token chunks. Benchmark recall@k on a held-out query set.'
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Recursive structural chunker (paragraph-aware, with overlap)',
          code: `from typing import List

def chunk_text(text: str, max_tokens: int = 400, overlap: int = 50) -> List[str]:
    """Recursive chunker: split on paragraph breaks, keep overlap."""
    paragraphs = [p.strip() for p in text.split("\\n\\n") if p.strip()]

    chunks, current = [], ""
    for para in paragraphs:
        # Approximate 1 token ≈ 4 chars for English
        if len(current) + len(para) > max_tokens * 4 and current:
            chunks.append(current)
            # Keep overlap from the end of the previous chunk
            current = current[-overlap * 4:] + "\\n\\n" + para
        else:
            current = (current + "\\n\\n" + para) if current else para
    if current:
        chunks.append(current)
    return chunks

# For production, use a real tokenizer (tiktoken for OpenAI, transformers
# AutoTokenizer) and a library like LangChain's RecursiveCharacterTextSplitter
# or LlamaIndex's SentenceSplitter for boundary-aware splitting.`
        }
      ],
      advantages: [
        'Preserves local specificity — chunks represent focused passages, not document averages.',
        'Fits within embedding model context limits.',
        'Enables fine-grained citation (you can cite the exact chunk returned).'
      ],
      disadvantages: [
        'Adds engineering complexity — choosing a strategy, size, and overlap is non-trivial.',
        'Aggressive chunking can split related information across chunks, hurting retrieval.',
        'More chunks = more vectors = higher storage and ANN index costs.'
      ],
      commonMistakes: [
        'Using fixed-size chunks without overlap — sentences split at boundaries never match queries.',
        'Picking chunk size by guess instead of benchmarking on held-out queries.',
        'Forgetting to preserve parent-document metadata for context expansion at generation time.'
      ],
      limitations: [
        'No chunker handles all document types — tables, code blocks, and dialogue need special handling.',
        'Semantic chunking is more expensive (extra embedding calls) and not always better.'
      ],
      relatedConcepts: ['RAG', 'Embeddings', 'Parent Document Retrieval', 'Token Limits'],
      faq: [
        { q: 'What is the ideal chunk size?', a: 'There is no universal answer. Start at 256–512 tokens with 50–100 token overlap and benchmark. Adjust based on your query specificity and LLM context window.' },
        { q: 'Should I embed whole documents and skip chunking?', a: 'Only if your documents are short and focused. For anything longer than ~500 tokens, chunking dramatically improves retrieval precision.' },
        { q: 'What about parent-document retrieval?', a: 'Embed small chunks for precise retrieval, but return the parent document (or a larger surrounding chunk) to the LLM for context. This combines retrieval precision with generation context.' }
      ],
      summary:
        'Chunking splits long documents into embeddable units that preserve local specificity. Fixed-size, sentence-based, recursive structural, and semantic chunkers make different tradeoffs between simplicity and coherence. Chunk size (256–512 tokens is a common starting point) and overlap (10–20%) are the key knobs — benchmark on your queries. Pair chunking with parent-document metadata so the generator can expand context after retrieval.'
    },
    {
      id: 'vector-databases',
      title: 'Vector Databases',
      subtitle: 'Pinecone, Weaviate, Qdrant, Milvus, pgvector — choosing the right store for billion-scale search.',
      tags: ['vector-db', 'pinecone', 'qdrant', 'milvus', 'pgvector', 'weaviate'],
      readingMinutes: 8,
      definition:
        'A vector database is a system specialised for storing high-dimensional vectors and performing fast approximate nearest-neighbour (ANN) search, typically combined with metadata storage, filtering, CRUD, and sharding. The category includes standalone products (Pinecone, Weaviate, Qdrant, Milvus) and extensions to traditional databases (pgvector for PostgreSQL).',
      whyItExists:
        'Standard SQL databases can store vectors as BLOBs but cannot search them efficiently — a brute-force scan is O(N·d) and dies at millions of vectors. Vector databases use ANN indexes (HNSW, IVF) to deliver millisecond queries at billion-vector scale, while also supporting the metadata filtering, durability, and operational features you expect from any database.',
      howItWorks: [
        { type: 'h3', text: 'Architecture of a vector database' },
        {
          type: 'p',
          text: 'A vector database has three logical components: (1) a vector index (HNSW, IVF, or both) for fast ANN search, (2) a metadata store (often an inverted index or key-value store) for filtering and CRUD, and (3) a storage layer that persists both. Writes go through an ingest pipeline that embeds the input (often outside the DB), updates the ANN index, and writes metadata. Queries embed the query text, run ANN search, optionally filter by metadata, and return ranked results with payloads.'
        },
        { type: 'h3', text: 'The major options' },
        {
          type: 'table',
          headers: ['System', 'Type', 'Strengths', 'When to pick'],
          rows: [
            ['Pinecone', 'Managed SaaS', 'Zero ops, serverless, scale', 'Teams that want to ship fast without infra'],
            ['Weaviate', 'Open-source + hosted', 'Hybrid search built-in, modules', 'Hybrid lexical+vector out of the box'],
            ['Qdrant', 'Open-source + hosted', 'Fast, Rust-based, strong filtering', 'Filter-heavy workloads, self-host'],
            ['Milvus', 'Open-source', 'Billion-scale, distributed', 'Very large-scale deployments'],
            ['pgvector', 'PostgreSQL extension', 'SQL joins with vectors', 'Adding semantic search to existing Postgres'],
            ['Chroma', 'Open-source, embedded', 'Tiny, Python-native', 'Prototyping, local dev']
          ]
        },
        { type: 'h3', text: 'Standalone vs extension' },
        {
          type: 'p',
          text: 'Standalone vector databases (Pinecone, Qdrant, Milvus) are purpose-built and optimised for vector workloads, but require a separate data store for relational data. pgvector extends PostgreSQL so you can run vector search alongside traditional SQL queries, joining vectors with relational tables — ideal when your vector workload is small-to-medium (under ~10M vectors) and you already have Postgres.'
        },
        {
          type: 'p',
          text: 'When choosing, consider five factors: scale (how many vectors you expect), query pattern (pure ANN, filter-heavy, or hybrid), operational capacity (managed vs self-hosted), integration with your existing stack (Postgres apps benefit from pgvector), and cost model (per-use SaaS pricing vs fixed infrastructure). There is no universally best choice — the right answer depends on your traffic, query mix, and team.'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Start with pgvector, graduate if needed',
          text: 'For most apps under a few million vectors, pgvector with HNSW indexes is fast enough and avoids a separate database. Move to a dedicated vector database (Qdrant, Pinecone, Milvus) only when you hit scale, need sharding, or have filter-heavy workloads that Postgres cannot keep up with.'
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Qdrant upsert + query (self-hosted or Qdrant Cloud)',
          code: `from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct,
    Filter, FieldCondition, MatchValue,
)
from sentence_transformers import SentenceTransformer

client = QdrantClient(host="localhost", port=6333)
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Create a collection (cosine distance, 384-dim)
client.recreate_collection(
    collection_name="docs",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

# Upsert points with metadata
vectors = embedder.encode(["Cats are great.", "Dogs are loyal."])
client.upsert(
    collection_name="docs",
    points=[
        PointStruct(id=1, vector=vectors[0].tolist(),
                    payload={"topic": "cats", "lang": "en"}),
        PointStruct(id=2, vector=vectors[1].tolist(),
                    payload={"topic": "dogs", "lang": "en"}),
    ],
)

# Query with metadata filter
qvec = embedder.encode("feline pets").tolist()
results = client.search(
    collection_name="docs",
    query_vector=qvec,
    query_filter=Filter(must=[
        FieldCondition(key="lang", match=MatchValue(value="en")),
    ]),
    limit=5,
)
for r in results:
    print(r.id, r.score, r.payload)`
        }
      ],
      advantages: [
        'Purpose-built for fast ANN search at scale (millisecond queries over billions of vectors).',
        'Metadata filtering, CRUD, sharding, and replication built-in.',
        'Most support hybrid search and reranking integrations.'
      ],
      disadvantages: [
        'Adds infrastructure complexity (another database to operate).',
        'Cost — managed services bill by usage; self-hosted requires ops capacity.',
        'Vector indexes are not relational — joins with other data require denormalisation or a separate DB.'
      ],
      commonMistakes: [
        'Reaching for a distributed vector database at 100k vectors when pgvector would do.',
        'Forgetting to set the right distance metric at collection creation — defaults vary by system.',
        'Not benchmarking filter selectivity — heavy metadata filtering can break ANN performance.'
      ],
      limitations: [
        'ANN search trades recall for speed — you may miss some true neighbours.',
        'Vector indexes must be rebuilt when changing distance metric or dimension.',
        'Most vector databases do not support transactions across vectors and relational data with full ACID guarantees (pgvector is an exception).'
      ],
      relatedConcepts: ['ANN Search', 'HNSW', 'IVF', 'Metadata Filtering', 'pgvector'],
      faq: [
        { q: 'Do I need a vector database if I already use Postgres?', a: 'Probably not for small-to-medium workloads. Install pgvector, add an HNSW index, and you get semantic search alongside your relational data. Move to a dedicated vector database only when you outgrow Postgres.' },
        { q: 'Pinecone vs Qdrant vs Milvus?', a: 'Pinecone for managed zero-ops; Qdrant for self-hosted with great filtering and performance; Milvus for very large distributed deployments. All three are competitive on raw quality — pick by operational fit.' }
      ],
      summary:
        'Vector databases store high-dimensional vectors and run fast ANN search with metadata filtering and CRUD. Standalone products (Pinecone, Qdrant, Milvus, Weaviate) are purpose-built for scale; pgvector extends PostgreSQL for apps that want vector search alongside relational data. For most apps under ~10M vectors, pgvector is enough — graduate to a dedicated vector database when you hit scale, sharding, or filter-heavy workloads.'
    },
    {
      id: 'ann-search',
      title: 'Approximate Nearest-Neighbor Search',
      subtitle: 'HNSW graphs and IVF partitions — how vector search stays fast at billion scale.',
      tags: ['ann', 'hnsw', 'ivf', 'search', 'indexing'],
      readingMinutes: 9,
      definition:
        'Approximate Nearest-Neighbor (ANN) search trades a small amount of recall for massive speedups over exact search. The two dominant algorithms are HNSW (Hierarchical Navigable Small World graphs) and IVF (Inverted File index with k-means clustering). Both reduce search from O(N·d) to roughly O(log N · d) with 90%+ recall.',
      whyItExists:
        'Exact nearest-neighbour search compares the query against every vector — fine for 10k vectors, catastrophic for 100M. ANN accepts a small probability of missing a few true neighbours in exchange for 100–1000× speedups. This tradeoff is what makes real-time semantic search at web scale possible.',
      howItWorks: [
        { type: 'h3', text: 'HNSW: hierarchical navigable small-world graphs' },
        {
          type: 'p',
          text: 'HNSW builds a multi-layer graph. The bottom layer contains every vector, connected to nearby neighbours. Higher layers contain progressively sparser subsets — each layer keeps roughly an exponential fraction of the nodes below, with long-range "small-world" connections. Search starts at the top (sparse) layer, greedily moves toward the query, then descends layer by layer. By the time it reaches the dense bottom layer, it is already in the correct neighbourhood and only needs a few local hops to find the k nearest neighbours.'
        },
        {
          type: 'p',
          text: 'Two parameters control the speed/quality tradeoff: M (the number of graph edges per node, typically 16–48) and efConstruction / efSearch (the size of the candidate list during index build / search, typically 100–500). Higher M and ef values improve recall but cost more memory and time. HNSW is the default index in most modern vector databases (Qdrant, pgvector, Pinecone) because it gives the best speed/recall tradeoff for most workloads.'
        },
        { type: 'h3', text: 'IVF: inverted file with k-means partitions' },
        {
          type: 'p',
          text: 'IVF clusters the vector space with k-means into nlist partitions (often thousands). Each vector is assigned to its nearest centroid. At query time, the system finds the nprobe nearest centroids and searches only vectors in those partitions — reducing work by a factor of nlist/nprobe. Higher nprobe gives better recall at proportionally higher cost. IVF is often combined with Product Quantization (PQ), which compresses each vector from 4·d bytes to ~64 bytes by splitting it into sub-vectors and encoding each with a small codebook.'
        },
        { type: 'h3', text: 'Exact vs approximate: when to use which' },
        {
          type: 'p',
          text: 'Exact search (brute force, or using an exact index like FAISS IndexFlatL2) is right when (a) your dataset is small (under ~50k vectors), (b) you need 100% recall (legal, medical, compliance), or (c) you are benchmarking ANN recall. ANN is right at scale or when 95–99% recall is acceptable. Most production vector databases default to HNSW with ef values tuned for ~98% recall at sub-10ms latency.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Recall is not free',
          text: 'The "approximate" in ANN is real. At low ef or nprobe settings, HNSW/IVF can miss 10–20% of true neighbours. Always benchmark recall@k against an exact search on a sample of your queries before shipping. If recall is too low, raise ef or nprobe (slower but more accurate) or use a stronger index (higher M).'
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'text',
          caption: 'HNSW search pseudocode (simplified)',
          code: `function hnsw_search(query, graph, K, ef):
    # Start at the entry point on the top (sparsest) layer
    current = graph.entry_point
    for layer from graph.top_layer down to 1:
        # Greedy search on this layer only — find local minimum
        current = greedy_search_layer(query, current, layer, ef=1)

    # On layer 0 (dense), search with full ef and return top-K
    candidates = greedy_search_layer(query, current, layer=0, ef=ef)
    return top_K(candidates, K, by=distance_to(query))

function greedy_search_layer(query, entry, layer, ef):
    visited = set()
    candidates = priority_queue(by=distance_to(query))
    candidates.push(entry)
    while candidates not empty:
        c = candidates.pop_closest()
        for neighbour in graph.edges(c, layer):
            if neighbour not in visited:
                visited.add(neighbour)
                if distance(query, neighbour) < candidates.farthest() or len(candidates) < ef:
                    candidates.push(neighbour)
    return candidates`
        }
      ],
      advantages: [
        '100–1000× faster than exact search at 95%+ recall.',
        'HNSW handles dynamic inserts/deletes well — no full rebuild needed for moderate churn.',
        'IVF+PQ compresses vectors 10–50×, enabling billion-vector indexes on a single node.'
      ],
      disadvantages: [
        'Approximate — you trade some recall for speed.',
        'Index build is expensive (HNSW) or requires re-clustering (IVF) as data grows.',
        'Hyperparameters (M, ef, nlist, nprobe) require tuning per dataset.'
      ],
      commonMistakes: [
        'Setting ef or nprobe too low to hit latency targets without measuring recall loss.',
        'Using IVF with too few partitions on small datasets — partitions become empty or imbalanced.',
        'Forgetting to rebuild HNSW after bulk deletes (some implementations leave dangling edges).'
      ],
      limitations: [
        'Recall caps below 100% — if you need every true neighbour, use exact search.',
        'Filtered queries (metadata + ANN) can degrade recall badly if the filter is very selective.',
        'Memory: HNSW graphs add 1–3× the vector storage as graph edges.'
      ],
      relatedConcepts: ['HNSW', 'IVF', 'Product Quantization', 'FAISS', 'Recall@k'],
      faq: [
        { q: 'HNSW vs IVF — which is better?', a: 'HNSW gives better speed/recall for most workloads under ~10M vectors and supports incremental updates. IVF (especially IVF+PQ) wins at very large scale where memory is the bottleneck, because PQ compresses vectors 10–50×.' },
        { q: 'What is recall@k?', a: 'The fraction of true top-k nearest neighbours that the ANN search returns. recall@10 = 0.95 means ANN returns 9.5 of the 10 true nearest neighbours on average.' },
        { q: 'How do I tune HNSW?', a: 'Start with M=16, efConstruction=200, efSearch=100. Measure recall@10 against an exact search. If recall is too low, raise efSearch first (cheap); if still too low, raise M (expensive, requires rebuild).' }
      ],
      summary:
        'ANN search trades recall for speed via HNSW graphs or IVF partitions. HNSW builds a multi-layer navigable graph — search descends from sparse to dense layers, reaching the correct neighbourhood quickly. IVF clusters vectors with k-means and probes only the nearest partitions, often combined with PQ compression. Both reduce O(N) search to O(log N) with 95%+ recall. Always benchmark recall@k against exact search before shipping — the "approximate" is real.'
    },
    {
      id: 'metadata-filtering',
      title: 'Metadata Filtering',
      subtitle: 'Constraining vector search by attributes — and the pre-filter vs post-filter tradeoff.',
      tags: ['metadata', 'filtering', 'vector-db', 'search'],
      readingMinutes: 6,
      definition:
        'Metadata filtering constrains vector search results by attributes stored alongside each vector (source, date, language, author, tags). It enables queries like "find documents semantically similar to my query, but only from 2024 and only in English" — combining semantic relevance with business rules.',
      whyItExists:
        'Pure vector search returns whatever is semantically closest, ignoring real-world constraints. A retrieval system that surfaces a deprecated doc from 2019 over a current doc from 2024 is unusable in production. Metadata filtering makes vector search respect time, source, language, access control, and other constraints that matter to the application.',
      howItWorks: [
        { type: 'h3', text: 'Pre-filtering vs post-filtering' },
        {
          type: 'p',
          text: 'Pre-filtering applies the metadata filter first, reducing the candidate set, then runs ANN search only over the matching subset. The result is exact within the filtered set, but the ANN index may be ineffective on small subsets — if the filter narrows to 1% of vectors, the HNSW graph has few relevant nodes to traverse and recall can drop. Post-filtering runs ANN first, then drops results failing the filter — fast, but if the filter is selective, you may run out of candidates before returning enough results.'
        },
        { type: 'h3', text: 'Hybrid approaches' },
        {
          type: 'p',
          text: 'Modern vector databases use hybrid strategies. Qdrant uses filtered HNSW: it pre-computes which graph edges are valid under common filters and uses an optimised traversal that respects the filter during search. Weaviate combines a traditional inverted index (for metadata) with HNSW (for vectors) so it can pre-filter efficiently. Pinecone supports both modes and lets you pick per query. The right choice depends on filter selectivity — narrow filters need pre-filtering, broad filters tolerate post-filtering.'
        },
        { type: 'h3', text: 'Filter selectivity is the key variable' },
        {
          type: 'p',
          text: 'Filter selectivity = (matching vectors) / (total vectors). A filter selecting 50% of vectors (e.g. "lang = en" in a mostly-English corpus) is unselective — post-filtering works fine. A filter selecting 0.1% (e.g. "user_id = 42" in a multi-tenant system) is highly selective — post-filtering returns almost nothing, and pre-filtering is essential. Most production systems dynamically pick the strategy based on estimated selectivity.'
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Index your metadata',
          text: 'Just like a SQL database needs indexes on filtered columns, a vector database needs indexes on filtered metadata fields. Without an index on "user_id", every pre-filtered query scans all vectors. Qdrant, Weaviate, and Pinecone all support metadata field indexes — enable them for any field you filter on.'
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Filtered vector search in Qdrant (pre-filter via metadata index)',
          code: `from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue, Range

client = QdrantClient(host="localhost", port=6333)

# Query: "RAG architecture docs in English, published after 2024-01-01"
results = client.search(
    collection_name="docs",
    query_vector=query_embedding,
    query_filter=Filter(must=[
        FieldCondition(key="lang", match=MatchValue(value="en")),
        FieldCondition(key="topic", match=MatchValue(value="rag")),
        FieldCondition(key="published_at", range=Range(gte=1704067200)),
    ]),
    limit=10,
)

# Pre-filtering is automatic in Qdrant: it uses metadata indexes to
# narrow the candidate set BEFORE running HNSW, preserving recall.`
        }
      ],
      advantages: [
        'Combines semantic relevance with business rules — essential for production.',
        'Enables multi-tenant isolation (filter by user_id or org_id).',
        'Lets you control freshness, language, source, and access without separate indexes.'
      ],
      disadvantages: [
        'Highly selective filters can break ANN recall if not pre-filtered correctly.',
        'Filtering adds latency, especially when metadata fields are not indexed.',
        'Complex boolean filters (nested AND/OR) are not supported uniformly across databases.'
      ],
      commonMistakes: [
        'Filtering on unindexed metadata fields — every query scans the full collection.',
        'Using post-filtering on highly selective filters — empty results are common.',
        'Forgetting multi-tenant isolation (a user sees another user docs) — always filter by tenant_id.'
      ],
      limitations: [
        'Filter selectivity below ~1% can require falling back to exact search within the filtered subset.',
        'Some vector databases do not support filtering on numeric ranges or array membership with the same performance as equality.'
      ],
      relatedConcepts: ['Vector Databases', 'HNSW', 'Pre-filtering', 'Multi-Tenancy'],
      faq: [
        { q: 'How do I know if my filter is selective?', a: 'Estimate the fraction of vectors that match. If under 5%, expect pre-filtering; if over 30%, post-filtering is fine. Most modern vector databases auto-detect and switch, but check your database docs.' },
        { q: 'Should I use one collection per tenant or filter by tenant_id?', a: 'For under 1000 tenants, filter by tenant_id with an indexed metadata field. For over 10k tenants with strong isolation requirements, separate collections (or namespaces, in Pinecone) are cleaner.' },
        { q: 'Can I filter by vector similarity AND metadata at the same time?', a: 'Yes — that is exactly what metadata filtering in a vector database does. The metadata filter narrows candidates, then ANN ranks the survivors by vector similarity.' }
      ],
      summary:
        'Metadata filtering constrains vector search by attributes like date, language, source, or tenant. The key tradeoff is pre-filtering (apply filter first, then ANN — accurate but slow on small subsets) vs post-filtering (ANN first, then filter — fast but may return too few results). Modern vector databases use hybrid strategies and metadata indexes to handle both ends of the selectivity spectrum. Always index fields you filter on, and benchmark recall on your most selective filters.'
    },
    {
      id: 'hybrid-search',
      title: 'Hybrid Search',
      subtitle: 'BM25 + vector + reciprocal rank fusion — getting the best of lexical and semantic.',
      tags: ['hybrid-search', 'bm25', 'rrf', 'fusion', 'retrieval'],
      readingMinutes: 7,
      definition:
        'Hybrid search runs lexical (keyword/BM25) and semantic (vector) search in parallel and merges the rankings with a fusion method such as Reciprocal Rank Fusion (RRF) or a weighted score. It catches exact-match queries that vector search misses and semantic matches that keyword search misses.',
      whyItExists:
        'Vector search misses exact-match queries (product codes, names, rare terms) — a user searching for "iPhone 15 Pro Max 256GB" wants documents containing those exact tokens, not semantically related text. BM25 misses synonyms and paraphrases. Hybrid search recovers both failure modes by combining the two rankings, which is why most production RAG systems use it as the first retrieval stage.',
      howItWorks: [
        { type: 'h3', text: 'Step 1: run both retrievers' },
        {
          type: 'p',
          text: 'A hybrid pipeline runs BM25 (often via Lucene, Elasticsearch, OpenSearch, or Postgres full-text search) and vector search (via your vector database) in parallel, producing two ranked lists: A = [a₁, a₂, …, a_K] from BM25 and B = [b₁, b₂, …, b_K] from vector search. Each list contains document IDs and a score. The two scores are not comparable — BM25 scores can be 0–30+, vector cosine is typically 0–1 — so you cannot just add them.'
        },
        { type: 'h3', text: 'Step 2: fuse the rankings' },
        {
          type: 'p',
          text: 'Reciprocal Rank Fusion (RRF) sidesteps the score-comparison problem by working on ranks, not scores. For each document d, RRF computes score(d) = Σ 1 / (k + rank_i(d)), summed over both retrievers, where k is a constant (typically 60) and rank_i(d) is the document rank in retriever i (1-indexed; missing documents contribute 0). The final ranked list is sorted by descending RRF score. RRF is robust because it does not require score calibration — only the relative ordering matters.'
        },
        {
          type: 'p',
          text: 'The alternative is weighted score fusion: normalise each retriever scores to [0, 1] (min-max or z-score), then combine as α · bm25_norm + (1-α) · vector_norm. This can outperform RRF if you tune α carefully on a held-out query set, but it requires score calibration and is sensitive to score distribution shifts when the corpus changes.'
        },
        { type: 'h3', text: 'When hybrid search wins' },
        {
          type: 'p',
          text: 'Hybrid search wins on queries that mix specific and general intent: "What is the refund policy for SKU-12345?" (general concept + specific token). Pure BM25 misses the refund-policy paraphrase; pure vector search misses the SKU. Hybrid catches both. For purely semantic queries ("how do I handle anxiety?"), vector search alone is fine. For purely lexical queries ("error code E-4021"), BM25 alone is fine. Hybrid is the safe default when query intent is mixed.'
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Weaviate and Vespa build it in',
          text: 'Weaviate, Vespa, and OpenSearch have native hybrid search with built-in RRF or score fusion. If you are already using one of these, hybrid search is a configuration flag, not custom code. Otherwise, run two retrievers and fuse in application code.'
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Reciprocal Rank Fusion in pure Python',
          code: `from typing import List, Dict

def reciprocal_rank_fusion(
    ranked_lists: List[List[str]],  # list of ranked document-ID lists
    k: int = 60,                    # standard constant from the original paper
) -> List[str]:
    """Fuse multiple ranked lists into one with RRF."""
    scores: Dict[str, float] = {}
    for ranked in ranked_lists:
        for rank, doc_id in enumerate(ranked, start=1):
            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)

# Usage: run BM25 and vector search, then fuse
bm25_results   = ["doc_42", "doc_7", "doc_19", "doc_3"]   # ranked by BM25
vector_results = ["doc_19", "doc_42", "doc_55", "doc_7"]  # ranked by cosine

fused = reciprocal_rank_fusion([bm25_results, vector_results])
# -> ["doc_42", "doc_19", "doc_7", "doc_55"]
# doc_42 and doc_19 appear high in BOTH lists, so RRF boosts them.`
        }
      ],
      advantages: [
        'Recovers both exact-match (BM25) and semantic-match (vector) queries in one pipeline.',
        'RRF requires no score calibration — robust to score distribution shifts.',
        'Native support in Weaviate, Vespa, OpenSearch, and most modern vector databases.'
      ],
      disadvantages: [
        'Requires running two retrieval systems (BM25 + vector DB) — more infrastructure.',
        'Weighted fusion needs tuning α on a query set — RRF is parameter-light but not always optimal.',
        'Latency is bounded by the slower retriever unless run in parallel.'
      ],
      commonMistakes: [
        'Adding raw BM25 and vector scores without normalisation — meaningless because scales differ.',
        'Using BM25 on text that was not properly tokenised or analysed (lowercasing, stemming).',
        'Forgetting to deduplicate document IDs across the two ranked lists before fusion.'
      ],
      limitations: [
        'RRF is rank-based and discards score information — if one retriever is much more confident, RRF ignores that.',
        'Hybrid search does not fix bad embeddings or bad tokenisation — both retrievers must be reasonable.'
      ],
      relatedConcepts: ['BM25', 'Vector Search', 'Reciprocal Rank Fusion', 'Reranking'],
      faq: [
        { q: 'RRF vs weighted score fusion — which should I use?', a: 'Start with RRF (no tuning needed). If you have a labelled query set and time to tune, weighted fusion can beat RRF by 5–10% nDCG. RRF is the safe default for production.' },
        { q: 'What value of k for RRF?', a: 'The original paper used k=60 and it works well in practice. Lower k gives more weight to top ranks; higher k flattens differences. Stick with 60 unless you have a reason to tune.' },
        { q: 'Do I need hybrid search for every RAG system?', a: 'No — for purely semantic Q&A over general text, vector search alone is fine. Hybrid is most valuable when queries mix specific tokens (names, codes) with semantic intent.' }
      ],
      summary:
        'Hybrid search runs BM25 and vector search in parallel, then merges rankings via Reciprocal Rank Fusion (score = Σ 1/(k+rank)) or weighted score fusion. It recovers exact-match queries that vector search misses and semantic matches that keyword search misses, making it the default first retrieval stage in most production RAG systems. RRF is the safe, parameter-light default; weighted fusion can squeeze out more quality with a labelled query set.'
    },
    {
      id: 'reranking',
      title: 'Reranking',
      subtitle: 'Cross-encoders and Cohere Rerank — turning top-100 into the right top-10.',
      tags: ['reranking', 'cross-encoder', 'bi-encoder', 'cohere', 'retrieval'],
      readingMinutes: 7,
      definition:
        'Reranking takes an initial candidate set (typically top-50 to top-200 from vector or hybrid search) and applies a more expensive but more accurate model — usually a cross-encoder — to re-score and reorder the candidates. The cross-encoder processes (query, candidate) jointly, capturing fine-grained interactions that bi-encoder embeddings cannot.',
      whyItExists:
        'Bi-encoder embeddings (used for retrieval) embed query and document independently — they cannot model token-level interactions between query and document. Cross-encoders feed both into a transformer simultaneously so attention can compare query tokens to document tokens, producing much more accurate relevance scores. But cross-encoders are too slow to run over millions of docs. Reranking bridges this: retrieve fast with bi-encoders, refine with a cross-encoder on the top candidates.',
      howItWorks: [
        { type: 'h3', text: 'Bi-encoder vs cross-encoder' },
        {
          type: 'p',
          text: 'A bi-encoder embeds the query and the document independently: q_vec = encode(query), d_vec = encode(doc), similarity = q_vec · d_vec. Because documents can be embedded offline, retrieval is a single dot-product lookup — fast and scalable to billions of docs. The cost: the encoder cannot see the query when encoding the document, so it cannot model "this document is relevant to this query" specifically. It can only model "this document is about X" and "this query is about X".'
        },
        {
          type: 'p',
          text: 'A cross-encoder concatenates [query, document] and feeds both into the transformer simultaneously: score = model([CLS] query [SEP] document [SEP]). Self-attention lets every query token attend to every document token, so the model can verify that the document actually addresses the query (not just shares its topic). The cost: you must run the full transformer for every (query, doc) pair at query time, making it O(N) in candidates — too slow for full-corpus search but fine for top-100.'
        },
        { type: 'h3', text: 'The standard reranking pipeline' },
        {
          type: 'ol',
          items: [
            'Embed the query and run vector search to retrieve top-K candidates (K = 50–200).',
            'Optionally fuse with BM25 results (hybrid search) for top-K.',
            'Score each candidate with the cross-encoder: score_i = cross_encoder(query, candidate_i).',
            'Sort candidates by descending cross-encoder score.',
            'Return the top-k (typically k = 5–10) to the LLM for generation.'
          ]
        },
        {
          type: 'table',
          headers: ['Aspect', 'Bi-encoder (retrieval)', 'Cross-encoder (reranking)'],
          rows: [
            ['Query/doc interaction', 'Independent encoding', 'Joint attention'],
            ['Latency per pair', '~1 ms (vector lookup)', '~5–50 ms (transformer forward pass)'],
            ['Scalability', 'Billions of docs', 'Top-100 candidates'],
            ['Accuracy', 'Good (recall-oriented)', 'Excellent (precision-oriented)'],
            ['Typical use', 'First-stage retrieval', 'Second-stage reranking']
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Reranking is the single biggest retrieval quality lever',
          text: 'In RAG benchmarks, adding a cross-encoder reranker on top of vector search typically improves nDCG@10 by 10–20% — more than any embedding model swap. If you have a retrieval quality problem and are not reranking, add reranking first.'
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Reranking with Cohere Rerank API and sentence-transformers cross-encoder',
          code: `# --- Option A: Cohere Rerank (managed, fast, multilingual) ---
import cohere
co = cohere.Client("YOUR_API_KEY")

results = co.rerank(
    model="rerank-english-v3.0",
    query="How do I reset my password?",
    documents=["Account recovery steps...", "Billing FAQ...", "Password reset guide..."],
    top_n=3,
)
for r in results.results:
    print(r.index, r.relevance_score)   # original index + reranked score in [0, 1]

# --- Option B: open-source cross-encoder via sentence-transformers ---
from sentence_transformers import CrossEncoder
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

pairs = [(query, doc) for doc in retrieved_docs]  # top-100 from vector search
scores = reranker.predict(pairs)                  # shape (100,)
ranked = sorted(zip(retrieved_docs, scores), key=lambda x: -x[1])[:5]`
        }
      ],
      advantages: [
        'Cross-encoders capture query-document interactions that bi-encoders structurally cannot.',
        'Typically improves nDCG@10 by 10–20% on top of vector search.',
        'Managed APIs (Cohere Rerank, Voyage) make it drop-in without GPU infrastructure.'
      ],
      disadvantages: [
        'Adds latency (50–500ms for top-100, depending on model and hardware).',
        'Adds cost (per-pair billing for managed, GPU for self-hosted).',
        'Cross-encoder models are usually English-only or limited multilingual.'
      ],
      commonMistakes: [
        'Reranking too many candidates (top-1000 instead of top-100) — latency explodes for tiny quality gains.',
        'Using a cross-encoder on out-of-domain text (a general web reranker on medical docs may underperform).',
        'Skipping reranking and trying to fix retrieval quality by swapping embedding models — rerank first.'
      ],
      limitations: [
        'Cross-encoders still cap at ~512 tokens per (query, doc) pair — long documents need chunking first.',
        'Reranking cannot fix recall problems — if the right doc is not in the top-K from stage 1, reranking cannot surface it.'
      ],
      relatedConcepts: ['Cross-Encoder', 'Bi-Encoder', 'Retrieval-Augmented Generation', 'Cohere Rerank'],
      faq: [
        { q: 'How many candidates should I rerank?', a: 'Typically 50–200. Below 50 you lose recall from the first stage; above 200 latency grows linearly with little quality gain. Benchmark nDCG@10 vs latency on your queries.' },
        { q: 'Open-source or Cohere Rerank?', a: 'Cohere Rerank is the easiest path — managed, multilingual, no GPU. BGE-reranker-large and ms-marco-MiniLM are strong open-source alternatives if you need self-hosting or lower cost at scale.' },
        { q: 'Can I rerank with an LLM (GPT-4) instead of a cross-encoder?', a: 'You can, but it is 100× more expensive and slower than a dedicated cross-encoder. Use LLM-as-reranker only when you need the LLM reasoning (e.g. "is this document responsive to this complex multi-constraint query?").' }
      ],
      summary:
        'Reranking applies a cross-encoder to the top-K candidates from first-stage retrieval. Cross-encoders process (query, document) jointly via self-attention, capturing interactions that bi-encoders structurally cannot — at the cost of O(K) transformer passes. The standard pipeline: retrieve top-100 with vector/hybrid search, rerank with a cross-encoder (Cohere Rerank, BGE-reranker, ms-marco-MiniLM), return top-5 to the LLM. Reranking is the single biggest retrieval quality lever in RAG — add it before swapping embedding models.'
    }
  ]
}
