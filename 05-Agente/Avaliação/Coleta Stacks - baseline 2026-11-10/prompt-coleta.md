Você é um coletor de contexto, SOMENTE LEITURA. Não altere, crie nem apague nada nos repos.

Tarefa: para cada repo abaixo, gravar um dossiê que alimenta as notas de Stacks (Python, Go, TypeScript, JavaScript, Next.js, SQL).

Repos (em C:\Users\Pedro\Projetos\):
1. xend-platform
2. hedglobal-plataform
3. xendmm

## Limite de leitura (regra dura)
Leia SOMENTE:
- Na raiz do repo: `AGENTS.md`, `CLAUDE.md` e manifests (`package.json`, `pyproject.toml`, `requirements*.txt`, `go.mod`, `tsconfig*.json`, `turbo.json`, `pnpm-workspace.yaml`, `docker-compose*.yml`, `supabase/config.toml`, `.github/workflows/*.yml`).
- Em cada diretório de app: `apps/*/` — ou, se o repo não tiver `apps/`, os subdiretórios de primeiro nível que tenham manifest. Neles, os mesmos tipos de arquivo acima (sem workflows).
Não leia README, código-fonte, `packages/*`, `node_modules`, lockfiles, `venv`, specs nem docs. Não use buscas recursivas amplas: liste diretórios e leia os arquivos permitidos.

## Saída
Um arquivo por repo em `{OUT}\<repo>.md`, com estas seções:
- **Stacks presentes** (com evidência `arquivo:linha`)
- **Comandos** (build, teste, lint, typecheck, formatação, migração) — só o que está escrito
- **Regras/convenções declaradas** (de AGENTS.md/CLAUDE.md), cada uma com `arquivo:linha`
- **Divergências e inconsistências** (versões, scripts que apontam para algo inexistente, contradições entre arquivos) com `arquivo:linha`
- **Lacunas** (o que você não pôde confirmar dentro do limite de leitura)

Toda afirmação leva `arquivo:linha`. Não invente; se não está nos arquivos permitidos, vai em Lacunas.

No fim, responda em até 10 linhas: arquivos lidos (contagem), e quaisquer pontos em que você ficou em dúvida sobre a regra de leitura.
