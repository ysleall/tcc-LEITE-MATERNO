import * as dbQuiz from '../repository/quizRepository.js';

import { Router } from "express";
const endpoints = Router();



endpoints.post('/quiz', async (req, resp) => {

    let quiz = req.body;

    let id = await dbQuiz.saveQuiz(quiz);

    resp.send({
        id: id,
        mensagem: 'Pergunta cadastrada!'
    });
});



endpoints.get('/quiz', async (req, resp) => {

    let quiz = await dbQuiz.listQuiz();

    resp.send(quiz);
});



endpoints.get('/quiz/:id', async (req, resp) => {

    let id = req.params.id;

    let quiz = await dbQuiz.getQuiz(id);

    resp.send(quiz);
});

endpoints.put('/quiz/:id', async (req, resp) => {

    let id = req.params.id;

    let quiz = req.body;

    let qtd = await dbQuiz.updateQuiz(id, quiz);

    resp.send({
        qtd: qtd
    });
});


// DELETAR PERGUNTA
endpoints.delete('/quiz/:id', async (req, resp) => {

    let id = req.params.id;

    let qtd = await dbQuiz.deleteQuiz(id);

    resp.send({
        qtd: qtd
    });
});


// VERIFICAR RESULTADO DO QUIZ
endpoints.post('/quiz/resultado', async (req, resp) => {

    let respostas = req.body.respostas;

    let perguntas = await dbQuiz.listQuiz();

    let apta = true;

    for (let pergunta of perguntas) {

        let respostaUsuario = respostas[pergunta.id];

        if (respostaUsuario !== pergunta.resposta_apta) {
            apta = false;
            break;
        }
    }

    if (apta) {
        resp.send({
            apta: true,
            mensagem: 'Você pode doar!'
        });
    } else {
        resp.send({
            apta: false,
            mensagem: 'Você não está apta para doar.'
        });
    }
});


export default endpoints;