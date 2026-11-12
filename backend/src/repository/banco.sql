
CREATE DATABASE IF NOT EXISTS tcc;
USE tcc;
CREATE TABLE IF NOT EXISTS doadoras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(14) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    data_nascimento DATE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cep VARCHAR(10),
    cidade VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Ativa',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tb_banco_leite (
    id_banco INT AUTO_INCREMENT PRIMARY KEY,
    nm_banco VARCHAR(150) NOT NULL,
    ds_endereco VARCHAR(255) NOT NULL,
    ds_telefone VARCHAR(50),
    bt_aberto_hoje BOOLEAN DEFAULT TRUE,
    ds_horario VARCHAR(100) DEFAULT '08:00 às 17:00',
    ds_descricao TEXT,
    bt_coleta_domiciliar BOOLEAN DEFAULT TRUE,
    nr_latitude DECIMAL(10, 8) DEFAULT -22.8932,
    nr_longitude DECIMAL(11, 8) DEFAULT -47.0543
);

CREATE TABLE IF NOT EXISTS doacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doadora_id INT NOT NULL,
    quantidade_ml INT NOT NULL,
    data_doacao DATETIME NOT NULL,
    status_analise VARCHAR(50) DEFAULT 'Aprovado para Pasteurização',
    FOREIGN KEY (doadora_id) REFERENCES doadoras(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doadora_id INT NOT NULL,
    banco_id INT NOT NULL,
    data_agendamento DATE NOT NULL,
    turno VARCHAR(30) NOT NULL, -- 'Manhã', 'Tarde'
    tipo_coleta VARCHAR(50) NOT NULL, -- 'Domiciliar', 'Presencial'
    status VARCHAR(50) DEFAULT 'Pendente', -- 'Pendente', 'Confirmado', 'Concluído'
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doadora_id) REFERENCES doadoras(id) ON DELETE CASCADE,
    FOREIGN KEY (banco_id) REFERENCES tb_banco_leite(id_banco) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pergunta TEXT NOT NULL,
    opcao_a VARCHAR(255) NOT NULL,
    opcao_b VARCHAR(255) NOT NULL,
    resposta_apta VARCHAR(1) NOT NULL -- 'A' ou 'B'
);

CREATE TABLE IF NOT EXISTS conquistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    meta_ml INT NOT NULL,
    icone_url VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS tb_notificacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(50) DEFAULT 'informativo',
    bt_lida BOOLEAN DEFAULT FALSE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT IGNORE INTO tb_banco_leite (id_banco, nm_banco, ds_endereco, ds_telefone, bt_aberto_hoje, ds_horario, bt_coleta_domiciliar)
VALUES 
(1, 'Banco de Leite Humano – Campinas', 'Av. Orosimbo Maia, 165 - Vila Itapura, Campinas - SP', '(19) 3306-6000', TRUE, '08:00 às 17:00', TRUE),
(2, 'Centro de Lactação Maternidade de Campinas', 'Av. Barão de Itapura, 924 - Botafogo, Campinas - SP', '(19) 3306-6039', TRUE, '07:30 às 18:00', TRUE),
(3, 'Hospital da Mulher Prof. Dr. José Aristodemo Pinotti (CAISM/Unicamp)', 'R. Alexander Fleming, 101 - Cidade Universitária, Campinas - SP', '(19) 3521-7278', TRUE, '08:00 às 17:00', TRUE);

INSERT IGNORE INTO quiz (id, pergunta, opcao_a, opcao_b, resposta_apta)
VALUES
(1, 'Você está saudável e produzindo leite em excesso além do que seu bebê consome?', 'Sim, saudável e com excedente', 'Não', 'A'),
(2, 'Você faz uso frequente de cigarro, bebidas alcoólicas ou drogas ilícitas?', 'Não faço uso', 'Sim, faço uso', 'A'),
(3, 'Você realizou tatuagem ou piercing nos últimos 12 meses?', 'Não', 'Sim', 'A'),
(4, 'Você possui exames de pré-natal/pós-parto negativos para HIV, Hepatites e Sífilis?', 'Sim, exames em dia e negativos', 'Não possuo os exames', 'A'),
(5, 'Você está tomando medicamentos contínuos que contraindicam a amamentação?', 'Não tomo remédios contraindicados', 'Sim, tomo medicamentos', 'A');


INSERT IGNORE INTO conquistas (id, titulo, descricao, meta_ml, icone_url)
VALUES
(1, 'Primeiros Laços', 'Realizou sua primeira doação de leite humano!', 1, 'badge-first'),
(2, 'Gota Solidária', 'Alcançou a marca de 1 Litro (1.000 ml) doado!', 1000, 'badge-drop'),
(3, 'Mãe de Ouro', 'Alcançou a marca de 5 Litros (5.000 ml) doados!', 5000, 'badge-gold'),
(4, 'Estrela da Solidariedade', 'Manteve doações consecutivas por 3 meses seguidos!', 0, 'badge-star'),
(5, 'Guardiã da Vida', 'Superou 10 Litros doados, alimentando dezenas de bebês!', 10000, 'badge-guardian');


INSERT IGNORE INTO tb_notificacao (id, titulo, mensagem, tipo)
VALUES
(1, 'Campanha de Doação Ativa', 'Os estoques de leite pasteurizado para prematuros precisam de doações neste mês. Seu apoio salva vidas!', 'campanha'),
(2, 'Orientações de Coleta', 'Lembre-se: use sempre frasco de vidro de café solúvel com tampa plástica esterilizado em água fervente por 15 minutos.', 'guia');




select * from doadoras;
drop database tcc;