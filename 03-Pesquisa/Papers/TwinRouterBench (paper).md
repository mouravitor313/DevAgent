---
tipo: paper
status: a-ler
tags: [devagent, paper]
criado: 2026-11-09
atualizado: 2026-11-09
autores: Yang et al.
ano: 2026
fonte: https://arxiv.org/abs/2605.18859
codigo:
relacionados: ["[[LLMRouterBench (paper)]]", "[[LLMRouter (paper)]]", "[[Roteamento de LLMs]]"]
---
# TwinRouterBench (paper)

> Nota criada a partir de um resumo de busca (não li o paper inteiro). Tudo abaixo **a confirmar** no arXiv.

## Em uma frase
Benchmark para avaliar roteadores de LLM em cenários **agênticos** realistas, com uma trilha estática (rápida) e uma dinâmica (roda de verdade).

## Problema que resolve
Benchmarks de roteamento tradicionais olham prompts isolados; em agentes de código o roteador decide em vários passos, e avaliar isso ao vivo é caro.

## Ideias principais
- Trilha **estática** (barata, rótulos pré-computados) + trilha **dinâmica ao vivo** (roteadores rodando no SWE-bench Verified).
- Usar a trilha estática para treinar/prever o que funcionaria na dinâmica.

## Resultados (números do paper)
- Segundo o resumo: um **roteador logístico treinado nos rótulos estáticos** teve o melhor custo × sucesso entre as políticas avaliadas. (a confirmar)

## O que importa para o Dev Agent
- Referência para a **Fase 3** (roteador baseline simples antes de roteador aprendido) e para medir custo/tarefa na **Fase 4**.
- Complementa [[LLMRouterBench (paper)]] (roteamento por prompt) com roteamento dentro do harness; relacionado: *Agentic Routing: The Harness-Native Data Flywheel* (arXiv 2607.11399).

## Dúvidas / críticas
- Quais roteadores/modelos foram comparados e quão grande foi o ganho? Conferir no texto.
