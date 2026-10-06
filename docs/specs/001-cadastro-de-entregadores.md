# Spec 001: Cadastro de entregadores

## Objetivo

Permitir que o operador cadastre os entregadores da loja no sistema, para que
o operador possa atribuir cada entrega a um entregador identificado.

Problema que resolve: sem entregadores registrados, o sistema não consegue
responder "com qual entregador está esta entrega?", pergunta central do
acompanhamento (spec base, seções 4 e 12).

Para quem: o operador/gerente de pequenos e médios comércios com entregadores
próprios, que é quem cadastra e distribui as entregas.

## Escopo

Inclui:
- Cadastrar entregador, informando nome, usuário e senha inicial. O sistema
  registra o status no cadastro (RF01; dados mínimos: identificador, nome,
  status).
- Listar entregadores.
- Editar o nome do entregador.
- Inativar e ativar entregador.
- Redefinir a senha do entregador.

Não inclui:
- Excluir entregador
- Folha de pagamento
- Comissão
- Escala
- Jornada
- Controle de combustível
- Documentos e CNH
- Dados trabalhistas

## Atores

Operador:
- Cadastra entregador, digitando o usuário e a senha inicial dele.
- Lista entregadores.
- Edita o nome do entregador.
- Inativa e ativa entregador.
- Redefine a senha do entregador.

Entregador:
- Não executa nenhuma ação nesta feature.

## Dados

Entregador:

| Campo   | Tipo   | Obrigatório | Regra |
|---------|--------|-------------|-------|
| id      | número | Sim         | Identificador único do entregador |
| nome    | texto  | Sim         | De 3 a 80 caracteres |
| usuario | texto  | Sim         | De 3 a 30 caracteres. Aceita letras, números, acentos, espaços e símbolos. Único, sem diferenciar maiúsculas de minúsculas ("Joao" e "joao" são o mesmo usuário; "Joao1" e "Joao2" são diferentes; "João" e "Joao" são diferentes) |
| senha   | texto  | Sim         | De 6 a 72 caracteres, de qualquer tipo |
| status  | texto  | Sim         | ATIVO ou INATIVO |

## Regras de negócio

RN-01  Ao cadastrar um entregador, o sistema define o status ATIVO.
RN-02  O usuário do entregador é único. "Joao" e "joao" contam como o mesmo
       usuário; "João" e "Joao" contam como usuários diferentes.
RN-03  A senha tem de 6 a 72 caracteres, de qualquer tipo, tanto no cadastro
       quanto na redefinição feita pelo operador.
RN-04  Entregador com status INATIVO não pode entrar no sistema.
RN-05  O sistema recusa a inativação de um entregador enquanto ele tiver pelo
       menos uma entrega com status EM_ANDAMENTO. A inativação não altera
       nenhuma entrega.
RN-06  Somente o operador cadastra, lista, edita o nome, inativa, ativa e
       redefine a senha de entregadores.
RN-07  O entregador não altera a própria senha. Somente o operador a redefine.
RN-08  Em qualquer tela em que o operador escolha um entregador para uma
       entrega (criação de entrega e troca de entregador), o sistema não
       exibe entregadores com status INATIVO como opção.
RN-09  A listagem de entregadores exibe por padrão somente os entregadores
       com status ATIVO. O filtro da listagem oferece duas opções, ATIVO e
       INATIVO, e exibe somente os entregadores do status escolhido.
RN-10  O operador pode editar o nome e redefinir a senha de um entregador
       independentemente do status dele (ATIVO ou INATIVO).

## Critérios de aceite

CA-01  Dado que existe um entregador com usuário "joao"
       Quando o operador cadastrar outro entregador com usuário "Joao"
       Então o sistema recusa o cadastro e exibe "ERRO Usuário já cadastrado"
       E o sistema não cria nenhum entregador novo

CA-02  Dado que o operador preenche o cadastro de um entregador com senha de 5 caracteres
       Quando o operador confirmar o cadastro
       Então o sistema recusa o cadastro e exibe "ERRO Senha deve ter de 6 a 72 caracteres"
       E o sistema não cria nenhum entregador novo

CA-03  Dado que não existe entregador com usuário "carlos" e o operador preenche o cadastro com nome "Carlos Silva", usuário "carlos" e senha de 6 caracteres
       Quando o operador confirmar o cadastro
       Então o sistema exibe "Entregador cadastrado com sucesso"
       E o entregador "Carlos Silva" aparece na listagem com status ATIVO

## Exemplos da RN-03 (senha de 6 a 72 caracteres, de qualquer tipo)

| Tipo de caso | Senha informada                 | Resultado |
|--------------|---------------------------------|-----------|
| Feliz        | "abc123xy" (8 caracteres)       | O sistema aceita |
| Feliz        | "abcdef" (6 letras, sem número) | O sistema aceita, pois qualquer tipo de caractere vale |
| Borda        | 6 caracteres                    | O sistema aceita (limite mínimo) |
| Borda        | 72 caracteres                   | O sistema aceita (limite máximo) |
| Erro         | 5 caracteres                    | O sistema recusa e exibe "ERRO Senha deve ter de 6 a 72 caracteres" |
| Erro         | 73 caracteres                   | O sistema recusa e exibe "ERRO Senha deve ter de 6 a 72 caracteres" |

