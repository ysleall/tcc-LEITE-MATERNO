import { Router } from 'express';
import { listarBancosDeLeite } from '../repository/bancoRepository.js';

const endpoints = Router();

endpoints.get('/banco-leite', async (req, resp) => {
  try {
    const { busca } = req.query;
    const registros = await listarBancosDeLeite(busca || '');
    resp.send(registros);
  } catch (err) {
    resp.status(400).send({
      erro: err.message
    });
  }
});

export default endpoints;