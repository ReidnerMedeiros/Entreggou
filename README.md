# Entreggou

Sistema de Acompanhamento e Conferência de Entregas: micro-SaaS para pequenos e
médios comércios com entregadores próprios (materiais de construção, autopeças,
ferragens, distribuidoras).

> Pergunta que orienta o produto: **"O que aconteceu com esta entrega?"**

## O problema

Hoje, numa entrega, as informações ficam espalhadas entre papel, WhatsApp,
comprovantes de cartão e PIX, dinheiro físico e extratos. O operador não sabe de
imediato:

- qual entrega ainda está fora da loja;
- com qual entregador ela está;
- se já foi concluída;
- como foi paga;
- onde está o comprovante.

A conferência acaba dependendo de reconstruir a história depois que o entregador
volta.

O Entreggou centraliza o ciclo da entrega numa única tela:

**PENDENTE → EM_ANDAMENTO → CONCLUÍDA**

Para cada entrega, o sistema registra o horário e o responsável por cada passo,
além da forma de pagamento, do valor recebido e dos comprovantes. Ele não é um
ERP, nem um sistema financeiro, nem uma plataforma de logística: o recebimento é
só declarado pelo entregador, sem validação bancária.

## Estado atual

| Feature | Spec | Situação |
|---------|------|----------|
| 001 Cadastro de entregadores | [docs/specs/001-cadastro-de-entregadores.md](docs/specs/001-cadastro-de-entregadores.md) | Implementada ([plano](docs/specs/001-plano.md)) |
| Login, entregas, recebimento e comprovantes | especificação base do MVP | Próximas features |

Na feature 001, o operador:

- cadastra entregadores (nome, usuário e senha inicial);
- lista os entregadores, com filtro ATIVO/INATIVO;
- edita o nome;
- inativa e ativa;
- redefine a senha.

## Stack

- **Linguagem:** JavaScript, Node 22.
  - O desenvolvimento foi feito no Node 24; veja o [diário](docs/harness/diario-001.md).
- **Backend:** Express e PostgreSQL.
- **Frontend:** React com Vite.
- **Testes e lint:** Vitest e ESLint.

## Como rodar

Todos os comandos rodam da raiz do repositório.

```bash
npm install          # dependências (ficam só em node_modules/)
npm test             # testes: não precisam de banco
npm run lint         # ESLint

npm run db:install   # 1a vez: baixa o PostgreSQL portátil para .pg/ (Windows)
npm run db:start     # sobe o PostgreSQL em localhost:5433 e aplica o schema
npm run dev          # API em localhost:3000 e telas em http://localhost:5173
npm run db:stop      # para o PostgreSQL
```

O PostgreSQL portátil não instala nada no Windows: fica todo em `.pg/`, que está
fora do Git. Fora do Windows, ou com um PostgreSQL próprio:

1. defina `DATABASE_URL`, por exemplo
   `postgres://usuario:senha@localhost:5432/entreggou`;
2. aplique [backend/src/infrastructure/schema.sql](backend/src/infrastructure/schema.sql).

## Estrutura

```
backend/
  src/
    domain/           regras puras (validações da spec)
    application/      casos de uso
    infrastructure/   PostgreSQL, schema e hash de senha
    presentation/     rotas Express e servidor
  tests/              Vitest: critérios de aceite, regras e API
frontend/             telas do operador (React + Vite)
scripts/              dev (API + Vite) e PostgreSQL portátil
docs/
  specs/              specs (fonte da verdade) e planos de tarefas
  harness/            diário do agente, evidências e relatórios do harness
.claude/              permissões, hook e skill do Claude Code
AGENTS.md             instruções para agentes de IA
CLAUDE.md             instruções específicas do Claude Code
```

As camadas externas dependem das internas, nunca o contrário. O `domain` não
depende de nenhuma outra camada.

## Como o projeto é desenvolvido

O desenvolvimento é assistido por agentes de IA e segue o ciclo:

**especificar → planejar → implementar → verificar → atualizar a spec**

- A spec em `docs/specs/` é a fonte da verdade.
- Cada feature ganha um plano de tarefas revisado pela equipe antes do código.
- Cada critério de aceite vira um teste automatizado.
- O harness do agente fica em [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md) e
  [.claude/](.claude/).
- O registro do processo fica em [docs/harness/](docs/harness/).

## Equipe

Projeto da disciplina ESW442 (Técnicas Avançadas de Construção de Software),
prof. Gustavo Martins Lima.

- Julio Cezar Rodrigues Correia
- Marques Vinícius Melo Martins
- Reidner dos Santos Medeiros
- Rian Guedes Rodrigues
