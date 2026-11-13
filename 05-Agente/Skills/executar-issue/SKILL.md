---
name: executar-issue
description: Executa uma GitHub Issue de agente (label agent-task) de ponta a ponta — confere bloqueios, implementa só o escopo, roda o "Como validar", faz push, abre o PR com "Closes #N" e para esperando revisão. Use quando pedirem para executar, implementar ou pegar uma issue (#N), ou quando um despachante delegar uma issue.
---

# Executar issue

Uma issue = uma branch = um PR. O estado vive no GitHub; não crie arquivos de estado no repo.

## 1. Ler e conferir
1. `gh issue view <N> --json number,title,body,state,labels`. Se fechada, pare e reporte.
2. Para cada "Bloqueada por: #M", `gh issue view <M> --json state`. Se alguma estiver aberta, **pare** e reporte "bloqueada por #M".
3. Confira se já existe PR ou branch: `gh pr list --search "<N> in:body" --state open`. Se existir, pare e reporte.

## 2. Ambiente
- Se você já está num worktree isolado (criado pelo harness ou pelo humano), use-o. Não crie outro. No Claude Code, o do subagent fica em `.claude/worktrees/agent-<id>` dentro do repo (aceito, DEC-2026-11-12-08).
- Senão, siga o `AGENTS.md` do portfólio: worktree irmão `Projetos\<repo>-<slug>` a partir de `origin/<branch padrão>` atualizada.
- Branch: `<tipo>/<id-curto>-<slug>` (ex.: `feat/f1-t01-tape-msg`). Tipo de Conventional Commits. Num worktree do harness (branch `worktree-agent-*`), crie a sua com `git switch -c` e informe as duas no relatório.

## 3. Implementar
- Só o que está em **Escopo**. **Fora de escopo** e **Restrições** são limites duros.
- Se o escopo se mostrar errado ou maior que a issue, pare e reporte em vez de ampliar.
- Leia o `AGENTS.md` do repo e do app tocado; siga os comandos de lá.

## 4. Validar
- Rode exatamente os comandos de **Como validar** e confira cada **Critério de aceite**.
- Ferramenta do comando ausente (ex.: `make` no Windows): rode o que o alvo executa (leia o `Makefile`/script) e **declare a troca no PR**.
- Etapa pulada localmente (ex.: `-race` sem CGO, só com WARNING): **declare no PR** qual job da CI a cobre. Pulo silencioso conta como não validado.
- Qualquer mudança em teste ou fixture existente (inclusive renomear um caso) vai listada no PR, com o motivo.
- Falhou e não dá para corrigir dentro do escopo → não faça push; reporte o erro com a saída.

## 5. Entregar
1. Commits em Conventional Commits; revise o diff antes (`git diff --stat`, sem arquivos fora do escopo).
2. `git push -u origin <branch>`.
3. `gh pr create` com título igual ao da issue, corpo com resumo, checklist dos critérios marcados, saída resumida da validação e `Closes #<N>`.
4. Comente na issue o link do PR e qualquer informação que outra issue precise (ex.: assinatura de interface definida). **Comentário é o registro durável**; mensagem entre sessões é só aviso.
5. **Pare.** Não faça merge nem push na branch padrão.

## 6. Depois do merge (quem despachou ou o humano)
Com o PR mergeado (`gh pr view <PR> --json state` = `MERGED`), a partir do checkout principal:
`git worktree remove <caminho>` · `git branch -D <branch-da-issue> worktree-agent-<id>` (se existir) · `git worktree prune`. *(DEC-2026-11-12-09)*

## Relatório final (curto)
```
Issue: #N — <título>
Status: PR aberto | bloqueada | falhou
PR: <url>
Branch / worktree: <branch> · <caminho>
Validação: <comando> → ok | falhou (<resumo>) · trocas/pulos declarados no PR
Testes existentes alterados: <lista ou "nenhum">
Notas para outras issues: <ou "nenhuma">
```
