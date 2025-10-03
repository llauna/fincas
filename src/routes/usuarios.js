const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario'); // Ajusta la ruta a tu modelo

// POST /usuarios/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // Comparar contraseñas
        const esPasswordValida = await bcrypt.compare(password, usuario.password);
        if (!esPasswordValida) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // Crear token JWT
        const token = jwt.sign(
            { id: usuario._id, tipo: usuario.tipo, rol: usuario.rol },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '8h' }
        );

        // Devolver token y datos del usuario
        res.json({
            token,
            user: {
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                tipo: usuario.tipo, // 'empleado' o 'cliente'
                rol: usuario.rol    // 'admin', 'gestor', 'cliente', etc.
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
