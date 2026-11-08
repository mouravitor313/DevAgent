---
tipo: projeto
status: em-construção
tags: [devagent, decisões, registro]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[Registro de decisões (skill)]]", "[[00 - Index]]"]
---
# Registro de decisões

Índice **append-only** de toda decisão tomada pelo Vítor, em qualquer projeto. Mantido pela skill `registro-de-decisoes` ([[Registro de decisões (skill)]]).
- **Uma linha por decisão.** Decisões estruturais também ganham um ADR, e a linha aponta para ele.
- **Não editar linhas antigas.** Para mudar uma decisão, acrescente uma linha nova e marque a antiga como `substituída por <ID>`.
- **Tipo:** `permanente`, ou `temporária` com a condição de expiração.
- **Consulta:** `grep -i "<repo|termo>"` neste arquivo antes de agir. Só abrir o ADR se a linha não bastar.

| ID | Data | Escopo | Decisão | Tipo | Status | Ref |
|---|---|---|---|---|---|---|
| DEC-2026-11-08-01 | 2026-11-08 | global | Repos ficam em `C:\Users\Pedro\Projetos` (não `Projects`); nada é renomeado | permanente | vigente | [[ADR-0003 - Organização da instalação Claude na máquina]] D1 |
| DEC-2026-11-08-02 | 2026-11-08 | global | Remover worktrees com PR mergeado e sem commits só locais (com backup dos arquivos sujos) | permanente | vigente | ADR-0003 D2 |
| DEC-2026-11-08-03 | 2026-11-08 | repos Xend | Remover o kit ECC **e** os commands próprios (`/sdd-phase`, `/parallel`…); workflow limpo; skills só guardadas em `~\.agents\skills-avaliacao\` para avaliação do Dev Agent | permanente | vigente | ADR-0003 D3 |
| DEC-2026-11-08-04 | 2026-11-08 | global | Repos parados continuam em `Projetos` (sem pasta de arquivo) | permanente | vigente | ADR-0003 D4 |
| DEC-2026-11-08-05 | 2026-11-08 | global | Skills AWS (`~\.claude\skills\aws-*` etc.) e `aws-mcp` ficam | permanente | vigente | ADR-0003 D5 |
| DEC-2026-11-08-06 | 2026-11-08 | arb | Plugins de trading (`quandora`, `trading-ideas`) e skills financeiras passam para o escopo do projeto `arb`; candidato a virar outro agente | permanente | vigente | ADR-0003 D6 |
| DEC-2026-11-08-07 | 2026-11-08 | xend-baas-api | **Não tocar** em nada do `xend-baas-api` (repo, worktrees, `.claude`, regras no settings global) | temporária, até não haver sessões ativas nele | vigente | ADR-0003 R1 · pendência no [[Roadmap]] |
| DEC-2026-11-08-08 | 2026-11-08 | devagent | Toda decisão tomada é registrada aqui (e em ADR se estrutural), para ser recuperada quando necessário, via skill `registro-de-decisoes` | permanente | vigente | ADR-0003 P1 |
| DEC-2026-11-08-09 | 2026-11-08 | xend-baas-api | Canário de validação roda na VPS como 2º serviço Easypanel (`xend-baas-canary`), com Postgres e Redis próprios; nunca o DB de prod | permanente | vigente | plano `validation-env` (2026-11-08) |
| DEC-2026-11-08-10 | 2026-11-08 | xend-baas-api | OKX no ambiente de validação usa demo keys (`OKX_ENV=sandbox`, `x-simulated-trading`); nunca a conta real | permanente | vigente | plano `validation-env` |
| DEC-2026-11-08-11 | 2026-11-08 | xend-baas-api | FyHub é compartilhada com prod (sem chave receptora de teste): canário **nunca** registra webhooks (QRCode nem Contas), valida por polling, R$1 por fluxo | temporária, até existir conta/chave FyHub de teste | vigente | plano `validation-env` |
| DEC-2026-11-08-12 | 2026-11-08 | xend-baas-api | Ambiente de validação entregue fake-first: L0 suíte hermética → L1 compose com sandbox FyHub → L2 CLIs/Playwright/checklists; canário (L3) por último | permanente | vigente | plano `validation-env` |
| DEC-2026-11-08-13 | 2026-11-08 | xend-baas-api | Nova feature SDD `validation-env`, branch `feat/validation-env` cortada de `origin/main` (não de `feat/okx-ws-book-pr2`) | permanente | vigente | `.specs/features/validation-env/` |
| DEC-2026-11-08-14 | 2026-11-08 | xend-baas-api | MCP do Clerk fica registrado só no escopo local deste projeto (HTTP `https://mcp.clerk.com/mcp`, via `claude mcp add -s local`); entrada global (user, stdio `clerk mcp run`) removida porque a ponte da CLI 3.3.0 não faz auth | temporária (sem data definida) | vigente | sessão 2026-11-08; desfazer: `claude mcp remove clerk -s local` |
| DEC-2026-11-08-14 | 2026-11-08 | xend-baas-api | Canário: regras extras de boot além do VE-40 (PARTNER_CALLBACK_URL vazio; LOCAL_TX_BUILD, deposit custody e deposit attribution OFF) e guard de retaguarda nos 3 métodos de webhook dos providers FyHub | permanente | substituída por DEC-2026-11-08-19 (ID duplicado; conteúdo inalterado) | validation-env design.md §7 |
| DEC-2026-11-08-15 | 2026-11-08 | xend-baas-api | Clerk de staging: criar aplicação Clerk separada via CLI/MCP (4 usuários, 2 orgs) para o ambiente de validação | permanente | vigente | validation-env design.md OQ-1 |
| DEC-2026-11-08-16 | 2026-11-08 | xend-baas-api | VPS tem espaço confirmado para Postgres+Redis próprios do canário | permanente | vigente | validation-env OQ-4 |
| DEC-2026-11-08-17 | 2026-11-08 | xend-baas-api | OKX demo keys e chave EVP do canário serão fornecidas depois (API FyHub fora do ar em 2026-11-08); passos dependentes ficam SKIP até lá | temporária, até as credenciais serem entregues | vigente | validation-env OQ-3/OQ-6 |
| DEC-2026-11-08-18 | 2026-11-08 | devagent | Checklist da migração: executar agora só as tarefas baratas; ficam **adiadas** a decisão da rotina do Radar, o teste do repo com 2º agente e o piloto do PoP | temporária, até o Vítor retomar esses itens | vigente | [[Plano - Migração para agentes no terminal]] |
| DEC-2026-11-08-19 | 2026-11-08 | xend-baas-api | Canário: regras extras de boot além do VE-40 (PARTNER_CALLBACK_URL vazio; LOCAL_TX_BUILD, deposit custody e deposit attribution OFF) e guard de retaguarda nos 3 métodos de webhook dos providers FyHub. *Renumeração do 2º DEC-2026-11-08-14 (ID duplicado); decisão inalterada.* | permanente | vigente | validation-env design.md §7 |
