import express from 'express';
import {
  CADASTRADO_COM_SUCESSO,
  NAO_ENCONTRADO,
  USUARIO_JA_CADASTRADO,
  criarCasosDeUso,
} from '../application/entregadores.js';

// Campo ausente ou que não é texto vira '', e a validação do domínio recusa.
const texto = (valor) => (typeof valor === 'string' ? valor : '');

export function criarApp({ repositorio, gerarHash }) {
  const casos = criarCasosDeUso({ repositorio, gerarHash });
  const app = express();
  app.use(express.json());

  const rotas = express.Router();

  rotas.post('/', async (req, res) => {
    const { nome, usuario, senha } = req.body ?? {};
    const entregador = await casos.cadastrar({
      nome: texto(nome),
      usuario: texto(usuario),
      senha: texto(senha),
    });
    res.status(201).json({ mensagem: CADASTRADO_COM_SUCESSO, entregador });
  });

  rotas.get('/', async (req, res) => {
    res.json(await casos.listar(req.query.status));
  });

  // Ids que não são inteiros positivos não existem.
  rotas.param('id', (req, res, next, id) => {
    if (!/^\d{1,9}$/.test(id)) throw new Error(NAO_ENCONTRADO);
    next();
  });

  rotas.patch('/:id', async (req, res) => {
    res.json(await casos.editarNome(Number(req.params.id), texto(req.body?.nome)));
  });

  rotas.post('/:id/inativar', async (req, res) => {
    res.json(await casos.inativar(Number(req.params.id)));
  });

  rotas.post('/:id/ativar', async (req, res) => {
    res.json(await casos.ativar(Number(req.params.id)));
  });

  rotas.put('/:id/senha', async (req, res) => {
    res.json(await casos.redefinirSenha(Number(req.params.id), texto(req.body?.senha)));
  });

  app.use('/api/entregadores', rotas);

  // eslint-disable-next-line no-unused-vars -- o Express só trata erro com 4 parâmetros
  app.use((erro, req, res, next) => {
    if (erro.message === USUARIO_JA_CADASTRADO) return res.status(409).json({ erro: erro.message });
    if (erro.message === NAO_ENCONTRADO) return res.status(404).json({ erro: erro.message });
    if (erro.message.startsWith('ERRO ')) return res.status(400).json({ erro: erro.message });
    if (erro.type === 'entity.parse.failed') return res.status(400).json({ erro: 'ERRO JSON inválido' });
    console.error(erro);
    res.status(500).json({ erro: 'ERRO Falha interna' });
  });

  return app;
}
