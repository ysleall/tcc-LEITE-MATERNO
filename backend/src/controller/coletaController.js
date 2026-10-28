
import { Router } from 'express';
import {
  listarBancos,
  buscarBancoPorId
} from '../repository/coletaRepository.js';

const endpoints = Router();

// Tela: Encontre um Banco de Leite
endpoints.get('/coletas/bancos', async (req, resp) => {
  try {
    const { busca } = req.query;

    const registros = await listarBancos(busca || '');

    resp.status(200).send(registros);
  } catch (err) {
    console.error(err);

    resp.status(500).send({
      erro: 'Erro ao consultar bancos de leite'
    });
  }
});

// Tela: Detalhes do banco de leite
endpoints.get('/coletas/bancos/:id', async (req, resp) => {
  try {
    const banco = await buscarBancoPorId(req.params.id);

    if (!banco) {
      return resp.status(404).send({
        erro: 'Banco de leite não encontrado'
      });
    }

    resp.status(200).send(banco);
  } catch (err) {
    console.error(err);

    resp.status(500).send({
      erro: 'Erro ao consultar detalhes do banco'
    });
  }
});

export default endpoints;
