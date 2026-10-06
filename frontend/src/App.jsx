import { useCallback, useEffect, useState } from 'react';

// Telas do operador da spec 001. As mensagens vêm prontas da API (D-15).
async function api(metodo, caminho, corpo) {
  const resposta = await fetch(`/api/entregadores${caminho}`, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: corpo && JSON.stringify(corpo),
  });
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.erro);
  return dados;
}

const estilos = {
  pagina: { fontFamily: 'system-ui, sans-serif', maxWidth: 820, margin: '0 auto', padding: 16 },
  form: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' },
  tabela: { width: '100%', borderCollapse: 'collapse', marginTop: 12 },
  celula: { borderBottom: '1px solid #ccc', padding: 6, textAlign: 'left' },
  sucesso: { color: '#1a7f37' },
  erro: { color: '#cf222e' },
};

function Aviso({ aviso }) {
  if (!aviso) return null;
  return <p style={aviso.erro ? estilos.erro : estilos.sucesso}>{aviso.texto}</p>;
}

function Cadastro({ aoCadastrar }) {
  const [campos, setCampos] = useState({ nome: '', usuario: '', senha: '' });
  const [aviso, setAviso] = useState(null);

  const mudar = (campo) => (e) => setCampos({ ...campos, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    try {
      const { mensagem } = await api('POST', '', campos);
      setAviso({ texto: mensagem });
      setCampos({ nome: '', usuario: '', senha: '' });
      aoCadastrar();
    } catch (erro) {
      setAviso({ texto: erro.message, erro: true });
    }
  }

  return (
    <section>
      <h2>Cadastrar entregador</h2>
      <form onSubmit={enviar} style={estilos.form}>
        <input placeholder="Nome" value={campos.nome} onChange={mudar('nome')} />
        <input placeholder="Usuário" value={campos.usuario} onChange={mudar('usuario')} />
        <input placeholder="Senha inicial" type="password" value={campos.senha} onChange={mudar('senha')} />
        <button type="submit">Cadastrar</button>
      </form>
      <Aviso aviso={aviso} />
    </section>
  );
}

function Linha({ entregador, aoAlterar, avisar }) {
  async function executar(acao) {
    try {
      await acao();
      aoAlterar();
    } catch (erro) {
      avisar({ texto: erro.message, erro: true });
    }
  }

  function editarNome() {
    const nome = window.prompt('Novo nome', entregador.nome);
    if (nome !== null) executar(() => api('PATCH', `/${entregador.id}`, { nome }));
  }

  function redefinirSenha() {
    const senha = window.prompt(`Nova senha de ${entregador.usuario}`);
    if (senha !== null) {
      executar(async () => {
        await api('PUT', `/${entregador.id}/senha`, { senha });
        avisar({ texto: `Senha de ${entregador.usuario} redefinida` });
      });
    }
  }

  const ativo = entregador.status === 'ATIVO';
  return (
    <tr>
      <td style={estilos.celula}>{entregador.nome}</td>
      <td style={estilos.celula}>{entregador.usuario}</td>
      <td style={estilos.celula}>{entregador.status}</td>
      <td style={estilos.celula}>
        <button onClick={editarNome}>Editar nome</button>{' '}
        <button onClick={redefinirSenha}>Redefinir senha</button>{' '}
        <button onClick={() => executar(() => api('POST', `/${entregador.id}/${ativo ? 'inativar' : 'ativar'}`))}>
          {ativo ? 'Inativar' : 'Ativar'}
        </button>
      </td>
    </tr>
  );
}

export default function App() {
  const [status, setStatus] = useState('ATIVO');
  const [entregadores, setEntregadores] = useState([]);
  const [aviso, setAviso] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setEntregadores(await api('GET', `?status=${status}`));
    } catch (erro) {
      setAviso({ texto: erro.message, erro: true });
    }
  }, [status]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <main style={estilos.pagina}>
      <h1>Entregadores</h1>
      <Cadastro aoCadastrar={carregar} />
      <section>
        <h2>Listagem</h2>
        <label>
          Status{' '}
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ATIVO">ATIVO</option>
            <option value="INATIVO">INATIVO</option>
          </select>
        </label>
        <Aviso aviso={aviso} />
        <table style={estilos.tabela}>
          <thead>
            <tr>
              <th style={estilos.celula}>Nome</th>
              <th style={estilos.celula}>Usuário</th>
              <th style={estilos.celula}>Status</th>
              <th style={estilos.celula}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {entregadores.map((e) => (
              <Linha key={e.id} entregador={e} aoAlterar={carregar} avisar={setAviso} />
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
