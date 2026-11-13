# Próximos passos — ordem de execução

Gravado em 2026-11-09 a partir de [[Roadmap]] (seção "Próximos passos (curto prazo)").
Critério: custo de execução (API, tokens, tempo) e fricção (confirmações, restrições de escopo).

1. [x] Limpar plugins órfãos (`hedglobal-plataform`) e cache do `claude-mem` (521 MB). Feito em 2026-11-10: 8 plugins desinstalados, cache de 524 MB apagado, dados em `~\.claude-mem` preservados. → [[2026-11-10 - Limpeza de plugins órfãos do hedglobal]]
2. [ ] Remover o kit ECC do worktree `xend-onchain-binance-venue`. Custo zero. `.claude` intacto; rodar com memória livre.
3. [ ] Commitar/abrir PR das remoções locais (ECC em `XEND-RFQ-PORTAL` e `dashboard_xend`; regra `/sdd-phase`). Custo zero em API; exige confirmação do Vítor antes do PR.
4. [ ] Levantar preço do Qwen3-Coder-Next em APIs de terceiros. Custo baixo (buscas); não usa o pool de modelos. Ver [[Qwen3-Coder-Next]].
5. [ ] Tratar achados das Stacks nos repos (`--no-verify` no README do xend-platform; allowlist Supabase no XEND-RFQ-PORTAL; deploy de `packages/jobs` na CI). Consultar o Registro antes.
6. [x] Avaliar as 117 skills de `~\.agents\skills-avaliacao\`. Feito em 2026-11-10 → [[Avaliação do catálogo skills-avaliacao]]
7. [ ] MCP do Clerk **mantido** (DEC-2026-11-10-01). Só reavaliar após atualizar a CLI (3.3.0 → 4.1.0) ou se o baas-api deixar de usar o Clerk. Condicional.
8. [ ] Testar o harness no OpenCode com modelos gratuitos, começando por [[Tarefas transversais]]. Custo zero em API; consome tempo e tokens.
9. [ ] Limpeza do `xend-baas-api` (27 worktrees, kit ECC, regra `/sdd-phase`, blocos no `autoMode`). Só sem sessões ativas. Consultar o Registro.
10. [ ] Avaliar o teste da Advisor Strategy nas Stacks (DEC-2026-11-08-25) → [[2026-11-08 - Advisor Strategy no preenchimento das Stacks]]. Custo não medido.
11. [x] Apagar pastas vazias `Desenvolvimento/` e `LLM/` na raiz do vault. Executado pelo Vítor (informado em 2026-11-10).
12. [ ] Apagar backups em `C:\Users\Pedro\arquivo-claude\2026-11-08\`. BLOQUEADO pelo prazo: liberar após algumas semanas (a partir de 2026-11-08).
13. [ ] Excluir a skill `tlc-spec-driven` do catálogo `~\.agents\skills-avaliacao\` (DEC-2026-11-10-08 e DEC-2026-11-10-14). Custo zero.
14. [ ] Próxima sessão: o Vítor traz novas direções para os projetos do Dev Agent. Reordenar esta lista a partir delas.
