import React, { useState } from 'react';
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
  const [cep, setCep] = useState('');
  const campinasCoords = [-22.8932, -47.0543];

  // Função para lidar com a busca por CEP
  const handleSearchCep = (e) => {
    e.preventDefault();
    if (!cep.trim()) {
      alert('Por favor, digite um CEP válido.');
      return;
    }
    alert(`Buscando pontos de coleta próximos ao CEP: ${cep}`);
    // Aqui podes integrar futuramente uma API de consulta de CEP (ex: ViaCEP)
  };

  // Funções de navegação e interatividade para os botões
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenLogin = () => {
    alert('Redirecionando para a página de Entrar / Login...');
  };

  const handleStartDonation = () => {
    alert('Iniciando o processo de pré-triagem para doação. Obrigado pelo seu ato de amor!');
  };

  const handleContactBank = () => {
    alert('Abrindo canal de contacto com o Banco de Leite de Campinas...');
  };

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
          <a href="#guia">Guia da Doadora</a>
          <a href="#campanhas">Campanhas</a>
        </nav>

        <div className="header-actions">
          <button className="btn-secondary" onClick={handleOpenLogin}>Entrar</button>
          <button className="btn-primary" onClick={handleStartDonation}>Quero Doar</button>
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
            <button className="btn-primary" onClick={handleStartDonation}>Quero Doar</button>
            <button className="btn-outline" onClick={() => scrollToSection('como-funciona')}>Como funciona</button>
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
            <form onSubmit={handleSearchCep} className="search-form">
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
                <button className="btn-outline-sm" onClick={() => alert('Detalhes do Banco de Leite da Maternidade de Campinas.')}>Ver detalhes</button>
                <button className="btn-primary-sm" onClick={handleContactBank}>Entrar em contato</button>
              </div>
            </div>
          </div>

          <div className="locator-map-realtime">
            <MapContainer 
              center={campinasCoords} 
              zoom={14} 
              scrollWheelZoom={false}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={campinasCoords}>
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

      <footer className="home-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo-container">
              <img src={logoImg} alt="Laços Maternos" className="logo" />
            </div>
            <p>Uma ponte digital de solidariedade para apoiar mães doadoras e proteger a vida de milhares de recém-nascidos brasileiros.</p>
            <div className="social-icons">
              <a href="#instagram" onClick={(e) => { e.preventDefault(); alert('Redirecionando para o Instagram...'); }}>📷</a>
              <a href="#facebook" onClick={(e) => { e.preventDefault(); alert('Redirecionando para o Facebook...'); }}>📘</a>
              <a href="#youtube" onClick={(e) => { e.preventDefault(); alert('Redirecionando para o YouTube...'); }}>▶️</a>
            </div>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Plataforma</h4>
              <a href="#sobre" onClick={(e) => { e.preventDefault(); alert('Seção Sobre o Projeto'); }}>Sobre o Projeto</a>
              <a href="#como-doar" onClick={(e) => { e.preventDefault(); scrollToSection('como-funciona'); }}>Como doar</a>
              <a href="#postos" onClick={(e) => { e.preventDefault(); scrollToSection('servicos'); }}>Postos de Coleta</a>
              <a href="#guia" onClick={(e) => { e.preventDefault(); alert('Guia Ilustrado'); }}>Guia Ilustrado</a>
            </div>

            <div className="footer-col">
              <h4>Informação</h4>
              <a href="#faq" onClick={(e) => { e.preventDefault(); alert('Perguntas Frequentes (FAQ)'); }}>Perguntas Frequentes (FAQ)</a>
              <a href="#diretrizes" onClick={(e) => { e.preventDefault(); alert('Diretrizes Técnicas (Fiocruz/ANVISA)'); }}>Diretrizes Técnicas</a>
              <a href="#contato" onClick={(e) => { e.preventDefault(); alert('Canal de Contato'); }}>Contato</a>
            </div>

            <div className="footer-col">
              <h4>Parceiros e Apoio</h4>
              <a href="#rblh" onClick={(e) => { e.preventDefault(); window.open('https://rblh.fiocruz.br/', '_blank'); }}>Rede Global rBLH</a>
              <a href="#ms" onClick={(e) => { e.preventDefault(); window.open('https://www.gov.br/saude', '_blank'); }}>Ministério da Saúde</a>
              <a href="#fiocruz" onClick={(e) => { e.preventDefault(); window.open('https://portal.fiocruz.br/', '_blank'); }}>Fiocruz (IFF)</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            <strong>Laços Maternos</strong>
            <p>Projeto acadêmico desenvolvido para fins de Trabalho de Conclusão de Curso (TCC). Sem fins lucrativos.</p>
          </div>
          <div className="institutional-support">
            <span>APOIO INSTITUCIONAL INSPIRADOR:</span>
            <strong>SUS</strong>
            <strong>FIOCRUZ</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}