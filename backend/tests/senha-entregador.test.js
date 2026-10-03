import { describe, it, expect } from 'vitest';
import { validarSenha } from '../src/domain/entregador.js';

// Spec 001, RN-03 e tabela "Exemplos da RN-03".
const MENSAGEM = 'ERRO Senha deve ter de 6 a 72 caracteres';

describe('RN-03: senha de 6 a 72 caracteres, de qualquer tipo', () => {
  it('aceita "abc123xy" (8 caracteres)', () => {
    expect(() => validarSenha('abc123xy')).not.toThrow();
  });

  it('aceita "abcdef" (6 letras, sem número), pois qualquer tipo vale', () => {
    expect(() => validarSenha('abcdef')).not.toThrow();
  });

  it('aceita 6 caracteres (limite mínimo)', () => {
    expect(() => validarSenha('a'.repeat(6))).not.toThrow();
  });

  it('aceita 72 caracteres (limite máximo)', () => {
    expect(() => validarSenha('a'.repeat(72))).not.toThrow();
  });

  it('recusa 5 caracteres com a mensagem da spec', () => {
    expect(() => validarSenha('a'.repeat(5))).toThrow(MENSAGEM);
  });

  it('recusa 73 caracteres com a mensagem da spec', () => {
    expect(() => validarSenha('a'.repeat(73))).toThrow(MENSAGEM);
  });
});
