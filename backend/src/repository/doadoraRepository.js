import { con } from '../config/connection.js';

// CADASTRAR DOADORA
export async function saveDoadora(doadora) {
    const command = `
        INSERT INTO doadoras
        (nome, email, cpf, telefone, data_nascimento, senha, cep, cidade, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Ativa')
    `;

    const [result] = await con.execute(command, [
        doadora.nome,
        doadora.email,
        doadora.cpf,
        doadora.telefone,
        doadora.data_nascimento,
        doadora.senha,
        doadora.cep || null,
        doadora.cidade || null
    ]);

    return result.insertId;
}

// LISTAR TODAS AS DOADORAS
export async function listDoadoras() {
    const command = `
        SELECT id, nome, email, cpf, telefone,
               data_nascimento, cep, cidade, status, data_cadastro
        FROM doadoras
        ORDER BY nome
    `;

    const [linhas] = await con.execute(command);
    return linhas;
}

// BUSCAR DOADORA POR ID
export async function getDoadora(id) {
    const command = `
        SELECT id, nome, email, cpf, telefone,
               data_nascimento, cep, cidade, status, data_cadastro
        FROM doadoras
        WHERE id = ?
    `;

    const [linhas] = await con.execute(command, [id]);
    return linhas[0];
}

// BUSCAR DOADORA PELO EMAIL PARA LOGIN
export async function getDoadoraLogin(email) {
    const command = `
        SELECT id, nome, email, senha, status
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
            data_nascimento = ?,
            cep = ?,
            cidade = ?
        WHERE id = ?
    `;

    const [result] = await con.execute(command, [
        doadora.nome,
        doadora.email,
        doadora.cpf,
        doadora.telefone,
        doadora.data_nascimento,
        doadora.cep || null,
        doadora.cidade || null,
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
