// Stop: se a sessão mudou arquivos do DevAgent e não há nota de sessão de hoje
// em 02-Sessões/, pede ao agente que crie/atualize a nota (uma vez por parada).
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input = {};
  try { input = JSON.parse(raw); } catch {}
  if (input.stop_hook_active) process.exit(0); // evita loop

  const root = path.resolve(__dirname, '..', '..'); // DevAgent/
  let status;
  try {
    status = execSync('git -c core.quotepath=off status --porcelain -- .', { cwd: root, encoding: 'utf8' });
  } catch { process.exit(0); }

  const files = status.split('\n').filter(Boolean).map((l) => l.slice(3).replace(/^"|"$/g, ''));
  const changed = files.filter((f) => !f.includes('02-Sessões/') && !f.includes('.claude/'));
  if (changed.length === 0) process.exit(0);

  const d = new Date();
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  let notes = [];
  try { notes = fs.readdirSync(path.join(root, '02-Sessões')); } catch {}
  if (notes.some((n) => n.startsWith(today))) process.exit(0);

  process.stdout.write(JSON.stringify({
    decision: 'block',
    reason: `Há ${changed.length} arquivo(s) alterado(s) no DevAgent sem nota de sessão de hoje. Crie/atualize 02-Sessões/${today} - <título>.md (template 90-Templates/Sessão.md), conforme AGENTS.md. Se a sessão foi trivial, diga isso em uma linha e pare.`,
  }));
  process.exit(0);
});
