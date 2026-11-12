import * as dbDashboard from '../repository/dashboardRepository.js';

import { Router } from "express";

const endpoints = Router();


endpoints.get('/admin/dashboard', async (req, resp) => {

    let doadoras = await dbDashboard.getTotalDoadoras();

    let doacoes = await dbDashboard.getTotalDoacoes();

    let evolucao = await dbDashboard.getDoacoesPorMes();

    let novas = await dbDashboard.getNovasDoadorasPorMes();


    resp.send({

        total_doadoras: doadoras.total,

        total_doado_ml: Number(doacoes.total_ml || 0),

        total_doado_litros: Number((Number(doacoes.total_ml || 0) / 1000).toFixed(2)),

        evolucao_doacoes: evolucao,

        novas_doadoras: novas

    });

});


export default endpoints;