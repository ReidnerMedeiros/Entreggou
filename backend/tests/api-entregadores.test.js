import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { criarApp } from '../src/presentation/app.js';
import { criarRepositorioEmMemoria, gerarHashFalso } from './repositorio-em-memoria.js';

// Spec 001 pela API: mensagens exatas da D-15 e códigos HTTP.
let servidor;
let base;

beforeAll(async () => {
  const app = criarApp({ repositorio: criarRepositorioEmMemoria(), gerarHash: gerarHashFalso });
  servidor = app.listen(0);
  await new Promise((resolve) => servidor.once('listening', resolve));
  base = `http://localhost:${servidor.address().port}/api/entregadores`;
});

afterAll(() => servidor.close());

async function chamar(metodo, caminho, corpo) {
  const resposta = await fetch(base + caminho, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: corpo && JSON.stringify(corpo),
  });
  return { status: resposta.status, corpo: await resposta.json() };
}

describe('API de entregadores', () => {
  it('CA-03: POST cadastra, responde a mensagem de sucesso e não devolve a senha', async () => {
    const r = await chamar('POST', '', { nome: 'Carlos Silva', usuario: 'carlos', senha: 'abc123' });
    expect(r.status).toBe(201);
    expect(r.corpo).toEqual({
      mensagem: 'Entregador cadastrado com sucesso',
      entregador: { id: 1, nome: 'Carlos Silva', usuario: 'carlos', status: 'ATIVO' },
    });
  });

  it('CA-01: POST com usuário repetido em outra caixa responde 409', async () => {
    const r = await chamar('POST', '', { nome: 'Outro Carlos', usuario: 'Carlos', senha: 'abc123' });
    expect(r).toEqual({ status: 409, corpo: { erro: 'ERRO Usuário já cadastrado' } });
  });

  it('CA-02: POST com senha de 5 caracteres responde 400', async () => {
    const r = await chamar('POST', '', { nome: 'Davi Rocha', usuario: 'davi', senha: '12345' });
    expect(r).toEqual({ status: 400, corpo: { erro: 'ERRO Senha deve ter de 6 a 72 caracteres' } });
  });

  it('POST sem campos responde 400 em vez de falhar', async () => {
    const r = await chamar('POST', '', {});
    expect(r.status).toBe(400);
  });

  it('GET lista ATIVO por padrão e INATIVO pelo filtro (RN-09)', async () => {
    await chamar('POST', '/1/inativar');
    expect((await chamar('GET', '')).corpo).toEqual([]);
    expect((await chamar('GET', '?status=INATIVO')).corpo).toHaveLength(1);
    await chamar('POST', '/1/ativar');
    expect((await chamar('GET', '')).corpo).toHaveLength(1);
  });

  it('PATCH edita o nome e PUT redefine a senha', async () => {
    expect((await chamar('PATCH', '/1', { nome: 'Carlos S.' })).corpo.nome).toBe('Carlos S.');
    expect((await chamar('PUT', '/1/senha', { senha: 'nova-senha' })).status).toBe(200);
  });

  it('id inexistente ou inválido responde 404', async () => {
    expect((await chamar('POST', '/99/inativar')).status).toBe(404);
    expect((await chamar('POST', '/abc/inativar')).status).toBe(404);
  });
});
