
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dbAdministrador from '../repository/administradorRepository.js';

const endpoints = Router();

endpoints.post('/admin/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).send({
                mensagem: 'Informe o e-mail e a senha.'
            });
        }

        const administrador = await dbAdministrador.buscarPorEmail(email);

        if (!administrador || administrador.status !== 'Ativo') {
            return res.status(401).send({
                mensagem: 'E-mail ou senha inválidos.'
            });
        }

        const senhaCorreta = await bcrypt.compare(
            senha,
            administrador.senha
        );

        if (!senhaCorreta) {
            return res.status(401).send({
                mensagem: 'E-mail ou senha inválidos.'
            });
        }

        const token = jwt.sign(
            {
                id: administrador.id,
                nome: administrador.nome,
                email: administrador.email,
                tipo: 'admin'
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.send({
            mensagem: 'Login administrativo realizado!',
            token,
            administrador: {
                id: administrador.id,
                nome: administrador.nome,
                email: administrador.email
            }
        });
    } catch (erro) {
        console.error(erro);

        return res.status(500).send({
            mensagem: 'Erro ao realizar login administrativo.'
        });
    }
});

export default endpoints;
