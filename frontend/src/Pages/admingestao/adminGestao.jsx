
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './adminGestao.scss';

const enderecoApi =
    process.env.REACT_APP_API_URL || 'http://localhost:2027';

export default function AdminGestao() {
    const navigate = useNavigate();

    const token = localStorage.getItem('@lacos:admin:token');

    const [resumo, setResumo] = useState({
        total_doadoras: 0,
        doadoras_ativas: 0,
        doadoras_inativas: 0,
        total_leite_ml: 0
    });

    const [doadoras, setDoadoras] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        if (!token) return;

        async function carregarDados() {
            try {
                const configuracao = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const [respostaResumo, respostaDoadoras] = await Promise.all([
                    axios.get(`${enderecoApi}/admin/resumo`, configuracao),
                    axios.get(`${enderecoApi}/admin/doadoras`, configuracao)
                ]);

                setResumo(respostaResumo.data);
                setDoadoras(respostaDoadoras.data);
            } catch (erro) {
                if (erro.response?.status === 401 ||
                    erro.response?.status === 403) {
                    localStorage.removeItem('@lacos:admin:token');
                    localStorage.removeItem('@lacos:admin');
                    navigate('/admin/login');
                    return;
                }

                setErro(
                    erro.response?.data?.mensagem ||
                    'Não foi possível carregar os dados da gestão.'
                );
            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, [token, navigate]);

    function sair() {
        localStorage.removeItem('@lacos:admin:token');
        localStorage.removeItem('@lacos:admin');
        navigate('/admin/login');
    }

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    if (carregando) {
        return (
            <main className="pagina-admin-gestao">
                <p className="mensagem-carregamento">Carregando dados...</p>
            </main>
        );
    }

    return (
        <main className="pagina-admin-gestao">
            <header className="cabecalho-gestao">
                <div>
                    <h1>Laços Maternos</h1>
                    <p>Painel administrativo</p>
                </div>

                <button onClick={sair}>Sair</button>
            </header>

            <section className="conteudo-gestao">
                <div className="titulo-gestao">
                    <div>
                        <h2>Gestão de doadoras</h2>
                        <p>Acompanhe os cadastros e as doações de leite.</p>
                    </div>
                </div>

                {erro && <p className="erro-gestao">{erro}</p>}

                <section className="resumo-gestao">
                    <article className="cartao-resumo">
                        <span>Total de doadoras</span>
                        <strong>{resumo.total_doadoras}</strong>
                    </article>

                    <article className="cartao-resumo">
                        <span>Doadoras ativas</span>
                        <strong>{resumo.doadoras_ativas}</strong>
                    </article>

                    <article className="cartao-resumo">
                        <span>Doadoras inativas</span>
                        <strong>{resumo.doadoras_inativas}</strong>
                    </article>

                    <article className="cartao-resumo">
                        <span>Total de leite doado</span>
                        <strong>
                            {Number(resumo.total_leite_ml || 0).toLocaleString('pt-BR')} ml
                        </strong>
                    </article>
                </section>

                <section className="secao-doadoras">
                    <h3>Doadoras cadastradas</h3>

                    {doadoras.length === 0 ? (
                        <p className="sem-doadoras">
                            Nenhuma doadora cadastrada.
                        </p>
                    ) : (
                        <div className="tabela-responsiva">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>E-mail</th>
                                        <th>Status</th>
                                        <th>Leite doado</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {doadoras.map((doadora) => (
                                        <tr key={doadora.id}>
                                            <td>{doadora.nome}</td>
                                            <td>{doadora.email}</td>
                                            <td>
                                                <span className={`status-doadora ${String(doadora.status).toLowerCase()}`}>
                                                    {doadora.status}
                                                </span>
                                            </td>
                                            <td>
                                                {Number(doadora.volume_doado_ml || 0).toLocaleString('pt-BR')} ml
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}
