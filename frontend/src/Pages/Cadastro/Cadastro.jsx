
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Cadastro.scss';
import logoImg from '../../assets/lacomaterno.png';
import heroImg from '../../assets/nenememae.jpg';

export default function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [concordaTermos, setConcordaTermos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  async function cadastrarDoadora(e) {
    e.preventDefault();
    setMensagemErro('');
    setMensagemSucesso('');

    if (!concordaTermos) {
      setMensagemErro('Você precisa aceitar os termos e a política de privacidade.');
      return;
    }

    const cpfFormatado = cpf.replace(/\D/g, '');

    if (cpfFormatado.length !== 11) {
      setMensagemErro('Por favor, informe um CPF válido com 11 dígitos.');
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch('http://localhost:2027/api/auth/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          nome,
          email,
          cpf: cpfFormatado,
          telefone,
          data_nascimento: dataNascimento,
          senha,
          cep,
          cidade
        })
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagemSucesso('Conta criada com sucesso! Redirecionando para o login');

        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        const erroServidor = dados.mensagem || dados.message || dados.error || 'Erro ao realizar cadastro.';
        setMensagemErro(erroServidor);
      }
    } catch (erro) {
      console.error('Erro ao cadastrar doadora:', erro);
      setMensagemErro('Não foi possível conectar ao servidor backend.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-page">
      <div className="cadastro-visual-side">
        <div className="decorative-circle circle-pink"></div>
        <div className="decorative-circle circle-mint"></div>

        <div className="visual-content">
          <div className="image-circle-frame">
            <img src={heroImg} alt="Mãe amamentando o bebê" />
          </div>
          <p className="slogan">Amamentar é doar vida</p>
        </div>
      </div>

      <div className="cadastro-form-side">
        <div className="form-wrapper">
          <div className="cadastro-header">
            <img
              src={logoImg}
              alt="Laços Maternos"
              className="cadastro-logo"
              onClick={() => navigate('/')}
            />
            <h2>Crie sua conta de doadora</h2>
            <p>Preencha os campos abaixo para iniciar seu cadastro em nossa rede de apoio.</p>
          </div>

          {mensagemErro && (
            <div className="feedback-msg error">
              {mensagemErro}
            </div>
          )}

          {mensagemSucesso && (
            <div className="feedback-msg success">
              {mensagemSucesso}
            </div>
          )}

          <form onSubmit={cadastrarDoadora} className="cadastro-form">
            <div className="input-group">
              <label htmlFor="nome">Nome completo</label>
              <input
                id="nome"
                type="text"
                placeholder="Ex: Maria Silva de Oliveira"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

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

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="senha">Senha</label>
                <input
                  id="senha"
                  type="password"
                  placeholder="Crie uma senha forte"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="nascimento">Data de nascimento</label>
                <input
                  id="nascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="telefone">Telefone / WhatsApp</label>
                <input
                  id="telefone"
                  type="text"
                  placeholder="(11) 99999-9999"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="cpf">CPF</label>
                <input
                  id="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label htmlFor="cep">CEP</label>
                <input
                  id="cep"
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="cidade">Cidade</label>
                <input
                  id="cidade"
                  type="text"
                  placeholder="Cidade onde reside"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
            </div>

            <div className="checkbox-group">
              <input
                id="termos"
                type="checkbox"
                checked={concordaTermos}
                onChange={(e) => setConcordaTermos(e.target.checked)}
                required
              />
              <label htmlFor="termos">
                Li e concordo com a Política de Privacidade e as diretrizes oficiais de doação de leite humano.
              </label>
            </div>

            <button
              type="submit"
              className="btn-cadastro-submit"
              disabled={carregando || !!mensagemSucesso}
            >
              {carregando ? 'Cadastrando...' : 'Criar minha conta'}
            </button>
          </form>

          <div className="cadastro-footer">
            <p>
              Já possui uma conta ativa? <Link to="/login">Fazer login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
