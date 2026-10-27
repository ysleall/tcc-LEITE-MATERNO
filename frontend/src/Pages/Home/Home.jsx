import { useState, useEffect } from 'react';
import axios from 'axios';
import './Home.scss';

export default function Home() {
  const [bancos, setBancos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState('Banco de Leite');

  async function buscarBancos(termoBusca = busca) {
    try {
      const resposta = await axios.get(`http://localhost:5000/banco-leite?busca=${termoBusca}`);
      setBancos(resposta.data);
    } catch (err) {
      console.error('Erro ao buscar bancos de leite:', err);
    }
  }

  useEffect(() => {
    async function carregarInicial() {
      try {
        const resposta = await axios.get('http://localhost:2026/banco-leite?busca=');
        setBancos(resposta.data);
      } catch (err) {
        console.error('Erro ao carregar bancos de leite:', err);
      }
    }

    carregarInicial();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      buscarBancos();
    }
  };

  const handleTagClick = (tag) => {
    setFiltroAtivo(tag);
  };

  const handleContato = (telefone) => {
    if (telefone) {
      window.open(`https://wa.me/55${telefone.replace(/\D/g, '')}`, '_blank');
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">Laços Maternos</div>
        <nav className="nav-links">
          <a href="#inicio">Início</a>
          <a href="#por-que-doar">Por que doar</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#bancos-de-leite">Bancos de Leite</a>
          <a href="#guias">Guia da Doadora</a>
        </nav>
        <div className="auth-buttons">
          <button className="btn-secondary" onClick={() => window.location.href = '/login'}>Entrar</button>
          <button className="btn-primary" onClick={() => window.location.href = '/cadastro'}>Quero Doar</button>
        </div>
      </header>

      <main className="main-content">
        <section className="search-section">
          <h2>Encontre um Banco de Leite</h2>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Digite a cidade ou endereço (ex: Campinas, SP)" 
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button className="btn-primary" onClick={() => buscarBancos()}>Buscar</button>
          </div>
          <div className="filter-tags">
            {['Banco de Leite', 'Posto de Coleta', 'Coleta Domiciliar', 'Aberto Agora'].map((tag) => (
              <button 
                key={tag}
                className={`tag ${filtroAtivo === tag ? 'active' : ''}`}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        <section className="content-layout">
          <div className="cards-list">
            {bancos.length === 0 ? (
              <p>Nenhum banco de leite encontrado.</p>
            ) : (
              bancos.map((item) => (
                <div className="card" key={item.id}>
                  <div className="card-header">
                    <h3>{item.nome}</h3>
                    <span className="badge-status">
                      {item.abertoHoje ? 'Aberto hoje' : 'Fechado'}
                    </span>
                  </div>
                  <p className="address">
                    <strong>Endereço:</strong> {item.endereco}
                  </p>
                  <p className="phone">
                    <strong>Telefone:</strong> {item.telefone}
                  </p>
                  <div className="card-actions">
                    <button className="btn-link" onClick={() => window.location.href = `/banco/${item.id}`}>Ver detalhes</button>
                    <button className="btn-primary" onClick={() => handleContato(item.telefone)}>Contato</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="map-container">
            <div className="map-placeholder">
              <p>Mapa Interativo</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Laços Maternos</h3>
            <p>Uma ponte digital de solidariedade para apoiar mães doadoras.</p>
          </div>
          <div className="footer-links">
            <h4>Plataforma</h4>
            <ul>
              <li><a href="#sobre">Sobre o Projeto</a></li>
              <li><a href="#como-doar">Como doar</a></li>
              <li><a href="#postos">Postos de Coleta</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}