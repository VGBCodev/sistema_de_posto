 const express = require('express');
 require('dotenv').config();

 const db = require('./database/connection');
 const authRoutes = require('./routes/auth.routes');

 const app = express();
 app.use(express.json());

// rota de teste
 app.get('/', (req, res) => {
    res.send('Sevidor do posto funcionando 🚀');
 
 });
 // rotas de login
 app.use('/auth', authRoutes);

 app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
 });
 