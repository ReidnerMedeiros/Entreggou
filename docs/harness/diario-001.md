# Diário do agente: feature 001

Sessão de 04/10/2026, conduzida por Julio com o Claude Code.

## Nível de autonomia

Nível intermediário: o agente executa, e o humano aprova os pontos de decisão.

- O agente implementou as tarefas do plano em sequência, sem pedir aprovação a
  cada arquivo.
- O plano foi aprovado antes de qualquer código (plan mode, exigido pelo
  CLAUDE.md).
- Commits e push só aconteceram quando a equipe pediu.
- As permissões do .claude/settings.json valeram o tempo todo.

Por quê: a spec e o plano já fixavam o que fazer, e os testes, o lint e o hook
davam retorno a cada passo. As decisões fora da spec ficaram com a equipe.

## Uma vez em que o agente errou

- **Vitest herdando o root do Vite.** Ao criar o vite.config.js com
  root: 'frontend', o agente quebrou o npm test: o Vitest herdou o root e não
  achou mais backend/tests.
  - Mecanismo que pegou: **teste**. O npm test, rodado logo após a mudança e
    também pelo hook PostToolUse, falhou na hora.
  - Correção: test.root no vite.config.js.
- **Teste manual inválido.** Num teste manual com curl, o terminal enviou
  "João" fora de UTF-8 e o banco gravou um caractere de substituição. Com isso,
  a recusa de "JOÃO" passou pelo motivo errado.
  - Mecanismo que pegou: **nenhum automático**. O agente só percebeu ao
    conferir os bytes gravados.
  - Correção: refez o teste com escapes Unicode no JSON.

## Uma vez em que o agente perguntou antes de assumir

Antes de planejar, o agente parou e perguntou à equipe:

- o PostgreSQL não estava no PATH e não havia Docker nem WSL;
- o Node instalado era o 24, mas o AGENTS.md pede o 22.

A equipe decidiu baixar o PostgreSQL portátil, sem instalar nada no Windows, e
seguir com o Node 24, registrando a divergência. Depois, com a porta 5432
ocupada por um PostgreSQL instalado como serviço, o agente não mexeu nele e o
portátil passou a usar a 5433.

## O que mudaríamos no harness

- **AGENTS.md: já mudamos.** Entraram os comandos db:install, db:start e
  db:stop e o aviso de DATABASE_URL. Sem eles, quem clona não sobe o banco.
  Commit: https://github.com/ReidnerMedeiros/Entreggou/commit/b72642dc1dbdd8883a8bb3faee3ba713f41a0f55
- **Versão do Node.** Decidir entre fixar o Node 24 no AGENTS.md ou instalar o
  22 nas máquinas da equipe.
- **Permissões.** A regra deny de "rm -rf" bloqueou a limpeza da pasta dist/.
  Manter a regra: o próprio vite build já limpa a pasta (emptyOutDir).
- **Skill teste-de-regra.** Citar o repositório em memória
  (backend/tests/repositorio-em-memoria.js), para que os testes de regra não
  dependam do banco.

## Critérios não atendidos

Nenhum: CA-01, CA-02 e CA-03 têm teste e passam. Ficaram fora, por decisão da
spec, a RN-04, a RN-05 e a RN-08 (D-25).
