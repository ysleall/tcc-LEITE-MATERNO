import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Home.scss';
import logoImg from '../../assets/lacomaterno.png';
import heroImg from '../../assets/amarmentar.png';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Home() {
  const navigate = useNavigate();
  const [cep, setCep] = useState('');
  const [usuario, setUsuario] = useState(null);
  const coordenadasCampinas = [-22.8932, -47.0543];

  useEffect(() => {
    const doadoraSalva = localStorage.getItem('@lacos:doadora') || localStorage.getItem('usuario');
    if (doadoraSalva) {
      try {
        setUsuario(JSON.parse(doadoraSalva));
      } catch (e) {
        console.error('Erro ao ler dados do localStorage:', e);
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem('@lacos:token');
    localStorage.removeItem('@lacos:doadora');
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/');
  }

  function buscarCep(e) {
    e.preventDefault();
    if (!cep.trim()) {
      alert('Por favor, digite um CEP válido.');
      return;
    }
    alert(`Buscando pontos de coleta próximos ao CEP: ${cep}`);
  }

  function rolarParaSecao(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function irParaLogin() {
    navigate('/login');
  }

  function irParaCadastro() {
    navigate('/cadastro');
  }

  function contatarBanco() {
    alert('Telefone do Banco de Leite de Campinas: (19) 3306-6000');
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="logo-container">
          <img src={logoImg} alt="Laços Maternos" className="logo" />
        </div>

        <nav className="nav-menu">
          <a href="#inicio" className="active">Início</a>
          <a href="#por-que-doar">Por que doar</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#servicos">Serviços de Leite</a>
          <a href="#campanhas">Campanhas</a>
        </nav>

        <div className="header-actions">
          {usuario ? (
            <div className="menu-usuario">
              <span className="nome-usuario">
                Olá, <strong>{usuario.nome?.split(' ')[0] || 'Doadora'}</strong>
              </span>
              <button className="btn-secondary btn-perfil" onClick={() => navigate('/perfil')}>
                Meu Perfil
              </button>
              <button className="btn-outline btn-sair" onClick={handleLogout}>
                Sair
              </button>
            </div>
          ) : (
            <>
              <button className="btn-secondary" onClick={irParaLogin}>Entrar</button>
              <button className="btn-primary" onClick={irParaCadastro}>Quero Doar</button>
            </>
          )}
        </div>
      </header>

      <section className="hero-section" id="inicio">
        <div className="hero-content">
          <span className="tag-academic">PROJETO ACADÊMICO TCC</span>
          <h1>
            Seu leite pode criar <br />
            novos laços e <br />
            <span>transformar vidas.</span>
          </h1>
          <p>
            Conectamos você aos Bancos de Leite Humano para tornar a doação mais simples, 
            segura e acessível. Um pequeno gesto que salva vidas de bebês prematuros.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={irParaCadastro}>Quero Doar</button>
            <button className="btn-outline" onClick={() => rolarParaSecao('como-funciona')}>Como funciona</button>
          </div>

          <div className="hero-seal">
            <span className="dot">•</span>
            <span>Apoiando a Rede Brasileira de Bancos de Leite Humano (rBLH)</span>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="image-frame">
            <img src={heroImg} alt="Mãe amamentando o bebê" />
            <div className="badge badge-safe">
              <span>💧 100% Seguro</span>
              <small>Triagem rigorosa</small>
            </div>
          </div>
        </div>
      </section>

      <section className="metrics-section">
        <span className="section-subtitle">NOSSO IMPACTO SOCIAL</span>
        <h2>Força coletiva para salvar vidas</h2>

        <div className="metrics-grid">
          <div className="metric-card">
            <h3>+220</h3>
            <h4>Bancos de Leite Humano</h4>
            <p>Instalações oficiais espalhadas por todo o Brasil.</p>
          </div>

          <div className="metric-card">
            <h3>+240</h3>
            <h4>Postos de Coleta</h4>
            <p>Pontos estratégicos para facilitar a entrega de leite.</p>
          </div>

          <div className="metric-card">
            <h3>Milhares</h3>
            <h4>Recém-nascidos beneficiados</h4>
            <p>Vidas de pequenos prematuros salvas todos os anos.</p>
          </div>

          <div className="metric-card highlight">
            <h3>1 Gesto</h3>
            <h4>Transforma Vidas</h4>
            <p>Uma única doação alimenta diversos bebês internados.</p>
          </div>
        </div>
      </section>

      <section className="why-donate-section" id="por-que-doar">
        <span className="section-subtitle">CONSCIÊNCIA E AMOR</span>
        <h2>Por que doar leite materno?</h2>
        <p className="section-desc">
          A doação de leite humano é mais do que nutrição: é um ato de proteção essencial para a sobrevivência de recém-nascidos internados.
        </p>

        <div className="why-donate-grid">
          <div className="why-card">
            <div className="icon-wrapper pink">👶</div>
            <h3>Para o bebê</h3>
            <p>Contribui diretamente para o desenvolvimento e alimentação de recém-nascidos prematuros e de baixo peso em UTIs neonatais.</p>
          </div>

          <div className="why-card">
            <div className="icon-wrapper purple">🩺</div>
            <h3>Para a saúde</h3>
            <p>O leite humano é um alimento vivo, repleto de anticorpos e componentes imunológicos essenciais para a proteção natural do bebê.</p>
          </div>

          <div className="why-card">
            <div className="icon-wrapper green">🤝</div>
            <h3>Para a sociedade</h3>
            <p>Apenas 1 ml de leite materno já faz a diferença. Uma única doação pode amparar e alimentar diversos bebês vulneráveis.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section" id="como-funciona">
        <span className="section-subtitle">PASSO A PASSO</span>
        <h2>Como funciona a doação?</h2>
        <p className="section-desc">Simplificamos o processo para que você se concentre apenas no amor que está compartilhando. Veja as etapas principais:</p>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <h3>Cadastre-se</h3>
            <p>Crie sua conta gratuitamente no Laços Maternos em poucos minutos.</p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>
            <h3>Pré-triagem</h3>
            <p>Responda um questionário de saúde rápido baseado nos critérios oficiais.</p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>
            <h3>Escolha o Banco</h3>
            <p>Localize o Banco de Leite Humano ou Posto de Coleta mais próximo.</p>
          </div>

          <div className="step-card">
            <span className="step-number">04</span>
            <h3>Agende a Coleta</h3>
            <p>Defina o melhor horário. Diversos bancos oferecem busca domiciliar.</p>
          </div>
        </div>

        <div className="info-box">
          <span className="info-icon">ℹ️</span>
          <p><strong>Nota importante:</strong> Todas as condições para doação devem ser avaliadas e confirmadas formalmente pelo Banco de Leite e pelos profissionais de saúde responsáveis, em conformidade com as diretrizes da Fiocruz e da ANVISA.</p>
        </div>
      </section>

      <section className="locator-section" id="servicos">
        <span className="section-subtitle">PROXIMIDADE</span>
        <h2>Existe um Banco de Leite perto de você.</h2>

        <div className="locator-container">
          <div className="locator-search-panel">
            <label htmlFor="cep-input">Digite seu CEP para localizar o ponto mais próximo:</label>
            <form onSubmit={buscarCep} className="search-form">
              <input 
                id="cep-input"
                type="text" 
                placeholder="13012-100" 
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
              <button type="submit" className="btn-search">Buscar</button>
            </form>

            <div className="location-card">
              <div className="location-header">
                <div>
                  <h3>Banco de Leite Humano – Campinas</h3>
                  <small>Maternidade de Campinas</small>
                </div>
                <span className="distance-badge">2.4 km</span>
              </div>
              <div className="status-tags">
                <span className="tag-status open">ABERTO HOJE</span>
                <span className="tag-service">Coleta domiciliar disponível</span>
              </div>
              <p className="address-info">
                <strong>Horário:</strong> 08:00 às 17:00<br />
                <strong>Endereço:</strong> Av. Orosimbo Maia, 165 - Vila Itapura, Campinas - SP
              </p>
              <div className="location-actions">
                <button className="btn-outline-sm" onClick={() => alert('Endereço: Av. Orosimbo Maia, 165. Telefone: (19) 3306-6000')}>Ver detalhes</button>
                <button className="btn-primary-sm" onClick={contatarBanco}>Entrar em contato</button>
              </div>
            </div>
          </div>

          <div className="locator-map-realtime">
            <MapContainer 
              center={coordenadasCampinas} 
              zoom={14} 
              scrollWheelZoom={false}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={coordenadasCampinas}>
                <Popup>
                  <strong>Banco de Leite Humano - Campinas</strong><br />
                  Maternidade de Campinas<br />
                  Aberto hoje (08:00 - 17:00)
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </section>

      <section className="campaign-banner-section" id="campanhas">
        <div className="campaign-card">
          <div className="campaign-info">
            <span className="campaign-tag">CAMPANHA NACIONAL</span>
            <h2>Doe Leite Materno: Vida em cada gota</h2>
            <p>
              Participe da rede de solidariedade para apoiar mães doadoras e alimentar bebês prematuros internados em UTIs neonatais de todo o Brasil.
            </p>
            <div className="campaign-actions">
              <button className="btn-primary" onClick={irParaCadastro}>Quero Participar</button>
              <button className="btn-outline" onClick={() => rolarParaSecao('servicos')}>Ver Postos Próximos</button>
            </div>
          </div>
          <div className="campaign-image">
            <img src={heroImg} alt="Campanha Doe Leite" />
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo-container">
              <img src={logoImg} alt="Laços Maternos" className="logo" />
            </div>
            <p>Uma ponte digital de solidariedade para apoiar mães doadoras e proteger a vida de milhares de recém-nascidos brasileiros.</p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Plataforma</h4>
              <a href="#como-funciona" onClick={() => rolarParaSecao('como-funciona')}>Como doar</a>
              <a href="#servicos" onClick={() => rolarParaSecao('servicos')}>Postos de Coleta</a>
              <a href="#campanhas" onClick={() => rolarParaSecao('campanhas')}>Campanhas</a>
            </div>

            <div className="footer-col">
              <h4>Parceiros Oficiais</h4>
              <a href="https://rblh.fiocruz.br/" target="_blank" rel="noreferrer">Rede Global rBLH</a>
              <a href="https://www.gov.br/saude" target="_blank" rel="noreferrer">Ministério da Saúde</a>
              <a href="https://portal.fiocruz.br/" target="_blank" rel="noreferrer">Fiocruz</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            <strong>Laços Maternos</strong>
            <p>Projeto acadêmico desenvolvido para fins de Trabalho de Conclusão de Curso (TCC). Sem fins lucrativos.</p>
          </div>
          <div className="institutional-support">
            <span>APOIO INSTITUCIONAL:</span>
            <strong>SUS</strong>
            <strong>FIOCRUZ</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}