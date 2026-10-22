import * as dbConquista from '../repository/conquistaRepository.js';
import { Router } from "express";

const endpoints = Router();

endpoints.get('/conquistas/:doadora_id', async (req, resp) => {
 let doadora_id = req.params.doadora_id;

    let doacoes = await dbConquista.listDoacoes(doadora_id);
let total_ml = 0;

    for (let doacao of doacoes) {
        total_ml += Number(doacao.quantidade_ml);
    }

     let meses = [];

    for (let doacao of doacoes) {
        let data = new Date(doacao.data_doacao);

        let mes = data.getUTCFullYear() * 12 + data.getUTCMonth();

        if (!meses.includes(mes)) {
            meses.push(mes);
        }
    }


     let mesesSeguidos = 1;
    let estrela = false;

    for (let i = 1; i < meses.length; i++) {

        if (meses[i] === meses[i - 1] + 1) {
            mesesSeguidos++;
        } else {
            mesesSeguidos = 1;
        }

        if (mesesSeguidos >= 3) {
            estrela = true;
        }
    }

     let conquistas = [

        {
            nome: 'Primeiros Laços',
            desbloqueada: doacoes.length > 0
        },

        {
            nome: 'Gota Solidária',
            desbloqueada: total_ml >= 1000
        },

        {
            nome: 'Mãe de Ouro',
            desbloqueada: total_ml >= 5000
        },

        {
            nome: 'Estrela da Solidariedade',
            desbloqueada: estrela
        },

        {
            nome: 'Guardiã da Vida',
            desbloqueada: total_ml >= 10000
        }

    ];
 let progresso_ml = total_ml;

    if (progresso_ml > 5000) {
        progresso_ml = 5000;
    }

    let percentual = Math.floor((total_ml / 5000) * 100);

    if (percentual > 100) {
        percentual = 100;
    }

     resp.send({
        total_ml: total_ml,
        total_litros: Number((total_ml / 1000).toFixed(2)),
        progresso_ml: progresso_ml,
        meta_ml: 5000,
        percentual_progresso: percentual,
        conquistas: conquistas
    });

});


export default endpoints;