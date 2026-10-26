import * as dbDoacao from '../repository/doacaoRepository.js';
import { Router } from "express";
const endpoints = Router();


endpoints.post('/doacoes', async (req, resp) => {

    let doacao = req.body;

    let id = await dbDoacao.saveDoacao(doacao);

    resp.send({
        id: id,
        mensagem: 'Doação cadastrada!'
    });
});


endpoints.get('/doacoes', async (req, resp) => {

    let doadora_id = req.query.doadora_id;

    let doacoes = await dbDoacao.listDoacoes(doadora_id);

    resp.send(doacoes);
});


endpoints.get('/impacto', async (req, resp) => {

    let doadora_id = req.query.doadora_id;

    let resumo = await dbDoacao.getResumoImpacto(doadora_id);

    resp.send(resumo);
});


endpoints.get('/impacto/mensal', async (req, resp) => {

    let doadora_id = req.query.doadora_id;

    let doacoes = await dbDoacao.listDoacoesPorMes(doadora_id);

    resp.send(doacoes);
});


endpoints.post('/impacto/calcular', async (req, resp) => {

    let quantidade_ml = Number(req.body.quantidade_ml);

    let bebes_estimados = Math.floor(quantidade_ml / 100);

    let mensagem = '';

    if (quantidade_ml < 100) {
        mensagem = 'Sua doação também importa! Cada quantidade de leite pode ajudar um bebê.';
    } else {
        mensagem = `Sua doação pode beneficiar até ${bebes_estimados} bebês por dia!`;
    }

    resp.send({
        quantidade_ml: quantidade_ml,
        bebes_estimados: bebes_estimados,
        mensagem: mensagem
    });

});

export default endpoints;