import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Detalhes.scss';
import logoImg from '../../assets/lacomaterno.png';

const pinkIcon = new L.DivIcon({
  className: 'custom-pink-pin',
  html: `
    <div className="pin-marker">
      <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#E65C83"/>
        <circle cx="16" cy="16" r="7" fill="white"/>
      </svg>
    </div>
  `,
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -40]
});

export default function Detalhes() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const coordsCampinas = [-22.8932, -47.0543];

  useEffect(() => {
    const doadoraSalva = localStorage.getItem('@lacos:doadora') || localStorage.getItem('usuario');
    if (doadoraSalva) {
      try {
        setUsuario(JSON.parse(doadoraSalva));
      } catch (e) {
        console.error(e);
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

  function abrirRotaOnibus() {
    const destino = encodeURIComponent('Av. Orosimbo Maia, 165 - Vila Itapura, Campinas - SP');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destino}&travelmode=transit`, '_blank');
  }

  function handleAgendarColeta() {
  if (usuario) {
    navigate('/perfil');
  } else {
    navigate('/cadastro');
  }
}

  return (
    <div className="detalhes-banco-container">
      <header className="home-header">
        <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src={logoImg} alt="Laços Maternos" className="logo" />
        </div>

        <nav className="nav-menu">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Início</a>
          <a href="/#por-que-doar" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Por que doar</a>
          <a href="/#como-funciona" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Como funciona</a>
          <a href="/bancos" className="active">Bancos de Leite</a>
          <a href="/guia" onClick={(e) => { e.preventDefault(); navigate('/guia'); }}>Guia da Doadora</a>
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
              <button className="btn-secondary" onClick={() => navigate('/login')}>Entrar</button>
              <button className="btn-primary" onClick={() => navigate('/cadastro')}>Quero Doar</button>
            </>
          )}
        </div>
      </header>

      <main className="detalhes-main-content">
        <div className="breadcrumb-nav">
          <span onClick={() => navigate('/')}>Bancos de Leite</span> / <strong>Campinas</strong>
        </div>

        <section className="banco-header-card">
          <div className="status-badge-container">
            <span className="status-badge green">● Atendimento disponível</span>
          </div>

          <div className="title-actions-row">
            <div>
              <h1>Banco de Leite Humano – Maternidade de Campinas</h1>
              <p className="subtitle-text">
                Referência regional para coleta, processamento e distribuição de leite materno seguro para recém-nascidos.
              </p>
            </div>

            <div className="header-buttons">
              <button className="btn-primary-lg" onClick={handleAgendarColeta}>Agendar Coleta</button>
              <button className="btn-outline-lg" onClick={abrirRotaOnibus}>Como Chegar 🚌</button>
            </div>
          </div>

          <div className="info-cards-grid">
            <div className="info-card">
              <span className="icon">📍</span>
              <div>
                <small>ENDEREÇO</small>
                <p>Av. Orosimbo Maia, 165 - Vila Itapura, Campinas - SP</p>
              </div>
            </div>

            <div className="info-card">
              <span className="icon">📞</span>
              <div>
                <small>TELEFONE DE CONTATO</small>
                <p>(19) 3306-6000</p>
              </div>
            </div>

            <div className="info-card">
              <span className="icon">🕒</span>
              <div>
                <small>HORÁRIO DE FUNCIONAMENTO</small>
                <p>Segunda a Sexta, das 08:00 às 17:00</p>
              </div>
            </div>

            <div className="info-card">
              <span className="icon">🏠</span>
              <div>
                <small>COLETA DOMICILIAR</small>
                <p>Disponível para toda a região metropolitana</p>
              </div>
            </div>
          </div>
        </section>

        <section className="services-and-map-grid">
          <div className="services-card">
            <h2>Serviços e Apoio Oferecidos</h2>

            <ul className="services-list">
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Recebimento de doações de leite</strong>
                  <p>Coleta controlada de mães previamente triadas.</p>
                </div>
              </li>

              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Orientação e apoio à amamentação</strong>
                  <p>Consultoria presencial e por telefone para auxiliar mães com dúvidas.</p>
                </div>
              </li>

              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Coleta domiciliar sob agendamento</strong>
                  <p>Equipe especializada busca o leite congelado em sua residência.</p>
                </div>
              </li>

              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Atendimento pré e pós-natal</strong>
                  <p>Acompanhamento profissional focado no bem-estar materno-infantil.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="map-card">
            <h2>Localização no Mapa</h2>
            <div className="map-wrapper">
              <MapContainer center={coordsCampinas} zoom={15} scrollWheelZoom={false} className="leaflet-details-map">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={coordsCampinas} icon={pinkIcon}>
                  <Popup>
                    <strong>Banco de Leite Humano – Campinas</strong><br />
                    Maternidade de Campinas<br />
                    Av. Orosimbo Maia, 165
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <p className="parking-info">
              Fácil acesso com estacionamento gratuito exclusivo para doadoras na frente do prédio. Maternidade de Campinas, Bloco B, Piso Térreo.
            </p>
          </div>
        </section>
      </main>

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
              <a href="/#como-funciona" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Como doar</a>
              <a href="/#servicos" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Postos de Coleta</a>
              <a href="/#campanhas" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Campanhas</a>
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