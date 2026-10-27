import { Router } from "express";
import { listarNotificacoes, marcarTodasComoLidas } from "../repository/notificacaoRepository.js";

const endpoints = Router();

endpoints.get('/notificacoes', async (req, resp) => {
  try {
    let notificacoes = await listarNotificacoes();
    resp.send(notificacoes);
  } catch (err) {
    resp.status(400).send({ erro: err.message });
  }
});

endpoints.put('/notificacoes/lidas', async (req, resp) => {
  try {
    await marcarTodasComoLidas();
    resp.send({ mensagem: "Todas as notificações foram marcadas como lidas." });
  } catch (err) {
    resp.status(400).send({ erro: err.message });
  }
});

export default endpoints;