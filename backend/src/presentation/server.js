import { criarPool } from '../infrastructure/banco.js';
import { criarRepositorioPg } from '../infrastructure/repositorio-entregadores-pg.js';
import { gerarHash } from '../infrastructure/senha.js';
import { criarApp } from './app.js';

const PORTA = Number(process.env.PORT ?? 3000);

const app = criarApp({ repositorio: criarRepositorioPg(criarPool()), gerarHash });
app.listen(PORTA, () => console.log(`API em http://localhost:${PORTA}`));
