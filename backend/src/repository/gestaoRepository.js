
import { con } from "../config/connection.js";

export async function listDoadoras() {
    const command = `
        select
            doadoras.id,
            doadoras.nome,
            doadoras.email,
            doadoras.status,
            coalesce(sum(doacao.quantidade_ml), 0) as volume_doado_ml
        from doadoras
        left join doacao
            on doadoras.id = doacao.doadora_id
        group by
            doadoras.id,
            doadoras.nome,
            doadoras.email,
            doadoras.status
        order by doadoras.nome
    `;

    const [linhas] = await con.query(command);

    return linhas.map(doadora => ({
        ...doadora,
        volume_doado_ml: Number(doadora.volume_doado_ml)
    }));
}

export async function getVolumeDoado(doadora_id) {
    const command = `
        select
            coalesce(sum(quantidade_ml), 0) as volume_doado_ml
        from doacao
        where doadora_id = ?
    `;

    const [linhas] = await con.query(command, [doadora_id]);

    return linhas[0];
}

export async function getResumoGestao() {
    const command = `
        select
            count(*) as total_doadoras,
            coalesce(sum(case
                when status = 'Ativa' then 1
                else 0
            end), 0) as doadoras_ativas,
            coalesce(sum(case
                when status = 'Inativa' then 1
                else 0
            end), 0) as doadoras_inativas,
            coalesce((
                select sum(quantidade_ml)
                from doacao
            ), 0) as total_leite_ml
        from doadoras
    `;

    const [linhas] = await con.query(command);

    return {
        total_doadoras: Number(linhas[0].total_doadoras),
        doadoras_ativas: Number(linhas[0].doadoras_ativas),
        doadoras_inativas: Number(linhas[0].doadoras_inativas),
        total_leite_ml: Number(linhas[0].total_leite_ml)
    };
}
