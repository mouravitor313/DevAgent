---
tipo: stack
status: em-construção
tags: [devagent, stack, nextjs]
criado: 2026-11-08
atualizado: 2026-11-08
relacionados: ["[[Stacks]]", "[[TypeScript]]", "[[Tarefas transversais]]"]
---
# Next.js

## Contexto
- Comandos (prefixo conforme o gerenciador do repo: `npm`, `pnpm` ou `bun`; ver lockfile): dev `next dev` (dois repos usam `next dev --webpack`) · build `next build` · typecheck `tsc --noEmit` · teste `vitest run` (unitário) e `playwright test` (e2e) · lint `eslint` · formatação: sem padrão comum (um repo usa Biome via `bun x ultracite fix`; os demais não têm comando de formatação).
- Versão: a maioria dos repos está em Next 16 + React 19 (App Router). Antes de escrever código Next, leia `node_modules/next/dist/docs/` (regra de dois repos): as convenções do 16 diferem do que o modelo "sabe". No 16, `middleware` virou `proxy` (arquivo `proxy.ts`).
- Lint: ESLint 9 com flat config (`eslint.config.mjs`) e `eslint-config-next` (`core-web-vitals` + `typescript`). Não calar regra com `eslint-disable` (ver AGENTS.md do portfólio).
- Testes: Vitest para unitário (jsdom + Testing Library para componentes); Playwright para e2e, com `webServer` subindo `npm run dev`. Se o `npm test` varrer pastas de agentes (`.claude/`), restrinja `include`/`exclude` do Vitest a `tests/`.
- Estilo: Tailwind v4 (`@tailwindcss/postcss`) + shadcn/ui (`components.json`, aliases `@/components`, `@/lib`). Alias `@/*` no `tsconfig.json`.
- Segredos: nunca no client. Só `NEXT_PUBLIC_*` para valores públicos; lógica com segredo fica em Server Actions/rotas/Edge Functions, com `server-only` nos arquivos que não podem ir ao browser.
- Dinheiro e quantidades: ver [[TypeScript]] (`decimal.js`/BigInt, nunca `number`).
- Autenticação varia por repo: Clerk (`@clerk/nextjs`) ou Supabase SSR (`@supabase/ssr`). Siga o que o repo já usa; não introduza o outro.
- Dev por LAN ou túnel exige declarar as origens em `allowedDevOrigins` no `next.config.ts` (sem commitar IPs ou hosts internos novos sem necessidade).
- Armadilha: `next dev` pode reescrever um bloco no `AGENTS.md`/`CLAUDE.md` do app. Desligue com `agentRules: false` no `next.config.ts` ou não commite o diff gerado.

## Skills
Instaladas no plugin Vercel desta máquina; nenhuma testada ainda.

| skill | origem | serve para | estado | testado em |
|---|---|---|---|---|
| `vercel:nextjs` | plugin Vercel | App Router, rotas, Server Components | candidata | — |
| `vercel:react-best-practices` | plugin Vercel | revisão de React/TSX | candidata | — |
| `vercel:next-cache-components` | plugin Vercel | cache em Next 16 | candidata | — |
| `vercel:shadcn` | plugin Vercel | UI com shadcn/ui | candidata | — |
| `vercel:next-upgrade` | plugin Vercel | atualização de versão | candidata | — |
| `next-best-practices` | `.agents/skills/` do xend-platform | boas práticas de Next | candidata | — |
| `vercel-react-best-practices` | `.agents/skills/` do xend-platform | performance/padrões React | candidata | — |
| `agent-browser` | `.agents/skills/` do xend-platform | automação de browser (verificar UI/e2e) | candidata | — |

