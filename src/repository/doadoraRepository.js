
import { con } from './connection.js';

// CADASTRAR DOADORA
export async function saveDoadora(doadora) {
    const command = `
        INSERT INTO doadoras
        (nome, email, cpf, telefone, data_nascimento, senha)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await con.execute(command, [
        doadora.nome,
        doadora.email,
        doadora.cpf,
        doadora.telefone,
        doadora.data_nascimento,
        doadora.senha
    ]);

    return result.insertId;
}

// LISTAR TODAS AS DOADORAS
export async function listDoadoras() {
    const command = `
        SELECT id, nome, email, cpf, telefone,
               data_nascimento, data_cadastro
        FROM doadoras
    `;

    const [linhas] = await con.execute(command);
    return linhas;
}

// BUSCAR DOADORA POR ID
export async function getDoadora(id) {
    const command = `
        SELECT id, nome, email, cpf, telefone,
               data_nascimento, data_cadastro
        FROM doadoras
        WHERE id = ?
    `;

    const [linhas] = await con.execute(command, [id]);
    return linhas[0];
}

// BUSCAR DOADORA PELO EMAIL PARA LOGIN
export async function getDoadoraLogin(email) {
    const command = `
        SELECT id, nome, email, senha
        FROM doadoras
        WHERE email = ?
        LIMIT 1
    `;

    const [linhas] = await con.execute(command, [email]);
    return linhas[0];
}

// ATUALIZAR DOADORA
export async function updateDoadora(id, doadora) {
    const command = `
        UPDATE doadoras
        SET nome = ?,
            email = ?,
            cpf = ?,
            telefone = ?,
            data_nascimento = ?
        WHERE id = ?
    `;

    const [result] = await con.execute(command, [
        doadora.nome,
        doadora.email,
        doadora.cpf,
        doadora.telefone,
        doadora.data_nascimento,
        id
    ]);

    return result.affectedRows;
}

// DELETAR DOADORA
export async function deleteDoadora(id) {
    const command = `
        DELETE FROM doadoras
        WHERE id = ?
    `;

    const [result] = await con.execute(command, [id]);
    return result.affectedRows;
}
