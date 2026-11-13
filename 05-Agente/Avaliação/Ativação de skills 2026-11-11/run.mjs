// Runner do teste de ativação: uma execução limpa de `claude -p` por prompt; só observa a chamada da skill.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
const [,, tsv, out, cfg, cwd, model = 'sonnet', extra = ''] = process.argv;
const rows = readFileSync(tsv, 'utf8').trim().split('\n').slice(1).map(l => { const [id, skill, grupo, ...p] = l.split('\t'); return { id, skill, grupo, prompt: p.join('\t') }; });
const run = r => new Promise(res => {
  const args = ['-p', r.prompt, '--output-format', 'stream-json', '--verbose', '--model', model, '--max-turns', '3',
    '--no-session-persistence', '--disallowedTools', 'Write,Edit,NotebookEdit,Bash,PowerShell,Agent'];
  if (extra) args.push('--append-system-prompt', extra);
  const p = spawn('bash', ['-c', 'claude "$@"', '_', ...args], { cwd, env: { ...process.env, CLAUDE_CONFIG_DIR: cfg }, stdio: ['ignore', 'pipe', 'pipe'] });
  let buf = ''; p.stdout.on('data', d => buf += d); p.stderr.on('data', () => {});
  p.on('close', () => {
    const tools = []; let cost = 0;
    for (const l of buf.split('\n')) { try { const j = JSON.parse(l);
      if (j.type === 'assistant') for (const c of j.message.content) if (c.type === 'tool_use') tools.push(c.name === 'Skill' ? 'Skill:' + (c.input.skill ?? c.input.command) : c.name);
      if (j.type === 'result') cost = j.total_cost_usd ?? 0; } catch {} }
    const skills = tools.filter(t => t.startsWith('Skill:')).map(t => t.slice(6));
    res({ ...r, tools, skills, ativou: skills.includes(r.skill), qualquer: skills.length > 0, cost, vazio: buf.length === 0 });
  });
});
const results = []; const q = [...rows];
await Promise.all(Array.from({ length: 4 }, async () => { while (q.length) results.push(await run(q.shift())); }));
results.sort((a, b) => a.id.localeCompare(b.id));
writeFileSync(out, JSON.stringify(results, null, 1));
for (const r of results) console.log(r.id, r.grupo.padEnd(9), r.ativou ? 'ATIVOU' : (r.qualquer ? 'OUTRA ' + r.skills : '-'), '|', r.tools.join(','), r.vazio ? 'VAZIO' : '');
