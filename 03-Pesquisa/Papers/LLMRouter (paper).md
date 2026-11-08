---
tipo: paper
status: em-construção
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

## Em uma frase
Biblioteca open-source + benchmark (xRouteBench) que unifica como roteadores de LLM são construídos e avaliados, com 16+ roteadores prontos.

## Problema que resolve
Roteadores existentes usam formalismos, códigos e avaliações incompatíveis → impossível compará-los de forma justa.

## Ideias principais
- Roteamento formulado como **processo de decisão sequencial**: objetivo `max E[perf(y|q) − λ·custo(τ)]`; λ controla o trade-off qualidade × custo.
- Todo roteador = 5 componentes: **encoder de contexto, encoder de modelo, função de score, regra de decisão, sinal de aprendizado**.
- Três famílias: **single-turn**, **multi-turn (inclui agênticos)** e **personalizados**.
- Pipeline automático: roda 18 modelos candidatos (faixa ampla de preço) em vários benchmarks e registra qualidade + custo por token.
- Expõe qualquer roteador como **servidor compatível com OpenAI** (deploy via OpenClaw ou interface ComfyUI).

## Resultados (números do paper)
- Roteadores aprendidos: **+14,6%** relativo sobre o melhor modelo fixo.
- **Nenhum roteador domina**; o melhor muda por tarefa e orçamento.
- Com orçamento apertado, o ranking **inverte a favor de designs leves**.
- Multi-turn **não** supera single-turn de forma consistente (decomposição adiciona custo).
- Personalização compensa se o contexto do usuário for bem modelado.

## O que importa para o Dev Agent
- A interface OpenAI-compatível permite plugar o roteador na frente do agente sem mudar o cliente.
- Achado de "designs leves sob orçamento apertado" apoia começar com roteamento simples (heurística/cascata) — ver [[Roteamento de LLMs]].
- Contraponto: [[LLMRouterBench (paper)]] mostra que muitos roteadores não batem baselines simples.

## Dúvidas / críticas
- Os 18 modelos candidatos refletem o nosso pool (Claude, GLM, Kimi, Qwen)? Verificar.
- Texto completo do paper estava em `docs/` do projeto Claude "Estudos Dev Agent" — não copiado aqui por tamanho.
