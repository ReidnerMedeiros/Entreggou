// Repositório de testes com o mesmo contrato do PostgreSQL, para os testes
// rodarem sem banco.
export function criarRepositorioEmMemoria() {
  const entregadores = [];
  let proximoId = 1;

  return {
    entregadores,
    async buscarPorUsuario(usuario) {
      return entregadores.find((e) => e.usuario.toLowerCase() === usuario.toLowerCase());
    },
    async inserir(dados) {
      const entregador = { id: proximoId++, ...dados };
      entregadores.push(entregador);
      return entregador;
    },
    async listarPorStatus(status) {
      return entregadores
        .filter((e) => e.status === status)
        .sort((a, b) => a.nome.localeCompare(b.nome));
    },
    async buscarPorId(id) {
      return entregadores.find((e) => e.id === Number(id));
    },
    async atualizar(id, campos) {
      const entregador = entregadores.find((e) => e.id === Number(id));
      Object.assign(entregador, campos);
      return entregador;
    },
  };
}

export const gerarHashFalso = async (senha) => `hash:${senha}`;
