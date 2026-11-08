---
tipo: sessão
status: consolidado
tags: [devagent, sessão, claude-code, hooks]
criado: 2026-11-08
atualizado: 2026-11-08
participantes: [Vítor]
ferramenta: Claude Code CLI
---
# 2026-11-08 — Checklist da migração: tarefas baratas

## Objetivo da sessão
Avançar no checklist do [[Plano - Migração para agentes no terminal]] com as tarefas mais baratas. Ficaram de fora, por decisão do Vítor (DEC-2026-11-08-18): a rotina do Radar, o teste com um 2º agente e o piloto do PoP.

## O que foi feito
- **`~\.claude\CLAUDE.md` global** criado (quem sou, idioma, onde ficam código e vault, consulta ao Registro de decisões).
- **`~\.claude\settings.json`**: `permissions.additionalDirectories` = `C:/Users/Pedro/Documents/vitorvalt/DevAgent`, mais o hook global `PreToolUse`. O resto do arquivo ficou idêntico (verificado), incluindo o `autoMode` do baas-api (DEC-2026-11-08-07). Backup em `arquivo-claude\2026-11-08\settings.json.antes-hooks`.
- **Hook `vault-guard.js`** (global): nega Write/Edit/NotebookEdit no vault fora de `DevAgent\`. Testado por pipe e ao vivo (uma escrita em `OnChain\` foi bloqueada).
- **Hook `session-note-reminder.js`** (projeto, `Stop`): se há mudança no DevAgent e não existe `02-Sessões/<hoje>*`, pede a nota uma única vez, com guarda contra loop. Testado num repo temporário.
- **`Projetos\AGENTS.md` + `CLAUDE.md` (`@AGENTS.md`)**: regras comuns (Conventional Commits, sem push/PR sem pedido, `# noqa`, checar commits/PRs, prod somente leitura, `/compact`).
- **`DevAgent\CLAUDE.md`**: ajustado para o fluxo CLI.
- **OneDrive**: `Documents` não é redirecionado, então o vault fica onde está.

## Decisões
- DEC-2026-11-08-18: adiar Radar, teste com 2º agente e PoP.
- Registro: o ID `DEC-2026-11-08-14` estava duplicado. A linha do Clerk mantém o `-14` (é a citada no [[Roadmap]]). A do canário foi renumerada para `DEC-2026-11-08-19`, e a original ficou marcada como substituída (append-only).
- Escolhas técnicas desta sessão (propostas, revisáveis): `additionalDirectories` só no `DevAgent\`, e não no vault inteiro; o lembrete de sessão é por dia, não por conversa.

## Aprendizados
- Codex/OpenCode leem `AGENTS.md` da raiz do repo para baixo. O `Projetos\AGENTS.md` (pasta-pai, sem git) vale só para o Claude.
- O guard não cobre escrita via Bash. Para isso, precisaria de `permissions.deny` ou do sandbox.

## Próximos passos
- [ ] `/init` → `AGENTS.md` em cada repo ativo (onchain, hedglobal, arb, terminal). baas-api só depois da DEC-2026-11-08-07. Remover dos `AGENTS.md` dos repos as regras que agora estão em `Projetos\AGENTS.md`.
- [ ] Itens adiados (DEC-2026-11-08-18).

## Arquivos criados/alterados
- `~\.claude\CLAUDE.md`, `~\.claude\settings.json`, `~\.claude\hooks\vault-guard.js`
- `Projetos\AGENTS.md`, `Projetos\CLAUDE.md`
- `DevAgent\CLAUDE.md`, `DevAgent\.claude\settings.json`, `DevAgent\.claude\hooks\session-note-reminder.js`
- [[Plano - Migração para agentes no terminal]], [[Registro de decisões]]
