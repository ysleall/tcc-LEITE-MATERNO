import { con } from '../config/connection.js';
export async function listarBancosDeLeite(busca = '') {

    const comando = `
        select
            id_banco as id,
            nm_banco as nome,
            ds_endereco as endereco,
            ds_telefone as telefone,
            bt_aberto_hoje as abertoHoje,
            ds_horario as horario,
            ds_descricao as descricao,
            bt_coleta_domiciliar as coletaDomiciliar,
            nr_latitude as latitude,
            nr_longitude as longitude
        from tb_banco_leite
        where nm_banco like ? or ds_endereco like ?
    `;

    const termo = '%' + busca + '%';

    const [resposta] = await con.query(comando, [termo, termo]);

    return resposta;
}