---
tipo: referência
status: em-construção
tags: [devagent, referência, claude-code, agentes-paralelos, subagents, github]
criado: 2026-11-12
atualizado: 2026-11-12
fonte: https://code.claude.com/docs/en/sub-agents · https://code.claude.com/docs/en/agent-teams · https://code.claude.com/docs/en/cross-session-messaging
formato: artigo
relacionados: ["[[Filosofia do setup de agentes]]", "[[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]", "[[ADR-0007 - Spec versionada e estado no GitHub]]", "[[Modelo de issue para agentes]]"]
---
# Subagents, agent teams e cross-session messaging (Claude Code)

> Análise de 12/11/2026: algum desses recursos serve para **executar as issues em paralelo** pelo Claude Code sem ferir a [[Filosofia do setup de agentes]]? Docs lidas em 12/11 (versão local do CC: 2.1.295). Caso concreto: épico F1 do `xend-onchain` (#168, sub-issues #169–#179).

## Resumo
| | Subagents | Agent teams | Cross-session messaging |
|---|---|---|---|
| O que é | Worker com contexto próprio, devolve só um resumo à sessão principal | Lead + teammates (sessões completas) com **task list** e mailbox próprias | Mensagem de texto entre sessões independentes (locais, outras máquinas, nuvem) |
| Status | Estável | **Experimental**, desligado por padrão (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) | Estável, ligado sem config (Windows nativo ≥ 2.1.234; temos 2.1.295) |
| Isolamento | `isolation: worktree` (worktree temporário a partir da branch padrão) | **Mesmo diretório**; a doc manda dividir arquivos entre teammates. Chamada com `isolation` **não** vira teammate | Cada sessão onde você a abriu (ex.: worktree irmão) |
| Estado das tasks | Fica com quem orquestra (pode ser o GitHub) | `~/.claude/tasks/{team}/` — **segunda fonte de estado**, local, só Claude | Nenhum; só avisos |
| Contexto | Carrega toda a hierarquia `CLAUDE.md`/`AGENTS.md` + prompt de delegação; não vê a conversa principal | Igual a uma sessão normal + spawn prompt; campo `skills` da definição **nunca** é aplicado | Só o texto da mensagem; nada de histórico |
| Modelo por worker | `model:` no frontmatter ou na chamada (haiku/sonnet/opus/fable) | Pelo spawn prompt ou pela definição | O da própria sessão |
| Custo | Tokens próprios por worker; resumo curto volta ao principal | "significantly more tokens"; cresce linear com teammates; cache de 5 min | Conta como um prompt digitado |
| Windows | OK | Só **in-process** (split-pane exige tmux/iTerm2; não funciona no Windows Terminal) | OK (named pipe com token) |
| Limites | ≤ 20 simultâneos; aninhamento até 3 níveis | 1 time por sessão, sem aninhar, lead fixo; `/resume` não restaura teammates; permissões herdadas do lead (inclusive bypass) | Cloud não responde por `SendMessage`; texto puro; rate limit por remetente |
| Fornecedor | Exclusivo do Claude Code (formato `.md` + frontmatter) | Exclusivo e experimental | Exclusivo, mas opcional |

## Encaixe na nossa filosofia
Princípios citados por número da [[Filosofia do setup de agentes]].

### Agent teams — **não adotar para executar issues**
- **Duplica o estado.** A task list do time fica em `~/.claude/tasks/`, local e só do Claude. Pelo [[ADR-0007 - Spec versionada e estado no GitHub]] o estado é a issue no GitHub, visível para colegas, Codex/OpenCode e agentes de nuvem. Manter as duas sincronizadas é exatamente o problema do `STATE.md`.
- **Sem worktree por teammate.** Todos editam o mesmo diretório. Quebra o "uma issue = uma branch = um PR" (princípios 15 e 20) e o fluxo de push/PR por issue (DEC-2026-11-12-01). Na F1, **10 das 11 sub-issues tocam `internal/archtest`**: no mesmo diretório isso é sobrescrita, não conflito de merge.
- **Exclusivo e experimental** (princípio 8 e DEC-2026-11-10-23): o equivalente aberto já existe — GitHub Issues com "Bloqueada por" faz o papel de task list com dependências.
- No Windows só funciona in-process; `/resume` perde os teammates; teammates herdam o modo de permissão do lead (com auto/bypass não dá para restringir um teammate).
- **Onde poderia servir:** trabalho **sem escrita de código**, que é o que a própria doc recomenda para começar — review de um PR grande por ângulos (segurança, testes, desempenho) ou debug com hipóteses concorrentes. Não é prioridade.

### Subagents — **candidato para um "despachante" de issues, opcional**
- Uma sessão do Claude Code lê `gh issue list` (issues sem bloqueio, label `agent:claude`) e dispara **um subagent em background por issue**, cada um com `isolation: worktree`. Cada um faz branch, implementa, roda o "Como validar", faz push e abre o PR com `Closes #N`, e devolve só o link e o resultado. O GitHub continua sendo a única fonte de estado.
- Contexto mínimo (princípios 1–3): o subagent carrega o mesmo `AGENTS.md` de uma sessão normal, e a sessão principal só recebe resumos.
- Roteamento (Fase 3): `model: sonnet` ou `haiku` por tipo de issue (P → barato, M → Sonnet).
- **Padrão aberto:** o procedimento "executar uma issue" deve ficar numa **skill** (lida por Codex/OpenCode também); a definição do subagent só fixa `model`, `tools`, `isolation` e `skills:` (pré-carregada). Assim o despachante é uma conveniência do Claude, não uma dependência.
- **Riscos a verificar no piloto:**
  - O worktree nasce da **branch padrão**, não do `HEAD` (bom para issues), mas não segue nossa convenção `Projetos\<repo>-<tarefa>`. Conferir onde fica, como a branch é nomeada e se sobrevive com commits (a doc só diz que é limpo "se não houver mudanças").
  - Pedidos de permissão dos subagents em background aparecem na sessão principal; um "allow for the rest of the session" vale também para a principal.
  - WIP limitado pela revisão (princípio 18): disparar no máximo uma onda de issues disjuntas, não o épico inteiro.
  - Os `executor-*` do onchain (`.agents/agents/`) estão congelados pela DEC-2026-11-10-30 e ainda mandam usar a `tlc-spec-driven`. Um subagent novo `executor-issue` é o momento natural de fazer aquela revisão — exige decisão.

### Cross-session messaging — **adotar como complemento, já funciona**
- Encaixa no que fazemos hoje: **uma CLI por worktree** (`xend-onchain-f0-t01`…`t04`). Não muda nada na estrutura; cada sessão continua independente e qualquer uma pode ser Codex/OpenCode.
- Resolve as colisões que as issues já anunciam. Ex.: #174 e #175 combinam que "quem mergear primeiro define `venue.TradeSource`; a outra faz rebase". Com messaging, a sessão da #174 avisa a da #175 no merge. `notify_when_idle` deixa a sessão orquestradora saber quando cada worker parou, sem polling.
- Regra para manter o padrão aberto: **o que precisa durar vai em comentário na issue/PR**; a mensagem é só o "cutucão". Mensagem não fica em lugar nenhum que outro agente (ou colega) veja.
- Segurança: mensagem recebida não aprova permissão nem muda config; sessões em bypass retêm mensagens por padrão (`crossSessionInbound`). Para nomes estáveis, abrir as sessões com `--name <repo>-<issue>`.

## Aplicação ao épico F1 (ondas)
Pelos "Bloqueada por" das issues:
1. **Onda 1 (sem bloqueio):** #169 (tape/msg), #170 (pub), #171 (supervise), #172 (venue/foxbit).
2. **Onda 2:** #173 (← 169, 170), #174 (← 169), #175 (← 169, 172).
3. **Onda 3:** #176 (← 171, 173, 174), #177 (← 171, 173, 175), #178 (← 171, 173).
4. **Onda 4:** #179 (← 176, 177, 178).

Colisão comum: `internal/archtest` em quase todas → conflito de merge previsível; merges em série com rebase. Onda 1 com 4 workers já esbarra na capacidade de revisão de 1 dev.

## Recomendação
1. **Padrão continua sendo sessões independentes por worktree**, uma por issue — agnóstico e igual para Claude, Codex, OpenCode e nuvem.
2. **Cross-session messaging** como complemento imediato (sem config), com o registro durável em comentário de issue.
3. **Piloto de subagents** como despachante opcional, numa onda pequena (ex.: 2 issues da Onda 1 da F1), com o procedimento numa skill `executar-issue`.
4. **Agent teams: não adotar** para execução; reavaliar só para review/pesquisa sem escrita, ou se sair do experimental com worktree por teammate e estado externo.

## Trechos / links úteis
- Teams × subagents: "Use subagents when you need quick, focused workers that report back. Use agent teams when teammates need to share findings, challenge each other, and coordinate on their own." — [agent-teams](https://code.claude.com/docs/en/agent-teams)
- Sem isolamento nos teams: "Two teammates editing the same file leads to overwrites. Break the work so each teammate owns a different set of files." — [agent-teams](https://code.claude.com/docs/en/agent-teams)
- Contexto do subagent: carrega "every level of the CLAUDE.md hierarchy the main conversation loads", incluindo `AGENTS.md` — [sub-agents](https://code.claude.com/docs/en/sub-agents)
- Worktree do subagent ramifica da branch padrão "rather than the parent session's `HEAD`" — [sub-agents](https://code.claude.com/docs/en/sub-agents)
- Messaging: só texto, "never the sender's conversation history or files" — [cross-session-messaging](https://code.claude.com/docs/en/cross-session-messaging)

## Resultado do piloto (12/11, DEC-2026-11-12-07)
Despachante na sessão `xend-onchain-bb`, dois `executor-issue` em paralelo; relatório chegou à sessão `devagent` por cross-session messaging (funcionou de primeira).
- **Entrega:** #169 → PR #180 (`feat/f1-t01-tape-msg`), #170 → PR #181 (`feat/f1-t02-pub`). Ambos com `Closes #N`, comentário na issue, lint/typecheck verdes, `mergeable`. Nenhum merge.
- **Worktrees:** o harness cria **dentro do repo**, em `.claude/worktrees/agent-<id>` (ignorado pelo `.gitignore` via `.claude/`), com branch `worktree-agent-<id>`, travado. Não segue a convenção `Projetos\<repo>-<tarefa>`. Com commits, **não é limpo**: sobram o worktree e a branch `worktree-agent-*`.
- **Permissões:** nenhum prompt na sessão despachante.
- **Falhas da skill (corrigidas na v0.2):** sem `make` no Windows (executores improvisaram `bash apps/mm/scripts/check.sh`); `-race` pulado em silêncio sem CGO; renomear caso de teste existente sem declarar no PR.
- **Conflito previsto:** `internal/archtest/imports_test.go` nos dois PRs (mesma linha da lista `reusable` + teste novo no fim). Trivial; o segundo a mergear faz rebase mantendo os dois lados.
- Pendências: decidir se aceitamos o local do harness (`.claude/worktrees`) ou trocamos a convenção; limpeza pós-merge (`git worktree remove` + apagar `worktree-agent-*`); registrar no `AGENTS.md` do onchain o fallback do `make` no Windows.
