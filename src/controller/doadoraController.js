import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dbDoadora from '../repository/doadoraRepository.js';

const endpoints = express.Router();


function autenticar(req, res, next) {
    const autorizacao = req.headers.authorization;

    if (!autorizacao || !autorizacao.startsWith('Bearer ')) {
        return res.status(401).send({
            mensagem: 'Token não informado.'
        });
    }

    try {
        const token = autorizacao.split(' ')[1];

        req.usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        next();
    } catch {
        return res.status(401).send({
            mensagem: 'Token inválido ou expirado.'
        });
    }
}


endpoints.post('/api/doadoras', async (req, res) => {
    try {
        const {
            nome,
            email,
            cpf,
            telefone,
            data_nascimento,
            senha
        } = req.body;

        if (
            !nome || !email || !cpf ||
            !telefone || !data_nascimento || !senha
        ) {
            return res.status(400).send({
                mensagem: 'Preencha todos os campos.'
            });
        }

        if (!/^\d{11}$/.test(cpf)) {
            return res.status(400).send({
                mensagem: 'O CPF deve conter 11 números.'
            });
        }

        if (senha.length < 8) {
            return res.status(400).send({
                mensagem: 'A senha deve ter pelo menos 8 caracteres.'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).send({
                mensagem: 'Informe um e-mail válido.'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const id = await dbDoadora.saveDoadora({
            nome,
            email,
            cpf,
            telefone,
            data_nascimento,
            senha: senhaHash
        });

        return res.status(201).send({
            id,
            mensagem: 'Doadora cadastrada com sucesso!'
        });
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({
                mensagem: 'E-mail ou CPF já cadastrado.'
            });
        }

        console.error(erro);

        return res.status(500).send({
            mensagem: 'Erro ao cadastrar doadora.'
        });
    }
});

// LISTAR TODAS AS DOADORAS
endpoints.get('/api/doadoras', autenticar, async (req, res) => {
    try {
        const doadoras = await dbDoadora.listDoadoras();

        return res.send(doadoras);
    } catch (erro) {
        console.error(erro);

        return res.status(500).send({
            mensagem: 'Erro ao listar doadoras.'
        });
    }
});

// BUSCAR DOADORA PELO ID
endpoints.get('/api/doadoras/:id', autenticar, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send({
                mensagem: 'ID inválido.'
            });
        }

        if (req.usuario.id !== id) {
            return res.status(403).send({
                mensagem: 'Você não pode acessar esse cadastro.'
            });
        }

        const doadora = await dbDoadora.getDoadora(id);

        if (!doadora) {
            return res.status(404).send({
                mensagem: 'Doadora não encontrada.'
            });
        }

        return res.send(doadora);
    } catch (erro) {
        console.error(erro);

        return res.status(500).send({
            mensagem: 'Erro ao buscar doadora.'
        });
    }
});

// ATUALIZAR DOADORA
endpoints.put('/api/doadoras/:id', autenticar, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send({
                mensagem: 'ID inválido.'
            });
        }

        if (req.usuario.id !== id) {
            return res.status(403).send({
                mensagem: 'Você não pode alterar esse cadastro.'
            });
        }

        const {
            nome,
            email,
            cpf,
            telefone,
            data_nascimento
        } = req.body;

        if (
            !nome || !email || !cpf ||
            !telefone || !data_nascimento
        ) {
            return res.status(400).send({
                mensagem: 'Preencha todos os campos.'
            });
        }

        if (!/^\d{11}$/.test(cpf)) {
            return res.status(400).send({
                mensagem: 'O CPF deve conter 11 números.'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).send({
                mensagem: 'Informe um e-mail válido.'
            });
        }

        const existente = await dbDoadora.getDoadora(id);

        if (!existente) {
            return res.status(404).send({
                mensagem: 'Doadora não encontrada.'
            });
        }

        await dbDoadora.updateDoadora(id, {
            nome,
            email,
            cpf,
            telefone,
            data_nascimento
        });

        return res.send({
            mensagem: 'Dados atualizados com sucesso!'
        });
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).send({
                mensagem: 'E-mail ou CPF já cadastrado.'
            });
        }

        console.error(erro);

        return res.status(500).send({
            mensagem: 'Erro ao atualizar doadora.'
        });
    }
});


endpoints.delete('/api/doadoras/:id', autenticar, async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send({
                mensagem: 'ID inválido.'
            });
        }

        if (req.usuario.id !== id) {
            return res.status(403).send({
                mensagem: 'Você não pode excluir esse cadastro.'
            });
        }

        const doadora = await dbDoadora.getDoadora(id);

        if (!doadora) {
            return res.status(404).send({
                mensagem: 'Doadora não encontrada.'
            });
        }

        await dbDoadora.deleteDoadora(id);

        return res.send({
            mensagem: 'Cadastro excluído com sucesso!'
        });
    } catch (erro) {
        console.error(erro);

        return res.status(500).send({
            mensagem: 'Erro ao excluir doadora.'
        });
    }
});

export default endpoints;