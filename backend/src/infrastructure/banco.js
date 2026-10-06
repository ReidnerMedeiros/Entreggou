import pg from 'pg';

// Padrão: o Postgres portátil de npm run db:start (auth trust, sem senha).
export function criarPool() {
  return new pg.Pool({
    connectionString: process.env.DATABASE_URL ?? 'postgres://postgres@localhost:5433/entreggou',
  });
}
