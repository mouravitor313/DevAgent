---
tipo: sessão
status: consolidado
tags: [devagent, sessão, skills, stacks]
criado: 2026-11-10
atualizado: 2026-11-10
participantes: [Vítor]
ferramenta: Claude Code (Opus 5.5)
---
# 2026-11-10 - Avaliação das 117 skills do catálogo

## Objetivo da sessão
Fazer a tarefa 6 de [[Próximos passos - ordem de execução]]: avaliar as 117 skills de `~\.agents\skills-avaliacao\` e decidir quais entram no Dev Agent. Isso também cobre o item da Fase 1 do [[Roadmap]] que pedia o mapeamento por stack e por tarefa.

## O que foi feito
- Li o `_catalogo.json` (138 entradas, 117 skills) e o cabeçalho do `SKILL.md` das candidatas de dev.
- Cruzei o catálogo com o que já está instalado: `~\.claude\skills\synced\` (`anthropic-skills:*`), o plugin Vercel 0.44.0, `~\.claude\skills\` e `installed_plugins.json`.
- Resultado em [[Avaliação do catálogo skills-avaliacao]]: 20 candidatas de dev, 10 de Python/dados (já listadas), 41 duplicatas, 11 específicas de projeto, 28 fora do escopo (design/UI), 4 quebradas, 2 descartadas e 1 só de referência.
- Atualizei as notas de stack com as candidatas e a prioridade de cada uma: [[TypeScript]], [[JavaScript]], [[SQL]], [[Next.js]], [[Go]] e [[Tarefas transversais]].
- Corrigi informações desatualizadas nas notas. `turborepo`, `type-fest`, `trigger-*` e `supabase-postgres-best-practices` apareciam como "instaladas", mas só existem no catálogo e nos repos. O `golang-skills` aparecia como "instalação não verificada" e está instalado no escopo do `xend-onchain`.

## Decisões
- Na triagem, nenhuma decisão: era uma proposta, e as candidatas entraram como `candidata`.
- Depois, o Vítor decidiu (DEC-2026-11-10-08 a 11): descartar a `tlc-spec-driven`; na Vercel, seguir só com as skills e desconsiderar o plugin (o A/B foi cancelado e a `ai-sdk` voltou a ser candidata); testar `supabase-postgres-best-practices` e `agent-browser`; instalar o CLI `agent-browser` globalmente e testar em site público.

## Testes (2ª parte da sessão)
- A/B no Haiku, com correção pelo Opus → [[Teste de skills - supabase-postgres e agent-browser 2026-11-10]].
- `agent-browser`: ganho claro. Sem a skill, o screenshot de página inteira saiu quebrado e o agente não percebeu; o custo foi igual nos dois braços.
- `supabase-postgres-best-practices`: ganho modesto em revisão (mesma cobertura, citação de regras, +10% de tokens); falta o teste de escrita.
- CLI `agent-browser` 0.39.4 instalado (versão fixada com mais de 2 semanas; a 0.42.0 saiu hoje) e Chrome 157 baixado em `~\.agent-browser\`.

## Aprendizados
- 39 das 117 skills (33%) são cópias, pelo nome, das `anthropic-skills:*` já sincronizadas. O catálogo tinha muita redundância, herdada dos kits copiados em todos os repos.
- O catálogo não tem nenhuma skill de Git/GitHub nem de testes genéricos. Essas lacunas precisam ser cobertas fora dele.

## Próximos passos
- [x] Testar `supabase-postgres-best-practices` e `agent-browser` no Claude Code.
- ~~Teste de escrita de migration; `agent-browser` no OpenCode; achados do RFQ~~: fora do objetivo (DEC-2026-11-10-13).
- [ ] Excluir a `tlc-spec-driven` do catálogo (DEC-2026-11-10-14).
- [ ] Próxima sessão: o Vítor traz novas direções para os projetos do Dev Agent.
- [ ] Avaliar o plugin `fullstack-dev-skills` (66 skills, escopo `xend-onchain`).
- [ ] Achar uma skill de Git/GitHub (começar pelo `github-dev` em cache).
- [x] Catálogo enxugado (DEC-2026-11-10-12): 44 skills (45 pastas) apagadas; restam 73 skills.

## Arquivos criados/alterados
- Criados: `05-Agente/Skills/Avaliação do catálogo skills-avaliacao.md`, `05-Agente/Avaliação/Teste de skills - supabase-postgres e agent-browser 2026-11-10.md` (+ as pastas com as saídas dos braços), esta nota.
- Registro de decisões: DEC-2026-11-10-08 a 14.
- Fora do vault: 45 pastas apagadas em `~\.agents\skills-avaliacao\` e `_catalogo.json` reescrito.
- Alterados: `05-Agente/Stacks/{TypeScript,JavaScript,SQL,Next.js,Go,Tarefas transversais}.md`, `01-Projeto/Roadmap.md`, `00-Inbox/Próximos passos - ordem de execução.md`, `00 - Index.md`.
