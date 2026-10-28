
import { con } from './connection.js';

export async function listarColetas() {
  const comando = `
    SELECT *
    FROM tb_coleta
    ORDER BY id_coleta DESC
  `;

  const [resposta] = await con.query(comando);

  return resposta;
}

export async function buscarColetaPorId(id) {
  const comando = `
    SELECT *
    FROM tb_coleta
    WHERE id_coleta = ?
  `;

  const [resposta] = await con.query(comando, [id]);

  return resposta[0];
}
