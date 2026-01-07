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
const bcrypt = require('bcrypt');

app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  db.get(
    'SELECT id, nome, email, senha_hash, tipo_usuario FROM usuarios WHERE email = ? AND ativo = 1',
    [email],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro no servidor' });
      }

      if (!user) {
        return res.status(401).json({ erro: 'Email ou senha inválidos' });
      }

      const senhaValida = await bcrypt.compare(senha, user.senha_hash);

      if (!senhaValida) {
        return res.status(401).json({ erro: 'Email ou senha inválidos' });
      }

      // Nunca retorne o hash da senha
      delete user.senha_hash;

      res.json({
        mensagem: 'Login realizado com sucesso',
        user
      });
    }
  );
});

// subir servidor
app.listen(3000, () => {
    console.log('🚀 Backend rodando em http://localhost:3000');
});


app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  // 1️⃣ Validações básicas
  if (!nome || nome.trim().length < 3) {
    return res.status(400).json({ erro: 'Nome inválido (mínimo 3 caracteres)' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ erro: 'Email inválido' });
  }

  if (!senha || senha.length < 6) {
    return res.status(400).json({ erro: 'Senha deve ter no mínimo 6 caracteres' });
  }

  try {
    // 2️⃣ Verificar se email já existe
    db.get(
      'SELECT id FROM usuarios WHERE email = ?',
      [email],
      async (err, row) => {
        if (err) {
          return res.status(500).json({ erro: 'Erro no servidor' });
        }

        if (row) {
          return res.status(409).json({ erro: 'Email já cadastrado' });
        }

        // 3️⃣ Gerar hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // 4️⃣ Inserir usuário
        db.run(
          `INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, ativo)
           VALUES (?, ?, ?, 'cliente', 1)`,
          [nome.trim(), email.trim(), senhaHash],
          function (err) {
            if (err) {
              return res.status(500).json({ erro: 'Erro ao criar usuário' });
            }

            res.status(201).json({
              mensagem: 'Usuário cadastrado com sucesso',
              id: this.lastID
            });
          }
        );
      }
    );
  } catch (e) {
    res.status(500).json({ erro: 'Erro inesperado' });
  }
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