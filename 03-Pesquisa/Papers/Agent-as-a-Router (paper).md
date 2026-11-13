---
tipo: paper
status: a-ler
tags: [devagent, paper, roteamento]
criado: 2026-11-10
atualizado: 2026-11-10
autores: Pengfei Zhou, Zhiwei Tang, Yixing Ma e outros (11 autores)
ano: 2026
fonte: https://arxiv.org/abs/2606.22902
codigo: https://github.com/LanceZPF/agent-as-a-router
relacionados: ["[[Roteamento de LLMs]]", "[[TwinRouterBench (paper)]]", "[[LLMRouterBench (paper)]]", "[[LLMRouter (paper)]]"]
---
# Agent-as-a-Router: Agentic Model Routing for Coding Tasks

> Só o resumo (abstract) foi lido; o paper completo ainda não. Números abaixo são do abstract.

## Em uma frase
Em vez de classificar a tarefa uma vez só, o roteador vira um agente que aprende com a execução: escolhe um modelo, vê o resultado e usa isso na próxima escolha.

## Problema que resolve
Roteadores atuais tratam a escolha do modelo como classificação estática e única. O gargalo, segundo os autores, é **falta de informação**: o roteador não sabe como cada modelo realmente se sai naquele tipo de tarefa.

## Ideias principais
- Só **acrescentar estatísticas de desempenho por dimensão da tarefa** a um roteador LLM simples já deu **+15,3% relativo** e superou um roteador heurístico com os mesmos dados.
- Laço **C-A-F** (Contexto → Ação → Feedback → Contexto): o roteador acumula experiência verificada durante o uso.
- **ACRouter** = Orquestrador + Verificador + Memória.
- **CodeRouterBench**: ~10 mil tarefas com notas verificadas de 8 LLMs de ponta; compara roteadores por **arrependimento acumulado** (regret) em fluxo contínuo de tarefas.

## Resultados (números do paper)
- ACRouter teve o **menor arrependimento acumulado** em tarefas da mesma distribuição e generalizou para tarefas agênticas de programação fora da distribuição (segundo o abstract).

## O que importa para o Dev Agent
- Dá base teórica ao nosso plano: começar com cascata simples ([[Roteamento de LLMs]]) e **registrar resultado por tarefa** (custo, passou/falhou) para virar o "feedback" de um roteador futuro. O vault já é a memória ([[ADR-0001 - Vault como memória do projeto]]).
- Complementa [[TwinRouterBench (paper)]] (benchmark) e o roteamento por passo do *Agentic Routing* (arXiv 2607.11399), já citado em [[2026-11-09 - Radar Dev & IA]].
- Código e benchmark abertos: bom candidato a régua do nosso benchmark interno (Fase 4).

## Dúvidas / críticas
- Resultados só do abstract; falta checar custo do próprio roteador-agente (chamadas extras) e se ganha da baseline simples, como alerta o [[LLMRouterBench (paper)]].
- Precisa de verificador confiável; em tarefas sem teste automático, o "feedback" fica fraco.
