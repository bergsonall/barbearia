const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database/barbearia.db');

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    db.get(
        'SELECT * FROM usuarios WHERE email = ? AND ativo = 1',
        [email],
        (err, user) => {
            if (err) return res.status(500).json(err);
            if (!user) return res.status(401).json({ erro: 'Usuário inválido' });

            res.json({ mensagem: 'Login OK', user });
        }
    );
});

app.get('/servicos', (req, res) => {
    db.all('SELECT * FROM servicos WHERE ativo = 1', [], (err, rows) => {
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('API rodando em http://localhost:3000');
});
