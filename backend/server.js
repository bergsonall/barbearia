const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// conexão com o banco
const db = new sqlite3.Database('./database/barbearia.db', err => {
    if (err) {
        console.error('Erro ao conectar no banco:', err.message);
    } else {
        console.log('Banco SQLite conectado com sucesso');
    }
});

// rota de teste
app.get('/health', (req, res) => {
    res.json({ status: 'Backend rodando' });
});

// rota de login (teste simples)
app.post('/login', (req, res) => {
    const { email } = req.body;

    db.get(
        'SELECT id, nome, email, tipo_usuario FROM usuarios WHERE email = ? AND ativo = 1',
        [email],
        (err, user) => {
            if (err) return res.status(500).json(err);
            if (!user) return res.status(401).json({ erro: 'Usuário não encontrado' });

            res.json({ mensagem: 'Login OK', user });
        }
    );
});

// subir servidor
app.listen(3000, () => {
    console.log('🚀 Backend rodando em http://localhost:3000');
});


app.post('/register', (req, res) => {
  const { nome, email, senha, tipo_usuario } = req.body;

  db.run(
    `INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, ativo)
     VALUES (?, ?, ?, ?, 1)`,
    [nome, email, senha, tipo_usuario],
    function (err) {
      if (err) {
        return res.status(400).json({ erro: 'Email já cadastrado' });
      }
      res.json({ id: this.lastID });
    }
  );
});


app.post('/agendamentos', (req, res) => {
  const {
    id_cliente,
    id_barbeiro,
    id_servico,
    data,
    hora_inicio,
    hora_fim
  } = req.body;

  db.run(
    `INSERT INTO agendamentos
     (id_cliente, id_barbeiro, id_servico, data, hora_inicio, hora_fim, status)
     VALUES (?, ?, ?, ?, ?, ?, 'agendado')`,
    [id_cliente, id_barbeiro, id_servico, data, hora_inicio, hora_fim],
    function (err) {
      if (err) return res.status(500).json({ erro: 'Erro ao agendar' });
      res.json({ id: this.lastID });
    }
  );
});