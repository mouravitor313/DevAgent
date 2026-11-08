---
tipo: hub
status: em-construção
tags: [devagent, stacks, hub]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[ADR-0004 - Stacks agnósticas e seção de Stacks modular]]", "[[Tarefas transversais]]", "[[00 - Index]]"]
---
# Stacks

O agente é **agnóstico de stack** ([[ADR-0004 - Stacks agnósticas e seção de Stacks modular]]). Este hub organiza o que o agente precisa saber de cada stack, em módulos do mesmo formato.

## Stacks cobertas
| Stack | Nota | Contexto | Skills | Docs | MCPs/plugins |
|---|---|---|---|---|---|
| Python | [[Python]] | ✔ | ◐ | ✔ | ◐ |
| Go | [[Go]] | ◐ | ◐ | ✔ | ◐ |
| TypeScript | [[TypeScript]] | ✔ | ◐ | ✔ | ◐ |
| JavaScript | [[JavaScript]] | ✔ | ◐ | ✔ | ◐ |
| Next.js | [[Next.js]] | ✔ | ◐ | ✔ | ◐ |
| SQL | [[SQL]] | ✔ | ◐ | ✔ | ◐ |

☐ vazio · ◐ candidatos listados, nada testado · ✔ preenchido. Atualize a tabela ao mexer em uma nota. Contexto preenchido em 2026-11-08 a partir dos `AGENTS.md`/manifests de 16 repos (Advisor Strategy, DEC-2026-11-08-25); Go fica em ◐ por ter um repo só.

Transversal (vale em qualquer stack): [[Tarefas transversais]] — review, testes, specs, refactor, workflow, Git/GitHub.

## Formato de cada nota de stack
Todas têm o mesmo frontmatter e as mesmas cinco seções, nesta ordem:

1. **Contexto** — o que um agente precisa saber para trabalhar nessa stack: comandos (build, teste, lint, formatação), convenções, armadilhas, o que nunca fazer. Escrito para ser colado ou importado no `AGENTS.md` do repo. Curto: cada linha nova deve vir de uma falha real (ratchet).
2. **Skills** — tabela `skill | origem | serve para | estado | testado em`.
3. **Documentação** — links oficiais e referências canônicas. Toda afirmação externa leva link.
4. **MCPs e plugins** — tabela `item | origem | serve para | estado | testado em | observações` (inclui como configurar em cada agente quando for diferente).
5. **Achados** — log append-only: `data | achado | fonte`. Quando virar regra, suba para Contexto e deixe a linha como histórico.

**Estados** (Skills e MCPs/plugins): `candidata` → `em-teste` → `adotada` (ou `descartada`, com o motivo).
**Testado em:** `claude-code`, `opencode`, ou `—`. Só vira `adotada` depois de testada nos dois, ou com a exceção explicada.

## Como adicionar uma stack
1. Copie o [[#Modelo de nota de stack]] para `05-Agente/Stacks/<Stack>.md`.
2. Preencha só o que já souber; deixe o resto vazio. O `status` começa em `a-ler` ou `em-construção`.
3. Acrescente a linha na tabela acima e ligue a nota ao [[Stacks]].
4. Registre a decisão no [[Registro de decisões]] se ela for estrutural (escolha de ferramenta, convenção).

## Como o conteúdo chega aos agentes
- **Contexto** → `AGENTS.md` do repo (fonte da verdade para Claude Code e OpenCode; `CLAUDE.md` só importa `@AGENTS.md`). Ver [[Plano - Migração para agentes no terminal]].
- **Skills** adotadas → `.agents\skills\` (junção para `.claude\skills\`), como no plano de migração.
- **MCPs e plugins** → a configuração é por agente (Claude Code e OpenCode usam arquivos diferentes), então a nota registra a configuração de cada um. *Validar no teste com o OpenCode.*

## Modelo de nota de stack
````markdown
---
tipo: stack
status: a-ler
tags: [devagent, stack, <stack>]
criado: AAAA-MM-DD
atualizado: AAAA-MM-DD
relacionados: ["[[Stacks]]", "[[Tarefas transversais]]"]
---
# <Stack>

## Contexto
- Comandos: build `…` · teste `…` · lint `…` · formatação `…`
- Convenções:
- Armadilhas:

## Skills
| skill | origem | serve para | estado | testado em |
|---|---|---|---|---|

## Documentação
-

## MCPs e plugins
| item | origem | serve para | estado | testado em | observações |
|---|---|---|---|---|---|

## Achados
| data | achado | fonte |
|---|---|---|
````
