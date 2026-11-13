---
name: coleta-contexto-repo
description: Coleta, em modo somente leitura e com orçamento de leitura, o contexto de um repositório (stacks, comandos, regras dos arquivos de instrução de agente, divergências e lacunas) e grava um dossiê com citações arquivo:linha. Agnóstica de stack. Use ao preencher ou revisar notas de Stacks, ao mapear um repo para outro agente, ou quando pedirem "dossiê", "coleta de contexto" ou "levantamento" de um repo.
metadata:
  versao: "0.2"
  origem: "DevAgent DEC-2026-11-10-03, DEC-2026-11-10-07"
---

# Coleta de contexto de repo

Você produz **um dossiê por repo**. Você é **somente leitura** no repo: nunca crie, altere ou apague nada nele. A única escrita permitida é o dossiê, no caminho de saída que o pedido indicar.

Por que esta skill existe: coletas anteriores (1) gastaram demais, primeiro lendo arquivos inteiros sem necessidade e depois fazendo **chamadas demais**; (2) pularam um `CLAUDE.md` de app por ler a regra ao pé da letra; (3) deixaram como "não confirmado" algo que uma listagem resolvia. **O que mais custa é o número de chamadas**: cada chamada reenvia todo o contexto. Por isso esta skill pede **poucas chamadas, cada uma fazendo bastante**.

Regra-mãe, em caso de dúvida: *arquivo de instrução de agente sempre se lê; existência sempre se confere, em lote; conteúdo fora da lista não se lê*.

## Ferramentas (nomes do Claude Code; em outro agente use o equivalente)
- **Bash, só leitura**, para listar, conferir existência e contar linhas. Comandos permitidos: `cd`, `ls`, `test -e`/`[ -e ]`, `wc -l`, `echo`, laço `for`. **Proibido** no Bash: ler conteúdo (`cat`, `head`, `tail`, `sed`, `awk`, `grep`), redirecionar para arquivo (`>`, `>>`, `tee`), `rm`, `mv`, `cp`, `mkdir`, `touch`, `git` (qualquer subcomando), gerenciadores de pacote (`npm`, `bun`, `pip`…), `find`.
- **Read** para ler conteúdo (dá os números de linha que você vai citar).
- **Grep** com `-n`, **sempre restrito a um arquivo permitido** (nunca a uma pasta).
- **Não use Glob**: no Windows ele recursa para `node_modules`/`.next` e devolve milhares de entradas.
- **Faça chamadas em paralelo:** quando precisar ler vários arquivos, peça todos os `Read` na mesma rodada.

## Orçamento por repo (regra dura)
| Item | Teto | O que conta |
|---|---|---|
| Rodadas de ferramenta | **meta 10, teto 15** | cada vez que você chama ferramentas (várias chamadas paralelas na mesma rodada = 1 rodada) |
| Arquivos lidos | **20** | cada arquivo aberto com Read, inteiro ou em parte |
| Linhas lidas | **2.000** | soma das linhas lidas |
| Checagens de existência | **3 chamadas** | cada comando de checagem em lote = 1, não importa quantos caminhos ele teste |
| Releitura do mesmo trecho | **0** | anote ao ler; não volte |

**Não contam** no teto de checagens: o inventário (passo 1) e a contagem de linhas (passo 2).
Ao atingir um teto: pare, registre em **Lacunas** o que ficou de fora e por quê ("teto de leitura").

## Passo a passo (copie este checklist e marque)
```
- [ ] 1. Inventário: 1 comando
- [ ] 2. Plano de leitura: 1 comando wc -l
- [ ] 3. Ler instruções de agente + manifests + CI: 1–3 rodadas paralelas
- [ ] 4. Checar existência dos caminhos citados: 1 comando em lote
- [ ] 5. Escrever o dossiê
- [ ] 6. Responder ao chamador (até 10 linhas)
```

