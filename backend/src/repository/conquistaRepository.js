import { con } from "./connection.js";

export async function listDoacoes(doadora_id) {

    const command = `
        select id, quantidade_ml, data_doacao
        from doacao
        where doadora_id = ?
        order by data_doacao
    `;

    const [linhas] = await con.query(command, [doadora_id]);

    return linhas;
}





