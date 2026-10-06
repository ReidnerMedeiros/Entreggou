export const ATIVO = 'ATIVO';
export const INATIVO = 'INATIVO';

export function validarNome(nome) {
  if (nome.length < 3 || nome.length > 80) {
    throw new Error('ERRO Nome deve ter de 3 a 80 caracteres');
  }
}

export function validarUsuario(usuario) {
  if (usuario.length < 3 || usuario.length > 30) {
    throw new Error('ERRO Usuário deve ter de 3 a 30 caracteres');
  }
}

export function validarSenha(senha) {
  if (senha.length < 6 || senha.length > 72) {
    throw new Error('ERRO Senha deve ter de 6 a 72 caracteres');
  }
}

export function validarStatus(status) {
  if (status !== ATIVO && status !== INATIVO) {
    throw new Error('ERRO Status deve ser ATIVO ou INATIVO');
  }
}
