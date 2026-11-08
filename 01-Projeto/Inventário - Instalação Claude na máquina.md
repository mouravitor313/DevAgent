---
tipo: projeto
status: consolidado
tags: [devagent, claude-code, inventário, organização]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[Plano - Migração para agentes no terminal]]", "[[ADR-0002 - Claude Code CLI como ambiente principal]]"]
---
# Inventário — Instalação Claude na máquina

Primeiro passo da centralização do Dev Agent: fotografia de **tudo que o Claude Code tem instalado/configurado** nesta máquina (nível global e por projeto) e uma **proposta** de o que fica, o que sai e o que precisa de revisão. Executa o item "Inventariar Projetos" do [[Plano - Migração para agentes no terminal]].

> Scan feito em 2026-11-08, somente leitura. **Nada foi apagado ou alterado.** Toda coluna "Proposta" é sugestão — a decisão é do Vítor.
> Legenda: ✅ fica · ❌ sai · 🔍 revisar · ➕ falta criar

## 0. Resumo executivo
1. **Os repos ficam em `C:\Users\Pedro\Projetos`**, não em `Projects` como diz o plano. Atualizar o plano (ou decidir renomear).
2. **Não existe `~\.claude\CLAUDE.md` global**, nem `agents/`, `commands/` ou `hooks/` globais.
3. **`Projetos\` tem 65 pastas, mas só 17 repositórios distintos.** O resto são *git worktrees*: 32 do `xend-baas-api`, 24 do `xend-onchain`, 3 do `xend-arb`, 1 do `hedglobal-plataform`.
4. **27 worktrees do baas-api já têm PR mergeado**: são candidatos diretos a sair.
5. ⚠️ **Kit "Everything Claude Code" (ECC) copiado de outra máquina** (`C:\Users\USER`, projeto "comercial-machine") dentro do `.claude\` de 8 repos. Junto com o kit vieram `history.jsonl`, `identity.json` e transcrições de sessões de terceiros. Em **`XEND-RFQ-PORTAL` (1.950 arquivos) e `xend-baas-api` (899 arquivos, incluindo 39 transcrições)** isso está **versionado no git** do repo da empresa.
6. O ECC ativa em cada projeto **12 hooks** (node, rodam a cada edição/comando/fim de sessão) e **13 plugins**. Isso pesa em cada sessão e não foi escolhido por nós.
7. O `settings.json` **global** tem um bloco `autoMode.environment` com regras específicas do xend-onchain e do xend-baas-api. Esse bloco deve ir para o nível de projeto.
8. Espaço em disco: `~\.claude\plugins` = 942 MB (521 MB só do `claude-mem`) e `~\.claude\projects` = 993 MB (transcrições).

## 1. Nível global — `C:\Users\Pedro\.claude\` + `~\.claude.json`

### 1.1 Configuração
| Item | Situação | Proposta |
|---|---|---|
| `CLAUDE.md` global | não existe | ➕ criar (curto: quem sou, idioma, onde fica o vault) |
| `settings.json` → `model: opus`, `effortLevel: medium`, tema, `tui`, `autoUpdatesChannel` | ok | ✅ |
| `settings.json` → `autoMode.environment` | ~40 linhas sobre xend-onchain e xend-baas-api, misturadas | 🔍 mover cada bloco para `.claude/settings.json` do repo dele; no global deixar só o que vale para a org |
| `settings.json` → `autoMode.allow/soft_deny` | regras citam `xend-baas-api`, `xend-arb`, `Server PROD` | 🔍 idem: mover para o projeto (as de PROD podem ficar no global como trava extra) |
| `settings.json` → `additionalDirectories` (vault) | não existe | ➕ previsto no plano |
| `agents/`, `commands/`, `hooks` globais | não existem | ➕ quando houver skills/agentes do Dev Agent |
| `~\.claude.json` → `projects` | 32 entradas, com duplicatas por grafia (`C:/…` vs `C:\…` vs `c:/…`) e 3 entradas de `UNITED-Fema-CreditHub` (pasta não existe mais) | 🔍 limpar entradas mortas (fazer com o Claude fechado) |
| `~\.claude.json.backup`, `.bak-aws-toolkit` | backups de out/2026 | 🔍 manter 1 e apagar o resto depois da limpeza |
| `~\.claude.json.tmp.22272…` | 0 byte, sobra de escrita | ❌ |

### 1.2 MCP servers globais
| Server | Estado na sessão de hoje | Proposta |
|---|---|---|
| `vercel` | conectado | ✅ (usado no baas-api, que faz deploy na Vercel) |
| `clerk` | **falha** (connection closed) | 🔍 corrigir ou mover para o projeto que usa Clerk (hedglobal) |
| `aws-mcp` | **falha** (-32602) | 🔍 usamos AWS? (o onchain faz deploy no Lightsail). Se não, ❌ |
| `sentry` (só em `xend-baas-api`, escopo local) | — | ✅ |
| Conectores claude.ai (Gmail, Drive, Supabase, Docs…) | gerenciados pela conta, não pela máquina | fora do escopo deste inventário |

### 1.3 Plugins (escopo *user* = ativos em todo lugar)
| Plugin | Versão | Proposta |
|---|---|---|
| `vercel-plugin@vercel` | 0.44.0 | ❌ **duplicado** do de baixo (mesma versão) |
| `vercel@claude-plugins-official` | 0.44.0 | ✅ (fica o oficial) |
| `quandora@quandora` | 3.3.3-preview (servidor recomenda 4.3.3) | 🔍 é de trading pessoal → mudar para escopo de projeto (`arb`) ou atualizar |
| `trading-ideas@claude-equity-research-marketplace` | 1.0.1 | 🔍 idem: escopo de projeto (`arb`) |

Plugins em escopo de **projeto**, registrados em `installed_plugins.json`:
- `hedglobal-plataform`: `claude-mem`, `anthropic-essentials`, `anthropic-plugin-dev`, `github-dev`, `ultralytics-dev`, `reflexion`, `tdd`, `sadd`. Vieram do ECC. 🔍
- `arb`: `trading-skills` ✅
- `xend-onchain`: `fullstack-dev-skills`, `golang-skills` 🔍 (o onchain usa Go?)

Marketplaces registrados: 11. Sem nenhum plugin instalado: `ecc` (affaan-m/everything-claude-code). Cache `thedotmack/claude-mem` = **521 MB**. ❌ se o claude-mem sair.

### 1.4 Skills pessoais (`~\.claude\skills\`, 35 pastas)
| Grupo | Pastas | Origem | Proposta |
|---|---|---|---|
| AWS | 24 (`aws-*`, `amazon-bedrock`, `launch-with-aws`, `signing-in-to-aws`) | AWS Toolkit, 28/10 | 🔍 manter só se AWS entrar no fluxo; se não, ❌ (o `aws-mcp` também falha) |
| Finanças/trading | `analyzing-financial-statements`, `creating-financial-models`, `backtesting-trading-strategies` | 22/10 | 🔍 mover para `arb\.claude\skills` (são pessoais, não do Dev Agent) |
| Pesquisa | `research`, `research-add-fields`, `research-add-items`, `research-deep`, `research-report` | 17/09 | ✅ candidatas a virar skills do Dev Agent (ver Radar) |
| Streamlit | `developing-with-streamlit` | 18/09 | 🔍 mover para `dash-mm` (o projeto que usa Streamlit) |
| `learned/` | vazia | — | ❌ |
| `synced/` | gerenciada pela sincronização do claude.ai | — | ✅ não mexer |

### 1.5 Dados de runtime (não é config)
| Item | Tamanho | Proposta |
|---|---|---|
| `projects/` (transcrições + memória por projeto) | 993 MB | ✅ fica, mas veja §1.6 |
| `plugins/` | 942 MB | reduz quando os plugins do ECC saírem |
| `file-history/` | 25 MB | ✅ (limpeza automática) |
| `plans/` | 712 KB, ~40 planos | 🔍 os relevantes viram nota no vault; o resto fica |
| `.credentials.json` | — | ✅ não mexer, nunca versionar |

### 1.6 Pastas de sessão (`~\.claude\projects\`) — 25
**Vivas**, em ordem de atividade: `xend-baas-api` (142 sessões, 102 memórias), `arb` (84 sessões, 20 memórias), `xend-onchain` (44 sessões, 57 memórias), `hedglobal-plataform` (12), `terminal` (8), `xend-onchain-apps-mm` (8), `UNITED-Fema-CreditHub` (4), `DevAgent` (1).

**Órfãs**: o projeto ou a pasta não existe mais. 🔍 Proposta: compactar para `99-Arquivo` fora do `.claude` ou apagar.
- 3 pastas de *scratchpad* em `AppData\Local\Temp` e 1 de `Temp`
- `UNITED-Fema-CreditHub` e o worktree dela (a pasta do projeto sumiu de `Projetos`)
- worktrees avulsos: `XEND-RFQ-PORTAL--claude-worktrees-…`, `xend-baas-api--claude-worktrees-partner-payout-queries`
- só memória, sem sessão: `xendmm`, `xend-arb`, `XEND-RFQ-PORTAL` (10 memórias), `dash-mm`

**Memórias que valem migrar para o vault/AGENTS.md**: as 102 do baas-api e as 57 do onchain são conhecimento de projeto (decisões, bugs de prod, deploy). 🔍 Triagem futura: o que é durável vai para o `AGENTS.md` do repo ou para `04-Conhecimento`.
⚠️ `util/memory/foxbit-ws-credentials`: pelo nome, guarda credenciais. Revisar e remover o segredo.

## 2. Nível projeto — repositórios em `C:\Users\Pedro\Projetos`

### 2.1 Catálogo (17 repos distintos)
| Repo | Remote | Última atividade | Claude config | Proposta |
|---|---|---|---|---|
| **xend-baas-api** | Xend-Exchange | 08/11, **ativo** | ECC (versionado: 899 arq.) · `CLAUDE.md` 6 regras SDD · `AGENTS.md` · `.specs/` · 216 permissões locais | ✅ projeto principal · limpar o ECC (§3) |
| **xend-onchain** | Xend-Exchange | 06/11, **ativo** | ECC (gitignored) · `CLAUDE.md` SDD · `.specs/` | ✅ · limpar o ECC |
| **arb** (arb-research) | mouravitor313 (pessoal) | 23/10, ativo · **73 arq. sujos** | `.claude` próprio (7 cmds, 9 agents, 11 skills) · `PROJECT.md` | ✅ · commitar/organizar o trabalho pendente |
| **terminal** (uterminal) | mouravitor313 (pessoal) | 15/10 · 11 sujos | `CLAUDE.md` → `PROJECT.md` | ✅ |
| **hedglobal-plataform** | Xend-Exchange | 24/10 · PR #113 aberto | ECC (não versionado) + 8 plugins de projeto | ✅ · limpar o ECC |
| **xend-arb** | Xend-Exchange | 04/10 | ECC (gitignored, 35 agents) | 🔍 ainda ativo? |
| **xendmm** | Xend-Exchange | 04/09 | ECC (gitignored) | 🔍 parado desde set |
| **dashboard_xend** | Xend-Exchange | 25/08 | ECC (10 arq. versionados) | 🔍 parado |
| **xend-platform** | Xend-Exchange | 14/04 (commit) | sem ECC · `.mcp.json` (chrome/next devtools, shadcn, trigger) · hooks próprios | 🔍 parado |
| **xend-website** | Xend-Exchange | 24/07 | mínimo | 🔍 parado |
| **dash-mm** (Xend-DashMM) | Xend-Exchange | 24/06 | ECC (gitignored) | 🔍 parado |
| **XEND-RFQ-PORTAL** | Xend-Exchange | 30/06 | ECC **versionado (1.950 arq.)** | 🔍 parado · limpar o ECC do git |
| **xendsend** | Xend-Exchange | 26/05 | nenhuma | 🔍 parado |
| **util** | **sem remote** | 23/07 · 11 sujos | worktrees vazio · `util.zip` (120 MB) solto em `Projetos\` | 🔍 decidir: vira repo ou arquivo |
| **openterminal** | ErTasselli (terceiro) | 06/10 | `launch.json` | 🔍 clone de referência → `03-Pesquisa/Referências` + ❌ local? |
| **seleon-anchor** | Rodrigopaiva44 (terceiro) | 30/08 | nenhuma | 🔍 idem |
| xend-portal-partner-xend | não é git | 08/09 | só `apps/` + `node_modules` | ❌ provável sobra |

Soltos na raiz de `Projetos\`: `util.zip` (120 MB), `full24.log`, `full24b.log`, `*.ids`, `full24b.done`. ❌ ou mover para `util`.

### 2.2 Worktrees
Critério: **sai** se o PR foi mergeado **e** não há commits só locais. Os arquivos sujos (*dirty*) precisam ser conferidos antes de remover com `git worktree remove`.

**xend-baas-api** (base `feat/v0-api-skeleton`, merges por squash)
- ❌ **PR mergeado (27)**: `xend-baas-api` (pasta principal, branch `feat/okx-ws-book-pr2` #166 — só trocar de branch), `deposit-ux` #47, `direct-charge` #165, `dslash` #163, `fyhub-contas` #161, `fyhub-contas2` #162, `fyhub-sandbox` #160, `fyhub-scope` #130, `fyhub-volume` #132 (3 sujos), `local-fonts` #143, `okx-pr3` #173, `pwv` #168, `pwv-docs` #171, `pwv-portal` #170, `pwv-read` #169, `realtime` #153 (3 sujos), `roles` #105, `rte-pr3` #172, `worker` #156, `xend-dz3` #92, `xend-gas-worktree` #71, `xend-ops-gate` #138, `xend-sqla` #94, `.claude/worktrees/partner-payout-queries` #128, `.claude/worktrees/withdrawal-safe-sync` #49
- ❌ detached, sem branch: `xend-baas-api-baseline`, `…/scratchpad/pristine` (em `AppData\Temp`)
- ✅/🔍 **sem PR**: `onramp` (`feat/v1-onramp-pr2a`, **21 commits só locais**, de hoje) · `pwv-b/c/e/g` (lanes, já contidas no #168?) · `t55` (`tmp/…`)

**xend-onchain** (base `origin/main`; ⚠️ último fetch em 03/11, então "só local" pode estar inflado)
- ❌ **mergeado e limpo**: `amm-pool-tabs` #58, `dash-viz` #20, `feed-v2` #110, `iat-pr` #108, `indexd-tickets`
- 🔍 mergeado, mas com arquivos sujos: `brz-brla` (28), `quote-cmp` (**506**)
- ✅ **commits só locais, não remover**: `binance-venue` (55), `exit-agnostic` (47), `brz-exit` (33), `book-onchain` (16, parado desde jul), `signal-bot` (11 + 27 sujos), `zmq-bus-hardening` (3), `zbh-deploy` (1), `iat-a/b/d/w2a/w2b/w2c/w3/t29` (34–58 cada, provavelmente cumulativos; `t29` tem 137 sujos)
- ✅ `zmq-bus` (PR #114 aberto) · 🔍 `massive-ws` (detached)

**xend-arb**: ❌ `doc-01`, `pr36-post37` (mergeados) · 🔍 `pr34-post36` (1 commit só local)
**hedglobal-plataform**: ❌ `hedglobal-clerk-review` (mergeado, 1 arquivo sujo)

## 3. Achado crítico — ECC copiado de outra máquina
**O que é:** o repo [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) v0.1.0, colado **como pasta `.claude\` inteira** em 8 repos. Repos afetados: XEND-RFQ-PORTAL, dash-mm, dashboard_xend, hedglobal-plataform, xend-arb, xend-baas-api, xend-onchain e xendmm (~100 MB cada). A cópia veio de um diretório de config do Claude de outra pessoa/máquina:
- `projects\C--Users-USER-Projects-comercial-machine…`, `…funding-rates-poc`, `…xend` → transcrições de sessões dessa máquina
- `history.jsonl` (40 linhas de prompts), `identity.json` (perfil do usuário de origem), `memory.md`
- `.claude\.mcp.json` com 11–12 servers (`xend-intelligence`, `xend-brain`, `infobip-whatsapp`…). O Claude Code **não lê** `.mcp.json` dentro de `.claude\`, só na raiz do repo, então esses servers estão inertes.

**O que está ativo de fato** (baas-api, onchain, hedglobal, RFQ):
- 12 hooks node: formatação e typecheck pós-edição, quality-gate, lembrete de git push, guarda contra `# noqa`, cost-tracker, session-end/evaluate-session, pre-compact
- 13 plugins habilitados: `claude-mem`, suíte `claude-settings`, `context-engineering-kit`, `everything-claude-code`, `secskills`…
- 54–78 skills e 12–35 agents por repo

