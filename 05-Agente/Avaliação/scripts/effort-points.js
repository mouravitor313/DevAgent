#!/usr/bin/env node
// Custo por effort point (DEC-2026-11-13-01/02).
// 1 effort point = 1 PR mergeado de autoria do usuário do `gh`.
// Custo = custo equivalente de API, somado do `usage` dos transcripts locais do Claude Code.
//
// Uso:
//   node effort-points.js                      # últimos 7 dias (até ontem, inclusive)
//   node effort-points.js --since 2026-10-14 --until 2026-11-12
//   node effort-points.js --append             # grava a linha em "Custo por effort point.md"
//
// Requer: node, gh autenticado. Só lê ~/.claude/projects e os repos em ~/Projetos.

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

// US$ por 1M tokens: [input, output, cache write 5m, cache write 1h, cache read].
// Fonte: skill claude-api (tabela em cache de 2026-10-06). Cache write = 1,25x (5m) e 2x (1h) do input.
// Haiku 5.5: cache read estimado em 0,1x do input (não confirmado).
const PRICES = {
  'claude-opus-5-5': [4, 20, 5, 8, 0.2],
  'claude-sonnet-5-5': [2, 10, 2.5, 4, 0.2],
  'claude-haiku-5-5': [0.1, 0.5, 0.125, 0.2, 0.01],
  'claude-fable-5-1': [10, 50, 12.5, 20, 0.25],
  'claude-fable-5': [10, 50, 12.5, 20, 1],
};

const HOME = os.homedir();
const TRANSCRIPTS = path.join(HOME, '.claude', 'projects');
const PROJETOS = path.join(HOME, 'Projetos');
const NOTE = path.join(__dirname, '..', 'Custo por effort point.md');
const MARKER = '<!-- effort-points:fim-do-historico -->';

function parseArgs() {
  const a = process.argv.slice(2);
  const get = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : undefined; };
  const day = (d) => d.toISOString().slice(0, 10);
  const today = new Date(day(new Date()));
  const until = get('--until') || day(new Date(today - 864e5));
  const since = get('--since') || day(new Date(new Date(until) - 6 * 864e5));
  return { since, until, append: a.includes('--append') };
}

// Pasta de transcript -> repo local. "C--Users-Pedro-Projetos-xend-onchain-apps-mm--claude-worktrees-x"
// vira "xend-onchain-apps-mm" e casa com o prefixo mais longo que é uma pasta em ~/Projetos.
const localRepos = fs.existsSync(PROJETOS)
  ? fs.readdirSync(PROJETOS).filter((d) => fs.existsSync(path.join(PROJETOS, d, '.git')))
  : [];
function repoOf(transcriptDir) {
  const m = transcriptDir.replace(/--claude-worktrees-.*/, '').match(/-Projetos-(.+)$/);
  if (!m) return transcriptDir.includes('vitorvalt') ? '(vault)' : '(outros)';
  const name = m[1];
  const hit = localRepos
    .filter((r) => name === r.replace(/[\\/.]/g, '-') || name.startsWith(r.replace(/[\\/.]/g, '-') + '-'))
    .sort((x, y) => y.length - x.length)[0];
  return hit || name;
}

