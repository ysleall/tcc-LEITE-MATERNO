CREATE DATABASE IF NOT EXISTS tcc;
USE tcc;


CREATE TABLE IF NOT EXISTS doadoras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_nascimento DATE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS doacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doadora_id INT NOT NULL,
    quantidade_ml INT NOT NULL,
    data_doacao DATETIME NOT NULL,
    FOREIGN KEY (doadora_id) REFERENCES doadoras(id) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pergunta TEXT NOT NULL,
    opcao_a VARCHAR(255) NOT NULL,
    opcao_b VARCHAR(255) NOT NULL,
    resposta_apta VARCHAR(1) NOT NULL
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bancos_leite (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    endereco VARCHAR(255) NOT NULL,
    telefone VARCHAR(50),
    horario_funcionamento VARCHAR(100),
    atendimento_disponivel BOOLEAN DEFAULT TRUE,
    coleta_domiciliar BOOLEAN DEFAULT TRUE,
    coordenadas_mapa VARCHAR(100)
);

CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    banco_id INT REFERENCES bancos_leite(id) ON DELETE CASCADE,
    data_agendamento DATE NOT NULL,
    turno VARCHAR(20) NOT NULL,
    tipo_coleta VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    banco_id INT REFERENCES bancos_leite(id) ON DELETE CASCADE,
    quantidade_ml INT NOT NULL,
    data_doacao DATE NOT NULL,
    status_triagem VARCHAR(50) DEFAULT 'Em Analise'
);

CREATE TABLE conquistas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    icone_url VARCHAR(255)
);

CREATE TABLE usuario_conquistas (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
    conquista_id INT REFERENCES conquistas(id) ON DELETE CASCADE,
    desbloqueado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doadoras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    data_nascimento DATE,
    senha VARCHAR(255) NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS doacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doadora_id INT NOT NULL,
    quantidade_ml INT NOT NULL,
    data_doacao DATETIME NOT NULL,
    FOREIGN KEY (doadora_id) REFERENCES doadoras(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pergunta TEXT NOT NULL,
    opcao_a VARCHAR(255) NOT NULL,
    opcao_b VARCHAR(255) NOT NULL,
    resposta_apta VARCHAR(1) NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_banco_leite (
    id_banco INT AUTO_INCREMENT PRIMARY KEY,
    nm_banco VARCHAR(150) NOT NULL,
    ds_endereco VARCHAR(255) NOT NULL,
    ds_telefone VARCHAR(50),
    bt_aberto_hoje BOOLEAN DEFAULT TRUE
);