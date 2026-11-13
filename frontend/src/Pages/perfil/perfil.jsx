
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './perfil.scss';

const avatares = [
    { id: 'flor', nome: 'Flor', simbolo: 'F' },
    { id: 'lua', nome: 'Lua', simbolo: 'L' },
    { id: 'nuvem', nome: 'Nuvem', simbolo: 'N' },
    { id: 'estrela', nome: 'Estrela', simbolo: 'E' },
    { id: 'coracao', nome: 'Coração', simbolo: 'C' }
];

function Perfil() {
    const navegar = useNavigate();

    const [dados, setDados] = useState({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        data_nascimento: '',
        avatar: 'flor'
    });

    const [doacoes, setDoacoes] = useState([]);
    const [resumo, setResumo] = useState({
        total_ml: 0,
        total_doacoes: 0
    });
    const [doacoesMensais, setDoacoesMensais] = useState([]);

    const [quantidadeMl, setQuantidadeMl] = useState('');
    const [dataDoacao, setDataDoacao] = useState(
        new Date().toLocaleDateString('en-CA')
    );

    const [editando, setEditando] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('@lacos:token');

        if (!token) {
            navegar('/login');
            return;
        }

        carregarDados();
    }, [navegar]);

    async function carregarDados() {
        try {
            setCarregando(true);
            setErro('');

            const [
                respostaPerfil,
                respostaDoacoes,
                respostaResumo,
                respostaMensal
            ] = await Promise.all([
                api.get('/api/doadoras/perfil'),
                api.get('/doacoes'),
                api.get('/impacto'),
                api.get('/impacto/mensal')
            ]);

            const dadosPerfil =
                respostaPerfil.data.doadora || respostaPerfil.data;

            const dadosResumo =
                respostaResumo.data.resumo || respostaResumo.data;

            setDados({
                nome: dadosPerfil.nome || '',
                email: dadosPerfil.email || '',
                cpf: dadosPerfil.cpf || '',
                telefone: dadosPerfil.telefone || '',
                data_nascimento: dadosPerfil.data_nascimento
                    ? String(dadosPerfil.data_nascimento).substring(0, 10)
                    : '',
                avatar: dadosPerfil.avatar || 'flor'
            });

            const listaDoacoes = Array.isArray(respostaDoacoes.data)
                ? respostaDoacoes.data
                : respostaDoacoes.data.doacoes || [];

            setDoacoes(listaDoacoes);

            setResumo({
                total_ml: Number(dadosResumo.total_ml || 0),
                total_doacoes: Number(dadosResumo.total_doacoes || 0)
            });

            const listaMensal = Array.isArray(respostaMensal.data)
                ? respostaMensal.data
                : respostaMensal.data.mensal || [];

            setDoacoesMensais(listaMensal);

        } catch (erroResposta) {
            if (erroResposta.response?.status === 401) {
                localStorage.removeItem('@lacos:token');
                localStorage.removeItem('@lacos:doadora');
                navegar('/login');
                return;
            }

            setErro(
                erroResposta.response?.data?.mensagem ||
                'Não foi possível carregar os dados do perfil.'
            );
        } finally {
            setCarregando(false);
        }
    }

    function alterarDados(evento) {
        const { name, value } = evento.target;

        setDados((dadosAtuais) => ({
            ...dadosAtuais,
            [name]: value
        }));
    }

    async function salvarDados(evento) {
        evento.preventDefault();

        try {
            setErro('');
            setMensagem('');

            const resposta = await api.put('/api/doadoras/perfil', dados);

            const doadoraAtualizada =
                resposta.data.doadora || resposta.data;

            localStorage.setItem(
                '@lacos:doadora',
                JSON.stringify(doadoraAtualizada)
            );

            setEditando(false);
            setMensagem('Dados atualizados com sucesso.');

            await carregarDados();

        } catch (erroResposta) {
            setErro(
                erroResposta.response?.data?.mensagem ||
                'Não foi possível atualizar os dados.'
            );
        }
    }

    async function escolherAvatar(avatar) {
        try {
            setErro('');
            setMensagem('');

            await api.put('/api/doadoras/perfil', {
                ...dados,
                avatar
            });

            setDados((dadosAtuais) => ({
                ...dadosAtuais,
                avatar
            }));

            setMensagem('Avatar atualizado com sucesso.');

        } catch (erroResposta) {
            setErro(
                erroResposta.response?.data?.mensagem ||
                'Não foi possível atualizar o avatar.'
            );
        }
    }

    async function registrarDoacao(evento) {
        evento.preventDefault();

        const quantidade = Number(quantidadeMl);

        if (!Number.isInteger(quantidade) || quantidade <= 0) {
            setErro('Informe uma quantidade válida de ml.');
            return;
        }

        if (!dataDoacao) {
            setErro('Informe a data da doação.');
            return;
        }

        try {
            setErro('');
            setMensagem('');

            await api.post('/doacoes', {
                quantidade_ml: quantidade,
                data_doacao: dataDoacao
            });

            setQuantidadeMl('');
            setMensagem('Doação registrada com sucesso.');

            await carregarDados();

        } catch (erroResposta) {
            setErro(
                erroResposta.response?.data?.mensagem ||
                'Não foi possível registrar a doação.'
            );
        }
    }

    function formatarData(data) {
        if (!data) return 'Data não informada';

        const [ano, mes, dia] = String(data)
            .substring(0, 10)
            .split('-');

        if (!ano || !mes || !dia) return String(data);

        return `${dia}/${mes}/${ano}`;
    }

    function formatarMes(mes) {
        if (!mes) return '';

        const [ano, numeroMes] = String(mes).split('-');

        return new Date(
            Number(ano),
            Number(numeroMes) - 1,
            1
        ).toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric'
        });
    }

    if (carregando) {
        return (
            <main className="pagina-perfil-carregando">
                Carregando perfil...
            </main>
        );
    }

    return (
        <main className="pagina-perfil">

            <header className="cabecalho-perfil">
                <button
                    className="botao-voltar"
                    onClick={() => navegar('/')}
                >
                    Voltar para o início
                </button>

                <h1>Perfil</h1>
                <p>Acompanhe seus dados e suas doações.</p>
            </header>

            {mensagem && (
                <p className="mensagem-perfil">{mensagem}</p>
            )}

            {erro && (
                <p className="erro-perfil">{erro}</p>
            )}

            <section className="cartao-perfil">

                <div className="identificacao-doadora">
                    <div className="avatar-atual">
                        {
                            avatares.find(
                                (item) => item.id === dados.avatar
                            )?.simbolo || 'F'
                        }
                    </div>

                    <div>
                        <h2>{dados.nome || 'Doadora'}</h2>
                        <p>{dados.email}</p>
                        <span>Doadora cadastrada</span>
                    </div>
                </div>

                <div className="escolha-avatar">
                    <h3>Escolha seu avatar</h3>

                    <div className="lista-avatares">
                        {avatares.map((avatar) => (
                            <button
                                type="button"
                                key={avatar.id}
                                className={
                                    dados.avatar === avatar.id
                                        ? 'opcao-avatar selecionado'
                                        : 'opcao-avatar'
                                }
                                onClick={() => escolherAvatar(avatar.id)}
                            >
                                <span>{avatar.simbolo}</span>
                                <small>{avatar.nome}</small>
                            </button>
                        ))}
                    </div>
                </div>

            </section>

            <section className="estatisticas-perfil">

                <article className="cartao-estatistica">
                    <strong>
                        {resumo.total_ml.toLocaleString('pt-BR')} ml
                    </strong>
                    <p>Total de leite registrado</p>
                </article>

                <article className="cartao-estatistica">
                    <strong>{resumo.total_doacoes}</strong>
                    <p>Doações registradas</p>
                </article>

            </section>

            <section className="cartao-perfil">

                <div className="titulo-secao">
                    <div>
                        <h2>Dados pessoais</h2>
                        <p>Confira e atualize suas informações.</p>
                    </div>

                    <button
                        type="button"
                        className="botao-secundario"
                        onClick={() => setEditando(!editando)}
                    >
                        {editando ? 'Cancelar' : 'Editar dados'}
                    </button>
                </div>

                <form
                    className="formulario-perfil"
                    onSubmit={salvarDados}
                >

                    <label>
                        Nome completo
                        <input
                            name="nome"
                            value={dados.nome}
                            onChange={alterarDados}
                            disabled={!editando}
                            required
                        />
                    </label>

                    <label>
                        E-mail
                        <input
                            type="email"
                            name="email"
                            value={dados.email}
                            onChange={alterarDados}
                            disabled={!editando}
                            required
                        />
                    </label>

                    <label>
                        CPF
                        <input
                            name="cpf"
                            value={dados.cpf}
                            onChange={alterarDados}
                            disabled={!editando}
                        />
                    </label>

                    <label>
                        Telefone
                        <input
                            name="telefone"
                            value={dados.telefone}
                            onChange={alterarDados}
                            disabled={!editando}
                        />
                    </label>

                    <label>
                        Data de nascimento
                        <input
                            type="date"
                            name="data_nascimento"
                            value={dados.data_nascimento}
                            onChange={alterarDados}
                            disabled={!editando}
                        />
                    </label>

                    {editando && (
                        <button
                            className="botao-principal"
                            type="submit"
                        >
                            Salvar alterações
                        </button>
                    )}

                </form>

            </section>

            <section className="cartao-perfil">

                <h2>Registrar doação</h2>
                <p>Informe a quantidade de leite e a data da doação.</p>

                <form
                    className="formulario-perfil formulario-doacao"
                    onSubmit={registrarDoacao}
                >

                    <label>
                        Quantidade de leite (ml)
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={quantidadeMl}
                            onChange={(evento) =>
                                setQuantidadeMl(evento.target.value)
                            }
                            placeholder="Ex.: 150"
                            required
                        />
                    </label>

                    <label>
                        Data da doação
                        <input
                            type="date"
                            value={dataDoacao}
                            onChange={(evento) =>
                                setDataDoacao(evento.target.value)
                            }
                            required
                        />
                    </label>

                    <button
                        className="botao-principal"
                        type="submit"
                    >
                        Registrar doação
                    </button>

                </form>

            </section>

            <section className="cartao-perfil">

                <h2>Histórico de doações</h2>

                {doacoes.length === 0 ? (
                    <p className="texto-vazio">
                        Você ainda não possui doações registradas.
                    </p>
                ) : (
                    <div className="lista-doacoes">
                        {doacoes.map((doacao) => (
                            <article
                                className="item-doacao"
                                key={doacao.id}
                            >
                                <div>
                                    <strong>
                                        {Number(
                                            doacao.quantidade_ml
                                        ).toLocaleString('pt-BR')} ml
                                    </strong>
                                    <p>Doação registrada</p>
                                </div>

                                <span>
                                    {formatarData(doacao.data_doacao)}
                                </span>
                            </article>
                        ))}
                    </div>
                )}

            </section>

            <section className="cartao-perfil">

                <h2>Resumo mensal</h2>

                {doacoesMensais.length === 0 ? (
                    <p className="texto-vazio">
                        Ainda não há dados mensais para mostrar.
                    </p>
                ) : (
                    <div className="lista-mensal">
                        {doacoesMensais.map((item) => {
                            const valor = Number(item.quantidade_ml || 0);

                            const maiorValor = Math.max(
                                ...doacoesMensais.map((registro) =>
                                    Number(registro.quantidade_ml || 0)
                                ),
                                1
                            );

                            return (
                                <div
                                    className="item-mensal"
                                    key={item.mes}
                                >
                                    <div className="informacao-mes">
                                        <span>{formatarMes(item.mes)}</span>
                                        <strong>
                                            {valor.toLocaleString('pt-BR')} ml
                                        </strong>
                                    </div>

                                    <div className="fundo-barra">
                                        <div
                                            className="barra-mensal"
                                            style={{
                                                width: `${(valor / maiorValor) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </section>

        </main>
    );
}

export default Perfil;
