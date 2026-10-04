// Casos de uso da spec 001. O repositório e o gerador de hash vêm de fora.
//
// Contrato do repositório:
//   buscarPorUsuario(usuario)   sem diferenciar maiúsculas de minúsculas (RN-02)
//   inserir({ nome, usuario, senhaHash, status })  devolve o entregador com id
//   listarPorStatus(status)     ordenado por nome
//   buscarPorId(id)
//   atualizar(id, campos)       campos: nome, senhaHash ou status
import {
  ATIVO,
  INATIVO,
  validarNome,
  validarSenha,
  validarStatus,
  validarUsuario,
} from '../domain/entregador.js';

export const USUARIO_JA_CADASTRADO = 'ERRO Usuário já cadastrado';
export const NAO_ENCONTRADO = 'ERRO Entregador não encontrado';
export const CADASTRADO_COM_SUCESSO = 'Entregador cadastrado com sucesso';

// A senha (nem o hash) nunca sai daqui.
function publico({ id, nome, usuario, status }) {
  return { id, nome, usuario, status };
}

export function criarCasosDeUso({ repositorio, gerarHash }) {
  async function buscar(id) {
    const entregador = await repositorio.buscarPorId(id);
    if (!entregador) throw new Error(NAO_ENCONTRADO);
    return entregador;
  }

  async function alterar(id, campos) {
    await buscar(id);
    return publico(await repositorio.atualizar(id, campos));
  }

  return {
    async cadastrar({ nome, usuario, senha }) {
      validarNome(nome);
      validarUsuario(usuario);
      validarSenha(senha);
      if (await repositorio.buscarPorUsuario(usuario)) {
        throw new Error(USUARIO_JA_CADASTRADO);
      }
      const senhaHash = await gerarHash(senha);
      // RN-01: todo entregador novo nasce ATIVO.
      return publico(await repositorio.inserir({ nome, usuario, senhaHash, status: ATIVO }));
    },

    // RN-09: por padrão, só os ATIVO.
    async listar(status = ATIVO) {
      validarStatus(status);
      return (await repositorio.listarPorStatus(status)).map(publico);
    },

    // RN-10: vale para ATIVO e INATIVO.
    async editarNome(id, nome) {
      validarNome(nome);
      return alterar(id, { nome });
    },

    // RN-05 (recusar com entrega EM_ANDAMENTO) depende da feature de entregas (D-10).
    async inativar(id) {
      return alterar(id, { status: INATIVO });
    },

    async ativar(id) {
      return alterar(id, { status: ATIVO });
    },

    // RN-03, RN-07 e RN-10.
    async redefinirSenha(id, senha) {
      validarSenha(senha);
      return alterar(id, { senhaHash: await gerarHash(senha) });
    },
  };
}
