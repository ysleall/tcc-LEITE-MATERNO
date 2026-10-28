
import { Router } from 'express';
import { buscarDetalhesBanco } from '../repository/detalhesBancoRepository.js';

const endpoints = Router();

endpoints.get('/banco-leite/:id/detalhes', async (req, resp) => {
  try {
    const banco = await buscarDetalhesBanco(req.params.id);

    if (!banco) {
      return resp.status(404).send({
        erro: 'Banco de leite não encontrado'
      });
    }

    resp.status(200).send(banco);
  } catch (err) {
    console.error(err);

    resp.status(500).send({
      erro: 'Erro ao consultar os detalhes do banco'
    });
  }
});

export default endpoints;

