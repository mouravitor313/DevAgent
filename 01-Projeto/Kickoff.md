---
tipo: projeto
status: em-construção
tags: [devagent, kickoff]
criado: 2026-11-08
atualizado: 2026-11-13
responsavel: Vítor
relacionados: ["[[Roadmap]]", "[[ADR-0001 - Vault como memória do projeto]]"]
---
# Kickoff — Dev Agent

## Objetivo
Construir um **agente desenvolvedor** próprio: um harness (instruções, skills, ferramentas, MCP, hooks, verificação) sobre modelos escolhidos por **roteamento custo × qualidade**, que ajude o time a desenvolver com segurança e a custo controlado.

> "Agente = Modelo + Harness" — o diferencial está no que cerca o modelo. Ver [[2026-11-08 - Radar Dev & IA (Ciclo 1)]].

## Por que agora
- Custo de licenças de IA está subindo; empresas grandes já cortam orçamento de tokens e usam roteadores (caso Revolut, ~90% menos custo — não auditado).
- Padrões abertos amadureceram: AGENTS.md, Agent Skills, MCP stateless.
- Modelos abertos baratos (GLM 5.x, Kimi K3.1, Qwen-Coder) viabilizam uma camada auto-hospedada.

## Escopo (proposta inicial — validar)
**Dentro**
- Second brain (este vault) como memória persistente do projeto e do agente.
- Harness: AGENTS.md, skills internas, hooks de segurança, loops de verificação.
- Roteamento: premium para arquitetura/decisões, barato para rotina.
- Spec-Driven Development como fluxo de trabalho do agente.
- Avaliação: benchmark interno de tarefas reais.

**Fora (por enquanto)**
- Treinar modelos próprios.
- Infra de GPU dedicada antes de um piloto medido.

## Princípios
1. **Zero Trust no código gerado** — ver [[Uma Breve Introdução ao Desenvolvimento com LLMs]].
2. **Contexto curto e modular > janela gigante** — memória persistente no vault.
3. **Toda falha vira regra** (ratchet no AGENTS.md).
4. **Medir antes de escalar** — custo e qualidade por tarefa.
5. **Padrões abertos** para não ficar preso a um fornecedor.

## Pessoas
- Vítor — responsável.
## Perguntas em aberto
- [x] Qual a stack-alvo do agente? **Agnóstica** (Python, Go, TS, JS, Next, SQL e outras) → [[ADR-0004 - Stacks agnósticas e seção de Stacks modular]] · [[Stacks]] (DEC-2026-11-08-20/21)
- [x] Quais tarefas o agente deve fazer primeiro? **Review, testes, specs, refactor, organização do workflow e gerenciamento de Git/GitHub** → [[Tarefas transversais]] (DEC-2026-11-08-22)
- [x] Orçamento mensal de tokens/licenças. **Fechado em 13/11:** teto de ~R$ 2.000/mês para a equipe toda e **meta de reduzir 55% a 60%** (→ ~R$ 800–900/mês), sem deadline; cobre licenças e API. Caminho: medir os effort points antes de cancelar assinaturas caras e manter 1 Claude premium + assinaturas mais baratas (DEC-2026-11-13-04/05, substituem a DEC-2026-11-08-23). O Claude do time é plano de time, não API → [[Custo por effort point]].
- [x] Onde o agente roda? **Local, no Claude Code e no OpenCode.** OpenCode já instalado, com modelos gratuitos para testar o harness (DEC-2026-11-08-24). Para o *nosso* trabalho no projeto: [[ADR-0002 - Claude Code CLI como ambiente principal]].
