
import { con } from './connection.js';

export async function buscarDetalhesBanco(id) {
  const comando = `
    SELECT *
    FROM tb_banco_leite
    WHERE id_banco = ?
  `;

  const [resposta] = await con.query(comando, [id]);

  return resposta[0];
}
