const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./barbearia.db');

app.get('/usuarios', (req, res) => {
    db.all('SELECT id, nome, email FROM usuarios', [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log('API rodando em http://localhost:3000');
});
