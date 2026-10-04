# Plano 001: cadastro de entregadores

Plano de tarefas derivado da spec docs/specs/001-cadastro-de-entregadores.md.
Ciclo: especificar, planejar, implementar, verificar, atualizar a spec.
Revisado pela equipe antes de qualquer código (aprovado na sessão com o agente
em 04/10/2026).

## Suposições

As lacunas da spec viraram as decisões D-22 a D-27 na própria spec.

- Sem login na 001: todas as telas são do operador. RN-04, RN-05 e RN-08
  dependem das features de login e de entregas e não são implementadas aqui.
- Senha guardada com hash scrypt do node:crypto, sem biblioteca nova.
- Mesmo nome é permitido, listagem por nome, sem trim, tamanho por .length.
- Usuário único sem diferenciar maiúsculas de minúsculas, com acento
  diferenciando: toLowerCase() no JavaScript e lower() no banco.

## Ambiente

- Node 24 na máquina de desenvolvimento, enquanto o AGENTS.md pede o 22.
  A equipe decidiu seguir com o 24 e registrar (diário).
- Dependências com versão exata (npm install --save-exact) e
  package-lock.json versionado.
- PostgreSQL 17.6 em binários portáteis dentro de .pg/ (ignorado pelo Git),
  sem instalar nada no Windows. Porta 5433, porque a 5432 já estava ocupada
  por um PostgreSQL instalado como serviço.

## Tarefas

Cada tarefa vira um commit, com a mensagem indicada.

| #  | Tarefa | Arquivos principais | Commit | Prova |
|----|--------|---------------------|--------|-------|
| T1 | Dependências, scripts, lint e Vite | package.json, package-lock.json, eslint.config.js, vite.config.js, scripts/dev.js, .gitignore | chore: esqueleto do projeto (spec 001, restrições) | npm run lint; npm test |
| T2 | PostgreSQL portátil e schema | scripts/db.js, backend/src/infrastructure/schema.sql | chore: postgres portátil em .pg/ (spec 001, D-26, D-27) | npm run db:install; npm run db:start duas vezes |
| T3 | Validações do domínio | backend/src/domain/entregador.js | feat(entregador): valida nome, usuário e status (spec 001, D-07, D-08, D-22) | npm test |
| T4 | Casos de uso | backend/src/application/entregadores.js | feat(entregador): casos de uso do cadastro (spec 001, RN-01 a RN-03, RN-09, RN-10) | npm test |
| T5 | Testes dos critérios de aceite | backend/tests/cadastro-entregador.test.js, backend/tests/repositorio-em-memoria.js | test(entregador): CA-01 a CA-03 (spec 001) | npm test |
| T6 | Repositório PostgreSQL e hash de senha | backend/src/infrastructure/banco.js, repositorio-entregadores-pg.js, senha.js | feat(entregador): repositório PostgreSQL e hash de senha (spec 001, D-23, D-27) | roteiro manual abaixo |
| T7 | API | backend/src/presentation/app.js, server.js, backend/tests/api-entregadores.test.js | feat(entregador): rotas da API (spec 001, CA-01 a CA-03, D-26) | npm test |
| T8 | Telas do operador | frontend/index.html, frontend/src/main.jsx, frontend/src/App.jsx | feat(entregador): telas do operador (spec 001, CA-03, RN-09) | npx vite build; npm run dev |
| T9 | Documentação | AGENTS.md, docs/specs/001-plano.md, docs/specs/001-cadastro-de-entregadores.md, docs/harness/diario-001.md | docs: plano, spec, AGENTS e diário da 001 | revisão humana |

## Verificação

1. npm test: CA-01, CA-02 e CA-03 pelos casos de uso e pela API, mais RN-02,
   RN-03, RN-09 e RN-10. Nenhum teste depende do banco.
2. npm run lint sem erros.
3. Roteiro manual contra o PostgreSQL real (npm run db:start, npm run dev):
   - CA-03: cadastrar "Carlos Silva"/"carlos" responde "Entregador
     cadastrado com sucesso" e ele aparece na listagem ATIVO;
   - CA-01: "Joao" com "joao" já cadastrado responde "ERRO Usuário já
     cadastrado";
   - CA-02: senha de 5 caracteres responde "ERRO Senha deve ter de 6 a 72
     caracteres";
   - "João" é aceito ao lado de "joao", e "JOÃO" é recusado;
   - o banco guarda só "salt:hash", nunca a senha.
4. Conferência do PDF: alguém que não conduziu a sessão clona o repositório,
   segue o AGENTS.md e roda o projeto e os testes.
