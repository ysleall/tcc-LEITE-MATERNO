
import { useEffect, useState } from 'react';
import './index.scss';

export default function Quiz() {
    const [perguntas, setPerguntas] = useState([]);
    const [respostas, setRespostas] = useState({});
    const [resultado, setResultado] = useState(null);
    const [carregando, setCarregando] = useState(true);

    const API = 'http://localhost:2026';

    useEffect(() => {
        carregarPerguntas();
    }, []);

    async function carregarPerguntas() {
        try {
            let resposta = await fetch(`${API}/quiz`);
            let dados = await resposta.json();

            setPerguntas(dados);
        } catch (erro) {
            alert('Erro ao carregar as perguntas!');
        }

        setCarregando(false);
    }

    function escolherResposta(id, resposta) {
        setRespostas({
            ...respostas,
            [id]: resposta
        });
    }

    async function finalizarQuiz() {
        if (Object.keys(respostas).length !== perguntas.length) {
            alert('Responda todas as perguntas!');
            return;
        }

        try {
            let resposta = await fetch(`${API}/quiz/resultado`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    respostas: respostas
                })
            });

            let dados = await resposta.json();

            setResultado(dados);

        } catch (erro) {
            alert('Erro ao verificar suas respostas!');
        }
    }

    if (carregando) {
        return <p>Carregando perguntas...</p>;
    }

    return (
        <div className="quiz">

            <div className="conteudo">

                <p className="etapa">PASSO INICIAL ESSENCIAL</p>

                <h1>Vamos verificar algumas informações iniciais.</h1>

                <p className="descricao">
                    Esta pré-triagem ajuda a identificar alguns critérios
                    básicos para iniciar o processo de doação de leite materno.
                </p>

                {resultado === null ? (

                    <>
                        {perguntas.map((item, index) => (

                            <div className="pergunta" key={item.id}>

                                <div className="topo">
                                    <span>PERGUNTA ATUAL</span>
                                    <span>{index + 1} / {perguntas.length}</span>
                                </div>

                                <h2>{item.pergunta}</h2>

                                <div className="quiz-opcoes">

                                    <button
                                        className={
                                            respostas[item.id] === item.opcao_a
                                                ? 'selecionado'
                                                : ''
                                        }
                                        onClick={() =>
                                            escolherResposta(item.id, item.opcao_a)
                                        }
                                    >
                                        {item.opcao_a}
                                    </button>

                                    <button
                                        className={
                                            respostas[item.id] === item.opcao_b
                                                ? 'selecionado'
                                                : ''
                                        }
                                        onClick={() =>
                                            escolherResposta(item.id, item.opcao_b)
                                        }
                                    >
                                        {item.opcao_b}
                                    </button>

                                </div>

                            </div>

                        ))}

                        <button
                            className="finalizar"
                            onClick={finalizarQuiz}
                        >
                            Finalizar pré-triagem
                        </button>
                    </>

                ) : (

                    <div className="resultado">

                        <h2>
                            {resultado.apta
                                ? 'Pré-triagem concluída!'
                                : 'Pré-triagem concluída'}
                        </h2>

                        <p>{resultado.mensagem}</p>

                        <button onClick={() => {
                            setRespostas({});
                            setResultado(null);
                        }}>
                            Refazer pré-triagem
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}
