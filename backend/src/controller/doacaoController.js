
import * as dbDoacao from '../repository/doacaoRepository.js';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const endpoints = Router();

function autenticar(req, res, next) {
    const autorizacao = req.headers.authorization;

    if (!autorizacao || !autorizacao.startsWith('Bearer ')) {
        return res.status(401).send({
            mensagem: 'Token não informado.'
        });
    }

    try {
        const token = autorizacao.split(' ')[1];

        req.usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        next();
    } catch {
        return res.status(401).send({
            mensagem: 'Token inválido ou expirado.'
        });
    }
}

endpoints.post('/doacoes', autenticar, async (req, res) => {
    try {
        const quantidade_ml = Number(req.body.quantidade_ml);
        const data_doacao = req.body.data_doacao;

        if (!Number.isInteger(quantidade_ml) || quantidade_ml <= 0) {
            return res.status(400).send({
                mensagem: 'Informe uma quantidade de ml válida.'
            });
        }

        if (!data_doacao || !/^\d{4}-\d{2}-\d{2}$/.test(data_doacao)) {
            return res.status(400).send({
                mensagem: 'Informe uma data válida.'
            });
        }

        const id = await dbDoacao.saveDoacao({
            doadora_id: Number(req.usuario.id),
            quantidade_ml,
            data_doacao
        });

        return res.status(201).send({
            id,
            mensagem: 'Doação cadastrada!'
        });
    } catch (erro) {
        console.error(erro);

        return res.status(500).send({
            mensagem: 'Erro ao cadastrar doação.'
        });
    }
});

endpoints.get('/doacoes', autenticar, async (req, res) => {
    try {
        const doadora_id = Number(req.usuario.id);

        const doacoes = await dbDoacao.listDoacoes(doadora_id);

        return res.send(doacoes);
    } catch (erro) {
        console.error(erro);

        return res.status(500).send({
            mensagem: 'Erro ao buscar doações.'
        });
    }
});

endpoints.get('/impacto', autenticar, async (req, res) => {
    try {
        const doadora_id = Number(req.usuario.id);

        const resumo = await dbDoacao.getResumoImpacto(doadora_id);

        return res.send(resumo);
    } catch (erro) {
        console.error(erro);

        return res.status(500).send({
            mensagem: 'Erro ao buscar resumo das doações.'
        });
    }
});

endpoints.get('/impacto/mensal', autenticar, async (req, res) => {
    try {
        const doadora_id = Number(req.usuario.id);

        const doacoes = await dbDoacao.listDoacoesPorMes(doadora_id);

        return res.send(doacoes);
    } catch (erro) {
        console.error(erro);

        return res.status(500).send({
            mensagem: 'Erro ao buscar resumo mensal.'
        });
    }
});

endpoints.post('/impacto/calcular', async (req, res) => {
    try {
        const quantidade_ml = Number(req.body.quantidade_ml);

        if (!Number.isFinite(quantidade_ml) || quantidade_ml < 0) {
            return res.status(400).send({
                mensagem: 'Informe uma quantidade válida.'
            });
        }

        const bebes_estimados = Math.floor(quantidade_ml / 100);

        let mensagem = '';

        if (quantidade_ml < 100) {
            mensagem = 'Sua doação também importa! Cada quantidade de leite pode ajudar um bebê.';
        } else {
            mensagem = `Sua doação pode beneficiar até ${bebes_estimados} bebês por dia!`;
        }

        return res.send({
            quantidade_ml,
            bebes_estimados,
            mensagem
        });
    } catch (erro) {
        console.error(erro);

        return res.status(500).send({
            mensagem: 'Erro ao calcular impacto.'
        });
    }
});

export default endpoints;
