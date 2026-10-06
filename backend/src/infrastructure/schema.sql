-- Spec 001: tabela Entregador. Idempotente: npm run db:start aplica a cada subida.
create table if not exists entregadores (
  id         serial primary key,
  nome       text not null,
  usuario    text not null,
  senha_hash text not null,
  status     text not null check (status in ('ATIVO', 'INATIVO'))
);

-- RN-02: usuário único sem diferenciar maiúsculas de minúsculas.
create unique index if not exists entregadores_usuario_unico on entregadores (lower(usuario));
