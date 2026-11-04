
import { con } from './connection.js';
export async function listarBancos(busca = '') {
  const comando = `
    SELECT
      id_banco AS id,
      nm_banco AS nome,
      ds_endereco AS endereco,
      ds_telefone AS telefone,
      bt_aberto_hoje AS abertoHoje
    FROM tb_banco_leite
    WHERE nm_banco LIKE ?
       OR ds_endereco LIKE ?
    ORDER BY nm_banco
  `;

  const termo = `%${busca}%`;

  const [resposta] = await con.query(comando, [termo, termo]);

  return resposta;
}
export async function buscarBancoPorId(id) {
  const comando = `
    SELECT
      id_banco AS id,
      nm_banco AS nome,
      ds_endereco AS endereco,
      ds_telefone AS telefone,
      bt_aberto_hoje AS abertoHoje
    FROM tb_banco_leite
    WHERE id_banco = ?
  `;

  const [resposta] = await con.query(comando, [id]);

  return resposta[0];
}
