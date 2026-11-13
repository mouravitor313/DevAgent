---
tipo: conceito
status: consolidado
tags: [devagent, conceito, filosofia, contexto, skills, github]
criado: 2026-11-10
atualizado: 2026-11-11
relacionados: ["[[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]]", "[[Pesquisa P0 - contexto mínimo, padrões abertos e agentes paralelos]]", "[[Stacks]]", "[[Roadmap]]"]
---
# Filosofia do setup de agentes

> v1 aprovada pelo Vítor em 11/11/2026 (DEC-2026-11-11-01); ADR-0006 `aceita` (DEC-2026-11-11-02).
> A evidência de cada princípio está em [[Pesquisa P0 - contexto mínimo, padrões abertos e agentes paralelos]] (§ indicada entre parênteses).

## Definição curta
O setup existe para que **qualquer agente, de qualquer fornecedor, comece uma task com o mínimo de contexto necessário e termine com um PR pequeno e verificável**. Três pilares: **contexto mínimo**, **padrões abertos** e **trabalho paralelo e independente**. Acima dos três, uma regra: o que precisa valer sempre é garantido por mecanismo, não pedido em texto.

## Por que importa para o Dev Agent
- Contexto custa atenção em toda task, mesmo quando é irrelevante e mesmo com cache. O tamanho sozinho já piora o modelo (§1).
- O time usa Claude Code, Codex e OpenCode, e a Fase 3 quer modelos baratos. Um setup preso a um fornecedor trava o roteamento.
- O gargalo deixou de ser escrever código e passou a ser **revisar** PRs (§3).

## Princípios

### A. Contexto mínimo
1. **O arquivo fixo só traz o que o agente não descobre sozinho.** Entram comandos de build, teste e lint, convenções não óbvias, restrições e o que nunca fazer. Ficam fora visão geral, estrutura de pastas e o que o código ou o README já dizem (§1, ETH; best practices).
2. **Orçamento:** global + portfólio + repo somando **menos de 200 linhas por arquivo** e mirando ~600 palavras no do repo. Linha nova precisa de uma falha real que a justifique (ratchet).
3. **O que é preciso em quase toda task fica fixo, como índice compacto** (1 linha + caminho), e não escondido numa skill. Skill pode não ser ativada: a Vercel mediu 56% de não invocação (§1, contra-argumentos).
4. **Skill é para procedimentos de nicho ou de vários passos:** migrations, deploy, coleta, uma stack específica. Precisa de `description` diretiva ("Use quando…") e de **ativação medida** nos nossos próprios prompts.
5. **Escopo por caminho, não por import.** `@import` não economiza contexto. Regras de uma área só vão para `AGENTS.md` aninhado, regras com `paths:` ou skill (§1, docs de memória).
6. **Nada gerado por LLM entra no contexto fixo sem revisão humana.** O arquivo gerado por LLM custa ~20% a mais e não melhora o resultado (§1, ETH).

### B. Padrões abertos
7. **`AGENTS.md` é a fonte da verdade.** O `CLAUDE.md` contém só `@AGENTS.md` mais o que for exclusivo do Claude. Arquivo duplicado (CLAUDE = AGENTS) diverge com o tempo: vira ponteiro.
8. **Skills só com o núcleo da spec** (`name`, `description`, `scripts/`, `references/`). Campos de extensão de um fornecedor só quando forem indispensáveis, porque os outros os ignoram sem aviso (§2).
9. **Uma pasta canônica de skills, espelhada.** `.agents/skills` é lida por Codex, Cursor, Gemini, VS Code e OpenCode, e o Claude Code lê só `.claude/skills`. Uma é a origem e a outra, espelho gerado (junction ou script; a testar no Windows).
10. **Plugin é formato de distribuição, não de autoria.** Para uso próprio bastam skills e hooks soltos. Plugin de terceiro só entra se trouxer algo sem equivalente aberto, e o índice de skills que ele injeta conta como contexto fixo (§2).
11. **CLI documentado em skill antes de MCP.** MCP entra quando há auth, OAuth ou escopo restrito, ou quando não existe CLI, e sempre com carregamento preguiçoso (*tool search*) (§2).