### 1. Inventário: um comando só, fora do teto
Num único Bash, a partir da raiz do repo:
```bash
cd "<repo>" && ls -1pA . ; for d in apps packages libs .github/workflows supabase; do [ -d "$d" ] && { echo "== $d/"; ls -1p "$d"; }; done; echo "== instrucoes"; ls -1 */AGENTS.md */CLAUDE.md apps/*/AGENTS.md apps/*/CLAUDE.md packages/*/AGENTS.md packages/*/CLAUDE.md 2>/dev/null
```
Se o repo **não tiver `apps/`**, acrescente no mesmo comando a listagem de manifests de 1º nível:
`ls -1 */package.json */pyproject.toml */requirements*.txt */go.mod */Cargo.toml */docker-compose*.yml 2>/dev/null`.
Esses subdiretórios com manifest são os "apps" do repo. Ignore `node_modules`, `venv`, `.venv`, `dist`, `build`, `.next`, caches.

### 2. Plano de leitura: um `wc -l`
Monte a lista do que vai ler (passos 3a–3c) e conte as linhas de **todos** numa chamada: `wc -l <arq1> <arq2> ...`.
- **≤ 300 linhas:** leia inteiro.
- **> 300 linhas:** um `Grep -n "^#"` no arquivo para ver os títulos; depois leia, numa rodada, só as seções de comandos, regras e stack (até 120 linhas por seção).

### 3. Ler em rodadas paralelas
**3a. Arquivos de instrução de agente: SEMPRE ler.** Isso vale para todo `AGENTS.md` e `CLAUDE.md` que o inventário achou, **na raiz, em cada app e em cada pacote**, como `apps/<app>/CLAUDE.md`. **Não pule** um destes por estar fora da raiz: é neles que ficam as regras que vieram de falhas reais.
- Se um deles só importa outro (`@AGENTS.md`, "leia X"), leia o alvo se for arquivo de instrução; senão, só confira a existência (passo 4).
- `AGENTS.md` e `CLAUDE.md` do mesmo nível com o mesmo número de linhas: leia os dois na mesma rodada e registre "idênticos" ou a diferença.

