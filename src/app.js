 const express = require('express');
 require('dotenv').config();

 const db = require('./database/connection');

 const app = express();

 app.get('/', (req, res) => {
    res.send('Sevidor do posto funcionando 🚀');

 });

 app.listen(3000, () => {
    console.log('Servidor rodando em https://localhost:3000');
 });