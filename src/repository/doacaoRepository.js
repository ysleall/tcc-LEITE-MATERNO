import { con } from "./connection.js";


// CADASTRO
export async function saveDoacao(doacao) {
    const command = `
        insert into doacao
        (doadora_id, quantidade_ml, data_doacao)
        values (?, ?, ?)
    `;

    const [result] = await con.query(command, [
        doacao.doadora_id,
        doacao.quantidade_ml,
        doacao.data_doacao
    ]);

    return result.insertId;
}


// LISTAR DOAÇÕES DE UMA DOADORA
export async function listDoacoes(doadora_id) {
    const command = `
        select
            id,
            doadora_id,
            quantidade_ml,
            data_doacao
        from doacao
        where doadora_id = ?
        order by data_doacao desc
    `;

    const [linhas] = await con.query(command, [doadora_id]);

    return linhas;
}


// CONSULTAR RESUMO DO IMPACTO
export async function getResumoImpacto(doadora_id) {
    const command = `
        select
            COALESCE(SUM(quantidade_ml), 0) as total_ml,
            COUNT(*) as total_doacoes
        from doacao
        where doadora_id = ?
    `;

    const [linhas] = await con.query(command, [doadora_id]);

    return linhas[0];
}


// LISTAR DOAÇÕES POR MÊS
export async function listDoacoesPorMes(doadora_id) {
    const command = `
        select
            DATE_FORMAT(data_doacao, '%Y-%m') as mes,
            SUM(quantidade_ml) as quantidade_ml
        from doacao
        where doadora_id = ?
        group by DATE_FORMAT(data_doacao, '%Y-%m')
        order by mes
    `;

    const [linhas] = await con.query(command, [doadora_id]);

    return linhas;
}