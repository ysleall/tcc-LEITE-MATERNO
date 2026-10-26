import { con } from "./connection.js";

export async function listDoadoras() {

    const command = `
        select id, nome, email, status
        from doadoras
        order by nome
    `;

    const [linhas] = await con.query(command);

    return linhas;
}



export async function getVolumeDoado(doadora_id) {

    const command = `
        select SUM(quantidade_ml) as volume_doado_ml
        from doacao
        where doadora_id = ?
    `;

    const [linhas] = await con.query(command, [doadora_id]);

    return linhas[0];
}