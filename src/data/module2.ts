import type { Module } from './types'

export const module2: Module = {
  id: 'm2',
  index: 2,
  title: 'Generative AI',
  shortTitle: 'Generative AI',
  description:
    'How models learn to create — text, images, audio, and video — instead of just classifying. This module covers the core generative architectures (diffusion, GANs, VAEs, autoregressive transformers), the mechanics of sampling (temperature, top-p), the practice of prompt engineering, and the honest limitations of generative systems including hallucinations and safety.',
  level: 'Beginner',
  icon: 'Sparkles',
  color: 'from-violet-500 to-fuchsia-500',
  quizId: 'q2',
  lessons: [
    {
      id: 'what-is-genai',
      title: 'What is Generative AI?',
      subtitle: 'Models that produce new content — not just classify existing content.',
      tags: ['generative-ai', 'fundamentals', 'definition'],
      readingMinutes: 6,
      definition:
        'Generative AI is the branch of machine learning that trains models to produce new data samples — text, images, audio, video, code, or 3D assets — that resemble a training distribution, rather than merely labelling or scoring existing inputs.',
      whyItExists:
        'Discriminative AI answers "what is this?" (this image is a cat, this email is spam). Many real tasks instead require "make me one of these" — draft an email, paint a concept, compose a soundtrack, generate a UI mockup. Generative AI exists because for those creative and synthesising tasks, classification is the wrong primitive. You need a model that samples from a learned distribution, not one that predicts a label.',
      howItWorks: [
        {
          type: 'p',
          text: 'A generative model learns an approximation of the data distribution p(x) (or a conditional p(x | c) given some context c). Once trained, you can sample new examples x ~ p(x) that look like training data but are not copies of it. The "generative" part is the sampling step: turning the learned distribution into concrete, novel artefacts.'
        },
        {
          type: 'p',
          text: 'There are three big families of generative models you will meet in this module. Autoregressive models (GPT-class LLMs) generate sequences token by token, each conditioned on the previous. Diffusion models (Stable Diffusion, DALL·E, Midjourney) generate images by learning to reverse a gradual noising process. GANs and VAEs learn a latent space you can sample from — GANs via an adversarial game, VAEs via a probabilistic encoder-decoder.'
        },
        { type: 'h3', text: 'Discriminative vs generative' },
        {
          type: 'table',
          headers: ['Aspect', 'Discriminative', 'Generative'],
          rows: [
            ['Learns', 'p(y | x) — label given input', 'p(x) or p(x | c) — the data distribution'],
            ['Output', 'A label, a score, a bounding box', 'A new sample (text, image, audio)'],
            ['Typical loss', 'Cross-entropy, MSE on labels', 'Likelihood, reconstruction, adversarial, denoising'],
            ['Example task', 'Is this a cat?', 'Draw me a cat'],
            ['Example model', 'ResNet, BERT classifier', 'GPT-4, Stable Diffusion, Whisper']
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why generative models feel magical',
          text: 'A classifier outputs a single label from a tiny set. A generative model outputs from an enormous space (every possible image, every possible paragraph). That is why generative outputs surprise us — and why they also fail in ways classifiers do not (hallucinations, weird artefacts).'
        }
      ],
      examples: [
        { type: 'p', text: 'A spam filter (discriminative) returns "spam" or "not spam" — that is the entire output space. A language model (generative) given the same email could write a reply, summarise it, rewrite it in another language, or generate a similar spam email — because it has learned the distribution of text, not just a label boundary.' },
        { type: 'p', text: 'A face-classification model tells you whether a photo contains a face. A GAN trained on faces (e.g. StyleGAN) can synthesise a photorealistic face of a person who does not exist. The GAN never saw this face; it sampled a point in its learned face-distribution and decoded it.' }
      ],
      advantages: [
        'Produces novel content, not just labels — unlocks drafting, design, and synthesis tasks.',
        'One model can perform many tasks via conditioning (e.g. an LLM can summarise, translate, code, answer).',
        'Generalises to inputs the developers never explicitly anticipated.'
      ],
      disadvantages: [
        'Outputs are probabilistic — they can be wrong, fabricated, or biased.',
        'Evaluation is hard: no single metric captures "is this image good?" or "is this essay correct?".',
        'Compute-hungry at both training and inference time.',
        'Easier to misuse (deepfakes, disinformation, copyright infringement) than discriminative models.'
      ],
      commonMistakes: [
        'Treating generative output as fact — LLMs can hallucinate plausible-sounding falsehoods.',
        'Equating "fluent" with "correct" — a confident answer is not a verified answer.',
        'Assuming generative models understand what they produce; they pattern-match, they do not reason.',
        'Deploying generative systems without output filters, logging, or human review.'
      ],
      limitations: [
        'Generative models reflect the biases and gaps of their training data.',
        'They cannot reliably verify their own outputs.',
        'They struggle with rare, out-of-distribution, or highly precise content.',
        'Sampling quality depends on inference-time controls (temperature, top-p, guidance) that are easy to mis-set.'
      ],
      relatedConcepts: ['Discriminative vs Generative Models', 'Likelihood', 'Latent Space', 'Foundation Models'],
      faq: [
        { q: 'Is ChatGPT a generative model?', a: 'Yes. It generates text token by token, sampling from a learned distribution over the next token. The fact that the output reads as a coherent answer is a property of training on vast text and instruction-tuning — but the mechanism is generative sampling.' },
        { q: 'Can a generative model also classify?', a: 'Yes. A generative model that learned p(x, y) can derive p(y | x) via Bayes\' rule. In practice, modern generative models (LLMs) are also used as classifiers by prompting — but this is usually less efficient than a dedicated discriminative model.' },
        { q: 'Are generative models "creative"?', a: 'They produce novel combinations within their learned distribution. Whether that counts as creativity is a philosophical question; technically, they are sampling, not intending. The creativity usually comes from the human who writes the prompt and curates the output.' }
      ],
      summary:
        'Generative AI trains models to sample from learned data distributions, producing new text, images, audio, or video rather than labels. The three dominant families — autoregressive transformers, diffusion models, and GANs/VAEs — each learn the distribution differently. The leap from discriminative to generative is what made the 2022–2024 AI wave possible.'
    },
    {
      id: 'genai-vs-traditional',
      title: 'Generative AI vs Traditional AI',
      subtitle: 'Classification vs creation — and why the distinction matters in production.',
      tags: ['generative-ai', 'comparison', 'fundamentals'],
      readingMinutes: 6,
      definition:
        'Traditional (discriminative) AI maps inputs to labels or scores. Generative AI maps inputs (or nothing but a noise vector and a prompt) to new samples. The two use different losses, different evaluation, and produce different failure modes.',
      whyItExists:
        'The distinction exists because the engineering, evaluation, and risk profiles are completely different. A classifier has an accuracy score and a confusion matrix; a generative model has no single ground truth to compare against. Treating a generative model like a classifier (expecting deterministic, verifiable outputs) leads to broken products. Treating a classifier like a generative model wastes its precision.',
      howItWorks: [
        { type: 'h3', text: 'What each model actually learns' },
        {
          type: 'p',
          text: 'A discriminative model learns a decision boundary: the surface in input space that best separates classes. It does not need to model the full data distribution, only the boundary. A generative model learns the distribution itself: where the data lives, what configurations are plausible, what comes after what. That is a strictly harder problem — which is why generative models are larger, more data-hungry, and emerged later.'
        },
        {
          type: 'table',
          headers: ['Dimension', 'Traditional (Discriminative) AI', 'Generative AI'],
          rows: [
            ['Objective', 'Minimise classification/regression error', 'Maximise likelihood of data (or fool a discriminator, or denoise)'],
            ['Output space', 'Small, fixed set of labels or numbers', 'Vast space of possible samples'],
            ['Evaluation', 'Accuracy, F1, AUC, MSE — clear and automatic', 'BLEU/ROUGE/FID/CLIPScore + human review — never fully automatic'],
            ['Determinism', 'Usually deterministic given the input', 'Stochastic — same prompt yields different outputs each run'],
            ['Failure mode', 'Misclassification, false negatives', 'Hallucination, incoherence, bias amplification, misuse'],
            ['Typical deploy', 'Behind an API as a classifier', 'Behind an API or chat UI that streams generated tokens/pixels']
          ]
        },
        { type: 'h3', text: 'Where traditional AI still wins' },
        {
          type: 'p',
          text: 'Generative models are not a strict upgrade. For tasks where the answer must be exact and verifiable (fraud detection, disease classification, sensor anomaly detection, credit scoring), a discriminative model trained on labelled data is more accurate, cheaper, faster, auditable, and safer. A generative model that "feels right" is no substitute for a classifier that is right.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Don\'t use an LLM as a classifier by default',
          text: 'If your task is "is this email spam?", training a small BERT classifier on 10k labelled examples beats prompting GPT-4 on cost, latency, and usually accuracy. Use generative models when you need generation, not when you need a label.'
        }
      ],
      examples: [
        { type: 'p', text: 'Bank fraud detection: a gradient-boosted tree scores each transaction 0–1 for fraud probability. Deterministic, auditable, ~1ms latency, $0.0001 per call. Replacing it with an LLM that "reads the transaction and explains whether it looks fishy" would be 1000× slower, 100× more expensive, and non-deterministic — strictly worse.' },
        { type: 'p', text: 'Marketing copy generation: a discriminative model cannot help — there is no label to predict. A generative model can draft 50 variants of an ad, and a human picks the best. Here generation is the task, and a classifier is the wrong tool.' }
      ],
      advantages: [
        'Generative models handle open-ended tasks (drafting, designing, brainstorming) classifiers cannot.',
        'Generative models can be repurposed across many tasks via prompting, reducing model count.',
        'Generative models can produce training data for downstream discriminative models.'
      ],
      disadvantages: [
        'Generative models are more expensive to train and serve.',
        'Generative outputs are stochastic and harder to evaluate.',
        'Generative models introduce new risks (hallucination, misuse, IP) that classifiers do not.',
        'Generative models are overkill — and therefore wasteful — for narrow, well-defined labelling tasks.'
      ],
      commonMistakes: [
        'Using an LLM to do what a 50MB classifier could do better, faster, and cheaper.',
        'Expecting deterministic outputs from a generative model and not setting temperature=0 or a seed.',
        'Comparing a generative model and a classifier on "accuracy" — they solve different problems.',
        'Treating generative output as ground truth in a pipeline (e.g. using LLM-generated labels to train a classifier without verification).'
      ],
      relatedConcepts: ['Discriminative Models', 'Foundation Models', 'Task-Specific vs General Models', 'Determinism in ML'],
      faq: [
        { q: 'Will generative AI replace traditional AI?', a: 'No. They solve different problems. Most production ML systems will continue to use discriminative models for classification/regression and generative models for synthesis/creation. The two compose — an LLM might call a fraud classifier as a tool.' },
        { q: 'When should I reach for a generative model?', a: 'When the task is open-ended (write, summarise, translate, design), when you do not have labelled data but have lots of raw data, or when one model must handle many tasks. Otherwise, prefer a discriminative model.' }
      ],
      summary:
        'Traditional AI predicts labels; generative AI produces samples. The distinction is not aesthetic — it determines loss functions, evaluation, cost, latency, and risk. Use generative models for synthesis, discriminative models for classification, and combine them in production systems.'
    },
    {
      id: 'how-generative-models-learn',
      title: 'How Generative Models Learn',
      subtitle: 'Likelihood, reconstruction, adversarial games, and denoising — the four training signals.',
      tags: ['generative-ai', 'training', 'likelihood'],
      readingMinutes: 7,
      definition:
        'Generative models learn by optimising a training signal that encourages the model\'s learned distribution to match the true data distribution. The four dominant signals are maximum likelihood, reconstruction loss, adversarial loss, and denoising score matching.',
      whyItExists:
        'There is no labelled "correct answer" for a generated image or paragraph. So we cannot use cross-entropy against a label the way a classifier does. Instead, generative training invents a self-supervised or self-play signal: predict the next token, reconstruct the input, fool a discriminator, or reverse the noise. Each signal induces a different family of models with different trade-offs.',
      howItWorks: [
        { type: 'h3', text: '1. Maximum likelihood (autoregressive)' },
        {
          type: 'p',
          text: 'For a sequence x = (x₁, …, xₙ), the chain rule gives p(x) = Π p(xᵢ | x₁, …, xᵢ₋₁). An autoregressive model (GPT) learns each conditional by predicting the next token from the previous ones. The training loss is the negative log-likelihood: L = -Σ log p(xᵢ | x_<i). This is exactly next-token cross-entropy — a self-supervised signal because the label is just the next token from the data.'
        },
        { type: 'h3', text: '2. Reconstruction + regularisation (VAEs)' },
        {
          type: 'p',
          text: 'A VAE encodes input x into a latent distribution q(z|x), samples a z, and decodes it back into x̂. The loss combines reconstruction error (how close x̂ is to x) and a KL-divergence regulariser (how close q(z|x) is to a prior p(z), usually a standard Gaussian). At inference, you sample z ~ N(0, I) and decode — generating new samples.'
        },
        { type: 'h3', text: '3. Adversarial loss (GANs)' },
        {
          type: 'p',
          text: 'A GAN has two networks: a generator G that turns noise z into samples, and a discriminator D that tries to tell real samples from generated ones. They play a minimax game: G tries to fool D, D tries to catch G. At equilibrium, G produces samples indistinguishable from real ones. GANs produce sharp images but are notoriously hard to train (mode collapse, instability).'
        },
        { type: 'h3', text: '4. Denoising score matching (diffusion)' },
        {
          type: 'p',
          text: 'A diffusion model adds Gaussian noise to an input over many steps until it is pure noise, then trains a network to predict the noise that was added at each step. At inference, you start from pure noise and iteratively subtract the predicted noise, gradually producing a clean sample. The training signal is the mean-squared error between predicted and actual noise — remarkably simple and stable.'
        },
        {
          type: 'table',
          headers: ['Family', 'Training signal', 'Strength', 'Weakness'],
          rows: [
            ['Autoregressive (GPT)', 'Next-token likelihood', 'Sharp, controllable, scalable', 'Slow sequential sampling'],
            ['VAE', 'Reconstruction + KL', 'Stable, smooth latent space', 'Blurry outputs'],
            ['GAN', 'Adversarial game', 'Very sharp images', 'Hard to train, mode collapse'],
            ['Diffusion', 'Noise prediction MSE', 'Stable, diverse, high quality', 'Many sampling steps needed']
          ]
        }
      ],
      examples: [
        {
          type: 'code',
          lang: 'python',
          caption: 'Autoregressive next-token loss (the GPT training signal)',
          code: `import torch
import torch.nn.functional as F

# logits: [B, T, V]  - model predictions over vocabulary
# tokens: [B, T]     - the actual next-token labels (shifted)
logits = model(tokens[:, :-1])            # predict t+1 from t
B, T, V = logits.shape

# Cross-entropy = negative log-likelihood of the true next token
loss = F.cross_entropy(
    logits.reshape(B * T, V),
    tokens[:, 1:].reshape(B * T),
)
loss.backward()`
        },
        { type: 'p', text: 'All four signals share a structure: there is no human-provided label. The label is derived from the data itself — the next token, the original image, the "real vs fake" verdict, the noise that was added. This is why generative models can absorb trillions of tokens and billions of images: labelling is not the bottleneck.' }
      ],
      advantages: [
        'Self-supervised signals unlock training on unlabelled data at internet scale.',
        'Four well-understood training paradigms cover virtually every modern generative model.',
        'Each paradigm has known trade-offs — you can pick the right one for the task.'
      ],
      disadvantages: [
        'Likelihood is intractable to compute exactly for most models (need ELBO or surrogate).',
        'GAN training is unstable; mode collapse loses diversity.',
        'Diffusion needs many sequential denoising steps at inference (slow without distillation).',
        'All four signals can produce models that fit the data but encode its biases.'
      ],
      commonMistakes: [
        'Confusing the four families — assuming diffusion and GANs train the same way (they do not).',
        'Picking a GAN when you need diversity (diffusion is better) or a VAE when you need sharpness (GANs/diffusion are better).',
        'Treating likelihood as a quality metric — high likelihood does not mean perceptually good samples.',
        'Forgetting that all four signals can memorise training data if the model is too big and the dataset too small.'
      ],
      relatedConcepts: ['Maximum Likelihood', 'KL Divergence', 'ELBO', 'Score Matching', 'Self-Supervised Learning'],
      faq: [
        { q: 'Which training signal is "best"?', a: 'It depends on the modality and constraints. For text, autoregressive likelihood dominates (GPT). For images, diffusion has largely replaced GANs for quality and diversity. VAEs are still common when you need a fast, smooth latent space (e.g. for representation learning).' },
        { q: 'Why are diffusion models more stable than GANs?', a: 'Diffusion optimises a simple mean-squared error on noise prediction — a well-behaved convex-ish objective. GANs optimise a saddle-point game between two networks, which is non-convex and prone to oscillation and collapse.' }
      ],
      summary:
        'Generative models learn from one of four self-supervised signals: next-token likelihood (autoregressive), reconstruction+KL (VAEs), adversarial games (GANs), or noise prediction (diffusion). Each trades off quality, diversity, stability, and sampling speed differently. Picking the right family is the first architectural decision in any generative project.'
    },
    {
      id: 'text-generation',
      title: 'Text Generation',
      subtitle: 'How an LLM turns a prompt into a stream of tokens, one prediction at a time.',
      tags: ['text-generation', 'llm', 'autoregressive'],
      readingMinutes: 7,
      definition:
        'Text generation is the process of producing a sequence of tokens by repeatedly sampling the next token from a probability distribution over the vocabulary, conditioned on the prompt and the tokens generated so far.',
      whyItExists:
        'Language is sequential and open-ended. There is no fixed-size output space to classify into — the number of possible 200-token sentences exceeds the number of atoms in the universe. Autoregressive generation solves this by composing a long output from many small, tractable next-token predictions. This is how every GPT-class model produces text.',
      howItWorks: [
        { type: 'h3', text: 'The generation loop' },
        {
          type: 'ol',
          items: [
            'Tokenise the prompt into a sequence of token IDs.',
            'Feed the tokens through the transformer to get a logits vector over the vocabulary for the next position.',
            'Convert logits to probabilities via softmax (optionally scaled by temperature).',
            'Sample the next token from that distribution (greedy, top-k, top-p, or full sampling).',
            'Append the new token to the sequence and repeat until a stop token or length limit.'
          ]
        },
        {
          type: 'interactive',
          componentId: 'token-predictor',
          caption: 'Try the next-token predictor: see how probabilities drive each step of generation.'
        },
        {
          type: 'p',
          text: 'Each step is a forward pass over the full sequence so far. Naively, generating N tokens costs O(N²) attention computation. The KV cache optimises this: keys and values for previous tokens are cached, so each new token only computes attention against the cached tensors — making per-step cost O(N) and total O(N²) but with a much smaller constant.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Minimal autoregressive text generation with a HuggingFace model',
          code: `import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

model_id = "Qwen/Qwen2.5-0.5B-Instruct"
tok = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCasaLM.from_pretrained(model_id, torch_dtype=torch.bfloat16).eval()

prompt = "The future of generative AI is"
ids = tok(prompt, return_tensors="pt").input_ids

for _ in range(20):
    with torch.no_grad():
        logits = model(ids).logits[:, -1, :]        # next-token logits
    probs = torch.softmax(logits / 0.8, dim=-1)     # temperature = 0.8
    next_id = torch.multinomial(probs, num_samples=1)
    ids = torch.cat([ids, next_id], dim=-1)
    if next_id.item() == tok.eos_token_id:
        break

print(tok.decode(ids[0]))`
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Greedy vs sampling',
          text: 'Greedy decoding (always pick argmax) produces repetitive, dull text. Sampling from the distribution (with temperature) produces more varied, natural text. For factual Q&A, low temperature (0–0.3) is safer; for creative writing, higher temperature (0.7–1.0) is better.'
        }
      ],
      examples: [
        { type: 'p', text: 'Prompt: "The capital of France is". The model assigns high probability to "Paris" in the next position. With greedy decoding, it outputs "Paris". With temperature 0.7 sampling, it might output "Paris" 95% of the time but occasionally "Lyon" or "a" — which is why temperature matters for reliability.' },
        { type: 'p', text: 'Prompt: "Once upon a time". There is no single correct continuation. Greedy decoding produces a generic fairy tale; sampling at temperature 1.0 produces varied, sometimes surprising, stories. This is the core trade-off: determinism vs diversity.' }
      ],
      advantages: [
        'Composes arbitrarily long outputs from a single, tractable primitive (next-token prediction).',
        'Conditioning is automatic — the prompt is just the prefix of the sequence.',
        'Same model handles countless tasks (translate, summarise, code, answer) via prompting.'
      ],
      disadvantages: [
        'Sequential sampling is inherently slow — you cannot parallelise across generated tokens.',
        'Errors compound: a wrong token early derails the rest of the sequence.',
        'Output is stochastic — same prompt yields different results unless temperature=0 and a seed is set.',
        'KV cache memory grows linearly with context length, limiting long-context generation.'
      ],
      commonMistakes: [
        'Using temperature=0 and expecting zero variance — some samplers still introduce small nondeterminism; set a seed too.',
        'Generating without a max-length limit — a model can loop forever, burning tokens.',
        'Forgetting stop tokens — the model keeps generating past the answer into rambling.',
        'Comparing two prompts at different temperatures and attributing differences to the prompts.'
      ],
      limitations: [
        'Maximum output length is bounded by the model\'s context window.',
        'Generation quality is bounded by training data — the model cannot reliably produce facts it never saw.',
        'No built-in verification — the model can confidently generate false content (hallucination).',
        'Latency grows with output length; throughput requires batching.'
      ],
      relatedConcepts: ['Autoregressive Models', 'KV Cache', 'Sampling Strategies', 'Tokenisation'],
      faq: [
        { q: 'Why can\'t we generate all tokens in parallel?', a: 'Because each token depends on the previous ones — that is what autoregressive means. Non-autoregressive text generation exists but produces much lower quality. Speculative decoding parallelises parts of it by using a smaller draft model, but the underlying dependency remains.' },
        { q: 'What is the KV cache and why does it matter?', a: 'It stores the keys and values computed for previous tokens so they do not need to be recomputed at each step. Without it, generating N tokens would cost O(N³) compute; with it, O(N²). It is the single most important inference optimisation for LLMs.' }
      ],
      summary:
        'Text generation is autoregressive next-token sampling: a transformer predicts a distribution over the next token, you sample from it, append, and repeat. The KV cache makes this tractable. Temperature and sampling strategy control the diversity-vs-determinism trade-off. Every LLM chat experience you have is this loop, streamed one token at a time.'
    },
    {
      id: 'image-generation',
      title: 'Image Generation',
      subtitle: 'From text prompts to pixels — the diffusion revolution and how images are actually synthesised.',
      tags: ['image-generation', 'diffusion', 'stable-diffusion'],
      readingMinutes: 7,
      definition:
        'Image generation is the task of synthesising a new image — typically from a text prompt (text-to-image) or from another image (image-to-image, inpainting, upscaling) — by sampling from a model that has learned the distribution of natural images.',
      whyItExists:
        'Creating images by hand is slow and skilled. Stock photos are limited. Designers, marketers, game artists, and educators need cheap, fast, custom imagery. Generative image models collapse the cost of producing a usable concept image from hours to seconds — and once a model is trained, generating one more image costs fractions of a cent.',
      howItWorks: [
        { type: 'h3', text: 'The diffusion recipe' },
        {
          type: 'p',
          text: 'Modern text-to-image models (Stable Diffusion, DALL·E 3, Midjourney, Flux) are diffusion models operating in a compressed latent space. A text encoder (usually CLIP or T5) turns the prompt into an embedding. The diffusion U-Net or transformer is trained to denoise random latents conditioned on that embedding. At inference, you start with pure noise and the text embedding, and the model gradually refines the latents over 20–50 steps into an image. A VAE decoder then turns the final latent into pixels.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Minimal Stable Diffusion call with the diffusers library',
          code: `import torch
from diffusers import StableDiffusionPipeline

pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16,
).to("cuda")

image = pipe(
    prompt="a bioluminescent jellyfish drifting through a neon city sky, cinematic",
    negative_prompt="blurry, low quality, watermark",
    num_inference_steps=30,        # denoising steps
    guidance_scale=7.5,            # how strongly to follow the prompt
    generator=torch.Generator("cuda").manual_seed(42),
).images[0]

image.save("jellyfish.png")`
        },
        { type: 'h3', text: 'Key controls' },
        {
          type: 'table',
          headers: ['Control', 'What it does', 'Typical range'],
          rows: [
            ['num_inference_steps', 'How many denoising steps to run', '20–50 (more = better but slower)'],
            ['guidance_scale (CFG)', 'How strictly to follow the prompt', '5–10 (too high = artefacts)'],
            ['negative_prompt', 'What to push away from', '"blurry, watermark, deformed"'],
            ['seed', 'Determines the initial noise', 'Fix for reproducibility'],
            ['width / height', 'Output dimensions (must be multiples of 8)', '512×512 to 1536×1536']
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Latent diffusion vs pixel diffusion',
          text: 'Stable Diffusion diffuses in a compressed 64×64 latent space (via a VAE), not on full pixels. This is 64× cheaper than pixel-space diffusion and is why it runs on consumer GPUs. The decoder turns the final latent back into a 512×512 image.'
        }
      ],
      examples: [
        { type: 'p', text: 'Text-to-image: prompt "an astronaut riding a horse on Mars, photorealistic, 35mm film" → a 1024×1024 image in ~3 seconds on an RTX 4090. The model never saw this exact image; it synthesised pixels that match the joint distribution of "astronaut", "horse", and "Mars" conditioned on the text embedding.' },
        { type: 'p', text: 'Image-to-image: feed a rough sketch plus the prompt "futuristic city skyline". The diffusion process starts from a partially noised version of the sketch instead of pure noise, preserving the composition while restyling it. This is the basis of ControlNet, inpainting, and upscaling.' }
      ],
      advantages: [
        'Produces photorealistic, stylistically diverse images from text in seconds.',
        'Cheap per-image once the model is loaded (~$0.001–$0.02 on cloud GPUs).',
        'Highly controllable via prompts, negative prompts, seeds, and conditioning (ControlNet).',
        'Open-weight models (Stable Diffusion, Flux) run locally — no API dependency.'
      ],
      disadvantages: [
        'Struggles with exact composition, specific identities, and text within images (improving but imperfect).',
        'Hands, faces, and limbs still produce anatomical errors at lower steps or with bad prompts.',
        'Training data is scraped from the web — copyright and consent are unresolved.',
        'High VRAM requirement (4–24 GB depending on model and resolution).'
      ],
      commonMistakes: [
        'Setting guidance_scale too high (>15) — images look oversaturated and burnt.',
        'Forgetting the negative prompt — common artefacts (blurry, extra fingers) persist.',
        'Using non-multiple-of-8 dimensions — model produces distorted outputs.',
        'Expecting reproducibility across different GPUs or library versions even with the same seed.'
      ],
      limitations: [
        'Cannot reliably render specific real people or copyrighted characters without fine-tuning (LoRA).',
        'Cannot produce pixel-precise layouts without conditioning tools (ControlNet, inpainting masks).',
        'Biased toward Western aesthetics, light-skinned faces, and English prompts in training data.',
        'No notion of 3D consistency — multiple views of the "same" object are unrelated images.'
      ],
      relatedConcepts: ['Diffusion Models', 'Latent Space', 'CLIP', 'ControlNet', 'VAE'],
      faq: [
        { q: 'Why does the same seed give different results on different GPUs?', a: 'Diffusion involves non-associative floating-point operations whose order varies by hardware/kernel. The seed fixes the initial noise, but tiny numerical differences amplify over 30 denoising steps. For exact reproducibility you need same hardware, same library versions, and deterministic kernels.' },
        { q: 'How do I get a specific person\'s face in the output?', a: 'Train a LoRA on 15–30 images of that person, then reference it in the prompt. Without fine-tuning, the model has no idea what "John" looks like. This also raises obvious consent and misuse concerns.' }
      ],
      summary:
        'Modern image generation is latent diffusion conditioned on a text embedding: encode the prompt, start from noise, denoise 20–50 steps guided by the prompt, decode to pixels. The diffusers library makes this a 10-line script. Mastery is in the controls — steps, guidance, negative prompts, seeds, and conditioning tools like ControlNet.'
    },
    {
      id: 'audio-video-generation',
      title: 'Audio and Video Generation',
      subtitle: 'Speech synthesis, music, sound effects, and short video clips — the modalities beyond text and images.',
      tags: ['audio-generation', 'video-generation', 'multimodal'],
      readingMinutes: 7,
      definition:
        'Audio generation produces waveforms or spectrograms of speech, music, or sound effects from text or other conditioning. Video generation produces sequences of frames, often with audio, from a text prompt or an input image.',
      whyItExists:
        'Half of human communication is audio; video is the dominant medium of online content. Synthetic voiceovers unlock accessibility and localisation at scale. Music generation helps creators without access to composers. Video generation is the next frontier after images — collapsing the cost of producing a clip from a film crew to a prompt.',
      howItWorks: [
        { type: 'h3', text: 'Speech synthesis (TTS)' },
        {
          type: 'p',
          text: 'Modern TTS (ElevenLabs, OpenAI TTS, Bark, XTTS) is end-to-end neural: a text encoder, a duration predictor, and a decoder that produces a spectrogram or waveform directly. Many support voice cloning from a few seconds of reference audio. The decoder is often a diffusion model (for natural prosody) or a flow-matching model. Vocoders (HiFi-GAN) then turn the spectrogram into a 24 kHz waveform.'
        },
        { type: 'h3', text: 'Music and sound effects' },
        {
          type: 'p',
          text: 'Music generation (MusicGen, Stable Audio, Suno, Udio) typically uses a compressed audio representation (e.g. EnCodec tokens) and an autoregressive transformer over those tokens, conditioned on a text prompt. Sound-effect models (AudioGen) work the same way on a different dataset. Longer pieces are generated autoregressively, sliding the context window forward.'
        },
        { type: 'h3', text: 'Video generation' },
        {
          type: 'p',
          text: 'Video models (Sora, Veo, Runway Gen-3, Kling, HunyuanVideo) extend image diffusion to the time axis. The model jointly denoises a stack of frames (or spatio-temporal latents) conditioned on a text prompt. The hard part is temporal consistency: keeping the same character, lighting, and physics coherent across frames. Most models add a 3D attention or factorised spatio-temporal attention to handle this.'
        },
        {
          type: 'table',
          headers: ['Modality', 'Typical architecture', 'Representative models', 'Output length'],
          rows: [
            ['Speech (TTS)', 'Encoder + diffusion/flow decoder + vocoder', 'ElevenLabs, XTTS, OpenAI TTS', 'Seconds to minutes'],
            ['Music', 'Autoregressive transformer over audio tokens', 'MusicGen, Stable Audio, Suno', '30s–4min'],
            ['SFX', 'Autoregressive transformer over audio tokens', 'AudioGen, Stable Audio', '1–10s'],
            ['Video', 'Spatio-temporal diffusion transformer', 'Sora, Veo, Runway Gen-3, HunyuanVideo', '5–20s at 720p']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Voice cloning has serious misuse potential',
          text: 'A few seconds of someone\'s voice is enough to clone it. This enables fraud (impersonation calls), disinformation, and harassment. Responsible deployment requires watermarks, consent verification, and rate limits. Many providers (ElevenLabs, OpenAI) restrict voice cloning to verified accounts.'
        }
      ],
      examples: [
        { type: 'p', text: 'TTS: input "Hello, welcome to the AI Mastery Academy." plus a 10-second clip of a target voice → a 2-second audio file in that voice, indistinguishable to most listeners. Total compute: ~50ms on a modern GPU.' },
        { type: 'p', text: 'Video: prompt "a cinematic tracking shot of a samurai walking through neon-lit Tokyo rain at night" → a 10-second 720p clip with consistent lighting, reflection, and character motion. The model has inferred plausible physics (rain falling, reflections on wet pavement) from its training distribution — but may still produce extra fingers or morphing faces over long shots.' }
      ],
      advantages: [
        'TTS enables cheap localisation and accessibility (audiobooks, screen readers) at scale.',
        'Music generation gives non-musicians a way to prototype soundtracks.',
        'Video generation collapses production costs for short clips from thousands of dollars to cents.',
        'Open-weight audio models (Bark, XTTS, MusicGen) run on consumer hardware.'
      ],
      disadvantages: [
        'Voice cloning enables fraud, impersonation, and harassment.',
        'Generated music raises unresolved copyright questions (training on copyrighted recordings).',
        'Video models are extremely compute-heavy (training: tens of millions of dollars; inference: seconds per frame on H100s).',
        'Temporal consistency in video is still imperfect — long shots drift, objects morph.'
      ],
      commonMistakes: [
        'Deploying TTS without watermarking or consent — many jurisdictions now require disclosure of synthetic audio.',
        'Evaluating music generation with only objective metrics (no human listening test) — perceptual quality dominates.',
        'Expecting video models to follow precise cinematography instructions ("dolly zoom at 35mm") — they respond better to natural-language mood prompts.',
        'Generating audio at low sample rate (16 kHz) for production — aim for 24 kHz+ for natural sound.'
      ],
      limitations: [
        'Long-form audio (>5 min) drifts; structure (verse-chorus, narrative arc) is hard to control.',
        'Video generation cannot reliably produce specific human identities without fine-tuning.',
        'No model has true physical understanding; plausible-looking motion can violate physics.',
        'Real-time generation of high-quality video is not yet feasible on consumer hardware.'
      ],
      relatedConcepts: ['Vocoders', 'Audio Tokenisation', 'Spatio-Temporal Attention', 'Voice Cloning', 'Watermarking'],
      faq: [
        { q: 'How long until I can generate a full movie from a prompt?', a: 'Not soon. Short clips (10–20s) work today. Maintaining character, plot, and visual consistency across 90 minutes requires solving long-horizon reasoning, scene direction, and editing — likely years away, and may require combining video models with LLM directors and editing tools.' },
        { q: 'Is cloned-voice audio illegal?', a: 'It depends on jurisdiction and use. In the US, the FTC bans fraudulent impersonation; the EU AI Act requires disclosure of synthetic media. Non-consensual cloning of a real person\'s voice is increasingly criminalised. Always disclose synthetic audio in production.' }
      ],
      summary:
        'Audio and video generation extend the diffusion/autoregressive recipe to time-series modalities. TTS is production-ready; music is usable for prototypes; video is the current frontier and improves monthly. All three raise sharp ethical and legal questions — voice cloning in particular requires explicit consent, watermarking, and disclosure.'
    },
    {
      id: 'multimodal-ai',
      title: 'Multimodal AI',
      subtitle: 'Models that see, hear, and read — and reason across modalities in a single network.',
      tags: ['multimodal', 'vision-language', 'cross-modal'],
      readingMinutes: 7,
      definition:
        'Multimodal AI is a single model that processes and/or generates more than one modality — typically text plus images, audio, or video — using shared representations that let it reason across modalities (e.g. answer questions about an image, describe a video, generate images from text).',
      whyItExists:
        'The world is multimodal. Humans read text, look at images, listen to audio, and integrate all three seamlessly. A text-only model cannot answer "what is in this photo?"; an image-only model cannot follow a verbal instruction. Multimodal models exist to close that gap — to let a single model ground language in perception and produce any modality on demand.',
      howItWorks: [
        { type: 'h3', text: 'The three architectural patterns' },
        {
          type: 'ol',
          items: [
            'Late fusion: separate encoder per modality, concatenate features at the end. Simple but limited cross-modal reasoning.',
            'Early fusion: project all modalities into a shared token stream and feed one transformer. Used by GPT-4o, Gemini, Pixtral — the dominant modern pattern.',
            'Bridging: a small "connector" network (e.g. MLP or Q-Former) maps image/audio features into the LLM\'s embedding space. Used by LLaVA, BLIP-2.'
          ]
        },
        {
          type: 'p',
          text: 'In a typical early-fusion system, an image is patchified into tokens by a vision encoder (CLIP, SigLIP, ViT), projected into the LLM\'s embedding dimension, and concatenated with text tokens. The transformer then attends across both — so a question about the image can directly attend to the relevant image patches. Audio works analogously via an audio encoder (Whisper, audio codec tokens).'
        },
        {
          type: 'table',
          headers: ['Model class', 'Inputs', 'Outputs', 'Example'],
          rows: [
            ['Vision-Language Model (VLM)', 'Image + text', 'Text', 'GPT-4o, Gemini, Pixtral, LLaVA'],
            ['Text-to-Image', 'Text', 'Image', 'Stable Diffusion, DALL·E, Flux'],
            ['Audio-Language', 'Audio + text', 'Text', 'Whisper, Qwen-Audio'],
            ['Any-to-Any', 'Text, image, audio, video', 'Text, image, audio', 'GPT-4o, Gemini 2.0']
          ]
        },
        {
          type: 'callout',
          variant: 'info',
          title: 'Why shared embeddings matter',
          text: 'CLIP trained image and text encoders so that an image of a cat and the text "a photo of a cat" end up nearby in a shared vector space. This shared space is what lets text prompts steer image generation, lets VLMs answer questions about images, and lets retrieval search across modalities.'
        }
      ],
      examples: [
        { type: 'p', text: 'Image question-answering: feed GPT-4o a photo of a broken circuit board and ask "which capacitor is damaged?" The model attends to the relevant patches, identifies the damaged component, and produces a text answer. A text-only LLM cannot do this; a vision-only model cannot answer in natural language. Multimodality is essential.' },
        { type: 'p', text: 'Document understanding: feed a scanned PDF (images of pages) plus the question "what is the total on line 7?" The model reads text from the image, locates line 7, and returns the number — bridging OCR, layout, and language in one model.' }
      ],
      advantages: [
        'One model handles perception + language, removing brittle pipeline glue (separate OCR + LLM, etc.).',
        'Cross-modal reasoning enables tasks no single-modality model can do (image Q&A, chart reading, video summarisation).',
        'Shared embeddings enable cross-modal retrieval (search images with text, or text with images).',
        'More natural user interaction — point a camera, speak, and get a text answer.'
      ],
      disadvantages: [
        'Larger, more expensive, and harder to train than single-modality models.',
        'Evaluation is harder — must test each modality and cross-modal combinations.',
        'Modality imbalance: models often over-rely on text and ignore image evidence when the two conflict.',
        'New attack surfaces: adversarial images, hidden instructions in image pixels ("prompt injection via image").'
      ],
      commonMistakes: [
        'Assuming the model "sees" what a human sees — VLMs miss small text, fine detail, and spatial counts ("how many fingers?") more often than humans.',
        'Sending huge images without resizing — most VLMs downscale aggressively, losing detail you assumed was there.',
        'Trusting cross-modal retrieval without checking — text-image alignment is good but not perfect, especially for abstract concepts.',
        'Forgetting that multimodal prompts can be injected via image (a photo of text saying "ignore previous instructions").'
      ],
      limitations: [
        'Spatial and counting reasoning is weaker than language reasoning — models often fail "how many X are in this image?"',
        'Long video understanding (>1 min) is still expensive and lossy.',
        'Audio understanding lags image understanding in most current models.',
        'Hallucinations extend across modalities — a VLM can confidently describe an object that is not in the image.'
      ],
      relatedConcepts: ['CLIP', 'Vision Transformers', 'Cross-Attention', 'Contrastive Learning', 'Prompt Injection'],
      faq: [
        { q: 'Is GPT-4o a single model or a pipeline?', a: 'It is a single end-to-end multimodal model — text, image, and audio tokens flow through the same transformer. Earlier systems (ChatGPT with vision) were pipelines that called separate vision encoders. The unified design reduces latency and improves cross-modal reasoning.' },
        { q: 'Can a multimodal model generate images and text?', a: 'Yes — any-to-any models like GPT-4o and Gemini 2.0 generate text and speech natively; image generation typically still calls a separate diffusion model behind the scenes. Truly unified any-to-any image generation in one transformer is an active research area.' }
      ],
      summary:
        'Multimodal AI unifies perception and language in a single model by projecting images, audio, and text into a shared token stream. Early fusion is the dominant pattern (GPT-4o, Gemini). Multimodality unlocks image Q&A, document understanding, and cross-modal retrieval — but introduces new evaluation, safety, and prompt-injection challenges that single-modality models do not face.'
    },
    {
      id: 'diffusion-models',
      title: 'Diffusion Models',
      subtitle: 'The mathematics of generating images by learning to reverse noise.',
      tags: ['diffusion', 'image-generation', 'mathematics'],
      readingMinutes: 8,
      definition:
        'A diffusion model is a generative model that learns to reverse a Markov chain that gradually adds Gaussian noise to data. Training teaches a network to predict the noise added at each step; inference starts from pure noise and iteratively subtracts predicted noise to recover a clean sample.',
      whyItExists:
        'GANs produce sharp images but are unstable and prone to mode collapse. VAEs are stable but blurry. Likelihood-based autoregressive models work for text but are unwieldy for images. Diffusion models offer the best of all three: stable training (a simple MSE loss), high sample quality (sharp, diverse), and tractable likelihood. This is why they took over image generation in 2022 and are spreading to audio, video, and 3D.',
      howItWorks: [
        { type: 'h3', text: 'Forward process (noising)' },
        {
          type: 'p',
          text: 'Given a data sample x₀, the forward diffusion process adds Gaussian noise over T steps according to a variance schedule β₁, …, β_T. A key mathematical convenience: the noisy sample at any step t can be computed in closed form as q(xₜ | x₀) = N(xₜ; √(ᾱₜ) x₀, (1 - ᾱₜ) I), where ᾱₜ = Π (1 - βᵢ). This means you can sample xₜ directly from x₀ without simulating all intermediate steps — crucial for fast training.'
        },
        { type: 'h3', text: 'Reverse process (denoising)' },
        {
          type: 'p',
          text: 'The model learns the reverse distribution pθ(x_{t-1} | xₜ). Remarkably, instead of predicting the clean image directly, training predicts the noise ε that was added. The loss is a simple MSE: L = E[‖ε - εθ(xₜ, t)‖²], where εθ is the network (typically a U-Net). At inference, you start from x_T ~ N(0, I) and iteratively apply the reverse step: x_{t-1} = (1/√αₜ)(xₜ - (βₜ/√(1-ᾱₜ)) εθ(xₜ, t)) + σₜ z.'
        },
        { type: 'h3', text: 'Latent diffusion (Stable Diffusion)' },
        {
          type: 'p',
          text: 'Running diffusion directly on 512×512 pixels is expensive. Stable Diffusion trains a VAE to compress images into a 64×64 latent, runs the diffusion process in that latent space, and decodes the final latent back to pixels. This is ~64× cheaper with no perceptual quality loss, and is the reason Stable Diffusion runs on consumer GPUs.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Minimal DDPM-style training loop (simplified)',
          code: `import torch
import torch.nn.functional as F

# model: a U-Net taking (x_t, t, conditioning) -> predicted noise
# x0: a batch of clean images (or latents), shape [B, C, H, W]
# T: number of diffusion steps (e.g. 1000)
# betas: noise schedule, shape [T]

def train_step(model, x0, betas, T):
    B = x0.shape[0]
    t = torch.randint(0, T, (B,), device=x0.device)        # random step per sample
    eps = torch.randn_like(x0)                              # noise to add
    alpha_bar = torch.cumprod(1 - betas, dim=0)[t]          # ᾱ_t
    # Closed-form noising: x_t = sqrt(ᾱ_t) x0 + sqrt(1-ᾱ_t) eps
    x_t = torch.sqrt(alpha_bar, ()).view(B,1,1,1) * x0 \
        + torch.sqrt(1 - alpha_bar).view(B,1,1,1) * eps
    pred_eps = model(x_t, t)
    loss = F.mse_loss(pred_eps, eps)                        # simple, stable
    return loss`
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Classifier-free guidance (CFG)',
          text: 'At inference, you run the model twice — with and without the conditioning prompt — and extrapolate away from the unconditional prediction. The formula is ε = ε_uncond + s · (ε_cond - ε_uncond), where s is the guidance scale. Higher s follows the prompt more strictly but reduces diversity. This single trick is what makes prompt-following sharp.'
        }
      ],
      examples: [
        { type: 'p', text: 'Generating an image: start with x_T = pure Gaussian noise, run the U-Net 30 times (DDIM sampler), each time predicting and subtracting a bit of noise conditioned on the text embedding. After 30 steps, you have a clean latent; decode it to a 512×512 image. The whole process takes ~2 seconds on an RTX 4090.' },
        { type: 'p', text: 'Inpainting: keep the unmasked region fixed at each reverse step (replacing x_{t-1} there with the noised original), and only denoise the masked region. The result is a seamless fill that matches surrounding context.' }
      ],
      advantages: [
        'Stable training — a single MSE loss, no adversarial game, no mode collapse.',
        'Sample quality and diversity both excellent — dominates image generation since 2022.',
        'Tractable likelihood — can compute a lower bound on log p(x).',
        'Highly steerable — conditioning, CFG, ControlNet, inpainting all build on the same base.'
      ],
      disadvantages: [
        'Many sequential steps at inference (20–1000 depending on sampler) — slower than GANs/VAEs.',
        'Training is compute-heavy — Stable Diffusion 1.5 took ~150k GPU-hours.',
        'Latent space is less interpretable than a VAE\'s.',
        'Sampling schedule and CFG require tuning; defaults are not always optimal.'
      ],
      commonMistakes: [
        'Using too few inference steps (<15) — artefacts and noise appear.',
        'Setting CFG scale too high (>15) — colours burn out, compositions collapse.',
        'Confusing DDPM (1000 steps) with DDIM (20–50 steps) — DDIM is a faster sampler, not a different model.',
        'Forgetting that the same model + different seeds gives different but equally valid outputs.'
      ],
      limitations: [
        'Still slower than GANs for real-time generation; distillation helps but adds complexity.',
        'Best quality is in 2D images; 3D and long video diffusion remain expensive.',
        'Cannot easily guarantee specific layouts without conditioning tools.',
        'Training data biases propagate — known underrepresentation of certain aesthetics and cultures.'
      ],
      relatedConcepts: ['DDPM', 'DDIM', 'Latent Diffusion', 'Classifier-Free Guidance', 'Score-Based Models'],
      faq: [
        { q: 'Why does predicting the noise work better than predicting the clean image directly?', a: 'Predicting the noise is mathematically equivalent to predicting the score function ∇log p(xₜ), which is what the reverse process needs. Empirically, noise-prediction parameterisation converges faster and gives sharper samples than direct x₀-prediction, especially with classifier-free guidance.' },
        { q: 'Are diffusion models replacing GANs entirely?', a: 'For high-quality, diverse image generation, yes. GANs remain useful when you need single-step generation (real-time), strict latent-space control, or specific stylisation. Distilled diffusion (LCM, SD-Turbo) is closing the speed gap.' }
      ],
      summary:
        'Diffusion models learn to reverse a noising process. Training is a stable MSE on noise prediction; inference iteratively denoises from pure noise to a sample. Latent diffusion (operating in a VAE-compressed space) made it affordable. Classifier-free guidance makes prompts steerable. This single recipe underlies Stable Diffusion, DALL·E, Flux, and most modern image, video, and 3D generators.'
    },
    {
      id: 'gans-vaes',
      title: 'GANs and VAEs',
      subtitle: 'The two pre-diffusion generative workhorses — still relevant, still useful.',
      tags: ['gans', 'vaes', 'generative-ai'],
      readingMinutes: 8,
      definition:
        'A Generative Adversarial Network (GAN) trains a generator and a discriminator in a two-player game: the generator tries to fool the discriminator, the discriminator tries to catch the generator. A Variational Autoencoder (VAE) trains a probabilistic encoder-decoder to maximise a lower bound on the data likelihood, producing a smooth, samplable latent space.',
      whyItExists:
        'Before diffusion (2022), GANs and VAEs were the dominant generative image models. GANs produced the sharpest images (StyleGAN faces, GauGAN scenes). VAEs produced the smoothest, most interpretable latent spaces and trained stably. Both remain useful: GANs for real-time generation and stylisation, VAEs as the decoder in latent diffusion and for representation learning.',
      howItWorks: [
        { type: 'h3', text: 'GANs: the adversarial game' },
        {
          type: 'p',
          text: 'A GAN has two networks. The generator G(z) maps a noise vector z to a sample. The discriminator D(x) outputs the probability that x is real (from the dataset) rather than generated. They train simultaneously on the minimax objective: min_G max_D E[log D(x_real)] + E[log(1 - D(G(z)))]. At equilibrium, D cannot distinguish real from fake, meaning G produces realistic samples.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'GAN training pseudocode (one step)',
          code: `# G: generator, D: discriminator, opt_G / opt_D their optimisers
# z: noise batch [B, latent_dim], x_real: real images [B, C, H, W]

# --- Discriminator step ---
opt_D.zero_grad()
z = torch.randn(B, latent_dim, device='cuda')
x_fake = G(z).detach()                       # detach so G is not updated here
d_real = D(x_real)
d_fake = D(x_fake)
loss_D = -(torch.log(d_real) + torch.log(1 - d_fake)).mean()
loss_D.backward(); opt_D.step()

# --- Generator step ---
opt_G.zero_grad()
z = torch.randn(B, latent_dim, device='cuda')
d_fake = D(G(z))
loss_G = -(torch.log(d_fake)).mean()         # non-saturating loss
loss_G.backward(); opt_G.step()`
        },
        { type: 'h3', text: 'VAEs: probabilistic autoencoders' },
        {
          type: 'p',
          text: 'A VAE has an encoder qφ(z|x) producing a distribution over latents (mean μ and variance σ²), and a decoder pψ(x|z). The loss (ELBO) has two terms: reconstruction (how well x is reconstructed from sampled z) and a KL regulariser pulling qφ(z|x) toward a standard Gaussian prior. The reparameterisation trick makes it differentiable: instead of sampling z ~ N(μ, σ²), sample ε ~ N(0, I) and compute z = μ + σ ⊙ ε.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'VAE reparameterisation and ELBO loss',
          code: `import torch
import torch.nn.functional as F

class VAE(torch.nn.Module):
    def __init__(self, dim_x=784, dim_z=32):
        super().__init__()
        self.enc = torch.nn.Sequential(
            torch.nn.Linear(dim_x, 256), torch.nn.ReLU(),
            torch.nn.Linear(256, 2 * dim_z),              # outputs mu and logvar
        )
        self.dec = torch.nn.Sequential(
            torch.nn.Linear(dim_z, 256), torch.nn.ReLU(),
            torch.nn.Linear(256, dim_x),                  # Bernoulli logits
        )

    def forward(self, x):
        mu_logvar = self.enc(x)
        mu, logvar = mu_logvar.chunk(2, dim=-1)
        # Reparameterisation trick: z = mu + sigma * eps, eps ~ N(0, I)
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        z = mu + std * eps
        x_recon = self.dec(z)
        return x_recon, mu, logvar

def vae_loss(x, x_recon, mu, logvar, beta=1.0):
    recon = F.binary_cross_entropy_with_logits(x_recon, x, reduction='sum')
    kl = -0.5 * (1 + logvar - mu.pow(2) - logvar.exp()).sum()
    return recon + beta * kl`
        },
        {
          type: 'table',
          headers: ['Property', 'GAN', 'VAE'],
          rows: [
            ['Training signal', 'Adversarial game', 'Reconstruction + KL'],
            ['Sample sharpness', 'Very sharp', 'Slightly blurry'],
            ['Sample diversity', 'Mode collapse risk', 'Good diversity'],
            ['Training stability', 'Unstable, needs tuning', 'Stable'],
            ['Latent space', 'Less interpretable', 'Smooth, interpretable'],
            ['Likelihood', 'Not directly available', 'ELBO available'],
            ['Typical use today', 'Stylisation, super-resolution, real-time', 'Latent space for diffusion, representation learning']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'StyleGAN (NVIDIA): a GAN trained on faces produces photorealistic portraits of people who do not exist (thispersondoesnotexist.com). The latent space is disentangled enough that you can independently control features like age, smile, and hair length by moving along learned directions in latent space.' },
        { type: 'p', text: 'Stable Diffusion\'s VAE: a small VAE compresses 512×512 images to 64×64 latents. It is a VAE in the modern sense — trained with reconstruction + KL, then frozen and used purely as the codec for diffusion. Without it, latent diffusion would be 64× more expensive.' }
      ],
      advantages: [
        'GANs generate sharp, photorealistic samples in a single forward pass (fast).',
        'GANs have well-understood disentangled latent spaces (StyleGAN).',
        'VAEs train stably and give a smooth, interpolatable latent space.',
        'VAEs provide a tractable likelihood lower bound (ELBO).'
      ],
      disadvantages: [
        'GANs are notoriously hard to train: mode collapse, oscillation, sensitivity to architecture.',
        'GANs do not provide likelihood — hard to compare to other generative models.',
        'VAEs tend to produce blurry samples due to the Gaussian reconstruction assumption.',
        'VAE posterior collapse can cause the latent to be ignored (especially with strong autoregressive decoders).'
      ],
      commonMistakes: [
        'Treating GANs as a default image generator in 2024 — diffusion is usually better.',
        'Using a vanilla VAE for production image generation — quality is far below diffusion.',
        'Forgetting the reparameterisation trick — sampling z directly from N(μ, σ²) breaks backprop.',
        'Setting β (KL weight) too high in a VAE — the latent collapses to the prior and reconstruction fails.'
      ],
      limitations: [
        'GAN mode collapse: the generator finds one or few outputs that fool D and produces little else.',
        'VAE blurry outputs: Gaussian likelihood over-spreads the reconstruction.',
        'Neither scales as gracefully as diffusion to high-resolution, diverse datasets.',
        'Both remain research-active but neither is the SOTA for image quality any more.'
      ],
      relatedConcepts: ['Mode Collapse', 'ELBO', 'Reparameterisation Trick', 'StyleGAN', 'β-VAE'],
      faq: [
        { q: 'Should I learn GANs/VAEs if diffusion has replaced them?', a: 'Yes. VAEs are still the decoder in latent diffusion, and GANs remain useful for real-time and stylised generation. Understanding both clarifies why diffusion is a win and where the alternatives still hold advantages.' },
        { q: 'What is posterior collapse in VAEs?', a: 'When the decoder is powerful enough to ignore z (e.g. an autoregressive decoder), the encoder learns q(z|x) ≈ p(z) and the latent carries no information. Solutions include weakening the decoder, β-annealing (start β small, increase), or forcing information bottleneck.' }
      ],
      summary:
        'GANs train a generator and discriminator in an adversarial game to produce sharp samples; VAEs train a probabilistic autoencoder to maximise a likelihood lower bound, producing smooth latent spaces. Diffusion has largely superseded both for image quality, but VAEs remain the codec behind latent diffusion and GANs remain useful for real-time and stylised generation. Understanding both is essential context for modern generative AI.'
    },
    {
      id: 'autoregressive-generation',
      title: 'Autoregressive Generation',
      subtitle: 'The single mechanism behind every GPT-class model — and its costs.',
      tags: ['autoregressive', 'llm', 'generation'],
      readingMinutes: 7,
      definition:
        'Autoregressive generation produces a sequence one element at a time, each element conditioned on all previously generated elements. Formally, p(x) = Π p(xₜ | x₁, …, x_{t-1}), and generation samples each factor in turn.',
      whyItExists:
        'Sequences (text, audio, code) have variable length and strong temporal dependency. There is no fixed-size output to predict. Factoring the joint distribution into a product of conditionals — and sampling each — is the most general and tractable way to model sequences. It is also the natural fit for transformers with causal attention: each position only attends to earlier positions, exactly matching the autoregressive factorisation.',
      howItWorks: [
        { type: 'h3', text: 'The factorisation' },
        {
          type: 'p',
          text: 'By the chain rule of probability, p(x₁, …, xₙ) = Πₜ p(xₜ | x_<t). An autoregressive model learns each conditional via a neural network with causal masking. Training maximises log p(x) = Σ log p(xₜ | x_<t) — i.e. minimises next-token cross-entropy. This is fully self-supervised: the label for predicting xₜ is xₜ itself, drawn from the data.'
        },
        {
          type: 'interactive',
          componentId: 'token-predictor',
          caption: 'Experiment with the next-token predictor to see the conditional distributions in action.'
        },
        { type: 'h3', text: 'Sampling strategies' },
        {
          type: 'ul',
          items: [
            'Greedy — argmax of the distribution. Deterministic, repetitive.',
            'Beam search — keep top-k partial sequences, expand each. Higher quality for translation; can be generic for open-ended generation.',
            'Temperature sampling — divide logits by T before softmax. T→0 = greedy; T>1 = more random.',
            'Top-k — sample only from the k most likely tokens. Reduces tail noise.',
            'Top-p (nucleus) — sample from the smallest set of tokens whose cumulative probability ≥ p. Adaptive to peaked vs flat distributions.'
          ]
        },
        { type: 'h3', text: 'The cost of sequential sampling' },
        {
          type: 'p',
          text: 'Generating N tokens requires N forward passes, each over a longer sequence. Without the KV cache, total attention compute is O(N³); with the KV cache, it is O(N²). This is why LLM inference is dominated by the generation phase, not the prompt-processing phase. Speculative decoding (use a small draft model to propose multiple tokens, verify with the big model in parallel) recovers some parallelism without changing the autoregressive dependency.'
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Exposure bias',
          text: 'At training time, the model always sees real previous tokens. At inference, it sees its own generated tokens — which may include mistakes. Errors compound: one bad token can derail the rest. This is "exposure bias". Mitigations include scheduled sampling and RLHF, but the bias is fundamental to autoregressive generation.'
        }
      ],
      examples: [
        { type: 'p', text: 'Generating "The cat sat on the": the model predicts "mat" with probability 0.45, "floor" 0.20, "couch" 0.10, and so on. Greedy picks "mat"; temperature-0.8 sampling might pick "floor" or "couch". Each choice conditions the next prediction, so the path branches.' },
        { type: 'p', text: 'Code generation: "def fibonacci(n):\\n    if n < 2: return n\\n    return". The model predicts "fibonacci(n-1) + fibonacci(n-2)" with high probability. A single wrong token (e.g. "fibonacci(n-1) - fibonacci(n-2)") propagates: subsequent tokens are conditioned on the wrong signature, and the function stays wrong.' }
      ],
      advantages: [
        'Most general sequence model — handles arbitrary distributions over arbitrary-length sequences.',
        'Self-supervised training scales to unlimited unlabelled text.',
        'Conditioning is automatic — prepend any context, generation adapts.',
        'Causal masking makes training parallelisable (all positions computed at once), even though sampling is sequential.'
      ],
      disadvantages: [
        'Sequential sampling is inherently slow — N forward passes for N tokens.',
        'Exposure bias: errors compound because each token conditions on prior (possibly wrong) tokens.',
        'No guarantee of global coherence — locally sensible tokens can compose into incoherent passages.',
        'KV cache memory grows with context length, limiting long-context generation.'
      ],
      commonMistakes: [
        'Confusing training parallelism with sampling parallelism — training is parallel, sampling is sequential.',
        'Comparing two prompts at different sampling settings and attributing differences to the prompt.',
        'Forgetting that beam search hurts open-ended generation (produces generic text) — use sampling for creative tasks.',
        'Expecting deterministic output without setting temperature=0 AND a fixed seed.'
      ],
      limitations: [
        'Latency grows linearly with output length; first-token latency grows with context length.',
        'Cannot easily "go back" and revise earlier tokens (no editing without a separate pass).',
        'Long-horizon coherence is weak — models drift from a plan over many tokens.',
        'Non-autoregressive alternatives (NAR generation) remain lower quality.'
      ],
      relatedConcepts: ['KV Cache', 'Speculative Decoding', 'Beam Search', 'Exposure Bias', 'Causal Masking'],
      faq: [
        { q: 'Why not generate tokens in parallel?', a: 'Each token depends on the previous ones. Non-autoregressive models exist (predict all tokens at once) but produce much lower quality because they lose the sequential dependency. Speculative decoding recovers some parallelism by verifying multiple draft tokens in one forward pass.' },
        { q: 'Is autoregressive generation the same as recursion?', a: 'No. It is iterative: the model is called repeatedly with an ever-growing context. There is no recursive call stack. The "autoregressive" name refers to the statistical factorisation, not to a recursive implementation.' }
      ],
      summary:
        'Autoregressive generation factors a sequence distribution into a product of next-step conditionals and samples each in turn. It is the mechanism behind every GPT-class model. Training is parallel and self-supervised; sampling is sequential and slow. The KV cache, speculative decoding, and smart sampling strategies (top-p, temperature) are the main engineering levers for making it fast and high-quality.'
    },
    {
      id: 'prompt-engineering',
      title: 'Prompt Engineering',
      subtitle: 'Treating the prompt as the programming interface — structure, role, examples, and constraints.',
      tags: ['prompt-engineering', 'llm', 'best-practices'],
      readingMinutes: 7,
      definition:
        'Prompt engineering is the practice of designing the input text given to a generative model so that it reliably produces the desired output — including role, task, format, examples, constraints, and reasoning scaffolding.',
      whyItExists:
        'LLMs are not programmed in code; they are programmed in natural language. The same model can produce wildly different outputs from slightly different prompts. Prompt engineering exists because there is no compiler to catch your mistakes — small wording choices cause large behavioural shifts. Until model-steering techniques (fine-tuning, RLHF) fully mature, the prompt remains the primary control surface, and writing it well is a real engineering skill.',
      howItWorks: [
        { type: 'h3', text: 'The anatomy of a strong prompt' },
        {
          type: 'ol',
          items: [
            'Role — "You are a senior backend engineer." Sets the persona and implicit knowledge.',
            'Task — "Review the following pull request for security issues." Specifies the action.',
            'Context — "This is a Python FastAPI service handling payment webhooks." Provides relevant background.',
            'Format — "Respond as a JSON array of {severity, file, line, issue, fix} objects." Constrains output.',
            'Constraints — "Only flag real vulnerabilities, not style. Cite the OWASP category." Prevents common failure modes.',
            'Examples (optional) — 1–3 demonstrations of input → correct output. Dramatically improves adherence.',
            'Input — The actual data to process.'
          ]
        },
        { type: 'h3', text: 'Patterns that work' },
        {
          type: 'ul',
          items: [
            'Chain-of-thought — "Think step by step" before the answer. Improves reasoning on math and logic.',
            'Self-critique — "Now review your answer for errors and revise." Catches simple mistakes.',
            'Decomposition — "First extract entities, then classify each, then summarise." Splits hard tasks into easy ones.',
            'Output priming — Start the response for the model: "Here is the JSON: [". Forces format.',
            'Delimiter isolation — Use ### or <tag> to separate instructions from data, preventing injection.'
          ]
        },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'A structured prompt template in TypeScript',
          code: `const reviewPrompt = (diff: string) => \`You are a senior backend engineer reviewing a pull request.

Task: Identify security issues in the diff below.
Context: Python 3.11 FastAPI service handling Stripe payment webhooks.

Rules:
- Flag only real vulnerabilities (OWASP Top 10), not style.
- For each issue, give severity (low|med|high), file, line, explanation, and a concrete fix.
- If no issues, respond exactly: { "issues": [] }

Respond as JSON matching this TypeScript type:
type Response = { issues: Array<{
  severity: "low" | "med" | "high";
  file: string; line: number;
  issue: string; fix: string;
}> };

### DIFF
\${diff}
### END DIFF

Respond with JSON only. No prose.\`;`
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Prompting is iterative',
          text: 'Treat prompts like code: version them, write test cases (input → expected output), and run regressions when you change the prompt. A "prompt file" under version control with a small eval set is the foundation of serious LLM application engineering.'
        }
      ],
      examples: [
        { type: 'p', text: 'Weak prompt: "Summarise this article." → produces a vague 3-sentence summary. Strong prompt: "You are a financial analyst. Summarise the following earnings call in 5 bullet points, each ≤ 20 words, focusing on guidance changes, margin movement, and analyst Q&A highlights. No introduction, no conclusion." → produces a tight, structured, useful summary.' },
        { type: 'p', text: 'Few-shot classification: include 3 examples of (text → category) before the real input. Accuracy on sentiment, intent, or topic classification typically jumps 10–30 percentage points versus a zero-shot instruction.' }
      ],
      advantages: [
        'No training required — works with any capable LLM immediately.',
        'Cheap to iterate — a prompt change is a string change.',
        'Composable with tools, RAG, and agents.',
        'Reveals the model\'s capabilities and limits quickly.'
      ],
      disadvantages: [
        'Brittle — small wording changes can flip behaviour.',
        'Model-specific — prompts tuned for GPT-4 may not work for Claude or Llama.',
        'Hard to guarantee output format (use JSON mode or function calling instead when possible).',
        'Easy to over-tune to specific examples, masking general fragility.'
      ],
      commonMistakes: [
        'Writing one long instruction paragraph instead of structured (role / task / format / examples) sections.',
        'Asking for "a summary" without length, format, and audience constraints.',
        'Mixing instructions and data without delimiters — model confuses data for instructions.',
        'Not testing the prompt on edge cases (empty input, very long input, adversarial input).',
        'Treating the model as if it remembers the prompt across sessions — it does not, unless you manage state.'
      ],
      limitations: [
        'Cannot reliably enforce hard constraints (no SQL injection, no PII leakage) — pair with validators.',
        'Capability ceiling: prompt engineering cannot make a model do something it was not trained to do.',
        'Sensitive to upstream model updates — a prompt that worked on gpt-4-0314 may fail on gpt-4-0613.',
        'No formal semantics — you cannot statically verify a prompt the way you can verify code.'
      ],
      relatedConcepts: ['Few-Shot Prompting', 'Chain-of-Thought', 'Function Calling', 'Structured Output', 'Prompt Injection'],
      faq: [
        { q: 'Will prompt engineering still matter as models get better?', a: 'Yes, but the kind of prompting changes. As models follow instructions more reliably, the focus shifts from "trick the model into working" to "specify the task precisely". Specifying precisely is still engineering.' },
        { q: 'Should I use function calling instead of prompt engineering for structure?', a: 'Yes, where available. Function calling / JSON mode gives you a typed schema and post-validation, which is more reliable than asking the model to "respond as JSON" in prose. Use prompting for content, function calling for format.' }
      ],
      summary:
        'Prompt engineering is the discipline of writing model inputs that reliably elicit the desired output. Strong prompts are structured (role, task, context, format, constraints, examples) and treated like code — versioned, tested, iterated. It is the primary control surface for LLM applications today, complemented but not replaced by fine-tuning and function calling.'
    },
    {
      id: 'zero-few-shot',
      title: 'Zero-Shot and Few-Shot Prompting',
      subtitle: 'How many examples does the model need? The most important prompting axis.',
      tags: ['prompt-engineering', 'few-shot', 'in-context-learning'],
      readingMinutes: 6,
      definition:
        'Zero-shot prompting gives the model a task instruction with no demonstrations. Few-shot prompting gives the model a small number (typically 1–10) of input-output examples before the actual input, letting it infer the pattern. This in-context learning requires no weight updates.',
      whyItExists:
        'Fine-tuning a model for every new task is expensive and slow. In-context learning lets a single pretrained model adapt to a new task at inference time, just from examples in the prompt. This is what makes LLMs "general-purpose" — one model, many tasks, no retraining. The trade-off is how many examples you need: zero is cheapest but weakest; many is strongest but burns context and tokens.',
      howItWorks: [
        { type: 'h3', text: 'Zero-shot' },
        {
          type: 'p',
          text: 'Just an instruction: "Classify the sentiment of this review as positive, negative, or neutral: {review}". Works well for tasks the model already understands from pretraining (sentiment, summarisation, translation). Fails on tasks requiring a specific format, edge-case handling, or domain conventions the model has not internalised.'
        },
        { type: 'h3', text: 'Few-shot' },
        {
          type: 'p',
          text: 'Prepend demonstrations: a few (input → output) pairs in the same format you want, then the new input. The model infers the mapping and applies it. Few-shot reliably improves accuracy on classification, extraction, formatting, and stylisation tasks, especially when the desired output is non-obvious or domain-specific.'
        },
        {
          type: 'code',
          lang: 'typescript',
          caption: 'A few-shot prompt template for intent classification',
          code: `const fewShotPrompt = (utterance: string) => \`Classify the user's intent into one of: book_flight, check_weather, cancel_order, other.

# Examples
User: "I need a flight from JFK to LHR next Friday"
Intent: book_flight

User: "Will it rain in Seattle tomorrow?"
Intent: check_weather

User: "Please cancel order #12345"
Intent: cancel_order

User: "Hey what's the capital of Peru"
Intent: other

# Now classify
User: "\${utterance}"
Intent:\`;`
        },
        {
          type: 'table',
          headers: ['Shot count', 'When to use', 'Trade-off'],
          rows: [
            ['0 (zero-shot)', 'Common tasks the model knows; cost-sensitive', 'Weakest; format may drift'],
            ['1 (one-shot)', 'Need to pin a format with one example', 'Light context cost'],
            ['2–5 (few-shot)', 'Default for most production tasks', 'Best cost/quality balance'],
            ['10+ (many-shot)', 'Hard tasks, edge cases, niche domains', 'Burns context window; diminishing returns']
          ]
        },
        {
          type: 'callout',
          variant: 'tip',
          title: 'Why does few-shot work without training?',
          text: 'Large pretrained transformers learned to "infer the pattern" from the prompt itself during pretraining — a behaviour that emerges around 10^10 parameters. The mechanism is debated, but empirically the model uses the examples to localise the task within its learned distribution. No weights change; the examples just steer inference.'
        }
      ],
      examples: [
        { type: 'p', text: 'Zero-shot sentiment: "Classify sentiment: \'The battery dies by noon.\' → Negative." Works. Zero-shot aspect extraction: "Extract (aspect, opinion) pairs from: \'The battery dies by noon.\' → " Likely fails or drifts. Few-shot with 3 examples of (review → list of aspect-opinion pairs) reliably fixes the format.' },
        { type: 'p', text: 'Code-formatting few-shot: provide 2 examples of "ugly function → reformatted function with type hints". The model then reformats the third function in the same style. Without the examples, the model uses its default style, which may not match your codebase conventions.' }
      ],
      advantages: [
        'No training — works on any capable LLM immediately.',
        'One model serves many tasks — operational simplicity.',
        'Easy to update — change the examples, not the model.',
        'Examples double as documentation and test cases.'
      ],
      disadvantages: [
        'Examples consume context window — long tasks compete with examples for tokens.',
        'Sensitive to example order and wording — non-trivial to debug.',
        'Less reliable than fine-tuning for high-volume, narrow tasks.',
        'Example selection biases the model — unrepresentative examples degrade accuracy.'
      ],
      commonMistakes: [
        'Using too many examples (>10) — diminishing returns and context pressure.',
        'Inconsistent formatting between examples and the real input — model gets confused.',
        'Including examples with errors — model copies the errors.',
        'Mixing labels in examples (e.g. some "positive", some "POS") — model inherits the inconsistency.',
        'Forgetting that example ORDER matters — models exhibit recency bias; put the most relevant example last.'
      ],
      limitations: [
        'Caps out: beyond a handful of examples, fine-tuning is more effective.',
        'Examples leak into the output if not delimited — use clear separators.',
        'Long few-shot prompts slow down every request and raise cost.',
        'Does not teach the model new knowledge — only new patterns over what it already knows.'
      ],
      relatedConcepts: ['In-Context Learning', 'Prompt Engineering', 'Chain-of-Thought', 'Fine-Tuning', 'Instruction Tuning'],
      faq: [
        { q: 'How do I pick which examples to include?', a: 'Pick examples that (1) span the variety of input types, (2) demonstrate edge cases (empty input, ambiguous labels), (3) match the format you want exactly, and (4) are short to minimise token cost. For production, use a retrieval step to pick relevant examples per query — this is "dynamic few-shot".' },
        { q: 'When should I switch from few-shot to fine-tuning?', a: 'When you have >100 examples, the task is high-volume (>10k calls/day), latency matters, or the model cannot follow the pattern even with examples. Fine-tuning a small model on your data is usually cheaper at scale and more reliable than giant few-shot prompts.' }
      ],
      summary:
        'Zero-shot is an instruction alone; few-shot prepends a small number of demonstrations. Few-shot reliably improves accuracy and format adherence with no training cost, making it the default for most production tasks. Example selection, ordering, and format consistency matter more than example count. Switch to fine-tuning when the task is high-volume and you have enough data.'
    },
    {
      id: 'temperature-sampling',
      title: 'Temperature and Sampling',
      subtitle: 'The knobs that control determinism, creativity, and reliability of generative output.',
      tags: ['sampling', 'temperature', 'top-p', 'decoding'],
      readingMinutes: 7,
      definition:
        'Temperature and sampling parameters control how the next-token probability distribution is transformed and sampled during autoregressive generation. Temperature scales the logits before softmax; top-k and top-p restrict the sampling pool. Together they determine how deterministic or creative the output is.',
      whyItExists:
        'A raw next-token distribution is often too flat (many tokens with non-trivial probability) or too sharp (one dominant token). Greedy decoding is deterministic but repetitive. Pure sampling is diverse but incoherent. Temperature, top-k, and top-p exist to give you control over the creativity-vs-reliability trade-off, per task: deterministic for code and facts, creative for stories and brainstorming.',
      howItWorks: [
        { type: 'h3', text: 'Temperature' },
        {
          type: 'p',
          text: 'The model outputs logits z over the vocabulary. Temperature T rescales them: p = softmax(z / T). At T = 1, the raw distribution is used. As T → 0, the distribution becomes a one-hot over the argmax (greedy). As T → ∞, the distribution becomes uniform (random). Typical ranges: 0–0.3 for factual/code; 0.5–0.8 for general use; 0.9–1.2 for creative writing.'
        },
        {
          type: 'interactive',
          componentId: 'temperature-sampling',
          caption: 'Drag the temperature slider and watch how the next-token distribution sharpens or flattens.'
        },
        { type: 'h3', text: 'Top-k' },
        {
          type: 'p',
          text: 'Keep only the k highest-probability tokens, renormalise, sample from those. Cuts off the long tail of implausible tokens. k = 1 is greedy; k = 40 is a common default. Drawback: a fixed k is wrong for both peaked distributions (where you want k = 1) and flat distributions (where you want large k).'
        },
        { type: 'h3', text: 'Top-p (nucleus sampling)' },
        {
          type: 'p',
          text: 'Adaptive alternative to top-k: keep the smallest set of tokens whose cumulative probability ≥ p (e.g. 0.9). On a peaked distribution, this might be 1 token; on a flat distribution, dozens. Top-p adapts to the shape of the distribution and is the default in most production LLM APIs.'
        },
        {
          type: 'code',
          lang: 'python',
          caption: 'Temperature + top-p sampling from logits',
          code: `import torch
import torch.nn.functional as F

def sample_token(logits: torch.Tensor, temperature: float = 0.7,
                 top_p: float = 0.9) -> int:
    # logits: [vocab] for the next position
    if temperature <= 0:
        return int(logits.argmax())                  # greedy / deterministic

    logits = logits / temperature
    probs = F.softmax(logits, dim=-1)

    # Top-p (nucleus) filtering
    sorted_probs, sorted_idx = torch.sort(probs, descending=True)
    cum = torch.cumsum(sorted_probs, dim=-1)
    # Keep tokens up to and including the first that crosses top_p
    keep = cum <= top_p
    keep[0] = True                                    # always keep the top token
    filtered = sorted_probs * keep
    filtered = filtered / filtered.sum()

    # Sample from the filtered, renormalised distribution
    sample = torch.multinomial(filtered, num_samples=1)
    return int(sorted_idx[sample])`
        },
        {
          type: 'table',
          headers: ['Setting', 'Effect', 'Use case'],
          rows: [
            ['T=0', 'Greedy, deterministic', 'Code, math, factual Q&A, evals'],
            ['T=0.3, top_p=0.9', 'Mostly deterministic, slight variation', 'Production chat, summarisation'],
            ['T=0.7, top_p=0.95', 'Balanced', 'General assistant use'],
            ['T=1.0, top_p=1.0', 'Pure sampling', 'Creative writing, brainstorming'],
            ['T=1.2+, top_p=1.0', 'Often incoherent', 'Avoid unless you know why']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'Prompt: "The square root of 144 is". At T=0, output is always "12". At T=0.7, output is "12" ~95% of the time but occasionally "12." or "12,". At T=1.5, output may be "approximately 12", "12 (since 12²", or random other tokens — useless for math.' },
        { type: 'p', text: 'Prompt: "Write a haiku about autumn". At T=0, you get the same haiku every time (often bland). At T=0.9 with top_p=0.95, you get varied, often surprising, occasionally beautiful haikus. For creative tasks, sampling beats greedy.' }
      ],
      advantages: [
        'A single knob (temperature) trades determinism for creativity — simple to operate.',
        'Top-p adapts to distribution shape, unlike fixed top-k.',
        'Same model serves many regimes — no retraining to switch from factual to creative.',
        'Combined with a seed, gives reproducible-but-varied outputs.'
      ],
      disadvantages: [
        'Wrong temperature for the task is the #1 cause of "LLM is unreliable" complaints.',
        'Top-k and top-p interact non-obviously — tuning both is fiddly.',
        'Low temperature amplifies biases (always picks the most likely token, which encodes the dominant cultural pattern).',
        'High temperature can produce coherent-sounding nonsense — harder to detect than greedy repetition.'
      ],
      commonMistakes: [
        'Using T=0 for creative writing — output is generic and repetitive.',
        'Using T=1.0 for code generation — output is non-deterministic and often syntactically wrong.',
        'Comparing two prompts at different temperatures and concluding the prompt is the difference.',
        'Setting both top_k=1 and top_p=0.1 — they conflict; pick one strategy.',
        'Forgetting that T=0 + no seed is not fully deterministic on most APIs; set a seed for evals.'
      ],
      limitations: [
        'Temperature cannot fix a model that lacks the knowledge — sampling cannot conjure facts.',
        'No setting eliminates hallucination — it only changes its flavour.',
        'API providers may apply their own defaults or quantisation, breaking reproducibility.',
        'Optimal settings drift across model versions — re-tune when you upgrade.'
      ],
      relatedConcepts: ['Softmax', 'Greedy Decoding', 'Beam Search', 'Nucleus Sampling', 'Reproducibility'],
      faq: [
        { q: 'What temperature should I use by default?', a: 'For production Q&A and code: T=0 with a seed. For general assistant chat: T=0.7, top_p=0.95. For creative writing: T=0.9, top_p=0.95. Always document your choice — it is part of the system.' },
        { q: 'Is temperature=0 the same as greedy decoding?', a: 'Conceptually yes — both pick the argmax. In practice, T=0 in most frameworks is implemented as argmax (no softmax). Some frameworks still softmax with a tiny epsilon; set a seed if exact reproducibility matters.' }
      ],
      summary:
        'Temperature scales logits before softmax; top-k and top-p restrict the sampling pool. Together they control the creativity-vs-reliability trade-off. Default for factual tasks: T=0 with a seed. Default for general chat: T=0.7, top_p=0.95. Default for creative writing: T=0.9, top_p=0.95. The wrong setting is the most common cause of "the model is unreliable" complaints — choose deliberately, per task.'
    },
    {
      id: 'hallucinations',
      title: 'Hallucinations',
      subtitle: 'Why LLMs confidently make things up — and what actually reduces it.',
      tags: ['hallucinations', 'reliability', 'safety'],
      readingMinutes: 7,
      definition:
        'A hallucination is a model output that is fluent and confident but factually wrong, fabricated, or ungrounded in the provided context. The model has no internal signal that the output is wrong — it generates the most plausible-sounding next token, whether or not that token corresponds to reality.',
      whyItExists:
        'LLMs are trained to produce text that resembles their training distribution, not to produce true statements. There is no "truth module" — the model maximises likelihood, not correctness. When the prompt asks for a fact the model did not memorise, the highest-likelihood continuation is often a plausible-sounding fabrication. This is not a bug to be patched; it is a structural property of next-token prediction on text data.',
      howItWorks: [
        { type: 'h3', text: 'Where hallucinations come from' },
        {
          type: 'ul',
          items: [
            'Training-data gaps — the model never saw the answer; it fabricates a plausible one.',
            'Memorisation noise — the model half-remembers a fact and confabulates the rest.',
            'Prompt ambiguity — an under-specified prompt lets the model infer an answer it should refuse.',
            'Context blindness — the model ignores the provided context and falls back on parametric memory.',
            'Overconfidence — RLHF and instruction tuning teach the model to always answer, rarely to say "I don\'t know".'
          ]
        },
        { type: 'h3', text: 'What reduces (not eliminates) hallucination' },
        {
          type: 'ol',
          items: [
            'Retrieval-Augmented Generation (RAG) — fetch relevant documents and put them in the prompt; instruct the model to answer only from them.',
            'Citations — require the model to cite a source for each claim; verify the citations exist.',
            'Lower temperature — T=0 reduces sampling variance (does not fix parametric hallucination).',
            'Self-consistency — sample N answers, take the majority; agreement correlates with correctness.',
            'Self-verification — ask the model to verify each claim against retrieved evidence in a second pass.',
            'Confidence calibration — train the model to say "I don\'t know" when uncertain.',
            'Tool use — for facts (prices, dates, calculations), call deterministic APIs instead of relying on the LLM.'
          ]
        },
        {
          type: 'callout',
          variant: 'danger',
          title: 'Hallucinations are not a bug you can patch',
          text: 'LLMs do not have a "true/false" bit. They produce the most likely next token. Any mitigation is a statistical guardrail, not a guarantee. For facts that must be correct (medical, legal, financial), the LLM should never be the final source — pair it with retrieval and human review.'
        },
        {
          type: 'table',
          headers: ['Mitigation', 'Reduces', 'Does NOT reduce', 'Cost'],
          rows: [
            ['RAG', 'Context-grounded hallucination', 'Parametric (memorised-wrong) hallucination', 'Retrieval latency + system complexity'],
            ['Lower temperature', 'Sampling noise', 'Confident-wrong answers', 'Free'],
            ['Citations + verification', 'Fabricated facts and sources', 'Subtle reasoning errors', 'Extra LLM calls'],
            ['Tool use (APIs)', 'Factual errors on tool-covered queries', 'Errors on uncovered queries', 'API integration'],
            ['Fine-tuning on "I don\'t know"', 'Overconfidence', 'Wrong confidence in claims it does make', 'Training cost'],
            ['Human review', 'Anything the reviewer catches', 'Anything they miss', 'Human time']
          ]
        }
      ],
      examples: [
        { type: 'p', text: 'Asked "What did Einstein say about quantum entanglement in his 1935 letter to Born?", an LLM may produce a fluent, specific-sounding quote — that Einstein never wrote. The model has no record of the letter; it generates a plausible continuation of the prompt. The only fix is retrieval: find the actual letter and put the relevant passage in the prompt.' },
        { type: 'p', text: 'Asked to summarise a provided document, an LLM may invent details that are not in the document. Mitigation: prompt with "Use only the text below. If the answer is not in the text, say \'not found in document\'." and verify with a second pass that checks each claim against the source.' }
      ],
      advantages: [
        '(None — hallucination is a defect, not a feature.)',
        'Understanding it deeply is the prerequisite for building reliable LLM systems.'
      ],
      disadvantages: [
        'Outputs look authoritative even when wrong — users trust them too much.',
        'Hard to detect without external verification — fluent false text reads true.',
        'No automatic metric fully captures it — requires task-specific evals and human review.',
        'Reduces trust in LLM applications — single high-profile hallucination can sink a product.'
      ],
      commonMistakes: [
        'Believing "bigger models hallucinate less" — they hallucinate differently, often more convincingly.',
        'Trusting the model\'s own confidence as a signal — its confidence is uncalibrated.',
        'Using RAG but not verifying the model actually used the retrieved context — it may ignore it.',
        'Treating citations as proof — the model can fabricate citations that look perfectly real.',
        'Setting temperature=0 and assuming hallucinations are gone — only sampling noise is gone.'
      ],
      limitations: [
        'No known technique fully eliminates hallucination in open-ended generation.',
        'Even with RAG, the model may misread, misquote, or ignore the retrieved context.',
        'Evaluation is hard: hallucination is task- and domain-specific.',
        'Trade-off with helpfulness: a model that always says "I don\'t know" is safe but useless.'
      ],
      relatedConcepts: ['RAG', 'Calibration', 'Self-Consistency', 'Citation Verification', 'Tool Use'],
      faq: [
        { q: 'Will hallucination ever be "solved"?', a: 'Probably not in the sense of zero errors — that would require grounding in a verified world model, which current architectures do not have. But it can be reduced to acceptable rates for specific, well-bounded tasks via RAG + verification + human review. Open-ended chat will remain prone to it.' },
        { q: 'Is hallucination worse in larger models?', a: 'Larger models hallucinate less obviously (their fabrications are more internally consistent and harder to spot) but not necessarily less often. The danger shifts from "obvious nonsense" to "plausible-sounding falsehoods" — arguably more harmful, not less.' }
      ],
      summary:
        'Hallucination is fluent, confident, ungrounded output — a structural property of next-token prediction, not a bug. RAG, citations, lower temperature, self-verification, and tool use reduce it for specific tasks but never eliminate it. For facts that must be correct, pair the LLM with retrieval, verification, and human review; never let the LLM be the final source.'
    },
    {
      id: 'genai-limitations-safety',
      title: 'Limitations and Safety of Generative AI',
      subtitle: 'The honest list of what generative AI cannot do — and how to deploy it responsibly.',
      tags: ['safety', 'ethics', 'limitations', 'responsible-ai'],
      readingMinutes: 8,
      definition:
        'The limitations of generative AI are the structural things it cannot do reliably (verify facts, reason over long horizons, stay current, avoid bias). The safety concerns are the harms its deployment can cause (misinformation, deepfakes, IP infringement, bias amplification, surveillance, over-reliance).',
      whyItExists:
        'Every generative AI capability has a corresponding risk. Image generation enables art and disinformation. Voice cloning enables accessibility and fraud. LLMs enable productivity and mass-produced misleading content. Responsible deployment requires understanding both the technical limits (so you don\'t trust the model for what it cannot do) and the societal risks (so you build guardrails before, not after, harm).',
      howItWorks: [
        { type: 'h3', text: 'Technical limitations' },
        {
          type: 'ul',
          items: [
            'No grounded world model — the model pattern-matches; it does not know what is true.',
            'Knowledge cutoff — training data has a date; the model does not know today\'s news, prices, or facts.',
            'Weak long-horizon reasoning — coherence drifts over long outputs; multi-step plans degrade.',
            'Poor calibration — model confidence does not track correctness.',
            'Distribution shift — performance drops on inputs unlike training data (rare languages, niche domains).',
            'No true agency — the model responds to prompts; it does not pursue goals autonomously without scaffolding.',
            'Cost and latency — large models are expensive and slow; small models are weaker.'
          ]
        },
        { type: 'h3', text: 'Safety risks' },
        {
          type: 'ul',
          items: [
            'Hallucination in high-stakes domains — medical, legal, financial advice can be confidently wrong.',
            'Deepfakes and impersonation — synthetic images, audio, and video of real people.',
            'Disinformation at scale — mass-produced plausible text on any topic.',
            'Bias amplification — training data biases (gender, race, culture) propagate and amplify.',
            'Intellectual property — training on copyrighted data without consent; outputs may reproduce it.',
            'Privacy leakage — models can regurgitate training data, including personal information.',
            'Over-reliance and automation bias — users trust the AI more than they should.',
            'Security — prompt injection, jailbreaks, model extraction attacks.'
          ]
        },
        { type: 'h3', text: 'Mitigations across the stack' },
        {
          type: 'table',
          headers: ['Layer', 'Mitigation', 'Example'],
          rows: [
            ['Pretraining', 'Data filtering, deduplication, PII scrubbing', 'Removing known CSAM, deduplicating Common Crawl'],
            ['Post-training', 'RLHF, constitutional AI, refusal training', 'Training the model to refuse harmful requests'],
            ['Inference', 'Input/output classifiers, guardrails', 'Llama Guard, NeMo Guardrails, regex filters'],
            ['Application', 'RAG, citations, human-in-the-loop, rate limits', 'Showing sources, requiring review before publish'],
            ['Distribution', 'Watermarking, provenance, disclosure', 'C2PA, SynthID, visible "AI-generated" labels'],
            ['Policy', 'Terms of use, red-teaming, audits', 'Banning certain use cases, periodic safety audits']
          ]
        },
        {
          type: 'callout',
          variant: 'warning',
          title: 'Safety is a system property, not a model property',
          text: 'A model is never "safe" in isolation. Safety emerges from the model + the input filters + the output filters + the application UX + the human review + the policy. A safe system can be built on an unsafe model; an unsafe system can be built on a "safe" model. Engineer the whole stack.'
        }
      ],
      examples: [
        { type: 'p', text: 'A hospital deploys an LLM to summarise patient records. Risks: hallucinated medical details (patient safety), regurgitation of training-data PII (privacy), biased summaries for underrepresented groups (fairness), record leakage via prompt injection (security). Mitigations: RAG over the patient\'s own records only, post-processing validator that flags medical terms not in the source, red-teaming for injection, audit logging, mandatory clinician review before the summary enters the chart.' },
        { type: 'p', text: 'A platform lets users generate images of public figures. Risks: deepfakes used for disinformation or harassment. Mitigations: block real-person name prompts, require identity verification for face-swap features, watermark all outputs, log generations, and respond to takedown requests within 24 hours.' }
      ],
      advantages: [
        'Honest acknowledgement of limits protects users and your organisation.',
        'Layered mitigations dramatically reduce harm — you do not need a perfect model to ship safely.',
        'Safety practices (red-teaming, evals, logging) also catch reliability bugs.'
      ],
      disadvantages: [
        'Safety mitigations add latency, cost, and complexity.',
        'Over-filtering harms legitimate use cases (false refusals, "lobotomised" outputs).',
        'No mitigation fully eliminates risk — residual risk always remains.',
        'Safety work is unglamorous and often deprioritised until a public incident forces it.'
      ],
      commonMistakes: [
        'Equating "the model passed our eval" with "the model is safe" — evals miss long-tail risks.',
        'Relying only on post-training refusals — easily bypassed with jailbreaks; needs input/output filters too.',
        'Deploying without red-teaming — someone outside your team will find the harm first.',
        'Treating safety as a one-time launch checklist rather than ongoing monitoring.',
        'Assuming open-weight models are riskier than closed — both have risks, just different shapes.'
      ],
      limitations: [
        'No consensus on what "safe enough" means — varies by domain, jurisdiction, and culture.',
        'Watermarks and provenance standards are not yet widely adopted or enforced.',
        'Open-weight models cannot be recalled or updated centrally — mitigations must live at the application layer.',
        'Regulation (EU AI Act, US executive orders, China\'s generative-AI rules) is still catching up; expect churn.'
      ],
      relatedConcepts: ['RLHF', 'Red-Teaming', 'Constitutional AI', 'C2PA', 'Prompt Injection', 'Model Watermarking'],
      faq: [
        { q: 'Can\'t we just make models safe at training time?', a: 'Partially — RLHF and refusal training reduce obvious harms. But they cannot add facts the model lacks, eliminate bias entirely, or prevent novel jailbreaks. Training-time safety is necessary but not sufficient; you still need inference-time and application-layer guardrails.' },
        { q: 'Are open-weight models more dangerous than closed?', a: 'Open models can be fine-tuned to remove safety training and run unmonitored — a real risk. Closed models concentrate power in one company and cannot be audited externally. Both have distinct risks; the policy debate is unresolved. For your own deployment, open vs closed matters less than the guardrails you wrap around it.' }
      ],
      summary:
        'Generative AI has structural technical limitations (no grounded truth, knowledge cutoffs, weak long-horizon reasoning) and poses serious safety risks (hallucination, deepfakes, bias, IP, privacy, security). No single layer fixes everything; responsible deployment stacks mitigations across pretraining, post-training, inference, application, distribution, and policy. Safety is a system property — engineer the whole stack, audit continuously, and never trust the model alone for high-stakes outputs.'
    }
  ]
}
