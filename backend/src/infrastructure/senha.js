import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

// Guarda "salt:hash" em hex; a senha em texto nunca vai para o banco.
export async function gerarHash(senha) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scryptAsync(senha, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}
