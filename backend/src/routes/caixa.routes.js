const express = require('express');
const db = require('../database/connection');

const router = express.Router();

/* ===============================
   ABRIR CAIXA
================================ */
router.post('/abrir', (req, res) => {
  const { usuario_id, valor_abertura } = req.body;

  if (!usuario_id || valor_abertura == null) {
    return res.status(400).json({ erro: 'Dados obrigatórios' });
  }

  const verificar = `
    SELECT id FROM caixa
    WHERE usuario_id = ?
      AND data = CURDATE()
      AND status = 'aberto'
  `;

  db.query(verificar, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao verificar caixa' });

    if (rows.length > 0) {
      return res.status(400).json({ erro: 'Caixa já aberto para este usuário' });
    }

    const inserir = `
      INSERT INTO caixa (usuario_id, data, valor_abertura, status)
      VALUES (?, CURDATE(), ?, 'aberto')
    `;

    db.query(inserir, [usuario_id, valor_abertura], err2 => {
      if (err2) {
        return res.status(500).json({ erro: 'Erro ao abrir o caixa' });
      }

      res.json({ mensagem: 'Caixa aberto com sucesso' });
    });
  });
});

/* ===============================
   CAIXA ABERTO DO USUÁRIO
================================ */
router.get('/aberto/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;

  const sql = `
    SELECT * FROM caixa
    WHERE usuario_id = ?
      AND data = CURDATE()
      AND status = 'aberto'
  `;

  db.query(sql, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar caixa' });

    if (rows.length === 0) {
      return res.status(404).json({ erro: 'Nenhum caixa aberto' });
    }

    res.json(rows[0]);
  });
});

/* ===============================
   RELATÓRIO DO CAIXA
================================ */
router.get('/relatorio/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;

  const sql = `
    SELECT 
      c.id AS caixa_id,
      c.valor_abertura,
      c.valor_fechamento,
      IFNULL(SUM(v.valor_total), 0) AS total_vendas
    FROM caixa c
    LEFT JOIN vendas v ON v.usuario_id = c.usuario_id
      AND DATE(v.data_hora) = c.data
    WHERE c.usuario_id = ?
      AND c.data = CURDATE()
    GROUP BY c.id
  `;

  db.query(sql, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro no relatório' });

    res.json(rows[0] || {});
  });
});

/* ===============================
   RELATÓRIO POR FORMA DE PAGAMENTO
================================ */
router.get('/pagamentos/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;

  const sql = `
    SELECT forma_pagamento,
           SUM(valor_total) AS total
    FROM vendas
    WHERE usuario_id = ?
      AND DATE(data_hora) = CURDATE()
    GROUP BY forma_pagamento
  `;

  db.query(sql, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ erro: 'Erro no relatório' });

    res.json(rows);
  });
});

/* ===============================
   FECHAR CAIXA
================================ */
router.post('/fechar', (req, res) => {
  const { usuario_id } = req.body;

  const caixaSql = `
    SELECT id, valor_abertura
    FROM caixa
    WHERE usuario_id = ?
      AND data = CURDATE()
      AND status = 'aberto'
  `;

  db.query(caixaSql, [usuario_id], (err, caixas) => {
    if (err) return res.status(500).json({ erro: 'Erro ao buscar caixa' });

    if (caixas.length === 0) {
      return res.status(400).json({ erro: 'Nenhum caixa aberto' });
    }

    const caixa = caixas[0];

    const vendasSql = `
      SELECT IFNULL(SUM(valor_total), 0) AS total_vendas
      FROM vendas
      WHERE usuario_id = ?
        AND DATE(data_hora) = CURDATE()
    `;

    db.query(vendasSql, [usuario_id], (err2, result) => {
      if (err2) return res.status(500).json({ erro: 'Erro ao calcular vendas' });

      const total_vendas = result[0].total_vendas;
      const valor_fechamento =
        parseFloat(caixa.valor_abertura) + parseFloat(total_vendas);

      const fecharSql = `
        UPDATE caixa
        SET valor_fechamento = ?, status = 'fechado'
        WHERE id = ?
      `;

      db.query(fecharSql, [valor_fechamento, caixa.id], err3 => {
        if (err3) return res.status(500).json({ erro: 'Erro ao fechar caixa' });

        res.json({
          mensagem: 'Caixa fechado com sucesso',
          valor_abertura: caixa.valor_abertura,
          total_vendas,
          valor_fechamento
        });
      });
    });
  });
});

module.exports = router;
