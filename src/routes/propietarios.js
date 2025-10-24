// routes/propietarios.js
const express = require('express');
const router = express.Router();
const { 
    getPropietarios, 
    createPropietario, 
    updatePropietario, 
    deletePropietario, 
    getPropietarioById, 
    getEmpresas,
    getComunidades 
} = require('../controllers/propietarioController');

// Endpoint para obtener todos los propietarios
router.get('/', getPropietarios);

// Endpoint para crear un nuevo propietario
router.post('/', createPropietario);

// Endpoint para actualizar un propietario
router.put('/:id', updatePropietario);

// Endpoint para eliminar un propietario
router.delete('/:id', deletePropietario);

// Endpoint para obtener un propietario por ID
router.get('/:id', getPropietarioById);

// Endpoint para obtener todas las empresas
router.get('/empresas/todas', getEmpresas);

// Endpoint para obtener todas las comunidades
router.get('/comunidades/todas', getComunidades);

module.exports = router;
