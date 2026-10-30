import React, { useState } from 'react';
import './Login.scss';
import logoImg from '../../assets/lacomaterno.png';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch('http://localhost:2026/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      if (response.ok) {
        alert('Login efetuado com sucesso!');
      } else {
        alert('Credenciais inválidas ou utilizador não encontrado.');
      }
    } catch (error) {
      alert('Erro ao conectar com a API backend na porta 2026.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logoImg} alt="Laços Maternos" className="login-logo" />
          <h2>Bem-vinda de volta</h2>
          <p>Aceda à sua conta para gerir doações e agendamentos</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input 
              id="email" 
              type="email" 
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Palavra-passe (Senha)</label>
            <input 
              id="senha" 
              type="password" 
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <a href="#esqueceu" onClick={(e) => { e.preventDefault(); alert('Recuperação de palavra-passe'); }}>
              Esqueceu-se da palavra-passe?
            </a>
          </div>

          <button type="submit" className="btn-login-submit">Entrar</button>
        </form>

        <div className="login-footer">
          <p>Ainda não tem conta? <a href="#cadastrar" onClick={(e) => { e.preventDefault(); alert('Redirecionando para Cadastro...'); }}>Cadastre-se</a></p>
          <button className="btn-back-home" onClick={() => onNavigate && onNavigate('home')}>
            ← Voltar para o Início
          </button>
        </div>
      </div>
    </div>
  );
}