## Documentação
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev/)
- [Next.js 16: guia de atualização](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/docs/intro)
- [Supabase: Auth server-side com Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Clerk](https://clerk.com/docs)
- [Sentry para Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

## MCPs e plugins
| item | origem | serve para | estado | testado em | observações |
|---|---|---|---|---|---|
| MCP `vercel` | conector Vercel (configurado) | deploys, logs, projetos | candidata | claude-code | OpenCode: configurar à parte |
| MCP `next-devtools` | `.mcp.json` do xend-platform (`next-devtools-mcp@latest`) | diagnóstico do app Next em dev | candidata | — | habilitado em `enabledMcpjsonServers` |
| MCP `shadcn` | `.mcp.json` do xend-platform (`shadcn@latest mcp`) | buscar/adicionar componentes shadcn | candidata | — | |
| MCP `chrome-devtools` | `.mcp.json` do xend-platform (`chrome-devtools-mcp@latest`) | inspeção de página, console, rede | candidata | — | |
| MCP `context7` | `opencode.json` do dash-mm; allowlist do XEND-RFQ-PORTAL | docs atualizadas de bibliotecas | candidata | — | OpenCode: `@upstash/context7-mcp` |

## Achados
| data | achado | fonte |
|---|---|---|
| 2026-11-08 | Versões divergentes: openterminal em Next 15 (`^15.5.25`); dash-mm no `package.json` em 16.2.7, mas o README diz "Next.js 15" | openterminal/web/package.json:16; dash-mm/package.json:21; dash-mm/README.md:22 |
| 2026-11-08 | Lint: repos Next 16 chamam `eslint` direto; openterminal (Next 15) usa `next lint` e não tem config de ESLint encontrada; hedglobal console não tem lint (o `lint` da raiz roda turbo sem script nos workspaces) | openterminal/web/package.json:9; hedglobal-plataform/package.json:15 |
| 2026-11-08 | Um repo usa Biome/Ultracite em vez de ESLint ("não adicionar configs de eslint/prettier"); Biome 2.4.0 na raiz × 2.2.0 no catalog | xend-platform/AGENTS.md:48; xend-platform/package.json:32,48 |
| 2026-11-08 | Typecheck do app exclui `supabase/functions` (Deno), `e2e` e `playwright.config.ts`; ESLint ignora os mesmos; Edge Functions têm lint separado | XEND-RFQ-PORTAL/tsconfig.json:34; XEND-RFQ-PORTAL/eslint.config.mjs:16-22 |
| 2026-11-08 | Typecheck do dashboard roda `next typegen` antes de `tsc --noEmit` (gera tipos de rota) | xend-onchain/apps/dashboard/package.json (scripts) |
| 2026-11-08 | Regras `react-hooks/refs` e `react-hooks/set-state-in-effect` rebaixadas para `warn`, marcadas como limpeza adiada (candidata a "não rebaixar sem registro") | xend-onchain/apps/dashboard/eslint.config.mjs:8-16 |
| 2026-11-08 | `next dev --webpack` em dois repos; o motivo não está documentado (Turbopack é o padrão do 16) | dash-mm/package.json:6; xend-onchain/apps/dashboard/package.json:6 |
| 2026-11-08 | `transpilePackages` no `next.config.ts` para `@tanstack/react-table` (dash-mm) e pacotes do monorepo (dashboard) | dash-mm/next.config.ts:4; xend-onchain/apps/dashboard/next.config.ts:13 |
| 2026-11-08 | CSP declarada em código no `next.config.ts`, com `'unsafe-eval'` só em dev | XEND-RFQ-PORTAL/next.config.ts:17-30 |
| 2026-11-08 | Prática de um repo: RSC por padrão (`"use client"` só com estado/efeitos/APIs de browser), `server-only` em arquivos privilegiados, Zod nas fronteiras (API, Server Actions, forms), exports nomeados e sem barrel files | xend-platform/AGENTS.md:47-51,76-77 |
| 2026-11-08 | Autorização na camada de dados, não na UI; gate aplicado duas vezes (proxy e rota); recurso fora do escopo e inexistente devolvem o mesmo 404; `HED_AUTH_MODE=local` ignorado em produção | hedglobal-plataform/apps/console/CLAUDE.md:53-70,87-92 |
| 2026-11-08 | Falha real registrada: a tela lia uma pasta de JSON enquanto o formulário gravava no banco, e a operação contratada ficava invisível ao cliente (fixtures só para teste, nunca ligadas à tela) | hedglobal-plataform/apps/console/CLAUDE.md:72-80 |
| 2026-11-08 | Teste pulado é falha: sem `DATABASE_URL` os testes SQL se pulam; testes de banco rodam um arquivo por vez | hedglobal-plataform/README.md:115; hedglobal-plataform/apps/console/vitest.config.ts:9,16 |
| 2026-11-08 | Falha real registrada: o `vitest` varria `.claude/` e `npm test` reportou 73 arquivos com falha; solução escopar a `tests/`. Também: vitest 4 suprime coverage quando algum teste falha | dash-mm/.specs/project/STATE.md:372-382 |
| 2026-11-08 | Vitest em versões diferentes entre repos (3.2.x em hedglobal console e baas portal; 4.1.x em dash-mm e onchain dashboard) | hedglobal-plataform/apps/console/package.json:34; dash-mm/package.json:48; xend-baas-api/apps/portal/package.json; xend-onchain/apps/dashboard/package.json |
| 2026-11-08 | Playwright: `testDir: ./e2e` aponta para pasta inexistente em xend-platform; `webServer` do RFQ sobe `npm run dev` em `/login` | xend-platform/apps/web/playwright.config.ts:4; XEND-RFQ-PORTAL/playwright.config.ts:16-17 |
| 2026-11-08 | Clerk em versões diferentes: `@clerk/nextjs` ^7 (hedglobal console) × ^6 (onchain dashboard, baas portal) | hedglobal-plataform/apps/console/package.json:15; xend-onchain/apps/dashboard/package.json; xend-baas-api/apps/portal/package.json:16 |
| 2026-11-08 | `next dev` reescreve bloco em `AGENTS.md`/`CLAUDE.md`; hedglobal desliga com `agentRules: false`, baas portal avisa para não remover o bloco no diff | hedglobal-plataform/apps/console/next.config.ts:31-35; xend-baas-api/apps/portal/AGENTS.md:7 |
| 2026-11-08 | Build standalone/Docker: `output: "standalone"` no openterminal; console do hedglobal sobe `node apps/console/server.js` na imagem | openterminal/web/next.config.ts:6-8; hedglobal-plataform/apps/console/Dockerfile:57 |
| 2026-11-08 | Node divergente: CI/README em 24 e Dockerfile em 26 (hedglobal); CI em 22 (RFQ, openterminal); sem `engines` na maioria | hedglobal-plataform/README.md:80; hedglobal-plataform/apps/console/Dockerfile:16; XEND-RFQ-PORTAL/.github/workflows/ci.yml:25 |
| 2026-11-08 | Proxy do web para anexar chave de API no servidor (`app/api/[...path]/route.ts`) evita expor a chave ao browser | openterminal/web/next.config.ts:3-5 |
| 2026-11-08 | CI do RFQ: `npm ci`, typecheck, lint, test, build (sequência candidata a "antes do PR") | XEND-RFQ-PORTAL/.github/workflows/ci.yml:29-41 |
| 2026-11-08 | `ui:bump` do xend-platform chama scripts inexistentes (`ui:shadcn:update`/`ui:shadcn:radix`; existem `ui:update`/`ui:radix`) | xend-platform/package.json:18; xend-platform/packages/ui/package.json:10-11 |
