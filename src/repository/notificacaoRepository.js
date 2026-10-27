import { con } from "./connection.js";

export async function listarNotificacoes() {

    const comando = `
        SELECT id, titulo, mensagem, tipo, lida, criado_em
        FROM notificacoes
        ORDER BY criado_em DESC
    `;

    const [linhas] = await con.query(comando);

    return linhas;
}

export async function marcarTodasComoLidas() {

    const comando = `
        UPDATE notificacoes
        SET lida = TRUE
    `;

    await con.query(comando);
}