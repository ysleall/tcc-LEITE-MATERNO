import { Router } from "express";

import * as dbNotificacoes from "../repository/notificacaoRepository.js";

const endpoints = Router();

endpoints.get('/notificacoes', async (req, resp) => {

    let notificacoes = await dbNotificacoes.listarNotificacoes();

    resp.send(notificacoes);
});
endpoints.put('/notificacoes/lidas', async (req, resp) => {

    await dbNotificacoes.marcarTodasComoLidas();

    resp.send({
        mensagem: "Todas as notificações foram marcadas como lidas."
    });
});

export default endpoints;