function githubSlug(repo) {
  try {
    const url = execFileSync('git', ['-C', path.join(PROJETOS, repo), 'remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim();
    const m = url.match(/github\.com[:/](.+?)(\.git)?$/);
    return m ? m[1] : null;
  } catch { return null; }
}

function mergedPRs(slug, since, until) {
  const out = execFileSync('gh', ['pr', 'list', '-R', slug, '--state', 'merged', '--limit', '500',
    '--search', `merged:${since}..${until} author:@me`, '--json', 'number', '--jq', 'length'], { encoding: 'utf8' });
  return Number(out.trim());
}

function collectUsage(since, until) {
  const from = new Date(since + 'T00:00:00');
  const to = new Date(until + 'T23:59:59.999');
  const seen = new Set();
  const cost = {}; // repo -> US$
  const byModel = {}; // model -> US$
  const unknown = new Set();
  const walk = (dir, repo) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p, repo);
      else if (e.name.endsWith('.jsonl') && fs.statSync(p).mtime >= from) readFile(p, repo);
    }
  };
  const readFile = (file, repo) => {
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      if (!line.includes('"usage"')) continue;
      let j; try { j = JSON.parse(line); } catch { continue; }
      const m = j.message;
      if (!m || !m.usage || !m.model || m.model === '<synthetic>') continue;
      const ts = new Date(j.timestamp);
      if (ts < from || ts > to) continue;
      const key = `${m.id}|${j.requestId}`;
      if (seen.has(key)) continue; // a mesma resposta aparece uma vez por bloco de conteúdo
      seen.add(key);
      const p = PRICES[m.model];
      if (!p) { unknown.add(m.model); continue; }
      const u = m.usage;
      const cw = u.cache_creation_input_tokens || 0;
      const cw5m = u.cache_creation ? u.cache_creation.ephemeral_5m_input_tokens || 0 : 0;
      const usd = ((u.input_tokens || 0) * p[0] + (u.output_tokens || 0) * p[1]
        + cw5m * p[2] + (cw - cw5m) * p[3] + (u.cache_read_input_tokens || 0) * p[4]) / 1e6;
      cost[repo] = (cost[repo] || 0) + usd;
      byModel[m.model] = (byModel[m.model] || 0) + usd;
    }
  };
  for (const d of fs.readdirSync(TRANSCRIPTS)) walk(path.join(TRANSCRIPTS, d), repoOf(d));
  return { cost, byModel, unknown };
}

function main() {
  const { since, until, append } = parseArgs();
  const { cost, byModel, unknown } = collectUsage(since, until);

  const rows = [];
  for (const [repo, usd] of Object.entries(cost)) {
    const slug = localRepos.includes(repo) ? githubSlug(repo) : null;
    const prs = slug ? mergedPRs(slug, since, until) : 0;
    rows.push({ repo, usd, prs });
  }
  rows.sort((a, b) => b.usd - a.usd);

  const total = rows.reduce((s, r) => s + r.usd, 0);
  const comPR = rows.filter((r) => r.prs > 0);
  const usdComPR = comPR.reduce((s, r) => s + r.usd, 0);
  const prs = comPR.reduce((s, r) => s + r.prs, 0);
  const semPR = total - usdComPR;
  const perPoint = prs ? usdComPR / prs : NaN;
  const f = (x) => x.toFixed(0);
  const pct = (m) => `${f((100 * (byModel[m] || 0)) / (total || 1))}%`;

  console.log(`Período ${since} a ${until} — custo equivalente de API (US$)\n`);
  console.log('repo'.padEnd(28) + 'US$'.padStart(8) + 'PRs'.padStart(6) + 'US$/PR'.padStart(9));
  for (const r of rows) {
    if (r.usd < 0.5) continue;
    console.log(r.repo.padEnd(28) + f(r.usd).padStart(8) + String(r.prs || '—').padStart(6)
      + (r.prs ? f(r.usd / r.prs) : '—').padStart(9));
  }
  console.log(`\nTotal: US$ ${f(total)} | com PR: US$ ${f(usdComPR)} em ${prs} PRs`
    + ` → **US$ ${f(perPoint)} por effort point** | sem PR: US$ ${f(semPR)} (${f((100 * semPR) / (total || 1))}%)`);
  const mix = Object.keys(byModel).sort((a, b) => byModel[b] - byModel[a]).map((m) => `${m.replace('claude-', '')} ${pct(m)}`).join(', ');
  console.log(`Mix por modelo (US$): ${mix}`);
  if (unknown.size) console.log(`AVISO: modelos sem preço, ignorados: ${[...unknown].join(', ')}`);

  if (append) {
    const note = fs.readFileSync(NOTE, 'utf8');
    if (!note.includes(MARKER)) throw new Error(`marcador não encontrado em ${NOTE}`);
    if (note.includes(`| ${since} a ${until} |`)) { console.log('\nLinha do período já existe na nota; nada gravado.'); return; }
    const top = comPR.map((r) => `${r.repo} ${f(r.usd / r.prs)}`).join(' · ');
    const row = `| ${since} a ${until} | ${f(total)} | ${prs} | **${f(perPoint)}** | ${f(semPR)} (${f((100 * semPR) / (total || 1))}%) | ${top} | ${mix} |`;
    fs.writeFileSync(NOTE, note.replace(MARKER, `${row}\n${MARKER}`));
    console.log(`\nLinha gravada em ${NOTE}`);
  }
}

main();
