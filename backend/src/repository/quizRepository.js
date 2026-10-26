import { con } from "./connection.js";

export async function saveQuiz(quiz) {
    const command = `
        insert into quiz
        (pergunta, opcao_a, opcao_b, resposta_apta)
        values (?, ?, ?, ?)
    `;

    const [result] = await con.query(command, [
        quiz.pergunta,
        quiz.opcao_a,
        quiz.opcao_b,
        quiz.resposta_apta
    ]);

    return result.insertId;
}

export async function listQuiz() {
    const command = `
        select id,
               pergunta,
               opcao_a,
               opcao_b,
               resposta_apta
        from quiz
    `;

    const [linhas] = await con.query(command);

    return linhas;
}

export async function getQuiz(id) {
    const command = `
        select id,
               pergunta,
               opcao_a,
               opcao_b,
               resposta_apta
        from quiz
        where id = ?
    `;

    const [linhas] = await con.query(command, [id]);

    return linhas[0];
}

export async function updateQuiz(id, quiz) {
    const command = `
        update quiz
        set pergunta = ?,
            opcao_a = ?,
            opcao_b = ?,
            resposta_apta = ?
        where id = ?
    `;

    const [result] = await con.query(command, [
        quiz.pergunta,
        quiz.opcao_a,
        quiz.opcao_b,
        quiz.resposta_apta,
        id
    ]);

    return result.affectedRows;
}

export async function deleteQuiz(id) {
    const command = `
        delete from quiz
        where id = ?
    `;

    const [result] = await con.query(command, [id]);

    return result.affectedRows;
}