// PostgreSQL portátil em .pg/, sem instalar nada no Windows.
//   node scripts/db.js install   baixa e extrai os binários em .pg/pgsql
//   node scripts/db.js start     cria o cluster (1a vez), sobe o servidor e aplica o schema
//   node scripts/db.js stop      para o servidor
import { spawnSync } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const VERSAO = '17.6-1';
const URL_ZIP = `https://get.enterprisedb.com/postgresql/postgresql-${VERSAO}-windows-x64-binaries.zip`;
const PASTA = '.pg';
const BIN = join(PASTA, 'pgsql', 'bin');
const DADOS = join(PASTA, 'data');
const PORTA = '5433';
const BANCO = 'entreggou';

// O postgres.exe herda a saída do pg_ctl e a mantém aberta; com pipe o
// spawnSync esperaria para sempre. Por isso o pg_ctl roda com saida 'ignore'.
function rodar(programa, args, saida = 'pipe') {
  const r = spawnSync(programa, args, { stdio: ['ignore', saida, saida === 'pipe' ? 'inherit' : saida], encoding: 'utf8' });
  if (r.status !== 0) {
    console.error(`Falhou: ${programa} ${args.join(' ')}`);
    process.exit(1);
  }
  return r.stdout;
}

const pg = (nome) => join(BIN, `${nome}.exe`);

async function instalar() {
  if (existsSync(BIN)) return console.log('PostgreSQL já está em .pg/pgsql');
  mkdirSync(PASTA, { recursive: true });
  const zip = join(PASTA, 'pgsql.zip');
  console.log(`Baixando ${URL_ZIP}`);
  const resposta = await fetch(URL_ZIP);
  if (!resposta.ok) throw new Error(`Download falhou: HTTP ${resposta.status}`);
  await pipeline(Readable.fromWeb(resposta.body), createWriteStream(zip));
  console.log('Extraindo');
  // O tar do Windows (bsdtar) abre .zip; o tar do Git Bash não.
  rodar(join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe'), ['-xf', zip, '-C', PASTA]);
  rmSync(zip);
  console.log('PostgreSQL extraído em .pg/pgsql');
}

function iniciar() {
  if (!existsSync(BIN)) {
    console.error('Rode antes: npm run db:install');
    process.exit(1);
  }
  if (!existsSync(DADOS)) {
    // builtin C.UTF-8: lower() trata acentos como o toLowerCase() do JS.
    rodar(pg('initdb'), ['-D', DADOS, '-U', 'postgres', '-A', 'trust', '-E', 'UTF8',
      '--locale-provider=builtin', '--builtin-locale=C.UTF-8']);
  }
  const rodando = spawnSync(pg('pg_ctl'), ['status', '-D', DADOS], { stdio: 'ignore' }).status === 0;
  if (!rodando) {
    rodar(pg('pg_ctl'), ['start', '-D', DADOS, '-l', join(PASTA, 'servidor.log'), '-w', '-o', `-p ${PORTA}`], 'ignore');
  }
  const psql = (args) => rodar(pg('psql'), ['-h', 'localhost', '-p', PORTA, '-U', 'postgres', '-v', 'ON_ERROR_STOP=1', ...args]);
  const existe = psql(['-tAc', `select 1 from pg_database where datname = '${BANCO}'`]).trim();
  if (!existe) psql(['-c', `create database ${BANCO}`]);
  psql(['-d', BANCO, '-q', '-f', join('backend', 'src', 'infrastructure', 'schema.sql')]);
  console.log(`PostgreSQL rodando em localhost:${PORTA}, banco ${BANCO}`);
}

function parar() {
  rodar(pg('pg_ctl'), ['stop', '-D', DADOS, '-w'], 'ignore');
  console.log('PostgreSQL parado');
}

const comandos = { install: instalar, start: iniciar, stop: parar };
const comando = comandos[process.argv[2]];
if (!comando) {
  console.error('Uso: node scripts/db.js install|start|stop');
  process.exit(1);
}
await comando();
