import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './Home.scss';
import logoImg from '../../assets/lacomaterno.png';
import heroImg from '../../assets/amarmentar.png';

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

function RecentralizarMapa({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 14, { animate: true });
    }
  }, [coords, map]);
  return null;
}

const LISTA_BANCOS_LEITE = [
  {
    id: 1,
    nome: 'Banco de Leite Humano – Campinas',
    hospital: 'Maternidade de Campinas',
    horario: '08:00 às 17:00',
    endereco: 'Av. Orosimbo Maia, 165 - Vila Itapura, Campinas - SP',
    telefone: '(19) 3306-6000',
    coords: [-22.8932, -47.0543]
  },
  {
    id: 2,
    nome: 'Banco de Leite Humano – São Paulo (SP)',
    hospital: 'Hospital Maternidade Leonor Mendes de Barros',
    horario: '08:00 às 17:00',
    endereco: 'Av. Celso Garcia, 2477 - Belenzinho, São Paulo - SP',
    telefone: '(11) 2692-0100',
    coords: [-23.5365, -46.5932]
  },
  {
    id: 3,
    nome: 'Posto de Coleta – Zona Sul',
    hospital: 'Hospital Infantil Sabará',
    horario: '08:00 às 18:00',
    endereco: 'Av. Angélica, 1987 - Consolação, São Paulo - SP',
    telefone: '(11) 3155-2800',
    coords: [-23.5505, -46.6576]
  }
];

function calcularDistanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
}

export default function Home() {
  const navigate = useNavigate();
  const [cep, setCep] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [coordsMapa, setCoordsMapa] = useState([-22.8932, -47.0543]);
  const [bancoSelecionado, setBancoSelecionado] = useState({
    ...LISTA_BANCOS_LEITE[0],
    distancia: '2.4 km'
  });

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

  async function buscarCep(e) {
    e.preventDefault();
    const cepLimpo = cep.replace(/\D/g, '');
    
    if (!cepLimpo) {
      alert('Por favor, digite um CEP válido.');
      return;
    }

    if (cepLimpo.length !== 8) {
      alert('Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }

    setCarregando(true);
    alert(`Buscando pontos de coleta próximos ao CEP: ${cep}`);

    try {
      const resViaCep = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dataViaCep = await resViaCep.json();

      if (dataViaCep.erro) {
        alert('CEP não encontrado. Verifique o número digitado.');
        setCarregando(false);
        return;
      }

      const enderecoBusca = `${dataViaCep.logradouro || ''}, ${dataViaCep.bairro || ''}, ${dataViaCep.localidade} - ${dataViaCep.uf}`;
      const resGeo = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoBusca)}`
      );
      const dataGeo = await resGeo.json();

      if (dataGeo && dataGeo.length > 0) {
        const userLat = parseFloat(dataGeo[0].lat);
        const userLon = parseFloat(dataGeo[0].lon);

        let bancoMaisProximo = LISTA_BANCOS_LEITE[0];
        let menorDistancia = Infinity;

        LISTA_BANCOS_LEITE.forEach((banco) => {
          const dist = parseFloat(calcularDistanciaKm(userLat, userLon, banco.coords[0], banco.coords[1]));
          if (dist < menorDistancia) {
            menorDistancia = dist;
            bancoMaisProximo = banco;
          }
        });

        setCoordsMapa(bancoMaisProximo.coords);
        setBancoSelecionado({
          ...bancoMaisProximo,
          distancia: `${menorDistancia} km`
        });
      } else {
        setCoordsMapa([-23.5505, -46.6333]);
        setBancoSelecionado({
          nome: `Posto de Coleta – ${dataViaCep.localidade}`,
          hospital: `Unidade Básica de Saúde (${dataViaCep.bairro || 'Central'})`,
          horario: '08:00 às 17:00',
          endereco: `${dataViaCep.logradouro || 'Rua Principal'}, ${dataViaCep.bairro || 'Centro'} - ${dataViaCep.localidade}/${dataViaCep.uf}`,
          telefone: '(19) 3306-6000',
          distancia: '1.2 km',
          coords: [-23.5505, -46.6333]
        });
      }
    } catch (err) {
      alert('Ocorreu um erro ao buscar o CEP. Tente novamente.');
    } finally {
      setCarregando(false);
    }
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
    alert(`Telefone do ${bancoSelecionado.nome}: ${bancoSelecionado.telefone}`);
  }

  function abrirRotaOnibus() {
    const destino = encodeURIComponent(bancoSelecionado.endereco);
    const urlGoogleMaps = `https://www.google.com/maps/dir/?api=1&destination=${destino}&travelmode=transit`;
    window.open(urlGoogleMaps, '_blank');
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
          <a href="Detalhes">Ver Detalhes</a>
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
                placeholder="99999-999" 
                value={cep}
                onChange={(e) => setCep(e.target.value)}
              />
              <button type="submit" className="btn-search" disabled={carregando}>
                {carregando ? 'Buscando...' : 'Buscar'}
              </button>
            </form>

            <div className="location-card">
              <div className="location-header">
                <div>
                  <h3>{bancoSelecionado.nome}</h3>
                  <small>{bancoSelecionado.hospital}</small>
                </div>
                <span className="distance-badge">{bancoSelecionado.distancia}</span>
              </div>
              <div className="status-tags">
                <span className="tag-status open">ABERTO HOJE</span>
                <span className="tag-service">Coleta domiciliar disponível</span>
              </div>
              <p className="address-info">
                <strong>Horário:</strong> {bancoSelecionado.horario}<br />
                <strong>Endereço:</strong> {bancoSelecionado.endereco}
              </p>
              <div className="location-actions">
                <button className="btn-outline-sm" onClick={() => alert(`Endereço: ${bancoSelecionado.endereco}\nTelefone: ${bancoSelecionado.telefone}`)}>Ver detalhes</button>
                <button className="btn-primary-sm" onClick={contatarBanco}>Entrar em contato</button>
                <button className="btn-outline-sm btn-bus" onClick={abrirRotaOnibus}>Rota de Ônibus 🚌</button>
              </div>
            </div>
          </div>

          <div className="locator-map-realtime">
            <div className="map-top-bar">
              <span>NAS, BRASIL</span>
            </div>
            <MapContainer 
              center={coordsMapa} 
              zoom={14} 
              scrollWheelZoom={false}
              className="leaflet-map"
            >
              <RecentralizarMapa coords={coordsMapa} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={coordsMapa} icon={pinkIcon}>
                <Popup>
                  <strong>{bancoSelecionado.nome}</strong><br />
                  {bancoSelecionado.hospital}<br />
                  Aberto hoje ({bancoSelecionado.horario})
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