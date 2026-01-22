const express = require('express');
const db = require('../database/connection');

const router = express.Router();

/**
 * REGISTRAR VENDA (ABASTECIMENTO)
 */
router.post('/', (req, res) => {
  const {
    combustivel_id,
    litros,
    forma_pagamento,
    usuario_id
  } = req.body;

  if (!combustivel_id || !litros || !forma_pagamento || !usuario_id) {
    return res.status(400).json({
      erro: 'Dados obrigatórios não informados'
    });
  }

  // 1️⃣ Buscar preço do combustível
  const sqlCombustivel = `
    SELECT preco_litro
    FROM combustiveis
    WHERE id = ? AND ativo = true
  `;

  db.query(sqlCombustivel, [combustivel_id], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar combustível' });
    }

    if (result.length === 0) {
      return res.status(404).json({ erro: 'Combustível não encontrado ou inativo' });
    }

    const preco_litro = result[0].preco_litro;
    const valor_total = litros * preco_litro;

    // 2️⃣ Registrar venda
    const sqlVenda = `
      INSERT INTO vendas
      (combustivel_id, usuario_id, litros, valor_total, forma_pagamento)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sqlVenda,
      [combustivel_id, usuario_id, litros, valor_total, forma_pagamento],
      (err) => {
        if (err) {
          return res.status(500).json({ erro: 'Erro ao registrar venda' });
        }

        res.status(201).json({
          mensagem: 'Venda registrada com sucesso',
          litros,
          preco_litro,
          valor_total
        });
      }
    );
  });
});

/**
 * LISTAR VENDAS
 */
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      v.id,
      c.nome AS combustivel,
      v.litros,
      v.valor_total,
      v.forma_pagamento,
      u.nome AS vendedor,
      v.data_hora
    FROM vendas v
    JOIN combustiveis c ON c.id = v.combustivel_id
    JOIN usuarios u ON u.id = v.usuario_id
    ORDER BY v.data_hora DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao listar vendas' });
    }

    res.json(results);
  });
});

module.exports = router;
