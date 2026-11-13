---
tipo: stack
status: em-construção
tags: [devagent, stack, go]
criado: 2026-11-08
atualizado: 2026-11-10
relacionados: ["[[Stacks]]", "[[Tarefas transversais]]"]
---
# Go

## Contexto
- Comandos de build, teste, lint e formatação: ainda sem padrão, porque só um repo Go existe e o script de checagem dele não foi lido (ver Achados).
- Passe `context.Context` em toda chamada externa (prática padrão de Go, exigida no repo Go do portfólio).

## Skills
| skill | origem | serve para | estado | testado em |
|---|---|---|---|---|
| `golang-skills:go-concurrency` | citada em `xend-onchain/apps/mm/CLAUDE.md:122-124` (instalação não verificada) | concorrência | candidata | — |
| `golang-skills:go-context` | citada em `xend-onchain/apps/mm/CLAUDE.md:122-124` (instalação não verificada) | uso de `context` | candidata | — |
| `golang-skills:go-error-handling` | citada em `xend-onchain/apps/mm/CLAUDE.md:122-124` (instalação não verificada) | tratamento de erros | candidata | — |
| `golang-skills:go-testing` | citada em `xend-onchain/apps/mm/CLAUDE.md:122-124` (instalação não verificada) | testes | candidata | — |
| `golang-skills:go-performance` | citada em `xend-onchain/apps/mm/CLAUDE.md:122-124` (instalação não verificada) | performance | candidata | — |
| `golang-skills:go-code-review` | citada em `xend-onchain/apps/mm/CLAUDE.md:122-124` (instalação não verificada) | revisão de código | candidata | — |

## Documentação
- [Go — documentação](https://go.dev/doc/)
- [Effective Go](https://go.dev/doc/effective_go)
- [pkg.go.dev](https://pkg.go.dev/) · [pacote `testing`](https://pkg.go.dev/testing)
- Dependências do repo: [shopspring/decimal](https://pkg.go.dev/github.com/shopspring/decimal) · [coder/websocket](https://pkg.go.dev/github.com/coder/websocket) · [golang-jwt/jwt v5](https://pkg.go.dev/github.com/golang-jwt/jwt/v5) · [mongo-driver v2](https://pkg.go.dev/go.mongodb.org/mongo-driver/v2)

## MCPs e plugins
| item | origem | serve para | estado | testado em | observações |
|---|---|---|---|---|---|
| Context7 | citado em `xend-onchain/apps/mm/CLAUDE.md:124-125` | APIs de terceiros (com `go doc`) | candidata | — | servidor não verificado no repo |

## Achados
| data | achado | fonte |
|---|---|---|
| 2026-11-08 | Versão de Go diverge: `go.mod` 1.26, Dockerfile `golang:1.27`, README "Go 1.26+" | xend-onchain/apps/mm/go.mod:3; Dockerfile:4; README.md:93 |
| 2026-11-08 | Checagem do app: `make -C apps/mm check` (chama `bash scripts/check.sh`) e `bash apps/mm/deploy/tests/run.sh`; "CI does not run these yet, so run both before every PR". `check.sh` não foi lido, então não se sabe se roda `go vet`/`gofmt`/`go test` | xend-onchain/apps/mm/CLAUDE.md:53-54,57; Makefile:2-3 |
| 2026-11-08 | Nenhum comando `go test`, lint nem formatação documentado nos arquivos lidos | xend-onchain/apps/mm (Lacunas do dossiê) |
| 2026-11-08 | Valores e tamanhos: tipo decimal de ponto fixo, nunca `float64`. Candidata a regra | xend-onchain/apps/mm/CLAUDE.md:117-119 |
| 2026-11-08 | Cada venue é um módulo atrás de uma interface comum. Candidata a convenção | xend-onchain/apps/mm/CLAUDE.md:115-116 |
| 2026-11-08 | Skills `golang-skills:*` (concorrência, context, erros, testes, performance, revisão) e Context7 + `go doc` para APIs de terceiros | xend-onchain/apps/mm/CLAUDE.md:122-125 |
| 2026-11-08 | Dependências diretas: `shopspring/decimal v1.6.0`, `coder/websocket v1.8.14`, `golang-jwt/jwt/v5 v5.3.1`, `mongo-driver/v2 v2.9.0` | xend-onchain/apps/mm/go.mod:5-12 |
| 2026-11-08 | Imagem final `distroless/static:nonroot`; Mongo 7 no compose com portas só em loopback | xend-onchain/apps/mm/Dockerfile:15; docker-compose.yml:12,22,25-26 |
| 2026-11-08 | Guardrails de operação (usar os scripts, nunca improvisar AWS/SSH; conta/região fixas; nunca ler `/opt/indexd/*.env`; nunca `docker stop` no indexd). São de operação, não de linguagem | xend-onchain/apps/mm/CLAUDE.md:19-48 |
| 2026-11-08 | Invariantes de market making: só o bot de ordens coloca/cancela; risco desliga estratégia, nunca o contrário; toda ordem tem correlation ID; sem wash trading/spoofing | xend-onchain/apps/mm/CLAUDE.md:86-106 |
| 2026-11-08 | Bots de market making ainda não implementados; começar com `/sdd-phase Specify`. Itens `[conferir]`/`[completar]` são não verificados | xend-onchain/apps/mm/CLAUDE.md:12-13,83-84 |
| 2026-11-08 | Não lidos: `ONBOARDING.md`, `deploy/README.md`, `docs/architecture-and-decisions.md`, `scripts/check.sh`, `config.example.yaml` | xend-onchain/apps/mm (Lacunas do dossiê) |
| 2026-11-10 | O plugin `golang-skills` 1.8.0 (20 skills `go-*`) está instalado no escopo de projeto do `xend-onchain` (`~/.claude/plugins/installed_plugins.json`); o catálogo `skills-avaliacao` não tem nada de Go | [[Avaliação do catálogo skills-avaliacao]] |
