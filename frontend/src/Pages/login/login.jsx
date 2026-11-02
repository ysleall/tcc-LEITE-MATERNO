import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.scss';
import logoImg from '../../assets/lacomaterno.png';
import heroImg from '../../assets/amarmentar.png';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const navigate = useNavigate();

  const handleGoTo = (path) => {
    if (navigate) {
      navigate(path);
    } else if (onNavigate) {
      onNavigate(path.replace('/', ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setCarregando(true);
      // Rota correta configurada no backend em loginController.js: /api/auth/login
      const response = await fetch('http://localhost:2026/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        // Salva o token e dados da doadora no localStorage
        if (data.token) {
          localStorage.setItem('@lacos:token', data.token);
          localStorage.setItem('@lacos:doadora', JSON.stringify(data.doadora));
        }
        alert('Login efetuado com sucesso!');
        handleGoTo('/');
      } else {
        setErro(data.mensagem || 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      setErro('Não foi possível conectar com o servidor. Verifique se o backend está ligado na porta 2026.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      {/* Lado Esquerdo: Visual com foto circular e frase (Fiel ao Figma) */}
      <div className="login-visual-side">
        <div className="decorative-circle circle-pink"></div>
        <div className="decorative-circle circle-mint"></div>

        <div className="visual-content">
          <div className="image-circle-frame">
            <img src={heroImg} alt="Mãe amamentando o bebê" />
          </div>
          <p className="slogan">Um pequeno gesto, um grande futuro</p>
        </div>
      </div>

      {/* Lado Direito: Formulário de Login */}
      <div className="login-form-side">
        <div className="form-wrapper">
          <div className="login-header">
            <img 
              src={logoImg} 
              alt="Laços Maternos" 
              className="login-logo" 
              onClick={() => handleGoTo('/')} 
            />
            <h2>Bem-vinda de volta</h2>
            <p>Faça login para gerenciar suas doações ou realizar uma pré-triagem.</p>
          </div>

          {erro && <div className="login-error-msg">{erro}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <input 
                id="email" 
                type="email" 
                placeholder="seumail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="senha">Senha</label>
              <input 
                id="senha" 
                type="password" 
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div className="form-options">
              <a href="#esqueceu" onClick={(e) => { e.preventDefault(); alert('Em breve recuperação de senha.'); }}>
                Esqueci minha senha
              </a>
            </div>

            <button type="submit" className="btn-login-submit" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Ainda não tem cadastro?{' '}
              {navigate ? (
                <Link to="/cadastro">Criar conta</Link>
              ) : (
                <a href="#cadastro" onClick={(e) => { e.preventDefault(); handleGoTo('/cadastro'); }}>
                  Criar conta
                </a>
              )}
            </p>
            <button className="btn-back-home" onClick={() => handleGoTo('/')}>
              ← Voltar para o Início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