### C. Garantias determinísticas
12. **O que não pode falhar vira hook, deny ou CI, não ênfase em caixa alta.** Hooks são exclusivos de cada ferramenta, mas os eventos convergiram. Por isso a lógica fica num script neutro (`node script.js`, JSON pela entrada padrão), só a configuração muda por ferramenta, e a regra fica também escrita no `AGENTS.md` como fallback (§2). Isso refina a DEC-2026-11-10-23: aceitar o exclusivo quando ele é a única garantia.
13. **Lint e formatação no CI e em hooks, não em instrução** (§1, Codex).

### D. Trabalho paralelo e independente
14. **Híbrido: spec e decisão em markdown versionado, execução em issue.** Cada fatia executável é uma issue que linka a spec ou o ADR (§3).
15. **Uma issue, um PR pequeno, um módulo.** Se toca mais de ~2 áreas, quebre antes. PR grande é o que não é mesclado (§3, MSR 2026).
16. **Paralelize só o que é disjunto em arquivos e em schema.** Tasks acopladas vão em sequência, no mesmo agente. Escritores paralelos divergem (§3, Cognition).
17. **Critério de aceite executável** (comando ou teste). Se não dá para verificar, a task não está pronta para agente.
18. **WIP de agentes limitado pela capacidade de revisão.** CI verde antes de pedir review; PR que falha volta para o agente.
19. **Segurança, auth, chaves, ledger e migrations em produção ficam com humanos** ou com revisão obrigatória (§3, GitHub).
20. **Ambiente reprodutível por worktree:** `.worktreeinclude`, porta e banco por worktree, setup do agente de nuvem versionado.

## Como aplicar (ordem sugerida)
- **P1 — contexto:**
  - Auditar cada `AGENTS.md`/`CLAUDE.md` com os princípios 1–7. Primeiro alvo: `xend-platform/AGENTS.md`, com 289 linhas.
  - Converter os CLAUDE.md duplicados em ponteiro.
  - Enxugar o índice de skills: hoje são ~280 por sessão, a maioria fora do escopo.
- **P1 — Stacks:** cada stack vira skill (DEC-2026-11-10-29), mas os comandos de build e teste do repo continuam no `AGENTS.md` dele (princípio 3).
- **P1 — medir:** um teste pequeno de ativação das nossas skills (`coleta-contexto-repo`, `registro-de-decisoes`) em Claude Code e OpenCode antes de migrar mais conteúdo para skill.
- **P2 — Issues:** template de issue com os campos abaixo e piloto em um repo com tasks disjuntas.

### Modelo de issue para agentes
1. **Objetivo**: 1–2 frases, comportamento observável.
2. **Contexto**: links para spec, ADR e issue mãe.
3. **Escopo**: arquivos ou módulos prováveis; **fora de escopo** explícito.
4. **Critérios de aceite**: checkboxes verificáveis.
5. **Como validar**: comandos exatos.
6. **Restrições**: não tocar em migrations, auth, chaves ou config de prod.
7. **Dependências e colisão**: "bloqueada por #N"; "toca o módulo Y".
8. **Tamanho** (P/M) e **risco** (alto → humano).
9. **Executor**: label `agent:claude|codex|copilot|opencode|local`.

## Armadilhas
- Mover para skill algo que o agente precisa sempre: ele não carrega a skill e erra calado.
- Medir sucesso pela redução de linhas em vez de pelo resultado das tasks (custo, sucesso, retrabalho; ver Fase 4 do [[Roadmap]]).
- Paralelizar sem capacidade de revisão: mais PRs, revisão mais lenta e a mesma entrega.
- Confiar que um texto no `AGENTS.md` bloqueia ações: não bloqueia.
- Estudos de base em Python/OSS: validar nos nossos repos Go/TS antes de cristalizar números.

## Fontes
- [[Pesquisa P0 - contexto mínimo, padrões abertos e agentes paralelos]] (todas as fontes externas, com link)
- [[ADR-0006 - Contexto mínimo, padrões abertos e tasks paralelas]] · [[Registro de decisões]] (DEC-2026-11-10-22 a 31)
- [[Roteamento de LLMs]] (por que não depender de um fornecedor)
