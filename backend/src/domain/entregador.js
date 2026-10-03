// RN-03: a senha tem de 6 a 72 caracteres, de qualquer tipo.
export function validarSenha(senha) {
  if (senha.length < 6 || senha.length > 72) {
    throw new Error('ERRO Senha deve ter de 6 a 72 caracteres');
  }
}
