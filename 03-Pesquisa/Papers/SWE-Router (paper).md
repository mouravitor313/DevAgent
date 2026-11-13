---
tipo: paper
status: a-ler
tags: [devagent, paper, roteamento]
criado: 2026-11-11
atualizado: 2026-11-11
autores: Seongho Son, Sangwoong Yoon, Jiahua Tang, Shuhan Wang, Lorenz Wolf, Ilija Bogunovic
ano: 2026
fonte: https://arxiv.org/abs/2607.00053
codigo:
relacionados: ["[[Roteamento de LLMs]]", "[[Agent-as-a-Router (paper)]]", "[[TwinRouterBench (paper)]]", "[[LLMRouterBench (paper)]]"]
---
# SWE-Router: Routing in Multi-turn Agentic Software Engineering Tasks

> Só o abstract foi lido (arXiv 2607.00053v1, 30/06/2026). Ler o PDF antes de usar números.

## Em uma frase
Em vez de escolher o modelo só pelo texto da tarefa, deixa um modelo barato rodar alguns turnos e decide, olhando a trajetória parcial, se continua barato ou escala para o caro.

## Problema que resolve
Mandar toda tarefa para o modelo de ponta é desperdício, mas o texto do issue não separa um typo local de um refactor em vários módulos (limite de erro de Bayes para roteadores que só leem o prompt).

## Ideias principais
- Abordagem **temporal, baseada em valor**: poucos turnos exploratórios com o modelo barato → ler a trajetória parcial → continuar ou escalar.
- Teorema: condicionar na trajetória parcial **nunca piora** o roteamento e é **estritamente melhor** quando a exploração é informativa.
- Testado em pares de modelo fraco/forte ao longo da fronteira custo × capacidade.
- Libera um **dataset de trajetórias multi-LLM** para reproduzir.

## Resultados (números do paper)
- Abstract: "melhora muito a eficiência de custo" mantendo "a maior parte" do desempenho do modelo forte. Números exatos: a ler no PDF.

## O que importa para o Dev Agent
- Receita direta de **cascata com escalonamento** para a Fase 3 (baseline antes de roteador aprendido); encaixa no OpenCode/harness.
- Mesma tese de [[Agent-as-a-Router (paper)]] e [[TwinRouterBench (paper)]]: roteador melhora com sinal observado na execução.

## Dúvidas / críticas
- Qual critério concreto de escalar (valor estimado)? Quantos turnos exploratórios? Custo do retrabalho em rota errada?
- Funciona fora do SWE-bench (nossas tarefas reais)?
