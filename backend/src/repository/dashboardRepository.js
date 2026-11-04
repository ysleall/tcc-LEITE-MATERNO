import { con } from "../config/connection.js";


export async function getTotalDoadoras() {

    const command = `
        select COUNT(*) as total
        from doadoras
    `;

    const [linhas] = await con.query(command);

    return linhas[0];
}


export async function getTotalDoacoes() {

    const command = `
        select SUM(quantidade_ml) as total_ml
        from doacao
    `;

    const [linhas] = await con.query(command);

    return linhas[0];
}


export async function getDoacoesPorMes() {

    const command = `
        select
            MONTH(data_doacao) as mes,
            SUM(quantidade_ml) as total_ml
        from doacao
        where data_doacao >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        group by YEAR(data_doacao), MONTH(data_doacao)
        order by YEAR(data_doacao), MONTH(data_doacao)
    `;

    const [linhas] = await con.query(command);

    return linhas;
}


export async function getNovasDoadorasPorMes() {

    const command = `
        select
            MONTH(data_cadastro) as mes,
            COUNT(*) as total
        from doadoras
        where data_cadastro >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        group by YEAR(data_cadastro), MONTH(data_cadastro)
        order by YEAR(data_cadastro), MONTH(data_cadastro)
    `;

    const [linhas] = await con.query(command);

    return linhas;
}