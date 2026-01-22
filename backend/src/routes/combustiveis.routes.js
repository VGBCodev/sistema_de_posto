const express = require('express');
const db = require('../database/connection');

const router = express.Router();

/**
 * CADASTRAR COMBUSTÍVEL
 */
router.post('/', (req, res) => {
  const { nome, tipo, preco_litro } = req.body;

  if (!nome || !tipo || !preco_litro) {
    return res.status(400).json({ erro: 'Preencha todos os campos' });
  }

  const sql = `
    INSERT INTO combustiveis (nome, tipo, preco_litro)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [nome, tipo, preco_litro], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao cadastrar combustível' });
    }

    res.status(201).json({
      mensagem: 'Combustível cadastrado com sucesso',
      id: result.insertId
    });
  });
});

/**
 * LISTAR COMBUSTÍVEIS
 */
router.get('/', (req, res) => {
  const sql = `
    SELECT id, nome, tipo, preco_litro, ativo
    FROM combustiveis
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao listar combustíveis' });
    }

    res.json(results);
  });
});

/**
 * ATUALIZAR PREÇO
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { preco_litro } = req.body;

  if (!preco_litro) {
    return res.status(400).json({ erro: 'Informe o novo preço' });
  }

  const sql = `
    UPDATE combustiveis
    SET preco_litro = ?
    WHERE id = ?
  `;

  db.query(sql, [preco_litro, id], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao atualizar preço' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: 'Combustível não encontrado' });
    }

    res.json({ mensagem: 'Preço atualizado com sucesso' });
  });
});

/**
 * ATIVAR / DESATIVAR COMBUSTÍVEL
 */
router.patch('/:id/ativo', (req, res) => {
  const { id } = req.params;
  const { ativo } = req.body;

  const sql = `
    UPDATE combustiveis
    SET ativo = ?
    WHERE id = ?
  `;

  db.query(sql, [ativo, id], (err, result) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao alterar status' });
    }

    res.json({ mensagem: 'Status atualizado com sucesso' });
  });
});

module.exports = router;
