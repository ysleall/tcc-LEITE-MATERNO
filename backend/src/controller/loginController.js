import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dbDoadora from '../repository/doadoraRepository.js';

const endpoints = express.Router();

endpoints.post('/api/auth/cadastro', async (req, res) => {
    try {
        const { nome, email, cpf, telefone, data_nascimento, senha, cep, cidade } = req.body;

        if (!nome || !email || !cpf || !telefone || !data_nascimento || !senha) {
            return res.status(400).send({
                mensagem: 'Preencha todos os campos obrigatórios.'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const idInserido = await dbDoadora.saveDoadora({
            nome,
            email,
            cpf,
            telefone,
            data_nascimento,
            senha: senhaHash,
            cep,
            cidade
        });

        return res.status(201).send({
            mensagem: 'Doadora cadastrada com sucesso!',
            id: idInserido
        });
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({
                mensagem: 'E-mail ou CPF já cadastrado no sistema.'
            });
        }
        console.error(erro);
        return res.status(500).send({
            mensagem: 'Erro ao cadastrar doadora.'
        });
    }
});

endpoints.post('/api/auth/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).send({
                mensagem: 'Informe o e-mail e a senha.'
            });
        }

        const doadora = await dbDoadora.getDoadoraLogin(email);

        if (!doadora || !(await bcrypt.compare(senha, doadora.senha))) {
            return res.status(401).send({
                mensagem: 'E-mail ou senha incorretos.'
            });
        }

        const token = jwt.sign(
            { id: doadora.id, nome: doadora.nome, email: doadora.email },
            process.env.JWT_SECRET || 'lacos_maternos_super_secret_jwt_key_2026',
            { expiresIn: '8h' }
        );

        return res.send({
            mensagem: 'Login realizado com sucesso!',
            token,
            doadora: {
                id: doadora.id,
                nome: doadora.nome,
                email: doadora.email,
                status: doadora.status
            }
        });
    } catch (erro) {
        console.error(erro);
        return res.status(500).send({
            mensagem: 'Erro ao realizar login.'
        });
    }
});

export default endpoints;
