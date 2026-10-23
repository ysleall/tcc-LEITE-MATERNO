import * as dbDoadoras from '../repository/gestaoRepository.js';

import { Router } from "express";

const endpoints = Router();


endpoints.get('/admin/doadoras', async (req, resp) => {

    let doadoras = await dbDoadoras.listDoadoras();

    for (let doadora of doadoras) {

        let volume = await dbDoadoras.getVolumeDoado(doadora.id);

        doadora.volume_doado_ml = Number(volume.volume_doado_ml || 0);
    }

    resp.send(doadoras);
});

export default endpoints;