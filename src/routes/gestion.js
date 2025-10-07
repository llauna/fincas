// routes/gestion.js
const express = require('express');
const router = express.Router();
const { verificarToken, autorizarRoles } = require('../middleware/auth');

router.get('/panel', verificarToken, autorizarRoles('Administrador', 'Propietario'), (req, res) => {
    res.json({ message: `Bienvenido al panel, ${req.user.rol}` });
});

module.exports = router;
