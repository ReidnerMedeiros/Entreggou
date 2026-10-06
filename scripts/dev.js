// Sobe a API (porta 3000) e o Vite (porta 5173) juntos. Ctrl+C encerra os dois.
import { spawn } from 'node:child_process';

const processos = [
  spawn('node', ['--watch', 'backend/src/presentation/server.js'], { stdio: 'inherit' }),
  spawn('npx', ['vite'], { stdio: 'inherit', shell: true }),
];

for (const p of processos) {
  p.on('exit', (codigo) => {
    for (const outro of processos) outro.kill();
    process.exit(codigo ?? 0);
  });
}
