
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './adminLogin.scss';
export default function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    async function entrar(e) {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        try {
            const resposta = await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:2027'}/admin/login`,
                { email, senha }
            );

            localStorage.setItem('@lacos:admin:token', resposta.data.token);
            localStorage.setItem(
                '@lacos:admin',
                JSON.stringify(resposta.data.administrador)
            );

            navigate('/admin/gestao-doadoras');
        } catch (erro) {
            setErro(
                erro.response?.data?.mensagem ||
                'Não foi possível realizar o login.'
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="pagina-admin-login">
            <form className="formulario-admin" onSubmit={entrar}>
                <h1>Laços Maternos</h1>
                <h2>Acesso administrativo</h2>

                <p>
                    Entre com os dados da sua conta de administrador.
                </p>

                <label htmlFor="email-admin">E-mail</label>
                <input
                    id="email-admin"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail"
                    required
                />

                <label htmlFor="senha-admin">Senha</label>
                <input
                    id="senha-admin"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    required
                />

                {erro && <span className="erro-admin">{erro}</span>}

                <button type="submit" disabled={carregando}>
                    {carregando ? 'Entrando...' : 'Entrar'}
                </button>

                <button
                    type="button"
                    className="voltar-admin"
                    onClick={() => navigate('/')}
                >
                    Voltar ao início
                </button>
            </form>
        </main>
    );
}