## Restrições

Stack:
- Linguagem: JavaScript
- Backend: Node com Express
- Banco de dados: PostgreSQL
- Frontend: React com Vite
- Testes: Vitest
- Lint: ESLint

Padrões do repositório:
- A spec fica em docs/specs/001-cadastro-de-entregadores.md.
- Instalar: npm install
- Rodar em desenvolvimento: npm run dev
- Testar: npm test
- Lint: npm run lint
- Versão do Node: 22.
- Bibliotecas além da stack acima: o agente não instala nenhuma sem
  aprovação da equipe. Se uma for necessária, o agente avisa a equipe e
  espera a decisão.
- Estrutura de pastas: arquitetura em camadas e arquitetura limpa, com as
  camadas domain, application, infrastructure e presentation.
- Regra de dependência: as camadas externas dependem das internas e nunca o
  contrário. A camada domain não depende de nenhuma outra camada.

## Decisões

D-01  A feature 001 é o cadastro de entregadores (RF01).
      Motivo: decisão da equipe. É uma capacidade pequena e fechada, como a
      Aula 07 pede para a primeira feature.

D-02  A feature inclui listar, editar o nome e inativar/ativar entregador,
      além de cadastrar. A spec base só fala em cadastrar.
      Motivo: decisão da equipe, que quer um CRUD completo do entregador.

D-03  Excluir entregador ficou fora. O entregador só pode ser inativado.
      Motivo: a exclusão se sobrepõe à inativação e poderia deixar entregas
      sem entregador.

D-04  O entregador recebe login (usuário e senha) ao ser cadastrado. O
      operador digita a senha inicial e pode redefini-la depois. O
      entregador não troca a própria senha (RN-07).
      Motivo: decisão da equipe. A spec base prevê o entregador como usuário
      do sistema, mas o RF01 não menciona credenciais.

D-05  A RN-04 (entregador INATIVO não entra no sistema) só define a regra.
      O bloqueio acontece no login, que pertence a outra feature.
      Motivo: a 001 não inclui a tela de login.

D-06  A senha tem de 6 a 72 caracteres, de qualquer tipo, no cadastro e na
      redefinição. Não há exigência de letra, número ou símbolo. O máximo
      de 72 foi sugerido pelo assistente e a equipe confirmou. A mensagem
      de erro é a mesma nos dois momentos.
      Motivo: decisão da equipe. A spec base não define nada sobre senha.

D-07  O usuário tem de 3 a 30 caracteres e aceita letras, números, acentos,
      espaços e símbolos. É único sem diferenciar maiúsculas de minúsculas
      ("Joao" e "joao" são o mesmo usuário), mas acentos diferenciam
      ("João" e "Joao" são diferentes). O tamanho de 3 a 30 foi escolhido
      por padrão.
      Motivo: o tamanho ficou a cargo do assistente. A regra de unicidade é
      decisão da equipe.

D-08  O nome tem de 3 a 80 caracteres, escolhido por padrão.
      Motivo: mesmo padrão do exemplo da Aula 07.

D-09  O id é numérico. O status é ATIVO ou INATIVO. Todo entregador novo
      nasce ATIVO (RN-01).
      Motivo: decisão da equipe. A spec base só diz que existem id e status.

D-10  A inativação é recusada enquanto o entregador tiver entrega
      EM_ANDAMENTO. Nenhuma entrega é cancelada (RN-05).
      Motivo: a spec base não tem o estado CANCELADA, e as RN03 e RN04
      dela fixam as transições. Cancelar mexeria no ciclo da entrega, que é
      outra feature. A RN-05 só pode ser verificada quando existir a
      feature de entregas.

D-11  Em qualquer tela em que o operador escolha um entregador para uma
      entrega, o sistema não exibe entregadores INATIVO (RN-08). Isso cobre
      a criação de entrega e uma eventual troca de entregador. A spec base
      não prevê troca de entregador, e a 001 não cria essa funcionalidade.
      Motivo: decisão da equipe.

D-12  A listagem mostra por padrão só entregadores ATIVO. O filtro oferece
      ATIVO e INATIVO, sem a opção "todos" (RN-09).
      Motivo: decisão da equipe.

D-13  O operador pode editar o nome e redefinir a senha de um entregador
      mesmo com ele INATIVO (RN-10).
      Motivo: decisão da equipe.

D-14  As regras da 001 são novas (RN-01 a RN-10). Nenhuma das RN01 a RN12
      da spec base foi reaproveitada.
      Motivo: elas tratam só do ciclo da entrega, não do cadastro de
      entregadores.

