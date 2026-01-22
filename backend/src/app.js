const express = require('express');

const authRoutes = require('./routes/auth.routes.js');
const combustivelRoutes = require('./routes/combustiveis.routes.js');
const vendasRoutes = require('./routes/vendas.routes.js');
const caixaRoutes = require('./routes/caixa.routes.js');


const app = express();
app.use(express.json());

// rota de teste
app.get('/', (req, res) => {
  res.send('Servidor do posto funcionando 🚀');
});

// rotas do sistema
app.use('/auth', authRoutes);
app.use('/combustiveis', combustivelRoutes);
app.use('/vendas', vendasRoutes);
app.use('/caixa', caixaRoutes);

// =========================
// INICIA O SERVIDOR AQUI
// =========================
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
