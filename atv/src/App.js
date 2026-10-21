import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import logoImg from './imagens/lacos maternos imagem.png';
import './App.css';

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function RealTimeMap({ points, activeIndex }) {
  const centerPos = points[activeIndex] ? [points[activeIndex].lat, points[activeIndex].lng] : [-22.8988, -47.0562];

  return (
    <div className="map-container-wrapper">
      <MapContainer 
        center={centerPos} 
        zoom={12} 
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {points.map((point, idx) => (
          <Marker key={idx} position={[point.lat, point.lng]} icon={customIcon}>
            <Popup>
              <div className="popup-content">
                <strong className="popup-title">{point.name}</strong>
                <p className="popup-sub">{point.sub}</p>
                <p className="popup-address">{point.address}</p>
              </div>
            </Popup>
          </Marker>
          
        ))}
      </MapContainer>
    </div>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('bancos');
  const [selectedOption, setSelectedOption] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [selectedCard, setSelectedCard] = useState(0);
  const [searchCity, setSearchCity] = useState('Campinas, SP');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModalData, setActiveModalData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [toastMessage, setToastMessage] = useState('');

  const locations = [
    {
      name: 'Banco de Leite Humano - Campinas',
      sub: 'Maternidade de Campinas',
      type: 'Banco de Leite',
      distance: '2,4 km',
      open: true,
      homeCollection: true,
      address: 'Av. Orosimbo Maia, 165 - Vila Itapura, Campinas - SP',
      phone: '(19) 3737-1234',
      hours: '08:00 - 17:00',
      lat: -22.8988,
      lng: -47.0562
    },
    {
      name: 'BLH Centro de Atenção Maternal',
      sub: 'CAISM / Unicamp',
      type: 'Banco de Leite',
      distance: '5,1 km',
      open: true,
      homeCollection: true,
      address: 'Rua Alexander Fleming, 101 - Cidade Universitária, Campinas - SP',
      phone: '(19) 3521-7000',
      hours: '07:30 - 18:00',
      lat: -22.8275,
      lng: -47.0628
    },
    {
      name: 'Posto de Coleta de Leite Humano',
      sub: 'Hospital Celso Pierro (PUC)',
      type: 'Posto de Coleta',
      distance: '8,3 km',
      open: false,
      homeCollection: false,
      address: 'Av. John Boyd Dunlop, s/n - Jd. Ipaussurama, Campinas - SP',
      phone: '(19) 3343-8600',
      hours: '08:00 - 16:00',
      lat: -22.9031,
      lng: -47.1245
    }
  ];

  const filteredLocations = locations.filter((loc) => {
    if (selectedFilter === 'Todos') return true;
    if (selectedFilter === 'Banco de Leite') return loc.type === 'Banco de Leite';
    if (selectedFilter === 'Posto de Coleta') return loc.type === 'Posto de Coleta';
    if (selectedFilter === 'Coleta Domiciliar') return loc.homeCollection;
    if (selectedFilter === 'Aberto Agora') return loc.open;
    return true;
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleOpenDetails = (loc) => {
    setActiveModalData(loc);
    setIsModalOpen(true);
  };

  const handleContact = (loc) => {
    if (loc.phone) {
      window.open(`tel:${loc.phone.replace(/\D/g, '')}`);
    } else {
      showToast('Telefone indisponível no momento.');
    }
  };

  const handleDownloadPDF = () => {
    showToast('Gerando e baixando comprovante em PDF...');
  };

  return (
    <div className="app-container">
      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}

      {isModalOpen && activeModalData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">{activeModalData.name}</h2>
            <p className="modal-subtitle">{activeModalData.sub}</p>
            <hr className="modal-divider" />
            <p className="modal-info"><strong>Endereço:</strong> {activeModalData.address}</p>
            <p className="modal-info"><strong>Telefone:</strong> {activeModalData.phone || 'Não informado'}</p>
            <p className="modal-info"><strong>Horário:</strong> {activeModalData.hours}</p>
            <p className="modal-info"><strong>Coleta Domiciliar:</strong> {activeModalData.homeCollection ? 'Sim' : 'Não'}</p>
            <div className="modal-actions">
              <button onClick={() => handleContact(activeModalData)} className="btn-modal-primary">Ligar Agora</button>
              <button onClick={() => setIsModalOpen(false)} className="btn-modal-secondary">Fechar</button>
            </div>
          </div>
        </div>
      )}

      <header className="header">
        <div onClick={() => setCurrentPage('inicio')} className="logo-container">
          <img src={logoImg} alt="Laços Maternos" className="logo-img" />
        </div>

        <nav className="nav-menu">
          <button onClick={() => setCurrentPage('inicio')} className={`nav-link ${currentPage === 'inicio' ? 'active' : ''}`}>Início</button>
          <button onClick={() => setCurrentPage('porque')} className={`nav-link ${currentPage === 'porque' ? 'active' : ''}`}>Por que doar</button>
          <button onClick={() => setCurrentPage('triagem')} className={`nav-link ${currentPage === 'triagem' ? 'active' : ''}`}>Como funciona</button>
          <button onClick={() => setCurrentPage('bancos')} className={`nav-link ${currentPage === 'bancos' ? 'active' : ''}`}>Bancos de Leite</button>
          <button onClick={() => setCurrentPage('guia')} className={`nav-link ${currentPage === 'guia' ? 'active' : ''}`}>Guia da Doadora</button>
        </nav>

        <div className="header-actions">
          <button onClick={() => showToast('Redirecionando para login...')} className="btn-login">Entrar</button>
          <button onClick={() => setCurrentPage('triagem')} className="btn-donate">Quero Doar</button>
        </div>
      </header>

      {currentPage === 'inicio' && (
        <main className="main-content">
          <h1 className="title-primary">Cada gota faz a diferença</h1>
          <p className="subtitle">Conectamos mães doadoras a bancos de leite humano com carinho, praticidade e segurança.</p>
          <div className="hero-actions">
            <button onClick={() => setCurrentPage('triagem')} className="btn-primary-lg">Iniciar Pré-Triagem</button>
            <button onClick={() => setCurrentPage('bancos')} className="btn-outline-lg">Buscar Bancos de Leite</button>
          </div>
        </main>
      )}

      {currentPage === 'porque' && (
        <main className="main-content-narrow">
          <h1 className="title-secondary">Por que ser uma Doadora?</h1>
          <div className="card-box">
            <p className="card-text">
              O leite materno é o alimento mais completo para o recém-nascido. Para bebês prematuros ou de baixo peso internados em UTIs neonatais, a doação de leite humano representa uma verdadeira chance de vida e recuperação rápida.
            </p>
            <button onClick={() => setCurrentPage('triagem')} className="btn-primary-lg" style={{ marginTop: '20px' }}>Quero me Cadastrar</button>
          </div>
        </main>
      )}

      {currentPage === 'guia' && (
        <main className="main-content-narrow">
          <h1 className="title-secondary">Guia Rápido da Doadora</h1>
          <div className="card-box">
            <ul className="guide-list">
              <li>Higienize bem as mãos e os braços até o cotovelo.</li>
              <li>Utilize máscara e lenço para prender os cabelos.</li>
              <li>Higienize o frasco de vidro com tampa de plástico fervendo por 15 minutos.</li>
              <li>Guarde o leite no congelador ou freezer por até 15 dias.</li>
            </ul>
          </div>
        </main>
      )}

      {currentPage === 'triagem' && (
        <main className="main-content-triagem">
          <div className="section-header">
            <span className="badge-tag">PASSO INICIAL ESSENCIAL</span>
            <h1 className="section-title">Vamos verificar algumas informações iniciais.</h1>
            <p className="section-desc">
              Esta pré-triagem baseia-se nos critérios básicos estabelecidos pela ANVISA e Fiocruz. Suas respostas nos ajudam a antecipar o processo para que sua doação seja o mais ágil possível.
            </p>
          </div>

          <div className="quiz-card">
            <div className="quiz-header">
              <span>PERGUNTA ATUAL</span>
              <span>0{currentStep}/08</span>
            </div>
            
            {currentStep === 1 ? (
              <>
                <h2 className="quiz-question">Você está amamentando ou produzindo leite excedente atualmente?</h2>
                <p className="quiz-subtext">Para se tornar doadora de leite humano, é necessário estar saudável e apresentar uma produção excedente de leite para oferecer aos bebês necessitados.</p>
              </>
            ) : (
              <>
                <h2 className="quiz-question">Você faz uso de algum medicamento de uso contínuo?</h2>
                <p className="quiz-subtext">Alguns medicamentos podem passar para o leite materno. Essa informação é analisada sigilosamente pela equipe do banco.</p>
              </>
            )}

            <div className="quiz-options">
              <button 
                onClick={() => { setSelectedOption(true); setCurrentStep(prev => prev < 8 ? prev + 1 : 8); }}
                className={`btn-option ${selectedOption ? 'selected' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Sim, estou produzindo leite
              </button>
              <button 
                onClick={() => { setSelectedOption(false); showToast('Agradecemos seu interesse. Doações necessitam de excedente.'); }}
                className={`btn-option ${!selectedOption ? 'selected' : ''}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                Não, ainda não produzo
              </button>
            </div>

            <div className="privacy-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              Seu cadastro é sigiloso. O Laços Maternos apoia a privacidade de todas as mães doadoras.
            </div>
          </div>

          <div className="result-card">
            <div className="result-header">
              <div className="icon-check-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <h3 className="result-title">Pré-triagem concluída com sucesso!</h3>
                <p className="result-subtitle">Você atende aos critérios prévios para ser uma doadora incrível de leite materno.</p>
              </div>
            </div>
            <p className="card-text" style={{ fontSize: '0.88rem', marginBottom: '24px' }}>
              <strong>O que acontece agora?</strong> Suas respostas indicam que você possui grande probabilidade de estar apta a iniciar o processo de doação de forma saudável. No entanto, a confirmação oficial e o fornecimento de exames de laboratório devem ser realizados por um profissional devidamente credenciado de um Banco de Leite Humano.
            </p>
            <div className="result-actions">
              <button onClick={() => setCurrentPage('bancos')} className="btn-primary-md">Encontrar Banco de Leite Próximo</button>
              <button onClick={handleDownloadPDF} className="btn-outline-md">Salvar Resultados (PDF)</button>
            </div>
          </div>
        </main>
      )}

      {currentPage === 'bancos' && (
        <main className="main-content-bancos">
          <div className="section-header">
            <span className="badge-tag">BUSCA POR PROXIMIDADE</span>
            <h1 className="section-title">Encontre um Banco de Leite</h1>

            <div className="filters-bar">
              <div className="search-input-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d85a80" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input 
                  type="text" 
                  value={searchCity} 
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="search-input" 
                />
              </div>

              <div className="filters-group">
                {['Todos', 'Banco de Leite', 'Posto de Coleta', 'Coleta Domiciliar', 'Aberto Agora'].map((filter) => (
                  <button 
                    key={filter} 
                    onClick={() => setSelectedFilter(filter)}
                    className={`btn-filter ${selectedFilter === filter ? 'active' : ''}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bancos-grid">
            <div className="location-list">
              <span className="results-count">{filteredLocations.length} PONTOS DE COLETA ENCONTRADOS</span>
              {filteredLocations.map((loc, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedCard(idx)}
                  className={`location-card ${selectedCard === idx ? 'selected' : ''}`}
                >
                  <div className="location-card-header">
                    <h4 className="location-title">{loc.name}</h4>
                    <span className="badge-distance">{loc.distance}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '4px 0' }}>{loc.sub}</p>
                  
                  <div className="badges-row">
                    <span className={`badge-status ${loc.open ? 'open' : 'closed'}`}>
                      {loc.open ? 'ABERTO HOJE' : 'FECHADO'}
                    </span>
                    {loc.homeCollection && (
                      <span className="badge-feature">
                        Coleta em casa
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#4b5563', marginTop: '6px' }}><strong>Endereço:</strong> {loc.address}</p>
                  {loc.phone && <p style={{ fontSize: '0.8rem', color: '#4b5563' }}><strong>Telefone:</strong> {loc.phone}</p>}

                  <div className="card-actions">
                    <button onClick={(e) => { e.stopPropagation(); handleOpenDetails(loc); }} className="btn-card-outline">Ver detalhes</button>
                    <button onClick={(e) => { e.stopPropagation(); handleContact(loc); }} className="btn-card-primary">Contato</button>
                  </div>
                </div>
              ))}
            </div>

            <RealTimeMap points={filteredLocations} activeIndex={selectedCard} />
          </div>
        </main>
      )}
    </div>
  );
} 