D-15  Os textos de tela são exatos: "ERRO Usuário já cadastrado", "ERRO
      Senha deve ter de 6 a 72 caracteres" e "Entregador cadastrado com
      sucesso".
      Motivo: o critério de aceite só é binário com texto exato.

D-16  A stack é JavaScript, Node com Express, PostgreSQL, React com Vite,
      Vitest e ESLint. Antes era TypeScript, Fastify e SQLite.
      Motivo: preferência da equipe.

D-17  Node 22 e scripts npm padrão (npm install, npm run dev, npm test,
      npm run lint). Escolhidos por padrão.
      Motivo: a spec base não define tecnologias.

D-18  O agente não instala nenhuma biblioteca fora da stack sem aprovação
      da equipe.
      Motivo: manter as dependências no mínimo, como pedem os princípios
      P4 e P5 da spec base.

D-19  A estrutura de pastas segue arquitetura em camadas e arquitetura
      limpa, com as camadas domain, application, infrastructure e
      presentation. As camadas externas dependem das internas e nunca o
      contrário. O domain não depende de nenhuma outra camada.
      Motivo: decisão da equipe. Combina com o RNF03 da spec base.

D-20  O arquivo da spec é docs/specs/001-cadastro-de-entregadores.md.
      Motivo: a 001 passou a ser o cadastro de entregadores.

D-21  Varreduras da Aula 08: vagueza e fuga não tiveram ocorrências. Na
      varredura de ator e quantidade, as frases em voz passiva do Objetivo,
      do Escopo, da RN-01, da RN-05, do CA-01, do CA-02 e da tabela de
      exemplos foram reescritas com "o sistema" ou "o operador" como ator.
      A RN-08 ganhou a indicação das telas (D-11) e a linha de bibliotecas
      virou regra (D-18).
      Motivo: nenhuma ocorrência pode ficar sem decisão.

Decisões tomadas na implementação (plano em docs/specs/001-plano.md). Nenhuma
muda uma regra ou um critério de aceite acima. Elas preenchem lacunas.

D-22  Novas mensagens de erro, no mesmo padrão da D-15: "ERRO Nome deve ter
      de 3 a 80 caracteres", "ERRO Usuário deve ter de 3 a 30 caracteres",
      "ERRO Entregador não encontrado" e "ERRO Status deve ser ATIVO ou
      INATIVO". Campo vazio ou ausente cai na mensagem de tamanho do campo.
      Motivo: a spec não definia essas mensagens.

D-23  O sistema guarda a senha com hash scrypt (node:crypto, sem biblioteca
      nova), no formato "salt:hash". Nenhuma tela nem resposta da API exibe
      a senha ou o hash.
      Motivo: a spec não dizia como guardar a senha.

D-24  Dois entregadores podem ter o mesmo nome. Só o usuário é único (RN-02).
      A listagem é ordenada por nome. O sistema não remove espaços dos
      campos e conta caracteres como o .length do JavaScript.
      Motivo: lacunas da spec, decididas pelo mínimo.

D-25  A 001 não tem login (D-05), então todas as telas são do operador e a
      RN-06 vale por não existir tela para o entregador. RN-04, RN-05 e RN-08
      ficam para as features de login e de entregas (D-05, D-10, D-11).
      Motivo: dependem de features que ainda não existem.

D-26  API: POST /api/entregadores (cadastrar), GET /api/entregadores?status=
      (listar, padrão ATIVO), PATCH /api/entregadores/:id (nome),
      POST /api/entregadores/:id/inativar, POST /api/entregadores/:id/ativar
      e PUT /api/entregadores/:id/senha. Erros respondem { erro } com 400,
      409 (usuário já cadastrado) ou 404 (entregador não encontrado).
      Esquema do banco em backend/src/infrastructure/schema.sql.
      Motivo: a spec não definia rotas nem esquema.

D-27  A unicidade do usuário usa índice único em lower(usuario), com o
      PostgreSQL inicializado com --locale-provider=builtin
      --builtin-locale=C.UTF-8 para que lower() trate acentos como o
      toLowerCase() do JavaScript ("JOÃO" e "João" iguais; "João" e "Joao"
      diferentes).
      Motivo: com o locale C, lower() ignora letras acentuadas.

Se o código fosse apagado agora, esta spec seria suficiente para
reconstruí-lo?

Não por completo. Falta:
- Critérios de aceite para listar, filtrar, editar o nome, inativar e
  ativar, recusar inativação com entrega EM_ANDAMENTO, redefinir senha e
  restringir ações ao operador. Hoje os CA-01 a CA-03 só cobrem o cadastro,
  então as RN-04 a RN-10 não têm critério.
- Mensagem de erro da inativação recusada (RN-05).
- O desenho das telas.

Resolvidos na implementação: mensagens de nome, usuário e campo vazio
(D-22), como a senha é guardada (D-23), nomes repetidos e ordem da listagem
(D-24), rotas da API e esquema do banco (D-26).
