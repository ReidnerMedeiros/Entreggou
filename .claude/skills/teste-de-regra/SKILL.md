---
name: teste-de-regra
description: Escreve o teste automatizado de uma regra de negócio da spec e roda npm test. Use quando pedirem teste para uma regra (RN-NN), para um critério de aceite (CA-NN) ou para uma validação de dados.
---
1. Leia a regra pedida em docs/specs/, junto com os critérios de aceite e a
   tabela de exemplos que se referem a ela. Se a regra não existir na spec,
   pare e avise.
2. Liste os casos a testar: o caso feliz, os casos de borda e os casos de erro,
   com os mesmos valores e mensagens que a spec define.
3. Escreva o teste com Vitest em backend/tests/. O nome do arquivo tem relação
   com a regra ou a funcionalidade que acabou de ser desenvolvida e termina
   em .test.js. Teste o comportamento, sem depender da interface.
4. Rode npm test e mostre a saída completa.
5. Pare. Se algum teste falhar, relate o que falhou sem alterar a spec e sem
   mudar o teste só para ele passar. Peça revisão antes de continuar.
