import type { Module } from './types'

export const module1: Module = {
  id: 'm1',
  index: 1,
  title: 'Artificial Intelligence Fundamentals',
  shortTitle: 'AI Fundamentals',
  description:
    'Start here. Learn what AI really is, how it evolved from rule-based systems to modern neural networks, and the core machine-learning concepts (training, inference, loss, gradient descent, backpropagation) that everything else in this academy builds on.',
  level: 'Beginner',
  icon: 'Brain',
  color: 'from-blue-500 to-violet-500',
  quizId: 'q1',
  lessons: [
    {
      id: 'what-is-ai',
      title: 'What is Artificial Intelligence?',
      subtitle: 'A precise definition that separates marketing hype from engineering reality.',
      tags: ['ai', 'fundamentals', 'definition'],
      readingMinutes: 6,
      definition:
        'Artificial Intelligence (AI) is the engineering discipline of building computer systems that perform tasks normally requiring human intelligence — perception, reasoning, language understanding, learning, and decision-making — without being explicitly programmed for every case.',
      whyItExists:
        'Traditional software is deterministic: a programmer writes rules and the computer follows them exactly. AI exists because many real-world problems (recognizing a face, translating a sentence, diagnosing a disease, driving a car) are too complex to specify with hand-written rules. Instead of writing the answer, we write a procedure that learns the answer from data.',
      howItWorks: [
        {
          type: 'p',
          text: 'An AI system has three parts: (1) a model — a parameterised function that maps inputs to outputs, (2) a training procedure that adjusts those parameters using data, and (3) an inference procedure that uses the trained model on new inputs. The "intelligence" lives entirely in the parameters and the architecture; nothing magical is happening.'
        },
        {
          type: 'p',
          text: 'There are two big families. Symbolic AI (also called Good Old-Fashioned AI, or GOFAI) represents knowledge as explicit symbols and rules: "IF fever > 38°C AND cough THEN suspect flu". Sub-symbolic AI (modern machine learning and deep learning) represents knowledge as numerical patterns in a model. Modern systems blend both — for example, an LLM (sub-symbolic) that can call a calculator (symbolic).'
        },
        { type: 'h3', text: 'Capability spectrum' },
        {
          type: 'table',
          headers: ['Type', 'What it does', 'Example'],
          rows: [
            ['Narrow AI (ANI)', 'One task well', 'Spam filter, speech-to-text, GPT-class LLM'],
            ['General AI (AGI)', 'Cross-domain human-level reasoning', 'Still theoretical — no system today qualifies'],
            ['Superintelligent AI', 'Beyond human across all domains', 'Speculative; not the subject of this academy']
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why this matters',
          text: 'Every system you will build in this academy is Narrow AI. That is not a limitation to be embarrassed about — it is the engineering reality. Understanding it keeps your designs honest.'
        }
      ],
      examples: [
        { type: 'p', text: 'A spam filter is AI. It looks at features of an email (word frequencies, sender reputation, links) and outputs a probability that the email is spam. No human wrote the rule "if the email contains \'Viagra\' mark it as spam" — the model learned which features matter from thousands of labelled examples.' },
        { type: 'p', text: 'A chess engine that uses hand-coded heuristics is technically software, not AI in the modern sense. AlphaZero, which learned chess by self-play without human heuristics, is AI. The difference is whether behaviour is learned from data or specified by rules.' }
      ],
      advantages: [
        'Solves problems that are too complex for hand-written rules.',
        'Adapts to new data without a code change.',
        'Can discover patterns humans would miss.',
        'Generalises — a model trained on emails works on emails it has never seen.'
      ],
      disadvantages: [
        'Requires data — often a lot of it, labelled correctly.',
        'Outputs are probabilistic, not guaranteed correct.',
        'Opaque: it is hard to explain why a deep model produced a particular output.',
        'Vulnerable to distribution shift — a model trained on 2020 data may fail in 2024.'
      ],
      commonMistakes: [
        'Treating AI as a magic box that "just works" without understanding its training data and limits.',
        'Confusing AGI (general intelligence) with narrow AI. Today\'s systems are all narrow.',
        'Believing a model "understands" — it pattern-matches, it does not have awareness.',
        'Deploying a model without measuring its failure modes on real-world data.'
      ],
      limitations: [
        'Modern AI has no commonsense grounding outside its training distribution.',
        'It cannot reliably verify its own outputs (this is what makes LLM hallucinations possible).',
        'It inherits biases present in training data.',
        'Performance is bounded by data quality and quantity.'
      ],
      relatedConcepts: ['Machine Learning', 'Deep Learning', 'Narrow vs General AI', 'Symbolic AI'],
      faq: [
        { q: 'Is AI the same as machine learning?', a: 'No. Machine learning is a subset of AI. AI is the broad goal; ML is the dominant modern technique for achieving it. Other approaches include symbolic AI and search algorithms.' },
        { q: 'Are LLMs like ChatGPT "intelligent"?', a: 'They exhibit intelligent behaviour on many language tasks, but they are statistical pattern matchers trained on text. They have no persistent memory, no world model in the human sense, and no awareness.' },
        { q: 'When will we have AGI?', a: 'There is no consensus. Some researchers believe scaling current architectures will get us there; others believe fundamentally new ideas are required. Treat any specific timeline as speculation.' }
      ],
      summary:
        'AI is the engineering of systems that learn from data instead of following hand-written rules. Everything in this academy — from neural networks to LLMs to multi-agent systems — is a refinement of this basic idea. Keep this grounded definition in mind; it will protect you from hype.'
    },
    {
      id: 'history-of-ai',
      title: 'A Short History of AI',
      subtitle: 'From the Dartmouth workshop to GPT-class models — the cycles of boom and winter.',
      tags: ['ai', 'history', 'context'],
      readingMinutes: 7,
      definition:
        'The history of AI is a series of breakthroughs followed by hype, then disappointment ("AI winters"), then renewed progress driven by better algorithms, more data, and faster hardware.',
      whyItExists:
        'Knowing this history prevents you from repeating past mistakes. Every AI generation thought it was 20 years from AGI. Every generation hit a wall. Modern deep learning is the first paradigm to keep scaling for over a decade — but the lessons of humility still apply.',
      howItWorks: [
        { type: 'h3', text: 'The five major eras' },
        {
          type: 'table',
          headers: ['Era', 'Years', 'Big idea', 'Why it stalled'],
          rows: [
            ['Symbolic / GOFAI', '1956–1974', 'Hand-coded rules and search', 'Combinatorial explosion; common sense was hard'],
            ['First AI Winter', '1974–1980', 'Funding collapse', 'Promised too much; failed on real problems'],
            ['Expert Systems', '1980–1987', 'Encapsulate human expertise in rules', 'Brittle; expensive to maintain; no learning'],
            ['Second AI Winter', '1987–1993', 'Market collapse', 'Specialised hardware displaced by PCs'],
            ['Statistical ML', '1993–2012', 'Learn from data with statistics', 'Limited compute and data'],
            ['Deep Learning', '2012–2020', 'Multi-layer neural networks + GPUs', '(Still scaling)']
          ]
        },
        { type: 'h3', text: 'The 2012 turning point' },
        {
          type: 'p',
          text: 'AlexNet won the ImageNet 2012 image-classification competition by a wide margin using a deep convolutional neural network trained on GPUs. This proved three things at once: (1) depth matters, (2) GPUs make training large models feasible, (3) massive labelled datasets (ImageNet had 1.2M images) unlock capabilities that small datasets cannot. The next decade was an extrapolation of these three insights.'
        },
        { type: 'h3', text: '2017: "Attention Is All You Need"' },
        {
          type: 'p',
          text: 'Google researchers introduced the Transformer architecture, replacing recurrence with self-attention. Transformers parallelised better on GPUs, scaled better with data, and produced better language models. By 2020, GPT-3 (175B parameters) demonstrated that scaling Transformers on web text produces models that can perform many tasks from a few examples. This is the foundation of every LLM you will study in Module 3.'
        },
        { type: 'h3', text: '2022 onwards: chat, agents, multimodal' },
        {
          type: 'p',
          text: 'ChatGPT (Nov 2022) made LLMs usable by non-researchers via instruction tuning and RLHF. Since then, progress has split into: better base models, multimodal models (text + image + audio), open-weight model releases (Llama, Mistral, Qwen), and the agentic layer (tool use, RAG, multi-agent systems) — which is what Modules 5–11 of this academy cover.'
        }
      ],
      examples: [
        { type: 'p', text: 'The 1960s ELIZA chatbot pattern-matched user input against rules to simulate a Rogerian therapist. Many users believed it understood them — an early lesson in how easily people over-attribute intelligence to systems that produce plausible text. The same effect returned with ChatGPT 60 years later.' }
      ],
      commonMistakes: [
        'Believing current progress is inevitable and irreversible — past AI booms stalled.',
        'Assuming today\'s dominant architecture (Transformer) is the final one.',
        'Ignoring the role of compute and data scaling in current results.'
      ],
      relatedConcepts: ['Symbolic AI', 'Expert Systems', 'Deep Learning', 'Transformer'],
      faq: [
        { q: 'Why did AI winters happen?', a: 'Hype outran capability. Funders expected AGI in years; researchers delivered narrow systems. When expectations collapsed, funding dried up and the field stalled for years.' },
        { q: 'Could another AI winter happen?', a: 'Possible but unlikely in the near term because deep learning has delivered consistent commercial value (search, ads, recommendations, code assistance). A slowdown in capability gains is more likely than a full winter.' }
      ],
      summary:
        'AI has cycled through symbolic AI, expert systems, statistical ML, and now deep learning. Each era was driven by a new technique plus new infrastructure (rules → statistics → GPUs → Transformers). Today\'s progress rests on three pillars: scale of data, scale of compute, and the Transformer architecture.'
    },
    {
      id: 'traditional-vs-modern-ai',
      title: 'Traditional AI vs Modern AI',
      subtitle: 'Why deep learning displaced rule-based systems — and where rules still win.',
      tags: ['ai', 'comparison', 'fundamentals'],
      readingMinutes: 6,
      definition:
        'Traditional AI uses hand-engineered features and explicit rules. Modern AI (deep learning) learns hierarchical features directly from raw data using differentiable neural networks.',
      whyItExists:
        'The shift exists because for perception and language tasks (vision, speech, NLP) human-engineered features plateaued: no team of linguists could write rules that handle the variety of real-world sentences. Neural networks learn features that humans would not have thought to specify, and they keep improving with more data.',
      howItWorks: [
        { type: 'h3', text: 'Feature engineering vs learned features' },
        {
          type: 'p',
          text: 'In traditional ML, a domain expert writes feature extractors. For spam detection, you might compute: contains_word("free"), sender_reputation, uppercase_ratio, link_count. A classifier (logistic regression, SVM, random forest) then combines those features. In deep learning, you feed raw tokens or pixels into a neural network; the first layers learn low-level features, deeper layers combine them into higher-level abstractions, and the final layer makes the prediction — all trained end-to-end.'
        },
        {
          type: 'table',
          headers: ['Dimension', 'Traditional AI', 'Modern AI (Deep Learning)'],
          rows: [
            ['Features', 'Hand-engineered', 'Learned from data'],
            ['Data need', 'Modest (hundreds–thousands of examples)', 'Large (millions+ for SOTA)'],
            ['Compute need', 'Low (CPU is fine)', 'High (GPUs/TPUs)'],
            ['Interpretability', 'Often high', 'Often low'],
            ['Best at', 'Tabular data, small data, regulated domains', 'Perception, language, generation'],
            ['Worst at', 'High-dimensional raw signals', 'Small data, exact reasoning']
          ]
        },
        { type: 'h3', text: 'Where rules still win' },
        {
          type: 'p',
          text: 'Deep learning did not kill rule-based systems. Rules still dominate in: tax calculation (exactness required), safety interlocks, business policy, compliance, and any domain where correctness must be provable. Modern systems often combine both — an LLM (learned) wrapped in tools that include calculators and rule engines (symbolic).'
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Traditional ML: hand-engineered features + classifier',
          code: `from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Hand-designed features: TF-IDF on words
vectorizer = TfidfVectorizer(min_df=2, ngram_range=(1, 2))
X_train = vectorizer.fit_transform(train_emails)
y_train = train_labels  # 1 = spam, 0 = ham

clf = LogisticRegression(class_weight='balanced')
clf.fit(X_train, y_train)

# At inference, the SAME hand-designed features are extracted
X_test = vectorizer.transform(test_emails)
preds = clf.predict(X_test)`
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Modern DL: raw tokens -> transformer -> prediction (schematic)',
          code: `import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)

# No feature engineering — model learns from raw tokens
enc = tokenizer(email_texts, padding=True, truncation=True, return_tensors="pt")
logits = model(**enc).logits           # [N, 2]
preds = logits.argmax(dim=-1)`
        }
      ],
      advantages: [
        'Modern AI handles raw high-dimensional data (pixels, audio, text) far better than traditional AI.',
        'Modern AI keeps improving with more data — traditional ML plateaus.',
        'Modern AI can do generation (text, images, audio); traditional ML mostly classifies.'
      ],
      disadvantages: [
        'Modern AI needs far more data and compute.',
        'Modern AI is less interpretable.',
        'Modern AI is non-deterministic and probabilistic — bad fit for exactness-critical tasks.'
      ],
      commonMistakes: [
        'Using deep learning where a logistic regression on good features would do better and be 100x cheaper.',
        'Throwing away interpretable traditional models in regulated domains where explainability is legally required.',
        'Assuming "modern" means "always better" — pick the tool that fits the data and the constraint.'
      ],
      relatedConcepts: ['Symbolic AI', 'Feature Engineering', 'Deep Learning', 'Hybrid Systems'],
      faq: [
        { q: 'Should I always use deep learning?', a: 'No. For tabular data with hundreds of rows, gradient-boosted trees (XGBoost, LightGBM) often beat deep learning. Use deep learning when you have high-dimensional raw data and enough of it.' },
        { q: 'Can I combine traditional and modern AI?', a: 'Yes, and you usually should. An LLM that calls a deterministic rule engine for compliance checks is a typical production pattern.' }
      ],
      summary:
        'Traditional AI uses hand-crafted features and explicit rules; modern AI learns features end-to-end from raw data. Deep learning won the perception and language war, but rule-based and statistical methods remain the right tool for tabular data, small data, and exactness-critical domains.'
    },
    {
      id: 'ml-paradigms',
      title: 'Supervised, Unsupervised, Reinforcement Learning',
      subtitle: 'The three paradigms that cover almost every ML system.',
      tags: ['ml', 'supervised', 'unsupervised', 'reinforcement'],
      readingMinutes: 7,
      definition:
        'Supervised learning trains on labelled (input, output) pairs. Unsupervised learning finds structure in unlabelled data. Reinforcement learning trains an agent to maximise cumulative reward through trial and error in an environment.',
      whyItExists:
        'Different problems offer different kinds of signal. If you have labels (this image is a cat, this email is spam), supervised learning is the most direct route. If you only have raw data (customer behaviour logs) and want to discover segments, unsupervised learning fits. If you have a goal but no labelled examples (win a chess game), reinforcement learning applies.',
      howItWorks: [
        { type: 'h3', text: 'Supervised learning' },
        {
          type: 'p',
          text: 'Given a dataset D = {(x₁, y₁), …, (xₙ, yₙ)}, learn a function f: x → y that generalises to new x. For regression, y is continuous (price, temperature). For classification, y is discrete (spam/ham, cat/dog/bird). Training minimises a loss function L(f(x), y) averaged over the dataset.'
        },
        { type: 'h3', text: 'Unsupervised learning' },
        {
          type: 'p',
          text: 'Given unlabelled inputs {x₁, …, xₙ}, discover structure: clusters (k-means, DBSCAN), low-dimensional embeddings (PCA, t-SNE, UMAP), or density estimation. Modern generative models (VAEs, diffusion) are also unsupervised — they learn the data distribution p(x) and can sample from it.'
        },
        { type: 'h3', text: 'Reinforcement learning' },
        {
          type: 'p',
          text: 'An agent observes state sₜ, takes action aₜ, receives reward rₜ, and transitions to sₜ₊₁. The goal is to learn a policy π(a|s) that maximises expected discounted return. RL produced AlphaGo, AlphaZero, and the RLHF step that aligns modern LLMs with human preferences.'
        },
        {
          type: 'table',
          headers: ['Paradigm', 'Signal', 'Typical tasks', 'Examples in this academy'],
          rows: [
            ['Supervised', 'Labelled (x, y)', 'Classification, regression', 'Spam filter, fine-tuning an LLM on Q&A pairs'],
            ['Unsupervised', 'Raw x only', 'Clustering, embedding, generation', 'Embedding models (Module 4), pretraining LLMs'],
            ['Reinforcement', 'Reward signal', 'Control, games, alignment', 'RLHF (Module 3), AlphaGo']
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'LLM pretraining is a special case',
          text: 'Pretraining a Transformer on text is "self-supervised" — the model predicts the next token, and the label is just the next token from the data itself. No human labelled anything. This is why we can train on trillions of tokens.'
        }
      ],
      examples: [
        { type: 'p', text: 'Supervised: you have 50,000 labelled movie reviews (positive/negative) and train a sentiment classifier. Prediction on a new review returns a label.' },
        { type: 'p', text: 'Unsupervised: you have 50,000 unlabelled customer purchase histories. K-means groups customers into 5 clusters; you then inspect the clusters and name them manually ("bargain hunters", "luxury buyers", …).' },
        { type: 'p', text: 'Reinforcement: a robot learns to walk by trying motor commands, receiving positive reward for forward motion and negative reward for falling. After millions of attempts in simulation, the policy can walk in the real world.' }
      ],
      commonMistakes: [
        'Calling everything "AI" without identifying the learning paradigm — this leads to wrong tooling and wrong evaluation metrics.',
        'Trying supervised learning on data you do not have labels for — you either label it, use unsupervised learning, or use a pretrained model.',
        'Using RL where supervised learning works — RL is sample-inefficient and hard to debug.'
      ],
      relatedConcepts: ['Self-Supervised Learning', 'Semi-Supervised Learning', 'Transfer Learning'],
      faq: [
        { q: 'Is LLM training supervised or unsupervised?', a: 'Pretraining is self-supervised (a special case of unsupervised). Instruction tuning is supervised. RLHF is reinforcement learning. A modern LLM is produced by all three in sequence.' }
      ],
      summary:
        'Three paradigms — supervised (labels), unsupervised (raw data), reinforcement (reward) — cover virtually every ML system. Most modern LLMs use all three: self-supervised pretraining, supervised instruction tuning, and RLHF.'
    },
    {
      id: 'neural-networks',
      title: 'Neural Networks',
      subtitle: 'Why stacked linear layers with non-linearities can approximate any function.',
      tags: ['neural-networks', 'deep-learning', 'fundamentals'],
      readingMinutes: 8,
      definition:
        'A neural network is a function f(x; θ) built by stacking layers, where each layer computes a weighted sum of its inputs plus a bias, then applies a non-linear activation. The parameters θ (weights and biases) are learned from data by gradient descent.',
      whyItExists:
        'The Universal Approximation Theorem proves that a feed-forward network with one hidden layer and a non-linear activation can approximate any continuous function to arbitrary accuracy. In practice, deep (many-layer) networks approximate complex functions with far fewer parameters than shallow ones — which is why we use "deep" learning.',
      howItWorks: [
        { type: 'h3', text: 'A single neuron' },
        {
          type: 'p',
          text: 'A neuron computes y = σ(wᵀx + b), where w is a weight vector, b is a bias, and σ is a non-linear activation (ReLU, sigmoid, tanh, GELU). Without σ, stacking layers would just compose linear functions — equivalent to a single linear layer. The non-linearity is what gives neural networks their expressiveness.'
        },
        { type: 'h3', text: 'A multi-layer network' },
        {
          type: 'p',
          text: 'A feed-forward network with L layers computes h₀ = x, hₗ = σ(Wₗ hₗ₋₁ + bₗ) for l = 1..L-1, and y = W_L h_{L-1} + b_L. The "hidden" representations hₗ learn progressively more abstract features. In an image classifier, early layers learn edges, middle layers learn textures and parts, late layers learn object categories.'
        },
        {
          type: 'diagram',
          diagramId: 'neural-net-layers',
          caption: 'A 3-layer feed-forward network: input → hidden → hidden → output.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Minimal multi-layer perceptron in PyTorch',
          code: `import torch
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, in_dim, hidden, out_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, hidden), nn.GELU(),
            nn.Linear(hidden, hidden), nn.GELU(),
            nn.Linear(hidden, out_dim),
        )
    def forward(self, x):
        return self.net(x)

model = MLP(in_dim=768, hidden=512, out_dim=10)
x = torch.randn(32, 768)        # 32 samples, 768 features
logits = model(x)               # [32, 10]
preds = logits.argmax(dim=-1)`
        },
        { type: 'h3', text: 'Architectures beyond feed-forward' },
        {
          type: 'ul',
          items: [
            'CNNs (convolutional neural networks) — exploit spatial structure in images.',
            'RNNs / LSTMs — process sequences; mostly superseded by Transformers.',
            'Transformers — use self-attention; the architecture behind all modern LLMs.',
            'Diffusion models — generate images/audio by learning to reverse a noising process.',
            'GANs — generator + discriminator compete; used for image generation.'
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'MNIST digit classification: a 784→128→64→10 MLP trained on 60k images reaches >98% accuracy on test digits. This is the "hello world" of neural networks.' }
      ],
      advantages: [
        'Universal approximators — flexible enough for any continuous input-output mapping.',
        'End-to-end learning — no need to hand-design features.',
        'Scale well with data and compute.'
      ],
      disadvantages: [
        'Data-hungry compared to classical ML.',
        'Many hyperparameters (depth, width, learning rate, regularisation) to tune.',
        'Opaque — hard to interpret decisions.',
        'Easy to overfit on small datasets.'
      ],
      commonMistakes: [
        'Starting with a huge network when a smaller one would generalise better.',
        'Forgetting to normalise inputs — neural nets train poorly on unnormalised data.',
        'Using sigmoid/tanh in deep networks (vanishing gradients); use ReLU or GELU instead.',
        'Not setting a random seed — non-reproducible experiments are unscientific.'
      ],
      relatedConcepts: ['Backpropagation', 'Gradient Descent', 'Activation Functions', 'Transformers'],
      faq: [
        { q: 'How deep should my network be?', a: 'Start shallow and add layers only if validation loss stops improving. Depth helps when you have lots of data; on small data it causes overfitting.' },
        { q: 'Why ReLU over sigmoid?', a: 'Sigmoid saturates and produces vanishing gradients in deep networks. ReLU keeps gradients alive for positive inputs and trains much faster.' }
      ],
      summary:
        'A neural network stacks linear layers with non-linearities to approximate complex functions. Depth gives parameter efficiency. The activation function is essential — without it, the network collapses to a single linear layer. Modern architectures (CNN, Transformer, diffusion) are specialised neural network families tuned for particular data types.'
    },
    {
      id: 'training-inference',
      title: 'Training vs Inference',
      subtitle: 'Two distinct phases with different compute, memory, and engineering requirements.',
      tags: ['training', 'inference', 'fundamentals'],
      readingMinutes: 5,
      definition:
        'Training (a.k.a. learning or fitting) is the process of adjusting model parameters on a dataset. Inference is the process of using the trained model to produce predictions on new inputs. They share the same model code but use different code paths, hardware, and optimisations.',
      whyItExists:
        'Confusing the two leads to expensive mistakes. Training a 70B-parameter LLM costs millions of dollars and takes weeks; running inference on the same model costs cents per thousand tokens. You cannot ship a model you cannot run inference on; you cannot improve a model without retraining (or fine-tuning).',
      howItWorks: [
        { type: 'h3', text: 'Training loop' },
        {
          type: 'ol',
          items: [
            'Sample a batch of (x, y) from the training data.',
            'Forward pass: compute predictions ŷ = f(x; θ).',
            'Compute loss L(ŷ, y) — e.g. cross-entropy for classification.',
            'Backward pass: compute gradients ∂L/∂θ via backpropagation.',
            'Update parameters: θ ← θ - η · ∂L/∂θ (gradient descent step).',
            'Repeat for many epochs, validating on a held-out set.'
          ]
        },
        { type: 'h3', text: 'Inference' },
        {
          type: 'p',
          text: 'Inference does only the forward pass. Parameters are frozen. Optimisations focus on latency, throughput, and memory: quantisation (int8 / int4 weights), KV caching (cache attention keys/values to avoid recomputation), batching (process many requests together), and distillation (train a smaller student model that mimics a larger teacher).'
        },
        {
          type: 'table',
          headers: ['Dimension', 'Training', 'Inference'],
          rows: [
            ['Compute pattern', 'Forward + backward + optimiser step', 'Forward only'],
            ['Memory', 'Activations + gradients + optimiser state', 'Activations + KV cache'],
            ['Hardware', 'GPUs/TPUs, often many in parallel', 'GPUs, CPUs, or specialised accelerators'],
            ['Batch size', 'Large, fixed', 'Dynamic, often small'],
            ['Latency target', 'Hours to weeks total', 'Milliseconds to seconds per request']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'GPT-3 training: estimated 3.14 × 10²³ FLOPs over ~34 days on 10,000 GPUs. Inference on the same model: ~500ms to generate 100 tokens on a single A100 GPU — a trillion-times-smaller per-step compute.' }
      ],
      commonMistakes: [
        'Trying to fine-tune a model when prompt engineering would solve the problem.',
        'Running inference on training hardware (massive GPUs) when a quantised model on a cheaper GPU would do.',
        'Forgetting that the training distribution must match the inference distribution — a model trained on news data will fail on tweets.'
      ],
      relatedConcepts: ['Pretraining', 'Fine-Tuning', 'Quantization', 'KV Cache'],
      faq: [
        { q: 'Can I update a model without full retraining?', a: 'Yes — fine-tuning (especially LoRA) updates a small fraction of parameters cheaply. But the base model still required full pretraining.' },
        { q: 'Why is inference still expensive?', a: 'Because the model has billions of parameters that all participate in every forward pass. KV caching helps with autoregressive generation but not with the first-token latency.' }
      ],
      summary:
        'Training adjusts parameters using forward + backward passes; inference uses only the forward pass with frozen parameters. They share code but have different hardware, optimisations, and cost profiles. The biggest production mistake is conflating the two.'
    },
    {
      id: 'loss-optimization',
      title: 'Loss Functions, Gradient Descent, Backpropagation',
      subtitle: 'The mathematical engine that turns data into learned parameters.',
      tags: ['loss', 'gradient-descent', 'backpropagation', 'optimization'],
      readingMinutes: 9,
      definition:
        'A loss function measures how wrong the model is on a batch. Gradient descent updates parameters in the direction that reduces loss. Backpropagation efficiently computes the gradient of the loss with respect to every parameter using the chain rule.',
      whyItExists:
        'Without these three, neural networks would be untrainable. The loss defines the goal. Gradient descent gives a direction to move. Backpropagation makes computing the direction tractable for networks with billions of parameters.',
      howItWorks: [
        { type: 'h3', text: 'Loss functions' },
        {
          type: 'p',
          text: 'For classification, cross-entropy loss L = -Σ yᵢ log(ŷᵢ) penalises confident wrong predictions heavily. For regression, mean-squared error L = (ŷ - y)² is standard. For next-token prediction (LLM pretraining), we use cross-entropy over the vocabulary. The choice of loss encodes what you want the model to optimise — pick wrong and the model will optimise the wrong thing.'
        },
        { type: 'h3', text: 'Gradient descent' },
        {
          type: 'p',
          text: 'The gradient ∂L/∂θ points in the direction of steepest increase of the loss. To reduce loss, move against it: θ ← θ - η · ∂L/∂θ, where η is the learning rate. Stochastic gradient descent (SGD) estimates the gradient on a small batch (32–4096 samples) rather than the full dataset — much faster and surprisingly accurate. Modern optimisers (Adam, AdamW) add momentum and per-parameter adaptive learning rates.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Learning rate is the most important hyperparameter',
          text: 'Too high: training diverges (loss → NaN). Too low: training is painfully slow and may get stuck. Typical ranges: 1e-5 to 1e-3 for fine-tuning, 1e-4 to 1e-2 for from-scratch training. Always use a learning-rate warmup + cosine schedule for transformers.'
        },
        { type: 'h3', text: 'Backpropagation' },
        {
          type: 'p',
          text: 'Backprop applies the chain rule from the output layer backward through every layer to the input. For a layer computing y = σ(Wx + b), it computes how much each weight wᵢⱼ contributed to the final loss, using the upstream gradient and the local derivative. Time complexity is roughly 2× the forward pass. Modern autograd systems (PyTorch, JAX) implement this automatically — you write the forward pass and call .backward().'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'A complete training step in PyTorch',
          code: `import torch
import torch.nn as nn
import torch.optim as optim

model = nn.Sequential(nn.Linear(768, 256), nn.GELU(), nn.Linear(256, 10))
optimizer = optim.AdamW(model.parameters(), lr=1e-4, weight_decay=0.01)
loss_fn = nn.CrossEntropyLoss()

# One training step
x, y = batch_inputs, batch_labels          # x: [B, 768], y: [B]
optimizer.zero_grad()                      # clear old gradients
logits = model(x)                          # forward pass
loss = loss_fn(logits, y)                  # compute loss
loss.backward()                            # backprop — fills .grad on every param
optimizer.step()                           # gradient descent update
print(f"loss={loss.item():.4f}")`
        }
      ],
      examples: [
        { type: 'p', text: 'Imagine rolling a ball down a hilly surface — the loss landscape. The ball follows the negative gradient. A good learning rate is steep enough to reach the valley but not so steep it bounces out. Momentum (in Adam) is like giving the ball inertia so it can roll through shallow local minima.' }
      ],
      advantages: [
        'Backprop + autograd make training billion-parameter models tractable.',
        'Stochastic mini-batches scale to datasets of any size.',
        'Adaptive optimisers (AdamW) reduce hyperparameter tuning burden.'
      ],
      disadvantages: [
        'Loss landscapes are non-convex — no guarantee of finding the global optimum.',
        'Sensitive to learning rate, batch size, and initialisation.',
        'Memory grows with batch size and model size.'
      ],
      commonMistakes: [
        'Forgetting optimizer.zero_grad() — gradients accumulate across steps in PyTorch.',
        'Picking a loss function that does not match the task (e.g. MSE for classification).',
        'Using too high a learning rate with no warmup — transformers often diverge.',
        'Not clipping gradients — large gradients cause instability.'
      ],
      relatedConcepts: ['Activation Functions', 'Optimizers', 'Learning Rate Schedules', 'Gradient Clipping'],
      faq: [
        { q: 'SGD vs Adam — which should I use?', a: 'Adam/AdamW is the default for transformers and most modern deep learning. SGD with momentum can generalise slightly better for some image tasks but needs more tuning.' },
        { q: 'Why do we need warmup?', a: 'Early in training, gradients are noisy and large. A low learning rate for the first few thousand steps lets the model settle into a reasonable region before the full learning rate kicks in.' }
      ],
      summary:
        'Loss measures error, gradient descent moves parameters against the gradient to reduce loss, and backprop computes that gradient efficiently via the chain rule. Together they make billion-parameter models trainable. The learning rate is the single most important hyperparameter — tune it carefully.'
    },
    {
      id: 'overfitting-evaluation',
      title: 'Overfitting, Underfitting, and Model Evaluation',
      subtitle: 'How to know if your model actually learned — or just memorised.',
      tags: ['overfitting', 'evaluation', 'generalization'],
      readingMinutes: 7,
      definition:
        'Overfitting: the model fits training data so closely that it fails on new data. Underfitting: the model is too simple to capture the underlying pattern. Evaluation is the discipline of measuring true generalisation using data the model has not seen.',
      whyItExists:
        'A model that achieves 99% on training data but 60% on test data is useless — it has memorised, not learned. Without rigorous evaluation, you cannot tell whether you have a real model or a memorisation machine. This is the single most common failure mode in applied ML.',
      howItWorks: [
        { type: 'h3', text: 'Train / validation / test split' },
        {
          type: 'ol',
          items: [
            'Training set — used to fit parameters.',
            'Validation set — used to tune hyperparameters and decide when to stop training.',
            'Test set — used once, at the end, to estimate real-world performance.'
          ]
        },
        {
          type: 'callout',
          variant: 'danger',
          title: 'Never touch the test set',
          text: 'If you tune hyperparameters using test-set performance, you have leaked information and your test score is no longer an honest estimate of generalisation. This is called "test set contamination" and it invalidates your evaluation.'
        },
        { type: 'h3', text: 'Symptoms and fixes' },
        {
          type: 'table',
          headers: ['Symptom', 'Diagnosis', 'Fix'],
          rows: [
            ['Train loss ↓, val loss ↑', 'Overfitting', 'Regularisation, more data, early stopping, smaller model'],
            ['Train and val loss both high', 'Underfitting', 'Bigger model, train longer, better features'],
            ['Train loss ↓, val loss flat', 'Capacity bottleneck', 'Add layers / parameters; check data quality'],
            ['Loss spikes randomly', 'Bad learning rate or bad data', 'Lower LR, gradient clip, audit data']
          ]
        },
        { type: 'h3', text: 'Regularisation techniques' },
        {
          type: 'ul',
          items: [
            'Dropout — randomly zero out neurons during training; forces redundancy.',
            'Weight decay (L2) — penalise large weights in the loss.',
            'Early stopping — halt when validation loss starts increasing.',
            'Data augmentation — synthesise new training examples (flip images, paraphrase text).',
            'Batch normalisation / layer normalisation — stabilise training and add slight regularisation.'
          ]
        },
        { type: 'h3', text: 'Evaluation metrics' },
        {
          type: 'table',
          headers: ['Task', 'Metric', 'Notes'],
          rows: [
            ['Classification (balanced)', 'Accuracy', 'Fraction correct'],
            ['Classification (imbalanced)', 'F1, precision, recall, ROC-AUC', 'Accuracy is misleading on imbalanced data'],
            ['Regression', 'MSE, MAE, R²', 'MSE penalises large errors more'],
            ['Ranking', 'NDCG, MRR', 'Used in search and recommendation'],
            ['Generation', 'BLEU, ROUGE, perplexity, human eval', 'No single metric captures quality — use several']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'A medical-diagnosis model trained on 1,000 patients achieves 99% training accuracy but only 65% on held-out patients. It has memorised the training cohort. The fix is more data, regularisation, and a smaller model — not a bigger one.' }
      ],
      commonMistakes: [
        'Reporting training accuracy as "the model\'s accuracy" — meaningless for generalisation.',
        'Using accuracy on a heavily imbalanced dataset (99% negatives, 1% positives) — a model that always predicts "negative" gets 99% accuracy and zero usefulness.',
        'Tuning on the test set — invalidates evaluation.',
        'Ignoring distribution shift between training and production data.'
      ],
      limitations: [
        'Even a perfect test score does not guarantee production performance if the production distribution differs.',
        'Some failure modes (bias, safety, fairness) are not captured by standard metrics.',
        'Generative-model evaluation is partly subjective; no metric fully replaces human review.'
      ],
      relatedConcepts: ['Cross-Validation', 'Regularization', 'Data Augmentation', 'Distribution Shift'],
      faq: [
        { q: 'What is the 80/10/10 split?', a: 'A common default: 80% train, 10% validation, 10% test. For very large datasets, you can use less for validation/test (e.g. 98/1/1) because absolute counts are still large.' },
        { q: 'How do I evaluate an LLM?', a: 'Use task-specific benchmarks (MMLU, HumanEval, MT-Bench), perplexity on held-out text, and human evaluation. No single metric is sufficient.' }
      ],
      summary:
        'Overfitting means memorising training data; underfitting means failing to learn. Train/validation/test splits let you detect both. Regularisation (dropout, weight decay, early stopping) and honest evaluation metrics are the difference between a real model and a memorisation machine. Always evaluate on data the model has never seen.'
    }
  ]
}
