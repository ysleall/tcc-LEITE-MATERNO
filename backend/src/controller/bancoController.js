
import { listarBancosDeLeite } from '../repository/bancoRepository.js';

export async function buscarBancos(req, resp) {
  try {
    const { busca } = req.query;

    const registros = await listarBancosDeLeite(busca || '');

    resp.status(200).send(registros);
  } catch (err) {
    console.error(err);

    resp.status(500).send({
      erro: 'Erro ao consultar os bancos de leite'
    });
  }
}
