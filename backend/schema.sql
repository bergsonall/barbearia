PRAGMA foreign_keys = ON;

-- =========================
-- TABELA DE USUÁRIOS
-- =========================
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('cliente', 'barbeiro', 'admin')),
    ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0,1)),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME
);

-- =========================
-- TABELA DE SERVIÇOS
-- =========================
CREATE TABLE servicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_servico TEXT NOT NULL,
    descricao TEXT,
    duracao_minutos INTEGER NOT NULL,
    preco REAL NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0,1)),
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME
);

-- =========================
-- TABELA DE AGENDAMENTOS
-- =========================
CREATE TABLE agendamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cliente INTEGER NOT NULL,
    id_barbeiro INTEGER NOT NULL,
    id_servico INTEGER NOT NULL,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('agendado','cancelado','concluido')),
    observacoes TEXT,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao DATETIME,
    FOREIGN KEY (id_cliente) REFERENCES usuarios(id),
    FOREIGN KEY (id_barbeiro) REFERENCES usuarios(id),
    FOREIGN KEY (id_servico) REFERENCES servicos(id)
);
