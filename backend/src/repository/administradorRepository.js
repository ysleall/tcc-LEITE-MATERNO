
import { con } from '../config/connection.js';

export async function buscarPorEmail(email) {
    const command = `
        select id, nome, email, senha, status
        from administradores
        where email = ?
        limit 1
    `;

    const [linhas] = await con.query(command, [email]);

    return linhas[0];
}

export async function cadastrarAdministrador(administrador) {
    const command = `
        insert into administradores (nome, email, senha)
        values (?, ?, ?)
    `;

    const [resultado] = await con.query(command, [
        administrador.nome,
        administrador.email,
        administrador.senha
    ]);

    return resultado.insertId;
}
