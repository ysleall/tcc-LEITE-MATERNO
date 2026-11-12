
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../services/api';
import logoImg from '../../assets/lacomaterno.png';

import '../Home/Home.scss';
import './index.scss';

export default function Quiz() {
    const navigate = useNavigate();

    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState({});
    const [resultado, setResultado] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [perguntaAtual, setPerguntaAtual] = useState(0);

  
    const [estaLogada] = useState(() => {
        return Boolean(localStorage.getItem('@lacos:token'));
    });

    useEffect(() => {
        carregarPerguntas();
    }, []);

    async function carregarPerguntas() {
        try {
            setCarregando(true);
            setErro('');

            const resposta = await api.get('/quiz');

            setPerguntas(resposta.data);

        } catch (erro) {
            console.error('Erro ao carregar perguntas:', erro);
            setErro('Não foi possível carregar as perguntas.');
        } finally {
            setCarregando(false);
        }
    }

    function escolherResposta(id, resposta) {
        setRespostas({
            ...respostas,
            [id]: resposta
        });
    }

    function proximaPergunta() {
        const pergunta = perguntas[perguntaAtual];

        if (!respostas[pergunta.id]) {
            alert('Escolha uma resposta antes de continuar!');
            return;
        }

        setPerguntaAtual(perguntaAtual + 1);
    }

    function voltarPergunta() {
        setPerguntaAtual(perguntaAtual - 1);
    }

    async function finalizarQuiz() {
        const pergunta = perguntas[perguntaAtual];

        if (!respostas[pergunta.id]) {
            alert('Escolha uma resposta antes de finalizar!');
            return;
        }

        try {
            const resposta = await api.post('/quiz/resultado', {
                respostas: respostas
            });

            setResultado(resposta.data);

        } catch (erro) {
            console.error('Erro ao finalizar pré-triagem:', erro);
            alert('Erro ao verificar suas respostas!');
        }
    }

    function refazerQuiz() {
        setRespostas({});
        setResultado(null);
        setPerguntaAtual(0);
    }

    if (carregando) {
        return <p>Carregando perguntas...</p>;
    }

    const pergunta = perguntas[perguntaAtual];

    return (
        <div className="pagina-inicial">

            <header className="cabecalho">

                <div className="area-logo">
                    <img
                        src={logoImg}
                        alt="Laços Maternos"
                        className="imagem-logo"
                        onClick={() => navigate('/')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <nav className="menu-navegacao">
                    <a href="/#inicio">Início</a>
                    <a href="/#por-que-doar">Por que doar</a>
                    <a href="/#como-funciona">Como funciona</a>
                    <a href="/#servicos">Bancos de Leite</a>

                    <a href="/quiz" className="link-ativo">
                        Pré-triagem
                    </a>
                </nav>

                <div className="botoes-cabecalho">

                    {estaLogada ? (

                        <button
                            className="botao-principal"
                            onClick={() => navigate('/perfil')}
                        >
                            Meu perfil 
                        </button>

                    ) : (

                        <>
                            <button
                                className="botao-secundario"
                                onClick={() => navigate('/login')}
                            >
                                Entrar
                            </button>

                            <button
                                className="botao-principal"
                                onClick={() => navigate('/cadastro')}
                            >
                                Quero Doar
                            </button>
                        </>

                    )}

                </div>

            </header>

            <div className="quiz">

                <div className="conteudo">

                    <p className="etapa">
                        PASSO INICIAL ESSENCIAL
                    </p>

                    <h1>
                        Vamos verificar algumas informações iniciais.
                    </h1>

                    <p className="descricao">
                        Esta pré-triagem ajuda a identificar alguns critérios
                        básicos para iniciar o processo de doação de leite materno.
                    </p>

                    {erro ? (

                        <div className="resultado">
                            <p>{erro}</p>

                            <button onClick={carregarPerguntas}>
                                Tentar novamente
                            </button>
                        </div>

                    ) : perguntas.length === 0 ? (

                        <div className="resultado">
                            <p>Nenhuma pergunta encontrada.</p>
                        </div>

                    ) : resultado !== null ? (

                        <div className="resultado">

                            <h2>Pré-triagem concluída!</h2>

                            <p>{resultado.mensagem}</p>

                            <button onClick={refazerQuiz}>
                                Refazer pré-triagem
                            </button>

                        </div>

                    ) : (

                        <div className="pergunta">

                            <div className="topo">

                                <span>PERGUNTA ATUAL</span>

                                <span>
                                    {perguntaAtual + 1} / {perguntas.length}
                                </span>

                            </div>

                            <h2>{pergunta.pergunta}</h2>

                            <div className="opcoes">

                                <button
                                    className={
                                        respostas[pergunta.id] === pergunta.opcao_a
                                            ? 'selecionado'
                                            : ''
                                    }
                                    onClick={() =>
                                        escolherResposta(
                                            pergunta.id,
                                            pergunta.opcao_a
                                        )
                                    }
                                >
                                    {pergunta.opcao_a}
                                </button>

                                <button
                                    className={
                                        respostas[pergunta.id] === pergunta.opcao_b
                                            ? 'selecionado'
                                            : ''
                                    }
                                    onClick={() =>
                                        escolherResposta(
                                            pergunta.id,
                                            pergunta.opcao_b
                                        )
                                    }
                                >
                                    {pergunta.opcao_b}
                                </button>

                            </div>

                            <div className="navegacao-quiz">

                                {perguntaAtual > 0 && (
                                    <button
                                        className="voltar"
                                        onClick={voltarPergunta}
                                    >
                                        Voltar
                                    </button>
                                )}

                                {perguntaAtual === perguntas.length - 1 ? (

                                    <button
                                        className="finalizar"
                                        onClick={finalizarQuiz}
                                    >
                                        Finalizar pré-triagem
                                    </button>

                                ) : (

                                    <button
                                        className="finalizar"
                                        onClick={proximaPergunta}
                                    >
                                        Próxima pergunta
                                    </button>

                                )}

                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
