// Contrato em backend/src/application/entregadores.js.
import { USUARIO_JA_CADASTRADO } from '../application/entregadores.js';

const COLUNAS = 'id, nome, usuario, senha_hash as "senhaHash", status';

export function criarRepositorioPg(pool) {
  async function uma(sql, valores) {
    const { rows } = await pool.query(sql, valores);
    return rows[0];
  }

  return {
    buscarPorUsuario(usuario) {
      return uma(`select ${COLUNAS} from entregadores where lower(usuario) = lower($1)`, [usuario]);
    },

    async inserir({ nome, usuario, senhaHash, status }) {
      try {
        return await uma(
          `insert into entregadores (nome, usuario, senha_hash, status)
           values ($1, $2, $3, $4) returning ${COLUNAS}`,
          [nome, usuario, senhaHash, status],
        );
      } catch (erro) {
        // Dois cadastros simultâneos com o mesmo usuário: o índice único barra o segundo.
        if (erro.code === '23505') throw new Error(USUARIO_JA_CADASTRADO, { cause: erro });
        throw erro;
      }
    },

    async listarPorStatus(status) {
      const { rows } = await pool.query(
        `select ${COLUNAS} from entregadores where status = $1 order by nome`,
        [status],
      );
      return rows;
    },

    buscarPorId(id) {
      return uma(`select ${COLUNAS} from entregadores where id = $1`, [id]);
    },

    atualizar(id, { nome, senhaHash, status }) {
      return uma(
        `update entregadores
            set nome = coalesce($2, nome),
                senha_hash = coalesce($3, senha_hash),
                status = coalesce($4, status)
          where id = $1 returning ${COLUNAS}`,
        [id, nome, senhaHash, status],
      );
    },
  };
}