**3b. Manifests**, na raiz e em cada app (não em pacotes):
- **JS/TS:** `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `nx.json`, `tsconfig*.json`, `deno.json`
- **Python:** `pyproject.toml`, `requirements*.txt`, `setup.cfg`
- **Go:** `go.mod`, `go.work`
- **Outros:** `Cargo.toml`, `Gemfile`, `composer.json`, `pom.xml`, `build.gradle*`
- **Ambiente:** `docker-compose*.yml`, `supabase/config.toml`, `.nvmrc`, `.python-version`, `.tool-versions`

**3c. CI: todo `.github/workflows/*.yml`.** Leia **antes** do passo 4, porque o CI e o deploy são onde mais aparecem caminhos inexistentes.

Ordem sugerida: rodada 1 com 3a + manifests da raiz + CI; rodada 2 com os manifests dos apps; rodada 3 só se algum arquivo > 300 linhas pedir seções.

**Só registre existência (não leia):**
- `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, `opencode.json`, `.mcp.json`;
- outros `.md` de processo na raiz (`HARNESS.md`, `MEMORY.md`, `RUNBOOK*`…);
- configs de lint/format (`biome.json*`, `eslint.config.*`, `.prettierrc*`, `ruff.toml`, `.golangci.yml`);
- `Makefile`, `justfile`, `Dockerfile`, `next.config.*`, `vercel.json`, `vitest*.config.*`, `jest.config.*`.

O inventário já mostra se eles existem; cite-os em Lacunas com o motivo "fora do escopo de leitura".

**Nunca leia:**
- `README*`, código-fonte (`.js`, `.mjs`, `.ts`, `.py`, `.go`…; nem com Grep), lockfiles, `.gitignore`, `node_modules`, `venv`, specs/docs;
- migrations (pode listar);
- `.env*`, chaves, `*.pem`, `.npmrc` (só registre que existem).

### 4. Checar existência dos caminhos citados: em lote
Junte **todos** os caminhos citados nos arquivos lidos: scripts (`node scripts/x.mjs`), workspaces (`packages/*`), pastas de deploy do CI, configs referenciadas, alvos de import de instrução. Confira todos **num único comando**:
```bash
cd "<repo>" && for p in scripts/migrate.mjs packages/jobs supabase/seed.sql docs; do [ -e "$p" ] && echo "EXISTE $p" || echo "NAO-EXISTE $p"; done
```
Para um script de código, basta conferir a existência; **não leia** o conteúdo.
- `EXISTE` → cite como "existe (listagem)".
- `NAO-EXISTE` → é **divergência**, não lacuna.
- "Não confirmado" só é aceito se o teto de 3 chamadas de checagem acabou. Diga isso.

### 5. Escrever o dossiê
Use o formato abaixo. Regras de citação:
- Caminho **relativo à raiz do repo**, com `/`: `apps/web/package.json:12`. Intervalo: `:12-18`.
- O número da linha vem da saída do Read/Grep. **Nunca estime.** Confira se a linha é do **arquivo** que você está citando (erro comum: linha certa, arquivo errado entre `AGENTS.md` e `CLAUDE.md`).
- Toda afirmação tem citação. O que não está nos arquivos lidos vai para **Lacunas**.

### 6. Resposta ao chamador
Até 10 linhas: rodadas de ferramenta, arquivos lidos, linhas lidas (aprox.), chamadas de checagem, se algum teto foi atingido, e dúvidas sobre as regras desta skill.

## O que procurar (checklist de conteúdo)
- **Stacks e versões:** linguagem, runtime, framework, gerenciador de pacotes, banco.
- **Comandos escritos:** build, dev, teste, lint, typecheck, formatação, migração, seed, deploy. Só o que está escrito; se não houver, diga "nenhum declarado".
- **Regras declaradas** nos arquivos de instrução (cada uma com `arquivo:linha`), em especial NUNCA/sempre/proibido.
- **Divergências**, procurando ativamente:
  - mesma ferramenta em versões diferentes entre arquivos (runtime no CI × `engines`/`@types/*`/`.nvmrc`; Python no CI × `requires-python`; Go no CI × `go.mod`; mesma dependência com majors diferentes entre apps);
  - script, workspace, job de CI ou deploy que aponta para caminho **inexistente** (confirmado no passo 4);
  - task de orquestrador (`turbo.json`, `nx.json`) sem script correspondente nos apps, ou script da raiz que chama task inexistente;
  - regra de um arquivo de instrução contradita por outro arquivo ou nível (raiz × app, AGENTS × CLAUDE, instrução × manifest, instrução × CI);
  - `AGENTS.md` e `CLAUDE.md` duplicados com conteúdo divergente;
  - nomes/escopos misturados, pré-releases, pins exatos misturados com ranges.

## Formato do dossiê
```markdown
# Dossiê — <repo>

Rodadas: R · Lidos: N arquivos (~L linhas) · Checagens: C chamadas · Teto atingido: não | sim (<qual>)
Arquivos lidos: <lista curta, caminhos relativos>

## Stacks presentes
- **<Stack>**: <evidência> (`arquivo:linha`)

## Comandos
- <tipo>: `<comando>` (`arquivo:linha`)

## Regras/convenções declaradas
- <regra> (`arquivo:linha`)

## Divergências e inconsistências
1. **<título curto>**: <o quê> (`arquivo:linha` × `arquivo:linha`)

## Lacunas
- <o que não foi confirmado> — motivo: fora do escopo | teto de leitura
```

<example>
Divergência bem escrita:
1. **Deploy de pacote inexistente**: o workflow faz deploy de `packages/worker` (`.github/workflows/deploy.yml:41`), mas a checagem deu `NAO-EXISTE packages/worker`.

Lacuna bem escrita:
- `apps/site/next.config.ts` existe (inventário); não lido — motivo: fora do escopo.

Lacuna mal escrita (evite): "`packages/worker` — não confirmado". Ponha o caminho no lote do passo 4 e registre o resultado.
</example>
