const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../database/connection');

const router = express.Router();

router.post('/login', (req, res)=> {
    const {usuario, senha} = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({erro: 'Usuário e senha são obrigatórios'});
    }

    const sql = 'SELECT * FROM usuarios WHERE usuario = ? AND ativo = true';

    db.query(sql, [usuario], async (err, results) => {
        if(err) {
            return res.status(500).json({ erro: 'Erro no banco de dados'});
        }

        if (results.length === 0) {
            return res.status(401).json({ erro: 'Usúario não encontrado'});
        }

        const user = results[0];

        const senhaValida = await bcrypt.compare(senha, user.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha inválida'});
        
        }
        res.json({
            mensagem: 'Login realizado com sucesso',
            usuario: {
                id: user.id,
                nome: user.nome,
                cargo: user.cargo,
                nivel_acesso: user.nivel_acesso
            }
        })
    })

})

module.exports = router;