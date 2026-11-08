---
tipo: paper
status: consolidado
tags: [devagent, paper, roteamento, llm-router]
criado: 2026-11-08
atualizado: 2026-11-08
autores: Tao Feng, Fangxu Yu, Haozhen Zhang et al. (UIUC, UMD, NTU, Purdue, UIC)
ano: 2026
fonte: https://arxiv.org/html/2608.06867
codigo: https://github.com/ulab-uiuc/LLMRouter
relacionados: ["[[Roteamento de LLMs]]", "[[LLMRouterBench (paper)]]"]
---
# LLMRouter — Unified Infrastructure for Developing, Evaluating, and Deploying LLM Routers

> **Grau de verificação:** conferido em 08/11 no [HTML do arXiv (v1)](https://arxiv.org/html/2608.06867) (Tabelas 2–7, 9, 10, Apêndices B–G, §5) e no README do repo. Trechos de deploy do README vieram de resumo do fetcher (não literais). Custos por roteador estão só em figuras (5 e 6), não lidas. Números **não auditados** por nós; não rodamos o código.

## Em uma frase
Biblioteca open-source (MIT) + benchmark (xRouteBench) que unifica como roteadores de LLM são construídos e avaliados, com 17 roteadores embutidos (o abstract diz "mais de 16").

## Problema que resolve
Roteadores existentes usam formalismos, códigos e avaliações incompatíveis → impossível compará-los de forma justa.

## Formulação (§2.1)
- Estado `s_t = (q, u, h_t)` (query, contexto opcional do usuário, histórico). Ação: despachar a um modelo `m ∈ M` ou terminar (⊥). Single-turn = um único despacho.
- Objetivo (Eq. 1): `π* = argmax E[ perf(y|q) − λ·c(τ) ]`, λ ≥ 0 controla qualidade × custo. O argmax guloso só é ótimo com λ = 0.
- Todo roteador = 5 componentes: **encoder de contexto, encoder de modelo, função de score, regra de decisão, sinal de aprendizado**.
- Pipeline de dados: curadoria de queries → coleta de respostas → métrica + preço; produz uma matriz query×modelo de desempenho e custo.
- Avaliação: recompensa `α·perf − β·custo` em 5 configurações, de (1,0; 0,0) a (0,2; 0,8).

## Roteadores embutidos (§5.1, Apêndice B)
- **Regra (2):** Smallest-LLM, Largest-LLM.
- **Single-turn (10):** kNN, SVM, MLP, MF, Elo, RouterDC, Hybrid LLM, AutoMix, GraphRouter, CausalLM Router. Hybrid LLM e AutoMix são cascatas de dois modelos.
- **Multi-turn/agênticos (3):** Router-R1, kNN-MultiRound, LLM-MultiRound.
- **Personalizados (2):** GMTRouter, PersonalizedRouter.
- O README agrupa de outro jeito e cita TSRouter e racerrouter, que não estão no paper.

## Benchmark xRouteBench (§3, Tab. 6–7)
5 trilhas, 8 test sets, 4.767 queries: **Generic** (3.729; MBPP, MATH, GSM8K, MMLU-Pro, OpenBookQA, ARC-C, MMLU com 500 cada, mais CommonsenseQA, BoolQ, SQuAD, HellaSwag, HumanEval, AIME), Memory (LoCoMo, LongMemEval), TimeSeries (TSRBench), Vision (Geometry3K, MathVista, Charades-Ego) e Personalized (Chatbot Arena/MT-Bench, juiz LLM). Sem tarefas de código em repositório.

## Os 18 modelos candidatos (Apêndice C, Tab. 9; US$/1M tokens entrada/saída)
Todos servidos por **Together** ou **NVIDIA** (não há Claude, GPT, GLM ou Kimi):
gemma-2-9b-it 0,10/0,10 · llama-3-8b-lite 0,10/0,10 · gpt-oss-20b 0,05/0,20 · rnj-1-instruct 0,15/0,15 · mistral-7b-v0.3 0,20/0,20 · mistral-small-3-24b 0,10/0,30 · qwen2.5-7b 0,20/0,20 · qwen2.5-7b-turbo 0,30/0,30 · gpt-oss-120b 0,15/0,60 · llama-4-maverick 0,27/0,85 · mixtral-8x7b 0,60/0,60 · qwen3-next-80b-a3b 0,15/1,50 · **qwen3-coder-next 0,50/1,20** · llama-3.3-70b-turbo 0,88/0,88 · llama3-70b 0,90/0,90 · **deepseek-v3.1 0,60/1,70** · mixtral-8x22b 1,20/1,20 · cogito-v2-1-671b 1,25/1,25.
Faixa de preço de entrada: ~25x. Existe variante sem o cogito (17 modelos). A §5.1 diz "7B a 671B", mas a tabela lista llama-4-maverick com 402B.

## Resultados (Tabela 2, (α,β) = (1,0); AvgAcc sobre 7 colunas)
| Roteador | Generic | Avg |
|---|---|---|
| GraphRouter | 80,54 | **45,46** |
| SVMRouter | 74,21 | 45,10 |
| EloRouter | 64,15 | 44,68 |
| kNNRouter | 71,37 | 41,30 |
| Hybrid LLM | 64,68 | 40,20 |
| MLPRouter | 68,12 | 39,34 |
| Largest-LLM | 70,29 | 38,72 |
| MFRouter | 67,23 | 38,69 |
| Smallest-LLM | 57,55 | 37,94 |
| RouterDC | **80,56** | 36,32 |
| Router-R1 / kNN-MultiRound / LLM-MultiRound | 35,64 / 13,99 / 12,98 | 22,30 / 23,20 / 22,37 |

- **+14,6% (abstract):** "sobre o baseline de modelo fixo mais forte". O texto **não define** métrica, benchmark nem modelo fixo. Pela Tab. 2, GraphRouter sobre Largest-LLM daria ~+17,4% e SVM ~+16,5%; o número não é reproduzível a partir do texto. Tratar como alegação.
- **Nenhum roteador domina:** RouterDC lidera o Generic (80,56) mas fica em último entre os aprendidos na média; EloRouter lidera Vision e TimeSeries; o melhor muda por trilha.
- **Orçamento apertado (§5.3, Fig. 5–6, só qualitativo):** o RouterDC cai para 10º de 11 quando o custo pesa; o MLPRouter vira a melhor escolha em Vision para β ≥ 0,4; chamar sempre o maior modelo tem o maior custo e desempenho mediano. O abstract fala em "designs leves", mas o texto só dá esses exemplos.
- **Multi-turn não compensa (§5.2):** os 3 multi-turn ficam em 22–23 de média, abaixo até do Smallest-LLM (37,94). Base é um Qwen2.5-3B; o resultado depende dele.
- **Multi-agente (Tab. 5, Generic):** 6 de 7 roteadores aprendidos superam o Largest-LLM (71,48); o melhor é o MFRouter (76,48); GraphRouter fica abaixo (69,24).
- **Personalização:** Tab. 3 (juiz DeepSeek-V3.1): GMTRouter 68,78, PersonalizedRouter 67,86, contra Largest-LLM 58,05. Tab. 4 (15 usuários reais no Slack, 234 registros pareados; poucos dados): PersonalizedRouter 83,05, Elo 82,20, GMTRouter só em 6º (70,70). Não é robusto.

## Deploy (§4, Apêndice G; README)
- Qualquer roteador vira um **servidor compatível com OpenAI** (README: `llmrouter serve --config ...`, porta 8000, `/v1/chat/completions` e `/v1/responses`; estratégias llm, random, round_robin, rules e llmrouter; provedores Together, NVIDIA, OpenAI, Anthropic e locais). Integra com OpenClaw (Slack/Discord) e tem nós de ComfyUI. Instalação: `pip install llmrouter-lib`. Licença do repo: MIT; paper CC BY 4.0.

## O que importa para o Dev Agent
- A interface OpenAI-compatível permite pôr o roteador na frente do agente (OpenCode) sem mudar o cliente; a verificar se aceita endpoints de outros provedores (Groq, OpenRouter) como candidatos.
- Os modelos candidatos são a camada **barata/aberta** (nenhum premium): **qwen3-coder-next** e **deepseek-v3.1** estão no pool deles com preço de Together, uma referência para a camada barata do nosso pool ([[Qwen3-Coder-Next]]). Resposta à dúvida anterior: o pool deles **não** reflete o nosso (sem Claude, GLM, Kimi).
- Apoia o que o [[LLMRouterBench (paper)]] mostra: ganho depende do pool e da trilha; sem melhor modelo único, comparar sempre com a baseline.
- Multi-turn/decomposição **não** vale a pena para nós agora.
- Os testes são de QA, matemática e visão; nada de código em repo, então os números não se transferem direto ao nosso agente.

## Limitações / ressalvas
- Não há seção de Limitations nem de trabalhos futuros: a Conclusão é um parágrafo. Só observações pontuais: precisa de melhor estimativa de suficiência, early stopping e decomposição/agregação mais eficaz (§5.2); o planejador do GraphPlanner não foi treinado porque as respostas dos candidatos "foram aposentadas" (Apêndice E).
- Custos só em figuras; a Tab. 2 mede só qualidade.
- Conjuntos de teste pequenos (Vision 27–100 queries; Personalized 308).

## Pendências
- [x] Ler o paper e conferir a lista dos 18 modelos (08/11).
- [ ] Avaliar o repo quando entrarmos na Fase 3 do [[Roadmap]]: servir um roteador simples (Elo/SVM) com o nosso pool de API barata e medir contra o melhor modelo único.
