import { con } from './connection.js';

export async function listarNotificacoes() {
  const comando = `SELECT * FROM tb_notificacao`;
  const [resposta] = await con.query(comando);
  return resposta;
}

export async function marcarTodasComoLidas() {
  const comando = `UPDATE tb_notificacao SET bt_lida = true`;
  const [resposta] = await con.query(comando);
  return resposta;
}