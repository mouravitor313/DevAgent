---
tipo: referência
status: em-construção
tags: [devagent, avaliação, skills, sql, nextjs, haiku]
criado: 2026-11-10
atualizado: 2026-11-10
fonte: testes A/B locais (pastas "Skills - supabase-postgres 2026-11-10" e "Skills - agent-browser 2026-11-10")
formato: repo
relacionados: ["[[Avaliação do catálogo skills-avaliacao]]", "[[SQL]]", "[[Next.js]]", "[[Stacks]]"]
---
# Teste de skills - supabase-postgres e agent-browser 2026-11-10

## Resumo
Rodei dois testes A/B (DEC-2026-11-10-10). Nos dois o executor foi o Haiku, que corresponde à camada barata. O braço **A** rodou sem a skill e o **B** carregou o `SKILL.md` do catálogo `skills-avaliacao`. Eu (Opus 5.5) fiz a correção conferindo os achados nos arquivos e nos screenshots. Os testes valem só para o Claude Code; o OpenCode fica pendente.

| skill | veredito | motivo |
|---|---|---|
| `supabase-postgres-best-practices` | **ganho modesto**: segue `em-teste` | mesma cobertura do gabarito; a skill acrescenta citação de regra e 3 achados de índice/schema; custa +10% de tokens |
| `agent-browser` | **ganho claro**: candidata a `adotada` depois do OpenCode | sem a skill, o screenshot de página inteira saiu quebrado e o agente não percebeu; com a skill, saiu completo, com o mesmo custo |

## 1 · supabase-postgres-best-practices
**Tarefa:** revisar, só lendo, as 11 migrations de `XEND-RFQ-PORTAL/supabase/migrations/` (600 linhas). Saídas: [[A - sem skill]] e [[B - com skill]], na pasta `Skills - supabase-postgres 2026-11-10/`.

| métrica | A (sem) | B (com) |
|---|---|---|
| tokens / chamadas / tempo | 99,6k / 15 / 2,6 min | 109,8k / 11 / 2,7 min |
| achados (alta/média/baixa) | 22 (3/8/11) | 18 (2/5/11) |
| gabarito (12 itens) | 12 | 11 (faltou `company_name` vindo do metadata do cliente, `init.sql:80`) |
| achados exclusivos que procedem | checagem `side`×`unit` em `twap_orders`; teto de `suborder_count`; revoke explícito de `anon` (defesa em profundidade) | `status` sobrando no índice parcial `twap_orders_active_idx`; checagem `active ⇒ next_fire_at not null`; PK UUID v4 em tabela interna (discutível) |
| erros | nenhum relevante | 1 referência de arquivo errada (`120000:12-13` em vez de `20260625120000`) |
| rastreabilidade | — | cada achado cita a regra (`security-rls-performance.md` etc.) |

**Gabarito** (montado por mim lendo as 11 migrations):
1. segredo do TWAP em texto puro em `cron.job.command` (`twap_cron.sql:60-75`);
2. `profiles.fee_bps` legível pelo cliente (`init.sql:65`);
3. `is_admin()` sem `(select …)` nas policies;
4. `is_admin(uuid)` permite descobrir quem é admin via RPC;
5. índice duplicado `twap_suborders_parent_idx`;
6. `wallets_user_idx` redundante após o `unique(user_id)`;
7. `touch_updated_at` como `security definer` sem necessidade;
8. e-mail fixo no seed do admin;
9. o cron vira no-op silencioso;
10. `add constraint` com lock forte;
11. grants por coluna quebram `select *`;
12. `company_name` controlado pelo cliente.

**Leitura:** o Haiku sozinho já conhece bem Postgres/RLS, e o repo foi endurecido em revisões anteriores. Revisar código pronto favorece pouco a skill. O valor previsto dela está em **escrever** migrations, quando as regras entram antes do erro. **Próximo teste:** pedir uma migration nova (ex.: corrigir o achado 1 ou o 2) com e sem a skill e comparar com as regras.

> Os achados 1, 2 e 4 são problemas reais do `XEND-RFQ-PORTAL`. Não mexi no repo; tratar como achado da stack [[SQL]].

## 2 · agent-browser
**Tarefa:** verificar `https://xend.exchange`: título/URL, navegação, CTAs, screenshots de desktop (página inteira) e mobile (390×844), e problemas visíveis. Cada braço usou uma sessão isolada (`--session abA`/`abB`) e o CLI `agent-browser` 0.39.4. Saídas em `Skills - agent-browser 2026-11-10/A` e `/B`.

| métrica | A (sem; descobriu os comandos pelo `--help`) | B (com) |
|---|---|---|
| tokens / chamadas / tempo | 77,2k / 17 / 1,7 min | 77,1k / 21 / 1,9 min |
| itens concluídos | 5/5 | 5/5 |
| comandos `agent-browser` / falhas | 25 / 0 | 27 / 0 |
| screenshot de desktop | **quebrado**: as seções após a primeira dobra saíram em branco (conteúdo que só aparece com a rolagem) e o relatório diz "não revisei o conteúdo visual" | **completo** (7190 px): o agente notou as faixas em branco, rolou a página e capturou de novo |
| problema visual achado | botão flutuante de chat sobre a faixa de cotações no mobile (**confirmado** no `A/mobile.png`) | não apontou |
| extras | — | texto possivelmente colado ("banconão", "realda"), que parece artefato do `get text` em trechos com ênfase (não confirmado) |

**Leitura:** o CLI é fácil o bastante para o Haiku descobri-lo pelo `--help`, então a skill não reduz custo. O ganho está no fluxo: snapshot, interação e nova checagem. Foi isso que fez o B checar o próprio artefato. Para o Dev Agent, o screenshot é a evidência do trabalho, e um screenshot quebrado sem aviso é a pior falha possível. **Recomendação:** adotar no Claude Code. Antes de virar `adotada`, testar no OpenCode, como exige a regra das [[Stacks]]. Vale acrescentar ao Contexto da stack [[Next.js]] a regra "conferir o screenshot antes de reportar".

## Próximos passos
- [ ] `supabase-postgres-best-practices`: teste de escrita de migration (com e sem a skill).
- [ ] `agent-browser`: repetir no OpenCode com um modelo gratuito.
- [ ] Levar para os repos os achados 1, 2 e 4 do `XEND-RFQ-PORTAL`, com decisão do Vítor.
