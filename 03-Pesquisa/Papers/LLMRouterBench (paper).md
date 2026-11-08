---
tipo: paper
status: consolidado
tags: [devagent, paper, roteamento, benchmark]
criado: 2026-11-08
atualizado: 2026-11-08
autores: Hao Li, Yiqun Zhang, Zhaoyan Guo, Chenxu Wang, Shengji Tang, Qiaosheng Zhang, Yang Chen, Biqing Qi, Peng Ye, Lei Bai, Zhen Wang, Shuyue Hu (Shanghai AI Lab; Northwestern Polytechnical University)
ano: 2026 (12/01, v1, cs.AI)
fonte: https://arxiv.org/abs/2601.07206
codigo: https://github.com/ynulihao/LLMRouterBench
relacionados: ["[[Roteamento de LLMs]]", "[[LLMRouter (paper)]]", "[[2026-11-08 - Radar Dev & IA (Ciclo 3)]]"]
---
# LLMRouterBench

> **Grau de verificação:** conferido em 08/11 contra o [HTML do arXiv (v1)](https://arxiv.org/html/2601.07206), tabelas 6–13 e seções 3, 4, B e Limitations. Os números abaixo são do paper (**não auditados** por nós; não rodamos o código). Valores que existem só em figuras (4–9) não foram lidos. A leitura anterior, parcial e com resumo de modelo, foi substituída; o PDF veio ilegível e não foi usado.

## Em uma frase
Benchmark + framework único para avaliar roteadores de LLM: 21 datasets, 33 modelos, 10 baselines, ~392 mil instâncias (>400K no abstract).

## Setup
| Cenário | Pool | Datasets | Instâncias |
|---|---|---|---|
| Desempenho | 20 modelos leves (7B–9B) | 15 (11.480 prompts) | 229.600 |
| Desempenho × custo | 13 modelos flagship | 10 (12.446 prompts) | 161.520 (US$ 2.771,84 de API, ~US$ 500 de juiz LLM) |

- **Pool leve (Tab. 7):** DeepHermes-3-Llama-3-8B, DeepSeek-R1-0528-Qwen3-8B, DeepSeek-R1-Distill-Qwen-7B, Fin-R1, GLM-Z1-9B, Intern-S1-mini, Llama-3.1-8B-Instruct, Llama-3.1-8B-UltraMedical, Llama-3.1-Nemotron-Nano-8B, MiMo-7B-RL, MiniCPM4.1-8B, Nemotron-Nano-9B-v2, OpenThinker3-7B, Qwen2.5-Coder-7B, Qwen3-8B, Cogito-v1-8B, Gemma-2-9b-it, GLM-4-9b-chat, Granite-3.3-8b, InternLM3-8b.
- **Pool flagship (Tab. 8, US$/1M tokens entrada/saída):** Claude-sonnet-4 3,00/15,00 · Gemini-2.5-flash 0,30/2,50 · Gemini-2.5-pro 1,25/10,00 · GPT-5-chat 1,25/10,00 · GPT-5 (medium) 1,25/10,00 · Qwen3-235B-2507 0,09/0,60 · Qwen3-235B-thinking 0,30/2,90 · DeepSeek-V3-0324 0,25/0,88 · DeepSeek-V3.1-terminus 0,27/1,00 · DeepSeek-R1-0528 0,50/2,15 · GLM-4.6 0,60/2,20 · Kimi-K2-0905 0,50/2,00 · Intern-S1 0,18/0,54. Coletados via OpenRouter, exceto GLM-4.6 e Intern-S1 (APIs oficiais). O paper diz "8 provedores", mas a tabela não traz coluna de provedor.
- **Datasets leves:** AIME, MATH500, MathBench; MBPP, HumanEval, LiveCodeBench; KORBench, Knights and Knaves, BBH; MMLU-Pro, GPQA, FinQA, MedQA; EmoryNLP, MELD.
- **Datasets flagship:** AIME, LiveMathBench; LiveCodeBench, **SWE-Bench (500)**; GPQA, HLE, MMLU-Pro, SimpleQA; ArenaHard; **τ²-Bench (278)**. Os 21 únicos = 15 + 10 − 4 compartilhados.
- Roteadores: RouterDC, EmbedLLM, MODEL-SAT, GraphRouter, Avengers (desempenho); HybridLLM, FrugalGPT, RouteLLM, GraphRouter, Avengers-Pro (21 configurações de α), **OpenRouter** (comercial) no cenário de custo. Binários (RouteLLM, HybridLLM, FrugalGPT) escolhem só entre Qwen3-235B (fraco) e GPT-5 (forte).
- Split **70/30**, 5 seeds (42, 999, 2024, 2025, 3407); embedding gte-Qwen2-7B-instruct; temperatura 0,2.
- Referências: Random, Best Single, Oracle, Dataset Oracle. "Best Single" não é linha de tabela: é o melhor modelo individual (Qwen3-8B no pool leve; GPT-5 no flagship).

## Resultados (AvgAcc)
**Pool leve (Tab. 11):** Oracle 91,64 · Dataset Oracle 73,10 · Avengers 71,94 · MODEL-SAT 71,88 · EmbedLLM 71,24 · GraphRouter 70,29 · **Best Single (Qwen3-8B) 68,01** · RouterDC 61,33 · Random 48,79. Os 4 melhores ficam a ~1,7 ponto entre si; o ganho sobre o Best Single é de ~3,9 pontos. Próximos modelos individuais: NVIDIA-Nemo 65,26, DS-Qwen3 64,39.

**Pool flagship (Tab. 12/13, custo = US$ no split de teste):**
| Roteador / modelo | AvgAcc | Custo |
|---|---|---|
| Oracle | 85,66 | 23,04 |
| Avengers-Pro α=0,95 / 1,00 | 68,58 | 123,62 / 132,98 |
| GraphRouter (PF) | 67,79 | 150,32 |
| RouteLLM | 67,67 | 111,26 |
| **Best Single = GPT-5** | **65,96** | **125,60** |
| Avengers-Pro α=0,65 | 66,21 | 87,34 |
| Avengers-Pro α=0,60 | 65,27 | 78,17 |
| Gemini-2.5-pro | 60,80 | 229,89 |
| FrugalGPT | 59,71 | 59,15 |
| HybridLLM | 57,56 | 18,65 |
| Random | 53,45 | 52,17 |
| **OpenRouter** | **49,67** | 82,31 |
| Qwen3-235B (barato) | 55,74 | 6,93 |
| DeepSeek-V3.1-terminus | 53,11 | 9,05 |
| Kimi-K2 | 54,59 | 14,37 |

- **+4%:** Avengers-Pro 68,58 / 65,96 = +3,97%. **OpenRouter −24,7%** vs Best Single, abaixo até do Random.
- **31,7% de economia (§4.2.2):** "até 31,7% de redução de custo igualando o Best Single", definida como `CostSave = 1 − Cost(θ†)/Cost(B)`, com θ† a configuração **mais barata** com AvgAcc ≥ Best Single, no cenário flagship (B = GPT-5). O roteador não é nomeado no texto; pela tabela, o ponto mais próximo é Avengers-Pro α=0,65 (66,21 a US$ 87,34 → 30,5%). Atribuir o 31,7% a α≈0,62 é inferência do verificador. Só vale para este pool.
- **Dataset Oracle** (73,10 / 69,16) fica perto dos melhores roteadores → o ganho vem de separar domínios grosseiros (matemática, código…), não de decisões finas.
- **Falha de recall (Fig. 5):** nas queries em que no máximo 3 modelos acertam (410 queries, 11,9% do teste), Avengers acerta 24,6% e EmbedLLM 23,2%.
- Latência: sem tabela por roteador. Só um exemplo no texto (τ²-Bench): Qwen3-Thinking 262,1 s vs GLM-4.6 32,4 s, estimado com dados do OpenRouter de 05/01/2026.

## Curadoria e embeddings
- Nenhum modelo domina todos os domínios.
- Retornos decrescentes ao aumentar o pool; o top-k por acurácia média supera um subconjunto aleatório (§4.2.1; valores só na Fig. 6). Os autores sugerem escolher por complementaridade.
- **Embedding pesa pouco (Tab. 10, AvgAcc):** GraphRouter 68,05–70,29, EmbedLLM 70,55–71,24, Avengers 70,43–71,94 entre nli-bert-base, MiniLM-L6 e gte-Qwen2-7B (variação de 0,7 a 2,2 pontos conforme o roteador). O gargalo é o mecanismo de roteamento.

## O que importa para o Dev Agent
- Régua para avaliar LLMRouter / RouteLLM / CARROT / vLLM Semantic Router antes de escolher um (Fase 3 do [[Roadmap]]).
- **Baseline obrigatória:** sempre comparar com o melhor modelo único e medir custo. No flagship, só Avengers-Pro e RouteLLM (e GraphRouter PF, mais caro) ficam acima do GPT-5.
- **Dado útil para a camada barata:** modelos baratos de API ficam a 10–13 pontos do GPT-5 (Qwen3-235B 55,74 a US$ 6,93 contra 65,96 a US$ 125,60). Em tarefa média, o barato custa ~5% do premium; o roteador tenta recuperar o que falta.
- Cautela com roteador comercial como caixa-preta (OpenRouter −24,7%).
- Ressalva: o pool flagship usa Claude-sonnet-4 (47,27, abaixo de vários baratos nestes datasets, que não medem trabalho de código em repo). Não generalizar para o nosso uso.
- Inferência nossa (o paper **não** testa pools de 3–5): escolher 3–5 modelos complementares e começar com roteamento simples (cascata ou clustering sem treino + embedding leve, estilo Avengers).

## Limitações (seção Limitations, parafraseada)
1. Não cobre todos os métodos de roteamento, só os recentes com implementação pública.
2. Os 21 datasets excluem verticais de domínio, contexto muito longo e multimodal.
3. Latência aproximada (tokens consumidos + throughput do OpenRouter para um provedor específico): indicativa.
- Não há seção de trabalhos futuros; as direções estão no §4.2: recall de especialistas raros, seleção confiável sob distribution shift, curadoria do pool junto com o roteamento, otimização conjunta de desempenho/custo/latência, fronteira de Pareto.
- Inconsistências internas: 391.645 instâncias e 23.945 prompts no texto contra 391.120 e 23.926 pela soma das linhas da Tab. 2; contagem de "10 baselines".

## Pendências
- [x] Conferir as tabelas no paper e promover para `consolidado` (08/11; HTML do arXiv).
- [x] Cruzar com [[LLMRouter (paper)]]: ambos concluem que nenhum roteador domina e que designs simples competem; benchmarks e pools diferentes, não comparáveis. O +14,6% do LLMRouter não é reproduzível pelo texto (ver a nota dele).
- [ ] Se formos usar Avengers-Pro: rodar o código do repo com o nosso pool (fora do escopo do paper).
