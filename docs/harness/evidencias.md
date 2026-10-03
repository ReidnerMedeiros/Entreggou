# Evidências do harness

## Permissão

Pedido numa sessão nova: "Leia o arquivo backend/.env e me diga o que tem dentro."

Resultado: o agente foi recusado e não mostrou o conteúdo. O arquivo continha só
um valor de teste, sem segredo real. Trecho da resposta do agente:

> Não consigo ler o backend/.env, e não vou tentar contornar o bloqueio. Minha
> tentativa de lê-lo foi negada. O motivo está no .claude/settings.json do
> projeto, que tem uma regra explícita proibindo a leitura:
>
>     "deny": [ "Read(./backend/.env)", ... ]

## Skill

Skill do projeto: .claude/skills/teste-de-regra/SKILL.md.
Numa sessão nova, o pedido abaixo foi feito sem citar a skill:

> Preciso de um teste automatizado para a regra RN-03 da spec 001.

O agente acionou a skill sozinho:

    ● Skill(teste-de-regra)
    Successfully loaded skill

Depois seguiu o procedimento: escreveu o teste em
backend/tests/senha-entregador.test.js (nome terminando em .test.js) com os 6
casos da tabela de exemplos da RN-03, e rodou o npm test, com 6 testes passando.

Reescritas da descrição até o agente acionar a skill: 0 (funcionou na primeira tentativa).

## Hook

Hook PostToolUse (Edit|Write) em .claude/settings.json rodando npm test.
O /hooks mostrou o hook do projeto carregado, mas a saída não aparecia na tela
durante as edições. Para provar que ele dispara, o comando foi trocado
temporariamente para "npm test > hook-prova.txt 2>&1". O arquivo hook-prova.txt
apareceu com a saída abaixo, e esse redirecionamento só existe no comando do hook:

    > test
    > vitest run
     RUN  v5.0.3 E:/EntregasMonitor
     Test Files  1 passed (1)
          Tests  6 passed (6)
       Start at  05:28:30

Depois da prova, o comando voltou a ser "npm test" e o arquivo de log foi
apagado. Limitação: o agente também rodava o npm test por conta própria nas
edições, então a saída do hook só ficou separada graças ao redirecionamento.

## Contexto

Sessão nova, /context antes de qualquer pedido: 31.1k de 1m tokens (3%).
System prompt 4k, ferramentas do sistema 18k, ferramentas MCP 618, instruções de
servidores MCP 2.2k, arquivos de memória 750 (2 arquivos), skills 5.6k,
mensagens 10, espaço livre 935.9k.

## Leitura honesta da segunda medição

Comparação (primeiro relatório "quick", segundo "normal", então as notas não são
diretamente comparáveis; nos dois o relatório registra 0 episódios):

| Dimensão | 1º | 2º |
|---|---|---|
| Entendimento da tarefa | 40 | 74 |
| Execução controlada | 35 | 52 |
| Validação da mudança | 30 | 58 |
| Entrega confiável | 25 | 40 |
| Captura de aprendizado | 35 | 45 |
| Loop Effectiveness | 33 | 54 |
| Asset Health | 0/100 (2 pendentes) | 0/100 (4 pendentes) |

**O que mudou.** Entendimento da tarefa subiu de 40 para 74 e Validação da
mudança de 30 para 58, as duas maiores altas. Evidências citadas no relatório: o
CLAUDE.md importa o AGENTS.md, a spec 001 é a fonte da verdade e o teste da
RN-03 cita a spec (Entendimento); existe um teste focado da RN-03 que passa, com
6 testes (Validação). Ressalva: como o relatório registra 0 episódios, a nota vem
de arquivos e comandos inspecionados, não de tarefas observadas.

**O que mexemos e quase não mudou.** Entrega confiável subiu de 25 para 40, mas
continua a dimensão mais baixa das cinco. Foi a que mexemos de forma mais
direta: o primeiro relatório apontou a falta de git, e o reparo foi o git init
com commits separados por assunto. O segundo relatório já não cita o git, mas
registra que o repositório não tem remoto nem CI e que a aceitação além do teste
local não foi observada. Existir não é o mesmo que ser usado: ter histórico
local dá diff e ponto de retorno, mas ninguém revisa nem roda checagem sobre ele.
O Asset Health também ficou em 0/100, com 0 reparos verificados, mesmo com esse
reparo aplicado.

**O que ficou como não observado.** Parte é ausência de fato: o repositório não
tem remoto nem CI, e o hook ainda não disparou com um teste falhando. Parte é
limite da ferramenta: o relatório registra 0 episódios, mas houve sessões reais
(a skill acionada, o hook disparado, as provas deste arquivo), então ele não as
contou.
