---
tipo: decisão
status: aceita
tags: [devagent, adr, contexto, skills, github]
criado: 2026-11-10
atualizado: 2026-11-11
decisores: [Vítor]
substitui:
relacionados: ["[[Registro de decisões]]", "[[ADR-0004 - Stacks agnósticas e seção de Stacks modular]]", "[[Roadmap]]"]
---
# ADR-0006 — Contexto mínimo, padrões abertos e tasks paralelas

> status: `aceita` em 11/11/2026, com os 4 ajustes abaixo (DEC-2026-11-11-02). Filosofia: [[Filosofia do setup de agentes]] (DEC-2026-11-11-01).

## Contexto
Em 10/11 o Vítor conversou com um CTO sobre o setup de desenvolvimento com IA. Pontos dele (paráfrase fiel, fonte: conversa privada, não auditado):
- Usar o que é **padronizado** em vez do exclusivo (ex.: Skills em vez de Plugins).
- Configurar o máximo para **agentes paralelos** em vez de cascata. Ex.: tasks em **GitHub Issues** em vez de markdown no repo, para vários agentes (local ou nuvem) trabalharem sem depender um do outro.
- **Menos é mais** no contexto: quanto mais contexto, pior o modelo. O ideal é o mínimo para iniciar uma task.
- No contexto fica só o que **todos os agentes precisam saber a todo momento**; o resto vira skill referenciada (ex.: Next.js não precisa estar no contexto principal).

Isso reforça o objetivo que já tínhamos: tornar o setup agnóstico de fornecedor, com tudo em skills e `AGENTS.md` (o `CLAUDE.md` só referencia).

## Decisão
1. **Contexto mínimo** (DEC-2026-11-10-22): `AGENTS.md` só com regras universais e permanentes; conhecimento de stack, procedimentos e referências viram skills.
2. **Padrões abertos** (DEC-2026-11-10-23): Skills + `AGENTS.md`; plugins e recursos exclusivos de um agente só quando não houver equivalente padrão.
3. **Tasks paralelas** (DEC-2026-11-10-24): tasks em GitHub Issues, independentes entre si.
4. **Ordem** (DEC-2026-11-10-25): contexto → GitHub Issues → remoção da `tlc-spec-driven`. TDD adiado (DEC-2026-11-10-26). A filosofia vem depois de pesquisa.

## Consequências
- Positivas: menos tokens fixos por sessão; mesmo setup em Claude Code, Codex e OpenCode; paralelismo real entre agentes.
- Negativas / riscos: a descoberta de skills depende de boas `description`; issues exigem tasks bem recortadas (sem dependências implícitas).
- A revisar: a seção [[Stacks]] ([[ADR-0004 - Stacks agnósticas e seção de Stacks modular]]) tem colunas de "Contexto" e de "MCPs/plugins" por stack. Pela nova direção, o contexto de stack deve virar skill e não ir para o `AGENTS.md` principal.

## Ajustes da pesquisa (propostos em 10/11, aceitos em 11/11 — DEC-2026-11-11-02)
A pesquisa da P0 ([[Pesquisa P0 - contexto mínimo, padrões abertos e agentes paralelos]]) sustenta os três pontos, mas sugere quatro refinamentos. Estão detalhados em [[Filosofia do setup de agentes]]:
1. **Contexto mínimo ≠ tudo em skill.** O que o agente precisa em quase toda task (comandos de build e teste, restrições) fica no `AGENTS.md`, como índice compacto. Skill nem sempre é ativada (Vercel mediu 56% de não invocação, não auditado). Medir a ativação das nossas skills antes de migrar mais conteúdo.
2. **Exceção aos padrões abertos para garantias.** Hooks/deny/CI são aceitos quando a regra não pode falhar, com a lógica em script neutro e a regra também escrita no `AGENTS.md`.
3. **Pasta canônica de skills espelhada** (`.agents/skills` ↔ `.claude/skills`), porque o Claude Code e o Codex leem pastas diferentes.
4. **Issues em modelo híbrido:** spec/ADR em markdown e execução em issue. Paralelo só para tasks disjuntas, e o WIP de agentes limitado pela capacidade de revisão.

## Fontes / sessões relacionadas
- [[2026-11-10 - Nova direção - contexto mínimo e tasks paralelas]]
- [[2026-11-10 - Pesquisa P0 - filosofia do setup]]
