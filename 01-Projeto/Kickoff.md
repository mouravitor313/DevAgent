---
tipo: projeto
status: em-construção
tags: [devagent, kickoff]
criado: 2026-11-08
atualizado: 2026-11-08
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
- [ ] Qual a stack-alvo do agente (Next.js/Vercel + Supabase? Go?)
- [ ] Quais tarefas o agente deve fazer primeiro (review, testes, specs, refactor)?
- [ ] Orçamento mensal de tokens/licenças.
- [ ] Onde o agente roda: local (Claude Code/OpenCode) ou serverless?
  - Para o *nosso* trabalho no projeto: direção é usar o **Claude Code CLI** → [[ADR-0002 - Claude Code CLI como ambiente principal]].
