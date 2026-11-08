---
tipo: paper
status: a-ler
tags: [devagent, paper, roteamento, benchmark]
criado: 2026-11-08
atualizado: 2026-11-08
autores:
ano: 2026 (12/01)
fonte: https://arxiv.org/abs/2601.07206
codigo: https://github.com/ynulihao/LLMRouterBench
relacionados: ["[[Roteamento de LLMs]]", "[[LLMRouter (paper)]]", "[[2026-11-08 - Radar Dev & IA (Ciclo 3)]]"]
---
# LLMRouterBench

## Em uma frase
Benchmark + framework único para avaliar roteadores de LLM: ~400 mil instâncias, 21 datasets, 33 modelos, 10 baselines.

## Ideias principais (segundo o radar; ler o paper para confirmar)
- Sob avaliação unificada, **muitos roteadores empatam**.
- Vários métodos recentes — **inclusive roteadores comerciais** — não batem de forma confiável uma baseline simples.
- Grande lacuna até o **Oracle** (falhas de "recall" de modelo).
- O embedding de base importa pouco; **curadoria de modelos rende mais que aumentar o ensemble**.

## O que importa para o Dev Agent
- Régua para avaliar LLMRouter / RouteLLM / CARROT / vLLM Semantic Router antes de escolher um.
- Sugere investir em **escolher bem 3–5 modelos** do pool antes de sofisticar o roteador.

## Pendências
- [ ] Ler o paper e preencher autores/resultados.
- [ ] Cruzar com [[LLMRouter (paper)]].
