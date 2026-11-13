
import * as dbDoadoras from '../repository/gestaoRepository.js';
import { Router } from 'express';
import autenticarAdmin from '../middleware/autenticarAdmin.js';

const endpoints = Router();

endpoints.get('/admin/doadoras', autenticarAdmin, async (req, resp) => {
    try {
        const doadoras = await dbDoadoras.listDoadoras();

        return resp.send(doadoras);
    } catch (erro) {
        console.error(erro);

        return resp.status(500).send({
            mensagem: 'Erro ao listar doadoras.'
        });
    }
});

endpoints.get('/admin/resumo', autenticarAdmin, async (req, resp) => {
    try {
        const resumo = await dbDoadoras.getResumoGestao();

        return resp.send(resumo);
    } catch (erro) {
        console.error(erro);

        return resp.status(500).send({
            mensagem: 'Erro ao buscar resumo da gestão.'
        });
    }
});

export default endpoints;

