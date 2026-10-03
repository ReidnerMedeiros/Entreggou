# Better Harness Task-Loop Report

## At a Glance

- Loop Effectiveness: 54/100 (changes only after comparable later task outcomes)
- Asset Health / Repair Progress: 0/100 (0 verified, 0 partial, 4 pending)
- Demonstrated autonomy radius: not observed (not observed; not observed confidence)
- Strongest loop: Not enough evidence difference to name one.
- Largest observed leak: Use the priority moves; no single loop is uniquely weakest.
- Top expected gain: No priority benefit is available in this evidence boundary.

## What You Can Rely On Today

- No reliable user outcome has been demonstrated in this evidence boundary yet.

## What You Gain Next

- No priority Harness move is available in this evidence boundary.



### Why these moves matter

### Quando o npm test do hook falha, o agente não fica sabendo
- Priority: Medium · Evidence: not observed in this boundary
- Reason: Fato: o hook PostToolUse em .claude/settings.json roda `npm test` após cada Edit ou Write. Fato: o Vitest sai com código 1 quando um teste falha. Inferência (contrato de hooks do Claude Code): em PostToolUse, só o código de saída 2 devolve o stderr ao Claude; outros códigos não zero aparecem apenas para o usuário. Consequência: uma edição que quebra um teste segue sem que o agente receba a falha, e a regra do CLAUDE.md de rodar npm test antes de concluir depende só da memória do agente. Dono: .claude/settings.json. Incerteza: o hook foi adicionado no último commit e ainda não houve episódio em que ele disparou com falha.
- Expected Output:
  1. Um hook PostToolUse cuja falha de teste volta para o agente como feedback, confirmado por uma quebra temporária e desfeita.

### npm run lint e npm run dev, pedidos no AGENTS.md, falham com Missing script
- Priority: Medium · Evidence: not observed in this boundary
- Reason: Fato: o AGENTS.md lista `npm run dev` e `npm run lint` como comandos do projeto, e .claude/settings.json libera `Bash(npm run lint)`. Fato: o package.json só define o script `test`, e ESLint não está instalado; rodar os dois comandos nesta revisão terminou em `npm error Missing script`. Consequência: um agente que segue as instruções esbarra num comando inexistente e não tem gate de lint, embora o ESLint esteja na stack aprovada. Dono: package.json e AGENTS.md. Incerteza: a equipe pode ter adiado dev e lint de propósito até existir backend e frontend.
- Expected Output:
  1. Todo comando listado no AGENTS.md roda a partir da raiz, ou está marcado como ainda não disponível.

### O projeto pede Node 22, mas roda em Node 24 sem nenhum aviso
- Priority: Low · Evidence: not observed in this boundary
- Reason: Fato: o AGENTS.md fixa a stack em Node 22. Fato: o package.json não tem `engines` e o repositório não tem .nvmrc; o runtime usado nesta revisão foi Node v24.18.0 e nada sinalizou a diferença. Consequência: agente e equipe podem validar em versões diferentes sem perceber. Dono: package.json. Incerteza: ainda não se observou nenhuma falha causada pela diferença.
- Expected Output:
  1. Um package.json que declara a versão de Node do AGENTS.md e deixa visível quando o runtime local é outro.

### A regra de spec somente leitura não tem nenhum controle de permissão
- Priority: Low · Evidence: not observed in this boundary
- Reason: Fato: o CLAUDE.md diz que docs/specs/ é somente leitura e o AGENTS.md diz para nunca alterá-la sem aviso. Fato: .claude/settings.json tem ask e deny para outras ações, mas nenhuma regra para editar docs/specs/. Consequência: a única barreira contra uma edição da spec, que é a fonte da verdade, é o agente lembrar da instrução. Dono: .claude/settings.json. Incerteza: nenhum episódio da janela tentou editar a spec; isto é uma exigência explícita sem controle, não uma violação observada.
- Expected Output:
  1. Uma tentativa de editar docs/specs/ que pede aprovação antes de acontecer.

## Five Lifecycle Dimensions

| Dimension | What the evidence proves | Evidence boundary | Summary | Boundary / blocker |
| --- | --- | --- | --- | --- |
| Task Understanding | Not observed yet | not observed in this boundary | CLAUDE.md importa o AGENTS.md, a spec 001 é a fonte da verdade e o teste da RN-03 cita a spec; a regra de spec somente leitura ainda é só texto. | not observed |
| Controlled Execution | Not observed yet | not observed in this boundary | npm test roda, mas npm run lint e npm run dev, documentados no AGENTS.md, falham com Missing script, e a versão do Node não está fixada. | not observed |
| Change Validation | Not observed yet | not observed in this boundary | Há um teste focado da RN-03 que passa (6 testes), mas o hook pós-edição não devolve a falha ao agente e nenhum episódio ligou a validação final à mudança revisada. | not observed |
| Reliable Delivery | Not observed yet | not observed in this boundary | O repositório não tem remoto nem CI; a aceitação além do teste local não foi observada. | not observed |
| Learning Capture | Not observed yet | not observed in this boundary | A skill teste-de-regra foi invocada uma vez; a janela de um dia não mostrou trabalho repetido entre episódios distintos nem uma comparação posterior. | not observed |

## The 15 Small Checks

| Dimension | Small check | What the evidence proves | Evidence boundary |
| --- | --- | --- | --- |


## Evidence and Boundaries

- Episode coverage: 0 episodes, 0 edited, 0 closed, 0 repaired-and-passed
- Model: agent-work-loop-v4
- Session selection: not observed; 0 sessions analyzed of 0 eligible sessions; not observed confidence
- Delivery grades observed: not observed
- Source gaps: not observed
- Learning comparison: Not observed; 0 declared intervention(s)
