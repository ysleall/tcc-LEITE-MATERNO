
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.scss';
import logoImg from '../../assets/lacomaterno.png';
import heroImg from '../../assets/nenememae.jpg';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  async function fazerLogin(e) {
    e.preventDefault();
    setMensagemErro('');
    setMensagemSucesso('');

    if (!email || !senha) {
      setMensagemErro('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch('http://localhost:2027/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        if (dados.token) {
          localStorage.setItem('@lacos:token', dados.token);
          localStorage.setItem('@lacos:doadora', JSON.stringify(dados.doadora));
        }

        setMensagemSucesso('Seja bem-vinda de volta! Login realizado com sucesso.');

        setTimeout(() => {
          navigate('/');
        }, 1500);

      } else {
        setMensagemErro(dados.mensagem || 'E-mail ou senha incorretos.');
      }
    } catch (erro) {
      console.error('Erro ao conectar com o backend:', erro);
      setMensagemErro('Não foi possível conectar ao servidor backend.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">
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

      <div className="login-form-side">
        <div className="form-wrapper">
          <div className="login-header">
            <img
              src={logoImg}
              alt="Laços Maternos"
              className="login-logo"
              onClick={() => navigate('/')}
            />

            <h2>Bem-vinda de volta</h2>
            <p>
              Faça login para gerenciar suas doações ou realizar uma pré-triagem.
            </p>
          </div>

          {mensagemErro && (
            <div className="login-error-msg">
              {mensagemErro}
            </div>
          )}

          {mensagemSucesso && (
            <div className="login-success-msg">
              <span className="success-heart">♡</span>
              <span>{mensagemSucesso}</span>
            </div>
          )}

          <form onSubmit={fazerLogin} className="login-form">
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
              <a
                href="#esqueceu"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Em breve recuperação de senha.');
                }}
              >
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={carregando || !!mensagemSucesso}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Ainda não tem cadastro? <Link to="/cadastro">Criar conta</Link>
            </p>

            <button
              className="btn-back-home"
              onClick={() => navigate('/')}
            >
              ← Voltar para o Início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
