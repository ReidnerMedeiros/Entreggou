
export function validarSenha(senha) {
  if (senha.length < 6 || senha.length > 72) {
    throw new Error('ERRO Senha deve ter de 6 a 72 caracteres');
  }
}
