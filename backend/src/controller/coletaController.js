
import { Router } from 'express';
import {
  listarColetas,
  buscarColetaPorId
} from '../repository/coletaRepository.js';

const endpoints = Router();

endpoints.get('/coletas', async (req, resp) => {
  try {
    const registros = await listarColetas();

    resp.status(200).send(registros);
  } catch (err) {
    console.error(err);

    resp.status(500).send({
      erro: 'Erro ao consultar as coletas'
    });
  }
});

endpoints.get('/coletas/:id', async (req, resp) => {
  try {
    const registro = await buscarColetaPorId(req.params.id);

    if (!registro) {
      return resp.status(404).send({
        erro: 'Coleta não encontrada'
      });
    }

    resp.status(200).send(registro);
  } catch (err) {
    console.error(err);

    resp.status(500).send({
      erro: 'Erro ao consultar a coleta'
    });
  }
});

export default endpoints;
