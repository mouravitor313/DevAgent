---
tipo: decisão
status: aceita
tags: [devagent, adr]
criado: 2026-11-08
atualizado: 2026-11-08
decisores: [Vítor]
substitui:
---
# ADR-0001 — Vault Obsidian como memória do projeto

## Contexto
As pesquisas e decisões do projeto "Estudos Dev Agent" ficavam espalhadas em conversas e no projeto do Claude. Chats longos perdem contexto, e o futuro agente precisa de uma memória persistente que leia e escreva.

## Opções consideradas
1. Pasta própria `DevAgent/` dentro do vault pessoal `vitorvalt`.
2. Reorganizar o vault inteiro (PARA).
3. Vault separado só para o projeto.

## Decisão
Opção 1: pasta autocontida `DevAgent/` com estrutura numerada (Inbox → Projeto → Sessões → Pesquisa → Conhecimento → Agente), regras em `AGENTS.md` e templates com frontmatter.

## Consequências
- Positivas: não mexe no resto do vault; o agente pode usar só essa pasta; links com o resto do vault continuam possíveis; Markdown puro é portável para qualquer agente/ferramenta.
- Negativas / riscos: o vault mistura conteúdo pessoal → o agente precisa respeitar o escopo definido em AGENTS.md. Se o projeto crescer muito ou for compartilhado com o time, rever (mover para vault/repo próprio com Git).

## Fontes / sessões relacionadas
- [[2026-11-08 - Kickoff do vault DevAgent]]
