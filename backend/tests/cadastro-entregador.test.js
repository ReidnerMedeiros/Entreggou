import { beforeEach, describe, expect, it } from 'vitest';
import { criarCasosDeUso } from '../src/application/entregadores.js';
import { criarRepositorioEmMemoria, gerarHashFalso } from './repositorio-em-memoria.js';

// Spec 001: critérios de aceite CA-01 a CA-03, mais RN-01, RN-09 e RN-10.
let repositorio;
let casos;

beforeEach(() => {
  repositorio = criarRepositorioEmMemoria();
  casos = criarCasosDeUso({ repositorio, gerarHash: gerarHashFalso });
});

describe('Spec 001: critérios de aceite', () => {
  it('CA-01: recusa usuário "Joao" quando já existe "joao" e não cria entregador', async () => {
    await casos.cadastrar({ nome: 'João Souza', usuario: 'joao', senha: 'abc123' });

    await expect(
      casos.cadastrar({ nome: 'Joao Lima', usuario: 'Joao', senha: 'abc123' }),
    ).rejects.toThrow('ERRO Usuário já cadastrado');
    expect(repositorio.entregadores).toHaveLength(1);
  });

  it('CA-02: recusa senha de 5 caracteres e não cria entregador', async () => {
    await expect(
      casos.cadastrar({ nome: 'Carlos Silva', usuario: 'carlos', senha: 'a'.repeat(5) }),
    ).rejects.toThrow('ERRO Senha deve ter de 6 a 72 caracteres');
    expect(repositorio.entregadores).toHaveLength(0);
  });

  it('CA-03: cadastra "Carlos Silva" e ele aparece na listagem com status ATIVO', async () => {
    await casos.cadastrar({ nome: 'Carlos Silva', usuario: 'carlos', senha: 'a'.repeat(6) });

    const lista = await casos.listar();
    expect(lista).toEqual([
      { id: 1, nome: 'Carlos Silva', usuario: 'carlos', status: 'ATIVO' },
    ]);
  });
});

describe('Spec 001: regras sem critério de aceite', () => {
  it('RN-02: "João" e "Joao" são usuários diferentes', async () => {
    await casos.cadastrar({ nome: 'João Souza', usuario: 'João', senha: 'abc123' });
    await casos.cadastrar({ nome: 'Joao Lima', usuario: 'Joao', senha: 'abc123' });
    expect(repositorio.entregadores).toHaveLength(2);
  });

  it('RN-09: lista só ATIVO por padrão e filtra por INATIVO', async () => {
    const ana = await casos.cadastrar({ nome: 'Ana Costa', usuario: 'ana', senha: 'abc123' });
    await casos.cadastrar({ nome: 'Bruno Reis', usuario: 'bruno', senha: 'abc123' });
    await casos.inativar(ana.id);

    expect((await casos.listar()).map((e) => e.nome)).toEqual(['Bruno Reis']);
    expect((await casos.listar('INATIVO')).map((e) => e.nome)).toEqual(['Ana Costa']);
  });

  it('RN-10: edita nome e redefine senha de entregador INATIVO', async () => {
    const ana = await casos.cadastrar({ nome: 'Ana Costa', usuario: 'ana', senha: 'abc123' });
    await casos.inativar(ana.id);

    await casos.editarNome(ana.id, 'Ana Costa Lima');
    await casos.redefinirSenha(ana.id, 'nova-senha');

    expect(repositorio.entregadores[0]).toMatchObject({
      nome: 'Ana Costa Lima',
      senhaHash: 'hash:nova-senha',
      status: 'INATIVO',
    });
  });

  it('RN-03: recusa redefinição com senha de 73 caracteres', async () => {
    const ana = await casos.cadastrar({ nome: 'Ana Costa', usuario: 'ana', senha: 'abc123' });
    await expect(casos.redefinirSenha(ana.id, 'a'.repeat(73)))
      .rejects.toThrow('ERRO Senha deve ter de 6 a 72 caracteres');
  });

  it('a listagem não expõe a senha', async () => {
    await casos.cadastrar({ nome: 'Ana Costa', usuario: 'ana', senha: 'abc123' });
    const [ana] = await casos.listar();
    expect(ana).not.toHaveProperty('senhaHash');
  });
});
