
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import './Home.scss';
import logoImg from '../../assets/lacomaterno.png';
import heroImg from '../../assets/nenememae.jpg';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

function AjustarMapa({ bancos }) {
    const mapa = useMap();

    useEffect(() => {
        const pontos = bancos
            .filter(banco => banco.latitude != null && banco.longitude != null)
            .map(banco => [Number(banco.latitude), Number(banco.longitude)])
            .filter(([latitude, longitude]) =>
                Number.isFinite(latitude) && Number.isFinite(longitude)
            );

        if (pontos.length === 1) {
            mapa.setView(pontos[0], 14);
        } else if (pontos.length > 1) {
            mapa.fitBounds(pontos, { padding: [30, 30], maxZoom: 14 });
        } else {
            mapa.setView([-22.8932, -47.0543], 6);
        }
    }, [bancos, mapa]);

    return null;
}

export default function Home() {
    const navigate = useNavigate();

    const [busca, setBusca] = useState('');
    const [bancos, setBancos] = useState([]);
    const [totalBancos, setTotalBancos] = useState(0);
    const [dashboard, setDashboard] = useState(null);
    const [usuario, setUsuario] = useState(null);

    const coordenadasCampinas = [-22.8932, -47.0543];

    useEffect(() => {
        const doadoraSalva =
            localStorage.getItem('@lacos:doadora') ||
            localStorage.getItem('usuario');

        if (doadoraSalva) {
            try {
                setUsuario(JSON.parse(doadoraSalva));
            } catch (erro) {
                console.error('Erro ao ler os dados do usuário:', erro);
            }
        }

        api.get('/admin/dashboard')
            .then(res => setDashboard(res.data))
            .catch(erro => console.error('Erro ao carregar o dashboard:', erro));

        carregarBancos();
    }, []);

    function carregarBancos() {
        api.get('/banco-leite')
            .then(res => {
                const lista = Array.isArray(res.data) ? res.data : [];
                setBancos(lista);
                setTotalBancos(lista.length);
            })
            .catch(erro => {
                console.error('Erro ao carregar os bancos de leite:', erro);
                setBancos([]);
                setTotalBancos(0);
            });
    }

    function irParaLogin() {
        navigate('/login');
    }

    function irParaCadastro() {
        navigate('/cadastro');
    }

    function handleLogout() {
        localStorage.removeItem('@lacos:token');
        localStorage.removeItem('@lacos:doadora');
        localStorage.removeItem('usuario');

        setUsuario(null);
        navigate('/');
    }

    function buscarBanco(e) {
        e.preventDefault();

        api.get('/banco-leite', {
            params: { busca: busca.trim() }
        })
            .then(res => {
                const lista = Array.isArray(res.data) ? res.data : [];
                setBancos(lista);
                setTotalBancos(lista.length);
            })
            .catch(erro => {
                console.error('Erro ao buscar banco de leite:', erro);
            });
    }

    function mostrarTodosBancos() {
        setBusca('');
        carregarBancos();
    }

    function rolarParaSecao(id) {
        document.getElementById(id)?.scrollIntoView({
            behavior: 'smooth'
        });
    }

    return (
        <div className="pagina-inicial">

            <header className="cabecalho">
                <div className="area-logo">
                    <img
                        src={logoImg}
                        alt="Laços Maternos"
                        className="imagem-logo"
                    />
                </div>

                <nav className="menu-navegacao">
                    <a href="#inicio" className="link-ativo">
                        Início
                    </a>

                    <a href="#por-que-doar">
                        Por que doar
                    </a>

                    <a href="#como-funciona">
                        Como funciona
                    </a>

                    <a href="#servicos">
                        Bancos de leite
                    </a>

                    <a href="#campanhas">
                        Campanhas
                    </a>

                    <Link to="/quiz">
                        Pré-triagem
                    </Link>
                </nav>

                <div className="botoes-cabecalho">
                    {usuario ? (
                        <div className="menu-usuario">
                            <span className="nome-usuario">
                                Olá, <strong>{usuario.nome?.split(' ')[0] || 'Doadora'}</strong>
                            </span>

                            <button
                                type="button"
                                className="botao-secundario"
                                onClick={() => navigate('/perfil')}
                            >
                                Meu Perfil
                            </button>

                            <button
                                type="button"
                                className="botao-contorno"
                                onClick={handleLogout}
                            >
                                Sair
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="botao-secundario"
                                onClick={irParaLogin}
                            >
                                Entrar
                            </button>

                            <button
                                type="button"
                                className="botao-principal"
                                onClick={irParaCadastro}
                            >
                                Quero Doar
                            </button>
                        </>
                    )}
                </div>
            </header>

            <section className="secao-destaque" id="inicio">
                <div className="conteudo-destaque">
                    <span className="etiqueta-projeto">
                        PROJETO ACADÊMICO TCC
                    </span>

                    <h1>
                        Seu leite pode transformar
                        <br />
                        pequenos começos em
                        <br />
                        <span>grandes histórias de vida.</span>
                    </h1>

                    <p>
                        Conectamos você aos Bancos de Leite Humano para tornar a doação mais simples,
                        segura e acessível. Um pequeno gesto que pode fazer diferença na vida de bebês prematuros.
                    </p>

                    <div className="botoes-destaque">
                        <button
                            type="button"
                            className="botao-principal"
                            onClick={irParaCadastro}
                        >
                            Quero Doar
                        </button>

                        <button
                            type="button"
                            className="botao-contorno"
                            onClick={() => rolarParaSecao('como-funciona')}
                        >
                            Como funciona
                        </button>
                    </div>

                    <div className="selo-apoio">
                        <span className="ponto-decorativo">•</span>

                        <span>
                            Apoiando a Rede Brasileira de Bancos de Leite Humano (rBLH)
                        </span>
                    </div>
                </div>

                <div className="area-imagem-destaque">
                    <div className="moldura-imagem">
                        <img
                            src={heroImg}
                            alt="Pezinho de uma bebê"
                        />

                        <div className="selo selo-seguranca"></div>
                    </div>
                </div>
            </section>

            <section className="secao-indicadores">
                <h2>Força coletiva para salvar vidas</h2>

                <div className="grade-indicadores">
                    <div className="cartao-indicador">
                        <h3>{totalBancos}</h3>
                        <h4>Bancos de Leite Humano</h4>
                        <p>Bancos cadastrados na plataforma.</p>
                    </div>

                    <div className="cartao-indicador">
                        <h3>
                            {dashboard ? dashboard.total_doado_litros + ' L' : '...'}
                        </h3>
                        <h4>Leite doado</h4>
                        <p>Volume total registrado pelas doadoras.</p>
                    </div>

                    <div className="cartao-indicador">
                        <h3>
                            {dashboard ? dashboard.total_doadoras : '...'}
                        </h3>
                        <h4>Doadoras cadastradas</h4>
                        <p>Mulheres cadastradas na plataforma.</p>
                    </div>

                    <div className="cartao-indicador em-destaque">
                        <h3>1 Gesto</h3>
                        <h4>Transforma Vidas</h4>
                        <p>Cada doação representa um gesto de solidariedade.</p>
                    </div>
                </div>
            </section>

            <section className="secao-beneficios" id="por-que-doar">
                <h2>Por que doar leite materno?</h2>

                <p className="descricao-secao">
                    A doação de leite humano é mais do que nutrição: é um ato de proteção
                    essencial para recém-nascidos que precisam desse cuidado.
                </p>

                <div className="grade-beneficios">
                    <div className="cartao-beneficio">
                        <h3>Para o bebê</h3>
                        <p>
                            Contribui para a alimentação e o desenvolvimento de recém-nascidos,
                            especialmente prematuros e de baixo peso.
                        </p>
                    </div>
                    <div className="cartao-beneficio">
                        <h3>Para a saúde</h3>
                        <p>
                            O leite humano contém nutrientes e componentes de defesa importantes
                            para a saúde do bebê.
                        </p>
                    </div>

                    <div className="cartao-beneficio">
                        <h3>Para a sociedade</h3>

                        <p>
                            Cada quantidade doada importa e ajuda a fortalecer a rede de
                            solidariedade entre as famílias.
                        </p>
                    </div>
                </div>
            </section>

            <section className="secao-como-funciona" id="como-funciona">
                <span className="subtitulo-secao">
                    PASSO A PASSO
                </span>

                <h2>Como funciona a doação?</h2>

                <p className="descricao-secao">
                    Veja as principais etapas para participar do processo de doação.
                </p>

                <div className="grade-etapas">
                    <div className="cartao-etapa">
                        <span className="numero-etapa">01</span>
                        <h3>Cadastre-se</h3>
                        <p>Crie sua conta gratuitamente no Laços Maternos.</p>
                    </div>

                    <div className="cartao-etapa">
                        <span className="numero-etapa">02</span>
                        <h3>Pré-triagem</h3>
                        <p>Responda ao questionário inicial sobre sua saúde.</p>
                    </div>

                    <div className="cartao-etapa">
                        <span className="numero-etapa">03</span>
                        <h3>Escolha o banco</h3>
                        <p>Consulte os bancos de leite disponíveis na plataforma.</p>
                    </div>
                </div>

                <div className="caixa-informativa">
                    <span className="icone-informativo">ℹ</span>

                    <p>
                        <strong>Nota importante:</strong> As condições para doação devem ser
                        avaliadas e confirmadas pelo Banco de Leite e pelos profissionais de saúde responsáveis.
                    </p>
                </div>
            </section>

            <section className="secao-localizacao" id="servicos">
                <span className="subtitulo-secao">
                    PROXIMIDADE
                </span>

                <h2>Encontre um Banco de Leite</h2>

                <div className="conteudo-localizacao">
                    <div className="painel-busca">
                        <label htmlFor="campo-busca">
                            Digite o nome do banco ou o endereço:
                        </label>

                        <form
                            onSubmit={buscarBanco}
                            className="formulario-busca"
                        >
                            <input
                                id="campo-busca"
                                type="text"
                                placeholder="Ex.: Campinas"
                                value={busca}
                                onChange={e => setBusca(e.target.value)}
                            />

                            <button
                                type="submit"
                                className="botao-buscar"
                            >
                                Buscar
                            </button>
                        </form>

                        <button
                            type="button"
                            className="botao-mostrar-todos"
                            onClick={mostrarTodosBancos}
                        >
                            Mostrar todos os bancos
                        </button>

                        {bancos.map(banco => (
                            <div className="cartao-banco" key={banco.id}>
                                <div className="cabecalho-banco">
                                    <h3>{banco.nome}</h3>
                                </div>

                                <div className="etiquetas-status">
                                    <span
                                        className={`etiqueta-status ${banco.abertoHoje ? 'aberto' : ''}`}
                                    >
                                        {banco.abertoHoje
                                            ? 'ABERTO HOJE'
                                            : 'HORÁRIO NÃO CONFIRMADO'}
                                    </span>

                                    {banco.coletaDomiciliar && (
                                        <span className="etiqueta-coleta">
                                            Coleta domiciliar
                                        </span>
                                    )}
                                </div>

                                <p className="informacoes-endereco">
                                    <strong>Endereço:</strong> {banco.endereco}
                                    <br />
                                    <strong>Telefone:</strong> {banco.telefone || 'Não informado'}
                                    <br />
                                    <strong>Horário:</strong> {banco.horario || 'Consultar banco'}
                                </p>

                                {banco.descricao && (
                                    <p className="descricao-banco">
                                        {banco.descricao}
                                    </p>
                                )}

                                <div className="acoes-banco">
                                    {banco.telefone && (
                                        <a
                                            className="botao-contato"
                                            href={`tel:${banco.telefone}`}
                                        >
                                            Entrar em contato
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}

                        {bancos.length === 0 && (
                            <p className="mensagem-sem-bancos">
                                Nenhum banco encontrado. Tente pesquisar por outro nome ou endereço.
                            </p>
                        )}
                    </div>

                    <div className="area-mapa">
                        <MapContainer
                            center={coordenadasCampinas}
                            zoom={6}
                            scrollWheelZoom={false}
                            className="mapa-bancos"
                        >
                            <AjustarMapa bancos={bancos} />

                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {bancos.map(banco => (
                                banco.latitude != null &&
                                banco.longitude != null && (
                                    <Marker
                                        key={banco.id}
                                        position={[
                                            Number(banco.latitude),
                                            Number(banco.longitude)
                                        ]}
                                    >
                                        <Popup>
                                            <strong>{banco.nome}</strong>
                                            <br />
                                            {banco.endereco}
                                            <br />
                                            Telefone: {banco.telefone || 'Não informado'}
                                            <br />
                                            Horário: {banco.horario || 'Consultar banco'}
                                        </Popup>
                                    </Marker>
                                )
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </section>

            <section className="secao-campanha" id="campanhas">
                <div className="cartao-campanha">
                    <div className="informacoes-campanha">
                        <span className="etiqueta-campanha">
                            CAMPANHA NACIONAL
                        </span>

                        <h2>Doe Leite Materno: Vida em cada gota</h2>

                        <p>
                            Participe da rede de solidariedade para apoiar mães doadoras
                            e ajudar bebês prematuros internados em UTIs neonatais.
                        </p>

                        <div className="acoes-campanha">
                            <button
                                type="button"
                                className="botao-principal"
                                onClick={irParaCadastro}
                            >
                                Quero Participar
                            </button>

                            <button
                                type="button"
                                className="botao-contorno"
                                onClick={() => rolarParaSecao('servicos')}
                            >
                                Ver bancos de leite
                            </button>
                        </div>
                    </div>

                    <div className="imagem-campanha"></div>
                </div>
            </section>

            <footer className="rodape">
                <div className="parte-superior-rodape">
                    <div className="marca-rodape">
                        <div className="area-logo">
                            <img
                                src={logoImg}
                                alt="Laços Maternos"
                                className="imagem-logo"
                            />
                        </div>

                        <p>
                            Uma ponte digital de solidariedade para apoiar mães doadoras
                            e ajudar a cuidar de recém-nascidos.
                        </p>
                    </div>

                    <div className="grupo-links-rodape">
                        <div className="coluna-rodape">
                            <h4>Plataforma</h4>
                            <a href="#como-funciona">Como doar</a>
                            <a href="#servicos">Bancos de leite</a>
                            <a href="#campanhas">Campanhas</a>
                        </div>

                        <div className="coluna-rodape">
                            <h4>Parceiros oficiais</h4>

                            <a
                                href="https://rblh.fiocruz.br/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Rede Brasileira rBLH
                            </a>

                            <a
                                href="https://www.gov.br/saude"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Ministério da Saúde
                            </a>

                            <a
                                href="https://portal.fiocruz.br/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Fiocruz
                            </a>
                        </div>
                    </div>
                </div>

                <div className="parte-inferior-rodape">
                    <div>
                        <strong>Laços Maternos</strong>

                        <p>
                            Projeto acadêmico desenvolvido para fins de Trabalho de
                            Conclusão de Curso (TCC). Sem fins lucrativos.
                        </p>
                    </div>

                    <div className="apoio-institucional">
                        <span>APOIO INSTITUCIONAL:</span>
                        <strong>SUS</strong>
                        <strong>FIOCRUZ</strong>
                    </div>
                </div>
            </footer>
        </div>
    );
}