**O que é nosso e precisa ficar:** `commands/sdd-phase.md` e `commands/parallel.md` (o `CLAUDE.md` do baas-api e do onchain exige `/sdd-phase`), o fluxo `.specs/`, a skill `fyhub-api` e o hook `pre-edit-noqa-guard` (casa com a regra "NEVER `# noqa`"). 🔍 Separar o que é próprio do que é do kit.

**Riscos:**
1. Transcrições e prompts de terceiros **versionados no GitHub da Xend** (baas-api e RFQ-PORTAL). Podem conter dados internos. Remover do índice exige commit no repo da empresa → decisão do time, não minha.
2. Hooks e plugins não auditados rodam a cada edição: custo de contexto e risco de supply chain.
3. Cada sessão carrega dezenas de skills irrelevantes, o que é ruído na seleção de skills.

**Proposta:** substituir o `.claude\` de cada repo por um mínimo curado: `settings.json` com só os hooks úteis, `commands/` com `sdd-phase` e `parallel`, e as skills próprias. Gitignore de `projects/`, `history.jsonl`, `identity.json`, `sessions/`, `file-history/`. Fazer primeiro no baas-api, via PR.

## 4. Decisões que preciso do Vítor
1. `Projetos` ou `Projects`? (renomear quebra o caminho das sessões salvas; sugiro **manter `Projetos`** e corrigir o plano)
2. Liberar a remoção dos **worktrees mergeados** (27 baas-api + 5 onchain + 3 outros), conferindo os sujos um a um?
3. ECC: limpar **localmente** primeiro (repos onde é gitignored: onchain, xend-arb, dash-mm, xendmm, hedglobal) e abrir **PR** para baas-api e RFQ-PORTAL?
4. Repos parados (xendmm, dashboard_xend, xend-platform, xend-website, dash-mm, RFQ-PORTAL, xendsend): continuam em `Projetos` ou vão para `Projetos\_arquivo`?
5. Skills AWS e o `aws-mcp`: saem?
6. Plugins de trading (`quandora`, `trading-ideas`) e skills financeiras: passam para o escopo do `arb`?

## 5. Execução (2026-11-08)
Decisões em [[ADR-0003 - Organização da instalação Claude na máquina]] e no [[Registro de decisões]]. **xend-baas-api excluído de tudo** (DEC-2026-11-08-07).

| Ação | Resultado |
|---|---|
| D2 Worktrees mergeados | **12 removidos.** onchain: `amm-pool-tabs`, `dash-viz`, `feed-v2`, `iat-pr`, `indexd-tickets`, `massive-ws`, `brz-brla`, `quote-cmp`. xend-arb: `doc-01`, `pr36-post37`. hedglobal: `clerk-review`. RFQ: `.claude/worktrees/youthful-leakey`. Branches mantidos. Os arquivos sujos foram salvos como patch/tgz em `arquivo-claude\2026-11-08\worktrees\`. |
| D3 Kit ECC + commands | **Removido de 7 repos**: onchain, hedglobal, RFQ-PORTAL, dashboard_xend, dash-mm, xendmm, xend-arb. Backup por repo em `arquivo-claude\2026-11-08\ecc\*.tgz` (íntegros). O `.claude\` agora contém só o `settings.local.json` (permissões locais preservadas). ⚠️ **`xend-onchain-binance-venue` pendente**: o job foi interrompido pelo sistema (memória baixa) durante o backup; o `.claude` dele está intacto e o backup parcial foi descartado. |
| D3 Regra `/sdd-phase` | Removida de 9 arquivos `CLAUDE.md`/`AGENTS.md` (onchain, hedglobal, RFQ, xendmm, dash-mm, dashboard_xend); originais em `arquivo-claude\2026-11-08\instrucoes\`. Os worktrees do onchain mantêm a regra até serem atualizados a partir da main. |
| D3 Skills | **117 skills distintas** (138 variantes) em `C:\Users\Pedro\.agents\skills-avaliacao\` + `_catalogo.json`. Inclui cópias das skills próprias do `arb` e do `xend-platform`, que não foram removidas. |
| D6 Trading → arb | `quandora` e `trading-ideas`: desinstalados do escopo user e instalados no escopo project do `arb`. Skills `analyzing-financial-statements`, `creating-financial-models` e `backtesting-trading-strategies` movidas para `arb\.claude\skills\`. |
| Sobras | 5 pastas só com `node_modules` de worktrees removidos foram apagadas. |
| Git a commitar | `XEND-RFQ-PORTAL`: 1.949 deleções (kit versionado). `dashboard_xend`: 10 deleções. Arquivos de instrução modificados em onchain e hedglobal. **Nada foi commitado.** |
| Backups | `C:\Users\Pedro\arquivo-claude\2026-11-08\` (738 MB) |
