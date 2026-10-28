
import { Router } from 'express';
import { listarBancosDeLeite } from '../repository/bancoRepository.js';

const bancoController = Router();

bancoController.get('/banco-leite', async (req, resp) => {
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
});

export default bancoController;
