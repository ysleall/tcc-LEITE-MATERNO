
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { con } from '../config/connection.js';
import * as dbAdministrador from '../repository/administradorRepository.js';

async function criarAdministrador() {
    try {
        const nome = process.env.ADMIN_NOME;
        const email = process.env.ADMIN_EMAIL;
        const senha = process.env.ADMIN_SENHA;

        if (!nome || !email || !senha) {
            throw new Error('Configure ADMIN_NOME, ADMIN_EMAIL e ADMIN_SENHA no .env.');
        }

        if (senha.length < 8) {
            throw new Error('A senha precisa ter pelo menos 8 caracteres.');
        }

        const existente = await dbAdministrador.buscarPorEmail(email);

        if (existente) {
            throw new Error('Já existe um administrador com esse e-mail.');
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const id = await dbAdministrador.cadastrarAdministrador({
            nome,
            email,
            senha: senhaHash
        });

        console.log('Administrador cadastrado com sucesso. ID:', id);
    } catch (erro) {
        console.error('Erro:', erro.message);
        process.exitCode = 1;
    } finally {
        await con.end();
    }
}

criarAdministrador();
