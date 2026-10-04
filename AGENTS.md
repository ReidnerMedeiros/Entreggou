# AGENTS.md: Sistema de Acompanhamento e Conferência de Entregas

## Como rodar

Todos os comandos rodam da raiz do repositório (há um único package.json).

npm install          # instala as dependências

npm run db:install   # 1a vez: baixa o PostgreSQL portátil para .pg/ (Windows)

npm run db:start     # sobe o PostgreSQL em localhost:5433 e aplica o schema

npm run db:stop      # para o PostgreSQL

npm run dev          # API em localhost:3000 e telas em http://localhost:5173

npm test             # Vitest, passa antes de todo commit

npm run lint         # ESLint

Os testes não precisam do banco. Fora do Windows, ou com outro PostgreSQL,

defina DATABASE_URL e aplique backend/src/infrastructure/schema.sql.

## Stack e versões

JavaScript, Node 22, Express, PostgreSQL, React com Vite, Vitest, ESLint.

Não instale nenhuma biblioteca fora dessa lista sem aprovação da equipe.

## Estrutura de pastas

backend/    API em Node com Express e PostgreSQL

            camadas em backend/src/: domain, application, infrastructure,

            presentation

frontend/   React com Vite

docs/       specs em docs/specs/ e relatórios em docs/harness/

As camadas externas dependem das internas, nunca o contrário. O domain não

depende de nenhuma outra camada.

## Specs

As specs ficam em docs/specs/ e são a fonte da verdade.

Spec atual: docs/specs/001-cadastro-de-entregadores.md.

Plano da spec atual: docs/specs/001-plano.md.

Nunca altere docs/specs/ sem aviso.

## Como você deve trabalhar

- Declare suas suposições. Se o pedido admite duas leituras, pergunte antes

  de escolher uma.

- O mínimo que resolve. Sem abstração de uso único, sem opção que ninguém

  pediu, sem tratar erro que não acontece.

- Toque só no necessário. Mantenha o estilo do arquivo e não refatore código

  que funciona e não faz parte do pedido.

- Diga como vai provar que funcionou, e rode a prova antes de dizer que

  terminou.